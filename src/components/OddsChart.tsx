import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const initialData = [
  { time: '00:00', yes: 45, no: 55 },
  { time: '04:00', yes: 48, no: 52 },
  { time: '08:00', yes: 52, no: 48 },
  { time: '12:00', yes: 60, no: 40 },
  { time: '16:00', yes: 58, no: 42 },
  { time: '20:00', yes: 65, no: 35 },
  { time: '24:00', yes: 72, no: 28 },
];

export const OddsChart: React.FC = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Simulate live indexer websocket updates every 2.5 seconds
    const interval = setInterval(() => {
      setData(currentData => {
        const last = currentData[currentData.length - 1];
        const change = Math.floor(Math.random() * 5) - 2;

        let newYes = last.yes + change;
        if (newYes > 99) newYes = 99;
        if (newYes < 1) newYes = 1;
        const newNo = 100 - newYes;

        const [hours, minutes] = last.time.split(':').map(Number);
        const nextHour = (hours + 1) % 24;
        const newTime = `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        return [...currentData.slice(1), { time: newTime, yes: newYes, no: newNo }];
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[300px] w-full bg-brand-card border border-brand-border p-4 relative">
      <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
        <div className="w-1.5 h-1.5 rounded-full bg-brand-yes shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse" />
        <span className="text-[8px] font-black uppercase text-brand-yes tracking-widest">Live Indexer Socket</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorYes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorNo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
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
