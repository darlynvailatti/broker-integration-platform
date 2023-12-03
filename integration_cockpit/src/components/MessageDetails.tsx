import { Editor } from "@monaco-editor/react";
import { ArrowCircleRight, Info, Warning } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Chip, Divider, Grid, List, ListItem, Tab, Tabs, TextField, Typography } from "@mui/material";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { LinearProgress, useGetOne } from "react-admin";
import MessageStatusChip from "./MessageStatusChip";

export interface MessageDetailsProps {
    id: string;
}

export default function MessageDetails(props: MessageDetailsProps) {

    const [value, setValue] = useState(0);
    const { data, isLoading: isLoadingDetails, isFetching: isFetchingDetails } = useGetOne('messages', { id: props?.id }, {
        enabled: !!props?.id,
    });

    const handleChange = (event: any, newValue: number) => {
        setValue(newValue);
    };

    return <>
        {isLoadingDetails || isFetchingDetails || !data ?
            <LinearProgress /> :
            <Box>
                <Box sx={{ padding: 2 }}>
                    <Grid direction={"row"} container justifyContent={"space-between"} alignItems={"center"}>
                        <Grid item>
                            <Typography variant="h5" gutterBottom>
                                Message Details
                            </Typography>
                        </Grid>
                        <Grid item>
                            <MessageStatusChip status={data.headers['Status']}/>
                        </Grid>
                    </Grid>

                </Box>
                <Divider />
                <Box sx={{ padding: 2 }}>

                    <Grid container direction={"row"} justifyContent={"space-between"} spacing={2}>
                        <Grid item xs={3}>
                            <TextField
                                label="ID"
                                value={data.id}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                label="Transaction-Type"
                                value={data.transaction_type}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                    </Grid>

                    <Grid
                        container direction={"row"}
                        justifyContent={"space-between"}
                        alignContent={"center"}
                        alignItems={"center"}
                        spacing={2}>
                        <Grid item xs>
                            <TextField
                                label="Source"
                                value={data.source}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={1}>
                            <ArrowCircleRight style={{ fontSize: 50 }} />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                label="Target"
                                value={data.target}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>

                    </Grid>

                    <Grid
                        container direction={"row"}
                        justifyContent={"space-between"}
                        alignContent={"center"}
                        alignItems={"center"}
                        spacing={2}>
                        <Grid item xs>
                            <TextField
                                label="Created At."
                                value={data.headers['created_at']}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs>
                            <TextField
                                label="Updated at."
                                value={data.headers['updated_at']}
                                margin="normal"
                                fullWidth
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Tabs value={value} onChange={handleChange}>
                        <Tab label="Headers" />
                        <Tab label="Logs" />
                        <Tab label="Body History" />
                        <Tab label="Failures" />
                    </Tabs>

                    <Card sx={{ padding: 2 }}>
                        {value === 0 && <pre>{JSON.stringify(data.headers, null, 2)}</pre>}
                        {value === 1 && (<List>
                            {data.logs.map((log: any) => {
                                const icon = log.severity === "info" ? <Info fontSize="large" /> : <Warning fontSize="large" />
                                const formattedTimestamp = format(parseISO(log.timestamp), 'dd/MM/yy HH:mm:ss')
                                return <>
                                    <ListItem>
                                        <Grid container direction={"row"} alignItems={"center"} spacing={1} justifyContent={"flex-start"}>
                                            <Grid item xs={1}>
                                                {icon}
                                            </Grid>
                                            <Grid item xs>
                                                <Chip label={formattedTimestamp} />
                                                <pre>{log.message}</pre>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider></Divider>
                                </>
                            })}
                        </List>)}
                        {value === 2 && data.body_history.map((body: any) => {
                            const formattedTimestamp = format(parseISO(body.created_at), 'dd/MM/yy HH:mm:ss')
                            const languageMappings: any = {
                                "application/json": "json",
                                "application/xml": "xml",
                            }
                            return <Accordion >
                                <AccordionSummary>
                                    <Chip label={formattedTimestamp}/>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Editor 
                                        height="30vh"
                                        language={languageMappings[body.content_type]}
                                        value={body.body}/>
                                </AccordionDetails>
                            </Accordion>
                        })}

                        {value === 3 && <pre>{JSON.stringify(data.failures, null, 2)}</pre>}

                    </Card>
                </Box>
            </Box>
        }

    </>
}