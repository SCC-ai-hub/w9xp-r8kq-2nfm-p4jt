// fancybox-override.js - настройки Fancybox для iframe

// Переменные для отступов (меняй здесь)
// Все значения в относительных единицах (vw, vh, %)
const FANCYBOX_MARGIN = {
    top: '10vh',      // отступ сверху
    bottom: '10vh',   // отступ снизу
    left: '10vw',    // отступ слева
    right: '10vw'    // отступ справа
};

Fancybox.defaults.hideScrollbar = false;

// Функция для применения кастомных настроек
function initFancyboxIframe() {
    if (typeof Fancybox !== 'undefined') {
					Fancybox.defaults.idle = false;
        // Применяем CSS-переменные для отступов
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --fancybox-margin-top: ${FANCYBOX_MARGIN.top};
                --fancybox-margin-bottom: ${FANCYBOX_MARGIN.bottom};
                --fancybox-margin-left: ${FANCYBOX_MARGIN.left};
                --fancybox-margin-right: ${FANCYBOX_MARGIN.right};
            }
        `;
        document.head.appendChild(style);
        
        // Основные настройки
        Fancybox.defaults.iframeAttr = {
            allow: 'autoplay; fullscreen',
            scrolling: 'auto',
            frameborder: '0'

        };
        
        Fancybox.defaults.Html = {
            defaultDisplay: 'block'
        };
    }
}

// Ждём загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    initFancyboxIframe();
});

// Инициализация для динамически создаваемых ссылок
if (typeof Fancybox !== 'undefined') {
    initFancyboxIframe();
}

