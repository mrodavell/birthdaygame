import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Divider, Button, useTheme, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function calculator() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    const [letters, setLetters] = useState<string[]>([]);
    const [bet, setBet] = useState<string>("");
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
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: 10, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='calculator' size={20} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 20 }}>
                            Calculate Your Winnings
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10, marginBottom: 10 }} />
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>
                            Enter target bet
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput value={bet.toString()} onChangeText={handleBet} keyboardType='numeric' mode='outlined' placeholder='BET' style={{ textAlign: 'center', width: '100%' }} />
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                        <Text style={{ fontSize: 20 }}>
                            How many letter/s?
                        </Text>
                    </View>
                    <View style={{ borderRadius: 0, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <Button mode={letters.includes("F") ? "contained" : "outlined"} style={{ flex: 1 }} onPress={() => handleLetters("F")}>
                            <Text style={{ fontSize: 18 }}>F</Text>
                        </Button>
                        <Button mode={letters.includes("M") ? "contained" : "outlined"} style={{ flex: 1 }} onPress={() => handleLetters("M")}>
                            <Text style={{ fontSize: 18 }}>M</Text>
                        </Button>
                    </View>
                    <View style={{ borderRadius: 0, flex: 1, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginTop: 10, gap: 10 }}>
                        <Button mode={letters.includes("S") ? "contained" : "outlined"} style={{ flex: 1 }} onPress={() => handleLetters("S")}>
                            <Text style={{ fontSize: 18 }}>S</Text>
                        </Button>
                        <Button mode={letters.includes("D") ? "contained" : "outlined"} style={{ flex: 1 }} onPress={() => handleLetters("D")}>
                            <Text style={{ fontSize: 18 }}>D</Text>
                        </Button>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 10 }}>
                        <Text style={{ fontSize: 20 }}>
                            Projected Winning Prize
                        </Text>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <TextInput value={result.toString()} readOnly keyboardType='numeric' mode='outlined' placeholder='0' style={{ textAlign: 'center', width: '100%' }} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}