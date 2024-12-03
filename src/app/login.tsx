import { router } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { TextInput, Button, useTheme, Text, ActivityIndicator, IconButton } from 'react-native-paper';
import { AuthSchema } from '../schemas/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import ShareGame from '../components/sharegame';
import { useUserStore } from '../zustand/user';
import { heightScale, moderateWs, widthScale } from '../helpers/scaler';

export default function login() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { setUser } = useUserStore();

    const formik = useFormik({
        initialValues: {
            mobileNumber: '',
            password: '',
        },
        validationSchema: AuthSchema,
        onSubmit: async ({ mobileNumber, password }) => {
            try {

                setLoading(true);

                let mobile = mobileNumber;
                if (mobile.charAt(0) === '0') {
                    mobile = `63${mobileNumber.substring(1)}`;
                }

                const { error } = await supabase.auth.signInWithPassword({
                    phone: mobile,
                    password: password,
                })

                if (!error) {
                    setUser(mobile);
                    router.replace('dashboard');
                }

                if (error) {
                    Alert.alert("Error", "Invalid Credentials", [
                        { text: 'OK' }
                    ])
                }

            } catch (e) {

            } finally {
                setLoading(false);
            }
        }
    })

    return (
        <FormikProvider value={formik}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: heightScale(15), backgroundColor: theme.colors.primary }}>
                <ScrollView style={{ maxHeight: screenHeight }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', gap: widthScale(15), marginTop: heightScale(20), marginBottom: widthScale(30 + bottom) }}>
                        <View style={{ height: heightScale(42), flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <IconButton
                                icon="arrow-left"
                                size={widthScale(20)}
                                onPress={() => router.replace("/")}
                            />
                        </View>
                        <View style={{ height: heightScale(42), flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <ShareGame />
                        </View>
                        <View style={{ padding: widthScale(10) }}>
                            <Image
                                source={require("../../assets/logo.png")}
                                style={{
                                    alignSelf: 'center',
                                    height: heightScale(120),
                                    width: widthScale(120)
                                }}
                            />
                        </View>
                        <View>
                            <TextInput
                                placeholder="Mobile No."
                                keyboardType="phone-pad"
                                mode="outlined"
                                left={<TextInput.Icon icon="cellphone-key" size={widthScale(15)} color='#000' />}
                                theme={{ roundness: widthScale(10) }}
                                onChangeText={formik.handleChange('mobileNumber')}
                                error={!!formik.errors.mobileNumber && formik.touched.mobileNumber}
                                style={{ height: heightScale(40) }}
                            />
                        </View>
                        <View>
                            <TextInput
                                secureTextEntry={!showPass}
                                placeholder="Password"
                                mode="outlined"
                                left={<TextInput.Icon icon="lock" size={widthScale(15)} color='#000' />}
                                right={
                                    <TextInput.Icon
                                        size={widthScale(15)}
                                        icon={showPass ? 'eye' : 'eye-off'}
                                        onPress={() => {
                                            Keyboard.dismiss
                                            setShowPass(prev => !prev)
                                        }}
                                    />
                                }
                                theme={{ roundness: widthScale(10) }}
                                onChangeText={formik.handleChange('password')}
                                error={!!formik.errors.password && formik.touched.password}
                                style={{ height: heightScale(40) }}
                            />
                        </View>
                        <View>
                            <Button
                                buttonColor={theme.colors.tertiary}
                                textColor={theme.colors.inverseOnSurface}
                                contentStyle={{ minHeight: heightScale(15) }}
                                mode="elevated"
                                onPress={() => formik.submitForm()}
                                disabled={loading}
                            >
                                {!loading && <Text style={{ color: 'white', fontSize: moderateWs(12, 1) }}>LOGIN</Text>}
                                {loading && <ActivityIndicator animating={true} color='white' size={moderateWs(12, 1)} />}
                            </Button>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: heightScale(5) }}>
                                <Text variant='titleMedium' style={{ color: theme.colors.shadow, fontSize: moderateWs(12, 1) }}>Forgot Password?</Text>
                                <Button
                                    buttonColor={theme.colors.inversePrimary}
                                    style={{ marginTop: widthScale(5) }}
                                    textColor='white'
                                    mode='elevated'
                                    onPress={() => router.push("recover")}
                                    disabled={loading}
                                >
                                    RECOVER ACCOUNT
                                </Button>
                            </View>
                        </View>
                    </View >
                </ScrollView>
            </SafeAreaView >
        </FormikProvider>

    )
}