import { Link, router } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, TouchableOpacity, ScrollView, useWindowDimensions, Alert } from 'react-native';
import { TextInput, Button, useTheme, Text, Checkbox, ActivityIndicator, IconButton } from 'react-native-paper';
import { SignUpSchema } from '../schemas/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { heightScale, moderateWs, widthScale } from '../helpers/scaler';

export default function register() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);
    const [legalAge, setLegalAge] = useState<boolean>(false);
    const toggleLegalAge = () => setLegalAge(prev => !prev);
    const [loading, setLoading] = useState<boolean>(false);

    const formik = useFormik({
        initialValues: {
            fullname: '',
            mobileNumber: '',
            password: '',
            passwordConfirm: ''
        },
        validationSchema: SignUpSchema,
        onSubmit: async (values) => {
            try {
                setLoading(true);

                if (legalAge === false) {
                    Alert.alert("Error", "You must be over 21 years old to register", [
                        { text: 'OK' }
                    ])
                    return;
                }

                let mobile = values.mobileNumber;
                if (mobile.charAt(0) === '0') {
                    mobile = `+63${values.mobileNumber.substring(1)}`;
                }

                const { error } = await supabase.auth.signUp({
                    phone: mobile,
                    password: values.password,
                })

                if (!error) {
                    router.push({
                        pathname: "login",
                        params: {
                            phone: mobile
                        }
                    });
                }

            } catch (e) {
                console.log(e)
            } finally {
                setLoading(false);
            }
        }
    })

    return (
        <FormikProvider value={formik}>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: widthScale(20), backgroundColor: theme.colors.primary }}>
                <ScrollView style={{ maxHeight: screenHeight }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: widthScale(10), marginTop: heightScale(20), marginBottom: heightScale(40 + bottom) }}>
                        <View style={{ height: heightScale(42), flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <IconButton
                                    icon="arrow-left"
                                    size={widthScale(20)}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ padding: 20 }}>
                            <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: heightScale(100), width: widthScale(100) }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: heightScale(-20), marginBottom: heightScale(10) }}>
                            <Text style={{
                                fontWeight: "bold",
                                fontSize: moderateWs(18, 1),
                                color: "#F9DA83",
                                textShadowColor: "#000000",
                                textShadowRadius: 1,
                                textShadowOffset: {
                                    width: widthScale(3),
                                    height: heightScale(2),
                                },
                                overflow: 'visible'
                            }}>
                                Let's Register
                            </Text>
                        </View>
                        <View>
                            <TextInput
                                placeholder="Fullname"
                                mode="outlined"
                                left={<TextInput.Icon icon="account" size={widthScale(20)} color='#000' />}
                                theme={{ roundness: widthScale(10) }}
                                onChangeText={formik.handleChange('fullname')}
                                error={!!formik.errors.fullname && formik.touched.fullname}
                                style={{ height: heightScale(42) }}
                            />
                        </View>
                        <View>
                            <TextInput
                                placeholder="Mobile No."
                                keyboardType="phone-pad"
                                mode="outlined"
                                left={<TextInput.Icon icon="cellphone-key" size={widthScale(20)} color='#000' />}
                                theme={{ roundness: widthScale(10) }}
                                onChangeText={formik.handleChange('mobileNumber')}
                                error={!!formik.errors.mobileNumber && formik.touched.mobileNumber}
                                style={{ height: heightScale(42) }}
                            />
                        </View>
                        <View>
                            <TextInput
                                secureTextEntry={!showPass}
                                placeholder="Password"
                                mode="outlined"
                                left={<TextInput.Icon icon="lock" size={widthScale(20)} color='#000' />}
                                right={
                                    <TextInput.Icon
                                        size={20}
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
                                style={{ height: heightScale(42) }}
                            />
                        </View>
                        <View>
                            <TextInput
                                secureTextEntry={!showConfirmPass}
                                placeholder="Confirm Password"
                                mode="outlined"
                                left={<TextInput.Icon icon="lock" size={widthScale(20)} color='#000' />}
                                right={
                                    <TextInput.Icon
                                        size={20}
                                        icon={showConfirmPass ? 'eye' : 'eye-off'}
                                        onPress={() => {
                                            Keyboard.dismiss
                                            setShowConfirmPass(prev => !prev)
                                        }}
                                    />
                                }
                                theme={{ roundness: widthScale(10) }}
                                onChangeText={formik.handleChange('passwordConfirm')}
                                error={!!formik.errors.passwordConfirm && formik.touched.passwordConfirm}
                                style={{ height: heightScale(42) }}
                            />
                        </View>
                        <View style={{ justifyContent: 'center', flexDirection: 'column', marginLeft: 10 }}>
                            <TouchableOpacity onPress={toggleLegalAge}>
                                <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                    <Checkbox status={legalAge ? 'checked' : 'unchecked'} color={theme.colors.tertiary} />
                                    <Text style={{ fontSize: moderateWs(12, 1), fontWeight: 'semibold' }}>I am over 21 years old</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', flexDirection: 'column', marginLeft: 10 }}>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                <Text>By tapping register, you accept our <Link href="termsandcondition" style={{ color: theme.colors.error }}>terms and condition</Link>, and our <Link href="privacy" style={{ color: theme.colors.error }}>privacy policy</Link></Text>
                            </View>
                        </View>
                        <View style={{ marginTop: heightScale(10) }}>
                            <Button
                                textColor={theme.colors.inverseOnSurface}
                                contentStyle={{ minHeight: heightScale(10), backgroundColor: legalAge ? theme.colors.tertiary : 'gray' }}
                                mode="elevated"
                                onPress={() => formik.submitForm()}
                                disabled={!legalAge || loading}
                            >
                                {!loading && <Text style={{ color: 'white', fontSize: moderateWs(12, 1) }}>REGISTER</Text>}
                                {loading && <ActivityIndicator animating={true} color='white' />}
                            </Button>
                        </View>
                    </View >
                </ScrollView>
            </SafeAreaView >
        </FormikProvider>
    )
}