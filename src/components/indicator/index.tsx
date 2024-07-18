
import React, { FC, ReactNode } from 'react'
import { View } from 'react-native'
import { Modal, Portal, Text } from 'react-native-paper'

type IndicatorProps = {
    title?: string,
    children?: ReactNode | ReactNode[],
    visible: boolean,
    onDismiss: () => void
}

const Indicator: FC<IndicatorProps> = ({
    title = "Processing...",
    children,
    visible = false,
    onDismiss
}) => {

    const containerStyle = { backgroundColor: 'white', padding: 10, margin: 20, height: 150 };

    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={containerStyle}>
                <View style={{ display: 'flex', flex: 1, padding: 10 }}>
                    {children}
                </View>
                <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                    <Text variant='titleLarge'>{title}</Text>
                </View>
            </Modal>
        </Portal>
    );
}

export default Indicator;