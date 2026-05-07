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