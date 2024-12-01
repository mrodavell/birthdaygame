import { View, TouchableOpacity } from 'react-native'
import { FC, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'
import dayjs from 'dayjs'


type TCircleButtonProps = {
    label: string,
    index: number,
    month?: string | null,
    date?: string | null,
    letters?: string[] | null,
    type: "month" | "date" | "letters",
    handleMonth?: (index: number, month: string) => void,
    handleDay?: (day: number) => void,
    handleLetter?: (letter: string) => void
}

const CircleButton: FC<TCircleButtonProps> = ({ label, index, month, letters, date, type = "month", handleMonth, handleDay, handleLetter }) => {

    const theme = useTheme()

    const handlePress = () => {
        if (handleMonth) {
            handleMonth(index, label)
        }

        if (handleDay) {
            handleDay(Number(label))
        }

        if (handleLetter) {
            handleLetter(label)
        }
    }

    return (
        <TouchableOpacity onPress={handlePress}>
            {type === "letters" &&
                <View
                    style={{
                        padding: widthScale(10),
                        marginVertical: heightScale(10),
                        marginHorizontal: widthScale(20),
                        borderWidth: 1,
                        height: widthScale(50),
                        width: widthScale(75),
                        alignItems: 'center',
                        backgroundColor: letters?.includes(label) ? theme.colors.primary : theme.colors.surface
                    }}
                >
                    <Text style={{ fontSize: moderateWs(12, 1), fontWeight: 'bold' }}>
                        {label}
                    </Text>
                    <Text style={{ fontSize: moderateWs(12, 1) }}>
                        {
                            label.toLowerCase() === "f" && "Father"
                        }
                        {
                            label.toLowerCase() === "m" && "Mother"
                        }
                        {
                            label.toLowerCase() === "s" && "Son"
                        }
                        {
                            label.toLowerCase() === "d" && "Daughter"
                        }
                    </Text>
                </View>
            }
            {type === "month" &&
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: widthScale(5),
                    borderWidth: 1,
                    height: heightScale(35),
                    width: widthScale(35),
                    backgroundColor: month === label ? theme.colors.primary : theme.colors.surface
                }}>
                    <Text style={{ fontSize: moderateWs(12, 1) }}>
                        {label.length > 1 ? label : `0${label}`}
                    </Text>
                    <Text style={{ fontSize: moderateWs(8, 1) }}>
                        {dayjs().month(Number(label) - 1).format('MMM')}
                    </Text>
                </View>
            }
            {type === "date" &&
                <View style={{
                    padding: widthScale(10),
                    margin: widthScale(5),
                    borderWidth: 1,
                    height: heightScale(40),
                    backgroundColor: date === label ? theme.colors.primary : theme.colors.surface
                }}>
                    <Text style={{ fontSize: moderateWs(12, 1) }}>
                        {label.length > 1 ? label : `0${label}`}
                    </Text>
                </View>
            }
        </TouchableOpacity>
    )
}

export default CircleButton;