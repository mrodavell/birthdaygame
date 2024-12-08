import { View, SafeAreaView, ScrollView } from 'react-native'
import { Button, useTheme, Text, ActivityIndicator } from 'react-native-paper'
import { useGameStore } from '../zustand/game';
import { router } from 'expo-router';
import { useUserStore } from '../zustand/user';
import { heightScale, widthScale } from '../helpers/scaler';
import TicketData from '../components/ticketdata';
import { TBoard } from '../types/game';
import { Fragment, useEffect, useState } from 'react';
import { DrawTimes } from '../constants/App';

const Ticket = () => {

    const theme = useTheme();
    // states
    const tickets = useGameStore(state => state.tickets);
    const phone = useUserStore(state => state.phone);
    const [ticketList, setTicketList] = useState<any[]>([]);
    const { clearTickets, getDrawTime } = useGameStore();
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
            getDrawTime();
        }

    }, [])




    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(5), justifyContent: 'flex-start' }}>
            {loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size='large' />
                    <Text style={{ fontSize: widthScale(16), marginTop: widthScale(20) }}>Generating tickets...</Text>
                </View>
            }
            {!loading &&
                <Fragment>
                    <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
                        <View collapsable={false} style={{ flex: 1, backgroundColor: 'white' }}>
                            <View style={{ marginTop: heightScale(20), marginHorizontal: widthScale(10) }}>
                                {tickets[0] && tickets[0].drawTime === DrawTimes.ten &&
                                    <TicketData
                                        boards={JSON.parse(tickets[0].boards)}
                                        totalBet={tickets[0].totalBet}
                                        phone={phone}
                                        drawNumber={tickets[0].drawNumber}
                                        drawDate={tickets[0].drawDate}
                                        serial={tickets[0].serial}
                                        drawTime={tickets[0].drawTime}
                                        dateTimePurchased={tickets[0].dateTimePurchased}
                                    />
                                }

                                {tickets[1] && tickets[1].drawTime === DrawTimes.two &&
                                    <TicketData
                                        boards={JSON.parse(tickets[1].boards)}
                                        totalBet={tickets[1].totalBet}
                                        phone={phone}
                                        drawNumber={tickets[1].drawNumber}
                                        drawDate={tickets[1].drawDate}
                                        serial={tickets[1].serial}
                                        drawTime={tickets[1].drawTime}
                                        dateTimePurchased={tickets[1].dateTimePurchased}
                                    />
                                }

                                {tickets[2] && tickets[2].drawTime === DrawTimes.five &&
                                    <TicketData
                                        boards={JSON.parse(tickets[2].boards)}
                                        totalBet={tickets[2].totalBet}
                                        phone={phone}
                                        drawNumber={tickets[2].drawNumber}
                                        drawDate={tickets[2].drawDate}
                                        serial={tickets[2].serial}
                                        drawTime={tickets[2].drawTime}
                                        dateTimePurchased={tickets[2].dateTimePurchased}
                                    />
                                }

                                {tickets[3] && tickets[3].drawTime === DrawTimes.nine &&
                                    <TicketData
                                        boards={JSON.parse(tickets[3].boards)}
                                        totalBet={tickets[3].totalBet}
                                        phone={phone}
                                        drawNumber={tickets[3].drawNumber}
                                        drawDate={tickets[3].drawDate}
                                        serial={tickets[3].serial}
                                        drawTime={tickets[3].drawTime}
                                        dateTimePurchased={tickets[3].dateTimePurchased}
                                    />
                                }
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