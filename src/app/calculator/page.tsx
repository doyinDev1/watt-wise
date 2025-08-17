"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import Link from "next/link";
import Navbar from "@/components/MainNavbar";

interface Appliance {
    name: string;
    power: number;
    hours: number;
    quantity: number;
}

interface CalculationResult {
    id: string;
    dailyConsumption: number;
    monthlyConsumption: number;
    recommendedSystemSize: number;
    estimatedCost: number;
    createdAt: string;
    location: string;
    disco: string;
    inputMethod: string;
}

export default function CalculatorPage() {
    const [step, setStep] = useState(1);
    const [location, setLocation] = useState("");
    const [disco, setDisco] = useState("");
    const [inputMethod, setInputMethod] = useState<"meter" | "appliances">("meter");
    const [monthlyBill, setMonthlyBill] = useState("");
    const [selectedAppliances, setSelectedAppliances] = useState<Appliance[]>([]);
    const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [calculationHistory, setCalculationHistory] = useState<CalculationResult[]>([]);
    const { user } = useAuthStore();

    const states = [
        "Abia",
        "Adamawa",
        "Akwa Ibom",
        "Anambra",
        "Bauchi",
        "Bayelsa",
        "Benue",
        "Borno",
        "Cross River",
        "Delta",
        "Ebonyi",
        "Edo",
        "Ekiti",
        "Enugu",
        "Abuja FCT",
        "Gombe",
        "Imo",
        "Jigawa",
        "Kaduna",
        "Kano",
        "Katsina",
        "Kebbi",
        "Kogi",
        "Kwara",
        "Lagos",
        "Nasarawa",
        "Niger",
        "Ogun",
        "Ondo",
        "Osun",
        "Oyo",
        "Plateau",
        "Rivers",
        "Sokoto",
        "Taraba",
        "Yobe",
        "Zamfara",
    ];

    const discos = [
        "Ikeja Electricity Distribution Company (IKEDC)",
        "Ibadan Electricity Distribution Company (IBEDC)",
        "Eko Electricity Distribution Company (EKEDC)",
        "Kano Electricity Distribution Company (KEDCO)",
        "Kaduna Electricity Distribution Company (KAEDCO)",
        "Port Harcourt Electricity Distribution Company (PHEDC)",
        "Enugu Electricity Distribution Company (EEDC)",
        "Jos Electricity Distribution Company (JEDC)",
        "Abuja Electricity Distribution Company (AEDC)",
        "Yola Electricity Distribution Company (YEDC)"
    ];

    const commonAppliances = [
        { name: "Refrigerator", power: 150, hours: 24 },
        { name: "Television", power: 100, hours: 6 },
        { name: "Air Conditioner", power: 1500, hours: 8 },
        { name: "Ceiling Fan", power: 75, hours: 12 },
        { name: "LED Bulbs", power: 15, hours: 8 },
        { name: "Laptop", power: 65, hours: 6 },
        { name: "Phone Charger", power: 10, hours: 4 },
        { name: "Microwave", power: 1100, hours: 1 },
        { name: "Washing Machine", power: 500, hours: 2 },
        { name: "Electric Kettle", power: 1500, hours: 1 }
    ];

    const addAppliance = (appliance: Omit<Appliance, "quantity">) => {
        setSelectedAppliances(prev => [...prev, { ...appliance, quantity: 1 }]);
    };

    const removeAppliance = (index: number) => {
        setSelectedAppliances(prev => prev.filter((_, i) => i !== index));
    };

    const updateApplianceQuantity = (index: number, quantity: number) => {
        setSelectedAppliances(prev =>
            prev.map((app, i) => i === index ? { ...app, quantity } : app)
        );
    };

    const updateApplianceHours = (index: number, hours: number) => {
        setSelectedAppliances(prev =>
            prev.map((app, i) => i === index ? { ...app, hours } : app)
        );
    };

    const fetchCalculationHistory = async () => {
        try {
            const response = await fetch('/api/calculator/history');
            const data = await response.json();

            if (data.success) {
                setCalculationHistory(data.calculations);
            } else {
                toast.error('Failed to fetch calculation history');
            }
        } catch (error) {
            toast.error('Error fetching calculation history');
        }
    };

    const calculateSolarNeeds = async () => {
        if (!user) {
            toast.error('Please login to save your calculations');
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                location,
                disco,
                inputMethod,
                ...(inputMethod === "meter" ? { monthlyBill } : { appliances: selectedAppliances })
            };

            const response = await fetch('/api/calculator/estimate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setCalculationResult(data.calculation);
                setStep(4);
                toast.success('Calculation completed successfully!');
                // Refresh history
                fetchCalculationHistory();
            } else {
                toast.error(data.error || 'Calculation failed');
            }
        } catch (error) {
            toast.error('Error calculating solar needs');
        } finally {
            setIsLoading(false);
        }
    };

    const resetCalculator = () => {
        setStep(1);
        setLocation("");
        setDisco("");
        setInputMethod("meter");
        setMonthlyBill("");
        setSelectedAppliances([]);
        setCalculationResult(null);
        setShowHistory(false);
    };

    useEffect(() => {
        if (showHistory && user) {
            fetchCalculationHistory();
        }
    }, [showHistory, user]);

    return (
    <div className="min-h-screen bg-background mt-16">
        
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Solar Energy Calculator
                    </h1>
                    <p className="text-lg text-gray-600">
                        Calculate your solar energy needs and get personalized recommendations
                    </p>

                    {/* Show History Button */}
                    <div className="text-center mt-8">
                        <Button
                            variant="outline"
                            onClick={() => setShowHistory(!showHistory)}
                            className="mb-4"
                        >
                            {showHistory ? 'Hide History' : 'Show History'}
                        </Button>

                        <div className="mt-4">
                            <Link href="/calculator/history">
                                <Button variant="secondary">
                                    View Full History
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* History Display */}
                    {showHistory && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Recent Calculations</h3>
                            {calculationHistory.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No calculations yet. Complete a calculation to see it here.</p>
                            ) : (
                                <div className="space-y-4">
                                    {calculationHistory.slice(0, 3).map((calc, index) => (
                                        <Card key={calc.id} className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-medium">{calc.location} - {calc.disco}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {calc.inputMethod === 'meter' ? 'Meter Reading' : 'Appliances'} •
                                                        {new Date(calc.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        System: {calc.recommendedSystemSize.toFixed(2)} kW •
                                                        Cost: ₦{calc.estimatedCost.toLocaleString()}
                                                    </p>
                                                </div>
                                                <Badge variant="outline">
                                                    {calc.inputMethod === 'meter' ? 'Meter' : 'Appliances'}
                                                </Badge>
                                            </div>
                                        </Card>
                                    ))}
                                    {calculationHistory.length > 3 && (
                                        <div className="text-center">
                                            <Link href="/calculator/history">
                                                <Button variant="outline" size="sm">
                                                    View All {calculationHistory.length} Calculations
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        {[1, 2, 3, 4].map((stepNumber) => (
                            <div key={stepNumber} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= stepNumber
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-200 text-gray-600"
                                    }`}>
                                    {stepNumber}
                                </div>
                                {stepNumber < 4 && (
                                    <div className={`w-16 h-1 mx-2 ${step > stepNumber ? "bg-green-600" : "bg-gray-200"
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm text-gray-500">
                        {step === 1 && "Location & DisCo Selection"}
                        {step === 2 && "Input Method Selection"}
                        {step === 3 && "Energy Consumption Details"}
                        {step === 4 && "Results & Recommendations"}
                    </div>
                </div>

                {/* Step 1: Location & DisCo Selection */}
                {step === 1 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 1: Select Your Location & Distribution Company</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    State
                                </label>
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select your state</option>
                                    {states.map((state) => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Distribution Company (DisCo)
                                </label>
                                <select
                                    value={disco}
                                    onChange={(e) => setDisco(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                >
                                    <option value="">Select your DisCo</option>
                                    {discos.map((discoName) => (
                                        <option key={discoName} value={discoName}>{discoName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={() => setStep(2)}
                                    disabled={!location || !disco}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Input Method Selection */}
                {step === 2 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 2: Choose Your Input Method</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div
                                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${inputMethod === "meter"
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => setInputMethod("meter")}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">📊</div>
                                        <h3 className="font-semibold text-lg mb-2">Monthly Bill</h3>
                                        <p className="text-sm text-gray-600">
                                            Enter your monthly electricity bill amount
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${inputMethod === "appliances"
                                        ? "border-green-500 bg-green-50"
                                        : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    onClick={() => setInputMethod("appliances")}
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-2">🔌</div>
                                        <h3 className="font-semibold text-lg mb-2">Appliance List</h3>
                                        <p className="text-sm text-gray-600">
                                            Select appliances and their usage patterns
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={() => setStep(3)}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Energy Consumption Details */}
                {step === 3 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Step 3: Energy Consumption Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {inputMethod === "meter" ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Monthly Electricity Bill (₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={monthlyBill}
                                        onChange={(e) => setMonthlyBill(e.target.value)}
                                        placeholder="Enter your monthly bill amount"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        This helps us estimate your energy consumption
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-3">Common Appliances</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {commonAppliances.map((appliance) => (
                                                <Button
                                                    key={appliance.name}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addAppliance(appliance)}
                                                    className="text-xs h-auto py-2 px-3"
                                                >
                                                    {appliance.name}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    <Separator />

                                    <div>
                                        <h4 className="font-medium text-gray-700 mb-3">Selected Appliances</h4>
                                        {selectedAppliances.length === 0 ? (
                                            <p className="text-gray-500 text-sm">No appliances selected yet</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {selectedAppliances.map((appliance, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="font-medium">{appliance.name}</div>
                                                            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                                <span>{appliance.power}W</span>
                                                                <span>×</span>
                                                                <input
                                                                    type="number"
                                                                    min="0.5"
                                                                    max="24"
                                                                    step="0.5"
                                                                    value={appliance.hours}
                                                                    onChange={(e) => updateApplianceHours(index, parseFloat(e.target.value))}
                                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                                                    title="Hours per day"
                                                                />
                                                                <span>h</span>
                                                                <span>×</span>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="10"
                                                                    value={appliance.quantity}
                                                                    onChange={(e) => updateApplianceQuantity(index, parseInt(e.target.value))}
                                                                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                                                                    title="Quantity"
                                                                />
                                                                <span>units</span>
                                                            </div>
                                                            <div className="text-xs text-gray-400 mt-1">
                                                                Daily: {((appliance.power * appliance.hours * appliance.quantity) / 1000).toFixed(2)} kWh
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeAppliance(index)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(2)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    onClick={calculateSolarNeeds}
                                    disabled={
                                        inputMethod === "meter"
                                            ? !monthlyBill
                                            : selectedAppliances.length === 0
                                    }
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {isLoading ? 'Calculating...' : 'Calculate Solar Needs'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 4: Results & Recommendations */}
                {step === 4 && calculationResult && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Solar Energy Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2">Daily Energy Consumption</h4>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {calculationResult.dailyConsumption.toFixed(1)} kWh
                                        </p>
                                    </div>

                                    <div className="p-4 bg-green-50 rounded-lg">
                                        <h4 className="font-semibold text-green-900 mb-2">Monthly Energy Consumption</h4>
                                        <p className="text-2xl font-bold text-green-600">
                                            {calculationResult.monthlyConsumption.toFixed(1)} kWh
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-orange-50 rounded-lg">
                                        <h4 className="font-semibold text-orange-900 mb-2">Recommended System Size</h4>
                                        <p className="text-2xl font-bold text-orange-600">
                                            {calculationResult.recommendedSystemSize.toFixed(1)} kW
                                        </p>
                                    </div>

                                    <div className="p-4 bg-purple-50 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-2">Estimated Cost</h4>
                                        <p className="text-2xl font-bold text-purple-600">
                                            ₦{(calculationResult.estimatedCost / 1000000).toFixed(1)}M
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li>• Consider a {calculationResult.recommendedSystemSize.toFixed(1)}kW solar system</li>
                                    <li>• This should cover your daily energy needs with a 20% buffer</li>
                                    <li>• Contact local solar installers for detailed quotes</li>
                                    <li>• Consider financing options and government incentives</li>
                                </ul>
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(3)}
                                >
                                    Back to Details
                                </Button>
                                <Button
                                    onClick={resetCalculator}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    Start New Calculation
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
        </div>
    );
} 