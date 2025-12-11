// Mock API Service
import { generateInsight, startMockStream, generateWidgetInsight } from './ai';

// Helper to determine data characteristics based on text context
const analyzeContext = (text = '') => {
    const t = text.toLowerCase();
    if (t.includes('revenue') || t.includes('sales') || t.includes('income') || t.includes('$')) return { type: 'currency', max: 50000, min: 1000 };
    if (t.includes('rate') || t.includes('conversion') || t.includes('%') || t.includes('efficiency')) return { type: 'percent', max: 100, min: 10 };
    if (t.includes('latency') || t.includes('time') || t.includes('speed')) return { type: 'time', max: 500, min: 50 };
    if (t.includes('error') || t.includes('fail') || t.includes('issue')) return { type: 'files', max: 50, min: 0 };
    return { type: 'number', max: 10000, min: 100 }; // Default: Users/Visits
};

// Smart Generators
export const generateTimeSeriesData = (config, days = 30) => {
    if (config.staticData && Array.isArray(config.staticData)) {
        const rows = config.staticData;
        if (rows.length < 2) return [];

        const labelIdx = config.mapping?.label ?? 0;
        const valIdx = config.mapping?.value ?? 1;

        return rows.slice(1).map((row, i) => ({
            date: row[labelIdx] ? String(row[labelIdx]) : `Row ${i}`,
            value1: Number(row[valIdx]) || 0,
            value2: 0 // Optional: Could add 2nd value mapping later
        }));
    }

    // Fallback logic...
    const context = analyzeContext((config.title || '') + ' ' + (config.metric || '') + ' ' + (config.description || ''));
    return Array.from({ length: days }, (_, i) => {
        const base = Math.random() * (context.max - context.min) + context.min;
        return {
            date: `Day ${i + 1}`,
            value1: Math.floor(base),
            value2: Math.floor(base * 0.8),
        };
    });
};

export const generateKPIData = (config) => {
    if (config.staticData && Array.isArray(config.staticData)) {
        const rows = config.staticData;
        const valIdx = config.mapping?.value ?? 1;

        // Extract just the targeted column
        const flatValues = rows.slice(1).map(r => parseFloat(r[valIdx])).filter(n => !isNaN(n));

        if (flatValues.length > 0) {
            const value = flatValues[flatValues.length - 1]; // Last number found
            return {
                value,
                trend: "+0%",
                formatted: value.toLocaleString(),
                isPositive: true,
                history: []
            };
        }
    }

    // Fallback logic...
    const context = analyzeContext((config.title || '') + ' ' + (config.metric || '') + ' ' + (config.description || ''));
    const value = Math.floor(Math.random() * (context.max - context.min) + context.min);
    return {
        value,
        trend: "+5%",
        formatted: value.toLocaleString(),
        isPositive: true,
        history: Array.from({ length: 20 }, () => ({ value: Math.floor(Math.random() * 1000) }))
    };
};

export const generatePieData = (config) => {
    if (config.staticData && Array.isArray(config.staticData)) {
        const rows = config.staticData;
        const labelIdx = config.mapping?.label ?? 0;
        const valIdx = config.mapping?.value ?? 1;

        return rows.slice(1).map((row, i) => ({
            name: row[labelIdx] ? String(row[labelIdx]) : `Item ${i}`,
            value: Number(row[valIdx]) || 0
        })).filter(d => d.value > 0);
    }

    return [];
};

export const generateTopNData = (config) => {
    if (config.staticData && Array.isArray(config.staticData)) {
        const rows = config.staticData;
        const labelIdx = config.mapping?.label ?? 0;
        const valIdx = config.mapping?.value ?? 1;

        return rows.slice(1).map((row, i) => ({
            name: row[labelIdx] ? String(row[labelIdx]) : `Item ${i}`,
            value: Number(row[valIdx]) || 0,
            trend: "0%"
        })).sort((a, b) => b.value - a.value).slice(0, 5);
    }

    return [];
};


// API Methods
export const api = {
    widgets: {
        getData: async (widgetId, config) => {
            // Simulate network delay
            await new Promise(r => setTimeout(r, 300));

            switch (config.type || config.widgetType) { // support both naming conventions if mixed
                case 'KPI': return generateKPIData(config);
                case 'TIMESERIES': return generateTimeSeriesData(config);
                case 'PIE': return generatePieData(config);
                case 'TOPN': return generateTopNData(config);
                default: return null;
            }
        }
    },
    ai: {
        getInsight: generateInsight,
        streamInsight: startMockStream,
        getWidgetInsight: generateWidgetInsight
    }
};
