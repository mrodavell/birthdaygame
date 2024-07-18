import { View, SafeAreaView } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function livedraw() {

    const { bottom } = useSafeAreaInsets()
    const theme = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, backgroundColor: 'gray', flexDirection: 'column', paddingHorizontal: 10, marginTop: 40, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <View style={{ marginBottom: 30 }}>
                <View style={{ borderWidth: 2 }}>
                    <Text variant='titleLarge' style={{ color: theme.colors.tertiary }}>Test</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}