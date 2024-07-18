import React, { ReactNode, RefObject, forwardRef, useMemo } from 'react';
import { BottomSheetModalProvider, BottomSheetModal } from '@gorhom/bottom-sheet';
import { View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';


type TAppBottomSheetProps = {
    children?: ReactNode;
}

type Ref = BottomSheetModal

const AppBottomSheet = forwardRef<Ref, TAppBottomSheetProps>((props, ref) => {

    const theme = useTheme();
    const snapPoints = useMemo(() => ['50%', '65%'], []);
    const { children } = props;

    return (
        <BottomSheetModalProvider>
            <BottomSheetModal
                ref={ref}
                index={1}
                snapPoints={snapPoints}
                enablePanDownToClose
                backgroundStyle={{ borderTopColor: theme.colors.inversePrimary, borderTopWidth: 2 }}
                handleIndicatorStyle={{ borderRadius: 0, backgroundColor: theme.colors.inversePrimary }}
            >
                <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column' }}>
                    {children}
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    )
})

export default AppBottomSheet;