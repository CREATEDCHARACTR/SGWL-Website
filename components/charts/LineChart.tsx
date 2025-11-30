import React, { useRef, useEffect, useState } from 'react';

interface LineChartProps {
    data: Array<{ label: string, value: number }>;
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });
        if (svgRef.current) {
            resizeObserver.observe(svgRef.current);
        }
        return () => resizeObserver.disconnect();
    }, []);

    const { width, height } = dimensions;
    if (!width || !height || data.length === 0) return <div ref={svgRef as any} className="w-full h-full" />;

    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxValue = Math.max(...data.map(d => d.value), 0);
    const yMax = maxValue > 0 ? maxValue * 1.1 : 1; // Add 10% padding or set a min height

    const xScale = (index: number) => padding.left + (index / (data.length - 1)) * chartWidth;
    const yScale = (value: number) => padding.top + chartHeight - (value / yMax) * chartHeight;

    const pathData = data.map((point, i) => {
        const x = xScale(i);
        const y = yScale(point.value);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    const yAxisLabels = [];
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
        const value = (yMax / numTicks) * i;
        const y = yScale(value);
        yAxisLabels.push({ value, y });
    }

    return (
        <svg ref={svgRef} width="100%" height="100%">
            {/* Y-Axis Grid Lines and Labels */}
            {yAxisLabels.map(({ value, y }) => (
                <g key={value}>
                    <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="var(--grid-color, #E5E7EB)" strokeDasharray="2,2" />
                    <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="12" fill="var(--text-color, #6B7280)">
                        {`$${(value / 1000).toFixed(0)}k`}
                    </text>
                </g>
            ))}

            {/* X-Axis Labels */}
            {data.map((point, i) => (
                <text key={i} x={xScale(i)} y={height - 10} textAnchor="middle" fontSize="12" fill="var(--text-color, #6B7280)">
                    {point.label}
                </text>
            ))}
            
            {/* Gradient */}
            <defs>
                <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0052cc" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0052cc" stopOpacity={0} />
                </linearGradient>
            </defs>
            <path d={`${pathData} L ${xScale(data.length - 1)} ${yScale(0)} L ${xScale(0)} ${yScale(0)} Z`} fill="url(#line-gradient)" />
            
            {/* Line */}
            <path d={pathData} fill="none" stroke="#0052cc" strokeWidth="2" />

            {/* Points */}
            {data.map((point, i) => (
                <circle key={i} cx={xScale(i)} cy={yScale(point.value)} r="4" fill="#0052cc" />
            ))}
            <style>
                {`
                    :root {
                        --grid-color: #E5E7EB;
                        --text-color: #6B7280;
                    }
                    .dark {
                        --grid-color: #374151;
                        --text-color: #9CA3AF;
                    }
                `}
            </style>
        </svg>
    );
};

export default LineChart;