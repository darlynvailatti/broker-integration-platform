import { Drawer } from "@mui/material";
import { format, parseISO } from "date-fns";
import React from "react";
import { Datagrid, FunctionField, Identifier, List, RaRecord, useListContext } from "react-admin";
import { Filter, TextInput } from 'react-admin';
import MessageDetails from "./MessageDetails";
import { ArrowCircleRight } from "@mui/icons-material";
import MessageStatusChip from "./MessageStatusChip";

const MessageFilter = (props: any) => (
    <Filter {...props}>
        <TextInput label="Transaction-Type" source="transaction_type" alwaysOn />
        <TextInput label="Partner" source="partner_name" alwaysOn />
        <TextInput label="Integration" source="integration_name" alwaysOn />
        <TextInput label="Status" source="status" alwaysOn />
        {/* Add more fields as needed */}
    </Filter>
)


const MessageList = (props: any) => {

    const [showDrawer, setShowDrawer] = React.useState(false);
    const [selectedForDetails, setSelectedForDetails] = React.useState<string>();
    const { isLoading: isLoadingList, isFetching: isFetchingList } = useListContext();

    const handleRowClick = (id: Identifier,
        resource: string,
        record: RaRecord) => {

        if (record) {
            setSelectedForDetails(record.id.toLocaleString());
            setShowDrawer(true);
        }
        return ""
    };

    return <>
        <List {...props} filters={<MessageFilter/>}>

            {isLoadingList || isFetchingList ? <div>Loading...</div> : <Datagrid rowClick={handleRowClick}>
                <FunctionField source="Id" render={(record: any) => {
                    return String(record.id).substring(0, 8);
                }} />
                <FunctionField source="Source" render={(record: any) => {
                    return record.source;
                }} />
                <FunctionField source="" render={(record: any) => {
                    return <ArrowCircleRight fontSize="medium"/>;
                }} />
                <FunctionField source="Target" render={(record: any) => {
                    return record.target;
                }} />
                <FunctionField source="Transaction" render={(record: any) => {
                    return record.transaction_type;
                }} />
                <FunctionField source="Integration" render={(record: any) => {
                    return record.integration_name;
                }} />
                <FunctionField source="Created At" render={(record: any) => {
                    const rawDate = record.headers['created_at'];
                    if(!rawDate){
                        return
                    }
                    const date = parseISO(rawDate);
                    return format(date, 'dd/MM/yyyy HH:mm:ss')
                }} />
                <FunctionField source="Updated At" render={(record: any) => {
                    const rawDate = record.headers['updated_at'];
                    if(!rawDate){
                        return
                    }
                    const date = parseISO(rawDate);
                    return format(date, 'dd/MM/yyyy HH:mm:ss')
                }} />
                <FunctionField source="Status" render={(record: any) => {
                    return <MessageStatusChip status={record.headers['Status']}/>
                }} />
            </Datagrid>}



        </List>
        <Drawer anchor="right" open={showDrawer} onClose={() => setShowDrawer(false)}
            PaperProps={{
                sx: {
                    width: "50%",
                }
            }}>
            {selectedForDetails ? <MessageDetails id={selectedForDetails}/> : null}

        </Drawer>
    </>
}

export default MessageList