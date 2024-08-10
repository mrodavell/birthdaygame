import { View, Text, SafeAreaView, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGameStore } from '../../zustand/game';
import { Divider, List, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletStore } from '../../zustand/wallet';
import dayjs from 'dayjs';

export default function transactions() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();

    const transactions = useWalletStore((state) => state.transactions);
    const { setTransactions } = useWalletStore();

    const getTransactions = async () => {
        const transactions = await AsyncStorage.getItem('transactions') ?? "";
        if (transactions === "") {
            return;
        }
        setTransactions(JSON.parse(transactions ?? ""));
    }

    React.useEffect(() => {
        getTransactions();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 10, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View style={{ flex: 1, padding: 10, marginTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <MaterialCommunityIcons name='history' size={20} style={{ marginRight: 8 }} />
                        <Text style={{ fontSize: 20 }}>
                            Transaction History
                        </Text>
                    </View>
                    <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10 }} />
                    {transactions.length === 0 && <View style={{ minHeight: dimensions.height * 0.5, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>No transactions to view</Text>
                    </View>}
                    {transactions.reverse().map((value, index) => {
                        return <TouchableOpacity activeOpacity={1} key={`results-${index}`} style={{ marginTop: 15 }}>
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <MaterialCommunityIcons name='calendar' size={18} style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 18, marginBottom: 5 }}>{dayjs(value.date).format('DD-MMM-YYYY h:m A')}</Text>
                                </View>
                                <List.Item
                                    style={{ padding: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: theme.colors.surface, borderRadius: 5 }}
                                    title={`Transaction: ${value.type}`}
                                    description={`Amount: ${value.amount}`}
                                />
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}