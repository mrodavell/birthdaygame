import { FC } from 'react';
import { View } from 'react-native';
import { Button, Dialog, Portal, PaperProvider, Text } from 'react-native-paper';

type TAppDialogProps = {
    visible: boolean
    toggle?: () => void;
}

const AppDialog: FC<TAppDialogProps> = ({ visible, toggle }) => {
    return (
        <PaperProvider>
            <View>
                <Portal>
                    <Dialog visible={visible} onDismiss={toggle}>
                        <Dialog.Title>Alert</Dialog.Title>
                        <Dialog.Content>
                            <Text variant="bodyMedium">This is simple dialog</Text>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={toggle}>Done</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </View>
        </PaperProvider>
    );
};

export default AppDialog;