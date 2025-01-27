export type FieldType = "text" | "email" | "number" | "date" | "select";

export interface Field {
    name: string;
    label: string;
    type: FieldType;
    required: boolean;
    options?: string[];
}

const fields: Field[] = [
    {
        name: "firstName",
        label: "First Name",
        type: "text",
        required: true
    },
    {
        name: "age",
        label: "Age",
        type: "number",
        required: true
    },
    {
        name: "dob",
        label: "Date of Birth",
        type: "date",
        required: true
    },
    {
        name: "gender",
        label: "Gender",
        type: "select",
        required: true,
        options: ["Male", "Female", "Other"]
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        required: true
    },
];

export default fields;


// Email
// Checkboxes
// Dropdown
// Number
// Single line text
// Choice questions (radio)
// Date
// Date and time fields
// Password
// Text
// Text fields


