import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList, TabParamList } from '../types/navigation';

type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'Explorar'>,
    NativeStackScreenProps<RootStackParamList>
>;

// ===== DADOS MOCKADOS DOS PETS =====
const PETS_DATA = [
    {
        id: '1',
        nome: 'Bobi',
        especie: 'Cachorro',
        idade: '2 anos',
        porte: 'Médio',
        cidade: 'São Paulo, SP',
        cor: '#FFE8CC',
        emoji: '🐶',
        tags: ['Brincalhão', 'Vacinado', 'Castrado'],
        descricao:
            'Bobi é um cachorro jovem e cheio de energia que adora correr e brincar no parque. É super carinhoso, inteligente e se dá muito bem com crianças e outros pets. Procuramos uma família ativa que possa dar bastante atenção e exercício a ele.',
        peso: '12 kg',
        saude: ['Vacinado em dia', 'Castrado', 'Vermifugado', 'Microchipado'],
    },
    {
        id: '2',
        nome: 'Mel',
        especie: 'Gato',
        idade: '1 ano',
        porte: 'Pequeno',
        cidade: 'Campinas, SP',
        cor: '#E8F4E8',
        emoji: '🐱',
        tags: ['Tranquilo', 'Vacinado', 'Indoor'],
        descricao:
            'Mel é uma gatinha delicada e carinhosa que ama colos e ambientes tranquilos. Perfeita para apartamentos, ela passa a maior parte do tempo dormindo ao sol. Já está acostumada com caixa de areia e arranhador.',
        peso: '3,5 kg',
        saude: ['Vacinada em dia', 'Castrada', 'Vermifugada', 'Saudável'],
    },
    {
        id: '3',
        nome: 'Rex',
        especie: 'Cachorro',
        idade: '4 anos',
        porte: 'Grande',
        cidade: 'Santos, SP',
        cor: '#EDE8FF',
        emoji: '🦮',
        tags: ['Protetor', 'Adestrado', 'Castrado'],
        descricao:
            'Rex é um cachorro leal, inteligente e já adestrado. Responde a comandos básicos e adora aprender truques. É protetor com sua família mas dócil com visitantes. Precisa de um espaço amplo para se sentir bem.',
        peso: '28 kg',
        saude: ['Vacinado em dia', 'Castrado', 'Vermifugado', 'Adestrado'],
    },
    {
        id: '4',
        nome: 'Nina',
        especie: 'Coelha',
        idade: '8 meses',
        porte: 'Pequeno',
        cidade: 'São Paulo, SP',
        cor: '#FFE8F0',
        emoji: '🐰',
        tags: ['Delicada', 'Vacinada', 'Sociável'],
        descricao:
            'Nina é uma coelhinha cheia de personalidade e energia! Adora brincar, pular e explorar. Se dá bem com outras coelhas e animais calmos. Precisa de um lar com gaiola espaçosa e momentos livres para se exercitar.',
        peso: '1,8 kg',
        saude: ['Vacinada', 'Vermifugada', 'Saudável'],
    },
    {
        id: '5',
        nome: 'Thor',
        especie: 'Cachorro',
        idade: '3 anos',
        porte: 'Grande',
        cidade: 'Guarulhos, SP',
        cor: '#FFF3E0',
        emoji: '🐕',
        tags: ['Energético', 'Vacinado', 'Ativa'],
        descricao:
            'Thor é um cachorro extremamente energético que precisa de muito exercício diário. Ama trilhas, corridas e atividades ao ar livre. Prefere um lar com quintal ou família muito ativa. É leal e amoroso com seus tutores.',
        peso: '32 kg',
        saude: ['Vacinado em dia', 'Vermifugado', 'Saudável'],
    },
];


export default function Home({ route, navigation }: Props) {
    const usuario = route.params?.usuario || 'Visitante';
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    // Função que define como CADA item da lista será desenhado
    const renderPetItem = ({ item }: { item: typeof PETS_DATA[0] }) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: item.cor }]} activeOpacity={0.8} onPress={() => navigation.navigate('PetDetalhes', { petID: item.id, nomePet: item.nome })}>
            <View style={styles.cardEmoji}>
                <Text style={styles.emojiText}>{item.emoji}</Text>
            </View>

            <View style={styles.cardInfo}>
                <Text style={styles.petNome}>{item.nome}</Text>
                <Text style={styles.petDetails}>{item.especie} ° {item.idade}</Text>
                <Text style={styles.petCity}> 📍 {item.cidade}</Text>
            </View>

            <View style={styles.arrowBtn}>
                <Text style={styles.arrowText}>→</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <Text style={styles.welcome}>Bem-vindo, {usuario}! 👋</Text>
                <Text style={styles.title}>Encontre seu Companheiro</Text>
            </View>

            <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
                <FlatList 
                    data={PETS_DATA} // 1. A fonte de dados
                    keyExtractor={(item) => item.id} // 2. Identificador único
                    renderItem={renderPetItem} // 3. Função para renderizar cada item
                    contentContainerStyle={styles.listContent}
                />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF6EE',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E8D5C4',
    },
    welcome: {
        fontSize: 14,
        color: '#9A7A6A',
        fontWeight: '500',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#3D2314',
        marginTop: 4,
    },
    listContent: {
        padding: 20,
        paddingTop: 16,
    },
    card: {
        flexDirection: 'row',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        alignItems: 'center',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    cardEmoji: {
        width: 70,
        height: 70,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emojiText: {
        fontSize: 35,
    },
    cardInfo: {
        flex: 1,
        marginLeft: 16,
    },
    petNome: {
        fontSize: 20,
        fontWeight: '800',
        color: '#3D2314',
    },
    petDetails: {
        fontSize: 14,
        color: '#5A3A2A',
        marginTop: 2,
    },
    petCity: {
        fontSize: 12,
        color: '#9A7A6A',
        marginTop: 6,
    },
    arrowBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3D2314',
    },
});