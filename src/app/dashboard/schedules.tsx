import React from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card, Divider, Title, Button, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function schedules() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: 10, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='calendar' size={20} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 20 }}>
                            Draw Schedules
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 10 }} />
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={20} style={{ marginRight: 5 }} />
                            <Title>Draw Schedule: 9:00 AM</Title>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={20} style={{ marginRight: 5 }} />
                            <Title>Draw Schedule: 11:00 AM</Title>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={20} style={{ marginRight: 5 }} />
                            <Title>Draw Schedule: 3:00 PM</Title>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={20} style={{ marginRight: 5 }} />
                            <Title>Draw Schedule: 6:00 PM</Title>
                        </Card.Content>
                    </Card>
                    <Button mode='contained' style={{ marginHorizontal: 20, marginTop: 20 }} labelStyle={{ fontSize: 20 }} onPress={() => router.push('/dashboard/(tabs)/home')}>Play Now!</Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}