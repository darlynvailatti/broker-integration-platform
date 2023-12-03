interface Metrics {
    total_integrations: number;
    total_messages: number;
    message_latency: {
        per_minute: number,
        per_second: number
    };
    failures: {
        messages: {
            timestamp_minute: string;
            count: number;
        }[];
        totals: number
    };
    transaction_type_totals: {
        transaction_type: string;
        total: number;
    }[];
    messages: {
        timestamp_minute: string;
        count: number;
    }[];
}

export default Metrics;