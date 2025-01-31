interface config {
    GET_ADMIN_DATA: any;
    UPDATE_PROFILE_PHOTO: any;
    UPDATE_PROFILE: string;
    BASE_URL: string;
    CREATE_USER: string;
    AUTH_USER: string;
    CREATE_WAVE: string;
    GET_MY_WAVES: string;
    GET_REQUESTS: string;
    INVITE_FRIEND: string;
    SECRET_KEY: string;
    GET_LATEST_WAVES: string;
    GET_COMMENTS: string;
    GET_PREFERENCE: string;
    UPDATE_PREFERENCE: string;
    EDIT_PASSWORD: string;
    GET_FRIENDS: string;
    ADD_COMMENT: string;
    EDIT_COMMENT: string;
    DELETE_COMMENT: string;
    GET_PROFILE: string;
    CREATE_ADMIN_USER: string;
    AUTH_ADMIN_USER: string;
    PAYMENT: string;
}
// console.log("--------->", import.meta.env.VITE_BASE_URL)
const Local: config = {
    BASE_URL: import.meta.env.VITE_BASE_URL,
    CREATE_USER: "signup",
    AUTH_USER: "login",
    CREATE_WAVE: "addwave",
    GET_MY_WAVES: "getmywave",
    GET_REQUESTS: "getrequests",
    INVITE_FRIEND: "invite-friend",
    SECRET_KEY: import.meta.env.VITE_CRYPTO_SECRET_KEY,
    GET_LATEST_WAVES: "getlatestwaves",
    GET_COMMENTS: "getcomments",
    GET_PREFERENCE: "getpreference",
    UPDATE_PREFERENCE: "updatepreference",
    EDIT_PASSWORD: "updatepassword",
    GET_FRIENDS: "getfriendlist",
    ADD_COMMENT: "addcomment",
    EDIT_COMMENT: "editcomment",
    DELETE_COMMENT: "deletecomment",
    GET_PROFILE: "getprofiledata",
    UPDATE_PROFILE: "updateuserprofile",
    CREATE_ADMIN_USER: "admin-register",
    AUTH_ADMIN_USER: "admin-login",
    // GET_ADMIN_DATA: import.meta.env.VITE_GET_ADMIN_DATA,
    UPDATE_PROFILE_PHOTO: "updateprofilephoto",
    GET_ADMIN_DATA: "allusers",
    PAYMENT: "create-payment-intent"
}

export default Local