import React from 'react'
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Card, Divider, Title, Button } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler';
import dayjs from 'dayjs';

export default function schedules() {

    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    const currentDate = dayjs();

    const tenAm = currentDate.set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0);
    const twoPm = currentDate.set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0);
    const fivePm = currentDate.set('hour', 17).set('minute', 0).set('second', 0).set('millisecond', 0);
    const ninePm = currentDate.set('hour', 21).set('minute', 0).set('second', 0).set('millisecond', 0);

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: widthScale(10), marginTop: heightScale(10), marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: 10, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='calendar' size={widthScale(20)} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: moderateWs(18, 1) }}>
                            Draw Time Schedules
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: widthScale(10), marginTop: heightScale(10), marginBottom: heightScale(10) }} />
                    <Card style={{ marginTop: heightScale(10) }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: 5 }} />
                            <Title style={{ fontSize: moderateWs(18, 1) }}>10:00 AM</Title>
                            <Text style={{ marginLeft: widthScale(10), color: currentDate.isBefore(tenAm) ? 'green' : 'gray' }}>{currentDate.isBefore(tenAm) ? 'Open' : 'Closed'}</Text>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: heightScale(10) }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: 5 }} />
                            <Title style={{ fontSize: moderateWs(18, 1) }}>2:00 PM</Title>
                            <Text style={{ marginLeft: widthScale(10), color: currentDate.isBefore(twoPm) ? 'green' : 'gray' }}>{currentDate.isBefore(tenAm) ? 'Open' : 'Closed'}</Text>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: heightScale(10) }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: 5 }} />
                            <Title style={{ fontSize: moderateWs(18, 1) }}>5:00 PM</Title>
                            <Text style={{ marginLeft: widthScale(10), color: currentDate.isBefore(fivePm) ? 'green' : 'gray' }}>{currentDate.isBefore(tenAm) ? 'Open' : 'Closed'}</Text>
                        </Card.Content>
                    </Card>
                    <Card style={{ marginTop: heightScale(10) }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: 5 }} />
                            <Title style={{ fontSize: moderateWs(18, 1) }}>9:00 PM</Title>
                            <Text style={{ marginLeft: widthScale(10), color: currentDate.isBefore(ninePm) ? 'green' : 'gray' }}>{currentDate.isBefore(tenAm) ? 'Open' : 'Closed'}</Text>
                        </Card.Content>
                    </Card>
                    <Button
                        mode='contained'
                        style={{
                            marginHorizontal: widthScale(20),
                            marginTop: widthScale(40),
                        }}
                        contentStyle={{ height: widthScale(40) }}
                        labelStyle={{ fontSize: moderateWs(18, 1) }}
                        onPress={() => router.push('/dashboard/(tabs)/home')}>
                        Play Now!
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}