// Script para Aula 5 - Criando Formulários

document.addEventListener('DOMContentLoaded', function() {
    // Botão hero - scroll para TOC
    const btnHero = document.getElementById('btn-hero');
    if (btnHero) {
        btnHero.addEventListener('click', function() {
            const tocSection = document.querySelector('.toc-section');
            if (tocSection) {
                tocSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Scroll to top button
    window.addEventListener('scroll', function() {
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
        }
    });

    // Links internos - smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#toc-section') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    setupCopyButtons();
    setupDemos();
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// BOTÃO COPIAR CÓDIGO
function setupCopyButtons() {
    document.querySelectorAll('pre > code.code-block').forEach(code => {
        const pre = code.parentElement;
        pre.style.position = 'relative';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-code-btn';
        copyBtn.type = 'button';
        copyBtn.title = 'Copiar código';
        copyBtn.innerHTML = '<img src="../img/clone.png" alt="Copiar">';

        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code.innerText).then(() => {
                copyBtn.style.opacity = '0.5';
                setTimeout(() => { copyBtn.style.opacity = '1'; }, 2000);
            }).catch(() => alert('Erro ao copiar o código!'));
        });

        pre.appendChild(copyBtn);
    });
}

// Converte FormData em objeto, agrupando campos repetidos em arrays
function formDataToObject(form) {
    const obj = {};
    for (const [key, value] of new FormData(form)) {
        const val = value instanceof File ? (value.name ? `📎 ${value.name}` : '(nenhum arquivo)') : value;
        if (key in obj) {
            obj[key] = [].concat(obj[key], val);
        } else {
            obj[key] = val;
        }
    }
    return obj;
}

function setupDemos() {
    // Nenhum formulário de demonstração envia dados de verdade
    document.querySelectorAll('form[data-demo]').forEach(form => {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const output = form.querySelector('.demo-output');
            if (output && !form.noValidate) {
                output.textContent = '✅ Tudo válido! O formulário seria enviado.';
            }
        });
    });

    // Outputs ligados a sliders
    [['d-range', 'd-range-out'], ['fc-nivel', 'fc-nivel-out']].forEach(([inputId, outId]) => {
        const input = document.getElementById(inputId);
        const out = document.getElementById(outId);
        if (input && out) {
            input.addEventListener('input', () => { out.value = input.value; });
        }
    });

    // Contador do textarea
    const bio = document.getElementById('d-bio');
    const bioCount = document.getElementById('d-bio-count');
    if (bio && bioCount) {
        bio.addEventListener('input', () => { bioCount.textContent = bio.value.length; });
    }

    // Checkbox indeterminado (só existe via JS)
    const indeterminate = document.getElementById('d-indeterminate');
    if (indeterminate) {
        indeterminate.indeterminate = true;
    }

    setupPasswordDemo();
    setupStrengthMeter();
    setupFormDataDemo();
    setupCompleteFormDemo();
    setupHacksDemo();
}

// Constraint Validation API: confirmar senha com mensagens personalizadas
function setupPasswordDemo() {
    const form = document.getElementById('demo-senha');
    if (!form) return;

    const senha = form.elements.senha;
    const confirma = form.elements.confirma;
    const output = form.querySelector('.demo-output');

    function validarConfirmacao() {
        confirma.setCustomValidity(
            confirma.value && confirma.value !== senha.value ? 'As senhas não conferem' : ''
        );
    }

    function mensagem(campo) {
        if (campo.validity.valueMissing) return 'Preencha este campo.';
        if (campo.validity.tooShort) return `Use pelo menos ${campo.minLength} caracteres (você digitou ${campo.value.length}).`;
        return campo.validationMessage;
    }

    senha.addEventListener('input', validarConfirmacao);
    confirma.addEventListener('input', validarConfirmacao);

    form.addEventListener('submit', () => {
        validarConfirmacao();
        const invalido = [senha, confirma].find(campo => !campo.checkValidity());
        [senha, confirma].forEach(campo => campo.setAttribute('aria-invalid', String(!campo.validity.valid)));

        if (invalido) {
            output.textContent = `❌ ${invalido.labels[0].textContent}: ${mensagem(invalido)}`;
            invalido.focus();
        } else {
            output.textContent = '✅ Conta criada! (validity.valid === true)';
        }
    });
}

// Meter de força da senha
function setupStrengthMeter() {
    const pass = document.getElementById('o-pass');
    const meter = document.getElementById('o-meter');
    if (!pass || !meter) return;

    pass.addEventListener('input', () => {
        const v = pass.value;
        let forca = 0;
        if (v.length >= 8) forca++;
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) forca++;
        if (/\d/.test(v)) forca++;
        if (/[^A-Za-z0-9]/.test(v)) forca++;
        meter.value = forca;
    });
}

// FormData ao vivo
function setupFormDataDemo() {
    const form = document.getElementById('demo-formdata');
    if (!form) return;

    const pre = form.querySelector('.demo-json');
    const render = () => {
        pre.textContent = 'new FormData(form) →\n' + JSON.stringify(formDataToObject(form), null, 2);
    };
    form.addEventListener('input', render);
    form.addEventListener('change', render);
    render();
}

// Formulário completo: mostra o que seria enviado
function setupCompleteFormDemo() {
    const form = document.getElementById('demo-completo');
    if (!form) return;

    const pre = form.querySelector('.demo-json');
    form.addEventListener('submit', () => {
        pre.textContent = '✅ Dados que seriam enviados:\n' + JSON.stringify(formDataToObject(form), null, 2);
    });
    form.addEventListener('reset', () => { pre.textContent = ''; });
}

// Hacks: mostrar senha, showPicker e preview de imagem
function setupHacksDemo() {
    const senha = document.getElementById('h-senha');
    const toggle = document.getElementById('h-toggle');
    if (senha && toggle) {
        toggle.addEventListener('click', () => {
            const mostrar = senha.type === 'password';
            senha.type = mostrar ? 'text' : 'password';
            toggle.textContent = mostrar ? '🙈 Ocultar' : '👁️ Mostrar';
            toggle.setAttribute('aria-pressed', String(mostrar));
        });
    }

    const data = document.getElementById('h-data');
    const picker = document.getElementById('h-picker');
    if (data && picker) {
        picker.addEventListener('click', () => {
            if (typeof data.showPicker === 'function') {
                try {
                    data.showPicker();
                    return;
                } catch (e) {
                    // Alguns navegadores bloqueiam showPicker em certos contextos
                }
            }
            data.focus();
        });
    }

    const file = document.getElementById('h-img');
    const preview = document.getElementById('h-preview');
    if (file && preview) {
        file.addEventListener('change', () => {
            const arquivo = file.files[0];
            if (preview.src) URL.revokeObjectURL(preview.src);
            if (arquivo && arquivo.type.startsWith('image/')) {
                preview.src = URL.createObjectURL(arquivo);
                preview.hidden = false;
            } else {
                preview.removeAttribute('src');
                preview.hidden = true;
            }
        });
    }
}