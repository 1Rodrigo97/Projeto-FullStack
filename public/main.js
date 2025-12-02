/* global Vue */
// public/main.js - CÓDIGO FINAL CORRIGIDO

const { createApp, ref, reactive } = Vue; // Simplificado

const app = createApp({
     setup() {
     // --- Estado Reativo (Dados) ---
        // Use a porta que funcionou para você (ex: 3000 ou 8000)
       const API_ROOT = 'http://localhost:8000'; // Raiz da API
        const API_AUTH_URL = API_ROOT + '/api/auth'; // Endpoint de Auth
        
        // Verifica o localStorage para persistir login
        const token = ref(localStorage.getItem('userToken') || null);
        const user = reactive(JSON.parse(localStorage.getItem('user') || '{}'));
        
        const auth = reactive({ email: '', password: '' });
        const isLogin = ref(true); 
        
        const errorMessage = ref('');
        const profileMessage = ref(null);

        // --- MÉTODOS DE AUTENTICAÇÃO ---

        const authAction = async () => {
            // Limpa mensagens de erro e perfil
            errorMessage.value = '';
            profileMessage.value = null;
        
            // Define o endpoint baseado no estado atual (Login ou Cadastro)
            const endpoint = isLogin.value ? '/login' : '/signup';

            try {
                // 1. Faz a requisição de rede para o backend
                const response = await fetch(API_AUTH_URL + endpoint, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(auth),
                });

                // 2. Processa a resposta JSON
                const data = await response.json();

                // 3. Se a resposta NÃO for OK (status 4xx ou 5xx)
                if (!response.ok) {
                    const errorMessageText = data.message || `Erro ao processar ${isLogin.value ? 'Login' : 'Registro'}.`;
                    
                    // ----------------------------------------------------
                    // LÓGICA DE UX MELHORADA: DIRECIONAR PARA CADASTRO
                    // ----------------------------------------------------
                    if (isLogin.value && errorMessageText.includes('Credenciais inválidas')) {
                        // Se for Login e as credenciais forem inválidas, muda para a tela de Cadastro
                        errorMessage.value = 'E-mail ou senha incorretos. Você pode tentar novamente ou se Cadastrar.';
                        isLogin.value = false; // <-- Ação de UX
                    } else {
                        errorMessage.value = errorMessageText;
                    }
                    // ----------------------------------------------------
                    
                    return; // Interrompe a função em caso de erro
                }

                // 4. Sucesso: Salvar token e dados do usuário localmente
                token.value = data.token;
                Object.assign(user, data.user);

                localStorage.setItem('userToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Limpar formulário e erros
                auth.email = '';
                auth.password = '';
                errorMessage.value = '';

            } catch (error) {
                // 5. Erro de rede (servidor offline)
                console.error('Erro de rede:', error);
                errorMessage.value = 'Não foi possível conectar ao servidor backend. Verifique se o "npm start" está rodando.';
            }
        };

        const logout = () => {
            // Limpa o estado e o localStorage
            token.value = null;
            Object.keys(user).forEach(key => delete user[key]);
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            profileMessage.value = null;
        };

        // --- MÉTODOS PARA ROTAS PROTEGIDAS ---

       const fetchProfile = async () => {
            profileMessage.value = 'Carregando rota protegida...';
            try {
            // Usar a URL completa para evitar erros de resolução de caminho
                const response = await fetch(API_ROOT + '/api/users/profile', { 
                    method: 'GET',
                    headers: {
                        // CRUCIAL: Enviar o token JWT no cabeçalho Authorization
                        'Authorization': `Bearer ${token.value}` 
                    },
                });
                const data = await response.json();
                
                if (!response.ok) {
                    profileMessage.value = `ACESSO NEGADO: ${data.message || 'Falha na autenticação.'}`;
                    return;
                }
                
                profileMessage.value = JSON.stringify(data, null, 2);

            } catch (error) {
                profileMessage.value = 'Erro de rede ao acessar a rota protegida.';
            }
        };


        return {
            token,
            user,
            auth,
            isLogin,
            errorMessage,
            profileMessage,
            authAction,
            logout,
            fetchProfile
        };
    }
});

app.mount('#app');