// SMOOTH SCROLL PARA LINKS INTERNOS
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// HEADER SHADOW ON SCROLL
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// SCROLL TO TOP BUTTON
const scrollToTopBtn = document.getElementById('scrollToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
});

scrollToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// LOG DE INICIALIZAÇÃO
console.log('Aula 1 - Introdução ao HTML carregada com sucesso! 🚀');

// BOTÃO COPIAR CÓDIGO
document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre:has(> code.code-block)');
    
    codeBlocks.forEach((pre) => {
        // Criar container relativo
        pre.style.position = 'relative';
        
        // Criar botão de copiar
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.innerHTML = '<img src="../img/clone.png" alt="Copiar">';
        copyBtn.type = 'button';
        copyBtn.title = 'Copiar código';
        
        // Adicionar evento de clique
        copyBtn.addEventListener('click', function() {
            const code = pre.innerText;
            navigator.clipboard.writeText(code).then(() => {
                // Mudar opacidade para indicar sucesso
                const originalImg = copyBtn.innerHTML;
                copyBtn.style.opacity = '0.5';
                
                // Voltar ao normal após 2 segundos
                setTimeout(() => {
                    copyBtn.style.opacity = '1';
                }, 2000);
                
                // Voltar ao normal após 2 segundos
                setTimeout(() => {
                    copyBtn.style.opacity = '1';
                }, 2000);
            }).catch(() => {
                alert('Erro ao copiar o código!');
            });
        });
        
        // Adicionar botão ao pre
        pre.appendChild(copyBtn);
    });
});


// ===== DEMOS INTERATIVAS (conteúdo expandido) =====

// Desenha uma árvore de nós no estilo ├── └──
function desenharArvore(node, prefixo = '', ultimo = true, raiz = true) {
    let linhas = [];
    let rotulo = null;

    if (node.nodeType === Node.DOCUMENT_TYPE_NODE) {
        rotulo = `<!DOCTYPE ${node.name}>`;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        const attrs = [...node.attributes].map(a => a.value === '' ? ` ${a.name}` : ` ${a.name}="${a.value}"`).join('');
        rotulo = `<${node.tagName.toLowerCase()}${attrs}>`;
    } else if (node.nodeType === Node.TEXT_NODE) {
        const texto = node.textContent.replace(/\s+/g, ' ').trim();
        if (!texto) return linhas;
        rotulo = `"${texto.length > 40 ? texto.slice(0, 40) + '…' : texto}"`;
    } else if (node.nodeType === Node.COMMENT_NODE) {
        rotulo = `<!--${node.textContent}-->`;
    }

    if (rotulo !== null) {
        linhas.push(raiz ? rotulo : prefixo + (ultimo ? '└── ' : '├── ') + rotulo);
    }

    const filhos = [...node.childNodes].filter(f =>
        f.nodeType !== Node.TEXT_NODE || f.textContent.trim() !== ''
    );
    const novoPrefixo = raiz || rotulo === null ? '' : prefixo + (ultimo ? '    ' : '│   ');
    filhos.forEach((filho, i) => {
        linhas = linhas.concat(desenharArvore(filho, rotulo === null && raiz ? '' : novoPrefixo, i === filhos.length - 1, false));
    });
    return linhas;
}

function arvoreDoDocumento(doc) {
    const linhas = [];
    if (doc.doctype) linhas.push(`<!DOCTYPE ${doc.doctype.name}>`);
    return linhas.concat(desenharArvore(doc.documentElement)).join('\n');
}

document.addEventListener('DOMContentLoaded', () => {
    setupAnatomia();
    setupEntidades();
    setupPlayground();
    setupPipeline();
    setupConserto();
    setupHacks();

    const compat = document.getElementById('compat-mode');
    if (compat) {
        compat.textContent = document.compatMode === 'CSS1Compat'
            ? 'CSS1Compat (modo padrão ✅)'
            : 'BackCompat (quirks mode ⚠️)';
    }
});

// ANATOMIA DE UMA TAG
function setupAnatomia() {
    const info = document.querySelector('.anatomy-info');
    if (!info) return;

    const partes = {
        'abre': ['Sinal de menor <', 'Abre a tag. Todo elemento HTML começa com o sinal de menor.'],
        'nome': ['Nome da tag: a', 'Define o tipo do elemento. "a" vem de anchor (âncora) e cria um link.'],
        'atributo': ['Atributo: href', 'Informação extra sobre o elemento. href (hypertext reference) diz para onde o link leva.'],
        'atributo2': ['Atributo: target', 'Define onde abrir o link. Elementos podem ter vários atributos, separados por espaço.'],
        'igual': ['Sinal de igual =', 'Liga o nome do atributo ao seu valor. Não use espaços ao redor dele.'],
        'valor': ['Valor: "https://htmlab.dev"', 'O valor do atributo href: o endereço de destino. Sempre entre aspas.'],
        'valor2': ['Valor: "_blank"', 'Valor do atributo target. "_blank" abre o link em uma nova aba.'],
        'fecha-abertura': ['Sinal de maior >', 'Fecha a tag de abertura. Tudo que vem depois é o conteúdo do elemento.'],
        'conteudo': ['Conteúdo', 'O que aparece na tela: o texto clicável do link. Pode conter texto e outros elementos inline.'],
        'fechamento': ['Tag de fechamento </a>', 'Mesmo nome da abertura, com uma barra /. Marca o fim do elemento.']
    };

    document.querySelectorAll('.anatomy-code button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.anatomy-code button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll(`.anatomy-code [data-part="${btn.dataset.part}"]`).forEach(b => b.classList.add('active'));
            const [titulo, texto] = partes[btn.dataset.part];
            info.innerHTML = '';
            const strong = document.createElement('strong');
            strong.textContent = titulo;
            const p = document.createElement('p');
            p.textContent = texto;
            info.append(strong, p);
        });
    });
}

// CONVERSOR DE ENTIDADES
function setupEntidades() {
    const input = document.getElementById('entity-input');
    const output = document.getElementById('entity-output');
    if (!input || !output) return;

    const converter = () => {
        output.textContent = input.value
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    };
    input.addEventListener('input', converter);
    converter();
}

// PLAYGROUND
function setupPlayground() {
    const code = document.getElementById('pg-code');
    const result = document.getElementById('pg-result');
    const dom = document.getElementById('pg-dom');
    if (!code || !result || !dom) return;

    const exemplos = {
        basico: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha página</title>
</head>
<body>
  <h1>Olá, mundo! 👋</h1>
  <p>Edite este código e veja o <strong>resultado</strong> ao vivo.</p>
  <a href="https://developer.mozilla.org">Documentação MDN</a>
</body>
</html>`,
        lista: `<!DOCTYPE html>
<html lang="pt-BR">
<head><title>Lista</title></head>
<body>
  <h2>Tarefas de hoje</h2>
  <ul>
    <li>Estudar <em>HTML</em></li>
    <li>Praticar no <mark>playground</mark></li>
    <li>Tomar um café ☕</li>
  </ul>
  <!-- Comentários também viram nós! -->
</body>
</html>`,
        quebrado: `<title>Sem html, head e body!</title>
<h1>HTML quebrado
<p>Parágrafo sem fechar
<p>Tags <b>cruzadas <i>aqui</b> e ali</i>
<ul><li>Item 1<li>Item 2</ul>`
    };

    let timer;
    const atualizar = () => {
        result.srcdoc = code.value;
        const doc = new DOMParser().parseFromString(code.value, 'text/html');
        dom.textContent = arvoreDoDocumento(doc);
    };

    code.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(atualizar, 300);
    });

    // Tab insere indentação em vez de sair do campo; Esc libera o foco
    code.addEventListener('keydown', e => {
        if (e.key === 'Tab' && !e.shiftKey && !code.dataset.escape) {
            e.preventDefault();
            code.setRangeText('  ', code.selectionStart, code.selectionEnd, 'end');
            atualizar();
        } else if (e.key === 'Escape') {
            code.dataset.escape = '1';
        }
    });
    code.addEventListener('blur', () => { delete code.dataset.escape; });

    document.querySelectorAll('.pg-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            code.value = exemplos[btn.dataset.exemplo];
            atualizar();
        });
    });

    code.value = exemplos.basico;
    atualizar();
}

// PIPELINE DE RENDERIZAÇÃO
function setupPipeline() {
    const info = document.getElementById('pipeline-info');
    if (!info) return;

    const etapas = [
        ['1. Bytes → Caracteres', 'O servidor envia bytes. O navegador usa o charset (UTF-8) para transformá-los em texto.', '3C 70 3E 4F 6C C3 A1 3C 2F 70 3E\n→ "<p>Olá</p>"'],
        ['2. Tokenização', 'O tokenizer lê caractere por caractere e identifica tokens: aberturas, fechamentos, textos, comentários.', 'StartTag: p\nCharacter: "Olá"\nEndTag: p'],
        ['3. Construção do DOM', 'Os tokens viram nós organizados em uma árvore (Document Object Model). É isso que o JavaScript manipula.', 'Document\n└── html\n    ├── head\n    └── body\n        └── p\n            └── "Olá"'],
        ['4. CSSOM', 'Os CSS (arquivos, <style> e style="") viram outra árvore com as regras de estilo. O CSS bloqueia a renderização até ser processado.', 'body { font-size: 16px }\n└── p { color: orange }'],
        ['5. Render Tree', 'DOM + CSSOM combinados, apenas com o que será visível. <head>, <script> e elementos com display:none ficam de fora.', 'body\n└── p (color: orange; font-size: 16px)\n    └── "Olá"'],
        ['6. Layout (Reflow)', 'Calcula a geometria: largura, altura e posição de cada caixa, de acordo com o tamanho da tela.', 'p → x: 8, y: 16, largura: 1200, altura: 24'],
        ['7. Paint', 'Preenche os pixels: textos, cores, bordas, sombras e imagens, divididos em camadas.', 'Camada 1: fundo branco\nCamada 2: texto "Olá" laranja'],
        ['8. Composite', 'Junta as camadas na ordem correta e envia para a tela, geralmente com a GPU. Animações de transform e opacity só refazem esta etapa, por isso são rápidas!', '🖥️ Página visível na tela!']
    ];

    const botoes = document.querySelectorAll('.pipeline-step');
    const mostrar = i => {
        botoes.forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.step) === i)));
        const [titulo, texto, exemplo] = etapas[i];
        info.innerHTML = '';
        const h4 = document.createElement('h4');
        h4.textContent = titulo;
        const p = document.createElement('p');
        p.textContent = texto;
        const pre = document.createElement('pre');
        pre.className = 'demo-output-code';
        pre.textContent = exemplo;
        info.append(h4, p, pre);
    };

    botoes.forEach(b => b.addEventListener('click', () => mostrar(Number(b.dataset.step))));
    mostrar(0);
}

// CONSERTO AUTOMÁTICO DE HTML
function setupConserto() {
    const input = document.getElementById('fix-input');
    const output = document.getElementById('fix-output');
    if (!input || !output) return;

    const corrigir = () => {
        const doc = new DOMParser().parseFromString(input.value, 'text/html');
        output.textContent = desenharArvore(doc.body).join('\n');
    };
    input.addEventListener('input', corrigir);
    corrigir();
}

// HACKS AO VIVO
function setupHacks() {
    const dialog = document.getElementById('hack-dialog');
    const abrir = document.getElementById('hack-dialog-open');
    if (dialog && abrir && typeof dialog.showModal === 'function') {
        abrir.addEventListener('click', () => dialog.showModal());
    }

    const editar = document.getElementById('hack-edit');
    const caixa = document.getElementById('hack-editable');
    if (editar && caixa) {
        editar.addEventListener('click', () => {
            const ativo = caixa.getAttribute('contenteditable') !== 'true';
            caixa.setAttribute('contenteditable', String(ativo));
            editar.setAttribute('aria-pressed', String(ativo));
            editar.textContent = ativo ? '✅ Parar de editar' : '✏️ Editar esta caixa';
            if (ativo) caixa.focus();
        });
    }
}