/**
 * نظام إدارة الحسابات المتعددة - Tech Empire 3D
 * نظام متقدم لإدارة عدة حسابات في المزارع
 */

class AccountManager {
    constructor() {
        this.accounts = this.loadAccounts();
        this.currentAccount = this.getCurrentAccount();
        this.init();
    }

    // تهيئة النظام
    init() {
        // إنشاء البيانات الافتراضية إذا لم توجد
        if (this.accounts.length === 0) {
            this.createDefaultAccount();
        }
        
        console.log('نظام إدارة الحسابات جاهز');
        console.log(`العدد الحالي للحسابات: ${this.accounts.length}`);
    }

    // تحميل الحسابات من التخزين المحلي
    loadAccounts() {
        const stored = localStorage.getItem('techEmpireAccounts');
        return stored ? JSON.parse(stored) : [];
    }

    // حفظ الحسابات في التخزين المحلي
    saveAccounts() {
        localStorage.setItem('techEmpireAccounts', JSON.stringify(this.accounts));
    }

    // الحصول على الحساب الحالي
    getCurrentAccount() {
        const current = localStorage.getItem('techEmpireCurrentAccount');
        if (current) {
            const account = this.accounts.find(acc => acc.id === current);
            if (account) return account;
        }
        return this.accounts[0] || null;
    }

    // إنشاء حساب افتراضي
    createDefaultAccount() {
        const defaultAccount = {
            id: 'account_' + Date.now(),
            username: 'حساب رئيسي',
            email: '',
            password: 'default123',
            isDefault: true,
            gameData: {
                level: 1,
                experience: 0,
                gold: 2500,
                food: 1500,
                wood: 800,
                stone: 600,
                iron: 400,
                energy: 100,
                gems: 50,
                lastLogin: new Date().toISOString(),
                stats: {
                    buildingsBuilt: 0,
                    researchCompleted: 0,
                    troopsTrained: 0,
                    battlesWon: 0
                },
                preferences: {
                    language: 'ar',
                    soundEnabled: true,
                    notifications: true,
                    autoSave: true
                }
            }
        };
        
        this.accounts = [defaultAccount];
        this.saveAccounts();
        this.currentAccount = defaultAccount;
        localStorage.setItem('techEmpireCurrentAccount', defaultAccount.id);
    }

    // تسجيل حساب جديد
    registerAccount(username, email, password) {
        // التحقق من عدم وجود اسم المستخدم مسبقاً
        if (this.accounts.find(acc => acc.username === username)) {
            throw new Error('اسم المستخدم موجود مسبقاً');
        }
        
        if (this.accounts.find(acc => acc.email === email)) {
            throw new Error('البريد الإلكتروني مستخدم مسبقاً');
        }

        const newAccount = {
            id: 'account_' + Date.now(),
            username: username,
            email: email,
            password: password,
            isDefault: false,
            gameData: {
                level: 1,
                experience: 0,
                gold: 1000, // حسابات جديدة تبدأ بذهب أقل
                food: 800,
                wood: 500,
                stone: 300,
                iron: 200,
                energy: 100,
                gems: 0,
                lastLogin: new Date().toISOString(),
                stats: {
                    buildingsBuilt: 0,
                    researchCompleted: 0,
                    troopsTrained: 0,
                    battlesWon: 0
                },
                preferences: {
                    language: 'ar',
                    soundEnabled: true,
                    notifications: true,
                    autoSave: true
                }
            }
        };

        this.accounts.push(newAccount);
        this.saveAccounts();
        return newAccount;
    }

    // تسجيل الدخول
    loginAccount(usernameOrEmail, password) {
        const account = this.accounts.find(acc => 
            (acc.username === usernameOrEmail || acc.email === usernameOrEmail) && 
            acc.password === password
        );

        if (!account) {
            throw new Error('بيانات الدخول غير صحيحة');
        }

        this.currentAccount = account;
        localStorage.setItem('techEmpireCurrentAccount', account.id);
        
        // تحديث وقت آخر دخول
        account.gameData.lastLogin = new Date().toISOString();
        this.saveAccounts();
        
        return account;
    }

    // التبديل بين الحسابات
    switchAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) {
            throw new Error('الحساب غير موجود');
        }

        // حفظ البيانات الحالية أولاً
        this.saveCurrentAccountData();
        
        this.currentAccount = account;
        localStorage.setItem('techEmpireCurrentAccount', account.id);
        
        // تحديث واجهة اللعبة
        this.updateGameUI();
        
        return account;
    }

    // حفظ بيانات الحساب الحالي
    saveCurrentAccountData() {
        if (this.currentAccount) {
            // حفظ أي بيانات من اللعبة
            this.currentAccount.gameData.lastLogin = new Date().toISOString();
            this.saveAccounts();
        }
    }

    // تحديث واجهة اللعبة
    updateGameUI() {
        if (!this.currentAccount) return;
        
        const data = this.currentAccount.gameData;
        
        // تحديث الموارد
        const resourceElements = {
            'gold-amount': data.gold,
            'food-amount': data.food,
            'wood-amount': data.wood,
            'stone-amount': data.stone,
            'iron-amount': data.iron,
            'energy-amount': data.energy,
            'gems-amount': data.gems
        };
        
        for (const [id, value] of Object.entries(resourceElements)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value.toLocaleString();
            }
        }
        
        // تحديث معلومات اللاعب
        this.updatePlayerStats();
    }

    // تحديث إحصائيات اللاعب
    updatePlayerStats() {
        if (!this.currentAccount) return;
        
        const data = this.currentAccount.gameData;
        
        // تحديث العناصر في الواجهة
        const stats = {
            'current-level': data.level,
            'current-exp': data.experience,
            'last-login': new Date(data.lastLogin).toLocaleDateString('ar-SA')
        };
        
        for (const [id, value] of Object.entries(stats)) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }
    }

    // تحديث مورد في الحساب الحالي
    updateResource(resourceType, amount) {
        if (!this.currentAccount) return;
        
        if (this.currentAccount.gameData[resourceType] !== undefined) {
            this.currentAccount.gameData[resourceType] += amount;
            this.saveAccounts();
            
            // تحديث واجهة المستخدم
            const element = document.getElementById(`${resourceType}-amount`);
            if (element) {
                element.textContent = this.currentAccount.gameData[resourceType].toLocaleString();
            }
        }
    }

    // الحصول على بيانات الحساب
    getCurrentAccountData() {
        return this.currentAccount ? this.currentAccount.gameData : null;
    }

    // حذف حساب
    deleteAccount(accountId) {
        if (this.accounts.length <= 1) {
            throw new Error('لا يمكن حذف آخر حساب');
        }
        
        const accountIndex = this.accounts.findIndex(acc => acc.id === accountId);
        if (accountIndex === -1) {
            throw new Error('الحساب غير موجود');
        }
        
        const deletedAccount = this.accounts[accountIndex];
        
        // إذا كان الحساب المحذوف هو الحالي، انتقل للحساب الأول
        if (this.currentAccount && this.currentAccount.id === accountId) {
            const firstAccount = this.accounts[0];
            if (firstAccount.id !== accountId) {
                this.switchAccount(firstAccount.id);
            } else if (this.accounts[1]) {
                this.switchAccount(this.accounts[1].id);
            }
        }
        
        this.accounts.splice(accountIndex, 1);
        this.saveAccounts();
        return deletedAccount;
    }

    // تصدير البيانات
    exportData() {
        return {
            accounts: this.accounts,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // استيراد البيانات
    importData(data) {
        try {
            if (data.accounts && Array.isArray(data.accounts)) {
                this.accounts = data.accounts;
                this.saveAccounts();
                
                // تحديث الحساب الحالي
                this.currentAccount = this.getCurrentAccount();
                this.updateGameUI();
                
                return true;
            }
        } catch (error) {
            console.error('خطأ في استيراد البيانات:', error);
        }
        return false;
    }

    // إحصائيات الحسابات
    getAccountsStats() {
        return {
            totalAccounts: this.accounts.length,
            totalGold: this.accounts.reduce((sum, acc) => sum + acc.gameData.gold, 0),
            totalLevel: this.accounts.reduce((sum, acc) => sum + acc.gameData.level, 0),
            totalExperience: this.accounts.reduce((sum, acc) => sum + acc.gameData.experience, 0)
        };
    }

    // إظهار قسم إدارة الحسابات
    showAccountManagement() {
        this.hideAllSections();
        document.getElementById('account-management-section').style.display = 'block';
        this.updateAccountManagementUI();
    }

    // تحديث واجهة إدارة الحسابات
    updateAccountManagementUI() {
        if (!this.currentAccount) return;
        
        document.getElementById('current-account-name').textContent = this.currentAccount.username;
        document.getElementById('current-account-level').textContent = this.currentAccount.gameData.level;
        document.getElementById('current-account-login').textContent = 
            new Date(this.currentAccount.gameData.lastLogin).toLocaleDateString('ar-SA');
        document.getElementById('current-account-gold').textContent = 
            this.currentAccount.gameData.gold.toLocaleString();
        
        this.updateAccountsList();
        this.updateFarmStats();
    }

    // تحديث قائمة الحسابات
    updateAccountsList() {
        const container = document.getElementById('saved-accounts');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.accounts.forEach(account => {
            const accountCard = document.createElement('div');
            accountCard.className = 'account-card';
            if (this.currentAccount && this.currentAccount.id === account.id) {
                accountCard.classList.add('current');
            }
            
            accountCard.innerHTML = `
                <div class="account-header">
                    <h4>${account.username}</h4>
                    <div class="account-level">المستوى ${account.gameData.level}</div>
                </div>
                <div class="account-stats">
                    <div class="stat">
                        <span class="stat-icon gold-icon"></span>
                        <span>${account.gameData.gold.toLocaleString()}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-icon exp-icon"></span>
                        <span>${account.gameData.experience.toLocaleString()}</span>
                    </div>
                </div>
                <div class="account-last-login">
                    آخر دخول: ${new Date(account.gameData.lastLogin).toLocaleDateString('ar-SA')}
                </div>
                <div class="account-actions">
                    ${this.currentAccount && this.currentAccount.id !== account.id ? 
                        `<button onclick="window.accountManager.switchToAccount('${account.id}')" class="btn btn-sm btn-primary">تبديل</button>` : 
                        '<span class="current-label">الحساب الحالي</span>'
                    }
                    <button onclick="deleteAccount('${account.id}')" class="btn btn-sm btn-danger">حذف</button>
                </div>
            `;
            
            container.appendChild(accountCard);
        });
    }

    // التبديل إلى حساب معين
    switchToAccount(accountId) {
        try {
            this.switchAccount(accountId);
            this.updateAccountManagementUI();
            alert('تم التبديل للحساب بنجاح!');
        } catch (error) {
            alert('خطأ في التبديل: ' + error.message);
        }
    }

    // حذف حساب
    deleteAccount(accountId) {
        const account = this.accounts.find(acc => acc.id === accountId);
        if (!account) return;
        
        if (confirm(`هل أنت متأكد من حذف حساب "${account.username}"؟`)) {
            try {
                this.deleteAccount(accountId);
                this.updateAccountManagementUI();
                alert('تم حذف الحساب بنجاح');
            } catch (error) {
                alert('خطأ في حذف الحساب: ' + error.message);
            }
        }
    }

    // تحديث إحصائيات المزرعة
    updateFarmStats() {
        const stats = this.getAccountsStats();
        
        document.getElementById('total-accounts').textContent = stats.totalAccounts;
        document.getElementById('total-farm-gold').textContent = stats.totalGold.toLocaleString();
        document.getElementById('total-farm-level').textContent = stats.totalLevel;
        document.getElementById('total-farm-exp').textContent = stats.totalExperience.toLocaleString();
    }

    // إخفاء جميع الأقسام
    hideAllSections() {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
    }
}

// إنشاء كائن عالمي لإدارة الحسابات
window.accountManager = new AccountManager();

// وظائف المصادقة العامة
function showAuthModal(tab = 'login') {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'flex';
        showAuthTab(tab);
    }
}

function hideAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function showAuthTab(tab) {
    // إخفاء جميع التبويبات
    const tabs = ['login-tab', 'register-tab'];
    tabs.forEach(tabId => {
        const element = document.getElementById(tabId);
        if (element) {
            element.style.display = 'none';
        }
    });
    
    // إزالة الفئة النشطة من جميع الأزرار
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));
    
    // إظهار التبويب المطلوب
    const targetTab = document.getElementById(`${tab}-tab`);
    if (targetTab) {
        targetTab.style.display = 'block';
    }
    
    // إضافة الفئة النشطة للزر المناسب
    const activeButton = document.querySelector(`[onclick="showAuthTab('${tab}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// معالج تسجيل الدخول
function handleLogin(event) {
    event.preventDefault();
    
    const usernameOrEmail = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        window.accountManager.loginAccount(usernameOrEmail, password);
        
        // إخفاء النافذة
        hideAuthModal();
        
        // تحديث الواجهة
        updateLoginStatus();
        
        alert('تم تسجيل الدخول بنجاح! مرحباً بك في الإمبراطورية التقنية');
        
    } catch (error) {
        alert('خطأ في تسجيل الدخول: ' + error.message);
    }
}

// معالج إنشاء الحساب
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        alert('كلمات المرور غير متطابقة');
        return;
    }
    
    if (password.length < 6) {
        alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        return;
    }
    
    try {
        window.accountManager.registerAccount(username, email, password);
        
        // التبديل لتبويب تسجيل الدخول
        showAuthTab('login');
        
        // مسح النموذج
        document.getElementById('register-form').reset();
        
        alert('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
        
    } catch (error) {
        alert('خطأ في إنشاء الحساب: ' + error.message);
    }
}

// تحديث حالة تسجيل الدخول
function updateLoginStatus() {
    const loginButtons = document.getElementById('login-buttons');
    const userInfo = document.getElementById('user-info');
    
    if (window.accountManager.currentAccount) {
        // المستخدم مسجل دخول
        if (loginButtons) loginButtons.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'block';
            const usernameElement = document.getElementById('current-username');
            if (usernameElement) {
                usernameElement.textContent = window.accountManager.currentAccount.username;
            }
        }
    } else {
        // المستخدم غير مسجل دخول
        if (loginButtons) loginButtons.style.display = 'flex';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// تسجيل الخروج
function logout() {
    window.accountManager.saveCurrentAccountData();
    localStorage.removeItem('techEmpireCurrentAccount');
    window.accountManager.currentAccount = null;
    updateLoginStatus();
    
    // إعادة تحميل الصفحة
    location.reload();
}

// وظائف إضافية
function createNewAccount() {
    const username = prompt('أدخل اسم المستخدم الجديد:');
    if (username && username.trim()) {
        const email = prompt('أدخل البريد الإلكتروني:');
        const password = prompt('أدخل كلمة المرور (6 أحرف على الأقل):');
        
        if (password && password.length >= 6) {
            try {
                window.accountManager.registerAccount(username.trim(), email || '', password);
                alert('تم إنشاء الحساب بنجاح!');
                window.accountManager.showAccountManagement();
            } catch (error) {
                alert('خطأ: ' + error.message);
            }
        } else {
            alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
        }
    }
}

function showAccountSwitcher() {
    const accounts = window.accountManager.accounts;
    if (accounts.length <= 1) {
        alert('لا توجد حسابات متعددة للتبديل بينها');
        return;
    }
    
    let menu = 'اختر الحساب:\n\n';
    accounts.forEach((acc, index) => {
        const current = window.accountManager.currentAccount && 
                       window.accountManager.currentAccount.id === acc.id ? ' (حالي)' : '';
        menu += `${index + 1}. ${acc.username}${current}\n`;
    });
    menu += '\n0. إلغاء';
    
    const choice = prompt(menu);
    const index = parseInt(choice) - 1;
    
    if (index >= 0 && index < accounts.length) {
        window.accountManager.switchToAccount(accounts[index].id);
    }
}

function exportAccountsData() {
    try {
        const data = window.accountManager.exportData();
        const jsonString = JSON.stringify(data, null, 2);
        
        // إنشاء ملف للتحميل
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tech-empire-accounts-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('تم تصدير البيانات بنجاح!');
    } catch (error) {
        alert('خطأ في تصدير البيانات: ' + error.message);
    }
}

function importAccountsData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    if (window.accountManager.importData(data)) {
                        alert('تم استيراد البيانات بنجاح!');
                        window.accountManager.showAccountManagement();
                    } else {
                        alert('فشل في استيراد البيانات - تحقق من صحة الملف');
                    }
                } catch (error) {
                    alert('خطأ في قراءة الملف: ' + error.message);
                }
            };
            reader.readAsText(file);
        }
    };
    
    fileInput.click();
}

// معالج تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateLoginStatus();
    
    // إضافة معالجات الأحداث للنماذج
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // إغلاق النافذة عند النقر خارجها
    const authModal = document.getElementById('auth-modal');
    if (authModal) {
        authModal.addEventListener('click', function(event) {
            if (event.target === authModal) {
                hideAuthModal();
            }
        });
    }
});