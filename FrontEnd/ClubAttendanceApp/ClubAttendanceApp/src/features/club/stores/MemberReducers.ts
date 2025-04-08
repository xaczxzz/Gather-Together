// src/stores/MemberReducers.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MEMBERS, MEMBERATTEND } from './MemberData';
import { Member, applicationMember } from 'features/club/Member';
import {fetchMemberData} from '../../stores/actions'

// 상태 인터페이스 정의
interface MembersState {
  existingMembers: Member[];
  attendingMembers: applicationMember[];
  memberInfo: Member[];
  loading : boolean;
  error: string |null;
}

const initialState: MembersState = {
  existingMembers: MEMBERS, // 초기 학생 더미 데이터
  attendingMembers: MEMBERATTEND,
  memberInfo:[],
  loading: false,
  error: null,
};



// createSlice로 리듀서와 액션 정의
const membersSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    addMember(state, action: { payload: Member }) {
      state.existingMembers.push(action.payload); // 단일 멤버 추가
    },
    removeMember(state, action: { payload: string }) {
      state.existingMembers = state.existingMembers.filter(
        (member) => member.sid !== action.payload
      ); // 기존 멤버 제거
    },
    removeAttendingMember(state, action: { payload: string }) {
      state.attendingMembers = state.attendingMembers.filter(
        (member) => member.sid !== action.payload
      ); // 신청 멤버 제거
    },
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemberData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMemberData.fulfilled, (state, action) => {
        state.loading = false;
        state.existingMembers = action.payload; 
      })
      .addCase(fetchMemberData.rejected, (state, action) => {
        state.loading = false; // 
        state.error = "error" // 
        state.existingMembers = []; // 
      });
  },
});

// 액션 내보내기
export const { addMember, removeMember, removeAttendingMember } = membersSlice.actions;

// 리듀서 내보내기
export default membersSlice.reducer;