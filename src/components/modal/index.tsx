
import React, { FC, ReactNode, useState } from 'react'
import { View } from 'react-native'
import { Button, IconButton, Modal, Portal, Text, useTheme } from 'react-native-paper'

type AppModalProps = {
    title?: string,
    children?: ReactNode | ReactNode[],
    visible: boolean,
    onDismiss: () => void
}

const AppModal: FC<AppModalProps> = ({
    title = "Modal title",
    children,
    visible = false,
    onDismiss
}) => {

    const theme = useTheme()
    const containerStyle = { backgroundColor: 'white', padding: 10, margin: 20, height: 500 };

    const handleDismiss = () => {
        if (onDismiss) {
            onDismiss();
        }
    }

    return (
        <Portal>
            <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={containerStyle}>
                <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'flex-start', padding: 10 }}>
                    <Text variant='titleLarge'>{title}</Text>
                </View>
                <View style={{ display: 'flex', flex: 1, padding: 10 }}>
                    {children}
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignContent: 'center', justifyContent: 'center', marginBottom: 15 }}>
                    <Button mode='contained' style={{ minWidth: 150 }} buttonColor={theme.colors.primary}>Confirm</Button>
                    <Button mode='contained' style={{ minWidth: 150 }} buttonColor={theme.colors.tertiary} onPress={handleDismiss}>Cancel</Button>
                </View>
            </Modal>
        </Portal>
    );
}

export default AppModal;