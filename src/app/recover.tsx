import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';

export default function recover() {

    const theme = useTheme();
    const [step, setStep] = useState<number>(0);
    const [showPass, setShowPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '20%' }}>
                <View style={{ padding: 20 }}>
                    <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: 100, width: 100 }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
                    <Text style={{
                        fontWeight: "bold", fontSize: 39, color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
                        textShadowOffset: {
                            width: 3,
                            height: 2,
                        },
                        overflow: 'visible'
                    }}>
                        Account Recovery
                    </Text>
                </View>
                <View>
                    <TextInput
                        placeholder="Mobile No."
                        keyboardType="number-pad"
                        mode="outlined"
                        left={<TextInput.Icon icon="cellphone-key" size={20} color='#000' />}
                        theme={{ roundness: 10 }}
                    />
                </View>
                <View>
                    <Button
                        buttonColor={theme.colors.tertiary}
                        textColor={theme.colors.inverseOnSurface}
                        contentStyle={{ minHeight: 50 }}
                        mode="elevated"
                        onPress={() => router.push({
                            pathname: "otp",
                            params: { pathTo: "changepassword" }
                        })}
                    >
                        SEND OTP
                    </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                        <Button
                            buttonColor={theme.colors.inverseOnSurface}
                            style={{ marginTop: 20, minWidth: 300 }}
                            mode='elevated'
                            onPress={() => router.push("login")}
                        >
                            <MaterialCommunityIcons name='arrow-left' />
                            Back to login
                        </Button>
                    </View>
                </View>
            </View >
        </SafeAreaView >
    )
}