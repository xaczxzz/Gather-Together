
import { createSlice, PayloadAction } from '@reduxjs/toolkit';





interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user: { id: string; accessToken:string; name:string} | null;
  
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ id: string; accessToken: string; name:string; role:string}>) => {
      const role = action.payload.role.toUpperCase();
      state.isLoggedIn = true;
      state.user = action.payload;
      state.isAdmin = role === "ADMIN";
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.isAdmin = false;
    },
    // Token: (state, action: PayloadAction<{accessToken:string}>) => {
    //   state.
    // }

  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
