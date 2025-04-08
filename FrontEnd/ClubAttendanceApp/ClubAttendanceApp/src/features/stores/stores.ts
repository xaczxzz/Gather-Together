
import { configureStore } from '@reduxjs/toolkit';
import membersSlice from '../club/stores/MemberReducers'; // 리듀서 임포트
import attendanceReducer from '../attendance/stores/AttendanceReducer';
import authSlice from '../auth/stores/authSlice';

const store = configureStore({
  reducer: {
    members: membersSlice,  // members 리듀서를 store에 추가
    attendance: attendanceReducer,
    auth:authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;  // Redux state의 타입
export type AppDispatch = typeof store.dispatch;  // Dispatch 타입

export default store;  // store를 export
