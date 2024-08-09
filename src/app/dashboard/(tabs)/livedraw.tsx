import { View, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native'
import { Button, Card, Divider, Text, TextInput, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import YoutubeLive from '../../../components/youtubelive';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function livedraw() {

    const { bottom, top } = useSafeAreaInsets()
    const dimensions = useWindowDimensions();
    const theme = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: top, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: dimensions.height }} showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 30, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <YoutubeLive />
                </View>
                <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 10 }} />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>
                        Chat
                    </Text>
                    <MaterialCommunityIcons name='chat-processing-outline' size={25} style={{ marginLeft: 5 }} />
                </View>
                <TextInput mode='outlined' placeholder='Type your message' />
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10, marginTop: 10 }}>
                    <Button mode='contained' icon="send" contentStyle={{ flex: 1, flexDirection: 'row-reverse' }}>Send</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}