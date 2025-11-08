// ==========================================
// متغيرات اللعبة الأساسية
// ==========================================
const GameState = {
    resources: {
        gold: 2500,
        food: 1500,
        wood: 800,
        stone: 600,
        iron: 200
    },
    
    vipLevel: 0,
    vipExpireDate: null,
    city: {
        buildings: [],
        gridSize: 20
    },
    
    currentPanel: null,
    selectedBuilding: null,
    isDragging: false
};

// ==========================================
// تعريفات المباني
// ==========================================
const BUILDINGS = {
    villa: {
        name: 'فيلا',
        description: 'منزل فاخر للنبلاء. يزيد من الدخل والعدد الأقصى للسكان',
        cost: { gold: 500, food: 300, wood: 200, stone: 100 },
        buildTime: 30, // بالأيام
        production: { gold: 10 },
        capacity: 20,
        icon: 'villa-icon',
        category: 'residential'
    },
    
    columns: {
        name: 'الأعمدة',
        description: 'أعمدة تقنية مستقبلية. تعطي منظر sci-fi عالي التقنية',
        cost: { gold: 300, stone: 200 },
        buildTime: 15,
        production: { population: 5 },
        effect: 'decoration',
        icon: 'columns-icon',
        category: 'decoration'
    },
    
    theater: {
        name: 'المسرح',
        description: 'مسرح روماني كلاسيكي. يزيد من الثقافة والسعادة',
        cost: { gold: 800, stone: 400, wood: 200 },
        buildTime: 45,
        production: { culture: 5 },
        capacity: 50,
        icon: 'theater-icon',
        category: 'cultural'
    },
    
    colosseum: {
        name: 'الكولوسيوم',
        description: 'مبنى ضخم للألعاب. يجمع أكبر عدد من الناس',
        cost: { gold: 2000, stone: 1000, iron: 200 },
        buildTime: 90,
        production: { glory: 10 },
        capacity: 200,
        icon: 'colosseum-icon',
        category: 'entertainment'
    },
    
    barracks: {
        name: 'الثكنات',
        description: 'ثكنات عسكرية. لتدريب القوات والحفاظ على الأمن',
        cost: { gold: 600, wood: 300, iron: 100 },
        buildTime: 40,
        production: { military: 5 },
        capacity: 30,
        icon: 'barracks-icon',
        category: 'military'
    },
    
    market: {
        name: 'السوق',
        description: 'مركز تجاري. يسمح بالتبادل التجاري مع المدن الأخرى',
        cost: { gold: 1000, wood: 500, stone: 200 },
        buildTime: 35,
        production: { trade: 15 },
        effect: 'trading',
        icon: 'market-icon',
        category: 'commercial'
    }
};

// ==========================================
// نظام VIP
// ==========================================
const VIP_LEVELS = {
    0: { name: 'غير مفعل', icon: 'basic-icon' },
    1: { name: 'VIP شامل', icon: 'bronze-icon', color: '#CD7F32' },
    2: { name: 'VIP كامل', icon: 'silver-icon', color: '#C0C0C0' },
    3: { name: 'VIP ماسي', icon: 'gold-icon', color: '#FFD700' }
};

// ==========================================
// الوظائف الأساسية للعبة
// ==========================================

// تحديث عرض الموارد
function updateResources() {
    Object.keys(GameState.resources).forEach(resource => {
        const element = document.getElementById(`${resource}-amount`);
        if (element) {
            element.textContent = GameState.resources[resource].toLocaleString();
        }
    });
}

// تحديث عرض VIP
function updateVIPDisplay() {
    const vipIcon = document.getElementById('vip-icon');
    const vipLevel = document.getElementById('vip-level');
    
    if (vipIcon && vipLevel) {
        const level = VIP_LEVELS[GameState.vipLevel];
        vipLevel.textContent = level.name;
        vipIcon.style.backgroundColor = level.color || '#6A6A6A';
    }
}

// إنشاء مبنى جديد
function createBuilding(type, x, y) {
    const buildingData = BUILDINGS[type];
    if (!buildingData) return null;
    
    // فحص التكلفة
    if (!canAfford(buildingData.cost)) {
        showMessage('لا تملك موارد كافية!', 'error');
        return null;
    }
    
    // خصم التكلفة
    spendResources(buildingData.cost);
    
    const building = {
        id: Date.now(),
        type: type,
        name: buildingData.name,
        level: 1,
        x: x,
        y: y,
        buildStart: Date.now(),
        buildEnd: Date.now() + (buildingData.buildTime * 1000 * 60 * 60 * 24), // تحويل الأيام لملي ثانية
        isUnderConstruction: true
    };
    
    GameState.city.buildings.push(building);
    renderBuilding(building);
    updateResources();
    showMessage(`بدأ بناء ${buildingData.name}!`, 'success');
    
    return building;
}

// عرض المبنى في المدينة
function renderBuilding(building) {
    const cityGrid = document.getElementById('city-grid');
    if (!cityGrid) return;
    
    const buildingElement = document.createElement('div');
    buildingElement.className = 'building-placed';
    buildingElement.id = `building-${building.id}`;
    buildingElement.style.left = `${building.x * 32}px`;
    buildingElement.style.top = `${building.y * 32}px`;
    
    const buildingData = BUILDINGS[building.type];
    buildingElement.className += ` ${buildingData.icon}`;
    
    if (building.isUnderConstruction) {
        buildingElement.classList.add('under-construction');
    }
    
    buildingElement.addEventListener('click', () => showBuildingInfo(building));
    buildingElement.title = `${buildingData.name} (المستوى ${building.level})`;
    
    cityGrid.appendChild(buildingElement);
}

// عرض معلومات المبنى
function showBuildingInfo(building) {
    const sidePanel = document.getElementById('side-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelContent = document.getElementById('panel-content');
    
    if (!sidePanel || !panelTitle || !panelContent) return;
    
    const buildingData = BUILDINGS[building.type];
    
    panelTitle.textContent = buildingData.name;
    panelContent.innerHTML = `
        <div class="building-info">
            <div class="building-level">المستوى: ${building.level}</div>
            <div class="building-description">${buildingData.description}</div>
            
            ${building.isUnderConstruction ? `
                <div class="construction-info">
                    <h3>قيد الإنشاء</h3>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 0%"></div>
                    </div>
                    <div class="time-remaining" id="time-remaining-${building.id}">يحسب الوقت...</div>
                </div>
            ` : `
                <div class="building-stats">
                    <h3>الإحصائيات</h3>
                    ${Object.entries(buildingData.production).map(([key, value]) => 
                        `<p>${getResourceName(key)}: +${value}/يوم</p>`
                    ).join('')}
                    ${buildingData.capacity ? `<p>السعة: ${buildingData.capacity}</p>` : ''}
                </div>
                
                <div class="building-actions">
                    <button class="btn btn-primary" onclick="upgradeBuilding(${building.id})">
                        ترقية
                    </button>
                    <button class="btn btn-secondary" onclick="demolishBuilding(${building.id})">
                        هدم
                    </button>
                </div>
            `}
        </div>
    `;
    
    // إظهار اللوحة
    if (GameState.currentPanel !== 'building') {
        sidePanel.classList.remove('hidden');
        GameState.currentPanel = 'building';
    }
    
    GameState.selectedBuilding = building;
    
    // بدء تحديث شريط التقدم إذا كان المبنى قيد الإنشاء
    if (building.isUnderConstruction) {
        updateConstructionProgress(building);
    }
}

// تحديث تقدم البناء
function updateConstructionProgress(building) {
    const progressElement = document.querySelector(`#building-${building.id} .progress-fill`);
    const timeElement = document.getElementById(`time-remaining-${building.id}`);
    
    if (!progressElement || !timeElement) return;
    
    const now = Date.now();
    const totalTime = building.buildEnd - building.buildStart;
    const elapsed = now - building.buildStart;
    const progress = Math.min((elapsed / totalTime) * 100, 100);
    
    progressElement.style.width = `${progress}%`;
    
    const remainingTime = Math.max(building.buildEnd - now, 0);
    if (remainingTime > 0) {
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        timeElement.textContent = `${days} يوم ${hours} ساعة متبقية`;
        setTimeout(() => updateConstructionProgress(building), 60000); // تحديث كل دقيقة
    } else {
        // انتهاء البناء
        building.isUnderConstruction = false;
        const buildingElement = document.getElementById(`building-${building.id}`);
        if (buildingElement) {
            buildingElement.classList.remove('under-construction');
        }
        timeElement.textContent = 'مكتمل!';
        showMessage(`${building.name} جاهز!`, 'success');
    }
}

// فحص إمكانية الشراء
function canAfford(cost) {
    return Object.entries(cost).every(([resource, amount]) => 
        GameState.resources[resource] >= amount
    );
}

// إنفاق الموارد
function spendResources(cost) {
    Object.entries(cost).forEach(([resource, amount]) => {
        GameState.resources[resource] -= amount;
    });
}

// ترقية المبنى
function upgradeBuilding(buildingId) {
    const building = GameState.city.buildings.find(b => b.id === buildingId);
    if (!building) return;
    
    const buildingData = BUILDINGS[building.type];
    const upgradeCost = calculateUpgradeCost(buildingData.cost, building.level);
    
    if (!canAfford(upgradeCost)) {
        showMessage('لا تملك موارد كافية للترقية!', 'error');
        return;
    }
    
    spendResources(upgradeCost);
    building.level++;
    building.isUnderConstruction = true;
    building.buildStart = Date.now();
    building.buildEnd = Date.now() + (buildingData.buildTime * 1000 * 60 * 60 * 24);
    
    updateResources();
    showBuildingInfo(building);
    showMessage(`بدأ ترقية ${buildingData.name} إلى المستوى ${building.level}!`, 'success');
}

// حساب تكلفة الترقية
function calculateUpgradeCost(baseCost, level) {
    const multiplier = Math.pow(1.5, level - 1);
    const upgradeCost = {};
    
    Object.entries(baseCost).forEach(([resource, amount]) => {
        upgradeCost[resource] = Math.floor(amount * multiplier);
    });
    
    return upgradeCost;
}

// هدم المبنى
function demolishBuilding(buildingId) {
    const buildingIndex = GameState.city.buildings.findIndex(b => b.id === buildingId);
    if (buildingIndex === -1) return;
    
    const building = GameState.city.buildings[buildingIndex];
    const buildingElement = document.getElementById(`building-${building.id}`);
    
    if (buildingElement) {
        buildingElement.remove();
    }
    
    GameState.city.buildings.splice(buildingIndex, 1);
    GameState.selectedBuilding = null;
    closeSidePanel();
    showMessage(`تم هدم ${building.name}`, 'info');
}

// إغلاق اللوحة الجانبية
function closeSidePanel() {
    const sidePanel = document.getElementById('side-panel');
    if (sidePanel) {
        sidePanel.classList.add('hidden');
        GameState.currentPanel = null;
    }
}

// عرض رسالة للمستخدم
function showMessage(message, type = 'info') {
    // إنشاء عنصر الرسالة
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: ${type === 'error' ? 'var(--error)' : 
                           type === 'success' ? 'var(--success)' : 
                           type === 'warning' ? 'var(--warning)' : 'var(--primary-500)'};
        color: white;
        padding: 12px 24px;
        border: 2px solid var(--border-color);
        z-index: 2000;
        font-family: var(--font-title);
        font-size: 16px;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(messageElement);
    
    // إزالة الرسالة بعد 3 ثواني
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// ==========================================
// نظام البناء الجديد
// ==========================================
function startBuilding(type) {
    const buildingData = BUILDINGS[type];
    if (!buildingData) return;
    
    // إظهار نافذة تأكيد البناء
    const modal = document.getElementById('build-modal');
    const buildInfo = document.getElementById('build-info');
    
    if (!modal || !buildInfo) return;
    
    buildInfo.innerHTML = `
        <h3>${buildingData.name}</h3>
        <p>${buildingData.description}</p>
        <div class="cost-info">
            <h4>التكلفة:</h4>
            ${Object.entries(buildingData.cost).map(([resource, amount]) => 
                `<p>${getResourceName(resource)}: ${amount}</p>`
            ).join('')}
        </div>
        <div class="production-info">
            <h4>الإنتاج:</h4>
            ${Object.entries(buildingData.production).map(([resource, amount]) => 
                `<p>${getResourceName(resource)}: +${amount}/يوم</p>`
            ).join('')}
            ${buildingData.capacity ? `<p>السعة: ${buildingData.capacity} نسمة</p>` : ''}
        </div>
        <p>مدة البناء: ${buildingData.buildTime} يوم</p>
    `;
    
    modal.style.display = 'flex';
    
    // حفظ نوع المبنى المحدد
    modal.dataset.buildingType = type;
}

// ==========================================
// وظائف مساعدة
// ==========================================

// الحصول على اسم المورد بالعربية
function getResourceName(resource) {
    const names = {
        gold: 'الذهب',
        food: 'الطعام',
        wood: 'الخشب',
        stone: 'الحجر',
        iron: 'الحديد',
        population: 'السكان',
        culture: 'الثقافة',
        glory: 'الشهرة',
        military: 'العسكرية',
        trade: 'التجارة'
    };
    return names[resource] || resource;
}

// ==========================================
// تهيئة اللعبة
// ==========================================
function initializeGame() {
    // تحديث العرض
    updateResources();
    updateVIPDisplay();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // إضافة بعض المباني التجريبية
    createBuilding('villa', 5, 5);
    createBuilding('columns', 7, 5);
    
    showMessage('مرحباً بك في الإمبراطورية التقنية! 🚀', 'success');
}

// ==========================================
// إعداد مستمعي الأحداث
// ==========================================
function setupEventListeners() {
    // أزرار المباني
    document.querySelectorAll('.building-item').forEach(item => {
        item.addEventListener('click', () => {
            const buildingType = item.dataset.building;
            startBuilding(buildingType);
        });
    });
    
    // إغلاق اللوحة الجانبية
    const closePanelBtn = document.getElementById('close-panel');
    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', closeSidePanel);
    }
    
    // نوافذ منبثقة - البناء
    const buildModal = document.getElementById('build-modal');
    const confirmBuild = document.getElementById('confirm-build');
    const cancelBuild = document.getElementById('cancel-build');
    
    if (confirmBuild) {
        confirmBuild.addEventListener('click', () => {
            const buildingType = buildModal.dataset.buildingType;
            if (buildingType) {
                // إضافة المبنى في أول موقع متاح
                const emptyPosition = findEmptyPosition();
                if (emptyPosition) {
                    createBuilding(buildingType, emptyPosition.x, emptyPosition.y);
                } else {
                    showMessage('لا يوجد مساحة كافية في المدينة!', 'error');
                }
            }
            buildModal.style.display = 'none';
        });
    }
    
    if (cancelBuild) {
        cancelBuild.addEventListener('click', () => {
            buildModal.style.display = 'none';
        });
    }
    
    // نوافذ منبثقة - VIP
    const vipModal = document.getElementById('vip-modal');
    const vipBtn = document.querySelector('[data-section="vip"]');
    const closeVip = document.getElementById('close-vip');
    
    if (vipBtn) {
        vipBtn.addEventListener('click', () => {
            vipModal.style.display = 'flex';
        });
    }
    
    if (closeVip) {
        closeVip.addEventListener('click', () => {
            vipModal.style.display = 'none';
        });
    }
    
    // أزرار VIP
    document.querySelectorAll('.vip-package .btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const level = parseInt(e.target.closest('.vip-package').dataset.level);
            purchaseVIP(level);
        });
    });
    
    // تنقل الأقسام
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.target.closest('.nav-btn').dataset.section;
            showSection(section);
        });
    });
}

// البحث عن موقع فارغ في المدينة
function findEmptyPosition() {
    const gridSize = GameState.city.gridSize;
    const occupiedPositions = GameState.city.buildings.map(b => `${b.x},${b.y}`);
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            if (!occupiedPositions.includes(`${x},${y}`)) {
                return { x, y };
            }
        }
    }
    return null;
}

// شراء VIP
function purchaseVIP(level) {
    const prices = {
        1: 1000, // دولار
        2: 2000,
        3: 5000
    };
    
    const pricesGold = {
        1: 0, // VIP مجاني أو بسعر رمزي
        2: 0,
        3: 0
    };
    
    // في هذه اللعبة التجريبية، جميع مستويات VIP مجانية
    GameState.vipLevel = level;
    GameState.vipExpireDate = new Date();
    GameState.vipExpireDate.setMonth(GameState.vipExpireDate.getMonth() + (level * 30));
    
    updateVIPDisplay();
    
    const vipName = VIP_LEVELS[level].name;
    showMessage(`تم تفعيل ${vipName} بنجاح!`, 'success');
    
    document.getElementById('vip-modal').style.display = 'none';
}

// عرض قسم معين
function showSection(section) {
    // إزالة الحالة النشطة من جميع الأزرار
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // إضافة الحالة النشطة للقسم المحدد
    const activeBtn = document.querySelector(`[data-section="${section}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // إظهار المحتوى المناسب (للآن نعرض رسالة)
    switch (section) {
        case 'city':
            showMessage('في قسم المدينة - يمكنك بناء وتوسيع مدينتك', 'info');
            break;
        case 'map':
            showMessage('قسم الخريطة قريباً!', 'info');
            break;
        case 'market':
            showMessage('قسم السوق قريباً!', 'info');
            break;
        case 'research':
            showMessage('قسم البحث قريباً!', 'info');
            break;
        case 'vip':
            document.getElementById('vip-modal').style.display = 'flex';
            break;
    }
}

// ==========================================
// بدء اللعبة عند تحميل الصفحة
// ==========================================
document.addEventListener('DOMContentLoaded', initializeGame);

// إضافة أنماط CSS إضافية للألعاب
const additionalStyles = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    .building-info {
        line-height: 1.6;
    }
    
    .building-level {
        font-size: 18px;
        font-weight: bold;
        color: var(--accent-500);
        margin-bottom: var(--spacing-md);
    }
    
    .building-description {
        color: var(--text-secondary);
        margin-bottom: var(--spacing-lg);
    }
    
    .construction-info {
        background-color: var(--bg-page);
        padding: var(--spacing-md);
        border: 2px solid var(--border-color);
        margin-bottom: var(--spacing-lg);
    }
    
    .construction-info h3 {
        font-family: var(--font-title);
        color: var(--accent-500);
        margin-bottom: var(--spacing-md);
    }
    
    .progress-bar {
        width: 100%;
        height: 16px;
        background-color: var(--bg-page);
        border: 1px solid var(--border-color);
        margin-bottom: var(--spacing-sm);
    }
    
    .progress-fill {
        height: 100%;
        background-color: var(--success);
        transition: width 0.3s ease;
    }
    
    .time-remaining {
        font-size: 14px;
        color: var(--text-primary);
    }
    
    .building-stats h3 {
        font-family: var(--font-title);
        color: var(--accent-500);
        margin-bottom: var(--spacing-md);
    }
    
    .building-stats p {
        margin-bottom: var(--spacing-sm);
        color: var(--text-secondary);
    }
    
    .building-actions {
        display: flex;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
    }
    
    .cost-info, .production-info {
        background-color: var(--bg-page);
        padding: var(--spacing-md);
        border: 1px solid var(--border-color);
        margin: var(--spacing-md) 0;
    }
    
    .cost-info h4, .production-info h4 {
        color: var(--accent-500);
        margin-bottom: var(--spacing-sm);
    }
    
    .message {
        font-family: var(--font-title);
        border: 2px solid var(--border-color);
        animation: slideDown 0.3s ease;
    }
`;

// إضافة الأنماط الإضافية
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);