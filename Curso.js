/// Consumindo Api -- CONFIGURAÇÕES GLOBAIS ///
const API_URL = "http://localhost:5148/api";
const TOKEN_KEY = "app_auth_token";

// Seleção dos elementos do HTML
const formCursos = document.getElementById("Registro-curso");
const messageBox = document.getElementById("mensagemBox");
const tituloCurso = document.getElementById("titulo-curso");
const descricaoCurso = document.getElementById("descricao-curso");
const cargaHoraria = document.getElementById("CargaH-curso");
const submitCurso = document.getElementById("Bnt-Curso");

const token = localStorage.getItem(TOKEN_KEY);

// 1. Função para mostrar mensagens (Sucesso/Erro)
function mostrarMensagem(texto, type = "error") {
    if (!messageBox) return;
    messageBox.textContent = texto;
    // Estilo básico direto no JS para garantir que apareça
    messageBox.style.color = type === "error" ? "#ff4d4d" : "#2ecc71"; 
    messageBox.style.display = "block";
    messageBox.style.fontWeight = "bold";
    messageBox.style.textAlign = "center";
    messageBox.style.padding = "10px";
    
    setTimeout(() => {
        messageBox.style.display = "none";
    }, 4000);
}

// 2. Função para deslogar o usuário (Limpa token e volta para o login)
function logout() {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "Index.html";
}

// 3. Função para decodificar o Token JWT e ler a Role (cargo)
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

// 4. Verificação de Segurança (Bloqueio de interface)
let userRole = null;
if (token) {
    const payload = parseJwt(token);
    if (payload) {
        userRole = payload.role; // Captura a permissão do token
    }
}

const rolesArray = userRole ? (Array.isArray(userRole) ? userRole : [userRole]) : [];

if (!token) {
    mostrarMensagem("Usuário não autenticado. Redirecionando...", "error");
    if(formCursos) formCursos.style.display = "none";
    setTimeout(logout, 2000);
} else if (!rolesArray.includes("admin") && !rolesArray.includes("professor")) {
    alert("Acesso negado. Você não tem permissão para cadastrar cursos.");
    logout();
}

// 5. Evento de Envio do Formulário (Cadastrar Curso)
if (formCursos) {
    formCursos.addEventListener("submit", async (event) => {
        event.preventDefault();

        const titulo = tituloCurso.value;
        const descricao = descricaoCurso.value;
        const carga = cargaHoraria.value;

        try {
            submitCurso.disabled = true;
            submitCurso.textContent = "Aguarde...";

            const resposta = await fetch(`${API_URL}/cursos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    titulo: titulo, 
                    descricao: descricao, 
                    cargaHoraria: carga 
                }),
            });

            let dados = {};
            if (resposta.status !== 204) {
                dados = await resposta.json();
            }

            if (!resposta.ok) {
                throw new Error(dados.mensagem || "Erro ao cadastrar curso");
            }

            // --- AQUI ACONTECE O LOGOUT APÓS CRIAR O CURSO ---
            alert("Curso cadastrado com sucesso! Saindo do sistema...");
            logout(); // Chama a função de saída

        } catch (error) {
            mostrarMensagem(error.message, "error");
            submitCurso.disabled = false;
            submitCurso.textContent = "Registrar";
        }
    });
}