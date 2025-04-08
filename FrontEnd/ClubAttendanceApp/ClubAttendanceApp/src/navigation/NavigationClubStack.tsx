import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ClubMain from '../features/club/screens/ClubMain';
import ApprovalPage from '../features/club/screens/ApprovalPage';
// import {ClubStackParamList} from '../screens/club/ClubMain';
import MemberList from '../features/club/screens/MemberList';
import {useDispatch, UseSelector, useSelector} from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {logout} from '../features/auth/stores/authSlice';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import BoardScreen from '../features/club/screens/ClubBoard';
import { RouteProp } from '@react-navigation/native';
import {Member,applicationMember} from '../features/club/Member'; //
import LoginScreen from '../features/auth/screens/Login';
import SignUpScreen from '../features/auth/screens/Sign';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BoardData} from 'features/club/components/Board';
import DetailBoard from '../features/club/screens/DetailBoard';
import WritePostScreen from '../features/club/screens/WritePostScreen';
import {SPRING_BACK_END, SPRING_API_AUTH,SPRING_API_CLUB} from '@env';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import {RootState} from '../features/stores/stores'
import fetchApi from 'features/utils/Token';

export type ClubStackParamList = {
  ClubMain: undefined;
  ApprovalPage: {newMembers: applicationMember[]};
  MemberList: undefined;
  DrawerNavigator: undefined;
  LoginScreen: undefined;
  SignUpScreen: undefined;
  NavigationTab: undefined;
  BoardScreen: undefined;
  NoticeBoard: undefined;
  DetailBoard: {id: string };
  WritePostScreen: {name: string; sid: string, };
};

export type ClubMainNavigationProp =
  NativeStackNavigationProp<ClubStackParamList>;

const Stack = createNativeStackNavigator<ClubStackParamList>();

export type ClubDrawerParamList = {
  LoginScreen: undefined;
  Logout: undefined;
  메인: undefined;
  SignUpScreen: undefined;
  NavigationTab: undefined;
  MemberList: undefined;
  ApprovalPage: undefined;
};


const serverIP: string = SPRING_BACK_END;
const Auth: string = SPRING_API_AUTH;
const club: string = SPRING_API_CLUB;

type RootStackParamList = {
  MainStack: undefined; // MainStack 내의 화면들
};

type MainStackConfig = {
  route: RouteProp<RootStackParamList, 'MainStack'>;
  
  admin?: boolean; 
};

const Drawer = createDrawerNavigator<ClubDrawerParamList>();


function DrawerNavigator() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const admin = useSelector((state: RootState) => state.auth.isAdmin);
  

  const accessToken = useSelector((state: RootState) => state.auth.user?.accessToken);

  const handleLogOut = () => {
    dispatch(logout());
    axios.post(`${serverIP}/${Auth}/logOut`,accessToken)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.log(error);
    })
  };

  // Custom Drawer Content
  const CustomDrawerContent = (props: any) => (
    <View style={{flex: 1, paddingTop: 50}}>
      {/* 기본 Drawer 메뉴 항목들을 렌더링 */}
      <View style={{flex: 1}}>
        {props.state.routes.map((route: any) => (
          <TouchableOpacity
            key={route.key}
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate(route.name)}>
            <Text style={styles.drawerItemText}>{route.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 로그아웃 버튼 */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
        <Text style={styles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      {/* 로그인 상태에 따라 적절한 화면을 렌더링 */}
      {!isLoggedIn ? (
        <>
          <Drawer.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Drawer.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <Drawer.Screen
          name="메인"
          component={ClubMain}
          options={{headerShown: false}}
          // options={{title: '메인페이지'}}
        />
      )}
    </Drawer.Navigator>
  );
}

const MainStack = ( ) => {

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DrawerNavigator"
        component={DrawerNavigator}
        options={{title: '', headerShown: false}}
      />
      <Stack.Screen
        name="ClubMain"
        component={ClubMain}
        options={{title: '메인페이지', headerShown: false}}
      />
      <Stack.Screen
        name="ApprovalPage"
        component={ApprovalPage}
        options={{ 
          headerShown:true,
          headerTitle:'',
        }}
      />
      <Stack.Screen
        name="MemberList"
        component={MemberList}
        options={{
          headerShown: true,         
          headerTitle: '',    
          // headerTintColor: 
          
          headerStyle: {
            backgroundColor: '#fff', 
          },
          
        }}
      />
      <Stack.Screen
        name="BoardScreen"
        component={BoardScreen}
        options={{title: '게시판'}}
      />
      <Stack.Screen
        name="DetailBoard"
        component={DetailBoard}
        options={{title: ''}}
        
      />
      <Stack.Screen
        name="WritePostScreen"
        component={WritePostScreen}
        options={{title: ''}}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    padding: 10,
    margin: 10,
    backgroundColor: '#FF6347',
    marginTop: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  drawerItem: {
    padding: 10,
    marginBottom: 5,
  },
  drawerItemText: {
    fontSize: 16,
  },
});

export default MainStack;
