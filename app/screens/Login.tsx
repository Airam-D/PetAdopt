import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Animated,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Define o tipo Props com base na navegação
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Obtém dimensões da tela
const { width, height } = Dimensions.get('window');

// Array de emojis decorativos
const PETS = ['🐶', '🐱', '🐰', '🐹', '🐾'];

export default function Login({ navigation }: Props) {
    // ===== ESTADOS =====
    const [nome, setNome] = useState(''); // Armazena o nome digitado
    const [focused, setFocused] = useState(false); // Indica se o input está focado
    const [error, setError] = useState(''); // Armazena mensagem de erro

    // ===== ANIMAÇÕES =====
    // useRef mantém o valor entre renderizações sem causar re-render
    const fadeAnim = useRef(new Animated.Value(0)).current; // Opacidade (0 = invisível)
    const slideAnim = useRef(new Animated.Value(40)).current; // Posição Y (começa 40px abaixo)
    const shakeAnim = useRef(new Animated.Value(0)).current; // Tremor horizontal
    const logoScale = useRef(new Animated.Value(0.8)).current; // Escala do logo (80% do tamanho)

    // ===== EFEITO DE ENTRADA =====
    useEffect(() => {
        // Executa animações em paralelo quando o componente monta
        Animated.parallel([
            // Fade in: opacidade de 0 para 1
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true, // Usa thread nativa para melhor performance
            }),
            // Slide up: move de baixo para posição original
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 60, // Controla a rigidez da mola
                friction: 8, // Controla o amortecimento
                useNativeDriver: true,
            }),
            // Scale up: aumenta o tamanho
            Animated.spring(logoScale, {
                toValue: 1,
                tension: 50,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []); // [] = executa apenas uma vez ao montar

    // ===== FUNÇÃO DE TREMOR (ERRO) =====
    const shake = () => {
        // Sequência de animações para criar efeito de tremor
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
        ]).start();
    };

    // ===== FUNÇÃO DE LOGIN =====
    const handleLogin = () => {
        // Valida se o nome tem pelo menos 2 caracteres
        if (nome.trim().length < 2) {
            setError('Digite pelo menos 2 caracteres 🐾');
            shake(); // Executa animação de erro
            return;
        }
        setError(''); // Limpa erro
        // Navega para MainTabs passando o nome do usuário
        navigation.navigate('MainTabs', { usuario: nome.trim() });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.root}
        >
            {/* Define cor da barra de status */}
            <StatusBar barStyle="dark-content" backgroundColor="#FDF6EE" />

            {/* Elementos decorativos de fundo */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            {/* Pegadas decorativas */}
            <View style={styles.pawContainer}>
                {['🐾', '🐾', '🐾'].map((p, i) => (
                    <Text
                        key={i}
                        style={[
                            styles.pawDecor,
                            {
                                opacity: 0.08 + i * 0.04, // Opacidade aumenta gradualmente
                                top: 80 + i * 100, // Espaçamento vertical
                                left: i % 2 === 0 ? 20 : width - 55 // Alterna esquerda/direita
                            }
                        ]}
                    >
                        {p}
                    </Text>
                ))}
            </View>

            {/* Container principal animado */}
            <Animated.View
                style={[
                    styles.container,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Logo e nome do app */}
                <Animated.View style={[styles.logoArea, { transform: [{ scale: logoScale }] }]}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoEmoji}>🐾</Text>
                    </View>
                    <Text style={styles.appName}>PetAdopt</Text>
                    <Text style={styles.tagline}>Todo pet merece um lar cheio de amor</Text>
                </Animated.View>

                {/* Card de Login (com animação de tremor em caso de erro) */}
                <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
                    <Text style={styles.cardTitle}>Olá, quem é você? 👋</Text>

                    {/* Input de nome */}
                    <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
                        <Text style={styles.inputIcon}>✏️</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Seu nome aqui..."
                            placeholderTextColor="#BBA89A"
                            value={nome}
                            onChangeText={(t) => {
                                setNome(t);
                                setError(''); // Limpa erro ao digitar
                            }}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin} // Enter chama handleLogin
                        />
                    </View>

                    {/* Mensagem de erro */}
                    {error ? <Text style={styles.error}>{error}</Text> : null}

                    {/* Botão de login */}
                    <TouchableOpacity
                        style={[styles.btn, nome.trim().length < 2 && styles.btnDisabled]}
                        onPress={handleLogin}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.btnText}>Encontrar meu pet 🐶</Text>
                    </TouchableOpacity>

                    {/* Hint informativo */}
                    <Text style={styles.hint}>
                        Mais de {' '}
                        <Text style={styles.hintBold}>120 pets</Text>
                        {' '}aguardando adoção
                    </Text>
                </Animated.View>

                {/* Emojis decorativos de pets */}
                <View style={styles.petRow}>
                    {PETS.map((p, i) => (
                        <Text key={i} style={styles.petEmoji}>{p}</Text>
                    ))}
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}

// ===== ESTILOS =====
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FDF6EE',
    },
    blob1: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: '#F9C784',
        opacity: 0.25,
        top: -80,
        right: -80,
    },
    blob2: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#E8A87C',
        opacity: 0.2,
        bottom: 80,
        left: -60,
    },
    pawContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    pawDecor: {
        position: 'absolute',
        fontSize: 48,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
    },
    logoArea: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E8A87C',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#E8A87C',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
    },
    logoEmoji: {
        fontSize: 36,
    },
    appName: {
        fontSize: 36,
        fontWeight: '800',
        color: '#3D2314',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: 14,
        color: '#9A7A6A',
        marginTop: 4,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 28,
        width: '100%',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 6,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#3D2314',
        marginBottom: 20,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDF6EE',
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#EDE0D4',
        paddingHorizontal: 14,
        marginBottom: 8,
    },
    inputWrapFocused: {
        borderColor: '#E8A87C',
        backgroundColor: '#FFFAF5',
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#3D2314',
    },
    error: {
        fontSize: 13,
        color: '#E05C5C',
        marginBottom: 8,
        marginLeft: 4,
    },
    btn: {
        backgroundColor: '#E8A87C',
        borderRadius: 14,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        shadowColor: '#E8A87C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.45,
        shadowRadius: 12,
        elevation: 6,
    },
    btnDisabled: {
        backgroundColor: '#D4C4BA',
        shadowOpacity: 0,
        elevation: 0,
    },
    btnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
    hint: {
        fontSize: 13,
        color: '#9A7A6A',
        textAlign: 'center',
        marginTop: 16,
    },
    hintBold: {
        fontWeight: '700',
        color: '#E8A87C',
    },
    petRow: {
        flexDirection: 'row',
        marginTop: 28,
        gap: 12,
    },
    petEmoji: {
        fontSize: 28,
    },
});