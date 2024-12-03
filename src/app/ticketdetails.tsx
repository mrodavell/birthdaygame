import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from 'dayjs';
import { useRef } from 'react';
import QRCodeTicket from '../components/qrcodeticket';
import { useUserStore } from '../zustand/user';
import { TBoard } from '../types/game';
import { router, useLocalSearchParams } from 'expo-router';
import { create } from 'zustand';
import { moderateWs, widthScale } from '../helpers/scaler';

const TicketDetails = () => {
    const { boards, drawNumber, created_at, serial, totalBet, drawTime } = useLocalSearchParams();
    const { bottom } = useSafeAreaInsets();
    const phone = useUserStore((state) => state.phone);
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const imageRef = useRef(null);

    const savedBoard = JSON.parse(boards.toString()) as TBoard[];
    const drawDate = dayjs(created_at.toString()).format('MMM-DD-YYYY');
    const datePurchased = dayjs(created_at.toString()).format('MMM-DD-YYYY')
    const actualBet = savedBoard.reduce((acc, curr) => {
        if (curr.bet === "") return acc
        return acc + parseFloat(curr.bet)
    }, 0)
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
                    <View style={{ marginTop: widthScale(30), marginHorizontal: widthScale(30) }}>
                        {savedBoard.map((value, index) => {
                            return value.bet !== "" && <View key={`ticket-details-${index}`} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ marginLeft: widthScale(15), fontSize: moderateWs(14, 1) }}>{value.label}:</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', flex: 1 }}>
                                        <View style={{ flexDirection: "row", alignItems: 'center', flex: 1 }}>
                                            <Text style={{ marginLeft: widthScale(15), fontSize: moderateWs(14, 1) }}>{value.combination.month}</Text>
                                            <Text style={{ marginLeft: widthScale(15), fontSize: moderateWs(14, 1) }}>{value?.combination.date.length == 1 ? `0${value?.combination.date}` : value?.combination.date}</Text>
                                            <View style={{ flexDirection: 'row', marginLeft: widthScale(20) }}>
                                                {(value?.combination.letters.length ?? 0) > 0 &&
                                                    <Text style={{ fontSize: moderateWs(14, 1) }}>
                                                        {value?.combination.letters.join(' ')}
                                                    </Text>
                                                }
                                            </View>
                                        </View>
                                        {value.bet !== "" &&
                                            <View style={{ flexDirection: "row", minWidth: 100, justifyContent: 'flex-end' }}>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text style={{ fontSize: moderateWs(14, 1) }}>
                                                        <Text>P</Text>
                                                        <Text style={{ marginLeft: widthScale(5) }}>
                                                            {parseFloat(value?.bet).toFixed(2)}
                                                        </Text>
                                                    </Text>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                        })}
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: widthScale(30) }}>
                            <Text style={{ fontSize: moderateWs(18, 1) }}>Total: P {parseFloat(actualBet.toString()).toFixed(2)}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                            <View style={{ flexDirection: 'column', flex: 1 }}>
                                <Text style={{ fontSize: moderateWs(14, 1) }}><Text style={{ fontWeight: 'bold' }}>Mobile Number:</Text> +{phone}</Text>
                                <Text style={{ fontSize: moderateWs(14, 1) }}><Text style={{ fontWeight: 'bold' }}>Draw Number: </Text>{drawNumber}</Text>
                                <Text style={{ fontSize: moderateWs(14, 1) }}><Text style={{ fontWeight: 'bold' }}>Draw Date:</Text> {drawDate}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                                    <Text style={{ fontSize: moderateWs(14, 1) }}>
                                        <Text style={{ fontWeight: 'bold' }}>Draw Time: </Text>
                                        <Text>{drawTime} {drawTime === "10:00" ? "AM" : "PM"}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ flexGrow: 1, justifyContent: 'center', marginTop: widthScale(30) }}>
                            <Text style={{ fontSize: moderateWs(12, 1), fontWeight: 'bold' }}>
                                <Text>
                                    Date & Time Purchased
                                </Text>
                                <Text>
                                    {dayjs().format("MMM-DD-YYYY - h:m A")}
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <QRCodeTicket
                            phone={phone}
                            datepurchased={datePurchased.toString()}
                            drawdate={drawDate}
                            drawnumber={drawNumber.toString()}
                            serial={serial.toString()}
                        />
                        <Text variant='titleSmall' style={{ marginTop: 10 }}>QR Code Serial No.{serial}</Text>
                    </View>
                </View>
                <Button style={{ marginHorizontal: widthScale(20), marginTop: widthScale(10) }} onPress={() => router.back()} labelStyle={{ fontSize: 18 }}>Go Back</Button>
            </ScrollView>
        </SafeAreaView>
    )
}

export default TicketDetails