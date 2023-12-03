import { Card, CardContent, Stack, Typography } from "@mui/material";
import Metrics from "../../types/metrics";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ['#808080', '#A9A9A9', '#C0C0C0', '#D3D3D3'];

export default function TransactionTypeWidget(metrics: Metrics) {

    return <Card sx={{
        borderRadius: 12,
        padding: 2,
        height: "100%"
    }}
        variant='outlined'>
        <CardContent>
            <Stack spacing={4}>

                <Typography variant="h6" component="div" gutterBottom>
                    Transaction Types
                </Typography>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">

                        <PieChart>
                            <Pie
                                data={metrics.transaction_type_totals}
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="total"
                                nameKey={"transaction_type"}
                            >
                                {
                                    metrics.transaction_type_totals.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]} // provide a fill color
                                        />
                                    ))
                                }
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Stack>
        </CardContent>
    </Card>

}