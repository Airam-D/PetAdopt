// Define os tipos de parâmetros para cada tela do Stack Naigation
export type RootStackParamList = {
    Login: undefined; // Não recebe parâmetros
    MainTabs: { usuario: string }; // Recebe o nome do usuário
    PetDetalhes: { petID: string; nomePet: string }; // Recebe ID e nome do pet
};

// Define os tipos de parâmetros para cada aba do Tab Navigator
export type TabParamList = {
    Explorar: { usuario: string }; // Aba Home recebe o usuário
    Favoritos: { usuario: string };
    Perfil: { usuario: string }; // Aba Perfil recebe o usuário
    ONGs: { usuario: string }; // Aba ONGs recebe o usuário
}
