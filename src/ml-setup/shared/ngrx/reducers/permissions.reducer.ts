import { Action } from '@ngrx/store';
import * as PermissionActions from "../actions/permissions.actions";

const initialState = {};

export const permissionReducer =(state: any = initialState, action:PermissionActions.Actions ) =>{
    switch(action.type){
        case PermissionActions.ADD_PERMISSION:
            return {...state, ...action.payload};
            
        case PermissionActions.RESET_PERMISSION:
            return {state, initialState};
        
        default:
            return state;
    }
}