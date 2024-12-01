import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Share, Alert } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { moderateWs } from '../../helpers/scaler';

export default function ShareGame() {

    const theme = useTheme();
    const onShare = async () => {
        try {
            await Share.share({
                message: "Come and enjoy birthday game, Share this link https://www.bithdaygame.com to your friends",
            });
        } catch (error: any) {
            Alert.alert(error.message);
        }
    };

    return (
        <View>
            <Button onPress={onShare}>
                <Text variant='titleMedium' style={{ color: theme.colors.tertiary, fontSize: moderateWs(12, 1) }}>Share Game</Text>
                <MaterialCommunityIcons name='share' color={theme.colors.tertiary} size={moderateWs(12, 1)} />
            </Button>
        </View>
    )
}