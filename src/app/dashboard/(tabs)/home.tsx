import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Card, Divider, IconButton, Text, TextInput, useTheme } from 'react-native-paper';
import AppBottomSheet from '../../../components/bottomsheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AmountPicker from '../../../components/amountpicker';
import PaymentPicker from '../../../components/paymentpicker';
import Indicator from '../../../components/indicator';
import { useWalletStore } from '../../../zustand/wallet';
import Board from '../../../components/board';
import { useGameStore } from '../../../zustand/game';
import CountDown from '../../../components/countdown';
import { router } from 'expo-router';

export default function Home() {

    const theme = useTheme()
    const dimensions = useWindowDimensions();
    const screenWidth = dimensions.width;
    const { top, bottom } = useSafeAreaInsets();
    const [amount, setAmount] = useState<string>("");
    const [method, setMethod] = useState<string>("");
    const [action, setAction] = useState<string | null>(null);
    const [transacting, setTransacting] = useState<boolean>(false);
    const toggleIndicator = () => setTransacting(prev => !prev)
    const depositRef = useRef<BottomSheetModal>(null);
    const withdrawRef = useRef<BottomSheetModal>(null);
    const paymentApiRef = useRef<BottomSheetModal>(null);

    const wallet = useWalletStore((state) => state.wallet) ?? "0.00";
    const boards = useGameStore((state) => state.boards);
    const totalBet = useGameStore((state) => state.totalBet);
    const draws = useGameStore((state) => state.draws);
    const lockedInBoard = useGameStore((state) => state.lockedInBoards);
    const { deposit, withdraw } = useWalletStore();
    const { getTotal, updateDraws, lockedIn, handleResetBoard } = useGameStore();

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

    const handleCancelAction = () => {
        withdrawRef.current?.close();
        depositRef.current?.close();
        paymentApiRef.current?.close();
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

        if (amount === "") {
            let msg = action === "withdraw" ? "withdrawal" : "deposit";
            handleAlerts(`Please specify the amount of ${msg}`);
            return;
        }

        if (method === "") {
            let msg = action === "withdraw" ? "withdrawal" : "deposit";
            handleAlerts(`Please choose mode of ${msg}`)
            return;
        }

        toggleIndicator()

        setTimeout(() => {
            if (action === "deposit") {
                deposit(parseInt(amount), "Deposit");
            }

            if (action === "withdraw") {
                const myWallet = wallet ?? "0.00";
                if (parseInt(myWallet) < parseInt(amount)) {
                    handleAlerts("Insufficient Wallet Amount")
                }
                withdraw(parseInt(amount), "Withdraw");
            }

            toggleIndicator();
            paymentApiRef.current?.close();
        }, 2000)
    }

    const handLockInBet = () => {
        if (totalBet === 0) {
            handleAlerts("You have not placed any bet");
            return;
        }
        handleConfirmPrompt("This will lock in your bet for the upcoming draw");
    }

    const handleLockedIn = () => {
        lockedIn();
        handleResetBoard();
        router.push('ticket');
    }

    const handleConfirmPrompt = (msg: string) => {
        Alert.alert("Are you sure?", msg, [
            { text: "Cancel", onPress: () => null },
            { text: "Confirm", onPress: () => handleLockedIn() }
        ])
    }

    const handleAlerts = (msg: string) => {
        Alert.alert("Error", msg, [
            { text: 'OK' }
        ])
    }

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: top - 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: dimensions.height }} showsVerticalScrollIndicator={false}>
                <CountDown />
                <Card mode='elevated' elevation={1} style={{ backgroundColor: theme.colors.surface, borderColor: 'gray', borderRadius: 8, minHeight: 100, maxHeight: 120, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <MaterialCommunityIcons name='wallet' size={25} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 25, fontWeight: 'bold' }}>Wallet Balance: {parseFloat(wallet.toString()).toFixed(2)}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: 10, marginBottom: 20, marginTop: 10 }}>
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
                </Card>
                <View style={{ marginHorizontal: 15, marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Draw Date: {dayjs().format('MM/DD/YYYY')} </Text>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 5 }}>
                        <Text style={{ fontSize: 20, }} >No of. Draws:</Text>
                        <IconButton mode='contained' icon="minus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.surface} size={20} onPress={() => updateDraws((draws - 1))} />
                        <View style={{ marginTop: 0 }}>
                            <View style={{ borderWidth: 1, width: 40, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>{draws}</Text>
                            </View>
                        </View>
                        <IconButton mode='contained' icon="plus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.surface} size={20} onPress={() => updateDraws((draws + 1))} />
                    </View>
                </View>
                <View>
                    <ScrollView style={{ maxHeight: 350, marginBottom: 80 }} showsVerticalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row' }}>
                            {totalBet !== 0 &&
                                <Fragment>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 4 }}>
                                        <Text style={{ fontWeight: 'bold', marginLeft: 35, fontSize: 12 }}>Month</Text>
                                        <Text style={{ fontWeight: 'bold', marginLeft: 40, fontSize: 12 }}>Date</Text>
                                        <Text style={{ fontWeight: 'bold', marginLeft: 55, fontSize: 12 }}>Letters</Text>
                                    </View>
                                    <View style={{ justifyContent: 'center', flex: 1 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 12 }}>Bet</Text>
                                    </View>
                                </Fragment>
                            }
                        </View>
                        {boards.map((value, index) => {
                            return <Board key={`board-${index}`} data={value} index={index} />
                        })}
                    </ScrollView>
                </View>
                <View style={{ position: 'absolute', borderTopWidth: 1, borderTopColor: theme.colors.backdrop, bottom: 0, width: screenWidth, marginLeft: -10, borderTopLeftRadius: 8, borderTopRightRadius: 8, paddingTop: 15, paddingBottom: 15, backgroundColor: theme.colors.surface }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, marginHorizontal: 15, marginTop: 5 }}>
                        <Text variant='titleLarge' style={{ marginLeft: 10 }}>
                            Total Bet: {parseFloat(totalBet.toString()).toFixed(2)}
                        </Text>
                        <Button mode='contained' onPress={handLockInBet}>
                            CONFIRM BET
                        </Button>
                    </View>
                </View>
            </ScrollView>
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
                            contentStyle={{ textAlign: 'center' }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>
                            <Button mode='contained' onPress={handleCancelAction} buttonColor={theme.colors.tertiary}>Cancel</Button>
                            <Button mode='contained' onPress={handlePaymentOptions} disabled={parseInt(amount) < 0}>Next</Button>
                        </View>
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
                            contentStyle={{ textAlign: 'center' }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 4 }}>
                            <Button mode='contained' onPress={handleCancelAction} buttonColor={theme.colors.tertiary}>Cancel</Button>
                            <Button mode='contained' onPress={handlePaymentOptions} disabled={parseInt(wallet) < parseInt(amount)}>Next</Button>
                        </View>
                    </View>
                </View>
            </AppBottomSheet>
            <AppBottomSheet ref={paymentApiRef}>
                <View style={{ padding: 10 }}>
                    <View style={{ alignItems: 'center', marginVertical: 8, flexDirection: 'row', }}>
                        <IconButton icon="arrow-left" onPress={handleBack} style={{ marginLeft: 20 }} />
                        <Text variant='titleMedium' style={{ marginLeft: 40 }}>Choose Mode of {action === "withdraw" ? "Withdrawal" : "Deposit"}</Text>
                    </View>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Text variant='titleLarge'>Amount: P{amount}</Text>
                        <Divider />
                    </View>
                    <View>
                        <PaymentPicker handlePick={handleMethodSelect} />
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <Button mode='contained' style={{ height: 50, justifyContent: 'center' }} labelStyle={{ fontSize: 20 }} onPress={handleComplete}>CONFIRM</Button>
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