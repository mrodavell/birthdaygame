import { View } from 'react-native'
import React, { FC, Fragment, useEffect, useState } from 'react'
import { Card, Text, TextInput, useTheme } from 'react-native-paper'
import Calendar from '../calendar'
import { TBoard, TCombination } from '../../types/game'
import { MaterialCommunityIcons } from '@expo/vector-icons'

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

    return (
        <Fragment>
            <Card
                mode='elevated'
                elevation={2}
                style={{
                    backgroundColor: theme.colors.surface,
                    height: 50,
                    padding: 10,
                    borderRadius: 5,
                    margin: 5,
                    justifyContent: 'center'
                }}
                onPress={() => setModal(true)}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="apps-box" style={{ marginRight: 5 }} />
                    <Text variant='titleMedium'>
                        {data?.label}
                    </Text>
                    {data?.combination.month &&
                        <View style={{ marginLeft: 20, borderWidth: 1, padding: 5, minWidth: 40, alignItems: 'center' }}>
                            <Text>
                                {data?.combination.month}
                            </Text>
                        </View>
                    }
                    {data?.combination.date &&
                        <View style={{ marginLeft: 10, borderWidth: 1, padding: 5, minWidth: 40, alignItems: 'center' }}>
                            <Text>
                                {data?.combination.date.length == 1 ? `0${data?.combination.date}` : data?.combination.date}
                            </Text>
                        </View>
                    }
                    {(data?.combination.letters.length ?? 0) > 0 &&
                        <View key={`letter-${index}`} style={{ marginLeft: 10, borderWidth: 1, padding: 5, minWidth: 80, alignItems: 'center' }}>
                            <Text>
                                {data?.combination.letters.join(',')}
                            </Text>
                        </View>
                    }
                    {data?.bet &&
                        <View style={{ marginLeft: 20 }}>
                            <Text variant='titleMedium'>Bet:{parseFloat(data?.bet.toString()).toFixed(2)}</Text>
                        </View>
                    }
                </View>
            </Card>
            {modal && <Calendar index={index} title={data?.label} data={data} visible={modal} onDismiss={() => setModal(prev => !prev)} />}
        </Fragment>
    )
}

export default Board