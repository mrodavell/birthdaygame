import { View } from 'react-native'
import React, { FC, useEffect, useState } from 'react'
import { Button, Modal, Portal, Text, useTheme } from 'react-native-paper';
import { useGameStore } from '../../zustand/game';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TCongratsDialogProps = {
    visible: boolean,
    onDismiss: () => void;
}


const CongratsDialog: FC<TCongratsDialogProps> = ({
    visible = false,
    onDismiss
}) => {

    const theme = useTheme();
    const containerStyle = { backgroundColor: 'white', padding: 10, margin: 20, height: 380, borderRadius: 10 };
    const totalWin = useGameStore(state => state.totalWin);
    const winCombination = useGameStore(state => state.winCombination);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | undefined>();

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync(require('../../../assets/hbd.mp3'));
        setSound(sound);
        setIsPlaying(true);
        await sound.playAsync();
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
                <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', padding: 10, height: '100%', marginTop: 20 }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: 10 }}>
                        <Button mode='outlined' style={{ borderWidth: 1 }} onPress={() => pauseOrPlaySound()}>
                            <MaterialCommunityIcons size={20} style={{ color: theme.colors.tertiary }} name={isPlaying ? 'volume-high' : "volume-off"} />
                        </Button>
                    </View>
                    <Text style={{ fontSize: 30 }}>🎉 Congratulations 🎉</Text>
                    <Text style={{ fontSize: 20, marginTop: 30 }}>You hit the winning combination</Text>
                    <Text style={{ fontSize: 30, marginTop: 10, fontWeight: 'bold' }}>{winCombination}</Text>
                    <Text style={{ fontSize: 25, marginTop: 20 }}>You won: {totalWin}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: 25 }}>
                        <Button mode='contained' style={{ borderWidth: 1, minWidth: 150 }} buttonColor={theme.colors.tertiary} onPress={stopSound}>
                            CLOSE
                        </Button>
                    </View>
                </View>
            </Modal>
        </Portal >

    )
}

export default CongratsDialog