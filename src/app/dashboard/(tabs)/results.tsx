import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert } from 'react-native'
import { ActivityIndicator, Card, Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type TResult = {
    id: number;
    result: string;
    create_at: string;
};


export default function results() {

    const { bottom, top } = useSafeAreaInsets()
    const [fetching, setFetching] = useState<boolean>(false);
    const [results, setResults] = useState<TResult[]>([]);
    const dimensions = useWindowDimensions();
    const theme = useTheme();

    const getResult = async () => {
        try {
            setFetching(true);
            const { data, error } = await supabase.from('drawresult').select().limit(5);
            if (error) {
                Alert.alert('Error', 'Unable to fetch data from server');
                return;
            }

            setResults(data);
        } catch (e) {

        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        getResult();
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, flexGrow: 1, flexDirection: 'column', paddingHorizontal: 10, marginTop: 20 + top, marginBottom: bottom, justifyContent: 'flex-start' }}>
            <ScrollView style={{ maxHeight: dimensions.height }} showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 30, flex: 1, justifyContent: 'center' }}>
                    <View style={{ flex: 1, padding: 10 }}>
                        {!fetching && results.length === 0 && <View style={{ minHeight: dimensions.height * 0.5, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 20 }}>No results available</Text>
                        </View>}
                        {!fetching && results.length > 0 &&
                            <View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                                    <MaterialCommunityIcons name='clipboard-text-clock' size={20} style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 20 }}>
                                        Results Log
                                    </Text>
                                </View>
                                <Divider style={{ flex: 1, height: 1, marginHorizontal: 10, marginTop: 10 }} />
                            </View>
                        }
                        {results.map((value, index) => {
                            return <View key={`results-${index}`} style={{ marginTop: 15 }}>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <MaterialCommunityIcons name='calendar' size={18} style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 18, marginBottom: 5 }}>Date: {dayjs(value.create_at).format('MMM DD, YYYY h:m:s A')}</Text>
                                </View>
                                <List.Item
                                    style={{ padding: 10, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5, backgroundColor: theme.colors.surface, borderRadius: 5 }}
                                    title={`Result: ${value.result}`}
                                    titleStyle={{ color: theme.colors.secondary, fontSize: 18 }}
                                />
                            </View>
                        })}
                    </View>
                </View>
                {fetching &&
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator animating={true} color={theme.colors.primary} size={50} />
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    )
}