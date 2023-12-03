import { Card, CardContent, Grid, Stack, Typography } from "@mui/material"
import Metrics from "../../types/metrics"

const TotalIntegrationsWidget = (metrics: Metrics) => {
    const totalIntegrations = metrics.total_integrations
    const totalMessages = metrics.total_messages
    return <Card sx={{
        borderRadius: 12,
        padding: 2,
        backgroundColor: '#F5F5F5',
        height: "100%"
    }}
        variant='outlined'>
        <CardContent>
            <Stack spacing={1}>
                <Typography variant="h4">Totals</Typography>
                <Grid container direction={"row"} alignItems={"center"} spacing={1} justifyContent={"flex-start"}>
                    <Grid item>
                        <Typography variant="h3">{totalIntegrations}</Typography>

                    </Grid>
                    <Grid item>
                        <Typography variant="body2">integrations</Typography>

                    </Grid>
                </Grid>

                <Grid container direction={"row"} alignItems={"center"} spacing={1} justifyContent={"flex-start"}>
                    <Grid item>
                        <Typography variant="h3">{totalMessages}</Typography>

                    </Grid>
                    <Grid item>
                        <Typography variant="body2">messages</Typography>

                    </Grid>
                </Grid>

            </Stack>

        </CardContent>
    </Card>
}

export default TotalIntegrationsWidget