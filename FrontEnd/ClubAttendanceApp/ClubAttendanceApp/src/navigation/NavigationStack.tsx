import React from 'react';
import {createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack';
import AttendanceStats from '../features/attendance/components/AttendanceRate';
// import AttendanceRate from '../screens/attendance/AttendanceRate';
import {useSelector} from 'react-redux';
import {RootState} from 'features/stores/stores';
import AttendanceScreen from '../features/attendance/screens/AttendanceScreen';
import OwnAttendanceScreen from '../features/attendance/screens/OwnAttendanceScreen'

export type AttendanceStackParamList = {
  AttendanceList: undefined; // 초기 화면
  AttendanceStats: undefined;
  AttendanceScreen: {date: string};
  OwnAttendanceScreen: {id : string , name:string}
};

export type AttendanceNavigationProp = NativeStackNavigationProp<AttendanceStackParamList>;

const Stack = createNativeStackNavigator<AttendanceStackParamList>();

const AttendanceStack = () => {
  const admin = useSelector((state: RootState) => state.auth.isAdmin);
  const user = useSelector((state: RootState) => state.auth.user);
  // console.log(auth);
  return (
    <Stack.Navigator>
      {admin ? (
        <Stack.Screen
          name="AttendanceScreen"
          component={AttendanceScreen}
          options={{title: '출석'}}
          />
      ) : (
        <>
        <Stack.Screen
          name="OwnAttendanceScreen"
          component={OwnAttendanceScreen}
          initialParams={{ id: user?.id || '', name:user?.name }}
          options={{title: ''}}
        />
        </>
      )}

    </Stack.Navigator>
  );
};


export default AttendanceStack;
