import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Attendance } from 'features/attendance/Attendance';


//넘겨주는 값들 타입 설정해주기
type MemberAttendCardProps = {
  student: { name: string; attendanceDetails: Attendance[] };
  onChangeStatus: (attendance: Attendance) => void;
};


//함수형 연결로 작성하기
const MemberAttendCard: React.FC<MemberAttendCardProps> = ({ student, onChangeStatus }) => {
    const [statusData, setStatusData] = useState<Attendance[]>(student.attendanceDetails);


  useEffect(() => {
    setStatusData(student.attendanceDetails);
  }, [student.attendanceDetails]);

  const handleStatusChange = (item: Attendance) => {
    const updatedItem = { ...item, status: item.status === "PRESENT" ? "ABSENT" : "PRESENT" as "PRESENT" | "ABSENT"};

    setStatusData((prevData) =>
        (prevData ?? []).map((data) =>
          data.date === item.date
            ? {
                ...data,
                status: (data.status === "PRESENT" ? "ABSENT" : "PRESENT") as "PRESENT" | "ABSENT",
              }
            : data
        )
      );
      


    onChangeStatus(updatedItem);
  };

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardHeader}>{student.name}의 출석 정보입니다</Text>
      <FlatList
        data={statusData}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.attendanceItem}>
            <Text>{item.date}</Text>
            <Text style={[styles.statusText, { color: item.status === 'PRESENT' ? '#4A90E2' : '#D0021B' }]}>
              {item.status}
            </Text>
            <TouchableOpacity
              onPress={() => handleStatusChange(item)}
              style={styles.changeStatusButton}
            >
              <Text style={styles.changeStatusButtonText}>
                {item.status === 'ABSENT' ? '결석으로 변경' : '출석으로 변경'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: { padding: 20 },
  cardHeader: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusText: { fontWeight: 'bold' },
  changeStatusButton: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 5,
  },
  changeStatusButtonText: {
    color: '#fff',
  },
});

export default MemberAttendCard;
