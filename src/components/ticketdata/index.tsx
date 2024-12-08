import { View } from 'react-native'
import { Text } from 'react-native-paper'
import React, { FC } from 'react'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'
import { TBoard } from '../../types/game'
import QRCodeTicket from '../qrcodeticket'
import dayjs from 'dayjs'

type TTicketProps = {
    boards: TBoard[];
    totalBet: string | number;
    phone?: string | number;
    drawNumber: string;
    drawDate?: string;
    serial: string;
    drawTime: string;
    dateTimePurchased?: string;
}

const TicketData: FC<TTicketProps> = ({ boards, phone, drawDate, drawNumber, serial, drawTime, dateTimePurchased }) => {

    const actualBet = boards.reduce((acc, curr) => {
        if (curr.bet === "") return acc
        return acc + parseFloat(curr.bet)
    }, 0)

    return (
        <View collapsable={false} style={{ backgroundColor: 'white', borderWidth: 1, marginVertical: widthScale(10) }}>
            <View style={{ justifyContent: 'center', alignItems: "center", marginTop: widthScale(50) }}>
                <Text variant='titleLarge' style={{ fontSize: moderateWs(18, 1) }}>Happy Birthday Game</Text>
            </View>
            <View style={{ justifyContent: 'center', alignItems: "center", marginTop: heightScale(20) }}>
                <Text variant='titleMedium' style={{ fontSize: moderateWs(14, 1) }}>Electronic Entry Ticket</Text>
            </View>
            <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'center', marginTop: heightScale(15) }}>
                <View>
                    <Text variant='titleMedium'>Date & Time Purchased: </Text>
                    <Text variant='titleSmall' style={{ marginLeft: widthScale(5) }}>{dateTimePurchased}</Text>
                </View>
            </View>
            <View style={{ marginTop: heightScale(30), marginHorizontal: widthScale(30) }}>
                {boards.map((board, index) => {
                    return board.status !== "empty" && <View key={`board-details-${index}`} style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>{board.label}:</Text>
                            <View style={{ flexDirection: 'row', marginLeft: 10, justifyContent: 'space-between', flex: 1 }}>
                                <View style={{ flexDirection: "row", flex: 1 }}>
                                    <Text variant='titleLarge' style={{ marginLeft: widthScale(15), fontSize: moderateWs(16, 1) }}>{board.combination.month}</Text>
                                    <Text variant='titleLarge' style={{ marginLeft: widthScale(15), fontSize: moderateWs(16, 1) }}>{board.combination.date.length == 1 ? `0${board.combination.date}` : board.combination.date}</Text>
                                    <View style={{ flexDirection: 'row', marginLeft: widthScale(15) }}>
                                        {(board.combination.letters.length ?? 0) > 0 &&
                                            <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>
                                                {board.combination.letters.join(' ')}
                                            </Text>
                                        }
                                    </View>
                                </View>
                                {board.bet !== "" &&
                                    <View style={{ flexDirection: "row", minWidth: 100, justifyContent: 'flex-end' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>P</Text>
                                            <Text variant='titleLarge' style={{ marginLeft: widthScale(5), fontSize: moderateWs(16, 1) }}>
                                                {parseFloat(board.bet)}
                                            </Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        </View>
                    </View>
                })}
                <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 40 }}>
                    <Text variant='titleLarge' style={{ fontSize: moderateWs(16, 1) }}>Total: P {parseFloat(actualBet.toString()).toFixed(2)}</Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', marginTop: 30 }}>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text variant='titleMedium'>Mobile Number: +{phone}</Text>
                        <Text variant='titleMedium'>Draw Number: {drawNumber}</Text>
                        <Text variant='titleMedium'>Draw Date: {drawDate}</Text>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                            <Text variant='titleMedium'>Draw Time: </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: widthScale(5) }}>
                                <Text style={{ fontSize: moderateWs(14, 1) }}>
                                    {drawTime} {drawTime === "10:00" ? "AM" : "PM"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: widthScale(20), justifyContent: 'center', alignItems: 'center', marginBottom: widthScale(20) }}>
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
    )
}

export default TicketData