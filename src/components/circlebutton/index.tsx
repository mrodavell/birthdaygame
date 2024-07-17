import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { Button } from 'react-native-paper'

type TCircleButtonProps = {
    label?: string,
    index?: number,
    handleMonth?: (index: number) => void,
    handleDay?: (day: number) => void
}

const CircleButton: FC<TCircleButtonProps> = ({ label, index, handleMonth, handleDay }) => {


    const handlePress = () => {
        if (handleMonth) {
            handleMonth(index ?? 1)
        }

        if (handleDay) {
            handleDay(Number(label) ?? 1)
        }
    }

    return (
        <View>
            <Button onPress={handlePress}>{label}</Button>
        </View>
    )
}

export default CircleButton;