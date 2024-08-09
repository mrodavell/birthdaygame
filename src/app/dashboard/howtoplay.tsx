import { View, useWindowDimensions, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { useTheme, Text, Divider, Card, Title } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function howtoplay() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: 10, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='dice-3' size={20} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 20 }}>
                            How to Play
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 10 }} />
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 1: Check if betting time is still open.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step1.png')} style={{ width: 350, height: 70 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 2: Make sure you have a balance in your wallet.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step2.png')} style={{ width: 350, height: 70 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 3: Select your combination.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step3.png')} style={{ width: 350, height: 50 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 4: Select Month.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.png')} style={{ width: 350, height: 130 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 5: Select Date.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.1.png')} style={{ width: 350, height: 150 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 6: Multi-select Letter/s.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.2.png')} style={{ width: 350, height: 130 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 7: Set your bet.
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.3.png')} style={{ width: 350, height: 100 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 8: Confirm your bet
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step5.png')} style={{ width: 350, height: 150 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 9: Adjust draws or bet
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step6.png')} style={{ width: 350, height: 150 }} />
                        </Card.Content>
                    </Card>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', marginTop: 15 }}>
                        Step 10: Lock in your bet
                    </Text>
                    <Card style={{ marginTop: 10 }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step7.png')} style={{ width: 350, height: 70 }} />
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}