import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import type { OfficerPerformance } from '../../types';

interface OfficerPerformanceChartProps {
  data: OfficerPerformance[];
}

export function OfficerPerformanceChart({ data }: OfficerPerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card padding="lg">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Officer Performance</h3>
          <p className="text-sm text-gray-600">Customers served by each officer today</p>
        </div>
        
        <div className="h-80 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium">No Officers Available</p>
            <p className="text-sm">No officer data found in the system.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Officer Performance</h3>
        <p className="text-sm text-gray-600">Customers served by each officer today</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Customers', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                value,
                name === 'customersServed' ? 'Customers Served' : name
              ]}
            />
            <Bar
              dataKey="customersServed"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}