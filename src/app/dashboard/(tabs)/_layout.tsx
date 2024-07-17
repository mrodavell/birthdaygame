import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router'
import { useTheme } from 'react-native-paper'
import { View, Text } from 'react-native';

const TabsLayout = () => {

    const theme = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    top: 0,
                    height: 72,
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
                tabBarIcon: ({ color, focused }) => (
                    <View style={{
                        alignItems: "center",
                        paddingTop: 10
                    }}>
                        <MaterialCommunityIcons
                            name={focused ? 'play-circle' : 'play-outline'}
                            color={focused ? theme.colors.tertiary : theme.colors.primary}
                            size={24}
                        />
                    </View>
                ),
                tabBarLabel: "Play Game",
                tabBarLabelStyle: {
                    fontSize: 14,
                }
            }} />
            <Tabs.Screen name='livedraw' options={{
                tabBarIcon: ({ color, focused }) => (
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
        </Tabs>
    )
}

export default TabsLayout