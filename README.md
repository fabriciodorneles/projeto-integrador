# Sistema Acadêmico Nexus

Projeto Integrador Transdisciplinar em Sistemas para Internet II
Aluno: **Fabricio Bohrer Dorneles**

Sistema web para lançamento de notas de alunos, com tela de login e tela de digitação de notas
(nome, RGM, turma, nota 1 e nota 2), construído com o framework **Bootstrap 5.3** baixado junto
com o projeto (sem chamadas a CDN).

## Como abrir

1. Descompacte o arquivo `.zip`.
2. Abra o arquivo `index.html` no navegador (duplo clique). Não precisa de servidor nem de internet.
3. Entre com o acesso de demonstração: usuário **professor** e senha **nexus123**.

## Estrutura

```
index.html              Tela de login
notas.html              Tela de lançamento de notas
css/style.css           Estilos próprios do projeto
js/db.js                Banco de dados local (JSON no localStorage)
js/login.js             Lógica do login
js/notas.js             Lógica do cadastro de notas
img/logo.svg            Logotipo
assets/bootstrap/       Framework Bootstrap 5.3.8 (CSS e JS)
assets/bootstrap-icons/ Ícones do Bootstrap
wireframe/              Protótipo (wireframe) exportado em imagem
```

## Recursos do Bootstrap utilizados

- **Sistema de Grids**: `container`, `row` e `col-*` organizam as duas colunas do login e o
  formulário + tabela da tela de notas, e se reorganizam em uma coluna no celular.
- **Input groups**: todos os campos (usuário, senha, nome, RGM, turma, notas, média, busca e
  filtro) usam `input-group` com ícone ou rótulo; a senha tem botão para mostrar/ocultar.
- **Buttons**: `btn` com variações (primário, contorno, perigo), `btn-group` e `d-grid`.
- Também: `card`, `navbar`, `table`, `badge`, `modal`, `toast` e validação de formulários.

## Funcionalidades

- Login com validação e proteção da tela de notas (sem login, volta para o início).
- Cadastro, edição e exclusão de alunos.
- Média calculada automaticamente: `(Nota 1 + Nota 2) / 2`; média ≥ 6 = **Aprovado**.
- Validações: nome obrigatório, RGM só com números e sem repetição, notas de 0 a 10 (aceita vírgula).
- Busca por nome ou RGM, filtro por turma e contadores de alunos, aprovados e reprovados.
- Banco de dados local em texto (JSON) no navegador, com botões para exportar e importar o arquivo.

## Texto para o envio

**Situação-problema:** professores precisam registrar as notas dos alunos de forma organizada e
consultar rapidamente a média e a situação de cada um, evitando planilhas soltas e cálculos manuais.

**Objetivo:** desenvolver o front-end de um sistema web (Sistema Acadêmico Nexus) com tela de login
e tela de digitação de notas contendo nome, RGM, turma, nota 1 e nota 2.

**Metodologia:** primeiro foi criado o protótipo em wireframe das duas telas, exportado em imagem,
para alinhar a expectativa visual. Em seguida, as páginas foram construídas em HTML, CSS e JavaScript
com o framework Bootstrap 5.3, baixado junto com o projeto, usando o sistema de grids, input groups e
buttons, além de cards, modal, toast e validação de formulários. Os dados ficam salvos no próprio
navegador (localStorage, em formato JSON), então o projeto abre localmente sem servidor.

**Resultados:** o sistema permite entrar com usuário e senha, lançar, editar, excluir e buscar alunos,
calcula a média automaticamente e mostra a situação (aprovado ou reprovado) e o resumo da turma.
A interface é responsiva e funciona no computador e no celular.
