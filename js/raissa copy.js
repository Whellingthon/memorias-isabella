// Initialize Lucide Icons
lucide.createIcons();

// ========== CONFIGURAÇÃO DA CDN (GitHub + jsDelivr) ==========
const GITHUB_USER = 'Whellingthon'; 
const REPO_NAME = 'memorias-isabella';
// Agora sim, o JS vai buscar o conteúdo das variáveis acima:
const BASE_URL = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${REPO_NAME}@main/`;

// ========== GERAÇÃO DINÂMICA DA GALERIA ==========
function generateGallery() {
    const photos = [];
    const totalPhotos = 359;

    for (let i = 1; i <= totalPhotos; i++) {
        // Formata o número para o padrão raissa-001.jpg, raissa-002.jpg...
        const photoNum = String(i).padStart(3, '0');
        const fileName = `raissa-${photoNum}.jpg`;
        
        // Lógica de Categorização (Ajuste conforme sua preferência)
        let category = 'ensaio';
        if (i > 100 && i <= 250) category = 'festa';
        else if (i > 250 && i <= 300) category = 'detalhes';
        else if (i > 300) category = 'familia';

        // Lógica de Mosaico (Tamanhos diferentes para dinamismo)
        let span = '';
        if (i % 12 === 0) span = 'span-col-2 span-row-2'; // Destaque grande a cada 12 fotos
        else if (i % 7 === 0) span = 'span-col-2';        // Destaque largo a cada 7 fotos
        else if (i % 5 === 0) span = 'span-row-2';        // Destaque alto a cada 5 fotos

        photos.push({
            src: `${BASE_URL}${fileName}`,
            category: category,
            span: span,
            caption: `Isabella - Registro ${photoNum}`
        });
    }
    return photos;
}

// Inicializa os dados da galeria
const galleryImages = generateGallery();

let currentFilter = 'all';
let currentLightboxIndex = 0;
let filteredImages = [...galleryImages];

// ========== RENDERIZAÇÃO DA GRADE ==========
function renderGallery(filter = 'all') {
    const grid = document.getElementById('galleryGrid');
    filteredImages = filter === 'all' ? [...galleryImages] : galleryImages.filter(img => img.category === filter);

    grid.innerHTML = '';

    if (filteredImages.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 50px; font-family: Montserrat; font-size: 14px;">Nenhuma imagem nesta categoria.</p>';
        return;
    }

    filteredImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = `gallery-item ${img.span} reveal-scale`;
        item.setAttribute('data-index', index);
        item.onclick = () => openLightbox(index);

        item.innerHTML = `
            <img src="${img.src}" alt="${img.caption}" loading="lazy" />
            <div class="overlay">
                <div>
                    <p class="font-sans text-white text-[10px] tracking-wider uppercase opacity-80">${img.category}</p>
                    <p class="font-serif text-white text-lg italic">${img.caption}</p>
                </div>
            </div>
        `;

        grid.appendChild(item);
    });

    // Re-observa elementos para animação de scroll
    observeElements();
}

// ========== LÓGICA DE FILTROS ==========
document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
        document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.filter;
        renderGallery(currentFilter);
    });
});

// ========== LIGHTBOX (VISUALIZAÇÃO AMPLIADA) ==========
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCounter = document.getElementById('lightboxCounter');

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
}

function updateLightbox() {
    const img = filteredImages[currentLightboxIndex];
    lightboxImg.src = img.src;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${filteredImages.length}`;
}

document.getElementById('lightboxClose').onclick = closeLightbox;
document.getElementById('lightboxPrev').onclick = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    updateLightbox();
};
document.getElementById('lightboxNext').onclick = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length;
    updateLightbox();
};

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { 
        currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length; 
        updateLightbox(); 
    }
    if (e.key === 'ArrowRight') { 
        currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length; 
        updateLightbox(); 
    }
});

// ========== ANIMAÇÕES E INTERAÇÕES ==========
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        if (!el.classList.contains('active')) {
            observer.observe(el);
        }
    });
}

function animateCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) requestAnimationFrame(update);
                    else el.textContent = target;
                }
                requestAnimationFrame(update);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
}

function createPetals() {
    const container = document.getElementById('petalsContainer');
    if(!container) return;
    const petalsCount = window.innerWidth < 768 ? 8 : 15;

    for (let i = 0; i < petalsCount; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 10 + 6;
        petal.style.width = size + 'px';
        petal.style.height = size + 'px';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 15 + 10) + 's';
        petal.style.animationDelay = (Math.random() * 15) + 's';
        container.appendChild(petal);
    }
}

// ========== MENUS E TOASTS ==========
const mobileMenu = document.getElementById('mobileMenu');
document.getElementById('mobileMenuBtn').onclick = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
};
document.getElementById('closeMobileMenu').onclick = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMsg');
    if(!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Botões de Download (Simulação)
document.querySelectorAll('#downloadBtn, #downloadBtnMobile, #downloadAllBtn').forEach(btn => {
    btn?.addEventListener('click', () => {
        showToast('🌸 Iniciando processamento das fotos em HD...');
    });
});

// ========== INICIALIZAÇÃO FINAL ==========
document.addEventListener('DOMContentLoaded', () => {
    renderGallery('all');
    animateCounters();
    createPetals();
    observeElements();
    lucide.createIcons();
});