import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { time: '00:00', yes: 45, no: 55 },
  { time: '04:00', yes: 48, no: 52 },
  { time: '08:00', yes: 52, no: 48 },
  { time: '12:00', yes: 60, no: 40 },
  { time: '16:00', yes: 58, no: 42 },
  { time: '20:00', yes: 65, no: 35 },
  { time: '24:00', yes: 72, no: 28 },
];

export const OddsChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full bg-brand-card border border-brand-border p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#737373" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fontWeight: 'bold', fontFamily: 'JetBrains Mono' }}
          />
          <YAxis 
            stroke="#737373" 
            fontSize={9} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `${val}%`}
            tick={{ fontWeight: 'bold', fontFamily: 'JetBrains Mono' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#0a0a0a', 
              border: '1px solid #262626', 
              borderRadius: '0px',
              fontSize: '10px',
              fontFamily: 'JetBrains Mono',
              fontWeight: 'bold'
            }}
            itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
          />
          <Area 
            type="stepAfter" 
            dataKey="yes" 
            stroke="#22c55e" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorYes)" 
            animationDuration={1000}
          />
          <Area 
            type="stepAfter" 
            dataKey="no" 
            stroke="#ef4444" 
            strokeWidth={1}
            strokeDasharray="4 4"
            fillOpacity={1} 
            fill="url(#colorNo)" 
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
