import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { RootStackParamList, TabParamList } from '../types/navigation';

// Props compostas: combina tipos de Tab + Stack
type Props = CompositeScreenProps<
    BottomTabScreenProps<TabParamList, 'Perfil'>,
    NativeStackScreenProps<RootStackParamList>
>;

// ===== DADOS DO MENU =====
const MENU_ITEMS = [
    { emoji: '❤️', label: 'Meus Favoritos', sub: '3 pets salvos', action: 'favoritos' },
    { emoji: '📋', label: 'Minhas Solicitações', sub: '1 em andamento', action: 'solicitacoes' },
    { emoji: '🔔', label: 'Notificações', sub: 'Ativadas', action: 'notificacoes' },
    { emoji: '🏠', label: 'ONGs Parceiras', sub: '12 parceiros', action: 'ongs' },
    { emoji: '📖', label: 'Guia do Tutor', sub: 'Dicas e cuidados', action: 'guia' },
    { emoji: '⚙️', label: 'Configurações', sub: 'Conta e privacidade', action: 'config' },
];

export default function Perfil({ route, navigation }: Props) {
    // ===== OBTÉM NOME DO USUÁRIO =====
    // Usa operador || para valor padrão caso não exista
    const usuario = route.params?.usuario || 'Visitante';

    // ===== ANIMAÇÕES =====
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const avatarScale = useRef(new Animated.Value(0.7)).current;

    // ===== ANIMAÇÕES DE ENTRADA =====
    useEffect(() => {
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
            Animated.spring(avatarScale, {
                toValue: 1,
                tension: 60,
                friction: 7,
                useNativeDriver: true
            }),
        ]).start();
    }, []);

    // ===== FUNÇÃO DE LOGOUT =====
    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Tem certeza que deseja sair da sua conta?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: () => {
                        // navigation.reset reseta a pilha de navegação
                        // Volta para Login e remove histórico
                        (navigation as any).reset({
                            index: 0,
                            routes: [{ name: 'Login' }]
                        });
                    },
                },
            ]
        );
    };

    // ===== FUNÇÃO GENÉRICA PARA ITENS DO MENU =====
    const handleMenuItem = (action: string) => {
        Alert.alert(
            'Em breve!',
            `A funcionalidade "${action}" estará disponível em breve. 🐾`
        );
    };

    // ===== OBTÉM PRIMEIRA LETRA DO NOME =====
    // .charAt(0) pega o primeiro caractere
    // .toUpperCase() converte para maiúscula
    const inicial = usuario.charAt(0).toUpperCase();

    return (
        <View style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ===== HEADER COM FUNDO DECORATIVO ===== */}
                <View style={styles.headerBg}>
                    <View style={styles.blobHeader1} />
                    <View style={styles.blobHeader2} />
                </View>

                <Animated.View
                    style={[
                        styles.container,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    {/* ===== AVATAR DO USUÁRIO ===== */}
                    <Animated.View
                        style={[
                            styles.avatarArea,
                            { transform: [{ scale: avatarScale }] }
                        ]}
                    >
                        <View style={styles.avatarCircle}>
                            <Text style={styles.avatarText}>{inicial}</Text>
                        </View>
                        {/* Badge decorativo */}
                        <View style={styles.avatarBadge}>
                            <Text style={styles.avatarBadgeText}>🐾</Text>
                        </View>
                    </Animated.View>

                    <Text style={styles.userName}>{usuario}</Text>
                    <Text style={styles.userSub}>Adotante em potencial</Text>

                    {/* ===== CARD DE ESTATÍSTICAS ===== */}
                    <View style={styles.statsCard}>
                        {[
                            { val: '3', label: 'Favoritos', emoji: '❤️' },
                            { val: '1', label: 'Pedidos', emoji: '📋' },
                            { val: '0', label: 'Adotados', emoji: '🏡' },
                        ].map((s, i) => (
                            <React.Fragment key={i}>
                                {/* Adiciona divisor entre stats, exceto antes do primeiro */}
                                {i > 0 && <View style={styles.statDivider} />}
                                <View style={styles.stat}>
                                    <Text style={styles.statEmoji}>{s.emoji}</Text>
                                    <Text style={styles.statVal}>{s.val}</Text>
                                    <Text style={styles.statLabel}>{s.label}</Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>

                    {/* ===== CARD DE DICA ===== */}
                    <View style={styles.tipCard}>
                        <Text style={styles.tipEmoji}>💡</Text>
                        <View style={styles.tipContent}>
                            <Text style={styles.tipTitle}>Sabia que?</Text>
                            <Text style={styles.tipText}>
                                Adotar um pet pode reduzir o estresse e aumentar a felicidade em até 60%!
                            </Text>
                        </View>
                    </View>

                    {/* ===== MENU DE OPÇÕES ===== */}
                    <Text style={styles.menuTitle}>Minha conta</Text>
                    <View style={styles.menuCard}>
                        {MENU_ITEMS.map((item, i) => (
                            <TouchableOpacity
                                key={i}
                                style={[
                                    styles.menuItem,
                                    // Adiciona borda inferior, exceto no último item
                                    i < MENU_ITEMS.length - 1 && styles.menuItemBorder
                                ]}
                                onPress={() => handleMenuItem(item.action)}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                                <View style={styles.menuText}>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Text style={styles.menuSub}>{item.sub}</Text>
                                </View>
                                {/* Seta indicadora */}
                                <Text style={styles.menuArrow}>›</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ===== BOTÃO DE LOGOUT ===== */}
                    <TouchableOpacity
                        style={styles.logoutBtn}
                        onPress={handleLogout}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.logoutText}>Sair da conta</Text>
                    </TouchableOpacity>

                    <Text style={styles.version}>PetAdopt v1.0.0 · Feito com 🐾</Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// ===== ESTILOS =====
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FDF6EE',
    },
    headerBg: {
        height: 200,
        backgroundColor: '#3D2314',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
    },
    blobHeader1: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#E8A87C',
        opacity: 0.2,
        top: -60,
        right: -40,
    },
    blobHeader2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F9C784',
        opacity: 0.15,
        bottom: -40,
        left: 30,
    },
    container: {
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 40,
    },
    avatarArea: {
        position: 'relative',
        marginBottom: 16,
    },
    avatarCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#E8A87C',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FDF6EE',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFF',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FDF6EE',
    },
    avatarBadgeText: {
        fontSize: 14
    },
    userName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#3D2314',
        letterSpacing: -0.5,
    },
    userSub: {
        fontSize: 14,
        color: '#9A7A6A',
        marginTop: 4,
        fontStyle: 'italic',
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginTop: 24,
        width: '100%',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 4,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#EDE0D4',
        marginVertical: 4,
    },
    statEmoji: {
        fontSize: 18,
        marginBottom: 4
    },
    statVal: {
        fontSize: 22,
        fontWeight: '800',
        color: '#3D2314'
    },
    statLabel: {
        fontSize: 11,
        color: '#9A7A6A',
        fontWeight: '500',
        marginTop: 2
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: '#3D2314',
        borderRadius: 20,
        padding: 16,
        marginTop: 16,
        width: '100%',
        gap: 12,
        alignItems: 'center',
    },
    tipEmoji: {
        fontSize: 28
    },
    tipContent: {
        flex: 1
    },
    tipTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#E8A87C',
        marginBottom: 4
    },
    tipText: {
        fontSize: 13,
        color: '#BBA89A',
        lineHeight: 18
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#3D2314',
        alignSelf: 'flex-start',
        marginTop: 24,
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    menuCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        width: '100%',
        shadowColor: '#3D2314',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F5EDE4',
    },
    menuEmoji: {
        fontSize: 20,
        width: 32,
        textAlign: 'center'
    },
    menuText: {
        flex: 1
    },
    menuLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#3D2314'
    },
    menuSub: {
        fontSize: 12,
        color: '#9A7A6A',
        marginTop: 1
    },
    menuArrow: {
        fontSize: 20,
        color: '#BBA89A',
        fontWeight: '300'
    },
    logoutBtn: {
        marginTop: 20,
        width: '100%',
        height: 50,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#E05C5C',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#E05C5C',
    },
    version: {
        fontSize: 12,
        color: '#BBA89A',
        marginTop: 20,
    },
});