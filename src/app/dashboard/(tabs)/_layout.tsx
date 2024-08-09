import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router'
import { useTheme } from 'react-native-paper'
import { View, useWindowDimensions } from 'react-native';

const TabsLayout = () => {

    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    top: 0,
                    minHeight: 70,
                    maxHeight: 70,
                    backgroundColor: theme.colors.background,
                    paddingBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: 2,
                    borderTopWidth: 0.2,
                },
            }}
            initialRouteName='home'
        >
            <Tabs.Screen name='home' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 10
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'cake-variant' : 'cake-variant-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={24}
                        />
                    </View>
                ),
                tabBarLabel: "Game",
                tabBarLabelStyle: {
                    fontSize: 14,
                }
            }} />
            <Tabs.Screen name='results' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 10
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'clipboard-text-clock' : 'clipboard-text-clock-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={24}
                        />
                    </View>
                ),
                tabBarLabel: "Results",
                tabBarLabelStyle: {
                    fontSize: 14
                }
            }} />
            <Tabs.Screen name='livedraw' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 10
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'youtube-tv' : 'television'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={24}
                        />
                    </View>
                ),
                tabBarLabel: "Live Draw",
                tabBarLabelStyle: {
                    fontSize: 14
                }
            }} />
            <Tabs.Screen name='etickets' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 10
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'ticket-confirmation' : 'ticket-confirmation-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={24}
                        />
                    </View>
                ),
                tabBarLabel: "e-Tickets",
                tabBarLabelStyle: {
                    fontSize: 14,
                }
            }} />
        </Tabs>
    )
}

export default TabsLayout