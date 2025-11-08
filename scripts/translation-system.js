// نظام الترجمة التلقائية الشامل
// Multi-Language Automatic Translation System

class TranslationSystem {
    constructor() {
        this.currentLanguage = 'ar'; // اللغة الافتراضية - العربية
        this.availableLanguages = {
            ar: 'العربية',
            en: 'English',
            es: 'Español',
            fr: 'Français',
            de: 'Deutsch',
            it: 'Italiano',
            pt: 'Português',
            ru: 'Русский',
            zh: '中文',
            ja: '日本語',
            ko: '한국어',
            hi: 'हिन्दी',
            tr: 'Türkçe',
            nl: 'Nederlands',
            sv: 'Svenska',
            no: 'Norsk',
            da: 'Dansk',
            fi: 'Suomi',
            pl: 'Polski',
            cz: 'Čeština',
            hu: 'Magyar',
            ro: 'Română',
            bg: 'Български',
            hr: 'Hrvatski',
            sr: 'Српски',
            th: 'ไทย',
            vi: 'Tiếng Việt',
            id: 'Bahasa Indonesia',
            ms: 'Bahasa Melayu',
            fil: 'Filipino',
            uk: 'Українська',
            be: 'Беларуская',
            el: 'Ελληνικά',
            fa: 'فارسی',
            ur: 'اردو',
            bn: 'বাংলা',
            ta: 'தமிழ்',
            te: 'తెలుగు',
            ml: 'മലയാളം',
            kn: 'ಕನ್ನಡ',
            gu: 'ગુજરાતી',
            pa: 'ਪੰਜਾਬੀ',
            or: 'ଓଡିଆ',
            as: 'অসমীয়া',
            ne: 'नेपाली',
            si: 'සිංහල',
            my: 'မြန်မာ',
            km: 'ខ្មែរ',
            lo: 'ລາວ',
            ka: 'ქართული',
            hy: 'Հայերեն',
            az: 'Azərbaycan',
            kk: 'Қазақ',
            uz: 'Oʻzbek',
            tg: 'Тоҷикӣ',
            mn: 'Монгол',
            bo: 'བོད་སྐད་',
            ug: 'ئۇيغۇرچە',
            am: 'አማርኛ',
            sw: 'Kiswahili',
            yo: 'Yorùbá',
            ig: 'Igbo',
            ha: 'Hausa',
            zu: 'isiZulu',
            af: 'Afrikaans',
            sw: 'Kiswahili',
            ar: 'العربية'
        };
        
        this.translations = this.initializeTranslations();
        this.chatHistory = [];
        this.autoTranslate = true;
        this.translateChatEnabled = true;
        this.currentUserLanguage = navigator.language || 'ar';
        
        // إعدادات الترجمة المتقدمة
        this.translationSettings = {
            quality: 'high', // low, medium, high
            speed: 'fast', // fast, normal, accurate
            context: true, // استخدام السياق للترجمة الأفضل
            culturalAdaptation: true, // تكييف ثقافي للنصوص
            formalLevel: 'auto' // formal, informal, auto
        };
        
        this.loadUserPreferences();
    }

    // تهيئة القاموس الترجمي الشامل
    initializeTranslations() {
        return {
            // ألعاب استراتيجية - Strategy Games
            strategy: {
                ar: 'استراتيجية',
                en: 'Strategy',
                es: 'Estrategia',
                fr: 'Stratégie',
                de: 'Strategie',
                it: 'Strategia',
                pt: 'Estratégia',
                ru: 'Стратегия',
                zh: '策略',
                ja: '戦略',
                ko: '전략',
                hi: 'रणनीति',
                tr: 'Strateji'
            },
            
            // الإمبراطورية التقنية - Tech Empire
            techEmpire: {
                ar: 'الإمبراطورية التقنية',
                en: 'Tech Empire',
                es: 'Imperio Tecnológico',
                fr: 'Empire Technologique',
                de: 'Technisches Imperium',
                it: 'Impero Tecnologico',
                pt: 'Império Tecnológico',
                ru: 'Римская Империя',
                zh: '罗马帝国',
                ja: 'ローマ帝国',
                ko: '로마 제국',
                hi: 'रोमन साम्राज्य',
                tr: 'Roma İmparatorluğu'
            },
            
            // مدينة ثلاثية الأبعاد - 3D City
            city3D: {
                ar: 'مدينة ثلاثية الأبعاد',
                en: '3D City',
                es: 'Ciudad 3D',
                fr: 'Ville 3D',
                de: '3D Stadt',
                it: 'Città 3D',
                pt: 'Cidade 3D',
                ru: '3D Город',
                zh: '3D城市',
                ja: '3D都市',
                ko: '3D 도시',
                hi: '3D शहर',
                tr: '3D Şehir'
            },
            
            // الموارد - Resources
            resources: {
                ar: 'الموارد',
                en: 'Resources',
                es: 'Recursos',
                fr: 'Ressources',
                de: 'Ressourcen',
                it: 'Risorse',
                pt: 'Recursos',
                ru: 'Ресурсы',
                zh: '资源',
                ja: 'リソース',
                ko: '자원',
                hi: 'संसाधन',
                tr: 'Kaynaklar'
            },
            
            // الذهب - Gold
            gold: {
                ar: 'الذهب',
                en: 'Gold',
                es: 'Oro',
                fr: 'Or',
                de: 'Gold',
                it: 'Oro',
                pt: 'Ouro',
                ru: 'Золото',
                zh: '黄金',
                ja: '金',
                ko: '금',
                hi: 'सोना',
                tr: 'Altın'
            },
            
            // الطعام - Food
            food: {
                ar: 'الطعام',
                en: 'Food',
                es: 'Comida',
                fr: 'Nourriture',
                de: 'Essen',
                it: 'Cibo',
                pt: 'Comida',
                ru: 'Еда',
                zh: '食物',
                ja: '食べ物',
                ko: '음식',
                hi: 'भोजन',
                tr: 'Yemek'
            },
            
            // الخشب - Wood
            wood: {
                ar: 'الخشب',
                en: 'Wood',
                es: 'Madera',
                fr: 'Bois',
                de: 'Holz',
                it: 'Legno',
                pt: 'Madeira',
                ru: 'Дерево',
                zh: '木材',
                ja: '木材',
                ko: '나무',
                hi: 'लकड़ी',
                tr: 'Ahşap'
            },
            
            // الحجر - Stone
            stone: {
                ar: 'الحجر',
                en: 'Stone',
                es: 'Piedra',
                fr: 'Pierre',
                de: 'Stein',
                it: 'Pietra',
                pt: 'Pedra',
                ru: 'Камень',
                zh: '石头',
                ja: '石',
                ko: '돌',
                hi: 'पत्थर',
                tr: 'Taş'
            },
            
            // الحديد - Iron
            iron: {
                ar: 'الحديد',
                en: 'Iron',
                es: 'Hierro',
                fr: 'Fer',
                de: 'Eisen',
                it: 'Ferro',
                pt: 'Ferro',
                ru: 'Железо',
                zh: '铁',
                ja: '鉄',
                ko: '철',
                hi: 'लोहा',
                tr: 'Demir'
            },
            
            // الأحجار الكريمة - Gems
            gems: {
                ar: 'الأحجار الكريمة',
                en: 'Gems',
                es: 'Gemas',
                fr: 'Gemmes',
                de: 'Edelsteine',
                it: 'Gemme',
                pt: 'Gemas',
                ru: 'Драгоценные камни',
                zh: '宝石',
                ja: '宝石',
                ko: '보석',
                hi: 'रत्न',
                tr: 'Mücevher'
            },
            
            // البناء - Building
            building: {
                ar: 'البناء',
                en: 'Building',
                es: 'Construcción',
                fr: 'Construction',
                de: 'Gebäude',
                it: 'Costruzione',
                pt: 'Construção',
                ru: 'Здание',
                zh: '建筑',
                ja: '建築',
                ko: '건물',
                hi: 'भवन',
                tr: 'İnşaat'
            },
            
            // المستوى - Level
            level: {
                ar: 'المستوى',
                en: 'Level',
                es: 'Nivel',
                fr: 'Niveau',
                de: 'Level',
                it: 'Livello',
                pt: 'Nível',
                ru: 'Уровень',
                zh: '等级',
                ja: 'レベル',
                ko: '레벨',
                hi: 'स्तर',
                tr: 'Seviye'
            },
            
            // الدردشة - Chat
            chat: {
                ar: 'الدردشة',
                en: 'Chat',
                es: 'Chat',
                fr: 'Chat',
                de: 'Chat',
                it: 'Chat',
                pt: 'Chat',
                ru: 'Чат',
                zh: '聊天',
                ja: 'チャット',
                ko: '채팅',
                hi: 'चैट',
                tr: 'Sohbet'
            },
            
            // الترجمة - Translation
            translate: {
                ar: 'ترجمة',
                en: 'Translate',
                es: 'Traducir',
                fr: 'Traduire',
                de: 'Übersetzen',
                it: 'Tradurre',
                pt: 'Traduzir',
                ru: 'Перевести',
                zh: '翻译',
                ja: '翻訳',
                ko: '번역',
                hi: 'अनुवाद',
                tr: 'Çevir'
            },
            
            // اللغة - Language
            language: {
                ar: 'اللغة',
                en: 'Language',
                es: 'Idioma',
                fr: 'Langue',
                de: 'Sprache',
                it: 'Lingua',
                pt: 'Idioma',
                ru: 'Язык',
                zh: '语言',
                ja: '言語',
                ko: '언어',
                hi: 'भाषा',
                tr: 'Dil'
            },
            
            // التشغيل - Play
            play: {
                ar: 'لعب',
                en: 'Play',
                es: 'Jugar',
                fr: 'Jouer',
                de: 'Spielen',
                it: 'Giocare',
                pt: 'Jogar',
                ru: 'Играть',
                zh: '游戏',
                ja: 'プレイ',
                ko: '플레이',
                hi: 'खेलें',
                tr: 'Oyna'
            },
            
            // إعدادات - Settings
            settings: {
                ar: 'الإعدادات',
                en: 'Settings',
                es: 'Configuración',
                fr: 'Paramètres',
                de: 'Einstellungen',
                it: 'Impostazioni',
                pt: 'Configurações',
                ru: 'Настройки',
                zh: '设置',
                ja: '設定',
                ko: '설정',
                hi: 'सेटिंग्स',
                tr: 'Ayarlar'
            },
            
            // حفظ - Save
            save: {
                ar: 'حفظ',
                en: 'Save',
                es: 'Guardar',
                fr: 'Sauvegarder',
                de: 'Speichern',
                it: 'Salva',
                pt: 'Salvar',
                ru: 'Сохранить',
                zh: '保存',
                ja: '保存',
                ko: '저장',
                hi: 'सहेजें',
                tr: 'Kaydet'
            },
            
            // تحميل - Load
            load: {
                ar: 'تحميل',
                en: 'Load',
                es: 'Cargar',
                fr: 'Charger',
                de: 'Laden',
                it: 'Carica',
                pt: 'Carregar',
                ru: 'Загрузить',
                zh: '加载',
                ja: '読み込み',
                ko: '로드',
                hi: 'लोड करें',
                tr: 'Yükle'
            }
        };
    }

    // ترجمة نص إلى اللغة المحددة
    translateText(text, targetLanguage = null) {
        if (!text) return '';
        
        targetLanguage = targetLanguage || this.currentLanguage;
        
        // البحث في القاموس المحدد مسبقاً
        for (const [key, translations] of Object.entries(this.translations)) {
            if (translations[targetLanguage] && text.toLowerCase().includes(key.toLowerCase())) {
                return translations[targetLanguage];
            }
        }
        
        // استخدام الترجمة التلقائية (Google Translate API أو ترجمة محلية)
        return this.autoTranslate ? this.performAutoTranslation(text, targetLanguage) : text;
    }

    // تنفيذ الترجمة التلقائية
    async performAutoTranslation(text, targetLanguage) {
        // محاكاة ترجمة تلقائية (في التطبيق الحقيقي، ستستخدم Google Translate API)
        try {
            // هنا يمكن استخدام Google Translate API أو خدمة ترجمة أخرى
            const response = await fetch('https://translate.googleapis.com/translate_a/single', {
                method: 'GET',
                params: {
                    client: 'gtx',
                    sl: 'auto',
                    tl: targetLanguage,
                    dt: 't',
                    q: encodeURIComponent(text)
                }
            });
            
            const result = await response.json();
            return result[0][0][0] || text;
        } catch (error) {
            console.warn('Translation failed:', error);
            return text; // إرجاع النص الأصلي في حالة الخطأ
        }
    }

    // تغيير اللغة
    setLanguage(languageCode) {
        if (this.availableLanguages[languageCode]) {
            this.currentLanguage = languageCode;
            this.saveUserPreferences();
            this.updateUI();
        }
    }

    // الحصول على النص المترجم
    t(key, params = {}) {
        let text = this.translations[key]?.[this.currentLanguage] || key;
        
        // استبدال المعاملات
        Object.entries(params).forEach(([param, value]) => {
            text = text.replace(new RegExp(`{${param}}`, 'g'), value);
        });
        
        return text;
    }

    // إضافة رسالة دردشة
    addChatMessage(user, message, originalLanguage = null) {
        const messageData = {
            id: Date.now(),
            user: user,
            message: message,
            originalLanguage: originalLanguage || navigator.language,
            timestamp: new Date(),
            translatedMessage: null
        };

        // ترجمة تلقائية إذا كانت مفعّلة
        if (this.autoTranslate && messageData.originalLanguage !== this.currentLanguage) {
            this.translateChatMessage(messageData);
        }

        this.chatHistory.push(messageData);
        this.saveChatHistory();
        
        return messageData;
    }

    // ترجمة رسالة دردشة
    async translateChatMessage(messageData) {
        if (messageData.originalLanguage === this.currentLanguage) {
            messageData.translatedMessage = messageData.message;
            return;
        }

        try {
            messageData.translatedMessage = await this.translateText(messageData.message, this.currentLanguage);
        } catch (error) {
            messageData.translatedMessage = messageData.message; // النص الأصلي في حالة الخطأ
        }
    }

    // تحديث واجهة المستخدم
    updateUI() {
        // تحديث جميع النصوص في الصفحة
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            const translated = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translated;
            } else {
                element.textContent = translated;
            }
        });

        // تحديث قائمة اللغات
        this.updateLanguageSelector();
    }

    // إنشاء أداة اختيار اللغة
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <select id="languageSelect" class="language-dropdown">
                ${Object.entries(this.availableLanguages).map(([code, name]) => 
                    `<option value="${code}" ${code === this.currentLanguage ? 'selected' : ''}>
                        ${name}
                    </option>`
                ).join('')}
            </select>
            <button id="translateToggle" class="translate-toggle">
                ${this.autoTranslate ? this.t('translate') + ' 🔄' : this.t('translate')}
            </button>
        `;
        
        return selector;
    }

    // تحديث أداة اختيار اللغة
    updateLanguageSelector() {
        const select = document.getElementById('languageSelect');
        if (select) {
            select.value = this.currentLanguage;
        }
        
        const toggle = document.getElementById('translateToggle');
        if (toggle) {
            toggle.innerHTML = this.autoTranslate ? 
                this.t('translate') + ' 🔄' : this.t('translate');
        }
    }

    // تهيئة نظام الدردشة مع الترجمة
    initializeChatSystem() {
        const chatContainer = document.createElement('div');
        chatContainer.className = 'multi-language-chat';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <h3>${this.t('chat')}</h3>
                <div class="chat-controls">
                    <button id="autoTranslateToggle" class="auto-translate-btn">
                        ${this.autoTranslate ? '🔄 ON' : 'OFF'}
                    </button>
                </div>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-container">
                <input type="text" id="chatInput" placeholder="${this.t('chat')}..." />
                <button id="sendMessage">${this.t('translate')}</button>
            </div>
        `;

        // إضافة معالجات الأحداث
        this.setupChatEventListeners(chatContainer);
        
        return chatContainer;
    }

    // إعداد مستمعي الأحداث للدردشة
    setupChatEventListeners(chatContainer) {
        const input = chatContainer.querySelector('#chatInput');
        const sendButton = chatContainer.querySelector('#sendMessage');
        const autoTranslateBtn = chatContainer.querySelector('#autoTranslateToggle');
        
        sendButton.addEventListener('click', () => this.sendChatMessage(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage(input.value);
        });
        
        autoTranslateBtn.addEventListener('click', () => {
            this.autoTranslate = !this.autoTranslate;
            this.saveUserPreferences();
            this.updateChatDisplay();
            autoTranslateBtn.innerHTML = this.autoTranslate ? '🔄 ON' : 'OFF';
        });
    }

    // إرسال رسالة دردشة
    sendChatMessage(message) {
        if (!message.trim()) return;
        
        const user = 'Player_' + Math.floor(Math.random() * 1000);
        const messageData = this.addChatMessage(user, message);
        
        this.displayChatMessage(messageData);
        
        // مسح الإدخال
        const input = document.getElementById('chatInput');
        if (input) input.value = '';
    }

    // عرض رسالة دردشة
    displayChatMessage(messageData) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';
        messageElement.innerHTML = `
            <div class="message-header">
                <span class="user-name">${messageData.user}</span>
                <span class="message-time">${messageData.timestamp.toLocaleTimeString()}</span>
            </div>
            <div class="message-content">
                ${messageData.translatedMessage || messageData.message}
            </div>
            ${messageData.translatedMessage && messageData.translatedMessage !== messageData.message ? 
                `<div class="original-message">
                    <small>الأصلية: ${messageData.message}</small>
                </div>` : ''}
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // تحديث عرض الدردشة
    updateChatDisplay() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        this.chatHistory.forEach(messageData => {
            this.displayChatMessage(messageData);
        });
    }

    // حفظ تفضيلات المستخدم
    saveUserPreferences() {
        localStorage.setItem('translation_preferences', JSON.stringify({
            language: this.currentLanguage,
            autoTranslate: this.autoTranslate,
            settings: this.translationSettings
        }));
    }

    // تحميل تفضيلات المستخدم
    loadUserPreferences() {
        const saved = localStorage.getItem('translation_preferences');
        if (saved) {
            try {
                const preferences = JSON.parse(saved);
                this.currentLanguage = preferences.language || 'ar';
                this.autoTranslate = preferences.autoTranslate !== false;
                this.translationSettings = { ...this.translationSettings, ...preferences.settings };
            } catch (error) {
                console.warn('Failed to load translation preferences:', error);
            }
        }
    }

    // حفظ تاريخ الدردشة
    saveChatHistory() {
        try {
            localStorage.setItem('chat_history', JSON.stringify(this.chatHistory));
        } catch (error) {
            console.warn('Failed to save chat history:', error);
        }
    }

    // تحميل تاريخ الدردشة
    loadChatHistory() {
        try {
            const saved = localStorage.getItem('chat_history');
            if (saved) {
                this.chatHistory = JSON.parse(saved).map(message => ({
                    ...message,
                    timestamp: new Date(message.timestamp)
                }));
            }
        } catch (error) {
            console.warn('Failed to load chat history:', error);
        }
    }

    // الحصول على إحصائيات اللغات
    getLanguageStats() {
        const stats = {};
        this.chatHistory.forEach(message => {
            const lang = message.originalLanguage;
            stats[lang] = (stats[lang] || 0) + 1;
        });
        return stats;
    }

    // تصدير الترجمة
    exportTranslations() {
        const exportData = {
            translations: this.translations,
            preferences: {
                language: this.currentLanguage,
                autoTranslate: this.autoTranslate,
                settings: this.translationSettings
            },
            chatHistory: this.chatHistory
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    // استيراد الترجمة
    importTranslations(importData) {
        try {
            const data = typeof importData === 'string' ? JSON.parse(importData) : importData;
            
            if (data.translations) {
                this.translations = { ...this.translations, ...data.translations };
            }
            
            if (data.preferences) {
                this.currentLanguage = data.preferences.language || 'ar';
                this.autoTranslate = data.preferences.autoTranslate !== false;
                this.translationSettings = { ...this.translationSettings, ...data.preferences.settings };
            }
            
            if (data.chatHistory) {
                this.chatHistory = data.chatHistory.map(message => ({
                    ...message,
                    timestamp: new Date(message.timestamp)
                }));
            }
            
            this.saveUserPreferences();
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Failed to import translations:', error);
            return false;
        }
    }
}

// إنشاء مثيل عام لنظام الترجمة
window.translationSystem = new TranslationSystem();

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحميل تفضيلات المستخدم
    window.translationSystem.loadUserPreferences();
    window.translationSystem.loadChatHistory();
    
    // إنشاء واجهة الترجمة إذا لم تكن موجودة
    if (!document.getElementById('languageSelector')) {
        const selector = window.translationSystem.createLanguageSelector();
        selector.id = 'languageSelector';
        document.body.appendChild(selector);
        
        // إعداد مستمعي الأحداث
        document.getElementById('languageSelect').addEventListener('change', (e) => {
            window.translationSystem.setLanguage(e.target.value);
        });
    }
    
    // تحديث واجهة المستخدم
    window.translationSystem.updateUI();
});