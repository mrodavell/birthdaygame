import { View } from 'react-native'
import React, { FC, Fragment, useState } from 'react'
import { Card, Text, useTheme } from 'react-native-paper'
import AppModal from '../modal'
import Calendar from '../calendar'
import { TBoard } from '../../types/board'

type TBoardProps = {
    data?: { label: string, combination: string, bet: string };
    handleBoards?: (data: TBoard) => void
}

const Board: FC<TBoardProps> = ({
    data,
    handleBoards
}) => {

    const theme = useTheme();
    const [modal, setModal] = useState<boolean>(false);

    const handleCalendar = (data: TBoard) => {
        if (handleBoards) {
            handleBoards(data)
        }
    }

    return (
        <Fragment>
            <Card
                mode='elevated'
                elevation={2}
                style={{
                    backgroundColor: theme.colors.surface,
                    minHeight: 70,
                    padding: 10,
                    margin: 5,
                    justifyContent: 'center'
                }}
                onPress={() => setModal(true)}
            >
                <View>
                    <Text variant='titleMedium'>
                        {data?.label}
                    </Text>
                </View>
            </Card>
            {modal &&
                <AppModal title={data?.label} visible={modal} onDismiss={() => setModal(prev => !prev)} >
                    <Calendar />
                </AppModal>
            }
        </Fragment>
    )
}

export default Board