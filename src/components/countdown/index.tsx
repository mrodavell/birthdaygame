import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

export default function CountDown() {

    const [time, setTime] = useState<Dayjs>(dayjs().minute(29));

    useEffect(() => {
        setInterval(() => {
            setTime(prev => prev.subtract(1, 'seconds'))
        }, 1000 * 1)
    }, [setTime])

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', borderRadius: 8 }}>
            <View style={{ display: 'flex', alignItems: 'center', padding: 15, borderRadius: 8 }}>
                <View style={{ borderWidth: 2, display: 'flex', alignItems: 'center', padding: 15, borderRadius: 8 }}>
                    <Text>{time.format("mm")}</Text>
                </View>
                <Text style={{ marginTop: 5 }}>minutes</Text>
            </View>
            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: -25 }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>:</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', padding: 15, borderRadius: 8 }}>
                <View style={{ borderWidth: 2, display: 'flex', alignItems: 'center', padding: 15, borderRadius: 8 }}>
                    <Text>{time.format("ss")}</Text>
                </View>
                <Text style={{ marginTop: 5 }}>seconds</Text>
            </View>
        </View>
    )
}