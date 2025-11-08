/**
 * نظام التراخيص والتطوير السريع
 * نظام Freemium - لعب مجاني مع خيارات التطوير السريع
 */

class LicenseSystem {
    constructor(game) {
        this.game = game;
        this.isInitialized = false;
        
        // نوع الترخيص الحالي - مجاني بالكامل لمدة 6 شهور
        this.currentLicense = 'legend'; // جميع المميزات مجانية للفترة التجريبية
        
        // فترة الاستخدام المجاني
        this.freePeriodMonths = 6; // 6 شهور مجانية
        this.launchDate = new Date('2025-11-06'); // تاريخ الإطلاق
        this.freePeriodEnd = new Date(this.launchDate);
        this.freePeriodEnd.setMonth(this.freePeriodEnd.getMonth() + this.freePeriodMonths);
        
        // مدة الاستخدام (بالدقائق) - للمتطلبات الداخلية
        this.usageTime = 0;
        this.maxFreeTime = 0; // لا قيود زمنية
        
        // المتجر والحزم - جميعها مجانية لمدة 6 شهور
        this.packages = {
            // جميع الحزم مجانية لمدة 6 شهور (فترة تجريبية)
            free_trial: {
                name: '🎉 الفترة التجريبية المجانية',
                price: 0,
                period: 'أول 6 شهور مجاناً',
                normalPrice: 4.99,
                features: {
                    buildingLimit: 9999, // غير محدود
                    startLevel: 25, // المستوى الأعلى
                    resources: { gold: 50000, food: 30000, wood: 20000, stone: 20000, iron: 15000 },
                    buildTime: 0.5, // سرعة بناء 2x أسرع
                    unlocks: ['hut', 'farm', 'woodcutter', 'quarry', 'well', 'barracks', 'warehouse', 'temple', 'marketplace', 'castle', 'granary', 'defense_wall', 'stable', 'workshop', 'market', 'academy', 'aqueduct']
                }
            },
            beginner: {
                name: 'مجموعة المبتدئ (بعد الفترة التجريبية)',
                price: 0, // مجانية لمدة 6 شهور
                normalPrice: 4.99,
                period: '6 شهور مجانية',
                features: {
                    buildingLimit: 8,
                    startLevel: 5,
                    resources: { gold: 2500, food: 1500, wood: 800, stone: 600, iron: 300 },
                    buildTime: 0.5,
                    unlocks: ['hut', 'farm', 'woodcutter', 'quarry', 'well', 'granary', 'warehouse', 'defense_wall']
                }
            },
            builder: {
                name: 'مجموعة البناء (بعد الفترة التجريبية)',
                price: 0, // مجانية لمدة 6 شهور
                normalPrice: 9.99,
                period: '6 شهور مجانية',
                features: {
                    buildingLimit: 15,
                    startLevel: 10,
                    resources: { gold: 5000, food: 3000, wood: 1500, stone: 1200, iron: 800 },
                    buildTime: 0.3,
                    unlocks: ['hut', 'farm', 'woodcutter', 'quarry', 'well', 'granary', 'warehouse', 'defense_wall', 'barracks', 'stable', 'workshop', 'market', 'academy', 'temple', 'aqueduct']
                }
            },
            emperor: {
                name: 'مجموعة الإمبراطور (بعد الفترة التجريبية)',
                price: 0, // مجانية لمدة 6 شهور
                normalPrice: 19.99,
                period: '6 شهور مجانية',
                features: {
                    buildingLimit: 25,
                    startLevel: 20,
                    resources: { gold: 10000, food: 6000, wood: 3000, stone: 2500, iron: 1500 },
                    buildTime: 0.2,
                    unlocks: ['hut', 'farm', 'woodcutter', 'quarry', 'well', 'granary', 'warehouse', 'defense_wall', 'barracks', 'stable', 'workshop', 'market', 'academy', 'temple', 'aqueduct', 'palace', 'colosseum', 'forum', 'library', 'amphitheater', 'garment_factory', 'ceramics', 'jewelry', 'trade_guild', 'bureau_finance']
                }
            },
            legend: {
                name: 'مجموعة الأسطورة (بعد الفترة التجريبية)',
                price: 0, // مجانية لمدة 6 شهور
                normalPrice: 29.99,
                period: '6 شهور مجانية',
                features: {
                    buildingLimit: 9999, // غير محدود
                    startLevel: 25,
                    resources: { gold: 20000, food: 12000, wood: 6000, stone: 5000, iron: 3000 },
                    buildTime: 0.1, // 10x أسرع
                    unlocks: ['hut', 'farm', 'woodcutter', 'quarry', 'well', 'granary', 'warehouse', 'defense_wall', 'barracks', 'stable', 'workshop', 'market', 'academy', 'temple', 'aqueduct', 'palace', 'colosseum', 'forum', 'library', 'amphitheater', 'garment_factory', 'ceramics', 'jewelry', 'trade_guild', 'bureau_finance', 'castrum', 'villa', 'caesareum', 'capitol', 'hologram_theater', 'quantum_laboratory', 'time_capsule']
                }
            }
        };

        // تحميل الترخيص المحفوظ
        this.loadLicense();
        
        // بدء تتبع الوقت
        this.startTimeTracking();
    }

    // تحميل الترخيص من التخزين المحلي
    loadLicense() {
        const saved = localStorage.getItem('techEmpireGame_license');
        if (saved) {
            const licenseData = JSON.parse(saved);
            this.currentLicense = licenseData.type;
            this.usageTime = licenseData.usageTime || 0;
        } else {
            // تعيين الترخيص المجاني افتراضياً
            this.currentLicense = 'free';
            this.saveLicense();
        }
    }

    // حفظ الترخيص في التخزين المحلي
    saveLicense() {
        const licenseData = {
            type: this.currentLicense,
            usageTime: this.usageTime,
            timestamp: Date.now()
        };
        localStorage.setItem('techEmpireGame_license', JSON.stringify(licenseData));
    }

    // بدء تتبع الوقت
    startTimeTracking() {
        setInterval(() => {
            if (this.currentLicense === 'free') {
                this.usageTime++;
                this.saveLicense();
                
                // تنبيه قبل انتهاء المجاني
                if (this.usageTime === this.maxFreeTime - 5) {
                    this.showUpgradeReminder();
                }
                
                // تقييد اللعب بعد انتهاء المجاني
                if (this.usageTime >= this.maxFreeTime) {
                    this.enforceTimeLimit();
                }
            }
        }, 60000); // كل دقيقة
    }

    // الحصول على ميزات الترخيص الحالي
    getCurrentFeatures() {
        return this.packages[this.currentLicense]?.features || this.packages.free.features;
    }

    // التحقق من إمكانية بناء مبنى
    canBuild(buildingType) {
        const features = this.getCurrentFeatures();
        const currentLevel = this.game.currentLevel || 1;
        
        // التحقق من حد المباني
        if (this.game.buildings?.length >= features.buildingLimit) {
            return { allowed: false, reason: 'building_limit' };
        }
        
        // التحقق من المستوى المطلوب
        const requiredLevel = this.getRequiredLevel(buildingType);
        if (currentLevel < requiredLevel) {
            return { allowed: false, reason: 'level_required', requiredLevel };
        }
        
        // التحقق من توفر المبنى
        if (!features.unlocks.includes(buildingType)) {
            return { allowed: false, reason: 'locked' };
        }
        
        return { allowed: true };
    }

    // الحصول على المستوى المطلوب للمبنى
    getRequiredLevel(buildingType) {
        const levels = {
            'hut': 1, 'farm': 1, 'woodcutter': 1, 'quarry': 1, 'well': 2,
            'granary': 3, 'warehouse': 3, 'defense_wall': 3, 'barracks': 4,
            'stable': 4, 'workshop': 5, 'market': 6, 'academy': 7,
            'temple': 8, 'aqueduct': 9, 'palace': 10, 'colosseum': 15,
            'forum': 20, 'library': 25, 'amphitheater': 30
        };
        return levels[buildingType] || 1;
    }

    // شراء ترخيص جديد
    async purchaseLicense(licenseType) {
        if (!this.packages[licenseType]) {
            return { success: false, message: 'نوع الترخيص غير متاح' };
        }
        
        const package = this.packages[licenseType];
        
        // محاكاة عملية الدفع
        try {
            await this.simulatePayment(package.price);
            
            // تطبيق الترخيص الجديد
            this.currentLicense = licenseType;
            this.usageTime = 0; // إعادة تعيين وقت الاستخدام
            this.saveLicense();
            
            // تطبيق الميزات الجديدة
            this.applyLicenseFeatures();
            
            return { 
                success: true, 
                message: `تم شراء ${package.name} بنجاح!`,
                features: package.features
            };
        } catch (error) {
            return { success: false, message: 'فشل في عملية الدفع' };
        }
    }

    // محاكاة عملية الدفع
    simulatePayment(amount) {
        return new Promise((resolve, reject) => {
            // محاكاة تأخير المعالجة
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90%成功率
                    resolve();
                } else {
                    reject(new Error('فشل في معالجة الدفع'));
                }
            }, 2000);
        });
    }

    // تطبيق ميزات الترخيص
    applyLicenseFeatures() {
        const features = this.getCurrentFeatures();
        
        // تطبيق الموارد الإضافية
        Object.keys(features.resources).forEach(resource => {
            const currentAmount = this.game.resources[resource] || 0;
            this.game.resources[resource] = currentAmount + features.resources[resource];
        });
        
        // تطبيق سرعة البناء
        this.game.buildSpeed = features.buildTime;
        
        // تطبيق حد المباني
        this.game.maxBuildings = features.buildingLimit;
        
        // تحديث واجهة اللعبة
        this.game.updateResourcesDisplay();
    }

    // عرض تنبيه الترقية
    showUpgradeReminder() {
        if (this.game.chatSystem) {
            this.game.sendChatNotification('ستنتهي التجربة المجانية خلال 5 دقائق', 'warning', 'system');
        }
    }

    // فرض قيود الوقت
    enforceTimeLimit() {
        // إظهار شاشة الترقية
        this.showUpgradeScreen();
        
        // تقييد بعض الميزات
        if (this.game.chatSystem) {
            this.game.sendChatNotification('انتهت فترة اللعب المجاني. يرجى شراء ترخيص للمتابعة.', 'error', 'system');
        }
    }

    // عرض شاشة الترقية
    showUpgradeScreen() {
        // إزالة أي شاشة موجودة
        const existingScreen = document.getElementById('upgrade-screen');
        if (existingScreen) {
            existingScreen.remove();
        }
        
        const upgradeScreen = document.createElement('div');
        upgradeScreen.id = 'upgrade-screen';
        upgradeScreen.className = 'upgrade-screen';
        upgradeScreen.innerHTML = `
            <div class="upgrade-modal">
                <h2>⏰ انتهت فترة اللعب المجاني</h2>
                <p>استمر في بناء إمبراطوريتك التقنية!</p>
                <div class="packages-grid">
                    ${Object.entries(this.packages)
                        .filter(([key]) => key !== 'free')
                        .map(([key, pkg]) => `
                            <div class="package-card" data-license="${key}">
                                <h3>${pkg.name}</h3>
                                <div class="price">$${pkg.price}</div>
                                <ul class="features">
                                    <li>مبنى ${pkg.features.buildingLimit} ${pkg.features.buildingLimit === 1 ? 'مبنى' : 'مباني'}</li>
                                    <li>يبدأ من المستوى ${pkg.features.startLevel}</li>
                                    <li>سرعة بناء ${(1/pkg.features.buildTime).toFixed(1)}x</li>
                                    <li>موارد إضافية</li>
                                </ul>
                                <button onclick="game.licenseSystem.purchaseLicense('${key}')" class="buy-btn">
                                    شراء الآن
                                </button>
                            </div>
                        `).join('')}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">إغلاق</button>
            </div>
        `;
        
        document.body.appendChild(upgradeScreen);
    }

    // الحصول على معلومات الترخيص
    getLicenseInfo() {
        return {
            type: this.currentLicense,
            package: this.packages[this.currentLicense],
            usageTime: this.usageTime,
            remainingTime: Math.max(0, this.maxFreeTime - this.usageTime),
            canPlay: this.currentLicense === 'free' ? this.usageTime < this.maxFreeTime : true
        };
    }

    // الحصول على حالة البنية
    getBuildingStatus(buildingType) {
        const canBuild = this.canBuild(buildingType);
        if (canBuild.allowed) {
            return 'available';
        }
        
        switch (canBuild.reason) {
            case 'building_limit':
                return 'building_limit';
            case 'level_required':
                return `level_${canBuild.requiredLevel}`;
            case 'locked':
                return 'locked';
            default:
                return 'unavailable';
        }
    }

    // تهيئة النظام
    initialize() {
        if (this.isInitialized) return;
        
        // إضافة أزرار المتجر
        this.addStoreButtons();
        
        // تحديث عرض الترخيص
        this.updateLicenseDisplay();
        
        // إضافة مستمع للأحداث
        this.addEventListeners();
        
        this.isInitialized = true;
    }

    // إضافة أزرار المتجر
    addStoreButtons() {
        // يمكن إضافة زر متجر في الواجهة
    }

    // تحديث عرض الترخيص
    updateLicenseDisplay() {
        const info = this.getLicenseInfo();
        const element = document.getElementById('license-info');
        
        if (element) {
            element.innerHTML = `
                <span class="license-type">${info.package.name}</span>
                ${info.type === 'free' ? `<span class="time-remaining">الوقت المتبقي: ${info.remainingTime} دقيقة</span>` : ''}
            `;
        }
    }

    // إضافة مستمعات الأحداث
    addEventListeners() {
        // مستمع لتغيير الترخيص
        document.addEventListener('licenseChanged', (e) => {
            this.updateLicenseDisplay();
        });
    }

    // فتح المتجر
    openStore() {
        const existingStore = document.getElementById('store-modal');
        if (existingStore) {
            existingStore.remove();
        }
        
        // حساب الوقت المتبقي في الفترة التجريبية
        const now = new Date();
        const daysRemaining = Math.ceil((this.freePeriodEnd - now) / (1000 * 60 * 60 * 24));
        const isInFreePeriod = now < this.freePeriodEnd;
        
        const storeModal = document.createElement('div');
        storeModal.id = 'store-modal';
        storeModal.className = 'store-modal';
        storeModal.innerHTML = `
            <div class="store-content">
                <div class="store-header">
                    <h2>🎉 متجر التطوير السريع - فترة تجريبية</h2>
                    <button onclick="this.closest('.store-modal').remove()" class="close-btn">×</button>
                </div>
                
                ${isInFreePeriod ? `
                    <div class="promo-banner">
                        <h3>🎊 عرض خاص: 6 شهور مجانية كاملة!</h3>
                        <p><strong>الوقت المتبقي:</strong> ${daysRemaining} يوم</p>
                        <p>🎁 استمتع بكل المميزات مجاناً لمدة ${this.freePeriodMonths} شهور!</p>
                    </div>
                ` : `
                    <div class="paid-period-banner">
                        <h3>📅 انتهت الفترة التجريبية</h3>
                        <p>يمكنك الآن شراء أي حزمة للتطوير السريع</p>
                    </div>
                `}
                
                <div class="current-license">
                    <h3>حالتك الحالية</h3>
                    <div class="license-info">
                        <strong>${this.packages[this.currentLicense].name}</strong>
                        ${isInFreePeriod ? 
                            `<span class="free-badge">🎉 مجاني - ${this.packages[this.currentLicense].period || '6 شهور'}</span>` : 
                            `<span class="paid-badge">💳 مدفوع</span>`
                        }
                    </div>
                </div>
                
                <div class="packages-section">
                    <h3>${isInFreePeriod ? 'استمتع بجميع المميزات مجاناً' : 'الحزم المتاحة'}</h3>
                    <div class="packages-grid">
                        ${Object.entries(this.packages).map(([key, pkg]) => {
                            const isCurrent = this.currentLicense === key;
                            const isFree = pkg.price === 0 && isInFreePeriod;
                            const displayPrice = isFree ? 'مجاني' : (pkg.price > 0 ? '$' + pkg.price : 'مجاني');
                            const buttonText = isFree ? 'تفعيل مجاناً' : 'شراء';
                            const priceInfo = pkg.normalPrice && isFree ? 
                                `<div class="original-price">السعر العادي: $${pkg.normalPrice}</div>` : '';
                            
                            return `
                                <div class="package-card ${isCurrent ? 'current' : ''} ${isFree ? 'free-trial' : ''}" data-license="${key}">
                                    ${isCurrent ? '<div class="current-badge">الحالي</div>' : ''}
                                    ${isFree ? '<div class="free-trial-badge">🆓 فترة تجريبية</div>' : ''}
                                    <h3>${pkg.name}</h3>
                                    <div class="price">${displayPrice}</div>
                                    ${priceInfo}
                                    <ul class="features">
                                        <li>🏗️ ${pkg.features.buildingLimit === 9999 ? 'غير محدود' : pkg.features.buildingLimit} ${pkg.features.buildingLimit === 1 ? 'مبنى' : 'مباني'}</li>
                                        <li>📊 يبدأ من المستوى ${pkg.features.startLevel}</li>
                                        <li>⚡ سرعة بناء ${(1/pkg.features.buildTime).toFixed(1)}x</li>
                                        <li>💰 موارد إضافية</li>
                                        <li>🎮 ${pkg.features.unlocks.length} مبنى متاح</li>
                                    </ul>
                                    ${isCurrent ? 
                                        '<button class="current-btn" disabled>الحالي</button>' : 
                                        `<button onclick="game.licenseSystem.purchaseLicense('${key}')" class="buy-btn ${isFree ? 'free-btn' : ''}">${buttonText}</button>`
                                    }
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
                
                <div class="benefits-section">
                    <h3>🎁 مزايا الفترة التجريبية</h3>
                    <div class="benefits-list">
                        <div class="benefit">🆓 لعب مجاني كامل لمدة 6 شهور</div>
                        <div class="benefit">🏗️ بناء مباني غير محدود</div>
                        <div class="benefit">⚡ سرعة بناء محسنة</div>
                        <div class="benefit">💎 جميع المميزات متاحة</div>
                        <div class="benefit">🎮 محتوى حصري ومميزات متقدمة</div>
                        <div class="benefit">🏆 بداية متقدمة بمستوى 25</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(storeModal);
    }
    
    /**
     * شراء رخصة - مع دعم الفترة التجريبية المجانية
     */
    purchaseLicense(licenseKey) {
        const pkg = this.packages[licenseKey];
        if (!pkg) {
            alert('الحزمة المطلوبة غير موجودة!');
            return;
        }
        
        const isInFreePeriod = new Date() < this.freePeriodEnd;
        
        // إذا كانت الفترة التجريبية نشطة، جميع الحزم مجانية
        if (isInFreePeriod && pkg.price === 0) {
            this.currentLicense = licenseKey;
            this.saveLicense();
            this.applyLicenseFeatures();
            this.updateLicenseDisplay();
            
            // تطبيق موارد البداية للمتعة
            if (pkg.features.resources) {
                Object.keys(pkg.features.resources).forEach(resource => {
                    if (this.game.resources && this.game.resources[resource] !== undefined) {
                        this.game.resources[resource] += pkg.features.resources[resource];
                    }
                });
            }
            
            // تطبيق المستوى البدء
            if (this.game.civilization && pkg.features.startLevel) {
                this.game.civilization.level = Math.max(this.game.civilization.level || 1, pkg.features.startLevel);
            }
            
            // إغلاق المتجر
            const storeModal = document.getElementById('store-modal');
            if (storeModal) {
                storeModal.remove();
            }
            
            const message = pkg.name.includes('الفترة التجريبية') ? 
                `🎉 تم تفعيل ${pkg.name}! استمتع بكل المميزات مجاناً` :
                `🎉 تم تفعيل ${pkg.name} مجاناً! (الفترة التجريبية)`;
            
            alert(message);
            return;
        }
        
        // بعد انتهاء الفترة التجريبية - عملية دفع عادية
        if (!isInFreePeriod) {
            if (pkg.price === 0) {
                // الحزم المجانية بعد الفترة التجريبية
                this.currentLicense = licenseKey;
                this.saveLicense();
                this.applyLicenseFeatures();
                this.updateLicenseDisplay();
                alert(`✅ تم تفعيل ${pkg.name} بنجاح!`);
                return;
            }
            
            // دفع عادي للحزم المدفوعة
            this.simulatePayment(pkg.price).then(() => {
                this.currentLicense = licenseKey;
                this.saveLicense();
                this.applyLicenseFeatures();
                this.updateLicenseDisplay();
                
                // تطبيق موارد البداية
                if (pkg.features.resources) {
                    Object.keys(pkg.features.resources).forEach(resource => {
                        if (this.game.resources && this.game.resources[resource] !== undefined) {
                            this.game.resources[resource] += pkg.features.resources[resource];
                        }
                    });
                }
                
                // تطبيق المستوى البدء
                if (this.game.civilization && pkg.features.startLevel) {
                    this.game.civilization.level = Math.max(this.game.civilization.level || 1, pkg.features.startLevel);
                }
                
                // إغلاق المتجر
                const storeModal = document.getElementById('store-modal');
                if (storeModal) {
                    storeModal.remove();
                }
                
                alert(`🎉 تم شراء ${pkg.name} بنجاح! تم تطبيق المميزات الإضافية.`);
            }).catch((error) => {
                alert('فشل في عملية الدفع: ' + error.message);
            });
        } else {
            alert('🤔 الخطأ: الحزمة يجب أن تكون مجانية في الفترة التجريبية');
        }
    }
}

// تصدير للاستخدام في ملفات أخرى
window.LicenseSystem = LicenseSystem;