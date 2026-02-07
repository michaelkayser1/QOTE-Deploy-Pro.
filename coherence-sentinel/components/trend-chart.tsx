'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';
import { TimeSeriesPoint } from '@/lib/types';

interface TrendChartProps {
  data: TimeSeriesPoint[];
  dataKey?: string;
  label: string;
  color?: string;
  yAxisLabel?: string;
  showArea?: boolean;
  height?: number;
}

export function TrendChart({
  data,
  dataKey = 'value',
  label,
  color = 'hsl(142, 76%, 36%)',
  yAxisLabel,
  showArea = false,
  height = 300
}: TrendChartProps) {
  // Transform data for recharts
  const chartData = data.map(point => ({
    date: point.timestamp,
    dateFormatted: format(new Date(point.timestamp), 'MMM d'),
    [dataKey]: point.value
  }));

  const Chart = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <Chart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="dateFormatted"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <YAxis
          label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickLine={{ stroke: 'hsl(var(--border))' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px'
          }}
          labelFormatter={(value) => `Date: ${value}`}
        />
        <Legend />
        <DataComponent
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fill={showArea ? color : undefined}
          fillOpacity={showArea ? 0.2 : undefined}
          strokeWidth={2}
          name={label}
          dot={false}
        />
      </Chart>
    </ResponsiveContainer>
  );
}
