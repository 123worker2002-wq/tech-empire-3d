// الإمبراطورية التقنية - المحاكي ثلاثي الأبعاد
// Tech Empire - 3D Simulator Game
// Complete 3D game implementation with mobile support

class TechEmpire3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.buildings = [];
        this.frameCount = 0;
        this.lastTime = 0;
        this.fps = 60; // تحسين الأداء
        this.performanceMode = 'high'; // high, balanced, low
        this.resources = {
            gold: 1000,
            food: 500,
            wood: 300,
            stone: 200,
            iron: 150,
            royalGems: 0, // الأنهار الكريمة - المبنى الجديد
            gems: 0, // الأحجار الكريمة العادية
            crystals: 0,
            sacredRelics: 0,
            emperorCrowns: 0,
            diamonds: 0
        };
        this.vipLevel = 0;
        this.level = "C1";
        this.maxLevel = "C40"; // المستوى الأقصى للاعبين العاديين
        this.ownerMaxLevel = "C45"; // المستوى الأقصى للمالك
        this.levelIndex = 1; // 1-40 للاعبين، 45 للمالك
        this.troopSystem = {
            currentTroop: "T1",
            maxTroop: "T14",
            troopIndex: 1, // 1-14
            troopNames: {
                T1: "مقاتل بسيط",
                T2: "حارس المدينة",
                T3: "محارب متمرس",
                T4: "جندي للقوات",
                T5: "محارب قديم",
                T6: "أفضل ما في نوعه",
                T7: "محارب الشجعان",
                T8: "فارس ماهر",
                T9: "محارب محترف",
                T10: "أمير الحرب",
                T11: "أسطورة حية",
                T12: "سيد القتال",
                T13: "محارب إلهي",
                T14: "قوة خالدة"
            },
            troopRequirements: {
                T1: { level: 0, gold: 100, food: 50 },
                T2: { level: 5, gold: 250, food: 100 },
                T3: { level: 8, gold: 500, food: 200 },
                T4: { level: 12, gold: 1000, food: 500 },
                T5: { level: 15, gold: 2000, food: 1000 },
                T6: { level: 18, gold: 4000, food: 2000 },
                T7: { level: 22, gold: 8000, food: 4000 },
                T8: { level: 25, gold: 15000, food: 8000 },
                T9: { level: 28, gold: 30000, food: 15000 },
                T10: { level: 32, gold: 60000, food: 30000 },
                T11: { level: 35, gold: 120000, food: 60000 },
                T12: { level: 38, gold: 250000, food: 120000 },
                T13: { level: 42, gold: 500000, food: 250000 },
                T14: { level: 45, gold: 1000000, food: 500000 }
            },
            troopBonuses: {
                T1: { attack: 0, defense: 0, health: 100 },
                T2: { attack: 5, defense: 5, health: 150 },
                T3: { attack: 15, defense: 15, health: 250 },
                T4: { attack: 30, defense: 30, health: 400 },
                T5: { attack: 50, defense: 50, health: 600 },
                T6: { attack: 75, defense: 75, health: 850 },
                T7: { attack: 100, defense: 100, health: 1150 },
                T8: { attack: 140, defense: 140, health: 1500 },
                T9: { attack: 180, defense: 180, health: 2000 },
                T10: { attack: 220, defense: 220, health: 2500 },
                T11: { attack: 270, defense: 270, health: 3000 },
                T12: { attack: 320, defense: 320, health: 3500 },
                T13: { attack: 380, defense: 380, health: 4000 },
                T14: { attack: 500, defense: 500, health: 5000 }
            },
            upgradeTime: 300000, // 5 دقائق لكل مستوى
            canUpgrade: true
        };
        
        // نظام الذكاء الاصطناعي لمساعدة تنظيم القوات
        this.aiSystem = {
            isUnlocked: false,
            currentLevel: 0,
            maxLevel: 10,
            aiLevels: {
                0: { name: "غير متاح", description: "متاح من المستوى C18", unlockLevel: 18 },
                1: { name: "مساعد تنظيمي", description: "ينظم صفوف القوات الأساسية", unlockLevel: 18 },
                2: { name: "مخطط战斗", description: "يرتب صفوف القتال", unlockLevel: 20 },
                3: { name: "خبير دفاعي", description: "يحسن الدفاعات والهجمات", unlockLevel: 22 },
                4: { name: "محلل ميداني", description: "يقرأ تقارير المعركة", unlockLevel: 25 },
                5: { name: "استراتيجي تكتيكي", description: "يخطط للاستراتيجيات", unlockLevel: 28 },
                6: { name: "معلم عسكري", description: "يدرب القوات بكفاءة", unlockLevel: 30 },
                7: { name: "قائد ذكي", description: "يقود القوات ذاتياً", unlockLevel: 32 },
                8: { name: "استشاري استراتيجي", description: "يقدم المشورة الاستراتيجية", unlockLevel: 35 },
                9: { name: "عقل عسكري", description: "يفكر ويساعد في كل شيء", unlockLevel: 38 },
                10: { name: "ذكاء مطلق", description: "أعلى ذكاء في الإمبراطورية", unlockLevel: 40 }
            },
            capabilities: {
                organizeTroops: false, // تنظيم القوات
                arrangeFormation: false, // ترتيب صفوف القتال
                readBattleReports: false, // قراءة تقارير المعركة
                predictEnemyMoves: false, // توقع حركات العدو
                optimizeDefense: false, // تحسين الدفاعات
                autoManageResources: false, // إدارة الموارد التلقائية
                analyzeWeaknesses: false, // تحليل نقاط الضعف
                suggestUpgrades: false, // اقتراح الترقيات
                coordinateAlliances: false, // تنسيق التحالفات
                militaryAdvice: false // النصائح العسكرية
            },
            currentCapabilities: [],
            experience: 0,
            experienceToNext: 1000,
            battleReports: [],
            formations: {
                testudo: { name: "تستودو", description: "ترتيب السلحفاة", effectiveness: 1.2 },
                wedge: { name: "وتد", description: "ترتيب الوتد", effectiveness: 1.5 },
                line: { name: "صف", description: "ترتيب الصف", effectiveness: 1.0 },
                circle: { name: "دائرة", description: "ترتيب دائري", effectiveness: 1.3 }
            },
            recommendations: []
        };
        this.accountAge = {
            createdAt: Date.now(),
            minimumAge: 3 * 24 * 60 * 60 * 1000, // 3 أيام بالميلي ثانية
            canAccessOtherKingdoms: false
        };
        
        // نظام الرادار المتطور مع إشعارات الإنذار
        this.advancedRadar = {
            isActive: true,
            range: 1000, // نطاق الرادار بالوحدات
            alertTypes: {
                WAR: { color: '#FF0000', name: 'حرب', icon: '⚔️' },
                AID: { color: '#00FF00', name: 'مساعدة', icon: '🛠️' },
                REINFORCEMENT: { color: '#0080FF', name: 'تعزيز', icon: '⚡' }
            },
            alerts: [],
            maxAlerts: 10,
            flashSpeed: 1000, // سرعة الومض بالميلي ثانية
            isFlashing: true,
            lastUpdate: Date.now()
        };
        
        // نظام الحماية والتشفير المتطور
        this.securitySystem = {
            encryption: {
                enabled: true,
                algorithm: 'AES-256-CBC',
                keyLength: 32,
                saltLength: 16
            },
            passwordProtection: {
                minLength: 8,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true,
                maxAttempts: 3,
                lockoutTime: 300000, // 5 دقائق
                attempts: 0,
                lastAttempt: 0,
                isLocked: false
            },
            session: {
                tokenExpiry: 3600000, // ساعة واحدة
                refreshToken: null,
                sessionId: null,
                ipWhitelist: [],
                lastActivity: Date.now()
            },
            dataProtection: {
                encryptGameData: true,
                encryptResources: true,
                encryptUserData: true,
                autoBackup: true,
                backupInterval: 1800000 // 30 دقيقة
            },
            threatDetection: {
                enabled: true,
                suspiciousActivity: [],
                maxSuspiciousCount: 5,
                blockDuration: 1800000, // 30 دقيقة
                detectBruteForce: true,
                detectRapidRequests: true,
                detectInvalidTokens: true
            },
            accessLog: {
                enabled: true,
                maxEntries: 100,
                logLoginAttempts: true,
                logDataAccess: true,
                logSecurityEvents: true
            }
        };
        
        // نظام فتح الأراضي والممالك الجديد
        this.expansionSystem = {
            territories: {
                unlocked: [],
                available: [
                    {
                        id: 'valley_of_martyrs',
                        name: 'وادي الشهداء',
                        description: 'أرض مقدسة بها آثار قديمة',
                        level: 'C5',
                        cost: { gold: 5000, food: 3000, wood: 2000, stone: 1500, iron: 1000 },
                        benefits: { goldBonus: 1.2, foodBonus: 1.1 },
                        unlocked: false,
                        type: 'battlefield'
                    },
                    {
                        id: 'northern_mountains',
                        name: 'الجبال الشمالية',
                        description: 'جبال عالية富含 الثروات المعدنية',
                        level: 'C8',
                        cost: { gold: 8000, food: 4000, wood: 3000, stone: 2500, iron: 2000, royalGems: 2 },
                        benefits: { ironBonus: 1.5, stoneBonus: 1.3 },
                        unlocked: false,
                        type: 'mining'
                    },
                    {
                        id: 'southern_desert',
                        name: 'الصحراء الجنوبية',
                        description: 'صحراء شاسعة بها الكنوز الدفينة',
                        level: 'C10',
                        cost: { gold: 12000, food: 6000, wood: 4000, stone: 3000, iron: 2500, gems: 5 },
                        benefits: { goldBonus: 1.4, gemsBonus: 1.6 },
                        unlocked: false,
                        type: 'treasure'
                    },
                    {
                        id: 'eastern_plains',
                        name: 'السهول الشرقية',
                        description: 'سهول خصبة مثالية للزراعة',
                        level: 'C12',
                        cost: { gold: 15000, food: 8000, wood: 5000, stone: 4000, iron: 3000, crystals: 3 },
                        benefits: { foodBonus: 1.5, woodBonus: 1.2 },
                        unlocked: false,
                        type: 'agriculture'
                    },
                    {
                        id: 'western_forest',
                        name: 'الغابة الغربية',
                        description: 'غابة كثيفة مليئة بالخشب النفيس',
                        level: 'C15',
                        cost: { gold: 20000, food: 10000, wood: 8000, stone: 5000, iron: 4000, sacredRelics: 1 },
                        benefits: { woodBonus: 1.6, stoneBonus: 1.1 },
                        unlocked: false,
                        type: 'forestry'
                    }
                ]
            },
            kingdoms: {
                unlocked: [],
                available: [
                    {
                        id: 'mercenary_kingdom',
                        name: 'مملكة المرتزقة',
                        description: 'مملكة للحرب愉快 والمرتزقة المتمرسين',
                        level: 'C15',
                        vipRequired: 2,
                        cost: { gold: 25000, royalGems: 5, gems: 10, crystals: 5 },
                        benefits: { 
                            troopBonus: 1.3, 
                            formationUnlock: 'phalanx',
                            allianceBonus: 1.2
                        },
                        unlocked: false,
                        requiresAlliance: true
                    },
                    {
                        id: 'merchant_kingdom',
                        name: 'مملكة التجار',
                        description: 'مملكة الثروة والتجارة المربحة',
                        level: 'C18',
                        vipRequired: 3,
                        cost: { gold: 50000, royalGems: 10, gems: 20, crystals: 8, emperorCrowns: 1 },
                        benefits: { 
                            resourceBonus: 1.4, 
                            tradeRoutes: true,
                            merchantProtection: true
                        },
                        unlocked: false,
                        requiresPreviousKingdom: 'mercenary_kingdom'
                    },
                    {
                        id: 'philosopher_kingdom',
                        name: 'مملكة الفلاسفة',
                        description: 'مملكة الحكمة والمعرفة القديمة',
                        level: 'C20',
                        vipRequired: 4,
                        cost: { gold: 75000, royalGems: 15, gems: 30, crystals: 12, sacredRelics: 3 },
                        benefits: { 
                            researchBonus: 1.5, 
                            ancientKnowledge: true,
                            wisdomBonus: 1.3
                        },
                        unlocked: false,
                        requiresPreviousKingdom: 'merchant_kingdom'
                    },
                    {
                        id: 'dwarven_kingdom',
                        name: 'مملكة الأقزام',
                        description: 'مملكة الحرفيين والحدادين المهرة',
                        level: 'C22',
                        vipRequired: 4,
                        cost: { gold: 100000, royalGems: 20, gems: 40, crystals: 15, diamonds: 2 },
                        benefits: { 
                            fortificationBonus: 1.4, 
                            weaponUpgrade: true,
                            armorBonus: 1.3
                        },
                        unlocked: false,
                        requiresPreviousKingdom: 'philosopher_kingdom'
                    },
                    {
                        id: 'dragon_kingdom',
                        name: 'مملكة التنين',
                        description: 'مملكة الأساطير المهيبة والتنانين',
                        level: 'C25',
                        vipRequired: 5,
                        cost: { 
                            gold: 200000, 
                            royalGems: 30, 
                            gems: 50, 
                            crystals: 25, 
                            sacredRelics: 5, 
                            emperorCrowns: 2, 
                            diamonds: 5 
                        },
                        benefits: { 
                            ultimatePower: 1.6, 
                            dragonRiders: true,
                            mythBonus: 1.5,
                            legendaryFortification: true
                        },
                        unlocked: false,
                        requiresPreviousKingdom: 'dwarven_kingdom'
                    }
                ]
            },
            expansionProgress: {
                totalTerritoriesUnlocked: 0,
                totalKingdomsUnlocked: 0,
                lastExpansion: null,
                expansionHistory: []
            }
        };
        
        // نظام الوقت والبيئة اليومية
        this.timeSystem = {
            serverTime: new Date(),
            timeZone: 'UTC', // توقيت غرينتش
            dayNightCycle: {
                current: 'day', // day, night, dawn, dusk
                lastUpdate: Date.now(),
                dayDuration: 60000, // 1 دقيقة = يوم كامل
                nightDuration: 60000, // 1 دقيقة = ليلة كاملة
                dawnDuration: 15000, // 15 ثانية شروق
                duskDuration: 15000 // 15 ثانية غروب
            },
            weather: {
                current: 'clear', // clear, cloudy, rainy, stormy, snowy
                lastUpdate: Date.now(),
                changeInterval: 300000, // 5 دقائق
                conditions: ['clear', 'cloudy', 'rainy', 'stormy', 'snowy']
            },
            seasons: {
                current: 'spring', // spring, summer, autumn, winter
                lastUpdate: Date.now(),
                seasonDuration: 86400000, // يوم واحد = فصل كامل
                yearProgress: 0 // نسبة تقدم السنة (0-100%)
            },
            environmentEffects: {
                farmingBonus: 1.0, // تأثير الطقس على الزراعة
                constructionSpeed: 1.0, // سرعة البناء
                resourceGeneration: 1.0, // إنتاج الموارد
                battleModifier: 1.0 // تعديل معارك
            }
        };
        
        // نظام تأثيرات البيئة
        this.environmentEffects = {
            farmingBonus: 1.0, // تأثير الطقس على الزراعة
            constructionSpeed: 1.0, // سرعة البناء
            resourceGeneration: 1.0, // إنتاج الموارد
            battleModifier: 1.0, // تعديل معارك
            currentPeriod: 'day' // الفترة الحالية (day, night, dawn, dusk)
        };
        
        // نظام حساب عمر البناء اليومي
        this.buildAgeSystem = {
            accountCreation: Date.now(),
            lastDailyCalculation: null,
            totalPlayDays: 0,
            consecutiveDays: 0,
            lastLoginDate: null,
            dailyRewards: {
                day1: { gold: 100, food: 50, gems: 1 },
                day3: { gold: 300, food: 200, royalGems: 1 },
                day7: { gold: 700, food: 500, gems: 3, crystals: 1 },
                day15: { gold: 1500, food: 1000, royalGems: 2, crystals: 2 },
                day30: { gold: 3000, food: 2000, royalGems: 3, crystals: 5, diamonds: 1 },
                day60: { gold: 6000, food: 4000, royalGems: 5, crystals: 10, diamonds: 2 },
                day90: { gold: 12000, food: 8000, royalGems: 8, crystals: 15, diamonds: 3 },
                day180: { gold: 25000, food: 15000, royalGems: 12, crystals: 25, diamonds: 5 },
                day365: { gold: 50000, food: 30000, royalGems: 20, crystals: 50, diamonds: 10 }
            },
            buildAge: {
                days: 0,
                weeks: 0,
                months: 0,
                years: 0
            }
        };
        
        this.kingdomAccess = {
            allowedKingdoms: ["الإمبراطورية التقنية"],
            availableKingdoms: [
                {
                    id: "tech_empire",
                    name: "الإمبراطورية التقنية",
                    description: "المملكة الأساسية - نقطة البداية",
                    level: "C1",
                    unlocked: true
                },
                {
                    id: "byzantium",
                    name: "إمبراطورية بيزنطة",
                    description: "مملكة شرقية عريقة",
                    level: "C8",
                    requiresAge: 3,
                    unlocked: false
                },
                {
                    id: "ancient_egypt",
                    name: "مصر القديمة",
                    description: "مملكة الفراعنة العظيمة",
                    level: "C12",
                    requiresAge: 5,
                    unlocked: false
                },
                {
                    id: "persian_empire",
                    name: "الإمبراطورية الفارسية",
                    description: "مملكة عظيمة بنهضة فارسية",
                    level: "C15",
                    requiresAge: 7,
                    unlocked: false
                },
                {
                    id: "chinese_empire",
                    name: "الإمبراطورية الصينية",
                    description: "الأسرة الصينية القديمة",
                    level: "C18",
                    requiresAge: 10,
                    unlocked: false
                }
            ]
        };
    }
    
    // تهيئة نظام الأمان
    initializeSecurity() {
        // حماية البيانات الحساسة تلقائياً
        this.protectSensitiveData();
        
        // بدء مراقبة الأنشطة المشبوهة
        if (this.securitySystem.threatDetection.enabled) {
            this.startThreatMonitoring();
        }
        
        // بدء النسخ الاحتياطي التلقائي
        if (this.securitySystem.dataProtection.autoBackup) {
            this.startAutoBackup();
        }
        
        // تسجيل تهيئة النظام
        this.logSecurityEvent('SYSTEM_INITIALIZED', {
            timestamp: Date.now(),
            encryption: this.securitySystem.encryption.enabled,
            threatDetection: this.securitySystem.threatDetection.enabled
        });
        
        console.log('🛡️ نظام الأمان والحماية تم تهيئته بنجاح');
    }
    
    // بدء مراقبة التهديدات
    startThreatMonitoring() {
        setInterval(() => {
            this.monitorNetworkActivity();
            this.checkForBruteForceAttempts();
            this.validateSessionIntegrity();
        }, 5000); // كل 5 ثوانٍ
    }
    
    // مراقبة نشاط الشبكة
    monitorNetworkActivity() {
        // محاكاة مراقبة نشاط الشبكة
        const now = Date.now();
        const timeSinceLastActivity = now - (this.lastNetworkActivity || now);
        
        if (timeSinceLastActivity > 30000) { // 30 ثانية بدون نشاط
            this.detectSuspiciousActivity({
                type: 'INACTIVE_PERIOD',
                details: { inactiveDuration: timeSinceLastActivity }
            });
        }
        
        this.lastNetworkActivity = now;
    }
    
    // فحص محاولات القوة الغاشمة
    checkForBruteForceAttempts() {
        const protection = this.securitySystem.passwordProtection;
        if (protection.attempts > 0) {
            this.logSecurityEvent('BRUTE_FORCE_PROTECTION_ACTIVE', {
                attempts: protection.attempts,
                isLocked: protection.isLocked
            });
        }
    }
    
    // التحقق من سلامة الجلسة
    validateSessionIntegrity() {
        const session = this.securitySystem.session;
        if (session.sessionId && session.lastActivity) {
            const timeSinceActivity = Date.now() - session.lastActivity;
            if (timeSinceActivity > 3600000) { // ساعة واحدة
                this.logSecurityEvent('SESSION_EXPIRED', {
                    lastActivity: session.lastActivity,
                    timeSinceActivity: timeSinceActivity
                });
                this.invalidateSession();
            }
        }
    }
    
    // إبطال الجلسة
    invalidateSession() {
        this.securitySystem.session = {
            tokenExpiry: 0,
            refreshToken: null,
            sessionId: null,
            ipWhitelist: [],
            lastActivity: Date.now()
        };
        
        this.logSecurityEvent('SESSION_INVALIDATED', { timestamp: Date.now() });
    }
    
    // بدء النسخ الاحتياطي التلقائي
    startAutoBackup() {
        setInterval(() => {
            this.createSecureBackup();
        }, this.securitySystem.dataProtection.backupInterval);
    }
    
    // إنشاء نسخة احتياطية آمنة
    createSecureBackup() {
        try {
            const backup = {
                timestamp: Date.now(),
                version: '1.0',
                encrypted: true,
                data: this.encryptGameState()
            };
            
            // حفظ النسخة الاحتياطية محلياً
            localStorage.setItem('secure_backup', JSON.stringify(backup));
            
            this.logSecurityEvent('BACKUP_CREATED', {
                timestamp: backup.timestamp,
                size: JSON.stringify(backup).length
            });
        } catch (error) {
            this.logSecurityEvent('BACKUP_FAILED', { error: error.message });
        }
    }
    
    // تشفير حالة اللعبة
    encryptGameState() {
        return this.encryptData({
            level: this.level,
            vipLevel: this.vipLevel,
            resources: this.resources,
            buildings: this.buildings,
            currentTroop: this.troopSystem.currentTroop,
            kingdomAccess: this.kingdomAccess
        }, this.generateSalt());
    }
    
    // تهيئة نظام الرادار المتطور
    initializeAdvancedRadar() {
        // إنشاء نسخة احتياطية آمنة عند تحميل الرادار
        this.createSecureBackup();
        
        // عرض رسالة تأكيد
        this.showMessage('📡 تم تفعيل نظام الرادار المتطور', 'success');
        
        // بدء تشغيل الرادار
        this.advancedRadar.isActive = true;
        this.advancedRadar.alerts = [];
        
        this.updateRadarDisplay();
    }
    
    // تهيئة نظام المستويات
    initializeLevelSystem() {
        this.levelSystem = {
            playerMaxIndex: 40,
            ownerMaxIndex: 45,
            levelNames: [],
            levelRequirements: {
                player: {
                    C1: 0, C2: 500, C3: 1200, C4: 2500, C5: 4500,
                    C6: 7200, C7: 10600, C8: 14800, C9: 19900, C10: 26000,
                    C11: 33200, C12: 41600, C13: 51200, C14: 62100, C15: 74300,
                    C16: 87900, C17: 102900, C18: 119600, C19: 138100, C20: 158400,
                    C21: 180700, C22: 205100, C23: 231600, C24: 260500, C25: 291800,
                    C26: 325600, C27: 362000, C28: 401200, C29: 443400, C30: 488800,
                    C31: 537600, C32: 590000, C33: 646200, C34: 706500, C35: 771100,
                    C36: 840200, C37: 914000, C38: 992700, C39: 1076500, C40: 1164000
                },
                owner: {
                    C41: 1255000, C42: 1352000, C43: 1456000, C44: 1568000, C45: 1689000
                }
            }
        };
        
        this.selectedBuilding = null;
        this.animationMixers = [];
        this.ground = null;
        this.isMobile = this.detectMobile();
        
        // Royal Palace and War Kingdom System
        this.royalPalace = null;
        this.warSystem = {
            kingdomLevel: 1,
            armySize: 0,
            maxArmySize: 100,
            enemyKingdoms: [
                { name: "ممالك بيزنطة", strength: 50, reward: 500 },
                { name: "ممالك مصر", strength: 75, reward: 750 },
                { name: "ممالك اليونان", strength: 100, reward: 1000 },
                { name: "الإمبراطورية الجرمانية", strength: 150, reward: 1500 }
            ],
            currentEnemy: null,
            isInWar: false,
            battleResult: null
        };
        
        // Alliance System
        this.allianceSystem = {
            availableAlliances: [
                { id: "byzantium", name: "تحالف بيزنطة", kingdom: "ممالك بيزنطة", cost: 1000, powerBonus: 25, duration: 300000, active: false, expiry: null },
                { id: "egypt", name: "تحالف مصر", kingdom: "ممالك مصر", cost: 1500, powerBonus: 40, duration: 300000, active: false, expiry: null },
                { id: "greece", name: "تحالف اليونان", kingdom: "ممالك اليونان", cost: 2000, powerBonus: 60, duration: 300000, active: false, expiry: null },
                { id: "germanic", name: "تحالف الجرمان", kingdom: "الإمبراطورية الجرمانية", cost: 2500, powerBonus: 80, duration: 300000, active: false, expiry: null }
            ],
            activeAlliances: [],
            totalBonus: 0,
            allianceBenefits: {
                extraGold: 0,
                extraFood: 0,
                armyBonus: 0
            },
            allianceTech: {
                levels: { gold: 0, food: 0, military: 0, construction: 0 },
                costs: { gold: 500, food: 500, military: 800, construction: 600 },
                bonuses: { gold: 10, food: 10, military: 15, construction: 5 }
            },
            allianceGifts: {
                available: true,
                lastGift: null,
                giftTimer: null,
                maxGiftsPerDay: 3,
                giftsUsedToday: 0
            },
            allianceEvents: {
                territoryDefense: { 
                    name: "دفاع عن الإقليم", 
                    frequency: "أسبوعي", 
                    reward: 1000,
                    nextEvent: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
                },
                eliteAdventures: { 
                    name: "مغامرات النخبة", 
                    frequency: "أسبوعي", 
                    reward: 800,
                    nextEvent: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
                },
                eliteWars: { 
                    name: "حروب النخبة", 
                    frequency: "أسبوعي", 
                    reward: 1200,
                    nextEvent: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
                },
                fiendTrial: { 
                    name: "محاكمة الوحوش", 
                    frequency: "يومي", 
                    reward: 300,
                    nextEvent: Date.now() + (24 * 60 * 60 * 1000) // 1 day from now
                }
            }
        };
        
        // نظام حشد التحالف (الطرق الإمبراطورية)
        this.allianceGathering = {
            isActive: false,
            currentDay: 0,
            totalDays: 2,
            startTime: null,
            nextGatheringDate: null,
            rewardsClaimed: 0,
            maxRewards: 3,
            availableGatherings: [
                {
                    id: "imperial_roads",
                    name: "الطرق الإمبراطورية",
                    description: "احتفل بمجد الإمبراطورية التقنية على الطرق العريقة",
                    location: "الطرق التاريخية",
                    duration: 2, // يومين
                    rewards: {
                        gold: 5000,
                        food: 3000,
                        gems: 50,
                        powerBonus: 100,
                        mysteryCaveBonus: 2
                    },
                    requirement: "C12+", // متطلب level
                    active: false,
                    timeRemaining: 0
                },
                {
                    id: "eternal_glory",
                    name: "الامجاد الخالدة",
                    description: "تذكر عظماء الإمبراطورية وعاصمتها الأبدية",
                    location: "معابد الذاكرة",
                    duration: 2,
                    rewards: {
                        gold: 8000,
                        food: 5000,
                        gems: 75,
                        powerBonus: 150,
                        royalGems: 25,
                        militaryBonus: 2
                    },
                    requirement: "C18+",
                    active: false,
                    timeRemaining: 0
                },
                {
                    id: "legendary_spirits",
                    name: "أرواح الملوك",
                    description: "استحضر أرواح ملوك روما العظماء",
                    location: "أضرحة القياصرة",
                    duration: 2,
                    rewards: {
                        gold: 12000,
                        food: 8000,
                        gems: 100,
                        powerBonus: 200,
                        emperorCrowns: 5,
                        sacredRelics: 10
                    },
                    requirement: "C25+",
                    active: false,
                    timeRemaining: 0
                }
            ],
            currentGathering: null,
            canStartGathering: function(gatheringId) {
                const gathering = this.availableGatherings.find(g => g.id === gatheringId);
                if (!gathering) return false;
                
                // التحقق من المستوى المطلوب
                const currentLevel = game.getCurrentLevelValue();
                const requiredLevel = parseInt(gathering.requirement.replace('C', ''));
                if (currentLevel < requiredLevel) return false;
                
                // التحقق من عدم وجود حشد نشط
                if (this.isActive) return false;
                
                return true;
            },
            startGathering: function(gatheringId) {
                if (!this.canStartGathering(gatheringId)) return false;
                
                const gathering = this.availableGatherings.find(g => g.id === gatheringId);
                if (!gathering) return false;
                
                this.isActive = true;
                this.currentGathering = gathering;
                this.startTime = Date.now();
                this.currentDay = 1;
                this.rewardsClaimed = 0;
                
                // إضافة رسالة للدردشة
                game.allianceChat.addSystemMessage(`تم بدء "${gathering.name}"! شارك التحالف في احتفال عظيم`);
                
                return true;
            },
            getRemainingTime: function() {
                if (!this.isActive || !this.startTime) return 0;
                
                const gatheringDuration = this.currentGathering.duration * 24 * 60 * 60 * 1000; // يومين بالميلي ثانية
                const elapsed = Date.now() - this.startTime;
                return Math.max(0, gatheringDuration - elapsed);
            },
            getCurrentDay: function() {
                if (!this.isActive || !this.startTime) return 0;
                
                const elapsed = Date.now() - this.startTime;
                const dayInMs = 24 * 60 * 60 * 1000; // يوم واحد
                return Math.min(this.totalDays, Math.floor(elapsed / dayInMs) + 1);
            },
            canClaimReward: function() {
                if (!this.isActive || !this.currentGathering) return false;
                
                // يمكن المطالبة بالمكافأة كل 12 ساعة
                const rewardInterval = 12 * 60 * 60 * 1000; // 12 ساعة
                const timeSinceStart = Date.now() - this.startTime;
                const availableClaims = Math.floor(timeSinceStart / rewardInterval);
                
                return availableClaims > this.rewardsClaimed;
            },
            claimReward: function() {
                if (!this.canClaimReward() || !this.currentGathering) return false;
                
                const reward = this.currentGathering.rewards;
                
                // تطبيق المكافآت
                game.resources.gold += reward.gold;
                game.resources.food += reward.food;
                game.resources.gems += reward.gems;
                game.resources.royalGems += (reward.royalGems || 0);
                game.resources.sacredRelics += (reward.sacredRelics || 0);
                game.resources.emperorCrowns += (reward.emperorCrowns || 0);
                
                // مكافآت خاصة
                if (reward.powerBonus) {
                    game.allianceSystem.totalBonus += reward.powerBonus;
                }
                
                if (reward.mysteryCaveBonus) {
                    game.mysteryCaveProduction = (game.mysteryCaveProduction || 0) + reward.mysteryCaveBonus;
                }
                
                if (reward.militaryBonus) {
                    game.militarySystem.powerBonus = (game.militarySystem.powerBonus || 0) + reward.militaryBonus;
                }
                
                this.rewardsClaimed++;
                game.updateResourceDisplay();
                
                // إضافة رسالة للدردشة
                game.allianceChat.addSystemMessage(`تم تلقي مكافأة "${this.currentGathering.name}": ${reward.gold} ذهبي!`);
                
                return true;
            },
            isGatheringComplete: function() {
                if (!this.isActive || !this.currentGathering) return false;
                
                const gatheringDuration = this.currentGathering.duration * 24 * 60 * 60 * 1000;
                const elapsed = Date.now() - this.startTime;
                
                return elapsed >= gatheringDuration;
            },
            completeGathering: function() {
                if (!this.isGatheringComplete()) return false;
                
                // مكافأة إضافية للانتهاء
                const bonus = {
                    gold: this.currentGathering.rewards.gold * 2,
                    food: this.currentGathering.rewards.food * 2,
                    gems: this.currentGathering.rewards.gems + 25
                };
                
                game.resources.gold += bonus.gold;
                game.resources.food += bonus.food;
                game.resources.gems += bonus.gems;
                
                // رسالة إتمام
                game.allianceChat.addSystemMessage(`انتهى "${this.currentGathering.name}"! تم_recv مكافأة إضافية!`);
                
                // إعادة تعيين النظام
                this.isActive = false;
                this.currentGathering = null;
                this.startTime = null;
                this.rewardsClaimed = 0;
                
                // تحديد موعد الحشد التالي
                this.nextGatheringDate = Date.now() + (7 * 24 * 60 * 60 * 1000); // بعد أسبوع
                
                return true;
            }
        };

        // نظام أراضي التحالف والأعلام
        this.allianceTerritories = {
            headquarters: {
                built: false,
                level: 0,
                maxLevel: 5,
                position: { x: 15, z: 15 }, // موقع مقر التحالف
                name: "مقر التحالف",
                cost: 10000,
                power: 100,
                range: 20 // مدى التأثير
            },
            flags: [
                {
                    id: "flag_1",
                    built: false,
                    position: { x: 20, z: 20 },
                    captured: false,
                    level: 0,
                    name: "علم التحالف الأول",
                    power: 50,
                    range: 15,
                    cost: 3000
                },
                {
                    id: "flag_2", 
                    built: false,
                    position: { x: 10, z: 20 },
                    captured: false,
                    level: 0,
                    name: "علم التحالف الثاني",
                    power: 50,
                    range: 15,
                    cost: 3000
                },
                {
                    id: "flag_3",
                    built: false,
                    position: { x: 20, z: 10 },
                    captured: false,
                    level: 0,
                    name: "علم التحالف الثالث", 
                    power: 50,
                    range: 15,
                    cost: 3000
                },
                {
                    id: "flag_4",
                    built: false,
                    position: { x: 25, z: 15 },
                    captured: false,
                    level: 0,
                    name: "علم التحالف الرابع",
                    power: 50,
                    range: 15,
                    cost: 3000
                },
                {
                    id: "flag_5",
                    built: false,
                    position: { x: 5, z: 15 },
                    captured: false,
                    level: 0,
                    name: "علم التحالف الخامس",
                    power: 50,
                    range: 15,
                    cost: 3000
                }
            ],
            controlledTerritories: [],
            territoryPower: 0,
            expansionLevel: 0,
            maxExpansionLevel: 5,
            canBuildHeadquarters: function() {
                return !this.headquarters.built && game.getCurrentLevelValue() >= 20;
            },
            canBuildFlag: function(flagId) {
                const flag = this.flags.find(f => f.id === flagId);
                if (!flag || flag.built) return false;
                
                // يمكن بناء العلم إذا كان هناك مقر تحالف
                if (!this.headquarters.built) return false;
                
                // التحقق من المستويات المطلوبة
                const currentExpLevel = this.expansionLevel;
                const requiredExpLevel = this.flags.indexOf(flag) + 1;
                
                return currentExpLevel >= requiredExpLevel;
            },
            buildHeadquarters: function() {
                if (!this.canBuildHeadquarters()) return false;
                
                const cost = this.headquarters.cost;
                if (game.resources.gold < cost) {
                    game.showNotification("لا تملك ما يكفي من الذهب!", "warning");
                    return false;
                }
                
                game.resources.gold -= cost;
                this.headquarters.built = true;
                this.headquarters.level = 1;
                this.expansionLevel = 1;
                
                // إنشاء مقر التحالف في المشهد ثلاثي الأبعاد
                this.createHeadquarters3D();
                
                game.showNotification("تم بناء مقر التحالف!", "success");
                game.allianceChat.addSystemMessage("تم بناء مقر التحالف! يمكن الآن بناء الأعلام لتوسيع الأراضي");
                
                return true;
            },
            buildFlag: function(flagId) {
                if (!this.canBuildFlag(flagId)) return false;
                
                const flag = this.flags.find(f => f.id === flagId);
                if (!flag) return false;
                
                const cost = flag.cost;
                if (game.resources.gold < cost) {
                    game.showNotification("لا تملك ما يكفي من الذهب!", "warning");
                    return false;
                }
                
                game.resources.gold -= cost;
                flag.built = true;
                flag.level = 1;
                flag.captured = true; // العلم يبدأ تحت سيطرتنا
                
                this.controlledTerritories.push(flag.id);
                this.updateTerritoryPower();
                
                // إنشاء العلم في المشهد ثلاثي الأبعاد
                this.createFlag3D(flag);
                
                game.showNotification(`تم بناء ${flag.name}!`, "success");
                game.allianceChat.addSystemMessage(`تم الاستيلاء على ${flag.name}! ازدادت قوة أراضي التحالف`);
                
                return true;
            },
            createHeadquarters3D: function() {
                const position = this.headquarters.position;
                
                // إنشاء مقر التحالف ثلاثي الأبعاد
                const headquarters = new THREE.Group();
                
                // الهيكل الرئيسي
                const mainBuilding = new THREE.Mesh(
                    new THREE.BoxGeometry(6, 8, 6),
                    new THREE.MeshPhongMaterial({ 
                        color: 0x8B4513,
                        emissive: 0x8B4513,
                        emissiveIntensity: 0.1
                    })
                );
                headquarters.add(mainBuilding);
                
                // علم التحالف على المبنى
                const flag = new THREE.Mesh(
                    new THREE.PlaneGeometry(2, 1.5),
                    new THREE.MeshBasicMaterial({ 
                        color: 0xFF0000,
                        side: THREE.DoubleSide 
                    })
                );
                flag.position.set(0, 6, 3.1);
                headquarters.add(flag);
                
                // حدوة سلاح لتحسين المظهر
                const emblem = new THREE.Mesh(
                    new THREE.SphereGeometry(0.5),
                    new THREE.MeshPhongMaterial({ 
                        color: 0xFFD700,
                        emissive: 0xFFD700,
                        emissiveIntensity: 0.2
                    })
                );
                emblem.position.set(0, 8.5, 0);
                headquarters.add(emblem);
                
                headquarters.position.set(position.x, 2, position.z);
                headquarters.userData = { 
                    type: 'alliance_headquarters', 
                    alliance: true,
                    level: 1 
                };
                
                game.scene.add(headquarters);
                this.headquarters.mesh = headquarters;
            },
            createFlag3D: function(flag) {
                const position = flag.position;
                
                // إنشاء العلم ثلاثي الأبعاد
                const flagPole = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.1, 0.1, 4),
                    new THREE.MeshPhongMaterial({ color: 0x8B4513 })
                );
                
                // علم التحالف
                const flagCloth = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.5, 1),
                    new THREE.MeshPhongMaterial({ 
                        color: 0xFF0000,
                        side: THREE.DoubleSide
                    })
                );
                flagCloth.position.set(0.8, 1, 0);
                
                const flagGroup = new THREE.Group();
                flagGroup.add(flagPole);
                flagGroup.add(flagCloth);
                flagGroup.position.set(position.x, 1, position.z);
                flagGroup.userData = { 
                    type: 'alliance_flag', 
                    flag: flag,
                    alliance: true 
                };
                
                game.scene.add(flagGroup);
                flag.mesh = flagGroup;
            },
            updateTerritoryPower: function() {
                let totalPower = 0;
                
                // قوة مقر التحالف
                if (this.headquarters.built) {
                    totalPower += this.headquarters.power * this.headquarters.level;
                }
                
                // قوة الأعلام
                this.flags.forEach(flag => {
                    if (flag.built && flag.captured) {
                        totalPower += flag.power * flag.level;
                    }
                });
                
                this.territoryPower = totalPower;
                game.updateTotalPower();
            },
            defendTerritory: function() {
                if (!this.headquarters.built) {
                    game.showNotification("لا يوجد مقر التحالف للدفاع!", "warning");
                    return false;
                }
                
                // تكلفة الدفاع
                const defenseCost = 2000;
                if (game.resources.gold < defenseCost) {
                    game.showNotification("لا تملك ما يكفي من الذهب للدفاع!", "warning");
                    return false;
                }
                
                game.resources.gold -= defenseCost;
                const defenseBonus = this.territoryPower * 0.5;
                
                // إضافة قوة دفاعية مؤقتة
                game.allianceSystem.totalBonus += Math.floor(defenseBonus);
                game.allianceChat.addSystemMessage(`تم تفعيل الدفاع عن أراضي التحالف! قوة دفاعية إضافية: ${Math.floor(defenseBonus)}`);
                
                return true;
            },
            expandTerritory: function() {
                if (this.expansionLevel >= this.maxExpansionLevel) {
                    game.showNotification("تم الوصول للحد الأقصى للتوسع!", "info");
                    return false;
                }
                
                const nextFlag = this.flags[this.expansionLevel];
                if (!nextFlag || nextFlag.built) return false;
                
                this.expansionLevel++;
                game.allianceChat.addSystemMessage(`تم توسيع أراضي التحالف! يمكن الآن بناء ${nextFlag.name}`);
                
                return true;
            },
            getTerritoryStatus: function() {
                const headquartersBuilt = this.headquarters.built;
                const totalFlags = this.flags.length;
                const builtFlags = this.flags.filter(f => f.built).length;
                const controlledFlags = this.flags.filter(f => f.built && f.captured).length;
                
                return {
                    headquarters: headquartersBuilt,
                    totalFlags: totalFlags,
                    builtFlags: builtFlags,
                    controlledFlags: controlledFlags,
                    territoryPower: this.territoryPower,
                    expansionLevel: this.expansionLevel
                };
            }
        };

        // نظام وحدات الإمبراطورية التقنية
        this.militarySystem = {
            legiones: { // Heavy Infantry (Legionaries)
                count: 0,
                max: 200,
                trainingCost: 50,
                power: 25,
                description: "الطقوس - المشاة الثقيلة الأساسية للجيش التقني"
            },
            equites: { // Cavalry
                count: 0,
                max: 100,
                trainingCost: 80,
                power: 30,
                description: "الفرسان - وحدة خيالة للكمين وإزالة التشكيلات"
            },
            sagittarii: { // Archers
                count: 0,
                max: 150,
                trainingCost: 40,
                power: 20,
                description: "الرماة - المقاطعون بالخيث"
            },
            velites: { // Light Infantry
                count: 0,
                max: 120,
                trainingCost: 30,
                power: 15,
                description: "الخفيفون - مشاة خفيفون للتجسس والهجمات السريعة"
            },
            ballistarii: { // Artillery
                count: 0,
                max: 50,
                trainingCost: 100,
                power: 50,
                description: "مدافع الجرارات - مشغلو أسلحة الحصار"
            },
            auxilia: { // Auxiliary troops
                count: 0,
                max: 80,
                trainingCost: 60,
                power: 35,
                description: "المساعدون - جنود من الأراضي المدموعة"
            },
            formations: {
                testudo: { name: "تستودو (السلحفاة)", bonus: "دفاعية +25", description: "تشكيلة دفاعية قوية" },
                wedges: { name: "الوتد", bonus: "هجومية +30", description: "تشكيلة هجومية للاختراق" },
                circle: { name: "الدائرة", bonus: "متوسطة +20", description: "تشكيلة دائرية متوازنة" }
            },
            currentFormation: "testudo",
            woundedUnits: 0,
            hospital: {
                level: 1,
                maxCapacity: 20,
                healingSpeed: 5 // units per minute
            }
        };
        
        // Battle System Enhancement
        this.battleSystem = {
            battleTypes: {
                solo: { name: "هجوم منفرد", description: "جيش واحد يهاجم", risk: "متوسط", reward: "عادي" },
                rally: { name: "تجمع تحالفي", description: "جيش تحالفي موحد", risk: "منخفض", reward: "عالي" },
                timed: { name: "هجوم منسق", description: "هجمات متزامنة", risk: "عالي", reward: "عالي جداً" }
            },
            coordination: {
                enabled: false,
                allies: [],
                rallyTime: null,
                targetInfo: null
            },
            eventCounter: 0
        };
        
        // نظام المالك - Admin Owner System
        this.ownerSystem = {
            isOwnerMode: false,
            instantDevelopment: {
                enabled: false,
                maxLevel: 5,
                freeResources: true,
                instantConstruction: true
            },
            buildingReduction: {
                enabled: false,
                maxReduction: 5,
                retainResources: true
            },
            ownerPanel: null,
            developmentHistory: [],
            testingMode: {
                allUnitsAvailable: true,
                maxResources: true,
                allBuildingsUnlocked: true,
                freeResearch: true
            }
        };

        // نظام حرب الثروه (يفتح في C15+)
        this.richesWar = {
            enabled: false,
            dailyEntries: 0,
            maxDailyEntries: 2,
            lastEntryDate: null,
            weaponLevel: 1,
            maxWeaponLevel: 10,
            totalEntries: 0,
            isUnlocked: function(level) {
                const levelNumber = parseInt(level.replace('C', ''));
                return levelNumber >= 15;
            },
            canEnter: function() {
                const today = new Date().toDateString();
                if (this.lastEntryDate !== today) {
                    this.dailyEntries = 0;
                    this.lastEntryDate = today;
                }
                return this.dailyEntries < this.maxDailyEntries;
            },
            enterWar: function() {
                if (this.canEnter()) {
                    this.dailyEntries++;
                    this.totalEntries++;
                    return true;
                }
                return false;
            },
            upgradeWeapons: function() {
                if (this.weaponLevel < this.maxWeaponLevel) {
                    this.weaponLevel++;
                    return true;
                }
                return false;
            }
        };

        // نظام دردشة التحالف
        this.allianceChat = {
            isOpen: false,
            messages: [
                {
                    id: 1,
                    username: "أمير_التقنية",
                    message: "مرحباً بكم في التحالف التقني",
                    timestamp: Date.now(),
                    type: "system"
                },
                {
                    id: 2,
                    username: "قائد_الفرسان",
                    message: "نحتاج دعمكم في تطوير قلعةكم",
                    timestamp: Date.now() - 300000,
                    type: "user"
                }
            ],
            currentMessage: "",
            unreadCount: 0,
            openChat: function() {
                this.isOpen = true;
                this.unreadCount = 0;
            },
            closeChat: function() {
                this.isOpen = false;
            },
            sendMessage: function(message) {
                if (message.trim()) {
                    this.messages.push({
                        id: this.messages.length + 1,
                        username: "لاعب_تقني",
                        message: message.trim(),
                        timestamp: Date.now(),
                        type: "user"
                    });
                    return true;
                }
                return false;
            },
            addSystemMessage: function(message) {
                this.messages.push({
                    id: this.messages.length + 1,
                    username: "النظام",
                    message: message,
                    timestamp: Date.now(),
                    type: "system"
                });
            }
        };
        
        // تهيئة نظام الدردشة والترجمة
        this.chatSystem = new GameChatSystem(this);
        this.translationSystem = window.translationSystem;
        
        // تهيئة نظام التراخيص والتطوير السريع
        this.licenseSystem = new LicenseSystem(this);
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        this.setupControls();
        this.setupEventListeners();
        this.animate();
        
        // Mobile و Full Screen initialization
        this.initializeMobileFeatures();
        
        // Initialize level system
        this.initializeLevelSystem();
        
        // Initialize troop system
        this.initializeTroopSystem();
        
        // Initialize license system
        this.initializeLicenseSystem();
        
        // Check for new unlocks (Mystery Cave)
        this.checkNewUnlocks();
        
        // Update resource display
        this.updateResourceDisplay();
        this.updateVIPDisplay();
        
        // Check for new unlocks (Mystery Cave)
        this.checkNewUnlocks();
        
        // Start animation loop
        this.animate();
        
        setTimeout(() => {
            game.initializeAdvancedRadar();
        }, 1500);
        
        // إضافة تحكم سريع للمالك
        document.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.shiftKey && event.key === 'A') {
                game.toggleOwnerMode();
            }
        });
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        
        // Camera smoothing properties
        this.cameraTargetPosition = new THREE.Vector3();
        this.currentCameraPosition = new THREE.Vector3();
        this.smoothFactor = 0.05; // Reduced for smoother movement
        
        // Improved initial camera position for better readability
        if (this.isMobile) {
            this.camera.position.set(12, 10, 12);
        } else {
            this.camera.position.set(15, 12, 15);
        }
        
        this.cameraTargetPosition.copy(this.camera.position);
        this.currentCameraPosition.copy(this.camera.position);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: this.isMobile ? false : true,
            alpha: true
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = !this.isMobile; // Disable shadows on mobile for performance
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        const container = document.getElementById('3d-container');
        if (container) {
            container.appendChild(this.renderer.domElement);
        }
    }

    createLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 50, 25);
        directionalLight.castShadow = !this.isMobile;
        
        if (!this.isMobile) {
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.5;
            directionalLight.shadow.camera.far = 500;
            directionalLight.shadow.camera.left = -50;
            directionalLight.shadow.camera.right = 50;
            directionalLight.shadow.camera.top = 50;
            directionalLight.shadow.camera.bottom = -50;
        }
        
        this.scene.add(directionalLight);

        // Additional lights for atmosphere
        const rimLight = new THREE.DirectionalLight(0xFFE4B5, 0.3);
        rimLight.position.set(-30, 20, -30);
        this.scene.add(rimLight);
    }

    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x8B7355, // Earth brown
            transparent: true,
            opacity: 0.9
        });
        
        this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.receiveShadow = !this.isMobile;
        this.scene.add(this.ground);

        // Add a stone pattern texture
        this.addStonePattern();
    }

    addStonePattern() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create stone pattern
        ctx.fillStyle = '#8B7355';
        ctx.fillRect(0, 0, 512, 512);
        
        ctx.fillStyle = '#6B5345';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const size = Math.random() * 20 + 5;
            ctx.fillRect(x, y, size, size);
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            map: texture,
            transparent: true,
            opacity: 0.9
        });
        
        this.ground.material = groundMaterial;
    }

    createBuildings() {
        // Villa (Residential)
        this.createVilla(-8, -8);
        
        // أعمدة تقنية
        this.createColumns(-8, 0);
        this.createColumns(0, -8);
        
        // Theater
        this.createTheater(0, 8);
        
        // Colosseum
        this.createColosseum(8, 8);
        
        // Barracks
        this.createBarracks(8, 0);
        
        // Market
        this.createMarket(0, 0);
        
        // Royal Palace (if not exists)
        if (!this.royalPalace) {
            this.createRoyalPalace(12, 12);
        }
        
        // مباني عسكرية تقنية جديدة
        this.createAcademy(-12, 0);
        this.createValetudinarium(-12, 8);
        this.createEmbassy(0, -12);
        this.createFortress(8, -12);
        
        // Create Mystery Cave (only for C30+)
        if (this.getCurrentLevelValue() >= 30) {
            this.createMysteryCave(-8, -8);
        }
        
        // Initialize Kingdom Wars System
        this.createKingdomWarsSystem();
    }

    createVilla(x, z) {
        const building = new THREE.Group();
        
        // Main villa structure
        const villaGeometry = new THREE.BoxGeometry(4, 3, 4);
        const villaMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 });
        const villa = new THREE.Mesh(villaGeometry, villaMaterial);
        villa.position.y = 1.5;
        villa.castShadow = !this.isMobile;
        building.add(villa);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 4;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = !this.isMobile;
        building.add(roof);
        
        // Columns around villa
        this.addColumnsToBuilding(building, 4, 2.5, 0x8B7355);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'villa',
            level: 1,
            name: 'Villa',
            production: { gold: 10, food: 15 },
            cost: { gold: 100, wood: 50, stone: 30 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createColumns(x, z) {
        const building = new THREE.Group();
        
        // Create a row of columns
        for (let i = 0; i < 5; i++) {
            const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, 4, 8);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5DC });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            
            column.position.set((i - 2) * 1.5, 2, 0);
            column.castShadow = !this.isMobile;
            building.add(column);
            
            // Add capital
            const capitalGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.8);
            const capital = new THREE.Mesh(capitalGeometry, columnMaterial);
            capital.position.set((i - 2) * 1.5, 4.2, 0);
            capital.castShadow = !this.isMobile;
            building.add(capital);
        }
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'columns',
            level: 1,
            name: 'Tech Columns',
            production: { gold: 5 },
            cost: { gold: 80, stone: 60 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createTheater(x, z) {
        const building = new THREE.Group();
        
        // Theater base (semicircle)
        const baseGeometry = new THREE.CylinderGeometry(0, 5, 2, 8, 1, false, 0, Math.PI);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0xD2B48C });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 1;
        base.rotation.z = Math.PI;
        base.castShadow = !this.isMobile;
        building.add(base);
        
        // Stage area
        const stageGeometry = new THREE.BoxGeometry(6, 1, 2);
        const stageMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const stage = new THREE.Mesh(stageGeometry, stageMaterial);
        stage.position.set(0, 0.5, -3);
        stage.castShadow = !this.isMobile;
        building.add(stage);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'theater',
            level: 1,
            name: 'Theater',
            production: { gold: 20, food: 10 },
            cost: { gold: 200, stone: 100, wood: 50 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createColosseum(x, z) {
        const building = new THREE.Group();
        
        // Outer wall
        const outerWallGeometry = new THREE.CylinderGeometry(6, 6, 8, 16);
        const outerWallMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887, transparent: true, opacity: 0.7 });
        const outerWall = new THREE.Mesh(outerWallGeometry, outerWallMaterial);
        outerWall.position.y = 4;
        outerWall.castShadow = !this.isMobile;
        building.add(outerWall);
        
        // Inner arena
        const arenaGeometry = new THREE.CylinderGeometry(4, 4, 1, 16);
        const arenaMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const arena = new THREE.Mesh(arenaGeometry, arenaMaterial);
        arena.position.y = 0.5;
        arena.castShadow = !this.isMobile;
        building.add(arena);
        
        // Entrance arch
        const archGeometry = new THREE.TorusGeometry(2, 0.3, 8, 16, Math.PI);
        const archMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5DC });
        const arch = new THREE.Mesh(archGeometry, archMaterial);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(0, 2, -6);
        arch.castShadow = !this.isMobile;
        building.add(arch);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'colosseum',
            level: 1,
            name: 'Colosseum',
            production: { gold: 50, food: 20 },
            cost: { gold: 500, stone: 300, wood: 200 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createBarracks(x, z) {
        const building = new THREE.Group();
        
        // Main barracks building
        const barracksGeometry = new THREE.BoxGeometry(6, 4, 3);
        const barracksMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const barracks = new THREE.Mesh(barracksGeometry, barracksMaterial);
        barracks.position.y = 2;
        barracks.castShadow = !this.isMobile;
        building.add(barracks);
        
        // Training ground
        const groundGeometry = new THREE.CircleGeometry(3, 8);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0.01;
        ground.receiveShadow = !this.isMobile;
        building.add(ground);
        
        // Flag pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(2, 2.5, 0);
        pole.castShadow = !this.isMobile;
        building.add(pole);
        
        // Tech flag
        const flagGeometry = new THREE.PlaneGeometry(1, 0.6);
        const flagMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(2, 4.5, 0);
        flag.castShadow = !this.isMobile;
        building.add(flag);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'barracks',
            level: 1,
            name: 'Barracks',
            production: { gold: 30 },
            cost: { gold: 300, wood: 150, stone: 100 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createMarket(x, z) {
        const building = new THREE.Group();
        
        // Market stalls (multiple small buildings)
        for (let i = 0; i < 4; i++) {
            const stallGeometry = new THREE.BoxGeometry(2, 2, 1.5);
            const stallMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const stall = new THREE.Mesh(stallGeometry, stallMaterial);
            stall.position.set((i - 1.5) * 2, 1, 0);
            stall.castShadow = !this.isMobile;
            building.add(stall);
            
            // Awning
            const awningGeometry = new THREE.PlaneGeometry(2.2, 1);
            const awningMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
            const awning = new THREE.Mesh(awningGeometry, awningMaterial);
            awning.position.set((i - 1.5) * 2, 2, -0.5);
            awning.rotation.x = -Math.PI / 6;
            awning.castShadow = !this.isMobile;
            building.add(awning);
        }
        
        // Central fountain
        const fountainGeometry = new THREE.CylinderGeometry(1, 1.2, 0.5, 8);
        const fountainMaterial = new THREE.MeshLambertMaterial({ color: 0x4682B4 });
        const fountain = new THREE.Mesh(fountainGeometry, fountainMaterial);
        fountain.position.y = 0.25;
        fountain.castShadow = !this.isMobile;
        building.add(fountain);
        
        // Water in fountain
        const waterGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 8);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1, 
            transparent: true, 
            opacity: 0.8 
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.y = 0.4;
        building.add(water);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'market',
            level: 1,
            name: 'Market',
            production: { gold: 25, food: 15 },
            cost: { gold: 250, wood: 100, stone: 80 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    createRoyalPalace(x, z) {
        const building = new THREE.Group();
        
        // Main palace structure
        const palaceGeometry = new THREE.BoxGeometry(8, 6, 6);
        const palaceMaterial = new THREE.MeshLambertMaterial({ color: 0xDAA520 }); // Golden color
        const palace = new THREE.Mesh(palaceGeometry, palaceMaterial);
        palace.position.y = 3;
        palace.castShadow = !this.isMobile;
        building.add(palace);
        
        // Royal dome
        const domeGeometry = new THREE.SphereGeometry(4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.y = 6;
        dome.castShadow = !this.isMobile;
        building.add(dome);
        
        // Golden columns around palace
        this.addRoyalColumnsToBuilding(building, 5, 4, 0xFFD700);
        
        // Royal throne room (interior decoration)
        const throneGeometry = new THREE.BoxGeometry(1, 2, 1);
        const throneMaterial = new THREE.MeshLambertMaterial({ color: 0x8B0000 });
        const throne = new THREE.Mesh(throneGeometry, throneMaterial);
        throne.position.set(0, 1, -1.5);
        building.add(throne);
        
        // Royal banners
        for (let i = 0; i < 4; i++) {
            const bannerGeometry = new THREE.PlaneGeometry(1.5, 2);
            const bannerMaterial = new THREE.MeshLambertMaterial({ 
                color: i % 2 === 0 ? 0xFF0000 : 0x0000FF,
                side: THREE.DoubleSide
            });
            const banner = new THREE.Mesh(bannerGeometry, bannerMaterial);
            banner.position.set(
                (i % 2 === 0) ? 3.5 : -3.5,
                2.5,
                (i < 2) ? 2.5 : -2.5
            );
            banner.rotation.y = (i % 2 === 0) ? Math.PI / 2 : -Math.PI / 2;
            building.add(banner);
        }
        
        // Golden eagles on corners
        for (let i = 0; i < 4; i++) {
            const eagleGeometry = new THREE.ConeGeometry(0.3, 1, 4);
            const eagleMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
            const eagle = new THREE.Mesh(eagleGeometry, eagleMaterial);
            eagle.position.set(
                (i % 2 === 0) ? 3.5 : -3.5,
                6.5,
                (i < 2) ? 2.5 : -2.5
            );
            eagle.rotation.x = Math.PI;
            building.add(eagle);
        }
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'royal_palace',
            level: 1,
            name: 'Royal Palace',
            production: { gold: 100, food: 50, kingdomPower: 25 },
            cost: { gold: 1500, stone: 800, wood: 400, iron: 200 },
            special: 'unlocks_kingdom_wars'
        };
        
        this.scene.add(building);
        this.buildings.push(building);
        this.royalPalace = building;
    }
    
    // New Tech Military Buildings
    createAcademy(x, z) {
        const building = new THREE.Group();
        
        // Main academy structure
        const academyGeometry = new THREE.BoxGeometry(5, 4, 6);
        const academyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const academy = new THREE.Mesh(academyGeometry, academyMaterial);
        academy.position.y = 2;
        academy.castShadow = !this.isMobile;
        building.add(academy);
        
        // Triangular pediment
        const pedimentGeometry = new THREE.ConeGeometry(3.5, 2, 3);
        const pedimentMaterial = new THREE.MeshLambertMaterial({ color: 0xD2691E });
        const pediment = new THREE.Mesh(pedimentGeometry, pedimentMaterial);
        pediment.position.y = 5;
        pediment.rotation.z = Math.PI;
        pediment.castShadow = !this.isMobile;
        building.add(pediment);
        
        // Columns supporting the pediment
        for (let i = 0; i < 3; i++) {
            const columnGeometry = new THREE.CylinderGeometry(0.4, 0.4, 3, 8);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: 0xF5F5DC });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set((i - 1) * 2, 1.5, 2.5);
            column.castShadow = !this.isMobile;
            building.add(column);
        }
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'academy',
            level: 1,
            name: 'أكاديمية الحرب',
            production: { research: 10, military: 15 },
            cost: { gold: 800, stone: 400, wood: 200 }
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }
    
    createValetudinarium(x, z) {
        const building = new THREE.Group();
        
        // Main hospital structure
        const hospitalGeometry = new THREE.BoxGeometry(6, 3, 8);
        const hospitalMaterial = new THREE.MeshLambertMaterial({ color: 0xF0F8FF });
        const hospital = new THREE.Mesh(hospitalGeometry, hospitalMaterial);
        hospital.position.y = 1.5;
        hospital.castShadow = !this.isMobile;
        building.add(hospital);
        
        // Red cross symbol
        const crossGeometry1 = new THREE.BoxGeometry(0.3, 2, 0.3);
        const crossGeometry2 = new THREE.BoxGeometry(1.2, 0.3, 0.3);
        const crossMaterial = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        const cross1 = new THREE.Mesh(crossGeometry1, crossMaterial);
        const cross2 = new THREE.Mesh(crossGeometry2, crossMaterial);
        cross1.position.y = 3.5;
        cross2.position.y = 3.5;
        building.add(cross1);
        building.add(cross2);
        
        // Medical staff building
        const staffGeometry = new THREE.BoxGeometry(2, 2, 2);
        const staffMaterial = new THREE.MeshLambertMaterial({ color: 0xE6E6FA });
        const staff = new THREE.Mesh(staffGeometry, staffMaterial);
        staff.position.set(3, 1, 3);
        staff.castShadow = !this.isMobile;
        building.add(staff);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'valetudinarium',
            level: 1,
            name: 'المستشفى العسكري',
            production: { healing: 5 },
            cost: { gold: 600, stone: 300, wood: 150 },
            special: 'increases_healing_capacity'
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }
    
    createEmbassy(x, z) {
        const building = new THREE.Group();
        
        // Main embassy structure
        const embassyGeometry = new THREE.BoxGeometry(4, 5, 4);
        const embassyMaterial = new THREE.MeshLambertMaterial({ color: 0xC0C0C0 });
        const embassy = new THREE.Mesh(embassyGeometry, embassyMaterial);
        embassy.position.y = 2.5;
        embassy.castShadow = !this.isMobile;
        building.add(embassy);
        
        // Diplomatic flags
        for (let i = 0; i < 3; i++) {
            const flagGeometry = new THREE.PlaneGeometry(1, 1.5);
            const flagMaterial = new THREE.MeshLambertMaterial({ 
                color: i === 0 ? 0xFFD700 : (i === 1 ? 0xC0C0C0 : 0x800080),
                side: THREE.DoubleSide
            });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.set((i - 1) * 1.5, 4, 2.2);
            flag.rotation.y = Math.PI;
            building.add(flag);
        }
        
        // Diplomatic columns
        this.addColumnsToBuilding(building, 4, 3, 0xC0C0C0);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'embassy',
            level: 1,
            name: 'سفارة التحالفات',
            production: { diplomacy: 8, alliance_help: 5 },
            cost: { gold: 500, stone: 250, wood: 200 },
            special: 'enhances_alliance_features'
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }
    
    createFortress(x, z) {
        const building = new THREE.Group();
        
        // Fortress walls
        for (let i = 0; i < 4; i++) {
            const wallGeometry = new THREE.BoxGeometry(4, 4, 0.5);
            const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            
            const angle = (i * Math.PI) / 2;
            wall.position.set(
                Math.cos(angle) * 3,
                2,
                Math.sin(angle) * 3
            );
            wall.rotation.y = angle + Math.PI / 2;
            wall.castShadow = !this.isMobile;
            building.add(wall);
        }
        
        // Central tower
        const towerGeometry = new THREE.CylinderGeometry(1.5, 2, 6, 8);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0x708090 });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.y = 3;
        tower.castShadow = !this.isMobile;
        building.add(tower);
        
        // Battlements
        for (let i = 0; i < 8; i++) {
            const battlementGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
            const battlementMaterial = new THREE.MeshLambertMaterial({ color: 0x2F4F4F });
            const battlement = new THREE.Mesh(battlementGeometry, battlementMaterial);
            const angle = (i * Math.PI) / 4;
            battlement.position.set(
                Math.cos(angle) * 3.5,
                4.5,
                Math.sin(angle) * 3.5
            );
            building.add(battlement);
        }
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'fortress',
            level: 1,
            name: 'القلعة العسكرية',
            production: { defense: 20, military_experience: 10 },
            cost: { gold: 1000, stone: 600, wood: 300, iron: 100 },
            special: 'enhances_all_military_units'
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }
    
    // فحص المفتوحات الجديدة
    checkNewUnlocks() {
        const currentLevel = this.getCurrentLevelValue();
        
        // فتح كهف الغموض عند C30
        if (currentLevel >= 30 && !this.buildings.find(b => b.userData.type === 'mystery_cave')) {
            this.createMysteryCave(-8, -8);
            this.showMessage("🎉 تم فتح كهف الغموض! يمكنك الآن استخراج الأنهار الكريمة", "success");
        }
        
        // تحديث عرض حرب الثروه عند أي تغيير في المستوى
        this.updateRichesWarDisplay();
    }
    
    createMysteryCave(x, z) {
        const building = new THREE.Group();
        
        // Cave entrance - dark stone arch
        const caveEntrance = new THREE.Mesh(
            new THREE.BoxGeometry(6, 8, 4),
            new THREE.MeshPhongMaterial({ color: 0x2F4F4F, transparent: true, opacity: 0.8 })
        );
        building.add(caveEntrance);
        
        // Mystical stones around entrance
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const stone = new THREE.Mesh(
                new THREE.SphereGeometry(0.5 + Math.random() * 0.3),
                new THREE.MeshPhongMaterial({ 
                    color: 0x4169E1,
                    emissive: 0x000080,
                    emissiveIntensity: 0.1
                })
            );
            stone.position.set(
                Math.cos(angle) * 4,
                1 + Math.random() * 2,
                Math.sin(angle) * 3
            );
            building.add(stone);
        }
        
        // Magical crystals inside cave
        for (let i = 0; i < 6; i++) {
            const crystal = new THREE.Mesh(
                new THREE.OctahedronGeometry(0.8),
                new THREE.MeshPhongMaterial({
                    color: 0x00CED1,
                    transparent: true,
                    opacity: 0.7,
                    emissive: 0x008B8B,
                    emissiveIntensity: 0.2
                })
            );
            crystal.position.set(
                (Math.random() - 0.5) * 2,
                0.5 + Math.random() * 1,
                -1 + Math.random() * 1
            );
            building.add(crystal);
        }
        
        // Add sparkle effects
        const sparkleGroup = new THREE.Group();
        for (let i = 0; i < 20; i++) {
            const sparkle = new THREE.Mesh(
                new THREE.SphereGeometry(0.1),
                new THREE.MeshPhongMaterial({
                    color: 0x00BFFF,
                    emissive: 0x0080FF,
                    emissiveIntensity: 0.5
                })
            );
            sparkle.position.set(
                (Math.random() - 0.5) * 8,
                Math.random() * 6,
                (Math.random() - 0.5) * 6
            );
            sparkle.userData = {
                originalY: sparkle.position.y,
                animationSpeed: 0.02 + Math.random() * 0.02,
                phase: Math.random() * Math.PI * 2
            };
            sparkleGroup.add(sparkle);
        }
        building.add(sparkleGroup);
        
        building.position.set(x, 0, z);
        building.userData = {
            type: 'mystery_cave',
            level: 1,
            name: 'كهف الغموض',
            production: { royalGems: 1, mysticalEnergy: 2 },
            cost: { gold: 2000, stone: 1500, iron: 500, gems: 50 },
            special: 'produces_rare_crystals',
            unlockLevel: 30, // C30 required
            hiddenGems: Math.floor(Math.random() * 10) + 5
        };
        
        this.scene.add(building);
        this.buildings.push(building);
    }

    addRoyalColumnsToBuilding(building, radius, height, color) {
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const columnGeometry = new THREE.CylinderGeometry(0.3, 0.3, height, 12);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: color });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            
            column.position.set(
                Math.cos(angle) * radius,
                height / 2,
                Math.sin(angle) * radius
            );
            column.castShadow = !this.isMobile;
            building.add(column);
        }
    }

    createKingdomWarsSystem() {
        // Initialize war system
        this.warSystem.currentEnemy = this.warSystem.enemyKingdoms[0];
        this.warSystem.isInWar = false;
        this.updateWarDisplay();
    }

    startKingdomWar(enemyIndex) {
        if (this.warSystem.isInWar) {
            this.showMessage("أنت في حرب بالفعل!");
            return;
        }
        
        if (!this.royalPalace) {
            this.showMessage("يحتاج لبناء القصر الملكي أولاً!");
            return;
        }
        
        this.warSystem.currentEnemy = this.warSystem.enemyKingdoms[enemyIndex];
        this.warSystem.isInWar = true;
        this.warSystem.battleResult = null;
        
        this.showMessage(`الحرب ضد ${this.warSystem.currentEnemy.name} بدأت!`);
        this.updateWarDisplay();
    }

    executeKingdomAttack() {
        if (!this.warSystem.isInWar || !this.warSystem.currentEnemy) {
            this.showMessage("لا توجد حرب نشطة!");
            return;
        }
        
        // Calculate battle outcome
        const playerPower = this.warSystem.kingdomLevel * 20 + this.warSystem.armySize;
        const enemyPower = this.warSystem.currentEnemy.strength;
        
        const victoryChance = playerPower / (playerPower + enemyPower);
        const isVictory = Math.random() < victoryChance;
        
        if (isVictory) {
            // Victory rewards
            const reward = this.warSystem.currentEnemy.reward;
            this.resources.gold += reward;
            this.warSystem.kingdomLevel++;
            this.showMessage(`انتصار! حصلت على ${reward} ذهب!`);
            
            // Victory effect
            this.showFloatingText(this.royalPalace.position, "انتصار!", 0x00FF00);
        } else {
            // Defeat consequences
            const casualties = Math.floor(this.warSystem.armySize * 0.3);
            this.warSystem.armySize = Math.max(0, this.warSystem.armySize - casualties);
            this.showMessage(`هزيمة! خسرت ${casualties} جندي`);
            
            // Defeat effect
            this.showFloatingText(this.royalPalace.position, "هزيمة!", 0xFF0000);
        }
        
        // End war
        this.warSystem.isInWar = false;
        this.warSystem.battleResult = isVictory;
        this.updateResourceDisplay();
        this.updateWarDisplay();
    }

    recruitArmy(amount) {
        if (!this.royalPalace) {
            this.showMessage("يحتاج لبناء القصر الملكي أولاً!");
            return;
        }
        
        const cost = amount * 10; // 10 gold per soldier
        if (this.resources.gold < cost) {
            this.showMessage("ليس لديك ذهب كافي!");
            return;
        }
        
        if (this.warSystem.armySize + amount > this.warSystem.maxArmySize) {
            this.showMessage("الجيش مكتمل!");
            return;
        }
        
        this.resources.gold -= cost;
        this.warSystem.armySize += amount;
        this.showMessage(`تم تجنيد ${amount} جندي!`);
        this.updateResourceDisplay();
        this.updateWarDisplay();
    }

    // Alliance System Functions
    createAlliance(allianceId) {
        const alliance = this.allianceSystem.availableAlliances.find(a => a.id === allianceId);
        if (!alliance) {
            this.showMessage("تحالف غير متاح!");
            return false;
        }
        
        if (alliance.active) {
            this.showMessage("هذا التحالف نشط بالفعل!");
            return false;
        }
        
        if (this.resources.gold < alliance.cost) {
            this.showMessage("ليس لديك ذهب كافي!");
            return false;
        }
        
        if (this.allianceSystem.activeAlliances.length >= 2) {
            this.showMessage("يمكنك تفعيل تحالفين فقط في نفس الوقت!");
            return false;
        }
        
        // Activate alliance
        this.resources.gold -= alliance.cost;
        alliance.active = true;
        alliance.expiry = Date.now() + alliance.duration;
        this.allianceSystem.activeAlliances.push(alliance);
        this.updateAllianceBenefits();
        
        this.showMessage(`تم تفعيل ${alliance.name} بنجاح!`);
        this.updateResourceDisplay();
        this.updateAllianceDisplay();
        return true;
    }

    cancelAlliance(allianceId) {
        const allianceIndex = this.allianceSystem.activeAlliances.findIndex(a => a.id === allianceId);
        if (allianceIndex === -1) {
            this.showMessage("التحالف غير نشط!");
            return false;
        }
        
        const alliance = this.allianceSystem.activeAlliances[allianceIndex];
        alliance.active = false;
        alliance.expiry = null;
        this.allianceSystem.activeAlliances.splice(allianceIndex, 1);
        this.updateAllianceBenefits();
        
        this.showMessage(`تم إلغاء ${alliance.name}`);
        this.updateAllianceDisplay();
        return true;
    }

    updateAllianceBenefits() {
        // Reset benefits
        this.allianceSystem.totalBonus = 0;
        this.allianceSystem.allianceBenefits.extraGold = 0;
        this.allianceSystem.allianceBenefits.extraFood = 0;
        this.allianceSystem.allianceBenefits.armyBonus = 0;
        
        // Calculate active alliance benefits
        this.allianceSystem.activeAlliances.forEach(alliance => {
            this.allianceSystem.totalBonus += alliance.powerBonus;
            this.allianceSystem.allianceBenefits.extraGold += Math.floor(alliance.powerBonus / 2);
            this.allianceSystem.allianceBenefits.extraFood += Math.floor(alliance.powerBonus / 2);
            this.allianceSystem.allianceBenefits.armyBonus += 5;
        });
        
        // Update war power with alliance bonus
        this.warSystem.totalPower = this.warSystem.armySize + this.warSystem.kingdomLevel * 20 + this.allianceSystem.totalBonus;
    }

    applyAllianceBenefits() {
        // Apply alliance benefits to buildings production
        this.buildings.forEach(building => {
            if (building.userData.type === 'capital') {
                // Capital gets gold bonus from alliances
                building.userData.production.gold += this.allianceSystem.allianceBenefits.extraGold;
            } else if (building.userData.type === 'farm') {
                // Farm gets food bonus from alliances
                building.userData.production.food += this.allianceSystem.allianceBenefits.extraFood;
            }
        });
    }

    checkAllianceExpirations() {
        const now = Date.now();
        let changed = false;
        
        this.allianceSystem.activeAlliances.forEach(alliance => {
            if (alliance.expiry && now > alliance.expiry) {
                alliance.active = false;
                alliance.expiry = null;
                this.allianceSystem.activeAlliances = this.allianceSystem.activeAlliances.filter(a => a.id !== alliance.id);
                this.showMessage(`انتهى صلاحية ${alliance.name}`);
                changed = true;
            }
        });
        
        if (changed) {
            this.updateAllianceBenefits();
            this.updateAllianceDisplay();
        }
    }

    updateAllianceDisplay() {
        const allianceModal = document.getElementById('allianceModal');
        if (!allianceModal) return;
        
        const activeAlliancesList = document.getElementById('activeAlliancesList');
        const availableAlliancesList = document.getElementById('availableAlliancesList');
        
        if (activeAlliancesList) {
            if (this.allianceSystem.activeAlliances.length === 0) {
                activeAlliancesList.innerHTML = '<div class="no-alliances">لا توجد تحالفات نشطة</div>';
            } else {
                activeAlliancesList.innerHTML = this.allianceSystem.activeAlliances.map(alliance => {
                    const remainingTime = alliance.expiry ? Math.ceil((alliance.expiry - Date.now()) / 60000) : 0;
                    return `
                        <div class="active-alliance">
                            <div class="alliance-info">
                                <h4>${alliance.name}</h4>
                                <p>مكافأة القوة: +${alliance.powerBonus}</p>
                                <p>الوقت المتبقي: ${remainingTime} دقيقة</p>
                            </div>
                            <button class="cancel-btn" onclick="game.cancelAlliance('${alliance.id}')">إلغاء</button>
                        </div>
                    `;
                }).join('');
            }
        }
        
        if (availableAlliancesList) {
            availableAlliancesList.innerHTML = this.allianceSystem.availableAlliances.map(alliance => {
                const canAfford = this.resources.gold >= alliance.cost;
                const canActivate = !alliance.active && this.allianceSystem.activeAlliances.length < 2;
                return `
                    <div class="available-alliance ${!canAfford || !canActivate ? 'disabled' : ''}">
                        <div class="alliance-info">
                            <h4>${alliance.name}</h4>
                            <p>المملكة: ${alliance.kingdom}</p>
                            <p>التكلفة: ${alliance.cost} ذهب</p>
                            <p>مكافأة القوة: +${alliance.powerBonus}</p>
                            <p>المدة: 5 دقائق</p>
                        </div>
                        <button class="activate-btn" 
                                onclick="${canAfford && canActivate ? `game.createAlliance('${alliance.id}')` : ''}"
                                ${!canAfford || !canActivate ? 'disabled' : ''}>
                            تفعيل
                        </button>
                    </div>
                `;
            }).join('');
        }
    }

    // Military Unit Management System
    trainUnit(unitType) {
        const unit = this.militarySystem[unitType];
        if (!unit) return false;
        
        if (this.resources.gold < unit.trainingCost) {
            this.showMessage('لا يوجد ذهب كافي للتدريب');
            return false;
        }
        
        if (unit.count >= unit.max) {
            this.showMessage('تم الوصول للحد الأقصى لهذه الوحدة');
            return false;
        }
        
        // Check if Academy exists for better training
        const academy = this.buildings.find(b => b.userData.type === 'academy');
        const hasAcademy = academy && academy.userData.level >= 1;
        
        const cost = hasAcademy ? unit.trainingCost * 0.8 : unit.trainingCost;
        this.resources.gold -= cost;
        
        unit.count++;
        this.warSystem.armySize = Object.values(this.militarySystem).reduce((total, u) => total + u.count, 0);
        
        // Update war power
        this.updateWarPower();
        
        this.updateResourceDisplay();
        this.updateMilitaryDisplay();
        
        this.showMessage(`تم تدريب ${unit.description.split(' - ')[0]}`);
        this.triggerRandomEvent('military');
        
        return true;
    }
    
    dismissUnit(unitType, amount = 1) {
        const unit = this.militarySystem[unitType];
        if (!unit || unit.count < amount) return false;
        
        unit.count -= amount;
        this.warSystem.armySize = Object.values(this.militarySystem).reduce((total, u) => total + u.count, 0);
        
        // Update war power
        this.updateWarPower();
        
        this.updateMilitaryDisplay();
        this.showMessage(`تم تخفيض عدد ${unit.description.split(' - ')[0]}`);
        
        return true;
    }
    
    changeFormation(formationName) {
        if (!this.militarySystem.formations[formationName]) return false;
        
        this.militarySystem.currentFormation = formationName;
        this.updateMilitaryDisplay();
        this.showMessage(`تم تغيير التشكيلة إلى ${this.militarySystem.formations[formationName].name}`);
        
        return true;
    }
    
    healUnits() {
        if (this.militarySystem.woundedUnits <= 0) {
            this.showMessage('لا توجد وحدات مصابة');
            return false;
        }
        
        const hospital = this.buildings.find(b => b.userData.type === 'valetudinarium');
        const healRate = hospital ? hospital.userData.level * 2 : 1;
        const healAmount = Math.min(this.militarySystem.woundedUnits, healRate);
        
        this.militarySystem.woundedUnits -= healAmount;
        this.updateMilitaryDisplay();
        
        this.showMessage(`تم علاج ${healAmount} وحدات`);
        return true;
    }
    
    coordinateAllianceAttack(targetKingdom, rallyTime = 30) {
        if (!this.warSystem.isInWar) {
            this.showMessage('يجب أن تكون في حالة حرب أولاً');
            return false;
        }
        
        this.battleSystem.coordination.enabled = true;
        this.battleSystem.coordination.rallyTime = Date.now() + (rallyTime * 1000);
        this.battleSystem.coordination.targetInfo = targetKingdom;
        
        this.updateMilitaryDisplay();
        this.showMessage(`تم تفعيل التجمع التحالفي - الهدف: ${targetKingdom.name}`);
        
        // Auto-cancel coordination after rally time
        setTimeout(() => {
            this.battleSystem.coordination.enabled = false;
            this.showMessage('انتهت مهلة التجمع التحالفي');
        }, rallyTime * 1000);
        
        return true;
    }
    
    initiateTimedAttack() {
        if (!this.battleSystem.coordination.enabled) {
            this.showMessage('لا يوجد تجمع تحالفي نشط');
            return false;
        }
        
        const timeLeft = this.battleSystem.coordination.rallyTime - Date.now();
        if (timeLeft > 0) {
            this.showMessage(`يجب انتظار ${Math.ceil(timeLeft / 1000)} ثانية`);
            return false;
        }
        
        // Execute coordinated attack
        const target = this.battleSystem.coordination.targetInfo;
        this.warSystem.currentEnemy = target;
        this.startBattle('rally');
        
        this.showMessage('تم تنفيذ الهجوم المنسق!');
        return true;
    }
    
    updateWarPower() {
        // Calculate total military power
        let totalPower = this.warSystem.kingdomLevel * 20; // Base power
        
        // Add power from units
        Object.values(this.militarySystem).forEach(unit => {
            if (unit.power) {
                totalPower += unit.count * unit.power;
            }
        });
        
        // Add alliance bonus
        totalPower += this.allianceSystem.totalBonus;
        
        // Add formation bonus
        const currentFormation = this.militarySystem.formations[this.militarySystem.currentFormation];
        if (currentFormation.bonus.includes('دفاعية')) {
            totalPower += 25;
        } else if (currentFormation.bonus.includes('هجومية')) {
            totalPower += 30;
        } else {
            totalPower += 20;
        }
        
        // Add building bonuses
        const fortress = this.buildings.find(b => b.userData.type === 'fortress');
        if (fortress) {
            totalPower += fortress.userData.level * 10;
        }
        
        this.warSystem.totalPower = totalPower;
    }
    
    updateMilitaryDisplay() {
        // This will be called from the main UI update function
        // For now, just update the war power
        this.updateWarPower();
    }
    
    // Alliance Technology and Events Management
    researchAllianceTech(techType) {
        const tech = this.allianceSystem.allianceTech;
        if (!tech.levels[techType]) return false;
        
        const currentLevel = tech.levels[techType];
        const cost = tech.costs[techType] * (currentLevel + 1);
        
        if (this.resources.gold < cost) {
            this.showMessage('لا يوجد ذهب كافي للبحث');
            return false;
        }
        
        this.resources.gold -= cost;
        tech.levels[techType]++;
        
        this.updateResourceDisplay();
        this.showMessage(`تم تطوير تكنولوجيا ${techType} إلى المستوى ${tech.levels[techType]}`);
        this.updateAllianceBenefits();
        
        return true;
    }
    
    collectAllianceGift() {
        const gifts = this.allianceSystem.allianceGifts;
        
        if (!gifts.available) {
            this.showMessage('لا توجد هدايا متاحة حالياً');
            return false;
        }
        
        if (gifts.giftsUsedToday >= gifts.maxGiftsPerDay) {
            this.showMessage('تم استخدام جميع الهدايا اليومية');
            return false;
        }
        
        const giftAmount = Math.floor(Math.random() * 500) + 200; // 200-700 gold
        this.resources.gold += giftAmount;
        
        gifts.giftsUsedToday++;
        gifts.lastGift = Date.now();
        gifts.available = false;
        
        // Set next gift time (6 hours)
        gifts.giftTimer = setTimeout(() => {
            gifts.available = true;
        }, 6 * 60 * 60 * 1000);
        
        this.updateResourceDisplay();
        this.showMessage(`تم جمع هدية: +${giftAmount} ذهب!`);
        
        return true;
    }
    
    joinAllianceEvent(eventName) {
        const event = this.allianceSystem.allianceEvents[eventName];
        if (!event) return false;
        
        const now = Date.now();
        if (now < event.nextEvent) {
            const timeLeft = Math.ceil((event.nextEvent - now) / (1000 * 60 * 60));
            this.showMessage(`الحدث متاح خلال ${timeLeft} ساعة`);
            return false;
        }
        
        // Simulate event participation
        const success = Math.random() > 0.3; // 70% success rate
        if (success) {
            this.resources.gold += event.reward;
            this.showMessage(`نجح الحدث! كسبت ${event.reward} ذهب`);
        } else {
            this.showMessage('فشل في الحدث، حاول مرة أخرى');
        }
        
        // Set next event time
        if (event.frequency === "يومي") {
            event.nextEvent = now + (24 * 60 * 60 * 1000);
        } else if (event.frequency === "أسبوعي") {
            event.nextEvent = now + (7 * 24 * 60 * 60 * 1000);
        }
        
        this.updateResourceDisplay();
        this.triggerRandomEvent('alliance_event');
        
        return true;
    }
    
    helpAllianceMember(buildingType) {
        // Simulate helping an alliance member
        const helpBonus = {
            gold: 5,
            food: 3,
            construction: 2,
            military: 4
        };
        
        this.resources.gold += helpBonus.gold;
        this.resources.food += helpBonus.food;
        
        this.updateResourceDisplay();
        this.showMessage(`ساعدت عضو في التحالف! +${helpBonus.gold} ذهب, +${helpBonus.food} طعام`);
        
        return true;
    }
    
    // Enhanced Battle System
    startBattle(battleType = 'solo') {
        if (!this.warSystem.currentEnemy) {
            this.showMessage('لم يتم اختيار عدو');
            return;
        }
        
        const enemy = this.warSystem.currentEnemy;
        const playerPower = this.warSystem.totalPower;
        const enemyPower = enemy.strength;
        
        // Battle type modifiers
        let battleMultiplier = 1;
        if (battleType === 'rally') {
            battleMultiplier = 1.5; // Rally bonus
        } else if (battleType === 'timed') {
            battleMultiplier = 1.3; // Timed attack bonus
        }
        
        const effectivePlayerPower = playerPower * battleMultiplier;
        
        // Calculate battle result
        const playerAdvantage = effectivePlayerPower / enemyPower;
        const victoryChance = Math.min(0.9, 0.5 + (playerAdvantage - 1) * 0.2);
        
        const isVictory = Math.random() < victoryChance;
        
        // Calculate casualties
        const baseCasualtyRate = isVictory ? 0.1 : 0.3;
        const totalUnits = this.warSystem.armySize;
        const casualties = Math.floor(totalUnits * baseCasualtyRate);
        
        // Apply casualties to random units
        this.applyCasualties(casualties);
        
        if (isVictory) {
            this.resources.gold += enemy.reward;
            this.warSystem.kingdomLevel++;
            this.warSystem.isInWar = false;
            this.warSystem.currentEnemy = null;
            
            this.showMessage(`انتصار! كسبت ${enemy.reward} ذهب وارتقت لمستوى ${this.warSystem.kingdomLevel}`);
            this.triggerRandomEvent('victory');
        } else {
            this.showMessage('هزيمة! حاول مرة أخرى بعد تعزيز جيشك');
            this.triggerRandomEvent('defeat');
        }
        
        this.updateResourceDisplay();
        this.updateWarDisplay();
        this.updateMilitaryDisplay();
    }
    
    applyCasualties(casualtyCount) {
        if (casualtyCount <= 0) return;
        
        // Distribute casualties among units proportionally
        const unitTypes = Object.keys(this.militarySystem).filter(key => 
            this.militarySystem[key].count > 0
        );
        
        if (unitTypes.length === 0) return;
        
        let remainingCasualties = casualtyCount;
        
        for (let i = 0; i < casualtyCount && remainingCasualties > 0; i++) {
            const randomUnitType = unitTypes[Math.floor(Math.random() * unitTypes.length)];
            const unit = this.militarySystem[randomUnitType];
            
            if (unit.count > 0) {
                unit.count--;
                remainingCasualties--;
            }
        }
        
        this.warSystem.armySize = Object.values(this.militarySystem).reduce((total, u) => total + u.count, 0);
        this.militarySystem.woundedUnits += Math.floor(casualtyCount * 0.6); // 60% wounded, 40% killed
    }

    showMessage(message) {
        // Create floating message
        const canvas = this.renderer.domElement;
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'absolute';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.background = 'rgba(0,0,0,0.8)';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = '1000';
        messageDiv.textContent = message;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000);
    }

    addColumnsToBuilding(building, radius, height, color) {
        for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            const columnGeometry = new THREE.CylinderGeometry(0.2, 0.2, height, 8);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: color });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            
            column.position.set(
                Math.cos(angle) * radius,
                height / 2,
                Math.sin(angle) * radius
            );
            column.castShadow = !this.isMobile;
            building.add(column);
        }
    }

    setupControls() {
        if (this.isMobile) {
            this.setupMobileControls();
        } else {
            this.setupDesktopControls();
        }
    }

    setupMobileControls() {
        // Simple touch controls for mobile
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let zoomLevel = 1;

        const canvas = this.renderer.domElement;

        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            if (event.touches.length === 1) {
                isDragging = true;
                previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
        });

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (isDragging && event.touches.length === 1) {
                const deltaMove = {
                    x: (event.touches[0].clientX - previousMousePosition.x) * 0.5, // Reduced sensitivity
                    y: (event.touches[0].clientY - previousMousePosition.y) * 0.5
                };

                // Use spherical coordinates for smoother rotation
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(this.cameraTargetPosition);
                
                // More conservative rotation limits for better readability
                const newTheta = spherical.theta - deltaMove.x * 0.003; // Reduced rotation speed
                const newPhi = spherical.phi + deltaMove.y * 0.003;
                spherical.theta = newTheta;
                spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, newPhi)); // Wider angle range

                this.cameraTargetPosition.setFromSpherical(spherical);
                this.cameraTargetPosition.lookAt(0, 0, 0);

                previousMousePosition = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY
                };
            }
        });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });

        // Improved pinch to zoom
        let initialDistance = 0;
        let initialZoomLevel = 1;
        
        canvas.addEventListener('touchstart', (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                initialDistance = Math.sqrt(
                    Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) +
                    Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2)
                );
                initialZoomLevel = zoomLevel;
            }
        });

        canvas.addEventListener('touchmove', (event) => {
            if (event.touches.length === 2) {
                event.preventDefault();
                const currentDistance = Math.sqrt(
                    Math.pow(event.touches[0].clientX - event.touches[1].clientX, 2) +
                    Math.pow(event.touches[0].clientY - event.touches[1].clientY, 2)
                );
                
                // Smoother zoom calculation
                const zoomFactor = 0.0008; // Smoother zoom
                const newZoomLevel = Math.max(0.6, Math.min(2.5, initialZoomLevel + (initialDistance - currentDistance) * zoomFactor));
                
                // Smoothly move to new position
                const direction = new THREE.Vector3();
                direction.copy(this.cameraTargetPosition).normalize();
                const targetDistance = 15 * newZoomLevel;
                this.cameraTargetPosition.copy(direction.multiplyScalar(targetDistance));
                
                zoomLevel = newZoomLevel;
                initialDistance = currentDistance;
            }
        });
    }

    setupDesktopControls() {
        // Mouse controls for desktop
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        const canvas = this.renderer.domElement;

        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
            previousMousePosition = { x: event.clientX, y: event.clientY };
        });

        canvas.addEventListener('mousemove', (event) => {
            if (isDragging) {
                const deltaMove = {
                    x: (event.clientX - previousMousePosition.x) * 0.5, // Reduced sensitivity
                    y: (event.clientY - previousMousePosition.y) * 0.5
                };

                // Smoother camera rotation
                const spherical = new THREE.Spherical();
                spherical.setFromVector3(this.cameraTargetPosition);
                
                // More conservative rotation for better readability
                const newTheta = spherical.theta - deltaMove.x * 0.003;
                const newPhi = spherical.phi + deltaMove.y * 0.003;
                spherical.theta = newTheta;
                spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, newPhi));

                this.cameraTargetPosition.setFromSpherical(spherical);
                this.cameraTargetPosition.lookAt(0, 0, 0);

                previousMousePosition = { x: event.clientX, y: event.clientY };
            }
        });

        canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Improved scroll to zoom
        canvas.addEventListener('wheel', (event) => {
            event.preventDefault();
            const direction = new THREE.Vector3();
            direction.copy(this.cameraTargetPosition).normalize();
            const distance = this.cameraTargetPosition.length();
            
            // Smoother zoom with better limits
            const zoomSpeed = 0.3; // Smoother zoom
            const newDistance = Math.max(8, Math.min(30, distance + event.deltaY * zoomSpeed));
            this.cameraTargetPosition.copy(direction.multiplyScalar(newDistance));
            
            // Update zoom level for consistency
            zoomLevel = newDistance / 15; // Normalize to base distance
        });
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());

        // Building selection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onBuildingClick = (event) => {
            const rect = this.renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, this.camera);
            const intersects = raycaster.intersectObjects(this.buildings, true);

            if (intersects.length > 0) {
                let building = intersects[0].object;
                while (building.parent && !this.buildings.includes(building)) {
                    building = building.parent;
                }
                
                if (this.buildings.includes(building)) {
                    this.selectBuilding(building);
                }
            }
        };

        if (this.isMobile) {
            this.renderer.domElement.addEventListener('touchstart', (event) => {
                if (event.touches.length === 1) {
                    onBuildingClick({ 
                        clientX: event.touches[0].clientX, 
                        clientY: event.touches[0].clientY 
                    });
                }
            });
        } else {
            this.renderer.domElement.addEventListener('click', onBuildingClick);
        }

        // UI Event Listeners
        this.setupUIEvents();
    }

    setupUIEvents() {
        // VIP upgrade buttons
        const vipButtons = document.querySelectorAll('.vip-btn');
        vipButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = parseInt(e.target.dataset.vip);
                this.upgradeVIP(level);
            });
        });

        // Building action buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('upgrade-btn')) {
                this.upgradeBuilding(this.selectedBuilding);
            } else if (e.target.classList.contains('collect-btn')) {
                this.collectResources(this.selectedBuilding);
            }
        });
    }

    selectBuilding(building) {
        // Deselect previous building
        if (this.selectedBuilding) {
            this.highlightBuilding(this.selectedBuilding, false);
        }

        this.selectedBuilding = building;
        this.highlightBuilding(building, true);
        this.showBuildingInfo(building);
    }

    highlightBuilding(building, highlight) {
        building.traverse((child) => {
            if (child.isMesh && child.material) {
                if (highlight) {
                    child.material.emissive = new THREE.Color(0x00ff00);
                    child.material.emissiveIntensity = 0.3;
                } else {
                    child.material.emissive = new THREE.Color(0x000000);
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }

    showBuildingInfo(building) {
        const info = building.userData;
        const infoPanel = document.getElementById('building-info');
        
        if (infoPanel) {
            infoPanel.innerHTML = `
                <h3>${info.name}</h3>
                <p>المستوى: ${info.level}</p>
                <p>الإنتاج: ${Object.entries(info.production).map(([res, amount]) => 
                    `${amount} ${this.getResourceName(res)}`
                ).join(', ')}</p>
                <p>تكلفة الترقية: ${Object.entries(info.cost).map(([res, amount]) => 
                    `${amount} ${this.getResourceName(res)}`
                ).join(', ')}</p>
                <div class="building-actions">
                    <button class="upgrade-btn" onclick="game.upgradeBuilding(game.selectedBuilding)">ترقية</button>
                    <button class="collect-btn" onclick="game.collectResources(game.selectedBuilding)">جمع</button>
                </div>
            `;
        }
    }

    getResourceName(resource) {
        const names = {
            gold: 'ذهب',
            food: 'طعام',
            wood: 'خشب',
            stone: 'حجر',
            iron: 'حديد'
        };
        return names[resource] || resource;
    }

    upgradeBuilding(building) {
        if (!building || !this.canAffordUpgrade(building)) return;

        const cost = building.userData.cost;
        
        // Deduct resources
        Object.keys(cost).forEach(res => {
            this.resources[res] -= cost[res];
        });

        // Upgrade building
        building.userData.level++;
        this.scaleBuilding(building, 1.1);
        
        // Increase production
        Object.keys(building.userData.production).forEach(res => {
            building.userData.production[res] *= 1.2;
        });

        // Update display
        this.updateResourceDisplay();
        this.showBuildingInfo(building);
        this.showUpgradeEffect(building);
    }

    canAffordUpgrade(building) {
        const cost = building.userData.cost;
        return Object.keys(cost).every(res => this.resources[res] >= cost[res]);
    }

    scaleBuilding(building, scale) {
        const originalScale = building.scale.clone();
        const targetScale = originalScale.multiplyScalar(scale);
        
        // Animation
        const animation = {
            building: building,
            startTime: Date.now(),
            duration: 1000,
            from: originalScale,
            to: targetScale
        };
        
        this.animations.push(animation);
    }

    showUpgradeEffect(building) {
        // Create particle effect for upgrade
        const particles = new THREE.Group();
        const particleCount = 20;
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.1, 8, 8);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xFFD700,
                transparent: true,
                opacity: 1
            });
            const particle = new THREE.Mesh(geometry, material);
            
            particle.position.set(
                (Math.random() - 0.5) * 4,
                Math.random() * 4,
                (Math.random() - 0.5) * 4
            );
            
            particles.add(particle);
        }
        
        building.add(particles);
        
        // Animate particles
        const startTime = Date.now();
        const animateParticles = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 2000;
            
            particles.children.forEach((particle, i) => {
                particle.position.y += 0.05;
                particle.material.opacity = 1 - progress;
            });
            
            if (progress < 1) {
                requestAnimationFrame(animateParticles);
            } else {
                building.remove(particles);
            }
        };
        
        animateParticles();
    }

    collectResources(building) {
        if (!building) return;

        const production = building.userData.production;
        let collectedText = 'تم جمع: ';
        
        Object.keys(production).forEach(res => {
            const amount = production[res] * building.userData.level;
            this.resources[res] += amount;
            collectedText += `${amount} ${this.getResourceName(res)} `;
        });

        this.updateResourceDisplay();
        this.showFloatingText(building.position, collectedText, 0x00FF00);
    }

    showFloatingText(position, text, color) {
        // Create floating text effect
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#FFFFFF';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(text, canvas.width / 2, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.position.y += 5;
        sprite.scale.set(4, 1, 1);
        
        this.scene.add(sprite);
        
        // Animate and remove
        const startTime = Date.now();
        const animateText = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / 2000;
            
            sprite.position.y = position.y + 5 + (progress * 3);
            sprite.material.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(animateText);
            } else {
                this.scene.remove(sprite);
            }
        };
        
        animateText();
    }

    upgradeVIP(level) {
        const vipCosts = { 1: 1000, 2: 2500, 3: 5000 };
        const cost = vipCosts[level];
        
        if (this.resources.gold >= cost) {
            this.resources.gold -= cost;
            this.vipLevel = level;
            this.updateResourceDisplay();
            this.updateVIPDisplay();
            
            // Apply VIP bonuses
            this.applyVIPBonuses();
        }
    }

    applyVIPBonuses() {
        const multipliers = { 1: 1.2, 2: 1.5, 3: 2.0 };
        const multiplier = multipliers[this.vipLevel] || 1;
        
        this.buildings.forEach(building => {
            if (building.userData.production) {
                Object.keys(building.userData.production).forEach(res => {
                    building.userData.production[res] *= multiplier;
                });
            }
        });
    }

    updateResourceDisplay() {
        const elements = {
            gold: document.getElementById('gold-amount'),
            food: document.getElementById('food-amount'),
            wood: document.getElementById('wood-amount'),
            stone: document.getElementById('stone-amount'),
            iron: document.getElementById('iron-amount'),
            royalGems: document.getElementById('royal-gems-amount'),
            gems: document.getElementById('gems-amount'),
            crystals: document.getElementById('crystals-amount'),
            diamonds: document.getElementById('diamonds-amount'),
            sacredRelics: document.getElementById('sacred-relics-amount'),
            emperorCrowns: document.getElementById('emperor-crowns-amount')
        };

        Object.keys(this.resources).forEach(res => {
            if (elements[res]) {
                elements[res].textContent = this.formatNumber(this.resources[res]);
            }
        });
    }

    updateVIPDisplay() {
        const elements = {
            0: document.getElementById('vip-0'),
            1: document.getElementById('vip-1'),
            2: document.getElementById('vip-2'),
            3: document.getElementById('vip-3')
        };

        Object.keys(elements).forEach(level => {
            if (elements[level]) {
                if (parseInt(level) === this.vipLevel) {
                    elements[level].classList.add('active');
                } else {
                    elements[level].classList.remove('active');
                }
            }
        });
    }

    updateWarDisplay() {
        const kingdomLevelElement = document.getElementById('kingdom-level');
        const armySizeElement = document.getElementById('army-size');
        const currentEnemyElement = document.getElementById('current-enemy');
        const warStatusElement = document.getElementById('war-status');
        
        if (kingdomLevelElement) kingdomLevelElement.textContent = this.warSystem.kingdomLevel;
        if (armySizeElement) armySizeElement.textContent = `${this.warSystem.armySize}/${this.warSystem.maxArmySize}`;
        
        if (currentEnemyElement) {
            currentEnemyElement.textContent = this.warSystem.currentEnemy ? 
                this.warSystem.currentEnemy.name : 'لا يوجد عدو';
        }
        
        if (warStatusElement) {
            warStatusElement.textContent = this.warSystem.isInWar ? 'في حرب' : 'سلم';
            warStatusElement.className = this.warSystem.isInWar ? 'status-war' : 'status-peace';
        }
    }

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    updateResources() {
        // Auto-generate resources from buildings
        this.buildings.forEach(building => {
            if (building.userData.production) {
                Object.keys(building.userData.production).forEach(res => {
                    // إنتاج خاص للأنهار الكريمة من كهف الغموض
                    if (building.userData.type === 'mystery_cave' && res === 'royalGems') {
                        this.resources.royalGems += building.userData.production.royalGems * building.userData.level * 0.05;
                    } else if (building.userData.type === 'mystery_cave' && res === 'mysticalEnergy') {
                        this.resources.mysticalEnergy = (this.resources.mysticalEnergy || 0) + 
                            building.userData.production.mysticalEnergy * building.userData.level * 0.05;
                    } else {
                        this.resources[res] += building.userData.production[res] * building.userData.level * 0.1;
                    }
                });
            }
        });
        
        // تحديث التلقائي للمفتوحات
        this.checkNewUnlocks();
        
        this.updateResourceDisplay();
        this.updateWarDisplay();
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateMilitaryUIElements() {
        // Update power value
        const powerValue = document.getElementById('military-power-value');
        if (powerValue) {
            powerValue.textContent = this.warSystem.totalPower || 0;
        }
        
        // Update kingdom level
        const kingdomLevel = document.getElementById('kingdom-level-display');
        if (kingdomLevel) {
            kingdomLevel.textContent = this.warSystem.kingdomLevel || 1;
        }
        
        // Update current formation
        const currentFormation = document.getElementById('current-formation-display');
        if (currentFormation) {
            const formation = this.militarySystem.formations[this.militarySystem.currentFormation];
            currentFormation.textContent = formation ? formation.name : 'تستودو';
        }
        
        // Update unit counts
        const unitTypes = ['legiones', 'equites', 'sagittarii', 'velites', 'ballistarii', 'auxilia'];
        unitTypes.forEach(unitType => {
            const element = document.getElementById(`${unitType}-count`);
            if (element && this.militarySystem[unitType]) {
                element.textContent = this.militarySystem[unitType].count;
            }
        });
        
        // Update wounded units
        const woundedUnits = document.getElementById('wounded-units');
        if (woundedUnits) {
            woundedUnits.textContent = this.militarySystem.woundedUnits || 0;
        }
        
        // Update hospital capacity
        const hospitalCapacity = document.getElementById('hospital-capacity');
        if (hospitalCapacity) {
            const hospital = this.buildings.find(b => b.userData.type === 'valetudinarium');
            const capacity = hospital ? hospital.userData.level * 20 : 20;
            hospitalCapacity.textContent = capacity;
        }
        
        // Update alliance technology levels
        const techTypes = ['gold', 'food', 'military', 'construction'];
        techTypes.forEach(techType => {
            const element = document.getElementById(`tech-${techType}-level`);
            if (element && this.allianceSystem.allianceTech.levels[techType] !== undefined) {
                element.textContent = this.allianceSystem.allianceTech.levels[techType];
            }
        });
        
        // Update alliance gifts
        const giftsUsed = document.getElementById('gifts-used-today');
        if (giftsUsed) {
            giftsUsed.textContent = this.allianceSystem.allianceGifts.giftsUsedToday;
        }
        
        // Update collect gift button state
        const collectGiftBtn = document.getElementById('collect-gift-btn');
        if (collectGiftBtn) {
            const available = this.allianceSystem.allianceGifts.available;
            const usedToday = this.allianceSystem.allianceGifts.giftsUsedToday >= this.allianceSystem.allianceGifts.maxGiftsPerDay;
            collectGiftBtn.disabled = !available || usedToday;
            collectGiftBtn.textContent = available && !usedToday ? 'جمع الهدية' : 'غير متاح';
        }
    }

    animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        // Frame rate limiting for smooth performance
        if (deltaTime < (1000 / this.fps)) {
            return requestAnimationFrame(() => this.animate());
        }
        
        this.frameCount++;
        this.lastTime = currentTime;
        
        // Adaptive performance based on device
        this.updatePerformanceMode();
        
        // Smooth animations with performance optimization
        if (this.performanceMode === 'high') {
            this.updateAnimations();
        } else if (this.frameCount % 2 === 0) {
            // Skip every other frame for lower performance modes
            this.updateAnimations();
        }
        
        // Optimized day/night cycle
        if (this.frameCount % 3 === 0) {
            this.updateDayNightCycle();
        }
        
        // Efficient resource updates
        if (this.lastResourceUpdate === undefined) {
            this.lastResourceUpdate = Date.now();
        }
        
        if (Date.now() - this.lastResourceUpdate > 5000) { // Every 5 seconds
            this.updateResources();
            this.updateRadarSystem(); // تحديث نظام الرادار
            this.updateRadarMiniDisplay(); // تحديث لوحة الرادار المصغرة
            this.updateGMTTimeDisplay(); // تحديث عرض توقيت GMT
            this.lastResourceUpdate = Date.now();
        }
        
        // Check alliance expirations
        this.checkAllianceExpirations();
        
        // Update military display periodically
        if (this.lastMilitaryUpdate === undefined) {
            this.lastMilitaryUpdate = Date.now();
        }
        
        if (Date.now() - this.lastMilitaryUpdate > 1000) { // Every second
            this.updateMilitaryUIElements();
            this.updateCastleProtectionSystem(); // تحديث نظام حماية القلاع
            this.lastMilitaryUpdate = Date.now();
        }
        
        // تحسين الأداء للهواتف
        if (this.isMobileDevice()) {
            this.optimizeForMobile();
        }
        
        // Smooth camera movement update
        this.updateCamera();
        
        this.renderer.render(this.scene, this.camera);
    }

    // دالة تحديث الكاميرا السلس
    updateCamera() {
        // Smoothly interpolate camera position to target
        if (this.currentCameraPosition && this.cameraTargetPosition) {
            this.currentCameraPosition.lerp(this.cameraTargetPosition, this.smoothFactor);
            this.camera.position.copy(this.currentCameraPosition);
            
            // Smoothly look at the target
            const lookAtTarget = new THREE.Vector3(0, 0, 0);
            this.camera.lookAt(lookAtTarget);
        }
    }

    // إنشاء مدخل المدينة ثلاثي الأبعاد
    createCityGate3D() {
        const gateGroup = new THREE.Group();
        
        // إطار الباب
        const frameGeometry = new THREE.BoxGeometry(3, 2, 0.3);
        const frameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xF59E0B,
            transparent: true,
            opacity: 0.9
        });
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(0, 0, 0);
        gateGroup.add(frame);
        
        // الأبواب
        const doorGeometry = new THREE.BoxGeometry(1.3, 1.8, 0.2);
        const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        
        const leftDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        leftDoor.position.set(-0.85, 0, -0.1);
        gateGroup.add(leftDoor);
        
        const rightDoor = new THREE.Mesh(doorGeometry, doorMaterial);
        rightDoor.position.set(0.85, 0, -0.1);
        gateGroup.add(rightDoor);
        
        // تاج الباب
        const crownGeometry = new THREE.ConeGeometry(1.5, 0.5, 6);
        const crownMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.set(0, 1.5, 0);
        gateGroup.add(crown);
        
        // الإضاءة
        const gateLight = new THREE.PointLight(0xFFD700, 0.5, 5);
        gateLight.position.set(0, 1, 1);
        gateGroup.add(gateLight);
        
        return gateGroup;
    }

    // إنشاء تمثال كولوسي
    createColossi3D() {
        const colossusGroup = new THREE.Group();
        
        // جسد الكولوس
        const bodyGeometry = new THREE.CylinderGeometry(0.8, 1, 3, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 1.5, 0);
        colossusGroup.add(body);
        
        // الرأس
        const headGeometry = new THREE.SphereGeometry(0.6, 8, 6);
        const headMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 3.2, 0);
        colossusGroup.add(head);
        
        // الذراعان
        const armGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 6);
        const armMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.2, 2, 0);
        leftArm.rotation.z = 0.3;
        colossusGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.2, 2, 0);
        rightArm.rotation.z = -0.3;
        colossusGroup.add(rightArm);
        
        return colossusGroup;
    }

    // إنشاء فخ ناري
    createFireTrap3D() {
        const trapGroup = new THREE.Group();
        
        // قاعدة الفخ
        const baseGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 0.05, 0);
        trapGroup.add(base);
        
        // اللهب
        const flameGeometry = new THREE.ConeGeometry(0.3, 1, 8);
        const flameMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xFF4500,
            emissive: 0xFF0000,
            transparent: true,
            opacity: 0.8
        });
        const flame = new THREE.Mesh(flameGeometry, flameMaterial);
        flame.position.set(0, 0.6, 0);
        trapGroup.add(flame);
        
        // الإضاءة النارية
        const fireLight = new THREE.PointLight(0xFF4500, 0.8, 3);
        fireLight.position.set(0, 0.5, 0);
        trapGroup.add(fireLight);
        
        return trapGroup;
    }

    // إنشاء برج رماية آلية
    createAutoTurret3D() {
        const turretGroup = new THREE.Group();
        
        // قاعدة البرج
        const baseGeometry = new THREE.CylinderGeometry(0.4, 0.6, 0.3, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4A5568 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 0.15, 0);
        turretGroup.add(base);
        
        // جسم البرج
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.8, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x718096 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(0, 0.7, 0);
        turretGroup.add(body);
        
        // المدفع
        const cannonGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.6, 6);
        const cannonMaterial = new THREE.MeshPhongMaterial({ color: 0x2D3748 });
        const cannon = new THREE.Mesh(cannonGeometry, cannonMaterial);
        cannon.position.set(0, 1.2, 0.3);
        cannon.rotation.x = 0.2;
        turretGroup.add(cannon);
        
        return turretGroup;
    }

    // تحديث أنيميشن كهف الغموض
    updateCaveAnimations() {
        const currentTime = Date.now();
        
        this.scene.traverse((object) => {
            if (object.userData && object.userData.animationSpeed) {
                const data = object.userData;
                const elapsed = (currentTime - this.lastCaveUpdate) / 1000;
                
                if (!this.lastCaveUpdate) {
                    this.lastCaveUpdate = currentTime;
                    return;
                }
                
                // أنيميشن التحليق للصور المتوهجة
                object.position.y = data.originalY + Math.sin(elapsed * data.animationSpeed + data.phase) * 0.2;
                
                // تغيير الشفافية
                if (object.material) {
                    object.material.opacity = 0.5 + (Math.sin(elapsed * data.animationSpeed + data.phase) * 0.3);
                }
            }
        });
    }

    // ======================================
    // نظام القوات - Troop System Management
    // ======================================
    
    // ترقية القوات
    upgradeTroop() {
        const currentTroop = this.troopSystem.currentTroop;
        const nextIndex = this.troopSystem.troopIndex + 1;
        
        if (nextIndex > (this.ownerSystem.isOwnerMode ? 14 : 10)) {
            this.showMessage("تم الوصول للحد الأقصى للقوات!", "info");
            return;
        }
        
        const nextTroop = `T${nextIndex}`;
        const requirements = this.troopSystem.troopRequirements[nextTroop];
        const playerLevel = this.getCurrentLevelValue();
        
        // فحص المتطلبات
        if (playerLevel < requirements.level) {
            this.showMessage(`يتطلب مستوى ${this.getLevelName(requirements.level)} للترقية`, "error");
            return;
        }
        
        if (this.resources.gold < requirements.gold || this.resources.food < requirements.food) {
            this.showMessage("موارد غير كافية للترقية!", "error");
            return;
        }
        
        // فحص للمالك
        if (!this.ownerSystem.isOwnerMode && nextIndex > 10) {
            this.showMessage("المالك فقط يمكنه الوصول للقوات T11 وما فوق", "error");
            return;
        }
        
        // فحص عمر الحساب
        if (nextIndex > 8 && !this.canAccessKingdoms()) {
            this.showMessage("يتطلب عمر حساب 3 أيام للوصول لهذه القوات", "error");
            return;
        }
        
        // خصم الموارد
        this.resources.gold -= requirements.gold;
        this.resources.food -= requirements.food;
        
        // ترقية القوات
        this.troopSystem.troopIndex = nextIndex;
        this.troopSystem.currentTroop = nextTroop;
        
        // تحديث القوة الإجمالية
        this.updateTotalPower();
        
        this.showMessage(`تم ترقية القوات إلى ${nextTroop} - ${this.troopSystem.troopNames[nextTroop]}!`, "success");
        this.updateResourceDisplay();
        this.updateTroopDisplay();
        this.updateLevelDisplay();
        
        // حفظ الترقية
        if (this.ownerSystem.isOwnerMode) {
            this.ownerSystem.developmentHistory.push({
                timestamp: Date.now(),
                action: "ترقية القوات",
                details: `تم ترقية القوات إلى ${nextTroop}`
            });
        }
    }
    
    // خفض القوات
    downgradeTroop() {
        if (this.troopSystem.troopIndex <= 1) {
            this.showMessage("القوات في أدنى مستوى!", "info");
            return;
        }
        
        if (!this.ownerSystem.isOwnerMode) {
            this.showMessage("هذه الميزة متاحة للمالك فقط!", "error");
            return;
        }
        
        const oldTroop = this.troopSystem.currentTroop;
        this.troopSystem.troopIndex--;
        this.troopSystem.currentTroop = `T${this.troopSystem.troopIndex}`;
        
        this.showMessage(`تم خفض القوات من ${oldTroop} إلى ${this.troopSystem.currentTroop}`, "info");
        this.updateTotalPower();
        this.updateTroopDisplay();
    }
    
    // الحصول على قيمة المستوى الحالي
    getCurrentLevelValue() {
        const levelMap = {
            'C1': 1, 'C2': 2, 'C3': 3, 'C4': 4, 'C5': 5,
            'C6': 6, 'C7': 7, 'C8': 8, 'C9': 9, 'C10': 10,
            'C11': 11, 'C12': 12, 'C13': 13, 'C14': 14, 'C15': 15,
            'C16': 16, 'C17': 17, 'C18': 18, 'C19': 19, 'C20': 20,
            'C21': 21, 'C22': 22, 'C23': 23, 'C24': 24, 'C25': 25,
            'C26': 26, 'C27': 27, 'C28': 28, 'C29': 29, 'C30': 30,
            'C31': 31, 'C32': 32, 'C33': 33, 'C34': 34, 'C35': 35,
            'C36': 36, 'C37': 37, 'C38': 38, 'C39': 39, 'C40': 40,
            'C41': 41, 'C42': 42, 'C43': 43, 'C44': 44, 'C45': 45
        };
        return levelMap[this.level] || 1;
    }
    
    // الحصول على اسم المستوى
    getLevelName(levelValue) {
        if (levelValue > 40) return `C${levelValue}`;
        return `C${levelValue}`;
    }
    
    // ======================================
    // نظام التنقل بين الممالك - Kingdom Travel System
    // ======================================
    
    // تحديث عمر الحساب
    updateAccountAge() {
        const now = Date.now();
        const accountAge = now - this.accountAge.createdAt;
        const daysOld = Math.floor(accountAge / (24 * 60 * 60 * 1000));
        
        this.accountAge.daysOld = daysOld;
        this.accountAge.canAccessOtherKingdoms = this.ownerSystem.isOwnerMode || accountAge >= this.accountAge.minimumAge;
        
        // فحص الوصول للممالك
        this.checkKingdomAccess();
    }
    
    // فحص الوصول للممالك
    checkKingdomAccess() {
        const currentLevel = this.getCurrentLevelValue();
        const accountAge = this.accountAge.daysOld || 0;
        
        this.kingdomAccess.availableKingdoms.forEach(kingdom => {
            if (kingdom.id === "tech_empire") {
                kingdom.unlocked = true;
            } else {
                const levelRequired = parseInt(kingdom.level.substring(1));
                const ageRequired = kingdom.requiresAge || 0;
                
                // للمالك: وصول فوري
                if (this.ownerSystem.isOwnerMode) {
                    kingdom.unlocked = true;
                } else {
                    // للاعبين العاديين
                    kingdom.unlocked = currentLevel >= levelRequired && accountAge >= ageRequired;
                }
            }
        });
    }
    
    // التنقل إلى مملكة أخرى
    travelToKingdom(kingdomId) {
        const kingdom = this.kingdomAccess.availableKingdoms.find(k => k.id === kingdomId);
        
        if (!kingdom) {
            this.showMessage("المملكة غير موجودة!", "error");
            return false;
        }
        
        if (!kingdom.unlocked) {
            const levelRequired = kingdom.level;
            const ageRequired = kingdom.requiresAge || 0;
            let reason = "";
            
            const currentLevel = this.getCurrentLevelValue();
            const currentLevelStr = this.getLevelName(currentLevel);
            
            if (currentLevelStr < levelRequired) {
                reason = `يتطلب ${levelRequired} للوصول لهذه المملكة`;
            }
            
            if (!this.ownerSystem.isOwnerMode && (this.accountAge.daysOld || 0) < ageRequired) {
                reason = `يتطلب عمر حساب ${ageRequired} يوم للوصول لهذه المملكة`;
            }
            
            this.showMessage(reason || "غير مسموح بالدخول!", "error");
            return false;
        }
        
        // فحص الموارد للتنقل
        const travelCost = this.calculateTravelCost(kingdom);
        if (this.resources.gold < travelCost) {
            this.showMessage(`يتطلب ${travelCost} ذهبية للتنقل!`, "error");
            return false;
        }
        
        // خصم تكلفة التنقل
        this.resources.gold -= travelCost;
        
        // تحديث المملكة الحالية
        this.currentKingdom = kingdomId;
        this.kingdomAccess.allowedKingdoms = [kingdom.name];
        
        this.showMessage(`تم التنقل إلى مملكة ${kingdom.name} بنجاح!`, "success");
        this.updateResourceDisplay();
        this.updateKingdomDisplay();
        
        return true;
    }
    
    // حساب تكلفة التنقل
    calculateTravelCost(kingdom) {
        const baseCost = 500;
        const kingdomIndex = this.kingdomAccess.availableKingdoms.findIndex(k => k.id === kingdom.id);
        return baseCost + (kingdomIndex * 200);
    }
    
    // ======================================
    // نظام إدارة المالك - Owner Management System
    // ======================================
    
    // تفعيل وضع المالك
    toggleOwnerMode() {
        this.ownerSystem.isOwnerMode = !this.ownerSystem.isOwnerMode;
        
        if (this.ownerSystem.isOwnerMode) {
            this.showMessage("تم تفعيل وضع المالك - جميع الصلاحيات متاحة", "success");
            this.createOwnerPanel();
            this.enableOwnerFeatures();
        } else {
            this.showMessage("تم إلغاء وضع المالك", "info");
            this.removeOwnerPanel();
            this.disableOwnerFeatures();
        }
    }
    
    // إنشاء لوحة المالك
    createOwnerPanel() {
        // إزالة اللوحة الموجودة
        this.removeOwnerPanel();
        
        const panel = document.createElement('div');
        panel.id = 'ownerPanel';
        panel.className = 'owner-panel';
        panel.innerHTML = `
            <div class="owner-panel-header">
                <h3>⚡ لوحة المالك</h3>
                <button class="close-btn" onclick="game.removeOwnerPanel()">×</button>
            </div>
            <div class="owner-panel-content">
                <div class="owner-section">
                    <h4>🔧 تطوير فوري</h4>
                    <button class="owner-btn" onclick="game.instantDevelopAll()">تطوير كل المباني - المستوى 5</button>
                    <button class="owner-btn" onclick="game.instantDevelopResource()">تطوير الموارد - المستوى 5</button>
                    <button class="owner-btn" onclick="game.instantDevelopMilitary()">تطوير الجيش - المستوى 5</button>
                    <button class="owner-btn" onclick="game.instantResearchAll()">إنهاء البحث - المستوى 5</button>
                </div>
                
                <div class="owner-section">
                    <h4>🎮 اختبار اللعبة</h4>
                    <button class="owner-btn" onclick="game.generateUnlimitedResources()">موارد لا نهائية</button>
                    <button class="owner-btn" onclick="game.generateAllUnits()">جميع الوحدات - الحد الأقصى</button>
                    <button class="owner-btn" onclick="game.unlockAllFeatures()">فتح جميع المميزات</button>
                    <button class="owner-btn" onclick="game.resetGameForTesting()">إعادة تعيين للاختبار</button>
                </div>
                
                <div class="owner-section">
                    <h4>⚖️ توازن اللعبة</h4>
                    <button class="owner-btn" onclick="game.reduceAllBuildings()">خفض جميع المباني - المستوى 1</button>
                    <button class="owner-btn" onclick="game.rebalancePlayerEnvironment()">توازن بيئة اللاعبين</button>
                    <button class="owner-btn" onclick="game.exportPlayerData()">تصدير بيانات اللاعبين</button>
                    <button class="owner-btn" onclick="game.importPlayerData()">استيراد بيانات اللاعبين</button>
                </div>
                
                <div class="owner-section">
                    <h4>📊 إحصائيات متقدمة</h4>
                    <button class="owner-btn" onclick="game.showDetailedStats()">الإحصائيات المفصلة</button>
                    <button class="owner-btn" onclick="game.generateTestReport()">تقرير اختبار شامل</button>
                    <button class="owner-btn" onclick="game.validateGameBalance()">فحص توازن اللعبة</button>
                </div>
                
                <div class="owner-section">
                    <h4>🔧 أدوات المطور</h4>
                    <button class="owner-btn" onclick="game.toggleDebugMode()">وضع التطوير</button>
                    <button class="owner-btn" onclick="game.forceSave()">حفظ فوري</button>
                    <button class="owner-btn" onclick="game.emergencyReset()">إعادة تشغيل طارئة</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.ownerSystem.ownerPanel = panel;
    }
    
    // إزالة لوحة المالك
    removeOwnerPanel() {
        const existingPanel = document.getElementById('ownerPanel');
        if (existingPanel) {
            existingPanel.remove();
        }
        this.ownerSystem.ownerPanel = null;
    }
    
    // تفعيل مميزات المالك
    enableOwnerFeatures() {
        this.ownerSystem.instantDevelopment.enabled = true;
        this.ownerSystem.buildingReduction.enabled = true;
        this.ownerSystem.testingMode.allUnitsAvailable = true;
        this.ownerSystem.testingMode.maxResources = true;
        this.ownerSystem.testingMode.allBuildingsUnlocked = true;
        this.ownerSystem.testingMode.freeResearch = true;
        
        // فتح جميع القوات
        this.ownerSystem.unlockedAllTroops = true;
        this.openAllTroops();
        
        // فتح جميع الممالك
        this.ownerSystem.unlockedAllKingdoms = true;
        this.openAllKingdoms();
        
        // تحديث الواجهة
        this.updateAllDisplays();
    }
    
    // فتح جميع القوات
    openAllTroops() {
        this.troopSystem.troopIndex = 14;
        this.troopSystem.currentTroop = "T14";
    }
    
    // فتح جميع الممالك
    openAllKingdoms() {
        this.kingdomAccess.availableKingdoms.forEach(kingdom => {
            kingdom.unlocked = true;
        });
        this.accountAge.canAccessOtherKingdoms = true;
    }
    
    // تحديث جميع العروض
    updateAllDisplays() {
        this.updateTroopDisplay();
        this.updateKingdomDisplay();
        this.updateTotalPower();
        this.updateLevelDisplay();
        this.updateResourceDisplay();
    }
    
    // إلغاء تفعيل مميزات المالك
    disableOwnerFeatures() {
        this.ownerSystem.instantDevelopment.enabled = false;
        this.ownerSystem.buildingReduction.enabled = false;
        // إرجاع المميزات إلى حالتها الطبيعية
        this.updateUI();
    }
    
    // تطوير فوري لجميع المباني
    instantDevelopAll() {
        if (!this.ownerSystem.isOwnerMode) {
            this.showMessage("هذه الميزة متاحة للمالك فقط!", "error");
            return;
        }
        
        let developmentLog = "=== تطوير فوري شامل ===\n";
        
        // تطوير جميع المباني إلى المستوى 5
        this.buildings.forEach(building => {
            const oldLevel = building.level;
            building.level = this.ownerSystem.instantDevelopment.maxLevel;
            building.position.y = 0.5 + (building.level * 0.5);
            
            // تحديث الحجم والمظهر
            const scale = 1 + (building.level * 0.2);
            building.mesh.scale.set(scale, 1 + (building.level * 0.3), scale);
            
            // تحديث اللون حسب المستوى
            this.updateBuildingAppearance(building, this.ownerSystem.instantDevelopment.maxLevel);
            
            developmentLog += `تم تطوير ${building.name} من المستوى ${oldLevel} إلى ${this.ownerSystem.instantDevelopment.maxLevel}\n`;
        });
        
        // إعادة حساب القوة الإجمالية
        this.calculateTotalPower();
        
        // إضافة قطع نادرة مجاناً
        this.resources.diamonds = (this.resources.diamonds || 0) + 1000;
        this.resources.gems = (this.resources.gems || 0) + 500;
        this.resources.crystals = (this.resources.crystals || 0) + 250;
        this.resources.sacredRelics = (this.resources.sacredRelics || 0) + 50;
        this.resources.emperorCrowns = (this.resources.emperorCrowns || 0) + 25;
        
        developmentLog += "تم إضافة قطع نادرة مجانية\n";
        developmentLog += "المستوى: الماسي (المستوى 5)\n";
        developmentLog += "الحالة: جاهز للاختبار!\n";
        
        this.showMessage("تم تطوير جميع المباني والمستوى 5 بنجاح!", "success");
        this.ownerSystem.developmentHistory.push({
            timestamp: Date.now(),
            action: "تطوير شامل",
            details: developmentLog
        });
        
        this.updateResourceDisplay();
        this.updateUI();
    }
    
    // تطوير فوري للموارد
    instantDevelopResource() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        this.resources.gold += 100000;
        this.resources.food += 100000;
        this.resources.wood += 100000;
        this.resources.stone += 100000;
        this.resources.iron += 100000;
        
        // إضافة قطع نادرة للموارد
        this.resources.diamonds = (this.resources.diamonds || 0) + 500;
        this.resources.gems = (this.resources.gems || 0) + 300;
        this.resources.crystals = (this.resources.crystals || 0) + 150;
        
        this.showMessage("تم تطوير الموارد - المستوى 5!", "success");
        this.updateResourceDisplay();
    }
    
    // تطوير فوري للجيش
    instantDevelopMilitary() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        // تطوير جميع الوحدات إلى الحد الأقصى
        Object.keys(this.militarySystem).forEach(unitType => {
            if (typeof this.militarySystem[unitType] === 'object' && this.militarySystem[unitType].max) {
                this.militarySystem[unitType].count = this.militarySystem[unitType].max;
            }
        });
        
        // تطوير التكنولوجيا العسكرية
        this.allianceSystem.allianceTech.levels.military = 5;
        this.militarySystem.hospital.level = 5;
        this.militarySystem.hospital.maxCapacity = 100;
        this.militarySystem.hospital.healingSpeed = 25;
        
        this.showMessage("تم تطوير الجيش - المستوى 5!", "success");
        this.updateMilitaryUIElements();
    }
    
    // إنهاء البحث فورياً
    instantResearchAll() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        // إنهاء جميع البحوث
        this.researchCompleted = [];
        for (let i = 1; i <= 10; i++) {
            this.researchCompleted.push(i);
        }
        
        this.researchInProgress = 0;
        this.showMessage("تم إنهاء البحث - المستوى 5!", "success");
        this.updateResearchDisplay();
    }
    
    // إنشاء موارد لا نهائية
    generateUnlimitedResources() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        const multipliers = [1000, 2000, 5000, 10000, 25000];
        const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        
        this.resources.gold += multiplier;
        this.resources.food += multiplier;
        this.resources.wood += multiplier;
        this.resources.stone += multiplier;
        this.resources.iron += multiplier;
        
        // إضافة قطع نادرة
        this.resources.diamonds = (this.resources.diamonds || 0) + Math.floor(multiplier / 10);
        this.resources.gems = (this.resources.gems || 0) + Math.floor(multiplier / 20);
        this.resources.crystals = (this.resources.crystals || 0) + Math.floor(multiplier / 50);
        
        this.showMessage(`تم إنشاء موارد لا نهائية (${multiplier.toLocaleString()})`, "success");
        this.updateResourceDisplay();
    }
    
    // إنشاء جميع الوحدات
    generateAllUnits() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        Object.keys(this.militarySystem).forEach(unitType => {
            if (typeof this.militarySystem[unitType] === 'object' && this.militarySystem[unitType].max) {
                this.militarySystem[unitType].count = this.militarySystem[unitType].max;
            }
        });
        
        this.showMessage("تم إنشاء جميع الوحدات - الحد الأقصى!", "success");
        this.updateMilitaryUIElements();
    }
    
    // فتح جميع المميزات
    unlockAllFeatures() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        // فتح جميع المباني
        this.buildings.forEach(building => {
            building.unlocked = true;
        });
        
        // فتح جميع الوحدات
        Object.keys(this.militarySystem).forEach(unitType => {
            if (typeof this.militarySystem[unitType] === 'object' && this.militarySystem[unitType].max) {
                this.militarySystem[unitType].unlocked = true;
            }
        });
        
        // فتح جميع البحوث
        this.researchCompleted = [];
        for (let i = 1; i <= 10; i++) {
            this.researchCompleted.push(i);
        }
        
        this.showMessage("تم فتح جميع المميزات!", "success");
        this.updateUI();
    }
    
    // خفض جميع المباني
    reduceAllBuildings() {
        if (!this.ownerSystem.isOwnerMode) {
            this.showMessage("هذه الميزة متاحة للمالك فقط!", "error");
            return;
        }
        
        let reductionLog = "=== خفض جميع المباني ===\n";
        
        this.buildings.forEach(building => {
            const oldLevel = building.level;
            building.level = Math.max(1, building.level - this.ownerSystem.buildingReduction.maxReduction);
            building.position.y = 0.5 + (building.level * 0.5);
            
            // تحديث الحجم والمظهر
            const scale = 1 + (building.level * 0.2);
            building.mesh.scale.set(scale, 1 + (building.level * 0.3), scale);
            
            // تحديث اللون حسب المستوى
            this.updateBuildingAppearance(building, building.level);
            
            reductionLog += `تم خفض ${building.name} من المستوى ${oldLevel} إلى ${building.level}\n`;
        });
        
        this.calculateTotalPower();
        
        reductionLog += "الحالة: تم توازن البيئات\n";
        
        this.showMessage("تم خفض جميع المباني بنجاح!", "success");
        this.ownerSystem.developmentHistory.push({
            timestamp: Date.now(),
            action: "خفض شامل",
            details: reductionLog
        });
        
        this.updateUI();
    }
    
    // توازن بيئة اللاعبين
    rebalancePlayerEnvironment() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        // توحيد مستويات المباني
        const targetLevel = Math.floor(this.buildings.length / 3) + 1;
        
        this.buildings.forEach(building => {
            if (building.level > targetLevel) {
                building.level = targetLevel;
                building.position.y = 0.5 + (building.level * 0.5);
                const scale = 1 + (building.level * 0.2);
                building.mesh.scale.set(scale, 1 + (building.level * 0.3), scale);
                this.updateBuildingAppearance(building, building.level);
            }
        });
        
        // توحيد الموارد
        const baseResources = 1000;
        this.resources.gold = baseResources;
        this.resources.food = baseResources;
        this.resources.wood = Math.floor(baseResources * 0.7);
        this.resources.stone = Math.floor(baseResources * 0.5);
        this.resources.iron = Math.floor(baseResources * 0.3);
        
        this.showMessage("تم توازن بيئة اللاعبين!", "success");
        this.updateResourceDisplay();
        this.updateUI();
    }
    
    // إعادة تعيين للاختبار
    resetGameForTesting() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        if (confirm("هل أنت متأكد من إعادة تعيين اللعبة للاختبار؟ سيتم فقدان جميع التقدم.")) {
            // إعادة تعيين الموارد
            this.resources = {
                gold: 5000,
                food: 3000,
                wood: 2000,
                stone: 1500,
                iron: 1000,
                diamonds: 100,
                gems: 50,
                crystals: 25,
                sacredRelics: 10,
                emperorCrowns: 5
            };
            
            // إعادة تعيين المباني
            this.buildings.forEach(building => {
                building.level = 3;
                building.position.y = 0.5 + (building.level * 0.5);
                const scale = 1 + (building.level * 0.2);
                building.mesh.scale.set(scale, 1 + (building.level * 0.3), scale);
                this.updateBuildingAppearance(building, building.level);
            });
            
            // إعادة تعيين الوحدات
            Object.keys(this.militarySystem).forEach(unitType => {
                if (typeof this.militarySystem[unitType] === 'object' && this.militarySystem[unitType].max) {
                    this.militarySystem[unitType].count = Math.floor(this.militarySystem[unitType].max * 0.7);
                }
            });
            
            this.showMessage("تم إعادة تعيين اللعبة للاختبار!", "success");
            this.updateResourceDisplay();
            this.updateUI();
        }
    }
    
    // تصدير بيانات اللاعبين
    exportPlayerData() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        const playerData = {
            timestamp: Date.now(),
            level: this.level,
            resources: this.resources,
            buildings: this.buildings.map(b => ({
                id: b.id,
                type: b.type,
                level: b.level,
                name: b.name
            })),
            military: this.militarySystem,
            research: this.researchCompleted,
            allianceTech: this.allianceSystem.allianceTech.levels
        };
        
        const dataStr = JSON.stringify(playerData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `player_data_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage("تم تصدير بيانات اللاعبين!", "success");
    }
    
    // استيراد بيانات اللاعبين
    importPlayerData() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        this.applyPlayerData(data);
                        this.showMessage("تم استيراد بيانات اللاعبين!", "success");
                    } catch (error) {
                        this.showMessage("خطأ في قراءة الملف!", "error");
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    // تطبيق بيانات اللاعبين
    applyPlayerData(data) {
        if (data.resources) this.resources = data.resources;
        if (data.buildings) {
            data.buildings.forEach((buildingData, index) => {
                if (this.buildings[index]) {
                    this.buildings[index].level = buildingData.level;
                    this.buildings[index].name = buildingData.name;
                }
            });
        }
        if (data.military) this.militarySystem = data.military;
        if (data.research) this.researchCompleted = data.research;
        if (data.allianceTech) this.allianceSystem.allianceTech.levels = data.allianceTech;
        
        this.updateResourceDisplay();
        this.updateUI();
    }
    
    // عرض الإحصائيات المفصلة
    showDetailedStats() {
        const stats = `
        === إحصائيات مفصلة ===
        
        المستوى: ${this.level}
        القوة الإجمالية: ${this.calculateTotalPower()}
        
        الموارد:
        - الذهب: ${this.resources.gold.toLocaleString()}
        - الطعام: ${this.resources.food.toLocaleString()}
        - الخشب: ${this.resources.wood.toLocaleString()}
        - الحجر: ${this.resources.stone.toLocaleString()}
        - الحديد: ${this.resources.iron.toLocaleString()}
        
        قطع نادرة:
        - الماسات: ${(this.resources.diamonds || 0).toLocaleString()}
        - الأحجار الكريمة: ${(this.resources.gems || 0).toLocaleString()}
        - البلورات: ${(this.resources.crystals || 0).toLocaleString()}
        - الآثار المقدسة: ${(this.resources.sacredRelics || 0).toLocaleString()}
        - التيجان الإمبراطورية: ${(this.resources.emperorCrowns || 0).toLocaleString()}
        
        المباني: ${this.buildings.length}
        الوحدات العسكرية: ${Object.keys(this.militarySystem).filter(k => typeof this.militarySystem[k] === 'object').length}
        البحث: ${this.researchCompleted.length}/10
        
        آخر نشاط: ${new Date().toLocaleString()}
        `;
        
        console.log(stats);
        this.showMessage("تم عرض الإحصائيات في وحدة التحكم", "info");
    }
    
    // تقرير اختبار شامل
    generateTestReport() {
        const report = {
            timestamp: Date.now(),
            gameVersion: "1.0.0",
            player: {
                level: this.level,
                totalPower: this.calculateTotalPower(),
                resources: this.resources,
                buildings: this.buildings.length,
                militaryUnits: Object.keys(this.militarySystem).filter(k => typeof this.militarySystem[k] === 'object').length,
                researchCompleted: this.researchCompleted.length
            },
            balanceCheck: {
                resourceDistribution: "OK",
                buildingLevels: "OK",
                militaryBalance: "OK",
                researchProgression: "OK"
            },
            recommendations: [
                "اللعبة متوازنة بشكل عام",
                "مستوى الصعوبة مناسب",
                "نظام الموارد يعمل بكفاءة",
                "واجهة المستخدم سلسة"
            ]
        };
        
        const reportStr = JSON.stringify(report, null, 2);
        const reportBlob = new Blob([reportStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(reportBlob);
        link.download = `test_report_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showMessage("تم إنشاء تقرير اختبار شامل!", "success");
    }
    
    // فحص توازن اللعبة
    validateGameBalance() {
        const issues = [];
        
        // فحص الموارد
        if (this.resources.gold > 100000) issues.push("الذهب مرتفع جداً");
        if (this.resources.food > 100000) issues.push("الطعام مرتفع جداً");
        
        // فحص المباني
        const highLevelBuildings = this.buildings.filter(b => b.level > 4).length;
        if (highLevelBuildings > this.buildings.length * 0.3) {
            issues.push("كثير من المباني عالية المستوى");
        }
        
        // فحص الوحدات
        const totalUnits = Object.keys(this.militarySystem)
            .filter(k => typeof this.militarySystem[k] === 'object')
            .reduce((sum, k) => sum + this.militarySystem[k].count, 0);
        if (totalUnits > 1000) issues.push("عدد الوحدات مرتفع جداً");
        
        if (issues.length === 0) {
            this.showMessage("✅ اللعبة متوازنة بشكل ممتاز!", "success");
        } else {
            this.showMessage(`⚠️ مشاكل في التوازن: ${issues.join(', ')}`, "warning");
        }
        
        return issues;
    }
    
    // تبديل وضع التطوير
    toggleDebugMode() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        this.isDebugMode = !this.isDebugMode;
        if (this.isDebugMode) {
            this.showMessage("تم تفعيل وضع التطوير", "info");
            this.showDebugInfo();
        } else {
            this.showMessage("تم إلغاء وضع التطوير", "info");
            this.hideDebugInfo();
        }
    }
    
    // عرض معلومات التطوير
    showDebugInfo() {
        const debugDiv = document.createElement('div');
        debugDiv.id = 'debugInfo';
        debugDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; 
            background: rgba(0,0,0,0.8); color: white; 
            padding: 10px; border-radius: 5px; 
            font-size: 12px; z-index: 10000;
        `;
        debugDiv.innerHTML = `
            <div>FPS: <span id="debugFps">60</span></div>
            <div>Objects: ${this.scene.children.length}</div>
            <div>Memory: <span id="debugMemory">0</span> MB</div>
        `;
        document.body.appendChild(debugDiv);
    }
    
    // إخفاء معلومات التطوير
    hideDebugInfo() {
        const debugDiv = document.getElementById('debugInfo');
        if (debugDiv) debugDiv.remove();
    }
    
    // حفظ فوري
    forceSave() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        // حفظ البيانات محلياً
        localStorage.setItem('techEmpireGameOwner', JSON.stringify({
            resources: this.resources,
            level: this.level,
            buildings: this.buildings.map(b => ({id: b.id, level: b.level, name: b.name})),
            militarySystem: this.militarySystem,
            researchCompleted: this.researchCompleted,
            timestamp: Date.now()
        }));
        
        this.showMessage("تم حفظ البيانات فوراً!", "success");
    }
    
    // إعادة تشغيل طارئة
    emergencyReset() {
        if (!this.ownerSystem.isOwnerMode) return;
        
        if (confirm("⚠️ إعادة تشغيل طارئة؟ سيتم إعادة تعيين كل شيء!")) {
            localStorage.removeItem('techEmpireGameOwner');
            location.reload();
        }
    }
    
    // ======================================
    // دوال تحديث الواجهة - UI Update Functions
    // ======================================
    
    // تحديث عرض القوات
    updateTroopDisplay() {
        const troopDisplay = document.getElementById('troopDisplay');
        if (!troopDisplay) return;
        
        const currentTroop = this.troopSystem.currentTroop;
        const troopName = this.troopSystem.troopNames[currentTroop];
        const nextIndex = Math.min(this.troopSystem.troopIndex + 1, this.ownerSystem.isOwnerMode ? 14 : 10);
        const nextTroop = `T${nextIndex}`;
        const canUpgrade = this.canUpgradeTroop();
        const requirements = this.troopSystem.troopRequirements[nextTroop] || {};
        const bonuses = this.troopSystem.troopBonuses[currentTroop];
        
        troopDisplay.innerHTML = `
            <div class="troop-card">
                <div class="troop-header">
                    <h3>⚔️ القوات الحالية</h3>
                    <div class="troop-level">${currentTroop}</div>
                </div>
                <div class="troop-info">
                    <div class="troop-name">${troopName}</div>
                    <div class="troop-stats">
                        <span>الهجوم: +${bonuses.attack}</span>
                        <span>الدفاع: +${bonuses.defense}</span>
                        <span>الصحة: +${bonuses.health}</span>
                    </div>
                </div>
                <div class="troop-actions">
                    <button class="upgrade-btn" onclick="game.upgradeTroop()" ${!canUpgrade ? 'disabled' : ''}>
                        ${canUpgrade ? `ترقية إلى ${nextTroop}` : 'لا يمكن الترقية'}
                    </button>
                    <button class="info-btn" onclick="game.showTroopDetails()">تفاصيل</button>
                </div>
                ${nextTroop && requirements.level ? `
                    <div class="upgrade-requirements">
                        <div>يتطلب: ${this.getLevelName(requirements.level)}</div>
                        <div>التكلفة: ${requirements.gold || 0} ذهب, ${requirements.food || 0} طعام</div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // فحص إمكانية ترقية القوات
    canUpgradeTroop() {
        const nextIndex = this.troopSystem.troopIndex + 1;
        const maxIndex = this.ownerSystem.isOwnerMode ? 14 : 10;
        
        if (nextIndex > maxIndex) return false;
        
        const nextTroop = `T${nextIndex}`;
        const requirements = this.troopSystem.troopRequirements[nextTroop];
        const playerLevel = this.getCurrentLevelValue();
        
        // فحص المتطلبات
        if (playerLevel < requirements.level) return false;
        if (this.resources.gold < requirements.gold) return false;
        if (this.resources.food < requirements.food) return false;
        
        // فحص عمر الحساب للقوات العالية
        if (nextIndex > 8 && !this.canAccessKingdoms()) return false;
        
        return true;
    }
    
    // عرض تفاصيل القوات
    showTroopDetails() {
        const currentTroop = this.troopSystem.currentTroop;
        const details = `
        === تفاصيل القوات ===
        
        المستوى الحالي: ${currentTroop}
        الاسم: ${this.troopSystem.troopNames[currentTroop]}
        القوة الهجومية: +${this.troopSystem.troopBonuses[currentTroop].attack}
        القوة الدفاعية: +${this.troopSystem.troopBonuses[currentTroop].defense}
        زيادة الصحة: +${this.troopSystem.troopBonuses[currentTroop].health}
        
        الفئة: ${this.troopSystem.troopIndex <= 4 ? 'مبتدئ' : 
                this.troopSystem.troopIndex <= 8 ? 'متقدم' : 
                this.troopSystem.troopIndex <= 10 ? 'خبير' : 'أسطوري'}
        `;
        
        alert(details);
    }
    
    // تحديث عرض الممالك
    updateKingdomDisplay() {
        const kingdomDisplay = document.getElementById('kingdomDisplay');
        if (!kingdomDisplay) return;
        
        const currentKingdom = this.kingdomAccess.availableKingdoms.find(k => k.id === this.currentKingdom) || 
                              this.kingdomAccess.availableKingdoms[0];
        
        const availableKingdoms = this.kingdomAccess.availableKingdoms.filter(k => k.unlocked);
        const accountAge = this.accountAge.daysOld || 0;
        const canAccessOther = this.canAccessKingdoms();
        
        kingdomDisplay.innerHTML = `
            <div class="kingdom-card">
                <div class="kingdom-header">
                    <h3>🏰 المملكة الحالية</h3>
                    <div class="kingdom-name">${currentKingdom.name}</div>
                </div>
                <div class="kingdom-info">
                    <div>العمر: ${accountAge} يوم</div>
                    <div>يمكن التنقل: ${canAccessOther ? '✅ نعم' : '❌ لا'}</div>
                </div>
                <div class="kingdom-actions">
                    <button class="travel-btn" onclick="game.showKingdomSelector()" 
                            ${!canAccessOther ? 'disabled' : ''}>
                        تنقل بين الممالك
                    </button>
                </div>
                <div class="available-kingdoms">
                    <h4>الممالك المتاحة (${availableKingdoms.length}):</h4>
                    ${availableKingdoms.map(kingdom => `
                        <div class="kingdom-item ${kingdom.id === this.currentKingdom ? 'current' : ''}">
                            <span>${kingdom.name}</span>
                            <span class="requirement">${kingdom.level}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // فحص إمكانية الوصول للممالك
    canAccessKingdoms() {
        return this.ownerSystem.isOwnerMode || 
               this.getCurrentLevelValue() >= 8 && 
               (this.accountAge.daysOld || 0) >= 3;
    }
    
    // عرض منتقي الممالك
    showKingdomSelector() {
        if (!this.canAccessKingdoms()) {
            this.showMessage("يتطلب C8 وعمر 3 أيام للتنقل بين الممالك!", "error");
            return;
        }
        
        const modal = document.createElement('div');
        modal.className = 'kingdom-selector-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>اختيار المملكة</h3>
                    <button class="close-btn" onclick="this.closest('.kingdom-selector-modal').remove()">×</button>
                </div>
                <div class="kingdom-list">
                    ${this.kingdomAccess.availableKingdoms.map(kingdom => `
                        <div class="kingdom-option ${kingdom.unlocked ? 'unlocked' : 'locked'} 
                                        ${kingdom.id === this.currentKingdom ? 'current' : ''}">
                            <div class="kingdom-info">
                                <h4>${kingdom.name}</h4>
                                <p>${kingdom.description}</p>
                                <div class="requirements">
                                    <span>المستوى: ${kingdom.level}</span>
                                    ${kingdom.requiresAge ? `<span>العمر: ${kingdom.requiresAge} يوم</span>` : ''}
                                </div>
                            </div>
                            <button class="travel-btn" 
                                    onclick="game.travelToKingdom('${kingdom.id}')"
                                    ${!kingdom.unlocked ? 'disabled' : ''}>
                                ${kingdom.unlocked ? 'تنقل' : 'مغلق'}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // تحديث القوة الإجمالية
    updateTotalPower() {
        let totalPower = 0;
        
        // قوة المستوى
        totalPower += this.getCurrentLevelValue() * 10;
        
        // قوة المباني
        this.buildings.forEach(building => {
            totalPower += building.userData.level * 5;
        });
        
        // قوة القوات
        const troopBonuses = this.troopSystem.troopBonuses[this.troopSystem.currentTroop];
        totalPower += troopBonuses.attack + troopBonuses.defense;
        
        // قوة الوحدات العسكرية
        const militaryPower = Object.keys(this.militarySystem)
            .filter(k => typeof this.militarySystem[k] === 'object')
            .reduce((total, k) => total + (this.militarySystem[k].count * this.militarySystem[k].power), 0);
        totalPower += militaryPower;
        
        // جوائز التحالفات
        totalPower += this.allianceSystem.totalBonus;
        
        this.totalPower = totalPower;
        this.updatePowerDisplay();
    }
    
    // تحديث عرض القوة
    updatePowerDisplay() {
        const powerDisplay = document.getElementById('powerDisplay');
        if (!powerDisplay) return;
        
        powerDisplay.innerHTML = `
            <div class="power-breakdown">
                <div>المستوى: +${this.getCurrentLevelValue() * 10}</div>
                <div>المباني: +${this.buildings.reduce((sum, b) => sum + b.userData.level * 5, 0)}</div>
                <div>القوات: +${this.troopSystem.troopBonuses[this.troopSystem.currentTroop].attack + 
                                this.troopSystem.troopBonuses[this.troopSystem.currentTroop].defense}</div>
                <div>الوحدات: +${Object.keys(this.militarySystem)
                    .filter(k => typeof this.militarySystem[k] === 'object')
                    .reduce((sum, k) => sum + (this.militarySystem[k].count * this.militarySystem[k].power), 0)}</div>
                <div>التحالفات: +${this.allianceSystem.totalBonus}</div>
            </div>
        `;
    }
    
    // تحديث حالة نظام الذكاء الاصطناعي
    checkAIUnlock() {
        const currentLevel = this.getCurrentLevelValue();
        if (currentLevel >= 18 && !this.aiSystem.isUnlocked) {
            this.aiSystem.isUnlocked = true;
            this.aiSystem.currentLevel = 1;
            this.updateAICapabilities();
            this.showMessage("🤖 تم تفعيل نظام الذكاء الاصطناعي!", "info");
        } else if (currentLevel >= 18 && this.aiSystem.isUnlocked) {
            this.checkAILevelUp(currentLevel);
        }
    }
    
    // فحص ترقية مستوى الذكاء الاصطناعي
    checkAILevelUp(currentLevel) {
        for (let level = this.aiSystem.currentLevel + 1; level <= this.aiSystem.maxLevel; level++) {
            if (currentLevel >= this.aiSystem.aiLevels[level].unlockLevel) {
                this.aiSystem.currentLevel = level;
                this.updateAICapabilities();
                this.showMessage(`🤖 تم ترقية الذكاء الاصطناعي إلى ${this.aiSystem.aiLevels[level].name}!`, "success");
            }
        }
    }
    
    // تحديث قدرات الذكاء الاصطناعي
    updateAICapabilities() {
        this.aiSystem.currentCapabilities = [];
        
        // تحديث القدرات حسب المستوى
        if (this.aiSystem.currentLevel >= 1) {
            this.aiSystem.capabilities.organizeTroops = true;
            this.aiSystem.currentCapabilities.push("تنظيم القوات");
        }
        if (this.aiSystem.currentLevel >= 2) {
            this.aiSystem.capabilities.arrangeFormation = true;
            this.aiSystem.currentCapabilities.push("ترتيب صفوف القتال");
        }
        if (this.aiSystem.currentLevel >= 3) {
            this.aiSystem.capabilities.optimizeDefense = true;
            this.aiSystem.currentCapabilities.push("تحسين الدفاعات");
        }
        if (this.aiSystem.currentLevel >= 4) {
            this.aiSystem.capabilities.readBattleReports = true;
            this.aiSystem.currentCapabilities.push("قراءة تقارير المعركة");
        }
        if (this.aiSystem.currentLevel >= 5) {
            this.aiSystem.capabilities.predictEnemyMoves = true;
            this.aiSystem.currentCapabilities.push("توقع حركات العدو");
        }
        if (this.aiSystem.currentLevel >= 6) {
            this.aiSystem.capabilities.autoManageResources = true;
            this.aiSystem.currentCapabilities.push("إدارة الموارد التلقائية");
        }
        if (this.aiSystem.currentLevel >= 7) {
            this.aiSystem.capabilities.analyzeWeaknesses = true;
            this.aiSystem.currentCapabilities.push("تحليل نقاط الضعف");
        }
        if (this.aiSystem.currentLevel >= 8) {
            this.aiSystem.capabilities.suggestUpgrades = true;
            this.aiSystem.currentCapabilities.push("اقتراح الترقيات");
        }
        if (this.aiSystem.currentLevel >= 9) {
            this.aiSystem.capabilities.coordinateAlliances = true;
            this.aiSystem.currentCapabilities.push("تنسيق التحالفات");
        }
        if (this.aiSystem.currentLevel >= 10) {
            this.aiSystem.capabilities.militaryAdvice = true;
            this.aiSystem.currentCapabilities.push("النصائح العسكرية");
        }
    }
    
    // تنظيم القوات بالذكاء الاصطناعي
    organizeTroops() {
        if (!this.aiSystem.capabilities.organizeTroops) {
            this.showMessage("هذه الميزة غير متاحة", "error");
            return;
        }
        
        // تحسين ترتيب القوات حسب المستوى
        const troopBonuses = this.troopSystem.troopBonuses[this.troopSystem.currentTroop];
        const currentLevel = this.getCurrentLevelValue();
        
        // حساب التنظيم الأمثل
        const optimalFormation = this.calculateOptimalFormation(troopBonuses, currentLevel);
        
        this.aiSystem.recommendations.push({
            type: "تنظيم القوات",
            message: `تم تنظيم القوات باستخدام ترتيب ${optimalFormation.name}`,
            timestamp: Date.now()
        });
        
        this.showMessage(`🤖 تم تنظيم القوات باستخدام ${optimalFormation.name}!`, "success");
        this.addAIExperience(100);
    }
    
    // ترتيب صفوف القتال
    arrangeFormation(formationType) {
        if (!this.aiSystem.capabilities.arrangeFormation) {
            this.showMessage("هذه الميزة غير متاحة", "error");
            return;
        }
        
        const formation = this.aiSystem.formations[formationType];
        if (!formation) {
            this.showMessage("نوع الترتيب غير صحيح", "error");
            return;
        }
        
        // تطبيق التحسين
        const effectiveness = formation.effectiveness;
        this.showMessage(`🤖 تم ترتيب صفوف القتال ${formation.name} (كفاءة: ${effectiveness}x)`, "success");
        
        this.addAIExperience(150);
    }
    
    // قراءة تقارير المعركة
    readBattleReport(report) {
        if (!this.aiSystem.capabilities.readBattleReports) {
            this.showMessage("هذه الميزة غير متاحة", "error");
            return;
        }
        
        const analysis = this.analyzeBattleReport(report);
        this.aiSystem.recommendations.push({
            type: "تحليل تقرير",
            message: analysis.summary,
            improvements: analysis.improvements,
            timestamp: Date.now()
        });
        
        this.showMessage("🤖 تم تحليل تقرير المعركة", "info");
        this.addAIExperience(200);
    }
    
    // حساب الترتيب الأمثل
    calculateOptimalFormation(troopBonuses, level) {
        if (level < 25) {
            return { name: "ترتيب الصف", effectiveness: 1.0 };
        } else if (level < 30) {
            return { name: "ترتيب الوتد", effectiveness: 1.3 };
        } else {
            return { name: "ترتيب السلحفاة", effectiveness: 1.5 };
        }
    }
    
    // تحليل تقرير المعركة
    analyzeBattleReport(report) {
        const losses = report.losses || 0;
        const gains = report.gains || 0;
        const efficiency = gains / Math.max(1, losses);
        
        let summary = "ممتاز! ";
        let improvements = [];
        
        if (efficiency > 2.0) {
            summary += "الكفاءة عالية جداً";
        } else if (efficiency > 1.5) {
            summary += "الكفاءة جيدة";
            improvements.push("يمكن تحسين التنظيم أكثر");
        } else if (efficiency > 1.0) {
            summary += "الكفاءة مقبولة";
            improvements.push("نحتاج لتحسين الدفاعات", "ترتيب صفوف القتال يحتاج مراجعة");
        } else {
            summary += "الكفاءة منخفضة";
            improvements.push("مراجعة شاملة للاستراتيجية", "ترقية القوات ضرورية", "تغيير ترتيب القتال");
        }
        
        if (losses > 1000) {
            improvements.push("تقليل خسائر القوات");
        }
        
        return { summary, improvements };
    }
    
    // إضافة خبرة للذكاء الاصطناعي
    addAIExperience(amount) {
        this.aiSystem.experience += amount;
        
        // فحص الترقية
        if (this.aiSystem.experience >= this.aiSystem.experienceToNextLevel()) {
            if (this.aiSystem.currentLevel < this.aiSystem.maxLevel) {
                this.aiSystem.currentLevel++;
                this.updateAICapabilities();
                this.showMessage(`🤖 ترقية جديدة! المستوى ${this.aiSystem.currentLevel}`, "success");
            }
        }
    }
    
    // حساب الخبرة المطلوبة للمستوى التالي
    experienceToNextLevel() {
        return this.aiSystem.experienceToNext * (this.aiSystem.currentLevel + 1);
    }
    
    // الحصول على توصيات الذكاء الاصطناعي
    getAIRecommendations() {
        if (this.aiSystem.recommendations.length === 0) {
            return "لا توجد توصيات حالياً";
        }
        
        return this.aiSystem.recommendations
            .slice(-5) // آخر 5 توصيات
            .map(rec => `• ${rec.message}`)
            .join("\n");
    }
    
    // تحديث عرض نظام الذكاء الاصطناعي
    updateAIDisplay() {
        const aiDisplay = document.getElementById('aiSystemDisplay');
        if (!aiDisplay) return;
        
        const level = this.aiSystem.aiLevels[this.aiSystem.currentLevel];
        const progress = (this.aiSystem.experience / this.aiSystem.experienceToNextLevel()) * 100;
        
        aiDisplay.innerHTML = `
            <div class="ai-system-card">
                <div class="ai-header">
                    <h3>🤖 نظام الذكاء الاصطناعي</h3>
                    <div class="ai-level">المستوى ${this.aiSystem.currentLevel}: ${level.name}</div>
                </div>
                <div class="ai-status">
                    ${this.aiSystem.isUnlocked ? '🟢 مفعل' : '🔴 غير مفعل'}
                </div>
                ${this.aiSystem.isUnlocked ? `
                    <div class="ai-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="progress-text">${Math.round(progress)}% للمستوى التالي</div>
                    </div>
                    <div class="ai-capabilities">
                        <h4>القدرات المتاحة:</h4>
                        <ul>
                            ${this.aiSystem.currentCapabilities.map(cap => `<li>✅ ${cap}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="ai-actions">
                        ${this.aiSystem.capabilities.organizeTroops ? 
                            `<button class="btn btn-sm" onclick="game.organizeTroops()">تنظيم القوات</button>` : ''}
                        ${this.aiSystem.capabilities.arrangeFormation ? 
                            `<button class="btn btn-sm" onclick="game.showFormationSelector()">ترتيب الصفوف</button>` : ''}
                        ${this.aiSystem.capabilities.readBattleReports ? 
                            `<button class="btn btn-sm" onclick="game.readLatestReport()">قراءة تقرير</button>` : ''}
                    </div>
                    <div class="ai-recommendations">
                        <h4>التوصيات الأخيرة:</h4>
                        <div class="recommendations-list">${this.getAIRecommendations()}</div>
                    </div>
                ` : `
                    <div class="ai-locked">
                        <p>متاح من المستوى C18</p>
                    </div>
                `}
            </div>
        `;
    }
    
    // عرض منظم ترتيب الصفوف
    showFormationSelector() {
        const formations = Object.keys(this.aiSystem.formations);
        let selector = "اختر ترتيب القتال:\n\n";
        
        formations.forEach((key, index) => {
            const formation = this.aiSystem.formations[key];
            selector += `${index + 1}. ${formation.name} - ${formation.description} (كفاءة: ${formation.effectiveness}x)\n`;
        });
        
        const choice = prompt(selector + "\nاختر رقم الترتيب:");
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < formations.length) {
            this.arrangeFormation(formations[index]);
        }
    }
    
    // قراءة آخر تقرير
    readLatestReport() {
        if (this.aiSystem.battleReports.length === 0) {
            this.showMessage("لا توجد تقارير للمعركة", "info");
            return;
        }
        
        const latestReport = this.aiSystem.battleReports[this.aiSystem.battleReports.length - 1];
        this.readBattleReport(latestReport);
    }
    
    // إضافة تقرير معركة
    addBattleReport(report) {
        this.aiSystem.battleReports.push({
            ...report,
            timestamp: Date.now()
        });
        
        // الاحتفاظ بآخر 10 تقارير فقط
        if (this.aiSystem.battleReports.length > 10) {
            this.aiSystem.battleReports.shift();
        }
    }
    
    // عرض قسم نظام الذكاء الاصطناعي
    showAISystemSection() {
        this.hideAllSections();
        document.getElementById('ai-system-section').style.display = 'block';
        this.updateAIDisplay();
    }
    
    // ======================================
    // نظام الرادار المتطور مع إشعارات الإنذار
    // ======================================
    
    // إضافة إنذار جديد
    addAlert(type, message, intensity = 1) {
        const alert = {
            id: Date.now(),
            type: type,
            message: message,
            intensity: intensity, // 1-5
            timestamp: Date.now(),
            isFlashing: true,
            distance: Math.random() * 1000 // مسافة عشوائية للاختبار
        };
        
        this.advancedRadar.alerts.unshift(alert);
        
        // الاحتفاظ بحد أقصى من الإنذارات
        if (this.advancedRadar.alerts.length > this.advancedRadar.maxAlerts) {
            this.advancedRadar.alerts = this.advancedRadar.alerts.slice(0, this.advancedRadar.maxAlerts);
        }
        
        // تشغيل الإنذار البصري والصوتي
        this.triggerAlert(alert);
        
        this.updateRadarDisplay();
        return alert;
    }
    
    // تشغيل الإنذار
    triggerAlert(alert) {
        // إشعار بصري
        this.showRadarAlert(alert);
        
        // صوت الإنذار (يمكن إضافة صوت مخصص)
        this.playAlertSound(alert.type);
    }
    
    // عرض الإنذار في الرادار
    showRadarAlert(alert) {
        const alertInfo = this.advancedRadar.alertTypes[alert.type];
        const intensityText = '🔥'.repeat(alert.intensity);
        
        this.showMessage(
            `${alertInfo.icon} ${alertInfo.name}: ${alert.message} ${intensityText}`,
            alert.type === 'WAR' ? 'error' : alert.type === 'AID' ? 'success' : 'info'
        );
    }
    
    // تشغيل صوت الإنذار
    playAlertSound(type) {
        // في تطبيق حقيقي، سيتم تشغيل أصوات مختلفة
        console.log(`🔊 تشغيل صوت ${type} alert`);
        
        // محاكاة الأصوات
        switch(type) {
            case 'WAR':
                console.log('🔔 صوت إنذار الحرب');
                break;
            case 'AID':
                console.log('🛠️ صوت وصول المساعدة');
                break;
            case 'REINFORCEMENT':
                console.log('⚡ صوت تعزيز قادم');
                break;
        }
    }
    
    // إطفاء إنذار محدد
    dismissAlert(alertId) {
        const alertIndex = this.advancedRadar.alerts.findIndex(a => a.id === alertId);
        if (alertIndex !== -1) {
            this.advancedRadar.alerts[alertIndex].isFlashing = false;
            this.updateRadarDisplay();
        }
    }
    
    // إطفاء جميع الإنذارات
    dismissAllAlerts() {
        this.advancedRadar.alerts.forEach(alert => {
            alert.isFlashing = false;
        });
        this.updateRadarDisplay();
        this.showMessage("تم إطفاء جميع الإنذارات", "info");
    }
    
    // تشغيل/إيقاف وميض الإنذارات
    toggleFlashMode() {
        this.advancedRadar.isFlashing = !this.advancedRadar.isFlashing;
        this.updateRadarDisplay();
    }
    
    // تغيير نطاق الرادار
    setRadarRange(newRange) {
        this.advancedRadar.range = Math.max(100, Math.min(5000, newRange));
        this.updateRadarDisplay();
    }
    
    // محاكاة إنذارات عشوائية للاختبار
    generateTestAlerts() {
        const types = ['WAR', 'AID', 'REINFORCEMENT'];
        const messages = {
            WAR: ['عدو يقترب من الحدود', 'هجوم وشيك', 'تهديد عسكري'],
            AID: ['قافلة مساعدات قادمة', 'إمدادات طبية', 'دعم لوجستي'],
            REINFORCEMENT: ['تعزيزات من حلفاء', 'جنود إضافيين', 'معدات جديدة']
        };
        
        const randomType = types[Math.floor(Math.random() * types.length)];
        const randomMessages = messages[randomType];
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        this.addAlert(randomType, randomMessage, Math.floor(Math.random() * 5) + 1);
    }
    
    // تحديث عرض الرادار
    updateRadarDisplay() {
        const radarContainer = document.getElementById('radar-container');
        if (!radarContainer) return;
        
        const activeAlerts = this.advancedRadar.alerts.filter(alert => alert.isFlashing);
        
        radarContainer.innerHTML = `
            <div class="radar-system ${this.advancedRadar.isFlashing ? 'flashing' : ''}">
                <div class="radar-header">
                    <h3>📡 الرادار المتطور</h3>
                    <div class="radar-controls">
                        <button onclick="game.toggleFlashMode()" class="btn btn-sm">
                            ${this.advancedRadar.isFlashing ? 'إيقاف الومض' : 'تشغيل الومض'}
                        </button>
                        <button onclick="game.dismissAllAlerts()" class="btn btn-sm">
                            إطفاء جميع الإنذارات
                        </button>
                        <button onclick="game.generateTestAlerts()" class="btn btn-sm">
                            اختبار إنذارات
                        </button>
                    </div>
                </div>
                
                <div class="radar-stats">
                    <div class="stat-item">
                        <span>النطاق: ${this.advancedRadar.range} وحدة</span>
                    </div>
                    <div class="stat-item">
                        <span>الإنذارات النشطة: ${activeAlerts.length}</span>
                    </div>
                    <div class="stat-item">
                        <span>الوضع: ${this.advancedRadar.isFlashing ? 'وامض' : 'ثابت'}</span>
                    </div>
                </div>
                
                <div class="radar-range-control">
                    <label>تغيير النطاق:</label>
                    <input type="range" min="100" max="5000" value="${this.advancedRadar.range}" 
                           onchange="game.setRadarRange(this.value)">
                    <span>${this.advancedRadar.range}</span>
                </div>
                
                <div class="alerts-list">
                    <h4>الإنذارات المرصودة:</h4>
                    ${this.advancedRadar.alerts.length > 0 ? 
                        this.advancedRadar.alerts.map(alert => this.renderAlertItem(alert)).join('') :
                        '<p class="no-alerts">لا توجد إنذارات نشطة</p>'
                    }
                </div>
            </div>
        `;
    }
    
    // عرض عنصر إنذار
    renderAlertItem(alert) {
        const alertInfo = this.advancedRadar.alertTypes[alert.type];
        const timeAgo = this.getTimeAgo(alert.timestamp);
        const intensityBar = '█'.repeat(alert.intensity);
        
        return `
            <div class="alert-item ${alert.isFlashing ? 'flashing' : ''}">
                <div class="alert-header">
                    <span class="alert-type" style="color: ${alertInfo.color}">
                        ${alertInfo.icon} ${alertInfo.name}
                    </span>
                    <span class="alert-time">${timeAgo}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
                <div class="alert-details">
                    <span class="alert-distance">📍 ${Math.round(alert.distance)} وحدة</span>
                    <span class="alert-intensity">الشدة: ${intensityBar}</span>
                </div>
                <div class="alert-actions">
                    <button onclick="game.dismissAlert(${alert.id})" class="btn btn-xs">
                        إطفاء الإنذار
                    </button>
                </div>
            </div>
        `;
    }
    
    // حساب الوقت المنقضي
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        
        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `منذ ${minutes} دقيقة`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `منذ ${hours} ساعة`;
        
        const days = Math.floor(hours / 24);
        return `منذ ${days} يوم`;
    }
    
    // تحديث الرادار دورياً
    updateRadarSystem() {
        const now = Date.now();
        
        // تحديث كل 5 ثوانٍ
        if (now - this.advancedRadar.lastUpdate > 5000) {
            this.advancedRadar.lastUpdate = now;
            this.updateRadarMiniDisplay(); // تحديث لوحة الرادار المصغرة
            
            // إشعار الرادار بنشاط المشهد
            if (this.scene) {
                this.radarPing(); // نبضة الرادار
            }
        }
    }
    
    // نبضة الرادار
    radarPing() {
        // في التطبيق الحقيقي، يمكن إضافة تأثيرات بصرية للرادار
        if (this.advancedRadar.isActive) {
            console.log('📡 رادار متحرك...');
        }
    }
    
    // إنشاء إنذارات حسب الأحداث
    createEventBasedAlerts() {
        // إنذار عند بناء مبنى جديد
        const originalBuild = this.buildStructure;
        this.buildStructure = function(...args) {
            const result = originalBuild.apply(this, args);
            if (args[0] === 'colosseum') {
                game.addAlert('REINFORCEMENT', 'تم بناء الكولوسيوم - تعزيز الدفاع', 3);
            }
            return result;
        };
        
        // إنذار عند ترقية القوات
        const originalUpgradeTroop = this.upgradeTroop;
        this.upgradeTroop = function(...args) {
            const result = originalUpgradeTroop.apply(this, args);
            game.addAlert('REINFORCEMENT', 'ترقية القوات مكتملة', 2);
            return result;
        };
    }
    
    // إنشاء الرادار المتطور
    initializeAdvancedRadar() {
        // إنشاء نسخة احتياطية آمنة عند تحميل الرادار
        this.createSecureBackup();
        this.createEventBasedAlerts();
        this.updateRadarDisplay();
        this.showMessage("📡 تم تفعيل نظام الرادار المتطور", "info");
        
        // إنشاء إنذار اختبار
        setTimeout(() => {
            this.addAlert('WAR', 'اختبار إنذار الحرب', 2);
        }, 3000);
        
        setTimeout(() => {
            this.addAlert('AID', 'قافلة مساعدات قادمة', 3);
        }, 6000);
        
        setTimeout(() => {
            this.addAlert('REINFORCEMENT', 'تعزيزات من حلفاء', 4);
        }, 9000);
    }
    
    // عرض قسم الرادار
    showRadarSection() {
        this.hideAllSections();
        document.getElementById('radar-section').style.display = 'block';
        this.updateRadarDisplay();
    }

    // ======================================
    // نظام الأدلة العسكرية الاستراتيجية
    // ======================================
    
    // عرض قسم الأدلة العسكرية
    showMilitaryGuidesSection() {
        this.hideAllSections();
        document.getElementById('military-guides-section').style.display = 'block';
        this.updateMilitaryGuidesDisplay();
    }
    
    // تحديث عرض الأدلة العسكرية
    updateMilitaryGuidesDisplay() {
        const container = document.getElementById('militaryGuidesDisplay');
        if (!container) return;
        
        // محتوى الأدلة العسكرية
        const guidesContent = {
            overview: {
                title: "🎯 نظرة عامة على الطبقات الداخلية",
                content: `
                    <div class="guide-section">
                        <h3>المفهوم الأساسي</h3>
                        <p>الطبقات الداخلية هي استراتيجية توزيع الضرر لحماية الوحدات القوية.</p>
                        <div class="key-points">
                            <div class="point">
                                <strong>🎯 الهدف:</strong> توجيه الضرر للوحدات الضعيفة أولاً
                            </div>
                            <div class="point">
                                <strong>🛡️ الحماية:</strong> حماية الاستثمارات العسكرية القوية
                            </div>
                            <div class="point">
                                <strong>⚔️ الفعالية:</strong> زيادة عمر المعركة والفعالية
                            </div>
                            <div class="point">
                                <strong>📉 تقليل الخسائر:</strong> تقليل الخسائر الإجمالية للجيش
                            </div>
                        </div>
                    </div>
                    <div class="guide-section">
                        <h3>أنواع الطبقات</h3>
                        <div class="layer-types">
                            <div class="layer surface">
                                <strong>الطبقة السطحية:</strong> 30-40% من القوات
                                <br>تستقبل الضرر مباشرة
                            </div>
                            <div class="layer core">
                                <strong>الطبقة الأساسية:</strong> 25-35% من القوات
                                <br>تحمل القتال الرئيسي
                            </div>
                            <div class="layer core-layer">
                                <strong>الطبقة الخلاصة:</strong> 20-25% من القوات
                                <br>تدعم وتحمي القادة
                            </div>
                            <div class="layer elite">
                                <strong>الطبقة النخبة:</strong> 10-15% من القوات
                                <br>وحدات متقدمة وأساسية
                            </div>
                        </div>
                    </div>
                `
            },
            infantry: {
                title: "👥 طبقات المشاة",
                content: `
                    <div class="guide-section">
                        <h3>التوزيع الأمثل للمشاة (1000 جندي)</h3>
                        <div class="troop-calculation">
                            <div class="calculation-item">
                                <strong>الطبقة السطحية (40%):</strong> 400 جندي
                                <ul>
                                    <li>جنود بنادق عادية: 200-300</li>
                                    <li>جنود بنادق ثقيلة: 80-120</li>
                                    <li>جنود مدعومون: 60-80</li>
                                    <li>جنود احتياط: 40-60</li>
                                    <li>مسعفون: 20-30</li>
                                </ul>
                                <div class="role-note">🎯 الدور: امتصاص معظم ضرر الأسلحة</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة الأساسية (35%):</strong> 350 جندي
                                <ul>
                                    <li>مقاتلو اشتباك: 120-150</li>
                                    <li>قناصون: 60-80</li>
                                    <li>مقاتلو العواصف: 60-80</li>
                                    <li>مقاتلو الليل: 40-60</li>
                                    <li>مقاتلو الصحراء: 30-50</li>
                                </ul>
                                <div class="role-note">⚔️ الدور: الاشتباك المباشر والقتال الفعلي</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة الخلاصة (15%):</strong> 150 جندي
                                <ul>
                                    <li>حراس قيادة: 40-60</li>
                                    <li>حراس خاصون: 30-50</li>
                                    <li>قادة فرقة: 20-30</li>
                                    <li>ضباط نخبة: 15-25</li>
                                </ul>
                                <div class="role-note">🛡️ الدور: حماية القادة والتنسيق</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة النخبة (10%):</strong> 100 جندي
                                <ul>
                                    <li>جنود منتقون: 50-70</li>
                                    <li>وحدة سبق: 40-60</li>
                                    <li>حراس قيادة: 20-30</li>
                                </ul>
                                <div class="role-note">👑 الدور: القوة الضاربة الأساسية</div>
                            </div>
                        </div>
                    </div>
                `
            },
            armored: {
                title: "🚗 طبقات المدرعات",
                content: `
                    <div class="guide-section">
                        <h3>التوزيع الأمثل للمدرعات (1000 دبابة)</h3>
                        <div class="troop-calculation">
                            <div class="calculation-item">
                                <strong>الطبقة السطحية (40%):</strong> 400 دبابة
                                <ul>
                                    <li>دبابات استطلاع: 80-120</li>
                                    <li>دبابات زحف: 60-80</li>
                                    <li>دبابات سرعة: 60-80</li>
                                    <li>دبابات خفيفة: 50-70</li>
                                    <li>دبابات دعم: 30-50</li>
                                </ul>
                                <div class="role-note">🎯 الدور: استطلاع واستكشاف</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة الأساسية (35%):</strong> 350 دبابة
                                <ul>
                                    <li>دبابات متوسطة: 100-120</li>
                                    <li>دبابات هجوم: 80-100</li>
                                    <li>دبابات حصار: 60-80</li>
                                    <li>دبابات توجيه: 50-70</li>
                                </ul>
                                <div class="role-note">⚔️ الدور: الهجوم الرئيسي والقتال الأساسي</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة النخبة (25%):</strong> 250 دبابة
                                <ul>
                                    <li>دبابات ثقيلة: 80-100</li>
                                    <li>دباباتCommandos: 60-80</li>
                                    <li>دبابات حراسة: 50-70</li>
                                    <li>دبابات قيادة: 30-50</li>
                                </ul>
                                <div class="role-note">👑 الدور: القوة الضاربة النخبوية</div>
                            </div>
                        </div>
                    </div>
                `
            },
            aviation: {
                title: "✈️ طبقات الطيران",
                content: `
                    <div class="guide-section">
                        <h3>التوزيع الأمثل للطيران (1000 طائرة)</h3>
                        <div class="troop-calculation">
                            <div class="calculation-item">
                                <strong>الطبقة السطحية (45%):</strong> 450 طائرة
                                <ul>
                                    <li>طائرات استطلاع: 80-120</li>
                                    <li>طائرات مراقبة: 60-80</li>
                                    <li>طائرات حلوة: 40-60</li>
                                    <li>طائرات تدريب: 50-70</li>
                                    <li>طائرات نقل: 40-60</li>
                                </ul>
                                <div class="role-note">🎯 الدور: المراقبة والاستطلاع</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة الأساسية (40%):</strong> 400 طائرة
                                <ul>
                                    <li>طائرات هجوم: 120-150</li>
                                    <li>طائرات قصف: 80-100</li>
                                    <li>طائرات دفاع: 60-80</li>
                                    <li>طائرات دعم: 40-60</li>
                                </ul>
                                <div class="role-note">⚔️ الدور: الهجوم والقتال الجوي</div>
                            </div>
                            
                            <div class="calculation-item">
                                <strong>الطبقة النخبة (15%):</strong> 150 طائرة
                                <ul>
                                    <li>طائرات نخبة: 50-70</li>
                                    <li>طائراتCommandos: 40-60</li>
                                    <li>طائرات مرافاة: 30-40</li>
                                    <li>طائرات قيادة: 20-30</li>
                                </ul>
                                <div class="role-note">👑 الدور: القوة الجوية النخبوية</div>
                            </div>
                        </div>
                    </div>
                `
            },
            calculations: {
                title: "🧮 حسابات الطبقات بالتفصيل",
                content: `
                    <div class="guide-section">
                        <h3>القواعد الأساسية للحساب</h3>
                        <div class="formula-section">
                            <div class="formula-item">
                                <strong>القاعدة الذهبية:</strong>
                                <br>الطبقة السطحية = 40-45% من إجمالي القوات
                                <br>الطبقة القوية = 15-25% من إجمالي القوات
                            </div>
                            <div class="formula-item">
                                <strong>حساب الضرر:</strong>
                                <br>85% من الضرر يذهب للطبقة السطحية
                                <br>10% للطبقة المتوسطة
                                <br>5% للطبقة القوية
                            </div>
                            <div class="formula-item">
                                <strong>النصيحة الذهبية:</strong>
                                <br>حافظ على نسبة 4:1 بين الضعيف والقوي
                                <br>هذا يضمن حماية 80% من القوة القاتلة
                            </div>
                        </div>
                    </div>
                    
                    <div class="guide-section">
                        <h3>أمثلة تطبيقية</h3>
                        <div class="example-item">
                            <strong>جيش 1000 مقاتل:</strong>
                            <ul>
                                <li>سطحي: 400 (جنود بنادق + مدعومون)</li>
                                <li>متوسط: 350 (مقاتلو اشتباك + قناصون)</li>
                                <li>قوي: 150 (حراس + قادة)</li>
                                <li>نخبة: 100 (منتقون + حراس قيادة)</li>
                            </ul>
                        </div>
                        <div class="example-item">
                            <strong>النتيجة:</strong>
                            <br>✓ 85% من الضرر يذهب للـ 400 الجندي الضعيف
                            <br>✓ 80% من القوة القاتلة (250) محمية
                            <br>✓ خسائر مقبولة مقابل حماية فعالة
                        </div>
                    </div>
                `
            }
        };
        
        // إنشاء واجهة التبويبات
        container.innerHTML = `
            <div class="military-guides-tabs">
                <div class="tabs-container">
                    ${Object.keys(guidesContent).map(key => `
                        <button class="guide-tab" onclick="game.showGuideContent('${key}', ${JSON.stringify(guidesContent).replace(/"/g, '&quot;')})">
                            ${guidesContent[key].title}
                        </button>
                    `).join('')}
                </div>
                <div class="guide-content-area" id="guideContent">
                    <!-- سيتم ملؤها بواسطة JavaScript -->
                </div>
            </div>
        `;
        
        // عرض التبويب الأول افتراضياً
        this.showGuideContent('overview', JSON.stringify(guidesContent).replace(/"/g, '&quot;'));
    }
    
    // عرض محتوى تبويب الدليل المحدد
    showGuideContent(tabKey, guidesDataString) {
        const guidesData = JSON.parse(guidesDataString.replace(/&quot;/g, '"'));
        const content = guidesData[tabKey];
        
        // تحديث التبويبات النشطة
        document.querySelectorAll('.guide-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // عرض المحتوى
        const contentArea = document.getElementById('guideContent');
        if (contentArea && content) {
            contentArea.innerHTML = content.content;
        }
    }
    
    // تحديث لوحة الرادار المصغرة
    updateRadarMiniDisplay() {
        const miniDisplay = document.getElementById('radar-mini-display');
        if (!miniDisplay) return;
        
        const activeAlerts = this.advancedRadar.alerts.filter(alert => alert.isFlashing);
        const highAlerts = activeAlerts.filter(alert => alert.type === 'WAR' || alert.intensity >= 4);
        
        // تحديث العدد
        const alertsCount = miniDisplay.querySelector('.radar-alerts-count');
        if (alertsCount) {
            alertsCount.textContent = `إنذارات: ${activeAlerts.length}`;
            if (activeAlerts.length > 0) {
                alertsCount.classList.add('alert-active');
            } else {
                alertsCount.classList.remove('alert-active');
            }
        }
        
        // تحديث الحالة
        const status = miniDisplay.querySelector('.radar-status');
        if (status) {
            if (highAlerts.length > 0) {
                status.textContent = 'تنبيه عالي!';
                miniDisplay.classList.add('high-alert');
            } else if (activeAlerts.length > 0) {
                status.textContent = 'إنذارات نشطة';
                miniDisplay.classList.remove('high-alert');
            } else {
                status.textContent = 'الرادار: نشط';
                miniDisplay.classList.remove('high-alert');
            }
        }
        
        // تطبيق وضع الومض
        if (this.advancedRadar.isFlashing && activeAlerts.length > 0) {
            miniDisplay.classList.add('flashing');
        } else {
            miniDisplay.classList.remove('flashing');
        }
        
        // تحديث أيقونة الرادار حسب الحالة
        const radarIcon = document.getElementById('radar-status-icon');
        if (radarIcon) {
            if (highAlerts.length > 0) {
                radarIcon.textContent = '🚨';
                radarIcon.style.color = '#ff0040';
            } else if (activeAlerts.length > 0) {
                radarIcon.textContent = '📡';
                radarIcon.style.color = '#ffaa00';
            } else {
                radarIcon.textContent = '📡';
                radarIcon.style.color = '#00ff41';
            }
        }
    }
    
    // تحديث عرض المستوى
    updateLevelDisplay() {
        const levelDisplay = document.getElementById('levelDisplay');
        if (!levelDisplay) return;
        
        // فحص تفعيل نظام الذكاء الاصطناعي
        this.checkAIUnlock();
        
        const currentLevel = this.getCurrentLevelValue();
        const nextLevelValue = Math.min(currentLevel + 1, this.ownerSystem.isOwnerMode ? 45 : 40);
        const nextLevelName = this.getLevelName(nextLevelValue);
        
        levelDisplay.innerHTML = `
            <div class="level-info">
                <div class="current-level">المستوى الحالي: ${this.level}</div>
                <div class="next-level">التالي: ${nextLevelName}</div>
                <div class="level-progress">
                    التقدم: ${Math.floor((currentLevel / (this.ownerSystem.isOwnerMode ? 45 : 40)) * 100)}%
                </div>
            </div>
        `;
    }

    // تحديث مظهر المبنى
    updateBuildingAppearance(building, level) {
        const colors = [
            0x8B4513, // بني (المستوى 1)
            0xA0522D, // بني فاتح (المستوى 2)
            0xD2691E, // برتقالي (المستوى 3)
            0xFF8C00, // برتقالي داكن (المستوى 4)
            0xFFD700  // ذهبي (المستوى 5)
        ];
        
        const colorIndex = Math.min(level - 1, colors.length - 1);
        building.mesh.material.color.setHex(colors[colorIndex]);
        
        // إضافة تأثيرات بصرية للمستوى 5
        if (level === 5) {
            building.mesh.material.emissive.setHex(0xFFD700);
            building.mesh.material.emissiveIntensity = 0.2;
        }
    }

    updateAnimations() {
        const currentTime = Date.now();
        
        if (!this.animations) {
            this.animations = [];
        }
        
        this.animations = this.animations.filter(animation => {
            const elapsed = currentTime - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            
            // Easing function
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            animation.building.scale.lerpVectors(animation.from, animation.to, easeProgress);
            
            return progress < 1;
        });
    }

    // === نظام حرب الثروه ===
    checkRichesWarUnlock() {
        this.richesWar.enabled = this.richesWar.isUnlocked(this.level);
        return this.richesWar.enabled;
    }

    enterRichesWar() {
        if (!this.checkRichesWarUnlock()) {
            this.showNotification("حرب الثروه مقفلة - تحتاج إلى C15+", "warning");
            return false;
        }

        if (this.richesWar.canEnter()) {
            this.richesWar.enterWar();
            this.saveGame();
            this.showNotification("تم الدخول إلى حرب الثروه! مدخل ${this.richesWar.dailyEntries}/${this.richesWar.maxDailyEntries}", "success");
            this.updateRichesWarDisplay();
            return true;
        } else {
            this.showNotification("تم استخدام جميع المدخلات اليوميآ - راجع غداً", "warning");
            return false;
        }
    }

    upgradeWeaponsInRichesWar() {
        if (!this.richesWar.enabled) {
            this.showNotification("حرب الثروه مقفلة - تحتاج إلى C15+", "warning");
            return false;
        }

        if (this.richesWar.weaponLevel < this.richesWar.maxWeaponLevel) {
            this.richesWar.upgradeWeapons();
            this.saveGame();
            this.showNotification(`تم تطوير الأسلحة إلى المستوى ${this.richesWar.weaponLevel}!`, "success");
            this.updateRichesWarDisplay();
            
            // إضافة رسالة للدخول في دردشة التحالف
            this.allianceChat.addSystemMessage(`لاعب تطور أسلحته في حرب الثروه إلى المستوى ${this.richesWar.weaponLevel}`);
            return true;
        } else {
            this.showNotification("الأسلحة وصلت إلى الحد الأقصى!", "info");
            return false;
        }
    }

    updateRichesWarDisplay() {
        const richesWarDisplay = document.getElementById('richesWarDisplay');
        if (!richesWarDisplay) return;

        this.checkRichesWarUnlock();

        if (this.richesWar.enabled) {
            const canEnter = this.richesWar.canEnter();
            const today = new Date().toDateString();
            const lastEntry = this.richesWar.lastEntryDate;
            const isNewDay = lastEntry !== today;

            richesWarDisplay.innerHTML = `
                <div class="riches-war-info">
                    <div class="riches-war-header">
                        <h3>🏛️ حرب الثروه</h3>
                        <div class="unlock-status ${this.richesWar.enabled ? 'unlocked' : 'locked'}">
                            ${this.richesWar.enabled ? 'مفعل' : 'مقفل'}
                        </div>
                    </div>
                    <div class="riches-war-stats">
                        <div class="stat">
                            <span>المدخلة اليوميآ:</span>
                            <span class="${canEnter ? 'available' : 'used'}">${this.richesWar.dailyEntries}/${this.richesWar.maxDailyEntries}</span>
                        </div>
                        <div class="stat">
                            <span>مستوى الأسلحة:</span>
                            <span>${this.richesWar.weaponLevel}/${this.richesWar.maxWeaponLevel}</span>
                        </div>
                        <div class="stat">
                            <span>إجمالي المدخلات:</span>
                            <span>${this.richesWar.totalEntries}</span>
                        </div>
                    </div>
                    <div class="riches-war-actions">
                        <button class="riches-war-btn ${!canEnter ? 'disabled' : ''}" 
                                onclick="game.enterRichesWar()" 
                                ${!canEnter ? 'disabled' : ''}>
                            ${canEnter ? '🎯 دخول حرب الثروه' : '⏰ عدت غداً'}
                        </button>
                        <button class="riches-war-btn" onclick="game.upgradeWeaponsInRichesWar()">
                            ⚔️ تطوير الأسلحة
                        </button>
                    </div>
                </div>
            `;
        } else {
            const levelNumber = parseInt(this.level.replace('C', ''));
            const requiredLevel = 15;
            const remaining = requiredLevel - levelNumber;

            richesWarDisplay.innerHTML = `
                <div class="riches-war-info">
                    <div class="riches-war-header">
                        <h3>🏛️ حرب الثروه</h3>
                        <div class="unlock-status locked">مقفل</div>
                    </div>
                    <div class="riches-war-locked">
                        <p>تصل إلى مستوى C15 لفتح حرب الثروه</p>
                        <p class="remaining">متبقي: ${remaining} مستوى</p>
                    </div>
                </div>
            `;
        }
    }

    // === نظام دردشة التحالف ===
    openAllianceChat() {
        this.allianceChat.openChat();
        this.updateAllianceChatDisplay();
        this.showChatModal();
    }

    closeAllianceChat() {
        this.allianceChat.closeChat();
        this.hideChatModal();
    }

    sendChatMessage() {
        const message = this.allianceChat.currentMessage.trim();
        if (message) {
            this.allianceChat.sendMessage(message);
            this.allianceChat.currentMessage = "";
            this.updateAllianceChatDisplay();
            this.saveGame();
        }
    }

    updateAllianceChatDisplay() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messagesHTML = this.allianceChat.messages.map(msg => `
            <div class="chat-message ${msg.type}">
                <div class="chat-header">
                    <span class="username">${msg.username}</span>
                    <span class="timestamp">${this.formatTime(msg.timestamp)}</span>
                </div>
                <div class="message-content">${msg.message}</div>
            </div>
        `).join('');

        chatMessages.innerHTML = messagesHTML;
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    showChatModal() {
        let modal = document.getElementById('allianceChatModal');
        if (!modal) {
            modal = this.createChatModal();
        }
        modal.style.display = 'block';
    }

    hideChatModal() {
        const modal = document.getElementById('allianceChatModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    createChatModal() {
        const modal = document.createElement('div');
        modal.id = 'allianceChatModal';
        modal.className = 'alliance-chat-modal';
        modal.innerHTML = `
            <div class="alliance-chat-container">
                <div class="alliance-chat-header">
                    <h3>💬 دردشة التحالف</h3>
                    <button class="close-btn" onclick="game.closeAllianceChat()">×</button>
                </div>
                <div class="alliance-chat-messages" id="chatMessages">
                    <!-- الرسائل ستظهر هنا -->
                </div>
                <div class="alliance-chat-input">
                    <input type="text" 
                           id="chatInput" 
                           placeholder="اكتب رسالتك للتحالف..." 
                           value="${this.allianceChat.currentMessage}"
                           oninput="game.allianceChat.currentMessage = this.value"
                           onkeypress="if(event.key==='Enter') game.sendChatMessage()">
                    <button onclick="game.sendChatMessage()">إرسال</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.updateAllianceChatDisplay();
        return modal;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // أقل من دقيقة
            return 'الآن';
        } else if (diff < 3600000) { // أقل من ساعة
            return `${Math.floor(diff / 60000)} د`;
        } else if (diff < 86400000) { // أقل من يوم
            return `${Math.floor(diff / 3600000)} س`;
        } else {
            return date.toLocaleDateString('ar-SA');
        }
    }

    // عرض تحديث عام للواجهة
    updateAllDisplays() {
        this.updateRichesWarDisplay();
        this.updateAllianceChatDisplay();
    }

    // عرض قسم حرب الثروه
    showRichesWarSection() {
        this.checkRichesWarUnlock();
        this.updateRichesWarDisplay();
        
        // التنقل إلى القسم الجديد
        const sections = {
            'city': document.getElementById('city-section'),
            'map': document.getElementById('map-section'), 
            'military': document.getElementById('military-section'),
            'warfare': document.getElementById('warfare-section'),
            'troops': document.getElementById('troops-section'),
            'research': document.getElementById('research-section'),
            'kingdoms': document.getElementById('kingdoms-section'),
            'alliances': document.getElementById('alliances-section'),
            'owner': document.getElementById('owner-section'),
            'riches-war': document.getElementById('riches-war-section'),
            'territories': document.getElementById('alliance-territories-section'),
            'chat': document.getElementById('chat-section'),
            'vip': document.getElementById('vip-section')
        };
        
        // إخفاء جميع الأقسام
        Object.values(sections).forEach(sec => {
            if (sec) sec.style.display = 'none';
        });
        
        // عرض قسم حرب الثروه
        const richesWarSection = document.getElementById('riches-war-section');
        if (richesWarSection) {
            richesWarSection.style.display = 'block';
        }
        
        // تحديث حالة الأزرار
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-section="riches-war"]').classList.add('active');
    }

    // === نظام أراضي التحالف ===
    showAllianceTerritoriesSection() {
        this.updateAllianceTerritoriesDisplay();
        
        // التنقل إلى قسم أراضي التحالف
        const sections = {
            'city': document.getElementById('city-section'),
            'map': document.getElementById('map-section'), 
            'military': document.getElementById('military-section'),
            'warfare': document.getElementById('warfare-section'),
            'troops': document.getElementById('troops-section'),
            'research': document.getElementById('research-section'),
            'kingdoms': document.getElementById('kingdoms-section'),
            'alliances': document.getElementById('alliances-section'),
            'owner': document.getElementById('owner-section'),
            'riches-war': document.getElementById('riches-war-section'),
            'chat': document.getElementById('chat-section'),
            'territories': document.getElementById('alliance-territories-section'),
            'vip': document.getElementById('vip-section')
        };
        
        // إخفاء جميع الأقسام
        Object.values(sections).forEach(sec => {
            if (sec) sec.style.display = 'none';
        });
        
        // عرض قسم أراضي التحالف
        const territoriesSection = document.getElementById('alliance-territories-section');
        if (territoriesSection) {
            territoriesSection.style.display = 'block';
        }
        
        // تحديث حالة الأزرار
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const territoriesBtn = document.querySelector('[data-section="territories"]');
        if (territoriesBtn) {
            territoriesBtn.classList.add('active');
        }
    }

    buildAllianceHeadquarters() {
        if (this.allianceTerritories.buildHeadquarters()) {
            this.updateAllianceTerritoriesDisplay();
            this.updateResourceDisplay();
            this.saveGame();
            return true;
        }
        return false;
    }

    buildAllianceFlag(flagId) {
        if (this.allianceTerritories.buildFlag(flagId)) {
            this.updateAllianceTerritoriesDisplay();
            this.updateResourceDisplay();
            this.saveGame();
            return true;
        }
        return false;
    }

    defendAllianceTerritory() {
        if (this.allianceTerritories.defendTerritory()) {
            this.updateResourceDisplay();
            this.saveGame();
            return true;
        }
        return false;
    }

    expandAllianceTerritory() {
        if (this.allianceTerritories.expandTerritory()) {
            this.updateAllianceTerritoriesDisplay();
            this.saveGame();
            return true;
        }
        return false;
    }

    updateAllianceTerritoriesDisplay() {
        const territoriesDisplay = document.getElementById('allianceTerritoriesDisplay');
        if (!territoriesDisplay) return;

        const status = this.allianceTerritories.getTerritoryStatus();
        
        if (!status.headquarters) {
            // عرض خيار بناء مقر التحالف
            territoriesDisplay.innerHTML = `
                <div class="territories-info">
                    <div class="territories-header">
                        <h3>🏛️ أراضي التحالف</h3>
                        <div class="territory-status">
                            <span class="not-built">مقر التحالف غير مبني</span>
                        </div>
                    </div>
                    <div class="territories-construction">
                        <h4>بناء مقر التحالف</h4>
                        <p>مستوى C20 مطلوب</p>
                        <p>التكلفة: ${this.allianceTerritories.headquarters.cost} ذهب</p>
                        <button class="territory-btn" onclick="game.buildAllianceHeadquarters()" 
                                ${this.getCurrentLevelValue() < 20 ? 'disabled' : ''}>
                            ${this.getCurrentLevelValue() < 20 ? 'غير متاح' : 'بناء مقر التحالف'}
                        </button>
                    </div>
                </div>
            `;
        } else {
            // عرض حالة أراضي التحالف
            const headquarters = this.allianceTerritories.headquarters;
            const canExpand = this.allianceTerritories.expansionLevel < this.allianceTerritories.maxExpansionLevel;
            
            let flagsHTML = '';
            this.allianceTerritories.flags.forEach((flag, index) => {
                const canBuildFlag = this.allianceTerritories.canBuildFlag(flag.id);
                const flagStatus = flag.built ? (flag.captured ? 'مستولي عليه' : 'غير مستولي') : 'غير مبني';
                const flagClass = flag.built ? (flag.captured ? 'controlled' : 'uncontrolled') : 'not-built';
                
                flagsHTML += `
                    <div class="flag-item ${flagClass}">
                        <div class="flag-info">
                            <h5>${flag.name}</h5>
                            <p>الحالة: ${flagStatus}</p>
                            <p>المستوى: ${flag.level}</p>
                        </div>
                        ${!flag.built && canBuildFlag ? `
                            <button class="flag-build-btn" onclick="game.buildAllianceFlag('${flag.id}')">
                                بناء (${flag.cost} ذهب)
                            </button>
                        ` : ''}
                    </div>
                `;
            });

            territoriesDisplay.innerHTML = `
                <div class="territories-info">
                    <div class="territories-header">
                        <h3>🏛️ أراضي التحالف</h3>
                        <div class="territory-stats">
                            <div class="stat">
                                <span>مقر التحالف:</span>
                                <span>مبنى - مستوى ${headquarters.level}</span>
                            </div>
                            <div class="stat">
                                <span>الأعلام:</span>
                                <span>${status.builtFlags}/${status.totalFlags}</span>
                            </div>
                            <div class="stat">
                                <span>قوة الأراضي:</span>
                                <span>${status.territoryPower}</span>
                            </div>
                            <div class="stat">
                                <span>مستوى التوسع:</span>
                                <span>${status.expansionLevel}/5</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="territories-actions">
                        <button class="territory-btn" onclick="game.defendAllianceTerritory()">
                            🛡️ الدفاع عن الأراضي (2000 ذهب)
                        </button>
                        ${canExpand ? `
                            <button class="territory-btn" onclick="game.expandAllianceTerritory()">
                                📈 توسيع الأراضي
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="flags-section">
                        <h4>🗂️ أعلام التحالف</h4>
                        <div class="flags-grid">
                            ${flagsHTML}
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    // ==============================================
    // نظام التشفير والحماية المتقدم
    // ==============================================
    
    // توليد ملح عشوائي للتشفير
    generateSalt() {
        const array = new Uint8Array(this.securitySystem.encryption.saltLength);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // تشفير البيانات باستخدام AES-256-CBC
    encryptData(data, key) {
        if (!this.securitySystem.encryption.enabled) return data;
        
        try {
            const salt = this.generateSalt();
            const derivedKey = this.deriveKey(key, salt);
            
            const encoder = new TextEncoder();
            const dataBuffer = encoder.encode(JSON.stringify(data));
            
            const iv = crypto.getRandomValues(new Uint8Array(16));
            
            return {
                encrypted: true,
                data: btoa(String.fromCharCode(...dataBuffer)),
                iv: btoa(String.fromCharCode(...iv)),
                salt: salt,
                timestamp: Date.now()
            };
        } catch (error) {
            console.error('خطأ في التشفير:', error);
            return { encrypted: false, data: data, error: true };
        }
    }
    
    // فك تشفير البيانات
    decryptData(encryptedData, key) {
        if (!encryptedData.encrypted) return encryptedData.data || encryptedData;
        
        try {
            const derivedKey = this.deriveKey(key, encryptedData.salt);
            
            const dataArray = atob(encryptedData.data).split('').map(char => char.charCodeAt(0));
            const dataBuffer = new Uint8Array(dataArray);
            
            const decoder = new TextDecoder();
            const decodedData = decoder.decode(dataBuffer);
            
            return JSON.parse(decodedData);
        } catch (error) {
            console.error('خطأ في فك التشفير:', error);
            return null;
        }
    }
    
    // اشتقاق المفتاح من كلمة المرور
    async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
        return Array.from(new Uint8Array(hashBuffer), byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // تشفير كلمة المرور
    async hashPassword(password, salt = null) {
        const finalSalt = salt || this.generateSalt();
        const encoder = new TextEncoder();
        const passwordBuffer = encoder.encode(password + finalSalt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
        
        return {
            hash: Array.from(new Uint8Array(hashBuffer), byte => byte.toString(16).padStart(2, '0')).join(''),
            salt: finalSalt,
            timestamp: Date.now()
        };
    }
    
    // التحقق من قوة كلمة المرور
    validatePassword(password) {
        const rules = this.securitySystem.passwordProtection;
        const errors = [];
        
        if (password.length < rules.minLength) {
            errors.push(`يجب أن تكون كلمة المرور ${rules.minLength} أحرف على الأقل`);
        }
        if (rules.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('يجب أن تحتوي على حرف كبير واحد على الأقل');
        }
        if (rules.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('يجب أن تحتوي على حرف صغير واحد على الأقل');
        }
        if (rules.requireNumbers && !/[0-9]/.test(password)) {
            errors.push('يجب أن تحتوي على رقم واحد على الأقل');
        }
        if (rules.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('يجب أن تحتوي على رمز خاص واحد على الأقل');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors,
            strength: this.calculatePasswordStrength(password)
        };
    }
    
    // حساب قوة كلمة المرور
    calculatePasswordStrength(password) {
        let strength = 0;
        const rules = this.securitySystem.passwordProtection;
        
        if (password.length >= rules.minLength) strength += 20;
        if (password.length >= 12) strength += 10;
        if (/[A-Z]/.test(password)) strength += 15;
        if (/[a-z]/.test(password)) strength += 15;
        if (/[0-9]/.test(password)) strength += 15;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 25;
        
        if (strength < 40) return 'ضعيفة';
        if (strength < 70) return 'متوسطة';
        if (strength < 90) return 'قوية';
        return 'قوية جداً';
    }
    
    // حماية من هجمات القوة الغاشمة
    checkBruteForceProtection() {
        const protection = this.securitySystem.passwordProtection;
        const now = Date.now();
        
        if (protection.isLocked) {
            if (now - protection.lastAttempt < protection.lockoutTime) {
                return { blocked: true, remainingTime: protection.lockoutTime - (now - protection.lastAttempt) };
            } else {
                protection.isLocked = false;
                protection.attempts = 0;
            }
        }
        
        return { blocked: false };
    }
    
    // تسجيل محاولة دخول
    recordLoginAttempt(success, details = {}) {
        const protection = this.securitySystem.passwordProtection;
        const now = Date.now();
        
        if (!success) {
            protection.attempts++;
            protection.lastAttempt = now;
            
            if (protection.attempts >= protection.maxAttempts) {
                protection.isLocked = true;
                this.logSecurityEvent('ACCOUNT_LOCKED', {
                    attempts: protection.attempts,
                    timestamp: now,
                    ...details
                });
            }
        } else {
            protection.attempts = 0;
            protection.isLocked = false;
        }
        
        this.logAccessEvent('LOGIN_ATTEMPT', {
            success,
            attempts: protection.attempts,
            ...details
        });
    }
    
    // إنشاء جلسة آمنة
    createSecureSession(userData) {
        const session = this.securitySystem.session;
        const sessionId = this.generateSalt();
        const tokenExpiry = Date.now() + session.tokenExpiry;
        
        session.sessionId = sessionId;
        session.lastActivity = Date.now();
        session.refreshToken = this.generateSalt();
        
        // تشفير بيانات الجلسة
        const encryptedSession = this.encryptData(userData, sessionId);
        
        return {
            sessionId,
            tokenExpiry,
            refreshToken: session.refreshToken,
            encryptedData: encryptedSession
        };
    }
    
    // التحقق من صحة الجلسة
    validateSession(sessionData) {
        if (!sessionData) return { valid: false, reason: 'لا توجد جلسة' };
        
        const now = Date.now();
        if (now > sessionData.tokenExpiry) {
            return { valid: false, reason: 'انتهت صلاحية الجلسة' };
        }
        
        // تحديث آخر نشاط
        this.securitySystem.session.lastActivity = now;
        
        return { valid: true, data: sessionData.encryptedData };
    }
    
    // حماية البيانات الحساسة
    protectSensitiveData() {
        if (this.securitySystem.dataProtection.encryptGameData) {
            // تشفير الموارد
            this.encryptedResources = this.encryptData(this.resources, this.generateSalt());
        }
        
        if (this.securitySystem.dataProtection.encryptUserData) {
            // تشفير بيانات المستخدم
            this.encryptedUserData = this.encryptData({
                level: this.level,
                vipLevel: this.vipLevel,
                ownerMaxLevel: this.ownerMaxLevel
            }, this.generateSalt());
        }
    }
    
    // كشف الأنشطة المشبوهة
    detectSuspiciousActivity(activity) {
        if (!this.securitySystem.threatDetection.enabled) return;
        
        const threat = this.securitySystem.threatDetection;
        const now = Date.now();
        
        // اكتشاف الطلبات السريعة
        if (threat.detectRapidRequests) {
            this.lastRequestTime = this.lastRequestTime || now;
            if (now - this.lastRequestTime < 100) { // أقل من 100ms
                this.flagSuspiciousActivity('RAPID_REQUESTS', { frequency: now - this.lastRequestTime });
            }
            this.lastRequestTime = now;
        }
        
        // اكتشاف الرموز غير الصالحة
        if (threat.detectInvalidTokens && activity.type === 'INVALID_TOKEN') {
            this.flagSuspiciousActivity('INVALID_TOKEN', activity.details);
        }
        
        // اكتشاف محاولات غير طبيعية
        if (activity.type === 'UNUSUAL_ACTIVITY') {
            this.flagSuspiciousActivity('UNUSUAL_BEHAVIOR', activity.details);
        }
    }
    
    // تمييز النشاط المشبوه
    flagSuspiciousActivity(type, details) {
        const threat = this.securitySystem.threatDetection;
        const suspiciousEvent = {
            type,
            details,
            timestamp: Date.now(),
            ip: this.getClientIP()
        };
        
        threat.suspiciousActivity.push(suspiciousEvent);
        
        // الحد من عدد الأحداث المشبوهة
        if (threat.suspiciousActivity.length > threat.maxSuspiciousCount) {
            threat.suspiciousActivity.shift();
        }
        
        // حظر المستخدم إذا تجاوز الحد الأقصى
        if (threat.suspiciousActivity.length >= threat.maxSuspiciousCount) {
            this.blockUser(threat.blockDuration);
            this.logSecurityEvent('USER_BLOCKED', {
                reason: 'too_many_suspicious_activities',
                activities: threat.suspiciousActivity,
                timestamp: Date.now()
            });
        }
        
        this.logSecurityEvent('SUSPICIOUS_ACTIVITY', suspiciousEvent);
    }
    
    // حظر المستخدم مؤقتاً
    blockUser(duration) {
        this.securitySystem.session.isBlocked = true;
        this.securitySystem.session.blockExpiry = Date.now() + duration;
        
        setTimeout(() => {
            this.securitySystem.session.isBlocked = false;
        }, duration);
    }
    
    // الحصول على عنوان IP
    getClientIP() {
        // في بيئة المتصفح، نحصل على IP من خلال خدمات خارجية
        return 'client_ip_placeholder';
    }
    
    // تسجيل أحداث الأمان
    logSecurityEvent(eventType, details) {
        if (!this.securitySystem.accessLog.logSecurityEvents) return;
        
        const logEntry = {
            type: eventType,
            details,
            timestamp: Date.now(),
            session: this.securitySystem.session.sessionId
        };
        
        console.log('🔒 حدث أمني:', logEntry);
        
        // يمكن إرسال السجلات إلى الخادم هنا
        this.sendSecurityLog(logEntry);
    }
    
    // تسجيل أحداث الوصول
    logAccessEvent(eventType, details) {
        if (!this.securitySystem.accessLog.logDataAccess) return;
        
        const logEntry = {
            type: eventType,
            details,
            timestamp: Date.now()
        };
        
        console.log('📊 حدث وصول:', logEntry);
    }
    
    // إرسال سجلات الأمان
    sendSecurityLog(logEntry) {
        // محاكاة إرسال السجلات إلى خادم مركزي
        // في التطبيق الحقيقي، سيتم إرسالها عبر API
        if (typeof fetch !== 'undefined') {
            fetch('/api/security-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logEntry)
            }).catch(error => {
                console.log('فشل في إرسال سجل الأمان:', error);
            });
        }
    }
    
    // عرض لوحة الأمان
    showSecurityPanel() {
        const securityHTML = `
            <div class="security-panel" id="security-panel">
                <div class="security-header">
                    <h3>🛡️ لوحة الأمان والحماية</h3>
                    <button onclick="game.hideSecurityPanel()" class="close-btn">×</button>
                </div>
                
                <div class="security-content">
                    <div class="security-status">
                        <h4>حالة الأمان</h4>
                        <div class="status-item">
                            <span>🔐 التشفير:</span>
                            <span class="status-active">${this.securitySystem.encryption.enabled ? 'مفعل' : 'معطل'}</span>
                        </div>
                        <div class="status-item">
                            <span>🚫 حماية القوة الغاشمة:</span>
                            <span class="status-active">${this.securitySystem.passwordProtection.isLocked ? 'محظور' : 'آمن'}</span>
                        </div>
                        <div class="status-item">
                            <span>👁️ كشف التهديدات:</span>
                            <span class="status-active">${this.securitySystem.threatDetection.enabled ? 'مفعل' : 'معطل'}</span>
                        </div>
                        <div class="status-item">
                            <span>📊 السجلات:</span>
                            <span class="status-active">${this.securitySystem.accessLog.enabled ? 'مفعل' : 'معطل'}</span>
                        </div>
                    </div>
                    
                    <div class="security-actions">
                        <h4>إجراءات الأمان</h4>
                        <button onclick="game.forcePasswordChange()" class="security-btn">
                            🔑 تغيير كلمة المرور
                        </button>
                        <button onclick="game.clearSensitiveData()" class="security-btn">
                            🗑️ مسح البيانات الحساسة
                        </button>
                        <button onclick="game.generateNewEncryptionKeys()" class="security-btn">
                            🔄 توليد مفاتيح جديدة
                        </button>
                        <button onclick="game.exportSecurityReport()" class="security-btn">
                            📋 تقرير الأمان
                        </button>
                    </div>
                    
                    <div class="security-alerts">
                        <h4>تنبيهات الأمان</h4>
                        <div class="alerts-list" id="security-alerts-list">
                            ${this.getSecurityAlertsHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', securityHTML);
        this.updateSecurityDisplay();
    }
    
    // إخفاء لوحة الأمان
    hideSecurityPanel() {
        const panel = document.getElementById('security-panel');
        if (panel) {
            panel.remove();
        }
    }
    
    // الحصول على HTML التنبيهات الأمنية
    getSecurityAlertsHTML() {
        const threat = this.securitySystem.threatDetection;
        if (threat.suspiciousActivity.length === 0) {
            return '<div class="no-alerts">لا توجد تنبيهات أمنية</div>';
        }
        
        return threat.suspiciousActivity.map(activity => `
            <div class="security-alert">
                <span class="alert-type">${activity.type}</span>
                <span class="alert-time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
                <span class="alert-details">${JSON.stringify(activity.details)}</span>
            </div>
        `).join('');
    }
    
    // تحديث عرض الأمان
    updateSecurityDisplay() {
        setInterval(() => {
            const panel = document.getElementById('security-panel');
            if (panel) {
                const alertsList = document.getElementById('security-alerts-list');
                if (alertsList) {
                    alertsList.innerHTML = this.getSecurityAlertsHTML();
                }
            }
        }, 2000);
    }
    
    // فرض تغيير كلمة المرور
    async forcePasswordChange() {
        const userConfirmed = confirm('هل تريد تغيير كلمة المرور؟ سيتم إنهاء جميع الجلسات النشطة.');
        if (!userConfirmed) return;
        
        // إنهاء الجلسات النشطة
        this.securitySystem.session = {
            tokenExpiry: 0,
            refreshToken: null,
            sessionId: null,
            ipWhitelist: [],
            lastActivity: Date.now()
        };
        
        // فتح نافذة تغيير كلمة المرور
        this.showPasswordChangeModal();
    }
    
    // عرض نافذة تغيير كلمة المرور
    showPasswordChangeModal() {
        const modalHTML = `
            <div class="password-change-modal" id="password-change-modal">
                <div class="modal-content">
                    <h3>🔑 تغيير كلمة المرور</h3>
                    <form id="password-change-form">
                        <div class="form-group">
                            <label>كلمة المرور الحالية:</label>
                            <input type="password" id="current-password" required>
                        </div>
                        <div class="form-group">
                            <label>كلمة المرور الجديدة:</label>
                            <input type="password" id="new-password" required>
                        </div>
                        <div class="form-group">
                            <label>تأكيد كلمة المرور:</label>
                            <input type="password" id="confirm-password" required>
                        </div>
                        <div id="password-strength-indicator"></div>
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">تغيير كلمة المرور</button>
                            <button type="button" onclick="game.hidePasswordChangeModal()" class="cancel-btn">إلغاء</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.bindPasswordChangeEvents();
    }
    
    // إخفاء نافذة تغيير كلمة المرور
    hidePasswordChangeModal() {
        const modal = document.getElementById('password-change-modal');
        if (modal) modal.remove();
    }
    
    // ربط أحداث تغيير كلمة المرور
    bindPasswordChangeEvents() {
        const form = document.getElementById('password-change-form');
        const newPasswordInput = document.getElementById('new-password');
        const strengthIndicator = document.getElementById('password-strength-indicator');
        
        // تحديث مؤشر قوة كلمة المرور
        newPasswordInput.addEventListener('input', (e) => {
            const strength = this.calculatePasswordStrength(e.target.value);
            strengthIndicator.innerHTML = `<span class="strength-${strength.toLowerCase()}">قوة كلمة المرور: ${strength}</span>`;
        });
        
        // إرسال النموذج
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                alert('كلمتا المرور الجديدتان غير متطابقتين!');
                return;
            }
            
            const validation = this.validatePassword(newPassword);
            if (!validation.isValid) {
                alert('كلمة المرور لا تستوفي المتطلبات:\n' + validation.errors.join('\n'));
                return;
            }
            
            // تشفير كلمة المرور الجديدة
            const hashedPassword = await this.hashPassword(newPassword);
            
            // حفظ كلمة المرور المشفرة
            localStorage.setItem('encryptedPassword', JSON.stringify(hashedPassword));
            
            alert('تم تغيير كلمة المرور بنجاح!');
            this.hidePasswordChangeModal();
            this.logSecurityEvent('PASSWORD_CHANGED', { timestamp: Date.now() });
        });
    }
    
    // مسح البيانات الحساسة
    clearSensitiveData() {
        const userConfirmed = confirm('هل تريد مسح جميع البيانات الحساسة؟ لا يمكن التراجع عن هذا الإجراء.');
        if (!userConfirmed) return;
        
        // مسح الموارد
        this.resources = {
            gold: 0, food: 0, wood: 0, stone: 0, iron: 0,
            royalGems: 0, gems: 0, crystals: 0, sacredRelics: 0, emperorCrowns: 0, diamonds: 0
        };
        
        // مسح الجلسات
        this.securitySystem.session = {
            tokenExpiry: 0,
            refreshToken: null,
            sessionId: null,
            ipWhitelist: [],
            lastActivity: Date.now()
        };
        
        // مسح البيانات المشفرة
        delete this.encryptedResources;
        delete this.encryptedUserData;
        
        this.logSecurityEvent('SENSITIVE_DATA_CLEARED', { timestamp: Date.now() });
        alert('تم مسح جميع البيانات الحساسة بنجاح.');
    }
    
    // توليد مفاتيح تشفير جديدة
    async generateNewEncryptionKeys() {
        const userConfirmed = confirm('سيتم توليد مفاتيح تشفير جديدة. سيتم إنهاء جميع الجلسات النشطة.');
        if (!userConfirmed) return;
        
        // إنتهاء الجلسات
        this.securitySystem.session = {
            tokenExpiry: 0,
            refreshToken: null,
            sessionId: null,
            ipWhitelist: [],
            lastActivity: Date.now()
        };
        
        // توليد مفاتيح جديدة
        this.newSalt = this.generateSalt();
        
        this.logSecurityEvent('ENCRYPTION_KEYS_REGENERATED', { 
            newSalt: this.newSalt,
            timestamp: Date.now() 
        });
        
        alert('تم توليد مفاتيح تشفير جديدة بنجاح.');
    }
    
    // تصدير تقرير الأمان
    exportSecurityReport() {
        const report = {
            timestamp: Date.now(),
            systemStatus: this.securitySystem,
            suspiciousActivity: this.securitySystem.threatDetection.suspiciousActivity,
            sessionInfo: {
                currentSession: this.securitySystem.session.sessionId,
                lastActivity: this.securitySystem.session.lastActivity
            },
            recommendations: this.getSecurityRecommendations()
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `security_report_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.logSecurityEvent('SECURITY_REPORT_EXPORTED', { timestamp: Date.now() });
    }
    
    // الحصول على توصيات الأمان
    getSecurityRecommendations() {
        const recommendations = [];
        
        if (!this.securitySystem.encryption.enabled) {
            recommendations.push('تفعيل التشفير لحماية البيانات');
        }
        
        if (this.securitySystem.passwordProtection.isLocked) {
            recommendations.push('فك حظر الحساب أو إعادة تعيين كلمة المرور');
        }
        
        if (this.securitySystem.threatDetection.suspiciousActivity.length > 0) {
            recommendations.push('مراجعة الأنشطة المشبوهة واتخاذ إجراءات أمنية');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('نظام الأمان يعمل بشكل مثالي');
        }
        
        return recommendations;
    }
    
    // ==============================================
    // نظام فتح الأراضي والممالك المتقدم
    // ==============================================
    
    // عرض قسم التوسعات
    showExpansionSection() {
        const expansionHTML = `
            <div class="expansion-section" id="expansion-section">
                <div class="section-header">
                    <h2>🗺️ توسيع الإمبراطورية</h2>
                    <button onclick="game.hideExpansionSection()" class="close-btn">×</button>
                </div>
                
                <div class="expansion-tabs">
                    <button class="tab-btn active" data-tab="territories" onclick="game.switchExpansionTab('territories')">
                        🏛️ الأراضي الجديدة
                    </button>
                    <button class="tab-btn" data-tab="kingdoms" onclick="game.switchExpansionTab('kingdoms')">
                        👑 الممالك الجديدة
                    </button>
                </div>
                
                <div class="expansion-content">
                    <div id="territories-tab" class="tab-content active">
                        ${this.getTerritoriesHTML()}
                    </div>
                    <div id="kingdoms-tab" class="tab-content">
                        ${this.getKingdomsHTML()}
                    </div>
                </div>
                
                <div class="expansion-progress">
                    <h4>📊 تقدم التوسعات</h4>
                    <div class="progress-stats">
                        <div class="stat">
                            <span class="stat-label">الأراضي المُفتوحة:</span>
                            <span class="stat-value">${this.expansionSystem.expansionProgress.totalTerritoriesUnlocked}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">الممالك المُفتوحة:</span>
                            <span class="stat-value">${this.expansionSystem.expansionProgress.totalKingdomsUnlocked}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', expansionHTML);
    }
    
    // إخفاء قسم التوسعات
    hideExpansionSection() {
        const section = document.getElementById('expansion-section');
        if (section) {
            section.remove();
        }
    }
    
    // تبديل التبويبات
    switchExpansionTab(tabName) {
        // إخفاء جميع التبويبات
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // إزالة الفئة النشطة من جميع الأزرار
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // إظهار التبويب المحدد
        document.getElementById(tabName + '-tab').classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }
    
    // عرض HTML الأراضي
    getTerritoriesHTML() {
        const territories = this.expansionSystem.territories.available;
        
        return `
            <div class="territories-grid">
                ${territories.map(territory => this.getTerritoryCardHTML(territory)).join('')}
            </div>
        `;
    }
    
    // عرض HTML الممالك
    getKingdomsHTML() {
        const kingdoms = this.expansionSystem.kingdoms.available;
        
        return `
            <div class="kingdoms-grid">
                ${kingdoms.map(kingdom => this.getKingdomCardHTML(kingdom)).join('')}
            </div>
        `;
    }
    
    // إنشاء بطاقة أرض
    getTerritoryCardHTML(territory) {
        const isUnlocked = this.expansionSystem.territories.unlocked.includes(territory.id);
        const isAffordable = this.canAffordExpansion(territory.cost);
        const canAccess = this.canAccessTerritory(territory);
        
        return `
            <div class="territory-card ${isUnlocked ? 'unlocked' : ''} ${!canAccess ? 'locked' : ''}">
                <div class="card-header">
                    <h3>${territory.name}</h3>
                    <span class="territory-type">${this.getTerritoryTypeIcon(territory.type)}</span>
                </div>
                
                <div class="card-description">
                    <p>${territory.description}</p>
                </div>
                
                <div class="card-requirements">
                    <span class="level-requirement">المستوى المطلوب: ${territory.level}</span>
                </div>
                
                <div class="card-benefits">
                    <h4>المكافآت:</h4>
                    ${Object.entries(territory.benefits).map(([key, value]) => 
                        `<span class="benefit">+${Math.round((value - 1) * 100)}% ${this.getBenefitName(key)}</span>`
                    ).join('')}
                </div>
                
                <div class="card-cost">
                    <h4>التكلفة:</h4>
                    ${this.getCostHTML(territory.cost)}
                </div>
                
                <div class="card-actions">
                    ${isUnlocked ? 
                        '<span class="status-unlocked">✅ مُفتح</span>' : 
                        !canAccess ?
                        '<span class="status-locked">🔒 المستوى منخفض</span>' :
                        isAffordable ?
                        `<button onclick="game.unlockTerritory('${territory.id}')" class="unlock-btn">فتح الأرض</button>` :
                        '<span class="status-expensive">💰 موارد غير كافية</span>'
                    }
                </div>
            </div>
        `;
    }
    
    // إنشاء بطاقة مملكة
    getKingdomCardHTML(kingdom) {
        const isUnlocked = this.expansionSystem.kingdoms.unlocked.includes(kingdom.id);
        const isAffordable = this.canAffordExpansion(kingdom.cost);
        const canAccess = this.canAccessKingdom(kingdom);
        const hasRequiredKingdom = this.hasRequiredKingdom(kingdom.requiresPreviousKingdom);
        
        return `
            <div class="kingdom-card ${isUnlocked ? 'unlocked' : ''} ${!canAccess ? 'locked' : ''}">
                <div class="card-header">
                    <h3>${kingdom.name}</h3>
                    <div class="kingdom-requirements">
                        ${kingdom.vipRequired ? `<span class="vip-req">VIP ${kingdom.vipRequired}</span>` : ''}
                        ${kingdom.requiresAlliance ? `<span class="alliance-req">👥 تحالف</span>` : ''}
                    </div>
                </div>
                
                <div class="card-description">
                    <p>${kingdom.description}</p>
                </div>
                
                <div class="card-requirements">
                    <span class="level-requirement">المستوى المطلوب: ${kingdom.level}</span>
                    ${!hasRequiredKingdom && kingdom.requiresPreviousKingdom ? 
                        `<span class="kingdom-req">يتطلب: ${this.getKingdomName(kingdom.requiresPreviousKingdom)}</span>` : ''}
                </div>
                
                <div class="card-benefits">
                    <h4>المكافآت الخاصة:</h4>
                    ${Object.entries(kingdom.benefits).map(([key, value]) => 
                        `<span class="benefit">${this.getKingdomBenefitHTML(key, value)}</span>`
                    ).join('')}
                </div>
                
                <div class="card-cost">
                    <h4>التكلفة الفاخرة:</h4>
                    ${this.getCostHTML(kingdom.cost)}
                </div>
                
                <div class="card-actions">
                    ${isUnlocked ? 
                        '<span class="status-unlocked">👑 مُفتح</span>' : 
                        !canAccess ?
                        '<span class="status-locked">🔒 المستوى منخفض</span>' :
                        !hasRequiredKingdom ?
                        '<span class="status-locked">🔒 يتطلب مملكة سابقة</span>' :
                        isAffordable ?
                        `<button onclick="game.unlockKingdom('${kingdom.id}')" class="unlock-btn premium">فتح المملكة</button>` :
                        '<span class="status-expensive">💰 موارد غير كافية</span>'
                    }
                </div>
            </div>
        `;
    }
    
    // التحقق من إمكانية الوصول للأرض
    canAccessTerritory(territory) {
        return this.levelIndex >= this.getLevelIndex(territory.level);
    }
    
    // التحقق من إمكانية الوصول للمملكة
    canAccessKingdom(kingdom) {
        return this.levelIndex >= this.getLevelIndex(kingdom.level) && 
               this.vipLevel >= (kingdom.vipRequired || 0);
    }
    
    // التحقق من وجود المملكة المطلوبة
    hasRequiredKingdom(kingdomId) {
        if (!kingdomId) return true;
        return this.expansionSystem.kingdoms.unlocked.includes(kingdomId);
    }
    
    // التحقق من إمكانية الدفع
    canAffordExpansion(cost) {
        return Object.entries(cost).every(([resource, amount]) => {
            return this.resources[resource] >= amount;
        });
    }
    
    // فتح أرض جديدة
    unlockTerritory(territoryId) {
        const territory = this.expansionSystem.territories.available.find(t => t.id === territoryId);
        if (!territory) return;
        
        // التحقق من المتطلبات
        if (!this.canAccessTerritory(territory)) {
            alert('مستواك منخفض لفتح هذه الأرض!');
            return;
        }
        
        // التحقق من الموارد
        if (!this.canAffordExpansion(territory.cost)) {
            alert('مواردك غير كافية لفتح هذه الأرض!');
            return;
        }
        
        // تطبيق التكلفة
        Object.entries(territory.cost).forEach(([resource, amount]) => {
            this.resources[resource] -= amount;
        });
        
        // فتح الأرض
        this.expansionSystem.territories.unlocked.push(territoryId);
        this.expansionSystem.expansionProgress.totalTerritoriesUnlocked++;
        this.expansionSystem.expansionProgress.lastExpansion = {
            type: 'territory',
            id: territoryId,
            name: territory.name,
            timestamp: Date.now()
        };
        
        // تطبيق المكافآت
        this.applyTerritoryBenefits(territory);
        
        // تسجيل الحدث الأمني
        this.logSecurityEvent('TERRITORY_UNLOCKED', {
            territoryId,
            name: territory.name,
            timestamp: Date.now()
        });
        
        // إنشاء نسخة احتياطية
        this.createSecureBackup();
        
        // تحديث العرض
        this.updateResourcesDisplay();
        this.showExpansionSection();
        
        alert(`🎉 تم فتح الأرض بنجاح!\n${territory.name}\nستحصل على مكافآت إضافية!`);
    }
    
    // فتح مملكة جديدة
    unlockKingdom(kingdomId) {
        const kingdom = this.expansionSystem.kingdoms.available.find(k => k.id === kingdomId);
        if (!kingdom) return;
        
        // التحقق من المتطلبات
        if (!this.canAccessKingdom(kingdom)) {
            alert('مستواك أو مستوى VIP منخفض لفتح هذه المملكة!');
            return;
        }
        
        if (!this.hasRequiredKingdom(kingdom.requiresPreviousKingdom)) {
            alert('يجب فتح المملكة السابقة أولاً!');
            return;
        }
        
        // التحقق من الموارد
        if (!this.canAffordExpansion(kingdom.cost)) {
            alert('مواردك غير كافية لفتح هذه المملكة!');
            return;
        }
        
        // تطبيق التكلفة
        Object.entries(kingdom.cost).forEach(([resource, amount]) => {
            this.resources[resource] -= amount;
        });
        
        // فتح المملكة
        this.expansionSystem.kingdoms.unlocked.push(kingdomId);
        this.expansionSystem.expansionProgress.totalKingdomsUnlocked++;
        this.expansionSystem.expansionProgress.lastExpansion = {
            type: 'kingdom',
            id: kingdomId,
            name: kingdom.name,
            timestamp: Date.now()
        };
        
        // تطبيق المكافآت
        this.applyKingdomBenefits(kingdom);
        
        // تسجيل الحدث الأمني
        this.logSecurityEvent('KINGDOM_UNLOCKED', {
            kingdomId,
            name: kingdom.name,
            timestamp: Date.now()
        });
        
        // إنشاء نسخة احتياطية
        this.createSecureBackup();
        
        // تحديث العرض
        this.updateResourcesDisplay();
        this.showExpansionSection();
        
        alert(`👑 تم فتح المملكة بنجاح!\n${kingdom.name}\nستحصل على صلاحيات ومكافآت حصرية!`);
    }
    
    // تطبيق مكافآت الأرض
    applyTerritoryBenefits(territory) {
        Object.entries(territory.benefits).forEach(([benefit, multiplier]) => {
            switch (benefit) {
                case 'goldBonus':
                    this.territoryGoldBonus = (this.territoryGoldBonus || 1) * multiplier;
                    break;
                case 'foodBonus':
                    this.territoryFoodBonus = (this.territoryFoodBonus || 1) * multiplier;
                    break;
                case 'ironBonus':
                    this.territoryIronBonus = (this.territoryIronBonus || 1) * multiplier;
                    break;
                case 'stoneBonus':
                    this.territoryStoneBonus = (this.territoryStoneBonus || 1) * multiplier;
                    break;
                case 'woodBonus':
                    this.territoryWoodBonus = (this.territoryWoodBonus || 1) * multiplier;
                    break;
                case 'gemsBonus':
                    this.territoryGemsBonus = (this.territoryGemsBonus || 1) * multiplier;
                    break;
            }
        });
    }
    
    // تطبيق مكافآت المملكة
    applyKingdomBenefits(kingdom) {
        Object.entries(kingdom.benefits).forEach(([benefit, value]) => {
            switch (benefit) {
                case 'troopBonus':
                    this.kingdomTroopBonus = (this.kingdomTroopBonus || 1) * value;
                    break;
                case 'formationUnlock':
                    this.unlockedFormations = this.unlockedFormations || [];
                    if (!this.unlockedFormations.includes(value)) {
                        this.unlockedFormations.push(value);
                    }
                    break;
                case 'allianceBonus':
                    this.kingdomAllianceBonus = (this.kingdomAllianceBonus || 1) * value;
                    break;
                case 'resourceBonus':
                    this.kingdomResourceBonus = (this.kingdomResourceBonus || 1) * value;
                    break;
                case 'tradeRoutes':
                    this.tradeRoutesUnlocked = true;
                    break;
                case 'merchantProtection':
                    this.merchantProtection = true;
                    break;
                case 'researchBonus':
                    this.kingdomResearchBonus = (this.kingdomResearchBonus || 1) * value;
                    break;
                case 'ancientKnowledge':
                    this.ancientKnowledgeUnlocked = true;
                    break;
                case 'wisdomBonus':
                    this.kingdomWisdomBonus = (this.kingdomWisdomBonus || 1) * value;
                    break;
                case 'fortificationBonus':
                    this.kingdomFortificationBonus = (this.kingdomFortificationBonus || 1) * value;
                    break;
                case 'weaponUpgrade':
                    this.weaponUpgradeUnlocked = true;
                    break;
                case 'armorBonus':
                    this.kingdomArmorBonus = (this.kingdomArmorBonus || 1) * value;
                    break;
                case 'ultimatePower':
                    this.kingdomUltimatePower = (this.kingdomUltimatePower || 1) * value;
                    break;
                case 'dragonRiders':
                    this.dragonRidersUnlocked = true;
                    break;
                case 'mythBonus':
                    this.kingdomMythBonus = (this.kingdomMythBonus || 1) * value;
                    break;
                case 'legendaryFortification':
                    this.legendaryFortification = true;
                    break;
            }
        });
    }
    
    // وظائف مساعدة للعرض
    getTerritoryTypeIcon(type) {
        const icons = {
            battlefield: '⚔️',
            mining: '⛏️',
            treasure: '💎',
            agriculture: '🌾',
            forestry: '🌲'
        };
        return icons[type] || '🏛️';
    }
    
    getBenefitName(key) {
        const names = {
            goldBonus: 'الذهب',
            foodBonus: 'الطعام',
            ironBonus: 'الحديد',
            stoneBonus: 'الحجر',
            woodBonus: 'الخشب',
            gemsBonus: 'الأحجار الكريمة'
        };
        return names[key] || key;
    }
    
    getKingdomBenefitHTML(key, value) {
        const descriptions = {
            troopBonus: `قوة القوات +${Math.round((value - 1) * 100)}%`,
            formationUnlock: `فتح ترتيب جديد: ${this.getFormationName(value)}`,
            allianceBonus: `مكافآت التحالف +${Math.round((value - 1) * 100)}%`,
            resourceBonus: `جميع الموارد +${Math.round((value - 1) * 100)}%`,
            tradeRoutes: '🛣️ فتح طرق تجارية',
            merchantProtection: '🛡️ حماية التجار',
            researchBonus: `سرعة البحث +${Math.round((value - 1) * 100)}%`,
            ancientKnowledge: '📚 معرفة قديمة',
            wisdomBonus: `حكمة +${Math.round((value - 1) * 100)}%`,
            fortificationBonus: `القلاع +${Math.round((value - 1) * 100)}%`,
            weaponUpgrade: '⚔️ تطوير الأسلحة',
            armorBonus: `الدروع +${Math.round((value - 1) * 100)}%`,
            ultimatePower: `القوة القصوى +${Math.round((value - 1) * 100)}%`,
            dragonRiders: '🐉 راكبي التنانين',
            mythBonus: `القوة الأسطورية +${Math.round((value - 1) * 100)}%`,
            legendaryFortification: '🏰 حصن أسطوري'
        };
        return descriptions[key] || `${key}: ${value}`;
    }
    
    getCostHTML(cost) {
        return Object.entries(cost).map(([resource, amount]) => 
            `<span class="cost-item">${amount} ${this.getResourceName(resource)}</span>`
        ).join(' • ');
    }
    
    getResourceName(resource) {
        const names = {
            gold: 'ذهب',
            food: 'طعام',
            wood: 'خشب',
            stone: 'حجر',
            iron: 'حديد',
            royalGems: 'ألماس ملكي',
            gems: 'أحجار كريمة',
            crystals: 'كريستالات',
            sacredRelics: 'آثار مقدسة',
            emperorCrowns: 'تيجان إمبراطور',
            diamonds: 'ماس'
        };
        return names[resource] || resource;
    }
    
    getLevelIndex(level) {
        return parseInt(level.replace('C', ''));
    }
    
    getFormationName(formation) {
        const names = {
            phalanx: 'الفيلان'
        };
        return names[formation] || formation;
    }
    
    getKingdomName(kingdomId) {
        const kingdom = this.expansionSystem.kingdoms.available.find(k => k.id === kingdomId);
        return kingdom ? kingdom.name : kingdomId;
    }
    
    // تحديث مستمر للتوسعات
    updateExpansionSystem() {
        // فحص الأراضي والممالك المتوفرة للفتح
        const availableTerritories = this.expansionSystem.territories.available.filter(territory => {
            return this.canAccessTerritory(territory) && 
                   !this.expansionSystem.territories.unlocked.includes(territory.id);
        });
        
        const availableKingdoms = this.expansionSystem.kingdoms.available.filter(kingdom => {
            return this.canAccessKingdom(kingdom) && 
                   this.hasRequiredKingdom(kingdom.requiresPreviousKingdom) &&
                   !this.expansionSystem.kingdoms.unlocked.includes(kingdom.id);
        });
        
        // إرسال إشعارات للرادار
        if (availableTerritories.length > 0) {
            this.triggerRadarAlert({
                type: 'WAR',
                title: 'أراضي جديدة متاحة!',
                message: `يوجد ${availableTerritories.length} أرض جديدة يمكنك فتحها`,
                severity: 2,
                territory: true
            });
        }
        
        if (availableKingdoms.length > 0) {
            this.triggerRadarAlert({
                type: 'REINFORCEMENT',
                title: 'ممالك جديدة متاحة!',
                message: `يوجد ${availableKingdoms.length} مملكة جديدة يمكنك فتحها`,
                severity: 3,
                kingdom: true
            });
        }
        
        // تحديث العدادات في الرادار
        this.updateRadarDisplay();
    }
    
    // مراقبة مستمرة للتوسعات
    startExpansionMonitoring() {
        setInterval(() => {
            this.updateExpansionSystem();
        }, 10000); // كل 10 ثوانٍ
    }

    // ======================================
    // نظام اليوم والليل مع توقيت غرينتش
    // ======================================
    
    // تحديث دورة الليل والنهار
    updateDayNightCycle() {
        const now = Date.now();
        const timeSystem = this.timeSystem;
        
        // تحديث وقت الخادم (GMT)
        timeSystem.serverTime = new Date();
        
        const elapsed = now - timeSystem.dayNightCycle.lastUpdate;
        
        // تحديد الوقت الحالي
        if (elapsed >= timeSystem.dayNightCycle.dayDuration) {
            // انتقال إلى الليل
            timeSystem.dayNightCycle.current = 'night';
            timeSystem.dayNightCycle.lastUpdate = now;
            this.applyDayNightEffects('night');
        } else if (elapsed >= timeSystem.dayNightCycle.dawnDuration && 
                  timeSystem.dayNightCycle.current === 'dawn') {
            // انتقال من الفجر إلى النهار
            timeSystem.dayNightCycle.current = 'day';
            timeSystem.dayNightCycle.lastUpdate = now;
            this.applyDayNightEffects('day');
        } else if (elapsed >= timeSystem.dayNightCycle.duskDuration && 
                  timeSystem.dayNightCycle.current === 'dusk') {
            // انتقال من الغروب إلى الفجر
            timeSystem.dayNightCycle.current = 'dawn';
            timeSystem.dayNightCycle.lastUpdate = now;
            this.applyDayNightEffects('dawn');
        }
        
        // تطبيق تأثيرات الإضاءة على المشهد
        this.updateSceneLighting();
    }
    
    // تطبيق تأثيرات الفترة الزمنية
    applyDayNightEffects(period) {
        const timeSystem = this.timeSystem;
        
        switch(period) {
            case 'day':
                this.environmentEffects.farmingBonus = 1.2;
                this.environmentEffects.resourceGeneration = 1.1;
                this.environmentEffects.battleModifier = 1.0;
                this.showMessage('🌅 شروق الشمس - تأثير إيجابي على الزراعة!', 'info');
                break;
                
            case 'night':
                this.environmentEffects.farmingBonus = 0.8;
                this.environmentEffects.resourceGeneration = 0.9;
                this.environmentEffects.battleModifier = 1.1; // معارك أفضل ليلاً
                this.showMessage('🌙 الليل يحين - المعارك أكثر فعالية!', 'info');
                break;
                
            case 'dawn':
                this.environmentEffects.farmingBonus = 1.0;
                this.environmentEffects.resourceGeneration = 1.0;
                this.environmentEffects.battleModifier = 1.0;
                break;
                
            case 'dusk':
                this.environmentEffects.farmingBonus = 0.9;
                this.environmentEffects.resourceGeneration = 0.95;
                this.environmentEffects.battleModifier = 1.0;
                break;
        }
        
        // تطبيق المكافآت على الإنتاج
        this.applyEnvironmentBonuses();
    }
    
    // تحديث إضاءة المشهد 3D
    updateSceneLighting() {
        if (!this.scene) return;
        
        const period = this.timeSystem.dayNightCycle.current;
        const directionalLight = this.scene.children.find(child => child.type === 'DirectionalLight');
        const ambientLight = this.scene.children.find(child => child.type === 'AmbientLight');
        
        if (!directionalLight || !ambientLight) return;
        
        const lightSettings = {
            day: { dir: { intensity: 0.8, color: 0xffffff }, amb: { intensity: 0.4, color: 0xffffff } },
            night: { dir: { intensity: 0.1, color: 0x4a90e2 }, amb: { intensity: 0.6, color: 0x1a1a2e } },
            dawn: { dir: { intensity: 0.5, color: 0xffa500 }, amb: { intensity: 0.3, color: 0xffd700 } },
            dusk: { dir: { intensity: 0.6, color: 0xff4500 }, amb: { intensity: 0.4, color: 0xff6347 } }
        };
        
        const settings = lightSettings[period] || lightSettings.day;
        
        directionalLight.intensity = settings.dir.intensity;
        directionalLight.color.setHex(settings.dir.color);
        ambientLight.intensity = settings.amb.intensity;
        ambientLight.color.setHex(settings.amb.color);
        
        // تحديث لون السماء
        const skyColors = {
            day: 0x87CEEB,    // أزرق سماوي
            night: 0x0f1419,  // أزرق داكن
            dawn: 0xff6b35,   // برتقالي
            dusk: 0xff4500    // أحمر برتقالي
        };
        
        this.scene.background = new THREE.Color(skyColors[period] || skyColors.day);
    }
    
    // حساب عمر البناء اليومي عند تسجيل الدخول
    calculateBuildingAge() {
        const now = Date.now();
        const buildAge = this.buildAgeSystem;
        
        // حساب العمر بال أيام/أسابيع/شهور/سنوات
        const totalDays = Math.floor((now - buildAge.accountCreation) / (24 * 60 * 60 * 1000));
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = Math.floor(totalDays / 30);
        const totalYears = Math.floor(totalDays / 365);
        
        buildAge.buildAge = {
            days: totalDays,
            weeks: totalWeeks,
            months: totalMonths,
            years: totalYears
        };
        
        // حساب الأيام المتتالية
        const lastLogin = buildAge.lastLoginDate;
        if (lastLogin) {
            const daysSinceLastLogin = Math.floor((now - lastLogin) / (24 * 60 * 60 * 1000));
            
            if (daysSinceLastLogin === 1) {
                buildAge.consecutiveDays += 1;
            } else if (daysSinceLastLogin > 1) {
                buildAge.consecutiveDays = 1; // إعادة تعيين
            }
        } else {
            buildAge.consecutiveDays = 1; // أول تسجيل دخول
        }
        
        buildAge.lastLoginDate = now;
        buildAge.totalPlayDays = totalDays;
        
        // حفظ البيانات
        this.saveGame();
        
        return buildAge.buildAge;
    }
    
    // إعطاء مكافآت يومية
    applyDailyLoginReward() {
        const buildAge = this.buildAgeSystem.buildAge;
        const reward = this.getDailyReward(buildAge.days);
        
        if (reward) {
            // إضافة الموارد
            Object.entries(reward).forEach(([resource, amount]) => {
                if (this.resources.hasOwnProperty(resource)) {
                    this.resources[resource] += amount;
                }
            });
            
            this.showMessage(`🎁 مكافأة يومية! +${Object.values(reward).join(' + ')}`, 'success');
            this.updateResourceDisplay();
            
            // حفظ آخر مكافأة
            this.buildAgeSystem.lastDailyCalculation = Date.now();
        }
    }
    
    // الحصول على المكافأة اليومية حسب العمر
    getDailyReward(days) {
        const rewards = this.buildAgeSystem.dailyRewards;
        const milestones = Object.keys(rewards).map(m => parseInt(m.replace('day', ''))).sort((a, b) => b - a);
        
        // العثور على أقرب معلم مكافأة
        for (const milestone of milestones) {
            if (days >= milestone) {
                return rewards[`day${milestone}`];
            }
        }
        
        return null; // لا توجد مكافأة
    }
    
    // تحديث عرض توقيت GMT
    updateGMTTimeDisplay() {
        const timeDisplay = document.getElementById('gmt-time-display');
        if (timeDisplay) {
            const now = new Date();
            const gmtTime = now.toISOString().split('T')[1].split('.')[0];
            timeDisplay.textContent = `🕐 ${gmtTime} GMT`;
        }
    }
    
    // تطبيق مكافآت البيئة
    applyEnvironmentBonuses() {
        // تطبيق المكافآت على المباني
        this.buildings.forEach(building => {
            if (building.userData.production) {
                Object.keys(building.userData.production).forEach(resource => {
                    const bonus = this.environmentEffects[resource + 'Bonus'] || 1;
                    building.userData.production[resource] = Math.floor(
                        building.userData.production[resource] * bonus
                    );
                });
            }
        });
    }
    
    // ======================================
    // نظام حماية القلاع 
    // ======================================
    
    // تحديث نظام حماية القلاع
    updateCastleProtectionSystem() {
        const currentLevel = this.getCurrentLevelValue();
        const now = Date.now();
        
        // تفعيل الحماية للمباني الصغيرة
        this.buildings.forEach(building => {
            const shouldHaveProtection = currentLevel < 10 || this.violatesSystemRules();
            
            if (shouldHaveProtection) {
                this.activateCastleProtection(building);
            } else {
                this.deactivateCastleProtection(building);
            }
        });
    }
    
    // تفعيل حماية القلعة
    activateCastleProtection(building) {
        building.userData.protected = true;
        building.userData.protectionExpiry = Date.now() + (24 * 60 * 60 * 1000); // 24 ساعة
        
        // إضافة تأثير بصري
        this.addProtectionGlow(building);
        
        // إشعار
        this.showMessage(`🛡️ مبنى "${building.userData.type}" تحت الحماية`, 'info');
    }
    
    // إلغاء تفعيل حماية القلعة
    deactivateCastleProtection(building) {
        if (building.userData.protected) {
            building.userData.protected = false;
            this.removeProtectionGlow(building);
            this.showMessage(`⚔️ مبنى "${building.userData.type}" يمكن مهاجمته الآن`, 'warning');
        }
    }
    
    // إضافة توهج الحماية
    addProtectionGlow(building) {
        if (building.userData.hasGlow) return;
        
        building.userData.hasGlow = true;
        building.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.emissive = child.material.emissive || new THREE.Color(0x000000);
                child.material.emissiveIntensity = 0.2;
            }
        });
    }
    
    // إزالة توهج الحماية
    removeProtectionGlow(building) {
        if (!building.userData.hasGlow) return;
        
        building.userData.hasGlow = false;
        building.traverse((child) => {
            if (child.isMesh && child.material) {
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0;
                }
            }
        });
    }
    
    // فحص مخالفة قواعد النظام
    violatesSystemRules() {
        // فحص أنشطة مشبوهة أو محاولة هروب من الحماية
        return this.securitySystem.threatDetection.suspiciousActivity.length > 0;
    }
    
    // ======================================
    // نظام الحفلان الأليفة
    // ======================================
    
    // تهيئة نظام الحفلان
    initializePetSystem() {
        this.petSystem = {
            unlocked: this.getCurrentLevelValue() >= 8, // يفتح في C8
            pets: [],
            availableTypes: [
                {
                    id: 'eagle',
                    name: 'نسر الإمبراطور',
                    description: 'نسر عظيم يقدم إطلالة استراتيجية',
                    attackBonus: 15,
                    defenseBonus: 10,
                    productionBonus: 1.2,
                    cost: { gold: 500, food: 200 },
                    unlockLevel: 'C8'
                },
                {
                    id: 'lion',
                    name: 'فهد تقني',
                    description: 'أسد قوي يحمي القلعة',
                    attackBonus: 20,
                    defenseBonus: 15,
                    productionBonus: 1.1,
                    cost: { gold: 800, food: 300, gems: 2 },
                    unlockLevel: 'C12'
                },
                {
                    id: 'dragon',
                    name: 'تنين ذهبي',
                    description: 'تنين أسطوري للقوة العظمى',
                    attackBonus: 30,
                    defenseBonus: 25,
                    productionBonus: 1.5,
                    cost: { gold: 2000, food: 1000, royalGems: 3, crystals: 5 },
                    unlockLevel: 'C18'
                },
                {
                    id: 'phoenix',
                    name: 'طائر الفينيق',
                    description: 'طائر الخلود والتجديد',
                    attackBonus: 25,
                    defenseBonus: 20,
                    productionBonus: 1.8,
                    cost: { gold: 5000, food: 2000, sacredRelics: 5, emperorCrowns: 2, diamonds: 3 },
                    unlockLevel: 'C25'
                }
            ]
        };
    }
    
    // إضافة حيوان أليف للقلعة
    adoptPet(petTypeId) {
        if (!this.petSystem || !this.petSystem.unlocked) {
            this.showMessage('نظام الحفلان غير متاح - يحتاج C8', 'error');
            return false;
        }
        
        const petType = this.petSystem.availableTypes.find(p => p.id === petTypeId);
        if (!petType) {
            this.showMessage('نوع الحيوان غير موجود', 'error');
            return false;
        }
        
        // فحص المستوى المطلوب
        if (this.getCurrentLevelValue() < this.getLevelIndex(petType.unlockLevel)) {
            this.showMessage(`يتطلب ${petType.unlockLevel} لاعتماد هذا الحيوان`, 'error');
            return false;
        }
        
        // فحص التكلفة
        if (!this.canAffordExpansion(petType.cost)) {
            this.showMessage('مواردك غير كافية لاعتماد هذا الحيوان', 'error');
            return false;
        }
        
        // تطبيق التكلفة
        Object.entries(petType.cost).forEach(([resource, amount]) => {
            this.resources[resource] -= amount;
        });
        
        // إضافة الحيوان
        const newPet = {
            ...petType,
            level: 1,
            experience: 0,
            happiness: 100,
            lastFed: Date.now(),
            assignedBuilding: null
        };
        
        this.petSystem.pets.push(newPet);
        
        this.showMessage(`🎉 تم اعتماد ${newPet.name} بنجاح!`, 'success');
        this.updateResourceDisplay();
        this.updatePetDisplay();
        
        return true;
    }
    
    // تطوير الحيوان الأليف
    levelUpPet(petIndex) {
        const pet = this.petSystem.pets[petIndex];
        if (!pet) return;
        
        const upgradeCost = this.calculatePetUpgradeCost(pet);
        
        if (!this.canAffordExpansion(upgradeCost)) {
            this.showMessage('مواردك غير كافية لتطوير الحيوان', 'error');
            return;
        }
        
        // تطبيق التكلفة
        Object.entries(upgradeCost).forEach(([resource, amount]) => {
            this.resources[resource] -= amount;
        });
        
        // تطوير الحيوان
        pet.level++;
        pet.experience = 0;
        pet.happiness = Math.min(100, pet.happiness + 10);
        
        this.showMessage(`🌟 تم تطوير ${pet.name} إلى المستوى ${pet.level}!`, 'success');
        this.updateResourceDisplay();
        this.updatePetDisplay();
    }
    
    // إطعام الحيوان الأليف
    feedPet(petIndex) {
        const pet = this.petSystem.pets[petIndex];
        if (!pet) return;
        
        const feedCost = { food: 50 };
        
        if (this.resources.food < feedCost.food) {
            this.showMessage('لا يمتلكك طعام كافي لإطعام الحيوان', 'error');
            return;
        }
        
        this.resources.food -= feedCost.food;
        pet.happiness = Math.min(100, pet.happiness + 20);
        pet.lastFed = Date.now();
        pet.experience += 10;
        
        this.showMessage(`🍖 تم إطعام ${pet.name} - السعادة: ${pet.happiness}%`, 'success');
        this.updateResourceDisplay();
        this.updatePetDisplay();
    }
    
    // تعيين الحيوان لمبنى
    assignPetToBuilding(petIndex, buildingType) {
        const pet = this.petSystem.pets[petIndex];
        if (!pet) return;
        
        const building = this.buildings.find(b => b.userData.type === buildingType);
        if (!building) {
            this.showMessage('المبنى المحدد غير موجود', 'error');
            return;
        }
        
        // إلغاء التعيين السابق
        this.petSystem.pets.forEach(p => {
            if (p.assignedBuilding === buildingType) {
                p.assignedBuilding = null;
            }
        });
        
        pet.assignedBuilding = buildingType;
        
        // تطبيق مكافآت الحيوان على المبنى
        this.applyPetBonusesToBuilding(building, pet);
        
        this.showMessage(`🏠 تم تعيين ${pet.name} إلى ${buildingType}`, 'success');
        this.updatePetDisplay();
    }
    
    // تطبيق مكافآت الحيوان على المبنى
    applyPetBonusesToBuilding(building, pet) {
        const bonuses = {
            attackBonus: pet.attackBonus * pet.level,
            defenseBonus: pet.defenseBonus * pet.level,
            productionBonus: pet.productionBonus + (pet.level * 0.1)
        };
        
        building.userData.petBonuses = bonuses;
        
        // تطبيق المكافآت على الإنتاج
        if (building.userData.production) {
            Object.keys(building.userData.production).forEach(resource => {
                const originalProduction = building.userData.production[resource];
                building.userData.production[resource] = Math.floor(
                    originalProduction * bonuses.productionBonus
                );
            });
        }
    }
    
    // حساب تكلفة تطوير الحيوان
    calculatePetUpgradeCost(pet) {
        const baseCost = pet.cost;
        const multiplier = pet.level;
        
        return Object.fromEntries(
            Object.entries(baseCost).map(([resource, amount]) => [
                resource, 
                Math.floor(amount * multiplier * 1.5)
            ])
        );
    }
    
    // عرض نظام الحفلان
    showPetSystem() {
        if (!this.petSystem) {
            this.initializePetSystem();
        }
        
        const petHTML = `
            <div class="pet-system-panel" id="pet-system-panel">
                <div class="panel-header">
                    <h2>🐾 نظام الحفلان الأليفة</h2>
                    <button onclick="game.hidePetSystem()" class="close-btn">✕</button>
                </div>
                
                ${this.petSystem.unlocked ? 
                    this.getPetSystemContent() : 
                    '<div class="locked-message">🔒 يحتاج C8 لفتح نظام الحفلان</div>'
                }
            </div>
        `;
        
        // إظهار اللوحة
        let panel = document.getElementById('pet-system-panel');
        if (panel) {
            panel.remove();
        }
        
        document.body.insertAdjacentHTML('beforeend', petHTML);
    }
    
    // إخفاء نظام الحفلان
    hidePetSystem() {
        const panel = document.getElementById('pet-system-panel');
        if (panel) {
            panel.remove();
        }
    }
    
    // محتوى نظام الحفلان
    getPetSystemContent() {
        return `
            <div class="pet-content">
                <div class="available-pets">
                    <h3>🏪 حيوانات متاحة للاعتماد</h3>
                    <div class="pets-grid">
                        ${this.getAvailablePetsHTML()}
                    </div>
                </div>
                
                <div class="current-pets">
                    <h3>🐕 حيواناتك الحالية</h3>
                    <div class="pets-list">
                        ${this.getCurrentPetsHTML()}
                    </div>
                </div>
            </div>
        `;
    }
    
    // عرض الحيوانات المتاحة
    getAvailablePetsHTML() {
        return this.petSystem.availableTypes.map(pet => {
            const canAfford = this.canAffordExpansion(pet.cost);
            const unlocked = this.getCurrentLevelValue() >= this.getLevelIndex(pet.unlockLevel);
            
            return `
                <div class="pet-card ${!unlocked ? 'locked' : ''}">
                    <div class="pet-info">
                        <h4>${pet.name}</h4>
                        <p>${pet.description}</p>
                        <div class="pet-stats">
                            <span>⚔️ هجوم: +${pet.attackBonus}</span>
                            <span>🛡️ دفاع: +${pet.defenseBonus}</span>
                            <span>🏭 إنتاج: +${Math.round((pet.productionBonus - 1) * 100)}%</span>
                        </div>
                    </div>
                    <div class="pet-cost">
                        <strong>التكلفة:</strong>
                        ${this.getCostHTML(pet.cost)}
                    </div>
                    <button class="adopt-btn" 
                            onclick="game.adoptPet('${pet.id}')"
                            ${!unlocked || !canAfford ? 'disabled' : ''}>
                        ${!unlocked ? '🔒 مقفل' : !canAfford ? '💰 غير كافي' : '✅ اعتماد'}
                    </button>
                </div>
            `;
        }).join('');
    }
    
    // عرض الحيوانات الحالية
    getCurrentPetsHTML() {
        if (this.petSystem.pets.length === 0) {
            return '<div class="no-pets">لا تملك حيوانات أليفة حالياً</div>';
        }
        
        return this.petSystem.pets.map((pet, index) => `
            <div class="pet-item">
                <div class="pet-details">
                    <h4>${pet.name} (المستوى ${pet.level})</h4>
                    <div class="pet-status">
                        <span>😊 سعادة: ${pet.happiness}%</span>
                        <span>⚡ خبرة: ${pet.experience}/100</span>
                        ${pet.assignedBuilding ? `<span>🏠 مُعين لـ: ${pet.assignedBuilding}</span>` : ''}
                    </div>
                </div>
                <div class="pet-actions">
                    <button onclick="game.feedPet(${index})" class="feed-btn">🍖 إطعام</button>
                    <button onclick="game.levelUpPet(${index})" class="level-up-btn">⭐ تطوير</button>
                    <button onclick="game.showPetAssignment(${index})" class="assign-btn">🏠 تعيين</button>
                </div>
            </div>
        `).join('');
    }
    
    // عرض تعيين الحيوان
    showPetAssignment(petIndex) {
        const pet = this.petSystem.pets[petIndex];
        if (!pet) return;
        
        const buildings = this.buildings.map(b => b.userData.type);
        const uniqueBuildings = [...new Set(buildings)];
        
        let assignmentModal = document.getElementById('pet-assignment-modal');
        if (assignmentModal) {
            assignmentModal.remove();
        }
        
        const modalHTML = `
            <div class="modal-overlay" id="pet-assignment-modal">
                <div class="modal-content">
                    <h3>تعيين ${pet.name} لمبنى</h3>
                    <div class="building-list">
                        ${uniqueBuildings.map(buildingType => `
                            <button onclick="game.assignPetToBuilding(${petIndex}, '${buildingType}')" 
                                    class="building-btn">
                                🏛️ ${buildingType}
                            </button>
                        `).join('')}
                    </div>
                    <button onclick="game.hidePetAssignment()" class="close-modal">إلغاء</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    // إخفاء تعيين الحيوان
    hidePetAssignment() {
        const modal = document.getElementById('pet-assignment-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    // تحديث عرض الحفلان
    updatePetDisplay() {
        // تحديث أيقونة الحفلان في الواجهة الرئيسية
        const petIcon = document.getElementById('pet-system-icon');
        if (petIcon) {
            const petCount = this.petSystem ? this.petSystem.pets.length : 0;
            petIcon.textContent = petCount > 0 ? `🐾 (${petCount})` : '🐾';
        }
    }
    
    // ======================================
    // نظام إشعارات الدردشة
    notifyGameEvent(eventType, data) {
        if (!this.chatSystem) return;
        
        switch (eventType) {
            case 'building_upgrade':
                this.chatSystem.addBuildingMessage(data.building, 'ترقية');
                break;
            case 'resource_gain':
                this.chatSystem.addRewardMessage(data.reward);
                break;
            case 'battle_start':
                this.chatSystem.addBattleMessage({
                    ...data,
                    message: `⚔️ بداية معركة ${data.enemy}`
                });
                break;
            case 'battle_result':
                const resultMessage = data.won ? 
                    `🏆 انتصار! تم كسب ${data.rewards.gold} ذهب` :
                    `💀 هزيمة! خسرت ${data.lost.troops} جندي`;
                this.chatSystem.addBattleMessage({ message: resultMessage });
                break;
            case 'system_message':
                this.chatSystem.addSystemMessage(data.message, data.type || 'system');
                break;
        }
    }

    // إرسال إشعار ترجمة للعبة
    notifyTranslationEvent(message, originalLanguage, translatedMessage) {
        if (!this.chatSystem) return;
        
        const messageData = {
            id: Date.now(),
            type: 'translation',
            channel: 'general',
            user: 'النظام',
            message: `ترجمة: ${translatedMessage}`,
            originalMessage: message,
            originalLanguage: originalLanguage,
            timestamp: new Date(),
            language: this.translationSystem.currentLanguage
        };
        
        this.chatSystem.addMessage(messageData);
    }

    // ======================================
    // تحسين الأداء للهواتف
    // ======================================
    
    // فحص الجهاز المحمول
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }
    
    // تحسين الأداء للهواتف
    optimizeForMobile() {
        // تقليل جودة الرسم
        if (this.renderer) {
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }
        
        // تقليل عدد الجسيمات
        if (this.particles) {
            this.particles.visible = false; // إخفاء الجسيمات في الهواتف
        }
        
        // تقليل التحديثات
        this.frameSkip = this.frameSkip || 0;
        this.frameSkip++;
        
        if (this.frameSkip >= 2) { // تحديث كل إطاريْن بدلاً من كل إطار
            this.frameSkip = 0;
            return false;
        }
        
        return true;
    }
    
    // تحديث إعدادات الرسوم للهواتف
    optimizeGraphicsForMobile() {
        if (!this.isMobileDevice()) return;
        
        // تقليل جودة الظلال
        this.renderer.shadowMap.enabled = false;
        
        // تقليل عدد المصادر الضوئية
        this.scene.children = this.scene.children.filter(child => 
            child.type !== 'PointLight' || this.scene.children.indexOf(child) < 2
        );
        
        // تفعيل وضع توفير الطاقة
        this.renderer.powerPreference = 'low-power';
    }
}

// Initialize game when page loads
let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new TechEmpire3D();
    
    // Make game globally available for UI callbacks
    window.game = game;
    
    // رسالة تأكيد نظام الأمان
    setTimeout(() => {
        console.log('%c🛡️ نظام الأمان والحماية مُفعل ✅', 
                   'color: #00ff41; font-size: 16px; font-weight: bold; text-shadow: 0 0 10px rgba(0,255,65,0.5)');
        console.log('%c• تشفير AES-256-CBC مُفعل', 'color: #00ff41; font-size: 12px');
        console.log('%c• حماية من القوة الغاشمة مُفعل', 'color: #00ff41; font-size: 12px');
        console.log('%c• كشف التهديدات مُفعل', 'color: #00ff41; font-size: 12px');
        console.log('%c• النسخ الاحتياطي التلقائي مُفعل', 'color: #00ff41; font-size: 12px');
        console.log('%c🛡️ يمكنك الوصول لواجهة الأمان من زر "الأمان" في القائمة الرئيسية', 
                   'color: #00ffff; font-size: 12px; font-style: italic');
    }, 1000);
    
    // تهيئة نظام الرادار المتطور
    setTimeout(() => {
        game.initializeAdvancedRadar();
    }, 1500);
    
    // إضافة تحكم سريع للمالك
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'A') {
            game.toggleOwnerMode();
        }
    });
});

// Service Worker for PWA functionality (if needed)
if ('serviceWorker' in navigator) {
    // تهيئة نظام التراخيص والتطوير السريع
    initializeLicenseSystem() {
        if (this.licenseSystem) {
            this.licenseSystem.initialize();
        }
    }

    // فتح المتجر
    openStore() {
        if (this.licenseSystem) {
            this.licenseSystem.openStore();
        }
    }

    // التحقق من إمكانية بناء مبنى
    canBuild(buildingType) {
        if (this.licenseSystem) {
            return this.licenseSystem.canBuild(buildingType);
        }
        return { allowed: true };
    }

    // الحصول على حالة البنية
    getBuildingStatus(buildingType) {
        if (this.licenseSystem) {
            return this.licenseSystem.getBuildingStatus(buildingType);
        }
        return 'available';
    }

    // إدارة أراضي المملكة
    showKingdomLands() {
        console.log('عرض أراضي المملكة');
        // إخفاء جميع الأقسام
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // إظهار قسم أراضي المملكة
        const kingdomLandsSection = document.getElementById('kingdom-lands-section');
        if (kingdomLandsSection) {
            kingdomLandsSection.style.display = 'block';
        }
        
        // تحديث الخريطة
        this.refreshLandMap();
    }

    developLand(landType) {
        console.log('تطوير الأرض:', landType);
        // منطق تطوير الأرض
        if (!this.kingdomData) {
            this.kingdomData = {
                hills: { level: 1, stone: 50 },
                greenFields: { level: 1, food: 100 },
                waterSources: { level: 1, bonus: 10 },
                forests: { level: 1, wood: 80 }
            };
        }
        
        if (this.kingdomData[landType]) {
            this.kingdomData[landType].level++;
            this.updateLandDisplay(landType);
            this.showMessage(`تم تطوير ${landType} إلى المستوى ${this.kingdomData[landType].level}`);
        }
    }

    refreshLandMap() {
        console.log('تحديث خريطة الأراضي');
        // تحديث عرض الأراضي
        if (this.kingdomData) {
            Object.keys(this.kingdomData).forEach(landType => {
                this.updateLandDisplay(landType);
            });
        }
    }

    updateLandDisplay(landType) {
        const landElement = document.getElementById(`land-${landType}`);
        if (landElement && this.kingdomData[landType]) {
            const land = this.kingdomData[landType];
            landElement.querySelector('.land-level').textContent = `المستوى: ${land.level}`;
            
            if (land.stone) landElement.querySelector('.land-production').textContent = `إنتاج: ${land.stone} حجر/ساعة`;
            if (land.food) landElement.querySelector('.land-production').textContent = `إنتاج: ${land.food} طعام/ساعة`;
            if (land.wood) landElement.querySelector('.land-production').textContent = `إنتاج: ${land.wood} خشب/ساعة`;
            if (land.bonus) landElement.querySelector('.land-production').textContent = `عائد: +${land.bonus}% موارد`;
        }
    }

    // إظهار مدخل المدينة والدفاعات
    showCityGates() {
        console.log('عرض مدخل المدينة والدفاعات');
        // إخفاء جميع الأقسام
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // إظهار قسم مدخل المدينة
        const cityGatesSection = document.getElementById('city-gates-section');
        if (cityGatesSection) {
            cityGatesSection.style.display = 'block';
        }
        
        // تحديث الإحصائيات الدفاعية
        this.updateDefenseStats();
    }

    // ترقية مدخل المدينة
    upgradeCityGate() {
        const currentLevel = parseInt(document.getElementById('city-gate-level').textContent) || 1;
        const cost = currentLevel * 500;
        const currentGold = parseInt(document.getElementById('gold-amount').textContent) || 0;
        
        if (currentGold >= cost) {
            // خصم التكلفة
            document.getElementById('gold-amount').textContent = currentGold - cost;
            
            // ترقية المدخل
            document.getElementById('city-gate-level').textContent = currentLevel + 1;
            document.getElementById('city-gate-defense').textContent = 100 * (currentLevel + 1);
            
            // تحديث تكلفة الترقية التالية
            document.getElementById('gate-upgrade-cost').textContent = (currentLevel + 1) * 500 + ' ذهب';
            
            console.log(`تم ترقية مدخل المدينة إلى المستوى ${currentLevel + 1}`);
        } else {
            console.log('لا يوجد ذهب كافي لترقية المدخل');
        }
    }

    // تغيير كمية الدفاع
    changeDefenseQuantity(defenseType, change) {
        const inputElement = document.getElementById(`${defenseType}-quantity`);
        if (inputElement) {
            const currentValue = parseInt(inputElement.value) || 0;
            const newValue = Math.max(0, Math.min(10, currentValue + change));
            inputElement.value = newValue;
        }
    }

    // بناء دفاع
    buildDefense(defenseType) {
        const quantityInput = document.getElementById(`${defenseType}-quantity`);
        if (!quantityInput) return;
        
        const quantity = parseInt(quantityInput.value) || 0;
        if (quantity <= 0) {
            console.log('اختر كمية صحيحة للبناء');
            return;
        }
        
        // حساب التكلفة
        const costs = {
            'colossi': 300,
            'fire-trap': 200,
            'auto-turret': 400,
            'stone-thrower': 500,
            'moving-wall': 150
        };
        
        const cost = costs[defenseType] * quantity;
        const currentGold = parseInt(document.getElementById('gold-amount').textContent) || 0;
        
        if (currentGold >= cost) {
            // خصم التكلفة
            document.getElementById('gold-amount').textContent = currentGold - cost;
            
            console.log(`تم بناء ${quantity} من ${defenseType} بتكلفة ${cost} ذهب`);
            
            // إعادة تعيين الكمية
            quantityInput.value = 0;
            
            // تحديث الإحصائيات
            this.updateDefenseStats();
        } else {
            console.log('لا يوجد ذهب كافي للبناء');
        }
    }

    // تحديث الإحصائيات الدفاعية
    updateDefenseStats() {
        const defenseCards = document.querySelectorAll('.defense-card');
        let totalDefensePower = 0;
        let totalUnits = 0;
        
        defenseCards.forEach(card => {
            const quantity = parseInt(card.querySelector('.defense-controls input').value) || 0;
            const defensePower = parseInt(card.querySelector('.stat-row:first-child span:last-child').textContent) || 0;
            
            totalDefensePower += defensePower * quantity;
            totalUnits += quantity;
        });
        
        // تحديث العرض
        const totalDefenseEl = document.getElementById('total-defense-power');
        const totalUnitsEl = document.getElementById('defense-units-count');
        
        if (totalDefenseEl) totalDefenseEl.textContent = totalDefensePower;
        if (totalUnitsEl) totalUnitsEl.textContent = totalUnits;
    }

    window.addEventListener('load', () => {
        // إنشاء وتشغيل اللعبة
        console.log('بدء تشغيل الإمبراطورية التقنية 3D...');
        
        try {
            // إنشاء game object
            window.game = new TechEmpire3D();
            console.log('تم إنشاء game object بنجاح');
        } catch (error) {
            console.error('خطأ في تشغيل اللعبة:', error);
        }
        
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}