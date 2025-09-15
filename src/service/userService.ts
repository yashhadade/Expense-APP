import { server } from "../utils/server";
import { userLogin, userSignUp } from "../types/user";

const signup =async (userSignUp:userSignUp)=>{
     return server.post(`/user/signup`,userSignUp)
        .then((res)=>{
            return res.data
        })
        .catch((error)=>{
            return error
        })
} 
const login =async (userLogin:userLogin)=>{
    console.log("userLogin",userLogin)
     return server.post(`/user/signin`,userLogin)
        .then((res)=>{
            return res.data
        })
        .catch((error)=>{
            return error
        })
} 

const userServices = {
   signup,
    login
}

export default userServices;