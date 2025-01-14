import { Alert, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { useGameStore } from '../../zustand/game';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { moderateWs, widthScale } from '../../helpers/scaler';
import { formatToPHP } from '../../helpers/format';

type TCongratsDialogProps = {
    visible: boolean,
    onDismiss: () => void;
}


const CongratsDialog: FC<TCongratsDialogProps> = ({
    visible = false,
    onDismiss
}) => {

    const theme = useTheme();
    const containerStyle = { backgroundColor: 'white', padding: widthScale(10), margin: widthScale(20), height: widthScale(420), borderRadius: widthScale(10) };
    const totalWin = useGameStore(state => state.totalWin);
    const winCombination = useGameStore(state => state.winCombination);
    const winningTickets = useGameStore(state => state.winningTickets);
    const resultDate = useGameStore(state => state.resultDate);
    const resultTime = useGameStore(state => state.resultTime);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | undefined>();

    async function playSound() {
        try {
            const { sound } = await Audio.Sound.createAsync(require('../../../assets/hbd.mp3'));
            setSound(sound);
            setIsPlaying(true);
            await sound.playAsync();
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    }


    async function pauseOrPlaySound() {
        if (isPlaying) {
            if (sound) {
                await sound.pauseAsync();
                setIsPlaying(false);
            }
        } else {
            await sound?.playAsync();
            setIsPlaying(true);
        }
    }

    async function stopSound() {
        await sound?.stopAsync();
        setIsPlaying(false);
        onDismiss && onDismiss();
    }

    useEffect(() => {
        if (visible) {
            playSound();
        }
    }, [])

    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={containerStyle}>
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: widthScale(10), height: '100%', marginTop: widthScale(20) }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 10 }}>
                        <Button mode='outlined' style={{ borderWidth: 1 }} onPress={() => pauseOrPlaySound()}>
                            <MaterialCommunityIcons size={widthScale(20)} style={{ color: theme.colors.tertiary }} name={isPlaying ? 'volume-high' : "volume-off"} />
                        </Button>
                    </View>
                    <Text style={{ fontSize: moderateWs(25, 1) }}>🎉 Congratulations 🎉</Text>
                    <Text style={{ fontSize: moderateWs(14, 1), marginTop: widthScale(10) }}>Draw date: {resultDate}</Text>
                    <Text style={{ fontSize: moderateWs(14, 1), marginTop: widthScale(10) }}>Draw time: {resultTime} {resultTime === "10:00" ? "AM" : "PM"}</Text>
                    <Text style={{ fontSize: moderateWs(14, 1), marginTop: widthScale(20) }}>You hit the winning combinations</Text>
                    <Text style={{ fontSize: moderateWs(20, 1), marginTop: widthScale(10), fontWeight: 'bold' }}>{winCombination}</Text>
                    <Text style={{ fontSize: moderateWs(20, 1), marginTop: widthScale(10) }}>You won: {formatToPHP(totalWin.toString())}</Text>
                    <Text style={{ marginTop: widthScale(10) }}>Your winning tickets:</Text>
                    <View style={{ flex: 1, flexWrap: 'wrap', justifyContent: 'flex-start', gap: 4, marginTop: widthScale(10), maxHeight: widthScale(200), overflow: 'scroll' }}>
                        {
                            winningTickets?.map((ticket, index) => (
                                <Text style={{ fontWeight: 'black', fontSize: moderateWs(12, 1), padding: widthScale(5) }} key={index}>{ticket}</Text>
                            ))
                        }
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: widthScale(15) }}>
                        <Button mode='contained' style={{ borderWidth: 1, minWidth: widthScale(150) }} buttonColor={theme.colors.tertiary} onPress={stopSound}>
                            CLOSE
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal >

    )
}

export default CongratsDialog