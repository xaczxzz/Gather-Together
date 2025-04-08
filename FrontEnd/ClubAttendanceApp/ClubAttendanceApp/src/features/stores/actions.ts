import { Member } from '../club/Member';
import { Attendance } from 'features/attendance/Attendance';
import { AxiosResponse } from 'axios';
import { SPRING_BACK_END, SPRING_API_CLUB,SPRING_API_ATTEND } from '@env';
import fetchApi from '../utils/Token';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 멤버 추가 업데이트 액션
export  const setPendingMembers = (members: Member[]) => ({
  type: 'SET_PENDING_MEMBERS',
  payload: members,
});

// 출석 상태 업데이트 액션
export const updateAttendance = (attendance: Attendance) => ({
  type: 'UPDATE_ATTENDANCE',
  payload: attendance,
});

// 비동기 리덕스 액션
export const fetchMemberData = createAsyncThunk (
  'members/fetchMemberData',
  async () => {
    try {
      const serverIP = SPRING_BACK_END;
      const club = SPRING_API_CLUB;
      const response= await fetchApi.get(`${serverIP}/${club}/list`);
      
      return response.data; // Member[] 반환
    } catch (error) {
      console.error('Error fetching member data:', error);
      return ;
    }
  }
);

export const fetchMemberAttendInfo = createAsyncThunk(
  'attend/fetchMemberAttendInfo',
  async () => {
    try{
      const serverIP = SPRING_BACK_END;
      const attend = SPRING_API_ATTEND;
      
      const response = await fetchApi.get(`${serverIP}/${attend}/info/all`);
      // console.log(response);
      return response.data;
    } 
    catch(error) {
      console.error('Error fetchMemberAttendInfo ',error)
    }
    
  }
)
