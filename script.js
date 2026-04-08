const API_URL = "http://localhost:5148/api";
const TOKEN_KEY = "app_auth_token";

// Função Global de Mensagem
function showMessage(texto, type = "error") {
    const msgBox = document.getElementById("mensagemBox") || document.getElementById("MensagemBox");
    if (!msgBox) return;
    
    msgBox.textContent = texto;
    msgBox.className = type === "error" ? "msg-error" : "msg-success";
    msgBox.style.display = "block";
    msgBox.style.color = type === "error" ? "#ff4d4d" : "#2ecc71"; // Garantia visual

    setTimeout(() => {
        msgBox.style.display = "none";
    }, 4000);
}

// --- LÓGICA DE LOGIN (Página Index.html) ---
const loginForm = document.getElementById("formulario-login");
if (loginForm) {
    const loginEmail = document.getElementById("email");
    const loginSenha = document.getElementById("senha");
    const loginBnt = document.getElementById("bnt");
    const logoutBtn = document.getElementById("logout-btn");

    // Verifica se já está logado
    if (localStorage.getItem(TOKEN_KEY)) {
        window.location.href = "Cadastro-Cursos.html";
    }

    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        try {
            loginBnt.disabled = true;
            loginBnt.textContent = "Aguarde...";

            const response = await fetch(`${API_URL}/Auth/Login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail.value, password: loginSenha.value }),
            });

            const dados = await response.json();
            
            if (!response.ok) throw new Error(dados.mensagem || "Credenciais inválidas");

            if (dados.token) {
                localStorage.setItem(TOKEN_KEY, dados.token);
                window.location.href = "Cadastro-Cursos.html";
            }
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            loginBnt.disabled = false;
            loginBnt.textContent = "Entrar";
        }
    });
}

// --- LÓGICA DE CADASTRO (Página Cadastrar.html) ---
const cadastroForm = document.getElementById("registro");
if (cadastroForm) {
    const cadastroNome = document.getElementById("nome");
    const cadastroEmail = document.getElementById("reg-email");
    const cadastroSenha = document.getElementById("reg-senha");
    const confSenha = document.getElementById("conf-senha");
    const roleInput = document.getElementById("role");
    const submitBtn = document.getElementById("bnt");

    cadastroForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (cadastroSenha.value !== confSenha.value) {
            return showMessage("As senhas não coincidem", "error");
        }

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Criando conta...";

            const resposta = await fetch(`${API_URL}/Auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: cadastroEmail.value,
                    passwordHash: cadastroSenha.value,
                    nome: cadastroNome.value,
                    role: roleInput.value || "user", // Valor padrão caso vazio
                }),
            });

            const dados = await resposta.json();

            if (!resposta.ok) throw new Error(dados.mensagem || "Erro ao criar conta");

            alert("Conta criada com sucesso! Faça seu login.");
            window.location.href = "Index.html";

        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Registrar-se";
        }
    });
}

// Botão Logout (se existir na página)
const logoutBtnGlobal = document.getElementById("logout-btn");
if (logoutBtnGlobal) {
    logoutBtnGlobal.addEventListener("click", () => {
        localStorage.removeItem(TOKEN_KEY);
        window.location.href = "Index.html";
    });
}