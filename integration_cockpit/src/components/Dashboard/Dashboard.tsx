import { Grid, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import LatencyWidget from './LatencyWidget';
import FailuresWidget from './FailuresWidget';
import TotalIntegrationsWidget from './TotalIntegrationsWidget';
import MessagesPerMinuteWidget from './MessagesPerMinutWidget';
import httpClient from '../../common/httpClient';
import TransactionTypeWidget from './TransactionTypeWidget';
import { useRefresh } from 'react-admin';


const Dashboard = () => {

    const [metrics, setMetrics] = useState<any>()
    const refresh = useRefresh()

    const fetchMetrics = () => {
        async function getMetrics() {
            const response = await httpClient('http://localhost:8000/api/metrics/')
            setMetrics(response.json)
        }
        getMetrics()
    }

    useEffect(() => {
        fetchMetrics()
        const intervalId = setInterval(fetchMetrics, 3000); // Store interval ID to clear later
        return () => {
            clearInterval(intervalId); // Clear interval on component unmount
        };
    }, [refresh])


    return (
        <Grid sx={{ padding: 1 }}>
            {!metrics ? <div>Loading...</div> : <Stack padding={1}>
                <Grid container direction="row">
                    <Grid item xs={3} padding={2} sx={{ minHeight: 300 }}>
                        <TotalIntegrationsWidget {...metrics} />
                    </Grid>
                    <Grid item xs={3} padding={2}>
                        <LatencyWidget {...metrics} />
                    </Grid>
                    <Grid item xs={3} padding={2}>
                        <FailuresWidget {...metrics} />
                    </Grid>

                </Grid>
                <Grid container direction="row">
                    <Grid item xs padding={2}>
                        <MessagesPerMinuteWidget {...metrics} />
                    </Grid>
                    <Grid item xs={3} padding={2}>
                        <TransactionTypeWidget {...metrics} />
                    </Grid>
                </Grid>
            </Stack>}
        </Grid>
    );
};

export default Dashboard