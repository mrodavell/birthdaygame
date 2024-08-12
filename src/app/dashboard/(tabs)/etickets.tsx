import { View, SafeAreaView, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
import { Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../../../zustand/game';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TTicket } from '../../../types/game';
import dayjs from 'dayjs';
import { Fragment } from 'react';

export default function eticket() {
    const router = useRouter();
    const { bottom, top } = useSafeAreaInsets()
    const dimensions = useWindowDimensions();
    const theme = useTheme();
    const tickets = useGameStore((state) => state.tickets);

    const handleNavigation = (value: TTicket) => {
        router.push({ pathname: 'ticketdetails', params: { ...value, boards: value.boards as string } });
    }

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: top, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: dimensions.height }} showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, padding: 10, marginTop: 20 }}>
                    {tickets.length === 0 && <View style={{ minHeight: dimensions.height * 0.5, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 20 }}>No tickets to view</Text>
                    </View>}
                    {tickets.length !== 0 && <Fragment>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                            <MaterialCommunityIcons name='qrcode' size={20} style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 20 }}>
                                Tickets Log
                            </Text>
                        </View>
                        <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10 }} />
                    </Fragment>}
                    {tickets.reverse().map((value, index) => {
                        return <TouchableOpacity activeOpacity={1} key={`results-${index}`} style={{ marginTop: 15 }} onPress={() => handleNavigation(value)}>
                            <View>
                                <Text style={{ fontSize: 18, marginBottom: 5 }}>Date Purchased: {value.datePurchased}</Text>
                                <List.Item
                                    style={{ padding: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: theme.colors.surface, borderRadius: 5 }}
                                    title={`Serial No.: ${value.serial}`}
                                    left={() => <MaterialCommunityIcons name='qrcode' size={20} />}
                                    right={() => <MaterialCommunityIcons name='chevron-right' size={20} />}
                                />
                            </View>
                        </TouchableOpacity>
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}