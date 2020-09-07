import { Action } from '@ngrx/store';

export const ADD_USER     = '[USER] Add';
export const RESET_USER   = '[USER] Reset';

export class AddUser implements Action{
    readonly type = ADD_USER;
    
    constructor(public payload:any){}
}

export class ResetUser implements Action{
    readonly type = RESET_USER;
}

export type Actions = AddUser | ResetUser