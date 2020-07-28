import * as UserActions from "../actions/users.actions";

const initialState = {};

export const userReducer = (state: any = initialState, action: UserActions.Actions) => {
    switch (action.type) {
        case UserActions.ADD_USER:
            return { ...state, ...action.payload };

        case UserActions.RESET_USER:
            return { state, initialState };

        default:
            return state;
    }
}