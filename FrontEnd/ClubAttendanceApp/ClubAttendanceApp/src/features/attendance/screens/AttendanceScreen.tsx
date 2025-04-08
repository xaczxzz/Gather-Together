import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from 'features/stores/stores';
import {AttendanceStackParamList} from 'navigation/NavigationStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Attendance} from '../Attendance';
import AttendanceStats from '../components/AttendanceRate';
import attendanceReducer, {updateAttendance} from '../stores/AttendanceReducer';
import fetchApi from '../../utils/Token';
import {SPRING_BACK_END, SPRING_API_ATTEND} from '@env';
import { fetchMemberAttendInfo } from '../../stores/actions';
type AttendanceDetailScreenRouteProp = RouteProp<
  AttendanceStackParamList,
  'AttendanceScreen'
>;

type AttendanceDetailProps = {
  route: AttendanceDetailScreenRouteProp;
};

const AttendanceScreen = ({route}: AttendanceDetailProps) => {
  const date = route.params?.date;
  const [selectedItem, setSelectedItem] = useState<Attendance[]>([]);
  const [IsModal, setIsModal] = useState(false);
  
  const [status, setStatus] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const serverIp: string = SPRING_BACK_END;
  const attend: string = SPRING_API_ATTEND;

  // console.log(attendanceData)
  let totalData;

  // const absentData = attendanceData.filter(
  //   item => item.date === date && item.status === '결석',
  // );
  
  const attendance = useSelector((state: RootState) => state.attendance.attendanceRecords);
  useEffect(() => {
    dispatch(fetchMemberAttendInfo);
    console.log("랜더링하나")
  }, [date,selectedItem,status]);

  const handleCardPress = (item: Attendance) => {
    const memberData = attendance.filter(data => data.index === item.index);
    setStatus(memberData[0].status);
    if (memberData) {
      setSelectedItem(memberData);
      // console.log(memberData);
      setIsModal(true);
    }
  };
  let Data = attendance.filter(
    item =>
      item.date === date && (item.status === 'PRESENT' || item.status === 'ABSENT'),
  );
  Data = Data.sort((a, b) => {
    return a.status === 'PRESENT' && b.status === 'ABSENT' ? -1 : 1;
  });
  const presentCount = Data.filter((item) => item.status === 'PRESENT').length;
  const absentCount = Data.filter((item) => item.status === 'ABSENT').length;

  const handleStatusChange = (item: Attendance , status: 'PRESENT' | 'ABSENT') => {
    
    
    const updatedItem = {...item, status: status};
    
    
    
    fetchApi.put(`${serverIp}/${attend}/updateInfo`,updatedItem)
    .then((response)=>{ 
      setSelectedItem((prev) =>
        prev.map((data) =>
          data.sid === updatedItem.sid ? { ...data, status } : data
        )
      );
      dispatch(fetchMemberAttendInfo());


    }).catch((error)=>{
      
    })
  };

  return (
    <View style={styles.container}>
      <AttendanceStats />
      <View style={styles.listContainer2}>
        <View style={[styles.listContainer, styles.presentContainer]}>
          <View style={styles.titleContainer}>
            <Text style={styles.subHeaderText}>명단</Text>
            <Text style={styles.countText}>
          출석 {presentCount} 결석 {absentCount}
        </Text>
          </View>
          <FlatList
            data={Data}
            keyExtractor={(item) => String(item.index)}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleCardPress(item)}>
                <View style={styles.card}>
                  {item.status === 'ABSENT' && (
                    <Icon name="close" size={32} color="red" />
                  )}
                  {item.status === 'PRESENT' && (
                    <Icon name="check-circle" size={32} color="green" />
                  )}
                  <Text style={styles.memberName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.noDataText}>출석한 사람이 없습니다.</Text>
            }
          />
        </View>

        <Modal visible={IsModal} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {selectedItem?.[0]?.name} 님의 출석 정보
              </Text>

              {selectedItem.length > 0 && (
                <View>
                  <Text>{selectedItem[0].date}</Text>
                  <Text>{selectedItem[0].status === "PRESENT" ? "출석" : "결석"}</Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.presentButton]}
                      onPress={() =>
                        handleStatusChange(selectedItem[0], 'PRESENT')
                      }>
                      <Text style={styles.buttonText}>출석</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, styles.absentButton]}
                      onPress={() =>
                        handleStatusChange(selectedItem[0], 'ABSENT')
                      }>
                      <Text style={styles.buttonText}>결석</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity onPress={() => setIsModal(false)}>
                <Text style={styles.closeButton}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  listContainer2: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  listContainer: {
    flex: 1,
    marginBottom: 16,
    borderRadius: 10,
    padding: 20,
  },
  presentContainer: {
    backgroundColor: '#fff',
    borderColor: '#f1f3f5',
    borderWidth: 2,
    shadowOffset: {width: 3, height: 5},
  },
  subHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#f1f3f5',
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  memberName: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 어둡게
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // 안드로이드 그림자
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#4CAF50',
  },
  absentButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  countText: {
    fontSize: 16,
    color: '#555',
  },
});

export default AttendanceScreen;


