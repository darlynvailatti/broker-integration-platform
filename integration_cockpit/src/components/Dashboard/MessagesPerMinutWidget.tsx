import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Metrics from "../../types/metrics"
import { Card, CardContent, Stack, Typography } from '@mui/material';

const MessagesPerMinuteWidget = (metrics: Metrics) => {

  return (
    <Card sx={{
      borderRadius: 12,
      padding: 2,
      height: "100%"
    }}
      variant='outlined'>
      <CardContent>
        <Stack spacing={4}> 

          <Typography variant="h5" component="div" gutterBottom>
            Count Messages per minute
          </Typography>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                title='Messages per minute'
                data={metrics.messages}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp_minute" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stackId="1" stroke="#808080" fill="#808080" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default MessagesPerMinuteWidget;