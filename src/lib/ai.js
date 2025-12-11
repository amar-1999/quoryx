// Mock AI Service

export const generateInsight = async (context) => {
    // Legacy general insight
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                summary: "Revenue has increased by 12% compared to last week, driven primarily by the 'Enterprise' plan upsells.",
                actionItems: [
                    "Investigate drop in mobile checkout conversion.",
                    "Double down on enterprise marketing channels."
                ]
            });
        }, 2000);
    });
};

export const generateWidgetInsight = async (widgetType, config, dataContext) => {
    // Simulate complex prompt engineering + API latency
    console.log(`[AI Prompt] Generating insight for ${widgetType} (${config.title})`, dataContext);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                summary: "The data shows a consistent upward trend of 15% over the last period, with significant stability on weekends.",
                observations: [
                    "Spike detected on Tuesday (likely due to seasonal campaign).",
                    "Lower volume on weekends compared to weekdays.",
                    "Anomalous drop on Friday evening (check server logs)."
                ],
                recommendations: [
                    "Capitalize on Tuesday's traffic by increasing ad spend.",
                    "Investigate Friday's drop to prevent user churn.",
                    "Optimize resource allocation for weekday peaks."
                ],
                confidence: 0.92
            });
        }, 1500);
    });
};

export const startMockStream = (onChunk, onComplete) => {
    // ... legacy stream support if needed, or remove
    const text = `Analyzing data... done.`;
    onChunk(text);
    onComplete();
    return () => { };
};
