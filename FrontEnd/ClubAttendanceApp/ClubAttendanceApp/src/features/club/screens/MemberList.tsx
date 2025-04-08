import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { Member } from '../Member';
import { useSelector } from 'react-redux';
import { RootState } from 'features/stores/stores';
import { PieChart } from 'react-native-chart-kit';
import fetchApi from '../../utils/Token';
import { SPRING_BACK_END, SPRING_API_ATTEND } from '@env';

const MemberList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [attendance, setAttendance] = useState<{ present: number; absent: number }>({
    present: 0,
    absent: 0,
  });

  const ServerIp: string = SPRING_BACK_END;
  const Attend: string = SPRING_API_ATTEND;

  const members = useSelector((state: RootState) => state.members.existingMembers);
  const admin = useSelector((state: RootState) => state.auth.isAdmin);

  // 출석 데이터 가져오기
  const getAttendanceData = async (memberId: string) => {
    try {
      const response = await fetchApi.get(`${ServerIp}/${Attend}/info/${memberId}`);
      const attendanceData = response.data;

      if (!Array.isArray(attendanceData)) {
        throw new Error('응답 데이터가 배열 형식이 아닙니다.');
      }

      const memberAttendance = attendanceData.filter((selectedMember) => selectedMember.sid === memberId);
      
      // 데이터가 없으면 예외 발생
      if (memberAttendance.length === 0) {
        throw new Error('출석 데이터가 없습니다.');
      }

      let present = 0;
      let absent = 0;

      memberAttendance.forEach((record: any) => {
        if (record.status === 'PRESENT') { // DB에 따라 '출석'이 아닌 'PRESENT'일 수 있음
          present += 1;
        } else if (record.status === 'ABSENT') { // '결석'이 아닌 'ABSENT'
          absent += 1;
        }
      });

      return { present, absent };
    } catch (error) {
      console.log('Error fetching attendance data:', error);
      throw error; // 예외를 상위로 전달
    }
  };

  // 선택된 멤버가 변경될 때 출석 데이터 가져오기
  useEffect(() => {
    if (selectedMember && admin) {
      const fetchAttendance = async () => {
        try {
          const data = await getAttendanceData(selectedMember.sid);
          setAttendance(data);
          setModalVisible(true); // 데이터가 있을 때만 모달 열기
        } catch (error) {
          setModalVisible(false); // 데이터 없으면 모달 안 열기
          Alert.alert('오류', '출석 데이터가 없습니다.');
          setAttendance({ present: 0, absent: 0 }); // 상태 초기화
        }
      };
      fetchAttendance();
    }
  }, [selectedMember, admin]);

  // 검색 결과 필터링
  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 회원 클릭 시 모달 표시
  const handleMemberPress = (member: Member) => {
    console.log("클릭중");
    if (admin) {
      setSelectedMember(member);
    } else {
      Alert.alert('자신의 출석률만 확인할 수 있습니다.');
    }
  };

  const renderItem = ({ item }: { item: Member }) => (
    <TouchableOpacity onPress={() => handleMemberPress(item)}>
      <View style={styles.memberCard}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberInfo}>학과: {item.major}</Text>
        <Text style={styles.memberInfo}>{item.grade}학년</Text>
        <Text style={styles.memberInfo}>가입일: {item.joinDate}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    
    <View style={styles.container}>
      {/* 검색창 */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="회원 이름 검색"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 총 인원 수 */}
      <View style={styles.memberCountContainer}>
        <Text style={styles.memberCountText}>총 인원: {filteredMembers.length}</Text>
      </View>

      {/* 멤버 리스트 */}
      <FlatList
        data={filteredMembers}
        keyExtractor={(item) => item.sid}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={<View style={{ height: 50 }} />}
      />

      {/* 출석률 모달 */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedMember?.name} 출석률
            </Text>

            {/* 출석률 차트 */}
            {selectedMember && (
              <View style={styles.chartContainer}>
                <PieChart
                  data={[
                    {
                      name: '출석',
                      population: attendance.present,
                      color: '#4A90E2',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 15,
                    },
                    {
                      name: '결석',
                      population: attendance.absent,
                      color: '#D0021B',
                      legendFontColor: '#7F7F7F',
                      legendFontSize: 15,
                    },
                  ]}
                  width={Dimensions.get('window').width - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: '#08130d',
                    backgroundGradientTo: '#1e2923',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: { borderRadius: 10, marginVertical: 10 },
                  }}
                  backgroundColor="#ffffff"
                  accessor="population"
                  paddingLeft="15"
                  style={{ borderRadius: 10 }}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  searchContainer: {
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    borderColor: '#ccc',
    // borderWidth: 1,
    borderBottomWidth:1,
  },
  memberCountContainer: {
    marginVertical: 10,
    alignItems: 'flex-end',
  },
  memberCountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    paddingBottom: 50,
  },
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  memberInfo: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: Dimensions.get('window').width - 40,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chartContainer: {
    justifyContent: 'center',
  },
});

export default MemberList;