/**
 * BOOKVILLE - Главный JavaScript файл
 * Улучшенная версия с оптимизацией, доступностью и производительностью
 */

// ======================
// МОДУЛЬ СЛАЙДЕРА
// ======================
const SliderModule = (() => {
    let currentSlideIndex = 0;
    let slideInterval;
    let isAnimating = false;
    let autoplayEnabled = true;
    let slides = [];
    let dots = [];
    let arrows = [];
    
    const init = () => {
        slides = Array.from(document.querySelectorAll('.uv-slide-item'));
        dots = Array.from(document.querySelectorAll('.uv-slider-dot'));
        arrows = Array.from(document.querySelectorAll('.uv-slide-arrow'));
        
        if (slides.length === 0) return;
        
        setupEventListeners();
        setupAccessibility();
        showSlide(currentSlideIndex);
        startAutoplay();
    };
    
    const setupEventListeners = () => {
        // Стрелки
        arrows.forEach(arrow => {
            arrow.addEventListener('click', (e) => {
                e.preventDefault();
                const direction = arrow.classList.contains('uv-slide-arrow-left') ? -1 : 1;
                changeSlide(direction);
            });
            
            // Клавиатурная навигация
            arrow.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    arrow.click();
                }
            });
        });
        
        // Точки
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                goToSlide(index);
            });
            
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
        });
        
        // Пауза при наведении
        const slider = document.querySelector('.uv-slider-container');
        if (slider) {
            slider.addEventListener('mouseenter', () => {
                autoplayEnabled = false;
                clearInterval(slideInterval);
            });
            
            slider.addEventListener('mouseleave', () => {
                autoplayEnabled = true;
                startAutoplay();
            });
            
            // Касание для мобильных
            let touchStartX = 0;
            let touchEndX = 0;
            
            slider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                autoplayEnabled = false;
                clearInterval(slideInterval);
            });
            
            slider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
                autoplayEnabled = true;
                startAutoplay();
            });
            
            const handleSwipe = () => {
                const swipeThreshold = 50;
                const diff = touchStartX - touchEndX;
                
                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        changeSlide(1); // Свайп влево
                    } else {
                        changeSlide(-1); // Свайп вправо
                    }
                }
            };
        }
    };
    
    const setupAccessibility = () => {
        // Устанавливаем aria-атрибуты
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Слайд ${index + 1} из ${slides.length}`);
        });
        
        // Делаем слайдер доступным для клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.uv-slider-container')) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        changeSlide(-1);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        changeSlide(1);
                        break;
                    case 'Home':
                        e.preventDefault();
                        goToSlide(0);
                        break;
                    case 'End':
                        e.preventDefault();
                        goToSlide(slides.length - 1);
                        break;
                }
            }
        });
    };
    
    const showSlide = (index) => {
        if (isAnimating || slides.length === 0) return;
        
        isAnimating = true;
        
        // Скрываем все слайды
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
        });
        
        // Обновляем точки
        dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });
        
        // Показываем нужный слайд
        slides[index].classList.add('active');
        slides[index].setAttribute('aria-hidden', 'false');
        
        // Обновляем точку
        if (dots[index]) {
            dots[index].classList.add('active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        
        currentSlideIndex = index;
        
        // Анимация завершена
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    };
    
    const changeSlide = (direction) => {
        if (isAnimating) return;
        
        let newIndex = currentSlideIndex + direction;
        
        if (newIndex < 0) {
            newIndex = slides.length - 1;
        } else if (newIndex >= slides.length) {
            newIndex = 0;
        }
        
        showSlide(newIndex);
    };
    
    const goToSlide = (index) => {
        if (isAnimating || index < 0 || index >= slides.length) return;
        
        showSlide(index);
    };
    
    const startAutoplay = () => {
        clearInterval(slideInterval);
        
        if (autoplayEnabled && slides.length > 1) {
            slideInterval = setInterval(() => {
                changeSlide(1);
            }, 5000);
        }
    };
    
    const stopAutoplay = () => {
        autoplayEnabled = false;
        clearInterval(slideInterval);
    };
    
    return {
        init,
        changeSlide,
        goToSlide,
        startAutoplay,
        stopAutoplay
    };
})();

// ======================
// МОДУЛЬ НАВИГАЦИИ
// ======================
const NavigationModule = (() => {
    let dropdown = null;
    let dropbtn = null;
    let mobileMenuToggle = null;
    let navContainer = null;
    let searchToggle = null;
    let searchOverlay = null;
    let searchClose = null;
    let langSelect = null;
    
    const init = () => {
        dropdown = document.getElementById('myDropdown');
        dropbtn = document.querySelector('.dropbtn');
        mobileMenuToggle = document.querySelector('.uv-mobile-menu-toggle');
        navContainer = document.querySelector('.uv-nav-container');
        searchToggle = document.querySelector('.uv-search-toggle');
        searchOverlay = document.querySelector('.uv-search-overlay');
        searchClose = document.querySelector('.uv-search-close');
        langSelect = document.querySelector('.uv-lang-select');
        
        setupDropdown();
        setupMobileMenu();
        setupSearch();
        setupLanguageSelector();
        setupScrollHandling();
    };
    
    const setupDropdown = () => {
        if (!dropbtn || !dropdown) return;
        
        dropbtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown();
        });
        
        // Клавиатурная навигация
        dropbtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown();
            } else if (e.key === 'Escape' && dropdown.getAttribute('aria-hidden') === 'false') {
                closeDropdown();
            }
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (dropdown.getAttribute('aria-hidden') === 'false' &&
                !dropdown.contains(e.target) &&
                !dropbtn.contains(e.target)) {
                closeDropdown();
            }
        });
        
        // Закрытие при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdown.getAttribute('aria-hidden') === 'false') {
                closeDropdown();
            }
        });
        
        // Обработка ссылок в dropdown
        const dropdownLinks = dropdown.querySelectorAll('a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeDropdown();
                closeMobileMenu();
            });
            
            // Tab навигация внутри dropdown
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && !e.shiftKey) {
                    const allLinks = Array.from(dropdownLinks);
                    const currentIndex = allLinks.indexOf(e.target);
                    
                    if (currentIndex === allLinks.length - 1) {
                        e.preventDefault();
                        closeDropdown();
                        dropbtn.focus();
                    }
                }
            });
        });
    };
    
    const toggleDropdown = () => {
        const isExpanded = dropbtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };
    
    const openDropdown = () => {
        if (!dropdown || !dropbtn) return;
        
        // Закрываем мобильное меню если открыто
        closeMobileMenu();
        
        // Обновляем атрибуты доступности
        dropdown.setAttribute('aria-hidden', 'false');
        dropbtn.setAttribute('aria-expanded', 'true');
        
        // Добавляем классы для анимации
        dropdown.classList.add('show');
        
        // Блокируем прокрутку на мобильных
        if (window.innerWidth <= 1024) {
            document.body.style.overflow = 'hidden';
        }
        
        // Фокусируем первый элемент внутри dropdown
        const firstLink = dropdown.querySelector('a');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    };
    
    const closeDropdown = () => {
        if (!dropdown || !dropbtn) return;
        
        // Обновляем атрибуты доступности
        dropdown.setAttribute('aria-hidden', 'true');
        dropbtn.setAttribute('aria-expanded', 'false');
        
        // Удаляем классы
        dropdown.classList.remove('show');
        
        // Разблокируем прокрутку
        document.body.style.overflow = '';
        
        // Возвращаем фокус на кнопку
        dropbtn.focus();
    };
    
    const setupMobileMenu = () => {
        if (!mobileMenuToggle || !navContainer) return;
        
        mobileMenuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMobileMenu();
            }
        });
        
        // Закрытие при клике на ссылку
        const navLinks = navContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Закрытие при клике вне меню
        document.addEventListener('click', (e) => {
            if (navContainer.classList.contains('active') &&
                !navContainer.contains(e.target) &&
                !mobileMenuToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });
    };
    
    const toggleMobileMenu = () => {
        const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
        
        // Закрываем dropdown если открыт
        closeDropdown();
        
        if (isExpanded) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    };
    
    const openMobileMenu = () => {
        if (!mobileMenuToggle || !navContainer) return;
        
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        navContainer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Анимация иконки
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    };
    
    const closeMobileMenu = () => {
        if (!mobileMenuToggle || !navContainer) return;
        
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        navContainer.classList.remove('active');
        document.body.style.overflow = '';
        
        // Анимация иконки
        const icon = mobileMenuToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };
    
    const setupSearch = () => {
        if (!searchToggle || !searchOverlay || !searchClose) return;
        
        searchToggle.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
        
        searchClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeSearch();
        });
        
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                closeSearch();
            }
        });
        
        // Клавиатурные комбинации
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            } else if (e.key === 'Escape' && searchOverlay.getAttribute('aria-hidden') === 'false') {
                closeSearch();
            }
        });
        
        // Обработка поиска
        const searchInput = searchOverlay.querySelector('input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch(searchInput.value);
                }
            });
        }
    };
    
    const openSearch = () => {
        if (!searchOverlay) return;
        
        // Закрываем другие меню
        closeDropdown();
        closeMobileMenu();
        
        searchOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Фокусируем поле ввода
        const searchInput = searchOverlay.querySelector('input');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    };
    
    const closeSearch = () => {
        if (!searchOverlay) return;
        
        searchOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Возвращаем фокус на кнопку поиска
        searchToggle.focus();
    };
    
    const performSearch = (query) => {
        if (!query.trim()) return;
        
        console.log('Поиск:', query);
        showNotification(`Поиск: "${query}"`, 'info');
        
        // Здесь можно реализовать реальный поиск
        closeSearch();
    };
    
    const setupLanguageSelector = () => {
        if (!langSelect) return;
        
        langSelect.addEventListener('click', (e) => {
            e.preventDefault();
            toggleLanguageDropdown();
        });
        
        langSelect.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleLanguageDropdown();
            }
        });
        
        // Закрытие при клике вне
        document.addEventListener('click', (e) => {
            if (langSelect.getAttribute('aria-expanded') === 'true' &&
                !langSelect.contains(e.target)) {
                closeLanguageDropdown();
            }
        });
    };
    
    const toggleLanguageDropdown = () => {
        const isExpanded = langSelect.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            closeLanguageDropdown();
        } else {
            openLanguageDropdown();
        }
    };
    
    const openLanguageDropdown = () => {
        langSelect.setAttribute('aria-expanded', 'true');
    };
    
    const closeLanguageDropdown = () => {
        langSelect.setAttribute('aria-expanded', 'false');
    };
    
    const setupScrollHandling = () => {
        let lastScrollTop = 0;
        const header = document.querySelector('.uv-header-wrap');
        
        if (!header) return;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Прокрутка вниз
                header.style.transform = 'translateY(-100%)';
            } else {
                // Прокрутка вверх
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        });
    };
    
    return {
        init,
        closeDropdown,
        closeMobileMenu,
        closeSearch,
        closeLanguageDropdown
    };
})();

// ======================
// МОДУЛЬ ПРОДУКТОВ
// ======================
const ProductsModule = (() => {
    const productsData = {
        popular: [
            {
                id: 1,
                title: "Мастер и Маргарита",
                author: "Михаил Булгаков",
                price: "890 ₽",
                discount: "-15%",
                oldPrice: "1,050 ₽",
                image: "./img/img_book.jpg",
                category: "Художественная литература",
                rating: 4.8,
                description: "Культовый роман Михаила Булгакова"
            },
            {
                id: 2,
                title: "Атомные привычки",
                author: "Джеймс Клир",
                price: "990 ₽",
                discount: null,
                oldPrice: null,
                image: "./img/img_book.jpg",
                category: "Саморазвитие",
                rating: 4.9,
                description: "Как приобрести хорошие привычки и избавиться от плохих"
            },
            {
                id: 3,
                title: "Thinking, Fast and Slow",
                author: "Даниэль Канеман",
                price: "1,290 ₽",
                discount: "-20%",
                oldPrice: "1,590 ₽",
                image: "./img/img_book.jpg",
                category: "Психология",
                rating: 4.7,
                description: "Нобелевский лауреат о двух системах мышления"
            },
            {
                id: 4,
                title: "Маленький принц",
                author: "Антуан де Сент-Экзюпери",
                price: "690 ₽",
                discount: null,
                oldPrice: null,
                image: "./img/img_book.jpg",
                category: "Детские",
                rating: 4.9,
                description: "Философская сказка для детей и взрослых"
            }
        ],
        discounts: [
            {
                id: 5,
                title: "Сила подсознания",
                author: "Джозеф Мерфи",
                price: "790 ₽",
                oldPrice: "990 ₽",
                discount: "-20%",
                image: "./img/img_book.jpg",
                category: "Саморазвитие",
                rating: 4.6,
                description: "Как использовать силу вашего подсознания"
            },
            {
                id: 6,
                title: "1984",
                author: "Джордж Оруэлл",
                price: "590 ₽",
                oldPrice: "790 ₽",
                discount: "-25%",
                image: "./img/img_book.jpg",
                category: "Художественная литература",
                rating: 4.8,
                description: "Антиутопия о тоталитарном обществе"
            },
            {
                id: 7,
                title: "Психология влияния",
                author: "Роберт Чалдини",
                price: "890 ₽",
                oldPrice: "1,090 ₽",
                discount: "-18%",
                image: "./img/img_book.jpg",
                category: "Психология",
                rating: 4.7,
                description: "Классика социальной психологии"
            },
            {
                id: 8,
                title: "Гарри Поттер и философский камень",
                author: "Дж. К. Роулинг",
                price: "990 ₽",
                oldPrice: "1,290 ₽",
                discount: "-23%",
                image: "./img/img_book.jpg",
                category: "Книги для подростков",
                rating: 4.9,
                description: "Первая книга культовой серии"
            }
        ],
        recommended: [
            {
                id: 9,
                title: "Сто лет одиночества",
                author: "Габриэль Гарсиа Маркес",
                price: "950 ₽",
                discount: null,
                oldPrice: null,
                image: "./img/img_book.jpg",
                category: "Художественная литература",
                rating: 4.8,
                description: "Величайший роман XX века"
            },
            {
                id: 10,
                title: "7 навыков высокоэффективных людей",
                author: "Стивен Кови",
                price: "890 ₽",
                discount: null,
                oldPrice: null,
                image: "./img/img_book.jpg",
                category: "Саморазвитие",
                rating: 4.7,
                description: "Классика личностного роста"
            },
            {
                id: 11,
                title: "Манускрипт",
                author: "Пауло Коэльо",
                price: "750 ₽",
                oldPrice: "850 ₽",
                discount: "-10%",
                image: "./img/img_book.jpg",
                category: "Художественная литература",
                rating: 4.6,
                description: "Роман о поиске предназначения"
            },
            {
                id: 12,
                title: "Как говорить, чтобы дети слушали",
                author: "Адель Фабер",
                price: "850 ₽",
                discount: null,
                oldPrice: null,
                image: "./img/img_book.jpg",
                category: "Для родителей",
                rating: 4.8,
                description: "Практическое руководство для родителей"
            }
        ]
    };
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
    const init = () => {
        loadProducts();
        setupCart();
        setupProductInteractions();
        loadProductAnimations();
    };
    
    const loadProducts = () => {
        renderProducts('popular-products', productsData.popular);
        renderProducts('discount-products', productsData.discounts, true);
        renderProducts('recommended-products', productsData.recommended);
    };
    
    const renderProducts = (containerId, products, showOldPrice = false) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const productCards = products.map(product => createProductHTML(product, showOldPrice)).join('');
        container.innerHTML = productCards;
        
        // Добавляем анимацию появления
        setTimeout(() => {
            const cards = container.querySelectorAll('.uv-product-card');
            cards.forEach(card => {
                card.classList.add('visible');
            });
        }, 100);
    };
    
    const createProductHTML = (product, showOldPrice = false) => {
        const isFav = isFavorite(product.id);
        const isInCart = cart.some(item => item.id === product.id);
        
        return `
            <div class="uv-product-card" data-id="${product.id}" role="article" aria-label="${product.title}">
                <div class="uv-product-img-wrap">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         class="uv-product-img"
                         loading="lazy"
                         width="280"
                         height="350">
                    ${product.discount ? `<span class="uv-product-discount">${product.discount}</span>` : ''}
                    <div class="uv-product-icons">
                        <button class="uv-fav-btn" 
                                aria-label="${isFav ? 'Удалить из избранного' : 'Добавить в избранное'}"
                                data-product-id="${product.id}">
                            <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="uv-cart-btn" 
                                aria-label="${isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}"
                                data-product-id="${product.id}">
                            <i class="${isInCart ? 'fas' : 'fas'} fa-shopping-bag"></i>
                        </button>
                    </div>
                </div>
                <div class="uv-product-info">
                    <h3 class="uv-product-title">${product.title}</h3>
                    <p class="uv-product-author">${product.author}</p>
                    <p class="uv-product-category">${product.category}</p>
                    <div class="uv-product-price">
                        ${showOldPrice && product.oldPrice ? 
                            `<span class="uv-old-price" aria-hidden="true">${product.oldPrice}</span>` : ''}
                        <span>${product.price}</span>
                    </div>
                    <div class="uv-product-rating" aria-label="Рейтинг: ${product.rating} из 5">
                        ${generateRatingStars(product.rating)}
                    </div>
                </div>
            </div>
        `;
    };
    
    const generateRatingStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    };
    
    const setupCart = () => {
        updateCartCounter();
        
        // Инициализация кнопок корзины
        document.addEventListener('click', (e) => {
            const cartBtn = e.target.closest('.uv-cart-btn');
            if (cartBtn) {
                e.preventDefault();
                const productId = parseInt(cartBtn.dataset.productId);
                toggleCart(productId, cartBtn);
            }
        });
    };
    
    const toggleCart = (productId, button) => {
        const product = getAllProducts().find(p => p.id === productId);
        if (!product) return;
        
        const existingIndex = cart.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            // Удаляем из корзины
            cart.splice(existingIndex, 1);
            showNotification(`"${product.title}" удален из корзины`, 'info');
            
            if (button) {
                button.setAttribute('aria-label', 'Добавить в корзину');
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-shopping-bag');
                    icon.classList.add('fa-shopping-bag');
                }
            }
        } else {
            // Добавляем в корзину
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
            
            showNotification(`"${product.title}" добавлен в корзину`);
            
            if (button) {
                button.setAttribute('aria-label', 'Удалить из корзины');
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCounter();
        
        // Анимация кнопки
        if (button) {
            button.classList.add('pulse');
            setTimeout(() => button.classList.remove('pulse'), 300);
        }
    };
    
    const setupProductInteractions = () => {
        // Избранное
        document.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.uv-fav-btn');
            if (favBtn) {
                e.preventDefault();
                const productId = parseInt(favBtn.dataset.productId);
                toggleFavorite(productId, favBtn);
            }
        });
        
        // Клик по карточке продукта
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.uv-product-card');
            if (productCard && !e.target.closest('.uv-product-icons')) {
                const productId = parseInt(productCard.dataset.id);
                openProductDetails(productId);
            }
        });
    };
    
    const toggleFavorite = (productId, button) => {
        const index = favorites.indexOf(productId);
        const product = getAllProducts().find(p => p.id === productId);
        
        if (index === -1) {
            // Добавляем в избранное
            favorites.push(productId);
            showNotification(`"${product.title}" добавлен в избранное`);
            
            if (button) {
                button.setAttribute('aria-label', 'Удалить из избранного');
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
            }
        } else {
            // Удаляем из избранного
            favorites.splice(index, 1);
            showNotification(`"${product.title}" удален из избранного`, 'info');
            
            if (button) {
                button.setAttribute('aria-label', 'Добавить в избранное');
                const icon = button.querySelector('i');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            }
        }
        
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Анимация кнопки
        if (button) {
            button.classList.add('pulse');
            setTimeout(() => button.classList.remove('pulse'), 300);
        }
    };
    
    const isFavorite = (productId) => {
        return favorites.includes(productId);
    };
    
    const openProductDetails = (productId) => {
        const product = getAllProducts().find(p => p.id === productId);
        if (product) {
            console.log('Открываем детали продукта:', product.title);
            // Здесь можно реализовать модальное окно с деталями
            showNotification(`Открываем "${product.title}"`, 'info');
        }
    };
    
    const updateCartCounter = () => {
        const cartCounter = document.querySelector('.uv-cart-counter');
        if (cartCounter) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCounter.textContent = totalItems;
            cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    };
    
    const getAllProducts = () => {
        return [
            ...productsData.popular,
            ...productsData.discounts,
            ...productsData.recommended
        ];
    };
    
    const loadProductAnimations = () => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Наблюдаем за карточками продуктов
        const productCards = document.querySelectorAll('.uv-product-card, .uv-book-card');
        productCards.forEach(card => {
            observer.observe(card);
        });
    };
    
    return {
        init,
        getAllProducts,
        getCart: () => cart,
        getFavorites: () => favorites,
        addToCart: (productId) => {
            const product = getAllProducts().find(p => p.id === productId);
            if (product) {
                toggleCart(productId);
            }
        }
    };
})();

// ======================
// МОДУЛЬ ФОРМ
// ======================
const FormsModule = (() => {
    const init = () => {
        setupNewsletterForm();
        setupCTAForm();
        setupInputMasks();
    };
    
    const setupNewsletterForm = () => {
        const form = document.querySelector('.uv-newsletter-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!validateEmail(email)) {
                showNotification('Пожалуйста, введите корректный email', 'error');
                emailInput.focus();
                return;
            }
            
            // Симуляция отправки
            simulateSubmit(form, () => {
                console.log('Подписка на рассылку:', email);
                showNotification('Спасибо за подписку! Проверьте вашу почту.');
                form.reset();
            });
        });
    };
    
    const setupCTAForm = () => {
        const form = document.getElementById('ctaForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameInput = form.querySelector('input[type="text"]');
            const phoneInput = form.querySelector('input[type="tel"]');
            
            const name = nameInput.value.trim();
            const phone = phoneInput.value.trim();
            
            if (!name || !phone) {
                showNotification('Пожалуйста, заполните все поля', 'error');
                if (!name) nameInput.focus();
                else phoneInput.focus();
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                phoneInput.focus();
                return;
            }
            
            // Симуляция отправки
            simulateSubmit(form, () => {
                console.log('Запрос на консультацию:', { name, phone });
                showNotification('Спасибо! Наш книжный сомелье свяжется с вами в течение 24 часов');
                form.reset();
            });
        });
    };
    
    const setupInputMasks = () => {
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                
                if (value.length > 0) {
                    value = '+7' + value;
                }
                
                e.target.value = formatPhoneNumber(value);
            });
            
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace') {
                    // Разрешаем Backspace
                    return;
                }
                
                // Разрешаем только цифры и специальные клавиши
                if (!/[\d+()-\s]/.test(e.key) && 
                    !['ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key)) {
                    e.preventDefault();
                }
            });
        });
    };
    
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };
    
    const validatePhone = (phone) => {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 11;
    };
    
    const formatPhoneNumber = (phone) => {
        const digits = phone.replace(/\D/g, '');
        
        if (digits.length === 0) return '';
        
        let formatted = '+7';
        
        if (digits.length > 1) {
            formatted += ' (' + digits.substring(1, 4);
        }
        
        if (digits.length >= 5) {
            formatted += ') ' + digits.substring(4, 7);
        }
        
        if (digits.length >= 8) {
            formatted += '-' + digits.substring(7, 9);
        }
        
        if (digits.length >= 10) {
            formatted += '-' + digits.substring(9, 11);
        }
        
        return formatted;
    };
    
    const simulateSubmit = (form, callback) => {
        // Показываем состояние загрузки
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        // Симуляция задержки сети
        setTimeout(() => {
            callback();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1000);
    };
    
    return {
        init,
        validateEmail,
        validatePhone
    };
})();

// ======================
// МОДУЛЬ УВЕДОМЛЕНИЙ
// ======================
const NotificationModule = (() => {
    let notificationQueue = [];
    let isShowing = false;
    
    const show = (message, type = 'success', duration = 3000) => {
        notificationQueue.push({ message, type, duration });
        
        if (!isShowing) {
            processQueue();
        }
    };
    
    const processQueue = () => {
        if (notificationQueue.length === 0) {
            isShowing = false;
            return;
        }
        
        isShowing = true;
        const { message, type, duration } = notificationQueue.shift();
        createNotification(message, type, duration);
    };
    
    const createNotification = (message, type, duration) => {
        // Удаляем старые уведомления
        const existingNotifications = document.querySelectorAll('.uv-notification');
        existingNotifications.forEach(notification => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
        
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `uv-notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');
        
        // Добавляем иконку
        let icon = '';
        switch(type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i> ';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i> ';
                break;
            case 'info':
                icon = '<i class="fas fa-info-circle"></i> ';
                break;
        }
        
        notification.innerHTML = `
            <div class="uv-notification-content">
                ${icon}
                <span>${message}</span>
            </div>
            <button class="uv-notification-close" aria-label="Закрыть уведомление">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Стили
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            max-width: 400px;
            word-wrap: break-word;
            backdrop-filter: blur(10px);
            border-left: 4px solid;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
        `;
        
        document.body.appendChild(notification);
        
        // Кнопка закрытия
        const closeBtn = notification.querySelector('.uv-notification-close');
        closeBtn.addEventListener('click', () => {
            closeNotification(notification);
        });
        
        // Автоматическое закрытие
        const autoClose = setTimeout(() => {
            closeNotification(notification);
        }, duration);
        
        // Отмена авто-закрытия при наведении
        notification.addEventListener('mouseenter', () => {
            clearTimeout(autoClose);
        });
        
        notification.addEventListener('mouseleave', () => {
            setTimeout(() => {
                closeNotification(notification);
            }, duration);
        });
    };
    
    const closeNotification = (notification) => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
            processQueue();
        }, 300);
    };
    
    return {
        show
    };
})();

// ======================
// МОДУЛЬ ПРОИЗВОДИТЕЛЬНОСТИ
// ======================
const PerformanceModule = (() => {
    const init = () => {
        setupLazyLoading();
        setupPreload();
        setupResourceHints();
        optimizeAnimations();
        setupServiceWorker();
    };
    
    const setupLazyLoading = () => {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                        }
                        
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });
            
            // Наблюдаем за изображениями с data-src
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
            
            // Наблюдаем за фоновыми изображениями
            document.querySelectorAll('[data-bg]').forEach(element => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.backgroundImage = `url(${entry.target.dataset.bg})`;
                            observer.unobserve(entry.target);
                        }
                    });
                });
                
                observer.observe(element);
            });
        } else {
            // Fallback для старых браузеров
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    };
    
    const setupPreload = () => {
        // Предзагрузка критических ресурсов
        const criticalImages = [
            './img/logo.png',
            './img/Mask Group.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    };
    
    const setupResourceHints = () => {
        // DNS prefetch для внешних ресурсов
        const domains = [
            'https://cdnjs.cloudflare.com',
            'https://i.pinimg.com'
        ];
        
        domains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            document.head.appendChild(link);
        });
    };
    
    const optimizeAnimations = () => {
        // Отключаем анимации для пользователей с настройками доступности
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition', 'none');
            
            // Отключаем CSS анимации
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }
    };
    
    const setupServiceWorker = () => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service Worker уже зарегистрирован в HTML
                console.log('Service Worker готов к работе');
            });
        }
    };
    
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };
    
    const throttle = (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };
    
    return {
        init,
        debounce,
        throttle
    };
})();

// ======================
// МОДУЛЬ АНАЛИТИКИ
// ======================
const AnalyticsModule = (() => {
    const init = () => {
        trackPageViews();
        trackUserInteractions();
        trackPerformance();
    };
    
    const trackPageViews = () => {
        // Отслеживаем просмотры страниц
        console.log('Просмотр страницы:', window.location.pathname);
        
        // Можно интегрировать с Google Analytics или другим сервисом
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                page_path: window.location.pathname,
            });
        }
    };
    
    const trackUserInteractions = () => {
        // Отслеживаем клики по продуктам
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.uv-product-card');
            if (productCard) {
                const productId = productCard.dataset.id;
                console.log('Клик по продукту:', productId);
            }
            
            // Отслеживаем клики по CTA
            const ctaBtn = e.target.closest('.uv-btn');
            if (ctaBtn) {
                console.log('Клик по CTA:', ctaBtn.textContent);
            }
        });
    };
    
    const trackPerformance = () => {
        // Отслеживаем метрики производительности
        window.addEventListener('load', () => {
            setTimeout(() => {
                if ('performance' in window) {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    
                    console.log('Время загрузки страницы:', pageLoadTime + 'мс');
                    
                    // Отправляем метрики
                    if (pageLoadTime > 3000) {
                        console.warn('Медленная загрузка страницы');
                    }
                }
            }, 0);
        });
    };
    
    return {
        init
    };
})();

// ======================
// ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ======================
document.addEventListener('DOMContentLoaded', () => {
    console.log('BOOKVILLE - Инициализация приложения...');
    
    // Удаляем класс no-js
    document.documentElement.classList.remove('no-js');
    
    // Инициализируем модули
    PerformanceModule.init();
    SliderModule.init();
    NavigationModule.init();
    ProductsModule.init();
    FormsModule.init();
    AnalyticsModule.init();
    
    // Глобальная функция для уведомлений
    window.showNotification = NotificationModule.show;
    
    // Глобальные функции для обратной совместимости
    window.changeSlide = SliderModule.changeSlide;
    window.goToSlide = SliderModule.goToSlide;
    window.addToCart = ProductsModule.addToCart;
    
    // Обработка изменения размера окна
    const handleResize = PerformanceModule.debounce(() => {
        // Закрываем мобильное меню при увеличении экрана
        if (window.innerWidth > 1024) {
            NavigationModule.closeMobileMenu();
            NavigationModule.closeDropdown();
        }
        
        // Адаптируем слайдер
        SliderModule.stopAutoplay();
        setTimeout(() => SliderModule.startAutoplay(), 100);
    }, 250);
    
    window.addEventListener('resize', handleResize);
    
    // Обработка клавиши Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            NavigationModule.closeDropdown();
            NavigationModule.closeMobileMenu();
            NavigationModule.closeSearch();
            NavigationModule.closeLanguageDropdown();
        }
    });
    
    // Улучшаем доступность фокуса
    document.addEventListener('click', (e) => {
        // Если клик был сделан мышью, убираем outline
        if (e.detail === 1) {
            document.documentElement.classList.add('using-mouse');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        // Если была нажата клавиша Tab, показываем outline
        if (e.key === 'Tab') {
            document.documentElement.classList.remove('using-mouse');
        }
    });
    
    // Добавляем стили для улучшения фокуса
    const focusStyles = document.createElement('style');
    focusStyles.textContent = `
        .using-mouse :focus {
            outline: none;
        }
        
        :focus:not(.using-mouse *) {
            outline: 2px solid var(--primary-color) !important;
            outline-offset: 2px !important;
        }
    `;
    document.head.appendChild(focusStyles);
    
    console.log('BOOKVILLE - Приложение инициализировано');
});

// Обработка ошибок
window.addEventListener('error', (e) => {
    console.error('Произошла ошибка:', e.error);
    showNotification('Произошла ошибка. Пожалуйста, обновите страницу.', 'error');
});

// Отслеживаем состояние сети
window.addEventListener('online', () => {
    showNotification('Соединение восстановлено', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Отсутствует соединение с интернетом', 'error');
});

// Service Worker сообщения
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'CACHE_UPDATED') {
            showNotification('Доступно обновление приложения. Перезагрузите страницу.', 'info');
        }
    });
}