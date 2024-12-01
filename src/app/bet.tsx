import { View, Text } from 'react-native'
import React from 'react'
import Calendar2 from '../components/calendar2'
import { useGameStore } from '../zustand/game'
import { SafeAreaView } from 'react-native-safe-area-context'

const Bet = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Calendar2 />
        </SafeAreaView>
    )
}

export default Bet