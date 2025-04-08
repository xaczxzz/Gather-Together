import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ClubStackParamList } from '../../../navigation/NavigationClubStack';
import fetchApi from '../../utils/Token';
import { SPRING_BACK_END, SPRING_API_CLUB } from '@env';
import { useNavigation } from '@react-navigation/native';
import { ClubMainNavigationProp } from '../../../navigation/NavigationClubStack';
import { useSelector } from 'react-redux';
import { RootState } from 'features/stores/stores';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { responsive } from '../../config/globalStyle';

interface BoardDetail {
  boardId: number;
  title: string;
  content: string;
  writer: string;
  date: string;
}

type BoardScreenRouteProp = RouteProp<ClubStackParamList, 'DetailBoard'>;

const DetailBoard = () => {
  const route = useRoute<BoardScreenRouteProp>();
  const navigation = useNavigation<ClubMainNavigationProp>();
  const { id } = route.params;
  const [boardDetail, setBoardDetail] = useState<BoardDetail | any>();
  const [loading, setLoading] = useState(true);
  const serverIp: string = SPRING_BACK_END;
  const club: string = SPRING_API_CLUB;
  const admin = useSelector((state: RootState) => state.auth.isAdmin);

  useEffect(() => {
    const fetchBoardDetail = async (boardId: string) => {
      try {
        const response = await fetchApi.get(`${serverIp}/${club}/board/${boardId}`);
        
        setBoardDetail(response.data);
        setLoading(false);
      } catch (error) {
        
        setLoading(false);
      }
    };

    fetchBoardDetail(id);
  }, [id, admin, navigation]);

  const formatDate = (inputDay: string) => {
    const date = new Date(inputDay);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>게시글을 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.titleDelete}>
          <Text style={styles.title}>{boardDetail?.title}</Text>
          {admin && ( // admin일 때만 삭제 버튼 표시
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '삭제',
                  '정말로 삭제하시겠습니까?',
                  [
                    {text: '취소', onPress: () => {}, style: 'cancel'},
                    {
                      text: '삭제',
                      onPress: () => {
                        
                        
                        console.log(boardDetail)
                        fetchApi.delete(`${serverIp}/${club}/board/delete/${boardDetail.boardId}`,)
                        .then((respnse)=>
                          navigation.goBack()  
                        
                        ).catch((error)=> {
                          console.log(error+"에러 나온다.")
                        })
                      },
                      style: 'destructive',
                    },
                  ],
                  {
                    cancelable: true,
                    onDismiss: () => {},
                  },
                );
                // 삭제 로직 추가
              }}
            >
              <Icon name ={"close"}style={styles.deleteButton}></Icon>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>작성자: {boardDetail?.writer}</Text>
          <Text style={styles.metaText}>{formatDate(boardDetail?.day)}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.content}>{boardDetail?.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  titleDelete: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center', 
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // 제목 길어지면 축소
  },
  deleteButton: {
    color: '#ff0000',
    fontSize: responsive(20),
    paddingLeft: 10, // 제목과 삭제 버튼 사이 약간의 간격 추가
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 14,
    color: '#777',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  content: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
});

export default DetailBoard;