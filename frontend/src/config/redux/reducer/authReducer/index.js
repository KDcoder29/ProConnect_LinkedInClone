import {createSlice } from "@reduxjs/toolkit"
import { getAboutUser, getAllUsers, getConnectionsRequest, getMyConnectionsRequests, loginUser, registerUser } from "../../action/authAction"

const initialState = {
    user : undefined,
    isError : false, 
    isSuccess : false,
    isLoading : false, 
    loggedIn : false, 
    message  : "",
    isTokenThere : false,
    profileFetched : false,
    connections : [],   // Mene kis kisko request bheji hai. That all the person will be stored here 
    connectionRequest : [],
    all_users : [],
    all_profiles_fetched : false
}

const authSlice = createSlice({
    name : "auth",
    initialState,
    reducers:{
        reset : ()=>initialState,
        handleLoginUser : (state) =>{
            state.message = "hello"
        },
        emptyMessage : (state) =>{
            state.message = ""
        },
        setTokenIsThere : (state) =>{
            state.isTokenThere=true
        },
        setTokenIsNotThere : (state) =>{
            state.isTokenThere= false
        }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(loginUser.pending, (state)=>{
            state.isLoading = true
            state.message = {message : "Knocking the door..." }
        })
        .addCase(loginUser.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            state.loggedIn = true;
            state.message = {message : "Login is Successfull" }
        })
        .addCase(loginUser.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })
        .addCase(registerUser.pending, (state)=>{
            state.isLoading = true;
            state.message = {message : "Registering You..."}
        })
        .addCase(registerUser.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = true;
            //state.loggedIn = true; //because i don't want to send user to dashboard after registergin (That loop issue if you remember kd! dashboard->login->dashboard->login...)
            state.message = {message : "Registration successful. Please sign in to continue."}
        })
        .addCase(registerUser.rejected, (state,action)=>{
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload
        })
        .addCase(getAboutUser.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAboutUser.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch user profile";
        })        
        .addCase(getAboutUser.fulfilled, (state,action) =>{
            state.isLoading=false;
            state.isError=false;
            state.profileFetched = true;
            state.user = action.payload
            console.log(state.user + " IN reducer")

        })
        .addCase(getAllUsers.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.isError = false;
            state.all_users = action.payload.profiles
             state.all_profiles_fetched = true;   
        } )
        .addCase(getConnectionsRequest.fulfilled, (state,action)=>{
            state.connections = action.payload
        })
        .addCase(getConnectionsRequest.rejected, (state,action)=>{
            state.message = action.payload
        })
        .addCase(getMyConnectionsRequests.fulfilled, (state,action)=>{
            state.connectionRequest = action.payload
        })
        .addCase(getMyConnectionsRequests.rejected,(state,action)=>{
            state.message = action.payload
        })
       
    }
})

export const {reset, emptyMessage, setTokenIsThere, setTokenIsNotThere} = authSlice.actions
export default authSlice.reducer