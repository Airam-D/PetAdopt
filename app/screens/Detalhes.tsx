import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
type Props = NativeStackScreenProps<RootStackParamList, 'PetDetalhes'>;

export default function Detalhes({ route }: Props) {
    const { nomePet } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Você está vendo os detalhes de: {nomePet}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontSize: 18
    }
})