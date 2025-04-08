import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {responsive, responsiveHeight} from '../../config/globalStyle';
import {useDispatch, useSelector} from 'react-redux';
import {RootState, AppDispatch} from 'features/stores/stores';
import {Dimensions} from 'react-native';

import NoticeBoard, {BoardData} from '../components/Board'; // NoticeBoard 컴포넌트 import
import {ClubMainNavigationProp} from '../../../navigation/NavigationClubStack';
import {SPRING_API_CLUB, SPRING_BACK_END} from '@env';
import fetchApi from '../../utils/Token';
import {fetchMemberAttendInfo, fetchMemberData} from '../../stores/actions';
import {AxiosResponse} from 'axios';
import {Member} from '../Member';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Attendance} from '../../attendance/Attendance';
import {
  SafeAreaFrameContext,
  SafeAreaView,
} from 'react-native-safe-area-context';
// 화면 크기 가져오기
const {width, height} = Dimensions.get('window');

const ClubMain = () => {
  const navigation = useNavigation<ClubMainNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [isNewestFirst, setIsNewestFirst] = useState(true);
  const [rankData, setRankData] = useState([
    {id: '1', name: '박지훈', attendance: 20},
    {id: '2', name: '최도윤', attendance: 18},
    {id: '3', name: '윤서현', attendance: 15},
    {id: '4', name: '회원4', attendance: 10},
    // 나머지 회원들...
  ]);
  const sortedRankData = [...rankData].sort(
    (a, b) => b.attendance - a.attendance,
  );

  const user = useSelector((state: RootState) => state.auth.user);
  const admin = useSelector((state: RootState) => state.auth.isAdmin);
  const serverIP: string = SPRING_BACK_END;
  const club: string = SPRING_API_CLUB;
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const existingMembers = useSelector(
    (state: RootState) => state.members.existingMembers,
  );
  const newMembers = useSelector(
    (state: RootState) => state.members.attendingMembers,
  );
  const attendanceRecords = useSelector(
    (state: RootState) => state.attendance.attendanceRecords,
  );

  async function fetchBoardData() {
    try {
      const response = await fetchApi.get(`${serverIP}/${club}/board/list`);
      setBoardData(response.data || []); // 응답 데이터가 없으면 빈 배열
    } catch (error) {
      // console.error("Error fetching board data:", error);
      setBoardData([]); // 에러 시 빈 배열로 설정
    }
  }
  const calculateAverageAttendanceRate = (
    members: Member[],
    attendanceRecords: Attendance[],
    periodDays: number = 10, // 기본값 10일
  ): number => {
    // 전체 멤버 수
    const totalMembers = members.length;

    // 총 출석 횟수 (기간 내 출석만 계산하려면 필터링 필요)
    const totalAttendanceCount = attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date('2025-03-20');
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + periodDays - 1); // 10일 기간
      return recordDate >= startDate && recordDate <= endDate;
    }).length;

    // 평균 출석률 계산
    const averageRate =
      periodDays > 0 && totalMembers > 0
        ? Number(
            (
              (totalAttendanceCount / (periodDays * totalMembers)) *
              100
            ).toFixed(0),
          )
        : 0;

    return averageRate;
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBoardData(); 
    });
    return unsubscribe; 
  }, [fetchBoardData, navigation]);

  useEffect(() => {
    fetchBoardData();
    dispatch(fetchMemberData());
    dispatch(fetchMemberAttendInfo());
  }, [newMembers, admin, user, dispatch,]);

  const RankCircle = ({rank}: {rank: number}) => {
    let circleSize = 30;
    let circleColor = '#ccc';

    if (rank === 1) {
      circleSize = responsive(50); // 1위는 큰 동그라미
      circleColor = '#ffcc00'; // 1위는 금색
    } else if (rank === 2) {
      circleSize = responsive(40); // 2위는 중간 크기
      circleColor = '#c0c0c0'; // 2위는 은색
    } else if (rank === 3) {
      circleSize = responsive(35); // 3위는 작은 동그라미
      circleColor = '#cd7f32'; // 3위는 동메달 색상
    }
    return (
      <View
        style={[
          styles.rankCircle,
          {
            width: circleSize,
            height: circleSize,
            borderRadius: circleSize / 2,
            backgroundColor: circleColor,
          },
        ]}>
        <Text style={styles.rankText}>{rank}</Text>
      </View>
    );
  };

  const onPressBoard = () => {
    navigation.navigate('BoardScreen');
  };

  const attendanceRates = calculateAverageAttendanceRate(
    existingMembers,
    attendanceRecords,
  );
  

  // 정렬된 데이터
  const sortedBoardData = [...boardData].sort((a, b) => {
    return isNewestFirst
      ? new Date(b.day).getTime() - new Date(a.day).getTime()
      : new Date(a.day).getTime() - new Date(b.day).getTime();
  });

  const onPressDetailBoard = (item: BoardData) => {
    navigation.navigate('DetailBoard', {id: item.boardId});
  };
  // fetchBoardData();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>라누바</Text>
          <Text>{user?.name}</Text>
          {/* admin일 경우 출석 버튼 숨김 */}
        </View>

        {admin && (
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('MemberList')}>
                <Text style={styles.cardTitle}>동아리 인원</Text>
                <Text style={styles.cardValue}>{existingMembers.length}명</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>출석률</Text>
              <Text style={styles.cardValue}>{attendanceRates}%</Text>
            </View>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('ApprovalPage', {newMembers})}>
              <Text style={styles.cardTitle}>신청자</Text>
              <Text style={styles.cardValue}>{newMembers.length}명</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.boardContainer}>
          <Text style={styles.boardHeader} onPress={onPressBoard}>
            게시판
          </Text>
          <NoticeBoard
            props={sortedBoardData}
            onPress={item => {
              onPressDetailBoard(item);
            }}
          />
        </View>
        <View style={styles.rankBox}>
          <Text style={styles.title}>출석 랭킹</Text>
          <View style={styles.rankContainer}>
            {sortedRankData.slice(0, 3).map((member, index) => (
              <View key={member.id} style={styles.rankItem}>
                <RankCircle rank={index + 1} />
                <Text style={styles.rankName}>{member.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 추가 탭 또는 공간
      <View style={styles.tabContainer}>
        <Text style={styles.tabText}>탭 항목 1</Text>
        <Text style={styles.tabText}>탭 항목 2</Text>
      </View> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:{
    flex:1,
    // backgroundColor:'#ffffff',


  },
  container: {flex:1, backgroundColor: '#f5f5f5',padding:10},
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(20),
  },
  title: {
    fontSize: responsive(26),
    fontWeight: 'bold',
    color: '#333',
  },
  attendanceButton: {
    backgroundColor: '#007aff',
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendanceButtonText: {
    fontSize: responsive(16),
    fontWeight: 'bold',
    color: '#fff',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(10),
    marginTop: responsiveHeight(1),
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: width * 0.037,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: height * 0.015,
  },
  cardValue: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#007aff',
    textAlign: 'center',
  },
  boardHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  boardContainer: {
    marginTop: 5,
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    height: '50%',
    marginBottom: 20,
  },
  rankBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    // flex: 1,
    padding: 10,
  },
  rankContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: responsiveHeight(10),
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rankText: {
    color: '#fff',
    fontSize: responsive(16),
    fontWeight: 'bold',
  },
  rankName: {
    fontSize: responsive(14),
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  rankAttendance: {
    fontSize: responsive(14),
    color: '#555',
  },
  tabContainer: {
    marginTop: responsiveHeight(20),
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: responsive(18),
    color: '#007aff',
    marginBottom: 5,
  },
});

export default ClubMain;
