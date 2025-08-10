import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { db } from "@/lib/db";

interface Appliance {
    name: string;
    power: number;
    hours: number;
    quantity: number;
}

interface CalculationRequest {
    location: string;
    disco: string;
    inputMethod: "meter" | "appliances";
    monthlyBill?: string;
    appliances?: Appliance[];
}

export async function POST(request: NextRequest) {
    try {
        // Get user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { success: false, error: "Authentication required" },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await db.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 }
            );
        }

        // Parse request body
        const body: CalculationRequest = await request.json();
        const { location, disco, inputMethod, monthlyBill, appliances } = body;

        // Validate required fields
        if (!location || !disco || !inputMethod) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Calculate solar needs
        let dailyConsumption = 0;

        if (inputMethod === "meter") {
            if (!monthlyBill) {
                return NextResponse.json(
                    { success: false, error: "Monthly bill required for meter input method" },
                    { status: 400 }
                );
            }
            // Estimate from monthly bill (assuming average rate of ₦50/kWh)
            dailyConsumption = (parseFloat(monthlyBill) / 50) / 30;
        } else {
            if (!appliances || appliances.length === 0) {
                return NextResponse.json(
                    { success: false, error: "Appliances required for appliance input method" },
                    { status: 400 }
                );
            }
            // Calculate from appliances
            dailyConsumption = appliances.reduce((total, app) => {
                return total + (app.power * app.hours * app.quantity) / 1000;
            }, 0);
        }

        const monthlyConsumption = dailyConsumption * 30;
        const recommendedSystemSize = dailyConsumption * 1.2; // 20% buffer
        const estimatedCost = recommendedSystemSize * 1000000; // Rough estimate: ₦1M per kW

        // Save calculation to database
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calculation = await (db as any).calculation.create({
            data: {
                userId: user.id,
                location,
                disco,
                inputMethod,
                monthlyBill: monthlyBill || null,
                appliances: appliances || null,
                dailyConsumption,
                monthlyConsumption,
                recommendedSystemSize,
                estimatedCost
            }
        });

        return NextResponse.json({
            success: true,
            calculation: {
                id: calculation.id,
                dailyConsumption,
                monthlyConsumption,
                recommendedSystemSize,
                estimatedCost,
                createdAt: calculation.createdAt
            }
        });

    } catch (error) {
        console.error("Calculation error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
} 