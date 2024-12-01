import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard } from 'react-native';
import { Button, useTheme, Text, TextInput } from 'react-native-paper';
import { PaperOtpInput } from 'react-native-paper-otp-input';
import { supabase } from '../lib/supabase';
import { moderateWs, widthScale } from '../helpers/scaler';

export default function otp() {

    const theme = useTheme();
    const { pathTo, phone } = useLocalSearchParams<{ pathTo: string, phone?: string }>();
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("OTP has expired or is invalid");
    const [loading, setLoading] = useState<boolean>(false);

    const handleOTP = (pin: string) => {
        setError(false);
        setOtp(pin)
    }

    const handleConfirmOTP = async () => {

        if (!phone) {
            setErrorText("Phone number is required");
            setError(true);
            return;
        }

        if (otp === "") {
            setErrorText("OTP is required");
            setError(true);
            return;
        }

        try {
            setLoading(true);

            // const { data, error } = await supabase.auth.verifyOtp({ phone: phone, token: otp, type: 'sms' })
            // console.log({ data, error })
            if (otp !== "123456") {
                setErrorText("OTP is invalid");
                setError(true);
                return;
            }

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
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: widthScale(25) }}>
                <View style={{ padding: 20 }}>
                    <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: widthScale(100), width: widthScale(100) }} />
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row" }}>
                    <Text variant='titleSmall' style={{ color: theme.colors.onSecondary }}>We've sent an OTP to your mobile number</Text>
                </View>
                <View style={{ justifyContent: "center", flexDirection: "row" }}>
                    <Text variant='titleLarge' style={{ color: theme.colors.secondaryContainer, fontWeight: "bold", fontSize: moderateWs(18, 1) }}>OTP VERIFICATION</Text>
                </View>
                {error &&
                    <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        <Text variant='titleSmall' style={{ color: theme.colors.tertiary }}>{errorText}</Text>
                    </View>
                }
                <View>
                    <TextInput
                        value={otp}
                        placeholder="Enter OTP"
                        contentStyle={{ textAlign: 'center', height: widthScale(50) }}
                        onChangeText={(pin) => handleOTP(pin)}
                        textAlign='center'
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