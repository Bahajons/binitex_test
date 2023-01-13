import { combineReducers } from "redux";
import { useReducer } from "./useReducer"; 

export const rootReducer = combineReducers({
    auth: useReducer, 
})