import { View, Text } from 'react-native'
import React from 'react'
import { Avatar, useTheme } from 'react-native-paper'
import FlashText from '../flashtext'
import CountDown from '../countdown'

export default function BetTimer() {

    const theme = useTheme();

    return (
        <View style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.tertiary,
            padding: 10,
            borderRadius: 8,
            marginTop: -20
        }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Avatar.Icon icon="bullhorn-outline" size={45} style={{ marginTop: 10, marginBottom: 10, backgroundColor: 'white' }} />
                <FlashText />
            </View>
            <CountDown />
        </View>
    )
}