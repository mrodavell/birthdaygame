import { Drawer } from 'expo-router/drawer';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DrawerContent from '../../components/drawer';
import 'react-native-gesture-handler';
import { Alert, Share, View } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

const DashboardLayout = () => {

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={DrawerContent}
                screenOptions={{
                    headerTitle: "BIRTHDAY GAME",
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        color: theme.colors.inverseOnSurface,
                        textShadowColor: "#000000", textShadowRadius: 1,
                        textShadowOffset: {
                            width: 1,
                            height: 2,
                        },
                    },
                    headerStyle: {
                        backgroundColor: theme.colors.primary,
                    },
                    drawerHideStatusBarOnOpen: false,
                    drawerLabelStyle: {
                        marginLeft: -20
                    },
                    headerRight: () => (
                        <TouchableOpacity activeOpacity={1} onPress={onShare}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: theme.colors.surface }}>Share</Text>
                                <IconButton icon="share" style={{ marginLeft: -5 }} iconColor={theme.colors.surface} />
                            </View>
                        </TouchableOpacity>
                    )
                }}
            >
                <Drawer.Screen name='(tabs)' options={{
                    drawerLabel: "Home",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='home-outline' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='calculator' options={{
                    drawerLabel: "Prize Calculator",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='calculator' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='schedules' options={{
                    drawerLabel: "Draw Schedules",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='calendar' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='transactions' options={{
                    drawerLabel: "Transaction History",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='history' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='howtoplay' options={{
                    drawerLabel: "How to play",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='dice-3' color={color} size={size} />
                    )
                }} />
            </Drawer>
        </GestureHandlerRootView>

    )
}

export default DashboardLayout