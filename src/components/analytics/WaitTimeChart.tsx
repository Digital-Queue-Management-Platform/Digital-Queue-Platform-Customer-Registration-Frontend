import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '../ui/Card';
import type { WaitTimeData } from '../../types';

interface WaitTimeChartProps {
  data: WaitTimeData[];
}

export function WaitTimeChart({ data }: WaitTimeChartProps) {
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <Card padding="lg">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Wait Time Trends</h3>
        <p className="text-sm text-gray-600">Average wait times throughout the day</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="#6b7280"
            />
            <YAxis 
              label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
            />
            <Tooltip
              labelFormatter={(value) => `Time: ${formatTime(value as string)}`}
              formatter={(value: number) => [`${value} min`, 'Wait Time']}
            />
            <Line
              type="monotone"
              dataKey="waitTime"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: '#3b82f6' }}
              activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}