import { ms, mvs, scale, verticalScale } from "react-native-size-matters";

export function widthScale(size: number): number {
    return scale(size);
}

export function heightScale(size: number): number {
    return verticalScale(size);
}

export function moderateWs(size: number, factor: number): number {
    return ms(size, factor);
}

export function moderateHs(size: number, factor: number): number {
    return mvs(size, factor);
}