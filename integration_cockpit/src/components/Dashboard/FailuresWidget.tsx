import { Card, CardContent, Stack, Typography } from "@mui/material"
import Metrics from "../../types/metrics"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const FailuresWidget = (metrics: Metrics) => {
    const failures = metrics.failures

    return <Card sx={{
        borderRadius: 12,
        padding: 2,
        height: "100%"
    }}
        variant='outlined'>
        <CardContent>
            <Stack>
                <Typography variant="h6">Failures</Typography>
                <Typography variant="h6">{failures.totals}</Typography>
            </Stack>

            <div style={{ width: '100%', height: 100 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        title='Failed messages'
                        data={metrics.failures.messages}
                    >

                        <XAxis dataKey="timestamp_minute" hide/>
                        <YAxis hide/>
                        {/* <Tooltip /> */}
                        <Area 
                            type="monotone" 
                            dataKey="count" 
                            stackId="1" 
                            stroke="#808080" 
                            fill="#808080" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </CardContent>
    </Card>
}

export default FailuresWidget