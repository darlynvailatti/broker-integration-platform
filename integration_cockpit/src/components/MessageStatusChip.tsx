import { Chip } from "@mui/material";

export interface MessageStatusChipProps {
    status: string;
}

export default function MessageStatusChip(props: MessageStatusChipProps) {
    const { status } = props;
    switch (status) {
        case "pending":
            return <Chip label={status.toUpperCase()} color="primary" />
        case "failed":
            return <Chip label={status.toUpperCase()} color="error"/>
        case "delivered":
            return <Chip label={status.toUpperCase()} color="success" />
        default:
            return <Chip label={status.toUpperCase()} />
    }
}