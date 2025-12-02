document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#ctaForm');
    const nameInput = document.querySelector('#ctaName');
    const phoneInput = document.querySelector('#ctaPhone');

    if (!form) return; // защита, если формы нет

    // Небольшая маска для телефона (красиво и не ломает ввод)
    phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value
            .replace(/[^\d+()\-\s]/g, '')
            .replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2-$3-$4');
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();

        // Валидация
        if (!name || !phone) {
            return showMessage('Пожалуйста, заполните все поля.', 'error');
        }

        if (phone.length < 6) {
            return showMessage('Номер телефона указан некорректно.', 'error');
        }

        try {
            // ⚠ Здесь будет запрос на сервер или Supabase
            // пример:
            // await fetch('/api/send', { method: 'POST', body: JSON.stringify({ name, phone }) })

            showMessage(`Спасибо, ${name}! Мы свяжемся с вами по номеру: ${phone}`, 'success');
            form.reset();

        } catch (err) {
            showMessage('Ошибка отправки. Попробуйте позже.', 'error');
        }
    });
});

/**
 * Показывает аккуратное сообщение под формой
 */
function showMessage(text, type = 'info') {
    let box = document.querySelector('.cta-message');

    if (!box) {
        box = document.createElement('div');
        box.className = 'cta-message';
        document.querySelector('.cta-section .container').appendChild(box);
    }

    box.textContent = text;
    box.className = `cta-message ${type}`;

    setTimeout(() => box.remove(), 5000);
}



document.addEventListener("DOMContentLoaded", () => {

    /* ============================
       Config
    ============================ */

    const POSTS_PER_PAGE = 6;
    let currentPage = 1;

    // Фейковые данные (ты легко заменишь на fetch с Supabase)
    const blogData = Array.from({ length: 30 }).map((_, i) => ({
        id: i + 1,
        title: "Lorem ipsum dolor sit amet",
        date: "15.09.2020",
        image: `https://via.placeholder.com/350x250?text=Post+${i + 1}`
    }));


    /* ============================
       DOM Elements
    ============================ */

    const blogGrid = document.querySelector(".blog-grid");
    const nextBtn = document.querySelector(".next-page-btn");


    /* ============================
       Render
    ============================ */

    function renderPosts() {
        blogGrid.innerHTML = "";

        const start = (currentPage - 1) * POSTS_PER_PAGE;
        const end = start + POSTS_PER_PAGE;

        const posts = blogData.slice(start, end);

        posts.forEach(post => {
            blogGrid.innerHTML += `
                <div class="blog-item" data-id="${post.id}">
                    <div class="blog-image">
                        <img src="${post.image}">
                    </div>
                    <p class="blog-excerpt">${post.title}</p>
                    <span class="blog-date">${post.date}</span>
                </div>
            `;
        });

        if (end >= blogData.length) {
            nextBtn.style.display = "none";
        }
    }


    /* ============================
       Event Listeners
    ============================ */

    nextBtn.addEventListener("click", () => {
        currentPage++;
        renderPosts();
    });

    blogGrid.addEventListener("click", (e) => {
        const post = e.target.closest(".blog-item");
        if (!post) return;

        const id = post.dataset.id;
        console.log("Открываем статью ID:", id);

        // Здесь ты сделаешь переход на страницу статьи
        // window.location.href = `/blog/post.html?id=${id}`;
    });


    /* ============================
       Init
    ============================ */

    renderPosts();
});








document.addEventListener('DOMContentLoaded', () => {
    // Получаем все иконки с классом favorite-toggle
    const favoriteToggles = document.querySelectorAll('.favorite-toggle');

    favoriteToggles.forEach(icon => {
        icon.addEventListener('click', (event) => {
            // Предотвращаем стандартное действие (если бы это была ссылка)
            event.preventDefault();
            
            // Проверяем, имеет ли иконка класс 'far' (outline - пустое сердечко)
            if (icon.classList.contains('far')) {
                // Если пустое, делаем его закрашенным ('fas' - solid)
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                // Если закрашенное, делаем его пустым
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const subscriptionForm = document.querySelector('.subscription-form');

    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Предотвращаем стандартную отправку формы
            
            // Здесь должна быть логика отправки данных на сервер
            
            alert('Спасибо за подписку! Мы свяжемся с вами в ближайшее время.');

            // Очищаем поля формы после "отправки"
            subscriptionForm.reset(); 
        });
    }
});




document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация слайдера (функционал не реализован, только заглушка)
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        // Здесь будет код для переключения слайдов, если он нужен
        console.log('Слайдер загружен. Для работы добавьте JS-логику переключения.');
    }
    
    // 2. Обработка формы подписки
    const signupButton = document.querySelector('.signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', (event) => {
            event.preventDefault();
            const emailInput = document.querySelector('.newsletter-signup input[type="email"]');
            if (emailInput && emailInput.value) {
                alert(`Спасибо за подписку на рассылку: ${emailInput.value}`);
                emailInput.value = '';
            } else {
                alert('Пожалуйста, введите ваш E-mail.');
            }
        });
    }

    // 3. Обработка формы обратной связи (CTA)
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (event) => {
            event.preventDefault();
            const nameInput = document.querySelector('.cta-content input[placeholder="Ваше имя"]');
            const phoneInput = document.querySelector('.cta-content input[placeholder="Телефон"]');
            
            if (nameInput.value && phoneInput.value) {
                alert(`Запрос на подбор отправлен! Имя: ${nameInput.value}, Телефон: ${phoneInput.value}`);
                nameInput.value = '';
                phoneInput.value = '';
            } else {
                alert('Пожалуйста, заполните все поля.');
            }
        });
    }

    // 4. (Опционально) Инициализация карточек товаров
    // Если нужно добавить hover-эффекты или логику избранного/корзины
});



document.addEventListener('DOMContentLoaded', () => {

    // 1. Слайдер
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        console.log('Слайдер загружен. Добавьте JS-логику.');
    }

    // 2. Подписка
    const signupButton = document.querySelector('.signup-button');
    if (signupButton) {
        signupButton.addEventListener('click', (event) => {
            event.preventDefault();
            const emailInput = document.querySelector('.newsletter-signup input[type="email"]');
            
            if (emailInput && emailInput.value) {
                alert(`Спасибо за подписку: ${emailInput.value}`);
                emailInput.value = '';
            } else {
                alert('Введите E-mail.');
            }
        });
    }

    // 3. CTA форма
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (event) => {
            event.preventDefault();
            const nameInput = document.querySelector('.cta-content input[placeholder="Ваше имя"]');
            const phoneInput = document.querySelector('.cta-content input[placeholder="Телефон"]');
            
            if (nameInput.value && phoneInput.value) {
                alert(`Отправлено! Имя: ${nameInput.value}, Телефон: ${phoneInput.value}`);
                nameInput.value = '';
                phoneInput.value = '';
            } else {
                alert('Пожалуйста, заполните все поля.');
            }
        });
    }
});




function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function(event) {
  if (!event.target.matches('.dropbtn') && !event.target.closest('.dropbtn')) {
    document.querySelectorAll(".dropdown-content").forEach(dropdown => {
      dropdown.classList.remove("show");
    });
  }
}

