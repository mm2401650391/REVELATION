// ═══════════════════════════════════════════════════════════════
//  回响系统 - 碎片、盲盒、回响商店
// ═══════════════════════════════════════════════════════════════

// 确保 gameData 已初始化
if (typeof gameData === 'undefined' || !gameData) {
    gameData = {};
}
if (typeof window !== 'undefined') {
    window.gameData = gameData;
}

// ========== 回响碎片配置 ==========
var ECHO_FRAGMENTS = {
    1: { key: 'yiluo',   name: '遗落碎片',  color: '#888888', icon: '◆', glow: 'none' },
    2: { key: 'yibian',  name: '异变碎片',  color: '#4488ff', icon: '◆', glow: '0 0 8px rgba(68,136,255,0.4)' },
    3: { key: 'gushen',  name: '古神碎片',  color: '#aa44ff', icon: '◆', glow: '0 0 10px rgba(170,68,255,0.5)' },
    4: { key: 'hundun',  name: '混沌碎片',  color: '#ffaa00', icon: '◆', glow: '0 0 12px rgba(255,170,0,0.5)' },
    5: { key: 'zhongyan',name: '终焉碎片',  color: '#ff2222', icon: '◆', glow: '0 0 15px rgba(255,34,34,0.6)' }
};

// 碎片稀有度映射（用于掉落）
var FRAGMENT_RARITY_MAP = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

// ========== 回响盲盒配置 ==========
// 每个卡组对应一个盲盒，可用不同碎片购买不同版本
var ECHO_PACKS = [
    // Grineer 卡组
    { deckId: 'e_zone1', name: '☿️游掠凶形☿️', desc: '基础步兵与游掠单位', faction: 'grineer', icon: '☿️' },
    { deckId: 'e_zone2', name: '☿交锋异士☿', desc: '精英战斗单位', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone3', name: '☿暴戾战将☿', desc: '重型突击单位', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone4', name: '☿畸变造物☿', desc: '实验性生物武器', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone5', name: '☿长空掠影☿', desc: '空中作战单位', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone6', name: '☿澜下械躯☿', desc: '水下机械单位', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone7', name: '☿工坊役众☿', desc: '工程与维护单位', faction: 'grineer', icon: '☿' },
    { deckId: 'e_zone8', name: '☿统御凶僚☿', desc: '指挥与统治阶层', faction: 'grineer', icon: '☿' },
    // 渊岩 卡组
    { deckId: 'm_zone1', name: '☿️晨潮矿坑☿️', desc: '基础矿物与伴生矿', faction: 'mining', icon: '☿️' },
    { deckId: 'm_zone2', name: '☿️冷却液与矿尘☿️', desc: '工业废料与特殊矿尘', faction: 'mining', icon: '☿️' },
    { deckId: 'm_zone3', name: '☿️Infested摇篮☿️', desc: '感染区深处的异化矿物', faction: 'mining', icon: '☿️' },
    // 繁生 卡组
    { deckId: 'g_zone1', name: '☿地核裂谷☿', desc: '地核深处的奇异生态', faction: 'gathering', icon: '☿' },
    { deckId: 'g_zone2', name: '☿异星生态☿', desc: '异星环境的生态系统', faction: 'gathering', icon: '☿' }
];

// 盲盒购买选项配置
// 每个选项定义：使用的碎片类型 → 可开出的稀有度范围
// 规则：
//   遗落碎片 → 只出遗落(1)
//   异变碎片 → 遗落(1) + 异变(2)
//   古神碎片 → 异变(2) + 古神(3)
//   混沌碎片 → 若卡组有混沌(4)则古神(3)+混沌(4)，否则稳定出古神(3)
//   终焉碎片 → 若卡组有终焉(5)则混沌(4)+终焉(5)，否则稳定出混沌(4)
var PACK_BUY_OPTIONS = [
    { fragmentRarity: 1, name: '遗落之盒',  minRarity: 1, maxRarity: 1, cost: 10 },
    { fragmentRarity: 2, name: '异变之盒',  minRarity: 1, maxRarity: 2, cost: 7 },
    { fragmentRarity: 3, name: '古神之盒',  minRarity: 2, maxRarity: 3, cost: 5 },
    { fragmentRarity: 4, name: '混沌之盒',  minRarity: 3, maxRarity: 4, cost: 3, fallback: 3 }, // fallback: 若卡组无maxRarity则稳定出此稀有度
    { fragmentRarity: 5, name: '终焉之盒',  minRarity: 4, maxRarity: 5, cost: 1, fallback: 4 }
];

// ========== 工具函数 ==========

function getEchoFragments() {
    // 以 gameData（数据库）为主，localStorage 仅作为 gameData 尚未加载时的临时回退
    var fromDB = {};
    if (typeof gameData !== 'undefined' && gameData && gameData.echo_fragments) {
        try {
            fromDB = (typeof gameData.echo_fragments === 'string')
                ? JSON.parse(gameData.echo_fragments)
                : JSON.parse(JSON.stringify(gameData.echo_fragments));
        } catch(e) {}
    }
    // 仅在 gameData 完全未加载（undefined/null）时回退到 localStorage
    if (typeof gameData === 'undefined' || !gameData) {
        try {
            var userId = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.id : 'guest';
            var saved = localStorage.getItem('echo_fragments_' + userId);
            if (saved) {
                fromDB = JSON.parse(saved);
            }
        } catch(e) {}
    }
    return fromDB;
}

function setEchoFragments(fragments) {
    if (!gameData) return;
    gameData.echo_fragments = fragments;
    // 同步备份到 localStorage，防止异步保存未完成时刷新导致数据丢失
    try {
        var userId = (typeof currentUser !== 'undefined' && currentUser) ? currentUser.id : 'guest';
        localStorage.setItem('echo_fragments_' + userId, JSON.stringify(fragments));
    } catch(e) { console.error('echo_fragments local backup failed:', e); }
    // 尝试调用全局保存
    if (typeof saveGameData === 'function') {
        var p = saveGameData();
        if (p && typeof p.catch === 'function') p.catch(function(e) {});
    }
}

function gainEchoFragment(rarity, amount) {
    var fragments = getEchoFragments();
    var key = String(rarity);
    fragments[key] = (fragments[key] || 0) + (amount || 1);
    setEchoFragments(fragments);
    // 刷新UI
    if (typeof renderEchoShop === 'function') renderEchoShop();
    if (typeof updateEchoFragmentBar === 'function') updateEchoFragmentBar();
    // 浮动碎片提示
    var info = ECHO_FRAGMENTS[rarity];
    if (info) {
        var el = document.createElement('div');
        el.style.cssText = 'position:fixed;top:35%;left:50%;transform:translate(-50%,-50%);z-index:10001;pointer-events:none;animation:shardFloat 1.2s ease forwards;';
        el.innerHTML = '<div style="font-size:3rem;text-align:center;filter:drop-shadow(0 0 15px ' + info.color + '80);">' + info.icon + '</div><div style="color:' + info.color + ';font-family:Orbitron;font-size:1rem;text-align:center;margin-top:6px;text-shadow:0 0 8px ' + info.color + '40;">+' + info.name + ' x' + (amount || 1) + '</div>';
        document.body.appendChild(el);
        setTimeout(function() { if (el && el.parentNode) el.parentNode.removeChild(el); }, 1200);
    }
    return fragments[key];
}

function spendEchoFragment(rarity, amount) {
    var fragments = getEchoFragments();
    var key = String(rarity);
    if ((fragments[key] || 0) < amount) return false;
    fragments[key] -= amount;
    setEchoFragments(fragments);
    if (typeof renderEchoShop === 'function') renderEchoShop();
    if (typeof updateEchoFragmentBar === 'function') updateEchoFragmentBar();
    return true;
}

// 获取卡组中可用于盲盒的卡片（排除雅努斯之钥和Warframe大条目）
function getDeckCardsForPack(deckId) {
    var cards = DECK_CARDS[deckId];
    if (!cards) return [];
    return cards.filter(function(c) {
        return c && c.id && c.rarity;
    });
}

// 判断卡组是否包含某稀有度
function deckHasRarity(deckId, rarity) {
    var cards = getDeckCardsForPack(deckId);
    return cards.some(function(c) { return c.rarity === rarity; });
}

// 获取盲盒的最高稀有度（优先使用 pack.maxRarity，否则从卡片计算）
function getPackMaxRarity(pack) {
    if (pack && typeof pack.maxRarity === 'number') {
        return pack.maxRarity;
    }
    var cards = getDeckCardsForPack(pack ? pack.deckId : '');
    var deckMaxRarity = 1;
    cards.forEach(function(c) { if (c.rarity > deckMaxRarity) deckMaxRarity = c.rarity; });
    return deckMaxRarity;
}

// 获取盲盒可开出的稀有度范围（根据购买选项）
function getPackDropRarity(deckId, option) {
    var pack = ECHO_PACKS.find(function(p) { return p.deckId === deckId; });
    var deckMaxRarity = getPackMaxRarity(pack);
    var minR = option.minRarity;
    var maxR = Math.min(option.maxRarity, deckMaxRarity);
    // 若卡组最高稀有度低于选项最小稀有度，则只能出最高稀有度
    if (maxR < minR) {
        return { min: maxR, max: maxR };
    }
    return { min: minR, max: maxR };
}

// 抽取一张卡片（按稀有度权重）
function drawPackCard(deckId, option) {
    var range = getPackDropRarity(deckId, option);
    var cards = getDeckCardsForPack(deckId);
    if (!cards.length) return null;

    // 过滤到稀有度范围内的卡片
    var pool = cards.filter(function(c) {
        return c.rarity >= range.min && c.rarity <= range.max;
    });
    if (!pool.length) {
        // 回退：取范围内最近的一个稀有度
        pool = cards.filter(function(c) { return c.rarity === range.min; });
    }
    if (!pool.length) pool = cards;

    // 按稀有度权重抽取（稀有度越高权重越低）
    var totalWeight = 0;
    var weights = pool.map(function(c) {
        // 权重 = 1 / rarity（遗落权重高，混沌权重低）
        var w = 1 / (c.rarity || 1);
        totalWeight += w;
        return w;
    });
    var r = Math.random() * totalWeight;
    var cum = 0;
    for (var i = 0; i < pool.length; i++) {
        cum += weights[i];
        if (r <= cum) return pool[i];
    }
    return pool[pool.length - 1];
}

// ========== 盲盒购买 ==========
function buyEchoPack(packIndex, optionIndex) {
    var pack = ECHO_PACKS[packIndex];
    var option = PACK_BUY_OPTIONS[optionIndex];
    if (!pack || !option) return;

    // 检查卡组是否有对应稀有度
    var deckMaxRarity = getPackMaxRarity(pack);
    if (option.minRarity > deckMaxRarity) {
        showToast('该卡组没有此稀有度卡片，无法购买', 'error');
        return;
    }

    var fragments = getEchoFragments();
    var key = String(option.fragmentRarity);
    if ((fragments[key] || 0) < option.cost) {
        showToast('碎片不足！需要 ' + option.cost + ' ' + ECHO_FRAGMENTS[option.fragmentRarity].name, 'error');
        return;
    }

    // 扣除碎片
    if (!spendEchoFragment(option.fragmentRarity, option.cost)) return;

    // 生成盲盒物品存入仓库
    var packItem = {
        name: pack.name + '·' + option.name,
        icon: pack.icon,
        amount: 1,
        type: 'pack',
        image: null,
        // 自定义字段存储盲盒信息
        packData: {
            deckId: pack.deckId,
            option: option,
            packName: pack.name,
            optionName: option.name
        }
    };
    addToWarehouse(packItem.name, packItem.icon, 1, 'pack', null, packItem.packData);

    showToast('获得 ' + packItem.name, 'success');
    if (typeof renderWarehouse === 'function') renderWarehouse();
}

// 若仓库物品 packData 丢失，尝试从 name 重建（兼容刷新后数据）
function ensurePackData(item) {
    if (!item) return null;
    if (item.packData) return item.packData;
    // 匹配两种格式：name·option 或 name·option(兑换)
    var match = (item.name || '').match(/^(.+?)·(.+?)(?:\(兑换\))?$/);
    if (!match) return null;
    var packName = match[1];
    var optionName = match[2];
    var pack = ECHO_PACKS.find(function(p) { return p.name === packName; });
    var option = PACK_BUY_OPTIONS.find(function(o) { return o.name === optionName; });
    if (!pack || !option) return null;
    return {
        deckId: pack.deckId,
        option: option,
        packName: pack.name,
        optionName: option.name
    };
}

// ========== 开盲盒 ==========
function openEchoPack(warehouseItem) {
    var pd = ensurePackData(warehouseItem);
    if (!pd) {
        showToast('无法开启此物品', 'error');
        return;
    }
    // 写回物品，防止下次再重建
    if (warehouseItem) warehouseItem.packData = pd;
    var card = drawPackCard(pd.deckId, pd.option);
    if (!card) {
        showToast('盲盒开启失败', 'error');
        return;
    }

    // 扣除仓库中的盲盒（使用 window.warehouse 确保全局引用一致）
    warehouseItem.amount--;
    if (warehouseItem.amount <= 0) {
        var wIdx = (window.warehouse || warehouse).indexOf(warehouseItem);
        if (wIdx >= 0) (window.warehouse || warehouse).splice(wIdx, 1);
    }
    // 同步回 gameData
    if (typeof gameData !== 'undefined' && gameData) {
        gameData.warehouse = window.warehouse || warehouse;
    }
    // 立即刷新矩阵显示
    if (typeof renderWarehouse === 'function') renderWarehouse();
    if (typeof renderFoundry === 'function') renderFoundry();
    saveGameData();
    // 确保下一帧再次刷新（解决某些浏览器 DOM 延迟问题）
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function() {
            if (typeof renderWarehouse === 'function') renderWarehouse();
            if (typeof renderFoundry === 'function') renderFoundry();
        });
    }
    setTimeout(function() {
        if (typeof renderWarehouse === 'function') renderWarehouse();
        if (typeof renderFoundry === 'function') renderFoundry();
    }, 80);

    // 添加卡片（盲盒重复卡不给碎片）
    var result = addPlayerCard(card, true);

    // 播放开盒动画
    showPackOpeningAnimation(card, result.isNew);
}

// ========== 消耗品使用 ==========
function useConsumableItem(warehouseItem) {
    if (!warehouseItem || !warehouseItem.consumableData) {
        showToast('无法使用此物品', 'error');
        return;
    }
    var cd = warehouseItem.consumableData;
    var ABSOLUTE_MAX = 1000;
    var currentStamina = stamina || (gameData && gameData.stamina) || 0;

    // 1小时无限负荷卡
    if (cd.staminaAmount === 'unlimited_1h') {
        warehouseItem.amount--;
        if (warehouseItem.amount <= 0) {
            var idx = (window.warehouse || warehouse).indexOf(warehouseItem);
            if (idx >= 0) (window.warehouse || warehouse).splice(idx, 1);
        }
        if (typeof gameData !== 'undefined' && gameData) {
            gameData.warehouse = window.warehouse || warehouse;
        }
        if (typeof activateUnlimitedStamina === 'function') {
            activateUnlimitedStamina(3600000);
            showToast('使用 ' + warehouseItem.name + '！1小时无限负荷已激活', 'success');
        } else {
            showToast('激活函数未找到', 'error');
        }
        saveGameData();
        if (typeof renderWarehouse === 'function') renderWarehouse();
        if (typeof renderFoundry === 'function') renderFoundry();
        if (typeof updateUI === 'function') updateUI();
        if (typeof updateStaminaMatrix === 'function') updateStaminaMatrix();
        // 延迟二次刷新，确保 DOM 同步
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function() {
                if (typeof renderWarehouse === 'function') renderWarehouse();
                if (typeof renderFoundry === 'function') renderFoundry();
            });
        }
        setTimeout(function() {
            if (typeof renderWarehouse === 'function') renderWarehouse();
            if (typeof renderFoundry === 'function') renderFoundry();
        }, 80);
        return;
    }

    // 全满恢复剂（负荷全满+上限+50）
    if (cd.staminaAmount === 'full') {
        var oldMax2 = (gameData && gameData.stamina_max) || STAMINA_MAX || 100;
        if (oldMax2 >= ABSOLUTE_MAX) {
            showToast('负荷上限已达绝对上限 (' + ABSOLUTE_MAX + ')，无法继续提升', 'warning');
            return;
        }
        warehouseItem.amount--;
        if (warehouseItem.amount <= 0) {
            var idx = (window.warehouse || warehouse).indexOf(warehouseItem);
            if (idx >= 0) (window.warehouse || warehouse).splice(idx, 1);
        }
        if (typeof gameData !== 'undefined' && gameData) {
            gameData.warehouse = window.warehouse || warehouse;
        }
        var newMax = Math.min(ABSOLUTE_MAX, oldMax2 + 50);
        gameData.stamina = newMax;
        gameData.stamina_max = newMax;
        stamina = newMax;
        STAMINA_MAX = newMax;
        showToast('✅ 使用 ' + warehouseItem.name + '！负荷全满 ' + newMax + ' / ' + ABSOLUTE_MAX, 'success');
        if (typeof currentUser !== 'undefined' && currentUser) localStorage.setItem('stamina_' + currentUser.id, String(stamina));
        saveGameData();
        if (typeof renderWarehouse === 'function') renderWarehouse();
        if (typeof renderFoundry === 'function') renderFoundry();
        if (typeof updateUI === 'function') updateUI();
        if (typeof updateStaminaMatrix === 'function') updateStaminaMatrix();
        if (typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(function() {
                if (typeof renderWarehouse === 'function') renderWarehouse();
                if (typeof renderFoundry === 'function') renderFoundry();
            });
        }
        setTimeout(function() {
            if (typeof renderWarehouse === 'function') renderWarehouse();
            if (typeof renderFoundry === 'function') renderFoundry();
        }, 80);
        return;
    }

    // 普通恢复剂（50/100/200）
    var amount = parseInt(cd.staminaAmount) || 0;
    var canGain = Math.max(0, ABSOLUTE_MAX - currentStamina);

    if (amount <= 0) {
        showToast('恢复剂数据异常（恢复量=0），物品未消耗', 'error');
        return;
    }

    if (canGain <= 0) {
        showToast('负荷已达绝对上限 (' + currentStamina + '/' + ABSOLUTE_MAX + ')，无法继续恢复', 'warning');
        return;
    }

    if (amount > canGain) {
        // 恢复量超过剩余空间，弹窗确认
        var actualGain = canGain;
        if (!confirm('当前负荷 ' + currentStamina + '/' + ABSOLUTE_MAX + '，使用 ' + warehouseItem.name + '（' + amount + '点）只会恢复 ' + actualGain + ' 点（达到绝对上限）。确认使用？')) {
            return;
        }
        amount = actualGain;
    }

    // 扣除仓库
    warehouseItem.amount--;
    if (warehouseItem.amount <= 0) {
        var idx = (window.warehouse || warehouse).indexOf(warehouseItem);
        if (idx >= 0) (window.warehouse || warehouse).splice(idx, 1);
    }
    if (typeof gameData !== 'undefined' && gameData) {
        gameData.warehouse = window.warehouse || warehouse;
    }

    // 应用恢复：直接增加负荷（modifyStamina内部已处理gameData.stamina和save）
    var oldStamina = currentStamina;
    var actualGain = Math.min(ABSOLUTE_MAX - oldStamina, amount);
    if (typeof window.modifyStamina === 'function') {
        window.modifyStamina(actualGain, true);
    } else {
        stamina = Math.min(ABSOLUTE_MAX, oldStamina + actualGain);
        gameData.stamina = stamina;
    }
    if (typeof currentUser !== 'undefined' && currentUser) localStorage.setItem('stamina_' + currentUser.id, String(gameData.stamina || stamina));
    showToast('⚡ ' + warehouseItem.name + ' 已使用  +' + actualGain, 'success');
    saveGameData();
    if (typeof renderWarehouse === 'function') renderWarehouse();
    if (typeof renderFoundry === 'function') renderFoundry();
    if (typeof updateUI === 'function') updateUI();
    if (typeof updateStaminaMatrix === 'function') updateStaminaMatrix();
    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(function() {
            if (typeof renderWarehouse === 'function') renderWarehouse();
            if (typeof renderFoundry === 'function') renderFoundry();
        });
    }
    setTimeout(function() {
        if (typeof renderWarehouse === 'function') renderWarehouse();
        if (typeof renderFoundry === 'function') renderFoundry();
    }, 80);
}

// ========== 开盲盒动画 ==========
function showPackOpeningAnimation(card, isNew) {
    var rarityInfo = CARD_RARITY[card.rarity] || CARD_RARITY[1];
    var cardType = card.cardType || (typeof CARD_TYPE_MAP !== 'undefined' ? CARD_TYPE_MAP[card.rarity] : null) || 'normal';
    var typeInfo = (typeof CARD_STAR_STYLES !== 'undefined' && CARD_STAR_STYLES[cardType]) ? CARD_STAR_STYLES[cardType] : null;
    var starStyle = typeInfo ? (typeInfo.stars ? typeInfo.stars[card.starLevel || 0] || typeInfo.stars[0] : null) : null;

    // 创建弹窗
    var modal = document.createElement('div');
    modal.id = 'echoPackModal';
    modal.style.cssText = 'position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.92); backdrop-filter:blur(8px);';

    var glowColor = rarityInfo.color || '#fff';
    var typeColor = typeInfo ? typeInfo.color : glowColor;
    var typeColor2 = typeInfo ? typeInfo.color2 : glowColor;
    var isNewTag = isNew ? '<div style="position:absolute; top:-12px; right:-12px; background:linear-gradient(135deg,#ffd700,#ffaa00); color:#000; padding:5px 14px; border-radius:20px; font-size:0.8rem; font-weight:bold; box-shadow:0 0 20px rgba(255,215,0,0.6); animation:newTagPop 0.6s ease; z-index:10;">NEW</div>' : '';

    // 卡片正面样式：使用一星卡片样式
    var cardBg = starStyle ? starStyle.bg : 'linear-gradient(145deg, rgba(200,168,75,0.1), #111018)';
    var cardBorder = starStyle ? starStyle.border : glowColor;
    var cardBorder2 = starStyle ? starStyle.border2 : glowColor;
    var cardShadow = starStyle ? starStyle.shadow : ('0 0 30px ' + glowColor + '40');
    var cardPattern = starStyle ? starStyle.pattern : '';
    var cardParticle = starStyle ? starStyle.particle : '✦';
    var cardParticleColor = starStyle ? starStyle.particleColor : glowColor;

    modal.innerHTML =
        '<div style="position:relative; width:360px; max-width:92vw; text-align:center;">' +
            // 标题
            '<div style="font-family:Orbitron; font-size:1.4rem; color:' + typeColor + '; margin-bottom:24px; text-shadow:0 0 20px ' + typeColor + '80; animation:titleFadeIn 0.6s ease;">✨ 回响显现 ✨</div>' +
            // 粒子背景
            '<div id="echoPackParticles" style="position:absolute; inset:-40px; pointer-events:none; overflow:hidden;"></div>' +
            // 卡片容器
            '<div id="echoPackCardBox" style="position:relative; width:240px; height:340px; margin:0 auto 24px; perspective:1200px;">' +
                '<div id="echoPackCardInner" style="width:100%; height:100%; position:relative; transform-style:preserve-3d; transition:transform 1.4s cubic-bezier(0.4,0,0.2,1);">' +
                    // 背面（盲盒）
                    '<div style="position:absolute; inset:0; backface-visibility:hidden; border-radius:14px; background:linear-gradient(135deg,#1a0a20,#0a0a12); border:2px solid ' + typeColor + '60; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px ' + typeColor + '25;">' +
                        '<div style="font-size:5rem; filter:drop-shadow(0 0 15px ' + typeColor + '); animation:echoCardFloat 2s ease-in-out infinite;">🎁</div>' +
                        '<div style="position:absolute; bottom:20px; font-family:Orbitron; font-size:0.7rem; color:' + typeColor + '80;">点击开启</div>' +
                    '</div>' +
                    // 正面（卡片）- 使用卡片星级样式
                    '<div style="position:absolute; inset:0; backface-visibility:hidden; transform:rotateY(180deg); border-radius:14px; overflow:hidden; border:' + (starStyle ? starStyle.borderWidth : 2) + 'px solid ' + cardBorder + '; box-shadow:' + cardShadow + ';">' +
                        // 背景层
                        '<div style="position:absolute; inset:0; background:' + cardBg + ';"></div>' +
                        // 纹理层
                        (cardPattern ? '<div style="position:absolute; inset:0; background:' + cardPattern + '; opacity:' + (starStyle ? starStyle.patternOpacity : 0.3) + ';"></div>' : '') +
                        // 内边框
                        '<div style="position:absolute; inset:4px; border:' + (starStyle ? starStyle.innerBorder : '1px solid rgba(255,255,255,0.1)') + '; border-radius:10px; pointer-events:none; z-index:2;"></div>' +
                        // 图片
                        '<img src="' + (card.image || '') + '" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:1;" onerror="this.style.display=\'none\'">' +
                        // 底部渐变遮罩
                        '<div style="position:absolute; bottom:0; left:0; right:0; height:55%; background:linear-gradient(transparent 0%, rgba(0,0,0,0.85) 60%); z-index:3;"></div>' +
                        // 粒子装饰
                        '<div style="position:absolute; top:8px; right:10px; font-size:1.2rem; color:' + cardParticleColor + '; opacity:0.6; z-index:4; animation:particleSpin 4s linear infinite;">' + cardParticle + '</div>' +
                        // 卡片信息
                        '<div style="position:absolute; bottom:0; left:0; right:0; padding:18px 12px 14px; z-index:5;">' +
                            '<div style="font-family:Orbitron; font-size:1.05rem; color:#fff; text-shadow:0 0 12px ' + typeColor + '80; margin-bottom:6px;">' + card.name + '</div>' +
                            '<div style="display:flex; align-items:center; justify-content:center; gap:6px;">' +
                                '<span style="font-size:0.9rem; color:' + glowColor + ';">' + rarityInfo.stars + '</span>' +
                                '<span style="font-size:0.75rem; color:' + glowColor + '80; border:1px solid ' + glowColor + '40; padding:2px 8px; border-radius:10px; background:rgba(0,0,0,0.3);">' + rarityInfo.name + '</span>' +
                            '</div>' +
                        '</div>' +
                        isNewTag +
                    '</div>' +
                '</div>' +
            '</div>' +
            // 光芒爆发效果
            '<div id="echoPackGlow" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) scale(0); width:400px; height:500px; border-radius:50%; background:radial-gradient(circle,' + typeColor + '30,transparent 60%); opacity:0; pointer-events:none; transition:all 0.8s ease;"></div>' +
            // 按钮
            '<button id="echoPackOpenBtn" style="padding:12px 36px; background:linear-gradient(135deg,' + typeColor + ',#fff); color:#000; border:none; border-radius:10px; font-family:Orbitron; font-size:1.05rem; cursor:pointer; box-shadow:0 0 25px ' + typeColor + '60; transition:all 0.3s;">开启</button>' +
            '<button id="echoPackCloseBtn" style="display:none; padding:12px 36px; background:linear-gradient(135deg,' + typeColor + ',#fff); color:#000; border:none; border-radius:10px; font-family:Orbitron; font-size:1.05rem; cursor:pointer; box-shadow:0 0 25px ' + typeColor + '60; margin-top:12px; transition:all 0.3s;">收下</button>' +
        '</div>';

    document.body.appendChild(modal);

    // 生成粒子
    var particlesContainer = document.getElementById('echoPackParticles');
    if (particlesContainer) {
        for (var i = 0; i < 20; i++) {
            var p = document.createElement('div');
            p.style.cssText = 'position:absolute; width:4px; height:4px; background:' + typeColor + '; border-radius:50%; opacity:0; left:' + Math.random() * 100 + '%; top:' + Math.random() * 100 + '%; animation:packParticle 1.5s ease ' + (Math.random() * 0.8) + 's forwards;';
            particlesContainer.appendChild(p);
        }
    }

    var cardInner = document.getElementById('echoPackCardInner');
    var glow = document.getElementById('echoPackGlow');
    var openBtn = document.getElementById('echoPackOpenBtn');
    var closeBtn = document.getElementById('echoPackCloseBtn');

    // 点击开启
    openBtn.onclick = function() {
        openBtn.style.display = 'none';
        // 震动
        var box = document.getElementById('echoPackCardBox');
        box.style.animation = 'packShake 0.5s ease-in-out';
        setTimeout(function() {
            // 翻转 + 光爆发
            cardInner.style.transform = 'rotateY(180deg)';
            glow.style.opacity = '1';
            glow.style.transform = 'translate(-50%,-50%) scale(1.2)';
            // 显示收下按钮
            setTimeout(function() {
                closeBtn.style.display = 'inline-block';
                closeBtn.style.animation = 'btnPopIn 0.4s ease';
            }, 1400);
        }, 500);
    };

    closeBtn.onclick = function() {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s';
        setTimeout(function() { modal.remove(); }, 300);
    };

    // 点击背景关闭
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeBtn.click();
        }
    };
}

// 注入CSS动画
(function injectEchoCSS() {
    if (document.getElementById('echo-system-css')) return;
    var style = document.createElement('style');
    style.id = 'echo-system-css';
    style.textContent =
        '@keyframes packShake {' +
            '0%,100%{transform:translateX(0) rotate(0);}' +
            '20%{transform:translateX(-8px) rotate(-3deg);}' +
            '40%{transform:translateX(8px) rotate(3deg);}' +
            '60%{transform:translateX(-5px) rotate(-2deg);}' +
            '80%{transform:translateX(5px) rotate(2deg);}' +
        '}' +
        '@keyframes newTagPop {' +
            '0%{transform:scale(0);}' +
            '60%{transform:scale(1.2);}' +
            '100%{transform:scale(1);}' +
        '}' +
        '@keyframes echoCardFloat {' +
            '0%,100%{transform:translateY(0);}' +
            '50%{transform:translateY(-6px);}' +
        '}' +
        '@keyframes echoGlowPulse {' +
            '0%,100%{opacity:0.3;}' +
            '50%{opacity:0.7;}' +
        '}' +
        '.echo-pack-card {' +
            'width:140px; height:190px; border-radius:10px; ' +
            'background:linear-gradient(135deg,#1a0a20,#0a0a12); ' +
            'border:2px solid; display:flex; flex-direction:column; align-items:center; justify-content:center; ' +
            'cursor:pointer; transition:all 0.3s; position:relative; overflow:hidden;' +
        '}' +
        '.echo-pack-card:hover {' +
            'transform:translateY(-6px) scale(1.05); ' +
            'box-shadow:0 8px 25px rgba(0,0,0,0.5);' +
        '}' +
        '.echo-pack-card .pack-pattern {' +
            'position:absolute; inset:0; border-radius:10px; pointer-events:none; z-index:0;' +
        '}' +
        '.echo-pack-card .pack-inner-border {' +
            'position:absolute; inset:3px; border-radius:8px; pointer-events:none; z-index:1;' +
        '}' +
        '.echo-pack-card .pack-glow {' +
            'position:absolute; inset:0; border-radius:10px; animation:echoGlowPulse 3s ease-in-out infinite; pointer-events:none; z-index:0;' +
        '}' +
        '.echo-pack-card .pack-icon {' +
            'font-size:2.5rem; margin-bottom:8px; animation:echoCardFloat 3s ease-in-out infinite; position:relative; z-index:1;' +
        '}' +
        '.echo-pack-card .pack-name {' +
            'font-size:0.75rem; color:#fff; text-align:center; padding:0 8px; position:relative; z-index:1; ' +
            'font-family:Orbitron; text-shadow:0 0 8px rgba(255,255,255,0.3);' +
        '}' +
        '.echo-pack-card .pack-max-rarity {' +
            'font-size:0.65rem; margin-top:4px; position:relative; z-index:1;' +
        '}' +
        '.echo-pack-card .pack-faction-bar {' +
            'position:absolute; top:0; left:0; right:0; height:3px; z-index:2;' +
        '}' +
        '.echo-fragment-badge {' +
            'display:inline-flex; align-items:center; gap:4px; padding:3px 10px; border-radius:12px; ' +
            'font-size:0.75rem; font-family:Orbitron; border:1px solid; background:rgba(0,0,0,0.4);' +
        '}' +
        '.echo-modal-overlay {' +
            'position:fixed; inset:0; z-index:9998; background:rgba(0,0,0,0.85); backdrop-filter:blur(6px); ' +
            'display:flex; align-items:center; justify-content:center;' +
        '}' +
        '.echo-modal {' +
            'background:linear-gradient(135deg,#0e0e1a,#14101e); border:1px solid #333; border-radius:16px; ' +
            'padding:24px; width:380px; max-width:92vw; position:relative;' +
        '}' +
        '.echo-modal .modal-header {' +
            'display:flex; align-items:center; gap:12px; margin-bottom:16px;' +
        '}' +
        '.echo-modal .modal-pack-icon {' +
            'width:60px; height:60px; border-radius:10px; display:flex; align-items:center; justify-content:center; ' +
            'font-size:2rem; border:2px solid;' +
        '}' +
        '.echo-modal .option-btn {' +
            'display:block; width:100%; padding:10px 14px; margin:6px 0; ' +
            'background:rgba(0,0,0,0.3); border:1px solid; border-radius:10px; ' +
            'color:#fff; cursor:pointer; transition:all 0.2s; text-align:left;' +
        '}' +
        '.echo-modal .option-btn:hover {' +
            'transform:translateX(4px);' +
        '}' +
        '.echo-modal .option-btn.disabled {' +
            'opacity:0.4; cursor:not-allowed;' +
        '}' +
        '.echo-modal .option-btn.disabled:hover {' +
            'transform:none;' +
        '}' +
        '.echo-modal .close-btn {' +
            'position:absolute; top:12px; right:12px; background:none; border:none; ' +
            'color:#666; font-size:1.2rem; cursor:pointer; padding:4px;' +
        '}' +
        '.echo-modal .close-btn:hover { color:#fff; }' +
        '@keyframes packParticle {' +
            '0%{opacity:0; transform:scale(0) translateY(0);}' +
            '50%{opacity:0.8; transform:scale(1.5) translateY(-20px);}' +
            '100%{opacity:0; transform:scale(0.5) translateY(-40px);}' +
        '}' +
        '@keyframes titleFadeIn {' +
            '0%{opacity:0; transform:translateY(-10px);}' +
            '100%{opacity:1; transform:translateY(0);}' +
        '}' +
        '@keyframes btnPopIn {' +
            '0%{opacity:0; transform:scale(0.8);}' +
            '60%{transform:scale(1.05);}' +
            '100%{opacity:1; transform:scale(1);}' +
        '}' +
        '@keyframes particleSpin {' +
            '0%{transform:rotate(0deg);}' +
            '100%{transform:rotate(360deg);}' +
        '}' +
        // 回响商店响应式
        '@media (max-width: 768px) {' +
            '.echo-shop-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 10px !important; }' +
            '.echo-pack-card { width: auto !important; height: 160px !important; }' +
            '.echo-pack-card .pack-icon { font-size: 2rem !important; }' +
            '.echo-pack-card .pack-name { font-size: 0.7rem !important; }' +
            '.echo-pack-card .pack-max-rarity { font-size: 0.6rem !important; }' +
            // 碎片栏响应式：强制一行显示，短名称
            '.echo-fragment-badge { padding: 2px 6px !important; font-size: 0.65rem !important; gap: 2px !important; white-space: nowrap !important; }' +
            '#echoFragmentBar { flex-wrap: nowrap !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }' +
            '.frag-name-desktop { display: none !important; }' +
            '.frag-name-mobile { display: inline !important; }' +
        '}' +
        // 桌面端：显示完整名称
        '@media (min-width: 769px) {' +
            '.frag-name-desktop { display: inline !important; }' +
            '.frag-name-mobile { display: none !important; }' +
        '}';
    document.head.appendChild(style);
})();

// ========== 回响商店渲染 ==========
function toggleEchoShop() {
    var panel = document.getElementById('echoShopPanel');
    if (!panel) return;
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        renderEchoShop();
        updateEchoFragmentBar();
    } else {
        panel.style.display = 'none';
    }
}

// 碎片稀有度 → 卡片类型映射（用于一星边框样式）
var FRAG_TO_CARD_TYPE = { 1: 'normal', 2: 'elite', 3: 'boss', 4: 'mechanic', 5: 'super' };

function renderEchoShop() {
    var container = document.getElementById('echoShopList');
    if (!container) return;

    var fragments = getEchoFragments();
    var html = '<div class="echo-shop-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(140px, 1fr)); gap:14px;">';

    ECHO_PACKS.forEach(function(pack, idx) {
        var deck = CODEX_STRUCTURE[pack.faction];
        var deckColor = deck ? deck.color : '#888';
        var cards = getDeckCardsForPack(pack.deckId);
        // 没有卡片的卡组隐藏
        if (cards.length === 0) return;
        var maxRarityInDeck = getPackMaxRarity(pack);
        var maxRarityInfo = CARD_RARITY[maxRarityInDeck] || CARD_RARITY[1];
        var cardCount = cards.length;

        // 使用卡组最高稀有度对应的一星卡片边框样式
        var cardType = FRAG_TO_CARD_TYPE[maxRarityInDeck] || 'normal';
        var starType = (typeof CARD_STAR_STYLES !== 'undefined' && CARD_STAR_STYLES[cardType]) ? CARD_STAR_STYLES[cardType] : null;
        var star1 = starType && starType.stars ? starType.stars[0] : null;
        var borderColor = star1 ? star1.border : (maxRarityInfo.color + '50');
        var border2 = star1 ? star1.border2 : borderColor;
        var glowBg = star1 ? ('radial-gradient(circle at 50% 50%,' + star1.bgColor + ',transparent 70%)') : ('radial-gradient(circle at 50% 50%,' + maxRarityInfo.color + '15,transparent 70%)');
        var cardShadow = star1 ? star1.shadow : ('0 0 15px ' + maxRarityInfo.color + '15');
        var cardBg = star1 ? star1.bg : 'linear-gradient(145deg, #1a0a20, #0a0a12)';
        var cardInnerBorder = star1 ? star1.innerBorder : '1px solid rgba(255,255,255,0.08)';
        var cardPattern = star1 ? star1.pattern : '';
        var cardPatternOpacity = star1 ? (star1.patternOpacity || 0.3) : 0;
        var typeColor = starType ? starType.color : (deckColor || '#888');
        var typeColor2 = starType ? starType.color2 : typeColor;

        html +=
            '<div class="echo-pack-card" onclick="showEchoPackBuyModal(' + idx + ')" ' +
                'style="border-color:' + borderColor + '; box-shadow:' + cardShadow + '; background:' + cardBg + ';">' +
                '<div class="pack-faction-bar" style="background:linear-gradient(90deg,' + typeColor + ',transparent);"></div>' +
                (cardPattern ? '<div class="pack-pattern" style="background:' + cardPattern + '; opacity:' + cardPatternOpacity + ';"></div>' : '') +
                '<div class="pack-inner-border" style="border:' + cardInnerBorder + ';"></div>' +
                '<div class="pack-glow" style="background:radial-gradient(circle at 50% 50%,' + typeColor + '20,transparent 70%);"></div>' +
                '<div class="pack-icon" style="filter:drop-shadow(0 0 8px ' + typeColor + ');">🎁</div>' +
                '<div class="pack-name">' + pack.name + '</div>' +
                '<div class="pack-max-rarity" style="color:' + typeColor + ';">' +
                    cardCount + '种卡片' +
                '</div>' +
            '</div>';
    });

    html += '</div>';
    container.innerHTML = html || '<div style="text-align:center; color:#666; padding:40px;">暂无可用盲盒</div>';
}

// ========== 盲盒购买弹窗 ==========
function showEchoPackBuyModal(packIndex) {
    var pack = ECHO_PACKS[packIndex];
    if (!pack) return;

    var fragments = getEchoFragments();
    var deck = CODEX_STRUCTURE[pack.faction];
    var deckColor = deck ? deck.color : '#888';
    var maxRarityInDeck = getPackMaxRarity(pack);
    var maxRarityInfo = CARD_RARITY[maxRarityInDeck] || CARD_RARITY[1];

    // 创建弹窗
    var overlay = document.createElement('div');
    overlay.className = 'echo-modal-overlay';
    overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

    var optionsHtml = '';
    PACK_BUY_OPTIONS.forEach(function(opt, oidx) {
        var fragInfo = ECHO_FRAGMENTS[opt.fragmentRarity];
        var hasEnough = (fragments[String(opt.fragmentRarity)] || 0) >= opt.cost;
        var canBuy = opt.minRarity <= maxRarityInDeck;
        var range = getPackDropRarity(pack.deckId, opt);
        var rangeText = CARD_RARITY[range.min].name;
        if (range.max > range.min) rangeText += '~' + CARD_RARITY[range.max].name;

        // 使用对应碎片稀有度的一星卡片边框样式
        var optCardType = FRAG_TO_CARD_TYPE[opt.fragmentRarity] || 'normal';
        var optStarType = (typeof CARD_STAR_STYLES !== 'undefined' && CARD_STAR_STYLES[optCardType]) ? CARD_STAR_STYLES[optCardType] : null;
        var optStar1 = optStarType && optStarType.stars ? optStarType.stars[0] : null;
        var optBorder = optStar1 ? optStar1.border : (fragInfo.color + '60');
        var optBorderHover = optStar1 ? optStar1.border2 : fragInfo.color;
        var optShadow = optStar1 ? optStar1.shadow : ('0 0 10px ' + fragInfo.color + '15');

        var btnDisabled = !hasEnough || !canBuy;
        var buyLabel = !canBuy ? '不可购买' : (hasEnough ? '' : '碎片不足');

        optionsHtml +=
            '<button class="option-btn ' + (btnDisabled ? 'disabled' : '') + '" ' +
                (!btnDisabled ? 'onclick="buyEchoPack(' + packIndex + ',' + oidx + '); this.closest(\'.echo-modal-overlay\').remove();"' : '') +
                'style="border-color:' + optBorder + '; box-shadow:' + (!btnDisabled ? optShadow : 'none') + '; opacity:' + (btnDisabled ? '0.5' : '1') + ';" ' +
                'onmouseover="if(!this.classList.contains(\'disabled\')){this.style.borderColor=\'' + optBorderHover + '\';this.style.background=\'' + fragInfo.color + '15\'}" ' +
                'onmouseout="this.style.borderColor=\'' + optBorder + '\';this.style.background=\'rgba(0,0,0,0.3)\'">' +
                '<div style="display:flex; justify-content:space-between; align-items:center;">' +
                    '<div style="display:flex; align-items:center; gap:8px;">' +
                        '<span style="font-size:1.1rem; text-shadow:' + fragInfo.glow + ';">' + fragInfo.icon + '</span>' +
                        '<div>' +
                            '<div style="font-weight:bold; color:' + fragInfo.color + '; font-size:0.85rem;">' + opt.name + '</div>' +
                            '<div style="font-size:0.7rem; color:#aaa;">可开出: ' + rangeText + (buyLabel ? ' (' + buyLabel + ')' : '') + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div style="text-align:right;">' +
                        '<div style="color:' + (hasEnough ? '#44ff88' : '#ff4444') + '; font-family:Orbitron; font-size:0.85rem;">' + opt.cost + '</div>' +
                        '<div style="font-size:0.6rem; color:#666;">持有: ' + (fragments[String(opt.fragmentRarity)] || 0) + '</div>' +
                    '</div>' +
                '</div>' +
            '</button>';
    });

    overlay.innerHTML =
        '<div class="echo-modal" style="border-color:' + deckColor + '40;">' +
            '<button class="close-btn" onclick="this.closest(\'.echo-modal-overlay\').remove()">✕</button>' +
            '<div class="modal-header">' +
                '<div class="modal-pack-icon" style="border-color:' + deckColor + '60; background:' + deckColor + '15;">🎁</div>' +
                '<div>' +
                    '<div style="font-family:Orbitron; font-size:1.1rem; color:' + deckColor + ';">' + pack.name + '</div>' +
                    '<div style="font-size:0.75rem; color:#888; margin-top:2px;">' + pack.desc + '</div>' +
                    '<div style="font-size:0.7rem; color:' + maxRarityInfo.color + '; margin-top:2px;">最高出现: ' + maxRarityInfo.name + '</div>' +
                '</div>' +
            '</div>' +
            '<div style="font-size:0.75rem; color:#666; margin-bottom:10px; padding-left:2px;">选择支付方式：</div>' +
            optionsHtml +
        '</div>';

    document.body.appendChild(overlay);
}

function updateEchoFragmentBar() {
    var bar = document.getElementById('echoFragmentBar');
    if (!bar) return;
    // gameData 未加载时不渲染（防止显示 localStorage 残留数据）
    if (typeof gameData === 'undefined' || !gameData) {
        bar.innerHTML = '';
        return;
    }
    var fragments = getEchoFragments();
    var html = '';
    for (var r = 1; r <= 5; r++) {
        var info = ECHO_FRAGMENTS[r];
        var count = fragments[String(r)] || 0;
        var shortName = info.name.replace('碎片', '');
        html +=
            '<span class="echo-fragment-badge" style="border-color:' + info.color + '40; color:' + info.color + ';">' +
                '<span style="text-shadow:' + info.glow + ';">' + info.icon + '</span>' +
                '<span class="frag-name-desktop">' + info.name + ': ' + count + '</span>' +
                '<span class="frag-name-mobile">' + shortName + ': ' + count + '</span>' +
            '</span>';
    }
    bar.innerHTML = html;
}

// ========== 兑换码扩展：支持回响盲盒 ==========
// 在 redeemCodeServer 的 result 处理中，如果 result.echo_pack 存在则给盲盒
function handleRedeemEchoPack(redeemResult) {
    // 兼容 echo_pack 和 echo_pack_deck_id 两种字段名
    var rawPackCode = redeemResult && (redeemResult.echo_pack || redeemResult.echo_pack_deck_id);
    if (!redeemResult || !rawPackCode) return false;
    var packAmount = parseInt(redeemResult.reward_value) || 1;
    // 解析 deckId 和盒子类型
    var packCodeParts = String(rawPackCode).split('|');
    var packCode = packCodeParts[0];
    var optionIndex = parseInt(packCodeParts[1]) || 0;
    var option = PACK_BUY_OPTIONS[optionIndex] || PACK_BUY_OPTIONS[0];

    var pack = ECHO_PACKS.find(function(p) { return p.deckId === packCode; });
    if (!pack) return false;

    var packItem = {
        name: pack.name + '·' + option.name + '(兑换)',
        icon: pack.icon,
        amount: packAmount,
        type: 'pack',
        image: null,
        packData: {
            deckId: pack.deckId,
            option: option,
            packName: pack.name,
            optionName: option.name
        }
    };
    addToWarehouse(packItem.name, packItem.icon, packAmount, 'pack', null, packItem.packData);
    showToast('兑换获得 ' + packItem.name + ' x' + packAmount, 'success');
    if (typeof renderWarehouse === 'function') renderWarehouse();
    return true;
}

// 暴露到全局，供 HTML onclick 调用
window.openEchoPack = openEchoPack;
window.useConsumableItem = useConsumableItem;
window.getEchoFragments = getEchoFragments;
window.setEchoFragments = setEchoFragments;
window.gainEchoFragment = gainEchoFragment;
window.updateEchoFragmentBar = updateEchoFragmentBar;
window.renderEchoShop = renderEchoShop;
