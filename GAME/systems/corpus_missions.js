// ═══════════════════════════════════════════════════════════════
//  Corpus 通用任务 - 无尽回廊
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ===== 工具函数 =====
    function safeGetRout() {
        try {
            if (typeof gameData !== 'undefined' && typeof gameData.rout_points === 'number')
                return gameData.rout_points;
        } catch (e) {}
        return 0;
    }

    function safeAddRout(delta) {
        try {
            if (typeof gameData !== 'undefined' && typeof gameData.rout_points === 'number')
                gameData.rout_points += delta;
            if (typeof currentUser !== 'undefined' && typeof currentUser.rout_points === 'number')
                currentUser.rout_points += delta;
        } catch (e) {}
    }

    function safeAddToWarehouse(name, icon, amount, type) {
        try {
            if (typeof addToWarehouse === 'function')
                addToWarehouse(name, icon || '📦', amount || 1, type || 'material', null);
        } catch (e) {}
    }

    function safeAddXP(amount) {
        try {
            console.log('[safeAddXP] 准备添加 ' + amount + ' XP');
            // 内联 XP 逻辑，不依赖外部 addXP（避免 warframes.js / game-core.js 版本冲突）
            if (typeof gameData === 'undefined' || !gameData) {
                console.warn('[safeAddXP] gameData 不存在');
                return;
            }
            var type = gameData.warframe_type || 'excalibur';
            if (!gameData.warframe_levels) gameData.warframe_levels = {};
            if (!gameData.warframe_levels[type]) {
                gameData.warframe_levels[type] = {
                    level: gameData.warframe_level || 1,
                    xp: gameData.warframe_xp || 0,
                    max_xp: gameData.warframe_max_xp || 100
                };
            }
            var wfData = gameData.warframe_levels[type];
            var MAX_LEVEL = 70;
            // 数据修复
            if (wfData.level < MAX_LEVEL && (wfData.max_xp === 0 || wfData.max_xp >= 999999)) {
                wfData.max_xp = Math.min(1000, 100 + (wfData.level - 1) * 50);
                wfData.xp = 0;
            }
            if (wfData.level >= MAX_LEVEL) {
                wfData.xp = 0;
                wfData.max_xp = 0;
                gameData.warframe_level = wfData.level;
                gameData.warframe_xp = 0;
                gameData.warframe_max_xp = 0;
                console.log('[safeAddXP] 已达满级，不获得经验');
                return;
            }
            wfData.xp += amount;
            // 升级循环
            while (wfData.xp >= wfData.max_xp && wfData.level < MAX_LEVEL) {
                wfData.xp -= wfData.max_xp;
                wfData.level++;
                wfData.max_xp = Math.min(1000, 100 + (wfData.level - 1) * 50);
                if (typeof showToast === 'function') {
                    var wfName = (typeof WARFRAMES !== 'undefined' && WARFRAMES[type]) ? WARFRAMES[type].name : '战甲';
                    showToast(wfName + ' 升到了等级 ' + wfData.level + '！', 'success');
                }
            }
            if (wfData.level >= MAX_LEVEL) {
                wfData.level = MAX_LEVEL;
                wfData.xp = 0;
                wfData.max_xp = 0;
                if (typeof showToast === 'function') {
                    var wfName2 = (typeof WARFRAMES !== 'undefined' && WARFRAMES[type]) ? WARFRAMES[type].name : '战甲';
                    showToast(wfName2 + ' 已达到最高等级 ' + MAX_LEVEL + ' 级！', 'success');
                }
            }
            gameData.warframe_level = wfData.level;
            gameData.warframe_xp = wfData.xp;
            gameData.warframe_max_xp = wfData.max_xp;
            // 同步到顶层（兼容 warframes.js 的 syncWarframeDataToCurrent）
            try {
                var current = gameData.warframe_levels[type];
                if (current) {
                    gameData.warframe_level = current.level;
                    gameData.warframe_xp = current.xp;
                    gameData.warframe_max_xp = current.max_xp;
                }
            } catch (e) {}
            // 强制更新UI
            try { if (typeof updateInfoUI === 'function') updateInfoUI(); } catch (e) {}
            console.log('[safeAddXP] XP 添加完成，当前 level=' + wfData.level + ' xp=' + wfData.xp + '/' + wfData.max_xp);
        } catch (e) {
            console.error('[safeAddXP] 添加 XP 失败:', e);
        }
    }

    function safeSave() {
        try { if (typeof saveGameData === 'function') saveGameData(); } catch (e) {}
    }

    function getPlayerInfo() {
        var level = 1;
        var stats = { maxHp: 100, attack: 10, defense: 5, speed: 10, maxShield: 60, maxEnergy: 100 };
        try {
            var wfData = (typeof getCurrentWarframeData === 'function') ? getCurrentWarframeData() : null;
            if (wfData && typeof wfData.level === 'number') level = wfData.level;
        } catch (e) {}
        try {
            var base = (typeof getPlayerBaseStats === 'function') ? getPlayerBaseStats(level) : null;
            if (base) stats = base;
        } catch (e) {}
        var wfKey = 'excalibur';
        try { wfKey = (gameData && gameData.warframe_type) ? gameData.warframe_type : 'excalibur'; } catch (e) {}
        var wf = { name: 'Tenno', icon: '🥷' };
        try { if (typeof WARFRAMES !== 'undefined' && WARFRAMES[wfKey]) wf = WARFRAMES[wfKey]; } catch (e) {}
        return {
            level: level,
            hp: stats.maxHp || 100,
            maxHp: stats.maxHp || 100,
            shield: stats.maxShield || 60,
            maxShield: stats.maxShield || 60,
            energy: stats.maxEnergy || 100,
            maxEnergy: stats.maxEnergy || 100,
            attack: stats.attack || 10,
            defense: stats.defense || 5,
            speed: stats.speed || 10,
            name: wf.name || 'Tenno',
            icon: wf.icon || '🥷',
            wfKey: wfKey
        };
    }

    function makeEnemy(level, opts) {
        opts = opts || {};
        var pool = [];
        var isCorpus = false;
        // ═══ 区域敌人隔离：v_zone1=机械代理人(船员类)，v_zone2=步行机(恐鸟类) ═══
        var zoneFilterType = null;
        try {
            if (opts && opts.zone && opts.zone.id === 'v_zone1') zoneFilterType = 'crewman';
            else if (opts && opts.zone && opts.zone.id === 'v_zone2') zoneFilterType = 'moa';
        } catch(e) {}
        try {
            if (typeof ENEMIES !== 'undefined' && ENEMIES.length) {
                isCorpus = opts && opts.zone && opts.zone.faction === 'corpus';

                // 根据选项决定敌人池
                if (opts.boss) {
                    // Boss：该派系的 mechanic/boss 类型（也需要区域过滤）
                    pool = ENEMIES.filter(function(e) {
                        var matchFaction = isCorpus ? e.faction === 'corpus' : e.faction === 'grineer';
                        return matchFaction && (e.type === 'boss' || e.type === 'mechanic' || e.cardType === 'boss');
                    });
                    if (!pool.length) pool = ENEMIES.filter(function(e) { return e.type === 'boss' || e.type === 'mechanic'; });
                } else if (opts.elite) {
                    // 精英：该派系的 elite 类型（也需要区域过滤）
                    pool = ENEMIES.filter(function(e) {
                        var matchFaction = isCorpus ? e.faction === 'corpus' : e.faction === 'grineer';
                        return matchFaction && (e.type === 'elite' || e.cardType === 'elite');
                    });
                    if (!pool.length) pool = ENEMIES.filter(function(e) { return e.type === 'elite' || e.cardType === 'elite'; });
                } else if (isCorpus && opts.enemyType === 'variant') {
                    // 变体：只从 ENEMIES 中找包含当前轮换前缀名的 Corpus 敌人（需要区域过滤）
                    var prefix = null;
                    try { prefix = (typeof getCorpusRotationPrefix === 'function') ? getCorpusRotationPrefix() : null; } catch(e) {}
                    if (prefix) {
                        pool = ENEMIES.filter(function(e) {
                            return e.faction === 'corpus' && e.name.indexOf(prefix.name) !== -1;
                        });
                    }
                    // 找不到变体敌人则 fallback 到全部 Corpus 敌人（区域过滤）
                    if (!pool.length) {
                        pool = ENEMIES.filter(function(e) { return e.faction === 'corpus' && (e.type === 'normal' || !e.type); });
                    }
                } else if (isCorpus && opts.enemyType === 'normal') {
                    // 常规：只出名字不含任何前缀的 Corpus 基础敌人
                    var allPrefixNames = [];
                    try {
                        if (typeof CORPUS_ROTATION_PREFIXES !== 'undefined') {
                            CORPUS_ROTATION_PREFIXES.forEach(function(p) { allPrefixNames.push(p.name); });
                        }
                        if (typeof CORPUS_RARE_PREFIXES !== 'undefined') {
                            CORPUS_RARE_PREFIXES.forEach(function(p) { allPrefixNames.push(p.name); });
                        }
                    } catch(e) {}
                    pool = ENEMIES.filter(function(e) {
                        if (e.faction !== 'corpus') return false;
                        if (e.type !== 'normal' && e.type) return false;
                        for (var i = 0; i < allPrefixNames.length; i++) {
                            if (e.name.indexOf(allPrefixNames[i]) !== -1) return false;
                        }
                        return true;
                    });
                    // 找不到纯基础敌人就出全部 Corpus normal
                    if (!pool.length) pool = ENEMIES.filter(function(e) { return e.faction === 'corpus' && (e.type === 'normal' || !e.type); });
                } else if (isCorpus && opts.enemyType === 'mixed') {
                    // 未知：随机从 变体/驱逐员扰敌员/普通 中选一个
                    var roll = Math.random();
                    if (roll < 0.35) {
                        // 35% 变体
                        var prefix2 = null;
                        try { prefix2 = (typeof getCorpusRotationPrefix === 'function') ? getCorpusRotationPrefix() : null; } catch(e) {}
                        if (prefix2) {
                            pool = ENEMIES.filter(function(e) { return e.faction === 'corpus' && e.name.indexOf(prefix2.name) !== -1; });
                        }
                    } else if (roll < 0.55 && opts && opts.zone && opts.zone.id === 'v_zone1') {
                        // 20% 驱逐员/扰敌员（仅集气城市）
                        pool = ENEMIES.filter(function(e) {
                            return e.faction === 'corpus' && e.type === 'elite' && (e.name.indexOf('驱逐员') !== -1 || e.name.indexOf('扰敌员') !== -1);
                        });
                    }
                    // 剩余 fallback 到全部 Corpus normal
                    if (!pool.length) {
                        pool = ENEMIES.filter(function(e) { return e.faction === 'corpus' && (e.type === 'normal' || !e.type); });
                    }
                } else {
                    // 默认：该派系 normal 敌人
                    pool = ENEMIES.filter(function(e) {
                        var matchFaction = isCorpus ? e.faction === 'corpus' : e.faction === 'grineer';
                        return matchFaction && (e.type === 'normal' || !e.type);
                    });
                }

                // ═══ 区域敌人隔离过滤 ═══
                if (zoneFilterType) {
                    pool = pool.filter(function(e) {
                        var eid = e.id || '';
                        var ename = e.name || '';
                        if (zoneFilterType === 'moa') {
                            // 步行机区域：只出恐鸟类敌人（id含moa或名字含恐鸟/融合/圆盘/德拉/双子炮/冷冻/金流/爆破型）
                            return eid.indexOf('moa') !== -1 || eid.indexOf('_m') === 2 || eid.indexOf('_me') !== -1 || eid.indexOf('_md') !== -1
                                || ename.indexOf('恐鸟') !== -1 || ename.indexOf('融合') !== -1 || ename.indexOf('圆盘') !== -1
                                || ename.indexOf('德拉') !== -1 || ename.indexOf('双子炮') !== -1 || ename.indexOf('冷冻') !== -1
                                || ename.indexOf('金流') !== -1 || ename.indexOf('爆破型') !== -1;
                        } else if (zoneFilterType === 'crewman') {
                            // 机械代理人区域：只出船员类敌人（排除恐鸟类）
                            return eid.indexOf('moa') === -1 && eid.indexOf('_m') !== 2 && eid.indexOf('_me') === -1 && eid.indexOf('_md') === -1
                                && ename.indexOf('恐鸟') === -1 && ename.indexOf('融合') === -1 && ename.indexOf('圆盘') === -1
                                && ename.indexOf('德拉') === -1 && ename.indexOf('双子炮') === -1 && ename.indexOf('冷冻') === -1
                                && ename.indexOf('金流') === -1 && ename.indexOf('爆破型') === -1;
                        }
                        return true;
                    });
                }

                // 最终 fallback
                if (!pool.length) pool = ENEMIES.filter(function(e) { return e.type === 'normal' || !e.type; });
            }
        } catch (e) {
            console.warn('[corpus_missions] 敌人过滤出错，使用默认池', e);
        }
        if (!pool.length) {
            return { id:'fallback', name:'敌方单位', icon:'🔶', level:level, maxHp:80+level*15, hp:80+level*15, attack:8+level*2, defense:3+level, speed:8+level, faction: isCorpus?'corpus':'grineer' };
        }
        var tmpl = pool[Math.floor(Math.random() * pool.length)];
        var enemy = Object.assign({}, tmpl);
        enemy.level = level;

        // ===== 属性缩放（参考旧版 getEnemyBaseStats） =====
        // 以玩家同等级属性为基准，乘以类型修正 + 派系修正
        var pLv = (typeof player !== 'undefined' && player && player.level) ? player.level : 1;

        // 类型修正（对应旧版 TYPE_MODS）
        var typeMods = {
            normal:   { hpMod: 0.90, atkMod: 0.85, defMod: 0.60, spdMod: 0.90 },
            elite:    { hpMod: 1.10, atkMod: 1.00, defMod: 0.80, spdMod: 1.00 },
            boss:     { hpMod: 1.30, atkMod: 0.95, defMod: 0.90, spdMod: 0.75 },
            mechanic: { hpMod: 1.20, atkMod: 1.00, defMod: 1.00, spdMod: 0.75 },
            super:    { hpMod: 1.60, atkMod: 0.90, defMod: 0.90, spdMod: 0.65 }
        };
        var enemyType = (opts.boss ? 'boss' : opts.elite ? 'elite' : tmpl.type) || 'normal';
        var tMod = typeMods[enemyType] || typeMods.normal;

        // 派系修正（对应旧版 FACTION_MODS）
        var isCorpus = (opts.zone && opts.zone.faction === 'corpus') || tmpl.faction === 'corpus';
        var factionMods = {
            grineer:  { hpMod: 1.05, atkMod: 1.00, defMod: 0.95 },
            corpus:   { hpMod: 0.90, atkMod: 1.05, defMod: 1.15 },
            infested: { hpMod: 0.95, atkMod: 0.95, defMod: 0.85 }
        };
        var fMod = factionMods[tmpl.faction] || factionMods.grineer;

        // 基础属性（基于模板值，用等级缩放）
        // Corpus 成长降低：scale 指数从 0.08 降到 0.055
        var isCorpusFaction = (opts.zone && opts.zone.faction === 'corpus') || tmpl.faction === 'corpus';
        var scaleFactor = isCorpusFaction ? 0.055 : 0.08;
        // 楼层额外缩放：每层增加 0.002 的成长率
        if (typeof floor === 'number' && floor > 0) {
            scaleFactor += floor * 0.002;
        }
        var scale = 1 + (level - 1) * scaleFactor;
        if (opts.diffMod) scale *= (1 + opts.diffMod);
        var baseMaxHp = Math.floor((tmpl.maxHp || tmpl.hp || 100) * Math.max(0.5, scale));
        var baseAttack = Math.floor((tmpl.attack || 10) * Math.max(0.5, scale));
        var baseDefense = Math.floor((tmpl.defense || 5) * Math.max(0.5, scale));
        var baseSpeed = Math.floor((tmpl.speed || 10) * Math.max(0.5, scale));
        var baseShield = tmpl.shield ? Math.floor((tmpl.maxShield || tmpl.shield) * Math.max(0.5, scale)) : 0;

        // 应用类型+派系修正
        enemy.maxHp = Math.floor(baseMaxHp * tMod.hpMod * fMod.hpMod);
        enemy.attack = Math.floor(baseAttack * tMod.atkMod * fMod.atkMod);
        enemy.defense = Math.floor(baseDefense * tMod.defMod * fMod.defMod);
        enemy.speed = Math.floor(baseSpeed * tMod.spdMod);

        // ===== Grineer vs Corpus 护盾/血量平衡 =====
        // Grineer: 血多盾少（护盾为生命值的 25%）
        // Corpus:   盾多血少（护盾为生命值的 150%，生命降至 20%）
        if (isCorpus) {
            enemy.maxHp = Math.floor(enemy.maxHp * 0.2);
            enemy.hp = enemy.maxHp;
            var corpusShield = Math.floor(enemy.maxHp * 1.5);
            enemy.shield = Math.max(corpusShield, baseShield);
            enemy.maxShield = enemy.shield;
        } else if (tmpl.faction === 'grineer') {
            // Grineer: 低护盾但保证可见
            var grineerShield = Math.floor(enemy.maxHp * 0.25);
            enemy.shield = Math.max(grineerShield, baseShield, 1);
            enemy.maxShield = enemy.shield;
        } else {
            // 其他派系：正常护盾
            if (baseShield > 0) {
                enemy.shield = baseShield;
                enemy.maxShield = enemy.shield;
            }
        }

        return enemy;
    }

    function showPanel(html) {
        var bp = document.getElementById('battlePage');
        if (!bp) { showToast('面板容器未找到', 'error'); return null; }
        bp.innerHTML = '<div style="width:100%;max-width:720px;margin:20px auto;text-align:center;font-family:Noto Sans SC, sans-serif;">' + html + '</div>';
        bp.style.display = 'flex';
        // 恢复之前保存的 page-section（让 battlePage 覆盖在上面）
        restoreSavedSection();
        return bp;
    }

    function hidePanel() {
        var bp = document.getElementById('battlePage');
        if (bp) { bp.innerHTML = ''; bp.style.display = 'none'; }
    }

    var _savedSection = null; // 保存进入战斗前的 page-section

    function showBattlePage() {
        // 记住当前可见的 page-section，然后切换到 page-dashboard（initSkillCombat 需要它）
        try {
            var sections = document.querySelectorAll('.page-section');
            sections.forEach(function(s) {
                if (!s.classList.contains('hidden')) {
                    _savedSection = s.id;
                }
            });
            sections.forEach(function(s) { s.classList.add('hidden'); });
            var d = document.getElementById('page-dashboard');
            if (d) d.classList.remove('hidden');
            // 设置 battlePageEntered，让 switchPage('planetselect') 保持 page-dashboard 不被切换
            if (typeof window.battlePageEntered !== 'undefined') window.battlePageEntered = true;
            // 同步玩家属性显示到 battle UI（参考 Grineer）
            if (typeof updateBattleUI === 'function') updateBattleUI();
        } catch (e) {}
    }

    function restoreSavedSection() {
        // 任务结束后回到肃清导航并重新渲染（和 Grineer 一致）
        try {
            if (typeof window.battlePageEntered !== 'undefined') window.battlePageEntered = false;
            // 切换到肃清星球选择页
            document.querySelectorAll('.page-section').forEach(function(s) { s.classList.add('hidden'); });
            var ps = document.getElementById('page-planetselect');
            if (ps) ps.classList.remove('hidden');
            // 更新导航高亮
            document.querySelectorAll('.nav-item').forEach(function(item) { item.classList.remove('active'); });
            var navItems = document.querySelectorAll('.nav-item');
            for (var i = 0; i < navItems.length; i++) {
                var onclick = navItems[i].getAttribute('onclick');
                if (onclick && onclick.indexOf("'planetselect'") !== -1) {
                    navItems[i].classList.add('active');
                    break;
                }
            }
            // 重新渲染肃清导航
            if (typeof window.renderPlanetSelect === 'function') window.renderPlanetSelect();
        } catch (e) {}
    }

    // ===== 无尽回廊 =====
    var gState = null;

    // ===== 即时货币：虚空币 =====
    // 用于在无尽回廊内购买商店强化，随回廊结束消失
    var VOID_CURRENCY = {
        name: '虚空币',
        icon: '💠',
        color: '#00ffcc',
        // 货币掉落表：不同选项完成后获得的货币量
        dropTable: {
            'normal':  { min: 2, max: 4 },   // 常规遭遇
            'unknown': { min: 2, max: 5 },   // 未知敌人
            'light':   { min: 1, max: 3 },   // 轻型单位
            'elite':   { min: 4, max: 8 },   // 精英巡逻
            'boss':    { min: 10, max: 15 }, // Boss战
            'final':   { min: 15, max: 25 }, // 最终决战
            'quiet':   { min: 0, max: 1, chance: 0.15 },  // 前方安静：极低概率获得 0~1
            'rift':    { min: 0, max: 2, chance: 0.10 }   // 虚空裂隙：极低概率获得 0~2
        }
    };

    var OPTION_DEFS = [
        { id: 'normal',   name: '常规遭遇',   desc: '遭遇敌方普通单位', icon: '⚔️', cat: 'combat', diff: 0, enemyType: 'normal' },
        { id: 'unknown',  name: '未知敌人',   desc: '可能遭遇敌方任何单位', icon: '❓', cat: 'combat', diff: null, enemyType: 'mixed' },
        { id: 'light',    name: '主题派对',   desc: '遭遇敌方变体单位', icon: '👤', cat: 'combat', diff: -0.1, enemyType: 'variant' },
        { id: 'elite',    name: '精英巡逻',   desc: '遭遇敌方精英单位', icon: '💀', cat: 'combat', diff: 0.35, enemyType: 'elite' },
        { id: 'quiet',    name: '安静区域',   desc: '似乎没有敌人', icon: '❔', cat: 'safe' },
        { id: 'rift',     name: '虚空裂隙',   desc: '随机事件', icon: '🌀', cat: 'event' },
        { id: 'shop',     name: '虚空商店',   desc: '购买临时强化', icon: '🏪', cat: 'shop' },
        { id: 'rest',     name: '休息区',     desc: '回复30% HP+护盾', icon: '💤', cat: 'rest' },
        { id: 'boss',     name: '守层敌战',     desc: '强敌拦路', icon: '👹', cat: 'boss', diff: 0.5 },
        { id: 'final',    name: '最终决战',   desc: '回廊的尽头', icon: '🔥', cat: 'boss', diff: 1.0 }
    ];

    var SHOP_DEFS = [
        { id: 'atk',  name: '攻击强化', desc: '攻击+20%', icon: '⚔️', cost: 15, apply: function(s) { s.attack = Math.floor(s.attack * 1.2); } },
        { id: 'def',  name: '防御强化', desc: '防御+15',  icon: '🛡️', cost: 12, apply: function(s) { s.defense += 15; } },
        { id: 'hp',   name: '生命强化', desc: '最大HP+15%', icon: '❤️', cost: 12, apply: function(s) { var inc = Math.floor(s.maxHp * 0.15); s.maxHp += inc; s.hp += inc; } },
        { id: 'heal', name: '急救包',   desc: '回复40% HP', icon: '💊', cost: 8, apply: function(s) { var heal = Math.floor(s.maxHp * 0.4); s.hp = Math.min(s.maxHp, s.hp + heal); } },
        //{ id: 'eng',  name: '能量电池', desc: '每战前能量+20', icon: '🔋', cost: 10, apply: function(s) { s.buffs.push({ id: 'eng', name: '能量电池', engBonus: 20 }); } },
        { id: 'shd',  name: '护盾充能', desc: '护盾+30', icon: '🛡️', cost: 10, apply: function(s) { s.shield += 30; s.maxShield += 30; } },
        { id: 'spd',  name: '速度强化', desc: '速度+5', icon: '💨', cost: 8, apply: function(s) { s.speed += 5; } }
    ];

    function startCorridor(zone, planetId) {
        var player = getPlayerInfo();
        var baseLevel = (zone && zone.level) || player.level;
        var dropMult  = (zone && zone.dropMult) || 1.0;

        gState = {
            floor: 1,
            maxFloor: 21,
            hp: player.maxHp,
            maxHp: player.maxHp,
            attack: player.attack,
            defense: player.defense,
            speed: player.speed,
            shield: player.maxShield,
            maxShield: player.maxShield,
            buffs: [],
            logs: [],
            active: true,
            inBattle: false,
            opts: [],
            zone: zone,
            planetId: planetId,
            pendingRewards: { rout: 0, items: [], xp: 0 },
            voidCredits: 0  // 即时货币：虚空币
        };

        function log(text) {
            gState.logs.push(text);
            if (gState.logs.length > 14) gState.logs.shift();
        }

        // 计算虚空币掉落
        function rollVoidCredits(optionId) {
            var table = VOID_CURRENCY.dropTable[optionId];
            if (!table) return 0;
            // 如果有概率要求，先判定
            if (table.chance !== undefined && Math.random() > table.chance) return 0;
            var min = table.min || 0;
            var max = table.max || 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function genOpts() {
            var f = gState.floor;
            var out = [];
            if (f === gState.maxFloor) {
                // 最终层：只有Boss战
                out.push(cloneOpt('final'));
                return out;
            } else if (f % 11 === 0) {
                // 11层：只有Boss战
                out.push(cloneOpt('boss'));
                return out;
            } else if (f % 5 === 0) {
                out.push(cloneOpt(Math.random() < 0.5 ? 'shop' : 'rest'));
                fillRandom(out, 3);
            } else {
                fillRandom(out, 4);
            }
            return out;
        }

        function cloneOpt(id) {
            var o = OPTION_DEFS.find(function(x) { return x.id === id; });
            return o ? Object.assign({}, o) : null;
        }

        function fillRandom(arr, need) {
            var pool = ['light', 'normal', 'unknown', 'elite', 'quiet', 'rift'];
            while (arr.length < need) {
                var id = pool[Math.floor(Math.random() * pool.length)];
                var o = cloneOpt(id);
                if (o) arr.push(o);
            }
        }

        function nextFloor() {
            gState.floor++;
            if (gState.floor > gState.maxFloor) {
                endRun('恭喜通关21阶层！');
                return;
            }
            gState.opts = genOpts();
            render();
        }

        function startBattle(opt) {
            var isBoss = opt.cat === 'boss';
            var pLv = (typeof player !== 'undefined' && player && player.level) ? player.level : 1;
            // 等级以玩家等级为主，楼层递增为辅（参考旧版 getEnemyBaseStats，敌人等级=玩家等级）
            var eLv = Math.max(1, Math.floor(pLv * 0.85 + baseLevel * 0.15) + Math.floor(gState.floor / 3));
            var diff = 0;
            if (opt.diff !== null && typeof opt.diff === 'number') diff = opt.diff;
            else if (opt.diff === null) diff = (Math.random() - 0.5) * 0.6;

            var enemy = makeEnemy(eLv, { boss: isBoss, elite: opt.id === 'elite', diffMod: diff, zone: gState.zone, enemyType: opt.enemyType });
            if (isBoss) {
                var mult = opt.id === 'final' ? 3.0 : 2.2;
                enemy.maxHp = Math.floor(enemy.maxHp * mult);
                enemy.hp = enemy.maxHp;
                enemy.attack = Math.floor(enemy.attack * 1.5);
                log((opt.id === 'final' ? '🔥 最终决战！' : '👹 守层敌战！') + enemy.name + ' Lv.' + enemy.level);
            } else {
                log(opt.icon + ' ' + opt.name + '：' + enemy.name + ' Lv.' + enemy.level);
            }

            gState.inBattle = true;
            // 隐藏所有肃清相关按钮（Corpus 战斗结束后自动回到无尽回廊选择页）
            var btnIds = ['startBattleBtn', 'autoBattleBtn', 'continueBattleBtn', 'stopBattleBtn'];
            var btns = document.querySelectorAll('#page-dashboard button');
            for (var b = 0; b < btns.length; b++) {
                if (btnIds.indexOf(btns[b].id) !== -1) {
                    btns[b].style.display = 'none';
                    if (!gState._hiddenBtns) gState._hiddenBtns = [];
                    gState._hiddenBtns.push(btns[b]);
                }
            }
            // 先切换到 page-dashboard（initSkillCombat 需要它），然后隐藏 battlePage 覆盖层
            showBattlePage();
            hidePanel();

            if (typeof initSkillCombat === 'function') {
                initSkillCombat(
                    {
                        warframe_type: player.wfKey,
                        level: player.level,
                        hp: gState.hp,
                        maxHp: gState.maxHp,
                        shield: gState.shield,
                        maxShield: gState.maxShield || player.maxShield,
                        energy: 100 + gState.buffs.reduce(function(s, b) { return s + (b.engBonus || 0); }, 0),
                        maxEnergy: 100,
                        attack: gState.attack,
                        defense: gState.defense,
                        armor: gState.defense,
                        speed: gState.speed
                    },
                    enemy,
                    {
                        onBattleEnd: function(result) {
                            gState.inBattle = false;
                            // 同步战斗后的 hp/shield 回 gState
                            if (typeof SkillCombat !== 'undefined' && SkillCombat && SkillCombat.player) {
                                gState.hp = Math.max(1, Math.floor(SkillCombat.player.hp || 0));
                                gState.shield = Math.max(0, Math.floor(SkillCombat.player.shield || 0));
                                gState.maxHp = Math.max(1, Math.floor(SkillCombat.player.maxHp || gState.maxHp));
                                gState.maxShield = Math.max(0, Math.floor(SkillCombat.player.maxShield || gState.maxShield));
                                gState.attack = Math.floor(SkillCombat.player.attack || gState.attack);
                                gState.defense = Math.floor(SkillCombat.player.defense || gState.defense);
                                gState.speed = Math.floor(SkillCombat.player.speed || gState.speed);
                            }
                            if (result === 'win') winBattle(enemy, isBoss, opt);
                            else failRun('战斗失败，回廊探索结束');
                        }
                    }
                );
            } else {
                fallbackCombat(enemy, isBoss);
            }
        }

        function fallbackCombat(enemy, isBoss) {
            var t = setInterval(function() {
                if (!gState.active || !gState.inBattle) { clearInterval(t); return; }
                var dmg = Math.max(1, gState.attack - Math.floor((enemy.defense || 0) * 0.5));
                dmg = Math.floor(dmg * (0.9 + Math.random() * 0.2));
                enemy.hp -= dmg;
                if (enemy.hp <= 0) {
                    clearInterval(t);
                    winBattle(enemy, isBoss, null);
                    return;
                }
                var edmg = Math.max(1, Math.floor((enemy.attack || 10) * 0.5) - Math.floor(gState.defense * 0.3));
                if (gState.shield > 0) { var a = Math.min(gState.shield, edmg); gState.shield -= a; edmg -= a; }
                gState.hp = Math.max(0, gState.hp - edmg);
                if (gState.hp <= 0) {
                    clearInterval(t);
                    failRun('战斗失败，回廊探索结束');
                }
            }, 800);
        }

        function showWinPanel(enemy, isBoss) {
            var pr = gState.pendingRewards;
            var itemLines = '';
            if (pr.items.length > 0) {
                itemLines = pr.items.map(function(it) {
                    return '<div style="font-size:0.75rem;color:#aaa;">' + it.icon + ' ' + it.name + ' x' + it.amount + '</div>';
                }).join('');
            }
            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">✨ 战斗胜利</h2>' +
                '<div style="font-size:1.1rem;color:#44ff88;margin:10px;">击败了 ' + enemy.name + ' Lv.' + enemy.level + '</div>' +
                '<div style="display:flex;gap:8px;justify-content:center;margin:15px 0;">' +
                    '<div style="flex:1;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid #333;">' +
                        '<div style="font-size:0.65rem;color:#888;">获得 Rout</div>' +
                        '<div style="font-family:Orbitron;color:#c8a84b;font-size:0.95rem;">💰 +' + pr.rout + '</div>' +
                    '</div>' +
                    '<div style="flex:1;padding:8px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid #333;">' +
                        '<div style="font-size:0.65rem;color:#888;">获得经验</div>' +
                        '<div style="font-family:Orbitron;color:#66bbff;font-size:0.95rem;">📈 +' + pr.xp + '</div>' +
                    '</div>' +
                '</div>' +
                (itemLines ? '<div style="margin-bottom:10px;">' + itemLines + '</div>' : '') +
                '<button onclick="window._corNext()" class="btn" style="padding:10px 24px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">继续探索</button>';
            showPanel(html);
        }

        function winBattle(enemy, isBoss, currentOpt) {
            hidePanel();
            var items = [];
            var xpGain = 100; // 必得经验
            var hasNewCard = false; // 标记是否有新卡片弹窗

            // 虚空币掉落（使用 currentOpt 避免 opt 未定义）
            var vcGain = rollVoidCredits(currentOpt ? currentOpt.id : 'normal');
            gState.voidCredits += vcGain;
            if (vcGain > 0) log(VOID_CURRENCY.icon + ' 获得 ' + vcGain + ' ' + VOID_CURRENCY.name);

            // Rout 掉落（使用 DROP_CONFIG 统一配置，参考 Grineer 的每日上限）
            var routGain = 0;
            var dropConf = (typeof DROP_CONFIG !== 'undefined' && DROP_CONFIG.rout) ? DROP_CONFIG.rout : null;
            var enemyTypeForDrop = isBoss ? 'boss' : (enemy.type || 'normal');
            if (dropConf && dropConf[enemyTypeForDrop]) {
                var rc = dropConf[enemyTypeForDrop];
                if (Math.random() < (rc.chance || 0)) {
                    routGain = rc.amount || 0;
                }
            } else {
                // 兜底：旧逻辑
                if (isBoss || enemy.type === 'boss' || enemy.cardType === 'boss') {
                    if (Math.random() < 0.15) routGain = 2;
                } else if (enemy.type === 'elite' || enemy.type === 'mechanic') {
                    if (Math.random() < 0.10) routGain = 3;
                }
            }

            // 每日上限检查（参考 Grineer 的 canEarnCashToday）
            var actualRoutGain = 0;
            if (routGain > 0) {
                if (typeof canEarnCashToday === 'function') {
                    var canEarn = canEarnCashToday(routGain);
                    if (canEarn === false) {
                        log('💰 击败 ' + (enemy.fullName || enemy.name) + ' 未获得 Rout（已达日上限）');
                        routGain = 0;
                    } else {
                        actualRoutGain = (typeof canEarn === 'number') ? canEarn : routGain;
                        if (typeof recordCashEarned === 'function') recordCashEarned(actualRoutGain);
                    }
                } else {
                    actualRoutGain = routGain;
                }
            }

            // 将奖励计入 pendingRewards
            gState.pendingRewards.rout += actualRoutGain;
            gState.pendingRewards.xp += xpGain;
            for (var i = 0; i < items.length; i++) {
                gState.pendingRewards.items.push(items[i]);
            }

            if (actualRoutGain > 0) {
                log('💰 击败 ' + (enemy.fullName || enemy.name) + ' 获得 ' + actualRoutGain + ' Rout');
            } else if (routGain > 0 && actualRoutGain === 0) {
                log('💰 击败 ' + (enemy.fullName || enemy.name) + ' 未获得 Rout（已达日上限）');
            }
            log('📈 获得 ' + xpGain + ' 经验');

            // ═══ 卡片掉落（和 Grineer 一样的保底机制）═══
            if (enemy && enemy.codexId && typeof tryDropCardFromEnemy === 'function') {
                var dropChance = (enemy.cardDrop && typeof enemy.cardDrop.chance === 'number')
                    ? enemy.cardDrop.chance : undefined;
                var cardDrop = tryDropCardFromEnemy(enemy.codexId, dropChance);
                if (cardDrop) {
                    if (typeof addPlayerCard === 'function') {
                        var cardResult = addPlayerCard(cardDrop);
                        log('🎴 ' + (cardResult.isNew ? '✨新回响: ' : '🔄重复: ') + cardDrop.name);
                        // 新卡片弹窗：确认后才显示胜利面板
                        if (cardResult.isNew && typeof showCardAcquireModal === 'function') {
                            hasNewCard = true;
                            setTimeout(function() {
                                showCardAcquireModal(cardDrop, enemy.name);
                                // 卡片弹窗显示后延迟调用胜利面板（不依赖回调）
                                setTimeout(function() {
                                    showWinPanel(enemy, isBoss);
                                }, 2500); // 给卡片弹窗足够展示时间
                            }, 800);
                        }
                    } else {
                        log('🎴 回响掉落: ' + cardDrop.name);
                    }
                }
            }

            // ═══ 蓝图掉落（Boss 专属，统一由 DROP_CONFIG.blueprint.bossChance 控制）═══
            if (isBoss && typeof BATTLE_DROPS !== 'undefined') {
                var zoneId = gState.zone ? gState.zone.id : null;
                var blueprintDrops = [];
                for (var bd = 0; bd < BATTLE_DROPS.length; bd++) {
                    var bdi = BATTLE_DROPS[bd];
                    if (!bdi.bossOnly) continue;
                    if (bdi.type !== 'blueprint') continue;
                    if (bdi.zoneFilter && bdi.zoneFilter.length > 0) {
                        if (!zoneId || bdi.zoneFilter.indexOf(zoneId) === -1) continue;
                    }
                    blueprintDrops.push(bdi);
                }
                var bpChance2 = (typeof DROP_CONFIG !== 'undefined' && DROP_CONFIG.blueprint) ? (DROP_CONFIG.blueprint.bossChance || 0.10) : 0.10;
                if (blueprintDrops.length > 0 && Math.random() < bpChance2) {
                    var selBP = blueprintDrops[Math.floor(Math.random() * blueprintDrops.length)];
                    items.push({ name: selBP.name, icon: selBP.icon, amount: 1, type: 'blueprint' });
                    gState.pendingRewards.items.push({ name: selBP.name, icon: selBP.icon, amount: 1, type: 'blueprint' });
                    log('🎉 蓝图: ' + selBP.icon + ' ' + selBP.name + '！');
                }
            }

            log('战斗胜利！');

            // 战后小回复
            var heal = Math.floor(gState.maxHp * 0.05);
            gState.hp = Math.min(gState.maxHp, gState.hp + heal);
            gState.shield = Math.min(gState.maxShield || player.maxShield, (gState.maxShield || player.maxShield));
            log('💚 战后回复 ' + heal + ' HP，护盾重置');

            // 显示胜利面板：如有新卡片弹窗，由弹窗关闭回调触发
            if (!hasNewCard) {
                showWinPanel(enemy, isBoss);
            }
        }

        function doEvent() {
            // 虚空裂隙：极低概率获得虚空币
            var vcGain = rollVoidCredits('rift');
            gState.voidCredits += vcGain;
            if (vcGain > 0) log(VOID_CURRENCY.icon + ' 虚空裂隙中获得 ' + vcGain + ' ' + VOID_CURRENCY.name);

            var events = [
                { name: '虚空赐福', icon: '✨', type: 'buff', color: '#ffcc00', effect: function() { gState.attack = Math.floor(gState.attack * 1.2); log('✨ 攻击提升20%'); } },
                { name: '虚空诅咒', icon: '💀', type: 'debuff', color: '#ff4444', effect: function() { gState.maxHp = Math.floor(gState.maxHp * 0.85); gState.hp = Math.min(gState.hp, gState.maxHp); log('💀 HP上限降低15%'); } },
                { name: '能量涌流', icon: '⚡', type: 'buff', color: '#4488ff', effect: function() { gState.energy = Math.min(gState.maxEnergy || 100, (gState.energy || 0) + 50); log('⚡ 能量+50'); } },
                { name: '虚空之触', icon: '🛡️', type: 'buff', color: '#66ddff', effect: function() { gState.shield = Math.min((gState.maxShield || 60) + 40, (gState.shield || 0) + 30); log('🛡️ 护盾+30'); } },
                { name: '护盾削弱', icon: '🔻', type: 'debuff', color: '#ff6644', effect: function() { gState.shield = Math.max(0, Math.floor((gState.shield || 0) * 0.7)); log('🔻 护盾被削减30%'); } },
                { name: '陷阱', icon: '💥', type: 'debuff', color: '#ff8844', effect: function() { gState.hp = Math.max(1, gState.hp - Math.floor(gState.maxHp * 0.12)); log('💥 触发陷阱！失去12% HP'); } },
                { name: '修复模块', icon: '💚', type: 'buff', color: '#44ff88', effect: function() { gState.hp = Math.min(gState.maxHp, gState.hp + Math.floor(gState.maxHp * 0.2)); log('💚 恢复20% HP'); } },
                { name: '腐蚀环境', icon: '🧪', type: 'debuff', color: '#88ff44', effect: function() { gState.defense = Math.max(1, Math.floor((gState.defense || 5) * 0.85)); log('🧪 防御降低15%'); } },
                { name: '磁场强化', icon: '🧲', type: 'buff', color: '#aa66ff', effect: function() { gState.defense = Math.floor((gState.defense || 5) * 1.15); log('🧲 防御提升15%'); } },
                { name: '虚空回响', icon: '🌀', type: 'neutral', color: '#c8a84b', effect: function() { log('🌀 虚空回响...什么都没发生'); } },
            ];
            var ev = events[Math.floor(Math.random() * events.length)];
            ev.effect();
            // 构建具体效果描述
            var effectDesc = '';
            switch(ev.name) {
                case '虚空赐福': effectDesc = '攻击 +20%'; break;
                case '虚空诅咒': effectDesc = 'HP上限 -15%'; break;
                case '能量涌流': effectDesc = '能量 +50'; break;
                case '虚空之触': effectDesc = '护盾 +30'; break;
                case '护盾削弱': effectDesc = '护盾 -30%'; break;
                case '陷阱': effectDesc = '失去 12% HP'; break;
                case '修复模块': effectDesc = '恢复 20% HP'; break;
                case '腐蚀环境': effectDesc = '防御 -15%'; break;
                case '磁场强化': effectDesc = '防御 +15%'; break;
                case '虚空回响': effectDesc = '无效果'; break;
                default: effectDesc = '未知效果';
            }
            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">🌀 虚空裂隙</h2>' +
                '<div style="font-size:1.5rem;margin:10px;color:' + (ev.color || '#fff') + ';font-family:Orbitron;text-shadow:0 0 15px ' + (ev.color || '#fff') + '40;">' + (ev.icon || '🌀') + ' ' + ev.name + '</div>' +
                '<div style="font-size:0.85rem;color:' + (ev.color || '#fff') + ';margin-bottom:8px;font-weight:bold;">' + effectDesc + '</div>' +
                '<div style="font-size:0.75rem;color:#888;margin-bottom:8px;">' + (ev.type === 'buff' ? '✦ 增益效果' : ev.type === 'debuff' ? '✧ 减益效果' : '◆ 中性事件') + '</div>' +
                '<button onclick="window._corNext()" class="btn" style="padding:10px 24px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">继续</button>';
            showPanel(html);
        }

        function doShop() {
            var items = SHOP_DEFS.slice().sort(function() { return Math.random() - 0.5; }).slice(0, 4);
            var vc = gState.voidCredits;
            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">🏪 虚空商店</h2>' +
                '<div style="color:' + VOID_CURRENCY.color + ';margin-bottom:12px;">' + VOID_CURRENCY.icon + ' ' + VOID_CURRENCY.name + ': <span style="font-family:Orbitron;font-size:1.1rem;">' + vc + '</span> | 第 ' + gState.floor + ' 层</div>' +
                '<div style="display:grid;gap:10px;margin-bottom:20px;">';
            items.forEach(function(it, idx) {
                var ok = vc >= it.cost;
                html += '<button onclick="window._corBuy(' + idx + ')" style="padding:12px;background:rgba(0,0,0,0.4);border:1px solid ' + (ok ? VOID_CURRENCY.color : '#444') + ';border-radius:10px;color:' + (ok ? '#fff' : '#666') + ';cursor:' + (ok ? 'pointer' : 'not-allowed') + ';text-align:left;">' +
                    '<div style="font-weight:bold;">' + it.icon + ' ' + it.name + '</div>' +
                    '<div style="font-size:0.8rem;color:#aaa;">' + it.desc + '</div>' +
                    '<div style="font-size:0.8rem;color:' + VOID_CURRENCY.color + ';margin-top:4px;">' + it.cost + ' ' + VOID_CURRENCY.name + '</div></button>';
            });
            html += '</div><button onclick="window._corNext()" class="btn" style="padding:8px 20px;background:#333;border:1px solid #555;color:#fff;border-radius:8px;cursor:pointer;">离开商店</button>';
            showPanel(html);
            gState._shopItems = items;
        }

        function doRest() {
            // 休息回复：基于 gState.hp/gState.maxHp 和 gState.shield/gState.maxShield 算出恢复量并应用
            var hpHeal = Math.floor(gState.maxHp * 0.3);
            var oldHp = gState.hp;
            gState.hp = Math.min(gState.maxHp, gState.hp + hpHeal);

            var ms = gState.maxShield || player.maxShield;
            var shieldHeal = Math.floor(ms * 0.3);
            var oldShield = gState.shield;
            gState.shield = Math.min(ms, gState.shield + shieldHeal);

            var actualHpHeal = gState.hp - oldHp;
            var actualShieldHeal = gState.shield - oldShield;
            log('💤 休息回复 ' + actualHpHeal + ' HP，' + actualShieldHeal + ' 护盾');

            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">💤 休息区</h2>' +
                '<div style="font-size:1.1rem;color:#44ff88;margin:15px;">回复了 ' + actualHpHeal + ' HP，' + actualShieldHeal + ' 护盾</div>' +
                '<div style="color:#888;margin-bottom:20px;">HP: ' + gState.hp + '/' + gState.maxHp + ' | 护盾: ' + gState.shield + '/' + ms + '</div>' +
                '<button onclick="window._corNext()" class="btn" style="padding:10px 24px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">继续探索</button>';
            showPanel(html);
        }

        function failRun(reason) {
            gState.active = false;
            gState.inBattle = false;
            // failRun 清空 pendingRewards（不发放）
            gState.pendingRewards = { rout: 0, items: [], xp: 0 };
            hidePanel();
            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">🔬 探索结束</h2>' +
                '<div style="font-size:1.3rem;color:#ff4444;margin:10px;">' + reason + '</div>' +
                '<div style="color:#888;margin-bottom:10px;">到达第 ' + gState.floor + ' 层</div>' +
                '<div style="color:#ff4444;font-size:0.85rem;margin-bottom:15px;">未领取的奖励已丢失</div>' +
                '<button onclick="window._corClose()" class="btn" style="padding:10px 30px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">返回</button>';
            showPanel(html);
        }

        function endRun(msg) {
            gState.active = false;
            gState.inBattle = false;
            window._corpusMissionActive = false;
            hidePanel();

            var pr = gState.pendingRewards;
            var floor = gState.floor;
            var maxFloor = gState.maxFloor;
            // 层次计算经验：21层通关100%，按比例分配
            var xpPercent = Math.min(100, Math.floor(floor / maxFloor * 100));
            var lossPercent = 100 - xpPercent;
            var actualXP = Math.floor(pr.xp * xpPercent / 100);
            // 将实际可获得经验保存到 pendingRewards 中（claimRewards 会使用）
            pr.actualXP = actualXP;
            pr.xpPercent = xpPercent;

            var itemLines = '';
            if (pr.items.length > 0) {
                itemLines = pr.items.map(function(it) {
                    return '<div style="font-size:0.75rem;color:#aaa;">' + it.icon + ' ' + it.name + ' x' + it.amount + '</div>';
                }).join('');
            }

            var xpDisplay = lossPercent > 0
                ? '<span style="font-family:Orbitron;color:#66bbff;font-size:0.9rem;">📈 ' + actualXP + ' XP</span> <span style="color:#ff4444;font-size:0.75rem;">(-' + lossPercent + '%)</span>'
                : '<span style="font-family:Orbitron;color:#66bbff;font-size:0.9rem;">📈 ' + actualXP + ' XP</span> <span style="color:#44ff88;font-size:0.75rem;">(100%)</span>';

            var html =
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:10px;">🔬 探索结束</h2>' +
                '<div style="font-size:1.2rem;color:#44ff88;margin:10px;">' + msg + '</div>' +
                '<div style="color:#888;margin-bottom:10px;">到达第 ' + floor + ' 层</div>' +
                '<div style="background:rgba(0,0,0,0.4);border:1px solid #c8a84b;border-radius:10px;padding:12px;margin:10px 0;">' +
                    '<div style="font-size:0.8rem;color:#c8a84b;margin-bottom:6px;">━━ 奖励汇总 ━━</div>' +
                    '<div style="font-family:Orbitron;color:#c8a84b;font-size:1rem;">💰 ' + pr.rout + ' Rout</div>' +
                    '<div style="margin-top:4px;">' + xpDisplay + '</div>' +
                    (itemLines ? '<div style="margin-top:6px;">' + itemLines + '</div>' : '<div style="font-size:0.75rem;color:#555;margin-top:4px;">无物品掉落</div>') +
                '</div>' +
                '<button onclick="window._corClaim()" class="btn" style="padding:10px 30px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">领取并返回</button>';
            showPanel(html);
        }

        function claimRewards() {
            var pr = gState.pendingRewards;
            var actualXP = pr.actualXP || pr.xp || 0;
            if (pr.rout > 0) safeAddRout(pr.rout);
            if (actualXP > 0) {
                safeAddXP(actualXP);
                // 强制更新信息页UI
                try { if (typeof updateInfoUI === 'function') updateInfoUI(); } catch (e) {}
            }
            pr.items.forEach(function(it) {
                safeAddToWarehouse(it.name, it.icon, it.amount, it.type);
            });
            safeSave();
            // 清空 pendingRewards
            gState.pendingRewards = { rout: 0, items: [], xp: 0 };
            // 恢复被隐藏的肃清按钮
            if (gState && gState._hiddenBtns) {
                for (var hb = 0; hb < gState._hiddenBtns.length; hb++) {
                    gState._hiddenBtns[hb].style.display = '';
                }
                gState._hiddenBtns = [];
            }
            gState = null;
            hidePanel();
            // 恢复之前的 page-section，避免空白页面
            restoreSavedSection();
            _savedSection = null;
        }

        function render() {
            var opts = gState.opts;
            if (!opts || !opts.length) { gState.opts = genOpts(); opts = gState.opts; }

            var choices = opts.map(function(c, idx) {
                var col = c.cat === 'combat' ? '#ff4444' : c.cat === 'safe' ? '#44ff88' : c.cat === 'event' ? '#ff66ff' : c.cat === 'boss' ? '#ff8844' : '#c8a84b';
                return '<button onclick="window._corPick(' + idx + ')" style="padding:14px;margin:5px;background:rgba(0,0,0,0.4);border:1px solid ' + col + ';border-radius:12px;color:#fff;cursor:pointer;width:100%;max-width:420px;text-align:left;position:relative;">' +
                    '<div style="font-size:1.4rem;position:absolute;right:12px;top:50%;transform:translateY(-50%);opacity:0.3;">' + c.icon + '</div>' +
                    '<div style="font-weight:bold;margin-bottom:3px;">' + c.icon + ' ' + c.name + '</div>' +
                    '<div style="font-size:0.8rem;color:#aaa;">' + c.desc + '</div></button>';
            }).join('');

            var buffs = gState.buffs.map(function(b) { return '<span style="margin:0 3px;padding:2px 6px;background:rgba(200,168,75,0.15);border:1px solid #c8a84b;border-radius:6px;font-size:0.7rem;color:#c8a84b;">' + b.name + '</span>'; }).join('');
            var hpPct = Math.max(0, gState.hp / gState.maxHp * 100);
            var hpCol = hpPct > 50 ? '#44ff88' : '#ff4444';
            var shieldPct = Math.max(0, (gState.shield || 0) / ((gState.maxShield || player.maxShield) || 1) * 100);
            var logs = gState.logs.slice(-8).map(function(l) { return '<div style="font-size:0.75rem;color:#aaa;margin:2px 0;">' + l + '</div>'; }).join('');

            var pr = gState.pendingRewards;

            // 积攒奖励面板
            var xpPercent = Math.min(100, Math.floor(gState.floor / gState.maxFloor * 100));
            var lossPercent = 100 - xpPercent;

            var html =
                '<div style="position:relative;">' +
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:6px;">🔬 回廊阶层</h2>' +
                '<div style="color:#888;font-size:0.85rem;margin-bottom:4px;">第 <span style="color:#fff;font-family:Orbitron;">' + gState.floor + '</span> / ' + gState.maxFloor + ' 层</div>' +
                // HP和攻击/防御信息放在标题行下的小字行
                '<div style="font-size:0.7rem;color:#aaa;margin-bottom:8px;">' +
                    'HP: <span style="color:' + hpCol + ';font-family:Orbitron;">' + gState.hp + '/' + gState.maxHp + '</span> ' +
                    '护盾: <span style="color:#66bbff;font-family:Orbitron;">' + (gState.shield || 0) + '/' + (gState.maxShield || player.maxShield) + '</span> ' +
                    '等级: <span style="color:#ffcc66;font-family:Orbitron;">' + player.level + '</span>' +
                '</div>' +
                '<div style="display:flex;gap:8px;justify-content:center;margin-bottom:10px;">' +
                    '<div style="flex:1;padding:6px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid #333;">' +
                        '<div style="font-size:0.65rem;color:#888;">积攒奖励</div>' +
                        '<div style="font-family:Orbitron;color:#c8a84b;font-size:0.85rem;">💰 <span id="corPendingRout">' + pr.rout + '</span> Rout</div>' +
                        '<div style="font-size:0.7rem;color:#aaa;margin-top:2px;"><span id="corPendingItems">' + pr.items.length + '</span> 件物品</div>' +
                        '<div style="font-size:0.7rem;color:#66bbff;margin-top:2px;">📈 ' + (pr.xp || 0) + ' XP (' + xpPercent + '%)</div>' +
                        
                    '</div>' +
                    '<div style="flex:1;padding:6px;background:rgba(0,0,0,0.3);border-radius:8px;border:1px solid ' + VOID_CURRENCY.color + '30;">' +
                        '<div style="font-size:0.65rem;color:#888;">即时货币</div>' +
                        '<div style="font-family:Orbitron;color:' + VOID_CURRENCY.color + ';font-size:0.85rem;">' + VOID_CURRENCY.icon + ' ' + gState.voidCredits + '</div>' +
                        '<div style="font-size:0.7rem;color:#aaa;margin-top:2px;">' + VOID_CURRENCY.name + '</div>' +
                        '<div style="font-size:0.6rem;color:#555;margin-top:2px;">用于虚空商店</div>' +
                    '</div>' +
                '</div>' +
                '<div style="margin-bottom:8px;">' + (buffs || '<span style="color:#555;font-size:0.7rem;">暂无强化</span>') + '</div>' +
                '<div style="display:flex;flex-direction:column;align-items:center;">' + choices + '</div>' +
                '<div style="margin-top:10px;"><button onclick="window._corGiveUp()" style="padding:5px 14px;background:rgba(0,0,0,0.3);border:1px solid #555;border-radius:6px;color:#888;cursor:pointer;font-size:0.7rem;">🛡️ 保险撤离（结算奖励）</button></div>' +
                '<div style="text-align:left;background:rgba(0,0,0,0.4);border:1px solid #333;border-radius:8px;padding:8px;height:110px;overflow-y:auto;margin-top:10px;">' + logs + '</div>' +
                '</div>';
            showPanel(html);
        }

        // 全局回调
        window._corPick = function(idx) {
            if (!gState.active || gState.inBattle) return;
            var opt = gState.opts[idx];
            if (!opt) return;
            if (opt.cat === 'shop') doShop();
            else if (opt.cat === 'rest') doRest();
            else if (opt.cat === 'event') doEvent();
            else if (opt.cat === 'safe') {
                var vcGain = rollVoidCredits(opt.id);
                gState.voidCredits += vcGain;
                if (vcGain > 0) log(VOID_CURRENCY.icon + ' ' + opt.name + '中发现 ' + vcGain + ' ' + VOID_CURRENCY.name);
                else log('...没有发现敌人，继续前进');
                safeSave();
                nextFloor();
            } else startBattle(opt);
        };
        window._corBuy = function(idx) {
            var it = gState._shopItems[idx];
            if (!it) return;
            if (gState.voidCredits < it.cost) { showToast(VOID_CURRENCY.name + '不足', 'error'); return; }
            gState.voidCredits -= it.cost;
            it.apply(gState);
            gState.buffs.push({ id: it.id, name: it.name });
            showToast('购买成功：' + it.name, 'success');
            doShop();
        };
        window._corNext = function() { nextFloor(); };
        window._corClose = function() {
            if (gState && gState._hiddenBtns) {
                for (var hb = 0; hb < gState._hiddenBtns.length; hb++) {
                    gState._hiddenBtns[hb].style.display = '';
                }
                gState._hiddenBtns = [];
            }
            window._corpusMissionActive = false;
            gState = null; hidePanel(); restoreSavedSection(); _savedSection = null;
        };
        window._corClaim = function() { claimRewards(); };
        window._corGiveUp = function() {
            if (!gState || !gState.active) return;
            var floor = gState.floor;
            var maxFloor = gState.maxFloor;
            var pr = gState.pendingRewards;
            var xpPercent = Math.min(100, Math.floor(floor / maxFloor * 100));
            var lossPercent = 100 - xpPercent;
            var actualXP = Math.floor((pr.xp || 0) * xpPercent / 100);

            // 自定义确认弹窗
            var confirmHtml =
                '<div style="text-align:center;padding:20px;">' +
                '<h2 style="color:#c8a84b;font-family:Orbitron;margin-bottom:15px;">🛡️ 保险撤离确认</h2>' +
                '<div style="color:#aaa;margin-bottom:10px;">当前到达第 <span style="color:#fff;font-family:Orbitron;">' + floor + '</span> / ' + maxFloor + ' 层</div>' +
                '<div style="background:rgba(0,0,0,0.4);border:1px solid #333;border-radius:10px;padding:12px;margin:10px 0;text-align:left;">' +
                    '<div style="font-size:0.8rem;color:#888;margin-bottom:6px;">撤离奖励预览</div>' +
                    '<div style="font-family:Orbitron;color:#c8a84b;font-size:1rem;">💰 ' + pr.rout + ' Rout</div>' +
                    '<div style="margin-top:4px;"><span style="font-family:Orbitron;color:#66bbff;font-size:0.9rem;">📈 ' + actualXP + ' XP</span> <span style="color:#ff4444;font-size:0.75rem;">(-' + lossPercent + '%)</span></div>' +
                    (pr.items.length > 0 ? '<div style="font-size:0.75rem;color:#aaa;margin-top:4px;">' + pr.items.length + ' 件物品</div>' : '') +
                '</div>' +
                '<div style="color:#ff4444;font-size:0.8rem;margin-bottom:15px;">未通关撤离将有所损失，确定要撤离吗？</div>' +
                '<div style="display:flex;gap:10px;justify-content:center;">' +
                    '<button onclick="window._corGiveUpConfirm()" class="btn" style="padding:10px 24px;background:linear-gradient(135deg,#c8a84b,#ffcc66);color:#000;border:none;border-radius:8px;cursor:pointer;">确认撤离</button>' +
                    '<button onclick="window._corGiveUpCancel()" class="btn" style="padding:10px 24px;background:rgba(0,0,0,0.3);border:1px solid #555;border-radius:8px;color:#fff;cursor:pointer;">继续探索</button>' +
                '</div>' +
                '</div>';
            showPanel(confirmHtml);
        };
        window._corGiveUpConfirm = function() {
            if (!gState || !gState.active) return;
            endRun('保险撤离，到达第 ' + gState.floor + ' 层');
        };
        window._corGiveUpCancel = function() {
            // 取消撤离，回到当前层选择
            render();
        };

        gState.active = true;
        window._corpusMissionActive = true;
        gState.opts = genOpts();
        render();
        log('🔮 进入虚空回廊，共21层。');
    }

    // ===== 入口 =====
    window.openCorpusMission = function(type, planetId, zone) {
        try {
            startCorridor(zone, planetId);
        } catch (e) {
            showToast('任务启动失败: ' + e.message, 'error');
        }
    };
})();
