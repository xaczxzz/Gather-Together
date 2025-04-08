import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'features/stores/stores';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {PieChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import MemberAttendCard from '../../club/components/MeberAttendCard';
import {updateAttendance} from '../stores/AttendanceReducer';
import {Attendance} from 'features/attendance/Attendance';
import {responsive, responsiveHeight} from '../../config/globalStyle';
import {useNavigation} from '@react-navigation/native';
import {AttendanceNavigationProp} from '../../../navigation/NavigationStack';
import Dot from 'react-native-calendars/src/calendar/day/dot';
const screenWidth = Dimensions.get('window').width;

LocaleConfig.locales.fr = {
  monthNames: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '01월',
    '02월',
    '03월',
    '04월',
    '05월',
    '06월',
    '07월',
    '08월',
    '09월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "Aujourd'hui",
};

LocaleConfig.defaultLocale = 'fr';

const AttendanceStats = () => {
  const today = new Date().toISOString().split('T')[0];
  const dispatch = useDispatch();

  const attendanceData = useSelector(
    (state: RootState) => state.attendance.attendanceRecords,
  );

  const [selectDay, setSelectDay] = useState('');

  const navigation = useNavigation<AttendanceNavigationProp>();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<typeof attendanceData>([]);
  // const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [studentAttendanceDetails, setStudentAttendanceDetails] = useState<
    any[]
  >([]);

  const onPressDay = (day: any) => {
    setSelectDay(day.dateString);
    navigation.navigate('AttendanceScreen', {date: day.dateString});
  };

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        current={Date()}
        onDayPress={onPressDay}
        markedDates={{
          [selectDay]: {selected: true, selectedColor: '#007aff', marked: true},
        }}
        
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
  },
  calendar: {
    
    width: '100%',
    
    
  },
});

export default AttendanceStats;
