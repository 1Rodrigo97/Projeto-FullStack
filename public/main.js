// public/main.js

const { createApp, ref, reactive, onMounted } = Vue;

const app = createApp({
    setup() {
        // --- Estado Reativo (Dados) ---
        const API_URL = '/api/auth';
        
        // Verifica o localStorage para persistir login
        const token = ref(localStorage.getItem('userToken') || null);
        const user = reactive(JSON.parse(localStorage.getItem('user') || '{}'));
        
        const auth = reactive({ email: '', password: '' });
        const isLogin = ref(true); 
        
        const errorMessage = ref('');
        const profileMessage = ref(null);

        // --- MÉTODOS DE AUTENTICAÇÃO ---

        const authAction = async () => {
            errorMessage.value = '';
            profileMessage.value = null;
            const endpoint = isLogin.value ? '/login' : '/signup';

            try {
                const response = await fetch(API_URL + endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(auth),
                });

                const data = await response.json();

                if (!response.ok) {
                    errorMessage.value = data.message || `Erro ao processar ${isLogin.value ? 'Login' : 'Registro'}.`;
                    return;
                }

                // Sucesso: Salvar token e dados do usuário localmente
                token.value = data.token;
                Object.assign(user, data.user);

                localStorage.setItem('userToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Limpar formulário e erros
                auth.email = '';
                auth.password = '';
                errorMessage.value = '';

            } catch (error) {
                console.error('Erro de rede:', error);
                errorMessage.value = 'Não foi possível conectar ao servidor backend.';
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
                const response = await fetch('/api/users/profile', {
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