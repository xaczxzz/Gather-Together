import axios, {
    AxiosInstance,
    AxiosRequestConfig,
    AxiosError,
    AxiosRequestHeaders,
  } from "axios";
import { getAsyncData,CommonType ,refreshToken, logoutUser} from "./common";
import reactotron from "reactotron-react-native";
import { useDispatch } from "react-redux";
import store from '../stores/stores'
import { Alert } from "react-native";

/**
 * Axios InterSeceptor 작업 유틸입니다.
 */

  
  interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders;
    _retry?: boolean; // 재시도 여부를 추적하기 위한 플래그
  }
  
  
  export const fetchApi: AxiosInstance = axios.create();
  
  
  fetchApi.interceptors.request.use(
    async (config): Promise<AdaptAxiosRequestConfig> => {
      const getAccessTokenForApi = getAsyncData();
      if (getAccessTokenForApi) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${getAccessTokenForApi}`;
      }
      return config;
    },
    (error: AxiosError<CommonType.Terror>) => {
      return Promise.reject(error);
    }
  );
  
  // 응답 인터셉터
  fetchApi.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<CommonType.Terror>) => {
      const originalRequest = error.config as AdaptAxiosRequestConfig;
      
      if (error.response) {
        const errorCode = error.response.data?.code;
        const errorMessage = error.response.data?.message;
        
  
        switch (errorCode) {
          case "T-004": // 토큰 없음
          case "T-002": // Access 토큰 만료
            console.log(errorCode === "T-004" ? "Token missing" : "Token expired");
  
            if (originalRequest._retry) {
              console.log("Retry failed after refresh attempt");
              return Promise.reject(error);
            }
  
            originalRequest._retry = true;
            try {
              const result = await refreshToken(store.dispatch);
              
              if (result.status === 200 && 'data' in result) {
                
                
                
                const {token, refreshToken} = result.data;
                
                originalRequest.headers.Authorization = `Bearer ${token}`;
                console.log("토큰 재 발급 시도중")
                return fetchApi(originalRequest); // 재시도
              } else {
                console.log("Failed to refresh token:", result.message);
                return Promise.reject(error);
              }
            } catch (refreshError) {
              console.log("Refresh token call failed:", refreshError);
              return Promise.reject(refreshError);
            }
  
          case "T-003": // Refresh 토큰 만료
            console.log("Refresh token expired");
            logoutUser();
            return Promise.reject(error);

          // case "A-002": 
          // // "너무 많은 채팅 요청"
          // Alert.alert("너무 많은 요청을 하였습니다.");
          // return Promise.reject(error);
  
          default:
            reactotron.log("Unhandled error:", errorCode, errorMessage);
            return Promise.reject(error);
        }
      } else {
        reactotron.log("No response from server:", error.message);
        return Promise.reject(error);
      }
    }
  );
  
  export default fetchApi;