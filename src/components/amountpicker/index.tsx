import { View, FlatList } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type TAmountPickerProps = {
    amount?: string;
    handlePick?: (amount: string) => void
}

const AmountPicker: FC<TAmountPickerProps> = ({ amount, handlePick }) => {

    const amounts = [10, 20, 50, 100, 500, 1000]
    const theme = useTheme();
    const [pick, setPick] = useState<string>("")

    const handlePicking = (item: string) => {
        setPick(item)
        if (handlePick) {
            handlePick(item)
        }
    }

    useEffect(() => {
        setPick(amount ?? "")
    }, [amount])

    return (
        <View style={{ alignItems: 'center' }}>
            <FlatList
                data={amounts}
                renderItem={(item) => (
                    <Button
                        mode='outlined'
                        onPress={() => handlePicking(item.item.toString())}
                        style={{ borderRadius: 5, margin: 5, minWidth: 100, minHeight: 50 }}
                        labelStyle={{ color: theme.colors.tertiary }}
                    >
                        {item.item}
                        {pick === item.item.toString() &&
                            <MaterialCommunityIcons name="check" size={25} style={{ color: theme.colors.primary }} />
                        }
                    </Button>
                )}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
            />

        </View>
    )
}

export default AmountPicker