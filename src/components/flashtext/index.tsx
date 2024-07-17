import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function FlashText() {

    const theme = useTheme();

    return (
        <View style={{ flex: 1, }}>
            <Text style={{ fontSize: 20, color: 'white' }}>Betting Closes In</Text>
        </View>
    );
}
