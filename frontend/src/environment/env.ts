interface config {
    GET_ROOM: any;
    GET_STAFF_LIST: any;
    DELETE_STAFF: any;
    ADD_STAFF: string;
    UPDATE_USER: any;
    GET_DOCTOR_ADDRESSES: any;
    BASE_URL: string;
    CREATE_USER: string;
    VERIFY_USER: string;
    LOGIN_USER: string;
    GET_USER: string;
    GET_DOC_LIST: string;
    GET_PATIENT_LIST: string;
    ADD_PATIENT: string
    ADD_ADDRESS: string
}

export const Local: config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    CREATE_USER: import.meta.env.VITE_CREATE_USER,
    VERIFY_USER: import.meta.env.VITE_VERIFY_USER,
    LOGIN_USER: import.meta.env.VITE_LOGIN_USER,
    GET_USER: import.meta.env.VITE_GET_USER,
    GET_DOC_LIST: import.meta.env.VITE_GET_DOC_LIST,
    GET_PATIENT_LIST: import.meta.env.VITE_GET_PATIENT_LIST,
    ADD_PATIENT: import.meta.env.VITE_ADD_PATIENT,
    ADD_ADDRESS: import.meta.env.VITE_ADD_ADDRESS,
    GET_DOCTOR_ADDRESSES: import.meta.env.VITE_GET_DOCTOR_ADDRESSES,
    UPDATE_USER: import.meta.env.VITE_UPDATE_USER,
    ADD_STAFF: import.meta.env.VITE_ADD_STAFF,
    GET_STAFF_LIST: import.meta.env.GET_STAFF_LIST,
    DELETE_STAFF: import.meta.env.DELETE_STAFF,
    GET_ROOM: import.meta.env.VITE_GET_ROOM
}