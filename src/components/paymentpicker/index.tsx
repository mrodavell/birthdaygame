import { View, FlatList } from 'react-native'
import React, { FC, useState } from 'react'
import { Button, Text, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

type TPaymentPickerProps = {
    handlePick?: (amount: string) => void
}

const PaymentPicker: FC<TPaymentPickerProps> = ({ handlePick }) => {

    const [pick, setPick] = useState<string>("");
    const options = ["GCash", "Maya", "Paypal", "Bank"]
    const theme = useTheme();

    const handlePicking = (item: string) => {
        setPick(item);
        if (handlePick) {
            handlePick(item)
        }
    }

    return (
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <FlatList
                data={options}
                renderItem={(item) => (
                    <Button
                        mode='outlined'
                        onPress={() => handlePicking(item.item.toString())}
                        style={{ borderRadius: 5, margin: 5, minWidth: 150, minHeight: 50 }}
                        labelStyle={{ color: theme.colors.tertiary }}
                    >
                        {item.item}
                        {pick === item.item &&
                            <MaterialCommunityIcons name="check" size={25} style={{ color: theme.colors.primary }} />
                        }
                    </Button>
                )}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
            />

        </View>
    )
}

export default PaymentPicker