import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { setUserType, setToken, setStayLogin } from "../../Slices/userSlice"
import { toast } from "react-toastify"
import { logout } from "../../Slices/userSlice"


// const BASE_URL  = process.env.BASE_REACT_APP_URL;



export const useLoginContext = (dispatch: any, navigate: any, stay: any) => {

    return (
        useMutation({
            mutationFn: async (data) => {
                return await axios.post("http://localhost:4401/api/v1/login", data)
            },
            onSuccess: (data) => {
                dispatch(setStayLogin(stay))
                dispatch(setToken(data.data.token))
                dispatch(setUserType(data.data.user.user_type))
                navigate("/dashboard")
            }
        })
    )
}

export const useResisterContext = (navigate: any) => {
    return (
        useMutation({
            mutationFn: async (data) => {
                return await axios.post("http://localhost:4401/api/v1/signup", data)
            },
            onSuccess: (data) => {
                localStorage.clear();
                navigate("/login")
            }
        })
    )
}

export const useLogout = (dispatch: any, navigate: any) => {
    return (() => {
        try {
            localStorage.clear();
            dispatch(logout())
            toast.success("logout")
            navigate("/login")
        }
        catch (error) {
            console.log(error)
        }
    }
    )
}