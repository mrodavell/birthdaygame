import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router'
import { useTheme } from 'react-native-paper'
import { View } from 'react-native';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';

const TabsLayout = () => {

    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    top: heightScale(0),
                    minHeight: widthScale(55),
                    maxHeight: widthScale(60),
                    backgroundColor: theme.colors.background,
                    paddingBottom: widthScale(10),
                    alignItems: 'center',
                    justifyContent: 'center',
                    elevation: widthScale(2),
                    borderTopWidth: 0.2,
                },
            }}
            initialRouteName='home'
        >
            <Tabs.Screen name='home' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: heightScale(8)
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'cake-variant' : 'cake-variant-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={widthScale(18)}
                        />
                    </View>
                ),
                tabBarLabel: "Game",
                tabBarLabelStyle: {
                    fontSize: moderateWs(12, 1),
                }
            }} />
            <Tabs.Screen name='results' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: heightScale(8)
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'clipboard-text-clock' : 'clipboard-text-clock-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={widthScale(18)}
                        />
                    </View>
                ),
                tabBarLabel: "Results",
                tabBarLabelStyle: {
                    fontSize: moderateWs(12, 1),
                }
            }} />
            <Tabs.Screen name='etickets' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: heightScale(8)
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'ticket-confirmation' : 'ticket-confirmation-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={widthScale(18)}
                        />
                    </View>
                ),
                tabBarLabel: "e-Tickets",
                tabBarLabelStyle: {
                    fontSize: moderateWs(12, 1),
                }
            }} />
            <Tabs.Screen name='livedraw' options={{
                tabBarIcon: ({ focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: heightScale(8)
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'youtube-tv' : 'television'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={widthScale(18)}
                        />
                    </View>
                ),
                tabBarLabel: "Live Draw",
                tabBarLabelStyle: {
                    fontSize: moderateWs(12, 1),
                }
            }} />
        </Tabs>
    )
}

export default TabsLayout