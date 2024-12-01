import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, Alert } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { moderateWs, widthScale } from '../helpers/scaler';
import { supabase } from '../lib/supabase';

export default function recover() {

    const theme = useTheme();
    const [mobile, setMobile] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [showPass, setShowPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    const handleNav = async () => {

        if (mobile === "") {
            Alert.alert("Error", "Mobile number is required");
            return;
        }

        router.push({
            pathname: "otp",
            params: { pathTo: "changepassword", phone: mobile }
        })

    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(20), backgroundColor: theme.colors.primary }}>
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: widthScale(20), marginTop: widthScale(25) }}>
                <View style={{ padding: widthScale(20) }}>
                    <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: widthScale(100), width: widthScale(100) }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
                    <Text style={{
                        fontWeight: "bold", fontSize: moderateWs(25, 1), color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
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
                        onChangeText={text => setMobile(text)}
                        placeholder="Mobile No."
                        keyboardType="number-pad"
                        mode="outlined"
                        left={
                            <TextInput.Icon
                                icon="cellphone-key"
                                size={widthScale(20)}
                                color='#000'
                            />
                        }
                        theme={{ roundness: moderateWs(10, 1) }}
                    />
                </View>
                <View>
                    <Button
                        buttonColor={theme.colors.tertiary}
                        textColor={theme.colors.inverseOnSurface}
                        contentStyle={{ minHeight: widthScale(40) }}
                        mode="elevated"
                        onPress={() => handleNav()}
                    >
                        SEND OTP
                    </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: widthScale(20) }}>
                        <Button
                            buttonColor={theme.colors.inverseOnSurface}
                            style={{ marginTop: widthScale(20), minWidth: widthScale(200) }}
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