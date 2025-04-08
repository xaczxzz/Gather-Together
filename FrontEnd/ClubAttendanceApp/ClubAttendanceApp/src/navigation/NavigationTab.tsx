import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../features/stores/stores';
import MainStack from './NavigationClubStack';
import AttendanceStack from './NavigationStack';
import QRDisplayScreen from '../features/attendance/screens/QRDisplayScreen';
import CameraScreen from '../features/attendance/screens/QRScannerScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 라이브러리 추가
import {View} from 'react-native'
import { responsive } from '../features/config/globalStyle';
const Tab = createBottomTabNavigator();

const NavigationTab = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isAdmin = useSelector((state: RootState) => state.auth.isAdmin);

  return (
    <>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: '#ffffff', 
              height: responsive(70), 
              borderTopWidth: 1, // 상단 얇은 테두리
              borderTopColor: '#e0e0e0',
              paddingBottom: 5, // 하단 여백
              paddingTop: 5, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 5,
            },
            tabBarLabelStyle: {
              fontSize: 12, // 레이블 크기 조정
              marginBottom: 5,
            },
            tabBarActiveTintColor: '#007aff', // 활성 색상
            tabBarInactiveTintColor: '#8e8e93', // 비활성 색상
          }}
        >
          <Tab.Screen
            name="MainStack"
            component={MainStack}
            options={{
              title: '동아리',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home-outline" color={color} size={size} />
              ),
            }}
          />

          {isAdmin ? (
            <Tab.Screen
              name="QRDisplayScreen"
              component={QRDisplayScreen}
              options={{
                title: 'QR 생성',
                tabBarIcon: ({ color, size }) => (
                  <Icon name="qr-code-outline" color={color} size={size} />
                ),
              }}
            />
          ) : (
            <Tab.Screen
              name="QRDisplayScreen"
              component={CameraScreen}
              options={{
                title: 'QR 스캔',
                tabBarIcon: ({ color, size }) => (
                  <Icon name="camera-outline" color={color} size={size} />
                ),
              }}
            />
          )}

          <Tab.Screen
            name="AttendanceStack"
            component={AttendanceStack}
            options={{
              title: '출석',
              tabBarIcon: ({ color, size }) => (
                <Icon name="calendar-outline" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <View></View>
      )}
    </>
  );
};

export default NavigationTab;