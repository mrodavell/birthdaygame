import { View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, Text, useTheme } from 'react-native-paper'
import { TBoard } from '../../../../types/board'

export default function Home() {

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
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 40, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <View style={{ marginBottom: 30 }}>
                <View style={{ flex: 1, borderWidth: 2, borderColor: 'gray', borderRadius: 8, minHeight: 200 }}>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Wallet Balance: 0.00</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 20, gap: 10, marginBottom: 20 }}>
                            <Button mode='contained' style={{ flex: 1, backgroundColor: theme.colors.tertiary }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>
                                    Deposit
                                </Text>
                            </Button>
                            <Button mode='contained' style={{ flex: 1, backgroundColor: theme.colors.secondary }}>
                                <Text style={{ color: 'white', fontSize: 18 }}>
                                    Withdraw
                                </Text>
                            </Button>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>

                    <Button mode='contained' style={{ height: 50, justifyContent: "center" }}>
                        <Text style={{ color: 'white', fontSize: 18 }}>
                            START GAME
                        </Text>
                    </Button>
                </View>
            </View>
        </SafeAreaView>
    )
}