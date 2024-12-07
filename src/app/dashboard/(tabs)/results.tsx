import { View, SafeAreaView, useWindowDimensions, Alert, FlatList, RefreshControl } from 'react-native'
import { ActivityIndicator, Button, Divider, IconButton, List, Text, useTheme } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../../../lib/supabase';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { heightScale, moderateWs, widthScale } from '../../../helpers/scaler';
import { useGameStore } from '../../../zustand/game';

type TResult = {
    id: number;
    result: string;
    drawtime: string;
    create_at: string;
};


export default function results() {

    const { top } = useSafeAreaInsets()
    const [loading, setLoading] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(false);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [results, setResults] = useState<TResult[]>([]);
    const [start, setStart] = useState<number>(0);
    const [end, setEnd] = useState<number>(9);
    const [resultsCount, setResultsCount] = useState<number>(0);
    const dimensions = useWindowDimensions();
    const theme = useTheme();

    const { checkWin } = useGameStore();

    const getResultsCount = async () => {
        try {
            const { count, error } = await supabase
                .from('drawresult')
                .select('*', { count: 'exact', head: true })

            if (error) {
                throw error;
            }

            setResultsCount(count ?? 0);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        }
    }

    const getResult = async () => {
        try {
            setLoading(true);
            setStart(0);
            setEnd(9);
            const { data, error } = await supabase
                .from('drawresult')
                .select()
                .order('id', { ascending: false })
                .range(0, 9);

            if (error) {
                throw error;
            }

            setResults(data ?? []);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setLoading(false);
        }
    }

    const getPaginatedResult = async (start = 0, end = 9) => {
        try {
            setScrollLoading(true);
            const { data, error } = await supabase
                .from('drawresult')
                .select()
                .order('id', { ascending: false })
                .range(start, end);

            if (error) {
                throw error;
            }

            setResults([]);
            const prevState = [...results];
            prevState.push(...data);
            setResults([...prevState]);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setScrollLoading(false);
        }
    }

    const handleEndReached = async () => {
        if (resultsCount) {
            let startCount = start;
            let endCount = end;

            if (endCount >= resultsCount) {
                return
            }

            if ((endCount + 5) <= resultsCount) {
                startCount = endCount + 1;
                endCount = endCount + 5;
            } else {
                startCount = endCount + 1;
                endCount = resultsCount;
            }

            setStart(startCount);
            setEnd(endCount);

            getPaginatedResult(startCount, endCount);
        }
    }

    const checkResult = async () => {
        try {
            setChecking(true);
            const { data, error } = await supabase.from('drawresult').select().order('id', { ascending: false }).limit(1);

            if (error) {
                throw error;
            }

            const result = data[0];
            checkWin(result);
        } catch (error: any) {
            Alert.alert('Error', error.message, [{ text: 'OK' }]);
        } finally {
            setChecking(false);
        }
    }

    useEffect(() => {
        getResultsCount();
    }, [])

    useEffect(() => {
        getResult();
    }, [])

    return (
        <SafeAreaView
            style={{
                flex: 1,
                paddingHorizontal: widthScale(15),
                marginTop: heightScale(top + 5),
                marginBottom: widthScale(10),
                justifyContent: 'flex-start',
            }}
        >
            {!loading &&
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', marginTop: widthScale(60), marginLeft: widthScale(10) }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 2 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='calendar-outline' size={widthScale(20)} style={{ marginRight: widthScale(8) }} />
                                    <Text style={{ fontSize: moderateWs(20, 1) }}>
                                        Result:
                                    </Text>
                                    {results[0] &&
                                        <Text
                                            style={{
                                                fontSize: moderateWs(18, 1),
                                                color: theme.colors.tertiary,
                                                fontWeight: 'bold',
                                                marginLeft: widthScale(10)
                                            }}>
                                            {results[0].result}
                                        </Text>
                                    }
                                    {!results[0] &&
                                        <Text style={{
                                            fontSize: moderateWs(18, 1),
                                            color: theme.colors.tertiary,
                                            fontWeight: 'bold',
                                            marginLeft: widthScale(10)
                                        }}>N/A</Text>
                                    }
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <MaterialCommunityIcons name='clock-outline' size={widthScale(20)} style={{ marginRight: widthScale(8) }} />
                                    <Text style={{ fontSize: moderateWs(20, 1) }}>
                                        Time:
                                    </Text>
                                    {results[0] &&
                                        <Text
                                            style={{
                                                fontSize: moderateWs(18, 1),
                                                color: theme.colors.tertiary,
                                                fontWeight: 'bold',
                                                marginLeft: widthScale(10)
                                            }}>
                                            {results[0].drawtime} {results[0].drawtime === '10:00' ? 'AM' : 'PM'}
                                        </Text>
                                    }
                                    {!results[0] &&
                                        <Text style={{
                                            fontSize: moderateWs(18, 1),
                                            color: theme.colors.tertiary,
                                            fontWeight: 'bold',
                                            marginLeft: widthScale(10)
                                        }}>N/A</Text>
                                    }
                                </View>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Button
                                    loading={checking}
                                    mode='contained'
                                    icon="reload"
                                    style={{ alignItems: 'center' }}
                                    contentStyle={{ flexDirection: 'row-reverse' }}
                                    buttonColor={theme.colors.tertiary}
                                    onPress={checkResult}
                                >
                                    Check
                                </Button>
                            </View>
                        </View>
                        <View style={{ marginTop: widthScale(10) }}>
                            <Button loading={loading} mode='contained' labelStyle={{ fontSize: moderateWs(14, 1) }} onPress={getResult}>RELOAD RESULTS</Button>
                        </View>
                    </View>
                </View>
            }
            {!loading && !scrollLoading && results.length === 0 &&
                <View style={{ minHeight: heightScale(dimensions.height * 0.5), flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialCommunityIcons name='database-search-outline' size={widthScale(110)} color='gray' />
                    <Text style={{ fontSize: moderateWs(20, 1) }}>No results available</Text>
                </View>
            }
            {!loading && results.length > 0 &&
                <View style={{ flex: 1 }}>
                    <Divider style={{ height: 1, marginHorizontal: widthScale(10), marginTop: widthScale(10) }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', borderWidth: 1, borderColor: 'transparent', marginTop: heightScale(10) }}>
                        <Text style={{ fontSize: moderateWs(14, 1), marginLeft: widthScale(10) }}>Previous Results</Text>
                    </View>
                    <FlatList
                        style={{ flex: 1, marginHorizontal: widthScale(5) }}
                        onEndReachedThreshold={0.8}
                        onEndReached={() => handleEndReached()}
                        refreshControl={<RefreshControl refreshing={loading} onRefresh={() => getResult()} />}
                        showsVerticalScrollIndicator={false}
                        data={results}
                        renderItem={({ item, index }) => {
                            const isLast = index === results.length - 1;
                            return <View key={`results-${item.id}`} style={{ marginTop: heightScale(10), paddingHorizontal: widthScale(3), marginBottom: isLast ? widthScale(20) : widthScale(0) }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialCommunityIcons name='calendar' size={widthScale(12)} style={{ marginRight: widthScale(2), marginBottom: heightScale(5) }} />
                                        <Text style={{ fontSize: moderateWs(12, 1), marginBottom: heightScale(5) }}>Date: {dayjs(item.create_at).format('MMM DD, YYYY')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialCommunityIcons name='clock-outline' size={widthScale(12)} style={{ marginRight: widthScale(2), marginBottom: heightScale(5) }} />
                                        <Text style={{ fontSize: moderateWs(12, 1), marginBottom: heightScale(5) }}>Draw Time: {`${item.drawtime} ${item.drawtime === '10:00' ? 'AM' : 'PM'}`}</Text>
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
                                    titleStyle={{ color: theme.colors.tertiary, fontSize: moderateWs(16, 1), fontWeight: 'bold', textAlign: 'center' }}
                                />
                            </View>
                        }}
                    />
                    {scrollLoading &&
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator animating={true} color={theme.colors.primary} size={30} />
                            <Text style={{ marginTop: heightScale(10) }}>Loading More Data...</Text>
                        </View>
                    }
                </View>
            }
            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator animating={true} color={theme.colors.primary} size={50} />
                    <Text style={{ marginTop: heightScale(10) }}>Loading Data...</Text>
                </View>
            }
        </SafeAreaView >
    )
}