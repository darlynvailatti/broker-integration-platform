import { Editor } from "@monaco-editor/react";
import { InputLabel, Stack } from "@mui/material";
import { Create, CreateProps, Edit, FunctionField, ReferenceInput, SelectInput, SimpleForm, TextInput, useInput } from "react-admin";

export interface Field {
    name: string;
    multiline?: boolean;
    type?: string
}

export interface ReferenceField extends Field {
    reference: string;
    referenceFieldToRender: string;
}

export interface GenericFormProps extends CreateProps {
    fields: Field[];
    referencedFields?: ReferenceField[];
}


const JsonField = (props: any) => {
    const {
        field: { onChange }
    } = useInput(props);

    return <FunctionField {...props} render={(record: any) =>
        <Stack>
            <InputLabel shrink >{props.source}</InputLabel>
            <Editor
                language="json"
                height="50vh"
                width="50vw"
                value={JSON.stringify(record[props.source], null, 2)}
                onChange={(value) => {
                    let parsed = null
                    try {
                        if (value) {
                            parsed = JSON.parse(value)
                            onChange(parsed)
                        }

                    } catch (error) {
                        console.log(error)
                    }
                }}

            />
        </Stack>
    } />
};

export const GenericCreateForm = (props: GenericFormProps) => {
    const { fields, ...createProps } = props;
    return <Create {...createProps}>
        <SimpleForm>

            {fields.map((field, index) => {
                switch (field.type) {
                    case "json":
                        return <JsonField source={field.name} record={props.record} />
                    default:
                        return <TextInput key={index} source={field.name} multiline={field.multiline} />
                }
            })}

            {props.referencedFields && props.referencedFields.map((field, index) => {
                return <ReferenceInput key={index} source={field.name} reference={field.reference}>
                    <SelectInput optionText={field.referenceFieldToRender} />
                </ReferenceInput>
            })}

        </SimpleForm>
    </Create>
}

export const GenericEditForm = (props: GenericFormProps) => {
    const { fields, ...createProps } = props;
    return (
        <Edit {...createProps}>
            <SimpleForm>
                <TextInput source="id" disabled sx={{
                    width: "100%",
                }} />
                {fields.map((field, index) => {
                    switch (field.type) {
                        case "json":
                            return <JsonField source={field.name} record={props.record} />
                        default:
                            return <TextInput key={index} source={field.name} multiline={field.multiline} />
                    }
                })}

                {props.referencedFields && props.referencedFields.map((field, index) => {
                    return <ReferenceInput key={index} source={field.name} reference={field.reference}>
                        <SelectInput optionText={field.referenceFieldToRender} />
                    </ReferenceInput>
                })}
            </SimpleForm>
        </Edit>
    );
}