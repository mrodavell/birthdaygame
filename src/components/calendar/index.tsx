import { View, FlatList, Alert } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Dates } from '../../constants/Dates';
import CircleButton from '../circlebutton';
import { Button, Divider, IconButton, Modal, Portal, Text, TextInput, useTheme } from 'react-native-paper';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useWalletStore } from '../../zustand/wallet';
import { TBet, TBoard } from '../../types/game';
import { useGameStore } from '../../zustand/game';

type TCalendarProps = {
    title?: string,
    data?: TBoard,
    visible: boolean,
    index: number,
    onDismiss: () => void;
}


const Calendar: FC<TCalendarProps> = ({
    title,
    data,
    visible = false,
    index,
    onDismiss
}) => {

    const theme = useTheme()
    const containerStyle = { backgroundColor: 'white', padding: 10, margin: 20, height: 810 };
    const wallet = useWalletStore((state) => state.wallet);
    const { betDeduction } = useWalletStore();
    const { handleBoards, getTotal, clear } = useGameStore();

    const [bet, setBet] = useState<string>("10.00");
    const [selectedMonth, setSelectedMonth] = useState<string | null>("01");
    const [monthIndex, setMonthIndex] = useState<number>(0);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

    const months = Dates.months;
    const days = Array.from({ length: Dates.days[monthIndex] }, (v, i) => i + 1)

    useEffect(() => {
        const oldBet = data?.bet ?? "10.00";
        setSelectedMonth(data?.combination.month ?? "01");
        setSelectedDate(data?.combination.date ?? null);
        setSelectedLetters(data?.combination.letters ?? []);
        setBet(oldBet === "" ? "10.00" : oldBet);
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

        if (bet === "") {
            handleAlerts("Please specify bet");
            return;
        }

        const myWallet = wallet ?? "0.00";

        if (parseInt(myWallet) < parseInt(bet)) {
            handleAlerts("Insufficient Funds");
            return;
        }

        if (parseInt(bet) < 1 || parseInt(bet) > 20) {
            handleAlerts("Minimum bet is 1 and maximum is 20");
            return;
        }

        setBet(bet);
    }

    const handleDismiss = () => {
        handleClear();
        if (onDismiss) {
            onDismiss()
        }
    }
    const handleClear = () => {
        setBet("");
        setSelectedMonth("")
        setSelectedDate("")
        setSelectedLetters([])
    }

    const incrementBet = () => {
        if (parseInt(bet) > 20) return;

        const newBet = parseInt(bet) + 1;
        handleBet(parseFloat(newBet.toString()).toFixed(2))
    }

    const decrementBet = () => {
        if (parseInt(bet) < 1) return;

        const newBet = parseInt(bet) - 1;
        handleBet(parseFloat(newBet.toString()).toFixed(2))
    }

    const handleConfirmBet = () => {
        let message = ""

        if (selectedLetters.length === 0) {
            message = "Please select letters";
        }

        if (bet === "") {
            message = "Please input bet";
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
        const data: TBet = {
            board: title ?? '',
            bet: parseInt(bet),
            combination: {
                month: selectedMonth ?? '',
                date: selectedDate ?? '',
                letters: selectedLetters
            }
        }
        let calculatedBet = 0;
        if (parseInt(data?.bet.toString()) > parseInt(bet)) {
            calculatedBet = parseInt(data?.bet.toString()) - parseInt(bet)
        }
        handleBoards(data, index);

        if (data.combination.date !== "") {
            betDeduction(parseInt(bet));
        }
        getTotal();
        handleDismiss()
    }

    const handleClearBet = () => {

    }

    const handleConfirmPrompt = (msg: string) => {
        Alert.alert("Are you sure?", msg, [
            { text: "Cancel", onPress: () => null },
            { text: "Confirm", onPress: () => handleAddBet() }
        ])
    }

    const handleAlerts = (msg: string) => {
        Alert.alert("Error", msg, [
            { text: 'OK' }
        ])
    }




    return (
        <Portal>
            <Modal visible={visible} onDismiss={handleDismiss} contentContainerStyle={containerStyle}>
                <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                    <Text variant='titleLarge'>Board {title}</Text>
                    <IconButton icon="close" onPress={handleDismiss} />
                </View>
                <ScrollView style={{ maxHeight: 850 }}>
                    <View style={{ display: 'flex', flex: 1, padding: 10 }}>
                        <View style={{ flex: 1 }}>
                            <Text variant='titleMedium'>Months</Text>
                            <View style={{ minHeight: 120, alignItems: 'center' }}>
                                <FlatList
                                    data={months}
                                    renderItem={(item) => <CircleButton month={selectedMonth} type='month' label={item.item} index={item.index} handleMonth={handleMonth} />}
                                    keyExtractor={(item) => item}
                                    numColumns={7}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ paddingVertical: 20 }}
                                    scrollEnabled={false}
                                />
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <Text variant='titleMedium'>Date</Text>
                            <View style={{ minHeight: 270, alignItems: 'center' }}>
                                <FlatList
                                    data={days}
                                    renderItem={(item) => <CircleButton date={selectedDate} type='date' label={item.item.toString()} index={item.index} handleDay={handleDay} />}
                                    numColumns={7}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ paddingVertical: 20 }}
                                    scrollEnabled={false}
                                />
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <Text variant='titleMedium'>Letters</Text>
                            <View style={{ height: 70, alignItems: 'center' }}>
                                <FlatList
                                    data={["A", "B", "C", "D"]}
                                    renderItem={(item) => <CircleButton letters={selectedLetters} type='letters' label={item.item.toString()} index={item.index} handleLetter={handleLetter} />}
                                    numColumns={4}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{ paddingVertical: 20 }}
                                    scrollEnabled={false}
                                />
                            </View>
                            <Divider style={{ marginVertical: 10 }} />
                            <Text variant='titleMedium'>Place Bet</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Button onPress={decrementBet} mode='outlined' style={{ margin: 10 }} contentStyle={{ justifyContent: 'center', alignItems: "center" }}><MaterialCommunityIcons name='minus' size={20} /></Button>
                                <TextInput
                                    mode='outlined'
                                    keyboardType='numeric'
                                    value={bet}
                                    placeholder={bet}
                                    onChangeText={handleBet}
                                    style={{ flex: 1 }}
                                    contentStyle={{ textAlign: 'center' }}
                                />
                                <Button onPress={incrementBet} mode='outlined' style={{ margin: 10 }} contentStyle={{ justifyContent: 'center', alignItems: "center" }}> <MaterialCommunityIcons name='plus' size={20} /></Button>
                            </View>
                        </View>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10, alignContent: 'center', justifyContent: 'center', marginBottom: 15, marginTop: 20 }}>
                        <Button mode='contained' style={{ minWidth: 120 }} buttonColor={theme.colors.tertiary} onPress={handleConfirmBet}>Clear Bet</Button>
                        <Button mode='contained' style={{ minWidth: 120 }} buttonColor={theme.colors.primary} onPress={handleConfirmBet}>Confirm Bet</Button>
                    </View>
                </ScrollView>
            </Modal>
        </Portal>

    )
}

export default Calendar