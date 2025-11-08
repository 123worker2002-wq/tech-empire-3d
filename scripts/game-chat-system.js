// نظام الدردشة المتقدم للإمبراطورية التقنية
// Advanced Chat System for Tech Empire 3D Game

class GameChatSystem {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.maxMessages = 100;
        this.currentChannel = 'general';
        this.channels = {
            general: { name: 'عام', color: '#4CAF50' },
            alliance: { name: 'التحالف', color: '#2196F3' },
            kingdom: { name: 'المملكة', color: '#FF9800' },
            trade: { name: 'تجارة', color: '#9C27B0' },
            war: { name: 'حرب', color: '#F44336' },
            system: { name: 'النظام', color: '#607D8B' }
        };
        
        this.messageTypes = {
            NORMAL: 'normal',
            SYSTEM: 'system',
            ALERT: 'alert',
            REWARD: 'reward',
            BUILDING: 'building',
            BATTLE: 'battle'
        };
        
        this.init();
    }

    init() {
        this.createChatUI();
        this.setupEventListeners();
        this.loadChatHistory();
    }

    createChatUI() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'gameChat';
        chatContainer.className = 'game-chat-container';
        chatContainer.innerHTML = `
            <div class="chat-header">
                <div class="chat-title">
                    <span class="chat-icon">💬</span>
                    <span class="chat-title-text">${window.translationSystem.t('chat')}</span>
                </div>
                <div class="chat-controls">
                    <button class="chat-toggle-btn" id="chatToggle">
                        <span class="arrow">▼</span>
                    </button>
                    <button class="chat-settings-btn" id="chatSettings">
                        ⚙️
                    </button>
                </div>
            </div>
            
            <div class="chat-body" id="chatBody" style="display: none;">
                <div class="chat-channels">
                    <div class="channel-tabs">
                        ${Object.entries(this.channels).map(([key, channel]) => `
                            <button class="channel-tab ${key === this.currentChannel ? 'active' : ''}" 
                                    data-channel="${key}" style="--channel-color: ${channel.color}">
                                ${channel.name}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chat-messages-container">
                    <div class="chat-messages" id="chatMessages"></div>
                    
                    <div class="chat-input-section">
                        <div class="chat-commands">
                            <button class="command-btn" data-command="help">❓</button>
                            <button class="command-btn" data-command="translate">🔄</button>
                            <button class="command-btn" data-command="stats">📊</button>
                        </div>
                        
                        <div class="chat-input-container">
                            <input type="text" id="chatInput" 
                                   placeholder="${window.translationSystem.t('chat')}..." 
                                   maxlength="200">
                            <button id="sendChatMessage" class="send-btn">📤</button>
                        </div>
                    </div>
                </div>
                
                <div class="chat-translation-panel" id="translationPanel" style="display: none;">
                    <div class="translation-header">
                        <h4>🌐 إعدادات الترجمة</h4>
                        <button class="close-panel" id="closeTranslationPanel">×</button>
                    </div>
                    
                    <div class="translation-settings">
                        <div class="setting-group">
                            <label>اللغة الحالية:</label>
                            <select id="currentLanguage">
                                ${Object.entries(window.translationSystem.availableLanguages).map(([code, name]) => 
                                    `<option value="${code}" ${code === window.translationSystem.currentLanguage ? 'selected' : ''}>
                                        ${name}
                                    </option>`
                                ).join('')}
                            </select>
                        </div>
                        
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="autoTranslateChat" 
                                       ${window.translationSystem.autoTranslate ? 'checked' : ''}>
                                ترجمة تلقائية للدردشة
                            </label>
                        </div>
                        
                        <div class="setting-group">
                            <label>
                                <input type="checkbox" id="showOriginal" checked>
                                إظهار النص الأصلي
                            </label>
                        </div>
                        
                        <div class="language-stats">
                            <h5>إحصائيات اللغات:</h5>
                            <div id="languageStats"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-footer">
                <div class="chat-info">
                    <span class="online-users" id="onlineUsers">0</span> متصل
                </div>
                <div class="chat-status" id="chatStatus">متصل</div>
            </div>
        `;

        document.body.appendChild(chatContainer);
        this.container = chatContainer;
        this.body = chatContainer.querySelector('#chatBody');
        this.messagesContainer = chatContainer.querySelector('#chatMessages');
    }

    setupEventListeners() {
        // تبديل حالة فتح/إغلاق الدردشة
        document.getElementById('chatToggle').addEventListener('click', () => {
            this.toggleChat();
        });

        // فتح إعدادات الترجمة
        document.getElementById('chatSettings').addEventListener('click', () => {
            this.openTranslationSettings();
        });

        // إغلاق لوحة الترجمة
        document.getElementById('closeTranslationPanel').addEventListener('click', () => {
            this.closeTranslationSettings();
        });

        // تغيير القناة
        document.querySelectorAll('.channel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchChannel(e.target.dataset.channel);
            });
        });

        // إرسال رسالة
        document.getElementById('sendChatMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // أوامر سريعة
        document.querySelectorAll('.command-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.executeCommand(e.target.dataset.command);
            });
        });

        // إعدادات الترجمة
        document.getElementById('currentLanguage').addEventListener('change', (e) => {
            window.translationSystem.setLanguage(e.target.value);
            this.updateChatTranslation();
        });

        document.getElementById('autoTranslateChat').addEventListener('change', (e) => {
            window.translationSystem.autoTranslate = e.target.checked;
            window.translationSystem.saveUserPreferences();
            this.updateChatTranslation();
        });

        document.getElementById('showOriginal').addEventListener('change', (e) => {
            this.showOriginalMessages = e.target.checked;
            this.updateChatDisplay();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatBody = this.body;
        const toggleBtn = document.getElementById('chatToggle');
        const arrow = toggleBtn.querySelector('.arrow');
        
        if (this.isOpen) {
            chatBody.style.display = 'block';
            arrow.textContent = '▲';
            this.addSystemMessage('تم فتح الدردشة', this.messageTypes.SYSTEM);
        } else {
            chatBody.style.display = 'none';
            arrow.textContent = '▼';
        }
        
        this.updateChatDisplay();
    }

    openTranslationSettings() {
        const panel = document.getElementById('translationPanel');
        panel.style.display = 'block';
        this.updateLanguageStats();
    }

    closeTranslationSettings() {
        const panel = document.getElementById('translationPanel');
        panel.style.display = 'none';
    }

    switchChannel(channel) {
        if (this.channels[channel]) {
            this.currentChannel = channel;
            
            // تحديث التبويبات
            document.querySelectorAll('.channel-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.dataset.channel === channel) {
                    tab.classList.add('active');
                }
            });
            
            this.updateChatDisplay();
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // معالجة الأوامر
        if (message.startsWith('/')) {
            this.executeCommand(message.substring(1));
            input.value = '';
            return;
        }
        
        const messageData = {
            id: Date.now(),
            type: this.messageTypes.NORMAL,
            channel: this.currentChannel,
            user: this.game.playerName || 'لاعب',
            message: message,
            timestamp: new Date(),
            language: window.translationSystem.currentLanguage
        };
        
        // ترجمة الرسالة
        if (window.translationSystem.autoTranslate) {
            messageData.translatedMessage = await window.translationSystem.translateText(message);
        }
        
        this.addMessage(messageData);
        this.saveMessage(messageData);
        
        // مسح الإدخال
        input.value = '';
    }

    addMessage(messageData) {
        const messageElement = this.createMessageElement(messageData);
        this.messagesContainer.appendChild(messageElement);
        
        // الحفاظ على الحد الأقصى للرسائل
        while (this.messagesContainer.children.length > this.maxMessages) {
            this.messagesContainer.removeChild(this.messagesContainer.firstChild);
        }
        
        // التمرير إلى الأسفل
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // تشغيل صوت للإشعارات (إذا كانت مفعّلة)
        this.playNotificationSound(messageData);
    }

    createMessageElement(messageData) {
        const messageEl = document.createElement('div');
        messageEl.className = `chat-message message-${messageData.type} channel-${messageData.channel}`;
        
        const channelColor = this.channels[messageData.channel]?.color || '#4CAF50';
        const timeString = messageData.timestamp.toLocaleTimeString();
        
        // تحسين عرض الرسائل المنظمة
        const originalMessage = this.escapeHtml(messageData.message);
        const translatedMessage = this.escapeHtml(messageData.translatedMessage || messageData.message);
        const hasTranslation = messageData.translatedMessage && this.showOriginalMessages;
        
        messageEl.innerHTML = `
            <div class="message-header">
                <div class="message-user" style="color: ${channelColor}">
                    ${originalMessage.startsWith('[') ? '[نظام] ' : ''}${this.escapeHtml(messageData.user)}
                </div>
                <div class="message-time">${timeString}</div>
                <div class="message-language" title="اللغة الأصلية">
                    ${this.getLanguageFlag(messageData.language)}
                </div>
            </div>
            
            <div class="message-content">
                <div class="message-text">
                    ${translatedMessage}
                </div>
                ${hasTranslation ? 
                    `<div class="message-original">
                        <strong>الأصلية (${this.getLanguageName(messageData.language)}):</strong><br>
                        ${originalMessage}
                    </div>` : ''}
            </div>
            
            <div class="message-actions">
                <button class="message-action translate-action" data-message-id="${messageData.id}">
                    🔄 ترجمة
                </button>
                <button class="message-action reply-action" data-message-id="${messageData.id}">
                    ↩️ رد
                </button>
            </div>
        `;
        
        // إضافة مستمعي الأحداث للإجراءات
        const translateBtn = messageEl.querySelector('.translate-action');
        const replyBtn = messageEl.querySelector('.reply-action');
        
        translateBtn.addEventListener('click', () => {
            this.translateMessage(messageData);
        });
        
        replyBtn.addEventListener('click', () => {
            this.replyToMessage(messageData);
        });
        
        return messageEl;
    }

    addSystemMessage(text, type = 'system') {
        const messageData = {
            id: Date.now(),
            type: type,
            channel: 'system',
            user: 'النظام',
            message: text,
            timestamp: new Date(),
            language: window.translationSystem.currentLanguage
        };
        
        this.addMessage(messageData);
    }

    addBuildingMessage(building, action) {
        const messageData = {
            id: Date.now(),
            type: this.messageTypes.BUILDING,
            channel: this.currentChannel,
            user: 'النظام',
            message: `تم ${action} مبنى ${building.name} (مستوى ${building.level})`,
            timestamp: new Date(),
            language: window.translationSystem.currentLanguage
        };
        
        this.addMessage(messageData);
    }

    addBattleMessage(battleInfo) {
        const messageData = {
            id: Date.now(),
            type: this.messageTypes.BATTLE,
            channel: 'war',
            user: 'النظام',
            message: battleInfo.message,
            timestamp: new Date(),
            language: window.translationSystem.currentLanguage
        };
        
        this.addMessage(messageData);
    }

    addRewardMessage(reward) {
        const messageData = {
            id: Date.now(),
            type: this.messageTypes.REWARD,
            channel: 'general',
            user: 'النظام',
            message: `🎉 تم الحصول على ${reward.amount} ${reward.type}!`,
            timestamp: new Date(),
            language: window.translationSystem.currentLanguage
        };
        
        this.addMessage(messageData);
    }

    executeCommand(command) {
        const [cmd, ...args] = command.split(' ');
        
        switch (cmd.toLowerCase()) {
            case 'help':
                this.showHelpCommand();
                break;
            case 'translate':
                this.translateCurrentChannel();
                break;
            case 'stats':
                this.showStatsCommand();
                break;
            case 'clear':
                this.clearChat();
                break;
            case 'lang':
                this.changeLanguage(args[0]);
                break;
            case 'ping':
                this.addSystemMessage(`🏓 Pong! ${Date.now() - this.lastPing}ms`, 'system');
                break;
            default:
                this.addSystemMessage(`❌ أمر غير معروف: ${cmd}`, 'alert');
        }
    }

    showHelpCommand() {
        const helpText = `
        <div class="command-help">
            <h4>📋 الأوامر المتاحة:</h4>
            <ul>
                <li><code>/help</code> - عرض هذه المساعدة</li>
                <li><code>/translate</code> - ترجمة القناة الحالية</li>
                <li><code>/stats</code> - إحصائيات الدردشة</li>
                <li><code>/clear</code> - مسح الرسائل</li>
                <li><code>/lang [code]</code> - تغيير اللغة (ar, en, fr, etc.)</li>
                <li><code>/ping</code> - اختبار الاتصال</li>
            </ul>
        </div>`;
        this.addSystemMessage(helpText, 'system');
    }

    showStatsCommand() {
        const stats = this.getChatStats();
        const statsText = `
        <div class="chat-stats">
            <h4>📊 إحصائيات الدردشة:</h4>
            <p>إجمالي الرسائل: ${stats.total}</p>
            <p>المستخدمين النشطين: ${stats.activeUsers}</p>
            <p>القناة الحالية: ${this.channels[this.currentChannel].name}</p>
            <p>اللغة الحالية: ${window.translationSystem.availableLanguages[window.translationSystem.currentLanguage]}</p>
        </div>`;
        this.addSystemMessage(statsText, 'system');
    }

    async translateMessage(messageData) {
        if (messageData.language === window.translationSystem.currentLanguage) {
            this.addSystemMessage('الرسالة بالفعل باللغة الحالية', 'alert');
            return;
        }
        
        const translated = await window.translationSystem.translateText(messageData.message);
        this.addSystemMessage(`🔄 الترجمة: ${translated}`, 'normal');
    }

    replyToMessage(messageData) {
        const input = document.getElementById('chatInput');
        input.value = `@${messageData.user} `;
        input.focus();
    }

    translateCurrentChannel() {
        this.addSystemMessage('🔄 جاري ترجمة جميع الرسائل في القناة...', 'system');
        // تطبيق الترجمة على جميع الرسائل في القناة
        this.updateChatTranslation();
    }

    changeLanguage(langCode) {
        if (window.translationSystem.availableLanguages[langCode]) {
            window.translationSystem.setLanguage(langCode);
            this.addSystemMessage(`🌐 تم تغيير اللغة إلى ${window.translationSystem.availableLanguages[langCode]}`, 'system');
        } else {
            this.addSystemMessage(`❌ لغة غير مدعومة: ${langCode}`, 'alert');
        }
    }

    clearChat() {
        this.messagesContainer.innerHTML = '';
        this.addSystemMessage('🗑️ تم مسح الرسائل', 'system');
    }

    updateChatDisplay() {
        // تحديث عرض الرسائل حسب القناة
        const messages = Array.from(this.messagesContainer.children);
        messages.forEach(message => {
            const messageData = this.getMessageData(message);
            if (messageData.channel === this.currentChannel) {
                message.style.display = 'block';
            } else {
                message.style.display = messageData.type === 'system' ? 'block' : 'none';
            }
        });
    }

    updateChatTranslation() {
        // تحديث ترجمة جميع الرسائل
        this.messagesContainer.children.forEach(message => {
            const messageData = this.getMessageData(message);
            if (messageData.translatedMessage) {
                const textElement = message.querySelector('.message-text');
                textElement.textContent = messageData.translatedMessage;
            }
        });
    }

    updateLanguageStats() {
        const stats = window.translationSystem.getLanguageStats();
        const statsContainer = document.getElementById('languageStats');
        
        if (statsContainer) {
            statsContainer.innerHTML = Object.entries(stats)
                .map(([lang, count]) => `
                    <div class="lang-stat">
                        <span class="lang-flag">${this.getLanguageFlag(lang)}</span>
                        <span class="lang-name">${this.getLanguageName(lang)}</span>
                        <span class="lang-count">${count} رسالة</span>
                    </div>
                `).join('');
        }
    }

    getLanguageFlag(languageCode) {
        const flags = {
            'ar': '🇸🇦', 'en': '🇺🇸', 'es': '🇪🇸', 'fr': '🇫🇷',
            'de': '🇩🇪', 'it': '🇮🇹', 'pt': '🇵🇹', 'ru': '🇷🇺',
            'zh': '🇨🇳', 'ja': '🇯🇵', 'ko': '🇰🇷', 'hi': '🇮🇳',
            'tr': '🇹🇷', 'nl': '🇳🇱', 'sv': '🇸🇪', 'no': '🇳🇴',
            'da': '🇩🇰', 'fi': '🇫🇮', 'pl': '🇵🇱'
        };
        return flags[languageCode] || '🌐';
    }

    getLanguageName(languageCode) {
        return window.translationSystem.availableLanguages[languageCode] || languageCode;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getMessageData(messageElement) {
        // استخراج بيانات الرسالة من العنصر
        return {
            id: messageElement.querySelector('.message-action')?.dataset.messageId,
            channel: messageElement.className.match(/channel-(\w+)/)?.[1],
            translatedMessage: messageElement.querySelector('.message-text')?.textContent,
            language: messageElement.querySelector('.message-language')?.title
        };
    }

    getChatStats() {
        const messages = Array.from(this.messagesContainer.children);
        return {
            total: messages.length,
            activeUsers: new Set(messages.map(m => 
                m.querySelector('.message-user')?.textContent
            )).size
        };
    }

    playNotificationSound(messageData) {
        // تشغيل صوت للإشعارات
        if (messageData.type === this.messageTypes.ALERT || 
            messageData.type === this.messageTypes.REWARD) {
            // يمكن إضافة ملف صوتي هنا
        }
    }

    saveMessage(messageData) {
        // حفظ الرسالة في الذاكرة المحلية
        const chatKey = `chat_${this.currentChannel}`;
        const messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        messages.push(messageData);
        
        // الحفاظ على آخر 100 رسالة فقط
        if (messages.length > 100) {
            messages.splice(0, messages.length - 100);
        }
        
        localStorage.setItem(chatKey, JSON.stringify(messages));
    }

    loadChatHistory() {
        // تحميل تاريخ الدردشة
        const chatKey = `chat_${this.currentChannel}`;
        const messages = JSON.parse(localStorage.getItem(chatKey) || '[]');
        
        messages.forEach(messageData => {
            messageData.timestamp = new Date(messageData.timestamp);
            this.addMessage(messageData);
        });
    }

    // تكامل مع أنظمة اللعبة
    notifyBuildingUpgrade(building) {
        this.addBuildingMessage(building, 'ترقية');
    }

    notifyBattleStart(battleInfo) {
        this.addBattleMessage({
            ...battleInfo,
            message: `⚔️ بداية معركة ${battleInfo.enemy}`
        });
    }

    notifyBattleResult(result) {
        const message = result.won ? 
            `🏆 انتصار! تم كسب ${result.rewards.gold} ذهب` :
            `💀 هزيمة! خسرت ${result.lost.troops} جندي`;
        
        this.addBattleMessage({ message });
    }

    notifyResourceReward(reward) {
        this.addRewardMessage(reward);
    }

    // تهيئة تلقائية للرسائل
    initSystemMessages() {
        this.addSystemMessage('مرحباً بك في الإمبراطورية التقنية! 🚀', 'system');
        this.addSystemMessage('استخدم /help لرؤية الأوامر المتاحة', 'system');
        
        setTimeout(() => {
            this.addSystemMessage('جرب ترجمة الرسائل باستخدام نظام الترجمة التلقائية!', 'system');
        }, 3000);
    }
}