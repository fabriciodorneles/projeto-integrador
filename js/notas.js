const sessao = NexusDB.sessaoAtual();
document.getElementById('nomeUsuario').textContent = sessao ? sessao.nome : 'Professor';

const form = document.getElementById('formNotas');
const campos = {
  id: document.getElementById('alunoId'),
  nome: document.getElementById('nome'),
  rgm: document.getElementById('rgm'),
  turma: document.getElementById('turma'),
  nota1: document.getElementById('nota1'),
  nota2: document.getElementById('nota2'),
  media: document.getElementById('media'),
  mediaSituacao: document.getElementById('mediaSituacao')
};
const tabela = document.getElementById('tabelaAlunos');
const busca = document.getElementById('busca');
const filtroTurma = document.getElementById('filtroTurma');
const modalExcluir = new bootstrap.Modal('#modalExcluir');
const toast = new bootstrap.Toast('#toast', { delay: 2500 });
let idParaExcluir = null;

// ---------- Utilitários ----------
function lerNota(texto) {
  const valor = texto.trim().replace(',', '.');
  if (!/^\d{1,2}(\.\d{1,2})?$/.test(valor)) return null;
  const numero = parseFloat(valor);
  return numero >= 0 && numero <= 10 ? numero : null;
}

function formatar(numero) {
  return numero.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
}

function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

function avisar(mensagem, tipo = 'success') {
  const el = document.getElementById('toast');
  el.className = `toast align-items-center text-bg-${tipo} border-0`;
  document.getElementById('toastTexto').textContent = mensagem;
  toast.show();
}

// ---------- Média automática ----------
function atualizarMedia() {
  const n1 = lerNota(campos.nota1.value);
  const n2 = lerNota(campos.nota2.value);
  if (n1 === null || n2 === null) {
    campos.media.value = '—';
    campos.mediaSituacao.textContent = '—';
    campos.mediaSituacao.className = 'input-group-text';
    return;
  }
  const m = NexusDB.media(n1, n2);
  const s = NexusDB.situacao(m);
  campos.media.value = formatar(m);
  campos.mediaSituacao.textContent = s;
  campos.mediaSituacao.className = 'input-group-text fw-semibold ' +
    (s === 'Aprovado' ? 'text-success' : 'text-danger');
}

document.querySelectorAll('.nota').forEach(input => {
  input.addEventListener('input', () => {
    input.setCustomValidity(lerNota(input.value) === null ? 'Nota inválida' : '');
    atualizarMedia();
  });
});

campos.rgm.addEventListener('input', () => {
  campos.rgm.value = campos.rgm.value.replace(/\D/g, '');
  campos.rgm.setCustomValidity('');
  document.getElementById('rgmErro').textContent = 'Somente números (5 a 12 dígitos).';
});

// ---------- Tabela ----------
function renderizar() {
  const todos = NexusDB.listar();
  const termo = busca.value.trim().toLowerCase();
  const turma = filtroTurma.value;

  const lista = todos
    .filter(a => !turma || a.turma === turma)
    .filter(a => !termo || a.nome.toLowerCase().includes(termo) || a.rgm.includes(termo))
    .sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  tabela.innerHTML = lista.map(a => `
    <tr class="${a.id === campos.id.value ? 'linha-editando' : ''}">
      <td class="fw-semibold nome-aluno">${escapar(a.nome)}</td>
      <td>${escapar(a.rgm)}</td>
      <td><span class="badge text-bg-light border">${escapar(a.turma)}</span></td>
      <td class="text-center">${formatar(a.nota1)}</td>
      <td class="text-center">${formatar(a.nota2)}</td>
      <td class="text-center fw-bold">${formatar(a.media)}</td>
      <td><span class="badge rounded-pill ${a.situacao === 'Aprovado' ? 'text-bg-success' : 'text-bg-danger'}">${a.situacao}</span></td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button type="button" class="btn btn-outline-primary" data-editar="${a.id}" title="Editar" aria-label="Editar ${escapar(a.nome)}"><i class="bi bi-pencil"></i></button>
          <button type="button" class="btn btn-outline-danger" data-excluir="${a.id}" title="Excluir" aria-label="Excluir ${escapar(a.nome)}"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');

  document.getElementById('vazio').classList.toggle('d-none', lista.length > 0);
  document.getElementById('totalAlunos').textContent = todos.length;
  document.getElementById('totalAprovados').textContent = todos.filter(a => a.situacao === 'Aprovado').length;
  document.getElementById('totalReprovados').textContent = todos.filter(a => a.situacao === 'Reprovado').length;
}

busca.addEventListener('input', renderizar);
filtroTurma.addEventListener('change', renderizar);

tabela.addEventListener('click', (evento) => {
  const editar = evento.target.closest('[data-editar]');
  const excluir = evento.target.closest('[data-excluir]');
  if (editar) iniciarEdicao(editar.dataset.editar);
  if (excluir) {
    const aluno = NexusDB.listar().find(a => a.id === excluir.dataset.excluir);
    if (!aluno) return;
    idParaExcluir = aluno.id;
    document.getElementById('excluirNome').textContent = aluno.nome;
    modalExcluir.show();
  }
});

document.getElementById('confirmarExcluir').addEventListener('click', () => {
  NexusDB.excluir(idParaExcluir);
  if (campos.id.value === idParaExcluir) form.reset();
  modalExcluir.hide();
  renderizar();
  avisar('Aluno excluído.', 'danger');
});

// ---------- Formulário ----------
function modoEdicao(ativo) {
  document.getElementById('tituloForm').textContent = ativo ? 'Editar Notas' : 'Lançamento de Notas';
  document.getElementById('btnSalvar').innerHTML = ativo
    ? '<i class="bi bi-arrow-repeat me-1"></i> Atualizar notas'
    : '<i class="bi bi-check2-circle me-1"></i> Salvar notas';
  document.getElementById('btnLimpar').innerHTML = ativo
    ? '<i class="bi bi-x-lg me-1"></i> Cancelar'
    : '<i class="bi bi-eraser me-1"></i> Limpar';
}

function iniciarEdicao(id) {
  const aluno = NexusDB.listar().find(a => a.id === id);
  if (!aluno) return;
  form.classList.remove('was-validated');
  campos.id.value = aluno.id;
  campos.nome.value = aluno.nome;
  campos.rgm.value = aluno.rgm;
  campos.turma.value = aluno.turma;
  campos.nota1.value = formatar(aluno.nota1);
  campos.nota2.value = formatar(aluno.nota2);
  atualizarMedia();
  modoEdicao(true);
  renderizar();
  campos.nome.focus();
}

form.addEventListener('reset', () => {
  setTimeout(() => {
    campos.id.value = '';
    form.classList.remove('was-validated');
    document.querySelectorAll('.nota').forEach(i => i.setCustomValidity(''));
    campos.rgm.setCustomValidity('');
    atualizarMedia();
    modoEdicao(false);
    renderizar();
  });
});

form.addEventListener('submit', (evento) => {
  evento.preventDefault();

  // RGM não pode repetir
  const existente = NexusDB.buscarPorRgm(campos.rgm.value);
  if (existente && existente.id !== campos.id.value) {
    campos.rgm.setCustomValidity('RGM já cadastrado');
    document.getElementById('rgmErro').textContent = 'Este RGM já está cadastrado.';
  }
  document.querySelectorAll('.nota').forEach(input => {
    input.setCustomValidity(lerNota(input.value) === null ? 'Nota inválida' : '');
  });

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    form.querySelector(':invalid').focus();
    return;
  }

  const editando = Boolean(campos.id.value);
  NexusDB.salvar({
    id: campos.id.value || undefined,
    nome: campos.nome.value.trim().replace(/\s+/g, ' '),
    rgm: campos.rgm.value,
    turma: campos.turma.value,
    nota1: lerNota(campos.nota1.value),
    nota2: lerNota(campos.nota2.value)
  });

  form.reset();
  avisar(editando ? 'Notas atualizadas com sucesso!' : 'Notas salvas com sucesso!');
  campos.nome.focus();
});

// ---------- Exportar / importar (arquivo de texto JSON) ----------
document.getElementById('btnExportar').addEventListener('click', () => {
  const blob = new Blob([NexusDB.exportarTexto()], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'nexus-alunos.json';
  link.click();
  URL.revokeObjectURL(link.href);
});

const arquivoImportar = document.getElementById('arquivoImportar');
document.getElementById('btnImportar').addEventListener('click', () => arquivoImportar.click());
arquivoImportar.addEventListener('change', async () => {
  const arquivo = arquivoImportar.files[0];
  if (!arquivo) return;
  try {
    const total = NexusDB.importarTexto(await arquivo.text());
    form.reset();
    renderizar();
    avisar(`${total} aluno(s) importado(s).`);
  } catch (e) {
    avisar('Arquivo inválido. Use um JSON exportado pelo sistema.', 'danger');
  }
  arquivoImportar.value = '';
});

// ---------- Sair ----------
document.getElementById('sair').addEventListener('click', () => {
  NexusDB.encerrarSessao();
  window.location.href = 'index.html';
});

renderizar();
