import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { Button, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useGameStore } from '../zustand/game';
import dayjs from 'dayjs';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import { router } from 'expo-router';
import QRCodeTicket from '../components/qrcodeticket';
import { useUserStore } from '../zustand/user';
import { heightScale, moderateWs, widthScale } from '../helpers/scaler';

const Ticket = () => {

    const theme = useTheme();
    // states
    const allLockeinBoards = useGameStore((state) => state.lockedInBoards);
    const boards = allLockeinBoards[allLockeinBoards.length - 1]?.board ?? [];
    const drawTimes = useGameStore((state) => state.lockedInBoards)[allLockeinBoards.length - 1]?.drawTime ?? [];
    const totalBet = useGameStore((state) => state.totalBet);
    const draws = useGameStore((state) => state.draws);
    const phone = useUserStore((state) => state.phone);
    const drawDate = dayjs().format('MMM DD, YYYY');
    // date formatting
    const dateTimePurchased = dayjs().format("DD-MMM-YY h:m A");
    const drawNumber = `${dayjs().format('YYYYMMDD')}-${Math.floor(100000 + Math.random() * 900000)}`;
    const serial = `E${dayjs().format('YY')}-${dayjs().format('MM')}-${Math.floor(100000 + Math.random() * 900000)}-${dayjs().format('DD')}`;

    // actions
    const { handleTickets } = useGameStore();

    // const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef(null);

    // const handleDownload = async () => {
    //     handleTicketStorage();
    //     if (status === null) {
    //         requestPermission();
    //     }

    //     try {
    //         const localUri = await captureRef(imageRef);
    //         await MediaLibrary.saveToLibraryAsync(localUri);
    //         if (localUri) {
    //             Alert.alert("e-Ticket", "e-Ticket was saved, please check your gallery.");
    //             router.back();
    //         }
    //     } catch (e) {
    //         console.log(e);
    //     }

    // }

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

    const handleBack = () => {
        handleTicketStorage();
        router.back();
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(10), justifyContent: 'flex-start' }}>
            <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={false}>
                <View tabIndex={-1} ref={imageRef} collapsable={false} style={{ backgroundColor: 'white' }}>
                    <View style={{ justifyContent: 'center', alignItems: "center", marginTop: 50 }}>
                        <Text variant='titleLarge' style={{ fontSize: moderateWs(18, 1) }}>Happy Birthday Game</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: "center", marginTop: heightScale(20) }}>
                        <Text variant='titleMedium' style={{ fontSize: moderateWs(14, 1) }}>Electronic Entry Ticket</Text>
                    </View>
                    <View style={{ marginTop: heightScale(30), marginHorizontal: widthScale(30) }}>
                        {boards.map((value, index) => {
                            return value.bet !== "" && <View key={`ticket-details-${index}`} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>{value.label}:</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', flex: 1 }}>
                                        <View style={{ flexDirection: "row", flex: 1 }}>
                                            <Text variant='titleLarge' style={{ marginLeft: widthScale(15), fontSize: moderateWs(16, 1) }}>{value.combination.month}</Text>
                                            <Text variant='titleLarge' style={{ marginLeft: widthScale(15), fontSize: moderateWs(16, 1) }}>{value?.combination.date.length == 1 ? `0${value?.combination.date}` : value?.combination.date}</Text>
                                            <View style={{ flexDirection: 'row', marginLeft: widthScale(15) }}>
                                                {(value?.combination.letters.length ?? 0) > 0 &&
                                                    <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>
                                                        {value?.combination.letters.join(' ')}
                                                    </Text>
                                                }
                                            </View>
                                        </View>
                                        {value.bet !== "" &&
                                            <View style={{ flexDirection: "row", minWidth: 100, justifyContent: 'flex-end' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>P</Text>
                                                    <Text variant='titleLarge' style={{ marginLeft: widthScale(5), fontSize: moderateWs(16, 1) }}>
                                                        {parseFloat(value?.bet)}
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        })}
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 40 }}>
                            <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>Total: P {parseFloat(totalBet.toString()).toFixed(2)}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text variant='titleMedium'>Mobile Number: +{phone}</Text>
                                <Text variant='titleMedium'>Draw Number: {drawNumber}</Text>
                                <Text variant='titleMedium'>Draw Date: {drawDate}</Text>
                                <View style={{ flexDirection: 'column', flex: 1 }}>
                                    <Text variant='titleMedium'>Draw Time: </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: widthScale(5) }}>
                                        {
                                            drawTimes.map((value, index) => {
                                                return <Text key={`combinations-${index}`} style={{ fontSize: 16, marginTop: 2 }}>{`${value} ${parseInt(value) < 10 ? 'PM' : 'AM'}`} {index === drawTimes.length - 1 ? '' : ', '}</Text>
                                            })
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: heightScale(15) }}>
                            <View>
                                <Text variant='titleMedium'>Date & Time Purchased: </Text>
                                <Text variant='titleSmall' style={{ marginLeft: widthScale(5) }}>{dateTimePurchased}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <QRCodeTicket
                            phone={phone}
                            datepurchased={dayjs().format("DD-MMM-YYYY")}
                            drawdate=''
                            drawnumber={drawNumber}
                            serial={serial}
                        />
                        <Text variant='titleSmall' style={{ marginTop: heightScale(10) }}>QR Code Serial No.{serial}</Text>
                    </View>
                </View>
                <Button mode='contained' style={{ marginHorizontal: widthScale(20), marginTop: heightScale(20) }} onPress={() => handleNavigate()} labelStyle={{ fontSize: 18 }}>View Tickets</Button>
                <Button style={{ marginHorizontal: widthScale(20), marginTop: heightScale(10) }} onPress={() => handleBack()} labelStyle={{ fontSize: 18, color: theme.colors.primary }}>Go Back</Button>
            </ScrollView>
        </SafeAreaView >
    )
}

export default Ticket;