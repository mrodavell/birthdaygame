import { View, FlatList, TouchableOpacity } from 'react-native'
import React, { FC, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'

type TPaymentPickerProps = {
    handlePick?: (amount: string) => void
}

const PaymentPicker: FC<TPaymentPickerProps> = ({ handlePick }) => {

    const [pick, setPick] = useState<string>("");
    const options = ["GCash", "Maya", "Paypal", "Bank"]
    const theme = useTheme();

    const handlePicking = (item: string) => {
        if (pick === item) {
            setPick("");
            if (handlePick) {
                handlePick("")
            }
        } else {
            setPick(item);
            if (handlePick) {
                handlePick(item)
            }
        }

    }

    return (
        <View style={{ alignItems: 'center', marginBottom: widthScale(20) }}>
            <FlatList
                data={options}
                renderItem={(item) => (
                    <TouchableOpacity
                        onPress={() => handlePicking(item.item.toString())}
                        style={{
                            borderWidth: 1,
                            borderRadius: widthScale(5),
                            margin: 5,
                            minWidth: widthScale(120),
                            minHeight: heightScale(50)
                        }}
                    >
                        <View style={{
                            flex: 1,
                            borderWidth: 1,
                            borderColor: 'transparent',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: moderateWs(14, 1) }}>{item.item}</Text>
                            {pick === item.item &&
                                <MaterialCommunityIcons name="check" size={moderateWs(20, 1)} style={{ color: theme.colors.primary, marginLeft: widthScale(10) }} />
                            }
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(_, index) => index.toString()}
                numColumns={2}
            />

        </View>
    )
}

export default PaymentPicker