///Consumindo Api -- CONFIGURAÇÕES GLOBAIS///

const API_URL   = "http://localhost:5148/api";
const TOKEN_KEY = "app_auth_token";

const mensagemBox = document.getElementById("mensagemBox");
function showMessage(texto, type='error'){
    if (mensagemBox) return;
    mensagemBox.textContent = texto;
    mensagemBox.className = type ==='error' ? 'msg-error' : 'msg-sucess';
    mensagemBox.style.display = 'block';
    setTimeout(()=> {mensagemBox.style.display = 'none';}, 4000);
}

//LOGIN
const loginForm = document.getElementById('formulario-login');
if(loginForm)
{
    const loginEmail = document.getElementById('email');
    const loginSenha = document.getElementById('senha');
    const loginBnt = document.getElementById('bnt');


    const loginSection = document.getElementById('login-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const fetchDataBtn = document.getElementById("fetch-data-btn");
    const apiDataBox = document.getElementById("api-data");
    const logoutBtn = document.getElementById("logout-btn");

    function initIndex(){
        const token = localStorage.getItem(TOKEN_KEY);
        if (token){
            loginSection.classList.add('hidden');
            dashboardSection.classList.remove('hidden');
        } else{
            dashboardSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
        }

    }

    loginForm.addEventListener('submit',async(event) =>{
        event.preventDefault();
        const email = loginEmail.value;
        const senha = loginSenha.value;

        try{
            loginBnt.disabled = true;
            loginBnt.textContent = "Aguarde......";

            const response = await fetch(`${API_URL}/Auth/login`, {
                method: 'POST',
                headers: {'content-Type': "application/json"},
                body: JSON.stringify({email: email, password: senha})
            });
            const dados = await response.json();
            if(!response.ok) throw new Error(dados.mensagem || 'Credenciais inválidas');
            if(dados.token){
                localStorage.setItem(TOKEN_KEY,dados.token);
                initIndex();
                /* sessionStorage.setItem('userEmail', email); */
            }

        }catch (error){
            showMessage(error.mensagem, 'error');
        } finally{
            loginBnt.disabled = false;
            loginBnt.textContent = 'Entrar';
        }
        
});
function logout(){
    localStorage.removeItem(TOKEN_KEY);
    initIndex();
    apiDataBox.style.display = 'none';
}
logoutBtn.addEventListener('click', logout);

initIndex();
}

//CADASTRO
const cadastroForm =document.getElementById('registro-login');
if(cadastroForm){
    //Se ja tiver conta leva para a pagina do login
    if(localStorage.getItem(TOKEN_KEY)){
        window.location.href = 'index.html'
    }
    const cadastroNome = document.getElementById('nome');
    const cadastroEmail = document.getElementById('reg-email');
    const cadastroSenha = document.getElementById('reg-senha');
    const ConfirCadastroSenha = document.getElementById('conf-senha');
    const Role = document.getElementById('role')

    FormRegistro.addEventListener('submit', async (event)=>{
        event.preventDefault();
        const nome = cadastroNome.value;
        const email = cadastroEmail.value;
        const senha = cadastroSenha.value;
        const confirme = ConfirCadastroSenha.value;
        const role = Role.value;
        
        if(senha !== confirme){
            return mostrarMensagem('As senhas não coincidem', 'error');
        }
        try{
            SubmitRegistro.disabled = true;
            SubmitRegistro.textContent = 'Aguarde......'

            const resposta = await fetch( `${API_URL}/register`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email: email, passwordHash: senha, nome: nome,role })
            });
            const dados = await resposta.json();

            if(resposta.ok) throw new Error(dados.mensagem || 'Erro ao criar sua conta');
            alert('Conta criado com sucesso! Faça seu login.')
            window.Location.href = 'index.html'
        }   catch(error){
            SubmitRegistro.disabled = false;
            SubmitRegistro.textContent = 'Registrar';
        };

    });
}
