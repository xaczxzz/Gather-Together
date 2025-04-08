import EncryptedStorage from 'react-native-encrypted-storage';
import axios from "axios";
import { UseDispatch, useDispatch, useSelector ,} from 'react-redux';
import {login, logout} from '../auth/stores/authSlice';
import store from '../stores/stores';
import {RootState} from '../stores/stores';
import {SPRING_BACK_END} from '@env'
import Dispatch from 'redux';

 
interface AsyncData {
    getAsyncData<T>(key: string): Promise<T | null>;
    setAsyncData<T>(key: string, value: T): Promise<void>;
    removeAsyncData(key: string): Promise<void>;
    
  }
  
  
  export const getAsyncData = () => {
    try {
      const accessToken = store.getState().auth.user?.accessToken;
      return accessToken || null;
    } catch (error) {
      console.log("getAsyncData 오류", error);
      return null;
    }
  };
  
  
  export const setAsyncData = async <T>(key: string, value: T): Promise<void> => {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log!("setAsyncData 오류", error);
    }
  };
  
  export const removeAsyncData = async (key: string): Promise<void> => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (error) {
      console.log!("removeAsyncData 오류", error);
    }
  };


  export namespace CommonType {
    export type Terror = {
      status: number;
      message: string;
      code?: string;
      details?: Record<string, any>;
    };
  
    export type Tsuccess<T> = {
      status: number;
      data: T;
      message?: string;
    };
  }

  export const logoutUser = () =>{
    store.dispatch(logout());
    removeAsyncData("refreshToken")
    

  }

  export const refreshToken = async (dispatch: any): Promise<
  CommonType.Tsuccess<{ token: string; refreshToken: string }> | CommonType.Terror
> => {
  try {
    const storedRefreshToken = await EncryptedStorage.getItem("refreshToken");
    
    if (!storedRefreshToken) {
      
      throw new Error("No refresh token available");
    }
    const server :string = SPRING_BACK_END;
    const data = {
      "refreshToken": storedRefreshToken
    }
    
    const response = await axios.post(`${server}/auth/refresh`,data);
      
    
    const { token, refreshToken,name,role,id } = response.data;
    
    dispatch(login({id: id, accessToken:token, name:name, role:role}));
    EncryptedStorage.setItem("refreshToken", refreshToken);

    return {
      status: 200,
      data: {token,refreshToken},
      message: "Token refreshed successfully",
    };
  } catch (error: unknown) {
    
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "재발급에 실패했습니다.",
        code: "TOKEN_REFRESH_FAILED",
        details: error.response?.data || {},
      };
    }

    
    return {
      status: 500,
      message: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
      code: "UNKNOWN_ERROR",
      details: {},
    };
  }
};


  