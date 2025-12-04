/* global Vue */
// public/main.js - CÓDIGO FINAL, COMPLETO E ESTÁVEL

const { createApp, ref, reactive, computed } = Vue; 

const app = createApp({
    setup() {
        const API_ROOT = 'http://localhost:8000'; 
        const API_AUTH_URL = API_ROOT + '/api/auth';
        const API_TASKS_URL = API_ROOT + '/api/tasks';
        const API_IMPORT_URL = API_ROOT + '/api/import';
        const API_DATA_URL = API_ROOT + '/api/data'; 

        // --- Estado Global ---
        const token = ref(localStorage.getItem('userToken') || null);
        const user = reactive(JSON.parse(localStorage.getItem('user') || '{}'));
        const auth = reactive({ email: '', password: '' });
        const isLogin = ref(true); 
        const errorMessage = ref('');
        const profileMessage = ref(null); 
        
        // --- Estado de Tarefas ---
        const tasks = ref([]);
        const newTaskTitle = ref('');
        const tasksError = ref('');
        const pendingTasksCount = computed(() => {
            return tasks.value.filter(t => !t.completed).length;
        });

        // --- Estado de Importação CSV ---
        const productFile = ref(null);
        const customerFile = ref(null);
        const importError = ref('');
        const importMessage = ref('');

        // --- Estado de Visualização/Paginação ---
        const currentView = ref('customers'); 
        const items = ref([]);
        const totalItems = ref(0);
        const totalPages = ref(1);
        const currentPage = ref(1);
        const viewError = ref('');
        const pageSize = 20;


        // =======================================================
        // MÉTODOS AUXILIARES E COMPUTED
        // =======================================================

        const getAuthHeaders = () => {
            return {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.value}`
            };
        };
        
        const tableHeaders = computed(() => {
            if (currentView.value === 'customers') {
                return ['ID', 'Name', 'Email', 'Phone'];
            }
            return ['ID', 'SKU', 'Name', 'Price', 'Stock'];
        });

        // 🚨 FUNÇÃO getCellValue: Resolvendo o erro de renderização do template.
        const getCellValue = (item, header) => {
            let key = header.toLowerCase().replace(/ /g, '');
            
            // Mapeamento
            if (currentView.value === 'customers') {
                if (key === 'id') return item.id || 'N/A';
                if (key === 'name') return item.name || 'N/A';
                if (key === 'email') return item.email || 'N/A';
                if (key === 'phone') return item.phone || 'N/A';
            }
            
            if (currentView.value === 'products') {
                if (key === 'id') return item.id || 'N/A';
                if (key === 'sku') return item.sku || 'N/A';
                if (key === 'name') return item.name || 'N/A';
                if (key === 'price') return item.price || 'N/A';
                if (key === 'stock') return item.stock || 'N/A';
            }
            
            return item[key] || 'N/A';
        };

        // =======================================================
        // MÉTODOS DE VISUALIZAÇÃO E PAGINAÇÃO
        // =======================================================
        
        const fetchPaginatedData = async () => {
            if (!token.value) return; 

            viewError.value = '';
            items.value = [];
            
            try {
                const response = await fetch(`${API_DATA_URL}/${currentView.value}?page=${currentPage.value}&pageSize=${pageSize}`, {
                    headers: { 'Authorization': `Bearer ${token.value}` },
                });

                if (response.ok) {
                    const result = await response.json();
                    items.value = result.data;
                    totalItems.value = result.totalItems;
                    totalPages.value = result.totalPages;
                    currentPage.value = result.currentPage;
                } else {
                    const data = await response.json();
                    viewError.value = data.message || 'Falha ao carregar dados.';
                }
            } catch (error) {
                viewError.value = 'Erro de rede ao buscar dados paginados.';
            }
        };

        const setView = (view) => {
            currentView.value = view;
            currentPage.value = 1; 
            fetchPaginatedData();
        };

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                currentPage.value = page;
                fetchPaginatedData();
            }
        };

        // =======================================================
        // MÉTODOS DE AUTENTICAÇÃO E PERFIL
        // =======================================================

        const authAction = async () => {
            errorMessage.value = '';
            const endpoint = isLogin.value ? '/login' : '/signup';

            try {
                const response = await fetch(API_AUTH_URL + endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(auth),
                });
                const data = await response.json();

                if (!response.ok) {
                    const errorMessageText = data.message || `Erro ao processar ${isLogin.value ? 'Login' : 'Registro'}.`;
                    
                    if (isLogin.value && errorMessageText.includes('Credenciais inválidas')) {
                        errorMessage.value = 'E-mail ou senha incorretos. Você pode tentar novamente ou se Cadastrar.';
                        isLogin.value = false; 
                    } else {
                        errorMessage.value = errorMessageText;
                    }
                    return;
                }
                
                token.value = data.token;
                Object.assign(user, data.user);
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                auth.email = '';
                auth.password = '';
                errorMessage.value = '';
                
                fetchTasks(); 
                setView(currentView.value); // Carrega dados após o login
            } catch (error) {
                console.error('Erro de rede:', error);
                errorMessage.value = 'Não foi possível conectar ao servidor backend.';
            }
        };

        const logout = () => {
            token.value = null;
            Object.keys(user).forEach(key => delete user[key]);
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            profileMessage.value = null;
            items.value = []; 
            totalItems.value = 0;
            totalPages.value = 1;
            currentPage.value = 1;
        };

        const fetchProfile = async () => {
            profileMessage.value = 'Carregando rota protegida...';
            try {
                const response = await fetch(API_ROOT + '/api/users/profile', {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token.value}` },
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

        // =======================================================
        // MÉTODOS DE TAREFAS (CRUD)
        // =======================================================

        const fetchTasks = async () => {
            if (!token.value) return; 
            tasksError.value = '';
            try {
                const response = await fetch(API_TASKS_URL, { headers: getAuthHeaders() });
                if (response.ok) {
                    tasks.value = await response.json();
                } else {
                    const data = await response.json();
                    tasksError.value = data.message || 'Falha ao carregar tarefas.';
                }
            } catch (error) {
                tasksError.value = 'Erro de rede ao buscar tarefas.';
            }
        };

        const createTask = async () => {
            if (!newTaskTitle.value.trim()) return;
            try {
                const response = await fetch(API_TASKS_URL, {
                    method: 'POST',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ title: newTaskTitle.value })
                });
                if (response.ok) {
                    const newTask = await response.json();
                    tasks.value.unshift(newTask);
                    newTaskTitle.value = '';
                } else { tasksError.value = 'Falha ao criar tarefa.'; }
            } catch (error) { tasksError.value = 'Erro de rede ao criar tarefa.'; }
        };

        const updateTaskStatus = async (task) => {
            task.completed = !task.completed; 
            try {
                await fetch(`${API_TASKS_URL}/${task.id}`, {
                    method: 'PUT',
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ completed: task.completed, title: task.title })
                });
            } catch (error) {
                task.completed = !task.completed; 
                tasksError.value = 'Erro ao atualizar status.';
            }
        };

        const deleteTask = async (taskId) => {
            try {
                const response = await fetch(`${API_TASKS_URL}/${taskId}`, {
                    method: 'DELETE',
                    headers: getAuthHeaders(),
                });
                if (response.status === 204) {
                    tasks.value = tasks.value.filter(t => t.id !== taskId);
                } else { tasksError.value = 'Falha ao deletar tarefa.'; }
            } catch (error) { tasksError.value = 'Erro de rede ao deletar tarefa.'; }
        };
        
        // =======================================================
        // MÉTODOS DE IMPORTAÇÃO CSV
        // =======================================================

        const handleFileChange = (event, type) => {
            const file = event.target.files[0];
            if (type === 'products') {
                productFile.value = file;
            } else if (type === 'customers') {
                customerFile.value = file;
            }
            importError.value = '';
            importMessage.value = '';
        };

        const handleImport = async (type) => {
            importError.value = '';
            importMessage.value = '';
            
            const file = type === 'products' ? productFile.value : customerFile.value;
            if (!file) {
                importError.value = 'Por favor, selecione um arquivo.';
                return;
            }

            const formData = new FormData();
            formData.append('file', file); 

            try {
                const response = await fetch(`${API_IMPORT_URL}/${type}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token.value}` },
                    body: formData,
                });

                let data = {};
                try {
                    data = await response.json();
                } catch (e) {
                    // Ignora erro de leitura JSON em caso de timeout
                }

                if (response.ok) {
                    importMessage.value = (data.message || `Importação de ${type} iniciada com sucesso.`) + ' Verifique o console para o status final.';
                    
                    // Limpeza do formulário
                    // Usamos a referência do form que acionou a função para resetar
                    const form = event.target.form;
                    if (form) {
                        form.reset();
                    }
                    productFile.value = type === 'products' ? null : productFile.value;
                    customerFile.value = type === 'customers' ? null : customerFile.value;

                } else {
                    importError.value = data.message || `Falha ao importar ${type}. Status: ${response.status}.`;
                }

            } catch (error) {
                importError.value = 'Erro de rede. Verifique se o servidor Express está ativo.';
            }
        };

        // Carrega tarefas e dados na inicialização (se já estiver logado)
        if (token.value) {
            fetchTasks(); 
            setView(currentView.value); 
        }

        return {
            // Auth/Perfil
            token, user, auth, isLogin, errorMessage, profileMessage, 
            fetchProfile, logout, authAction,

            // Tarefas CRUD
            tasks, newTaskTitle, tasksError, pendingTasksCount,
            fetchTasks, createTask, updateTaskStatus, deleteTask,

            // Importação CSV
            productFile, customerFile, importError, importMessage,
            handleFileChange, handleImport, 

            // Paginação/Visualização de Dados
            currentView, items, totalItems, totalPages, currentPage, viewError,
            tableHeaders, setView, changePage,
            getCellValue, // 👈 CORREÇÃO: Função getCellValue adicionada ao retorno
        };
    }
});

app.mount('#app');