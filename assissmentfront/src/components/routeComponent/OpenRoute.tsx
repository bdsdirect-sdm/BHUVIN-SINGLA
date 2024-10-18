
import { useSelector } from 'react-redux';
import {Navigate,useNavigate } from 'react-router-dom';


const OpenRoute = ({children}:any) => {

    const {user_type} = useSelector((state : any) => state.user);
    if(user_type ===  null){
        return children;
    }
    else{
       return <Navigate to={"/dashboard"}/>                                                                                                           
        
    }
}

export default OpenRoute