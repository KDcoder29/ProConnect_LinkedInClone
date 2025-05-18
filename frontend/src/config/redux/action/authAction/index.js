import clientServer from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";
//import clientServer from "../../../index.jsx"
 


export const loginUser = createAsyncThunk(
    "user/login", //Action type
    async(user,thunkAPI)=>{
        try{
            const response  = await clientServer.post("/login",{        //rest of the url is coming from clientServer   
                email : user.email,
                password : user.password
            })       
            if(response.data.token){
                localStorage.setItem("token",response.data.token);                                
            }                   
            else{
                thunkAPI.rejectWithValue({message : "Token not provided"})
            }
            return thunkAPI.fulfillWithValue(response.data.token);
                
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const registerUser  = createAsyncThunk(
    "user/register", //Action type
    async (user,thunkAPI) =>{
        console.log("🚀 Dispatching registerUser", user);
        try{
            const response = await clientServer.post("/register",{
                name : user.name,
                email : user.email,
                password : user.password,
                username : user.username
            })
            console.log("Register success:", response.data);
            return thunkAPI.fulfillWithValue(response.data.token);

            }
        catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.get("/get_user_and_profile",{
               params : { token : user.token}
            })
            console.log("API response from getAboutUser:", response.data);
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)


export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async(_,thunkAPI)=>{
        try{
            const response = await clientServer.get("/user/get_all_user_profile")

            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/send_connection_request",{
                token : user.token,         // i am sending request so i have my token as identity
                connectionId : user.user_id   //i am sending request to rahul. so this is connection Id of rahul. (to whom request has been sent)
            })

            thunkAPI.dispatch(getConnectionsRequest({token : user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)

export const getConnectionsRequest = createAsyncThunk(
    "user/getConnectionsRequest",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("/user/get_connection_requests",{
                
                    token : user.token
                
        })
        return thunkAPI.fulfillWithValue(response.data);
    }catch(error){
        return thunkAPI.rejectWithValue(error.response.data);
    }
}
)

export const getMyConnectionsRequests = createAsyncThunk(
    "user/getMyConnectionRequests",
    async(user,thunkAPI)=>{
        try{
                const response = await clientServer.get("/user/user_connection_requests",{
                    params : {token : user.token}
                })
                return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message)
        }
    }
)

export const AcceptConnection = createAsyncThunk(
    "user/AcceptConnection",
    async(user,thunkAPI)=>{
        try{
            const response = await clientServer.post("user/accept_connection_request",{
                token : user.token,
                requestId : user.connectionId,
                action_type : user.action
            })
            thunkAPI.dispatch(getConnectionsRequest({token : user.token}))
            thunkAPI.dispatch(getMyConnectionsRequests({token :user.token}))
            return thunkAPI.fulfillWithValue(response.data);
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data.message);
        }
    }
)