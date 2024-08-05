import { createReducer } from "@reduxjs/toolkit";
import { isLoadingAction, userAction } from "./actions";

// So, we set the initial value to an empty string or the user's data
const initialValue = { userLoading: true, userData: null };

export const userReducer = createReducer(initialValue, (builder) => {
  builder.addCase(userAction, (state, action) => {
    const { payload } = action;
    return { ...state, ...payload };
  });
});

export const isLoadingReducer = createReducer(false, (builder) => {
  // Prefix the 'state' with an underscore, to tell es-lint that I do not want to use it
  builder.addCase(isLoadingAction, (_state, action) => {
    const { payload } = action;
    return payload;
  });
});
