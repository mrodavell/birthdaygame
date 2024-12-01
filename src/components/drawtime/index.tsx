import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { FC } from 'react'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'
import { useGameStore } from '../../zustand/game'
import { s } from 'react-native-size-matters'
import { useTheme } from 'react-native-paper'
import dayjs from 'dayjs'
import { MaterialCommunityIcons } from '@expo/vector-icons'

enum DrawTimes {
    ten = '10:00',
    two = '2:00',
    five = '5:00',
    nine = '9:00'
}

type ButtonGroupProps = {
    time: string,
    indicators: string,
    selected: boolean,
    isDisabled?: boolean,
    isOpenBet?: boolean
}

const ButtonGroup: FC<ButtonGroupProps> = ({ time, indicators, selected, isDisabled = true, isOpenBet = false }) => {

    const selectedDrawTime = useGameStore((state) => state.selectedDrawTime);
    const { setSelectedDrawTime } = useGameStore();

    const handleSelected = (time: string) => {
        if (!isOpenBet) {
            Alert.alert('Betting is closed', "Betting is closed, please try again later.", [{ text: 'OK' }]);
            return;
        }

        if (!isDisabled) {
            Alert.alert('Unavailable Draw Time', 'You cannot select a draw time that has passed', [{ text: 'OK' }]);
            return;
        }

        let prevState = [...selectedDrawTime];

        if (prevState.includes(time)) {
            const updatedState = prevState.filter((item) => item !== time);
            setSelectedDrawTime(updatedState)
        } else {
            setSelectedDrawTime([...prevState, time])
        }
    }

    return <TouchableOpacity onPress={() => handleSelected(time)} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View
            style={{
                width: widthScale(55),
                height: heightScale(50),
                margin: widthScale(10),
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: selected && isOpenBet ? 3 : 1,
                padding: widthScale(5),
                backgroundColor: selected && isOpenBet ? 'blue' : 'white',
                borderColor: selected && isOpenBet ? 'gold' : 'gray',
                borderRadius: widthScale(5),
                position: 'relative'
            }}>
            <View style={{ position: 'absolute' }}>
                <Text style={{ fontSize: moderateWs(12, 1), textAlign: 'center', fontWeight: 'bold', color: selected && isOpenBet ? 'white' : !isDisabled ? 'gray' : 'black' }}>{time}</Text>
                <Text style={{ fontSize: moderateWs(12, 1), textAlign: 'center', color: selected && isOpenBet ? 'white' : !isDisabled ? 'gray' : 'black' }}>{indicators}</Text>
            </View>
        </View>
    </TouchableOpacity>
}

type DrawTimeProps = {
    isOpenBet: boolean;
}

const DrawTime: FC<DrawTimeProps> = ({ isOpenBet }) => {


    const currentDate = dayjs();

    const tenAm = currentDate.set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0);
    const twoPm = currentDate.set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0);
    const fivePm = currentDate.set('hour', 17).set('minute', 0).set('second', 0).set('millisecond', 0);
    const ninePm = currentDate.set('hour', 21).set('minute', 0).set('second', 0).set('millisecond', 0);

    const selectedDrawTime = useGameStore((state) => state.selectedDrawTime);

    const checkSelected = (time: string) => {
        return selectedDrawTime.includes(time);
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginHorizontal: widthScale(5) }}>
            <ButtonGroup isOpenBet={isOpenBet} time={DrawTimes.ten} indicators='AM' selected={checkSelected(DrawTimes.ten)} isDisabled={currentDate.isBefore(tenAm)} />
            <ButtonGroup isOpenBet={isOpenBet} time={DrawTimes.two} indicators='PM' selected={checkSelected(DrawTimes.two)} isDisabled={currentDate.isBefore(twoPm)} />
            <ButtonGroup isOpenBet={isOpenBet} time={DrawTimes.five} indicators='PM' selected={checkSelected(DrawTimes.five)} isDisabled={currentDate.isBefore(fivePm)} />
            <ButtonGroup isOpenBet={isOpenBet} time={DrawTimes.nine} indicators='PM' selected={checkSelected(DrawTimes.nine)} isDisabled={currentDate.isBefore(ninePm)} />
        </View>
    )
}

export default DrawTime