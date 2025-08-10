import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
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

        // Get user's calculation history
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const calculations = await (db as any).calculation.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                location: true,
                disco: true,
                inputMethod: true,
                monthlyBill: true,
                appliances: true,
                dailyConsumption: true,
                monthlyConsumption: true,
                recommendedSystemSize: true,
                estimatedCost: true,
                createdAt: true
            }
        });

        return NextResponse.json({
            success: true,
            calculations
        });

    } catch (error) {
        console.error("History fetch error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
} 