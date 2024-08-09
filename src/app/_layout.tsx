import { router, Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppState, useColorScheme } from 'react-native';
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
    const { setResults } = useResultsStore();
    const { checkWin, setTickets } = useGameStore();
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
        if (!error && data.session?.access_token) {
            setUser(data.session.user.phone)
            router.push("dashboard");
        }
    }

    const getTickets = async () => {
        const tickets = await AsyncStorage.getItem('tickets') ?? "";
        if (tickets === "") {
            setTickets([]);
            return;
        }
        setTickets(JSON.parse(tickets ?? ""));
    }


    useEffect(() => {
        checkSession();
        fetchWallet();
        getTickets();
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
                        <Stack.Screen name='ticket' />
                        <Stack.Screen name='ticketdetails' />
                    </Stack>
                    <Toast autoHide={false} config={toastConfig} />
                </SafeAreaProvider>
            </ThemeProvider>
        </PaperProvider>
    )
}