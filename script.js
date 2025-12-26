/* script.js - TaiwanMe Official Logic */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==============================================
    // 0. 輔助函式：統一管理 Modal 關閉
    // ==============================================
    const closeAllModals = () => {
        const modals = [
            document.getElementById('searchModal'),
            document.getElementById('philosophyModal'),
            document.getElementById('tippingModal')
        ];
        modals.forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
    };

    // ==============================================
    // 1. 搜尋 Modal 功能 (Search Modal)
    // ==============================================
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const closeSearch = document.querySelector('.close-search');

    if (searchBtn && searchModal) {
        searchBtn.addEventListener('click', () => {
            searchModal.style.display = 'flex';
        });
        if (closeSearch) {
            closeSearch.addEventListener('click', () => searchModal.style.display = 'none');
        }
    }

    // ==============================================
    // 2. Philosophy 海報彈窗功能
    // ==============================================
    const philosophyBtn = document.getElementById('philosophyBtn');
    const philosophyModal = document.getElementById('philosophyModal');
    const closePoster = document.querySelector('.close-poster');

    if (philosophyBtn && philosophyModal) {
        philosophyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            philosophyModal.style.display = 'flex';
        });
        if (closePoster) {
            closePoster.addEventListener('click', () => philosophyModal.style.display = 'none');
        }
    }

    // ==============================================
    // 3. 打賞 (Tipping) 彈窗邏輯 & 複製功能
    // ==============================================
    const tippingBtn = document.getElementById('tippingBtn');
    const tippingModal = document.getElementById('tippingModal');
    const closeTipping = document.querySelector('.close-tipping');

    if (tippingBtn && tippingModal) {
        tippingBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tippingModal.style.display = 'flex';
        });
        if (closeTipping) {
            closeTipping.addEventListener('click', () => tippingModal.style.display = 'none');
        }

        // --- 複製地址功能 ---
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const address = btn.getAttribute('data-addr');
                
                try {
                    // 優先使用現代 Clipboard API
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        await navigator.clipboard.writeText(address);
                        handleCopyFeedback(btn);
                    } else {
                        throw new Error('Clipboard API unavailable');
                    }
                } catch (err) {
                    // 備用方案 (針對較舊手機瀏覽器)
                    const textArea = document.createElement("textarea");
                    textArea.value = address;
                    // 避免在手機上拉起鍵盤
                    textArea.style.position = "fixed"; 
                    textArea.style.left = "-9999px";
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        handleCopyFeedback(btn);
                    } catch (e) {
                        alert('Unable to copy automatically. Please copy manually.');
                    }
                    document.body.removeChild(textArea);
                }
            });
        });
    }

    // 複製成功的視覺回饋處理
    function handleCopyFeedback(btn) {
        const originalText = btn.textContent;
        // 避免重複點擊導致文字閃爍
        if (btn.classList.contains('copy-success')) return;

        btn.classList.add('copy-success');
        btn.textContent = 'Copied!';
        btn.style.backgroundColor = '#4CAF50';
        btn.style.color = '#fff';
        btn.style.borderColor = '#4CAF50';

        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.classList.remove('copy-success');
        }, 2000);
    }

    // ==============================================
    // 4. 全域點擊背景與 ESC 鍵關閉功能
    // ==============================================
    window.addEventListener('click', (e) => {
        // 如果點擊的是任何一個 Modal 本身(背景層)，就關閉全部
        if (e.target.classList.contains('search-modal') || 
            e.target.classList.contains('philosophy-modal') || 
            e.target.classList.contains('tipping-modal')) {
            closeAllModals();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAllModals();
    });

    // ==============================================
    // 5. 自動輪播圖 (Hero Slider) - 只在首頁運作
    // ==============================================
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    let currentSlide = 0;
    let slideInterval;

    // 定義切換函式
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // [重要] 只有當頁面上有幻燈片元素時才執行
    if (slides.length > 0) {
        const startSlideShow = () => {
            // 清除舊的計時器，避免多重啟動
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000); // 建議改為 5秒，3秒有點太快
        };

        const resetSlideShow = () => {
            startSlideShow();
        };

        // 啟動輪播
        showSlide(0); // 確保一開始顯示第一張
        startSlideShow();

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetSlideShow();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
                resetSlideShow();
            });
        }
    }

    // ==============================================
    // 6. 展開更多文章 (Load More)
    // ==============================================
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const hiddenCards = document.querySelectorAll('.hidden-card');
            
            hiddenCards.forEach(card => {
                card.style.display = 'block';
                // 使用 requestAnimationFrame 確保瀏覽器完成 display 渲染後再執行 opacity 動畫
                requestAnimationFrame(() => {
                    card.style.opacity = '1';
                });
            });
            
            loadMoreBtn.style.display = 'none';
        });
    }

    // ==============================================
    // 7. 地圖按鈕捲動功能 (點擊地圖區域 -> 捲動到文章)
    // ==============================================
    const mapRegions = document.querySelectorAll('.region-circle, .region-card, .region-square');
    const articlesSection = document.querySelector('.articles-section');

    if (mapRegions.length > 0 && articlesSection) {
        mapRegions.forEach(region => {
            region.addEventListener('click', (e) => {
                e.preventDefault(); 
                articlesSection.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // ==============================================
    // 8. 導覽列 "Hidden Gems" 連結邏輯 (跨頁面支援)
    // ==============================================
    const hiddenGemLinks = document.querySelectorAll('.scroll-to-map'); // 抓取導覽列按鈕
    const mapSection = document.getElementById('mapSection');           // 抓取地圖區塊

    if (hiddenGemLinks.length > 0) {
        hiddenGemLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 如果目前頁面有地圖區塊 (首頁)
                if (mapSection) {
                    e.preventDefault();
                    mapSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    // 如果目前頁面沒有地圖區塊 (子頁面)，則不做 preventDefault
                    // 讓它執行原本 <a> 標籤的 href 跳轉 (例如 href="index.html#mapSection")
                }
            });
        });
    }

    // ==============================================
    // 9. Dining Page 篩選與搜尋功能
    // ==============================================
    const diningSearchInput = document.getElementById('diningSearchInput');
    const diningSearchBtn = document.getElementById('diningSearchBtn');
    const dietCheckboxes = document.querySelectorAll('.diet-checkbox');
    const restaurantGrid = document.getElementById('restaurantGrid');
    const noResultsMsg = document.getElementById('noResults');

    // 只有在檢測到餐廳列表時才執行 (避免在首頁報錯)
    if (restaurantGrid) {
        
        const filterRestaurants = () => {
            // 取得輸入關鍵字 (轉小寫)
            const keyword = diningSearchInput.value.toLowerCase().trim();
            const cards = document.querySelectorAll('.res-card');
            
            // 收集被勾選的標籤
            const selectedDiets = Array.from(dietCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            let visibleCount = 0;

            cards.forEach(card => {
                const areaData = card.getAttribute('data-area') || '';
                const dietData = card.getAttribute('data-diet') || '';
                const dietList = dietData.split(' '); // 字串轉陣列

                // 檢查1: 關鍵字是否包含在區域/路名中
                const matchesKeyword = areaData.toLowerCase().includes(keyword);

                // 檢查2: 是否符合所有勾選的標籤 (AND 邏輯)
                const matchesDiet = selectedDiets.every(tag => dietList.includes(tag));

                if (matchesKeyword && matchesDiet) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // 顯示或隱藏「查無結果」
            if (noResultsMsg) {
                noResultsMsg.style.display = (visibleCount === 0) ? 'block' : 'none';
            }
        };

        // 綁定事件
        if (diningSearchBtn) diningSearchBtn.addEventListener('click', filterRestaurants);
        
        if (diningSearchInput) {
            diningSearchInput.addEventListener('keyup', (e) => {
                filterRestaurants(); // 即時搜尋
            });
        }

        dietCheckboxes.forEach(cb => {
            cb.addEventListener('change', filterRestaurants);
        });
    }

    // ==============================================
    // 10. Back to Top Button Logic (回到頂端按鈕)
    // ==============================================
    const backToTopBtn = document.getElementById('backToTopBtn');

    if (backToTopBtn) {
        // 監聽捲動事件
        window.addEventListener('scroll', () => {
            // 計算頁面總高度與目前捲動位置
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;

            // 邏輯：當捲動超過頁面總高度的 50% (一半) 時顯示
            if (scrollPosition > totalHeight / 2) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // 監聽點擊事件 -> 平滑捲動回頂端
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

});
