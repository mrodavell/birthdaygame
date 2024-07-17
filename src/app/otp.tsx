import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard } from 'react-native';
import { Button, useTheme, Text } from 'react-native-paper';
import { PaperOtpInput } from 'react-native-paper-otp-input';
import { supabase } from '../lib/supabase';

export default function otp() {

    const theme = useTheme();
    const { pathTo, phone } = useLocalSearchParams<{ pathTo: string, phone?: string }>();
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleOTP = (pin: string) => {
        setError(false);
        setOtp(pin)
    }

    const handleConfirmOTP = async () => {

        if (!phone) {
            return;
        }

        if (otp === "") {
            setError(true);
            return;
        }

        try {
            setLoading(true);


            const { data, error } = await supabase.auth.verifyOtp({ phone: phone, token: otp, type: 'sms' })
            console.log({ data, error })


            if (!error) {
                pathTo === "changepassword" ? router.push("changepassword") : router.push("login")
            } else {
                setError(true)
            }


        } catch (e) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '30%' }}>
                <View style={{ padding: 20 }}>
                    <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: 200, width: 200 }} />
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row" }}>
                    <Text variant='titleSmall' style={{ color: theme.colors.onSecondary }}>We've sent an OTP to your mobile number</Text>
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row" }}>
                    <Text variant='titleLarge' style={{ color: theme.colors.secondaryContainer, fontWeight: "bold" }}>OTP VERIFICATION</Text>
                </View>
                {error &&
                    <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        <Text variant='titleSmall' style={{ color: theme.colors.tertiary }}>OTP has expired or is invalid</Text>
                    </View>
                }
                <View>
                    <PaperOtpInput
                        maxLength={6}
                        onPinReady={(pin) => handleOTP(pin)}
                    />
                </View>
                <View>
                    <Button
                        buttonColor={theme.colors.tertiary}
                        textColor={theme.colors.inverseOnSurface}
                        contentStyle={{ minHeight: 50 }}
                        mode="elevated"
                        onPress={handleConfirmOTP}
                    >
                        CONFIRM OTP
                    </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
                        <Button
                            buttonColor={theme.colors.inverseOnSurface}
                            style={{ marginTop: 20, minWidth: 300 }}
                            mode='elevated'
                            onPress={() => router.back()}
                        >
                            <MaterialCommunityIcons name='arrow-left' />
                            Go Back
                        </Button>
                    </View>
                </View>
            </View >
        </SafeAreaView >
    )
}