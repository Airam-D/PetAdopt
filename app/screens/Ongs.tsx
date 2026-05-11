import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TabParamList } from '../types/navigation';

type Props = BottomTabScreenProps<TabParamList, 'ONGs'>;

// ===== DADOS DAS ONGs =====
const ONGS_DATA = [
    {
        id: '1',
        nome: 'Patas Felizes',
        cidade: 'São Paulo',
        emoji: '🏠',
        descricao: 'Resgate e adoção de cães e gatos',
        telefone: '(11) 98765-4321',
        email: 'contato@patasfelizes.org.br',
    },
    {
        id: '2',
        nome: 'Casa dos Bichos',
        cidade: 'Rio de Janeiro',
        emoji: '🏡',
        descricao: 'Proteção animal e bem-estar pet',
        telefone: '(21) 99876-5432',
        email: 'info@casadosbichos.org.br',
    },
    {
        id: '3',
        nome: 'Amigos do Pet',
        cidade: 'Belo Horizonte',
        emoji: '🏘️',
        descricao: 'Lar temporário para animais',
        telefone: '(31) 98765-6543',
        email: 'amigos@petbh.org.br',
    },
    {
        id: '4',
        nome: 'Salvando Vidas',
        cidade: 'Salvador',
        emoji: '🏰',
        descricao: 'Resgates de emergência e cuidados veterinários',
        telefone: '(71) 99876-7654',
        email: 'contato@salvandovidas.org.br',
    },
    {
        id: '5',
        nome: 'Canil Solidário',
        cidade: 'Curitiba',
        emoji: '🏛️',
        descricao: 'Abrigo para cães resgatados',
        telefone: '(41) 98765-8765',
        email: 'canil@solidario.org.br',
    },
    {
        id: '6',
        nome: 'Gatos do Amor',
        cidade: 'Porto Alegre',
        emoji: '🏪',
        descricao: 'Dedicada ao resgate de felinos',
        telefone: '(51) 99876-9876',
        email: 'gatos@doamor.org.br',
    },
];

// ===== COMPONENTE PRINCIPAL =====
export default function Ongs({ route }: Props) {
    const usuario = route.params?.usuario || 'Visitante';

    const renderOngItem = ({ item }: { item: typeof ONGS_DATA[0] }) => (
        <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <Text style={styles.emojiOng}>{item.emoji}</Text>
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.ongName}>{item.nome}</Text>
                    <Text style={styles.ongCity}>{item.cidade}</Text>
                </View>
            </View>

            <Text style={styles.ongDescricao}>{item.descricao}</Text>

            <View style={styles.cardFooter}>
                <Text style={styles.ongContato}>📱 {item.telefone}</Text>
                <Text style={styles.ongContato}>📧 {item.email}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>ONGs Parceiras 🤝</Text>
                <Text style={styles.headerSubtitle}>Conheça nossas parcerias</Text>
            </View>

            <FlatList
                data={ONGS_DATA}
                renderItem={renderOngItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={true}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

// ===== ESTILOS =====
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EE',
        paddingTop: 20,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8D5C4',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#3D2314',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8B7355',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        gap: 15,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        borderLeftWidth: 5,
        borderLeftColor: '#D8916F',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    emojiOng: {
        fontSize: 40,
    },
    cardTitleContainer: {
        flex: 1,
    },
    ongName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3D2314',
        marginBottom: 4,
    },
    ongCity: {
        fontSize: 12,
        color: '#8B7355',
        fontWeight: '500',
    },
    ongDescricao: {
        fontSize: 14,
        color: '#5C4A42',
        marginBottom: 12,
        lineHeight: 20,
    },
    cardFooter: {
        borderTopWidth: 1,
        borderTopColor: '#E8D5C4',
        paddingTop: 12,
        gap: 6,
    },
    ongContato: {
        fontSize: 12,
        color: '#8B7355',
        fontWeight: '500',
    },
});
