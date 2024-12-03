import { View, SafeAreaView, useWindowDimensions, TouchableOpacity, Alert } from 'react-native'
import { ActivityIndicator, Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TTicket } from '../../../types/game';
import { Fragment, useEffect, useState } from 'react';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';
import { FlatList } from 'react-native-gesture-handler';
import { supabase } from '../../../lib/supabase';
import dayjs from 'dayjs';

export default function eticket() {
    const router = useRouter();
    const { bottom, top } = useSafeAreaInsets()
    const dimensions = useWindowDimensions();
    const theme = useTheme();
    const [tickets, setTickets] = useState<TTicket[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleNavigation = (value: TTicket) => {
        router.push({ pathname: 'ticketdetails', params: { ...value } });
    }

    const getTickets = async () => {
        try {
            setLoading(true);

            const user = await supabase.auth.getUser();
            const { data, error } = await supabase.from('tickets').select('*').eq('userid', user.data.user?.id).limit(10);

            if (!error) {
                setTickets(data ?? []);
                return;
            }

            throw error;
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setLoading(false);
        }

    }

    supabase
        .channel('tickets')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tickets' }, getTickets)
        .subscribe()


    useEffect(() => {
        getTickets();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: widthScale(10), marginTop: widthScale(top), marginBottom: heightScale(bottom), justifyContent: 'flex-start' }}>
            {!loading && tickets.length === 0 && <View style={{ minHeight: heightScale(dimensions.height * 0.5), flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name='database-search-outline' size={widthScale(110)} color='gray' />
                <Text style={{ fontSize: moderateWs(20, 1) }}>No tickets available</Text>
            </View>}
            {!loading && tickets.length !== 0 &&
                <Fragment>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: widthScale(70) }}>
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
                </Fragment>
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