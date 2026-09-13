// language-switcher.js — сохранение языка между страницами (с принудительным применением), гибридный переключатель языков (URL param + localStorage)
(function() {
    // Функция получения параметра из URL
    function getUrlParameter(name) {
        var urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Функция установки языка (меняет radio и вызывает change)
    function setLanguage(lang) {
        var radioIt = document.getElementById('lang-it');
        var radioEn = document.getElementById('lang-en');
        
        if (!radioIt || !radioEn) return false;
        
        if (lang === 'en' && !radioEn.checked) {
            radioEn.checked = true;
            // Принудительно вызываем change для применения CSS
            radioEn.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        } else if (lang === 'it' && !radioIt.checked) {
            radioIt.checked = true;
            radioIt.dispatchEvent(new Event('change', { bubbles: true }));
            return true;
        }
        return false;
    }

    // Основная функция выбора языка
    function applyLanguage() {
        // 1. Проверяем параметр URL (высший приоритет)
        var urlLang = getUrlParameter('lang');
        if (urlLang === 'en' || urlLang === 'it') {
            // Сохраняем в localStorage для синхронизации
            localStorage.setItem('selectedLanguage', urlLang);
            setLanguage(urlLang);
            return;
        }
        
        // 2. Проверяем localStorage
        var savedLang = localStorage.getItem('selectedLanguage');
        if (savedLang === 'en' || savedLang === 'it') {
            setLanguage(savedLang);
            return;
        }
        
        // 3. По умолчанию — итальянский
        setLanguage('it');
    }

    // Обработчики для ручного переключения (сохраняем в localStorage)
    function bindSaveHandlers() {
        var radioIt = document.getElementById('lang-it');
        var radioEn = document.getElementById('lang-en');
        
        if (!radioIt || !radioEn) return false;
        
        radioIt.addEventListener('change', function() {
            if (radioIt.checked) {
                localStorage.setItem('selectedLanguage', 'it');
            }
        });
        
        radioEn.addEventListener('change', function() {
            if (radioEn.checked) {
                localStorage.setItem('selectedLanguage', 'en');
            }
        });
        
        return true;
    }

    // Ждём появления радиокнопок в DOM
    function init() {
        if (document.getElementById('lang-it') && document.getElementById('lang-en')) {
            applyLanguage();
            bindSaveHandlers();
        } else {
            setTimeout(init, 20);
        }
    }
    
    init();
})();
(function() {
    function applySavedLanguage() {
        var radioIt = document.getElementById('lang-it');
        var radioEn = document.getElementById('lang-en');
        
        if (!radioIt || !radioEn) return;
        
        var savedLang = localStorage.getItem('selectedLanguage');
        var shouldChange = false;
        
        if (savedLang === 'en' && !radioEn.checked) {
            radioEn.checked = true;
            shouldChange = true;
        } else if (savedLang === 'it' && !radioIt.checked) {
            radioIt.checked = true;
            shouldChange = true;
        }
        
        // Принудительно вызываем событие change, чтобы CSS переключился
        if (shouldChange) {
            var event = new Event('change', { bubbles: true });
            if (savedLang === 'en') radioEn.dispatchEvent(event);
            else radioIt.dispatchEvent(event);
        }
        
        // Сохраняем язык при ручном переключении
        function saveLanguage() {
            if (radioIt.checked) {
                localStorage.setItem('selectedLanguage', 'it');
            } else if (radioEn.checked) {
                localStorage.setItem('selectedLanguage', 'en');
            }
        }
        
        radioIt.addEventListener('change', saveLanguage);
        radioEn.addEventListener('change', saveLanguage);
    }
    
    // Обычная загрузка
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applySavedLanguage);
    } else {
        applySavedLanguage();
    }
    
    // Некоторые браузеры кешируют страницы и не перезапускают скрипты при навигации назад/вперёд,
    // но Fancybox может вести себя аналогично. Добавим обработку pageshow.
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            applySavedLanguage();
        }
    });
    
    // Дополнительно: если iframe загружается через Fancybox с задержкой, 
    // иногда DOMContentLoaded срабатывает раньше, чем элементы появятся.
    // Проверим ещё раз через небольшую задержку (опционально, может помочь)
    setTimeout(applySavedLanguage, 50);
})();