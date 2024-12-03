import { View, FlatList, Alert, useWindowDimensions } from 'react-native'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { Dates } from '../../constants/Dates';
import CircleButton from '../circlebutton';
import { ActivityIndicator, Button, Divider, IconButton, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { useWalletStore } from '../../zustand/wallet';
import { TBet, TBoard } from '../../types/game';
import { useGameStore } from '../../zustand/game';
import { router, useLocalSearchParams } from 'expo-router';
import { heightScale, widthScale } from '../../helpers/scaler';

const Calendar2: FC = () => {

    const theme = useTheme()
    const boards = useGameStore((state) => state.boards);
    const selectedBoardIndex = useGameStore((state) => state.selectedBoardIndex);
    const data = boards[selectedBoardIndex ?? 0];
    const wallet = useWalletStore((state) => state.wallet);
    const { handleBoards, clearBoard } = useGameStore();

    const [processing, setProcessing] = useState<boolean>(false);
    const [bet, setBet] = useState<string>("10");
    const [selectedMonth, setSelectedMonth] = useState<string | null>("01");
    const [monthIndex, setMonthIndex] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

    const months = Dates.months;
    const days = Array.from({ length: Dates.days[monthIndex] }, (v, i) => i + 1)
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;

    useEffect(() => {
        const oldBet = data?.bet ?? "10";
        setSelectedMonth(data?.combination.month ?? "01");
        setSelectedDate(data?.combination.date ?? null);
        setSelectedLetters(data?.combination.letters ?? []);
        setBet(oldBet === "" ? "10" : oldBet);
    }, [data])


    const handleMonth = (index: number, month: string) => {
        setSelectedMonth(month);
        setMonthIndex(index);
        setSelectedDate("");
    }

    const handleDay = (day: number) => {
        setSelectedDate(day.toString())
    }

    const handleLetter = (letter: string) => {
        const old = selectedLetters;

        if (old.includes(letter)) {
            const index = old.indexOf(letter);
            old.splice(index, 1);
        } else {
            old.push(letter);
        }

        setSelectedLetters([...old]);
    }

    const handleBet = (bet: string) => {

        const myWallet = wallet ?? "0.00";
        if (parseInt(myWallet) < parseInt(bet)) {
            handleAlerts("Insufficient Funds");
            return;
        }

        setBet(bet);
    }

    const handleClear = () => {
        setBet("");
        setSelectedMonth("")
        setSelectedDate("")
        setSelectedLetters([])
    }

    const incrementBet = () => {
        const newBet = parseInt(bet) + 1;
        handleBet(newBet.toString())
    }

    const decrementBet = () => {
        if (parseInt(bet) < 1) return;

        const newBet = parseInt(bet) - 1;
        handleBet(newBet.toString())
    }

    const handleConfirmBet = () => {
        let message = ""

        if (selectedLetters.length === 0) {
            message = "Please select letters";
        }

        if (bet === "") {
            message = "Please input bet";
        }

        if (parseInt(bet) <= 0) {
            message = "Minimum bet is 1"
        }

        if (selectedMonth === "") {
            message = "Please select month";
        }

        if (selectedDate === "") {
            message = "Please select date";
        }

        if (message !== "") {
            handleAlerts(message)
            return;
        }

        handleConfirmPrompt("Locked in your bet?")
    }

    const handleAddBet = () => {

        try {
            setProcessing(true);
            if (wallet === null) {
                Alert.alert("Wallet Warning", "Insufficient wallet funds");
                return;
            }

            if (parseInt(bet) > parseInt(wallet)) {
                Alert.alert("Wallet Warning", "Insufficient wallet funds");
                return;
            }

            const newdata: TBet = {
                label: data.label ?? '',
                bet: parseInt(bet),
                combination: {
                    month: selectedMonth ?? '',
                    date: selectedDate ?? '',
                    letters: selectedLetters
                }
            }

            handleBoards(newdata);
            router.back();
        } catch (error: any) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }

    const handleConfirmPrompt = (msg: string) => {
        Alert.alert("Are you sure?", msg, [
            { text: "Cancel", onPress: () => null },
            { text: "Confirm", onPress: () => handleAddBet() }
        ])
    }

    const handleClearBet = () => {
        handleClearPrompt("Clear bet on this board?")
    }

    const handleClearPrompt = (msg: string) => {
        if (!data) return;

        Alert.alert("Are you sure?", msg, [
            { text: "Cancel", onPress: () => null },
            {
                text: "Ok", onPress: async () => handleClearBoard()
            }
        ])
    }

    const handleClearBoard = () => {
        try {
            setProcessing(true);
            clearBoard(data);
        } catch (error: any) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }

    const handleAlerts = (msg: string) => {
        Alert.alert("Error", msg, [
            { text: 'OK' }
        ])
    }

    return (
        <View>
            <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', padding: widthScale(10) }}>
                <Text variant='titleLarge'>Board {data.label}</Text>
                <IconButton icon="close" onPress={() => router.back()} />
            </View>
            <ScrollView style={{ height: 'auto', marginBottom: widthScale(60) }} showsVerticalScrollIndicator={true}>
                {processing && <View style={{ flex: 1, height: heightScale(screenHeight - 200), alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size={widthScale(50)} /></View>}
                {!processing &&
                    <Fragment>
                        <View style={{ display: 'flex', flex: 1, padding: widthScale(10) }}>
                            <View style={{ flex: 1 }}>
                                <Text variant='titleMedium' style={{ marginLeft: widthScale(10) }}>Month</Text>
                                <View style={{ minHeight: widthScale(120), alignItems: 'center' }}>
                                    <FlatList
                                        data={months}
                                        renderItem={(item) => <CircleButton month={selectedMonth} type='month' label={item.item} index={item.index} handleMonth={handleMonth} />}
                                        keyExtractor={(item) => item}
                                        numColumns={7}
                                        style={{ flex: 1 }}
                                        contentContainerStyle={{ paddingVertical: widthScale(20) }}
                                        scrollEnabled={false}
                                    />
                                </View>
                                <Divider style={{ marginVertical: heightScale(10) }} />
                                <Text variant='titleMedium' style={{ marginLeft: widthScale(10) }}>Date</Text>
                                <View style={{ minHeight: widthScale(250), alignItems: 'center' }}>
                                    <FlatList
                                        data={days}
                                        renderItem={(item) => <CircleButton date={selectedDate} type='date' label={item.item.toString()} index={item.index} handleDay={handleDay} />}
                                        numColumns={7}
                                        style={{ flex: 1 }}
                                        contentContainerStyle={{ paddingVertical: widthScale(20) }}
                                        scrollEnabled={false}
                                    />
                                </View>
                                <Divider style={{ marginVertical: heightScale(10) }} />
                                <Text variant='titleMedium' style={{ marginLeft: widthScale(10) }}>Letter/s</Text>
                                <View style={{ height: widthScale(150), alignItems: 'center' }}>
                                    <FlatList
                                        data={["A", "B", "C", "D"]}
                                        renderItem={(item) => <CircleButton letters={selectedLetters} type='letters' label={item.item.toString()} index={item.index} handleLetter={handleLetter} />}
                                        numColumns={2}
                                        style={{ flex: 1 }}
                                        contentContainerStyle={{ paddingVertical: widthScale(10) }}
                                        scrollEnabled={false}
                                    />
                                </View>
                                <Divider style={{ marginVertical: heightScale(10) }} />
                                <Text variant='titleMedium' style={{ marginLeft: widthScale(10) }}>Place Bet</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                    <IconButton icon="minus" onPress={decrementBet} />
                                    <TextInput
                                        mode='outlined'
                                        keyboardType='numeric'
                                        value={bet}
                                        placeholder={bet}
                                        onChangeText={handleBet}
                                        clearTextOnFocus
                                        contentStyle={{ textAlign: 'center' }}
                                    />
                                    <IconButton icon="plus" onPress={incrementBet} />
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignContent: 'center', justifyContent: 'center', marginBottom: heightScale(35), marginTop: 0 }}>
                            {data?.status === 'filled' &&
                                <Button mode='contained' style={{ minWidth: widthScale(120) }} buttonColor={theme.colors.tertiary} onPress={handleClearBet}>CLEAR</Button>
                            }
                            <Button mode='contained' style={{ minWidth: widthScale(120) }} buttonColor={theme.colors.primary} onPress={handleConfirmBet}>CONFIRM</Button>
                        </View>
                    </Fragment>
                }
            </ScrollView>
        </View>
    )
}

export default Calendar2