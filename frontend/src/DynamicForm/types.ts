export interface FormField {
    id: string;
    label: string;
    type: 'text' | 'email' | 'phone' | 'dropdown' | 'textarea' | 'name';
    required?: boolean;
    nameType?: 'fullName' | 'firstName' | 'lastName'; // Only applicable for 'name' type fields
    options?: string[]; // Only applicable for 'dropdown' type fields
}