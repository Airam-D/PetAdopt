# 📱 Roteiro Completo de Criação do Projeto PetAdopt - React Native

## 🎯 Objetivo do Projeto
Criar um aplicativo de adoção de pets com navegação entre telas, autenticação básica, listagem de animais e visualização de detalhes.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app no seu celular (iOS ou Android)

---

## 🚀 Passo a Passo

### **Etapa 1: Criação do Projeto Base**

```bash
# 1. Criar o projeto Expo
npx create-expo-app PetAdopt
cd PetAdopt

# 2. Instalar as dependências de navegação
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs

# 3. Instalar dependências do Expo para navegação
npx expo install react-native-screens react-native-safe-area-context
```

**O que cada pacote faz:**
- `@react-navigation/native`: Base da navegação no React Native
- `@react-navigation/native-stack`: Navegação em pilha (stack)
- `@react-navigation/bottom-tabs`: Abas na parte inferior
- `react-native-screens`: Otimização de performance das telas
- `react-native-safe-area-context`: Gerencia áreas seguras (notch, barra inferior)

---

### **Etapa 2: Estrutura de Pastas**

```bash
# Criar pastas necessárias
mkdir -p app/screens
mkdir -p app/types
```

**Estrutura final:**
```
PetAdopt/
├── app/
│   ├── screens/
│   │   ├── Login.tsx
│   │   ├── Home.tsx
│   │   ├── Perfil.tsx
│   │   └── Detalhes.tsx
│   ├── types/
│   │   └── navigation.ts
│   ├── _layout.tsx
│   └── index.tsx
├── package.json
└── app.json
```

---

### **Etapa 3: Configurar os Tipos de Navegação**

Crie o arquivo `app/types/navigation.ts`:

```typescript
// Define os tipos de parâmetros para cada tela do Stack Navigator
export type RootStackParamList = {
  Login: undefined; // Não recebe parâmetros
  MainTabs: { usuario: string }; // Recebe o nome do usuário
  PetDetalhes: { petId: string; nomePet: string }; // Recebe ID e nome do pet
};

// Define os tipos de parâmetros para cada aba do Tab Navigator
export type TabParamList = {
  Explorar: { usuario: string }; // Aba Home recebe o usuário
  Favoritos: { usuario: string };
  Perfil: { usuario: string }; // Aba Perfil recebe o usuário
};
```

**📚 Explicação:**
- `undefined`: A tela não recebe parâmetros
- `{ usuario: string }`: A tela recebe um objeto com a propriedade `usuario` do tipo string
- TypeScript garante que você passe os parâmetros corretos ao navegar

---

### **Etapa 4: Criar a Tela de Login**

Crie o arquivo `app/screens/Login.tsx`:

```typescript
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
```

**📚 Conceitos principais:**
- **useState**: Gerencia estado (dados que mudam)
- **useRef**: Mantém referências que não causam re-render
- **useEffect**: Executa código quando o componente monta
- **Animated**: Biblioteca de animações do React Native
- **KeyboardAvoidingView**: Evita que o teclado cubra o conteúdo

---

### **Etapa 5: Criar a Tela Home (Explorar)**

Crie o arquivo `app/screens/Home.tsx`:

```typescript
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
const PETS_DATA: Record
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
  const { petId, nomePet } = route.params;
  
  // Busca os dados do pet pelo ID, ou usa valores padrão se não encontrar
  const pet = PETS_DATA[petId] || {
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
```

**📚 Conceitos principais:**
- **Record<string, {...}>**: Tipo TypeScript para objeto com chaves dinâmicas
- **route.params**: Recebe parâmetros enviados pela navegação
- **navigation.setOptions()**: Personaliza o header da tela
- **ScrollView**: Permite rolagem vertical
- **position: 'absolute'**: Posiciona elemento de forma absoluta (botão fixo)
- **.map()**: Itera sobre arrays para renderizar múltiplos elementos

---

### **Etapa 6: Criar a Tela de Perfil**

Crie o arquivo `app/screens/Perfil.tsx`:

```typescript
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../types/navigation';

// Props compostas: combina tipos de Tab + Stack
type Props = CompositeScreenProps
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
            navigation.reset({ 
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
```

**📚 Conceitos principais:**
- **CompositeScreenProps**: Combina múltiplos tipos de props de navegação
- **React.Fragment**: Agrupa elementos sem adicionar nó extra no DOM
- **navigation.reset()**: Reseta a pilha de navegação (útil para logout)
- **opcional chaining (?.)**: Acessa propriedades que podem não existir
- **Alert.alert()**: Exibe diálogo nativo com botões

---


### **Etapa 7: Criar a Tela de Perfil**

Crie o arquivo `app/screens/Perfil.tsx`. Esta tela é responsável por mostrar as informações do usuário logado e oferecer um menu de opções (como favoritos e configurações).

**Principais conceitos desta tela:**
* **Recebimento de Dados:** Usa o nome vindo da tela de Login via `route.params`.
* **Animações de Entrada:** Utiliza `Animated.parallel` para animar a opacidade, a posição e a escala do avatar simultaneamente.
* **Feedback ao Usuário:** Usa `Alert.alert` para simular ações de menu e confirmar o logout.



```tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  Alert,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Perfil'>,
  NativeStackScreenProps<RootStackParamList>
>;

const MENU_ITEMS = [
  { emoji: '❤️', label: 'Meus Favoritos', sub: '3 pets salvos', action: 'favoritos' },
  { emoji: '📋', label: 'Minhas Solicitações', sub: '1 em andamento', action: 'solicitacoes' },
  { emoji: '🔔', label: 'Notificações', sub: 'Ativadas', action: 'notificacoes' },
  { emoji: '🏠', label: 'ONGs Parceiras', sub: '12 parceiros', action: 'ongs' },
  { emoji: '📖', label: 'Guia do Tutor', sub: 'Dicas e cuidados', action: 'guia' },
  { emoji: '⚙️', label: 'Configurações', sub: 'Conta e privacidade', action: 'config' },
];

export default function Perfil({ route, navigation }: Props) {
  const usuario = route.params?.usuario || 'Visitante';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const avatarScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
      Animated.spring(avatarScale, { toValue: 1, tension: 60, friction: 7, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) },
    ]);
  };

  const inicial = usuario.charAt(0).toUpperCase();

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerBg} />
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Animated.View style={[styles.avatarArea, { transform: [{ scale: avatarScale }] }]}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>{inicial}</Text></View>
          </Animated.View>
          <Text style={styles.userName}>{usuario}</Text>
          <View style={styles.statsCard}>
            <View style={styles.stat}><Text style={styles.statVal}>3</Text><Text style={styles.statLabel}>Favoritos</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={styles.statVal}>1</Text><Text style={styles.statLabel}>Pedidos</Text></View>
          </View>
          <View style={styles.menuCard}>
            {MENU_ITEMS.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]} onPress={() => Alert.alert('Em breve!')}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <View style={styles.menuText}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuSub}>{item.sub}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}><Text style={styles.logoutText}>Sair da conta</Text></TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FDF6EE' },
  headerBg: { height: 180, backgroundColor: '#3D2314', position: 'absolute', top: 0, left: 0, right: 0 },
  container: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  avatarArea: { marginBottom: 16 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#E8A87C', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FDF6EE' },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#FFF' },
  userName: { fontSize: 26, fontWeight: '800', color: '#3D2314' },
  statsCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 20, marginTop: 24, width: '100%', elevation: 4 },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: '#EDE0D4' },
  statVal: { fontSize: 22, fontWeight: '800', color: '#3D2314' },
  statLabel: { fontSize: 11, color: '#9A7A6A' },
  menuCard: { backgroundColor: '#FFF', borderRadius: 20, width: '100%', marginTop: 24, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#F5EDE4' },
  menuEmoji: { fontSize: 20 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#3D2314' },
  menuSub: { fontSize: 12, color: '#9A7A6A' },
  logoutBtn: { marginTop: 20, width: '100%', height: 50, borderRadius: 14, borderWidth: 2, borderColor: '#E05C5C', justifyContent: 'center', alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#E05C5C' },
});
```

---

### **Etapa 8: Configurar a Navegação Principal**

Edite o arquivo `app/index.tsx`. Este arquivo é o "cérebro" da navegação, onde combinamos as abas inferiores com a pilha de telas.

**O que acontece aqui:**
* **TabNavigator:** Cria as abas "Explorar" e "Perfil".
* **TabIcon:** Um componente customizado que mostra um "balão" escuro quando a aba está selecionada.
* **AppNavigation (Stack):** Define que o app começa no Login, vai para as abas (MainTabs) e pode abrir a tela de Detalhes.

```tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, TabParamList } from './types/navigation';

import Login from './screens/Login';
import Home from './screens/Home';
import Perfil from './screens/Perfil';
import Detalhes from './screens/Detalhes';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[tabStyles.iconWrap, focused && tabStyles.iconWrapActive]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      {focused && <Text style={tabStyles.label}>{label}</Text>}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconWrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 25, gap: 8 },
  iconWrapActive: { backgroundColor: '#3D2314' },
  emoji: { fontSize: 26 },
  label: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});

function TabNavigator({ route }: any) {
  const usuario = route?.params?.usuario || 'Visitante';
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarShowLabel: false, tabBarStyle: { height: Platform.OS === 'ios' ? 100 : 80 } }}>
      <Tab.Screen name="Explorar" component={Home} initialParams={{ usuario }} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Explorar" focused={focused} /> }} />
      <Tab.Screen name="Perfil" component={Perfil} initialParams={{ usuario }} options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Perfil" focused={focused} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PetDetalhes" component={Detalhes} options={{ headerShown: true, headerTitle: '', headerStyle: { backgroundColor: '#FDF6EE' }, headerShadowVisible: false }} />
    </Stack.Navigator>
  );
}
```

---

### **Etapa 9: Configurar o Layout Raiz**

Crie ou edite `app/_layout.tsx`. No Expo Router, este arquivo define como as telas são montadas globalmente.

**Importante:** Ele garante que o arquivo `index.tsx` (que contém nossa navegação configurada na Etapa 8) seja renderizado corretamente dentro do ambiente do Expo.

```tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* O index.tsx é o ponto de entrada principal */}
      <Stack.Screen name="index" /> 
      {/* Definimos que telas internas de navegação não devem mostrar headers duplicados */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```