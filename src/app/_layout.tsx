import { router, Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppState, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDarkTheme, AppDefaultTheme } from '../constants/Theme';
import { ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletStore } from '../zustand/wallet';

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated. This should
// only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

    const colorScheme = useColorScheme();
    const paperTheme = colorScheme === "dark" ? AppDarkTheme : AppDefaultTheme;
    const { fetchWallet } = useWalletStore();
    const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (!error && data.session?.access_token) {
            router.push("dashboard");
        }
    }

    useEffect(() => {
        checkSession();
        fetchWallet();
        SplashScreen.hideAsync();
    }, [])

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme}>
                <SafeAreaProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false
                        }}
                        initialRouteName="index"
                    >
                        <Stack.Screen name='index' />
                        <Stack.Screen name='dashboard' />
                        <Stack.Screen name='login' />
                        <Stack.Screen name='register' />
                        <Stack.Screen name='otp' />
                        <Stack.Screen name='recover' />
                        <Stack.Screen name='changepassword' />
                        <Stack.Screen name='termsandcondition' options={{ headerShown: true, title: "Terms and Conditions" }} />
                        <Stack.Screen name='privacy' options={{ headerShown: true, title: "Privacy Policy" }} />
                    </Stack>
                </SafeAreaProvider>
            </ThemeProvider>
        </PaperProvider>
    )
}