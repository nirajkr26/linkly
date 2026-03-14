import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

/**
 * Define the structure of a device data point
 */
export interface DeviceDataPoint {
    name: string; // e.g., "Mobile", "Desktop"
    value: number; // e.g., 45
}

interface DeviceBreakdownChartProps {
    data: DeviceDataPoint[];
}

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({ data }) => {
    return (
        <div className="w-full h-[300px] bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 shadow-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((_, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                                stroke="none" 
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            borderColor: '#374151', 
                            borderRadius: '8px' 
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        formatter={(value) => <span className="text-gray-300">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DeviceBreakdownChart;