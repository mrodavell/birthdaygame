import { View, SafeAreaView, ScrollView, useWindowDimensions, Alert, FlatList } from 'react-native'
import { ActivityIndicator, Card, Divider, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../../lib/supabase';
import { Fragment, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';

type TResult = {
    id: number;
    result: string;
    drawtime: string;
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
            const { data, error } = await supabase.from('drawresult').select().order('id', { ascending: false }).limit(10);

            if (error) {
                Alert.alert('Error', 'Unable to fetch data from server');
                return;
            }

            setResults([...data]);
        } catch (e) {

        } finally {
            setFetching(false);
        }
    }

    useEffect(() => {
        getResult();
    }, [])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: widthScale(5),
                marginTop: heightScale(top),
                justifyContent: 'flex-start',
            }}
        >
            {!fetching &&
                <View style={{
                    padding: widthScale(10),
                    height: heightScale(dimensions.height * 0.85),
                }}>
                    {results.length === 0 && <View style={{ minHeight: heightScale(dimensions.height * 0.5), flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name='database-search-outline' size={widthScale(110)} color='gray' />
                        <Text style={{ fontSize: moderateWs(20, 1) }}>No results available</Text>
                    </View>}
                    {results.length !== 0 &&
                        <View style={{ height: heightScale(dimensions.height * 0.85) }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: heightScale(60), marginLeft: widthScale(10) }}>
                                <MaterialCommunityIcons name='clipboard-text-clock' size={widthScale(20)} style={{ marginRight: widthScale(8) }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ fontSize: moderateWs(20, 1) }}>
                                        Latest Result:
                                    </Text>
                                    <Text style={{ fontSize: moderateWs(20, 1), color: theme.colors.tertiary, fontWeight: 'bold', marginLeft: widthScale(10) }}>{results[0].result}</Text>
                                </View>
                            </View>
                            <Divider style={{ height: 1, marginHorizontal: widthScale(10), marginTop: widthScale(10) }} />
                            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'transparent', marginTop: heightScale(10) }}>
                                <Text style={{ fontSize: moderateWs(14, 1), marginLeft: widthScale(10) }}>Previous Results</Text>
                            </View>
                            <FlatList
                                style={{ marginHorizontal: widthScale(5) }}
                                showsVerticalScrollIndicator={false}
                                data={results}
                                renderItem={({ item }) => {
                                    return <View key={`results-${item.id}`} style={{ marginTop: heightScale(10), paddingHorizontal: widthScale(10) }}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialCommunityIcons name='calendar' size={widthScale(12)} style={{ marginRight: widthScale(2), marginBottom: heightScale(5) }} />
                                                <Text style={{ fontSize: moderateWs(12, 1), marginBottom: heightScale(5) }}>Date: {dayjs(item.create_at).format('MMM DD, YYYY')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <MaterialCommunityIcons name='clock-outline' size={widthScale(12)} style={{ marginRight: widthScale(2), marginBottom: heightScale(5) }} />
                                                <Text style={{ fontSize: moderateWs(12, 1), marginBottom: heightScale(5) }}>Time: {`${item.drawtime} ${item.drawtime === '10:00' ? 'AM' : 'PM'}`}</Text>
                                            </View>
                                        </View>
                                        <List.Item
                                            style={{
                                                padding: widthScale(10),
                                                shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.25,
                                                shadowRadius: 3.84,
                                                elevation: 5,
                                                backgroundColor: theme.colors.surface,
                                                borderRadius: 5
                                            }}
                                            title={`Result: ${item.result}`}
                                            titleStyle={{ color: theme.colors.secondary, fontSize: moderateWs(14, 1) }}
                                        />
                                    </View>
                                }}
                            />
                        </View>
                    }
                </View>
            }
            {
                fetching &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={50} />
                    <Text style={{ marginTop: heightScale(10) }}>Loading Data...</Text>
                </View>
            }
        </SafeAreaView >
    )
}