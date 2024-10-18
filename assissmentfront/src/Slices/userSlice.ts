import { createSlice } from "@reduxjs/toolkit";


const intilaState = {
    stayLogin : false,
    user_type:localStorage.getItem("user_type") ? JSON.parse(localStorage.getItem("user_type") as any): (sessionStorage.getItem("user_type") ?  JSON.parse(sessionStorage.getItem("user_type") as any) : null),
    token:localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token") as any) : (sessionStorage.getItem("token") ? JSON.parse(sessionStorage.getItem("token") as string):null),
}

const userSlice = createSlice({
    name:"user",
    initialState: intilaState,
    reducers:{
        setUserType:(state,value) =>{
            state.user_type = value.payload;
            sessionStorage.setItem("user_type",JSON.stringify(value.payload))
            if(state.stayLogin){
                localStorage.setItem("user_type", JSON.stringify(value.payload))
            }
        },
        setToken:(state,value) =>{
            state.token = value.payload;
            sessionStorage.setItem("token",JSON.stringify(value.payload))
            if(state.stayLogin){
                localStorage.setItem("token", JSON.stringify(value.payload))
            }
        },
        logout:(state) => {
            state.token = null;
            state.user_type = null;
            state.stayLogin = false
            localStorage.clear(); 
            sessionStorage.clear() 
        },
        setStayLogin:(state,value) =>{
            state.stayLogin = value.payload;
        }
    }
})

export const {setToken,setUserType,logout,setStayLogin} = userSlice.actions;

export default userSlice.reducer;