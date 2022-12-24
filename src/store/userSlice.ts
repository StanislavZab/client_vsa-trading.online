import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IUser } from '../models/IUser'
import { Socket } from 'socket.io-client';


export interface IUserState {
    user: IUser,
    isAuth: boolean,
    isLoad: boolean,
    errorSocket: string
}

const initialState: IUserState = {
    user: {
        email: '',
        isActivated: false,
        id: 0,
        role: []
    },
    isAuth: false,
    isLoad: false,
    errorSocket: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUser>) {
            state.user = action.payload;
        },
        setAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        setLoad(state, action: PayloadAction<boolean>) {
            state.isLoad = action.payload;
        },
        setErrorSocket(state, action: PayloadAction<string>) {
            state.errorSocket = action.payload;
        }
    }
});

export const selectUserState = (state: RootState) => state.user;

export const { setUser, setAuth, setLoad, setErrorSocket } = userSlice.actions;

export default userSlice.reducer;