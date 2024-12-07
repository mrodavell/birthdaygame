import { View, SafeAreaView, useWindowDimensions, TouchableOpacity, Alert } from 'react-native'
import { ActivityIndicator, Button, Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TTicket } from '../../../types/game';
import { useEffect, useState } from 'react';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { supabase } from '../../../lib/supabase';
import dayjs from 'dayjs';

export default function eticket() {
    const router = useRouter();
    const { top } = useSafeAreaInsets()
    const dimensions = useWindowDimensions();
    const theme = useTheme();
    const [tickets, setTickets] = useState<TTicket[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(9);
    const [ticketCount, setTicketCount] = useState<number>(0);

    const handleNavigation = (value: TTicket) => {
        router.push({ pathname: 'ticketdetails', params: { ...value } });
    }

    const getTicketsCount = async () => {
        try {
            const user = await supabase.auth.getUser();
            const { count, error } = await supabase
                .from('tickets')
                .select('*', { count: 'exact', head: true })
                .eq('userid', user.data.user?.id)


            if (error) {
                throw error;
            }

            setTicketCount(count ?? 0);

        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        }
    }

    const getTickets = async () => {
        try {
            setLoading(true);
            setStart(0);
            setEnd(9);
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('tickets').select('*')
                .eq('userid', user.data.user?.id)
                .order('id', { ascending: false })
                .range(0, 9);

            if (error) {
                throw error;
            }

            setTickets(data ?? []);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setLoading(false);
        }

    }

    const getPaginatedTickets = async (start = 0, end = 9) => {
        try {
            setScrollLoading(true);
            const user = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('tickets').select('*')
                .eq('userid', user.data.user?.id)
                .order('id', { ascending: false })
                .range(start, end)
                ;

            if (error) {
                throw error;
            }

            setTickets([]);
            const prevState = [...tickets];
            prevState.push(...data ?? []);
            setTickets([...prevState]);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setScrollLoading(false);
        }

    }

    const handleEndReached = async () => {
        if (ticketCount) {
            let startCount = start;
            let endCount = end;

            if (endCount >= ticketCount) {
                return
            }

            if ((endCount + 5) <= ticketCount) {
                startCount = endCount + 1;
                endCount = endCount + 5;
            } else {
                startCount = endCount + 1;
                endCount = ticketCount;
            }

            setStart(startCount);
            setEnd(endCount);

            getPaginatedTickets(startCount, endCount);
        }
    }

    useEffect(() => {
        getTicketsCount();
    }, [])

    useEffect(() => {
        getTickets();
    }, [])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexGrow: 1,
                flexDirection: 'column',
                paddingHorizontal: widthScale(15),
                marginTop: widthScale(top + 5),
                marginBottom: widthScale(10),
                justifyContent: 'flex-start'
            }}>
            {!loading && !scrollLoading && tickets.length === 0 &&
                <View style={{ minHeight: heightScale(dimensions.height * 0.5), flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name='database-search-outline' size={widthScale(110)} color='gray' />
                    <Text style={{ fontSize: moderateWs(20, 1) }}>No tickets available</Text>
                </View>
            }
            {!loading &&
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: widthScale(70) }}>
                        <MaterialCommunityIcons name='qrcode' size={widthScale(20)} style={{ marginRight: widthScale(8) }} />
                        <Text style={{ fontSize: moderateWs(20, 1) }}>
                            Tickets
                        </Text>
                    </View>
                    <Divider style={{ height: 1, marginHorizontal: widthScale(10), marginTop: widthScale(10) }} />
                    <View>
                        <Button mode='contained' labelStyle={{ fontSize: moderateWs(14, 1) }} onPress={() => getTickets()}>RELOAD TICKETS</Button>
                    </View>
                    <FlatList
                        style={{ flex: 1 }}
                        onEndReached={() => handleEndReached()}
                        onEndReachedThreshold={0.8}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getTickets()} />}
                        showsVerticalScrollIndicator={false}
                        data={tickets}
                        renderItem={({ item, index }) => {
                            const isLast = index === tickets.length - 1;
                            return <TouchableOpacity
                                activeOpacity={1}
                                key={`results${item.id}-${index}`}
                                style={{
                                    marginTop: heightScale(15),
                                    marginHorizontal: widthScale(10),
                                    marginBottom: isLast ? widthScale(10) : widthScale(0)
                                }}
                                onPress={() => handleNavigation(item)}
                            >
                                <View>
                                    <Text style={{ fontSize: moderateWs(12, 1), marginBottom: 5 }}>Date & Time Purchased: {dayjs(item.created_at).format('MMM-DD-YYYY - h:m A')}</Text>
                                    <List.Item
                                        style={{ padding: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: theme.colors.surface, borderRadius: 5 }}
                                        title={`Serial No.: ${item.serial}`}
                                        left={() => <MaterialCommunityIcons name='qrcode' size={moderateWs(20, 1)} />}
                                        right={() => <MaterialCommunityIcons name='chevron-right' size={moderateWs(20, 1)} />}
                                    />
                                </View>
                            </TouchableOpacity>
                        }}
                    />
                    {scrollLoading &&
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator animating={true} color={theme.colors.primary} size={30} />
                            <Text style={{ marginTop: heightScale(10) }}>Loading More Data...</Text>
                        </View>
                    }
                </View>
            }
            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={50} />
                    <Text style={{ marginTop: heightScale(10) }}>Loading Data...</Text>
                </View>
            }
        </SafeAreaView>
    )
}