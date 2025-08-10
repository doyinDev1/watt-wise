'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, MapPin, Zap, DollarSign, Clock, Package } from 'lucide-react';
import Link from 'next/link';

interface Appliance {
    name: string;
    power: number;
    hours: number;
    quantity: number;
}

interface Calculation {
    id: string;
    location: string;
    disco: string;
    inputMethod: string;
    monthlyBill?: string;
    appliances?: Appliance[];
    dailyConsumption: number;
    monthlyConsumption: number;
    recommendedSystemSize: number;
    estimatedCost: number;
    createdAt: string;
}

export default function CalculatorHistoryPage() {
    const { user } = useAuthStore();
    const [calculations, setCalculations] = useState<Calculation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            fetchCalculationHistory();
        }
    }, [user]);

    const fetchCalculationHistory = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/calculator/history');
            const data = await response.json();

            if (data.success) {
                setCalculations(data.calculations);
            } else {
                setError(data.error || 'Failed to fetch history');
            }
        } catch (error) {
            setError('Failed to fetch calculation history');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
                    <p className="text-gray-600 mb-4">Please log in to view your calculation history.</p>
                    <Link href="/auth/login">
                        <Button>Login</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p>Loading your calculation history...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={fetchCalculationHistory}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link href="/calculator" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-2">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Calculator
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">Calculation History</h1>
                        <p className="text-gray-600">View all your solar energy calculations and estimates</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Total Calculations</p>
                        <p className="text-2xl font-bold text-green-600">{calculations.length}</p>
                    </div>
                </div>

                {calculations.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No calculations yet</h3>
                            <p className="text-gray-500 mb-6">Start by calculating your solar energy needs</p>
                            <Link href="/calculator">
                                <Button>Calculate Now</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {calculations.map((calculation, index) => (
                            <Card key={calculation.id} className="overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    Calculation #{calculations.length - index}
                                                </CardTitle>
                                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar className="w-4 h-4 mr-1" />
                                                        {formatDate(calculation.createdAt)}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {calculation.location}
                                                    </div>
                                                    <Badge variant="secondary">
                                                        {calculation.disco}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Input Method</p>
                                            <Badge variant={calculation.inputMethod === 'meter' ? 'default' : 'outline'}>
                                                {calculation.inputMethod === 'meter' ? 'Meter Reading' : 'Appliances'}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Zap className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <p className="text-sm text-gray-600">Daily Usage</p>
                                            <p className="text-xl font-bold text-blue-600">
                                                {calculation.dailyConsumption.toFixed(2)} kWh
                                            </p>
                                        </div>

                                        <div className="text-center p-4 bg-green-50 rounded-lg">
                                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Package className="w-6 h-6 text-green-600" />
                                            </div>
                                            <p className="text-sm text-gray-600">System Size</p>
                                            <p className="text-xl font-bold text-green-600">
                                                {calculation.recommendedSystemSize.toFixed(2)} kW
                                            </p>
                                        </div>

                                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                                            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <DollarSign className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <p className="text-sm text-gray-600">Estimated Cost</p>
                                            <p className="text-xl font-bold text-purple-600">
                                                {formatCurrency(calculation.estimatedCost)}
                                            </p>
                                        </div>

                                        <div className="text-center p-4 bg-orange-50 rounded-lg">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                <Clock className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <p className="text-sm text-gray-600">Monthly Usage</p>
                                            <p className="text-xl font-bold text-orange-600">
                                                {calculation.monthlyConsumption.toFixed(2)} kWh
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="my-6" />

                                    {/* Input Details */}
                                    <div className="space-y-4">
                                        <h4 className="font-semibold text-gray-900">Input Details</h4>

                                        {calculation.inputMethod === 'meter' ? (
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <Zap className="w-4 h-4 text-gray-600" />
                                                    <span className="font-medium">Monthly Bill</span>
                                                </div>
                                                <p className="text-lg font-semibold text-gray-900">
                                                    ₦{calculation.monthlyBill}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <h5 className="font-medium text-gray-700">Registered Appliances</h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {calculation.appliances && Array.isArray(calculation.appliances) &&
                                                        calculation.appliances.map((appliance: Appliance, idx: number) => (
                                                            <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="font-medium text-gray-900">
                                                                        {appliance.name}
                                                                    </span>
                                                                    <Badge variant="outline">
                                                                        {appliance.power}W
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                                    <span>Usage: {appliance.hours}h/day</span>
                                                                    <span>Units: {appliance.quantity}</span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Daily: {((appliance.power * appliance.hours * appliance.quantity) / 1000).toFixed(2)} kWh
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 