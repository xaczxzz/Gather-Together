import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  Code,
} from 'react-native-vision-camera';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import fetchApi from '../../utils/Token';
import { SPRING_BACK_END,SPRING_API_ATTEND, SPRING_API_CLUB } from '@env';
import { useSelector } from 'react-redux';
import { RootState } from 'features/stores/stores';
import { Member } from 'features/club/Member';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [qrData, setQrData] = useState('');
  const [capture, setCapture] = useState(false); // 캡처 상태 관리
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const captureRef = useRef(false); 
  const [memberData, setMemberData] = useState<Member>();

  const serverIp: string = SPRING_BACK_END;
  const club: string = SPRING_API_CLUB;
  const attend: string = SPRING_API_ATTEND;
  const sid = useSelector((state:RootState) => state.auth.user?.id);
  
  // 📌 카메라 권한 요청 함수
  const requestCameraPermission = async () => {
    try {
      const platformPermissions =
        Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

      const result = await request(platformPermissions);
      if (result === RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        Alert.alert(
          '카메라 권한이 차단되었습니다',
          '설정에서 카메라 권한을 허용해주세요.',
          [
            { text: '취소', style: 'cancel' },
            { text: '설정으로 이동', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (err) {
      Alert.alert('Camera permission error');
      console.warn(err);
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
    requestCameraPermission();
    fetchApi.get(`${serverIp}/${club}/memberInfo/${sid}`)
    .then((response)=> {
      console.log(response.data);
      setMemberData(response.data);
    }).catch((error)=>{
      console.log(error);
    })
    
  }, []);

  //  QR 코드 스캔 좌표
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      if (captureRef.current) return; // 이미 캡처되었으면 다시 실행되지 않도록 차단
      console.log(codes);
      if (codes.length > 0) {
        const code = codes[0];
  
  

          captureRef.current = true;
          setCapture(true);
          
          const attendData = {
            sid : memberData?.sid,
            name: memberData?.name,
            major: memberData?.major,
            grade: memberData?.grade,
            qrData:code.value,
          }
          
          console.log(attendData)
          fetchApi.post(`${serverIp}/${attend}/qrIdentify`,attendData)
          .then((response)=>{
            Alert.alert('출석 완료');  
          }).catch((error)=>{
            Alert.alert("당일 출석 데이터가 존합니다.");
          })
          // 5초 후 다시 감지 가능하도록 설정
          setTimeout(() => {
            captureRef.current = false;
            setCapture(false);
          }, 5000);
        } else {
          console.warn('QR 코드에 좌표 데이터가 없음');
        }
      }
    },
  );

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity onPress={requestCameraPermission}>
          <Text style={styles.permissionButton}>권한 요청</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>📷 사용할 수 있는 카메라 장치가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      <Camera
        ref={cameraRef}
        device={device}
        isActive={!capture} // 캡처 완료되면 카메라 비활성화
        photo={true}
        codeScanner={codeScanner}
        style={styles.cameraPreview}
      />

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    marginTop: 10,
    color: 'blue',
    fontSize: 16,
  },
  qrBox: {
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CameraScreen;
