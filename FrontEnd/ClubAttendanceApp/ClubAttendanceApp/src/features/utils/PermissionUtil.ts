import { Alert, Platform } from "react-native";
import { PERMISSIONS, RESULTS, request } from "react-native-permissions";

/**
 * '앱의 권한'을 공통으로 관리하는 유틸입니다.
 */



class PermissionUtil {

    /**
     
     * @returns {boolean} true : 사용 가능 디바이스 플랫폼, false : 사용 불가능 디바이스 플랫폼
     */
    cmmDevicePlatformCheck = (): boolean => {
        let isUseDevice = true;
        if (Platform.OS !== "ios" && Platform.OS !== "android") !isUseDevice;
        return isUseDevice;
    }

		/**
     * 카메라 권한
     * @return 
     */
        cmmReqCameraPermission = async (): Promise<string> => {
            if (!this.cmmDevicePlatformCheck()) return 'denied';
            const platformPermissions = Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;
            try {
              const result = await request(platformPermissions);
              return result;
            } catch (err) {
              Alert.alert("Camera permission error");
              console.warn(err);
              return 'denied';
            }
          }
  static cmmReqCameraPermission: any;
}
export default PermissionUtil;