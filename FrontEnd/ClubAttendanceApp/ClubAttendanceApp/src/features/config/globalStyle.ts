import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get("window");

const baseWidth = width;
const baseHeight = height;

const minScale = 0.85;
export function responsive(size: number): number {
    // 가로 비율
    const widthRatio = width / baseWidth;
    // 세로 비율
    const heightRatio = height / baseHeight;
    // 평균 비율
    const averageRatio = (widthRatio + heightRatio) / 2;

    const scaledSize = size * averageRatio;
    return Math.max(scaledSize, size * minScale);
}


export function responsiveHeight(size: number): number {
    const screenRatio = height / baseHeight;
    const scaledSize = size * screenRatio;
    return Math.max(scaledSize, size * minScale);
}
