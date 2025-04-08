import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
  KeyboardEvent,
  Platform,
} from 'react-native';
import NoticeBoard from '../components/Board';
import {BoardData} from '../components/Board';
import {useNavigation} from '@react-navigation/native';
import {ClubMainNavigationProp} from '../../../navigation/NavigationClubStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {responsive} from '../../config/globalStyle';
import {RootState} from 'features/stores/stores';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useSelector} from 'react-redux';
import {SPRING_BACK_END, SPRING_API_CLUB, SPRING_WEB_SOCKET} from '@env';
import fetchApi from '../../utils/Token';
import {Socket, io} from 'socket.io-client';

let keyboardDidShowListener: any = null;
let keyboardDidHideListener: any = null;

const BoardScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewestFirst, setIsNewestFirst] = useState(true);
  const [isModal, setModal] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [session, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<
    {id: string; text: string; sender: string}[]
  >([]);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const ws = useRef<WebSocket | null>(null);
  const [serverMessage,setServerMessage] = useState('');
  const admin = useSelector((state: RootState) => state.auth.isAdmin);
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector(
    (state: RootState) => state.auth.user?.accessToken,
  );
  const ServerIp: string = SPRING_BACK_END;
  const club: string = SPRING_API_CLUB;
  const socket: string = SPRING_WEB_SOCKET;

  const navigation = useNavigation<ClubMainNavigationProp>();
  // 데이터 가져오기 함수
  const fetchBoardData = useCallback(async () => {
    try {
      const response = await fetchApi.get(`${ServerIp}/${club}/board/list`);
      setBoardData(response.data || []);
    } catch (error) {
      console.error('Error fetching board data:', error);
      setBoardData([]);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBoardData();
    });
    return unsubscribe;
  }, [fetchBoardData, navigation]);

  // 키보드 이벤트 처리
  const handleFocus = () => {
    console.log("키보드 이벤트 처리 들어옴"+keyboardHeight);
    keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
  };
  const handleBlur = () => {
    keyboardDidShowListener?.remove();
    keyboardDidHideListener?.remove();
  };

  // 필터링된 데이터
  const filteredBoardData = boardData.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query) ||
      item.writer.toLowerCase().includes(query)
    );
  });

  // 정렬된 데이터
  const sortedBoardData = [...filteredBoardData].sort((a, b) => {
    return isNewestFirst
      ? new Date(b.day).getTime() - new Date(a.day).getTime()
      : new Date(a.day).getTime() - new Date(b.day).getTime();
  });

  const ChatButton = React.memo(({onPress}: {onPress: () => void}) => {
    return (
      <TouchableOpacity style={styles.chatButton} onPress={onPress}>
        <Icon name="chat" size={30} color="#fff" />
      </TouchableOpacity>
    );
  });

  const handleChatPress = () => {
    // ButtonSocket();
    setModal(true);
  };
  useEffect(() => {
    // WebSocket 연결
    ws.current = new WebSocket(`ws://${socket}?token=${accessToken}`);

    
    ws.current.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
    };

    
    ws.current.onmessage = (e) => {
      
      setSessionId(e.data); // 서버에서 sessionId를 바로 보낸다고 가정
    };

    
    ws.current.onerror = (e) => {
      console.error(" WebSocket 에러 발생:", e);
    };

    
    ws.current.onclose = (e) => {
      console.log(" WebSocket 연결 종료:", e.reason);
    };

    //언마운트
    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, [accessToken, socket]);

  const handleSendMessage = async (e: any) => {
    
    if (!WebSocket.OPEN) {
      console.log(' WebSocket이 연결되지 않았습니다');
      ws.current = new WebSocket(`ws://${socket}?token=${accessToken}`);
      ws.current.onmessage = (e)=> {
        setSessionId(e.data);
      }
      return;
    }

    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender: '나',
      };
      setMessages(prev => [...prev, newMessage]);
      setMessageInput('');

      const requestChatData = {
        query: messageInput,
        sessionId: session, // WebSocket에서 받은 세션 ID 사용
      };
      console.log(requestChatData.sessionId);

      try {
        const response = await fetchApi.post(
          `${ServerIp}/${club}/chat`,
          requestChatData,
        );

        const serverResponse = {
          id: (Date.now() + 1).toString(),
          text: response.data.answer,
          sender: '서버',
        };

        setMessages(prev => [...prev, serverResponse]);
      } catch (error: any) {
        if (error.response) {
          console.log('서버 응답 오류');
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log(error.message);
        }
      }
    }
  };

  const offset = useSharedValue(0);
  useEffect(() => {
    
    offset.value = withTiming(keyboardHeight, {duration: 300});
  }, [keyboardHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: offset.value,
  }));

  const handleEdit = (name: string, sid: string) => {
    navigation.navigate('WritePostScreen', {name, sid});
  };
  const handleDisconnect = () => {
    setModal(false);
  };
  const renderSearchBar = useMemo(
    () => (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="검색"
          placeholderTextColor="rgba(0, 0, 0, 0.3)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Icon
          name="search"
          size={responsive(24)}
          color="#555"
          style={styles.searchIcon}
        />
      </View>
    ),
    [searchQuery],
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.searchContainer}>
            {/* <TextInput
            style={styles.searchInput}
            placeholder="검색"
            placeholderTextColor="rgba(0, 0, 0, 0.3)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon
            name="search"
            size={responsive(24)}
            color="#555"
            style={styles.searchIcon}
          /> */}
            {renderSearchBar}
          </View>

          <View style={styles.menuContainer}>
            <TouchableOpacity
              onPress={() => handleEdit(user?.name || '', user?.id || '')}>
              <Icon name="edit" size={responsive(24)} color="#555" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={sortedBoardData}
            renderItem={({item}) => <NoticeBoard props={[item]} />}
            keyExtractor={item => item.boardId}
            style={styles.messageList}
            contentContainerStyle={{
              padding: 10,
              backgroundColor: '#ffffff',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            }
          />
        </View>

        {!isModal ? (
          // <View>
          //   <TouchableOpacity
          //     style={styles.chatButton}
          //     onPress={handleChatPress}>
          //     <Icon name="chat" size={responsive(30)} color="#fff" />
          //   </TouchableOpacity>
          // </View>
          <ChatButton onPress={handleChatPress} />
        ) : (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isModal}
            onRequestClose={() => setModal(false)}>
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[
                  styles.modalContainer,
                  animatedStyle,
                  {bottom: keyboardHeight > 0 ? keyboardHeight : 0},
                ]}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>동아리 챗봇</Text>
                  <TouchableOpacity onPress={() => handleDisconnect()}>
                    <Icon name="close" size={responsive(24)} color="#333" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={messages}
                  renderItem={({item}) => (
                    <View
                      style={[
                        styles.messageBubble,
                        item.sender === '나'
                          ? styles.myMessage
                          : styles.otherMessage,
                      ]}>
                      {item.sender === '나' ? (
                        <Text style={styles.messageText}>{item.text}</Text>
                      ) : (
                        <Text style={styles.otherMessageText}>{item.text}</Text>
                      )}
                      {/* <Text style={styles.messageText}>{item.text}</Text> */}
                    </View>
                  )}
                  keyExtractor={item => item.id}
                  style={styles.messageList}
                  contentContainerStyle={{paddingVertical: responsive(10)}}
                />

                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.messageInput, {height: responsive(40)}]}
                    placeholder="메시지 입력..."
                    value={messageInput}
                    onChangeText={setMessageInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handleSendMessage}>
                    <Icon name="send" size={responsive(24)} color="#fff" />
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </View>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

// styles는 그대로 유지
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    // position: 'relative',
    flexDirection: 'column',
    // alignContent: "space-between"
  },
  searchInput: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingRight: 40,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  searchIcon: {
    margin: 10,
    right: 10,
    position: 'absolute',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  sortText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  chatButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '58%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    // fontWeight: 'bold',
    color: '#333',
  },
  messageList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#e0e0e0',
    alignSelf: 'flex-start',
    color: 'black',
  },
  otherMessageText: {
    color: 'black',
    fontSize: 16,
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  messageInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: responsive(5),
    paddingHorizontal: responsive(10),
    // borderBottomWidth: 1,
    // borderBottomColor: 'gray',
  },
});

export default BoardScreen;
