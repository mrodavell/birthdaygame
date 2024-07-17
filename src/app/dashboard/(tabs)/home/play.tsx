import { View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Text, useTheme } from 'react-native-paper'
import Board from '../../../../components/board'
import { TBoard } from '../../../../types/board'

export default function Play() {

    const theme = useTheme()
    const { bottom } = useSafeAreaInsets()
    const [boards, setBoards] = useState<TBoard[]>([
        {
            label: "Board A",
            combination: "",
            bet: ""
        },
        {
            label: "Board B",
            combination: "",
            bet: ""
        },
        {
            label: "Board C",
            combination: "",
            bet: ""
        },
        {
            label: "Board D",
            combination: "",
            bet: ""
        },
        {
            label: "Board E",
            combination: "",
            bet: ""
        },
        {
            label: "Board F",
            combination: "",
            bet: ""
        }
    ])

    const [total, setTotal] = useState<string>("0.00");

    const handleBoards = (data: TBoard, index: number) => {

        const old = boards;

        old[index] = {
            label: data.label,
            combination: data.combination,
            bet: data.bet
        }

        setBoards(old)
        handleTotal()
    }

    const handleTotal = () => {
        const sum = boards.reduce((total, next) => total + parseInt(next.bet), 0)
        setTotal(sum.toString())
    }


    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 20, marginTop: 72, marginBottom: bottom + 10, justifyContent: 'flex-start' }}>
            <ScrollView style={{ paddingVertical: 10, maxHeight: 500 }}>
                <View style={{ marginBottom: 30 }}>
                    {boards.map((value, index) => {
                        return <Board key={`board-${index}`} data={value} handleBoards={(data: TBoard) => handleBoards(data, index)} />
                    })}
                </View>
            </ScrollView>
            <View style={{ margin: 10, marginTop: 20 }}>
                <Text variant='titleMedium'>TOTAL: {total}</Text>
            </View>
            <View style={{ marginBottom: 10 }}>
                <Button mode='contained' style={{ marginTop: 10 }}>CONFIRM BET</Button>
            </View>
        </SafeAreaView>
    )
}