import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { responsive, responsiveHeight } from '../../config/globalStyle'; // responsive 함수 import
import { ClubMainNavigationProp } from '../../../navigation/NavigationClubStack';

// props 타입 지정
export interface BoardData {
  boardId: string;
  title: string;
  content: string;
  day: string;
  writer: string;
}

interface NoticeBoardProps {
  props: BoardData[]; // boardData 배열을 props로 받음
  onPress?: (item: BoardData) => void;
}

function NoticeBoard({ props, onPress }: NoticeBoardProps) {
  const navigation = useNavigation<ClubMainNavigationProp>();

  const renderBoardItem = ({ item }: { item: BoardData }) => (
    <Pressable onPress={() => handlePress(item.boardId)} style={styles.boardItem}>
      <Text style={styles.boardTitle}>{item.title}</Text>
      {
      item.content.length < 15 ? 
      <Text style={styles.boardContent}>{item.content}</Text> 
      :
      <Text style={styles.boardContent}>{item.content.substring(0, 10) + '...'}</Text>
      }
      
    </Pressable>
  );

  const handlePress = (id: string) => {
    navigation.navigate('DetailBoard', { id }); // id를 파라미터로 전달
  };

  return (
    <FlatList
      data={props} // 부모로부터 받은 props를 FlatList에 전달
      renderItem={renderBoardItem}
      keyExtractor={item => item.boardId}
      contentContainerStyle={styles.boardList}
    />
  );
}

export default NoticeBoard;

const styles = StyleSheet.create({
  boardContainer: {
    marginTop: responsiveHeight(5), 
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: responsive(10), 
    backgroundColor: '#fff',
  },
  boardHeader: {
    fontSize: responsive(18), 
    fontWeight: 'bold',
    marginBottom: responsiveHeight(10), 
    color: '#333',
  },
  boardList: {
    paddingVertical: responsiveHeight(10), 
    
  },
  boardItem: {
    marginBottom: responsiveHeight(15), 
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    paddingBottom: responsiveHeight(10), 
  },
  boardTitle: {
    fontSize: responsive(16), 
    fontWeight: 'bold',
    color: '#007aff',
  },
  boardContent: {
    fontSize: responsive(14), 
    color: '#555',
    marginTop: responsiveHeight(5), 
  },
});
