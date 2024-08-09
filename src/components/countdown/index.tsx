import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useTheme } from 'react-native-paper';
import dayjs, { Dayjs } from 'dayjs';

export default function CountDown() {

    const theme = useTheme();
    const [time, setTime] = useState<Dayjs>(dayjs().minute(59).subtract(dayjs().minute(), 'minute'))

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev.subtract(1, 'seconds'));
        }, 1000 * 1)

        return () => clearInterval(interval)
    }, [time])

    return (
        <View style={{ backgroundColor: theme.colors.shadow, flex: 1, flexDirection: 'row', justifyContent: 'center', padding: 5, marginLeft: 10, paddingHorizontal: 15, paddingVertical: 10, borderRadius: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 14, }}>Betting closes in: </Text>
                <Text style={{ color: 'white', fontSize: 14, }}>{time?.format("mm")}</Text>
                <Text style={{ fontSize: 12, color: 'white', fontWeight: 'bold' }}>:</Text>
                <Text style={{ color: 'white' }}>{time?.format("ss")}</Text>
            </View>
        </View>
    )
}