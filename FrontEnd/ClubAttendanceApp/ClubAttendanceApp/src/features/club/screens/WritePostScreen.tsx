import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  ClubMainNavigationProp,
  ClubStackParamList,
} from '../../../navigation/NavigationClubStack';
import fetchApi from '../../utils/Token';
import {SPRING_BACK_END, SPRING_API_CLUB} from '@env';
import {responsive, responsiveHeight} from '../../config/globalStyle';
import {
  getAsyncData,
  CommonType,
  refreshToken,
  logoutUser,
} from '../../utils/common';

type BoardScreenRouteProp = RouteProp<ClubStackParamList, 'WritePostScreen'>;

const SubmitButton = React.memo(({onPress}: any) => (
  <TouchableOpacity style={styles.submitButton} onPress={onPress}>
    <Text style={styles.submitButtonText}>등록</Text>
  </TouchableOpacity>
));

const WritePostScreen = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation<ClubMainNavigationProp>();
  const route = useRoute<BoardScreenRouteProp>();
  const {sid, name} = route.params;
  const serverIP: string = SPRING_BACK_END;
  const club: string = SPRING_API_CLUB;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('오류', '제목과 내용을 모두 입력해주세요.');
      return;
    }

    const newPost = {
      sid,
      day: new Date().toISOString().split('T')[0],
      title,
      content,
      writer: name,
    };

    try {
      await fetchApi.post(`${serverIP}/${club}/board/add`, newPost);
      Alert.alert('성공', '글이 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
      // console.log(newPost);
    } catch (error) {
      console.error('글 등록 실패:', error);

      const getAccessTokenForApi = getAsyncData();
      console.log(getAccessTokenForApi);
      Alert.alert('오류', '글 등록에 실패했습니다.');
    }
  }; // title, content 추가

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container2}>
          <View style={styles.container}>
            <TextInput
              style={styles.titleInput}
              placeholder="제목을 입력하세요"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={title}
              onChangeText={setTitle}
              maxLength={50}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="내용을 입력하세요"
              placeholderTextColor="rgba(0, 0, 0, 0.3)"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
            <SubmitButton onPress={handleSubmit} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container2: {
    flex: 1, 
    backgroundColor: '#F8F9FA',
  },
  container: {
    
    padding: 20,
  },
  titleInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  contentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
    height: responsiveHeight(200),
    backgroundColor: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    height: responsive(50),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WritePostScreen;
