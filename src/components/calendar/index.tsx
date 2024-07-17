import { View, Text, FlatList } from 'react-native'
import React, { useState } from 'react'
import { Dates } from '../../constants/Dates';
import CircleButton from '../circlebutton';
import { Divider } from 'react-native-paper';

type TCalendarProps = {
    handleBoards?: (label: string, combination: string, bet: string) => void
}

export default function Calendar() {

    const [month, setMonth] = useState("01");
    const [date, setDate] = useState("");
    const [day, setDay] = useState(1);
    const [letters, setLetters] = useState("");

    const months = Dates.months;
    const days = Array.from({ length: Dates.days[day] }, (v, i) => i + 1)

    const handleMonth = (index?: number) => {
        if (index) {
            setDay(index)
        }
    }

    const handleDay = (day: number) => {
        if (day) {
            setDate(day.toString())
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <Text>Months</Text>
            <View style={{ minHeight: 100 }}>
                <FlatList
                    data={months}
                    renderItem={(item) => <CircleButton label={item.item} handleMonth={handleMonth} />}
                    keyExtractor={(item) => item}
                    numColumns={7}
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingVertical: 20 }}
                />
            </View>
            <Divider style={{ marginVertical: 10 }} />
            <Text>Days</Text>
            <FlatList
                data={days}
                renderItem={(item) => <CircleButton label={item.item.toString()} handleDay={handleDay} />}
                numColumns={7}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingVertical: 20 }}
            />
        </View>
    )
}