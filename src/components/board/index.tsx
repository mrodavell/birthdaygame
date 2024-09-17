import { TouchableOpacity, View } from 'react-native'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { Card, IconButton, Text, TextInput, useTheme } from 'react-native-paper'
import Calendar from '../calendar'
import { TBoard, TCombination } from '../../types/game'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useGameStore } from '../../zustand/game'

type TBoardProps = {
    data?: { label: string, combination: TCombination, bet: string, status: string };
    index: number;
}

const Board: FC<TBoardProps> = ({
    data,
    index
}) => {

    const theme = useTheme();
    const [modal, setModal] = useState<boolean>(false);
    const { setSelectedBoardIndex, incrementBet, decrementBet } = useGameStore();

    const handleModal = (index: number) => {
        setSelectedBoardIndex(index);
        setModal(true)
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
                <View style={{ flexDirection: 'row' }}>
                    <Card
                        mode='elevated'
                        elevation={2}
                        style={{
                            backgroundColor: theme.colors.surface,
                            height: 50,
                            padding: 10,
                            borderRadius: 5,
                            margin: 2,
                            justifyContent: 'space-around',
                            flex: 1,
                        }}
                    >
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                            {!data?.combination.month &&
                                <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 20, justifyContent: 'flex-start' }}>
                                    <Text variant='titleMedium' style={{ fontSize: 12 }}>
                                        {data?.label}
                                    </Text>
                                </View>
                            }
                            <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
                                {!data?.combination.month &&
                                    <View style={{ padding: 5, alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                                        <Text style={{ fontSize: 15, marginLeft: 40 }}>
                                            Select lucky numbers and letters
                                        </Text>
                                        <MaterialCommunityIcons name='gesture-tap' size={18} style={{ marginLeft: 10, color: theme.colors.tertiary }} />
                                    </View>
                                }
                                {data?.combination.month &&
                                    <Card style={{ padding: 5, width: 50, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>
                                            {data?.combination.month}
                                        </Text>
                                    </Card>
                                }
                                {data?.combination.date &&
                                    <Card style={{ padding: 5, width: 50, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>
                                            {data?.combination.date.length == 1 ? `0${data?.combination.date}` : data?.combination.date}
                                        </Text>
                                    </Card>
                                }
                                {data?.combination.month && (data?.combination.letters.length ?? 0) > 0 &&
                                    <Card key={`letter-${index}`} style={{ padding: 5, width: 70, alignItems: 'center' }}>
                                        <Text style={{ fontSize: 15 }}>
                                            {data?.combination.letters.join(', ')}
                                        </Text>
                                    </Card>
                                }
                            </View>
                        </View>
                    </Card>
                    {data?.bet &&
                        <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <IconButton icon="minus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.surface} size={20} mode='contained' onPress={() => handleDecrementBet(index)} />
                            <View style={{ borderWidth: 1, paddingHorizontal: 12 }}>
                                <Text variant='titleMedium' style={{ fontSize: 12 }}>{parseFloat(data?.bet.toString()).toFixed(0)}</Text>
                            </View>
                            <IconButton icon="plus" style={{ borderWidth: 1 }} iconColor='black' containerColor={theme.colors.surface} size={20} mode='contained' onPress={() => handleIncrementBet(index)} />
                        </View>
                    }
                </View>
            </TouchableOpacity>
            {modal && <Calendar index={index} title={data?.label} data={data} visible={modal} onDismiss={() => setModal(prev => !prev)} />}
        </Fragment >
    )
}

export default Board