import { Action } from '@ngrx/store';

export const ADD_PERMISSION     = '[PERMISSION] Add';
export const RESET_PERMISSION   = '[PERMISSION] Reset';

export class AddPermission implements Action{
    readonly type = ADD_PERMISSION;
    
    constructor(public payload:any){}
}

export class ResetPermission implements Action{
    readonly type = RESET_PERMISSION;
}

export type Actions = AddPermission | ResetPermission