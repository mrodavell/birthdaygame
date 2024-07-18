import { Alert, ScrollView, View } from 'react-native';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, IconButton, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import { TBoard } from '../../../../types/game';
import AppBottomSheet from '../../../../components/bottomsheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AmountPicker from '../../../../components/amountpicker';
import PaymentPicker from '../../../../components/paymentpicker';
import AppModal from '../../../../components/modal';
import Indicator from '../../../../components/indicator';
import { useWalletStore } from '../../../../zustand/wallet';
import Board from '../../../../components/board';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useGameStore } from '../../../../zustand/game';

export default function Home() {

    const theme = useTheme()
    const { bottom } = useSafeAreaInsets();
    const [amount, setAmount] = useState<string>("");
    const [method, setMethod] = useState<string>("");
    const [action, setAction] = useState<string | null>(null);
    const [draws, setDraws] = useState<number>(1);
    const [transacting, setTransacting] = useState<boolean>(false);
    const toggleIndicator = () => setTransacting(prev => !prev)
    const depositRef = useRef<BottomSheetModal>(null);
    const withdrawRef = useRef<BottomSheetModal>(null);
    const paymentApiRef = useRef<BottomSheetModal>(null);

    const wallet = useWalletStore((state) => state.wallet) ?? "0.00";
    const boards = useGameStore((state) => state.boards);
    const totalBet = useGameStore((state) => state.totalBet);
    const { deposit, withdraw } = useWalletStore();
    const { getTotal } = useGameStore();

    const handleAmountSelect = (amount: string) => {
        if (amount === "") {
            setAmount("0");
            return;
        }

        if (action === "withdraw") {
            const myWallet = wallet ?? "0.00";
            if (parseInt(myWallet) < parseInt(amount)) {
                handleAlerts("Insufficient Wallet Balance")
                return;
            }
        }

        setAmount(amount);
    }

    const handleMethodSelect = (method: string) => {
        if (method === "") {
            return;
        }

        setMethod(method);
    }

    const handleWithdrawBottomSheet = () => {
        setAction("withdraw");
        depositRef.current?.close();
        withdrawRef.current?.present();
    }

    const handleDepositBottomSheet = () => {
        setAction("deposit");
        withdrawRef.current?.close();
        depositRef.current?.present()
    }

    const handlePaymentOptions = () => {

        if (amount === "") {
            handleAlerts("Please specify amount")
            return;
        }

        withdrawRef.current?.close();
        depositRef.current?.close();
        paymentApiRef.current?.present();
    }

    const handleBack = () => {
        paymentApiRef.current?.close();
        if (action === "deposit") {
            depositRef.current?.present()
        } else {
            withdrawRef.current?.present();
        }
    }

    const handleComplete = () => {

        if (amount === "" || method === "") {
            handleAlerts("Please choose a payment method")
            return;
        }

        toggleIndicator()

        setTimeout(() => {
            if (action === "deposit") {
                deposit(parseInt(amount));
            }

            if (action === "withdraw") {
                const myWallet = wallet ?? "0.00";
                if (parseInt(myWallet) < parseInt(amount)) {
                    handleAlerts("Insufficient Wallet Amount")
                }
                withdraw(parseInt(amount));
            }

            toggleIndicator();
            paymentApiRef.current?.close();
        }, 3000)
    }

    const handleChangeDraws = (text: string) => {
        if (text === "") return;
        if (parseInt(text) > 6) {
            handleAlerts("Max draw is only 6")
        }

        setDraws(parseInt(text));
    }

    const handleAlerts = (msg: string) => {
        Alert.alert("Error", msg, [
            { text: 'OK' }
        ])
    }

    useEffect(() => {
        getTotal()
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 40, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <View style={{ marginBottom: 30 }}>
                <View style={{ flex: 1, borderWidth: 2, borderColor: 'gray', borderRadius: 8, minHeight: 120 }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <MaterialCommunityIcons name='wallet' size={25} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Wallet Balance: {parseFloat(wallet.toString()).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 20, gap: 10, marginBottom: 20 }}>
                            <Button mode='contained' style={{ flex: 1, backgroundColor: theme.colors.tertiary }} onPress={handleDepositBottomSheet}>
                                <Text style={{ color: 'white', fontSize: 15 }}>
                                    Deposit
                                </Text>
                            </Button>
                            <Button mode='contained' style={{ flex: 1, backgroundColor: theme.colors.secondary }} onPress={handleWithdrawBottomSheet}>
                                <Text style={{ color: 'white', fontSize: 15 }}>
                                    Withdraw
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <View style={{ marginHorizontal: 15, marginTop: 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialCommunityIcons name='calendar' size={20} style={{ marginRight: 10 }} />
                        <Text variant='titleMedium'>Draw Date: {dayjs().format('MM/DD/YYYY')} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                        <Text>No of. Draws:</Text>
                        <View style={{ marginLeft: 5 }}>
                            <TextInput keyboardType='numeric' onChangeText={(text) => handleChangeDraws(text)} placeholder={draws.toString()} mode='outlined' style={{ height: 30 }} contentStyle={{ textAlign: 'center' }} />
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ marginLeft: 8, fontWeight: 'bold' }}>Boards</Text>
                    <ScrollView style={{ maxHeight: 500 }}>
                        {boards.map((value, index) => {
                            return <Board key={`board-${index}`} data={value} index={index} />
                        })}
                    </ScrollView>
                    <View style={{ marginTop: 20, marginHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant='titleLarge'>
                            Total Bet: {parseFloat(totalBet.toString()).toFixed(2)}
                        </Text>
                        <Button mode='contained'>
                            CONFIRM BET
                        </Button>
                    </View>
                </View>
            </View>
            <AppBottomSheet ref={depositRef}>
                <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                        <Text variant='titleLarge'>Deposit</Text>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <AmountPicker amount={amount} handlePick={handleAmountSelect} />
                        <TextInput
                            value={amount?.toString()}
                            onChangeText={(text: string) => handleAmountSelect(text)}
                            keyboardType='numeric'
                            mode='outlined'
                            placeholder='Enter Amount'
                            style={{ marginVertical: 20 }}
                        />
                        <Button mode='contained' onPress={handlePaymentOptions}>Submit</Button>
                    </View>
                </View>
            </AppBottomSheet>
            <AppBottomSheet ref={withdrawRef}>
                <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', marginVertical: 8 }}>
                        <Text variant='titleLarge'>Withdraw</Text>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <AmountPicker handlePick={handleAmountSelect} />
                        <TextInput
                            value={amount?.toString()}
                            onChangeText={(text: string) => handleAmountSelect(text)}
                            keyboardType='numeric'
                            mode='outlined'
                            placeholder='Enter Amount'
                            style={{ marginVertical: 20 }}
                        />
                        <Button mode='contained' onPress={handlePaymentOptions} disabled={parseInt(wallet) < parseInt(amount)}>Submit</Button>
                    </View>
                </View>
            </AppBottomSheet>
            <AppBottomSheet ref={paymentApiRef}>
                <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', marginVertical: 8, flexDirection: 'row', }}>
                        <IconButton icon="arrow-left" onPress={handleBack} style={{ marginLeft: 20 }} />
                        <Text variant='titleMedium' style={{ marginLeft: 40 }}>Choose Payment Method</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Text variant='titleLarge'>Amount: P{amount}</Text>
                    </View>
                    <View>
                        <PaymentPicker handlePick={handleMethodSelect} />
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Button mode='contained' style={{ height: 50, justifyContent: 'center' }} labelStyle={{ fontSize: 20 }} onPress={handleComplete}>Complete Transaction</Button>
                        </View>
                    </View>
                </View>
            </AppBottomSheet>
            {transacting &&
                <Indicator visible={transacting} onDismiss={toggleIndicator}>
                    <ActivityIndicator size={50} />
                </Indicator>
            }
        </SafeAreaView>
    )
}