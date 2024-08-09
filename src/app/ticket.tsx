import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../zustand/game';
import dayjs from 'dayjs';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import { router } from 'expo-router';
import QRCodeTicket from '../components/qrcodeticket';
import { useUserStore } from '../zustand/user';

const Ticket = () => {

    const { bottom } = useSafeAreaInsets();
    const dateTimePurchased = dayjs().format("DD-MMM-YY h:m A");
    const drawNumber = `${dayjs().format('YYYYMMDD')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const drawDate = dayjs().format('MMM DD, YYYY');
    const serial = `E${dayjs().format('YY')}-${dayjs().format('MM')}-${Math.floor(100000 + Math.random() * 900000)}-${dayjs().format('DD')}`;
    const boards = useGameStore((state) => state.lockedInBoards)[0]?.board ?? [];
    const totalBet = useGameStore((state) => state.totalBet);
    const draws = useGameStore((state) => state.draws);
    const phone = useUserStore((state) => state.phone);
    const { handleTickets } = useGameStore();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;

    const drawTimes = Array.from({ length: draws }, (_, i) => dayjs().add(i * 3, 'hour').minute(0).format('h:mm A'));
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef(null);

    const handleDownload = async () => {
        handleTicketStorage();
        if (status === null) {
            requestPermission();
        }

        try {
            const localUri = await captureRef(imageRef);
            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                Alert.alert("e-Ticket", "e-Ticket was saved, please check your gallery.");
                router.back();
            }
        } catch (e) {
            console.log(e);
        }

    }

    const handleTicketStorage = () => {
        handleTickets({
            drawNumber: drawNumber,
            drawDate: drawDate,
            serial: serial,
            boards: JSON.stringify(boards),
            draws: draws.toString(),
            totalBet: totalBet.toString(),
            drawTimes: drawTimes,
            datePurchased: dateTimePurchased
        })
    }

    const handleNavigate = () => {
        handleTicketStorage();
        router.push('dashboard/(tabs)/etickets');
    }

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 40, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: screenHeight }}>
                <View tabIndex={-1} ref={imageRef} collapsable={false} style={{ backgroundColor: 'white' }}>
                    <View style={{ justifyContent: 'center', alignItems: "center", marginTop: 50 }}>
                        <Text variant='titleLarge'>Happy Birthday Game</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: "center", marginTop: 30 }}>
                        <Text variant='titleMedium'>Electronic Entry Ticket</Text>
                    </View>
                    <View style={{ marginTop: 30, marginHorizontal: 30 }}>
                        {boards.map((value, index) => {
                            return value.bet !== "" && <View key={`ticket-details-${index}`} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text variant='titleLarge'>{value.label}:</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', flex: 1 }}>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <Text variant='titleLarge' style={{ marginLeft: 20 }}>{value.combination.month}</Text>
                                            <Text variant='titleLarge' style={{ marginLeft: 20 }}>{value?.combination.date.length == 1 ? `0${value?.combination.date}` : value?.combination.date}</Text>
                                            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
                                                {(value?.combination.letters.length ?? 0) > 0 &&
                                                    <Text variant='titleLarge'>
                                                        {value?.combination.letters.join(' ')}
                                                    </Text>
                                                }
                                            </View>
                                        </View>
                                        {value.bet !== "" &&
                                            <View style={{ flexDirection: "row", minWidth: 100, justifyContent: 'flex-end' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text variant='titleLarge'>P</Text>
                                                    <Text variant='titleLarge' style={{ marginLeft: 5 }}>
                                                        {parseFloat(value?.bet).toFixed(2)}
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        })}
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 40 }}>
                            <Text variant='titleLarge'>Total: P {parseFloat(totalBet.toString()).toFixed(2)}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text variant='titleMedium'>Mobile Number: +{phone}</Text>
                                <Text variant='titleMedium'>Draw Number: {drawNumber}</Text>
                                <Text variant='titleMedium'>Draw Date: {drawDate}</Text>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text variant='titleMedium'>Draw Time: </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                        {
                                            drawTimes.map((value, index) => {
                                                return <Text key={`combinations-${index}`} style={{ fontSize: 16, marginTop: 2 }}>{value} {index === drawTimes.length - 1 ? '' : ', '}</Text>
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                            <View>
                                <Text variant='titleMedium'>Date & Time Purchased: {dateTimePurchased}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <QRCodeTicket
                            phone={phone}
                            datepurchased={dayjs().format("DD-MMM-YYYY")} drawdate=''
                            drawnumber={drawNumber}
                            serial={serial}
                        />
                        <Text variant='titleSmall' style={{ marginTop: 10 }}>QR Code Serial No.{serial}</Text>
                    </View>
                </View>
                <Button mode='contained' style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => handleDownload()}>Download</Button>
                <Button style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => handleNavigate()} labelStyle={{ fontSize: 18 }}>View Tickets</Button>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Ticket;