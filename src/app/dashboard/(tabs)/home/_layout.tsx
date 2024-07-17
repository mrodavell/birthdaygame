import { Stack } from 'expo-router'
import { useTheme } from 'react-native-paper'

const HomeLayout = () => {

    const theme = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='index' />
        </Stack>
    )
}

export default HomeLayout