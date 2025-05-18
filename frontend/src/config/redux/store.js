import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer"   // Gadbad path
import postReducer from "./reducer/postReducer"   // Gadbad path

/*
* STEPS for State Management 
* Submit Action 
* Handle action in it's reducer
* Register here -> Reducer
*/


export const store = configureStore({
 reducer : {
    auth : authReducer,
    postReducer : postReducer
 }
})