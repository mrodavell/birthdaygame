import { View, useWindowDimensions, SafeAreaView, ScrollView, Image } from 'react-native'
import React from 'react'
import { Text, Divider, Card } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler';

export default function howtoplay() {

    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <View style={{ flex: 1, padding: widthScale(10), marginTop: heightScale(10) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name='dice-3' size={20} style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: moderateWs(20, 1) }}>
                        How to Play
                    </Text>
                </View>
                <Divider style={{ marginHorizontal: widthScale(10), marginTop: heightScale(10), marginBottom: heightScale(10) }} />
                <ScrollView style={{ maxHeight: screenHeight, marginHorizontal: widthScale(2), paddingHorizontal: widthScale(2) }}>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(15), color: 'black' }}>
                        Step 1: Check if betting time is still open.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step1.png')} style={{ width: widthScale(300), height: widthScale(40) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 2: Make sure you have a balance in your wallet.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step2.png')} style={{ width: widthScale(300), height: widthScale(120) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 3: Select draw schedule/s.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step3.png')} style={{ width: widthScale(300), height: widthScale(60) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 4: Tap on the board and pick your combination.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step3.1.png')} style={{ width: widthScale(300), height: widthScale(50) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 5: Select a month.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.png')} style={{ width: widthScale(300), height: widthScale(130) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 5: Select a date.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.1.png')} style={{ width: widthScale(300), height: widthScale(290) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 6: Multi-select Letter/s.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.2.png')} style={{ width: widthScale(300), height: widthScale(160) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 7: Set your bet.
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step4.3.png')} style={{ width: widthScale(320), height: widthScale(150) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 8: Confirm your bet
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step5.png')} style={{ width: widthScale(325), height: widthScale(120) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 9: Adjust draws or bet
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white' }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step6.png')} style={{ width: widthScale(300), height: widthScale(60) }} />
                        </Card.Content>
                    </View>
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', marginTop: widthScale(40), color: 'black' }}>
                        Step 10: Lock in your bet
                    </Text>
                    <View style={{ marginTop: heightScale(10), backgroundColor: 'white', marginBottom: heightScale(20) }}>
                        <Card.Content style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Image source={require('../../../assets/steps/step7.png')} style={{ width: widthScale(300), height: widthScale(40) }} />
                        </Card.Content>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}