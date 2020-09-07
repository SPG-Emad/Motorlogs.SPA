
import { ActionReducerMap } from "@ngrx/store";
import { userReducer } from "./reducers/user.reducer";
import { permissionReducer } from "./reducers/permissions.reducer";

// interface AppState {
//   userState: UserState;
//   cartState: CartState;
// }

export const mlStepReducers: ActionReducerMap<any> = {
  user: userReducer,
  permission: permissionReducer
};