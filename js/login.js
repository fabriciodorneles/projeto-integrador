// Se já estiver logado, vai direto para a tela de notas
if (NexusDB.sessaoAtual()) {
  window.location.href = 'notas.html';
}

const form = document.getElementById('formLogin');
const alerta = document.getElementById('alerta');
const campoSenha = document.getElementById('senha');
const botaoVerSenha = document.getElementById('verSenha');

botaoVerSenha.addEventListener('click', () => {
  const mostrar = campoSenha.type === 'password';
  campoSenha.type = mostrar ? 'text' : 'password';
  botaoVerSenha.innerHTML = mostrar ? '<i class="bi bi-eye-slash"></i>' : '<i class="bi bi-eye"></i>';
});

form.addEventListener('reset', () => {
  form.classList.remove('was-validated');
  alerta.classList.add('d-none');
});

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  alerta.classList.add('d-none');

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const usuario = document.getElementById('usuario').value.trim();
  const senha = campoSenha.value;
  const dados = NexusDB.autenticar(usuario, senha);

  if (!dados) {
    alerta.textContent = 'Usuário ou senha inválidos.';
    alerta.classList.remove('d-none');
    campoSenha.value = '';
    campoSenha.focus();
    return;
  }

  NexusDB.iniciarSessao(dados, document.getElementById('lembrar').checked);
  window.location.href = 'notas.html';
});
