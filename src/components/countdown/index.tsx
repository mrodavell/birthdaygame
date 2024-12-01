import { View, Text } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper';
import dayjs, { Dayjs } from 'dayjs';
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import duration from 'dayjs/plugin/duration';
import { useGameStore } from '../../zustand/game';

dayjs.extend(duration);

const CountDown: FC = () => {

    const theme = useTheme();
    const currentTime = dayjs();
    const isOpenBet = useGameStore((state => state.isOpenBet));
    const tenAm = currentTime.set('hour', 10).set('minute', 0).set('second', 0).set('millisecond', 0);
    const twoPm = currentTime.set('hour', 14).set('minute', 0).set('second', 0).set('millisecond', 0);
    const fivePm = currentTime.set('hour', 17).set('minute', 0).set('second', 0).set('millisecond', 0);
    const ninePm = currentTime.set('hour', 21).set('minute', 0).set('second', 0).set('millisecond', 0);


    const [time, setTime] = useState<string>("");

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600); // convert seocnds to hours
        const minutes = Math.floor((seconds % 3600) / 60); // convert seconds to minutes
        const secs = seconds % 60; // get the remaining seconds
        return `${hours}h:${minutes}m:${secs}s`;
    };

    const getTimeDiffInSeconds = () => {
        let timeDiffInSeconds = 0;
        if (currentTime.isBefore(tenAm)) {
            timeDiffInSeconds = tenAm.diff(currentTime, 'second');
        } else if (currentTime.isBefore(twoPm)) {
            timeDiffInSeconds = twoPm.diff(currentTime, 'second');
        } else if (currentTime.isBefore(fivePm)) {
            timeDiffInSeconds = fivePm.diff(currentTime, 'second');
        } else if (currentTime.isBefore(ninePm)) {
            timeDiffInSeconds = ninePm.diff(currentTime, 'second');
        } else {
            timeDiffInSeconds = currentTime.diff(tenAm, 'second');
        }

        return timeDiffInSeconds;
    }

    useEffect(() => {

        const interval = setInterval(() => {

            const timeDiffInSeconds = getTimeDiffInSeconds();

            // Stop the countdown when the target time is reached
            if (timeDiffInSeconds <= 0) {
                if (isOpenBet) {
                    const timeDiffInSeconds = getTimeDiffInSeconds();
                    setTime(() => formatTime(timeDiffInSeconds));
                } else {
                    clearInterval(interval);
                    setTime("Betting has closed");
                }
            } else {
                // Update the countdown every second 
                setTime(() => formatTime(timeDiffInSeconds));
            }


        }, 1000 * 1)

        return () => clearInterval(interval)

    }, [time])

    return (
        <View
            style={{
                backgroundColor: theme.colors.secondaryContainer,
                borderColor: 'black',
                borderWidth: 1,
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                marginLeft: widthScale(10),
                padding: heightScale(5),
                borderRadius: 8,
            }}
        >
            <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                    <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: widthScale(10) }} />
                    <Text style={{ color: 'black', fontWeight: 'bold', fontSize: moderateWs(14, 1) }}>
                        <Text>Betting closes in: </Text>
                    </Text>
                    <Text>{time}</Text>
                </View>

            </View>
        </View>
    )
}

export default CountDown;