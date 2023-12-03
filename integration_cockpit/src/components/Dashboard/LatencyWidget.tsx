import { Card, CardContent, Grid, Stack, Typography } from "@mui/material"
import Metrics from "../../types/metrics"

const LatencyWidget = (metrics: Metrics) => {
    const latencyMetrics = metrics.message_latency
    const messagesPerSecond = latencyMetrics.per_second
    const messagesPerMinute = latencyMetrics.per_minute

    return <Card sx={{
        borderRadius: 12,
        padding: 2,
        height: "100%"
    }} variant='outlined'>
        <CardContent>
            <Stack spacing={1}>
                <Typography variant="h4">Latency</Typography>
                <Grid container direction={"row"} alignItems={"center"} spacing={1} justifyContent={"flex-start"}>
                    <Grid item>
                        <Typography variant="h3">{messagesPerSecond}</Typography>

                    </Grid>
                    <Grid item>
                        <Typography variant="body2">messages per second</Typography>

                    </Grid>
                </Grid>

                <Grid container direction={"row"} alignItems={"center"} spacing={1} justifyContent={"flex-start"}>
                    <Grid item>
                        <Typography variant="h3">{messagesPerMinute}</Typography>

                    </Grid>
                    <Grid item>
                        <Typography variant="body2">messages per minute</Typography>

                    </Grid>
                </Grid>

            </Stack>
        </CardContent>
    </Card>
}

export default LatencyWidget