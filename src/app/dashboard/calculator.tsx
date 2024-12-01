import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, useWindowDimensions, Alert, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Divider, useTheme, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler';

export default function calculator() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    const [letters, setLetters] = useState<string[]>([]);
    const [bet, setBet] = useState<string>("0");
    const [result, setResult] = useState<string>("");
    const handleLetters = (letter: string) => {
        if (letters.includes(letter)) {
            setLetters(letters.filter(l => l !== letter));
        } else {
            setLetters([...letters, letter]);
        }
    }

    const handleBet = (bet: string) => {
        setBet(bet);
    }

    const handleCalculate = () => {

        if (parseInt(bet) <= 0 || bet === "") {
            Alert.alert("Error", "Please specify your bet", [
                { text: 'OK' }
            ]);
        }

        if (letters.length <= 0) {
            Alert.alert("Error", "Please select atleast 1 letter", [
                { text: 'OK' }
            ]);
        }

        const result = (parseInt(bet) * 720) / letters.length;

        setResult(result.toString());
    }


    useEffect(() => {
        if (bet !== "" && letters.length > 0) {
            handleCalculate();
        } else {
            setResult("0");
        }
    }, [letters, bet])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: heightScale(10), marginTop: heightScale(10), marginBottom: heightScale(bottom), justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: widthScale(10), marginTop: heightScale(10) }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='calculator' size={moderateWs(20, 1)} style={{ marginRight: widthScale(8) }} />
                        <Text style={{ fontSize: moderateWs(18, 1) }}>
                            Calculate Your Winnings
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 10 }}>
                        <Text style={{ fontSize: moderateWs(18, 1) }}>
                            Enter target bet
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput
                            value={bet.toString()}
                            onChangeText={handleBet}
                            keyboardType='numeric'
                            mode='outlined'
                            placeholder='BET'
                            style={{
                                textAlign: 'center',
                                width: '100%',
                                height: heightScale(40),
                            }}
                        />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: heightScale(25) }}>
                        <Text style={{ fontSize: moderateWs(18, 1) }}>
                            How many letter/s?
                        </Text>
                    </View>
                    <View style={{ borderRadius: 0, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <TouchableOpacity onPress={() => handleLetters("F")} style={{ flex: 1, borderWidth: 1, borderRadius: widthScale(10) }}>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderRadius: widthScale(10),
                                    borderColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: letters.includes("F") ? theme.colors.primary : 'white',
                                    height: heightScale(40)
                                }}
                            >
                                <Text style={{ fontSize: moderateWs(18, 1) }}>F</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleLetters("M")} style={{ flex: 1, borderWidth: 1, borderRadius: widthScale(10) }}>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderRadius: widthScale(10),
                                    borderColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: letters.includes("M") ? theme.colors.primary : 'white',
                                    height: heightScale(40)
                                }}
                            >
                                <Text style={{ fontSize: moderateWs(18, 1) }}>M</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderRadius: 0, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <TouchableOpacity onPress={() => handleLetters("S")} style={{ flex: 1, borderWidth: 1, borderRadius: widthScale(10) }}>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderRadius: widthScale(10),
                                    borderColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: letters.includes("S") ? theme.colors.primary : 'white',
                                    height: heightScale(40)
                                }}
                            >
                                <Text style={{ fontSize: moderateWs(18, 1) }}>S</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleLetters("D")} style={{ flex: 1, borderWidth: 1, borderRadius: widthScale(10) }}>
                            <View
                                style={{
                                    borderWidth: 1,
                                    borderRadius: widthScale(10),
                                    borderColor: 'transparent',
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: letters.includes("D") ? theme.colors.primary : 'white',
                                    height: heightScale(40)
                                }}
                            >
                                <Text style={{ fontSize: moderateWs(18, 1) }}>D</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: heightScale(25), marginBottom: heightScale(10) }}>
                        <Text style={{ fontSize: moderateWs(18, 1) }}>
                            Projected Winning Prize
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput
                            value={result.toString()}
                            readOnly
                            mode='outlined'
                            placeholder='0'
                            style={{ textAlign: 'center', width: '100%', height: heightScale(40) }}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}