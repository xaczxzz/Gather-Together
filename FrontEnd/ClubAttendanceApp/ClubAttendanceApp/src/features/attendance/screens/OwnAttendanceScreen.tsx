import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {AttendanceStackParamList} from 'navigation/NavigationStack';
import {Picker} from '@react-native-picker/picker';
import {responsive} from '../../config/globalStyle';
import fetchApi from '../../utils/Token';
import { SPRING_BACK_END,SPRING_API_ATTEND } from '@env';
import { useSelector } from 'react-redux';
import { RootState } from 'features/stores/stores';
type AttendanceDetailScreenRouteProp = RouteProp<
  AttendanceStackParamList,
  'OwnAttendanceScreen'
>;

type OwnAttendanceScreenProps = {
  route: AttendanceDetailScreenRouteProp;
};

interface attendanceData {
  id: string;
  date: string;
  day: string;
  status: string;
}

function OwnAttendanceScreen({route}: OwnAttendanceScreenProps) {
  const ServerIp: string = SPRING_BACK_END;
  const attend: string = SPRING_API_ATTEND;
  const sid = useSelector((state:RootState)=> state.auth.user?.id);
  const [month, setMonth] = useState('');
  const [attendanceData, setAttendanceData] = useState<attendanceData[]>([]);
  useEffect(() => {
    
    fetchApi
      .get(`${ServerIp}/${attend}/info/${sid}`)
      .then((response) => {
        // API 응답 데이터 가공
        
        const transformedData = response.data.map((item : any) => {
          // 요일 계산 함수
          const getDayOfWeek = (dateString : any) => {
            const date = new Date(dateString);
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            return days[date.getDay()];
          };

          
          const statusMap: any =  {
            ABSENT: '결석',
            PRESENT: '출석',
          };

          return {
            id: String(item.index), 
            date: item.date,
            day: getDayOfWeek(item.date),
            status: statusMap[item.status] || item.status, // 매핑 없으면 원래 값 유지
          };
        });

        // 상태 업데이트
        setAttendanceData(transformedData);
      })
      .catch((error) => {
        console.error('출석 데이터 불러오기 실패:', error);
      });
  }, [month]); 

  
  const userName = route.params.name;

  const [profileColor, setProfileColor] = useState('#3498db');
  
  const [filteredData, setFilteredData] = useState(attendanceData);

  const getUniqueMonths = (data: attendanceData[]) => {
    const months = data.map(item => item.date.slice(0, 7));
    return [...new Set(months)];
  };
  const uniqueMonths = getUniqueMonths(attendanceData);


  useEffect(() => {
    const filtered = month
      ? attendanceData.filter(item => item.date?.startsWith(month))
      : attendanceData;
    setFilteredData(filtered);
    
  }, [attendanceData, month]);

  const attendanceSummary = {
    total: attendanceData.length,
    present: attendanceData.filter(item => item.status === '출석').length,
    attendanceRate:
    attendanceData.length === 0
      ? 0
      : Math.round(
          (attendanceData.filter(item => item.status === '출석').length /
            attendanceData.length) *
            100,
        ),
  };
  

  const renderAttendanceItem = ({item}: any) => (
    <View style={styles.itemContainer}>
      <View style={styles.dateContainer}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dateText}>{item.date.split('-')[2]}</Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                item.status === '출석'
                  ? '#4CAF50'
                  : item.status === '결석'
                  ? '#F44336'
                  : '#FFC107',
            },
          ]}
        />
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.profileContainer}>
            <View
              style={[styles.profileCircle, {backgroundColor: profileColor}]}>
              <Text style={styles.profileInitial}>{userName[0]}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.summaryTitle}>출석 현황</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </View>
        <View style={styles.summaryContent}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>총 출석일</Text>
            <Text style={styles.summaryValue}>{attendanceSummary.total}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>출석</Text>
            <Text style={styles.summaryValue}>{attendanceSummary.present}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>출석률</Text>
            <Text style={styles.summaryValue}>
              {attendanceSummary.attendanceRate}%
            </Text>
          </View>
        </View>
      </View>

      {/* Picker와 Title 영역 */}
      <View style={styles.headerSection}>
        <View style={styles.headerTitle}>
          <Text style={styles.listTitle}>출석 기록</Text>
        </View>
        {/* <View style={styles.pickerContainer}> */}
        <Picker
          selectedValue={month}
          onValueChange={itemValue => setMonth(itemValue)}
          style={styles.picker}
          itemStyle={{height: 50, fontSize: 20 , color:"black"}}>
          <Picker.Item label="전체" value="" />
          {uniqueMonths.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>
        {/* </View> */}
      </View>

      {/* Attendance List */}
      <View style={styles.listContainer}>
        <FlatList
          data={filteredData}
          renderItem={renderAttendanceItem}
          keyExtractor={item => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    padding: 20,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle:{
    justifyContent:"center",
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileContainer: {
    marginRight: 15,
  },
  profileCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userName: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSection: {
    flexDirection: 'row', // 세로 배치로 변경
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  listTitle: {
    fontSize: responsive(20),
    fontWeight: '600',
    color: '#333',
    
  },
  pickerContainer: {
    width: 150, // Picker를 감싸는 컨테이너로 너비 조정
    // alignSelf: 'flex-start', // 왼쪽 정렬
  },
  picker: {
    // height: ,
    width: '50%', // 컨테이너 너비에 맞춤
    margin: 10,
    // fontSize:30,
  },
  listContainer: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateContainer: {
    alignItems: 'center',
    marginRight: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
  },
  pickerItem:{
    color:"black"
  }
});

export default OwnAttendanceScreen;
