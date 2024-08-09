import { Link, router } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { TextInput, Button, useTheme, Text, Checkbox, HelperText, ActivityIndicator } from 'react-native-paper';
import { SignUpSchema } from '../schemas/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import ShareGame from '../components/sharegame';

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

                let mobile = values.mobileNumber;
                if (mobile.charAt(0) === '0') {
                    mobile = `+63${values.mobileNumber.substring(1)}`;
                }

                const { error } = await supabase.auth.signUp({
                    phone: mobile,
                    password: values.password,
                    options: {
                        channel: 'sms'
                    }
                })

                if (!error) {
                    router.push({
                        pathname: "otp",
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
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
                <ScrollView style={{ maxHeight: screenHeight }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '20%', marginBottom: 40 + bottom }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <ShareGame />
                        </View>
                        <View style={{ padding: 20 }}>
                            <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: 100, width: 100 }} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: -20, marginBottom: 10 }}>
                            <Text style={{
                                fontWeight: "bold", fontSize: 30, color: "#F9DA83", textShadowColor: "#000000", textShadowRadius: 1,
                                textShadowOffset: {
                                    width: 3,
                                    height: 2,
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
                                left={<TextInput.Icon icon="account" size={20} color='#000' />}
                                theme={{ roundness: 10 }}
                                onChangeText={formik.handleChange('fullname')}
                                error={!!formik.errors.fullname && formik.touched.fullname}
                            />
                            {!!formik.errors.fullname &&
                                <HelperText type='error'>
                                    {formik.errors.fullname}
                                </HelperText>
                            }
                        </View>
                        <View>
                            <TextInput
                                placeholder="Mobile No."
                                keyboardType="phone-pad"
                                mode="outlined"
                                left={<TextInput.Icon icon="cellphone-key" size={20} color='#000' />}
                                theme={{ roundness: 10 }}
                                onChangeText={formik.handleChange('mobileNumber')}
                                error={!!formik.errors.mobileNumber && formik.touched.mobileNumber}
                            />
                            {!!formik.errors.mobileNumber &&
                                <HelperText type='error'>
                                    {formik.errors.mobileNumber}
                                </HelperText>
                            }
                        </View>
                        <View>
                            <TextInput
                                secureTextEntry={!showPass}
                                placeholder="Password"
                                mode="outlined"
                                left={<TextInput.Icon icon="lock" size={20} color='#000' />}
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
                                theme={{ roundness: 10 }}
                                onChangeText={formik.handleChange('password')}
                                error={!!formik.errors.password && formik.touched.password}
                            />
                            {!!formik.errors.password &&
                                <HelperText type='error'>
                                    {formik.errors.password}
                                </HelperText>
                            }
                        </View>
                        <View>
                            <TextInput
                                secureTextEntry={!showConfirmPass}
                                placeholder="Confirm Password"
                                mode="outlined"
                                left={<TextInput.Icon icon="lock" size={20} color='#000' />}
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
                                theme={{ roundness: 10 }}
                                onChangeText={formik.handleChange('passwordConfirm')}
                                error={!!formik.errors.passwordConfirm && formik.touched.passwordConfirm}
                            />
                            {!!formik.errors.passwordConfirm &&
                                <HelperText type='error'>
                                    {formik.errors.passwordConfirm}
                                </HelperText>
                            }
                        </View>
                        <View style={{ justifyContent: 'center', flexDirection: 'column', marginLeft: 10 }}>
                            <TouchableOpacity onPress={toggleLegalAge}>
                                <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                    <Checkbox status={legalAge ? 'checked' : 'unchecked'} color={theme.colors.tertiary} />
                                    <Text style={{ fontSize: 20, fontWeight: 'semibold' }}>I am over 21 years old</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{ justifyContent: 'center', flexDirection: 'column', marginLeft: 10 }}>
                            <View style={{ justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                <Text>By tapping register, you accept our <Link href="termsandcondition" style={{ color: theme.colors.error }}>terms and condition</Link>, and our <Link href="privacy" style={{ color: theme.colors.error }}>privacy policy</Link></Text>
                            </View>
                        </View>
                        <View>
                            <Button

                                buttonColor={theme.colors.tertiary}
                                textColor={theme.colors.inverseOnSurface}
                                contentStyle={{ minHeight: 50 }}
                                mode="elevated"
                                onPress={() => formik.submitForm()}
                                disabled={!legalAge || loading}
                            >
                                {!loading && <Text style={{ color: 'white' }}>REGISTER</Text>}
                                {loading && <ActivityIndicator animating={true} color='white' />}
                            </Button>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                                <Text variant='titleMedium' style={{ color: theme.colors.shadow }}>Do you have an account already?</Text>
                                <Button
                                    buttonColor={theme.colors.inversePrimary}
                                    style={{ marginTop: 20, minWidth: 300 }}
                                    textColor='white'
                                    mode='elevated'
                                    onPress={() => router.push("login")}
                                    disabled={loading}
                                >
                                    LOGIN HERE
                                    <MaterialCommunityIcons name='arrow-right' />
                                </Button>
                            </View>
                        </View>
                    </View >
                </ScrollView>
            </SafeAreaView >
        </FormikProvider>
    )
}