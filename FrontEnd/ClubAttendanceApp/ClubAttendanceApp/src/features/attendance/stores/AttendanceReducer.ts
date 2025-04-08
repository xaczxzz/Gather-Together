// src/stores/AttendanceSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Attendance } from 'features/attendance/Attendance';
import attendanceData from './AttendanceData';
import {fetchMemberAttendInfo} from '../../stores/actions'
// 초기 상태 정의
interface AttendanceState {
  attendanceRecords: Attendance[];
  loading : boolean;
  error: string | null;
}

const initialState: AttendanceState = {
  attendanceRecords: attendanceData,
  loading:false,
  error:null,
};

// 슬라이스 생성
const attendanceSlice = createSlice({
  name: 'attendance', // 슬라이스 이름
  initialState,
  reducers: {
    
    addAttendance(state, action: PayloadAction<Attendance>) {
      state.attendanceRecords.push(action.payload);
    },
    
    updateAttendance(state, action: PayloadAction<Attendance>) {
      state.attendanceRecords = state.attendanceRecords.map((attendance) =>
        attendance.date === action.payload.date && attendance.index === action.payload.index
          ? { ...attendance, ...action.payload }
          : attendance
      );
    },
    
  },
  extraReducers: (builder) => {
    builder
          .addCase(fetchMemberAttendInfo.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchMemberAttendInfo.fulfilled, (state, action) => {
            state.loading = false;
            state.attendanceRecords = action.payload; 
          })
          .addCase(fetchMemberAttendInfo.rejected, (state, action) => {
            state.loading = false;
            state.error = "error" 
            state.attendanceRecords = []; 
          });
  }
});

// 액션 생성자와 리듀서 내보내기
export const { addAttendance, updateAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;