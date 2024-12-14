import { Alert, View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightScale, moderateWs, widthScale } from '../../helpers/scaler';
import { formatToPHP } from '../../helpers/format';

type TCongratsDialog2Props = {
    visible: boolean,
    onDismiss: () => void;
    totalWin: number;
    winCombination: string[];
    winTickets: string[];
}


const CongratsDialog2: FC<TCongratsDialog2Props> = ({
    visible = false,
    onDismiss,
    totalWin,
    winCombination,
    winTickets
}) => {

    const theme = useTheme();
    const containerStyle = { backgroundColor: 'white', padding: widthScale(10), margin: widthScale(15), borderRadius: widthScale(10), height: widthScale(500) };
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
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: widthScale(10), height: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: widthScale(10) }}>
                        <Button mode='outlined' style={{ borderWidth: 1 }} onPress={() => pauseOrPlaySound()}>
                            <MaterialCommunityIcons size={widthScale(20)} style={{ color: theme.colors.tertiary }} name={isPlaying ? 'volume-high' : "volume-off"} />
                        </Button>
                    </View>
                    <Text style={{ fontSize: moderateWs(25, 1) }}>🎉 Congratulations 🎉</Text>
                    <Text style={{ fontSize: moderateWs(14, 1), marginTop: widthScale(30) }}>You hit the winning combinations</Text>
                    <Text style={{ fontSize: moderateWs(20, 1), marginTop: widthScale(10), fontWeight: 'bold' }}>{winCombination.join(', ')}</Text>
                    <Text style={{ fontSize: moderateWs(20, 1), marginTop: widthScale(10) }}>You won: {formatToPHP(totalWin.toString())}</Text>
                    <Text style={{ marginTop: widthScale(10) }}>Your winning tickets:</Text>
                    <View style={{ flex: 1, flexWrap: 'wrap', justifyContent: 'flex-start', gap: 4, marginTop: widthScale(10), maxHeight: widthScale(200), overflow: 'scroll' }}>
                        {
                            winTickets?.map((ticket, index) => (
                                <Text style={{ fontWeight: 'black', fontSize: moderateWs(12, 1), padding: widthScale(5) }} key={index}>{ticket}</Text>
                            ))
                        }
                    </View>

                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: heightScale(25) }}>
                        <Button mode='contained' style={{ borderWidth: 1, minWidth: widthScale(150) }} buttonColor={theme.colors.tertiary} onPress={stopSound}>
                            CLOSE
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal >

    )
}

export default CongratsDialog2