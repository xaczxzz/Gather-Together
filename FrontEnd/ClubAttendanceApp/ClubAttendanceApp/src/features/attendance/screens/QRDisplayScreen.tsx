import React, { useEffect, useState } from 'react';
import { View, StyleSheet,Text} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SPRING_BACK_END, SPRING_API_ATTEND } from '@env';
import { fetchApi } from '../../utils/Token';

const QRDisplayScreen = () => {
  const [url, setQrUrl] = useState('');
  const [loading,setLoading] = useState(false);
  const ServerIp: string = SPRING_BACK_END;
  const Attend: string = SPRING_API_ATTEND;

  useEffect(() => {
    const qrData = async () => {
      try {
        const response = await fetchApi.get(`${ServerIp}/${Attend}/qr`);
        
        setLoading(true);
        setQrUrl(response.data);
      } catch (error) {
        console.log("Error :", error);
      }
    };

    qrData();
  }, [loading]); 
  if(!loading){
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
    </View>
    )
  }

  return (
    <View style={styles.container}>
      <QRCode value={url} size={200} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default QRDisplayScreen;