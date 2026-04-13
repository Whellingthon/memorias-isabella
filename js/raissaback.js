document.addEventListener('DOMContentLoaded', async () => {
    const galleryContainer = document.getElementById('eventGallery');
    if (!galleryContainer) return;

    // Use a NEW key to force clear the old Backblaze links
    const cacheKey = 'raissa_cloudinary_v2'; 
    const cloudName = "dshrkz3mj";
    const cacheExpiry = 24 * 60 * 60 * 1000; 

    // 1. CHECK CACHE (Improves performance)
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
        const { images, timestamp } = JSON.parse(cachedData);
        if (new Date().getTime() - timestamp < cacheExpiry) {
            console.log('🚀 Cache loaded successfully.');
            renderizarMosaico(images);
            return;
        }
    }

    // 2. GENERATE NEW LINKS
    try {
        console.log('📡 Building photo URLs...');
        const validPaths = [];
        const baseID = "raissa-";
        const sufixo = "_oxt20l"; // Your Cloudinary suffix
        const version = "v1775868353";
        
        // Base URL formula
        const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/q_auto/f_auto/${version}/`;

        for (let i = 1; i <= 359; i++) {
            const paddedNumber = String(i).padStart(3, '0');
            const imagePath = `${baseUrl}${baseID}${paddedNumber}${sufixo}.jpg`;
            validPaths.push(imagePath);
        }

        // 3. SAVE TO CACHE
        localStorage.setItem(cacheKey, JSON.stringify({
            images: validPaths,
            timestamp: new Date().getTime()
        }));

        renderizarMosaico(validPaths);

    } catch (error) {
        console.error('Integration Error:', error);
        galleryContainer.innerHTML = '<p>Error loading photos.</p>';
    }

    function renderizarMosaico(imagePaths) {
        let galleryHTML = '';
        imagePaths.forEach((path, index) => {
            const layoutClass = typeof getGridClass === 'function' ? getGridClass(index) : '';
            galleryHTML += `
                <div class="gallery-item reveal ${layoutClass}">
                    <a href="${path}" target="_blank">
                        <img src="${path}" alt="Raissa Sweet 15" loading="lazy">
                    </a>
                </div>`;
        });
        galleryContainer.innerHTML = galleryHTML;
        if (typeof initScrollReveal === 'function') initScrollReveal();
    }
});