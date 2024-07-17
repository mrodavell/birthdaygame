import { Drawer } from 'expo-router/drawer';
import { useTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DrawerContent from '../../components/drawer';
import 'react-native-gesture-handler';

const DashboardLayout = () => {

    const theme = useTheme();

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
                    }
                }}
            >
                <Drawer.Screen name='(tabs)' options={{
                    drawerLabel: "Home",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='home-outline' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='schedules' options={{
                    drawerLabel: "Draw Schedules",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='calendar' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='purchases' options={{
                    drawerLabel: "Purchase History",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='history' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='results' options={{
                    drawerLabel: "Result History",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='clipboard-text-clock-outline' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='howtoplay' options={{
                    drawerLabel: "How to play",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='dice-3' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='termsandconditions' options={{
                    drawerLabel: "Terms and Condition",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='file-document-multiple-outline' color={color} size={size} />
                    )
                }} />
                <Drawer.Screen name='settings' options={{
                    drawerLabel: "Settings",
                    drawerIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='cog-outline' color={color} size={size} />
                    )
                }} />
            </Drawer>
        </GestureHandlerRootView>

    )
}

export default DashboardLayout