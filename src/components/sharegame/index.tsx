import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Share, Alert } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

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
        <View style={{ flex: 1 }}>
            <Button onPress={onShare}>
                <Text variant='titleMedium' style={{ marginTop: 5, color: theme.colors.tertiary }}>Share Game</Text>
                <MaterialCommunityIcons name='share' color={theme.colors.tertiary} size={20} />
            </Button>
        </View>
    )
}