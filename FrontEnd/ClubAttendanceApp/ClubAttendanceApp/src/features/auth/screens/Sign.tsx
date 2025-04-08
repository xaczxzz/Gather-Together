import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SPRING_BACK_END, SPRING_API_AUTH} from '@env';
import axios from 'axios';
import {RadioButton} from 'react-native-paper';
import {responsive} from '../../config/globalStyle';
import {useNavigation} from '@react-navigation/native';
import {ClubMainNavigationProp} from 'navigation/NavigationClubStack';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SignUpFormData {
  password: string;
  major: string;
  name: string;
  grade: string;
  sid: string;
}

const SignUpScreen = () => {
  const [isStudentIdValid, setIsStudentIdValid] = useState(false);
  const [studentIdCheckLoading, setStudentIdCheckLoading] = useState(false);

  const serverIP: string = SPRING_BACK_END;
  const Auth: string = SPRING_API_AUTH;
  const navigation = useNavigation<ClubMainNavigationProp>();
  const {
    control,
    watch,
    handleSubmit,
    formState: {errors},
  } = useForm<SignUpFormData>({
    defaultValues: {
      password: '',
      major: '',
      name: '',
      sid: '',
      grade: '',
    },
  });
  const grades = ['1', '2', '3', '4'];
  const studentId = watch('sid');
  const ButtonBack = () => {
    navigation.navigate('LoginScreen');
  };

  useEffect(() => {
    if (!studentId) return;

    const timer = setTimeout(async () => {
      setStudentIdCheckLoading(true);
      try {
        console.log('호출중: ', `${serverIP}/${Auth}/checkSid/${studentId}`);
        const response = await axios.get(
          `${serverIP}/${Auth}/checkSid/${studentId}`,
        );
        console.log('Response:', response.data);
        setIsStudentIdValid(!response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setStudentIdCheckLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [studentId, serverIP, Auth]);

  const onSubmit = async (formData: SignUpFormData) => {
    if (!isStudentIdValid) {
      Alert.alert('학번 중복 검사를 완료하세요.');
      return;
    }

    try {
      const response = await axios.post(
        `${serverIP}/${Auth}/signup`,
        formData,
        {
          headers: {'Content-Type': 'application/json'},
        },
      );

      if (response.status === 200) {
        console.log(response.data);
        Alert.alert('회원가입 성공!');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error) {
        Alert.alert('회원가입 실패');
      } else {
        Alert.alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.titleback}>
            <TouchableOpacity onPress={ButtonBack}>
              <Icon name="arrow-back" style={styles.iconSize} />
            </TouchableOpacity>

            <Text style={styles.title}>회원가입</Text>
          </View>

          {/* 학번 입력 */}
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
          {errors.sid && <Text style={styles.error}>{errors.sid.message}</Text>}
          {studentIdCheckLoading && (
            <Text style={styles.loading}>학번 확인 중...</Text>
          )}
          {!studentIdCheckLoading && studentId && (
            <Text style={isStudentIdValid ? styles.valid : styles.invalid}>
              {isStudentIdValid
                ? '사용 가능한 학번입니다.'
                : '이미 사용 중인 학번입니다.'}
            </Text>
          )}

          {/* 이름 */}
          <Controller
            control={control}
            rules={{required: '이름을 입력하세요.'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="이름"
                onChangeText={onChange}
                placeholderTextColor={'#007AFF'}
                value={value}
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}

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
                onChangeText={onChange}
                placeholderTextColor={'#007AFF'}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          {/* 전공 */}
          <Controller
            control={control}
            rules={{required: '전공을 입력하세요.'}}
            render={({field: {onChange, value}}) => (
              <TextInput
                style={styles.input}
                placeholder="전공"
                onChangeText={onChange}
                placeholderTextColor={'#007AFF'}
                value={value}
              />
            )}
            name="major"
          />
          {errors.major && (
            <Text style={styles.error}>{errors.major.message}</Text>
          )}

          {/* 학년 */}
          <Controller
            control={control}
            rules={{
              required: '학년을 선택하세요.',
            }}
            render={({field: {onChange, value}}) => (
              <View style={styles.input}>
                <Text style={{marginBottom: 8, color: '#007AFF'}}>학년</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {grades.map(grade => (
                    <TouchableOpacity
                      key={grade}
                      onPress={() => onChange(grade)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: responsive(38),
                        height: responsive(38),
                        borderRadius: 20,
                        backgroundColor:
                          value === grade ? '#007AFF' : 'transparent',
                        borderWidth: 1,
                        borderColor: '#007AFF',
                        marginRight: 10,
                      }}>
                      <Text
                        style={{
                          color: value === grade ? '#fff' : '#007AFF',
                          fontSize: 16,
                          textAlign: 'center',
                        }}>
                        {grade}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            name="grade"
          />
          {/* 회원가입 버튼 */}
          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1},
  container: {flex: 1, padding: 20, backgroundColor: '#f5f5f5'},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    marginTop:20,
  },
  inputContainer: {
    marginBottom: 10, // TextInput과 동일한 간격
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
  error: {color: 'red', fontSize: 14, marginBottom: 5},
  valid: {color: 'green', fontSize: 14, marginBottom: 5},
  invalid: {color: 'red', fontSize: 14, marginBottom: 5},
  loading: {color: '#555', fontSize: 12, marginBottom: 5},
  iconSize: {
    fontSize: responsive(40),
  },
  titleback:{
  }
});

export default SignUpScreen;
