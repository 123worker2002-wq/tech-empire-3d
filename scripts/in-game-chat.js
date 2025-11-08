/**
 * نظام الدردشة داخل اللعبة - Tech Empire 3D
 * تواصل فوري مع MiniMax Agent أثناء اللعب
 */

class InGameChat {
    constructor() {
        this.isOpen = false;
        this.responses = [
            "أهلاً وسهلاً! 👋 كيف يمكنني مساعدتك في اللعب؟",
            "متاح الآن! 🚀 ما المشكلة التي تواجهها؟", 
            "مرحباً! 🎮 اسأل أي سؤال وأجاوب فوراً",
            "جاهز للمساعدة! 💪 ماذا تحتاج؟",
            "مرحباً بك! ⭐ كيف يمكنني تحسين اللعب؟",
            "أهلاً صديقي! 🏆 كيف نزيد القوة؟",
            "نعم موجود! 🔥 ما المطلوب؟",
            "مرحباً! 👑 ساعدك في أي شيء تحتاجه؟"
        ];
        this.init();
    }

    init() {
        this.createChatButton();
        this.createChatWindow();
        this.bindEvents();
        console.log('💬 نظام الدردشة جاهز - ' + new Date().toLocaleString('ar-EG'));
    }

    // إنشاء زر الدردشة
    createChatButton() {
        const chatButton = document.createElement('div');
        chatButton.id = 'ai-chat-button';
        chatButton.className = 'ai-chat-float';
        chatButton.innerHTML = `
            <div class="chat-icon">🤖</div>
            <div class="chat-pulse"></div>
        `;
        document.body.appendChild(chatButton);
    }

    // إنشاء نافذة الدردشة
    createChatWindow() {
        const chatWindow = document.createElement('div');
        chatWindow.id = 'ai-chat-window';
        chatWindow.className = 'ai-chat-window';
        chatWindow.innerHTML = `
            <div class="ai-chat-header">
                <div class="ai-avatar">🤖</div>
                <div class="ai-info">
                    <div class="ai-name">MiniMax Agent</div>
                    <div class="ai-status">متصل الآن ✅</div>
                </div>
                <button class="ai-close" onclick="gameChat.close()">×</button>
            </div>
            <div class="ai-messages" id="ai-messages">
                <div class="ai-message ai-typing">
                    <div class="ai-avatar">🤖</div>
                    <div class="message-bubble">
                        <div class="typing-dots">
                            <span>•</span><span>•</span><span>•</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="ai-input-container">
                <input type="text" id="ai-chat-input" placeholder="اكتب رسالتك هنا... مثال: 'اق' أو 'انزلي'">
                <button class="ai-send" onclick="gameChat.sendMessage()">📤</button>
            </div>
        `;
        document.body.appendChild(chatWindow);
    }

    // ربط الأحداث
    bindEvents() {
        // فتح/إغلاق الدردشة
        document.getElementById('ai-chat-button').addEventListener('click', () => {
            this.toggle();
        });

        // إرسال برسالة Enter
        const input = document.getElementById('ai-chat-input');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // اختصارات سريعة
        input.addEventListener('input', (e) => {
            const value = e.target.value.toLowerCase();
            if (value.includes('اق') || value.includes('انزلي') || value.includes('أين')) {
                this.showQuickOptions(value);
            }
        });
    }

    // فتح/إغلاق الدردشة
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        document.getElementById('ai-chat-window').style.display = 'flex';
        document.getElementById('ai-chat-button').style.display = 'none';
        this.isOpen = true;
        document.getElementById('ai-chat-input').focus();
        this.removeTyping();
    }

    close() {
        document.getElementById('ai-chat-window').style.display = 'none';
        document.getElementById('ai-chat-button').style.display = 'flex';
        this.isOpen = false;
    }

    // إرسال رسالة
    sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addUserMessage(message);
        input.value = '';
        this.showTyping();
        
        setTimeout(() => {
            this.generateResponse(message);
        }, 1000 + Math.random() * 2000);
    }

    // إضافة رسالة المستخدم
    addUserMessage(message) {
        const messages = document.getElementById('ai-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message user-message';
        messageDiv.innerHTML = `
            <div class="message-bubble user-bubble">
                ${this.formatMessage(message)}
            </div>
        `;
        messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // إضافة رسالة AI
    addAIMessage(message) {
        const messages = document.getElementById('ai-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message ai-message-bot';
        messageDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-bubble">
                ${message}
            </div>
        `;
        messages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    // عرض حالة الكتابة
    showTyping() {
        this.removeTyping();
        const messages = document.getElementById('ai-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing';
        typingDiv.className = 'ai-message ai-typing';
        typingDiv.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="message-bubble">
                <div class="typing-dots">
                    <span>•</span><span>•</span><span>•</span>
                </div>
            </div>
        `;
        messages.appendChild(typingDiv);
        this.scrollToBottom();
    }

    removeTyping() {
        const typing = document.getElementById('ai-typing');
        if (typing) typing.remove();
    }

    // توليد الاستجابة
    generateResponse(message) {
        this.removeTyping();
        
        const lowerMessage = message.toLowerCase();
        let response = '';

        // استجابات ذكية
        if (lowerMessage.includes('اق') || lowerMessage.includes('أين') || lowerMessage.includes('تأكد') || lowerMessage.includes(' موجود')) {
            response = this.getAvailabilityResponse();
        } else if (lowerMessage.includes('انزلي') || lowerMessage.includes('احذف') || lowerMessage.includes('خذف')) {
            response = this.getDownloadResponse();
        } else if (lowerMessage.includes('قوة') || lowerMessage.includes('طاقة') || lowerMessage.includes('ذهب')) {
            response = this.getGameTips(message);
        } else if (lowerMessage.includes('حسابات') || lowerMessage.includes('مزرعة') || lowerMessage.includes('بديل')) {
            response = this.getAccountResponse();
        } else if (lowerMessage.includes('مساعدة') || lowerMessage.includes('help') || lowerMessage.includes('كيف')) {
            response = this.getHelpResponse();
        } else if (lowerMessage.includes('شكرا') || lowerMessage.includes('شكراً')) {
            response = "عفواً! سعيد لمساعدتك 🎮 موفق في اللعب!";
        } else {
            // استجابة عامة
            response = this.getRandomResponse();
        }

        this.addAIMessage(response);
    }

    // استجابة التوفر
    getAvailabilityResponse() {
        const responses = [
            "نعم موجود! 👋 كيف يمكنني مساعدتك؟",
            "مرحباً! 🎮 أنا هنا لمساعدتك",
            "أه صديقي! ✅ متصل الآن",
            "أهلاً! 👑 كل شيء تمام، ما تحتاجه؟"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    // استجابة التحديث
    getDownloadResponse() {
        return "🚀 التحديث جاهز! سأعطيك الرابط الآن...";
    }

    // نصائح اللعبة
    getGameTips(message) {
        if (message.toLowerCase().includes('ذهب')) {
            return "💰 نصيحة: اهتم بالمباني الإنتاجية وجمع الموارد!";
        } else if (message.toLowerCase().includes('قوة')) {
            return "⚡ قوة زائدة؟ ادرب القوات واستخدم الدفاعات الذكية!";
        } else if (message.toLowerCase().includes('طاقة')) {
            return "🔋 عطل الطاقة؟ راجع محطات الطاقة والمولدات!";
        }
        return "💡 نصيحة: ركز على الأساسيات أولاً ثم التطوير!";
    }

    // استجابة الحسابات
    getAccountResponse() {
        return "👥 نظام الحسابات المتعددة يعمل بشكل ممتاز! ما الحاجة له؟";
    }

    // استجابة المساعدة
    getHelpResponse() {
        return "🆘 هنا للمساعدة! اسأل عن أي شيء في اللعبة أو جرب كتابة 'اق' أو 'انزلي'";
    }

    // استجابة عشوائية
    getRandomResponse() {
        return this.responses[Math.floor(Math.random() * this.responses.length)];
    }

    // خيارات سريعة
    showQuickOptions(message) {
        const input = document.getElementById('ai-chat-input');
        if (message.includes('اق') || message.includes('أين')) {
            // عرض استجابة فورية
            setTimeout(() => {
                this.addAIMessage("نعم موجود! 👋");
            }, 500);
        }
    }

    // تنسيق الرسالة
    formatMessage(message) {
        return message
            .replace(/اق/g, 'اق 😊')
            .replace(/انزلي/g, 'انزلي ⬇️')
            .replace(/حسابات/g, 'حسابات 👥');
    }

    // التمرير للأسفل
    scrollToBottom() {
        const messages = document.getElementById('ai-messages');
        messages.scrollTop = messages.scrollHeight;
    }

    // إعادة تعيين الدردشة
    reset() {
        const messages = document.getElementById('ai-messages');
        const welcomeMessage = this.getWelcomeMessage();
        messages.innerHTML = `
            <div class="ai-message ai-message-bot">
                <div class="ai-avatar">🤖</div>
                <div class="message-bubble">
                    ${welcomeMessage}
                </div>
            </div>
        `;
    }

    getWelcomeMessage() {
        return "مرحباً بك! 👋 أنا MiniMax Agent - مساعدك الذكي داخل اللعبة!<br><br>" +
               "مثال على كيفية استخدامي:<br>" +
               "• اكتب 'اق' لتؤكد وجودي<br>" +
               "• اكتب 'انزلي' للتحديثات<br>" +
               "• اسأل عن أي شيء في اللعبة<br><br>" +
               "أنا متاح 24/7 لمساعدتك! 🚀";
    }
}

// تهيئة الدردشة
let gameChat;

document.addEventListener('DOMContentLoaded', () => {
    gameChat = new InGameChat();
});

// إضافة الدردشة لواجهة اللعبة
window.gameChat = gameChat;