import { View, TouchableOpacity } from 'react-native'
import { FC, useState } from 'react'
import { Text, useTheme } from 'react-native-paper'


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
                        padding: 10,
                        marginVertical: 10,
                        marginHorizontal: 20,
                        borderWidth: 1,
                        height: 55,
                        width: 80,
                        alignItems: 'center',
                        backgroundColor: letters?.includes(label) ? theme.colors.primary : theme.colors.surface
                    }
                    }>
                    <Text>
                        {label}
                    </Text>
                    <Text>
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
                    padding: 10,
                    margin: 5,
                    borderWidth: 1,
                    borderRadius: 50,
                    height: 40,
                    backgroundColor: month === label ? theme.colors.primary : theme.colors.surface
                }}>
                    <Text>
                        {label.length > 1 ? label : `0${label}`}
                    </Text>
                </View>
            }
            {type === "date" &&
                <View style={{
                    padding: 10,
                    margin: 5,
                    borderWidth: 1,
                    borderRadius: 50,
                    height: 40,
                    backgroundColor: date === label ? theme.colors.primary : theme.colors.surface
                }}>
                    <Text>
                        {label.length > 1 ? label : `0${label}`}
                    </Text>
                </View>
            }
        </TouchableOpacity>
    )
}

export default CircleButton;