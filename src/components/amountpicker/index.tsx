import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'

type TAmountPickerProps = {
    amount?: string;
    handlePick?: (amount: string) => void
}

const AmountPicker: FC<TAmountPickerProps> = ({ amount, handlePick }) => {

    const amounts = [10, 20, 50, 100, 500, 1000]
    const theme = useTheme();
    const [pick, setPick] = useState<string>("")

    const handlePicking = (amount: string) => {
        if (pick === amount && amount !== "0" && pick !== "") {
            setPick("0")
            if (handlePick) {
                handlePick("0")
            }
        } else {
            setPick(amount)
            if (handlePick) {
                handlePick(amount)
            }
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
                    <TouchableOpacity
                        onPress={() => handlePicking(item.item.toString())}
                        style={{
                            borderWidth: 1,
                            borderRadius: widthScale(5),
                            margin: widthScale(5),
                            height: heightScale(55),
                            width: widthScale(75),
                        }}
                    >
                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: 'transparent',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: moderateWs(12, 1) }}>{item.item}</Text>
                            {pick === item.item.toString() &&
                                <MaterialCommunityIcons name="check" size={moderateWs(18, 1)} style={{ color: theme.colors.primary }} />
                            }
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
                numColumns={3}
            />
        </View>
    )
}

export default AmountPicker