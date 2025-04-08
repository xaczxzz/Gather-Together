import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, StyleSheet, AppState} from 'react-native';
import {Member,applicationMember} from 'features/club/Member';
import MemberCard from '../components/MemberCard';
import {RouteProp} from '@react-navigation/native';
import {ClubStackParamList} from '../../../navigation/NavigationClubStack'
import {useDispatch} from 'react-redux';
import {addMember, removeAttendingMember} from '../stores/MemberReducers';
import {SafeAreaView} from 'react-native-safe-area-context';
import fetchApi from '../../utils/Token';
import {SPRING_BACK_END,SPRING_API_CLUB} from '@env'
import {fetchMemberData} from '../../stores/actions';
import { RootState ,AppDispatch} from 'features/stores/stores';
 // RouteProp을 사용하여 route.params 타입 지정
type ApprovalPageRouteProp = RouteProp<ClubStackParamList, 'ApprovalPage'>;

interface ApprovalPageProps {
  route: ApprovalPageRouteProp;
}



const ApprovalPage = ({route}: ApprovalPageProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [pendingMembers, setPendingMembers] = useState<applicationMember[]>(
    route.params.newMembers,
  ); // 가입 희망 부원 리스트
  const serverIp: string  = SPRING_BACK_END;
  const club : string = SPRING_API_CLUB;

  const formatDate = (dateStr: string): string => {
    const [year, month, day] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // 승인 또는 거절 버튼을 눌렀을 때 처리
  const handelApproveButton = useCallback(
    (newMembers: applicationMember) => {
     
      dispatch(removeAttendingMember(newMembers.sid));
      setPendingMembers(prevMembers =>
        prevMembers.filter(m => m.sid !== newMembers.sid),
      );
      
      const {index, ...memberWithoutStatus } = newMembers; 
      const formattedJoinDate = formatDate(memberWithoutStatus.joinDate);
      memberWithoutStatus.joinDate = formattedJoinDate;
      memberWithoutStatus.status = "APPROVE";
      fetchApi.post(`${serverIp}/${club}/register`,memberWithoutStatus)
      .then((respnse) =>{
        dispatch(fetchMemberData());
      }).catch((error)=> {
        
      })
    },
    [dispatch,pendingMembers],
  );

  const handelRejectButton = useCallback(
    (member: Member) => {
      
      dispatch(removeAttendingMember(member.sid));
      setPendingMembers(prevMembers =>
        prevMembers.filter(m => m.sid !== member.sid),

      );
      dispatch(fetchMemberData());
    },
    [dispatch,pendingMembers],
  );

  return (
    <View style={styles.container}>
      {pendingMembers.length > 0 } 
      {/* && <Text style={styles.header}>신청자</Text> */}
  
      {pendingMembers.length === 0 ? (
        <View style={styles.noContainer}>
          <Text style={styles.noText}>신청한 인원이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={pendingMembers}
          keyExtractor={item =>  String(item.index)}
          renderItem={({ item }) => (
            <MemberCard
              member={item}
              onApprove={() => handelApproveButton(item)}
              onReject={() => handelRejectButton(item)}
            />
          )}
        />
      )}
    </View>
  );
  
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#fff'}, 
  topBorder: {
    height: 1, // 줄 두께
    backgroundColor: '#ccc', // 줄 색상 (회색)
    width: '100%', // 전체 너비
  },
  container: {flex: 1, padding: 16},
  header: {fontSize: 24, fontWeight: 'bold', marginBottom: 16},
  noContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
  },
});

export default ApprovalPage;
