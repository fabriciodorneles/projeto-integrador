/*
 * NexusDB - banco de dados local e simples, guardado em texto (JSON)
 * no localStorage do navegador. Funciona abrindo o projeto direto do
 * arquivo, sem servidor.
 */
const NexusDB = (() => {
  const CHAVE_ALUNOS = 'nexus_alunos';
  const CHAVE_USUARIOS = 'nexus_usuarios';
  const CHAVE_SESSAO = 'nexus_sessao';

  // Usuário padrão para o primeiro acesso
  const USUARIOS_PADRAO = [{ usuario: 'professor', senha: 'nexus123', nome: 'Professor' }];

  function ler(chave, padrao) {
    try {
      const texto = localStorage.getItem(chave);
      return texto ? JSON.parse(texto) : padrao;
    } catch (e) {
      return padrao;
    }
  }

  function gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function media(n1, n2) {
    return Math.round(((n1 + n2) / 2) * 10) / 10;
  }

  function situacao(m) {
    return m >= 6 ? 'Aprovado' : 'Reprovado';
  }

  // ---------- Usuários / sessão ----------
  function autenticar(usuario, senha) {
    const usuarios = ler(CHAVE_USUARIOS, USUARIOS_PADRAO);
    const encontrado = usuarios.find(u => u.usuario === usuario && u.senha === senha);
    return encontrado ? { usuario: encontrado.usuario, nome: encontrado.nome } : null;
  }

  function iniciarSessao(dados, lembrar) {
    const armazenamento = lembrar ? localStorage : sessionStorage;
    armazenamento.setItem(CHAVE_SESSAO, JSON.stringify(dados));
  }

  function sessaoAtual() {
    const texto = sessionStorage.getItem(CHAVE_SESSAO) || localStorage.getItem(CHAVE_SESSAO);
    return texto ? JSON.parse(texto) : null;
  }

  function encerrarSessao() {
    sessionStorage.removeItem(CHAVE_SESSAO);
    localStorage.removeItem(CHAVE_SESSAO);
  }

  // ---------- Alunos (CRUD) ----------
  function listar() {
    return ler(CHAVE_ALUNOS, []).map(a => {
      const m = media(a.nota1, a.nota2);
      return { ...a, media: m, situacao: situacao(m) };
    });
  }

  function buscarPorRgm(rgm) {
    return ler(CHAVE_ALUNOS, []).find(a => a.rgm === rgm) || null;
  }

  function salvar(aluno) {
    const alunos = ler(CHAVE_ALUNOS, []);
    const indice = alunos.findIndex(a => a.id === aluno.id);
    if (indice >= 0) {
      alunos[indice] = aluno;
    } else {
      aluno.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      alunos.push(aluno);
    }
    gravar(CHAVE_ALUNOS, alunos);
    return aluno;
  }

  function excluir(id) {
    gravar(CHAVE_ALUNOS, ler(CHAVE_ALUNOS, []).filter(a => a.id !== id));
  }

  // ---------- Exportar / importar em arquivo de texto ----------
  function exportarTexto() {
    return JSON.stringify(ler(CHAVE_ALUNOS, []), null, 2);
  }

  function importarTexto(texto) {
    const dados = JSON.parse(texto);
    if (!Array.isArray(dados)) throw new Error('Arquivo inválido');
    const validos = dados.filter(a => a && a.nome && a.rgm && a.turma &&
      typeof a.nota1 === 'number' && typeof a.nota2 === 'number');
    const alunos = validos.map((a, i) => ({
      id: a.id ? String(a.id) : Date.now().toString(36) + i,
      nome: String(a.nome), rgm: String(a.rgm), turma: String(a.turma),
      nota1: a.nota1, nota2: a.nota2
    }));
    gravar(CHAVE_ALUNOS, alunos);
    return alunos.length;
  }

  return {
    autenticar, iniciarSessao, sessaoAtual, encerrarSessao,
    listar, buscarPorRgm, salvar, excluir, media, situacao,
    exportarTexto, importarTexto
  };
})();
