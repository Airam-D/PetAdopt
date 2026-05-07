import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ScrollView,
    StatusBar,
    Dimensions,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'PetDetalhes'>;

const { width, height } = Dimensions.get('window');

// ===== DADOS MOCKADOS DOS PETS =====
const PETS_DATA: Record<
    string,
    {
        nome: string;
        especie: string;
        idade: string;
        porte: string;
        cidade: string;
        cor: string;
        emoji: string;
        tags: string[];
        descricao: string;
        peso: string;
        saude: string[];
    }
> = {
    '1': {
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
    '2': {
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
    '3': {
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
    '4': {
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
    '5': {
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
};

export default function Detalhes({ route, navigation }: Props) {
    // ===== OBTÉM PARÂMETROS DA NAVEGAÇÃO =====
    const { petID, nomePet } = route.params;

    // Busca os dados do pet pelo ID, ou usa valores padrão se não encontrar
    const pet = PETS_DATA[petID] || {
        nome: nomePet,
        especie: '?',
        idade: '?',
        porte: '?',
        cidade: '?',
        cor: '#FFE8CC',
        emoji: '🐾',
        tags: [],
        descricao: 'Informações indisponíveis.',
        peso: '?',
        saude: [],
    };

    // ===== ESTADOS E ANIMAÇÕES =====
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const [favorito, setFavorito] = useState(false);
    const heartScale = useRef(new Animated.Value(1)).current;

    // ===== CONFIGURA HEADER E ANIMAÇÕES NA MONTAGEM =====
    useEffect(() => {
        // Personaliza o header com o nome do pet
        navigation.setOptions({
            title: pet.nome,
            headerTintColor: '#3D2314',
            headerBackTitle: 'Voltar'
        });

        // Animações de entrada
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true
            }),
        ]).start();
    }, []);

    // ===== FUNÇÃO TOGGLE FAVORITO =====
    const toggleFav = () => {
        setFavorito(!favorito); // Inverte o estado
        // Animação de "pulso" no coração
        Animated.sequence([
            Animated.spring(heartScale, {
                toValue: 1.4,
                useNativeDriver: true,
                tension: 200
            }),
            Animated.spring(heartScale, {
                toValue: 1,
                useNativeDriver: true,
                tension: 200
            }),
        ]).start();
    };

    // ===== FUNÇÃO ADOTAR =====
    const handleAdotar = () => {
        Alert.alert(
            '🐾 Interesse registrado!',
            `Recebemos seu interesse em adotar ${pet.nome}! Nossa equipe entrará em contato em breve.`,
            [{ text: 'Ótimo! 🎉', style: 'default' }]
        );
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="dark-content" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ===== HERO CARD ===== */}
                <Animated.View
                    style={[
                        styles.hero,
                        {
                            backgroundColor: pet.cor,
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        },
                    ]}
                >
                    <View style={styles.heroContent}>
                        {/* Círculo com emoji do pet */}
                        <View style={styles.bigEmojiCircle}>
                            <Text style={styles.bigEmoji}>{pet.emoji}</Text>
                        </View>

                        {/* Nome e informações básicas */}
                        <Text style={styles.petNome}>{pet.nome}</Text>
                        <Text style={styles.petSub}>{pet.especie} · {pet.porte} · {pet.peso}</Text>

                        {/* Localização */}
                        <View style={styles.cidadeRow}>
                            <Text style={styles.cidadeText}>📍 {pet.cidade}</Text>
                        </View>

                        {/* Tags de características */}
                        <View style={styles.tagsRow}>
                            {pet.tags.map((tag, i) => (
                                <View key={i} style={styles.tag}>
                                    <Text style={styles.tagText}>{tag}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Botão de favorito */}
                    <TouchableOpacity style={styles.favBtn} onPress={toggleFav}>
                        <Animated.Text style={[styles.favIcon, { transform: [{ scale: heartScale }] }]}>
                            {favorito ? '❤️' : '🤍'}
                        </Animated.Text>
                    </TouchableOpacity>
                </Animated.View>

                {/* ===== GRID DE INFORMAÇÕES RÁPIDAS ===== */}
                <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
                    <View style={styles.infoGrid}>
                        {[
                            { label: 'Idade', val: pet.idade, emoji: '🎂' },
                            { label: 'Porte', val: pet.porte, emoji: '📏' },
                            { label: 'Peso', val: pet.peso, emoji: '⚖️' },
                            { label: 'Espécie', val: pet.especie, emoji: '🐾' },
                        ].map((info, i) => (
                            <View key={i} style={styles.infoCard}>
                                <Text style={styles.infoEmoji}>{info.emoji}</Text>
                                <Text style={styles.infoVal}>{info.val}</Text>
                                <Text style={styles.infoLabel}>{info.label}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* ===== SEÇÃO SOBRE ===== */}
                <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
                    <Text style={styles.sectionTitle}>Sobre {pet.nome}</Text>
                    <Text style={styles.descText}>{pet.descricao}</Text>
                </Animated.View>

                {/* ===== SEÇÃO SAÚDE ===== */}
                <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
                    <Text style={styles.sectionTitle}>Saúde & Cuidados</Text>
                    <View style={styles.saudeGrid}>
                        {pet.saude.map((item, i) => (
                            <View key={i} style={styles.saudeItem}>
                                <Text style={styles.saudeCheck}>✅</Text>
                                <Text style={styles.saudeText}>{item}</Text>
                            </View>
                        ))}
                    </View>
                </Animated.View>

                {/* ===== CARD DA ONG ===== */}
                <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
                    <View style={styles.ongCard}>
                        <Text style={styles.ongEmoji}>🏠</Text>
                        <View style={styles.ongInfo}>
                            <Text style={styles.ongNome}>ONG Amor Animal</Text>
                            <Text style={styles.ongSub}>Responsável por {pet.nome}</Text>
                            <Text style={styles.ongCidade}>📍 {pet.cidade}</Text>
                        </View>
                        <TouchableOpacity style={styles.ongContatoBtn}>
                            <Text style={styles.ongContatoText}>💬</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Espaço para o botão fixo não cobrir o conteúdo */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* ===== BARRA INFERIOR FIXA ===== */}
            <Animated.View style={[styles.bottomBar, { opacity: fadeAnim }]}>
                <TouchableOpacity style={styles.btnAdotar} onPress={handleAdotar} activeOpacity={0.9}>
                    <Text style={styles.btnAdotarText}>Quero adotar {pet.nome} 🐾</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

// ===== ESTILOS =====
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FDF6EE',
    },
    hero: {
        marginHorizontal: 20,
        marginTop: 16,
        borderRadius: 28,
        padding: 28,
        alignItems: 'center',
        position: 'relative',
    },
    heroContent: {
        alignItems: 'center',
        width: '100%'
    },
    bigEmojiCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    bigEmoji: {
        fontSize: 50
    },
    petNome: {
        fontSize: 32,
        fontWeight: '800',
        color: '#3D2314',
        letterSpacing: -0.8,
    },
    petSub: {
        fontSize: 15,
        color: '#7A5A4A',
        fontWeight: '500',
        marginTop: 4,
    },
    cidadeRow: {
        marginTop: 8,
        backgroundColor: 'rgba(61,35,20,0.08)',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
    },
    cidadeText: {
        fontSize: 13,
        color: '#5A3A2A',
        fontWeight: '600'
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 14,
        justifyContent: 'center',
    },
    tag: {
        backgroundColor: 'rgba(61,35,20,0.1)',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#3D2314'
    },
    favBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favIcon: {
        fontSize: 22
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 20,
    },
    infoGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    infoCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    infoEmoji: {
        fontSize: 18,
        marginBottom: 6
    },
    infoVal: {
        fontSize: 14,
        fontWeight: '800',
        color: '#3D2314'
    },
    infoLabel: {
        fontSize: 10,
        color: '#9A7A6A',
        fontWeight: '500',
        marginTop: 2
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3D2314',
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    descText: {
        fontSize: 15,
        color: '#6B4C3B',
        lineHeight: 23,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
    },
    saudeGrid: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        gap: 10,
    },
    saudeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    saudeCheck: {
        fontSize: 16
    },
    saudeText: {
        fontSize: 14,
        color: '#5A3A2A',
        fontWeight: '500'
    },
    ongCard: {
        backgroundColor: '#3D2314',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    ongEmoji: {
        fontSize: 36
    },
    ongInfo: {
        flex: 1
    },
    ongNome: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF'
    },
    ongSub: {
        fontSize: 12,
        color: '#BBA89A',
        marginTop: 2
    },
    ongCidade: {
        fontSize: 12,
        color: '#9A7A6A',
        marginTop: 2
    },
    ongContatoBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8A87C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ongContatoText: {
        fontSize: 20
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FDF6EE',
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#EDE0D4',
    },
    btnAdotar: {
        backgroundColor: '#E8A87C',
        borderRadius: 16,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#E8A87C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    btnAdotarText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFF',
        letterSpacing: 0.2,
    },
});