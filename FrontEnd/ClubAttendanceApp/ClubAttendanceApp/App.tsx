import React, { useState, useEffect } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './src/features/stores/stores';
import NavigationTab from './src/navigation/NavigationTab';
import { createNavigationContainerRef } from '@react-navigation/native';
import { ClubStackParamList } from 'navigation/NavigationClubStack';
import { useDispatch } from 'react-redux';
import MainStack from '../ClubAttendanceApp/src/navigation/NavigationClubStack';
// 테스트
import EncryptedStorage from 'react-native-encrypted-storage';

export const navigationRef = createNavigationContainerRef<ClubStackParamList>();

const AppContent = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const [isNavReady, setIsNavReady] = useState(false); // 네비게이션 준비 상태 추적
  
  useEffect(() => {
    if (navigationRef.isReady()) {
      setIsNavReady(true); // 네비게이션 준비가 되었을 때 상태 업데이트

      }
      
  }, []);


  return (
    <NavigationContainer ref={navigationRef}>
      {/* 네비게이션 상태에 따라 렌더링 */}
        {!isLoggedIn ?<MainStack/>:<NavigationTab/>}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
};

export default App;
