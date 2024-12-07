import { View, SafeAreaView, ScrollView } from 'react-native'
import { Button, useTheme, Text, ActivityIndicator } from 'react-native-paper'
import { useGameStore } from '../zustand/game';
import { router } from 'expo-router';
import { useUserStore } from '../zustand/user';
import { heightScale, widthScale } from '../helpers/scaler';
import TicketData from '../components/ticketdata';
import { TBoard } from '../types/game';
import { Fragment, Suspense, useEffect } from 'react';

const Ticket = () => {

    const theme = useTheme();
    // states
    const tickets = useGameStore(state => state.tickets);
    const phone = useUserStore(state => state.phone);
    const { clearTickets } = useGameStore();
    const loading = useGameStore(state => state.loading);
    const handleNavigate = () => {
        router.push('dashboard/(tabs)/etickets');
    }

    const handleBack = () => {
        router.back();
    }

    useEffect(() => {
        return () => {
            clearTickets();
        }
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(5), justifyContent: 'flex-start' }}>
            {loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size='large' />
                    <Text style={{ fontSize: widthScale(16), marginTop: widthScale(20) }}>Please wait, rendering tickets...</Text>
                </View>
            }
            {!loading &&
                <Fragment>
                    <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
                        <View collapsable={false} style={{ flex: 1, backgroundColor: 'white' }}>

                            <View style={{ marginTop: heightScale(20), marginHorizontal: widthScale(10) }}>
                                {tickets.map((ticket, index) => {
                                    const boards = JSON.parse(ticket.boards) as TBoard[]
                                    return <TicketData
                                        key={`ticket-${index}`}
                                        boards={boards}
                                        totalBet={ticket.totalBet}
                                        phone={phone}
                                        drawNumber={ticket.drawNumber}
                                        drawDate={ticket.drawDate}
                                        serial={ticket.serial}
                                        drawTime={ticket.drawTime}
                                        dateTimePurchased={ticket.dateTimePurchased}
                                    />
                                })}
                            </View>
                        </View>
                    </ScrollView>
                    <Button mode='contained' style={{ marginHorizontal: widthScale(20), marginTop: heightScale(20) }} onPress={() => handleNavigate()} labelStyle={{ fontSize: 18 }}>View Tickets</Button>
                    <Button style={{ marginHorizontal: widthScale(20), marginTop: widthScale(10) }} onPress={() => handleBack()} labelStyle={{ fontSize: 18, color: theme.colors.primary }}>Go Back</Button>
                </Fragment>
            }
        </SafeAreaView >
    )
}

export default Ticket;