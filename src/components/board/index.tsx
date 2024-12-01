import { Alert, TouchableOpacity, View } from 'react-native'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import Calendar from '../calendar'
import { TBoard, TCombination } from '../../types/game'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useGameStore } from '../../zustand/game'
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler'
import { router } from 'expo-router'

type TBoardProps = {
    data?: { label: string, combination: TCombination, bet: string, status: string };
    index: number;
    isOpenBet: boolean;
}

const Board: FC<TBoardProps> = ({
    data,
    index,
    isOpenBet
}) => {

    const theme = useTheme();
    const [modal, setModal] = useState<boolean>(false);
    const { setSelectedBoardIndex, incrementBet, decrementBet } = useGameStore();

    const handleModal = (index: number) => {

        if (!isOpenBet) {
            Alert.alert('Betting is closed', "Betting is closed, please try again later.", [{ text: 'OK' }]);
            return;
        }

        setSelectedBoardIndex(index);
        router.push('bet');
        // setModal(true)
    }

    const handleIncrementBet = (index: number) => {
        setSelectedBoardIndex(index);
        incrementBet();
    }

    const handleDecrementBet = (index: number) => {
        setSelectedBoardIndex(index);
        decrementBet();
    }

    return (
        <Fragment>
            <TouchableOpacity activeOpacity={1} onPress={() => handleModal(index)}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <Card
                        mode='elevated'
                        elevation={2}
                        style={{
                            backgroundColor: theme.colors.surface,
                            height: heightScale(42),
                            padding: widthScale(8),
                            borderRadius: widthScale(5),
                            margin: heightScale(2),
                            justifyContent: 'space-around',
                            flex: 1,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', }}>
                            {!data?.combination.month &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: widthScale(20), justifyContent: 'flex-start' }}>
                                    <Text variant='titleMedium' style={{ fontSize: moderateWs(12, 1), marginLeft: widthScale(8) }}>
                                        {data?.label}
                                    </Text>
                                </View>
                            }
                            <View style={{ flex: 1, flexDirection: 'row', gap: widthScale(20) }}>
                                {!data?.combination.month &&
                                    <View style={{ padding: 5, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', flex: 1 }}>
                                        <Text style={{ fontSize: moderateWs(12, 1), marginLeft: widthScale(20) }}>
                                            Select lucky numbers and letters
                                        </Text>
                                        <MaterialCommunityIcons name='gesture-tap' size={widthScale(18)} style={{ color: theme.colors.tertiary }} />
                                    </View>
                                }
                                {data?.combination.month &&
                                    <Card style={{ padding: 5, width: widthScale(50), alignItems: 'center' }}>
                                        <Text style={{ fontSize: moderateWs(12, 1) }}>
                                            {data?.combination.month}
                                        </Text>
                                    </Card>
                                }
                                {data?.combination.date &&
                                    <Card style={{ padding: 5, width: widthScale(50), alignItems: 'center' }}>
                                        <Text style={{ fontSize: moderateWs(12, 1) }}>
                                            {data?.combination.date.length == 1 ? `0${data?.combination.date}` : data?.combination.date}
                                        </Text>
                                    </Card>
                                }
                                {data?.combination.month && (data?.combination.letters.length ?? 0) > 0 &&
                                    <Card key={`letter-${index}`} style={{ padding: 5, width: widthScale(60), alignItems: 'center' }}>
                                        <Text style={{ fontSize: moderateWs(12, 1) }}>
                                            {data?.combination.letters.join(', ')}
                                        </Text>
                                    </Card>
                                }
                            </View>
                        </View>
                    </Card>
                    {data?.bet &&
                        <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row' }}>
                                <IconButton icon="minus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.primary} size={widthScale(10)} mode='contained' onPress={() => handleDecrementBet(index)} />
                                <View style={{ justifyContent: 'center' }}>
                                    <Text variant='titleMedium' style={{ fontSize: 12, borderWidth: 1, paddingHorizontal: widthScale(5) }}>{parseFloat(data?.bet.toString()).toFixed(0)}</Text>
                                </View>
                                <IconButton icon="plus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.primary} size={widthScale(10)} mode='contained' onPress={() => handleIncrementBet(index)} />
                            </View>
                        </View>
                    }
                </View>
            </TouchableOpacity>
            {modal && <Calendar index={index} title={data?.label} data={data} visible={modal} onDismiss={() => setModal(prev => !prev)} />}
        </Fragment >
    )
}

export default Board