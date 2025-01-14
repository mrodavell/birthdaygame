import { Alert, BackHandler, ScrollView, useWindowDimensions, View, Keyboard } from 'react-native';
import React, { Fragment, useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, Button, Card, IconButton, Modal, Text, TextInput, useTheme } from 'react-native-paper';
import AmountPicker from '../../../components/amountpicker';
import PaymentPicker from '../../../components/paymentpicker';
import Indicator from '../../../components/indicator';
import { useWalletStore } from '../../../zustand/wallet';
import Board from '../../../components/board';
import { useGameStore } from '../../../zustand/game';
import CountDown from '../../../components/countdown';
import { router } from 'expo-router';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';
import DrawTime from '../../../components/drawtime';
import { supabase } from '../../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatToPHP } from '../../../helpers/format';

export default function Home() {

    const theme = useTheme()
    const dimensions = useWindowDimensions();
    const screenWidth = dimensions.width;
    const { bottom } = useSafeAreaInsets();
    const [withdrawAmount, setWithdrawAmount] = useState<string>("");
    const [depositAmount, setDepositAmount] = useState<string>("");
    const [method, setMethod] = useState<string>("");
    const [action, setAction] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(false);
    const toggleIndicator = () => setLoading(prev => !prev)
    const wallet = useWalletStore((state) => state.wallet) ?? "0.00";
    const boards = useGameStore((state) => state.boards);
    const totalBet = useGameStore((state) => state.totalBet);
    const selectedDrawTime = useGameStore((state) => state.selectedDrawTime);
    const isOpenBet = useGameStore((state) => state.isOpenBet);
    const { deposit, withdraw, fetchWallet } = useWalletStore();
    const { lockedIn, handleResetBoard, setIsOpenBet } = useGameStore();
    const fetchingWallet = useWalletStore((state) => state.fetching);
    const [depositModal, setDepositModal] = useState<boolean>(false);
    const toggleDepositModal = () => setDepositModal(prev => !prev);
    const [withdrawModal, setWithdrawModal] = useState<boolean>(false);
    const toggleWithdrawModal = () => setWithdrawModal(prev => !prev);
    const [paymentOptionModal, setPaymentOptionModal] = useState<boolean>(false);
    const togglePaymentOptionModal = () => setPaymentOptionModal(prev => !prev);

    const handleOpenBet = async (payload: any) => {
        await AsyncStorage.setItem('is_open_betting', payload.new.is_open_betting?.toString() ?? "false");
        setIsOpenBet(payload.new.is_open_betting ?? false)
    }

    supabase
        .channel('setup')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'setup' }, handleOpenBet)
        .subscribe()

    const handleWithdrawAmountSelect = (amount: string) => {
        const myWallet = wallet ?? "0";

        if (parseInt(myWallet) < parseInt(amount)) {
            handleAlerts("Insufficient Wallet Balance")
            return;
        }

        setWithdrawAmount(amount);
    }

    const handleDepositAmountSelect = (amount: string) => {
        setDepositAmount(amount);
    }

    const handleMethodSelect = (method: string) => {
        if (method === "") {
            return;
        }

        setMethod(method);
    }

    const handlePaymentOptions = () => {

        if (action === "deposit") {
            if (depositAmount === "" || parseInt(depositAmount) === 0) {
                handleAlerts("Please specify amount to deposit")
                return;
            }
        }

        if (action === "withdraw") {
            if (parseInt(wallet) < parseInt(withdrawAmount)) {
                handleAlerts("Insufficient Wallet Balance")
                return;
            }

            if (withdrawAmount === "0" || parseInt(withdrawAmount) === 0) {
                handleAlerts("Please specify amount to withdraw")
                return;
            }
        }

        Keyboard.dismiss();
        setPaymentOptionModal(true);
    }

    const handleCancelAction = () => {
        setDepositAmount("0");
        setWithdrawAmount("0");
        setMethod("");
        setDepositModal(false);
        setWithdrawModal(false);
        setPaymentOptionModal(false);
    }

    const handleBack = () => {
        togglePaymentOptionModal();
        setMethod("");
        if (action === "deposit") {
            setDepositModal(true);
        } else {
            setWithdrawModal(true);
        }
    }

    const handleComplete = async () => {
        try {

            toggleIndicator()

            const amount = action === "withdraw" ? withdrawAmount : depositAmount;

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

            if (action === "deposit") {
                deposit(parseInt(amount), "Deposit");
                setDepositAmount("0");
                Alert.alert("Deposit Successful", `You have successfully deposited P${amount}`, [{ text: 'OK' }]);
            }

            if (action === "withdraw") {
                const myWallet = wallet ?? "0.00";
                if (parseInt(myWallet) < parseInt(amount)) {
                    handleAlerts("Insufficient Wallet Amount")
                }
                withdraw(parseInt(amount), "Withdraw");
                setWithdrawAmount("0");
                Alert.alert("Withdrawal Successful", `You have successfully withdrawn P${amount}`, [{ text: 'OK' }]);
            }

            setDepositModal(false);
            setWithdrawModal(false);
            setPaymentOptionModal(false);

        } catch (error: any) {
            Alert.alert(`Error on ${action === 'withdraw' ? 'withdraw' : 'deposit'} transaction`, error.message, [{ text: 'OK' }]);
        } finally {
            toggleIndicator();
        }
    }

    const handLockInBet = () => {
        if (!isOpenBet) {
            handleAlerts("Betting is currently closed");
            return;
        }

        if (totalBet === 0) {
            handleAlerts("You have not placed any bet");
            return;
        }

        if (selectedDrawTime.length === 0) {
            handleAlerts("Please select draw time");
            return;
        }

        if (parseFloat(wallet) < parseFloat(totalBet.toString())) {
            handleAlerts("Insufficient Wallet Balance");
            return;
        }

        handleConfirmPrompt("This will lock in your bet for the upcoming draw");
    }

    const handleLockedIn = async () => {
        lockedIn(totalBet);
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

    const handleFocus = () => {
        if (withdrawAmount === "0" && action === "withdraw") {
            setWithdrawAmount(""); // Clear the value if it is "0"
        }

        if (depositAmount === "0" && action === "deposit") {
            setDepositAmount(""); // Clear the value if it is "0"
        }
    };

    const handleRefreshWallet = async () => {
        try {
            setFetching(true);
            fetchWallet();
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }])
        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        const onBackPress = () => {
            Alert.alert(
                'Exit App',
                'Do you want to exit?',
                [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            // Do nothing
                        },
                        style: 'cancel',
                    },
                    { text: 'YES', onPress: () => BackHandler.exitApp() },
                ],
                { cancelable: false }
            );

            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            onBackPress
        );

        return () => backHandler.remove();
    }, [])

    useEffect(() => {
        fetchWallet();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: widthScale(10), marginBottom: bottom, justifyContent: 'flex-start' }}>
            {isOpenBet &&
                <View style={{ marginTop: widthScale(70), height: widthScale(35) }}>
                    <CountDown />
                </View>
            }
            <Card
                mode='elevated'
                elevation={1}
                style={{
                    backgroundColor: theme.colors.surface,
                    borderColor: 'gray',
                    padding: widthScale(5),
                    borderRadius: widthScale(8),
                    minHeight: heightScale(65),
                    maxHeight: heightScale(70),
                    marginTop: isOpenBet ? widthScale(10) : widthScale(70),
                    marginHorizontal: widthScale(5),
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', flex: 1, width: '100%' }}>
                    <View style={{ flex: 2.2, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.primary, borderRadius: 10 }}>
                        <MaterialCommunityIcons name='wallet' size={moderateWs(45, 1)} style={{ marginRight: widthScale(10), color: 'white' }} />
                    </View>
                    <View style={{ flex: 7, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: widthScale(10) }}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                            <Text style={{ fontSize: moderateWs(16, 1), fontWeight: 'bold', color: 'gray' }}>Wallet Balance</Text>
                        </View>
                        {fetchingWallet &&
                            <View style={{ flexDirection: 'row' }}>
                                <ActivityIndicator animating={true} style={{ marginRight: widthScale(10) }} size={moderateWs(15, 1)} />
                                <Text>Loading wallet balance...</Text>
                            </View>
                        }
                        {!fetchingWallet &&
                            <Text style={{ fontSize: moderateWs(20, 1), fontWeight: 'bold' }}>{formatToPHP(wallet.toString())}</Text>
                        }
                    </View>
                    <View style={{ flex: 2, justifyContent: 'center' }}>
                        {fetching &&
                            <ActivityIndicator animating={true} size={widthScale(25)} color={theme.colors.primary} />
                        }
                        {!fetching &&
                            <IconButton size={widthScale(30)} icon="refresh" onPress={() => handleRefreshWallet()} iconColor={theme.colors.primary} />
                        }
                    </View>
                </View>
            </Card>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', gap: heightScale(8), marginBottom: heightScale(10), marginTop: heightScale(10) }}>
                <Button
                    mode='contained'
                    style={{ flex: 1, backgroundColor: theme.colors.tertiary }}
                    contentStyle={{ height: widthScale(38), alignItems: 'center', justifyContent: 'center' }}
                    // onPress={handleDepositBottomSheet}
                    onPress={() => {
                        setAction("deposit");
                        toggleDepositModal();
                    }}
                >
                    <Text style={{ color: 'white', fontSize: moderateWs(12, 1) }}>
                        DEPOSIT
                    </Text>
                </Button>
                <Button
                    mode='contained'
                    style={{ flex: 1, backgroundColor: 'blue' }}
                    contentStyle={{ height: widthScale(38), alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        setAction("withdraw");
                        toggleWithdrawModal();
                    }}
                >
                    <Text style={{ color: 'white', fontSize: moderateWs(12, 1) }}>
                        WITHDRAW
                    </Text>
                </Button>
            </View>
            <View style={{ height: heightScale(100), marginHorizontal: widthScale(15), alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: widthScale(5), borderRadius: widthScale(10) }}>
                    <MaterialCommunityIcons name='calendar' size={widthScale(15)} color={theme.colors.tertiary} />
                    <Text style={{ fontSize: moderateWs(14, 1), fontWeight: 'bold', color: 'black', marginLeft: widthScale(5) }}>Draw Date: {dayjs().format('MM/DD/YYYY')} </Text>
                </View>
                <Text>Pick 1 or multiple active draw time</Text>
                <DrawTime isOpenBet={isOpenBet} />
            </View>
            <View style={{ flexDirection: 'row' }}>
                {totalBet !== 0 &&
                    <Fragment>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', flex: 4 }}>
                            <Text style={{ fontWeight: 'bold', marginLeft: widthScale(20), fontSize: moderateWs(12, 1) }}>Month</Text>
                            <Text style={{ fontWeight: 'bold', marginLeft: widthScale(30), fontSize: moderateWs(12, 1) }}>Date</Text>
                            <Text style={{ fontWeight: 'bold', marginLeft: widthScale(40), fontSize: moderateWs(12, 1) }}>Letters</Text>
                        </View>
                        <View style={{ justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: moderateWs(12, 1) }}>Bet</Text>
                        </View>
                    </Fragment>
                }
            </View>
            <ScrollView style={{ marginBottom: heightScale(80) }} showsVerticalScrollIndicator={true}>
                {boards.map((value, index) => {
                    return <Board key={`board-${index}`} data={value} index={index} isOpenBet={isOpenBet} />
                })}
            </ScrollView>
            <View style={{ position: 'absolute', borderTopWidth: 1, borderTopColor: theme.colors.backdrop, bottom: 0, width: screenWidth, borderTopLeftRadius: widthScale(8), borderTopRightRadius: widthScale(8), paddingTop: widthScale(5), paddingBottom: widthScale(15), backgroundColor: theme.colors.surface }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexGrow: 1, marginHorizontal: widthScale(15), marginTop: heightScale(5) }}>
                    <Text variant='titleLarge' style={{ marginLeft: widthScale(10), fontSize: moderateWs(18, 1), fontWeight: 'bold' }}>
                        Total Bet: {parseFloat(totalBet.toString()).toFixed(2)}
                    </Text>
                    <Button
                        mode='contained'
                        onPress={handLockInBet}
                        style={{ width: widthScale(140) }}
                        labelStyle={{ fontSize: moderateWs(12, 1) }}
                    >
                        CONFIRM BET
                    </Button>
                </View>

            </View>
            {depositModal &&
                <Modal onDismiss={toggleDepositModal} visible={depositModal}>
                    <View style={{
                        padding: widthScale(10),
                        paddingVertical: widthScale(20),
                        backgroundColor: theme.colors.surface,
                        margin: widthScale(10),
                        borderRadius: widthScale(8)
                    }}>
                        <View style={{ alignItems: 'center', marginVertical: heightScale(8), flexDirection: 'row', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name='wallet' size={moderateWs(20, 1)} style={{ marginRight: 10 }} />
                            <Text variant='titleLarge' style={{ fontSize: moderateWs(18, 1) }}>DEPOSIT</Text>
                        </View>
                        <View style={{ marginHorizontal: widthScale(20) }}>
                            <AmountPicker amount={depositAmount} handlePick={handleDepositAmountSelect} />
                            <TextInput
                                value={depositAmount}
                                onChangeText={(text) => setDepositAmount(text)}
                                onFocus={handleFocus}
                                keyboardType='numeric'
                                mode='outlined'
                                placeholder='Enter Amount'
                                style={{ marginVertical: heightScale(20), height: heightScale(40) }}
                                contentStyle={{ textAlign: 'center' }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: widthScale(4) }}>
                                <Button
                                    mode='contained'
                                    onPress={handleCancelAction}
                                    contentStyle={{ minWidth: widthScale(80) }}
                                    buttonColor={theme.colors.tertiary}
                                >
                                    Cancel
                                </Button>
                                <Button mode='contained' onPress={handlePaymentOptions} contentStyle={{ minWidth: widthScale(80) }}>Next</Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
            {withdrawModal &&
                <Modal onDismiss={toggleWithdrawModal} visible={withdrawModal}>
                    <View style={{
                        padding: widthScale(10),
                        paddingVertical: widthScale(20),
                        backgroundColor: theme.colors.surface,
                        margin: widthScale(10),
                        borderRadius: widthScale(8)
                    }}>
                        <View style={{ alignItems: 'center', marginVertical: heightScale(8), flexDirection: 'row', justifyContent: 'center' }}>
                            <MaterialCommunityIcons name='wallet' size={moderateWs(20, 1)} style={{ marginRight: 10 }} />
                            <Text variant='titleLarge' style={{ fontSize: moderateWs(18, 1) }}>WITHDRAW</Text>
                        </View>
                        <View style={{ marginHorizontal: widthScale(20) }}>
                            <AmountPicker amount={withdrawAmount} handlePick={handleWithdrawAmountSelect} />
                            <TextInput
                                value={withdrawAmount}
                                onChangeText={(text) => setWithdrawAmount(text)}
                                onFocus={handleFocus}
                                keyboardType='numeric'
                                mode='outlined'
                                placeholder='Enter Amount'
                                style={{ marginVertical: heightScale(20), height: heightScale(40) }}
                                contentStyle={{ textAlign: 'center' }}
                            />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: widthScale(4) }}>
                                <Button
                                    mode='contained'
                                    onPress={handleCancelAction}
                                    contentStyle={{ minWidth: widthScale(80) }}
                                    buttonColor={theme.colors.tertiary}
                                >
                                    Cancel
                                </Button>
                                <Button mode='contained' onPress={handlePaymentOptions} contentStyle={{ minWidth: widthScale(80) }}>Next</Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
            {paymentOptionModal &&
                <Modal onDismiss={togglePaymentOptionModal} visible={paymentOptionModal}>
                    <View style={{
                        padding: widthScale(10),
                        paddingVertical: widthScale(20),
                        backgroundColor: theme.colors.surface,
                        margin: widthScale(10),
                        borderRadius: widthScale(8),
                        minHeight: heightScale(350)
                    }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: widthScale(8), flexDirection: 'row', }}>
                            <Text variant='titleMedium'>Choose Mode of {action === "withdraw" ? "Withdrawal" : "Deposit"}</Text>
                        </View>
                        <View style={{ alignItems: 'center', marginBottom: widthScale(10) }}>
                            <Text style={{ fontSize: moderateWs(18, 1) }}>
                                Amount: P {action === "withdraw" ? withdrawAmount : depositAmount}
                            </Text>
                        </View>
                        <View>
                            <PaymentPicker handlePick={handleMethodSelect} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: widthScale(20) }}>
                                <Button
                                    mode='contained'
                                    style={{ height: heightScale(35), justifyContent: 'center', minWidth: widthScale(100) }}
                                    labelStyle={{ fontSize: moderateWs(12, 1) }}
                                    onPress={handleBack}
                                    buttonColor={theme.colors.tertiary}
                                >
                                    BACK
                                </Button>
                                <Button
                                    mode='contained'
                                    style={{ height: heightScale(35), justifyContent: 'center', minWidth: widthScale(100) }}
                                    labelStyle={{ fontSize: moderateWs(12, 1) }}
                                    onPress={handleComplete}
                                >
                                    CONFIRM
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            }
            {
                loading &&
                <Indicator visible={loading} onDismiss={toggleIndicator}>
                    <ActivityIndicator size={widthScale(50)} />
                </Indicator>
            }
        </SafeAreaView >
    )
}