import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from 'dayjs';
import { useRef } from 'react';
import QRCodeTicket from '../components/qrcodeticket';
import { useUserStore } from '../zustand/user';
import { TBoard } from '../types/game';
import { router, useLocalSearchParams } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

const TicketDetails = () => {
    const { boards, drawNumber, datePurchased, drawDate, serial, totalBet, drawTimes } = useLocalSearchParams();
    const { bottom } = useSafeAreaInsets();
    const phone = useUserStore((state) => state.phone);
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const [status, requestPermission] = MediaLibrary.usePermissions();
    const imageRef = useRef(null);

    const savedBoard = JSON.parse(boards.toString()) as TBoard[];

    const handleDownload = async () => {
        if (status === null) {
            requestPermission();
        }

        try {
            const localUri = await captureRef(imageRef);
            await MediaLibrary.saveToLibraryAsync(localUri);
            if (localUri) {
                Alert.alert("e-Ticket", "e-Ticket was saved, please check your gallery.");
            }
        } catch (e) {
            console.log(e);
        }

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
                        {savedBoard.map((value, index) => {
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
                                        <Text style={{ fontSize: 16, marginTop: 2 }}>{drawTimes}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                            <View>
                                <Text variant='titleMedium'>Date & Time Purchased: {dayjs().format("DD-MMM-YY h:m A")}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <QRCodeTicket
                            phone={phone}
                            datepurchased={datePurchased.toString()}
                            drawdate={drawDate.toString()}
                            drawnumber={drawNumber.toString()}
                            serial={serial.toString()}
                        />
                        <Text variant='titleSmall' style={{ marginTop: 10 }}>QR Code Serial No.{serial}</Text>
                    </View>
                </View>
                <Button mode='contained' style={{ marginHorizontal: 20, marginTop: 20 }} onPress={handleDownload}>Download</Button>
                <Button style={{ marginHorizontal: 20, marginTop: 20 }} onPress={() => router.back()} labelStyle={{ fontSize: 18 }}>Go Back</Button>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TicketDetails