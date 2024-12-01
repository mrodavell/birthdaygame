import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, Alert } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { moderateWs, widthScale } from '../helpers/scaler';

export default function changepassword() {

    const theme = useTheme();
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [showPass, setShowPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    const handleChangePassword = async () => {

        if (password === "") {
            Alert.alert("Error", "Password is required");
            return;
        }

        if (confirmPassword === "") {
            Alert.alert("Error", "Confirm Password is required");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        router.push("login");
    }

    return (
        <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(20), backgroundColor: theme.colors.primary }}>
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: widthScale(20), marginTop: widthScale(20) }}>
                <View style={{ padding: 20 }}>
                    <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: widthScale(100), width: widthScale(100) }} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
                    <Text style={{
                        fontWeight: "bold", fontSize: moderateWs(20, 1), color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
                        textShadowOffset: {
                            width: 3,
                            height: 2,
                        },
                        overflow: 'visible'
                    }}>
                        Change Password
                    </Text>
                </View>
                <View>
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        secureTextEntry={!showPass}
                        placeholder="New Password"
                        mode="outlined"
                        left={<TextInput.Icon icon="lock" size={widthScale(18)} color='#000' />}
                        right={
                            <TextInput.Icon
                                size={widthScale(18)}
                                icon={showPass ? 'eye' : 'eye-off'}
                                onPress={() => {
                                    Keyboard.dismiss
                                    setShowPass(prev => !prev)
                                }}
                            />
                        }
                        theme={{ roundness: 10 }}
                    />
                </View>
                <View>
                    <TextInput
                        value={confirmPassword}
                        onChangeText={text => setConfirmPassword(text)}
                        secureTextEntry={!showConfirmPass}
                        placeholder="Confirm Password"
                        mode="outlined"
                        left={<TextInput.Icon icon="lock" size={widthScale(18)} color='#000' />}
                        right={
                            <TextInput.Icon
                                size={widthScale(18)}
                                icon={showConfirmPass ? 'eye' : 'eye-off'}
                                onPress={() => {
                                    Keyboard.dismiss
                                    setShowConfirmPass(prev => !prev)
                                }}
                            />
                        }
                        theme={{ roundness: 10 }}
                    />
                </View>
                <View>
                    <Button
                        buttonColor={theme.colors.tertiary}
                        textColor={theme.colors.inverseOnSurface}
                        contentStyle={{ minHeight: 50 }}
                        mode="elevated"
                        onPress={() => handleChangePassword()}
                    >
                        SUBMIT
                    </Button>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: widthScale(20) }}>
                        <Button
                            buttonColor={theme.colors.inverseOnSurface}
                            style={{ marginTop: widthScale(20), minWidth: widthScale(300) }}
                            mode='elevated'
                            onPress={() => router.push("login")}
                        >
                            <MaterialCommunityIcons name='arrow-left' />
                            Cancel and Go login
                        </Button>
                    </View>
                </View>
            </View >
        </SafeAreaView >
    )
}