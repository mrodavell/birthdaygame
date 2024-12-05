import { router, Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { Alert, AppState, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDarkTheme, AppDefaultTheme } from '../constants/Theme';
import { ThemeProvider } from "@react-navigation/native";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, } from 'react';
import { supabase } from '../lib/supabase';
import { useWalletStore } from '../zustand/wallet';
import { useResultsStore } from '../zustand/results';
import { useGameStore } from '../zustand/game';
import { useUserStore } from '../zustand/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../config/toast-config';
import CongratsDialog from '../components/congratsdialog';
import NetInfo from '@react-native-community/netinfo';

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
    const isWin = useGameStore(state => state.isWin);
    const { fetchWallet } = useWalletStore();
    const { setResults } = useResultsStore();
    const { checkWin, setIsWin, setIsOpenBet } = useGameStore();
    const { setUser } = useUserStore();

    const handleResult = (payload: any) => {
        checkWin(payload.new);
        setResults(payload.new);
    }

    supabase
        .channel('drawresult')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'drawresult' }, handleResult)
        .subscribe()

    const checkSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            throw error;
        }
        if (data.session?.access_token) {
            setUser(data.session.user.phone)
            router.replace("dashboard");
        }
    }

    const getBettingStatus = async () => {
        const { data, error } = await supabase.from('setup').select('is_open_betting').single();
        setIsOpenBet(data?.is_open_betting ?? false);
        if (error) {
            throw error;
        }
    }

    const handleDismiss = () => {
        setIsWin(false);
    }

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            try {
                if (state.isConnected && state.isInternetReachable) {
                    checkSession();
                    getBettingStatus();
                    fetchWallet();
                } else {
                    Alert.alert('No Internet Connection', 'Please check your internet connection and try again.', [{ text: 'OK' }]);
                }
            } catch (error: any) {
                Alert.alert('Error', error.message, [{ text: 'OK' }]);
            }
        });

        SplashScreen.hideAsync();

        return () => {
            unsubscribe();
        }
    }, [])

    return (
        <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme}>
                <SafeAreaProvider>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            animation: 'none'
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
                        <Stack.Screen name='ticket' />
                        <Stack.Screen name='ticketdetails' />
                        <Stack.Screen name='bet' />
                    </Stack>
                    <Toast autoHide={false} config={toastConfig} />
                    {isWin && <CongratsDialog visible={isWin} onDismiss={handleDismiss} />}
                </SafeAreaProvider>
            </ThemeProvider>
        </PaperProvider>
    )
}