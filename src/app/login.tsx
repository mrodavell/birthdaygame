import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import { View, Image, SafeAreaView, Keyboard, ScrollView, Alert, useWindowDimensions } from 'react-native';
import { TextInput, Button, useTheme, Text, HelperText, ActivityIndicator, IconButton } from 'react-native-paper';
import { AuthSchema } from '../schemas/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import ShareGame from '../components/sharegame';

export default function login() {

    const theme = useTheme();
    const dimensions = useWindowDimensions();
    const screenHeight = dimensions.height;
    const { bottom } = useSafeAreaInsets();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

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
                    router.push('dashboard');
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
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: theme.colors.primary }}>
                <ScrollView style={{ maxHeight: screenHeight }} showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, flexGrow: 1, flexDirection: 'column', justifyContent: 'flex-start', gap: 20, marginTop: '20%', marginBottom: 40 + bottom }}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <ShareGame />
                        </View>
                        <View style={{ padding: 20 }}>
                            <Image source={require("../../assets/logo.png")} style={{ alignSelf: 'center', height: 200, width: 200 }} />
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
                            <Button
                                buttonColor={theme.colors.tertiary}
                                textColor={theme.colors.inverseOnSurface}
                                contentStyle={{ minHeight: 50 }}
                                mode="elevated"
                                onPress={() => formik.submitForm()}
                                disabled={loading}
                            >
                                {!loading && <Text style={{ color: 'white' }}>LOGIN</Text>}
                                {loading && <ActivityIndicator animating={true} color='white' />}
                            </Button>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                                <Text variant='titleMedium' style={{ color: theme.colors.shadow }}>Don't have an account yet?</Text>
                                <Button
                                    buttonColor={theme.colors.inversePrimary}
                                    style={{ marginTop: 20, minWidth: 300 }}
                                    textColor='white'
                                    mode='elevated'
                                    onPress={() => router.push("register")}
                                    disabled={loading}
                                >
                                    REGISTER HERE
                                    <MaterialCommunityIcons name='arrow-right' />
                                </Button>
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', marginTop: 10 }}>
                                <Text variant='titleMedium' style={{ color: theme.colors.shadow }}>Forgot Password?</Text>
                                <Button
                                    buttonColor={theme.colors.inversePrimary}
                                    style={{ marginTop: 20, minWidth: 300 }}
                                    textColor='white'
                                    mode='elevated'
                                    onPress={() => router.push("recover")}
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