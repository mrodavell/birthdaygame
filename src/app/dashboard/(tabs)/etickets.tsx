import { View, SafeAreaView, ScrollView, useWindowDimensions, TouchableOpacity } from 'react-native'
import { Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../../../zustand/game';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TTicket } from '../../../types/game';
import dayjs from 'dayjs';
import { Fragment } from 'react';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';
import { FlatList } from 'react-native-gesture-handler';

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
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: heightScale(top), marginBottom: heightScale(bottom), justifyContent: 'flex-start' }}>
            {tickets.length === 0 && <View style={{ minHeight: heightScale(dimensions.height * 0.5), flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name='database-search-outline' size={widthScale(110)} color='gray' />
                <Text style={{ fontSize: moderateWs(20, 1) }}>No tickets available</Text>
            </View>}
            {tickets.length !== 0 &&
                <Fragment>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: heightScale(90) }}>
                        <MaterialCommunityIcons name='qrcode' size={widthScale(20)} style={{ marginRight: widthScale(8) }} />
                        <Text style={{ fontSize: moderateWs(20, 1) }}>
                            Tickets
                        </Text>
                    </View>
                    <Divider style={{ height: 1, marginHorizontal: widthScale(10), marginTop: heightScale(15) }} />
                    <FlatList
                        data={tickets.reverse()}
                        renderItem={({ item, index }) => {
                            return <TouchableOpacity activeOpacity={1} key={`results-${index}`} style={{ marginTop: heightScale(15), marginHorizontal: widthScale(10) }} onPress={() => handleNavigation(item)}>
                                <View>
                                    <Text style={{ fontSize: 18, marginBottom: 5 }}>Date Purchased: {item.datePurchased}</Text>
                                    <List.Item
                                        style={{ padding: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: theme.colors.surface, borderRadius: 5 }}
                                        title={`Serial No.: ${item.serial}`}
                                        left={() => <MaterialCommunityIcons name='qrcode' size={20} />}
                                        right={() => <MaterialCommunityIcons name='chevron-right' size={20} />}
                                    />
                                </View>
                            </TouchableOpacity>
                        }}
                    />
                </Fragment>
            }
        </SafeAreaView>
    )
}