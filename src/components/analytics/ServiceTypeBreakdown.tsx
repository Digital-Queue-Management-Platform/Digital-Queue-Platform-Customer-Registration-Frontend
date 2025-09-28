import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Card } from '../ui/Card';

interface ServiceTypeBreakdownProps {
  data: { type: string; count: number }[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function ServiceTypeBreakdown({ data }: ServiceTypeBreakdownProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.count / total) * 100).toFixed(1),
  }));

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Service Type Breakdown</h3>
        <p className="text-sm text-gray-600">Distribution of service requests today</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercentage}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ type, percentage }) => `${type} (${percentage}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {dataWithPercentage.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [value, 'Requests']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}