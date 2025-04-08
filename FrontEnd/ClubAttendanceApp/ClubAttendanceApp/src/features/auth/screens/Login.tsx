import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  ClubMainNavigationProp,
  ClubStackParamList,
} from '../../../navigation/NavigationClubStack';
import {useDispatch} from 'react-redux';
import {login} from '../stores/authSlice';
import {navigationRef} from '../../../../App';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import {SPRING_BACK_END, SPRING_API_AUTH} from '@env';
import EncryptedStorage from 'react-native-encrypted-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginFormData {
  sid: string;
  password: string;
}

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ClubMainNavigationProp>();

  const [isNavMounted, setIsNavMounted] = useState<boolean>(false); // 네비게이션 준비 상태 추적

  const {
    control,
    handleSubmit,
    register,
    formState: {errors},
  } = useForm<LoginFormData>();

  // 네비게이션이 준비되었을 때 상태 업데이트
  const serverIP: string = SPRING_BACK_END;
    const Auth: string = SPRING_API_AUTH;
  const onSubmit = async (data: LoginFormData) =>  {
    try{
      
      const response = await axios.post(`${serverIP}/${Auth}/login`,data)
      
      
      dispatch(login({id: data.sid, accessToken:response.data.token, name:response.data.name, role:response.data.role}));
      storeToken(response.data.refreshToken);
    }
    catch(error){
      console.error(error);
      console.log("에러발생");
    }
   

    
  };
  const storeToken = async (refreshToken: string) => {
    try {
      await EncryptedStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error("토큰 저장 오류:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View style={styles.container}>
      
      
      <Text style={styles.title}>로그인</Text>

      {/* 이메일 입력 */}
      <Controller
        control={control}
        rules={{required: '학번을 입력하세요.'}}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="학번"
            onChangeText={onChange}
            placeholderTextColor={'#007AFF'}
            value={value}
            keyboardType="numeric"
          />
        )}
        name="sid"
      />

      {/* 비밀번호 입력 */}
      <Controller
        control={control}
        rules={{
          required: '비밀번호를 입력하세요.',
          minLength: {
            value: 6,
            message: '비밀번호는 최소 6자 이상이어야 합니다.',
          },
        }}
        render={({field: {onChange, value}}) => (
          <TextInput
            style={styles.input}
            placeholder="비밀번호"
            secureTextEntry
            placeholderTextColor={'#007AFF'}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {/* 로그인 버튼 */}
      <View style={styles.buttonContainer}>
        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.buttonText}>로그인</Text>
        </TouchableOpacity>

        {/* 회원가입 버튼 */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.buttonText}>회원가입</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
      
    </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    paddingTop: '30%',
    paddingBottom: 10,
    marginTop: 30,
  },
  // itemContainer:{

  // },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
    marginHorizontal: '1%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 5,
  },
});
