// Script para Aula 4 - Inserindo Imagens

// Smooth scroll e navegação
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
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    // Links internos - smooth scroll
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#toc-section') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
});

// Função para voltar ao topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Lazy loading fallback para navegadores antigos
if (!('loading' in HTMLImageElement.prototype)) {
    // Usar Intersection Observer como fallback
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Função para adicionar tooltips em imagens
function setupImageTooltips() {
    const images = document.querySelectorAll('img[title]');
    images.forEach(img => {
        img.addEventListener('mouseover', function() {
            console.log('Imagem: ' + this.alt);
        });
    });
}

// Executar ao carregar
document.addEventListener('DOMContentLoaded', setupImageTooltips);

// Analytics - rastrear imagens que carregaram
document.addEventListener('load', function() {
    const images = document.querySelectorAll('img');
    console.log('Total de imagens na página:', images.length);
}, true);

// Validação de imagens com erro
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        console.warn('Imagem não carregou:', e.target.src);
        e.target.style.opacity = '0.5';
    }
}, true);
