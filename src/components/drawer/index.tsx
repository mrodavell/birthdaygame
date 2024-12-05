import { View, Image, Alert } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { router } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../lib/supabase'
import { useState } from 'react'
import Indicator from '../indicator'
import { useUserStore } from '../../zustand/user'
import { heightScale, widthScale } from '../../helpers/scaler'

export default function DrawerContent(props: any) {

    const year = new Date().getFullYear();
    const phone = useUserStore((state) => state.phone);
    const [logout, setLogout] = useState<boolean>(false);

    const handleLogout = async () => {

        try {
            setLogout(true);
            const { error } = await supabase.auth.signOut();

            if (error) {
                throw error;
            }

            router.replace("login");

        } catch (error: any) {
            Alert.alert("Error", error.message, [{ text: 'OK' }]);
        } finally {
            setLogout(false);
        }

    }

    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                scrollEnabled={true}
                contentContainerStyle={{ paddingTop: top }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: 20 + top,
                        paddingBottom: 20
                    }}
                >
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={{
                            alignSelf: 'center',
                            height: heightScale(100),
                            width: widthScale(100)
                        }}
                    />
                    <Text style={{ marginTop: 15 }}>+{phone}</Text>
                </View>
                <DrawerItemList {...props} />
                <DrawerItem
                    label="Logout"
                    icon={({ color, size }) => (
                        <MaterialCommunityIcons name='logout' color={color} size={size} />
                    )}
                    onPress={handleLogout}
                />
            </DrawerContentScrollView>
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingBottom: 20 + bottom
                }}
            >
                <Text>
                    Copyright &copy; {year}. All rights reserved
                </Text>
            </View>
            {logout &&
                <Indicator visible={logout} onDismiss={() => setLogout(prev => !prev)}>
                    <ActivityIndicator size={50} />
                </Indicator>
            }
        </View>
    )
}