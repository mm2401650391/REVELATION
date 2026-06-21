// ═══════════════════════════════════════════════════════════════
//  战斗属性系统 (combat_system.js) - 修复版
// ═══════════════════════════════════════════════════════════════

// 防御性检查：确保全局变量存在
if (typeof gameData === 'undefined') {
    window.gameData = null;
}
if (typeof WARFRAMES === 'undefined') {
    window.WARFRAMES = {};
}
if (typeof ENEMY_TEMPLATES === 'undefined' && typeof ENEMIES !== 'undefined') {
    window.ENEMY_TEMPLATES = ENEMIES;
}

// ========== 全局配置 ==========
var COMBAT_CONFIG = {
    DAMAGE: {
        defenseFactor: 0.35,
        minDamagePercent: 0.20,
        critMultiplier: 1.8,
        varianceRange: 0.30
    },
    CRIT: {
        baseChance: 0.08,
        levelDiffBonus: 0.015,
        maxChance: 0.35,
        minChance: 0.02
    },
    DODGE: {
        baseChance: 0.03,
        speedDiffFactor: 0.003,
        maxChance: 0.20,
        minChance: 0.01
    },
    TICK_INTERVAL: {
        normal: 200,//调整200
        elite: 400,//400
        boss: 500,//500
        mechanic: 900,//900
        super: 1500
    },
    ACTION_BAR: {
        threshold: 100,
        overflow: true
    }
};


// ═══ 敌人连续出现限制 ═══
var ENEMY_SPAWN_TRACKER = {
    lastName: null,
    streakCount: 0,
    maxStreak: 2
};

// ═══════════════════════════════════════════════════════════════
//  变体前缀轮换系统 (Variant Prefix Rotation System) - 概率分层版
// ═══════════════════════════════════════════════════════════════

// 常规前缀池（10个，按小时轮换）
var ROTATION_PREFIXES = [
	{ key: 'kuva',       name: '赤毒',    theme: '血月虹吸',   color: '#8B0000',  buff: '赤毒狂暴者涌入战场' },
    { key: 'tusk',       name: '巨牙',    theme: '铁幕伏兵',   color: '#C0C0C0',  buff: '巨牙重装兵全线推进' },
    { key: 'desert',     name: '沙漠',    theme: '烬风劫掠',   color: '#D4A574',  buff: '沙漠劫掠者焚风掠袭' },
    { key: 'frontier',   name: '前线',    theme: '裂空先锋',   color: '#4eff4e',  buff: '前线舰群裂空压境' },
    { key: 'galleon',    name: '龙舰',    theme: '渊海围猎',   color: '#4488ff',  buff: '龙舰猎手深潜围猎' },
    { key: 'nightwatch', name: '夜巡',    theme: '幽影猎杀',   color: '#00d4ff',  buff: '夜巡刺客无息渗透' },
    { key: 'deep_space', name: '深空',    theme: '寂灭深空',   color: '#6600ff',  buff: '深空异种跃迁降临' },
    { key: 'whirlwind',  name: '回旋',    theme: '碎星风暴',   color: '#ffaa00',  buff: '旋风撕裂者风暴汇聚' },
    { key: 'voidrealm',  name: '邃域',    theme: '虚界侵蚀',   color: '#ff66ff',  buff: '邃域虚灵跨界入侵' },
    { key: 'narmer',     name: '合一众',  theme: '终焉同化',   color: '#ff4444',  buff: '合一众信徒蜂拥而至' }
];

// 稀有前缀池（3个，始终低概率出现，不受轮换限制）
var RARE_PREFIXES = [
    { key: 'elite',     name: '精英',   theme: '强化型',    color: '#ffd700', chance: 0.03 },
    { key: 'demolition',name: '爆破型', theme: '自爆型',    color: '#ff6600', chance: 0.02 },
    { key: 'corrupted', name: '堕落',   theme: '虚空腐化',  color: '#ff00ff', chance: 0.015 }
];

// 概率分层配置
var PREFIX_PROBABILITY = {
    normal:     0.50,   // 普通敌人（无前缀）：60%
    rotation:   0.35,   // 轮换前缀敌人：30%
    rare:       0.15    // 稀有前缀敌人池：10%（内部分配给3个稀有前缀）
};

// 前缀属性修正系数
var PREFIX_MODS = {
    // 常规前缀
    'kuva':       { hpMod: 1.3,  atkMod: 1.2,  defMod: 1.0,  spdMod: 0.9,  dropBonus: 1.2 },
    'tusk':       { hpMod: 1.1,  atkMod: 1.0,  defMod: 1.3,  spdMod: 0.8,  dropBonus: 1.1 },
    'desert':     { hpMod: 0.9,  atkMod: 1.1,  defMod: 0.8,  spdMod: 1.3,  dropBonus: 1.0 },
    'frontier':   { hpMod: 1.0,  atkMod: 1.3,  defMod: 0.9,  spdMod: 1.1,  dropBonus: 1.1 },
    'galleon':    { hpMod: 1.4,  atkMod: 1.1,  defMod: 1.2,  spdMod: 0.7,  dropBonus: 1.3 },
    'nightwatch': { hpMod: 0.8,  atkMod: 1.2,  defMod: 0.9,  spdMod: 1.2,  dropBonus: 1.0 },
    'deep_space': { hpMod: 1.2,  atkMod: 1.0,  defMod: 1.1,  spdMod: 1.0,  dropBonus: 1.2 },
    'whirlwind':  { hpMod: 0.9,  atkMod: 1.4,  defMod: 0.7,  spdMod: 1.4,  dropBonus: 1.1 },
    'voidrealm':  { hpMod: 1.5,  atkMod: 1.3,  defMod: 1.3,  spdMod: 0.6,  dropBonus: 1.5 },
    'narmer':     { hpMod: 1.1,  atkMod: 1.1,  defMod: 1.1,  spdMod: 1.1,  dropBonus: 1.2 },
    // 稀有前缀
    'elite':      { hpMod: 2.0,  atkMod: 1.5,  defMod: 1.5,  spdMod: 1.2,  dropBonus: 2.0, xpBonus: 2.0 },
    'demolition': { hpMod: 0.7,  atkMod: 2.0,  defMod: 0.5,  spdMod: 1.5,  dropBonus: 1.5, selfDestruct: true },
    'corrupted':  { hpMod: 1.8,  atkMod: 1.8,  defMod: 1.0,  spdMod: 0.8,  dropBonus: 2.5, xpBonus: 3.0 }
};

// 获取当前小时对应的轮换前缀
function getCurrentRotationPrefix() {
    var hour = new Date().getHours();
    var index = hour % ROTATION_PREFIXES.length;
    return ROTATION_PREFIXES[index];
}

// 从稀有前缀池中按各自概率抽取
function rollRarePrefix() {
    var rand = Math.random();
    var cumulative = 0;
    
    for (var i = 0; i < RARE_PREFIXES.length; i++) {
        cumulative += RARE_PREFIXES[i].chance;
        if (rand < cumulative) {
            return RARE_PREFIXES[i];
        }
    }
    return null;
}

// 主概率判定：普通 / 轮换 / 稀有
function rollEnemyPrefix() {
    var rand = Math.random();
    var cfg = PREFIX_PROBABILITY;
    
    // 第一层：60% 普通敌人（无前缀）
    if (rand < cfg.normal) {
        return null;
    }
    
    // 第二层：30% 轮换前缀敌人
    rand -= cfg.normal;
    if (rand < cfg.rotation) {
        return getCurrentRotationPrefix();
    }
    
    // 第三层：10% 稀有前缀池
    return rollRarePrefix();
}

// 应用前缀修正到敌人属性
function applyPrefixModifiers(enemy, prefix) {
    if (!prefix || !PREFIX_MODS[prefix.key]) return enemy;
    
    var mod = PREFIX_MODS[prefix.key];
    var result = Object.assign({}, enemy);
    
    if (mod.hpMod)  result.maxHp = Math.floor(result.maxHp * mod.hpMod);
    if (mod.atkMod) result.attack = Math.floor(result.attack * mod.atkMod);
    if (mod.defMod) result.defense = Math.floor(result.defense * mod.defMod);
    if (mod.spdMod) result.speed = Math.floor(result.speed * mod.spdMod);
    
    result.hp = result.maxHp;
    
    result.prefix = prefix;
    result.prefixName = prefix.name;
    result.prefixKey = prefix.key;
    result.prefixColor = prefix.color;
    result.prefixTheme = prefix.theme;
    
    if (mod.dropBonus) {
        result.dropRate = Math.min(1.0, (result.dropRate || 0.35) * mod.dropBonus);
    }
    if (mod.xpBonus) {
        result.xpBonus = mod.xpBonus;
    }
    if (mod.selfDestruct) {
        result.selfDestruct = true;
    }
    
    result.displayName = prefix.name + result.name;
    result.fullName = '[' + prefix.name + ']' + result.name + ' (' + prefix.theme + ')';
    
    return result;
}

// 获取当前前缀状态描述（用于UI显示）
function getPrefixRotationStatus() {
    var current = getCurrentRotationPrefix();
    var nextIndex = (new Date().getHours() + 1) % ROTATION_PREFIXES.length;
    var next = ROTATION_PREFIXES[nextIndex];
    var remainMin = 60 - new Date().getMinutes();
    
    return {
        current: current,
        next: next,
        remainMinutes: remainMin,
        probabilities: {
            normal: (PREFIX_PROBABILITY.normal * 100).toFixed(0) + '%',
            rotation: (PREFIX_PROBABILITY.rotation * 100).toFixed(0) + '%',
            rare: (PREFIX_PROBABILITY.rare * 100).toFixed(0) + '%'
        },
        rareChances: RARE_PREFIXES.map(function(p) {
            return { name: p.name, chance: (p.chance * 100).toFixed(1) + '%' };
        })
    };
}

// 从稀有前缀池中按各自概率抽取（竞争池模式）
function rollRarePrefix() {
    // 10%的稀有池内部分配：精英3%、爆破2%、堕落1.5%，剩余3.5%为空（即不触发任何稀有）
    var rand = Math.random();
    var cumulative = 0;
    
    for (var i = 0; i < RARE_PREFIXES.length; i++) {
        cumulative += RARE_PREFIXES[i].chance;
        if (rand < cumulative) {
            return RARE_PREFIXES[i];
        }
    }
    return null; // 没有触发稀有前缀
}

// 主概率判定：普通 / 轮换 / 稀有
function rollEnemyPrefix() {
    var rand = Math.random();
    var cfg = PREFIX_PROBABILITY;
    
    // 第一层：60% 普通敌人（无前缀）
    if (rand < cfg.normal) {
        return null; // 无前缀
    }
    
    // 第二层：30% 轮换前缀敌人
    rand -= cfg.normal;
    if (rand < cfg.rotation) {
        return getCurrentRotationPrefix();
    }
    
    // 第三层：10% 稀有前缀池（内部再按各自概率竞争）
    return rollRarePrefix();
}

// 应用前缀修正到敌人属性
function applyPrefixModifiers(enemy, prefix) {
    if (!prefix || !PREFIX_MODS[prefix.key]) return enemy;
    
    var mod = PREFIX_MODS[prefix.key];
    var result = Object.assign({}, enemy);
    
    if (mod.hpMod)  result.maxHp = Math.floor(result.maxHp * mod.hpMod);
    if (mod.atkMod) result.attack = Math.floor(result.attack * mod.atkMod);
    if (mod.defMod) result.defense = Math.floor(result.defense * mod.defMod);
    if (mod.spdMod) result.speed = Math.floor(result.speed * mod.spdMod);
    
    result.hp = result.maxHp;
    
    result.prefix = prefix;
    result.prefixName = prefix.name;
    result.prefixKey = prefix.key;
    result.prefixColor = prefix.color;
    result.prefixTheme = prefix.theme;
    
    if (mod.dropBonus) {
        result.dropRate = Math.min(1.0, (result.dropRate || 0.35) * mod.dropBonus);
    }
    if (mod.xpBonus) {
        result.xpBonus = mod.xpBonus;
    }
    if (mod.selfDestruct) {
        result.selfDestruct = true;
    }
    
    result.displayName = prefix.name + result.name;
    result.fullName = '[' + prefix.name + ']' + result.name + ' (' + prefix.theme + ')';
    
    return result;
}

// 获取当前前缀状态描述（用于UI显示）
function getPrefixRotationStatus() {
    var current = getCurrentRotationPrefix();
    var nextIndex = (new Date().getHours() + 1) % ROTATION_PREFIXES.length;
    var next = ROTATION_PREFIXES[nextIndex];
    var remainMin = 60 - new Date().getMinutes();
    
    return {
        current: current,
        next: next,
        remainMinutes: remainMin,
        probabilities: {
            normal: (PREFIX_PROBABILITY.normal * 100).toFixed(0) + '%',
            rotation: (PREFIX_PROBABILITY.rotation * 100).toFixed(0) + '%',
            rare: (PREFIX_PROBABILITY.rare * 100).toFixed(0) + '%'
        },
        rareChances: RARE_PREFIXES.map(function(p) {
            return { name: p.name, chance: (p.chance * 100).toFixed(1) + '%' };
        })
    };
}

// 应用前缀修正到敌人属性
function applyPrefixModifiers(enemy, prefix) {
    if (!prefix || !PREFIX_MODS[prefix.key]) return enemy;
    
    var mod = PREFIX_MODS[prefix.key];
    var result = Object.assign({}, enemy);
    
    // 应用属性修正
    if (mod.hpMod)  result.maxHp = Math.floor(result.maxHp * mod.hpMod);
    if (mod.atkMod) result.attack = Math.floor(result.attack * mod.atkMod);
    if (mod.defMod) result.defense = Math.floor(result.defense * mod.defMod);
    if (mod.spdMod) result.speed = Math.floor(result.speed * mod.spdMod);
    
    // 同步当前HP
    result.hp = result.maxHp;
    
    // 标记前缀信息
    result.prefix = prefix;
    result.prefixName = prefix.name;
    result.prefixKey = prefix.key;
    result.prefixColor = prefix.color;
    result.prefixTheme = prefix.theme;
    
    // 掉落加成
    if (mod.dropBonus) {
        result.dropRate = Math.min(1.0, (result.dropRate || 0.35) * mod.dropBonus);
    }
    
    // 经验加成
    if (mod.xpBonus) {
        result.xpBonus = mod.xpBonus;
    }
    
    // 特殊标记
    if (mod.selfDestruct) {
        result.selfDestruct = true;
    }
    
    // 重命名显示
    result.displayName = prefix.name + result.name;
    result.fullName = '[' + prefix.name + ']' + result.name + ' (' + prefix.theme + ')';
    
    return result;
}

// 获取当前前缀状态描述（用于UI显示）
function getPrefixRotationStatus() {
    var current = getCurrentRotationPrefix();
    var nextIndex = (new Date().getHours() + 1) % ROTATION_PREFIXES.length;
    var next = ROTATION_PREFIXES[nextIndex];
    var remainMin = 60 - new Date().getMinutes();
    
    return {
        current: current,
        next: next,
        remainMinutes: remainMin,
        rareChances: RARE_PREFIXES.map(function(p) {
            return { name: p.name, chance: (p.chance * 100).toFixed(1) + '%' };
        })
    };
}




// ========== 默认玩家属性（备用）==========
function getDefaultPlayerStats(level) {
    var L = Math.min(50, Math.max(1, level || 1));
    return {
        maxHp: 80 + (L - 1) * 5,
        maxShield: 60 + (L - 1) * 4,
        attack: 20 + (L - 1) * 3,
        defense: 10 + (L - 1) * 1,
        speed: 10 + Math.floor((L - 1) * 0.2),
        level: L,
        name: 'Tenno'
    };
}

// ========== 玩家属性公式 ==========
function getPlayerBaseStats(level) {
    // 多重防御检查
    if (typeof gameData === 'undefined' || !gameData) {
        console.warn('getPlayerBaseStats: gameData 未就绪');
        return getDefaultPlayerStats(level);
    }
    if (typeof WARFRAMES === 'undefined') {
        console.warn('getPlayerBaseStats: WARFRAMES 未就绪');
        return getDefaultPlayerStats(level);
    }
    
    var wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
    if (!wf) {
        return getDefaultPlayerStats(level);
    }
    
    // ⚠️ 关键修复：使用 var 而不是 let/const，避免重复声明
var wfBase = wf.stats || { health: 100, shield: 100, energy: 100, armor: 100, speed: 10 };
    var L = Math.min(50, Math.max(1, level || 1));
    
    return {
        maxHp: Math.floor(80 + (L - 1) * 5),           // 降低HP
        maxShield: Math.floor(60 + (L - 1) * 4),       // 降低护盾
        attack: Math.floor(20 + (L - 1) * 3),          // 提高攻击
        defense: Math.floor(10 + (L - 1) * 1),        // 大幅降低防御
        speed: Math.floor(10 + (L - 1) * 0.2),        // 降低速度成长
        level: L,
        name: wf.name || 'Tenno'
    };
}

// ========== 敌人属性公式 ==========
function getEnemyBaseStats(level, type, faction) {
    // 获取同等级玩家属性作为基准
    var p = getPlayerBaseStats(level);
    
    var TYPE_MODS = {
        normal:   { hpMod: 0.90, atkMod: 0.85, defMod: 0.60, spdMod: 0.90, critResist: 0.00 },
        elite:    { hpMod: 1.10, atkMod: 1.00, defMod: 0.80, spdMod: 1.00, critResist: 0.05 },
        boss:     { hpMod: 1.30, atkMod: 0.95, defMod: 0.90, spdMod: 0.75, critResist: 0.15 },
        mechanic: { hpMod: 1.20, atkMod: 1.00, defMod: 1.00, spdMod: 0.75, critResist: 0.10 },
        super:    { hpMod: 1.60, atkMod: 0.90, defMod: 0.90, spdMod: 0.65, critResist: 0.20 }
    };
    
    var FACTION_MODS = {
        grineer:  { hpMod: 1.05, atkMod: 1.00, defMod: 0.95 },
        corpus:   { hpMod: 0.90, atkMod: 1.05, defMod: 1.15 },
        infested: { hpMod: 0.95, atkMod: 0.95, defMod: 0.85 },
        sentient: { hpMod: 1.10, atkMod: 1.00, defMod: 0.90 },
        orokin:   { hpMod: 0.95, atkMod: 1.10, defMod: 0.95 },
        whisper:  { hpMod: 1.15, atkMod: 0.90, defMod: 0.90 }
    };
    
    var tMod = TYPE_MODS[type] || TYPE_MODS.normal;
    var fMod = FACTION_MODS[faction] || FACTION_MODS.grineer;
    var L = Math.max(1, level);
    
    return {
        maxHp: Math.floor(p.maxHp * tMod.hpMod * fMod.hpMod),
        attack: Math.floor(p.attack * tMod.atkMod * fMod.atkMod),
        defense: Math.floor(p.defense * tMod.defMod * fMod.defMod),
        speed: Math.floor(p.speed * tMod.spdMod),
        critResist: tMod.critResist,
        type: type,
        level: L
    };
}

// ========== 伤害计算核心 ==========
function calculateDamage(attacker, defender, isPlayerAttacking) {
    var cfg = COMBAT_CONFIG;
    
    // 1. 闪避判定
    var speedDiff = defender.speed - attacker.speed;
    var dodgeChance = cfg.DODGE.baseChance + Math.max(0, speedDiff * cfg.DODGE.speedDiffFactor);
    dodgeChance = Math.max(cfg.DODGE.minChance, Math.min(cfg.DODGE.maxChance, dodgeChance));
    
    if (Math.random() < dodgeChance) {
        return { damage: 0, isDodge: true, isCrit: false, isMiss: false };
    }
    
    // 2. 基础伤害
    var rawDmg = Math.max(
        Math.floor(attacker.attack * cfg.DAMAGE.minDamagePercent),
        attacker.attack - Math.floor(defender.defense * cfg.DAMAGE.defenseFactor)
    );
    
    // 3. 暴击判定
    var levelDiff = attacker.level - defender.level;
    var critChance = cfg.CRIT.baseChance + Math.max(0, levelDiff * cfg.CRIT.levelDiffBonus);
    
    if (defender.critResist) {
        critChance -= defender.critResist;
    }
    critChance = Math.max(cfg.CRIT.minChance, Math.min(cfg.CRIT.maxChance, critChance));
    
    var isCrit = Math.random() < critChance;
    var finalDmg = isCrit ? Math.floor(rawDmg * cfg.DAMAGE.critMultiplier) : rawDmg;
    
    // 4. 伤害浮动
    var variance = 1 - cfg.DAMAGE.varianceRange/2 + Math.random() * cfg.DAMAGE.varianceRange;
    finalDmg = Math.max(1, Math.floor(finalDmg * variance));
    
    return {
        damage: finalDmg,
        isDodge: false,
        isCrit: isCrit,
        isMiss: false
    };
}

// ========== 敌人实例化 ==========
function spawnEnemy(templateId, playerLevel) {
    var template = null;
    
    if (typeof ENEMY_TEMPLATES !== 'undefined') {
        for (var i = 0; i < ENEMY_TEMPLATES.length; i++) {
            if (ENEMY_TEMPLATES[i].id === templateId) {
                template = ENEMY_TEMPLATES[i];
                break;
            }
        }
    }
    
    if (!template && typeof ENEMIES !== 'undefined') {
        for (var i = 0; i < ENEMIES.length; i++) {
            if (ENEMIES[i].id === templateId) {
                template = ENEMIES[i];
                break;
            }
        }
    }
    
    if (!template) {
        console.error('未找到敌人模板:', templateId);
        return null;
    }
    
    // 等级浮动 (-2 ~ +3)
    var levelVariance = Math.floor(Math.random() * 6) - 2;
    var enemyLevel = Math.max(1, (template.baseLevel || template.level || 1) + levelVariance);
    
    // 如果玩家等级远高于敌人基础等级，按玩家等级生成
    if (playerLevel > enemyLevel + 5) {
        enemyLevel = Math.max(1, playerLevel + Math.floor(Math.random() * 5) - 2);
    }
    
    var type = template.type || 'normal';
    var faction = template.faction || 'grineer';
    var stats = getEnemyBaseStats(enemyLevel, type, faction);

    // 创建 enemy 对象（模板名字已包含前缀信息）
    var enemy = {
        id: template.id,
        name: template.name,
        icon: template.icon,
        image: template.image,
        faction: faction,
        type: type,
        level: enemyLevel,
        hp: stats.maxHp,
        maxHp: stats.maxHp,
        attack: stats.attack,
        defense: stats.defense,
        speed: stats.speed,
        critResist: stats.critResist,
        dropRate: template.dropRate || 0.35,
        codexId: template.codexId,
        cardDrop: template.cardDrop || { chance: 0.05 }
    };

    // 检测并标记前缀信息（用于UI显示）
    for (var i = 0; i < ROTATION_PREFIXES.length; i++) {
        if (enemy.name.indexOf(ROTATION_PREFIXES[i].name) !== -1) {
            enemy.prefix = ROTATION_PREFIXES[i];
            enemy.prefixName = ROTATION_PREFIXES[i].name;
            enemy.prefixTheme = ROTATION_PREFIXES[i].theme;
            enemy.prefixColor = ROTATION_PREFIXES[i].color;
            break;
        }
    }
    if (!enemy.prefix) {
        for (var i = 0; i < RARE_PREFIXES.length; i++) {
            if (enemy.name.indexOf(RARE_PREFIXES[i].name) !== -1) {
                enemy.prefix = RARE_PREFIXES[i];
                enemy.prefixName = RARE_PREFIXES[i].name;
                enemy.prefixTheme = RARE_PREFIXES[i].theme;
                enemy.prefixColor = RARE_PREFIXES[i].color;
                break;
            }
        }
    }

    return enemy;
}


// ═══ 带连续锁的模板选择 ═══
function pickTemplateWithStreakLock(pool) {
    if (!pool || pool.length === 0) return null;
    
    if (pool.length === 1) {
        var t = pool[0];
        ENEMY_SPAWN_TRACKER.lastName = t.name;
        ENEMY_SPAWN_TRACKER.streakCount = 1;
        return t;
    }
    
    var filtered = pool;
    if (ENEMY_SPAWN_TRACKER.streakCount >= ENEMY_SPAWN_TRACKER.maxStreak && ENEMY_SPAWN_TRACKER.lastName) {
        filtered = pool.filter(function(t) {
            return t.name !== ENEMY_SPAWN_TRACKER.lastName;
        });
    }
    
    if (filtered.length === 0) {
        filtered = pool;
        ENEMY_SPAWN_TRACKER.streakCount = 0;
    }
    
    var template = filtered[Math.floor(Math.random() * filtered.length)];
    
    if (template.name === ENEMY_SPAWN_TRACKER.lastName) {
        ENEMY_SPAWN_TRACKER.streakCount++;
    } else {
        ENEMY_SPAWN_TRACKER.lastName = template.name;
        ENEMY_SPAWN_TRACKER.streakCount = 1;
    }
    
    return template;
}
    
function getRandomEnemyByZone(zone, playerLevel) {
    var faction = zone.faction || 'grineer';
    var minLevel = zone.minLevel || 1;
    var maxLevel = zone.maxLevel || playerLevel + 3;
    var typeWeights = zone.typeWeights || { normal: 0.6, elite: 0.3, boss: 0.1 };
    
    // ═══ 区域敌人白名单（完整名字，精确匹配）═══
    var ZONE_ENEMY_WHITELIST = {
        'e_zone1': [
            '屠夫', '沙漠屠夫', '前线屠夫', '龙舰屠夫', '赤毒屠夫', '巨牙屠夫',
            '深空屠夫', '回旋屠夫', '邃域屠夫', '烈焰刀客', '巨牙烈焰刀客', '赤毒烈焰刀客',
            '夜巡者烈焰刀客', '合一众烈焰刀客', '禁卫军', '重击手', '赤毒猛力爪兵', '夜巡者猛力爪兵',
            '巨牙掠食者', '合一众重击手', '天蝎', '龙舰天蝎', '赤毒天蝎', '合一众天蝎',
            '盾枪兵', '巨牙盾枪兵', '赤毒盾枪兵', '精英盾枪兵', '合一众盾枪兵',
        ],
        'e_zone2': [
            '弩炮', '龙舰弩炮', '赤毒弩炮', '巨牙弩炮', '合一众弩炮', '爪喀',
            '堕落爪喀', '开膛者', '沙漠开膛者', '前线开膛者', '龙舰开膛者', '赤毒开膛者',
            '巨牙开膛者', '深空开膛者', '回旋开膛者', '邃域开膛者', '恶徒', '沙漠恶徒',
            '前线恶徒', '龙舰恶徒', '赤毒恶徒', '巨牙恶徒', '合一众恶徒', '鬣猫',
            '赤毒鬣猫', '枪兵', '沙漠枪兵', '前线枪兵', '龙舰枪兵', '赤毒枪兵',
            '巨牙枪兵', '夜巡者枪兵', '合一众枪兵', '枪兵幸存者', '怒焚者', '赤毒怒焚者',
            '合一众怒焚者', '追踪者', '沙漠追踪者', '前线追踪者', '龙舰追踪者', '赤毒者追踪兵',
            '巨牙追踪者', '夜巡者追踪兵', '骑兵', '沙漠骑兵', '前线骑兵', '龙舰骑兵',
            '赤毒骑兵', '巨牙骑兵', '合一众骑兵', '骑兵幸存者',
        ],
        'e_zone3': [
            '执法员', '巨牙掠夺者', '夜巡执法员', '夜巡掠夺者', '爆破型执法员', '轰击者',
            '赤毒轰击者', '巨牙轰击者', '巨牙迫击炮轰击者', '夜巡者机枪手', '合一众轰击者', '指挥官',
            '爪喀驯兽师', '赤毒爪喀驯兽师', '堕落爪喀驯兽师', '重型机枪手', '沙漠重型机枪手', '前线重型机枪手',
            '龙舰重型机枪手', '赤毒重型机枪手', '巨牙重型机枪手', '爆破型重型机枪手', '合一众重型机枪手', '鬣猫驯兽师',
            '赤毒鬣猫驯兽师', '夜巡者鬣猫驯兽师', '狂躁者', '龙舰狂躁者', '夜巡狂躁者', '火焰轰击者',
            '赤毒火焰轰击者', '巨牙火焰轰击者', '合一众火焰轰击者', '毒化者', '爆破型毒化者',
        ],
    };
    var whitelist = ZONE_ENEMY_WHITELIST[zone.id];
    
    var prefixRoll = rollEnemyPrefix();
    var activePrefix = prefixRoll;
    
    var pool = (typeof ENEMY_TEMPLATES !== 'undefined') ? ENEMY_TEMPLATES : 
               (typeof ENEMIES !== 'undefined') ? ENEMIES : [];
    
    // ========== 第一步：如果roll到前缀，尝试匹配带前缀的敌人 ==========
    if (activePrefix) {
        var prefixMatches = [];
        for (var i = 0; i < pool.length; i++) {
            var t = pool[i];
            var tLevel = t.baseLevel || t.level || 1;
            
                        // 等级检查：考虑浮动范围 (-2 ~ +3)
                        var minPossibleLevel = Math.max(1, tLevel - 2);
                        var maxPossibleLevel = tLevel + 3;
                        if (t.faction !== faction || maxPossibleLevel < minLevel || minPossibleLevel > maxLevel) {
                            continue;
                        }
            
            if (whitelist) {
                if (whitelist.indexOf(t.name) === -1) continue;
            }
            
            if (t.name.indexOf(activePrefix.name) !== -1) {
                prefixMatches.push(t);
            }
        }
        
        if (prefixMatches.length > 0) {
            var available = prefixMatches;
            
            var rand = Math.random();
            var targetType = 'normal';
            var cumulative = 0;
            
            for (var t in typeWeights) {
                cumulative += typeWeights[t];
                if (rand <= cumulative) {
                    targetType = t;
                    break;
                }
            }
            
            var typeMatches = available.filter(function(t) { 
                return (t.type || 'normal') === targetType; 
            });
            var finalPool = typeMatches.length > 0 ? typeMatches : available;
            
            // 【修改】使用连续锁选择
            var template = pickTemplateWithStreakLock(finalPool);
            if (template) {
                return spawnEnemy(template.id, playerLevel);
            }
            // 锁住了，回退到普通敌人
        }
    }
    
    // ========== 第二步：普通敌人 ==========
    var normalEnemies = [];
    for (var i = 0; i < pool.length; i++) {
        var t = pool[i];
        var tLevel = t.baseLevel || t.level || 1;
        
                    // 基础条件：派系和等级匹配（考虑等级浮动范围 -2~+3）
                    var minPossibleLevel = Math.max(1, tLevel - 2);
                    var maxPossibleLevel = tLevel + 3;
                    if (t.faction !== faction || maxPossibleLevel < minLevel || minPossibleLevel > maxLevel) {
                        continue;
                    }
        
        if (whitelist) {
            if (whitelist.indexOf(t.name) === -1) continue;
        }
        
        var hasAnyPrefix = false;
        
        for (var j = 0; j < ROTATION_PREFIXES.length; j++) {
            if (t.name.indexOf(ROTATION_PREFIXES[j].name) !== -1) {
                hasAnyPrefix = true;
                break;
            }
        }
        
        if (!hasAnyPrefix) {
            for (var j = 0; j < RARE_PREFIXES.length; j++) {
                if (t.name.indexOf(RARE_PREFIXES[j].name) !== -1) {
                    hasAnyPrefix = true;
                    break;
                }
            }
        }
        
        if (!hasAnyPrefix) {
            normalEnemies.push(t);
        }
    }
    
    if (normalEnemies.length > 0) {
        var rand = Math.random();
        var targetType = 'normal';
        var cumulative = 0;
        
        for (var t in typeWeights) {
            cumulative += typeWeights[t];
            if (rand <= cumulative) {
                targetType = t;
                break;
            }
        }
        
        var typeMatches = normalEnemies.filter(function(t) { 
            return (t.type || 'normal') === targetType; 
        });
        var finalPool = typeMatches.length > 0 ? typeMatches : normalEnemies;
        
        // 【修改】使用连续锁选择
        var template = pickTemplateWithStreakLock(finalPool);
        if (template) {
            return spawnEnemy(template.id, playerLevel);
        }
    }
    
    // ========== 最后回退 ==========
    var defaultPool = [];
    if (typeof ENEMIES !== 'undefined') {
        for (var i = 0; i < ENEMIES.length; i++) {
            if (ENEMIES[i].id === 'g_001') {
                defaultPool.push(ENEMIES[i]);
                break;
            }
        }
    }
    var template = pickTemplateWithStreakLock(defaultPool.length > 0 ? defaultPool : [{id:'g_001', name:'屠夫'}]);
    return spawnEnemy(template ? template.id : 'g_001', playerLevel);
}
	

// ========== 战斗节奏控制 ==========
function getBattleTickInterval(enemyType) {
    return COMBAT_CONFIG.TICK_INTERVAL[enemyType] || COMBAT_CONFIG.TICK_INTERVAL.normal;
}

// ========== 战斗日志格式化 ==========
function formatBattleLog(result, attackerName, defenderName, isPlayer) {
    if (result.isDodge) {
        return {
            text: '💨 ' + defenderName + ' 闪避了 ' + attackerName + ' 的攻击！',
            type: isPlayer ? 'enemy' : 'player',
            color: '#00d4ff'
        };
    }
    
    if (result.isCrit) {
        return {
            text: '💥 ' + attackerName + ' 暴击！造成 ' + result.damage + ' 点伤害！',
            type: isPlayer ? 'player' : 'enemy',
            color: '#ffd700'
        };
    }
    
    return {
        text: (isPlayer ? '⚔️ ' : '🔴 ') + attackerName + ' 造成 ' + result.damage + ' 点伤害',
        type: isPlayer ? 'player' : 'enemy',
        color: isPlayer ? '#fff' : 'var(--grineer-red)'
    };
}

// ========== 导出到全局 ==========
window.COMBAT_CONFIG = COMBAT_CONFIG;
window.getPlayerBaseStats = getPlayerBaseStats;
window.getEnemyBaseStats = getEnemyBaseStats;
window.calculateDamage = calculateDamage;
window.spawnEnemy = spawnEnemy;
window.getRandomEnemyByZone = getRandomEnemyByZone;
window.getBattleTickInterval = getBattleTickInterval;
window.formatBattleLog = formatBattleLog;
