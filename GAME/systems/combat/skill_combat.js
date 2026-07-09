// ═══════════════════════════════════════════════════════════════
//  技能战斗系统 (skill_combat.js)
//  基于 Warframe 风格的技能驱动战斗，CSS 动画表现
// ═══════════════════════════════════════════════════════════════

(function() {
    'use strict';

    // ========== 防御检查 ==========
    if (typeof WARFRAMES === 'undefined') {
        window.WARFRAMES = {};
    }

    // ========== 节奏伤害预设 ==========
    // 目的：少管具体攻击力，主要靠威胁等级、技能表现和状态制造压力。
    var PLAYER_DAMAGE_RATIOS = {
        basic_attack: 0.07,
        slash_dash: 0.15,
        radial_blind: 0.06,
        radial_javelin: 0.20,
        exalted_blade: 0.30,
        shock: 0.14,
        speed: 0,
        electric_shield: 0,
        discharge: 0.24,
        pull: 0.10,
        magnetize: 0,
        polarize: 0.18,
        crush: 0.26
    };

    var ENEMY_THREAT_DAMAGE_RATIOS = {
        normal: 0.07,
        elite: 0.11,
        boss: 0.22,
        mechanic: 0.28,
        super: 0.36
    };

    // ========== 战甲技能定义 ==========
    // 每个战甲 4 个技能，配置化驱动
    var WARFRAME_SKILLS = {
        excalibur: [
            {
                id: 'slash_dash',
                name: '突斩',
                icon: '⚔️',
                energyCost: 25,
                cooldown: 2,
                castTime: 620,
                hitTime: 310,
                damageMultiplier: 2.4,
                damageType: 'slash',
                range: 'line',
                statusText: '切割异常',
                bleedDuration: 2,
                bleedDamageRatio: 0.25,
                description: '参考 Slash Dash：疾冲穿过敌人，造成切割伤害',
                animClass: 'anim-slash-dash',
                color: '#00d4ff'
            },
            {
                id: 'radial_blind',
                name: '致盲',
                icon: '✨',
                energyCost: 50,
                cooldown: 8,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 0.25,
                damageType: 'blast',
                range: 'aoe',
                stunDuration: 2,
                finisherExpose: true,
                description: '参考 Radial Blind：强光致盲附近敌人，造成少量伤害和控制',
                animClass: 'anim-radial-blind',
                color: '#ffd700'
            },
            {
                id: 'radial_javelin',
                name: '标枪',
                icon: '🔱',
                energyCost: 75,
                cooldown: 10,
                castTime: 1000,
                hitTime: 500,
                damageMultiplier: 3.2,
                damageType: 'slash',
                range: 'multi',
                hitCount: 4,
                bleedDuration: 2,
                bleedDamageRatio: 0.20,
                description: '参考 Radial Javelin：放出能量标枪刺穿附近敌人并附加切割',
                animClass: 'anim-radial-javelin',
                color: '#ff4444'
            },
            {
                id: 'exalted_blade',
                name: '显赫剑',
                icon: '⚡',
                energyCost: 100,
                cooldown: 15,
                castTime: 1200,
                hitTime: 600,
                damageMultiplier: 3.8,
                damageType: 'slash',
                range: 'line',
                buffDuration: 4,
                buffMultiplier: 1.65,
                bleedDuration: 3,
                bleedDamageRatio: 0.20,
                description: '参考 Exalted Blade：召唤纯光之剑，强化后续伤害并附加切割',
                animClass: 'anim-exalted-blade',
                color: '#ff66ff'
            }
        ],
        volt: [
            {
                id: 'shock',
                name: '电击',
                icon: '⚡',
                energyCost: 25,
                cooldown: 2,
                castTime: 500,
                hitTime: 250,
                damageMultiplier: 1.9,
                damageType: 'electric',
                range: 'single',
                stunDuration: 1,
                chainCount: 2,
                description: '参考 Shock：电弧弹体伤害并短暂电击目标',
                animClass: 'anim-shock',
                color: '#4488ff'
            },
            {
                id: 'speed',
                name: '加速',
                icon: '💨',
                energyCost: 50,
                cooldown: 10,
                castTime: 600,
                hitTime: 300,
                damageMultiplier: 0,
                damageType: 'none',
                range: 'self',
                buffDuration: 4,
                buffType: 'speed',
                buffMultiplier: 1.35,
                energyGain: 10,
                description: '参考 Speed：化身电流，提升自身行动节奏并回少量能量',
                animClass: 'anim-speed',
                color: '#00d4ff'
            },
            {
                id: 'electric_shield',
                name: '电盾',
                icon: '🛡️',
                energyCost: 75,
                cooldown: 12,
                castTime: 700,
                hitTime: 350,
                damageMultiplier: 0,
                damageType: 'none',
                range: 'self',
                buffDuration: 3,
                buffType: 'shield',
                shieldAmount: 120,
                damageReflect: 0.25,
                description: '参考 Electric Shield：展开电磁屏障，补充护盾并反弹少量伤害',
                animClass: 'anim-electric-shield',
                color: '#88ccff'
            },
            {
                id: 'discharge',
                name: '放电',
                icon: '💥',
                energyCost: 100,
                cooldown: 15,
                castTime: 1000,
                hitTime: 500,
                damageMultiplier: 3.6,
                damageType: 'electric',
                range: 'aoe',
                stunDuration: 2,
                description: '参考 Discharge：释放体内电流，范围电击、麻痹并造成高伤害',
                animClass: 'anim-discharge',
                color: '#ffaa00'
            }
        ],
        mag: [
            {
                id: 'pull',
                name: '牵引',
                icon: '🧲',
                energyCost: 25,
                cooldown: 3,
                castTime: 600,
                hitTime: 300,
                damageMultiplier: 1.7,
                damageType: 'magnetic',
                range: 'single',
                stunDuration: 1,
                description: '参考 Pull：用磁力漩涡牵引并眩晕敌人',
                animClass: 'anim-pull',
                color: '#ff66ff'
            },
            {
                id: 'magnetize',
                name: '磁化',
                icon: '🌀',
                energyCost: 50,
                cooldown: 8,
                castTime: 700,
                hitTime: 350,
                damageMultiplier: 0,
                damageType: 'none',
                range: 'target',
                buffDuration: 4,
                buffType: 'magnetize',
                damageReflect: 0.45,
                dotDamageRatio: 0.35,
                description: '参考 Magnetize：制造磁化力场，吸收火力并反射/持续伤害',
                animClass: 'anim-magnetize',
                color: '#cc44ff'
            },
            {
                id: 'polarize',
                name: '极化',
                icon: '💎',
                energyCost: 75,
                cooldown: 10,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 2.2,
                damageType: 'magnetic',
                range: 'aoe',
                armorStrip: 0.45,
                shieldRestoreRatio: 0.35,
                description: '参考 Polarize：脉冲削减敌方护甲/护盾，同时恢复自身护盾',
                animClass: 'anim-polarize',
                color: '#ff44ff'
            },
            {
                id: 'crush',
                name: '粉碎',
                icon: '💀',
                energyCost: 100,
                cooldown: 15,
                castTime: 1100,
                hitTime: 550,
                damageMultiplier: 3.7,
                damageType: 'magnetic',
                range: 'aoe',
                stunDuration: 2,
                description: '参考 Crush：磁化敌人骨骼并压碎，造成高伤害和控制',
                animClass: 'anim-crush',
                color: '#ff00ff'
            }
        ],
        rhino: [
            {
                id: 'rhino_charge',
                name: '犀牛冲锋',
                icon: '🦏',
                energyCost: 25,
                cooldown: 3,
                castTime: 600,
                hitTime: 300,
                damageMultiplier: 2.2,
                damageType: 'impact',
                range: 'line',
                knockback: true,
                description: '向前冲锋造成冲击伤害',
                animClass: 'anim-rhino-charge',
                color: '#888888'
            },
            {
                id: 'iron_skin',
                name: '钢化皮肤',
                icon: '🛡️',
                energyCost: 50,
                cooldown: 12,
                castTime: 700,
                hitTime: 350,
                damageMultiplier: 0,
                damageType: 'none',
                range: 'self',
                buffDuration: 5,
                buffType: 'shield',
                shieldAmount: 200,
                damageReflect: 0.35,
                description: '获得无敌护盾',
                animClass: 'anim-iron-skin',
                color: '#aaaaaa'
            },
            {
                id: 'roar',
                name: '战吼',
                icon: '📢',
                energyCost: 75,
                cooldown: 12,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 1.5,
                damageType: 'impact',
                range: 'aoe',
                buffDuration: 4,
                buffType: 'damage',
                buffMultiplier: 1.5,
                description: '范围伤害加成buff',
                animClass: 'anim-roar',
                color: '#ffaa00'
            },
            {
                id: 'rhino_stomp',
                name: '犀牛践踏',
                icon: '💥',
                energyCost: 100,
                cooldown: 15,
                castTime: 1000,
                hitTime: 500,
                damageMultiplier: 3.5,
                damageType: 'impact',
                range: 'aoe',
                stunDuration: 2,
                description: '范围击倒+高伤害',
                animClass: 'anim-rhino-stomp',
                color: '#ff4444'
            }
        ],
        ash: [
            {
                id: 'shuriken',
                name: '手里剑',
                icon: '🗡️',
                energyCost: 25,
                cooldown: 2,
                castTime: 500,
                hitTime: 250,
                damageMultiplier: 2.0,
                damageType: 'slash',
                range: 'single',
                bleedDuration: 2,
                bleedDamageRatio: 0.25,
                description: '投掷手里剑造成切割伤害',
                animClass: 'anim-shuriken',
                color: '#666666'
            },
            {
                id: 'smoke_screen',
                name: '烟幕',
                icon: '💨',
                energyCost: 50,
                cooldown: 10,
                castTime: 600,
                hitTime: 300,
                damageMultiplier: 0,
                damageType: 'none',
                range: 'self',
                buffDuration: 2,
                buffType: 'stealth',
                evasionBonus: 0.65,
                description: '隐身+回避',
                animClass: 'anim-smoke-screen',
                color: '#444444'
            },
            {
                id: 'teleport',
                name: '瞬移',
                icon: '✨',
                energyCost: 75,
                cooldown: 8,
                castTime: 700,
                hitTime: 350,
                damageMultiplier: 3.5,
                damageType: 'slash',
                range: 'single',
                finisherExpose: true,
                description: '瞬移到敌人身后造成高伤害',
                animClass: 'anim-teleport',
                color: '#8800ff'
            },
            {
                id: 'blade_storm',
                name: '剑刃风暴',
                icon: '⚔️',
                energyCost: 100,
                cooldown: 15,
                castTime: 1200,
                hitTime: 600,
                damageMultiplier: 4.0,
                damageType: 'slash',
                range: 'multi',
                hitCount: 6,
                bleedDuration: 3,
                bleedDamageRatio: 0.30,
                description: '多次攻击造成大量切割伤害',
                animClass: 'anim-blade-storm',
                color: '#ff0000'
            }
        ],
        ember: [
            {
                id: 'fireball',
                name: '火球',
                icon: '🔥',
                energyCost: 25,
                cooldown: 2,
                castTime: 500,
                hitTime: 250,
                damageMultiplier: 2.2,
                damageType: 'heat',
                range: 'single',
                burnDuration: 1,
                burnDamageRatio: 0.20,
                burnChance: 0.2,
                description: '投掷火球造成火焰伤害',
                animClass: 'anim-fireball',
                color: '#ff6600'
            },
            {
                id: 'accelerant',
                name: '浴火献祭',
                icon: '⚡',
                energyCost: 50,
                cooldown: 10,
                castTime: 700,
                hitTime: 350,
                damageMultiplier: 1.0,
                damageType: 'heat',
                range: 'aoe',
                stunDuration: 2,
                buffDuration: 4,
                buffType: 'fire_damage',
                buffMultiplier: 1.5,
                burnDuration: 2,
                burnDamageRatio: 0.20,
                burnChance: 0.25,
                description: '增加火焰伤害+眩晕',
                animClass: 'anim-accelerant',
                color: '#ffaa00'
            },
            {
                id: 'fire_blast',
                name: '火焰冲击',
                icon: '💥',
                energyCost: 75,
                cooldown: 10,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 2.8,
                damageType: 'heat',
                range: 'aoe',
                burnDuration: 2,
                burnDamageRatio: 0.25,
                burnChance: 0.25,
                description: '范围火焰爆发',
                animClass: 'anim-fire-blast',
                color: '#ff4400'
            },
            {
                id: 'world_on_fire',
                name: '地狱烈焰',
                icon: '🔥',
                energyCost: 100,
                cooldown: 15,
                castTime: 1000,
                hitTime: 500,
                damageMultiplier: 2.5,
                damageType: 'heat',
                range: 'aoe',
                buffDuration: 5,
                buffType: 'aura_fire',
                burnDuration: 3,
                burnDamageRatio: 0.30,
                burnChance: 0.35,
                description: '持续燃烧周围敌人',
                animClass: 'anim-world-on-fire',
                color: '#ff0000'
            }
        ]
    };

    // ========== 敌人通用技能 ==========
    // 所有敌人共用一套技能，根据敌人类型自动选择
    var ENEMY_SKILLS = {
        // 近战型（屠夫、重击手、天蝎等）
        melee: [
            {
                id: 'melee_slash',
                name: '挥砍',
                icon: '⚔️',
                cooldown: 2,
                castTime: 500,
                hitTime: 250,
                damageMultiplier: 1.0,
                range: 'single',
                animClass: 'anim-enemy-slash',
                color: '#ff4444'
            },
            {
                id: 'heavy_strike',
                name: '重击',
                icon: '👊',
                cooldown: 5,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 2.0,
                range: 'single',
                staggerChance: 0.3,
                animClass: 'anim-enemy-heavy',
                color: '#ff8844'
            }
        ],
        // 远程型（枪兵、弩炮、追踪者等）
        ranged: [
            {
                id: 'rifle_shot',
                name: '射击',
                icon: '🔫',
                cooldown: 2,
                castTime: 400,
                hitTime: 200,
                damageMultiplier: 0.8,
                range: 'single',
                animClass: 'anim-enemy-shot',
                color: '#ffaa00'
            },
            {
                id: 'grenade',
                name: '榴弹',
                icon: '💥',
                cooldown: 6,
                castTime: 700,
                hitTime: 500,
                damageMultiplier: 1.5,
                range: 'aoe',
                animClass: 'anim-enemy-grenade',
                color: '#ff6644'
            }
        ],
        // Boss 型（执法员、轰击者、重型机枪手等）
        boss: [
            {
                id: 'boss_attack',
                name: '强力攻击',
                icon: '⚔️',
                cooldown: 2,
                castTime: 600,
                hitTime: 300,
                damageMultiplier: 1.2,
                range: 'single',
                animClass: 'anim-enemy-boss-attack',
                color: '#ff4444'
            },
            {
                id: 'boss_special',
                name: '特殊攻击',
                icon: '💀',
                cooldown: 5,
                castTime: 900,
                hitTime: 450,
                damageMultiplier: 2.5,
                range: 'aoe',
                staggerChance: 0.4,
                animClass: 'anim-enemy-boss-special',
                color: '#ff0000'
            }
        ],
        // 精英型（指挥官、驯兽师等）
        elite: [
            {
                id: 'elite_attack',
                name: '精准打击',
                icon: '🎯',
                cooldown: 2,
                castTime: 500,
                hitTime: 250,
                damageMultiplier: 1.1,
                range: 'single',
                animClass: 'anim-enemy-elite-attack',
                color: '#ffd700'
            },
            {
                id: 'elite_skill',
                name: '战术技能',
                icon: '⚡',
                cooldown: 6,
                castTime: 800,
                hitTime: 400,
                damageMultiplier: 2.0,
                range: 'aoe',
                buffType: 'self_damage',
                buffDuration: 2,
                buffMultiplier: 1.3,
                animClass: 'anim-enemy-elite-skill',
                color: '#ff8800'
            }
        ]
    };

    // ========== 敌人家族技能 ==========
    // 这里按 enemies.js 的中文名字关键词匹配，不需要改 enemies.js
    function enemySkill(id, name, icon, damageMultiplier, cooldown, castTime, hitTime, animClass, color, extra) {
        var skill = {
            id: id,
            name: name,
            icon: icon,
            cooldown: cooldown || 3,
            castTime: castTime || 650,
            hitTime: hitTime || Math.floor((castTime || 650) * 0.5),
            damageMultiplier: damageMultiplier,
            range: 'single',
            animClass: animClass || 'anim-enemy-shot',
            color: color || '#ff8844'
        };
        if (extra) {
            for (var key in extra) skill[key] = extra[key];
        }
        return skill;
    }

    var ENEMY_FAMILY_SKILLS = {
        butcher: [
            enemySkill('grineer_cleave', '突进切割', '⚔️', 0.85, 2, 520, 260, 'anim-enemy-slash', '#ff4444'),
            enemySkill('grineer_combo_slash', '三连斩', '🩸', 1.25, 5, 760, 420, 'anim-enemy-heavy', '#ff3355', { bleedChance: 0.35 })
        ],
        flameblade: [
            enemySkill('flameblade_rift_strike', '裂隙火刃', '🔥', 1.35, 4, 720, 360, 'anim-enemy-heavy', '#ff6633', { burnChance: 0.55 }),
            enemySkill('flameblade_teleport_slash', '瞬移双斩', '🟣', 1.15, 3, 620, 320, 'anim-enemy-slash', '#bb66ff')
        ],
        scorpion: [
            enemySkill('scorpion_hook', '钩索拖拽', '⛓️', 1.05, 4, 760, 420, 'anim-enemy-shot', '#ffaa44', { staggerChance: 0.45 }),
            enemySkill('scorpion_combo', '弯刀连击', '⚔️', 0.95, 2, 560, 280, 'anim-enemy-slash', '#ff4444')
        ],
        shieldLancer: [
            enemySkill('shield_lancer_bash', '盾牌冲撞', '🛡️', 1.15, 4, 720, 380, 'anim-enemy-heavy', '#88ccff', { staggerChance: 0.5, selfShield: 35 }),
            enemySkill('shield_lancer_viper', '盾后射击', '🔫', 0.75, 2, 460, 230, 'anim-enemy-shot', '#ffaa00')
        ],
        ballista: [
            enemySkill('ballista_snipe', '狙击蓄力', '🎯', 1.75, 5, 900, 650, 'anim-enemy-elite-attack', '#ff3333'),
            enemySkill('ballista_puncture', '穿刺射击', '🔴', 1.0, 2, 520, 280, 'anim-enemy-shot', '#ff7777')
        ],
        eviscerator: [
            enemySkill('eviscerator_sawblade', '回旋锯刃', '🪚', 1.2, 3, 680, 360, 'anim-enemy-shot', '#ff4455', { bleedChance: 0.55 }),
            enemySkill('eviscerator_carve', '开膛切割', '🩸', 1.0, 2, 560, 280, 'anim-enemy-slash', '#ff2233')
        ],
        trooper: [
            enemySkill('trooper_shotgun', '霰弹爆射', '💥', 0.95, 2, 520, 260, 'anim-enemy-shot', '#ffaa55'),
            enemySkill('trooper_close_blast', '近距轰击', '🔶', 1.25, 4, 650, 340, 'anim-enemy-grenade', '#ff8844', { staggerChance: 0.25 })
        ],
        lancer: [
            enemySkill('lancer_grakata', '葛拉卡扫射', '🔫', 0.75, 2, 480, 240, 'anim-enemy-shot', '#ffaa00'),
            enemySkill('lancer_burst', '短点射', '💢', 0.95, 3, 560, 300, 'anim-enemy-elite-attack', '#ffcc66')
        ],
        scorch: [
            enemySkill('scorch_flamethrower', '火焰喷射', '🔥', 1.05, 3, 780, 420, 'anim-enemy-grenade', '#ff6622', { burnChance: 0.6 }),
            enemySkill('scorch_ignite', '燃烧压制', '♨️', 0.85, 2, 560, 300, 'anim-enemy-shot', '#ff8844')
        ],
        seeker: [
            enemySkill('seeker_latcher', '追踪地雷', '🧨', 1.15, 4, 760, 520, 'anim-enemy-grenade', '#ffcc33', { staggerChance: 0.3 }),
            enemySkill('seeker_pistol', '追踪射击', '🔫', 0.8, 2, 480, 240, 'anim-enemy-shot', '#ffaa00')
        ],
        hellion: [
            enemySkill('hellion_missile_barrage', '导弹齐射', '🚀', 1.45, 5, 920, 560, 'anim-enemy-grenade', '#ff8844', { staggerChance: 0.35 }),
            enemySkill('hellion_jet_fire', '喷射扫射', '🔥', 0.95, 3, 660, 340, 'anim-enemy-shot', '#ffaa00')
        ],
        bombard: [
            enemySkill('bombard_homing_rocket', '追踪火箭', '🚀', 1.65, 5, 900, 560, 'anim-enemy-boss-special', '#ff6633', { staggerChance: 0.4 }),
            enemySkill('bombard_seismic_slam', '震地冲击', '💥', 1.15, 4, 720, 380, 'anim-enemy-heavy', '#ff8844', { staggerChance: 0.45 })
        ],
        mortarBombard: [
            enemySkill('mortar_bombard_shell', '迫击炮落点', '☄️', 1.9, 6, 1050, 760, 'anim-enemy-boss-special', '#ff5533', { staggerChance: 0.35 }),
            enemySkill('bombard_homing_rocket', '追踪火箭', '🚀', 1.45, 5, 900, 560, 'anim-enemy-grenade', '#ff6633')
        ],
        napalm: [
            enemySkill('napalm_fire_bomb', '燃烧榴弹', '🔥', 1.45, 5, 900, 540, 'anim-enemy-grenade', '#ff3300', { burnChance: 0.75 }),
            enemySkill('napalm_heat_wave', '热浪冲击', '♨️', 1.05, 3, 680, 360, 'anim-enemy-boss-attack', '#ff6633')
        ],
        heavyGunner: [
            enemySkill('heavy_gunner_suppress', '压制扫射', '🔫', 1.15, 3, 820, 450, 'anim-enemy-boss-attack', '#ffaa00'),
            enemySkill('heavy_gunner_slam', '重型震地', '💥', 1.25, 5, 760, 400, 'anim-enemy-heavy', '#ff8844', { staggerChance: 0.35 })
        ],
        commander: [
            enemySkill('commander_switch_teleport', '换位传送', '🌀', 0.75, 6, 900, 520, 'anim-enemy-elite-skill', '#ff9900', { staggerChance: 0.65 }),
            enemySkill('commander_grakata_sustain', '指挥官扫射', '🔫', 1.0, 2, 620, 320, 'anim-enemy-elite-attack', '#ffd700')
        ],
        beastMaster: [
            enemySkill('drahk_master_summon', '召唤兽群', '🐺', 1.25, 5, 900, 560, 'anim-enemy-elite-skill', '#ffaa44'),
            enemySkill('drahk_master_halikar', '哈利卡缴械', '🪃', 0.95, 4, 740, 420, 'anim-enemy-shot', '#ffcc66', { energyDrain: 15 })
        ],
        beast: [
            enemySkill('beast_pounce', '野兽扑咬', '🐾', 1.05, 2, 560, 280, 'anim-enemy-slash', '#ff6644', { bleedChance: 0.25 }),
            enemySkill('beast_rend', '撕裂爪击', '🩸', 1.3, 4, 700, 360, 'anim-enemy-heavy', '#ff3355', { bleedChance: 0.45 })
        ],
        manic: [
            enemySkill('manic_cloak_pounce', '隐身突袭', '👹', 1.55, 4, 820, 460, 'anim-enemy-heavy', '#cc44ff', { bleedChance: 0.6 }),
            enemySkill('manic_rend', '撕裂处决', '🩸', 1.85, 6, 920, 560, 'anim-enemy-boss-special', '#ff2244', { bleedChance: 0.75 })
        ],
        nox: [
            enemySkill('nox_toxic_glob', '毒液黏弹', '☣️', 1.25, 3, 760, 460, 'anim-enemy-grenade', '#66ff66', { toxinChance: 0.75 }),
            enemySkill('nox_charge', '毒罐冲撞', '🧪', 1.45, 5, 860, 480, 'anim-enemy-heavy', '#88ff44', { staggerChance: 0.45, toxinChance: 0.45 })
        ],
        vor: [
            enemySkill('vor_seer_burst', '三连锁定', '🔫', 0.92, 2, 3200, 2400, 'anim-enemy-shot', '#ffcc66'),
            enemySkill('vor_janus_beam', '裂隙光束', '🔑', 1.48, 5, 3800, 2800, 'anim-enemy-boss-special', '#ffd36a', { staggerChance: 0.32, energyDrain: 10 }),
            enemySkill('vor_nervos_mine', '雷网封锁', '🧨', 1.12, 4, 3600, 2700, 'anim-enemy-grenade', '#ffaa44', { staggerChance: 0.55 }),
            enemySkill('vor_teleport_shot', '裂隙换位', '🌀', 1.02, 3, 3000, 2250, 'anim-enemy-elite-skill', '#ff9966'),
            enemySkill('vor_sphere_shield', '球形屏障', '🛡️', 0.64, 6, 3600, 2700, 'anim-enemy-boss-special', '#72d7ff', { selfShieldRatio: 0.42 })
        ],
        // ═══ Corpus 敌人技能 ═══
        corpusCrewman: [
            // 船员：Dera持续射击 + 等离子手雷
            enemySkill('corpus_dera_burst', 'Dera连射', '🔫', 0.75, 2, 500, 250, 'anim-enemy-shot', '#66bbff'),
            enemySkill('corpus_plasma_grenade', '等离子手雷', '🧨', 1.15, 4, 750, 480, 'anim-enemy-grenade', '#00ddff', { staggerChance: 0.35 })
        ],
        corpusDetron: [
            // 德特昂船员：近距散弹直射HP + 电击棍近战
            enemySkill('corpus_detron_blast', 'Detron散弹', '💥', 1.35, 3, 620, 340, 'anim-enemy-heavy', '#ff8844'),
            enemySkill('corpus_prova_shock', 'Prova电击', '⚡', 1.0, 2, 500, 280, 'anim-enemy-slash', '#00ccff', { staggerChance: 0.4 })
        ],
        corpusElite: [
            // 精英船员：强化Supra压制射击 + 护盾超载（按比例回盾）
            enemySkill('corpus_supra_suppress', 'Supra压制', '🔫', 0.95, 2, 700, 400, 'anim-enemy-elite-attack', '#4488ff'),
            enemySkill('corpus_shield_overcharge', '护盾超载', '⚡', 0.6, 5, 900, 500, 'anim-enemy-elite-skill', '#66bbff', { selfShieldRatio: 0.15, buffDuration: 3 })
        ],
        corpusVoid: [
            // Nullifier反制使：反制力场 + Lanka狙击
            enemySkill('corpus_nullify_field', '反制力场', '🌀', 0.8, 5, 900, 550, 'anim-enemy-boss-attack', '#aa44ff', { energyDrain: 30, staggerChance: 0.3 }),
            enemySkill('corpus_lanka_snipe', 'Lanka狙击', '🎯', 1.55, 4, 1000, 700, 'anim-enemy-elite-attack', '#8844ff')
        ],
        corpusSniper: [
            // 狙击船员：Lanka蓄力 + Prova电棍
            enemySkill('corpus_lanka_charge', 'Lanka蓄力', '🎯', 1.75, 5, 1050, 750, 'anim-enemy-elite-attack', '#ff4444'),
            enemySkill('corpus_prova_stun', 'Prova电棍', '⚡', 0.95, 3, 580, 320, 'anim-enemy-slash', '#00ccff', { staggerChance: 0.45 })
        ],
        corpusTechnician: [
            // 技师：Supra持续压制 + 部署护盾Osprey（按比例回盾）
            enemySkill('corpus_supra_hail', 'Supra冰雹', '🔫', 1.05, 2, 750, 420, 'anim-enemy-elite-attack', '#ffcc66'),
            enemySkill('corpus_deploy_osprey', '部署Osprey', '🛸', 0.7, 5, 850, 520, 'anim-enemy-elite-skill', '#66ddff', { selfShieldRatio: 0.12 })
        ],
        corpusMechanic: [
            // 机械师：蜂群无人机 + 自动炮塔
            enemySkill('corpus_drone_swarm', '蜂群无人机', '🛸', 1.2, 4, 820, 460, 'anim-enemy-elite-skill', '#ffdd00'),
            enemySkill('corpus_turret_deploy', '自动炮塔', '🔫', 1.35, 5, 900, 520, 'anim-enemy-boss-attack', '#ffaa44')
        ],
        corpusEvictor: [
            // 驱逐员/扰敌员：驱逐脉冲（降低眩晕概率）+ 干扰场域（降低能量吸取）
            enemySkill('corpus_evict_pulse', '驱逐脉冲', '💨', 1.15, 3, 720, 380, 'anim-enemy-elite-skill', '#66aaff', { staggerChance: 0.15 }),
            enemySkill('corpus_disrupt_field', '干扰场域', '🌀', 0.85, 4, 780, 420, 'anim-enemy-elite-attack', '#4488ff', { energyDrain: 15 })
        ],
        corpusBoss: [
            // Boss(Jackal/资料师)：能量超载 + 护盾虹吸（按比例回盾）+ 科技弹幕 + 数据炸弹
            enemySkill('corpus_energy_overload', '⚡', 1.45, 4, 950, 560, 'anim-enemy-boss-special', '#ffcc00', { staggerChance: 0.4 }),
            enemySkill('corpus_shield_drain', '护盾虹吸', '🛡️', 1.25, 5, 1050, 680, 'anim-enemy-boss-attack', '#ffaa00', { selfShieldRatio: 0.2 }),
            enemySkill('corpus_tech_barrage', '科技弹幕', '🔫', 1.15, 3, 820, 460, 'anim-enemy-boss-attack', '#ffdd66'),
            enemySkill('corpus_data_bomb', '数据炸弹', '💣', 1.65, 6, 1200, 800, 'anim-enemy-boss-special', '#ff4444', { staggerChance: 0.55 })
        ],
        // ===== 恐鸟类技能 =====
        corpusMoa: [
            enemySkill('moa_plasma_rifle', '激光连射', '🔫', 0.85, 2, 400, 220, 'anim-enemy-shot', '#44ff88'),
            enemySkill('moa_kick', '踢击', '🦿', 1.1, 3, 500, 280, 'anim-enemy-slash', '#aaaaaa', { staggerChance: 0.3 })
        ],
        corpusMoaReverse: [
            enemySkill('reverse_moa_beam', '逆进激光炮', '🔫', 1.1, 3, 500, 300, 'anim-enemy-shot', '#88ccff'),
            enemySkill('reverse_moa_charge', '逆进冲撞', '💥', 1.3, 4, 550, 320, 'anim-enemy-slash', '#66aaff', { staggerChance: 0.4 })
        ],
        corpusMoaLava: [
            enemySkill('lava_moa_ignis', '火焰喷射', '🔥', 1.05, 3, 450, 260, 'anim-enemy-shot', '#ff6622', { burnChance: 0.6, burnDuration: 2, burnDamageRatio: 0.15 }),
            enemySkill('lava_moa_wave', '热浪冲击', '🌊', 1.2, 4, 550, 300, 'anim-enemy-slash', '#ff8844', { burnChance: 0.4, burnDuration: 1, burnDamageRatio: 0.1 })
        ],
        corpusMoaRailgun: [
            enemySkill('railgun_moa_shot', '磁轨炮', '⚡', 1.75, 5, 600, 380, 'anim-enemy-shot', '#4488ff', { staggerChance: 0.3 }),
            enemySkill('railgun_moa_drone', '部署无人机', '🛸', 0.7, 6, 500, 200, 'anim-enemy-shot', '#aaaacc', { selfShieldChance: 0.1 })
        ],
        corpusMoaShock: [
            enemySkill('shock_moa_stomp', '震荡践踏', '💥', 1.0, 3, 500, 280, 'anim-enemy-slash', '#ffaa00', { staggerChance: 0.45 }),
            enemySkill('shock_moa_rifle', '等离子步枪', '🔫', 0.9, 2, 400, 240, 'anim-enemy-shot', '#ffcc44')
        ],
        corpusMoaMini: [
            enemySkill('mini_moa_laser', '微型激光', '💡', 0.7, 1, 300, 180, 'anim-enemy-shot', '#88ffaa'),
            enemySkill('mini_moa_self_destruct', '自爆', '💣', 2.0, 8, 400, 350, 'anim-enemy-shot', '#ff4444', { selfDestruct: true })
        ],
        corpusMoaFusion: [
            enemySkill('fusion_moa_beam', '聚焦光束', '烧', 1.15, 3, 550, 300, 'anim-enemy-shot', '#ff8844', { burnChance: 0.5, burnDuration: 2, burnDamageRatio: 0.12 }),
            enemySkill('fusion_moa_drone', '部署无人机', '🛸', 0.75, 5, 500, 220, 'anim-enemy-shot', '#ccccee', { selfShieldChance: 0.08 })
        ],
        corpusMoaDisc: [
            enemySkill('disc_moa_launch', '能量弹发射', '🔘', 1.0, 2, 400, 250, 'anim-enemy-shot', '#66aaff'),
            enemySkill('disc_moa_ricochet', '弹射圆盘', '💫', 1.2, 3, 450, 280, 'anim-enemy-shot', '#88ccff', { staggerChance: 0.2 })
        ],
        corpusMoaDera: [
            enemySkill('dera_moa_burst', '德拉步枪连射', '🔫', 0.9, 2, 400, 230, 'anim-enemy-shot', '#ffaa66'),
            enemySkill('dera_moa_grenade', '德拉榴弹', '💣', 1.3, 4, 500, 300, 'anim-enemy-shot', '#ff8844', { staggerChance: 0.25 })
        ],
        corpusMoaTwin: [
            enemySkill('twin_moa_rockets', '双发爆炸弹', '🚀', 1.5, 4, 550, 350, 'anim-enemy-shot', '#ff6644', { staggerChance: 0.3 }),
            enemySkill('twin_moa_suppress', '压制射击', '🔫', 0.85, 2, 400, 240, 'anim-enemy-shot', '#ff8866')
        ],
        corpusMoaCryo: [
            enemySkill('cryo_moa_freeze', '冰冻射线', '❄', 0.95, 3, 500, 280, 'anim-enemy-shot', '#88ddff', { staggerChance: 0.35 }),
            enemySkill('cryo_moa_beam', '冷冻光束', '💙', 1.1, 3, 550, 300, 'anim-enemy-shot', '#aaddff', { staggerChance: 0.25 })
        ],
        corpusMoaElite: [
            enemySkill('amalgam_moa_heal', '相位治疗', '💚', 0.5, 5, 600, 150, 'anim-enemy-shot', '#44ff88', { selfHealChance: 0.3 }),
            enemySkill('amalgam_moa_shot', '能量弹', '⚡', 1.2, 3, 500, 300, 'anim-enemy-shot', '#88aaff'),
            enemySkill('amalgam_moa_stomp', '震荡波', '💥', 1.0, 4, 550, 280, 'anim-enemy-slash', '#aaccff', { staggerChance: 0.4 })
        ],
        corpusMoaDemo: [
            enemySkill('demo_moa_explosive', '爆炸能量球', '💣', 2.0, 4, 600, 400, 'anim-enemy-shot', '#ff4400', { staggerChance: 0.5 }),
            enemySkill('demo_moa_charge', '冲锋引爆', '💥', 2.5, 6, 700, 450, 'anim-enemy-slash', '#ff6600', { selfDestruct: true })
        ],
        defaultRanged: ENEMY_SKILLS.ranged,
        defaultMelee: ENEMY_SKILLS.melee
    };

    // ========== 玩家通用普攻 ==========
    var BASIC_ATTACK_SKILL = {
        id: 'basic_attack',
        name: '普攻',
        icon: '🗡️',
        energyCost: 0,
        energyGain: 15,
        cooldown: 0,
        castTime: 450,
        hitTime: 220,
        damageMultiplier: 1.0,
        damageType: 'slash',
        range: 'single',
        description: '不消耗能量，命中后回复 15 点能量',
        animClass: 'anim-basic-attack',
        color: '#ffffff'
    };

    // ========== 战斗状态 ==========
    var SkillCombat = {
        isActive: false,
        isPlayerTurn: true,
        isAnimating: false,
        player: null,
        enemy: null,
        playerCooldowns: [0, 0, 0, 0],
        enemyCooldowns: [],
        playerBuffs: [],
        playerDebuffs: [],
        enemyDebuffs: [],
        turnCount: 0,
        playerTookDirectHitThisRound: false,
        enemyTookDirectHitThisRound: false,
        battleInterval: null,
        energyRegenRate: 5,  // 每回合恢复能量
        vorInteraction: null,
        vorMechanicSerial: 0,
        vorPressure: 0,
        lastVorPhaseName: '',
        playerActionHistory: [],
        repeatedPatternStacks: 0,
        enemyAdaptedOnce: false,
        vorPhaseTransitionTriggered: false,
        vorPhaseTransitionPending: false,
        vorPhaseTransitionPlaying: false,
        vorAdaptationTriggered: false,
        vorNextDamageReduction: 0,
        onBattleEnd: null
    };

    // ========== 初始化战斗 ==========
    function initSkillCombat(playerData, enemyData, options) {
        // 停止之前的战斗
        stopSkillCombat();

        var wfKey = playerData.warframe_type || 'excalibur';
        var wf = WARFRAMES[wfKey] || WARFRAMES.excalibur;
        var wfLevel = playerData.level || 1;

        SkillCombat.player = {
            name: wf.name || 'Tenno',
            icon: wf.icon || '🥷',
            image: playerData.image || wf.image || '',
            type: wfKey,
            level: wfLevel,
            hp: playerData.hp || (80 + (wfLevel - 1) * 5),
            maxHp: playerData.maxHp || (80 + (wfLevel - 1) * 5),
            shield: playerData.shield || (60 + (wfLevel - 1) * 4),
            maxShield: playerData.maxShield || playerData.shield || (60 + (wfLevel - 1) * 4),
            energy: playerData.energy || 100,
            maxEnergy: playerData.maxEnergy || 100,
            attack: playerData.attack || (20 + (wfLevel - 1) * 3),
            defense: playerData.defense || (10 + (wfLevel - 1) * 1),
            armor: playerData.armor || (10 + (wfLevel - 1) * 1),
            speed: playerData.speed || 10,
            skills: WARFRAME_SKILLS[wfKey] || WARFRAME_SKILLS.excalibur
        };

        SkillCombat.enemy = {
            name: enemyData.name || '未知敌人',
            icon: enemyData.icon || '🔴',
            image: enemyData.image || '',
            mirror: enemyData.mirror === true,
            type: enemyData.type || 'normal',
            threatLevel: enemyData.threatLevel || (enemyData.combatThreat && enemyData.combatThreat.level) || getThreatLevelFromType(enemyData.type),
            threatTag: enemyData.threatTag || (enemyData.combatThreat && enemyData.combatThreat.tag) || getThreatTagFromLevel(enemyData.threatLevel || getThreatLevelFromType(enemyData.type)),
            combatThreat: enemyData.combatThreat || null,
            level: enemyData.level || 1,
            hp: enemyData.hp || enemyData.maxHp || 100,
            maxHp: enemyData.maxHp || 100,
            // 如果敌人已有护盾数据（由 makeEnemy 计算），不再覆盖
            shield: (enemyData.shield !== undefined && enemyData.shield > 0) ? enemyData.shield : (enemyData.maxShield || Math.floor((enemyData.maxHp || 100) * getEnemyShieldRatio(enemyData))),
            maxShield: (enemyData.shield !== undefined && enemyData.shield > 0) ? (enemyData.maxShield || enemyData.shield) : (enemyData.maxShield || Math.floor((enemyData.maxHp || 100) * getEnemyShieldRatio(enemyData))),
            attack: enemyData.attack || 15,
            defense: enemyData.defense || 5,
            armor: enemyData.armor || 0,
            speed: enemyData.speed || 8,
            skills: getEnemySkillSet(enemyData),
            isStunned: false,
            stunTurns: 0
        };
        SkillCombat.player.threatSuppressed = isMechanicPlusThreat(SkillCombat.enemy) && wfLevel < Math.min(20, SkillCombat.enemy.level * 0.6);

        SkillCombat.isActive = true;
        SkillCombat.isPlayerTurn = true;
        SkillCombat.isAnimating = false;
        SkillCombat.playerCooldowns = [0, 0, 0, 0];
        SkillCombat.enemyCooldowns = SkillCombat.enemy.skills.map(function() { return 0; });
        SkillCombat.playerBuffs = [];
        SkillCombat.playerDebuffs = [];
        SkillCombat.enemyDebuffs = [];
        SkillCombat.turnCount = 0;
        SkillCombat.vorPressure = 0;
        SkillCombat.lastVorPhaseName = '';
        SkillCombat.playerActionHistory = [];
        SkillCombat.repeatedPatternStacks = 0;
        SkillCombat.enemyAdaptedOnce = false;
        SkillCombat.vorPhaseTransitionTriggered = false;
        SkillCombat.vorPhaseTransitionPending = false;
        SkillCombat.vorPhaseTransitionPlaying = false;
        SkillCombat.vorAdaptationTriggered = false;
        SkillCombat.vorNextDamageReduction = 0;
        SkillCombat.playerTookDirectHitThisRound = false;
        SkillCombat.enemyTookDirectHitThisRound = false;
        SkillCombat.onBattleEnd = (options && options.onBattleEnd) || null;
        document.body.classList.add('skill-combat-running');
        document.body.classList.toggle('skill-combat-boss-vor', (SkillCombat.enemy.name || '').indexOf('沃尔上尉') !== -1);

        // 注入技能栏 UI
        injectSkillBarUI();

        // 更新 UI
        updateBattleUI();

        // 写入日志
        appendBattleLog('<div style="color: var(--orokin-cyan); font-weight: 700;">═══ 战斗开始 ═══</div>');
        //appendBattleLog('<div style="color: var(--tenno-gold);">' + SkillCombat.player.name + ' Lv.' + SkillCombat.player.level + ' VS ' + SkillCombat.enemy.name + ' Lv.' + SkillCombat.enemy.level + '</div>');
        appendBattleLog('<div style="color: #888;">选择技能进行攻击，技能模式实验中...</div>');
        // 自动肃清模式：战斗开始后自动释放第一个技能
        if (window.autoSkillMode) {
            setTimeout(function() {
                if (SkillCombat.isActive && SkillCombat.isPlayerTurn && !SkillCombat.isAnimating) {
                    tryAutoCastSkills();
                }
            }, 600);
        }
        if (isVorBoss(SkillCombat.enemy)) {
            announceVorPhaseIfChanged(true);
        }
        if (SkillCombat.player.threatSuppressed) {
            appendBattleLog('<div style="color:#ff8844;">⚠️ 等级压制：你当前造成伤害 -25%，受到伤害 +15%。</div>');
        }

        return SkillCombat;
    }

    // ========== 获取敌人技能组 ==========
    function getEnemySkillSet(enemyData) {
        if (typeof enemyData === 'string') {
            enemyData = { type: enemyData, name: '' };
        }
        enemyData = enemyData || {};
        var name = enemyData.name || '';
        var type = enemyData.type || 'normal';

        // 先按中文敌人名匹配，覆盖全部前缀变体
        if (name.indexOf('沃尔上尉') !== -1) return ENEMY_FAMILY_SKILLS.vor;
        if (name.indexOf('迫击炮轰击者') !== -1) return ENEMY_FAMILY_SKILLS.mortarBombard;
        if (name.indexOf('火焰轰击者') !== -1) return ENEMY_FAMILY_SKILLS.napalm;
        if (name.indexOf('轰击者') !== -1) return ENEMY_FAMILY_SKILLS.bombard;
        if (name.indexOf('毒化者') !== -1) return ENEMY_FAMILY_SKILLS.nox;
        if (name.indexOf('狂躁者') !== -1) return ENEMY_FAMILY_SKILLS.manic;
        if (name.indexOf('指挥官') !== -1) return ENEMY_FAMILY_SKILLS.commander;
        if (name.indexOf('重型机枪手') !== -1 || name.indexOf('机枪手') !== -1) return ENEMY_FAMILY_SKILLS.heavyGunner;
        if (name.indexOf('爪喀驯兽师') !== -1 || name.indexOf('鬣猫驯兽师') !== -1) return ENEMY_FAMILY_SKILLS.beastMaster;
        if (name.indexOf('爪喀') !== -1 || name.indexOf('鬣猫') !== -1) return ENEMY_FAMILY_SKILLS.beast;
        if (name.indexOf('骑兵') !== -1) return ENEMY_FAMILY_SKILLS.hellion;
        if (name.indexOf('追踪者') !== -1 || name.indexOf('追踪兵') !== -1) return ENEMY_FAMILY_SKILLS.seeker;
        if (name.indexOf('怒焚者') !== -1) return ENEMY_FAMILY_SKILLS.scorch;
        if (name.indexOf('恶徒') !== -1) return ENEMY_FAMILY_SKILLS.trooper;
        if (name.indexOf('开膛者') !== -1) return ENEMY_FAMILY_SKILLS.eviscerator;
        if (name.indexOf('弩炮') !== -1) return ENEMY_FAMILY_SKILLS.ballista;
        if (name.indexOf('盾枪兵') !== -1) return ENEMY_FAMILY_SKILLS.shieldLancer;
        if (name.indexOf('天蝎') !== -1) return ENEMY_FAMILY_SKILLS.scorpion;
        if (name.indexOf('烈焰刀客') !== -1) return ENEMY_FAMILY_SKILLS.flameblade;
        if (name.indexOf('屠夫') !== -1 || name.indexOf('禁卫军') !== -1 || name.indexOf('重击手') !== -1 || name.indexOf('猛力爪兵') !== -1 || name.indexOf('掠食者') !== -1 || name.indexOf('执法员') !== -1 || name.indexOf('掠夺者') !== -1) return ENEMY_FAMILY_SKILLS.butcher;
        if (name.indexOf('枪兵') !== -1) return ENEMY_FAMILY_SKILLS.lancer;

        // Corpus 敌人匹配（名字关键词）
        if (enemyData.faction === 'corpus' || enemyData.faction === 'Corpus') {
            if (name.indexOf('引能船员') !== -1 || name.indexOf('资料师') !== -1) return ENEMY_FAMILY_SKILLS.corpusBoss;
            if (name.indexOf('机械师') !== -1 || name.indexOf('锤骨') !== -1 || name.indexOf('爆破型') !== -1) return ENEMY_FAMILY_SKILLS.corpusMechanic;
            if (name.indexOf('驱逐员') !== -1 || name.indexOf('扰敌员') !== -1) return ENEMY_FAMILY_SKILLS.corpusEvictor;
            if (name.indexOf('狙击手') !== -1) return ENEMY_FAMILY_SKILLS.corpusSniper;
            if (name.indexOf('技师') !== -1 || name.indexOf('技工') !== -1) return ENEMY_FAMILY_SKILLS.corpusTechnician;
            if (name.indexOf('虚能') !== -1) return ENEMY_FAMILY_SKILLS.corpusVoid;
            if (name.indexOf('精英') !== -1) return ENEMY_FAMILY_SKILLS.corpusElite;
            if (name.indexOf('德特昂') !== -1) return ENEMY_FAMILY_SKILLS.corpusDetron;
            if (name.indexOf('船员') !== -1) return ENEMY_FAMILY_SKILLS.corpusCrewman;
            // ===== 恐鸟类名称匹配 =====
            if (name.indexOf('逆进恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaReverse;
            if (name.indexOf('熔岩恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaLava;
            if (name.indexOf('融合恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaFusion;
            if (name.indexOf('圆盘恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaDisc;
            if (name.indexOf('德拉恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaDera;
            if (name.indexOf('双子炮恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaTwin;
            if ((name.indexOf('冷冻光束步枪恐鸟') !== -1) || (name.indexOf('冷冻') !== -1 && name.indexOf('恐鸟') !== -1)) return ENEMY_FAMILY_SKILLS.corpusMoaCryo;
            if (name.indexOf('磁轨炮恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaRailgun;
            if (name.indexOf('震荡恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaShock;
            if (name.indexOf('微型恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaMini;
            if (name.indexOf('金流') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaElite;
            if (name.indexOf('爆破型') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoaDemo;
            if (name.indexOf('恐鸟') !== -1) return ENEMY_FAMILY_SKILLS.corpusMoa; // 兜底
        }

        switch(type) {
            case 'boss': return ENEMY_SKILLS.boss;
            case 'elite': return ENEMY_SKILLS.elite;
            case 'mechanic': return ENEMY_SKILLS.boss;
            case 'super': return ENEMY_SKILLS.boss;
            default: return ENEMY_SKILLS.ranged; // 默认远程
        }
    }

    function getEnemyShieldRatio(enemyData) {
        if (!enemyData) return 0;
        var faction = enemyData.faction || '';
        var type = enemyData.type || 'normal';
        // Corpus: 高护盾比例
        if (faction === 'corpus') {
            if (type === 'boss' || type === 'mechanic' || type === 'super') return 0.75;
            if (type === 'elite') return 0.65;
            return 0.55;
        }
        // Grineer: 低护盾比例（但保证有护盾）
        if (faction === 'grineer') {
            if (type === 'boss' || type === 'mechanic' || type === 'super') return 0.25;
            if (type === 'elite') return 0.18;
            return 0.10;
        }
        // 其他派系
        if (type === 'boss' || type === 'mechanic' || type === 'super') return 0.25;
        if (type === 'elite') return 0.18;
        return 0;
    }

    function getThreatLevelFromType(type) {
        if (type === 'super') return 5;
        if (type === 'mechanic') return 4;
        if (type === 'boss') return 3;
        if (type === 'elite') return 2;
        return 1;
    }

    function getThreatTagFromLevel(level) {
        if (level >= 5) return 'super';
        if (level >= 4) return 'mechanic';
        if (level >= 3) return 'boss';
        if (level >= 2) return 'elite';
        return 'normal';
    }

    function getEntityTotalMax(entity) {
        if (!entity) return 100;
        return Math.max(1, (entity.maxHp || entity.hp || 100) + (entity.maxShield || 0));
    }

    function getPlayerSkillDamageRatio(skill) {
        if (!skill || skill.damageMultiplier <= 0) return 0;
        if (PLAYER_DAMAGE_RATIOS.hasOwnProperty(skill.id)) {
            return PLAYER_DAMAGE_RATIOS[skill.id];
        }
        // 兜底：旧技能按倍率压缩到合理区间，避免直接沿用大倍率秒杀。
        return Math.max(0.06, Math.min(0.24, 0.08 + (skill.damageMultiplier || 1) * 0.045));
    }

    function getEnemyThreatTag(enemy) {
        if (!enemy) return 'normal';
        if (enemy.combatThreat && enemy.combatThreat.tag) return enemy.combatThreat.tag;
        if (enemy.threatTag) return enemy.threatTag;
        return getThreatTagFromLevel(enemy.threatLevel || getThreatLevelFromType(enemy.type));
    }

    function isMechanicPlusThreat(enemy) {
        var tag = getEnemyThreatTag(enemy);
        var level = enemy && (enemy.threatLevel || (enemy.combatThreat && enemy.combatThreat.level));
        return tag === 'mechanic' || tag === 'super' || level >= 4;
    }

    function getEnemySkillThreatWeight(skill) {
        if (!skill) return 1;
        if (skill.id === 'basic_attack') return 0.68;
        if (isVorSkill(skill)) {
            if (skill.id === 'vor_janus_beam') return 1.42;
            if (skill.id === 'vor_nervos_mine') return 1.26;
            if (skill.id === 'vor_teleport_shot') return 1.18;
            if (skill.id === 'vor_seer_burst') return 1.08;
            if (skill.id === 'vor_sphere_shield') return 0.72;
        }
        if (skill.cooldown >= 6) return 1.24;
        if (skill.cooldown >= 5) return 1.15;
        if (skill.cooldown <= 2) return 0.82;
        return 1;
    }

    function isVorBoss(enemy) {
        return !!(enemy && (enemy.name || '').indexOf('沃尔上尉') !== -1);
    }

    function getEnemyHpPercent(enemy) {
        if (!enemy || !enemy.maxHp) return 1;
        return Math.max(0, Math.min(1, enemy.hp / enemy.maxHp));
    }

    function isVorSkillUnlocked(skill, enemy) {
        if (!isVorBoss(enemy) || !isVorSkill(skill)) return true;
        var hpPct = getEnemyHpPercent(enemy);
        if (skill.id === 'vor_seer_burst') return true;
        if (skill.id === 'vor_nervos_mine') return hpPct <= 0.75;
        if (skill.id === 'vor_teleport_shot') return hpPct <= 0.60;
        if (skill.id === 'vor_sphere_shield') return hpPct <= 0.50;
        if (skill.id === 'vor_janus_beam') return hpPct <= 0.40;
        return true;
    }

    function getVorPhaseName(enemy) {
        var hpPct = getEnemyHpPercent(enemy);
        if (hpPct <= 0.40) return '全副武装';
        if (hpPct <= 0.50) return '场域干扰';
        if (hpPct <= 0.60) return '裂隙换位';
        if (hpPct <= 0.75) return '雷网封锁';
        return '试探射击';
    }

    function getVorPhaseHint(enemy) {
        var hpPct = getEnemyHpPercent(enemy);
        if (hpPct <= 0.40) return '沃尔可使用裂隙光束';
        if (hpPct <= 0.50) return '出现雅努斯场域，沃尔可使用球形屏障';
        if (hpPct <= 0.60) return '沃尔可使用裂隙换位';
        if (hpPct <= 0.75) return '沃尔可使用雷网封锁';
        return '沃尔正在试探，注意保留能力';
    }

    function announceVorPhaseIfChanged(force) {
        var enemy = SkillCombat.enemy;
        if (!isVorBoss(enemy)) return;
        var phase = getVorPhaseName(enemy);
        if (!force && SkillCombat.lastVorPhaseName === phase) return;
        SkillCombat.lastVorPhaseName = phase;
        appendBattleLog('<div style="color:#ffd36a;">◆ 风险变量：' + phase + '（HP ' + Math.ceil(getEnemyHpPercent(enemy) * 100) + '%）｜' + getVorPhaseHint(enemy) + '</div>');
    }

    function recordPlayerActionPattern(actionKey) {
        SkillCombat.playerActionHistory.push(actionKey);
        var len = SkillCombat.playerActionHistory.length;
        // 检测连续重复：最后3个相同即触发识破
        if (len >= 3) {
            var last1 = SkillCombat.playerActionHistory[len - 1];
            var last2 = SkillCombat.playerActionHistory[len - 2];
            var last3 = SkillCombat.playerActionHistory[len - 3];
            if (last1 === last2 && last2 === last3) {
                // 连续4个以上更深识破
                var isDeep = len >= 4 && SkillCombat.playerActionHistory[len - 4] === last1;
                if (isDeep) {
                    SkillCombat.repeatedPatternStacks = Math.min(3, SkillCombat.repeatedPatternStacks + 1);
                    appendBattleLog('<div style="color:#ff4444; font-weight:700;">👁️ 敌人完全识破了你的固定套路 [' + last1 + ']！伤害大幅降低。</div>');
                    return Math.max(0.25, 1 - SkillCombat.repeatedPatternStacks * 0.15);
                } else {
                    appendBattleLog('<div style="color:#ffaa00;">⚠️ 敌人识破了重复动作 [' + last1 + ']，本次伤害降低。</div>');
                    return 0.75;
                }
            }
        }
        return 1;
    }

    function playVorPhaseTransition(done) {
        if (!SkillCombat.isActive || !SkillCombat.enemy || SkillCombat.vorPhaseTransitionPlaying) {
            if (done) done();
            return;
        }
        SkillCombat.vorPhaseTransitionPending = false;
        SkillCombat.vorPhaseTransitionPlaying = true;
        SkillCombat.isAnimating = true;
        document.body.classList.add('skill-combat-vor-janus-awake');

        var arena = document.querySelector('.battle-stage') || document.getElementById('autoBattleArea') || document.getElementById('battleArea');
        var overlay = document.createElement('div');
        overlay.id = 'vor-phase-transition-overlay';
        overlay.style.cssText = 'position:absolute; inset:0; z-index:5000; display:flex; align-items:center; justify-content:center; text-align:center; background:radial-gradient(circle at center, rgba(255,211,106,0.22), rgba(42,12,0,0.86) 58%, rgba(0,0,0,0.96)); border:1px solid rgba(255,211,106,0.5); box-shadow:inset 0 0 70px rgba(255,170,60,0.28); pointer-events:none; animation: vorPhasePulse 2.6s ease-in-out forwards;';
        overlay.innerHTML =
            '<div style="padding:22px 26px; max-width:520px; border-radius:16px; background:rgba(0,0,0,0.58); border:1px solid rgba(255,211,106,0.55); box-shadow:0 0 35px rgba(255,170,60,0.28);">' +
                '<div style="font-size:3rem; filter:drop-shadow(0 0 18px #ffd36a);">🔑</div>' +
                '<div style="font-family:Orbitron; color:#ffd36a; font-size:1.18rem; margin:8px 0;">雅努斯之钥觉醒</div>' +
                '<div style="color:#ddd; font-size:0.82rem; line-height:1.8;">沃尔上尉强行开启虚空场地，护盾开始重构。</div>' +
            '</div>';
        if (arena) {
            var oldPos = getComputedStyle(arena).position;
            if (oldPos === 'static') arena.style.position = 'relative';
            arena.appendChild(overlay);
        }

        appendBattleLog('<div style="color:#ffd36a; font-weight:700;">🔑 雅努斯之钥觉醒，沃尔进入二阶段。</div>');

        // 护盾渐进回复：分12次Tick，每次可视化更新
        var enemy = SkillCombat.enemy;
        var shieldTarget = Math.min(enemy.maxShield, enemy.shield + Math.floor(enemy.maxShield * 0.45));
        var shieldGap = shieldTarget - enemy.shield;
        var tickCount = 12;
        var tickAmount = Math.max(1, Math.floor(shieldGap / tickCount));
        var tickIndex = 0;
        var shieldTimer = setInterval(function() {
            if (!SkillCombat.isActive || !enemy || enemy.hp <= 0) { clearInterval(shieldTimer); return; }
            tickIndex++;
            var add = (tickIndex >= tickCount) ? (shieldTarget - enemy.shield) : tickAmount;
            enemy.shield = Math.min(enemy.maxShield, enemy.shield + add);
            updateBattleUI();
            if (tickIndex >= tickCount) {
                clearInterval(shieldTimer);
            }
        }, 220);

        setTimeout(function() {
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            SkillCombat.vorPhaseTransitionPlaying = false;
            SkillCombat.isAnimating = false;
            announceVorPhaseIfChanged(true);
            updateBattleUI();
            if (done) done();
        }, 2700);
    }

    function continueAfterPlayerAction() {
        if (SkillCombat.vorPhaseTransitionPending) {
            playVorPhaseTransition(function() {
                if (SkillCombat.enemy.hp <= 0) {
                    onEnemyDeath();
                    return;
                }
                startEnemyTurn();
            });
            return;
        }

        if (SkillCombat.enemy.hp <= 0) {
            onEnemyDeath();
            return;
        }

        startEnemyTurn();
    }

    function isManicEnemy(enemy) {
        return !!(enemy && enemy.name && enemy.name.indexOf('狂躁者') !== -1);
    }

    function tryManicHealthLock(enemy, incomingDamage) {
        if (!isManicEnemy(enemy) || incomingDamage <= 0 || enemy.hp <= 1) {
            return { triggered: false, damage: incomingDamage };
        }
        var lockFloor = Math.max(1, Math.ceil(enemy.maxHp * 0.22));
        if (enemy.isHpLocked) {
            return {
                triggered: false,
                damage: 0
            };
        }
        if (enemy.manicLockCooldown && enemy.manicLockCooldown > 0) {
            return { triggered: false, damage: incomingDamage };
        }
        if (Math.random() >= 0.32) {
            return { triggered: false, damage: incomingDamage };
        }

        var maxAllowedDamage = Math.max(0, enemy.hp - lockFloor);
        if (maxAllowedDamage <= 0) {
            return { triggered: false, damage: incomingDamage };
        }

        enemy.manicLockCooldown = 2;
        enemy.hpLockEnemyTurns = 2;
        enemy.isHpLocked = true;
        var enemyEl = document.getElementById('battleEnemyIcon');
        if (enemyEl) enemyEl.classList.add('skill-status-manic-locked');
        return {
            triggered: true,
            damage: Math.min(incomingDamage, maxAllowedDamage)
        };
    }

    function clearManicLockBeforeEnemyAction() {
        var enemy = SkillCombat.enemy;
        if (!enemy || !enemy.isHpLocked) return;
        enemy.hpLockEnemyTurns = Math.max(0, (enemy.hpLockEnemyTurns || 1) - 1);
        if (enemy.hpLockEnemyTurns > 0) return;
        enemy.isHpLocked = false;
        enemy.hpLockEnemyTurns = 0;
        var enemyEl = document.getElementById('battleEnemyIcon');
        if (enemyEl) enemyEl.classList.remove('skill-status-manic-locked');
        appendBattleLog('<div style="color: #aaa;">👹 狂躁锁血解除。</div>');
    }

    // ========== 注入技能栏 UI ==========
    function injectSkillBarUI() {
        // 移除旧的技能栏
        var oldBar = document.getElementById('skill-bar-container');
        if (oldBar) oldBar.remove();

        clearEnemyBlindSmoke();

        var logEl = document.getElementById('autoBattleLog');
        if (!logEl) return;

        var container = document.createElement('div');
        container.id = 'skill-bar-container';
        container.className = 'skill-bar-panel';
        container.innerHTML =
            '<div class="skill-bar-title">' +
                '<span>战甲技能</span>' +
                '<span class="skill-bar-hint">普攻按 0 / 空格，技能按 1 / 2 / 3 / 4</span>' +
            '</div>' +
            '<div class="skill-bar-buttons" id="skill-bar-buttons"></div>';

        var buttonWrap = container.querySelector('#skill-bar-buttons');

        var basicBtn = document.createElement('button');
        basicBtn.className = 'skill-btn skill-basic-btn skill-ready';
        basicBtn.id = 'skill-btn-basic';
        basicBtn.innerHTML =
            '<div class="skill-btn-icon">' + BASIC_ATTACK_SKILL.icon + '</div>' +
            '<div class="skill-btn-name">' + BASIC_ATTACK_SKILL.name + '</div>' +
            '<div class="skill-btn-cost">+' + BASIC_ATTACK_SKILL.energyGain + '⚡</div>' +
            '<div class="skill-btn-key">0</div>';
        basicBtn.onclick = function() { playerUseBasicAttack(); };
        buttonWrap.appendChild(basicBtn);

        var skills = SkillCombat.player.skills;
        for (var i = 0; i < skills.length; i++) {
            (function(idx) {
                var skill = skills[idx];
                var btn = document.createElement('button');
                btn.className = 'skill-btn';
                btn.id = 'skill-btn-' + idx;
                btn.setAttribute('data-skill-index', idx);
                btn.innerHTML =
                    '<div class="skill-btn-icon">' + skill.icon + '</div>' +
                    '<div class="skill-btn-name">' + skill.name + '</div>' +
                    '<div class="skill-btn-cost">' + skill.energyCost + '⚡</div>' +
                    '<div class="skill-btn-key">' + (idx + 1) + '</div>' +
                    '<div class="skill-btn-cd-overlay" id="skill-cd-' + idx + '" style="display:none;"></div>';

                btn.onclick = function() { playerUseSkill(idx); };
                buttonWrap.appendChild(btn);
            })(i);
        }

        // 插入到日志前面
        logEl.parentNode.insertBefore(container, logEl);
    }

    // ========== 自动释放技能（AI辅助） ==========
    function tryAutoCastSkills() {
        if (!SkillCombat.isActive || SkillCombat.isAnimating) return;
        var skills = SkillCombat.player.skills;
        if (!skills || !skills.length) {
            playerUseBasicAttack();
            return;
        }
        // 按伤害/效果强度排序，优先释放强力技能
        var sorted = [];
        for (var i = 0; i < skills.length; i++) {
            var sk = skills[i];
            var cd = SkillCombat.playerCooldowns[i] || 0;
            if (cd === 0 && SkillCombat.player.energy >= sk.energyCost) {
                var score = (sk.damage || 0) + (sk.heal || 0) * 0.8 + (sk.bleedDamage || 0) * 2 + (sk.burnDamage || 0) * 2 + (sk.stunChance || 0) * 3 + (sk.shieldGain || 0) * 1.5 + (sk.damageReduction || 0) * 2;
                sorted.push({ idx: i, score: score, skill: sk });
            }
        }
        sorted.sort(function(a, b) { return b.score - a.score; });
        // 释放第一个可用技能；没有可用技能时回退到普攻
        if (sorted.length > 0) {
            var best = sorted[0];
            playerUseSkill(best.idx);
        } else {
            playerUseBasicAttack();
        }
    }

    // ========== 玩家使用技能 ==========
    function playerUseSkill(skillIndex) {
        if (!SkillCombat.isActive || !SkillCombat.isPlayerTurn || SkillCombat.isAnimating) return;

        var skill = SkillCombat.player.skills[skillIndex];
        if (!skill) return;

        // 检查冷却
        if (SkillCombat.playerCooldowns[skillIndex] > 0) {
            appendBattleLog('<div style="color: #888;">⚡ ' + skill.name + ' 冷却中 (' + SkillCombat.playerCooldowns[skillIndex] + ' 回合)</div>');
            return;
        }

        // 检查能量
        if (SkillCombat.player.energy < skill.energyCost) {
            appendBattleLog('<div style="color: #ff8844;">⚡ 能量不足！需要 ' + skill.energyCost + '，当前 ' + SkillCombat.player.energy + '</div>');
            return;
        }

        // 检查眩晕
        if (consumePlayerStun()) {
            appendBattleLog('<div style="color: #ff8844;">😵 你被眩晕了，无法行动！</div>');
            endPlayerTurn();
            return;
        }

        // 锁定状态
        SkillCombat.isAnimating = true;
        SkillCombat.isPlayerTurn = false;

        // 消耗能量
        SkillCombat.player.energy -= skill.energyCost;

        // 设置冷却
        SkillCombat.playerCooldowns[skillIndex] = skill.cooldown;

        // 播放动画
        window.playSkillAnimation('player', skill, function() {
            // 动画命中回调
            resolvePlayerSkill(skill, skillIndex);
        }, function() {
            // 动画结束回调
            SkillCombat.isAnimating = false;
            updateBattleUI();

            clearPlayerDisarmAfterAction();

            // 检查敌人死亡
            if (SkillCombat.enemy.hp <= 0) {
                onEnemyDeath();
                return;
            }

            // 进入敌人回合
            continueAfterPlayerAction();
        });
    }

    // ========== 玩家普攻 ==========
    function playerUseBasicAttack() {
        if (!SkillCombat.isActive || !SkillCombat.isPlayerTurn || SkillCombat.isAnimating) return;

        if (consumePlayerStun()) {
            appendBattleLog('<div style="color: #ff8844;">😵 你被眩晕了，无法行动！</div>');
            endPlayerTurn();
            return;
        }
        if (consumePlayerDisarm()) {
            appendBattleLog('<div style="color: #ffaa00;">🪃 你被缴械了，无法使用普攻！</div>');
            endPlayerTurn();
            return;
        }

        SkillCombat.isAnimating = true;
        SkillCombat.isPlayerTurn = false;

                window.playSkillAnimation('player', BASIC_ATTACK_SKILL, function() {
            resolvePlayerSkill(BASIC_ATTACK_SKILL, -1);
        }, function() {
            SkillCombat.isAnimating = false;
            updateBattleUI();

            if (SkillCombat.enemy.hp <= 0) {
                onEnemyDeath();
                return;
            }

            continueAfterPlayerAction();
        });
    }

    // ========== 结算玩家技能 ==========
    function resolvePlayerSkill(skill, skillIndex) {
        var player = SkillCombat.player;
        var enemy = SkillCombat.enemy;
        var enemyHpBefore = enemy.hp;
        var actionKey = skillIndex < 0 ? '0' : String(skillIndex + 1);
        var patternMultiplier = recordPlayerActionPattern(actionKey);

        // 节奏伤害：按敌人总生存值计算，避免不同敌人因为数值差距导致秒杀或刮痧。
        var ratio = getPlayerSkillDamageRatio(skill);
        if (isVorBoss(enemy) && ratio > 0) {
            ratio *= SkillCombat.vorPhaseTransitionTriggered ? 0.72 : 0.82;
        }
        var baseDamage = getEntityTotalMax(enemy) * ratio;

        // buff 加成
        var buffMultiplier = getBuffMultiplier(player, 'damage');
        baseDamage *= buffMultiplier;

        // 等级只做轻微修正，不再主导伤害
        if (ratio > 0) {
            baseDamage += player.level * 0.8;
        }

        // 伤害浮动
        var variance = 0.90 + Math.random() * 0.2;
        var finalDamage = ratio > 0 ? Math.max(1, Math.floor(baseDamage * variance)) : 0;
        finalDamage = Math.floor(finalDamage * (window.SKILL_COMBAT_PLAYER_DAMAGE_MULT || 1));
        if (SkillCombat.player.threatSuppressed && finalDamage > 0) {
            finalDamage = Math.max(1, Math.floor(finalDamage * 0.75));
        }
        if (patternMultiplier < 1 && finalDamage > 0) {
            finalDamage = Math.max(1, Math.floor(finalDamage * patternMultiplier));
        }

        // 暴击
        var isCrit = finalDamage > 0 && Math.random() < Math.max(0.05, Math.min(0.22, 0.08 + (player.level - enemy.level) * 0.01));
        if (isCrit) {
            finalDamage = Math.floor(finalDamage * 1.55);
        }

        var manicLock = tryManicHealthLock(enemy, finalDamage);
        if (manicLock.triggered) {
            finalDamage = manicLock.damage;
            appendBattleLog('<div style="color: #aaa;">👹 ' + enemy.name + ' 狂躁锁血！</div>');
        } else if (isManicEnemy(enemy) && enemy.isHpLocked && finalDamage <= 0) {
            appendBattleLog('<div style="color: #aaa;">👹 ' + enemy.name + ' 狂躁锁血中，免疫本次伤害。</div>');
        }

        if (enemy.vorExposedTurns && finalDamage > 0) {
            finalDamage = Math.floor(finalDamage * 1.35);
            appendBattleLog('<div style="color: #ffd36a;">🔓 雅努斯节点破裂，沃尔受到暴露增伤！</div>');
        }

        // 护甲减伤
        finalDamage = reduceByArmor(finalDamage, SkillCombat.enemy.armor || 0);

        var damageResult = applyShieldHealthDamage(enemy, finalDamage);

        // ═══ Boss 破盾反制（玩家对 Boss）：Boss 护盾被玩家打碎时 Boss 眩晕 1-2 回合 ═══
        var enemyShieldBefore = enemy.shield + damageResult.shieldDamage;
        if (enemyShieldBefore > 0 && damageResult.shieldDamage > 0 && enemy.shield <= 0
            && (enemy.type === 'boss' || enemy.cardType === 'boss' || enemy.combatThreat)
            && enemy.hp > 0 && SkillCombat.player.hp > 0) {
            var stunTurns = Math.random() < 0.5 ? 1 : 2;
            SkillCombat.enemyDebuffs.push({ type: 'stun', duration: stunTurns, source: 'boss_shield_break' });
            enemy.isStunned = true;
            appendBattleLog('<div style="color:#ffdd44;">💥 ' + enemy.name + ' 的护盾被击碎！护盾反冲使其眩晕 ' + stunTurns + ' 回合！</div>');
            // 浮动文字
            var showDmg2 = true;
            try { showDmg2 = !(gameData && gameData.settings && gameData.settings.showDamageNumbers === false); } catch(e) {}
            if (showDmg2) {
                var enemyIcon = document.getElementById('battleEnemyIcon');
                if (enemyIcon) {
                    var rect = enemyIcon.getBoundingClientRect();
                    var floatEl = document.createElement('div');
                    floatEl.className = 'skill-damage-float';
                    floatEl.textContent = '💥 破盾眩晕!';
                    floatEl.style.color = '#ffdd44';
                    floatEl.style.left = (rect.left + rect.width / 2) + 'px';
                    floatEl.style.top = rect.top + 'px';
                    floatEl.style.fontSize = '1.1rem';
                    document.body.appendChild(floatEl);
                    setTimeout(function() { floatEl.remove(); }, 1200);
                }
            }
        }

        if (isVorBoss(enemy) && !SkillCombat.vorPhaseTransitionTriggered && enemyHpBefore > enemy.maxHp * 0.5 && enemy.hp <= enemy.maxHp * 0.5) {
            enemy.hp = Math.max(1, Math.ceil(enemy.maxHp * 0.5));
            SkillCombat.vorPhaseTransitionTriggered = true;
            SkillCombat.vorPhaseTransitionPending = true;
            enemy.isStunned = false;
            enemy.stunTurns = 0;
        } else if (!SkillCombat.enemyAdaptedOnce && !isVorBoss(enemy) && enemyHpBefore > 1 && enemy.hp <= 0 && SkillCombat.playerActionHistory.length >= 4) {
            enemy.hp = 1;
            SkillCombat.enemyAdaptedOnce = true;
            appendBattleLog('<div style="color:#ffaa00;">⚠️ ' + enemy.name + ' 临场适应并准备反击。</div>');
        }
        // ═══════════════════════════════════════════════════════════════
        //  沃尔上尉·临场适应：同一动作连续3次以上且本次将击杀时保留10HP并反击
        // ═══════════════════════════════════════════════════════════════
        if (isVorBoss(enemy) && !SkillCombat.vorAdaptationTriggered && enemyHpBefore > 10 && enemy.hp <= 0) {
            var hist = SkillCombat.playerActionHistory;
            var histLen = hist.length;
            if (histLen >= 3) {
                var last = hist[histLen - 1];
                var consecutive = 1;
                for (var hi = histLen - 2; hi >= 0; hi--) {
                    if (hist[hi] === last) consecutive++;
                    else break;
                }
                if (consecutive >= 3) {
                    enemy.hp = 10;
                    SkillCombat.vorAdaptationTriggered = true;
                    appendBattleLog('<div style="color:#ff4444; font-weight:700;">👁️ 沃尔上尉临场适应！保留 10 HP 并发动反击！</div>');
                    // 立即反击：造成基于攻击力的真实伤害
                    var counterDmg = Math.max(1, Math.floor(enemy.attack * 1.15));
                    var counterResult = applyShieldHealthDamage(player, counterDmg);
                    appendBattleLog('<div style="color:#ff4444;">⚔️ 沃尔反击造成 ' + counterResult.hpDamage + ' 伤害' + (counterResult.shieldDamage > 0 ? '，护盾吸收 ' + counterResult.shieldDamage : '') + '</div>');
                    showSkillDamage(counterResult.totalDamage, 'player', false, '#ff4444');
                    triggerHitAnimation('player');
                    SkillCombat.playerTookDirectHitThisRound = true;
                    // 减少下一次被攻击伤害
                    SkillCombat.vorNextDamageReduction = 0.25;
                    appendBattleLog('<div style="color:#72d7ff;">🛡️ 沃尔适应了你的攻击节奏，下一次受到的伤害降低 25%。</div>');
                }
            }
        }
        if (ratio > 0) {
            SkillCombat.enemyTookDirectHitThisRound = true;
        }

        // 日志
        var logColor = isCrit ? '#ffd700' : skill.color;
        var critText = isCrit ? ' 💥暴击！' : '';
        var shieldText = damageResult.shieldDamage > 0 ? '，护盾吸收 ' + damageResult.shieldDamage : '';
        if (!(isManicEnemy(enemy) && enemy.isHpLocked && damageResult.totalDamage <= 0)) {
            appendBattleLog(
                '<div style="color: ' + logColor + ';">' +
                skill.icon + ' ' + player.name + ' 释放【' + skill.name + '】' + critText +
                ' 造成 ' + damageResult.hpDamage + ' 伤害' + shieldText + '</div>'
            );
        }

        if (skill.energyGain) {
            var beforeEnergy = player.energy;
            player.energy = Math.min(player.maxEnergy, player.energy + skill.energyGain);
            appendBattleLog('<div style="color: var(--orokin-cyan);">⚡ 普攻回能 +' + (player.energy - beforeEnergy) + '</div>');
        }

        // 浮动伤害数字
        if (damageResult.totalDamage > 0) {
            showSkillDamage(damageResult.totalDamage, 'enemy', isCrit, skill.color);
        }
        announceVorPhaseIfChanged(false);

        // 敌人受击动画
        triggerHitAnimation('enemy');

        // 处理特殊效果：沃尔这类 BOSS 对硬控有高抗性，致盲/击晕不再稳定生效
        if (skill.stunDuration && enemy.hp > 0) {
            if (isVorBoss(enemy)) {
                var resistRoll = Math.random();
                if (resistRoll < 0.85) {
                    appendBattleLog('<div style="color: #ffaa00;">⚠️ 沃尔上尉抵抗了硬控，只受到短暂干扰。</div>');
                    if (skill.id === 'radial_blind') {
                        var resistedBlindTarget = document.getElementById('battleEnemyIcon');
                        if (resistedBlindTarget) resistedBlindTarget.classList.add('skill-status-blinded-smoke');
                        setTimeout(function() {
                            var target = document.getElementById('battleEnemyIcon');
                            if (target) target.classList.remove('skill-status-blinded-smoke');
                        }, 520);
                    }
                } else {
                    enemy.isStunned = true;
                    enemy.stunTurns = 1;
                    SkillCombat.enemyDebuffs.push({ type: 'stun', duration: 1 });
                    appendBattleLog('<div style="color: #ffaa00;">💫 沃尔上尉被短暂打断 1 回合！</div>');
                }
            } else {
            enemy.isStunned = true;
            enemy.stunTurns = skill.stunDuration;
            SkillCombat.enemyDebuffs.push({ type: 'stun', duration: skill.stunDuration });
            if (skill.id === 'radial_blind') {
                var blindTarget = document.getElementById('battleEnemyIcon');
                if (blindTarget) blindTarget.classList.add('skill-status-blinded-smoke');
            }
            appendBattleLog('<div style="color: #ffaa00;">💫 ' + enemy.name + ' 被致盲 ' + skill.stunDuration + ' 回合！</div>');
            }
        }

        if (skill.bleedDuration && skill.bleedDamageRatio && enemy.hp > 0) {
            SkillCombat.enemyDebuffs.push({
                type: 'bleed',
                duration: skill.bleedDuration,
                damage: Math.max(1, Math.floor(damageResult.totalDamage * skill.bleedDamageRatio)),
                sourceName: player.name || '玩家',
                targetName: enemy.name || '敌人'
            });
            var bleedTarget = document.getElementById('battleEnemyIcon');
            if (bleedTarget) bleedTarget.classList.add('skill-status-bleed');
            appendBattleLog('<div style="color: #ff6666;">🩸 ' + enemy.name + ' 受到切割异常，持续 ' + skill.bleedDuration + ' 回合</div>');
        }

        // ═══ 灼烧 debuff ═══
        if (skill.burnDuration && skill.burnDamageRatio && enemy.hp > 0) {
            var burnChance = skill.burnChance || 0.5; // 默认50%概率
            if (Math.random() < burnChance) {
                SkillCombat.enemyDebuffs.push({
                    type: 'burn',
                    duration: skill.burnDuration,
                    damage: Math.max(1, Math.floor(damageResult.totalDamage * skill.burnDamageRatio)),
                    sourceName: player.name || '玩家',
                    targetName: enemy.name || '敌人'
                });
                var burnTargetEl = document.getElementById('battleEnemyIcon');
                if (burnTargetEl) burnTargetEl.classList.add('skill-status-burn');
                appendBattleLog('<div style="color: #ff6633;">🔥 ' + enemy.name + ' 被点燃！灼烧持续 ' + skill.burnDuration + ' 回合</div>');
                updateHpShieldBar('enemy', SkillCombat.enemy);
            }
        }

        if (skill.buffDuration && skill.buffMultiplier) {
            SkillCombat.playerBuffs.push({
                type: 'damage',
                duration: skill.buffDuration,
                multiplier: skill.buffMultiplier
            });
            appendBattleLog('<div style="color: var(--infested-green);">✨ 攻击力提升 x' + skill.buffMultiplier + '，持续 ' + skill.buffDuration + ' 回合</div>');
        }

        if (skill.buffType === 'speed') {
            SkillCombat.playerBuffs.push({
                type: 'speed',
                duration: skill.buffDuration,
                multiplier: skill.buffMultiplier
            });
            appendBattleLog('<div style="color: var(--orokin-cyan);">💨 速度提升 x' + skill.buffMultiplier + '，持续 ' + skill.buffDuration + ' 回合</div>');
        }

        if (skill.buffType === 'shield' && skill.shieldAmount) {
            player.shield = Math.min(player.maxShield, player.shield + skill.shieldAmount);
            appendBattleLog('<div style="color: #88ccff;">🛡️ 获得护盾 +' + skill.shieldAmount + '</div>');
        }

        if (skill.shieldRestoreRatio) {
            var restore = Math.floor(player.maxShield * skill.shieldRestoreRatio);
            player.shield = Math.min(player.maxShield, player.shield + restore);
            appendBattleLog('<div style="color: #88ccff;">🛡️ 极化恢复护盾 +' + restore + '</div>');
        }

        if (skill.buffType === 'magnetize' && skill.damageReflect) {
            SkillCombat.playerBuffs.push({
                type: 'reflect',
                duration: skill.buffDuration,
                multiplier: skill.damageReflect
            });
            appendBattleLog('<div style="color: #cc44ff;">🌀 磁化力场，反弹 ' + (skill.damageReflect * 100) + '% 伤害</div>');
        }

        if (skill.armorStrip && enemy.hp > 0) {
            var stripped = Math.floor(enemy.armor * skill.armorStrip);
            enemy.armor = Math.max(0, enemy.armor - stripped);
            appendBattleLog('<div style="color: #ff44ff;">💎 削减 ' + enemy.name + ' 护甲 ' + stripped + ' 点</div>');
        }

        if (skill.dotDamageRatio && enemy.hp > 0) {
            SkillCombat.enemyDebuffs.push({
                type: 'magnetized',
                duration: skill.buffDuration || 3,
                damage: Math.max(1, Math.floor(player.attack * skill.dotDamageRatio)),
                sourceName: player.name || '玩家',
                targetName: enemy.name || '敌人'
            });
            appendBattleLog('<div style="color: #cc44ff;">🌀 ' + enemy.name + ' 被磁化力场锁定</div>');
        }

        // ═══ Ash Smoke Screen 隐身机制 ═══
        if (skill.buffType === 'stealth' && skill.evasionBonus) {
            var stealthDuration = skill.buffDuration || 3;
            SkillCombat.playerBuffs.push({
                type: 'stealth',
                duration: stealthDuration,
                evasionBonus: skill.evasionBonus,
                turnsRemaining: stealthDuration
            });
            var playerIcon = document.getElementById('battlePlayerIcon');
            if (playerIcon) {
                playerIcon.classList.add('skill-status-stealth');
            }
            appendBattleLog('<div style="color: #444444;">💨 进入隐身状态，持续 ' + stealthDuration + ' 回合，有 ' + (skill.evasionBonus * 100) + '% 概率闪避攻击</div>');
        }

        // ═══ Ash Teleport 慢速返回机制 ═══
        if (skill.id === 'teleport') {
            var sourceEl = document.getElementById('battlePlayerIcon');
            if (sourceEl) {
                setTimeout(function() {
                    var returnAnim = document.createElement('div');
                    returnAnim.className = 'skill-vfx-teleport-return-anim';
                    returnAnim.style.cssText = 'position: fixed; z-index: 3000; pointer-events: none;';
                    document.body.appendChild(returnAnim);
                    setTimeout(function() {
                        if (returnAnim && returnAnim.parentNode) returnAnim.remove();
                    }, 500);
                }, Math.floor(skill.castTime * 0.65));
            }
        }

        updateBattleUI();
    }

    // ========== 敌人回合 ==========
    function startEnemyTurn() {
        if (!SkillCombat.isActive) return;

        var enemy = SkillCombat.enemy;

        // 检查敌人眩晕
        if (enemy.isStunned && enemy.stunTurns > 0) {
            enemy.stunTurns--;
            appendBattleLog('<div style="color: #ffaa00;">💫 ' + enemy.name + ' 处于致盲状态，无法行动！</div>');
            if (enemy.stunTurns <= 0) {
                enemy.isStunned = false;
                SkillCombat.enemyDebuffs = SkillCombat.enemyDebuffs.filter(function(d) { return d.type !== 'stun'; });
                clearEnemyBlindSmoke();
                // 移除浮动效果
                var _floatEl = document.getElementById('battleEnemyIcon');
                if (_floatEl) {
                    _floatEl.classList.remove('enemy-target-floating');
                    _floatEl.removeAttribute('data-floating-active');
                }
            }
            endEnemyTurn();
            return;
        }

        // AI 选择技能
        var chosenSkill = enemyChooseSkill();
        if (!chosenSkill) {
            endEnemyTurn();
            return;
        }

        SkillCombat.isAnimating = true;

        // 播放动画
               window.playSkillAnimation('enemy', chosenSkill, function() {
            // 命中回调：狂躁锁血只在敌人真正出手前递减/解除，避免玩家刚攻击完就显示解除
            clearManicLockBeforeEnemyAction();
            resolveEnemySkill(chosenSkill);
        }, function() {
            // 结束回调
            SkillCombat.isAnimating = false;
            updateBattleUI();

            // 检查玩家死亡
            if (SkillCombat.player.hp <= 0) {
                onPlayerDeath();
                return;
            }

            // 回到玩家回合
            if (SkillCombat.player.hp <= 0) {
                onPlayerDeath();
                return;
            }
            endEnemyTurn();
        });
    }

    // ========== 敌人 AI 选技能 ==========
    function enemyChooseSkill() {
        var enemy = SkillCombat.enemy;
        var skills = enemy.skills;

        // 找出可用技能
        var available = [];
        for (var i = 0; i < skills.length; i++) {
            if (SkillCombat.enemyCooldowns[i] <= 0 && isVorSkillUnlocked(skills[i], enemy)) {
                available.push({ skill: skills[i], index: i });
            }
        }

        if (available.length === 0) {
            // 全部冷却，普攻
            return {
                id: 'basic_attack',
                name: '普通攻击',
                icon: '👊',
                castTime: 400,
                hitTime: 200,
                damageMultiplier: 0.6,
                range: 'single',
                animClass: 'anim-enemy-basic',
                color: '#ff4444'
            };
        }

        // BOSS 更倾向使用当前阶段的高级技能
        var strongSkillChance = isVorBoss(enemy) ? 0.55 : 0.3;
        if (available.length > 1 && Math.random() < strongSkillChance) {
            // 选冷却最长的（通常是强力技能）
            available.sort(function(a, b) {
                return (b.skill.cooldown * getEnemySkillThreatWeight(b.skill)) - (a.skill.cooldown * getEnemySkillThreatWeight(a.skill));
            });
            var chosen = available[0];
            SkillCombat.enemyCooldowns[chosen.index] = chosen.skill.cooldown;
            return chosen.skill;
        }

        // 默认用第一个可用技能
        var chosen = available[0];
        SkillCombat.enemyCooldowns[chosen.index] = chosen.skill.cooldown;
        return chosen.skill;
    }

    // ========== 结算敌人技能 ==========
    function resolveEnemySkill(skill) {
        var enemy = SkillCombat.enemy;
        var player = SkillCombat.player;

        // ═══ 隐身闪避检查 ═══
        var stealthBuff = SkillCombat.playerBuffs.find(function(b) { return b.type === 'stealth'; });
        if (stealthBuff && stealthBuff.evasionBonus) {
            var evasionRoll = Math.random();
            if (evasionRoll < stealthBuff.evasionBonus) {
                // 闪避成功，不消耗stealth持续时间
                appendBattleLog('<div style="color: #444444;">💨 隐身闪避！攻击未命中。</div>');
                return;
            } else {
                // 闪避失败（被打到了），stealth立即结束
                appendBattleLog('<div style="color: #ff8800;">💥 隐身被打破！Ash暴露了位置。</div>');
                stealthBuff.duration = 0;
                var playerIcon = document.getElementById('battlePlayerIcon');
                if (playerIcon) {
                    playerIcon.classList.remove('skill-status-stealth');
                    playerIcon.classList.remove('skill-status-ash-stealth');
                    playerIcon.style.transition = 'opacity 0.5s, filter 0.5s';
                    playerIcon.style.opacity = '1';
                    playerIcon.style.filter = 'none';
                }
                var _stealthDodgeHint = document.getElementById('stealth-dodge-hint');
                if (_stealthDodgeHint && _stealthDodgeHint.parentNode) _stealthDodgeHint.remove();
                SkillCombat.playerBuffs = SkillCombat.playerBuffs.filter(function(b) { return b.type !== 'stealth'; });
                // 不return，继续执行伤害逻辑
            }
        }

        // 威胁伤害：按玩家总生存值和敌人威胁等级计算，不再逐个敌人调攻击力。
        var threatTag = getEnemyThreatTag(enemy);
        var threatRatio = ENEMY_THREAT_DAMAGE_RATIOS[threatTag] || ENEMY_THREAT_DAMAGE_RATIOS.normal;
        var baseDamage = getEntityTotalMax(player) * threatRatio * getEnemySkillThreatWeight(skill);
        if (isVorBoss(enemy)) {
            var hpPct = getEnemyHpPercent(enemy);
            var phaseDamageBonus = hpPct <= 0.40 ? 1.18 : hpPct <= 0.50 ? 1.10 : hpPct <= 0.75 ? 1.06 : 1.00;
            baseDamage *= phaseDamageBonus;
        }

        // 敌人等级只做轻微修正，避免高等级直接数值爆炸
        baseDamage += (enemy.level || 1) * 0.6;

        // 伤害浮动
        var variance = 0.90 + Math.random() * 0.2;
        var finalDamage = Math.max(1, Math.floor(baseDamage * variance));
        finalDamage = Math.floor(finalDamage * (window.SKILL_COMBAT_ENEMY_DAMAGE_MULT || 1));
        if (SkillCombat.player.threatSuppressed) {
            finalDamage = Math.max(1, Math.floor(finalDamage * 1.15));
        }

        // 反弹检查
        var reflectMultiplier = getBuffMultiplier(player, 'reflect');
        if (reflectMultiplier > 1) {
            var reflected = Math.floor(finalDamage * (reflectMultiplier - 1));
            enemy.hp = Math.max(0, enemy.hp - reflected);
            finalDamage = Math.floor(finalDamage * (2 - reflectMultiplier));
            if (reflected > 0) {
                appendBattleLog('<div style="color: #cc44ff;">🌀 磁化反弹 ' + reflected + ' 伤害！</div>');
            }
        }

        finalDamage = applyVorInteractionToEnemyDamage(skill, finalDamage);

        // 护甲减伤
        finalDamage = reduceByArmor(finalDamage, SkillCombat.player.armor || 0);

        // 沃尔临场适应：减少下一次受到的玩家伤害
        if (SkillCombat.vorNextDamageReduction > 0) {
            finalDamage = Math.max(1, Math.floor(finalDamage * (1 - SkillCombat.vorNextDamageReduction)));
            appendBattleLog('<div style="color:#72d7ff;">🛡️ 沃尔的临场适应生效，本次伤害被降低。</div>');
            SkillCombat.vorNextDamageReduction = 0;
        }

        var damageResult = applyShieldHealthDamage(player, finalDamage);
        SkillCombat.playerTookDirectHitThisRound = true;

        // 日志
        var shieldText = damageResult.shieldDamage > 0 ? '，护盾吸收 ' + damageResult.shieldDamage : '';
        appendBattleLog(
            '<div style="color: var(--grineer-red);">' +
            enemy.name + ' 使用【' + skill.name + '】' +
            ' 造成 ' + damageResult.hpDamage + ' 伤害' + shieldText + '</div>'
        );

        // 浮动伤害
        showSkillDamage(damageResult.totalDamage, 'player', false, '#ff4444');

        // 玩家受击动画
        triggerHitAnimation('player');

        // 眩晕效果
        var staggerChance = skill.staggerChance || 0;
        if (skill.id === 'vor_nervos_mine' && SkillCombat.vorInteraction && SkillCombat.vorInteraction.completed) {
            staggerChance = 0;
        }
        if (staggerChance && Math.random() < staggerChance) {
            SkillCombat.playerDebuffs.push({ type: 'stun', duration: 2 });
            setPlayerStatusVisual('stun', true);
            appendBattleLog('<div style="color: #ff8844;">😵 你被眩晕了！</div>');
            updateHpShieldBar('player', SkillCombat.player);
        }

        // 敌人特色状态效果
        if (skill.bleedChance && Math.random() < skill.bleedChance) {
            SkillCombat.playerDebuffs.push({ type: 'bleed', duration: 3, damage: Math.max(1, Math.floor(player.maxHp * 0.04)), sourceName: enemy.name || '敌人', targetName: player.name || '玩家' });
            setPlayerStatusVisual('bleed', true);
            appendBattleLog('<div style="color: #ff3355;">🩸 你被施加流血！</div>');
            updateHpShieldBar('player', SkillCombat.player);
        }
        if (skill.burnChance && Math.random() < skill.burnChance) {
            SkillCombat.playerDebuffs.push({ type: 'burn', duration: 3, damage: Math.max(1, Math.floor(getEntityTotalMax(player) * 0.025)), sourceName: enemy.name || '敌人', targetName: player.name || '玩家' });
            setPlayerStatusVisual('burn', true);
            appendBattleLog('<div style="color: #ff6633;">🔥 你被点燃！</div>');
            updateHpShieldBar('player', SkillCombat.player);
        }
        if (skill.toxinChance && Math.random() < skill.toxinChance) {
            SkillCombat.playerDebuffs.push({ type: 'toxin', duration: 3, damage: Math.max(1, Math.floor(player.maxHp * 0.05)), sourceName: enemy.name || '敌人', targetName: player.name || '玩家' });
            setPlayerStatusVisual('toxin', true);
            appendBattleLog('<div style="color: #66ff66;">☣️ 你中了毒素！</div>');
            updateHpShieldBar('player', SkillCombat.player);
        }
        if (skill.energyDrain && player.energy > 0) {
            var drained = Math.min(player.energy, skill.energyDrain);
            player.energy -= drained;
            SkillCombat.playerDebuffs.push({ type: 'disarm', duration: 1 });
            setPlayerStatusVisual('disarm', true);
            appendBattleLog('<div style="color: #ffaa00;">⚡ 能量被削减 ' + drained + ' 点！</div>');
            appendBattleLog('<div style="color: #ffaa00;">🪃 你被缴械了，无法使用普攻！</div>');
            updateHpShieldBar('player', SkillCombat.player);
        }
        // 检查敌人是否被磁化（磁力伤害持续期间不能回盾）
        var isMagnetized = SkillCombat.enemyDebuffs.some(function(d) { return d.type === 'magnetized'; });

        if (skill.selfShield && enemy.maxShield > 0 && !isMagnetized) {
            enemy.shield = Math.min(enemy.maxShield, enemy.shield + skill.selfShield);
            appendBattleLog('<div style="color: #88ccff;">🛡️ ' + enemy.name + ' 架盾，恢复 ' + skill.selfShield + ' 护盾！</div>');
            updateHpShieldBar('enemy', SkillCombat.enemy);
        } else if (skill.selfShield && isMagnetized) {
            appendBattleLog('<div style="color: #aa66ff;">🧲 ' + enemy.name + ' 被磁化，护盾恢复被抑制！</div>');
        }
        if (skill.selfShieldRatio && enemy.maxShield > 0 && !isMagnetized) {
            var shieldGain = Math.max(1, Math.floor(enemy.maxShield * skill.selfShieldRatio));
            if (skill.id === 'vor_sphere_shield' && SkillCombat.vorInteraction && SkillCombat.vorInteraction.completed) {
                shieldGain = Math.floor(shieldGain * 0.25);
                enemy.vorExposedTurns = 2;
                appendBattleLog('<div style="color: #ffd36a;">🔑 你破坏了雅努斯节点，球形护盾被削弱，沃尔短暂暴露！</div>');
            }
            enemy.shield = Math.min(enemy.maxShield, enemy.shield + shieldGain);
            appendBattleLog('<div style="color: #72d7ff;">🛡️ 雅努斯之钥展开球形护盾，恢复 ' + shieldGain + ' 护盾！</div>');
        } else if (skill.selfShieldRatio && isMagnetized) {
            appendBattleLog('<div style="color: #aa66ff;">🧲 ' + enemy.name + ' 被磁化，护盾恢复被抑制！</div>');
        }

        // 敌人 self buff
        if (skill.buffType === 'self_damage' && skill.buffMultiplier) {
            SkillCombat.enemyDebuffs.push({
                type: 'damage_buff',
                duration: skill.buffDuration || 2,
                multiplier: skill.buffMultiplier
            });
            updateHpShieldBar('enemy', SkillCombat.enemy);
            // 注意：敌人的 damage_buff 在计算时通过 enemyDebuffs 读取
        }

        updateBattleUI();
        clearVorInteraction(true);
    }

    // ========== 回合结束处理 ==========
    function endPlayerTurn() {
        SkillCombat.isPlayerTurn = false;
        startEnemyTurn();
    }

    function endEnemyTurn() {
        SkillCombat.turnCount++;

        // 回合结束统一结算持续伤害（一回合只结算一次）
        settleEndOfTurnEffects();

        // 回合结束处理：这里只处理持续时间和冷却
        tickBuffsAndDebuffs();
        if (SkillCombat.enemy.hp <= 0) {
            onEnemyDeath();
            return;
        }
        if (SkillCombat.player.hp <= 0) {
            onPlayerDeath();
            return;
        }

        // 能量恢复
        SkillCombat.player.energy = Math.min(
            SkillCombat.player.maxEnergy,
            SkillCombat.player.energy + SkillCombat.energyRegenRate
        );

        // 护盾恢复：本回合没有被对方直接攻击才回复，持续伤害不打断回复
        restoreRoundShieldIfSafe('player');
        restoreRoundShieldIfSafe('enemy');
        SkillCombat.playerTookDirectHitThisRound = false;
        SkillCombat.enemyTookDirectHitThisRound = false;

        // 冷却递减
        for (var i = 0; i < 4; i++) {
            if (SkillCombat.playerCooldowns[i] > 0) SkillCombat.playerCooldowns[i]--;
        }
        for (var i = 0; i < SkillCombat.enemyCooldowns.length; i++) {
            if (SkillCombat.enemyCooldowns[i] > 0) SkillCombat.enemyCooldowns[i]--;
        }
        if (SkillCombat.enemy.vorExposedTurns > 0) {
            SkillCombat.enemy.vorExposedTurns--;
        }

        SkillCombat.isPlayerTurn = true;
        updateBattleUI();
        // 自动肃清模式：自动释放技能
        if (window.autoSkillMode) {
            setTimeout(function() {
                if (SkillCombat.isActive && SkillCombat.isPlayerTurn && !SkillCombat.isAnimating) {
                    tryAutoCastSkills();
                }
            }, 400);
        }
    }

    function restoreRoundShieldIfSafe(side) {
        var entity = side === 'player' ? SkillCombat.player : SkillCombat.enemy;
        if (!entity || !entity.maxShield || entity.shield >= entity.maxShield) return;

        var wasDirectlyHit = side === 'player'
            ? SkillCombat.playerTookDirectHitThisRound
            : SkillCombat.enemyTookDirectHitThisRound;
        if (wasDirectlyHit) return;

        var minRatio = side === 'player' ? 0.30 : 0.35;
        var maxRatio = side === 'player' ? 0.60 : 0.50;
        var ratio = minRatio + Math.random() * (maxRatio - minRatio);
        var restore = Math.max(1, Math.floor(entity.maxShield * ratio));
        var before = entity.shield;
        entity.shield = Math.min(entity.maxShield, entity.shield + restore);
        var actual = entity.shield - before;
        if (actual > 0) {
            appendBattleLog('<div style="color: #72d7ff;">🛡️ ' + (side === 'player' ? '我方' : '敌方') + ' 未受直接攻击，护盾回复 +' + actual + '</div>');
        }
    }

    // ========== buff/debuff 回合递减 ==========
    function tickBuffsAndDebuffs() {
        // 玩家 buff
        SkillCombat.playerBuffs = SkillCombat.playerBuffs.filter(function(b) {
            b.duration--;
            if (b.duration <= 0) {
                appendBattleLog('<div style="color: #888;">⏳ ' + buffTypeName(b.type) + ' 效果消失</div>');
                // stealth到期时移除隐身视觉效果
                if (b.type === 'stealth') {
                    var _stealthEl = document.getElementById('battlePlayerIcon');
                    if (_stealthEl) {
                        _stealthEl.classList.remove('skill-status-stealth');
                        _stealthEl.classList.remove('skill-status-ash-stealth');
                        _stealthEl.style.transition = 'opacity 0.5s, filter 0.5s';
                        _stealthEl.style.opacity = '1';
                        _stealthEl.style.filter = 'none';
                    }
                    var _dodgeH = document.getElementById('stealth-dodge-hint');
                    if (_dodgeH && _dodgeH.parentNode) _dodgeH.remove();
                }
                return false;
            }
            return true;
        });

        // 玩家 debuff duration 递减
        SkillCombat.playerDebuffs = SkillCombat.playerDebuffs.filter(function(d) {
            if (d.duration !== undefined) {
                d.duration--;
                if (d.duration <= 0) {
                    if (d.type === 'stun') appendBattleLog('<div style="color: #aaa;">✅ 眩晕效果消退，你恢复了行动能力</div>');
                    else if (d.type === 'disarm') appendBattleLog('<div style="color: #aaa;">✅ 缴械效果消退</div>');
                    return false;
                }
            }
            return true;
        });

        // 敌人 debuff
        SkillCombat.enemyDebuffs = SkillCombat.enemyDebuffs.filter(function(d) {
            if (d.duration !== undefined) d.duration--;
            if (d.type === 'stun' && d.duration <= 0) {
                SkillCombat.enemy.isStunned = false;
                clearEnemyBlindSmoke();
                var _floatEl2 = document.getElementById('battleEnemyIcon');
                if (_floatEl2) {
                    _floatEl2.classList.remove('enemy-target-floating');
                    _floatEl2.removeAttribute('data-floating-active');
                }
            }
            return d.duration > 0;
        });

        if (SkillCombat.enemy) {
            if (SkillCombat.enemy.manicLockCooldown > 0) SkillCombat.enemy.manicLockCooldown--;
        }
    }

    // 回合结束时统一结算持续伤害（一回合只结算一次）
    function settleEndOfTurnEffects() {
        if (!SkillCombat.isActive) return;

        // 结算玩家受到的持续伤害
        SkillCombat.playerDebuffs = SkillCombat.playerDebuffs.filter(function(d) {
            if ((d.type === 'bleed' || d.type === 'toxin') && d.damage > 0 && SkillCombat.player.hp > 0) {
                var direct = applyDirectHpDamage(SkillCombat.player, d.damage);
                var color = d.type === 'toxin' ? '#66ff66' : '#ff3355';
                var label = d.type === 'toxin' ? '☣' : '🩸';
                var sourceName = d.sourceName || (SkillCombat.enemy && SkillCombat.enemy.name) || '敌人';
                var targetName = d.targetName || SkillCombat.player.name || '玩家';
                showSkillDamage(label + direct.hpDamage, 'player', false, color);
                appendBattleLog('<div style="color: ' + color + ';">' + label + ' ' + sourceName + ' 对 ' + targetName + ' 造成' + (d.type === 'toxin' ? '毒素' : '切割') + '持续伤害 ' + direct.hpDamage + '</div>');
            }
            if (d.type === 'burn' && d.damage > 0 && SkillCombat.player.hp > 0) {
                var burn = applyShieldHealthDamage(SkillCombat.player, d.damage);
                var burnSource = d.sourceName || (SkillCombat.enemy && SkillCombat.enemy.name) || '敌人';
                var burnTarget = d.targetName || SkillCombat.player.name || '玩家';
                showSkillDamage('🔥' + burn.totalDamage, 'player', false, '#ff6633');
                appendBattleLog('<div style="color: #ff6633;">🔥 ' + burnSource + ' 对 ' + burnTarget + ' 造成灼烧持续伤害 ' + burn.totalDamage + '</div>');
            }
            if (d.type === 'bleed' || d.type === 'toxin' || d.type === 'burn') {
                d.duration--;
                if (d.duration <= 0) setPlayerStatusVisual(d.type, false);
                return d.duration > 0;
            }
            return true;
        });

        // 结算敌人受到的持续伤害
        SkillCombat.enemyDebuffs = SkillCombat.enemyDebuffs.filter(function(d) {
            if ((d.type === 'bleed' || d.type === 'magnetized' || d.type === 'burn') && d.damage > 0 && SkillCombat.enemy.hp > 0) {
                var dotSource = d.sourceName || SkillCombat.player.name || '玩家';
                var dotTarget = d.targetName || (SkillCombat.enemy && SkillCombat.enemy.name) || '敌人';
                if (isManicEnemy(SkillCombat.enemy) && SkillCombat.enemy.isHpLocked) {
                    appendBattleLog('<div style="color:#aaa;">👹 ' + dotTarget + ' 狂躁锁血中，免疫 ' + dotSource + ' 的' + (d.type === 'bleed' ? '切割' : d.type === 'burn' ? '灼烧' : '磁化') + '持续伤害。</div>');
                } else {
                var bypass = d.type === 'bleed';
                var dot = bypass ? applyDirectHpDamage(SkillCombat.enemy, d.damage) : applyShieldHealthDamage(SkillCombat.enemy, d.damage);
                var color = d.type === 'bleed' ? '#ff3355' : d.type === 'burn' ? '#ff6633' : '#ff66ff';
                var label = d.type === 'bleed' ? '🩸' : d.type === 'burn' ? '🔥' : '🧲';
                var dotTypeName = d.type === 'bleed' ? '切割' : d.type === 'burn' ? '灼烧' : '磁化';
                showSkillDamage(label + dot.totalDamage, 'enemy', false, color);
                appendBattleLog('<div style="color: ' + color + ';">' + label + ' ' + dotSource + ' 对 ' + dotTarget + ' 造成' + dotTypeName + '持续伤害 ' + dot.totalDamage + '</div>');
                }
            }
            if (d.type === 'bleed' || d.type === 'magnetized' || d.type === 'burn') {
                d.duration--;
                if (d.duration <= 0 && d.type === 'bleed') {
                    var bleedTarget = document.getElementById('battleEnemyIcon');
                    if (bleedTarget) bleedTarget.classList.remove('skill-status-bleed');
                }
                if (d.duration <= 0 && d.type === 'burn') {
                    var burnCleanEl = document.getElementById('battleEnemyIcon');
                    if (burnCleanEl) burnCleanEl.classList.remove('skill-status-burn');
                }
                return d.duration > 0 && SkillCombat.enemy.hp > 0;
            }
            return true;
        });

        updateBattleUI();
    }

    function clearEnemyBlindSmoke() {
        var enemyEl = document.getElementById('battleEnemyIcon');
        if (enemyEl) enemyEl.classList.remove('skill-status-blinded-smoke');
    }

    function buffTypeName(type) {
        var names = {
            damage: '攻击强化',
            speed: '加速',
            shield: '护盾',
            reflect: '磁化'
        };
        return names[type] || type;
    }

    // ========== 死亡处理 ==========
    function onEnemyDeath() {
        SkillCombat.isActive = false;
        SkillCombat.isAnimating = false;
        document.body.classList.remove('skill-combat-running', 'skill-combat-boss-vor');

        clearEnemyCausedEffects();
        triggerDeathAnimation('enemy');

        appendBattleLog('<div style="color: var(--infested-green); font-weight: 700; font-size: 1.1rem;">═══ ' + ' 肃清结果 ═══</div>');

        if (SkillCombat.onBattleEnd) {
            SkillCombat.onBattleEnd('win', SkillCombat.enemy);
        }
    }

    function onPlayerDeath() {
        SkillCombat.isActive = false;
        SkillCombat.isAnimating = false;
        document.body.classList.remove('skill-combat-running', 'skill-combat-boss-vor');

        triggerDeathAnimation('player');

        appendBattleLog('<div style="color: var(--grineer-red); font-weight: 700; font-size: 1.1rem;">═══ 战斗失败... ═══</div>');

        if (SkillCombat.onBattleEnd) {
            SkillCombat.onBattleEnd('lose', null);
        }
    }

    // ========== 停止战斗 ==========
    function stopSkillCombat() {
        SkillCombat.isActive = false;
        SkillCombat.isAnimating = false;
        SkillCombat.isPlayerTurn = true;
        document.body.classList.remove('skill-combat-running', 'skill-combat-boss-vor');

        var oldBar = document.getElementById('skill-bar-container');
        if (oldBar) oldBar.remove();

        clearAllStatusVisuals();
        clearVorInteraction(false);

        // 断开 MutationObserver
        for (var key in _avatarObservers) {
            if (_avatarObservers[key]) {
                _avatarObservers[key].disconnect();
            }
        }
        _avatarObservers = {};
    }

    // ========== 技能动画播放 ==========
    function playSkillAnimation(side, skill, onHit, onEnd) {
        var targetEl = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');

        if (!targetEl) {
            // 如果找不到元素，直接回调
            setTimeout(function() { if (onHit) onHit(); }, skill.hitTime || 300);
            setTimeout(function() { if (onEnd) onEnd(); }, skill.castTime || 600);
            return;
        }

        // 添加施法动画类
        targetEl.classList.add('casting');
        targetEl.style.setProperty('animation', skill.animClass + ' ' + (skill.castTime / 1000) + 's ease-out forwards', 'important');
        applySkillPictureMotion(side, skill);
        if (side === 'enemy') {
            setupVorSkillInteraction(skill);
        }
        window.spawnSkillVfx(side, skill);

        // 命中时间点
        setTimeout(function() {
            if (onHit) onHit();

            // 命中闪光
            var hitTarget = side === 'player'
                ? document.getElementById('battleEnemyIcon')
                : document.getElementById('battlePlayerIcon');
            if (hitTarget) {
                hitTarget.classList.add('hit-flash');
                setTimeout(function() {
                    hitTarget.classList.remove('hit-flash');
                }, 300);
            }
        }, skill.hitTime);

        // 动画结束
        setTimeout(function() {
            targetEl.classList.remove('casting');
            targetEl.style.removeProperty('animation');
            // 清理施法者的动画属性
            var sourceEl = side === 'player'
                ? document.getElementById('battlePlayerIcon')
                : document.getElementById('battleEnemyIcon');
            if (sourceEl) {
                sourceEl.style.removeProperty('animation');
                sourceEl.style.removeProperty('--dash-x');
                sourceEl.style.removeProperty('--dash-y');
            }
            if (onEnd) onEnd();
        }, skill.castTime);
    }

    function applySkillPictureMotion(side, skill) {
        var sourceEl = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');
        var targetEl = side === 'player'
            ? document.getElementById('battleEnemyIcon')
            : document.getElementById('battlePlayerIcon');

        if (!sourceEl || !targetEl || !skill) return;

        var sourceRect = sourceEl.getBoundingClientRect();
        var targetRect = targetEl.getBoundingClientRect();
        var sourceX = sourceRect.left + sourceRect.width / 2;
        var sourceY = sourceRect.top + sourceRect.height / 2;
        var targetX = targetRect.left + targetRect.width / 2;
        var targetY = targetRect.top + targetRect.height / 2;
        var dir = side === 'player' ? 1 : -1;
        var duration = Math.max(420, skill.castTime || 650);

        function runClass(el, className, ms) {
            el.classList.remove(className);
            void el.offsetWidth;
            el.classList.add(className);
            setTimeout(function() {
                if (el) el.classList.remove(className);
            }, ms || duration);
        }

        switch (skill.id) {
            case 'slash_dash':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.82) + 'px');
                sourceEl.style.setProperty('animation', 'pictureSlashDash ' + duration + 'ms cubic-bezier(.12,.82,.2,1) both', 'important');
                runClass(sourceEl, 'skill-picture-slash-dash', duration);
                break;
            case 'shield_lancer_bash':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.58) + 'px');
                runClass(sourceEl, 'enemy-picture-shield-bash', duration);
                break;
            case 'scorpion_hook':
                targetEl.style.setProperty('--pull-x', ((sourceX - targetX) * 0.32) + 'px');
                targetEl.style.setProperty('--pull-y', ((sourceY - targetY) * 0.12) + 'px');
                runClass(targetEl, 'enemy-picture-hook-pulled', duration);
                break;
            case 'flameblade_rift_strike':
            case 'flameblade_teleport_slash':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.72) + 'px');
                runClass(sourceEl, 'enemy-picture-teleport-slash', duration);
                break;
            case 'hellion_missile_barrage':
            case 'hellion_jet_fire':
                runClass(sourceEl, 'enemy-picture-jet-hover', duration);
                break;
            case 'ballista_snipe':
            case 'ballista_puncture':
                runClass(targetEl, 'enemy-target-aim-locked', duration);
                break;
            case 'bombard_homing_rocket':
            case 'mortar_bombard_shell':
            case 'napalm_fire_bomb':
                runClass(targetEl, 'enemy-target-explosion-hit', duration);
                break;
            case 'scorch_flamethrower':
            case 'scorch_ignite':
            case 'napalm_heat_wave':
                runClass(targetEl, 'enemy-target-burning', duration);
                break;
            case 'heavy_gunner_suppress':
            case 'lancer_grakata':
            case 'lancer_burst':
                runClass(targetEl, 'enemy-target-suppressed', duration);
                break;
            case 'nox_toxic_glob':
                runClass(targetEl, 'enemy-target-toxic-stuck', Math.max(1100, duration));
                break;
            case 'commander_switch_teleport':
            case 'vor_teleport_shot':
                sourceEl.style.setProperty('--swap-x', ((targetX - sourceX) * 0.58) + 'px');
                targetEl.style.setProperty('--swap-x', ((sourceX - targetX) * 0.35) + 'px');
                runClass(sourceEl, 'enemy-picture-commander-swap', duration);
                runClass(targetEl, 'enemy-picture-player-confused', duration);
                break;
            case 'vor_seer_burst':
                runClass(targetEl, 'vor-target-seer-locked', duration);
                runClass(sourceEl, 'vor-picture-seer-recoil', duration);
                break;
            case 'vor_janus_beam':
                runClass(targetEl, 'vor-target-janus-rifted', duration);
                runClass(sourceEl, 'vor-picture-janus-channel', Math.max(1200, duration));
                break;
            case 'vor_nervos_mine':
                runClass(targetEl, 'vor-target-mine-marked', duration);
                runClass(sourceEl, 'vor-picture-command-cast', duration);
                break;
            case 'vor_sphere_shield':
                runClass(sourceEl, 'vor-picture-sphere-shield', Math.max(1300, duration));
                break;
            case 'manic_cloak_pounce':
            case 'manic_rend':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.78) + 'px');
                runClass(sourceEl, 'enemy-picture-manic-pounce', duration);
                break;
            case 'nox_charge':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.46) + 'px');
                runClass(sourceEl, 'enemy-picture-nox-charge', duration);
                break;
            // Corpus Dera / Supra 连射压制
            case 'corpus_dera_burst':
            case 'corpus_supra_suppress':
            case 'corpus_supra_hail':
            case 'corpus_tech_barrage':
                runClass(targetEl, 'enemy-target-suppressed', duration);
                runClass(sourceEl, 'enemy-picture-nox-charge', duration);
                break;
            // Corpus 等离子手雷投掷
            case 'corpus_plasma_grenade':
                runClass(targetEl, 'enemy-target-explosion-hit', duration);
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.18) + 'px');
                runClass(sourceEl, 'enemy-picture-nox-charge', Math.floor(duration * 0.4));
                break;
            // Corpus Detron 散弹近距
            case 'corpus_detron_blast':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.42) + 'px');
                runClass(sourceEl, 'enemy-picture-nox-charge', duration);
                runClass(targetEl, 'enemy-target-explosion-hit', Math.floor(duration * 0.6));
                break;
            // Corpus Prova 电击棍近战
            case 'corpus_prova_shock':
            case 'corpus_prova_stun':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.38) + 'px');
                runClass(sourceEl, 'enemy-picture-teleport-slash', duration);
                runClass(targetEl, 'enemy-target-toxic-stuck', Math.floor(duration * 0.7));
                break;
            // Corpus 护盾超载 / Osprey 部署（自身增益）
            case 'corpus_shield_overcharge':
            case 'corpus_deploy_osprey':
                runClass(sourceEl, 'vor-picture-sphere-shield', duration);
                break;
            // Corpus Nullifier 反制力场展开
            case 'corpus_nullify_field':
                runClass(sourceEl, 'vor-picture-sphere-shield', Math.floor(duration * 0.6));
                runClass(targetEl, 'enemy-target-suppressed', duration);
                break;
            // Corpus Lanka 狙击蓄力
            case 'corpus_lanka_snipe':
            case 'corpus_lanka_charge':
                runClass(targetEl, 'enemy-target-aim-locked', duration);
                runClass(sourceEl, 'vor-picture-seer-recoil', Math.floor(duration * 0.5));
                break;
            // Corpus 无人机/蜂群部署
            case 'corpus_drone_swarm':
            case 'corpus_drone_deploy':
                runClass(sourceEl, 'vor-picture-command-cast', duration);
                runClass(targetEl, 'enemy-target-suppressed', Math.floor(duration * 0.6));
                break;
            // Corpus 炮塔部署
            case 'corpus_turret_deploy':
                runClass(targetEl, 'enemy-target-aim-locked', Math.floor(duration * 0.45));
                runClass(targetEl, 'enemy-target-explosion-hit', Math.floor(duration * 0.6));
                break;
            // Corpus 驱逐脉冲
            case 'corpus_evict_pulse':
                runClass(targetEl, 'enemy-picture-hook-pulled', duration);
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.22) + 'px');
                runClass(sourceEl, 'enemy-picture-nox-charge', duration);
                break;
            // Corpus 干扰场域
            case 'corpus_disrupt_field':
                runClass(targetEl, 'enemy-picture-player-confused', duration);
                break;
            // Corpus Boss 能量超载
            case 'corpus_energy_overload':
                runClass(sourceEl, 'vor-picture-janus-channel', Math.floor(duration * 0.5));
                runClass(targetEl, 'enemy-target-explosion-hit', duration);
                break;
            // Corpus Boss 护盾虹吸
            case 'corpus_shield_drain':
                runClass(sourceEl, 'vor-picture-sphere-shield', Math.floor(duration * 0.45));
                runClass(targetEl, 'enemy-picture-hook-pulled', duration);
                break;
            // Corpus Boss 数据炸弹
            case 'corpus_data_bomb':
                runClass(targetEl, 'enemy-target-explosion-hit', duration);
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.12) + 'px');
                runClass(sourceEl, 'vor-picture-command-cast', Math.floor(duration * 0.55));
                break;
            // ===== 恐鸟类场景位移 =====
            // 射击类：敌人轻微后退
            case 'moa_plasma_rifle':
            case 'reverse_moa_beam':
            case 'dera_moa_burst':
            case 'twin_moa_suppress':
            case 'shock_moa_rifle':
            case 'amalgam_moa_shot':
            case 'mini_moa_laser':
                sourceEl.style.setProperty('animation', 'anim-enemy-shot ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 冲锋/践踏/踢击类：敌人前冲
            case 'shock_moa_stomp':
            case 'amalgam_moa_stomp':
            case 'reverse_moa_charge':
            case 'moa_kick':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.5) + 'px');
                sourceEl.style.setProperty('--dash-y', ((targetY - sourceY) * 0.15) + 'px');
                sourceEl.style.setProperty('animation', 'anim-enemy-heavy ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 喷射/光束类：敌人原地蓄力
            case 'lava_moa_ignis':
            case 'fusion_moa_beam':
            case 'cryo_moa_freeze':
            case 'lava_moa_wave':
            case 'cryo_moa_beam':
                sourceEl.style.setProperty('animation', 'anim-enemy-elite-skill ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 磁轨炮蓄力
            case 'railgun_moa_shot':
                sourceEl.style.setProperty('animation', 'anim-enemy-boss-attack ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 火箭发射
            case 'twin_moa_rockets':
                sourceEl.style.setProperty('animation', 'anim-enemy-grenade ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 圆盘投掷旋转
            case 'disc_moa_launch':
            case 'disc_moa_ricochet':
                sourceEl.style.setProperty('animation', 'anim-enemy-elite-attack ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 自爆/爆炸类
            case 'mini_moa_self_destruct':
            case 'demo_moa_explosive':
            case 'demo_moa_charge':
                sourceEl.style.setProperty('animation', 'anim-enemy-boss-special ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 治疗类
            case 'amalgam_moa_heal':
                sourceEl.style.setProperty('animation', 'anim-enemy-elite-skill ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 部署无人机
            case 'railgun_moa_drone':
            case 'fusion_moa_drone':
                sourceEl.style.setProperty('animation', 'anim-enemy-basic ' + duration + 'ms ease-out forwards', 'important');
                break;
            // 掷弹
            case 'dera_moa_grenade':
                sourceEl.style.setProperty('animation', 'anim-enemy-grenade ' + duration + 'ms ease-out forwards', 'important');
                break;
            case 'electric_shield':
                runClass(sourceEl, 'skill-picture-electric-shield', Math.max(1200, duration));
                break;

            // ═══ Rhino 角色动作 ═══
            case 'rhino_charge':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.82) + 'px');
                sourceEl.style.setProperty('--dash-y', ((targetY - sourceY) * 0.15) + 'px');
                sourceEl.style.setProperty('animation', 'pictureRhinoChargeCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-rhino-charge', duration);
                break;
            case 'iron_skin':
                runClass(sourceEl, 'skill-picture-iron-skin', Math.max(1200, duration));
                runClass(sourceEl, 'skill-picture-iron-skin-shield', 999999);
                sourceEl.setAttribute('data-iron-shield-active', '1');
                // 定时检查护盾是否已被消耗
                var _ironShieldCheck = setInterval(function() {
                    var _ironEl = document.getElementById('battlePlayerIcon');
                    if (!_ironEl || !_ironEl.getAttribute('data-iron-shield-active')) {
                        clearInterval(_ironShieldCheck);
                        return;
                    }
                    var _ironShieldBar = document.getElementById('battlePlayerShieldBar');
                    if (_ironShieldBar && parseFloat(_ironShieldBar.style.width) <= 0) {
                        _ironEl.classList.remove('skill-picture-iron-skin-shield');
                        _ironEl.removeAttribute('data-iron-shield-active');
                        clearInterval(_ironShieldCheck);
                    }
                }, 500);
                // 超时保底移除(30秒)
                setTimeout(function() {
                    var _ironEl2 = document.getElementById('battlePlayerIcon');
                    if (_ironEl2) {
                        _ironEl2.classList.remove('skill-picture-iron-skin-shield');
                        _ironEl2.removeAttribute('data-iron-shield-active');
                    }
                }, 30000);
                break;
            case 'roar':
                runClass(sourceEl, 'skill-picture-roar', duration);
                break;
            case 'rhino_stomp':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.85) + 'px');
                sourceEl.style.setProperty('--dash-y', ((targetY - sourceY) * 0.3) + 'px');
                sourceEl.style.setProperty('animation', 'pictureRhinoStompCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-rhino-stomp', duration);
                // 犀牛践踏：敌人浮动效果持续到stun结束
                if (targetEl) {
                    targetEl.classList.remove('enemy-target-floating');
                    void targetEl.offsetWidth;
                    targetEl.classList.add('enemy-target-floating');
                    targetEl.setAttribute('data-floating-active', '1');
                }
                break;

            // ═══ Ash 角色动作 ═══
            case 'shuriken':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.75) + 'px');
                sourceEl.style.setProperty('animation', 'pictureShurikenCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-shuriken', duration);
                break;
            case 'smoke_screen':
                sourceEl.style.setProperty('animation', 'pictureSmokeScreenCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-smoke-screen', duration);
                // Ash隐身：视觉效果由tickBuffsAndDebuffs在buff到期时自动清除
                var playerIcon = document.getElementById('battlePlayerIcon');
                if (playerIcon) {
                    playerIcon.classList.add('skill-status-ash-stealth');
                    // 隐身期间持续烟雾粒子环绕
                    var _smokeInterval = setInterval(function() {
                        if (!playerIcon || (!playerIcon.classList.contains('skill-status-ash-stealth') && !playerIcon.classList.contains('skill-status-stealth'))) {
                            clearInterval(_smokeInterval);
                            return;
                        }
                        var pRect = playerIcon.getBoundingClientRect();
                        var px = pRect.left + pRect.width / 2;
                        var py = pRect.top + pRect.height / 2;
                        var smokeEl = document.createElement('div');
                        smokeEl.className = 'skill-vfx skill-vfx-player skill-vfx-smoke-lingering';
                        smokeEl.style.left = px + 'px';
                        smokeEl.style.top = py + 'px';
                        smokeEl.style.setProperty('animation', 'smokeLinger 800ms ease-out forwards', 'important');
                        document.body.appendChild(smokeEl);
                        setTimeout(function() { if (smokeEl.parentNode) smokeEl.remove(); }, 900);
                    }, 350);
                    // 闪避提示
                    var _stealthHint = document.getElementById('battlePlayerStatusArea');
                    if (_stealthHint) {
                        var _dodgeHint = document.createElement('div');
                        _dodgeHint.id = 'stealth-dodge-hint';
                        _dodgeHint.style.cssText = 'position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:11px;color:#aaddff;background:rgba(0,0,0,0.6);padding:2px 8px;border-radius:10px;white-space:nowrap;z-index:100;pointer-events:none;';
                        _dodgeHint.textContent = '\u9690\u8eab\u4e2d 65%%\u95ea\u907f';
                        _stealthHint.style.position = 'relative';
                        _stealthHint.appendChild(_dodgeHint);
                        // 闪避提示也跟随buff，在tickBuffsAndDebuffs中移除
                    }
                }
                break;
            case 'teleport':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.85) + 'px');
                sourceEl.style.setProperty('animation', 'pictureTeleportCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-teleport', duration);
                break;
            case 'blade_storm':
                sourceEl.style.setProperty('animation', 'pictureBladeStormCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-blade-storm', duration);
                runClass(sourceEl, 'skill-picture-blade-storm-ghost', duration);
                break;

            // ═══ Ember 角色动作 ═══
            case 'fireball':
                sourceEl.style.setProperty('--dash-x', ((targetX - sourceX) * 0.78) + 'px');
                sourceEl.style.setProperty('animation', 'pictureFireballCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-fireball', duration);
                break;
            case 'accelerant':
                runClass(sourceEl, 'skill-picture-accelerant', duration);
                break;
            case 'fire_blast':
                sourceEl.style.setProperty('animation', 'pictureFireBlastCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-fire-blast', duration);
                // 火焰冲击：敌人被击倒
                runClass(targetEl, 'enemy-target-knocked-down', duration);
                break;
            case 'world_on_fire':
                sourceEl.style.setProperty('animation', 'pictureWorldOnFireCast ' + duration + 'ms ease-out both', 'important');
                runClass(sourceEl, 'skill-picture-world-on-fire', Math.max(1200, duration));
                break;

            case 'pull':
                targetEl.style.setProperty('--pull-x', ((sourceX - targetX) * 0.62) + 'px');
                targetEl.style.setProperty('--pull-y', ((sourceY - targetY) * 0.35) + 'px');
                runClass(targetEl, 'skill-picture-pulled', duration);
                break;
            case 'crush':
                runClass(targetEl, 'skill-picture-crushed', duration);
                break;
            case 'speed':
                sourceEl.style.setProperty('--speed-dir', dir);
                runClass(sourceEl, 'skill-picture-speed', duration);
                break;
        }
    }

    function spawnSkillVfx(side, skill) {
        var sourceEl = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');
        var targetEl = side === 'player'
            ? document.getElementById('battleEnemyIcon')
            : document.getElementById('battlePlayerIcon');

        if (!sourceEl || !targetEl) return;

        var sourceRect = sourceEl.getBoundingClientRect();
        var targetRect = targetEl.getBoundingClientRect();
        var startX = sourceRect.left + sourceRect.width / 2;
        var startY = sourceRect.top + sourceRect.height / 2;
        var endX = targetRect.left + targetRect.width / 2;
        var endY = targetRect.top + targetRect.height / 2;
        var dx = endX - startX;
        var dy = endY - startY;
        var angle = Math.atan2(dy, dx) * 180 / Math.PI;
        var distance = Math.sqrt(dx * dx + dy * dy);
        var duration = Math.max(420, skill.castTime || 650);
        var color = skill.color || '#00d4ff';

        function addVfx(className, x, y, text, extraDelay, extraDuration) {
            // 特效强度控制
            var vfxLevel = 'medium';
            try { vfxLevel = (gameData && gameData.settings && gameData.settings.vfxIntensity) ? gameData.settings.vfxIntensity : 'medium'; } catch(e) {}
            var shouldSkip = false;
            if (vfxLevel === 'low' && Math.random() > 0.35) shouldSkip = true;
            if (vfxLevel === 'medium' && Math.random() > 0.75) shouldSkip = true;
            var el = document.createElement('div');
            if (shouldSkip) {
                el.style.display = 'none';
                document.body.appendChild(el);
                setTimeout(function() { if (el && el.parentNode) el.parentNode.removeChild(el); }, 10);
                return el;
            }
            el.className = className;
            el.textContent = text || '';
            el.style.left = x + 'px';
            el.style.top = y + 'px';
            el.style.setProperty('--vfx-x', dx + 'px');
            el.style.setProperty('--vfx-y', dy + 'px');
            el.style.setProperty('--vfx-distance', distance + 'px');
            el.style.setProperty('--em-scale-mid', Math.max(3, (distance + 48) / 44));
            el.style.setProperty('--em-scale-end', Math.max(4, (distance + 110) / 44));
            el.style.setProperty('--vfx-angle', angle + 'deg');
            el.style.setProperty('--vfx-color', color);
            el.style.setProperty('--vfx-dir', side === 'player' ? '1' : '-1');
            // 不在这里设置animation相关属性，让每个VFX单独设置
            document.body.appendChild(el);
            setTimeout(function() {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }, (extraDelay || 0) + (extraDuration || duration) + 160);
            return el;
        }

        // VFX 专用的 runClass (Bug1 fix: spawnSkillVfx 无法访问 playSkillAnimation 中的 runClass)
        function runVfxClass(el, className, ms) {
            el.classList.remove(className);
            void el.offsetWidth;
            el.classList.add(className);
            setTimeout(function() {
                if (el) el.classList.remove(className);
            }, ms || duration);
        }

        var idClass = ' skill-vfx-id-' + (skill.id || 'normal');
        var typeClass = ' skill-vfx-' + (skill.damageType || 'normal');
        var baseClass = 'skill-vfx skill-vfx-' + side + typeClass + idClass;

        switch (skill.id) {
            case 'slash_dash':
                addVfx(baseClass + ' skill-vfx-slash-wave', startX, startY - 8, '', 0, duration);
                addVfx('skill-vfx skill-vfx-trail skill-vfx-' + side, startX, startY, '', 60, duration - 120);
                break;
            case 'radial_blind':
                addVfx(baseClass + ' skill-vfx-blind-flash', (startX + endX) / 2, (startY + endY) / 2, '', 0, duration);
                break;
            case 'radial_javelin':
                for (var i = 0; i < 4; i++) {
                    var j = addVfx(baseClass + ' skill-vfx-javelin', startX, startY - 18 + i * 10, '', i * 65, duration - 120);
                    j.style.setProperty('--vfx-y', (dy - 24 + i * 16) + 'px');
                }
                break;
            case 'exalted_blade':
                addVfx(baseClass + ' skill-vfx-exalted-wave', startX, startY - 8, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-blade-burst', endX, endY, '', Math.floor(duration * 0.48), 420);
                break;
            case 'shock':
                addVfx(baseClass + ' skill-vfx-lightning-bolt', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-electric-line', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-electric-spark', endX, endY, '', Math.floor(duration * 0.45), 380);
                break;
            case 'speed':
                addVfx(baseClass + ' skill-vfx-speed-ring', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-speed-trail', startX, startY, '', 80, duration - 100);
                break;
            case 'electric_shield':
                addVfx(baseClass + ' skill-vfx-shield-dome', startX, startY, '', 0, duration);
                break;
            case 'discharge':
                addVfx(baseClass + ' skill-vfx-discharge-em-wave', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-discharge-core', startX, startY, '', 0, Math.floor(duration * 0.55));
                break;
            case 'pull':
                addVfx(baseClass + ' skill-vfx-magnetic-vortex', startX + (side === 'player' ? 46 : -46), startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-magnetic-tether', endX, endY, '', 0, duration);
                break;
            case 'magnetize':
                addVfx(baseClass + ' skill-vfx-magnetize-field', endX, endY, '', 0, duration);
                break;
            case 'polarize':
                addVfx(baseClass + ' skill-vfx-polarize-wave skill-vfx-reach-target', startX, startY, '', 0, duration);
                break;
            case 'crush':
                addVfx(baseClass + ' skill-vfx-crush-rings', endX, endY, '', 0, duration);
                break;
            case 'grineer_cleave':
            case 'grineer_combo_slash':
            case 'scorpion_combo':
            case 'beast_pounce':
            case 'beast_rend':
            case 'eviscerator_carve':
                addVfx(baseClass + ' enemy-vfx-red-slash', startX, startY, '', 0, duration);
                break;
            case 'flameblade_rift_strike':
            case 'flameblade_teleport_slash':
                addVfx(baseClass + ' enemy-vfx-teleport-smoke', startX, startY, '', 0, 420);
                addVfx(baseClass + ' enemy-vfx-fire-slash', endX, endY, '', Math.floor(duration * 0.38), 460);
                break;
            case 'scorpion_hook':
                addVfx(baseClass + ' enemy-vfx-hook-line', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-hook-tip', startX, startY, '⌁', 0, duration);
                addVfx(baseClass + ' enemy-vfx-hook-snap', endX, endY, '', Math.floor(duration * 0.45), 360);
                break;
            case 'shield_lancer_bash':
                addVfx(baseClass + ' enemy-vfx-riot-shield', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-shield-ghost', startX, startY, '', 80, duration - 80);
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.52), 360);
                break;
            case 'ballista_snipe':
            case 'ballista_puncture':
                addVfx(baseClass + ' enemy-vfx-aim-line', startX, startY, '', 0, Math.floor(duration * 0.75));
                addVfx(baseClass + ' enemy-vfx-sniper-shot', startX, startY, '', Math.floor(duration * 0.45), 300);
                break;
            case 'eviscerator_sawblade':
                addVfx(baseClass + ' enemy-vfx-sawblade', startX, startY, '✹', 0, duration);
                break;
            case 'trooper_shotgun':
            case 'trooper_close_blast':
                for (var p = 0; p < 5; p++) {
                    var pellet = addVfx(baseClass + ' enemy-vfx-shotgun-pellet', startX, startY, '', p * 28, 360);
                    pellet.style.setProperty('--vfx-y', (dy - 28 + p * 14) + 'px');
                }
                break;
            case 'lancer_grakata':
            case 'lancer_burst':
            case 'shield_lancer_viper':
            case 'commander_grakata_sustain':
            case 'vor_seer_burst':
                if (skill.id === 'vor_seer_burst') {
                    addVfx(baseClass + ' vor-vfx-seer-scope', endX, endY, '', 0, Math.floor(duration * 0.52));
                    addVfx(baseClass + ' vor-vfx-janus-glyph', startX, startY - 38, '🔑', 60, Math.floor(duration * 0.62));
                    for (var vb = 0; vb < 3; vb++) {
                        var seerLine = addVfx(baseClass + ' enemy-vfx-bullet-line vor-vfx-seer-bullet', startX, startY - 10 + vb * 9, '', 260 + vb * 150, 360);
                        seerLine.style.setProperty('--vfx-y', (dy - 16 + vb * 13) + 'px');
                    }
                    addVfx(baseClass + ' vor-vfx-hit-sparks', endX, endY, '', Math.floor(duration * 0.78), 420);
                } else {
                    for (var b = 0; b < 5; b++) {
                        addVfx(baseClass + ' enemy-vfx-bullet-line', startX, startY - 8 + b * 3, '', b * 55, 260);
                    }
                }
                break;
            case 'scorch_flamethrower':
            case 'scorch_ignite':
                addVfx(baseClass + ' enemy-vfx-flame-cone', startX, startY, '', 0, duration);
                break;
            case 'seeker_latcher':
                addVfx(baseClass + ' enemy-vfx-latcher', startX, startY + 16, '●', 0, duration);
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.72), 360);
                break;
            case 'hellion_missile_barrage':
                addVfx(baseClass + ' enemy-vfx-jet-flame enemy-vfx-jet-lift', startX, startY + 30, '', 0, Math.floor(duration * 0.52));
                addVfx(baseClass + ' enemy-vfx-warning-reticle', endX, endY, '', 120, Math.floor(duration * 0.58));
                for (var m = 0; m < 4; m++) {
                    var rocket = addVfx(baseClass + ' enemy-vfx-rocket', startX, startY - 38, '', m * 85, duration - 80);
                    rocket.style.setProperty('--vfx-y', (dy + 26 - m * 18) + 'px');
                    rocket.style.setProperty('--rocket-arc', (-42 + m * 22) + 'px');
                }
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.72), 420);
                break;
            case 'hellion_jet_fire':
                addVfx(baseClass + ' enemy-vfx-jet-flame', startX, startY + 28, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-bullet-line', startX, startY, '', 130, 420);
                break;
            case 'bombard_homing_rocket':
            case 'mortar_bombard_shell':
            case 'napalm_fire_bomb':
                addVfx(baseClass + ' enemy-vfx-warning-reticle enemy-vfx-danger-reticle', endX, endY, '', 0, Math.floor(duration * 0.62));
                addVfx(baseClass + ' enemy-vfx-rocket enemy-vfx-heavy-rocket', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-impact-burst enemy-vfx-explosion', endX, endY, '', Math.floor(duration * 0.68), 520);
                break;
            case 'napalm_heat_wave':
                addVfx(baseClass + ' enemy-vfx-flame-cone enemy-vfx-napalm-wave', startX, startY, '', 0, duration);
                break;
            case 'heavy_gunner_suppress':
                for (var hg = 0; hg < 9; hg++) {
                    addVfx(baseClass + ' enemy-vfx-bullet-line enemy-vfx-heavy-bullet', startX, startY - 16 + (hg % 3) * 8, '', hg * 42, 240);
                }
                break;
            case 'heavy_gunner_slam':
            case 'bombard_seismic_slam':
                addVfx(baseClass + ' enemy-vfx-ground-shockwave', startX, startY + 26, '', 0, duration);
                break;
            case 'commander_switch_teleport':
            case 'vor_teleport_shot':
                addVfx(baseClass + ' enemy-vfx-teleport-ring', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-teleport-ring', endX, endY, '', 80, duration - 80);
                addVfx(baseClass + ' enemy-vfx-switch-beam', startX, startY, '', 120, duration - 180);
                if (skill.id === 'vor_teleport_shot') {
                    addVfx(baseClass + ' vor-vfx-afterimage', startX, startY, '', 60, duration - 160);
                    addVfx(baseClass + ' vor-vfx-rift-cut', (startX + endX) / 2, (startY + endY) / 2, '', 180, duration - 240);
                    addVfx(baseClass + ' enemy-vfx-bullet-line enemy-vfx-heavy-bullet vor-vfx-exec-shot', startX, startY, '', 420, 360);
                    addVfx(baseClass + ' vor-vfx-hit-sparks', endX, endY, '', Math.floor(duration * 0.72), 420);
                }
                break;
            case 'vor_janus_beam':
                addVfx(baseClass + ' vor-vfx-janus-glyph vor-vfx-janus-glyph-large', startX, startY - 38, '🔑', 0, Math.floor(duration * 0.62));
                addVfx(baseClass + ' vor-vfx-rift-ring', endX, endY, '', 120, Math.floor(duration * 0.58));
                addVfx(baseClass + ' vor-vfx-beam-warmup', startX, startY, '', 170, Math.floor(duration * 0.44));
                addVfx(baseClass + ' skill-vfx-electric-line enemy-vfx-switch-beam vor-vfx-janus-beam-core', startX, startY, '', 430, duration - 380);
                addVfx(baseClass + ' vor-vfx-janus-beam-side vor-vfx-janus-beam-side-a', startX, startY - 14, '', 500, duration - 480);
                addVfx(baseClass + ' vor-vfx-janus-beam-side vor-vfx-janus-beam-side-b', startX, startY + 14, '', 560, duration - 520);
                addVfx(baseClass + ' skill-vfx-electric-spark enemy-vfx-impact-burst vor-vfx-void-burst', endX, endY, '', Math.floor(duration * 0.72), 620);
                break;
            case 'vor_nervos_mine':
                addVfx(baseClass + ' vor-vfx-command-pulse', startX, startY, '', 0, Math.floor(duration * 0.38));
                for (var mine = 0; mine < 3; mine++) {
                    var mineEl = addVfx(baseClass + ' enemy-vfx-latcher vor-vfx-nervos-mine', startX, startY + 18, mine === 1 ? '◆' : '◇', mine * 130, duration - 180);
                    mineEl.style.setProperty('--vfx-y', (dy + 28 - mine * 22) + 'px');
                    mineEl.style.setProperty('--mine-offset', (-34 + mine * 34) + 'px');
                }
                addVfx(baseClass + ' vor-vfx-mine-grid', endX, endY, '', 180, Math.floor(duration * 0.62));
                addVfx(baseClass + ' enemy-vfx-warning-reticle enemy-vfx-danger-reticle', endX, endY, '', 220, Math.floor(duration * 0.58));
                addVfx(baseClass + ' enemy-vfx-impact-burst enemy-vfx-explosion vor-vfx-mine-detonation', endX, endY, '', Math.floor(duration * 0.76), 620);
                break;
            case 'vor_sphere_shield':
                addVfx(baseClass + ' vor-vfx-shield-build', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-shield-dome vor-vfx-shield-dome-outer', startX, startY, '', 80, duration - 80);
                addVfx(baseClass + ' vor-vfx-janus-glyph', startX, startY - 38, '🔑', 100, duration - 160);
                addVfx(baseClass + ' vor-vfx-shield-runes', startX, startY, '', 160, duration - 220);
                break;
            case 'drahk_master_summon':
                for (var beast = 0; beast < 3; beast++) {
                    var beastEl = addVfx(baseClass + ' enemy-vfx-beast-shadow', startX, startY + 14 - beast * 14, '', beast * 110, duration - 80);
                    beastEl.style.setProperty('--vfx-y', (dy + 20 - beast * 16) + 'px');
                }
                break;
            case 'drahk_master_halikar':
                addVfx(baseClass + ' enemy-vfx-boomerang', startX, startY, '◈', 0, duration);
                break;
            case 'manic_cloak_pounce':
            case 'manic_rend':
                addVfx(baseClass + ' enemy-vfx-manic-afterimage', startX, startY - 18, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-manic-afterimage enemy-vfx-manic-afterimage-2', startX, startY + 16, '', 80, duration - 80);
                addVfx(baseClass + ' enemy-vfx-red-slash', endX, endY, '', Math.floor(duration * 0.48), 380);
                break;
            case 'nox_toxic_glob':
                addVfx(baseClass + ' enemy-vfx-toxic-glob', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-toxic-splat', endX, endY, '', Math.floor(duration * 0.56), 520);
                addVfx(baseClass + ' enemy-vfx-toxic-cloud', endX, endY, '', Math.floor(duration * 0.56), 620);
                break;
            case 'nox_charge':
                addVfx(baseClass + ' enemy-vfx-toxic-cloud', startX, startY, '', 120, duration - 120);
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.55), 420);
                break;
            // Corpus 激光射击类
            case 'corpus_dera_burst':
            case 'corpus_supra_suppress':
            case 'corpus_supra_hail':
            case 'corpus_tech_barrage':
                for (var cb = 0; cb < 6; cb++) {
                    addVfx(baseClass + ' enemy-vfx-bullet-line', startX, startY - 12 + (cb % 3) * 6, '', cb * 55, 280);
                }
                break;
            // Corpus 等离子手雷
            case 'corpus_plasma_grenade':
                addVfx(baseClass + ' enemy-vfx-rocket', startX, startY - 20, '', 0, Math.floor(duration * 0.55));
                addVfx(baseClass + ' enemy-vfx-impact-burst enemy-vfx-explosion', endX, endY, '', Math.floor(duration * 0.55), 520);
                break;
            // Corpus 散弹
            case 'corpus_detron_blast':
                for (var ds = 0; ds < 5; ds++) {
                    var detronP = addVfx(baseClass + ' enemy-vfx-shotgun-pellet', startX, startY, '', ds * 30, 380);
                    detronP.style.setProperty('--vfx-y', (dy - 20 + ds * 10) + 'px');
                }
                break;
            // Corpus 电击棍
            case 'corpus_prova_shock':
            case 'corpus_prova_stun':
                addVfx(baseClass + ' enemy-vfx-shield-ghost', startX, startY, '', 0, Math.floor(duration * 0.4));
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.45), 420);
                break;
            // Corpus 护盾超载
            case 'corpus_shield_overcharge':
            case 'corpus_deploy_osprey':
                addVfx(baseClass + ' enemy-vfx-shield-ghost', startX, startY, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-ground-shockwave', startX, startY + 20, '', Math.floor(duration * 0.4), 500);
                break;
            // Corpus Nullifier 反制力场
            case 'corpus_nullify_field':
                addVfx(baseClass + ' enemy-vfx-shield-ghost enemy-vfx-ground-shockwave', startX, startY, '', 0, duration);
                break;
            // Corpus Lanka 狙击
            case 'corpus_lanka_snipe':
            case 'corpus_lanka_charge':
                addVfx(baseClass + ' enemy-vfx-aim-line', startX, startY, '', 0, Math.floor(duration * 0.65));
                addVfx(baseClass + ' enemy-vfx-sniper-shot', startX, startY, '', Math.floor(duration * 0.5), 350);
                break;
            // Corpus 无人机部署
            case 'corpus_drone_swarm':
            case 'corpus_drone_deploy':
                addVfx(baseClass + ' enemy-vfx-shield-ghost', startX, startY - 25, '', 0, Math.floor(duration * 0.4));
                addVfx(baseClass + ' enemy-vfx-shotgun-pellet', startX, startY - 25, '✦', Math.floor(duration * 0.4), Math.floor(duration * 0.5));
                break;
            // Corpus 炮塔部署
            case 'corpus_turret_deploy':
                addVfx(baseClass + ' enemy-vfx-warning-reticle', endX, endY, '', 0, Math.floor(duration * 0.45));
                for (var tg = 0; tg < 4; tg++) {
                    addVfx(baseClass + ' enemy-vfx-bullet-line', startX, startY, '', Math.floor(duration * 0.5) + tg * 80, 280);
                }
                break;
            // Corpus 驱逐脉冲
            case 'corpus_evict_pulse':
                addVfx(baseClass + ' enemy-vfx-ground-shockwave', startX, startY + 20, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.5), 420);
                break;
            // Corpus 干扰场域
            case 'corpus_disrupt_field':
                addVfx(baseClass + ' enemy-vfx-shield-ghost', endX, endY, '', 0, duration);
                break;
            // Corpus Boss 能量超载
            case 'corpus_energy_overload':
                addVfx(baseClass + ' enemy-vfx-ground-shockwave', startX, startY + 20, '', 0, duration);
                addVfx(baseClass + ' enemy-vfx-impact-burst enemy-vfx-explosion', endX, endY, '', Math.floor(duration * 0.5), 520);
                break;
            // Corpus Boss 护盾虹吸
            case 'corpus_shield_drain':
                addVfx(baseClass + ' enemy-vfx-shield-ghost', startX, startY, '', 0, Math.floor(duration * 0.35));
                addVfx(baseClass + ' enemy-vfx-hook-line', endX, startX, '', Math.floor(duration * 0.35), Math.floor(duration * 0.5));
                break;
            // Corpus Boss 数据炸弹
            case 'corpus_data_bomb':
                addVfx(baseClass + ' enemy-vfx-warning-reticle enemy-vfx-danger-reticle', endX, endY, '', 0, Math.floor(duration * 0.55));
                addVfx(baseClass + ' enemy-vfx-rocket enemy-vfx-heavy-rocket', startX, startY, '', 0, Math.floor(duration * 0.6));
                addVfx(baseClass + ' enemy-vfx-impact-burst enemy-vfx-explosion', endX, endY, '', Math.floor(duration * 0.65), 600);
                break;
            // ═══ 恐鸟 VFX ═══
            // ===== 射击/连射类 =====
            case 'moa_plasma_rifle':
                for (var mei = 0; mei < 6; mei++) {
                    var meLine = addVfx(baseClass + ' moavfx-plasma-bolt', startX, startY - 10 + mei * 4, '', mei * 55, 320);
                }
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 400);
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.75), 350);
                break;
            case 'reverse_moa_beam':
                for (var rbi = 0; rbi < 3; rbi++) {
                    var rbBeam = addVfx(baseClass + ' moavfx-plasma-bolt', startX, startY - 6 + rbi * 6, '', rbi * 80, 380);
                    rbBeam.style.filter = 'hue-rotate(200deg) drop-shadow(0 0 12px #88ccff)';
                }
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 500);
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.8), 400);
                break;
            case 'dera_moa_burst':
                for (var dbi = 0; dbi < 5; dbi++) {
                    var dbBolt = addVfx(baseClass + ' moavfx-plasma-bolt', startX, startY - 12 + dbi * 5, '', dbi * 65, 300);
                    dbBolt.style.filter = 'hue-rotate(30deg) drop-shadow(0 0 10px #ffaa66)';
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.7), 350);
                break;
            case 'twin_moa_suppress':
                for (var tsi = 0; tsi < 8; tsi++) {
                    var tsBolt = addVfx(baseClass + ' moavfx-mini-laser', startX, startY - 14 + tsi * 4, '', tsi * 40, 250);
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.75), 300);
                break;
            case 'cryo_moa_beam':
                var cmBeam = addVfx(baseClass + ' moavfx-cryo-beam', startX, startY, '', 0, duration);
                for (var csi = 0; csi < 4; csi++) {
                    addVfx(baseClass + ' moavfx-cryo-shard', endX, endY - 10 + csi * 6, '', Math.floor(duration * 0.6) + csi * 80, 300);
                }
                addVfx(baseClass + ' moavfx-ice-explosion', endX, endY, '', Math.floor(duration * 0.7), 450);
                break;
            case 'amalgam_moa_shot':
                for (var asi = 0; asi < 3; asi++) {
                    var asBolt = addVfx(baseClass + ' moavfx-plasma-bolt', startX, startY - 8 + asi * 8, '', asi * 100, 400);
                    asBolt.style.filter = 'hue-rotate(220deg) drop-shadow(0 0 14px #88aaff)';
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.8), 400);
                break;
            case 'shock_moa_rifle':
                for (var sri = 0; sri < 4; sri++) {
                    var srBolt = addVfx(baseClass + ' moavfx-plasma-bolt', startX, startY - 6 + sri * 4, '', sri * 70, 300);
                    srBolt.style.filter = 'hue-rotate(40deg) drop-shadow(0 0 10px #ffcc44)';
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.7), 350);
                break;
            case 'mini_moa_laser':
                for (var mli = 0; mli < 4; mli++) {
                    addVfx(baseClass + ' moavfx-mini-laser', startX, startY - 6 + mli * 4, '', mli * 80, 260);
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.7), 280);
                break;
            // ===== 火焰喷射类 =====
            case 'lava_moa_ignis':
                var mFlame1 = addVfx(baseClass + ' moavfx-lava-flame', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-heat-wave', startX + 40, startY, '', 100, duration - 100);
                addVfx(baseClass + ' moavfx-lava-flame', startX, startY - 15, '', 150, duration - 150);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.6), 500);
                for (var lfi = 0; lfi < 5; lfi++) {
                    addVfx(baseClass + ' enemy-vfx-impact-burst', endX - 15 + lfi * 8, endY - 8 + lfi * 4, '', Math.floor(duration * 0.7) + lfi * 40, 250);
                }
                break;
            case 'fusion_moa_beam':
                var mFusion = addVfx(baseClass + ' moavfx-lava-flame', startX, startY, '', 0, duration);
                mFusion.style.filter = 'hue-rotate(-15deg) drop-shadow(0 0 20px #ff8844)';
                addVfx(baseClass + ' moavfx-heat-wave', startX + 50, startY, '', 80, duration - 80);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.65), 450);
                addVfx(baseClass + ' enemy-vfx-impact-burst', endX, endY, '', Math.floor(duration * 0.7), 400);
                break;
            // ===== 磁轨炮蓄力射击类 =====
            case 'railgun_moa_shot':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.45));
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, Math.floor(duration * 0.5));
                addVfx(baseClass + ' enemy-vfx-warning-reticle', endX, endY, '', 0, Math.floor(duration * 0.45));
                addVfx(baseClass + ' moavfx-railgun-spark', startX, startY, '', Math.floor(duration * 0.4), 200);
                addVfx(baseClass + ' moavfx-railgun-beam', startX, startY, '', Math.floor(duration * 0.48), 380);
                addVfx(baseClass + ' moavfx-railgun-spark', endX, endY, '', Math.floor(duration * 0.82), 300);
                addVfx(baseClass + ' moavfx-explode-ring', endX, endY, '', Math.floor(duration * 0.85), 600);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.8), 500);
                break;
            // ===== 震荡践踏类 =====
            case 'shock_moa_stomp':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.3));
                addVfx(baseClass + ' moavfx-stomp-wave', endX, endY, '', Math.floor(duration * 0.45), 650);
                var mStompW2 = addVfx(baseClass + ' moavfx-stomp-wave', endX, endY, '', Math.floor(duration * 0.48), 750);
                mStompW2.style.transform = 'scale(0.65)';
                var mStompW3 = addVfx(baseClass + ' moavfx-stomp-wave', endX, endY, '', Math.floor(duration * 0.52), 850);
                mStompW3.style.transform = 'scale(0.45)';
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.5), 500);
                addVfx(baseClass + ' moavfx-heat-wave', endX, endY, '', Math.floor(duration * 0.55), 500);
                break;
            case 'amalgam_moa_stomp':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.3));
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, Math.floor(duration * 0.35));
                addVfx(baseClass + ' moavfx-stomp-wave', endX, endY, '', Math.floor(duration * 0.45), 700);
                var mAmStomp2 = addVfx(baseClass + ' moavfx-stomp-wave', endX, endY, '', Math.floor(duration * 0.5), 800);
                mAmStomp2.style.transform = 'scale(0.6)';
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.5), 600);
                addVfx(baseClass + ' moavfx-heat-wave', endX, endY, '', Math.floor(duration * 0.55), 550);
                break;
            // ===== 冲撞类 =====
            case 'reverse_moa_charge':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.4));
                for (var mbci = 0; mbci < 5; mbci++) {
                    var mbProgress = (mbci + 1) / 6;
                    var mbX = startX + (endX - startX) * mbProgress;
                    var mbY = startY + (endY - startY) * mbProgress;
                    addVfx(baseClass + ' moavfx-charge-trail', mbX, mbY, '', Math.floor(duration * mbProgress * 0.6), 300);
                }
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.7), 500);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.75), 600);
                break;
            // ===== 能量弹/圆盘类 =====
            case 'disc_moa_launch':
                var mDisc1 = addVfx(baseClass + ' moavfx-energy-disc', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 300);
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.85), 400);
                break;
            case 'disc_moa_ricochet':
                var mDisc2 = addVfx(baseClass + ' moavfx-energy-disc', startX, startY, '', 0, duration);
                mDisc2.style.filter = 'hue-rotate(180deg) drop-shadow(0 0 16px #88ccff)';
                addVfx(baseClass + ' moavfx-ice-explosion', endX, endY, '', Math.floor(duration * 0.85), 450);
                break;
            // ===== 冰冻射线类 =====
            case 'cryo_moa_freeze':
                var mFreeze1 = addVfx(baseClass + ' moavfx-cryo-beam', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 500);
                for (var cfi = 0; cfi < 6; cfi++) {
                    addVfx(baseClass + ' moavfx-cryo-shard', endX - 20 + cfi * 8, endY - 12 + cfi * 5, '', Math.floor(duration * 0.6) + cfi * 60, 350);
                }
                addVfx(baseClass + ' moavfx-ice-explosion', endX, endY, '', Math.floor(duration * 0.65), 500);
                break;
            // ===== 自爆类 =====
            case 'mini_moa_self_destruct':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.4));
                addVfx(baseClass + ' moavfx-self-destruct-flash', startX, startY, '', Math.floor(duration * 0.45), 700);
                addVfx(baseClass + ' moavfx-explode-ring', startX, startY, '', Math.floor(duration * 0.5), 800);
                var mMiniW2 = addVfx(baseClass + ' moavfx-explode-ring', startX, startY, '', Math.floor(duration * 0.55), 900);
                mMiniW2.style.transform = 'scale(0.6)';
                addVfx(baseClass + ' moavfx-shock-field', startX, startY, '', Math.floor(duration * 0.5), 650);
                break;
            case 'demo_moa_charge':
                addVfx(baseClass + ' moavfx-charge-glow', startX, startY, '', 0, Math.floor(duration * 0.35));
                addVfx(baseClass + ' moavfx-explode-core', startX, startY, '', Math.floor(duration * 0.5), 800);
                addVfx(baseClass + ' moavfx-self-destruct-flash', startX, startY, '', Math.floor(duration * 0.55), 900);
                addVfx(baseClass + ' moavfx-explode-ring', startX, startY, '', Math.floor(duration * 0.55), 900);
                var mDemoW2 = addVfx(baseClass + ' moavfx-explode-ring', startX, startY, '', Math.floor(duration * 0.6), 1000);
                mDemoW2.style.transform = 'scale(0.55)';
                addVfx(baseClass + ' moavfx-shock-field', startX, startY, '', Math.floor(duration * 0.55), 700);
                break;
            // ===== 爆炸能量球类 =====
            case 'demo_moa_explosive':
                var mDemoBall = addVfx(baseClass + ' moavfx-magnetized-ball', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 400);
                addVfx(baseClass + ' moavfx-explode-core', endX, endY, '', Math.floor(duration * 0.85), 700);
                addVfx(baseClass + ' moavfx-explode-ring', endX, endY, '', Math.floor(duration * 0.88), 800);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.85), 650);
                break;
            // ===== 双发火箭类 =====
            case 'twin_moa_rockets':
                var mRkt1 = addVfx(baseClass + ' moavfx-rocket', startX, startY - 14, '', 0, duration);
                var mRkt2 = addVfx(baseClass + ' moavfx-rocket', startX, startY + 14, '', 120, duration - 120);
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 350);
                addVfx(baseClass + ' enemy-vfx-warning-reticle', endX, endY, '', 0, Math.floor(duration * 0.3));
                addVfx(baseClass + ' moavfx-explode-core', endX, endY - 10, '', Math.floor(duration * 0.85), 650);
                addVfx(baseClass + ' moavfx-explode-core', endX, endY + 10, '', Math.floor(duration * 0.87), 650);
                addVfx(baseClass + ' moavfx-explode-ring', endX, endY, '', Math.floor(duration * 0.88), 750);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.85), 600);
                break;
            // ===== 相位治疗类 =====
            case 'amalgam_moa_heal':
                addVfx(baseClass + ' moavfx-heal-wave', startX, startY, '', 0, duration);
                for (var mhi = 0; mhi < 4; mhi++) {
                    addVfx(baseClass + ' moavfx-heal-wave', startX, startY, '', mhi * 180, 600);
                }
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 500);
                break;
            // ===== 部署无人机类 =====
            case 'railgun_moa_drone':
            case 'fusion_moa_drone':
                addVfx(baseClass + ' moavfx-drone', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 400);
                break;
            // ===== 热浪冲击类 =====
            case 'lava_moa_wave':
                addVfx(baseClass + ' moavfx-stomp-wave', startX, startY, '', 0, 700);
                addVfx(baseClass + ' moavfx-heat-wave', startX, startY, '', 80, 600);
                addVfx(baseClass + ' moavfx-lava-flame', startX, startY, '', 120, duration - 120);
                addVfx(baseClass + ' moavfx-shock-field', startX, startY, '', Math.floor(duration * 0.5), 550);
                break;
            // ===== 踢击/近战/掷弹类 =====
            case 'moa_kick':
                addVfx(baseClass + ' moavfx-kick-arc', startX, startY, '', 0, duration);
                addVfx(baseClass + ' moavfx-energy-ring', endX, endY, '', Math.floor(duration * 0.65), 400);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.7), 450);
                break;
            case 'dera_moa_grenade':
                addVfx(baseClass + ' moavfx-magnetized-ball', startX, startY, '', 0, Math.floor(duration * 0.6));
                addVfx(baseClass + ' moavfx-energy-ring', startX, startY, '', 0, 350);
                addVfx(baseClass + ' moavfx-explode-core', endX, endY, '', Math.floor(duration * 0.85), 650);
                addVfx(baseClass + ' moavfx-explode-ring', endX, endY, '', Math.floor(duration * 0.88), 750);
                addVfx(baseClass + ' moavfx-shock-field', endX, endY, '', Math.floor(duration * 0.85), 550);
                break;
            // ═══ Rhino VFX ═══
            case 'rhino_charge':
                // 冲锋残影拖尾(增大尺寸)
                for (var rc = 0; rc < 5; rc++) {
                    var trailT = Math.floor(duration * rc * 0.07);
                    var trailEl = addVfx(baseClass + ' skill-vfx-rhino-charge-trail', startX, startY, '', trailT, Math.floor(duration * 0.5));
                    trailEl.style.setProperty('--trail-progress', (rc * 0.2) + '');
                    trailEl.style.width = '300px';
                    trailEl.style.height = '55px';
                    trailEl.style.marginLeft = '-150px';
                    trailEl.style.marginTop = '-27px';
                }
                // 地面裂纹
                var crackEl = addVfx(baseClass + ' skill-vfx-rhino-charge-crack', endX, endY + 10, '', Math.floor(duration * 0.5), 520);
                crackEl.style.setProperty('--vfx-distance', distance + 'px');
                crackEl.style.setProperty('animation', 'vfxRhinoChargeCrack 520ms ease-out forwards', 'important');
                // 命中冲击波
                addVfx(baseClass + ' skill-vfx-rhino-impact', endX, endY, '', Math.floor(duration * 0.55), 520);
                break;
            case 'iron_skin':
                // 金属穹顶护盾
                addVfx(baseClass + ' skill-vfx-iron-skin-dome', startX, startY, '', 0, Math.max(duration, 1500));
                // 金属碎片飞溅
                for (var isk = 0; isk < 6; isk++) {
                    var sparkAngle = isk * 60;
                    var sparkEl = addVfx(baseClass + ' skill-vfx-iron-skin-spark', startX, startY, '', 150 + isk * 40, 400);
                    sparkEl.style.setProperty('--spark-angle', sparkAngle + 'deg');
                    sparkEl.style.setProperty('animation', 'vfxIronSkinSpark 400ms ease-out forwards', 'important');
                }
                // 电弧闪烁
                for (var arc = 0; arc < 3; arc++) {
                    var arcEl = addVfx(baseClass + ' skill-vfx-iron-skin-arc', startX, startY, '', arc * 250 + 200, 350);
                    arcEl.style.setProperty('--arc-angle', (arc * 120 + 30) + 'deg');
                    arcEl.style.setProperty('animation', 'vfxIronSkinArc 350ms ease-out forwards', 'important');
                }
                break;
            case 'roar':
                // 多层金色声波
                addVfx(baseClass + ' skill-vfx-roar-wave', startX, startY, '', 80, duration - 80);
                addVfx(baseClass + ' skill-vfx-roar-wave skill-vfx-roar-wave-2', startX, startY, '', 180, duration - 180);
                addVfx(baseClass + ' skill-vfx-roar-wave skill-vfx-roar-wave-3', startX, startY, '', 280, duration - 280);
                // 能量粒子
                for (var rp = 0; rp < 8; rp++) {
                    var roarP = addVfx(baseClass + ' skill-vfx-roar-particle', startX, startY, '', 120 + rp * 60, 480);
                    roarP.style.setProperty('--roar-particle-angle', (rp * 45) + 'deg');
                    roarP.style.setProperty('animation', 'vfxRoarParticle 480ms ease-out forwards', 'important');
                }
                // 震碎效果
                addVfx(baseClass + ' skill-vfx-roar-shatter', startX, startY, '', Math.floor(duration * 0.35), 500);
                break;
            case 'rhino_stomp':
                // 起跳尘土
                addVfx(baseClass + ' skill-vfx-rhino-stomp-dust', startX, startY + 20, '', 0, Math.floor(duration * 0.35));
                // 弧线飞行残影(增加到5个，弧线轨迹)
                for (var sri = 0; sri < 5; sri++) {
                    var progress = (sri + 1) / 6;
                    var ghostX = startX + (endX - startX) * progress;
                    var ghostY = startY - 60 * Math.sin(progress * Math.PI);
                    var stompGhost = addVfx(baseClass + ' skill-vfx-rhino-stomp-ghost', ghostX, ghostY, '', Math.floor(duration * progress * 0.5), 400);
                    stompGhost.style.setProperty('animation', 'vfxStompGhost 400ms ease-out forwards', 'important');
                }
                // 多层冲击波(3层不同大小/颜色)
                addVfx(baseClass + ' skill-vfx-stomp-wave-layer1', endX, endY + 20, '', Math.floor(duration * 0.42), 700);
                addVfx(baseClass + ' skill-vfx-stomp-wave-layer2', endX, endY + 20, '', Math.floor(duration * 0.44), 800);
                addVfx(baseClass + ' skill-vfx-stomp-wave-layer3', endX, endY + 20, '', Math.floor(duration * 0.46), 900);
                // 放射状裂纹(地面碎裂)
                addVfx(baseClass + ' skill-vfx-stomp-radial-crack', endX, endY + 15, '', Math.floor(duration * 0.45), 800);
                // 地面弹坑和碎石
                addVfx(baseClass + ' skill-vfx-stomp-crater', endX, endY + 15, '', Math.floor(duration * 0.45), 480);
                addVfx(baseClass + ' skill-vfx-rhino-stomp-debris', endX, endY + 10, '', Math.floor(duration * 0.44), 600);
                break;

            // ═══ Ash VFX ═══
            case 'shuriken':
                // 手里剑飞行体(旋转+拖尾)
                for (var sh = 0; sh < 3; sh++) {
                    var shurikenProj = addVfx(baseClass + ' skill-vfx-shuriken-projectile', startX, startY - 12 + sh * 12, '', sh * 90, duration - 120);
                    shurikenProj.style.setProperty('--projectile-x', (endX - startX) + 'px');
                    shurikenProj.style.setProperty('--projectile-y', (dy - 20 + sh * 14) + 'px');
                    shurikenProj.style.setProperty('animation', 'projectileShuriken ' + (duration - 120) + 'ms ease-out forwards', 'important');
                }
                // 命中火花(增大效果+十字准星标记)
                var shurikenHit1 = addVfx(baseClass + ' skill-vfx-shuriken-hit', endX, endY, '', Math.floor(duration * 0.65), 480);
                shurikenHit1.style.setProperty('animation', 'vfxShurikenHit 480ms ease-out forwards', 'important');
                // 钉墙效果：十字准星+闪烁钉在敌人位置
                var shurikenPin1 = addVfx(baseClass + ' skill-vfx-shuriken-pin', endX, endY - 15, '', Math.floor(duration * 0.68), 600);
                shurikenPin1.style.setProperty('animation', 'vfxShurikenPin 600ms ease-out forwards', 'important');
                // 钉墙闪光环
                addVfx(baseClass + ' skill-vfx-shuriken-hit', endX, endY, '', Math.floor(duration * 0.72), 350);
                break;
            case 'smoke_screen':
                // 烟幕弹落地
                addVfx(baseClass + ' skill-vfx-smoke-bomb', startX, startY, '', 0, Math.floor(duration * 0.35));
                // 烟雾扩散(20个更大粒子)
                for (var sp = 0; sp < 20; sp++) {
                    var smokeP = addVfx(baseClass + ' skill-vfx-smoke-particle', startX, startY, '', sp * 40, duration - 100);
                    var smokeX = (Math.random() - 0.5) * 140;
                    var smokeY = (Math.random() - 0.5) * 80;
                    smokeP.style.setProperty('--smoke-x', smokeX + 'px');
                    smokeP.style.setProperty('--smoke-y', smokeY + 'px');
                    smokeP.style.setProperty('animation', 'smokeParticle ' + (duration - 100) + 'ms ease-out forwards', 'important');
                }
                // Ash位置残影消散
                addVfx(baseClass + ' skill-vfx-smoke-afterimage', startX, startY, '', Math.floor(duration * 0.25), Math.floor(duration * 0.5));
                // 隐身效果由角色动作区的代码处理(持续烟雾+半透明闪烁)
                break;
            case 'teleport':
                // 出发点紫色残影
                addVfx(baseClass + ' skill-vfx-teleport-afterimage', startX, startY, '', 0, Math.floor(duration * 0.3));
                // 路径能量线
                addVfx(baseClass + ' skill-vfx-teleport-path', startX, startY, '', Math.floor(duration * 0.1), Math.floor(duration * 0.4));
                // 目的地刀光斩击
                addVfx(baseClass + ' skill-vfx-teleport-slash', endX, endY, '', Math.floor(duration * 0.48), 420);
                // 十字标记
                addVfx(baseClass + ' skill-vfx-teleport-mark', endX, endY, '', Math.floor(duration * 0.55), 600);
                var teleportReturn = addVfx(baseClass + ' skill-vfx-teleport-return', endX, endY, '', Math.floor(duration * 0.65), Math.floor(duration * 0.35));
                teleportReturn.style.setProperty('animation', 'teleportReturn ' + Math.floor(duration * 0.35) + 'ms ease-out forwards', 'important');
                break;
            case 'blade_storm':
                // 慢-停顿-快节奏：前2下慢速斩击 -> 停顿 -> 后4下快速斩击 -> 终结爆发
                // 前2下：慢速斩击
                for (var bs = 0; bs < 2; bs++) {
                    var slashRange = (bs + 1) * 20;
                    var teleportX = startX + (Math.random() * 80 - 40);
                    var teleportY = startY + (Math.random() * 40 - 20);
                    addVfx(baseClass + ' skill-vfx-blade-storm-teleport', teleportX, teleportY, '', bs * 400, 450);
                    var slashX = endX + (Math.random() * slashRange - slashRange/2);
                    var slashY = endY + (Math.random() * slashRange/2 - slashRange/4);
                    var slashVfx = addVfx(baseClass + ' skill-vfx-blade-storm-slash', slashX, slashY, '', bs * 400 + 80, 500);
                    slashVfx.style.setProperty('--slash-range', slashRange + 'px');
                    slashVfx.style.transform = 'scale(' + (1 + bs * 0.15) + ')';
                    slashVfx.style.setProperty('animation', 'bladeStormSlash 500ms ease-out forwards', 'important');
                }
                // 停顿后快速4下
                for (var bs2 = 0; bs2 < 4; bs2++) {
                    var bsTotal = bs2 + 2;
                    var slashRange2 = (bsTotal + 1) * 18;
                    var teleportX2 = startX + (Math.random() * 80 - 40);
                    var teleportY2 = startY + (Math.random() * 40 - 20);
                    addVfx(baseClass + ' skill-vfx-blade-storm-teleport', teleportX2, teleportY2, '', 900 + bs2 * 120, 300);
                    var slashX2 = endX + (Math.random() * slashRange2 - slashRange2/2);
                    var slashY2 = endY + (Math.random() * slashRange2/2 - slashRange2/4);
                    var slashScale2 = 1 + bsTotal * 0.2;
                    var slashDur2 = 280 + bs2 * 40;
                    var slashVfx2 = addVfx(baseClass + ' skill-vfx-blade-storm-slash', slashX2, slashY2, '', 900 + bs2 * 120 + 50, slashDur2);
                    slashVfx2.style.setProperty('--slash-range', slashRange2 + 'px');
                    slashVfx2.style.transform = 'scale(' + slashScale2 + ')';
                    slashVfx2.style.setProperty('animation', 'bladeStormSlash ' + slashDur2 + 'ms ease-out forwards', 'important');
                }
                // 终结爆发
                addVfx(baseClass + ' skill-vfx-blade-storm-finisher', endX, endY, '', 1500, 700);
                break;

            // ═══ Ember VFX ═══
            case 'fireball':
                // 火球聚能光环
                addVfx(baseClass + ' skill-vfx-fireball-charge', startX, startY - 10, '', 0, Math.floor(duration * 0.25));
                // 火球飞行体(带拖尾)
                var fireballProj = addVfx(baseClass + ' skill-vfx-fireball-projectile', startX, startY, '', Math.floor(duration * 0.22), duration - 100);
                fireballProj.style.setProperty('--projectile-x', (endX - startX) + 'px');
                fireballProj.style.setProperty('--projectile-y', (endY - startY) + 'px');
                fireballProj.style.setProperty('animation', 'projectileFireball ' + (duration - 100) + 'ms ease-out forwards', 'important');
                // 命中爆炸
                addVfx(baseClass + ' skill-vfx-fireball-impact', endX, endY, '', Math.floor(duration * 0.7), 520);
                // 地面残留火焰
                addVfx(baseClass + ' skill-vfx-fireball-ground-fire', endX, endY + 12, '', Math.floor(duration * 0.78), 900);
                // 火焰拖尾
                addVfx(baseClass + ' skill-vfx-fireball-trail', startX + (endX - startX) * 0.3, startY + (endY - startY) * 0.3, '', Math.floor(duration * 0.3), Math.floor(duration * 0.5));
                break;
            case 'accelerant':
                // 火焰装甲光环(多层)
                addVfx(baseClass + ' skill-vfx-accelerant-ring', startX, startY, '', 0, duration);
                addVfx(baseClass + ' skill-vfx-accelerant-ring skill-vfx-accelerant-ring-2', startX, startY, '', 150, duration - 150);
                // 火焰粒子上升
                for (var ap = 0; ap < 6; ap++) {
                    var accelP = addVfx(baseClass + ' skill-vfx-accelerant-particle', startX + (Math.random() * 40 - 20), startY, '', 200 + ap * 80, 600);
                    accelP.style.setProperty('--accel-particle-x', (Math.random() * 30 - 15) + 'px');
                    accelP.style.setProperty('animation', 'vfxAccelParticle 600ms ease-out forwards', 'important');
                }
                // 热浪扭曲效果
                addVfx(baseClass + ' skill-vfx-accelerant-heatwave', startX, startY, '', 100, duration - 100);
                break;
            case 'fire_blast':
                // 蓄力闪光
                addVfx(baseClass + ' skill-vfx-fire-blast-charge', startX, startY, '', 0, Math.floor(duration * 0.22));
                // 从自身扩散火焰到敌人位置
                var fbDist = Math.abs(endX - startX);
                var fbShockwave = addVfx(baseClass + ' skill-vfx-fire-blast-shockwave', startX, startY, '', Math.floor(duration * 0.2), duration - 100);
                fbShockwave.style.setProperty('--vfx-distance', fbDist + 'px');
                fbShockwave.style.setProperty('--vfx-direction', (endX > startX ? 1 : -1) + '');
                fbShockwave.style.setProperty('animation', 'expandingShockwave ' + (duration - 100) + 'ms ease-out forwards', 'important');
                // 火焰扩散波（从自身到敌人的火焰锥形）
                for (var fbw = 0; fbw < 5; fbw++) {
                    var fbProgress = (fbw + 1) / 6;
                    var waveX = startX + (endX - startX) * fbProgress;
                    var waveY = startY + (endY - startY) * fbProgress;
                    var fbWave = addVfx(baseClass + ' skill-vfx-fire-blast-flame', waveX, waveY, '', Math.floor(duration * 0.15) + fbw * 80, duration - 100);
                    fbWave.style.setProperty('--vfx-angle', ((endX > startX ? 0 : 180)) + 'deg');
                    fbWave.style.setProperty('--vfx-distance', (fbDist * fbProgress) + 'px');
                    fbWave.style.transform = 'scale(' + (0.5 + fbProgress * 0.8) + ')';
                }
                // 裂缝效果(在敌人位置)
                addVfx(baseClass + ' skill-vfx-fire-blast-cracks', endX, endY, '', Math.floor(duration * 0.4), 800);
                // 火焰柱喷射(在敌人位置)
                for (var fb2 = 0; fb2 < 3; fb2++) {
                    var flamePillar = addVfx(baseClass + ' skill-vfx-fire-blast-flame-pillar', endX + (fb2 - 1) * 30, endY, '', Math.floor(duration * 0.45) + fb2 * 120, 750);
                    flamePillar.style.setProperty('animation', 'vfxFireBlastPillar 750ms ease-out forwards', 'important');
                }
                // 敌人被击倒
                runVfxClass(targetEl, 'enemy-target-knocked-down', duration);
                break;
            case 'world_on_fire':
                // Ember周围火焰光环
                addVfx(baseClass + ' skill-vfx-world-on-fire-aura', startX, startY, '', 0, duration + 2000);
                // 多颗陨石从更高天空斜着坠落(大范围陨石雨)
                for (var fp = 0; fp < 7; fp++) {
                    var meteorStartX = endX + (Math.random() * 160 - 80) - 100; // 从偏左上方开始
                    var meteorStartY = endY - 250 - Math.random() * 100; // 从很高处坠落
                    var meteorTargetX = endX + (Math.random() * 100 - 50); // 落点在敌人附近
                    var meteorTargetY = endY + (Math.random() * 20 - 10);
                    var meteorDelay = fp * 250 + 100; // 间隔250ms，持续更久
                    var meteorFallDuration = 800 + Math.random() * 400; // 增长下落时间 800-1200ms
                    var meteor = addVfx(baseClass + ' skill-vfx-world-on-fire-meteor', meteorStartX, meteorStartY, '', meteorDelay, meteorFallDuration);
                    // 计算偏移量，用于CSS translate
                    var meteorDx = meteorTargetX - meteorStartX;
                    var meteorDy = meteorTargetY - meteorStartY;
                    meteor.style.setProperty('--meteor-dx', meteorDx + 'px');
                    meteor.style.setProperty('--meteor-dy', meteorDy + 'px');
                    // Bug2 fix: 覆盖 addVfx 默认的 --vfx-x/--vfx-y，避免干扰 meteorFall 动画
                    meteor.style.setProperty('--vfx-x', '0px');
                    meteor.style.setProperty('--vfx-y', '0px');
                    // Bug2 fix: 使用 animation-delay 让陨石错开下落，避免同时开始
                    meteor.style.setProperty('animation', 'meteorFall ' + meteorFallDuration + 'ms ease-in ' + meteorDelay + 'ms forwards', 'important');
                    // 彗星尾迹(斜向)
                    var trailStartX = meteorStartX - meteorDx * 0.3;
                    var trailStartY = meteorStartY - meteorDy * 0.3;
                    var meteorTrail = addVfx(baseClass + ' skill-vfx-world-on-fire-meteor-trail', trailStartX, trailStartY, '', meteorDelay + 30, meteorFallDuration - 30);
                    // Bug2 fix: 覆盖 trail 的 --vfx-x/--vfx-y
                    meteorTrail.style.setProperty('--vfx-x', '0px');
                    meteorTrail.style.setProperty('--vfx-y', '0px');
                    var trailDelay = meteorDelay + 30;
                    meteorTrail.style.setProperty('animation', 'vfxMeteorTrail ' + (meteorFallDuration - 30) + 'ms ease-out ' + trailDelay + 'ms forwards', 'important');
                    // 命中爆炸 - 使用 animation-delay
                    var impactDelay = meteorDelay + Math.floor(meteorFallDuration * 0.85);
                    var meteorImpact = addVfx(baseClass + ' skill-vfx-world-on-fire-impact', meteorTargetX, meteorTargetY, '', impactDelay, 600);
                    meteorImpact.style.setProperty('animation', 'vfxWorldOnFireImpact 600ms ease-out ' + impactDelay + 'ms forwards', 'important');
                    // 命中火焰柱 - 使用 animation-delay
                    var pillarDelay = impactDelay + 50;
                    var meteorPillar = addVfx(baseClass + ' skill-vfx-world-on-fire-pillar', meteorTargetX, meteorTargetY, '', pillarDelay, 800);
                    meteorPillar.style.setProperty('animation', 'worldOnFirePillar 800ms ease-out ' + pillarDelay + 'ms forwards', 'important');
                }
                // 大范围地面燃烧
                addVfx(baseClass + ' skill-vfx-world-on-fire-aura', endX, endY, '', Math.floor(duration * 0.5), duration + 1500);
                break;

            case 'basic_attack':
                addVfx(baseClass + ' skill-vfx-basic-slash', startX, startY, '', 0, duration);
                break;
            default:
                addVfx(baseClass, startX, startY, skill.icon || '✦', 0, duration);
        }
    }

    // ========== 受击动画 ==========
    function triggerHitAnimation(side) {
        var el = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');

        if (!el) return;

        el.classList.add('hit-shake');
        setTimeout(function() {
            el.classList.remove('hit-shake');
        }, 400);
    }

    // ========== 死亡动画 ==========
    function triggerDeathAnimation(side) {
        var el = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');

        if (!el) return;

        el.classList.add('death-anim');
    }

    // ========== 浮动伤害数字 ==========
    function showSkillDamage(amount, target, isCrit, color) {
        var showDmg = true;
        try { showDmg = !(gameData && gameData.settings && gameData.settings.showDamageNumbers === false); } catch(e) {}
        if (!showDmg) return;
        var targetEl = target === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');

        if (!targetEl) return;

        var rect = targetEl.getBoundingClientRect();
        var dmgEl = document.createElement('div');
        dmgEl.className = 'skill-damage-float';
        dmgEl.textContent = (isCrit ? '💥' : '') + amount;
        dmgEl.style.color = color || (target === 'player' ? '#ff4444' : '#00d4ff');
        dmgEl.style.left = (rect.left + rect.width / 2) + 'px';
        dmgEl.style.top = (rect.top - 10) + 'px';
        if (isCrit) {
            dmgEl.style.fontSize = '2.2rem';
            dmgEl.style.textShadow = '0 0 20px ' + color;
        }

        document.body.appendChild(dmgEl);
        setTimeout(function() { dmgEl.remove(); }, 1200);
    }

    // ========== 护甲减伤 ==========
    function reduceByArmor(damage, armor) {
        if (!armor || armor <= 0) return damage;
        var reduction = armor / (armor + 500);
        return Math.max(Math.floor(damage * (1 - reduction)), 1);
    }

    function applyShieldHealthDamage(entity, amount) {
        var total = Math.max(0, Math.floor(amount || 0));
        var shieldDamage = 0;
        var hpDamage = 0;

        if (entity.shield > 0) {
            shieldDamage = Math.min(entity.shield, total);
            entity.shield = Math.max(0, entity.shield - shieldDamage);
        } else {
            hpDamage = total;
            if (hpDamage > 0) {
                entity.hp = Math.max(0, entity.hp - hpDamage);
            }
        }

        return {
            shieldDamage: shieldDamage,
            hpDamage: hpDamage,
            totalDamage: shieldDamage + hpDamage
        };
    }

    function applyDirectHpDamage(entity, amount) {
        var hpDamage = Math.max(0, Math.floor(amount || 0));
        if (hpDamage > 0) {
            entity.hp = Math.max(0, entity.hp - hpDamage);
        }
        return {
            shieldDamage: 0,
            hpDamage: hpDamage,
            totalDamage: hpDamage
        };
    }

    // ========== buff 查询 ==========
    function getBuffMultiplier(entity, type) {
        var multiplier = 1;
        for (var i = 0; i < SkillCombat.playerBuffs.length; i++) {
            var b = SkillCombat.playerBuffs[i];
            if (b.type === type && b.multiplier) {
                multiplier *= b.multiplier;
            }
        }
        // 敌人 damage buff
        if (entity === SkillCombat.enemy) {
            for (var i = 0; i < SkillCombat.enemyDebuffs.length; i++) {
                var d = SkillCombat.enemyDebuffs[i];
                if (d.type === 'damage_buff' && d.multiplier) {
                    multiplier *= d.multiplier;
                }
            }
        }
        return multiplier;
    }

    function hasDebuff(debuffs, type) {
        for (var i = 0; i < debuffs.length; i++) {
            if (debuffs[i].type === type) return true;
        }
        return false;
    }

    function consumePlayerStun() {
        var hasStun = SkillCombat.playerDebuffs.some(function(d) { return d.type === 'stun'; });
        setPlayerStatusVisual('stun', hasStun);
        return hasStun;
    }

    function consumePlayerDisarm() {
        var hasDisarm = SkillCombat.playerDebuffs.some(function(d) { return d.type === 'disarm'; });
        setPlayerStatusVisual('disarm', hasDisarm);
        return hasDisarm;
    }

    function clearPlayerDisarmAfterAction() {
        var cleared = false;
        SkillCombat.playerDebuffs = SkillCombat.playerDebuffs.filter(function(d) {
            if (d.type === 'disarm') {
                cleared = true;
                return false;
            }
            return true;
        });
        if (cleared) setPlayerStatusVisual('disarm', false);
    }

    function setPlayerStatusVisual(type, enabled) {
        var el = document.getElementById('battlePlayerIcon');
        if (!el) return;
        var cls = 'skill-status-' + type;
        if (enabled) el.classList.add(cls);
        else el.classList.remove(cls);
    }

    function clearAllStatusVisuals() {
        var playerEl = document.getElementById('battlePlayerIcon');
        var enemyEl = document.getElementById('battleEnemyIcon');
        var classes = [
            'skill-status-stun', 'skill-status-bleed', 'skill-status-burn', 'skill-status-toxin',
            'skill-status-disarm', 'skill-status-blinded-smoke', 'skill-status-manic-locked',
            'skill-status-stealth', 'skill-status-ash-stealth',
            'enemy-target-floating', 'enemy-target-knocked-down',
            'skill-picture-iron-skin-shield'
        ];
        [playerEl, enemyEl].forEach(function(el) {
            if (!el) return;
            classes.forEach(function(cls) { el.classList.remove(cls); });
            el.removeAttribute('data-floating-active');
            el.removeAttribute('data-iron-shield-active');
            el.style.transition = '';
            el.style.opacity = '';
            el.style.filter = '';
            el.style.animation = '';
        });
        document.querySelectorAll('.skill-damage-float').forEach(function(el) { el.remove(); });
        document.querySelectorAll('.skill-vfx').forEach(function(el) { el.remove(); });
        var stealthHint = document.getElementById('stealth-dodge-hint');
        if (stealthHint && stealthHint.parentNode) stealthHint.remove();
    }

    function isVorSkill(skill) {
        return !!(skill && typeof skill.id === 'string' && skill.id.indexOf('vor_') === 0);
    }

    function clearVorInteraction(keepSummary) {
        var panel = document.getElementById('vor-mechanic-panel');
        if (panel) panel.remove();
        var eventLayer = document.getElementById('vor-arena-event');
        if (eventLayer) eventLayer.remove();
        var nodes = document.querySelectorAll('.vor-interact-node');
        for (var i = 0; i < nodes.length; i++) nodes[i].remove();
        var arena = getVorBattleArena();
        if (arena) {
            arena.classList.remove('vor-skill-active', 'vor-cast-seer', 'vor-cast-beam', 'vor-cast-mine', 'vor-cast-teleport', 'vor-cast-shield');
        }
        if (!keepSummary && SkillCombat.vorInteraction && SkillCombat.vorInteraction.timer) {
            clearTimeout(SkillCombat.vorInteraction.timer);
        }
        SkillCombat.vorInteraction = null;
    }

    function getVorBattleArena() {
        var enemyEl = document.getElementById('battleEnemyIcon');
        return enemyEl ? enemyEl.closest('#page-dashboard') : null;
    }

    function setupVorSkillInteraction(skill) {
        if (!isVorSkill(skill) || !SkillCombat.enemy || (SkillCombat.enemy.name || '').indexOf('沃尔上尉') === -1) return;
        clearVorInteraction(false);

        var config = getVorInteractionConfig(skill);
        if (!config) return;
        if (SkillCombat.vorPressure >= 4 && config.required < 6) {
            config = Object.assign({}, config, {
                required: config.required + 1,
                hint: config.hint + '（高压力值：额外节点）'
            });
        }

        var serial = ++SkillCombat.vorMechanicSerial;
        var arena = getVorBattleArena() || document.body;
        var state = {
            serial: serial,
            skillId: skill.id,
            title: config.title,
            hint: config.hint,
            hits: 0,
            required: config.required,
            maxHits: config.maxHits || config.required,
            mitigationPerHit: config.mitigationPerHit || 0,
            completed: false,
            counterDamageRatio: config.counterDamageRatio || 0
        };
        SkillCombat.vorInteraction = state;

        arena.classList.add('vor-skill-active', config.castClass);
        triggerVorArenaEvent(arena, config, state);

        var panel = document.createElement('div');
        panel.id = 'vor-mechanic-panel';
        panel.className = 'vor-mechanic-panel';
        panel.innerHTML =
            '<div class="vor-mechanic-title">' + config.icon + ' ' + config.title + '<span>压力值 ' + SkillCombat.vorPressure + '/5</span></div>' +
            '<div class="vor-mechanic-hint">' + config.shortHint + '</div>' +
            '<div class="vor-mechanic-progress"><span id="vor-mechanic-progress-text">0/' + state.required + '</span><i id="vor-mechanic-progress-bar"></i></div>';
        arena.appendChild(panel);

        for (var i = 0; i < config.required; i++) {
            createVorInteractNode(arena, state, config, i);
        }

        appendBattleLog('<div style="color:#ffd36a;">🔑 反制开始【' + config.title + '】：' + config.logGoal + '</div>');
    }

    function getVorInteractionConfig(skill) {
        var map = {
            vor_seer_burst: { icon: '🎯', title: '多点锁定', shortHint: '点准星：减伤', hint: '打掉 4 个移动准星，削弱覆盖射击', logGoal: '点击“准”；每点 1 个都会降低本次射击伤害。', successText: '大幅削弱本次 Seer 射击', required: 4, mitigationPerHit: 0.13, nodeText: '准', castClass: 'vor-cast-seer', eventType: 'seer' },
            vor_janus_beam: { icon: '🔑', title: '裂隙光束', shortHint: '点钥匙：偏转光束', hint: '击碎 5 个钥匙节点，偏转整屏裂隙光束', logGoal: '点击“钥”；全破后偏转光束，并让雅努斯能量反噬沃尔。', successText: '光束减伤并反噬沃尔', required: 5, mitigationPerHit: 0.15, counterDamageRatio: 0.055, nodeText: '钥', castClass: 'vor-cast-beam', eventType: 'beam' },
            vor_nervos_mine: { icon: '🧨', title: '雷区扩散', shortHint: '点地雷：拆雷', hint: '拆除 5 枚地雷，阻止雷区覆盖战场', logGoal: '点击“雷”；全拆后本次雷区不会造成眩晕。', successText: '降低爆炸伤害并免除眩晕', required: 5, mitigationPerHit: 0.14, nodeText: '雷', castClass: 'vor-cast-mine', eventType: 'mine' },
            vor_teleport_shot: { icon: '🌀', title: '裂隙换位', shortHint: '点裂隙：封出口', hint: '连续封锁 3 个裂隙出口，反制处决射击', logGoal: '点击“裂”；封锁出口可削弱传送处决。', successText: '处决减伤并反制沃尔', required: 3, mitigationPerHit: 0.24, counterDamageRatio: 0.045, nodeText: '裂', castClass: 'vor-cast-teleport', eventType: 'teleport' },
            vor_sphere_shield: { icon: '🛡️', title: '屏障阵列', shortHint: '点护盾：破屏障', hint: '破坏 5 个护盾节点，打开沃尔暴露窗口', logGoal: '点击“盾”；全破后削弱护盾，并让沃尔短暂暴露。', successText: '削弱护盾，玩家后续攻击增伤', required: 5, mitigationPerHit: 0.06, nodeText: '盾', castClass: 'vor-cast-shield', eventType: 'shield' }
        };
        return map[skill.id] || null;
    }

    function triggerVorArenaEvent(arena, config, state) {
        var old = document.getElementById('vor-arena-event');
        if (old) old.remove();
        var layer = document.createElement('div');
        layer.id = 'vor-arena-event';
        layer.className = 'vor-arena-event vor-arena-event-' + config.eventType;
        var html = '<div class="vor-event-title">' + config.title + '</div>';
        if (config.eventType === 'beam') {
            html += '<div class="vor-event-beam vor-event-beam-main"></div><div class="vor-event-beam vor-event-beam-sub-a"></div><div class="vor-event-beam vor-event-beam-sub-b"></div><div class="vor-event-rift-door vor-event-rift-left"></div><div class="vor-event-rift-door vor-event-rift-right"></div>';
        } else if (config.eventType === 'mine') {
            html += '<div class="vor-event-minefield"></div><div class="vor-event-danger-zone vor-event-danger-a"></div><div class="vor-event-danger-zone vor-event-danger-b"></div><div class="vor-event-danger-zone vor-event-danger-c"></div>';
        } else if (config.eventType === 'teleport') {
            html += '<div class="vor-event-rift-path"></div><div class="vor-event-rift-door vor-event-rift-left"></div><div class="vor-event-rift-door vor-event-rift-mid"></div><div class="vor-event-rift-door vor-event-rift-right"></div>';
        } else if (config.eventType === 'shield') {
            html += '<div class="vor-event-shield-wall"></div><div class="vor-event-shield-ring vor-event-shield-ring-a"></div><div class="vor-event-shield-ring vor-event-shield-ring-b"></div>';
        } else {
            html += '<div class="vor-event-target-sweep"></div><div class="vor-event-target-sweep vor-event-target-sweep-b"></div>';
        }
        layer.innerHTML = html;
        arena.appendChild(layer);
    }

    function createVorInteractNode(arena, state, config, index) {
        var node = document.createElement('button');
        node.type = 'button';
        node.className = 'vor-interact-node vor-interact-node-' + index;
        node.textContent = config.nodeText || '击';
        var points = getVorNodePoints(config.eventType, state.required);
        var point = points[index % points.length];
        node.style.left = point[0] + '%';
        node.style.top = point[1] + '%';
        node.onclick = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if (!SkillCombat.vorInteraction || SkillCombat.vorInteraction.serial !== state.serial) return;
            if (node.classList.contains('hit')) return;
            node.classList.add('hit');
            state.hits = Math.min(state.maxHits, state.hits + 1);
            state.completed = state.hits >= state.required;
            updateVorMechanicPanel(state);
            showSkillDamage('破', 'enemy', false, '#ffd36a');
            appendBattleLog('<div style="color:#9be7ff;">↳ 反制进度：' + state.title + ' ' + state.hits + '/' + state.required + '</div>');
            if (state.completed) {
                appendBattleLog('<div style="color:#72d7ff;">✅ 反制成功：' + state.title + ' 被破解！</div>');
                var panel = document.getElementById('vor-mechanic-panel');
                if (panel) panel.classList.add('completed');
            }
        };
        arena.appendChild(node);
    }

    function getVorNodePoints(type, count) {
        var maps = {
            beam: [[12,24],[30,70],[50,34],[70,68],[88,28]],
            mine: [[14,66],[28,34],[48,74],[67,38],[84,64]],
            teleport: [[22,30],[52,70],[80,32]],
            shield: [[16,24],[34,70],[50,20],[66,70],[84,24]],
            seer: [[18,32],[38,66],[62,34],[82,66]]
        };
        return maps[type] || maps.seer;
    }

    function updateVorMechanicPanel(state) {
        var txt = document.getElementById('vor-mechanic-progress-text');
        var bar = document.getElementById('vor-mechanic-progress-bar');
        if (txt) txt.textContent = state.hits + '/' + state.required;
        if (bar) bar.style.width = Math.min(100, Math.floor((state.hits / state.required) * 100)) + '%';
    }

    function applyVorInteractionToEnemyDamage(skill, damage) {
        var state = SkillCombat.vorInteraction;
        if (!state || !isVorSkill(skill) || state.skillId !== skill.id) return damage;

        var pressureBonus = Math.min(0.36, SkillCombat.vorPressure * 0.06);
        if (pressureBonus > 0) {
            damage = Math.floor(damage * (1 + pressureBonus));
            appendBattleLog('<div style="color:#ff8844;">⚠️ 压力值强化了沃尔技能，伤害提高 ' + Math.floor(pressureBonus * 100) + '%。</div>');
        }

        var reduction = Math.min(0.88, state.hits * state.mitigationPerHit);
        if (reduction > 0) {
            damage = Math.max(1, Math.floor(damage * (1 - reduction)));
            appendBattleLog('<div style="color:#72d7ff;">🌀 反制生效，沃尔本次伤害降低 ' + Math.floor(reduction * 100) + '%。</div>');
        }

        if (state.completed && state.counterDamageRatio > 0 && SkillCombat.enemy) {
            var counter = Math.max(1, Math.floor(getEntityTotalMax(SkillCombat.enemy) * state.counterDamageRatio));
            SkillCombat.enemy.hp = Math.max(0, SkillCombat.enemy.hp - counter);
            appendBattleLog('<div style="color:#ffd36a;">🔑 雅努斯能量反噬沃尔 ' + counter + ' 伤害！</div>');
            showSkillDamage(counter, 'enemy', true, '#ffd36a');
        }

        if (state.completed) {
            SkillCombat.vorPressure = Math.max(0, SkillCombat.vorPressure - 1);
            appendBattleLog('<div style="color:#72d7ff;">🔻 完全破解，压力值下降到 ' + SkillCombat.vorPressure + '/5。</div>');
        } else {
            SkillCombat.vorPressure = Math.min(5, SkillCombat.vorPressure + 1);
            appendBattleLog('<div style="color:#ff8844;">🔺 未完全破解，压力值上升到 ' + SkillCombat.vorPressure + '/5。</div>');
        }

        return damage;
    }

    function clearEnemyCausedEffects() {
        SkillCombat.playerDebuffs = [];
        SkillCombat.enemyDebuffs = [];
        if (SkillCombat.enemy) {
            SkillCombat.enemy.isStunned = false;
            SkillCombat.enemy.stunTurns = 0;
            SkillCombat.enemy.isHpLocked = false;
            SkillCombat.enemy.hpLockEnemyTurns = 0;
        }
        clearAllStatusVisuals();
    }

    // ========== 更新战斗 UI ==========
    function updateBattleUI() {
        var player = SkillCombat.player;
        var enemy = SkillCombat.enemy;

        if (!player || !enemy) return;

        ensureEnergyLabelRewrite();

        // 玩家信息
        setText('battlePlayerName', player.name);
        setBattleAvatar('battlePlayerIcon', player);
        setText('battlePlayerLevel', player.level);

        // 敌人信息
        setText('battleEnemyName', enemy.name);
        setBattleAvatar('battleEnemyIcon', enemy);
        setText('battleEnemyLevel', enemy.level);
        updateBossBattlefieldVisual(enemy);

        // 玩家血条 + 护盾覆盖显示
        updateHpShieldBar('player', player);

        // 敌人血条 + 护盾覆盖显示
        updateHpShieldBar('enemy', enemy);

        // 原执行力位置改为能量显示
        updateEnergyDisplay();

        // 技能按钮状态
        updateSkillButtons();
    }

    function updateBossBattlefieldVisual(enemy) {
        var enemyEl = document.getElementById('battleEnemyIcon');
        var playerEl = document.getElementById('battlePlayerIcon');
        var arena = enemyEl && enemyEl.closest('#page-dashboard');
        if (!arena) return;

        arena.classList.remove('boss-arena-vor', 'boss-arena-vor-stage1', 'boss-arena-vor-stage2', 'boss-arena-vor-stage3', 'boss-arena-vor-awakened');
        if (enemyEl) enemyEl.classList.remove('boss-vor-avatar');
        if (playerEl) playerEl.classList.remove('boss-vor-target');
        if (!enemy || (enemy.name || '').indexOf('沃尔上尉') === -1) {
            removeVorArenaLayers(arena);
            setVorStageClasses(arena, false);
            return;
        }

        var stage = enemy.bossStage || (enemy.name.indexOf('雅努斯觉醒') !== -1 ? 3 : enemy.name.indexOf('护盾相位') !== -1 ? 2 : 1);
        var awakened = getEnemyHpPercent(enemy) <= 0.50;
        arena.classList.add('boss-arena-vor', 'boss-arena-vor-stage' + stage);
        arena.classList.toggle('boss-arena-vor-awakened', awakened);
        arena.setAttribute('data-vor-stage', stage);
        if (awakened) ensureVorArenaLayers(arena, stage);
        else removeVorArenaLayers(arena);
        setVorStageClasses(arena, true);
        if (enemyEl) enemyEl.classList.add('boss-vor-avatar');
        if (playerEl) playerEl.classList.add('boss-vor-target');
    }

    function removeVorArenaLayers(arena) {
        var layers = arena.querySelectorAll('.vor-arena-layer');
        for (var i = 0; i < layers.length; i++) {
            layers[i].remove();
        }
        var events = arena.querySelectorAll('.vor-arena-event');
        for (var j = 0; j < events.length; j++) {
            events[j].remove();
        }
    }

    function setVorStageClasses(arena, enabled) {
        var playerEl = document.getElementById('battlePlayerIcon');
        var enemyEl = document.getElementById('battleEnemyIcon');
        var playerCard = playerEl && playerEl.parentElement;
        var enemyCard = enemyEl && enemyEl.parentElement;
        var row = playerCard && playerCard.parentElement;

        if (row) row.classList.toggle('vor-battle-stage-row', !!enabled);
        if (playerCard) playerCard.classList.toggle('vor-combatant-card', !!enabled);
        if (enemyCard) enemyCard.classList.toggle('vor-combatant-card', !!enabled);
        if (playerCard) playerCard.classList.toggle('vor-player-card', !!enabled);
        if (enemyCard) enemyCard.classList.toggle('vor-enemy-card', !!enabled);
    }

    function ensureVorArenaLayers(arena, stage) {
        var layer = arena.querySelector('.vor-arena-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'vor-arena-layer';
            layer.innerHTML =
                '<div class="vor-arena-grid"></div>' +
                '<div class="vor-arena-core"></div>' +
                '<div class="vor-arena-keymark">JANUS</div>' +
                '<div class="vor-arena-scan vor-arena-scan-a"></div>' +
                '<div class="vor-arena-scan vor-arena-scan-b"></div>' +
                '<div class="vor-arena-warning">VOID LOCK</div>';
            arena.insertBefore(layer, arena.firstChild);
        }
        layer.setAttribute('data-stage', stage || 1);
    }

    // 统一的 HP+护盾 条更新（护盾覆盖在HP条上）
    function updateHpShieldBar(side, entity) {
        var hpBarId = side === 'player' ? 'battlePlayerHpBar' : 'battleEnemyHpBar';
        var shieldBarId = side === 'player' ? 'battlePlayerShieldBar' : 'battleEnemyShieldBar';
        var hpTextId = side === 'player' ? 'battlePlayerHpText' : 'battleEnemyHpText';
        var hpLabelId = side === 'player' ? 'battlePlayerHpLabel' : 'battleEnemyHpLabel';
        var labelPrefix = side === 'player' ? '我方 ' : '敌方 ';
        var statusIcons = side === 'player' ? getDebuffIcons(SkillCombat.playerDebuffs) : getDebuffIcons(SkillCombat.enemyDebuffs);
        var buffIcons = side === 'player' ? getBuffIcons(SkillCombat.playerBuffs) : getBuffIcons([]);

        var hasShield = entity.maxShield > 0 && entity.shield > 0;
        var hpPercent = Math.max(0, (entity.hp / entity.maxHp) * 100);

        var hpBar = document.getElementById(hpBarId);
        var shieldBar = document.getElementById(shieldBarId);
        var container = (hpBar && hpBar.parentElement) || (shieldBar && shieldBar.parentElement);

        // ===== 自动创建护盾条（如果 HTML 中不存在） =====
        if (!shieldBar && hpBar && hpBar.parentElement) {
            container = hpBar.parentElement;
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            shieldBar = document.createElement('div');
            shieldBar.id = shieldBarId;
            shieldBar.style.cssText = 'position:absolute;left:0;top:0;height:100%;z-index:3;width:0%;border-radius:5px;background:linear-gradient(90deg,#178dff,#5be7ff,#bdf7ff);box-shadow:0 0 12px rgba(91,231,255,0.8);transition:width 0.3s ease;';
            container.appendChild(shieldBar);
        }

        // 按实际 HTML 父容器重排层级：HP条在下，护盾条覆盖在上
        if (container && hpBar && shieldBar) {
            container.style.position = 'relative';
            container.style.overflow = 'hidden';
            hpBar.style.position = 'absolute';
            hpBar.style.left = '0';
            hpBar.style.top = '0';
            hpBar.style.inset = '0 auto 0 0';
            hpBar.style.height = '100%';
            hpBar.style.zIndex = '1';
            shieldBar.style.position = 'absolute';
            shieldBar.style.left = '0';
            shieldBar.style.top = '0';
            shieldBar.style.inset = '0 auto 0 0';
            shieldBar.style.height = '100%';
            shieldBar.style.zIndex = '3';
            if (container.lastElementChild !== shieldBar) {
                container.appendChild(shieldBar);
            }
        }

        // HP条宽度
        setBarWidth(hpBarId, hpPercent);
        if (hpBar) {
            if (entity.isHpLocked) {
                hpBar.style.setProperty('background', 'linear-gradient(90deg, #555, #999, #666)', 'important');
                hpBar.style.setProperty('box-shadow', '0 0 12px rgba(160,160,160,0.75)', 'important');
            } else {
                hpBar.style.setProperty('background', 'linear-gradient(90deg, #7a1010, #ff3333, #ff8888)', 'important');
                hpBar.style.setProperty('box-shadow', '0 0 10px rgba(255, 60, 60, 0.55)', 'important');
            }
        }

        // 护盾条宽度（覆盖在血条上层，Corpus 按类型显示，其他 35%）
        var isEntityCorpus = (entity.faction === 'corpus');
        var shieldMaxPercent = 35;
        if (isEntityCorpus) {
            var enemyTypeForShield = entity.type || entity.cardType || 'normal';
            var corpusShieldWidths = { normal: 55, elite: 65, boss: 75, mechanic: 85, super: 95 };
            shieldMaxPercent = corpusShieldWidths[enemyTypeForShield] || 55;
        }
        var shieldPercent = entity.maxShield > 0
            ? Math.max(0, (entity.shield / entity.maxShield) * shieldMaxPercent)
            : 0;
        setBarWidth(shieldBarId, shieldPercent);
        if (shieldBar) {
            shieldBar.style.setProperty('background', 'linear-gradient(90deg, #178dff, #5be7ff, #bdf7ff)', 'important');
            shieldBar.style.setProperty('box-shadow', hasShield ? '0 0 12px rgba(91, 231, 255, 0.8)' : 'none', 'important');
        }

        // 文字标签：debuff + buff 图标
        var labelEl = document.getElementById(hpLabelId);
        var textEl = document.getElementById(hpTextId);

        // 确保 label 元素存在（旧版 HTML 可能没有 id）
        if (!labelEl) {
            if (container) {
                var firstSpan = container.parentElement.querySelector('span');
                if (firstSpan) {
                    firstSpan.id = hpLabelId;
                    labelEl = firstSpan;
                }
            }
        }

        var iconStr = '';
        if (statusIcons) iconStr += statusIcons + ' ';
        if (buffIcons) iconStr += buffIcons + ' ';

        if (labelEl) {
            labelEl.textContent = labelPrefix + (iconStr ? iconStr : '');
            labelEl.style.color = hasShield ? '#72d7ff' : (side === 'player' ? 'var(--orokin-cyan)' : 'var(--grineer-red)');
        }
        if (textEl) {
            // 显示格式：护盾值 / HP值
            textEl.innerHTML = '<span style="color:#5be7ff; text-shadow:0 0 8px rgba(91,231,255,.75);">' +
                Math.floor(entity.shield || 0) + '</span><span style="color:#aaa;">/</span><span style="color:#ff5555; text-shadow:0 0 8px rgba(255,70,70,.65);">' +
                Math.floor(entity.hp || 0) + '</span>';
        }
    }

    function getBuffIcons(buffs) {
        if (!buffs || !buffs.length) return '';
        var icons = [];
        buffs.forEach(function(b) {
            if (b.type === 'damage') icons.push('⚔️');
            else if (b.type === 'speed') icons.push('💨');
            else if (b.type === 'shield') icons.push('🛡️');
            else if (b.type === 'magnetize') icons.push('🧲');
            else if (b.type === 'stealth') icons.push('👁');
            else if (b.type === 'fire_damage') icons.push('🔥');
            else if (b.type === 'reflect') icons.push('🌀');
            else if (b.type === 'aura_fire') icons.push('☄️');
        });
        return icons.join('');
    }

    function getDebuffIcons(debuffs) {
        if (!debuffs || !debuffs.length) return '';
        var icons = [];
        debuffs.forEach(function(d) {
            if (d.type === 'bleed') icons.push('🩸');
            else if (d.type === 'burn') icons.push('🔥');
            else if (d.type === 'toxin') icons.push('☣');
            else if (d.type === 'stun') icons.push('💫');
            else if (d.type === 'disarm') icons.push('🪃');
            else if (d.type === 'magnetized') icons.push('🧲');
            else if (d.type === 'damage_buff') icons.push('⬆️');
        });
        return icons.join('');
    }

    function updateSkillButtons() {
        var basicBtn = document.getElementById('skill-btn-basic');
        if (basicBtn) {
            var canBasic = SkillCombat.isPlayerTurn && !SkillCombat.isAnimating;
            basicBtn.classList.toggle('skill-ready', canBasic);
            basicBtn.classList.toggle('skill-cd', !canBasic);
        }

        var skills = SkillCombat.player.skills;
        for (var i = 0; i < skills.length; i++) {
            var btn = document.getElementById('skill-btn-' + i);
            if (!btn) continue;

            var cd = SkillCombat.playerCooldowns[i];
            var canUse = SkillCombat.isPlayerTurn && !SkillCombat.isAnimating
                        && cd <= 0 && SkillCombat.player.energy >= skills[i].energyCost;

            btn.classList.toggle('skill-ready', canUse);
            btn.classList.toggle('skill-cd', cd > 0);
            btn.classList.toggle('skill-no-energy', !canUse && cd <= 0 && SkillCombat.player.energy < skills[i].energyCost);

            // 冷却遮罩
            var cdOverlay = document.getElementById('skill-cd-' + i);
            if (cdOverlay) {
                if (cd > 0) {
                    cdOverlay.style.display = 'block';
                    cdOverlay.textContent = cd;
                } else {
                    cdOverlay.style.display = 'none';
                }
            }
        }
    }

    function updateEnergyDisplay() {
        if (!SkillCombat.player) return;
        var pct = (SkillCombat.player.energy / SkillCombat.player.maxEnergy) * 100;
        setBarWidth('battlePlayerActionBar', pct);
        setText('battlePlayerActionText', SkillCombat.player.energy + '/' + SkillCombat.player.maxEnergy);

        var enemyEnergyBar = document.getElementById('battleEnemyActionBar');
        var enemyEnergyText = document.getElementById('battleEnemyActionText');
        if (enemyEnergyBar) enemyEnergyBar.style.width = '100%';
        if (enemyEnergyText) enemyEnergyText.textContent = getActionStateText();
    }

    function ensureEnergyLabelRewrite() {
        var playerLabel = document.getElementById('battlePlayerActionText');
        var enemyLabel = document.getElementById('battleEnemyActionText');
        if (playerLabel && playerLabel.previousElementSibling) {
            playerLabel.previousElementSibling.textContent = '⚡ 能量';
            playerLabel.previousElementSibling.style.color = 'var(--orokin-cyan)';
        }
        if (enemyLabel && enemyLabel.previousElementSibling) {
            enemyLabel.previousElementSibling.textContent = getActionStateLabel();
            enemyLabel.previousElementSibling.style.color = getActionStateLabel().indexOf('锁定') !== -1 ? '#aaa' : '#ff8844';
        }
    }

    function getActionStateLabel() {
        if (!SkillCombat.isActive) return '⚙️ 行动';
        if (SkillCombat.isPlayerTurn && (hasDebuff(SkillCombat.playerDebuffs, 'stun') || hasDebuff(SkillCombat.playerDebuffs, 'disarm'))) {
            return '🔒 锁定';
        }
        if (!SkillCombat.isPlayerTurn && SkillCombat.enemy && SkillCombat.enemy.isStunned) {
            return '🔒 锁定';
        }
        return '⚙️ 行动';
    }

    function getActionStateText() {
        if (getActionStateLabel().indexOf('锁定') !== -1) return '无法行动';
        return SkillCombat.isPlayerTurn ? '玩家回合' : '敌方回合';
    }

    // ========== UI 辅助 ==========
    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    // MutationObserver 监控头像容器，防止被外部代码覆盖
    var _avatarObservers = {};

    function observeAvatar(id, entity) {
        if (_avatarObservers[id]) return;
        var el = document.getElementById(id);
        if (!el) return;

        var observer = new MutationObserver(function(mutations) {
            if (!SkillCombat.isActive) return;
            var target = document.getElementById(id);
            if (!target) return;
            // 外部代码可能反复 textContent 覆盖头像容器；
            var expectedKey = entity.image || entity.icon || '';
            if (target.getAttribute('data-avatar-key') !== expectedKey || !target.classList.contains('skill-combat-avatar')) {
                _forceSetAvatar(id, entity);
            }
        });
        observer.observe(el, { childList: true, subtree: false, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'data-avatar-key'] });
        _avatarObservers[id] = observer;
    }

    function _forceSetAvatar(id, entity) {
        var el = document.getElementById(id);
        if (!el || !entity) return;
        el.classList.add('skill-combat-avatar');
        el.classList.remove(
            'death-anim', 'casting', 'hit-shake', 'hit-flash', 'skill-status-blinded-smoke',
            'skill-picture-slash-dash', 'skill-picture-electric-shield', 'skill-picture-pulled', 'skill-picture-crushed', 'skill-picture-speed',
            'enemy-picture-shield-bash', 'enemy-picture-hook-pulled', 'enemy-picture-teleport-slash', 'enemy-picture-jet-hover',
            'enemy-picture-commander-swap', 'enemy-picture-player-confused', 'enemy-picture-manic-pounce', 'enemy-picture-nox-charge',
            'enemy-target-aim-locked', 'enemy-target-explosion-hit', 'enemy-target-burning', 'enemy-target-suppressed', 'enemy-target-toxic-stuck',
            'skill-status-stun', 'skill-status-bleed', 'skill-status-burn', 'skill-status-toxin', 'skill-status-disarm', 'skill-status-manic-locked'
        );
        el.style.removeProperty('animation');
        el.style.removeProperty('opacity');
        el.style.removeProperty('transform');
        el.style.removeProperty('filter');
        el.setAttribute('data-avatar-key', entity.image || entity.icon || '');
        el.setAttribute('data-avatar-icon', entity.icon || '❔');
        el.setAttribute('aria-label', entity.name || 'avatar');

        // 清理旧的镜像wrapper
        var oldWrap = el.querySelector('.avatar-mirror-wrap');
        if (oldWrap) oldWrap.remove();

        if (entity.image) {
            el.classList.add('has-avatar-image');
            el.classList.remove('no-avatar-image');
            var _isMirror = entity.mirror === true;
            if (_isMirror) {
                // 镜像敌人：用内层wrapper实现图片翻转，不受动画transform影响
                el.style.backgroundImage = 'none';
                el.style.backgroundSize = '';
                el.style.backgroundPosition = '';
                el.style.backgroundRepeat = '';
                var wrap = document.createElement('div');
                wrap.className = 'avatar-mirror-wrap';
                wrap.style.cssText = 'position:absolute;inset:0;background-image:url(\'' + entity.image + '\');background-size:contain;background-position:center;background-repeat:no-repeat;pointer-events:none;transform:scaleX(-1);';
                el.appendChild(wrap);
            } else {
                el.style.backgroundImage = "url('" + entity.image + "')";
                el.style.backgroundSize = 'contain';
                el.style.backgroundPosition = 'center';
                el.style.backgroundRepeat = 'no-repeat';
            }
        } else {
            el.classList.remove('has-avatar-image');
            el.classList.add('no-avatar-image');
            el.style.backgroundImage = '';
        }
    }

    function setBattleAvatar(id, entity) {
        var el = document.getElementById(id);
        if (!el || !entity) return;

        // 启动 MutationObserver（只启动一次）
        observeAvatar(id, entity);

        var currentKey = el.getAttribute('data-avatar-key');
        var newKey = entity.image || entity.icon || '';
        if (currentKey === newKey && el.classList.contains('skill-combat-avatar')) {
            // 如果死亡动画残留(opacity=0)，需要强制重置
            if (el.classList.contains('death-anim') || parseFloat(el.style.opacity || '1') < 1 || parseFloat(el.style.opacity || '1') === 0) {
                _forceSetAvatar(id, entity);
            }
            return;
        }

        _forceSetAvatar(id, entity);
    }

    function setBarWidth(id, percent) {
        var el = document.getElementById(id);
        if (el) el.style.width = Math.max(0, Math.min(100, percent)) + '%';
    }

    function appendBattleLog(html) {
        var log = document.getElementById('autoBattleLog');
        if (!log) return;
        log.innerHTML += '<div style="animation: logSlideIn 0.3s ease;">' + html + '</div>';
        log.scrollTop = log.scrollHeight;
    }

    // ========== 键盘控制 ==========
    document.addEventListener('keydown', function(e) {
        if (!SkillCombat.isActive || !SkillCombat.isPlayerTurn || SkillCombat.isAnimating) return;

        if (e.key === '0' || e.code === 'Space') {
            e.preventDefault();
            playerUseBasicAttack();
            return;
        }

        var key = parseInt(e.key);
        if (key >= 1 && key <= 4) {
            e.preventDefault();
            playerUseSkill(key - 1);
        }
    });

    // ========== 注入 CSS ==========
    function injectSkillCombatCSS() {
        if (document.getElementById('skill-combat-css')) return;

        var style = document.createElement('style');
        style.id = 'skill-combat-css';
        style.textContent = '\
/* ===== 战斗头像图片（保持和肃清等待时一致的透明立绘样式） ===== */\
.skill-combat-avatar {\
    width: 64px;\
    height: 64px;\
    border-radius: 0;\
    overflow: visible;\
    display: flex;\
    position: relative;\
    align-items: center;\
    justify-content: center;\
    margin: 4px auto;\
    border: none;\
    background-color: transparent !important;\
    box-shadow: none;\
    color: transparent !important;\
    font-size: 0 !important;\
    line-height: 0 !important;\
    text-shadow: none !important;\
    position: relative;\
}\
#battlePlayerIcon.skill-combat-avatar, #battleEnemyIcon.skill-combat-avatar {\
    color: transparent !important;\
    font-size: 0 !important;\
    line-height: 0 !important;\
    text-shadow: none !important;\
}\
.avatar-mirror {\
    transform: scaleX(-1);\
}\
.avatar-mirror-wrap {\
    z-index: 1;\
}\
.skill-combat-avatar::before {\
    content: attr(data-avatar-icon);\
    position: absolute;\
    inset: 0;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    font-size: 2.5rem;\
    line-height: 1;\
    color: #e0e0e0;\
    text-shadow: 0 0 14px rgba(0, 212, 255, 0.55);\
    z-index: 2;\
    pointer-events: none;\
}\
.skill-combat-avatar.has-avatar-image::before {\
    display: none;\
}\
/* ===== 能量显示 ===== */\
#battlePlayerActionBar {\
    background: linear-gradient(90deg, #2146a8, var(--orokin-cyan), #bdf7ff) !important;\
    box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);\
}\
#battleEnemyActionBar {\
    background: linear-gradient(90deg, #4a1b1b, #ff8844) !important;\
    opacity: 0.75;\
}\
/* ===== 技能栏大面板 ===== */\
.skill-bar-panel {\
    width: 100%;\
    margin: 16px 0 14px;\
    padding: 14px;\
    border: 1px solid rgba(0, 212, 255, 0.35);\
    border-radius: 14px;\
    background: linear-gradient(180deg, rgba(0, 212, 255, 0.10), rgba(0, 0, 0, 0.34));\
    box-shadow: 0 0 22px rgba(0, 212, 255, 0.12);\
}\
.skill-bar-title {\
    display: flex;\
    justify-content: space-between;\
    align-items: center;\
    gap: 10px;\
    margin-bottom: 12px;\
    color: var(--tenno-gold);\
    font-family: \"Orbitron\", \"Noto Sans SC\", sans-serif;\
    font-size: 0.9rem;\
}\
.skill-bar-hint {\
    color: #888;\
    font-size: 0.72rem;\
    font-family: \"Noto Sans SC\", sans-serif;\
}\
.skill-bar-buttons {\
    display: grid;\
    grid-template-columns: repeat(5, minmax(82px, 1fr));\
    gap: 12px;\
}\
/* ===== 技能按钮 ===== */\
.skill-btn {\
    position: relative;\
    width: 100%;\
    min-height: 96px;\
    border: 2px solid #333;\
    border-radius: 12px;\
    background: rgba(18, 18, 26, 0.9);\
    cursor: pointer;\
    display: flex;\
    flex-direction: column;\
    align-items: center;\
    justify-content: center;\
    gap: 2px;\
    transition: all 0.2s ease;\
    overflow: hidden;\
    user-select: none;\
}\
.skill-btn:hover {\
    border-color: var(--orokin-cyan-dim);\
    transform: translateY(-2px);\
}\
.skill-btn.skill-ready {\
    border-color: var(--orokin-cyan);\
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.3);\
    animation: skillReadyPulse 2s ease-in-out infinite;\
}\
.skill-btn.skill-cd {\
    opacity: 0.5;\
    cursor: not-allowed;\
    border-color: #555;\
}\
.skill-btn.skill-no-energy {\
    opacity: 0.4;\
    cursor: not-allowed;\
    border-color: #ff8844;\
}\
.skill-basic-btn {\
    border-color: var(--tenno-gold-dim);\
    background: linear-gradient(180deg, rgba(200, 168, 75, 0.18), rgba(18, 18, 26, 0.92));\
}\
.skill-basic-btn .skill-btn-cost {\
    color: var(--tenno-gold);\
}\
.skill-btn-icon {\
    font-size: 2rem;\
    line-height: 1;\
}\
.skill-btn-name {\
    font-size: 0.78rem;\
    color: #aaa;\
    font-family: "Noto Sans SC", sans-serif;\
}\
.skill-btn-cost {\
    font-size: 0.68rem;\
    color: var(--orokin-cyan);\
    font-family: "Orbitron", sans-serif;\
}\
.skill-btn-key {\
    position: absolute;\
    top: 3px;\
    right: 5px;\
    font-size: 0.6rem;\
    color: #666;\
    font-family: "Orbitron", sans-serif;\
}\
.skill-btn-cd-overlay {\
    position: absolute;\
    inset: 0;\
    background: rgba(0, 0, 0, 0.7);\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    font-family: "Orbitron", sans-serif;\
    font-size: 1.4rem;\
    color: #ff8844;\
    border-radius: 10px;\
}\
@media (max-width: 720px) {\
    .skill-bar-buttons { display: grid;grid-template-columns: repeat(3, 1fr);gap: 4px;  }\
    .skill-combat-avatar { width: 56px; height: 56px; }\
	.skill-btn {min-height: 48px;padding: 2px 1px;}\
	.skill-btn-icon {font-size: 1.2rem;}\
	    .skill-btn-name {font-size: 0.58rem;}\
	    .skill-btn-cost {font-size: 0.52rem;}\
}\
\
@keyframes skillReadyPulse {\
    0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 255, 0.2); }\
    50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.5); }\
}\
\
/* ===== 浮动伤害 ===== */\
.skill-damage-float {\
    position: fixed;\
    font-family: "Orbitron", sans-serif;\
    font-weight: 900;\
    font-size: 1.5rem;\
    pointer-events: none;\
    animation: skillDmgFloat 1.2s ease forwards;\
    z-index: 2000;\
    text-shadow: 0 0 10px currentColor;\
    transform: translateX(-50%);\
}\
\
@keyframes skillDmgFloat {\
    0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }\
    30% { opacity: 1; transform: translateX(-50%) translateY(-20px) scale(1.3); }\
    100% { opacity: 0; transform: translateX(-50%) translateY(-70px) scale(0.6); }\
}\
\
/* ===== 受击/施法/死亡动画 ===== */\
.hit-shake {\
    animation: hitShake 0.4s ease !important;\
}\
@keyframes hitShake {\
    0%, 100% { transform: translateX(0); }\
    20% { transform: translateX(-8px); }\
    40% { transform: translateX(8px); }\
    60% { transform: translateX(-4px); }\
    80% { transform: translateX(4px); }\
}\
\
.hit-flash {\
    animation: hitFlash 0.3s ease !important;\
}\
@keyframes hitFlash {\
    0% { filter: brightness(1); }\
    50% { filter: brightness(3) saturate(0); }\
    100% { filter: brightness(1); }\
}\
\
.casting {\
    box-shadow: 0 0 28px rgba(0, 212, 255, 0.45) !important;\
    outline: 1px solid rgba(0, 212, 255, 0.55);\
}\
@keyframes castingGlow {\
    0% { filter: brightness(1) drop-shadow(0 0 5px var(--orokin-cyan)); }\
    100% { filter: brightness(1.5) drop-shadow(0 0 15px var(--orokin-cyan)); }\
}\
\
/* ===== 技能飞行/范围特效 ===== */\
.skill-vfx {\
    position: fixed;\
    z-index: 2600;\
    left: 0;\
    top: 0;\
    width: 46px;\
    height: 46px;\
    margin-left: -23px;\
    margin-top: -23px;\
    border-radius: 50%;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    font-size: 2rem;\
    color: #fff;\
    pointer-events: none;\
    background: radial-gradient(circle, var(--vfx-color), rgba(255,255,255,0.25), transparent 72%);\
    box-shadow: 0 0 28px var(--vfx-color), 0 0 60px rgba(255,255,255,0.2);\
    text-shadow: 0 0 12px #fff;\
    animation: skillVfxFly 700ms ease-out forwards;\
}\
.skill-vfx-electric {\
    border-radius: 20%;\
    animation-name: skillVfxLightning;\
}\
.skill-vfx-blast, .skill-vfx-magnetic {\
    animation-name: skillVfxPulse;\
}\
.skill-vfx-player {\
    transform-origin: center;\
}\
.skill-vfx-enemy {\
    transform-origin: center;\
}\
@keyframes skillVfxFly {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.35) rotate(0deg); }\
    18% { opacity: 1; transform: translate(0, 0) scale(1); }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.45) rotate(35deg); }\
}\
@keyframes skillVfxLightning {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(0deg); filter: brightness(1); }\
    20% { opacity: 1; transform: translate(calc(var(--vfx-x) * 0.2), calc(var(--vfx-y) * 0.2)) scale(1.2) rotate(18deg); filter: brightness(3); }\
    45% { transform: translate(calc(var(--vfx-x) * 0.5), calc(var(--vfx-y) * 0.5)) scale(0.8) rotate(-20deg); filter: brightness(2); }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.6) rotate(40deg); filter: brightness(1); }\
}\
@keyframes skillVfxPulse {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.2); }\
    35% { opacity: 0.95; transform: translate(calc(var(--vfx-x) * 0.5), calc(var(--vfx-y) * 0.5)) scale(2.1); }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(4); }\
}\
\
.death-anim {\
    animation: deathFade 1s ease forwards !important;\
}\
@keyframes deathFade {\
    0% { opacity: 1; transform: scale(1); }\
    50% { opacity: 0.5; transform: scale(1.1); filter: brightness(3); }\
    100% { opacity: 0; transform: scale(0.5) rotate(15deg); }\
}\
\
/* ===== 日志滑入 ===== */\
@keyframes logSlideIn {\
    from { opacity: 0; transform: translateX(-10px); }\
    to { opacity: 1; transform: translateX(0); }\
}\
\
/* ===== Excalibur 技能动画 ===== */\
@keyframes anim-basic-attack {\
    0% { transform: translateX(0) scale(1); filter: brightness(1); }\
    35% { transform: translateX(34px) scale(1.06); filter: brightness(1.35) drop-shadow(0 0 10px #ffffff); }\
    65% { transform: translateX(48px) scale(1.12); filter: brightness(1.7) drop-shadow(0 0 16px #ffffff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-slash-dash {\
    0% { transform: translateX(0); filter: brightness(1); }\
    30% { transform: translateX(60px) scale(1.1); filter: brightness(1.5) drop-shadow(0 0 15px #00d4ff); }\
    60% { transform: translateX(80px) scale(1.2); filter: brightness(2) drop-shadow(0 0 25px #00d4ff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-radial-blind {\
    0% { transform: scale(1); filter: brightness(1); }\
    40% { transform: scale(1.3); filter: brightness(2) drop-shadow(0 0 30px #ffd700); }\
    70% { transform: scale(1.5); filter: brightness(3) drop-shadow(0 0 40px #ffd700); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-radial-javelin {\
    0% { transform: translateY(0); filter: brightness(1); }\
    30% { transform: translateY(-20px); filter: brightness(1.5); }\
    50% { transform: translateY(-30px) scale(1.2); filter: brightness(2) drop-shadow(0 0 20px #ff4444); }\
    70% { transform: translateY(-10px); filter: brightness(2.5); }\
    100% { transform: translateY(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-exalted-blade {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }\
    30% { transform: scale(1.2) rotate(-10deg); filter: brightness(1.5) drop-shadow(0 0 20px #ff66ff); }\
    60% { transform: scale(1.4) rotate(10deg); filter: brightness(2.5) drop-shadow(0 0 35px #ff66ff); }\
    100% { transform: scale(1) rotate(0deg); filter: brightness(1); }\
}\
\
/* ===== Volt 技能动画 ===== */\
@keyframes anim-shock {\
    0% { transform: translateX(0); filter: brightness(1); }\
    20% { filter: brightness(3) drop-shadow(0 0 20px #4488ff); }\
    40% { transform: translateX(30px); filter: brightness(2) drop-shadow(0 0 15px #4488ff); }\
    60% { filter: brightness(3) drop-shadow(0 0 25px #4488ff); }\
    80% { transform: translateX(60px); filter: brightness(1.5); }\
    100% { transform: translateX(0); filter: brightness(1); }\
}\
@keyframes anim-speed {\
    0% { transform: translateX(0); filter: brightness(1); }\
    25% { transform: translateX(-15px); filter: brightness(1.5) drop-shadow(0 0 15px #00d4ff); }\
    50% { transform: translateX(15px); filter: brightness(2) drop-shadow(0 0 20px #00d4ff); }\
    75% { transform: translateX(-10px); filter: brightness(1.5); }\
    100% { transform: translateX(0); filter: brightness(1); }\
}\
@keyframes anim-electric-shield {\
    0% { transform: scale(1); box-shadow: 0 0 0 transparent; }\
    50% { transform: scale(1.15); box-shadow: 0 0 30px rgba(136, 204, 255, 0.6); filter: brightness(1.5); }\
    100% { transform: scale(1); box-shadow: 0 0 0 transparent; }\
}\
@keyframes anim-discharge {\
    0% { transform: scale(1); filter: brightness(1); }\
    30% { transform: scale(1.3); filter: brightness(3) drop-shadow(0 0 40px #ffaa00); }\
    60% { transform: scale(1.5); filter: brightness(4) drop-shadow(0 0 50px #ffaa00); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
\
/* ===== Mag 技能动画 ===== */\
@keyframes anim-pull {\
    0% { transform: scale(1); filter: brightness(1); }\
    40% { transform: scale(1.1); filter: brightness(1.5) drop-shadow(0 0 20px #ff66ff); }\
    60% { transform: scale(0.95); filter: brightness(2) drop-shadow(0 0 30px #ff66ff); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-magnetize {\
    0% { transform: rotate(0deg) scale(1); filter: brightness(1); }\
    50% { transform: rotate(180deg) scale(1.2); filter: brightness(2) drop-shadow(0 0 25px #cc44ff); }\
    100% { transform: rotate(360deg) scale(1); filter: brightness(1); }\
}\
@keyframes anim-polarize {\
    0% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }\
    50% { transform: scale(1.3); filter: brightness(2) hue-rotate(180deg) drop-shadow(0 0 30px #ff44ff); }\
    100% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }\
}\
@keyframes anim-crush {\
    0% { transform: scale(1); filter: brightness(1); }\
    40% { transform: scale(1.4); filter: brightness(3) drop-shadow(0 0 40px #ff00ff); }\
    70% { transform: scale(0.9); filter: brightness(2); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
\
/* ===== 敌人技能动画 ===== */\
@keyframes anim-enemy-slash {\
    0% { transform: translateX(0) rotate(0deg); }\
    40% { transform: translateX(-40px) rotate(-15deg); filter: brightness(1.5) drop-shadow(0 0 10px #ff4444); }\
    100% { transform: translateX(0) rotate(0deg); }\
}\
@keyframes anim-enemy-heavy {\
    0% { transform: translateX(0) scale(1); }\
    30% { transform: translateX(-20px) scale(0.9); }\
    50% { transform: translateX(-50px) scale(1.2); filter: brightness(2) drop-shadow(0 0 20px #ff8844); }\
    100% { transform: translateX(0) scale(1); }\
}\
@keyframes anim-enemy-shot {\
    0% { transform: translateX(0); }\
    30% { transform: translateX(-10px); filter: brightness(1.5); }\
    50% { filter: brightness(2) drop-shadow(0 0 10px #ffaa00); }\
    100% { transform: translateX(0); }\
}\
@keyframes anim-enemy-grenade {\
    0% { transform: translateY(0) scale(1); }\
    40% { transform: translateY(-20px) scale(1.1); filter: brightness(1.5); }\
    70% { transform: translateY(-10px) scale(1.3); filter: brightness(2.5) drop-shadow(0 0 25px #ff6644); }\
    100% { transform: translateY(0) scale(1); }\
}\
@keyframes anim-enemy-boss-attack {\
    0% { transform: translateX(0) scale(1); }\
    30% { transform: translateX(-30px) scale(1.1); filter: brightness(1.5) drop-shadow(0 0 15px #ff4444); }\
    60% { transform: translateX(-50px) scale(1.2); filter: brightness(2) drop-shadow(0 0 25px #ff0000); }\
    100% { transform: translateX(0) scale(1); }\
}\
@keyframes anim-enemy-boss-special {\
    0% { transform: scale(1); filter: brightness(1); }\
    30% { transform: scale(1.3); filter: brightness(2) drop-shadow(0 0 30px #ff0000); }\
    60% { transform: scale(1.5); filter: brightness(3) drop-shadow(0 0 40px #ff0000); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-enemy-elite-attack {\
    0% { transform: translateX(0); }\
    40% { transform: translateX(-35px); filter: brightness(1.5) drop-shadow(0 0 15px #ffd700); }\
    100% { transform: translateX(0); }\
}\
@keyframes anim-enemy-elite-skill {\
    0% { transform: scale(1); filter: brightness(1); }\
    40% { transform: scale(1.2); filter: brightness(2) drop-shadow(0 0 20px #ff8800); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-enemy-basic {\
    0% { transform: translateX(0); }\
    50% { transform: translateX(-20px); filter: brightness(1.3); }\
    100% { transform: translateX(0); }\
}\
\
/* ===== Rhino 技能动画 ===== */\
@keyframes anim-rhino-charge {\
    0% { transform: translateX(0) scale(1) skewX(0deg); filter: brightness(1); }\
    10% { transform: translateX(-18px) scale(0.9) skewX(-2deg); filter: brightness(1.3) drop-shadow(0 0 8px #666); }\
    20% { transform: translateX(-32px) scale(0.82) skewX(-4deg); filter: brightness(1.8) drop-shadow(0 0 18px #888); }\
    30% { transform: translateX(-42px) scale(0.76) skewX(-6deg); filter: brightness(2.5) drop-shadow(0 0 28px #aaa) drop-shadow(0 0 50px rgba(160,160,160,0.4)); }\
    40% { transform: translateX(-30px) scale(0.84) skewX(-3deg); filter: brightness(3.2) drop-shadow(0 0 38px #bbb) drop-shadow(0 0 65px rgba(180,180,180,0.5)); }\
    50% { transform: translateX(40px) scale(1.12) skewX(2deg); filter: brightness(4.8) drop-shadow(0 0 55px #ccc) drop-shadow(0 0 90px rgba(200,200,200,0.7)); }\
    60% { transform: translateX(95px) scale(1.28) skewX(3deg); filter: brightness(6) drop-shadow(0 0 75px #ddd) drop-shadow(0 0 120px rgba(210,210,210,0.8)); }\
    72% { transform: translateX(135px) scale(1.38) skewX(2deg); filter: brightness(7.5) drop-shadow(0 0 95px #eee) drop-shadow(0 0 150px rgba(225,225,225,0.9)); }\
    80% { transform: translateX(158px) scale(1.25) skewX(1deg); filter: brightness(6); drop-shadow(0 0 80px #ddd); }\
    88% { transform: translateX(162px) scale(1.1) skewX(0deg); filter: brightness(3); drop-shadow(0 0 35px #aaa); }\
    94% { transform: translateX(161px) scale(1.04) skewX(0deg); filter: brightness(1.5) drop-shadow(0 0 12px #888); }\
    100% { transform: translateX(160px) scale(1) skewX(0deg); filter: brightness(1); }\
}\
@keyframes anim-iron-skin {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: scale(0.92) rotate(-2deg); filter: brightness(1.6) hue-rotate(5deg); }\
    22% { transform: scale(0.88) rotate(-3deg); filter: brightness(2.8) drop-shadow(0 0 30px #aaa) hue-rotate(10deg); }\
    38% { transform: scale(1.15) rotate(2deg); filter: brightness(5) drop-shadow(0 0 65px #ccc) drop-shadow(0 0 110px rgba(200,200,200,0.6)) hue-rotate(15deg); }\
    52% { transform: scale(1.32) rotate(3deg); filter: brightness(7) drop-shadow(0 0 90px #ddd) drop-shadow(0 0 150px rgba(220,220,220,0.8)) hue-rotate(20deg); }\
    68% { transform: scale(1.38) rotate(2deg); filter: brightness(8) drop-shadow(0 0 110px #eee) drop-shadow(0 0 180px rgba(230,230,230,0.9)) hue-rotate(22deg); }\
    82% { transform: scale(1.28) rotate(1deg); filter: brightness(5) drop-shadow(0 0 70px #ccc) hue-rotate(15deg); }\
    92% { transform: scale(1.18) rotate(0deg); filter: brightness(2.5) drop-shadow(0 0 35px #bbb) hue-rotate(8deg); }\
    100% { transform: scale(1.12) rotate(0deg); filter: brightness(1.8) drop-shadow(0 0 22px #999) hue-rotate(0deg); }\
}\
@keyframes anim-roar {\
    0% { transform: scale(1) rotate(0deg) translateY(0); filter: brightness(1); }\
    8% { transform: scale(1.06) rotate(-2deg) translateY(-3px); filter: brightness(1.8) drop-shadow(0 0 15px #ffaa00); }\
    18% { transform: scale(1.12) rotate(4deg) translateY(-8px); filter: brightness(3) drop-shadow(0 0 35px #ffcc00); }\
    30% { transform: scale(1.25) rotate(-5deg) translateY(-14px); filter: brightness(5) drop-shadow(0 0 60px #ffdd00) drop-shadow(0 0 100px rgba(255,220,0,0.6)); }\
    42% { transform: scale(1.38) rotate(6deg) translateY(-20px); filter: brightness(7) drop-shadow(0 0 85px #ffee00) drop-shadow(0 0 140px rgba(255,240,0,0.7)); }\
    55% { transform: scale(1.45) rotate(-4deg) translateY(-22px); filter: brightness(9) drop-shadow(0 0 110px #fff200) drop-shadow(0 0 180px rgba(255,250,0,0.8)); }\
    68% { transform: scale(1.32) rotate(3deg) translateY(-15px); filter: brightness(6) drop-shadow(0 0 75px #ffdd00); }\
    80% { transform: scale(1.18) rotate(-2deg) translateY(-8px); filter: brightness(3.5) drop-shadow(0 0 40px #ffcc00); }\
    90% { transform: scale(1.08) rotate(1deg) translateY(-3px); filter: brightness(2) drop-shadow(0 0 20px #ffbb00); }\
    100% { transform: scale(1.05) rotate(0deg) translateY(0); filter: brightness(1.4) drop-shadow(0 0 12px #ffaa00); }\
}\
@keyframes anim-rhino-stomp {\
    0% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
    8% { transform: translateY(-15px) scale(1.05) rotate(-2deg); filter: brightness(1.5) drop-shadow(0 0 15px #ff4444); }\
    18% { transform: translateY(-35px) scale(1.1) rotate(-3deg); filter: brightness(2.5) drop-shadow(0 0 30px #ff3333); }\
    28% { transform: translateY(-60px) scale(1.12) rotate(-4deg); filter: brightness(3.5) drop-shadow(0 0 50px #ff2222) drop-shadow(0 0 80px rgba(255,40,40,0.5)); }\
    38% { transform: translateY(-80px) scale(1.08) rotate(-2deg); filter: brightness(4) drop-shadow(0 0 65px #ff1111); }\
    48% { transform: translateY(55px) scale(1.4) rotate(2deg); filter: brightness(7) drop-shadow(0 0 100px #ff0000) drop-shadow(0 0 170px rgba(255,0,0,0.8)); }\
    58% { transform: translateY(30px) scale(1.32) rotate(1deg); filter: brightness(5.5) drop-shadow(0 0 80px #ff1111); }\
    70% { transform: translateY(10px) scale(1.18) rotate(0deg); filter: brightness(3.5) drop-shadow(0 0 50px #ff3333); }\
    82% { transform: translateY(-5px) scale(1.06) rotate(-1deg); filter: brightness(2); }\
    92% { transform: translateY(2px) scale(1.02) rotate(0deg); filter: brightness(1.3); }\
    100% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
}\
\
/* ===== Ash 技能动画 ===== */\
@keyframes anim-shuriken {\
    0% { transform: translateX(0) rotateZ(0deg) scale(1) skewX(0deg); filter: brightness(1); }\
    12% { transform: translateX(30px) rotateZ(540deg) scale(1.12) skewX(2deg); filter: brightness(2.5) drop-shadow(0 0 20px #888); }\
    25% { transform: translateX(70px) rotateZ(1080deg) scale(1.25) skewX(3deg); filter: brightness(4.5) drop-shadow(0 0 45px #aaa) drop-shadow(0 0 80px rgba(170,170,170,0.5)); }\
    40% { transform: translateX(110px) rotateZ(1800deg) scale(1.35) skewX(2deg); filter: brightness(6) drop-shadow(0 0 70px #ccc); }\
    55% { transform: translateX(140px) rotateZ(2520deg) scale(1.25) skewX(1deg); filter: brightness(5) drop-shadow(0 0 55px #bbb); }\
    70% { transform: translateX(158px) rotateZ(3240deg) scale(1.1) skewX(0deg); filter: brightness(3); }\
    85% { transform: translateX(162px) rotateZ(3600deg) scale(1.03); filter: brightness(1.8); }\
    100% { transform: translateX(160px) rotateZ(3600deg) scale(1) skewX(0deg); filter: brightness(1); }\
}\
@keyframes anim-smoke-screen {\
    0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
    10% { transform: scale(1.08) rotate(3deg); opacity: 0.85; filter: brightness(1.5) drop-shadow(0 0 18px #555); }\
    22% { transform: scale(1.2) rotate(-4deg); opacity: 0.6; filter: brightness(2.5) drop-shadow(0 0 35px #444) drop-shadow(0 0 60px rgba(80,80,80,0.5)); }\
    35% { transform: scale(1.4) rotate(5deg); opacity: 0.35; filter: brightness(3.5) drop-shadow(0 0 60px #333) drop-shadow(0 0 100px rgba(60,60,60,0.6)); }\
    48% { transform: scale(1.55) rotate(-3deg); opacity: 0.15; filter: brightness(4.5) drop-shadow(0 0 85px #222) drop-shadow(0 0 130px rgba(40,40,40,0.7)); }\
    60% { transform: scale(1.45) rotate(2deg); opacity: 0.08; filter: brightness(3.5) drop-shadow(0 0 65px #333); }\
    75% { transform: scale(1.3) rotate(-2deg); opacity: 0.35; filter: brightness(2) drop-shadow(0 0 35px #444); }\
    88% { transform: scale(1.15) rotate(1deg); opacity: 0.7; filter: brightness(1.5) drop-shadow(0 0 18px #555); }\
    100% { transform: scale(1.08) rotate(0deg); opacity: 0.9; filter: brightness(1.2) drop-shadow(0 0 10px #666); }\
}\
@keyframes anim-teleport {\
    0% { transform: translateX(0) scale(1) rotate(0deg); opacity: 1; filter: brightness(1) hue-rotate(0deg); }\
    8% { transform: translateX(-12px) scale(0.92) rotate(5deg); opacity: 0.9; filter: brightness(2) drop-shadow(0 0 20px #8800ff); }\
    18% { transform: translateX(18px) scale(0.7) rotate(-8deg); opacity: 0.6; filter: brightness(3.5) drop-shadow(0 0 35px #aa00ff) hue-rotate(30deg); }\
    28% { transform: translateX(55px) scale(0.35) rotate(12deg); opacity: 0.2; filter: brightness(5) drop-shadow(0 0 55px #cc00ff) drop-shadow(0 0 90px rgba(170,0,255,0.6)) hue-rotate(60deg); }\
    38% { transform: translateX(90px) scale(0.12) rotate(-5deg); opacity: 0; filter: brightness(6) drop-shadow(0 0 70px #dd00ff); }\
    48% { transform: translateX(140px) scale(0.12) rotate(0deg); opacity: 0; filter: brightness(5); }\
    58% { transform: translateX(160px) scale(0.6) rotate(-25deg); opacity: 0.4; filter: brightness(4) drop-shadow(0 0 50px #9900ff); }\
    70% { transform: translateX(160px) scale(1.3) rotate(-15deg); opacity: 0.85; filter: brightness(5) drop-shadow(0 0 65px #bb00ff) drop-shadow(0 0 100px rgba(170,0,255,0.7)); }\
    82% { transform: translateX(160px) scale(1.12) rotate(-5deg); opacity: 1; filter: brightness(2.5) drop-shadow(0 0 30px #8800ff); }\
    92% { transform: translateX(160px) scale(1.04) rotate(-1deg); opacity: 1; filter: brightness(1.5); }\
    100% { transform: translateX(160px) scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
}\
@keyframes anim-blade-storm {\
    0% { transform: scale(1) rotateZ(0deg) skewX(0deg); filter: brightness(1); }\
    6% { transform: scale(1.08) rotateZ(15deg) skewX(3deg); filter: brightness(3) drop-shadow(0 0 22px #f00); }\
    12% { transform: scale(1.16) rotateZ(-20deg) skewX(-4deg); filter: brightness(5) drop-shadow(0 0 55px #f00) drop-shadow(0 0 95px rgba(255,0,0,0.6)); }\
    18% { transform: scale(1.24) rotateZ(25deg) skewX(5deg); filter: brightness(7) drop-shadow(0 0 80px #f00); }\
    24% { transform: scale(1.3) rotateZ(-28deg) skewX(-5deg); filter: brightness(8.5) drop-shadow(0 0 105px #f00) drop-shadow(0 0 165px rgba(255,0,0,0.7)); }\
    30% { transform: scale(1.35) rotateZ(30deg) skewX(6deg); filter: brightness(9.5) drop-shadow(0 0 125px #ff0000) drop-shadow(0 0 200px rgba(255,0,0,0.8)); }\
    36% { transform: scale(1.22) rotateZ(-18deg) skewX(-3deg); filter: brightness(6); }\
    44% { transform: scale(1.15) rotateZ(14deg) skewX(4deg); filter: brightness(4.2); }\
    52% { transform: scale(1.28) rotateZ(-22deg) skewX(-5deg); filter: brightness(6) drop-shadow(0 0 85px #f00); }\
    60% { transform: scale(1.18) rotateZ(18deg) skewX(4deg); filter: brightness(4.5); }\
    68% { transform: scale(1.12) rotateZ(-10deg) skewX(-2deg); filter: brightness(3); }\
    76% { transform: scale(1.16) rotateZ(8deg) skewX(2deg); filter: brightness(2.8); }\
    84% { transform: scale(1.08) rotateZ(-4deg) skewX(-1deg); filter: brightness(2); }\
    92% { transform: scale(1.1) rotateZ(3deg) skewX(1deg); filter: brightness(2.5); }\
    100% { transform: scale(1.08) rotateZ(0deg) skewX(0deg); filter: brightness(2.8) drop-shadow(0 0 35px #f00); }\
}\
\
/* ===== Ember 技能动画 ===== */\
@keyframes anim-fireball {\
    0% { transform: translateX(0) scale(0.5) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: translateX(15px) scale(0.8) rotate(5deg); filter: brightness(2.5) drop-shadow(0 0 18px #ff6600) hue-rotate(5deg); }\
    22% { transform: translateX(40px) scale(1.1) rotate(-3deg); filter: brightness(4) drop-shadow(0 0 40px #ff8800) drop-shadow(0 0 70px rgba(255,100,0,0.5)) hue-rotate(10deg); }\
    35% { transform: translateX(75px) scale(1.4) rotate(4deg); filter: brightness(5.5) drop-shadow(0 0 60px #ffaa00) drop-shadow(0 0 100px rgba(255,130,0,0.6)) hue-rotate(15deg); }\
    48% { transform: translateX(110px) scale(1.6) rotate(-2deg); filter: brightness(7) drop-shadow(0 0 85px #ffbb00) drop-shadow(0 0 130px rgba(255,150,0,0.7)) hue-rotate(18deg); }\
    60% { transform: translateX(135px) scale(1.55) rotate(2deg); filter: brightness(6.5) drop-shadow(0 0 75px #ffcc00); }\
    72% { transform: translateX(150px) scale(1.35) rotate(-1deg); filter: brightness(4.5) drop-shadow(0 0 50px #ff9900); }\
    85% { transform: translateX(158px) scale(1.05) rotate(0deg); filter: brightness(2.5); }\
    100% { transform: translateX(160px) scale(0.8) rotate(0deg); filter: brightness(1.8) drop-shadow(0 0 15px #ff6600); }\
}\
@keyframes anim-accelerant {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: scale(0.95) rotate(-2deg); filter: brightness(1.5) drop-shadow(0 0 12px #ff8800); }\
    20% { transform: scale(1.08) rotate(3deg); filter: brightness(2.8) drop-shadow(0 0 28px #ffaa00) hue-rotate(8deg); }\
    32% { transform: scale(1.22) rotate(-4deg); filter: brightness(4.2) drop-shadow(0 0 50px #ffcc00) drop-shadow(0 0 85px rgba(255,180,0,0.5)) hue-rotate(15deg); }\
    45% { transform: scale(1.38) rotate(5deg); filter: brightness(5.8) drop-shadow(0 0 75px #ffdd00) drop-shadow(0 0 120px rgba(255,200,0,0.6)) hue-rotate(20deg); }\
    58% { transform: scale(1.48) rotate(-3deg); filter: brightness(7) drop-shadow(0 0 95px #ffee00) drop-shadow(0 0 155px rgba(255,220,0,0.7)) hue-rotate(22deg); }\
    72% { transform: scale(1.35) rotate(2deg); filter: brightness(5) drop-shadow(0 0 65px #ffdd00) hue-rotate(18deg); }\
    85% { transform: scale(1.18) rotate(-1deg); filter: brightness(3) drop-shadow(0 0 35px #ffbb00) hue-rotate(10deg); }\
    100% { transform: scale(1.1) rotate(0deg); filter: brightness(2.2) drop-shadow(0 0 22px #ffaa00) hue-rotate(0deg); }\
}\
@keyframes anim-fire-blast {\
    0% { transform: scale(1) translateY(0) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    8% { transform: scale(1.06) translateY(-5px) rotate(-2deg); filter: brightness(1.8) drop-shadow(0 0 15px #ff4400); }\
    18% { transform: scale(1.18) translateY(-14px) rotate(3deg); filter: brightness(3.2) drop-shadow(0 0 38px #ff2200) drop-shadow(0 0 65px rgba(255,50,0,0.5)) hue-rotate(5deg); }\
    28% { transform: scale(1.35) translateY(-22px) rotate(-4deg); filter: brightness(5) drop-shadow(0 0 60px #ff1100) drop-shadow(0 0 100px rgba(255,30,0,0.6)) hue-rotate(10deg); }\
    38% { transform: scale(1.55) translateY(-10px) rotate(2deg); filter: brightness(6.5) drop-shadow(0 0 85px #ff0000) drop-shadow(0 0 140px rgba(255,15,0,0.7)) hue-rotate(15deg); }\
    48% { transform: scale(1.68) translateY(8px) rotate(-3deg); filter: brightness(7.5) drop-shadow(0 0 110px #ff0000) drop-shadow(0 0 180px rgba(255,0,0,0.8)) hue-rotate(18deg); }\
    58% { transform: scale(1.52) translateY(2px) rotate(1deg); filter: brightness(5.5) drop-shadow(0 0 80px #ff1100); }\
    70% { transform: scale(1.32) translateY(-4px) rotate(-1deg); filter: brightness(3.5) drop-shadow(0 0 45px #ff3300); }\
    82% { transform: scale(1.15) translateY(-1px) rotate(0deg); filter: brightness(2.2) drop-shadow(0 0 25px #ff5500); }\
    92% { transform: scale(1.08) translateY(0) rotate(0deg); filter: brightness(1.8) drop-shadow(0 0 15px #ff4400); }\
    100% { transform: scale(1.05) translateY(0) rotate(0deg); filter: brightness(1.5) drop-shadow(0 0 10px #ff4400); }\
}\
@keyframes anim-world-on-fire {\
    0% { transform: scale(1) rotateZ(0deg) translateY(0); filter: brightness(1) hue-rotate(0deg); }\
    6% { transform: scale(1.05) rotateZ(4deg) translateY(-5px); filter: brightness(2) drop-shadow(0 0 20px #f00) hue-rotate(5deg); }\
    12% { transform: scale(1.1) rotateZ(-6deg) translateY(-10px); filter: brightness(3.5) drop-shadow(0 0 42px #f00) drop-shadow(0 0 75px rgba(255,0,0,0.5)); }\
    18% { transform: scale(1.18) rotateZ(8deg) translateY(-16px); filter: brightness(5) drop-shadow(0 0 65px #ff2200) drop-shadow(0 0 110px rgba(255,30,0,0.6)) hue-rotate(10deg); }\
    24% { transform: scale(1.25) rotateZ(-10deg) translateY(-22px); filter: brightness(6.5) drop-shadow(0 0 88px #ff1100) drop-shadow(0 0 140px rgba(255,15,0,0.7)); }\
    30% { transform: scale(1.32) rotateZ(12deg) translateY(-28px); filter: brightness(7.5) drop-shadow(0 0 115px #ff0000) drop-shadow(0 0 175px rgba(255,0,0,0.8)) hue-rotate(15deg); }\
    38% { transform: scale(1.28) rotateZ(-9deg) translateY(-24px); filter: brightness(6); }\
    46% { transform: scale(1.22) rotateZ(7deg) translateY(-20px); filter: brightness(5); }\
    54% { transform: scale(1.26) rotateZ(-11deg) translateY(-25px); filter: brightness(6) drop-shadow(0 0 95px #ff1100) hue-rotate(12deg); }\
    62% { transform: scale(1.2) rotateZ(9deg) translateY(-20px); filter: brightness(5); }\
    70% { transform: scale(1.15) rotateZ(-6deg) translateY(-15px); filter: brightness(4); }\
    80% { transform: scale(1.1) rotateZ(4deg) translateY(-10px); filter: brightness(3); }\
    90% { transform: scale(1.06) rotateZ(-2deg) translateY(-5px); filter: brightness(2.2); }\
    100% { transform: scale(1.08) rotateZ(0deg) translateY(-8px); filter: brightness(2.8) drop-shadow(0 0 45px #f00) hue-rotate(0deg); }\
}\
/* ===== Rhino / Ash / Ember 角色动作增强 ===== */\
@keyframes skill-picture-rhino-charge {\
    0% { transform: translate(0, 0) scale(1) rotate(0deg) skewX(0deg); filter: brightness(1); }\
    10% { transform: translate(calc(var(--dash-x) * -0.12), calc(var(--dash-y) * -0.12)) scale(0.85) rotate(-4deg) skewX(-3deg); filter: brightness(1.8) drop-shadow(0 0 18px #888); }\
    22% { transform: translate(calc(var(--dash-x) * -0.18), calc(var(--dash-y) * -0.18)) scale(0.78) rotate(-5deg) skewX(-5deg); filter: brightness(3) drop-shadow(0 0 30px #aaa) drop-shadow(0 0 55px rgba(170,170,170,0.5)); }\
    38% { transform: translate(calc(var(--dash-x) * 0.55), calc(var(--dash-y) * 0.55)) scale(1.22) rotate(3deg) skewX(2deg); filter: brightness(4.5) drop-shadow(0 0 55px #bbb) drop-shadow(0 0 95px rgba(200,200,200,0.7)); }\
    52% { transform: translate(calc(var(--dash-x) * 0.82), calc(var(--dash-y) * 0.82)) scale(1.32) rotate(2deg) skewX(1deg); filter: brightness(6) drop-shadow(0 0 85px #ccc) drop-shadow(0 0 140px rgba(220,220,220,0.8)); }\
    65% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.28) rotate(1deg) skewX(0deg); filter: brightness(5.5) drop-shadow(0 0 80px #ccc); }\
    78% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.15) rotate(0deg) skewX(0deg); filter: brightness(3.5); }\
    88% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.06); filter: brightness(2); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(1) rotate(0deg) skewX(0deg); filter: brightness(1); }\
}\
@keyframes skill-picture-iron-skin {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    8% { transform: scale(0.94) rotate(-2deg); filter: brightness(1.5) hue-rotate(5deg); }\
    20% { transform: scale(0.88) rotate(-3deg); filter: brightness(2.8) drop-shadow(0 0 25px #aaa) hue-rotate(10deg); }\
    35% { transform: scale(1.08) rotate(2deg); filter: brightness(4.5) drop-shadow(0 0 55px #ccc) drop-shadow(0 0 90px rgba(200,200,200,0.6)) hue-rotate(15deg); }\
    50% { transform: scale(1.22) rotate(3deg); filter: brightness(6) drop-shadow(0 0 85px #ddd) drop-shadow(0 0 135px rgba(220,220,220,0.7)) hue-rotate(20deg); }\
    65% { transform: scale(1.28) rotate(2deg); filter: brightness(7) drop-shadow(0 0 105px #eee) drop-shadow(0 0 165px rgba(230,230,230,0.8)) hue-rotate(22deg); }\
    78% { transform: scale(1.2) rotate(1deg); filter: brightness(4.5) drop-shadow(0 0 65px #ccc) hue-rotate(15deg); }\
    90% { transform: scale(1.14) rotate(0deg); filter: brightness(2.5) drop-shadow(0 0 32px #bbb) hue-rotate(8deg); }\
    100% { transform: scale(1.12) rotate(0deg); filter: brightness(2) drop-shadow(0 0 25px #999) hue-rotate(0deg); }\
}\
@keyframes skill-picture-roar {\
    0% { transform: scale(1) rotate(0deg) translateY(0); filter: brightness(1); }\
    10% { transform: scale(1.1) rotate(-5deg) translateY(-5px); filter: brightness(2.5) drop-shadow(0 0 28px #ffaa00); }\
    22% { transform: scale(1.22) rotate(6deg) translateY(-12px); filter: brightness(4.5) drop-shadow(0 0 55px #ffcc00) drop-shadow(0 0 95px rgba(255,200,0,0.6)); }\
    36% { transform: scale(1.35) rotate(-5deg) translateY(-18px); filter: brightness(6.5) drop-shadow(0 0 85px #ffdd00) drop-shadow(0 0 140px rgba(255,220,0,0.7)); }\
    48% { transform: scale(1.42) rotate(4deg) translateY(-22px); filter: brightness(8) drop-shadow(0 0 110px #ffee00) drop-shadow(0 0 175px rgba(255,240,0,0.8)); }\
    60% { transform: scale(1.35) rotate(-3deg) translateY(-16px); filter: brightness(6); }\
    72% { transform: scale(1.2) rotate(2deg) translateY(-10px); filter: brightness(4) drop-shadow(0 0 55px #ffcc00); }\
    84% { transform: scale(1.1) rotate(-1deg) translateY(-4px); filter: brightness(2.2); }\
    100% { transform: scale(1.06) rotate(0deg) translateY(0); filter: brightness(1.6) drop-shadow(0 0 20px #ffaa00); }\
}\
@keyframes skill-picture-rhino-stomp {\
    0% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
    7% { transform: translateY(-12px) scale(1.04) rotate(-1deg); filter: brightness(1.5) drop-shadow(0 0 12px #ff4444); }\
    16% { transform: translateY(-28px) scale(1.08) rotate(-2deg); filter: brightness(2.2) drop-shadow(0 0 25px #ff3333); }\
    25% { transform: translateY(-50px) scale(1.12) rotate(-3deg); filter: brightness(3.2) drop-shadow(0 0 42px #ff2222) drop-shadow(0 0 70px rgba(255,40,40,0.5)); }\
    34% { transform: translateY(-72px) scale(1.1) rotate(-2deg); filter: brightness(4) drop-shadow(0 0 58px #ff1111); }\
    42% { transform: translateY(-85px) scale(1.06) rotate(-1deg); filter: brightness(4.5) drop-shadow(0 0 65px #ff0000); }\
    52% { transform: translateY(45px) scale(1.42) rotate(2deg); filter: brightness(7.5) drop-shadow(0 0 105px #ff0000) drop-shadow(0 0 175px rgba(255,0,0,0.85)); }\
    62% { transform: translateY(22px) scale(1.32) rotate(1deg); filter: brightness(5.5) drop-shadow(0 0 75px #ff1111); }\
    74% { transform: translateY(5px) scale(1.15) rotate(0deg); filter: brightness(3) drop-shadow(0 0 42px #ff3333); }\
    85% { transform: translateY(-4px) scale(1.06) rotate(-1deg); filter: brightness(1.8); }\
    94% { transform: translateY(2px) scale(1.02) rotate(0deg); filter: brightness(1.2); }\
    100% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
}\
@keyframes skill-picture-shuriken {\
    0% { transform: translate(0, 0) scale(1) rotate(0deg) skewX(0deg); filter: brightness(1); }\
    12% { transform: translate(calc(var(--dash-x) * 0.18), calc(var(--dash-y) * 0.18)) scale(1.06) rotate(180deg) skewX(2deg); filter: brightness(2.5) drop-shadow(0 0 20px #888); }\
    28% { transform: translate(calc(var(--dash-x) * 0.45), calc(var(--dash-y) * 0.45)) scale(1.2) rotate(720deg) skewX(3deg); filter: brightness(4.5) drop-shadow(0 0 48px #aaa) drop-shadow(0 0 85px rgba(170,170,170,0.6)); }\
    42% { transform: translate(calc(var(--dash-x) * 0.72), calc(var(--dash-y) * 0.72)) scale(1.32) rotate(1440deg) skewX(2deg); filter: brightness(6) drop-shadow(0 0 75px #ccc) drop-shadow(0 0 120px rgba(200,200,200,0.7)); }\
    58% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.22) rotate(2160deg) skewX(1deg); filter: brightness(4); }\
    72% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.1) rotate(2880deg) skewX(0deg); filter: brightness(2.5); }\
    86% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.04) rotate(3240deg); filter: brightness(1.5); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(1) rotate(3600deg) skewX(0deg); filter: brightness(1); }\
}\
@keyframes skill-picture-smoke-screen {\
    0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
    8% { transform: scale(1.04) rotate(2deg); filter: brightness(1.3); }\
    18% { transform: scale(1.12) rotate(-3deg); opacity: 0.75; filter: brightness(2.2) drop-shadow(0 0 22px #555); }\
    30% { transform: scale(1.3) rotate(4deg); opacity: 0.4; filter: brightness(3.5) drop-shadow(0 0 48px #444) drop-shadow(0 0 80px rgba(70,70,70,0.5)); }\
    42% { transform: scale(1.48) rotate(-3deg); opacity: 0.18; filter: brightness(4.5) drop-shadow(0 0 72px #333) drop-shadow(0 0 115px rgba(50,50,50,0.6)); }\
    55% { transform: scale(1.55) rotate(2deg); opacity: 0.08; filter: brightness(5) drop-shadow(0 0 90px #222) drop-shadow(0 0 140px rgba(40,40,40,0.7)); }\
    68% { transform: scale(1.38) rotate(-2deg); opacity: 0.15; filter: brightness(3.2) drop-shadow(0 0 55px #444); }\
    80% { transform: scale(1.2) rotate(1deg); opacity: 0.5; filter: brightness(2) drop-shadow(0 0 28px #555); }\
    92% { transform: scale(1.08) rotate(0deg); opacity: 0.82; filter: brightness(1.3); }\
    100% { transform: scale(1.04) rotate(0deg); opacity: 0.9; filter: brightness(1.1) drop-shadow(0 0 10px #666); }\
}\
@keyframes skill-picture-teleport {\
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; filter: brightness(1) hue-rotate(0deg); }\
    6% { transform: translate(-8px, 0) scale(0.94) rotate(4deg); filter: brightness(1.5); }\
    14% { transform: translate(15px, 0) scale(0.72) rotate(-6deg); opacity: 0.65; filter: brightness(2.8) drop-shadow(0 0 22px #8800ff) hue-rotate(20deg); }\
    22% { transform: translate(45px, 0) scale(0.45) rotate(8deg); opacity: 0.35; filter: brightness(4) drop-shadow(0 0 40px #aa00ff) drop-shadow(0 0 70px rgba(170,0,255,0.5)) hue-rotate(40deg); }\
    30% { transform: translate(75px, 0) scale(0.22) rotate(-4deg); opacity: 0.1; filter: brightness(5) drop-shadow(0 0 55px #cc00ff); }\
    38% { transform: translate(calc(var(--dash-x) * 0.85), calc(var(--dash-y) * 0.85)) scale(0.1) rotate(0deg); opacity: 0; }\
    46% { transform: translate(var(--dash-x), var(--dash-y)) scale(0.5) rotate(-22deg); opacity: 0.3; filter: brightness(3.5) drop-shadow(0 0 40px #9900ff); }\
    55% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.35) rotate(-18deg); opacity: 0.8; filter: brightness(5) drop-shadow(0 0 55px #bb00ff) drop-shadow(0 0 90px rgba(170,0,255,0.6)); }\
    68% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.15) rotate(-10deg); opacity: 1; filter: brightness(3.5) drop-shadow(0 0 35px #9900ff); }\
    80% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.05) rotate(-4deg); opacity: 1; filter: brightness(2); }\
    92% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.01) rotate(-1deg); opacity: 1; filter: brightness(1.3); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
}\
@keyframes skill-picture-blade-storm {\
    0% { transform: scale(1) rotate(0deg) skewX(0deg); filter: brightness(1); }\
    5% { transform: scale(1.06) rotate(14deg) skewX(3deg); filter: brightness(2.8) drop-shadow(0 0 20px #f00); }\
    10% { transform: scale(1.14) rotate(-18deg) skewX(-4deg); filter: brightness(4.8) drop-shadow(0 0 48px #f00) drop-shadow(0 0 85px rgba(255,0,0,0.6)); }\
    16% { transform: scale(1.22) rotate(22deg) skewX(5deg); filter: brightness(6.2) drop-shadow(0 0 72px #f00); }\
    22% { transform: scale(1.28) rotate(-26deg) skewX(-6deg); filter: brightness(7.8) drop-shadow(0 0 95px #f00) drop-shadow(0 0 150px rgba(255,0,0,0.7)); }\
    28% { transform: scale(1.34) rotate(30deg) skewX(7deg); filter: brightness(9) drop-shadow(0 0 120px #ff0000) drop-shadow(0 0 185px rgba(255,0,0,0.8)); }\
    34% { transform: scale(1.24) rotate(-20deg) skewX(-4deg); filter: brightness(5.8); }\
    42% { transform: scale(1.16) rotate(14deg) skewX(3deg); filter: brightness(4.2); }\
    50% { transform: scale(1.26) rotate(-22deg) skewX(-5deg); filter: brightness(6) drop-shadow(0 0 80px #f00); }\
    58% { transform: scale(1.18) rotate(18deg) skewX(4deg); filter: brightness(4.5); }\
    66% { transform: scale(1.12) rotate(-10deg) skewX(-2deg); filter: brightness(3.2); }\
    74% { transform: scale(1.15) rotate(6deg) skewX(2deg); filter: brightness(2.8); }\
    82% { transform: scale(1.08) rotate(-4deg) skewX(-1deg); filter: brightness(2.2); }\
    90% { transform: scale(1.1) rotate(3deg) skewX(1deg); filter: brightness(2.5); }\
    100% { transform: scale(1.08) rotate(0deg) skewX(0deg); filter: brightness(2.8) drop-shadow(0 0 32px #f00); }\
}\
@keyframes skill-picture-fireball {\
    0% { transform: translate(0, 0) scale(0.6) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: translate(calc(var(--dash-x) * 0.12), calc(var(--dash-y) * 0.12)) scale(0.85) rotate(5deg); filter: brightness(2.2) drop-shadow(0 0 15px #ff6600) hue-rotate(5deg); }\
    24% { transform: translate(calc(var(--dash-x) * 0.4), calc(var(--dash-y) * 0.4)) scale(1.15) rotate(-3deg); filter: brightness(4) drop-shadow(0 0 38px #ff8800) drop-shadow(0 0 65px rgba(255,100,0,0.5)) hue-rotate(10deg); }\
    38% { transform: translate(calc(var(--dash-x) * 0.68), calc(var(--dash-y) * 0.68)) scale(1.38) rotate(4deg); filter: brightness(5.5) drop-shadow(0 0 62px #ffaa00) drop-shadow(0 0 105px rgba(255,130,0,0.6)) hue-rotate(15deg); }\
    52% { transform: translate(calc(var(--dash-x) * 0.88), calc(var(--dash-y) * 0.88)) scale(1.52) rotate(-2deg); filter: brightness(6.5) drop-shadow(0 0 88px #ffbb00) drop-shadow(0 0 140px rgba(255,150,0,0.7)) hue-rotate(18deg); }\
    65% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.45) rotate(2deg); filter: brightness(5.2) drop-shadow(0 0 65px #ffcc00); }\
    78% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.25) rotate(-1deg); filter: brightness(3.2); }\
    90% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.06) rotate(0deg); filter: brightness(2); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(0.92) rotate(0deg); filter: brightness(1.5) drop-shadow(0 0 12px #ff6600); }\
}\
@keyframes skill-picture-accelerant {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: scale(1.04) rotate(-1deg); filter: brightness(1.6) hue-rotate(5deg); }\
    22% { transform: scale(1.14) rotate(2deg); filter: brightness(3) drop-shadow(0 0 22px #ffaa00) hue-rotate(10deg); }\
    36% { transform: scale(1.28) rotate(-3deg); filter: brightness(4.5) drop-shadow(0 0 48px #ffcc00) drop-shadow(0 0 82px rgba(255,180,0,0.5)) hue-rotate(15deg); }\
    50% { transform: scale(1.42) rotate(4deg); filter: brightness(6) drop-shadow(0 0 78px #ffdd00) drop-shadow(0 0 125px rgba(255,200,0,0.6)) hue-rotate(20deg); }\
    64% { transform: scale(1.48) rotate(-2deg); filter: brightness(7.2) drop-shadow(0 0 98px #ffee00) drop-shadow(0 0 155px rgba(255,220,0,0.7)) hue-rotate(22deg); }\
    76% { transform: scale(1.35) rotate(1deg); filter: brightness(4.8) drop-shadow(0 0 62px #ffdd00) hue-rotate(15deg); }\
    88% { transform: scale(1.15) rotate(-1deg); filter: brightness(2.8) drop-shadow(0 0 28px #ffbb00) hue-rotate(8deg); }\
    100% { transform: scale(1.08) rotate(0deg); filter: brightness(2) drop-shadow(0 0 18px #ffaa00) hue-rotate(0deg); }\
}\
@keyframes skill-picture-fire-blast {\
    0% { transform: scale(1) translateY(0) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    7% { transform: scale(1.06) translateY(-5px) rotate(-2deg); filter: brightness(1.6) drop-shadow(0 0 15px #ff4400); }\
    16% { transform: scale(1.18) translateY(-15px) rotate(3deg); filter: brightness(3) drop-shadow(0 0 38px #ff2200) drop-shadow(0 0 65px rgba(255,50,0,0.5)) hue-rotate(5deg); }\
    26% { transform: scale(1.35) translateY(-22px) rotate(-4deg); filter: brightness(4.8) drop-shadow(0 0 62px #ff1100) drop-shadow(0 0 105px rgba(255,30,0,0.6)) hue-rotate(10deg); }\
    36% { transform: scale(1.52) translateY(-12px) rotate(2deg); filter: brightness(6.2) drop-shadow(0 0 88px #ff0000) drop-shadow(0 0 140px rgba(255,15,0,0.7)) hue-rotate(15deg); }\
    46% { transform: scale(1.65) translateY(6px) rotate(-3deg); filter: brightness(7.5) drop-shadow(0 0 112px #ff0000) drop-shadow(0 0 180px rgba(255,0,0,0.8)) hue-rotate(18deg); }\
    56% { transform: scale(1.52) translateY(2px) rotate(1deg); filter: brightness(5.5) drop-shadow(0 0 78px #ff1100); }\
    68% { transform: scale(1.32) translateY(-5px) rotate(-1deg); filter: brightness(3.5) drop-shadow(0 0 48px #ff3300); }\
    80% { transform: scale(1.14) translateY(-2px) rotate(0deg); filter: brightness(2.2) drop-shadow(0 0 25px #ff5500); }\
    92% { transform: scale(1.06) translateY(0) rotate(0deg); filter: brightness(1.6) drop-shadow(0 0 12px #ff4400); }\
    100% { transform: scale(1.04) translateY(0) rotate(0deg); filter: brightness(1.4) drop-shadow(0 0 8px #ff4400); }\
}\
@keyframes skill-picture-world-on-fire {\
    0% { transform: scale(1) rotate(0deg) translateY(0); filter: brightness(1) hue-rotate(0deg); }\
    5% { transform: scale(1.04) rotate(3deg) translateY(-4px); filter: brightness(1.8) drop-shadow(0 0 15px #f00) hue-rotate(5deg); }\
    10% { transform: scale(1.08) rotate(-5deg) translateY(-8px); filter: brightness(3) drop-shadow(0 0 35px #f00) drop-shadow(0 0 60px rgba(255,0,0,0.5)); }\
    16% { transform: scale(1.14) rotate(7deg) translateY(-14px); filter: brightness(4.2) drop-shadow(0 0 58px #f00) drop-shadow(0 0 100px rgba(255,20,0,0.6)) hue-rotate(10deg); }\
    22% { transform: scale(1.2) rotate(-9deg) translateY(-20px); filter: brightness(5.5) drop-shadow(0 0 82px #ff1100) drop-shadow(0 0 130px rgba(255,15,0,0.7)); }\
    28% { transform: scale(1.26) rotate(11deg) translateY(-26px); filter: brightness(6.5) drop-shadow(0 0 105px #ff0000) drop-shadow(0 0 170px rgba(255,0,0,0.8)) hue-rotate(15deg); }\
    34% { transform: scale(1.3) rotate(-13deg) translateY(-32px); filter: brightness(7.5) drop-shadow(0 0 128px #ff0000) drop-shadow(0 0 200px rgba(255,0,0,0.85)) hue-rotate(18deg); }\
    42% { transform: scale(1.24) rotate(9deg) translateY(-26px); filter: brightness(5.5); }\
    50% { transform: scale(1.18) rotate(-5deg) translateY(-20px); filter: brightness(4.5); }\
    58% { transform: scale(1.22) rotate(7deg) translateY(-16px); filter: brightness(3.5); }\
    66% { transform: scale(1.26) rotate(-9deg) translateY(-24px); filter: brightness(5) drop-shadow(0 0 85px #ff1100) hue-rotate(12deg); }\
    74% { transform: scale(1.18) rotate(5deg) translateY(-18px); filter: brightness(4); }\
    82% { transform: scale(1.12) rotate(-3deg) translateY(-12px); filter: brightness(3); }\
    90% { transform: scale(1.06) rotate(2deg) translateY(-6px); filter: brightness(2.2); }\
    100% { transform: scale(1.08) rotate(0deg) translateY(-8px); filter: brightness(2.5) drop-shadow(0 0 42px #f00) hue-rotate(0deg); }\
}\
/* ===== 角色动作内联 @keyframes (通过 style.animation 引用) ===== */\
@keyframes pictureRhinoChargeCast {\
    0% { transform: translateX(0) scale(1) rotate(0deg); filter: brightness(1); }\
    8% { transform: translateX(calc(var(--dash-x) * -0.08)) scale(0.95) rotate(-2deg); filter: brightness(1.1) drop-shadow(0 0 6px #444); }\
    18% { transform: translateX(calc(var(--dash-x) * -0.18)) scale(0.88) rotate(-5deg); filter: brightness(1.5) drop-shadow(0 0 15px #666); }\
    28% { transform: translateX(calc(var(--dash-x) * -0.28)) scale(0.82) rotate(-7deg); filter: brightness(2.0) drop-shadow(0 0 25px #888); }\
    40% { transform: translateX(calc(var(--dash-x) * -0.40)) scale(0.76) rotate(-9deg); filter: brightness(2.8) drop-shadow(0 0 38px #999) drop-shadow(0 0 65px rgba(150,150,150,0.5)); }\
    48% { transform: translateX(calc(var(--dash-x) * -0.38)) scale(0.78) rotate(-8deg); filter: brightness(3.5) drop-shadow(0 0 48px #aaa) drop-shadow(0 0 80px rgba(170,170,170,0.6)); }\
    55% { transform: translateX(calc(var(--dash-x) * 0.15)) scale(1.05) rotate(2deg); filter: brightness(4.8) drop-shadow(0 0 60px #bbb) drop-shadow(0 0 100px rgba(190,190,190,0.7)); }\
    65% { transform: translateX(calc(var(--dash-x) * 0.50)) scale(1.22) rotate(3deg); filter: brightness(6.0) drop-shadow(0 0 80px #ccc) drop-shadow(0 0 130px rgba(210,210,210,0.85)); }\
    75% { transform: translateX(calc(var(--dash-x) * 0.80)) scale(1.35) rotate(2deg); filter: brightness(6.8) drop-shadow(0 0 95px #ddd) drop-shadow(0 0 150px rgba(220,220,220,0.9)); }\
    82% { transform: translateX(var(--dash-x)) scale(1.30) rotate(0deg); filter: brightness(7) drop-shadow(0 0 100px #eee) drop-shadow(0 0 160px rgba(230,230,230,0.95)); }\
    90% { transform: translateX(calc(var(--dash-x) * 0.97)) scale(1.12) rotate(-1deg); filter: brightness(3.8) drop-shadow(0 0 55px #aaa); }\
    96% { transform: translateX(calc(var(--dash-x) * 0.99)) scale(1.05) rotate(0deg); filter: brightness(1.8) drop-shadow(0 0 20px #888); }\
    100% { transform: translateX(var(--dash-x)) scale(1) rotate(0deg); filter: brightness(1); }\
}\
@keyframes pictureRhinoStompCast {\
    0% { transform: translateY(0) translateX(0) scale(1) rotate(0deg); }\
    10% { transform: translateY(-20px) translateX(calc(var(--dash-x) * 0.1)) scale(1.06) rotate(-2deg); filter: brightness(1.8) drop-shadow(0 0 15px #ff4444); }\
    22% { transform: translateY(-45px) translateX(calc(var(--dash-x) * 0.25)) scale(1.1) rotate(-3deg); filter: brightness(2.8) drop-shadow(0 0 32px #ff3333); }\
    34% { transform: translateY(-70px) translateX(calc(var(--dash-x) * 0.5)) scale(1.08) rotate(-2deg); filter: brightness(3.8) drop-shadow(0 0 50px #ff2222) drop-shadow(0 0 80px rgba(255,40,40,0.5)); }\
    44% { transform: translateY(-85px) translateX(calc(var(--dash-x) * 0.75)) scale(1.05) rotate(-1deg); filter: brightness(4.2) drop-shadow(0 0 60px #ff1111); }\
    54% { transform: translateY(20px) translateX(var(--dash-x)) scale(1.38) rotate(2deg); filter: brightness(6.5) drop-shadow(0 0 95px #ff0000) drop-shadow(0 0 155px rgba(255,0,0,0.8)); }\
    65% { transform: translateY(8px) translateX(var(--dash-x)) scale(1.25) rotate(1deg); filter: brightness(4.5) drop-shadow(0 0 65px #ff1111); }\
    78% { transform: translateY(-5px) translateX(var(--dash-x)) scale(1.1) rotate(-1deg); filter: brightness(2.5) drop-shadow(0 0 35px #ff3333); }\
    90% { transform: translateY(2px) translateX(var(--dash-x)) scale(1.03) rotate(0deg); filter: brightness(1.3); }\
    100% { transform: translateY(0) translateX(var(--dash-x)) scale(1) rotate(0deg); filter: brightness(1); }\
}\
@keyframes pictureShurikenCast {\
    0% { transform: translate(0, 0) scale(1) rotate(0deg); filter: brightness(1); }\
    12% { transform: translate(calc(var(--dash-x) * 0.15), calc(var(--dash-y) * 0.15)) scale(1.08) rotate(90deg); filter: brightness(2) drop-shadow(0 0 15px #888); }\
    28% { transform: translate(calc(var(--dash-x) * 0.4), calc(var(--dash-y) * 0.4)) scale(1.18) rotate(360deg); filter: brightness(3.5) drop-shadow(0 0 35px #aaa); }\
    45% { transform: translate(calc(var(--dash-x) * 0.65), calc(var(--dash-y) * 0.65)) scale(1.28) rotate(720deg); filter: brightness(5) drop-shadow(0 0 55px #bbb) drop-shadow(0 0 90px rgba(180,180,180,0.6)); }\
    60% { transform: translate(calc(var(--dash-x) * 0.85), calc(var(--dash-y) * 0.85)) scale(1.2) rotate(1080deg); filter: brightness(4); }\
    75% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.08) rotate(1440deg); filter: brightness(2.5); }\
    88% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.02) rotate(1620deg); filter: brightness(1.5); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(1) rotate(1800deg); filter: brightness(1); }\
}\
@keyframes pictureSmokeScreenCast {\
    0% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
    12% { transform: scale(1.08) rotate(3deg); opacity: 0.8; filter: brightness(1.8) drop-shadow(0 0 20px #555); }\
    28% { transform: scale(1.25) rotate(-4deg); opacity: 0.45; filter: brightness(3) drop-shadow(0 0 42px #444) drop-shadow(0 0 72px rgba(70,70,70,0.5)); }\
    42% { transform: scale(1.42) rotate(5deg); opacity: 0.2; filter: brightness(4.2) drop-shadow(0 0 65px #333) drop-shadow(0 0 105px rgba(50,50,50,0.6)); }\
    55% { transform: scale(1.52) rotate(-3deg); opacity: 0.08; filter: brightness(5) drop-shadow(0 0 85px #222) drop-shadow(0 0 130px rgba(40,40,40,0.7)); }\
    70% { transform: scale(1.4) rotate(2deg); opacity: 0.12; filter: brightness(3.5) drop-shadow(0 0 55px #444); }\
    84% { transform: scale(1.2) rotate(-1deg); opacity: 0.5; filter: brightness(2); }\
    100% { transform: scale(1.06) rotate(0deg); opacity: 0.88; filter: brightness(1.2) drop-shadow(0 0 10px #666); }\
}\
@keyframes pictureTeleportCast {\
    0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
    8% { transform: translate(-6px, 0) scale(0.95) rotate(3deg); opacity: 0.9; filter: brightness(1.6); }\
    18% { transform: translate(20px, 0) scale(0.68) rotate(-5deg); opacity: 0.5; filter: brightness(3) drop-shadow(0 0 25px #8800ff); }\
    28% { transform: translate(55px, 0) scale(0.38) rotate(6deg); opacity: 0.2; filter: brightness(4.5) drop-shadow(0 0 45px #aa00ff) drop-shadow(0 0 75px rgba(170,0,255,0.5)); }\
    38% { transform: translate(80px, 0) scale(0.15) rotate(-3deg); opacity: 0; filter: brightness(5.5) drop-shadow(0 0 60px #cc00ff); }\
    48% { transform: translate(calc(var(--dash-x) * 0.85), calc(var(--dash-y) * 0.85)) scale(0.1) rotate(0deg); opacity: 0; }\
    58% { transform: translate(var(--dash-x), var(--dash-y)) scale(0.55) rotate(-20deg); opacity: 0.35; filter: brightness(3.5) drop-shadow(0 0 38px #9900ff); }\
    70% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.3) rotate(-14deg); opacity: 0.85; filter: brightness(5) drop-shadow(0 0 52px #bb00ff) drop-shadow(0 0 88px rgba(170,0,255,0.6)); }\
    82% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.12) rotate(-6deg); opacity: 1; filter: brightness(3); }\
    92% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.02) rotate(-1deg); opacity: 1; filter: brightness(1.5); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }\
}\
@keyframes pictureBladeStormCast {\
    0% { transform: scale(1) rotate(0deg) skewX(0deg); filter: brightness(1); }\
    5% { transform: scale(1.08) rotate(16deg) skewX(3deg); filter: brightness(3) drop-shadow(0 0 22px #f00); }\
    11% { transform: scale(1.16) rotate(-20deg) skewX(-5deg); filter: brightness(5) drop-shadow(0 0 50px #f00) drop-shadow(0 0 88px rgba(255,0,0,0.6)); }\
    17% { transform: scale(1.22) rotate(24deg) skewX(6deg); filter: brightness(6.5) drop-shadow(0 0 72px #f00); }\
    23% { transform: scale(1.3) rotate(-28deg) skewX(-7deg); filter: brightness(8) drop-shadow(0 0 95px #ff0000) drop-shadow(0 0 150px rgba(255,0,0,0.7)); }\
    30% { transform: scale(1.35) rotate(32deg) skewX(8deg); filter: brightness(9) drop-shadow(0 0 118px #ff0000) drop-shadow(0 0 185px rgba(255,0,0,0.8)); }\
    37% { transform: scale(1.22) rotate(-18deg) skewX(-4deg); filter: brightness(5.8); }\
    45% { transform: scale(1.15) rotate(14deg) skewX(3deg); filter: brightness(4.2); }\
    53% { transform: scale(1.26) rotate(-22deg) skewX(-5deg); filter: brightness(6) drop-shadow(0 0 78px #f00); }\
    61% { transform: scale(1.18) rotate(18deg) skewX(4deg); filter: brightness(4.5); }\
    69% { transform: scale(1.1) rotate(-8deg) skewX(-2deg); filter: brightness(3); }\
    77% { transform: scale(1.14) rotate(6deg) skewX(2deg); filter: brightness(2.5); }\
    85% { transform: scale(1.07) rotate(-3deg) skewX(-1deg); filter: brightness(2); }\
    93% { transform: scale(1.1) rotate(2deg) skewX(1deg); filter: brightness(2.5); }\
    100% { transform: scale(1.08) rotate(0deg) skewX(0deg); filter: brightness(2.8) drop-shadow(0 0 28px #f00); }\
}\
@keyframes pictureFireballCast {\
    0% { transform: translate(0, 0) scale(0.6) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    10% { transform: translate(calc(var(--dash-x) * 0.1), calc(var(--dash-y) * 0.1)) scale(0.82) rotate(5deg); filter: brightness(2) drop-shadow(0 0 12px #ff6600) hue-rotate(5deg); }\
    22% { transform: translate(calc(var(--dash-x) * 0.35), calc(var(--dash-y) * 0.35)) scale(1.12) rotate(-3deg); filter: brightness(3.8) drop-shadow(0 0 35px #ff8800) drop-shadow(0 0 60px rgba(255,100,0,0.5)) hue-rotate(10deg); }\
    38% { transform: translate(calc(var(--dash-x) * 0.62), calc(var(--dash-y) * 0.62)) scale(1.35) rotate(4deg); filter: brightness(5.2) drop-shadow(0 0 58px #ffaa00) drop-shadow(0 0 95px rgba(255,130,0,0.6)) hue-rotate(15deg); }\
    52% { transform: translate(calc(var(--dash-x) * 0.85), calc(var(--dash-y) * 0.85)) scale(1.48) rotate(-2deg); filter: brightness(6.2) drop-shadow(0 0 78px #ffbb00) drop-shadow(0 0 125px rgba(255,150,0,0.7)) hue-rotate(18deg); }\
    65% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.42) rotate(2deg); filter: brightness(5.2) drop-shadow(0 0 65px #ffcc00); }\
    78% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.22) rotate(-1deg); filter: brightness(3.2); }\
    90% { transform: translate(var(--dash-x), var(--dash-y)) scale(1.04) rotate(0deg); filter: brightness(1.8); }\
    100% { transform: translate(var(--dash-x), var(--dash-y)) scale(0.92) rotate(0deg); filter: brightness(1.4) drop-shadow(0 0 10px #ff6600); }\
}\
@keyframes pictureFireBlastCast {\
    0% { transform: scale(1) translateY(0) rotate(0deg); filter: brightness(1) hue-rotate(0deg); }\
    7% { transform: scale(1.08) translateY(-6px) rotate(-2deg); filter: brightness(1.8) drop-shadow(0 0 18px #ff4400); }\
    16% { transform: scale(1.22) translateY(-16px) rotate(3deg); filter: brightness(3.2) drop-shadow(0 0 40px #ff2200) drop-shadow(0 0 68px rgba(255,50,0,0.5)) hue-rotate(5deg); }\
    28% { transform: scale(1.4) translateY(-24px) rotate(-4deg); filter: brightness(5) drop-shadow(0 0 68px #ff1100) drop-shadow(0 0 110px rgba(255,30,0,0.6)) hue-rotate(10deg); }\
    38% { transform: scale(1.58) translateY(-12px) rotate(2deg); filter: brightness(6.2) drop-shadow(0 0 92px #ff0000) drop-shadow(0 0 145px rgba(255,15,0,0.7)) hue-rotate(15deg); }\
    48% { transform: scale(1.68) translateY(8px) rotate(-3deg); filter: brightness(7.5) drop-shadow(0 0 115px #ff0000) drop-shadow(0 0 180px rgba(255,0,0,0.8)) hue-rotate(18deg); }\
    58% { transform: scale(1.52) translateY(2px) rotate(1deg); filter: brightness(5.5) drop-shadow(0 0 78px #ff1100); }\
    70% { transform: scale(1.32) translateY(-5px) rotate(-1deg); filter: brightness(3.5) drop-shadow(0 0 48px #ff3300); }\
    82% { transform: scale(1.14) translateY(-2px) rotate(0deg); filter: brightness(2.2) drop-shadow(0 0 25px #ff5500); }\
    92% { transform: scale(1.06) translateY(0) rotate(0deg); filter: brightness(1.6) drop-shadow(0 0 12px #ff4400); }\
    100% { transform: scale(1.04) translateY(0) rotate(0deg); filter: brightness(1.4) drop-shadow(0 0 8px #ff4400); }\
}\
@keyframes pictureWorldOnFireCast {\
    0% { transform: scale(1) rotate(0deg) translateY(0); filter: brightness(1) hue-rotate(0deg); }\
    5% { transform: scale(1.05) rotate(4deg) translateY(-5px); filter: brightness(2) drop-shadow(0 0 18px #f00) hue-rotate(5deg); }\
    11% { transform: scale(1.1) rotate(-6deg) translateY(-10px); filter: brightness(3.5) drop-shadow(0 0 38px #f00) drop-shadow(0 0 65px rgba(255,0,0,0.5)); }\
    18% { transform: scale(1.18) rotate(8deg) translateY(-16px); filter: brightness(5) drop-shadow(0 0 60px #ff2200) drop-shadow(0 0 100px rgba(255,30,0,0.6)) hue-rotate(10deg); }\
    25% { transform: scale(1.25) rotate(-10deg) translateY(-22px); filter: brightness(6.2) drop-shadow(0 0 85px #ff1100) drop-shadow(0 0 135px rgba(255,15,0,0.7)); }\
    32% { transform: scale(1.3) rotate(12deg) translateY(-28px); filter: brightness(7.2) drop-shadow(0 0 108px #ff0000) drop-shadow(0 0 170px rgba(255,0,0,0.8)) hue-rotate(15deg); }\
    40% { transform: scale(1.28) rotate(-9deg) translateY(-25px); filter: brightness(5.8); }\
    50% { transform: scale(1.22) rotate(6deg) translateY(-20px); filter: brightness(4.5); }\
    60% { transform: scale(1.26) rotate(-10deg) translateY(-24px); filter: brightness(5.5) drop-shadow(0 0 88px #ff1100) hue-rotate(12deg); }\
    70% { transform: scale(1.2) rotate(7deg) translateY(-18px); filter: brightness(4.2); }\
    80% { transform: scale(1.12) rotate(-4deg) translateY(-12px); filter: brightness(3); }\
    90% { transform: scale(1.06) rotate(2deg) translateY(-6px); filter: brightness(2.2); }\
    100% { transform: scale(1.08) rotate(0deg) translateY(-8px); filter: brightness(2.5) drop-shadow(0 0 38px #f00) hue-rotate(0deg); }\
}\
\
/* ===== Rhino / Ash / Ember VFX 增强 ===== */\
.skill-vfx-rhino-charge-trail { width: 240px; height: 42px; margin-left: -120px; margin-top: -21px; border-radius: 999px; background: repeating-linear-gradient(90deg, transparent 0 5px, rgba(220,220,220,0.95) 5px 12px, rgba(180,180,180,0.75) 12px 18px, transparent 18px 26px); filter: blur(1px) drop-shadow(0 0 30px rgba(200,200,200,0.95)) drop-shadow(0 0 60px rgba(180,180,180,0.5)); animation-name: vfxRhinoChargeTrail !important; }\
@keyframes vfxRhinoChargeTrail { 0% { opacity: 0; transform: translate(0, 0) scaleX(0.1) rotate(0deg); } 15% { opacity: 0.95; transform: translate(calc(var(--trail-progress) * 50px), 0) scaleX(0.6) rotate(-2deg); } 50% { opacity: 1; transform: translate(calc(var(--trail-progress) * 120px), 0) scaleX(1.2) rotate(1deg); } 100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scaleX(1.8) rotate(0deg); } }\
.skill-vfx-rhino-charge-crack { width: 120px !important; height: 16px !important; margin-left: -60px !important; margin-top: -8px !important; border-radius: 50% !important; background: radial-gradient(ellipse, rgba(120,80,40,0.9), rgba(80,50,20,0.5) 40%, transparent 70%) !important; filter: blur(1px) drop-shadow(0 0 8px rgba(100,60,20,0.8)) !important; }\
@keyframes vfxRhinoChargeCrack { 0% { opacity: 0; transform: scaleX(0.3) scaleY(0.5); } 25% { opacity: 1; transform: scaleX(1.5) scaleY(2); } 60% { opacity: 0.8; transform: scaleX(2.5) scaleY(1.5); } 100% { opacity: 0; transform: scaleX(3.5) scaleY(1); } }\
.skill-vfx-rhino-impact { width: 90px !important; height: 90px !important; margin-left: -45px !important; margin-top: -45px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff 0%, #eee 15%, #bbb 30%, #888 50%, transparent 72%) !important; box-shadow: 0 0 45px #bbb, 0 0 90px rgba(187,187,187,0.6), 0 0 140px rgba(150,150,150,0.3) !important; animation-name: vfxRhinoImpact !important; }\
@keyframes vfxRhinoImpact { 0% { opacity: 1; transform: scale(0.15); filter: brightness(3); } 25% { opacity: 1; transform: scale(1.2); filter: brightness(5) drop-shadow(0 0 40px #fff); } 50% { opacity: 0.8; transform: scale(2); } 100% { opacity: 0; transform: scale(4.5); } }\
.skill-vfx-iron-skin-dome { width: 110px !important; height: 110px !important; margin-left: -55px !important; margin-top: -55px !important; border-radius: 50% !important; border: 5px solid rgba(210,210,220,0.95); background: radial-gradient(circle, rgba(230,230,240,0.35), rgba(180,180,200,0.18) 45%, rgba(150,150,170,0.08) 65%, transparent 75%) !important; box-shadow: 0 0 45px rgba(200,200,220,0.95), 0 0 90px rgba(180,180,200,0.5), inset 0 0 35px rgba(255,255,255,0.4) !important; animation-name: vfxIronSkinDome !important; }\
@keyframes vfxIronSkinDome { 0% { opacity: 0; transform: scale(0.25) rotate(0deg); } 20% { opacity: 0.8; transform: scale(1.2) rotate(30deg); } 40% { opacity: 1; transform: scale(1.6) rotate(60deg); } 65% { opacity: 0.95; transform: scale(1.3) rotate(120deg); } 100% { opacity: 0; transform: scale(2.5) rotate(180deg); } }\
.skill-vfx-iron-skin-spark { width: 16px !important; height: 16px !important; margin-left: -8px !important; margin-top: -8px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ddd 35%, transparent 70%) !important; box-shadow: 0 0 15px #fff, 0 0 30px rgba(220,220,240,0.8) !important; }\
@keyframes vfxIronSkinSpark { 0% { opacity: 0; transform: translate(0, 0) scale(0.5); } 20% { opacity: 1; transform: scale(1.5); } 60% { opacity: 0.6; transform: scale(0.8); } 100% { opacity: 0; transform: scale(0.3); } }\
.skill-vfx-iron-skin-arc { width: 50px !important; height: 4px !important; margin-left: -25px !important; margin-top: -2px !important; border-radius: 999px !important; background: linear-gradient(90deg, transparent, rgba(180,200,255,0.9), rgba(220,230,255,0.95), transparent) !important; box-shadow: 0 0 15px rgba(180,200,255,0.9), 0 0 30px rgba(150,170,255,0.5) !important; transform-origin: center; }\
@keyframes vfxIronSkinArc { 0% { opacity: 0; transform: rotate(var(--arc-angle)) scaleX(0.3); } 15% { opacity: 1; transform: rotate(var(--arc-angle)) scaleX(1.5); } 40% { opacity: 0.8; transform: rotate(calc(var(--arc-angle) + 15deg)) scaleX(1.2); } 100% { opacity: 0; transform: rotate(calc(var(--arc-angle) + 30deg)) scaleX(0.5); } }\
.skill-vfx-roar-wave { width: 150px !important; height: 150px !important; margin-left: -75px !important; margin-top: -75px !important; border-radius: 50% !important; border: 6px solid rgba(255, 200, 60, 0.95); background: radial-gradient(circle, rgba(255,220,100,0.28), rgba(255,180,50,0.12) 45%, transparent 68%) !important; box-shadow: 0 0 55px rgba(255,190,60,0.95), 0 0 110px rgba(255,170,40,0.5), inset 0 0 40px rgba(255,240,150,0.35) !important; animation-name: vfxRoarWave !important; }\
.skill-vfx-roar-wave-2 { width: 115px !important; height: 115px !important; margin-left: -57px !important; margin-top: -57px !important; border-width: 4px !important; opacity: 0.75; }\
.skill-vfx-roar-wave-3 { width: 80px !important; height: 80px !important; margin-left: -40px !important; margin-top: -40px !important; border-width: 2px !important; opacity: 0.55; }\
@keyframes vfxRoarWave { 0% { opacity: 0; transform: scale(0.2) rotate(0deg); } 20% { opacity: 1; transform: scale(0.8) rotate(15deg); } 100% { opacity: 0; transform: scale(6) rotate(60deg); } }\
.skill-vfx-roar-particle { width: 10px !important; height: 10px !important; margin-left: -5px !important; margin-top: -5px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffcc00 40%, transparent 72%) !important; box-shadow: 0 0 12px #ffdd00, 0 0 25px rgba(255,200,0,0.6) !important; }\
@keyframes vfxRoarParticle { 0% { opacity: 0; transform: translate(0, 0) scale(0.3); } 20% { opacity: 1; transform: translate(30px, 0) scale(1.2); } 100% { opacity: 0; transform: translate(120px, 0) scale(0.5); } }\
.skill-vfx-roar-shatter { width: 130px !important; height: 130px !important; margin-left: -65px !important; margin-top: -65px !important; border-radius: 50% !important; border: 3px dashed rgba(255, 200, 80, 0.85); background: radial-gradient(circle, rgba(255,220,100,0.15), transparent 65%) !important; box-shadow: 0 0 35px rgba(255,200,80,0.7) !important; animation-name: vfxRoarShatter !important; }\
@keyframes vfxRoarShatter { 0% { opacity: 0; transform: scale(0.3) rotate(0deg); } 30% { opacity: 1; transform: scale(1.5) rotate(45deg); } 70% { opacity: 0.6; transform: scale(2.5) rotate(90deg); } 100% { opacity: 0; transform: scale(3.5) rotate(135deg); } }\
.skill-vfx-stomp-shockwave { width: 80px !important; height: 32px !important; margin-left: -40px !important; margin-top: -16px !important; border-radius: 50% !important; border: 6px solid #ff4444; background: radial-gradient(ellipse, rgba(255,68,68,0.7), rgba(255,30,30,0.3) 45%, transparent 72%) !important; box-shadow: 0 0 40px #ff2222, 0 0 80px rgba(255,50,50,0.6), 0 0 120px rgba(255,30,30,0.3) !important; animation-name: vfxStompShockwave !important; }\
@keyframes vfxStompShockwave { 0% { opacity: 0; transform: scale(0.2); } 25% { opacity: 1; transform: scale(2); } 100% { opacity: 0; transform: scaleX(8) scaleY(4); } }\
.skill-vfx-stomp-crater { width: 100px !important; height: 42px !important; margin-left: -50px !important; margin-top: -21px !important; border-radius: 50% !important; background: radial-gradient(ellipse, rgba(255,80,40,0.6), rgba(180,60,30,0.3) 45%, transparent 72%) !important; filter: blur(2px) drop-shadow(0 0 10px rgba(255,60,20,0.8)) !important; animation-name: vfxStompCrater !important; }\
@keyframes vfxStompCrater { 0% { opacity: 0; transform: scale(0.35); } 30% { opacity: 1; transform: scale(1.4); } 100% { opacity: 0; transform: scale(3); } }\
.skill-vfx-rhino-stomp-dust { width: 140px !important; height: 30px !important; margin-left: -70px !important; margin-top: -15px !important; border-radius: 50% !important; background: radial-gradient(ellipse, rgba(180,160,140,0.7), rgba(140,120,100,0.35) 45%, transparent 72%) !important; filter: blur(3px) drop-shadow(0 0 8px rgba(160,140,120,0.6)) !important; animation-name: vfxStompDust !important; }\
@keyframes vfxStompDust { 0% { opacity: 0; transform: scaleX(0.4) scaleY(0.6); } 25% { opacity: 0.9; transform: scaleX(1.3) scaleY(2); } 100% { opacity: 0; transform: scaleX(2.5) scaleY(1.5); } }\
.skill-vfx-rhino-stomp-ghost { width: 65px; height: 65px; margin-left: -32px; margin-top: -32px; border-radius: 50%; background: radial-gradient(circle, rgba(200,200,210,0.5), rgba(160,160,180,0.25) 45%, transparent 72%); box-shadow: 0 0 25px rgba(180,180,200,0.7); }\
@keyframes vfxStompGhost { 0% { opacity: 0.7; transform: scale(0.6); } 30% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 0; transform: scale(0.3); } }\
.skill-vfx-rhino-stomp-debris { width: 80px !important; height: 80px !important; margin-left: -40px !important; margin-top: -40px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(120,100,80,0.7) 10%, rgba(80,60,40,0.4) 30%, transparent 55%) !important; filter: blur(2px) drop-shadow(0 0 15px rgba(100,70,40,0.8)) !important; animation-name: vfxStompDebris !important; }\
@keyframes vfxStompDebris { 0% { opacity: 0; transform: scale(0.3); } 25% { opacity: 1; transform: scale(1.5); } 60% { opacity: 0.7; transform: scale(2.2); } 100% { opacity: 0; transform: scale(3.5); } }\
\
.skill-vfx-shuriken-hit { width: 65px !important; height: 65px !important; margin-left: -32px !important; margin-top: -32px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff 0%, #ccc 20%, #999 40%, transparent 65%) !important; box-shadow: 0 0 35px #bbb, 0 0 70px rgba(187,187,187,0.5) !important; animation-name: vfxShurikenHit !important; }\
@keyframes vfxShurikenHit { 0% { opacity: 1; transform: scale(0.12) rotate(0deg); } 30% { opacity: 1; transform: scale(1.3) rotate(120deg); filter: brightness(4); } 60% { opacity: 0.6; transform: scale(2) rotate(240deg); } 100% { opacity: 0; transform: scale(3.2) rotate(360deg); } }\
.skill-vfx-shuriken-pin { width: 30px !important; height: 30px !important; margin-left: -15px !important; margin-top: -15px !important; border-radius: 50% !important; border: 3px solid rgba(200,200,210,0.9); background: radial-gradient(circle, rgba(255,255,255,0.3), transparent 65%) !important; box-shadow: 0 0 15px rgba(200,200,210,0.8) !important; animation-name: vfxShurikenPin !important; }\
@keyframes vfxShurikenPin { 0% { opacity: 1; transform: scale(0.5) rotate(0deg); } 30% { opacity: 1; transform: scale(1.5) rotate(90deg); } 70% { opacity: 0.6; transform: scale(1.2) rotate(180deg); } 100% { opacity: 0; transform: scale(0.8) rotate(270deg); } }\
.skill-vfx-smoke-bomb { width: 60px !important; height: 60px !important; margin-left: -30px !important; margin-top: -30px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(120,120,120,0.95), rgba(70,70,70,0.75) 32%, rgba(40,40,40,0.3) 58%, transparent 72%) !important; box-shadow: 0 0 45px rgba(80,80,80,0.95), 0 0 90px rgba(50,50,50,0.6), 0 0 135px rgba(30,30,30,0.3) !important; animation-name: vfxSmokeBomb !important; }\
@keyframes vfxSmokeBomb { 0% { opacity: 0; transform: scale(0.15); } 18% { opacity: 1; transform: scale(2.2); } 45% { opacity: 0.85; transform: scale(3.8); } 70% { opacity: 0.5; transform: scale(5.2); } 100% { opacity: 0; transform: scale(7); } }\
.skill-vfx-smoke-particle { width: 22px !important; height: 22px !important; margin-left: -11px !important; margin-top: -11px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(150,150,150,0.85), rgba(100,100,100,0.4) 45%, transparent 72%) !important; filter: blur(3px) drop-shadow(0 0 5px rgba(120,120,120,0.5)) !important; animation-name: smokeParticle !important; }\
@keyframes smokeParticle { 0% { opacity: 0; transform: translate(0, 0) scale(0.3); } 20% { opacity: 0.9; transform: translate(calc(var(--smoke-x) * 0.3), calc(var(--smoke-y) * 0.3)) scale(0.8); } 100% { opacity: 0; transform: translate(var(--smoke-x), calc(var(--smoke-y) - 55px)) scale(3.5); } }\
.skill-vfx-smoke-afterimage { width: 75px !important; height: 75px !important; margin-left: -37px !important; margin-top: -37px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(100,100,120,0.4), rgba(80,80,100,0.2) 45%, transparent 72%) !important; box-shadow: 0 0 30px rgba(100,100,120,0.6) !important; animation-name: vfxSmokeAfterimage !important; }\
@keyframes vfxSmokeAfterimage { 0% { opacity: 0.8; transform: scale(1) rotate(0deg); } 40% { opacity: 0.5; transform: scale(1.3) rotate(45deg); } 100% { opacity: 0; transform: scale(0.5) rotate(90deg); } }\
.skill-vfx-teleport-afterimage { width: 80px !important; height: 80px !important; margin-left: -40px !important; margin-top: -40px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(150,0,255,0.5), rgba(100,0,200,0.3) 40%, rgba(60,0,150,0.12) 65%, transparent 78%) !important; box-shadow: 0 0 40px rgba(140,0,255,0.9), 0 0 80px rgba(120,0,255,0.5) !important; animation-name: vfxTeleportAfterimage !important; }\
@keyframes vfxTeleportAfterimage { 0% { opacity: 0; transform: scale(0.3) rotate(0deg); } 25% { opacity: 0.95; transform: scale(1.3) rotate(60deg); } 55% { opacity: 0.5; transform: scale(1.1) rotate(120deg); } 100% { opacity: 0; transform: scale(0.4) rotate(180deg); } }\
.skill-vfx-teleport-path { width: 8px !important; height: 8px !important; margin-left: -4px !important; margin-top: -4px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(180,0,255,0.9), rgba(140,0,255,0.5) 45%, transparent 72%) !important; box-shadow: 0 0 20px rgba(160,0,255,0.9), 0 0 45px rgba(140,0,255,0.5) !important; animation-name: vfxTeleportPath !important; }\
@keyframes vfxTeleportPath { 0% { opacity: 0; transform: scale(0.5); } 20% { opacity: 1; transform: translate(calc(var(--vfx-x) * 0.3), calc(var(--vfx-y) * 0.3)) scale(1.5); } 50% { opacity: 0.8; transform: translate(calc(var(--vfx-x) * 0.6), calc(var(--vfx-y) * 0.6)) scale(1); } 100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(0.5); } }\
.skill-vfx-teleport-slash { width: 130px !important; height: 55px !important; margin-left: -26px !important; margin-top: -27px !important; border-radius: 50% !important; border-top: 6px solid rgba(255, 30, 80, 0.95); border-right: 4px solid rgba(200, 0, 255, 0.85); border-bottom: 2px solid rgba(150, 0, 200, 0.5); filter: drop-shadow(0 0 28px #ff0055) drop-shadow(0 0 55px rgba(255,0,80,0.6)) drop-shadow(0 0 85px rgba(180,0,255,0.3)) !important; animation-name: vfxTeleportSlash !important; }\
@keyframes vfxTeleportSlash { 0% { opacity: 0; transform: scale(0.25) rotate(-30deg); } 20% { opacity: 1; transform: scale(1.3) rotate(8deg); filter: brightness(3); } 60% { opacity: 0.6; transform: scale(1.8) rotate(25deg); } 100% { opacity: 0; transform: scale(2.8) rotate(50deg); } }\
.skill-vfx-teleport-mark { width: 55px !important; height: 55px !important; margin-left: -27px !important; margin-top: -27px !important; border-radius: 50% !important; border: 3px dashed rgba(255, 80, 80, 0.88); box-shadow: 0 0 28px rgba(255,60,60,0.88), 0 0 55px rgba(255,40,40,0.4), inset 0 0 22px rgba(255,80,80,0.25) !important; animation-name: vfxTeleportMark !important; }\
@keyframes vfxTeleportMark { 0% { opacity: 0; transform: scale(1.8) rotate(0deg); } 25% { opacity: 1; transform: scale(1) rotate(90deg); } 65% { opacity: 0.85; transform: scale(1.1) rotate(180deg); } 100% { opacity: 0; transform: scale(0.6) rotate(270deg); } }\
.skill-vfx-blade-storm-teleport { width: 60px !important; height: 60px !important; margin-left: -30px !important; margin-top: -30px !important; border-radius: 50% !important; border: 2px dashed rgba(255, 0, 0, 0.88); background: radial-gradient(circle, rgba(255,0,0,0.35), rgba(200,0,0,0.15) 45%, transparent 72%) !important; box-shadow: 0 0 28px rgba(255,0,0,0.88), 0 0 55px rgba(255,0,0,0.4) !important; animation-name: vfxBladeStormTeleport !important; }\
@keyframes vfxBladeStormTeleport { 0% { opacity: 0; transform: scale(0.25) rotate(0deg); } 25% { opacity: 1; transform: scale(1.4) rotate(180deg); } 55% { opacity: 0.6; transform: scale(1.1) rotate(270deg); } 100% { opacity: 0; transform: scale(0.4) rotate(360deg); } }\
.skill-vfx-blade-storm-slash { width: 140px !important; height: 60px !important; margin-left: -26px !important; margin-top: -30px !important; border-radius: 50% !important; border-top: 6px solid rgba(255, 20, 20, 0.95); border-right: 3px solid rgba(255, 150, 150, 0.85); filter: drop-shadow(0 0 28px #ff0000) drop-shadow(0 0 55px rgba(255,0,0,0.7)) !important; animation-name: bladeStormSlash !important; }\
@keyframes bladeStormSlash { 0% { opacity: 0; transform: scale(0.25) rotate(-35deg); } 22% { opacity: 1; transform: scale(1.15) rotate(12deg); } 100% { opacity: 0; transform: scale(2.2) rotate(55deg); } }\
.skill-vfx-blade-storm-finisher { width: 85px !important; height: 85px !important; margin-left: -42px !important; margin-top: -42px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ff2222 25%, #880000 50%, transparent 72%) !important; box-shadow: 0 0 50px #ff0000, 0 0 100px rgba(255,0,0,0.6), 0 0 150px rgba(255,0,0,0.3) !important; animation-name: bladeStormFinisher !important; }\
@keyframes bladeStormFinisher { 0% { opacity: 1; transform: scale(0.15); filter: brightness(3); } 35% { opacity: 1; transform: scale(2.2); filter: brightness(5); } 100% { opacity: 0; transform: scale(5); } }\
\
.skill-vfx-fireball-charge { width: 60px !important; height: 60px !important; margin-left: -30px !important; margin-top: -30px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff8d0, #ff8800 32%, #ff4400 62%, transparent 76%) !important; box-shadow: 0 0 35px #ff6600, 0 0 70px rgba(255,100,0,0.65), 0 0 110px rgba(255,80,0,0.3) !important; animation-name: fireballCharge !important; }\
@keyframes fireballCharge { 0% { opacity: 0.7; transform: scale(0.65); } 50% { opacity: 1; transform: scale(1.4); filter: brightness(3); } 100% { opacity: 0.9; transform: scale(1.15); } }\
.skill-vfx-fireball-trail { width: 210px !important; height: 35px !important; margin-left: -105px !important; margin-top: -17px !important; border-radius: 999px !important; background: repeating-linear-gradient(90deg, transparent 0 5px, rgba(255,130,0,0.95) 5px 12px, rgba(255,220,100,0.75) 12px 20px, transparent 20px 28px) !important; filter: blur(1px) drop-shadow(0 0 28px #ff6600) drop-shadow(0 0 55px rgba(255,80,0,0.4)) !important; animation-name: fireballTrail !important; }\
@keyframes fireballTrail { 0% { opacity: 0; transform: translateX(-45px) scaleX(0.25); } 28% { opacity: 0.95; } 100% { opacity: 0; transform: translateX(85px) scaleX(1.4); } }\
.skill-vfx-fireball-impact { width: 90px !important; height: 90px !important; margin-left: -45px !important; margin-top: -45px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffbb22 20%, #ff4400 45%, transparent 70%) !important; box-shadow: 0 0 45px #ff6622, 0 0 90px rgba(255,80,0,0.6), 0 0 140px rgba(255,60,0,0.3) !important; animation-name: fireballImpact !important; }\
@keyframes fireballImpact { 0% { opacity: 1; transform: scale(0.25); filter: brightness(4); } 35% { opacity: 1; transform: scale(1.8); filter: brightness(6); } 100% { opacity: 0; transform: scale(4); } }\
.skill-vfx-fireball-ground-fire { width: 70px !important; height: 26px !important; margin-left: -35px !important; margin-top: -13px !important; border-radius: 50% !important; background: radial-gradient(ellipse, rgba(255,100,0,0.85), rgba(255,50,0,0.45) 48%, transparent 72%) !important; filter: blur(3px) drop-shadow(0 0 18px #ff4400) drop-shadow(0 0 35px rgba(255,60,0,0.4)) !important; animation-name: groundFire !important; }\
@keyframes groundFire { 0% { opacity: 0; transform: scale(0.5); } 25% { opacity: 0.9; transform: scale(1.3); filter: brightness(2); } 100% { opacity: 0; transform: scale(2.2); } }\
.skill-vfx-accelerant-ring { width: 115px !important; height: 115px !important; margin-left: -57px !important; margin-top: -57px !important; border-radius: 50% !important; border: 4px solid rgba(255, 170, 0, 0.95); background: radial-gradient(circle, rgba(255,120,0,0.3), transparent 65%) !important; box-shadow: 0 0 45px rgba(255,150,0,0.95), 0 0 90px rgba(255,130,0,0.5), inset 0 0 28px rgba(255,200,80,0.35) !important; animation-name: accelerantRing !important; }\
.skill-vfx-accelerant-ring-2 { width: 85px !important; height: 85px !important; margin-left: -42px !important; margin-top: -42px !important; border-width: 2px !important; opacity: 0.75; }\
@keyframes accelerantRing { 0% { opacity: 0; transform: scale(0.3) rotate(0deg); } 25% { opacity: 1; transform: scale(1.2) rotate(45deg); } 100% { opacity: 0; transform: scale(5.5) rotate(180deg); } }\
.skill-vfx-accelerant-particle { width: 12px !important; height: 12px !important; margin-left: -6px !important; margin-top: -6px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffcc00 40%, transparent 72%) !important; box-shadow: 0 0 15px #ffdd00, 0 0 30px rgba(255,200,0,0.6) !important; }\
@keyframes vfxAccelParticle { 0% { opacity: 0; transform: translate(0, 0) scale(0.3); } 20% { opacity: 1; transform: translate(var(--accel-particle-x), -30px) scale(1.2); } 100% { opacity: 0; transform: translate(var(--accel-particle-x), -80px) scale(0.5); } }\
.skill-vfx-accelerant-heatwave { width: 130px !important; height: 130px !important; margin-left: -65px !important; margin-top: -65px !important; border-radius: 50% !important; border: 2px solid rgba(255, 150, 50, 0.4); background: radial-gradient(circle, rgba(255,120,0,0.12), transparent 65%) !important; filter: blur(4px) drop-shadow(0 0 20px rgba(255,100,0,0.5)) !important; animation-name: vfxAccelHeatwave !important; }\
@keyframes vfxAccelHeatwave { 0% { opacity: 0; transform: scale(0.5) skewX(0deg); } 25% { opacity: 0.7; transform: scale(1.5) skewX(5deg); } 50% { opacity: 0.5; transform: scale(2) skewX(-5deg); } 100% { opacity: 0; transform: scale(3) skewX(0deg); } }\
.skill-vfx-fire-blast-shockwave { width: 95px !important; height: 95px !important; margin-left: -47px !important; margin-top: -47px !important; border-radius: 50% !important; border: 6px solid rgba(255, 50, 0, 0.95); background: radial-gradient(circle, rgba(255,80,0,0.45), transparent 68%) !important; box-shadow: 0 0 55px #ff2200, 0 0 110px rgba(255,40,0,0.55), 0 0 160px rgba(255,30,0,0.3) !important; animation-name: fireBlastShockwave !important; }\
@keyframes fireBlastShockwave { 0% { opacity: 0; transform: scale(0.2) rotate(0deg); } 28% { opacity: 1; transform: scale(1.5) rotate(45deg); } 100% { opacity: 0; transform: scale(5) rotate(180deg); } }\
.skill-vfx-fire-blast-cracks { width: 145px !important; height: 145px !important; margin-left: -72px !important; margin-top: -72px !important; border-radius: 50% !important; background: radial-gradient(circle, transparent 28%, rgba(255,60,0,0.65) 30%, transparent 32%, rgba(255,90,0,0.5) 46%, transparent 50%, rgba(255,40,0,0.4) 66%, transparent 70%) !important; animation-name: fireBlastCracks !important; }\
@keyframes fireBlastCracks { 0% { opacity: 0; transform: scale(0.35) rotate(0deg); } 32% { opacity: 1; transform: scale(1.3) rotate(30deg); } 100% { opacity: 0; transform: scale(2.8) rotate(60deg); } }\
.skill-vfx-fire-blast-flame { width: 185px !important; height: 85px !important; margin-left: -6px !important; margin-top: -42px !important; border-radius: 999px !important; background: radial-gradient(ellipse at left, #fff4c0, #ff7a22 32%, rgba(255,50,0,0.65) 55%, transparent 76%) !important; filter: blur(2px) drop-shadow(0 0 25px #ff6622) drop-shadow(0 0 50px rgba(255,80,0,0.4)) !important; transform-origin: left center; animation-name: fireBlastFlame !important; }\
@keyframes fireBlastFlame { 0% { opacity: 0; transform: rotate(var(--vfx-angle)) scaleX(0.12); } 25% { opacity: 0.95; } 100% { opacity: 0; transform: rotate(var(--vfx-angle)) scaleX(1.4); } }\
.skill-vfx-fire-blast-charge { width: 70px !important; height: 70px !important; margin-left: -35px !important; margin-top: -35px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ff8800 30%, #ff4400 55%, transparent 72%) !important; box-shadow: 0 0 40px #ff6600, 0 0 80px rgba(255,100,0,0.6) !important; animation-name: vfxFireBlastCharge !important; }\
@keyframes vfxFireBlastCharge { 0% { opacity: 0; transform: scale(0.3); } 30% { opacity: 1; transform: scale(1.2); filter: brightness(4); } 100% { opacity: 0; transform: scale(1.8); } }\
.skill-vfx-fire-blast-flame-pillar { width: 35px !important; height: 110px !important; margin-left: -17px !important; margin-top: -55px !important; border-radius: 999px !important; background: linear-gradient(180deg, transparent, #ff4400, #ffaa00, #fff8c8) !important; filter: blur(2px) drop-shadow(0 0 25px #ff6622) drop-shadow(0 0 50px rgba(255,80,0,0.4)) !important; animation-name: vfxFireBlastPillar !important; }\
@keyframes vfxFireBlastPillar { 0% { opacity: 0; transform: scaleY(0.15) scaleX(0.6); } 25% { opacity: 1; transform: scaleY(1.2) scaleX(1); filter: brightness(3); } 65% { opacity: 0.85; transform: scaleY(1.4) scaleX(0.9); } 100% { opacity: 0; transform: scaleY(1.8) scaleX(0.5); } }\
.skill-vfx-world-on-fire-aura { width: 105px !important; height: 105px !important; margin-left: -52px !important; margin-top: -52px !important; border-radius: 50% !important; border: 4px solid rgba(255, 40, 0, 0.92); background: radial-gradient(circle, rgba(255,80,0,0.42), rgba(255,40,0,0.22) 42%, transparent 70%) !important; box-shadow: 0 0 45px rgba(255,60,0,0.95), 0 0 90px rgba(255,40,0,0.5), inset 0 0 32px rgba(255,150,0,0.35) !important; animation-name: worldOnFireAura !important; }\
@keyframes worldOnFireAura { 0% { opacity: 0.6; transform: scale(0.85) rotate(0deg); } 50% { opacity: 1; transform: scale(1.4) rotate(180deg); } 100% { opacity: 0.6; transform: scale(0.85) rotate(360deg); } }\
.skill-vfx-world-on-fire-pillar { width: 42px !important; height: 105px !important; margin-left: -21px !important; margin-top: -52px !important; border-radius: 999px !important; background: linear-gradient(180deg, transparent, #ff4400, #ffaa00, #fff8c8) !important; filter: blur(2px) drop-shadow(0 0 25px #ff6622) drop-shadow(0 0 50px rgba(255,80,0,0.4)) !important; animation-name: worldOnFirePillar !important; }\
@keyframes worldOnFirePillar { 0% { opacity: 0; transform: scaleY(0.15); } 28% { opacity: 1; transform: scaleY(1.15); filter: brightness(3); } 65% { opacity: 0.9; transform: scaleY(1.35); } 100% { opacity: 0; transform: scaleY(1.8); } }\
.skill-vfx-world-on-fire-impact { width: 80px !important; height: 80px !important; margin-left: -40px !important; margin-top: -40px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffbb22 20%, #ff4400 45%, transparent 70%) !important; box-shadow: 0 0 40px #ff6622, 0 0 80px rgba(255,80,0,0.5) !important; animation-name: vfxWorldOnFireImpact !important; }\
@keyframes vfxWorldOnFireImpact { 0% { opacity: 1; transform: scale(0.2); filter: brightness(4); } 30% { opacity: 1; transform: scale(1.5); } 100% { opacity: 0; transform: scale(3.5); } }\
.skill-vfx-world-on-fire-meteor { width: 32px !important; height: 28px !important; margin-left: -16px !important; margin-top: -14px !important; border-radius: 42% 58% 35% 65% / 55% 38% 62% 45% !important; background: radial-gradient(ellipse at 35% 40%, #1a0a00 0%, #2d1100 15%, #3a1800 25%, #553300 40%, #884400 55%, #663300 70%, #442200 85%, #1a0a00 100%) !important; box-shadow: 0 0 10px rgba(255,120,30,0.8), 0 0 22px rgba(255,80,0,0.5), 0 0 40px rgba(255,50,0,0.25), inset 2px -1px 4px rgba(255,100,20,0.4), inset -1px 1px 3px rgba(255,60,10,0.3), inset 4px 3px 2px rgba(255,180,60,0.5), inset -3px -2px 1px rgba(255,80,0,0.6) !important; filter: brightness(1.1) drop-shadow(0 0 6px rgba(255,100,20,0.7)) !important; transform-origin: 40% 38% !important; }\
@keyframes meteorFall { 0% { opacity: 0.7; transform: scale(0.4) rotate(-50deg); filter: brightness(1.2); } 10% { opacity: 1; transform: scale(0.7) rotate(-35deg); filter: brightness(2) drop-shadow(0 0 10px #ff8800); } 28% { opacity: 1; transform: translateX(calc(var(--meteor-dx, 100px) * 0.25)) translateY(calc(var(--meteor-dy, 200px) * 0.25)) scale(0.9) rotate(-22deg); filter: brightness(3) drop-shadow(0 0 20px #ff6600); } 48% { opacity: 1; transform: translateX(calc(var(--meteor-dx, 100px) * 0.55)) translateY(calc(var(--meteor-dy, 200px) * 0.55)) scale(1.0) rotate(-12deg); filter: brightness(4.5) drop-shadow(0 0 35px #ff4400) drop-shadow(0 0 60px rgba(255,50,0,0.5)); } 68% { opacity: 1; transform: translateX(calc(var(--meteor-dx, 100px) * 0.8)) translateY(calc(var(--meteor-dy, 200px) * 0.8)) scale(1.15) rotate(-6deg); filter: brightness(6) drop-shadow(0 0 50px #ff2200) drop-shadow(0 0 90px rgba(255,30,0,0.6)); } 85% { opacity: 1; transform: translateX(calc(var(--meteor-dx, 100px) * 0.95)) translateY(calc(var(--meteor-dy, 200px) * 0.95)) scale(1.4) rotate(-2deg); filter: brightness(8) drop-shadow(0 0 70px #ff1100) drop-shadow(0 0 120px rgba(255,20,0,0.7)); } 93% { opacity: 1; transform: translateX(var(--meteor-dx, 100px)) translateY(var(--meteor-dy, 200px)) scale(1.8) rotate(0deg); filter: brightness(10) drop-shadow(0 0 90px #ff0000) drop-shadow(0 0 150px rgba(255,0,0,0.85)); } 100% { opacity: 0; transform: translateX(var(--meteor-dx, 100px)) translateY(var(--meteor-dy, 200px)) scale(0.2) rotate(5deg); filter: brightness(0.5); } }\
.skill-vfx-world-on-fire-meteor-trail { width: 16px !important; height: 40px !important; margin-left: -8px !important; margin-top: -20px !important; border-radius: 999px !important; background: linear-gradient(180deg, rgba(255,100,0,0.85), rgba(255,180,50,0.6), rgba(255,80,0,0.3), transparent) !important; filter: blur(2px) drop-shadow(0 0 10px #ff6600) !important; }\
@keyframes vfxMeteorTrail { 0% { opacity: 0; transform: translateY(-15px) scaleY(0.3); } 25% { opacity: 0.9; transform: translateY(0) scaleY(1); } 100% { opacity: 0; transform: translateY(25px) scaleY(1.5); } }\
/* ===== 修复增强：手里剑菱形旋转飞行体 ===== */\
.skill-vfx-shuriken-projectile {\
    width: 28px !important;\
    height: 28px !important;\
    margin-left: -14px !important;\
    margin-top: -14px !important;\
    background: linear-gradient(135deg, #e8e8e8 0%, #b0b0b0 30%, #888 50%, #b0b0b0 70%, #e8e8e8 100%) !important;\
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);\
    box-shadow: 0 0 18px rgba(200,200,220,0.95), 0 0 35px rgba(180,180,200,0.7), 0 0 55px rgba(160,160,180,0.4) !important;\
    filter: drop-shadow(0 0 12px #ccc) brightness(1.3) !important;\
    animation: projectileShuriken 600ms ease-out forwards !important;\
}\
@keyframes projectileShuriken {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.6) rotate(0deg); }\
    8% { opacity: 1; transform: translate(calc(var(--projectile-x) * 0.08), calc(var(--projectile-y) * 0.08)) scale(1.1) rotate(180deg); }\
    22% { opacity: 1; transform: translate(calc(var(--projectile-x) * 0.28), calc(var(--projectile-y) * 0.28)) scale(1.2) rotate(540deg); filter: brightness(2) drop-shadow(0 0 20px #ddd); }\
    40% { opacity: 0.95; transform: translate(calc(var(--projectile-x) * 0.52), calc(var(--projectile-y) * 0.52)) scale(1.15) rotate(1080deg); filter: brightness(2.5) drop-shadow(0 0 30px #eee) drop-shadow(0 0 50px rgba(220,220,240,0.6)); }\
    58% { opacity: 0.9; transform: translate(calc(var(--projectile-x) * 0.72), calc(var(--projectile-y) * 0.72)) scale(1.1) rotate(1620deg); }\
    75% { opacity: 0.85; transform: translate(calc(var(--projectile-x) * 0.88), calc(var(--projectile-y) * 0.88)) scale(1.05) rotate(2160deg); filter: brightness(1.8); }\
    100% { opacity: 0.3; transform: translate(var(--projectile-x), var(--projectile-y)) scale(0.8) rotate(2700deg); }\
}\
/* ===== 修复增强：火球飞行体 ===== */\
.skill-vfx-fireball-projectile {\
    width: 38px !important;\
    height: 38px !important;\
    margin-left: -19px !important;\
    margin-top: -19px !important;\
    border-radius: 50% !important;\
    background: radial-gradient(circle, #fff8e0 0%, #ffaa00 22%, #ff5500 48%, #cc2200 68%, transparent 82%) !important;\
    box-shadow: 0 0 28px #ff6600, 0 0 55px rgba(255,100,0,0.7), 0 0 85px rgba(255,60,0,0.4), inset 0 0 15px #fff !important;\
    filter: blur(1px) drop-shadow(0 0 22px #ff8800) drop-shadow(0 0 44px rgba(255,80,0,0.5)) !important;\
    animation: projectileFireball 500ms ease-out forwards !important;\
}\
@keyframes projectileFireball {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.5); }\
    10% { opacity: 1; transform: translate(calc(var(--projectile-x) * 0.1), calc(var(--projectile-y) * 0.1)) scale(1.1); filter: brightness(2); }\
    25% { opacity: 1; transform: translate(calc(var(--projectile-x) * 0.3), calc(var(--projectile-y) * 0.3)) scale(1.25); filter: brightness(3) drop-shadow(0 0 35px #ffaa00) drop-shadow(0 0 65px rgba(255,120,0,0.6)); }\
    45% { opacity: 0.95; transform: translate(calc(var(--projectile-x) * 0.55), calc(var(--projectile-y) * 0.55)) scale(1.18); filter: brightness(2.8) drop-shadow(0 0 45px #ff8800); }\
    65% { opacity: 0.9; transform: translate(calc(var(--projectile-x) * 0.78), calc(var(--projectile-y) * 0.78)) scale(1.12); filter: brightness(2.2); }\
    82% { opacity: 0.85; transform: translate(calc(var(--projectile-x) * 0.92), calc(var(--projectile-y) * 0.92)) scale(1.05); }\
    100% { opacity: 0.5; transform: translate(var(--projectile-x), var(--projectile-y)) scale(1.3); }\
}\
/* ===== 修复增强：扩散冲击波 ===== */\
@keyframes expandingShockwave {\
    0% { opacity: 0; transform: scale(0.15) rotate(0deg); }\
    12% { opacity: 1; transform: scale(0.6) rotate(15deg); filter: brightness(2.5); }\
    28% { opacity: 0.95; transform: scale(1.2) rotate(30deg); filter: brightness(3) drop-shadow(0 0 25px rgba(255,100,50,0.8)); }\
    48% { opacity: 0.8; transform: scale(2.2) rotate(50deg); filter: brightness(2); }\
    68% { opacity: 0.5; transform: scale(3.5) rotate(70deg); }\
    100% { opacity: 0; transform: scale(5.5) rotate(90deg); }\
}\
/* ===== 修复增强：瞬移返回 ===== */\
@keyframes teleportReturn {\
    0% { opacity: 0; transform: scale(0.2) rotate(0deg); }\
    15% { opacity: 0.8; transform: scale(0.8) rotate(60deg); filter: brightness(3) drop-shadow(0 0 25px #9900ff); }\
    35% { opacity: 1; transform: scale(1.2) rotate(120deg); filter: brightness(4) drop-shadow(0 0 40px #bb00ff) drop-shadow(0 0 70px rgba(180,0,255,0.6)); }\
    55% { opacity: 0.8; transform: scale(1.05) rotate(180deg); filter: brightness(3); }\
    75% { opacity: 0.5; transform: scale(0.8) rotate(240deg); }\
    100% { opacity: 0; transform: scale(0.4) rotate(300deg); }\
}\
/* ===== 修复增强：烟雾粒子(更大更明显) ===== */\
.skill-vfx-smoke-particle { width: 50px !important; height: 50px !important; margin-left: -25px !important; margin-top: -25px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(100,100,100,0.92), rgba(60,60,60,0.55) 38%, rgba(35,35,35,0.22) 62%, transparent 78%) !important; filter: blur(5px) drop-shadow(0 0 12px rgba(90,90,90,0.7)) drop-shadow(0 0 25px rgba(70,70,70,0.4)) !important; animation-name: smokeParticle !important; }\
@keyframes smokeParticle { 0% { opacity: 0; transform: translate(0, 0) scale(0.2); } 12% { opacity: 0.85; transform: translate(calc(var(--smoke-x) * 0.15), calc(var(--smoke-y) * 0.15)) scale(0.6); } 30% { opacity: 0.95; transform: translate(calc(var(--smoke-x) * 0.35), calc(var(--smoke-y) * 0.35)) scale(1.1); } 55% { opacity: 0.7; transform: translate(calc(var(--smoke-x) * 0.65), calc(var(--smoke-y) * 0.55)) scale(2.2); } 100% { opacity: 0; transform: translate(var(--smoke-x), calc(var(--smoke-y) - 75px)) scale(4.5); } }\
/* ===== 修复增强：持续隐身效果(Ash烟幕) ===== */\
.skill-status-ash-stealth {\
    animation: ashStealthFlicker 1.5s ease-in-out infinite !important;\
}\
@keyframes ashStealthFlicker {\
    0%, 100% { opacity: 0.15; filter: blur(3px) brightness(0.5); }\
    15% { opacity: 0.25; filter: blur(2.5px) brightness(0.6) drop-shadow(0 0 8px rgba(100,100,100,0.5)); }\
    30% { opacity: 0.35; filter: blur(2px) brightness(0.8) drop-shadow(0 0 15px rgba(100,100,100,0.8)); }\
    45% { opacity: 0.18; filter: blur(4px) brightness(0.4); }\
    60% { opacity: 0.2; filter: blur(4px) brightness(0.4); }\
    75% { opacity: 0.3; filter: blur(2.5px) brightness(0.7) drop-shadow(0 0 12px rgba(100,100,100,0.6)); }\
    90% { opacity: 0.15; filter: blur(3.5px) brightness(0.45); }\
}\
/* ===== 修复增强：持续烟雾扩散(隐身期间) ===== */\
.skill-vfx-smoke-lingering {\
    width: 40px !important;\
    height: 40px !important;\
    margin-left: -20px !important;\
    margin-top: -20px !important;\
    border-radius: 50% !important;\
    background: radial-gradient(circle, rgba(110,110,110,0.7), rgba(70,70,70,0.3) 50%, transparent 72%) !important;\
    filter: blur(4px) drop-shadow(0 0 8px rgba(90,90,90,0.5)) !important;\
}\
@keyframes smokeLinger {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.3); }\
    25% { opacity: 0.7; transform: translate(10px, -15px) scale(1); }\
    50% { opacity: 0.5; transform: translate(20px, -30px) scale(1.8); filter: blur(6px); }\
    100% { opacity: 0; transform: translate(30px, -50px) scale(2.8); filter: blur(8px); }\
}\
/* ===== 修复增强：钢化皮肤持续护盾 ===== */\
.skill-picture-iron-skin-shield { position: relative; }\
.skill-picture-iron-skin-shield::after {\
    content: "";\
    position: absolute;\
    inset: -12px;\
    border-radius: 50%;\
    border: 4px solid rgba(180,200,220,0.95);\
    background: radial-gradient(circle, rgba(200,210,220,0.2), rgba(160,170,180,0.1) 50%, transparent 70%);\
    box-shadow: 0 0 30px rgba(180,200,220,0.9), 0 0 60px rgba(160,180,200,0.5), inset 0 0 20px rgba(255,255,255,0.3);\
    animation: ironShieldPersist 2s ease-in-out infinite;\
    pointer-events: none;\
    z-index: 4;\
}\
@keyframes ironShieldPersist {\
    0%, 100% { opacity: 0.7; transform: scale(1); }\
    15% { opacity: 0.82; transform: scale(1.02); }\
    30% { opacity: 0.9; transform: scale(1.04); }\
    50% { opacity: 1; transform: scale(1.06); }\
    70% { opacity: 0.92; transform: scale(1.04); }\
    85% { opacity: 0.8; transform: scale(1.02); }\
}\
/* ===== 修复增强：剑刃风暴分身闪烁 ===== */\
.skill-picture-blade-storm-ghost {\
    animation: bladeStormGhostFlicker 0.3s steps(2) infinite !important;\
}\
@keyframes bladeStormGhostFlicker {\
    0% { opacity: 1; filter: brightness(2) drop-shadow(0 0 20px #ff0000) drop-shadow(0 0 40px rgba(255,0,0,0.6)); transform: scale(1.08) translateX(3px); }\
    25% { opacity: 0.4; filter: brightness(1.2) drop-shadow(0 0 10px #ff4400); transform: scale(0.95) translateX(-2px) skewX(-3deg); }\
    50% { opacity: 1; filter: brightness(2.5) drop-shadow(0 0 25px #ff2200) drop-shadow(0 0 50px rgba(255,0,0,0.7)); transform: scale(1.12) translateX(5px) skewX(2deg); }\
    75% { opacity: 0.3; filter: brightness(1) drop-shadow(0 0 8px #ff6600); transform: scale(0.92) translateX(-4px) skewX(-5deg); }\
    100% { opacity: 1; filter: brightness(2.2) drop-shadow(0 0 22px #ff0000) drop-shadow(0 0 45px rgba(255,0,0,0.65)); transform: scale(1.05) translateX(2px); }\
}\
/* ===== 修复增强：敌人浮动(更华丽) ===== */\
@keyframes enemyTargetFloating {\
    0% { transform: translateY(0) rotate(0deg) scale(1); filter: brightness(1); }\
    12% { transform: translateY(-8px) rotate(2deg) scale(1.02); filter: brightness(1.3) drop-shadow(0 0 12px rgba(255,200,50,0.5)); }\
    25% { transform: translateY(-18px) rotate(3deg) scale(1.04); filter: brightness(1.6) drop-shadow(0 0 20px rgba(255,180,30,0.7)); }\
    37% { transform: translateY(-28px) rotate(1deg) scale(1.06); filter: brightness(1.8) drop-shadow(0 0 28px rgba(255,150,0,0.85)); }\
    50% { transform: translateY(-25px) rotate(-2deg) scale(1.05); filter: brightness(1.7) drop-shadow(0 0 25px rgba(255,160,20,0.8)); }\
    62% { transform: translateY(-20px) rotate(-1deg) scale(1.03); filter: brightness(1.5) drop-shadow(0 0 18px rgba(255,180,40,0.6)); }\
    75% { transform: translateY(-12px) rotate(1deg) scale(1.02); filter: brightness(1.3); }\
    87% { transform: translateY(-15px) rotate(2deg) scale(1.03); filter: brightness(1.4) drop-shadow(0 0 15px rgba(255,170,30,0.7)); }\
    100% { transform: translateY(-18px) rotate(0deg) scale(1.04); filter: brightness(1.5) drop-shadow(0 0 22px rgba(255,150,0,0.8)); }\
}\
/* ===== 修复增强：多层冲击波(践踏) ===== */\
.skill-vfx-stomp-wave-layer1 { width: 120px !important; height: 50px !important; margin-left: -60px !important; margin-top: -25px !important; border-radius: 50% !important; border: 5px solid rgba(255, 80, 40, 0.95); background: radial-gradient(ellipse, rgba(255,100,60,0.6), rgba(255,50,30,0.25) 45%, transparent 72%) !important; box-shadow: 0 0 45px rgba(255,60,30,0.9), 0 0 90px rgba(255,40,20,0.5), 0 0 130px rgba(255,20,10,0.25) !important; animation-name: vfxStompWaveLayer1 !important; }\
@keyframes vfxStompWaveLayer1 { 0% { opacity: 0; transform: scale(0.15); } 18% { opacity: 1; transform: scale(1.2); filter: brightness(2.5); } 38% { opacity: 0.9; transform: scale(2.5); filter: brightness(2); } 58% { opacity: 0.6; transform: scale(4); } 78% { opacity: 0.3; transform: scale(5.5); } 100% { opacity: 0; transform: scale(7) scaleY(3); } }\
.skill-vfx-stomp-wave-layer2 { width: 90px !important; height: 38px !important; margin-left: -45px !important; margin-top: -19px !important; border-radius: 50% !important; border: 3px solid rgba(255, 180, 80, 0.85); background: radial-gradient(ellipse, rgba(255,200,120,0.4), rgba(255,150,80,0.15) 45%, transparent 72%) !important; box-shadow: 0 0 35px rgba(255,160,60,0.7), 0 0 70px rgba(255,120,40,0.35) !important; animation-name: vfxStompWaveLayer2 !important; }\
@keyframes vfxStompWaveLayer2 { 0% { opacity: 0; transform: scale(0.2) rotate(15deg); } 22% { opacity: 0.9; transform: scale(1.5) rotate(30deg); filter: brightness(2); } 45% { opacity: 0.7; transform: scale(3) rotate(50deg); } 70% { opacity: 0.35; transform: scale(4.5) rotate(70deg); } 100% { opacity: 0; transform: scale(6) scaleY(2.5) rotate(90deg); } }\
.skill-vfx-stomp-wave-layer3 { width: 65px !important; height: 28px !important; margin-left: -32px !important; margin-top: -14px !important; border-radius: 50% !important; border: 2px solid rgba(255, 220, 150, 0.7); background: radial-gradient(ellipse, rgba(255,240,200,0.25), transparent 65%) !important; box-shadow: 0 0 25px rgba(255,200,100,0.5), 0 0 50px rgba(255,160,60,0.25) !important; animation-name: vfxStompWaveLayer3 !important; }\
@keyframes vfxStompWaveLayer3 { 0% { opacity: 0; transform: scale(0.25) rotate(-10deg); } 25% { opacity: 0.8; transform: scale(1.8) rotate(10deg); filter: brightness(2.5); } 50% { opacity: 0.55; transform: scale(3.5) rotate(30deg); } 75% { opacity: 0.25; transform: scale(5) rotate(50deg); } 100% { opacity: 0; transform: scale(7.5) scaleY(2.2) rotate(70deg); } }\
/* ===== 修复增强：放射状裂纹(践踏地面碎裂) ===== */\
.skill-vfx-stomp-radial-crack { width: 160px !important; height: 160px !important; margin-left: -80px !important; margin-top: -80px !important; border-radius: 50% !important; background: conic-gradient(from 0deg, transparent 0deg, rgba(255,100,40,0.8) 2deg, transparent 4deg, transparent 28deg, rgba(255,80,30,0.7) 30deg, transparent 32deg, transparent 56deg, rgba(255,120,50,0.75) 58deg, transparent 60deg, transparent 85deg, rgba(255,90,35,0.65) 87deg, transparent 89deg, transparent 115deg, rgba(255,110,45,0.7) 117deg, transparent 119deg, transparent 145deg, rgba(255,100,40,0.6) 147deg, transparent 149deg, transparent 175deg, rgba(255,80,30,0.7) 177deg, transparent 179deg, transparent 205deg, rgba(255,120,50,0.65) 207deg, transparent 209deg, transparent 235deg, rgba(255,90,35,0.7) 237deg, transparent 239deg, transparent 265deg, rgba(255,110,45,0.6) 267deg, transparent 269deg, transparent 295deg, rgba(255,100,40,0.7) 297deg, transparent 299deg, transparent 325deg, rgba(255,80,30,0.65) 327deg, transparent 329deg, transparent 355deg, rgba(255,120,50,0.7) 357deg, transparent 360deg) !important; box-shadow: 0 0 30px rgba(255,80,30,0.6), 0 0 60px rgba(255,60,20,0.3) !important; filter: blur(0.5px) !important; animation-name: vfxStompRadialCrack !important; }\
@keyframes vfxStompRadialCrack { 0% { opacity: 0; transform: scale(0.1) rotate(0deg); } 10% { opacity: 1; transform: scale(0.4) rotate(5deg); filter: brightness(2.5) blur(0.5px); } 25% { opacity: 0.95; transform: scale(0.8) rotate(12deg); filter: brightness(2); } 40% { opacity: 0.85; transform: scale(1.3) rotate(20deg); } 55% { opacity: 0.65; transform: scale(1.8) rotate(28deg); } 70% { opacity: 0.4; transform: scale(2.3) rotate(35deg); } 85% { opacity: 0.2; transform: scale(2.8) rotate(42deg); filter: blur(1px); } 100% { opacity: 0; transform: scale(3.5) rotate(50deg); filter: blur(2px); } }\
/* ===== 修复增强：瞬移路径线(更明显) ===== */\
.skill-vfx-teleport-path { width: 12px !important; height: 12px !important; margin-left: -6px !important; margin-top: -6px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(200,50,255,0.95), rgba(160,0,255,0.6) 40%, rgba(120,0,200,0.3) 65%, transparent 80%) !important; box-shadow: 0 0 25px rgba(180,0,255,0.95), 0 0 50px rgba(160,0,255,0.7), 0 0 80px rgba(140,0,255,0.4) !important; animation-name: vfxTeleportPath !important; }\
/* ===== 修复增强：剑刃风暴斩击(更华丽) ===== */\
@keyframes bladeStormSlash {\
    0% { opacity: 0; transform: scale(0.15) rotate(-45deg) skewX(-8deg); }\
    10% { opacity: 0.8; transform: scale(0.6) rotate(-20deg) skewX(-3deg); filter: brightness(2.5) drop-shadow(0 0 15px #ff0000); }\
    22% { opacity: 1; transform: scale(1.3) rotate(15deg) skewX(2deg); filter: brightness(3.5) drop-shadow(0 0 35px #ff2200) drop-shadow(0 0 65px rgba(255,0,0,0.7)); }\
    40% { opacity: 0.85; transform: scale(1.8) rotate(30deg) skewX(4deg); filter: brightness(2.8) drop-shadow(0 0 25px #ff4400); }\
    60% { opacity: 0.5; transform: scale(2.2) rotate(42deg) skewX(2deg); }\
    80% { opacity: 0.2; transform: scale(2.6) rotate(50deg); }\
    100% { opacity: 0; transform: scale(3) rotate(55deg) skewX(0deg); }\
}\
\
\
/* ===== 敌人状态动画 ===== */\
.enemy-target-floating { animation: enemyTargetFloating 3s ease-in-out infinite !important; }\
@keyframes enemyFloating {\
    0% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1) drop-shadow(0 0 8px rgba(255,255,255,0.3)); }\
    25% { transform: translateY(-12px) scale(1.02) rotate(2deg); filter: brightness(1.2) drop-shadow(0 0 15px rgba(255,255,255,0.5)); }\
    50% { transform: translateY(-20px) scale(1.04) rotate(0deg); filter: brightness(1.3) drop-shadow(0 0 20px rgba(255,255,255,0.6)); }\
    75% { transform: translateY(-14px) scale(1.02) rotate(-2deg); filter: brightness(1.2) drop-shadow(0 0 12px rgba(255,255,255,0.4)); }\
    100% { transform: translateY(-8px) scale(1) rotate(1deg); filter: brightness(1.1) drop-shadow(0 0 10px rgba(255,255,255,0.3)); }\
}\
.enemy-target-knocked-down { animation: enemyKnockedDown 0.8s ease-out forwards !important; }\
@keyframes enemyKnockedDown {\
    0% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
    20% { transform: translateY(-8px) scale(1.05) rotate(5deg); filter: brightness(2) drop-shadow(0 0 15px #ff4400); }\
    40% { transform: translateY(15px) scale(1.1) rotate(-15deg); filter: brightness(3) drop-shadow(0 0 30px #ff2200) drop-shadow(0 0 50px rgba(255,50,0,0.5)); }\
    60% { transform: translateY(20px) scale(1.05) rotate(-25deg); filter: brightness(2.5) drop-shadow(0 0 20px #ff3300); }\
    80% { transform: translateY(18px) scale(1.02) rotate(-20deg); filter: brightness(1.5); }\
    100% { transform: translateY(15px) scale(1) rotate(-18deg); filter: brightness(1.2); }\
}\
\
/* ===== 战甲精修动画：参考样本的刀波/闪光/飞行实体/命中爆发 ===== */\
.skill-vfx {\
    background: transparent;\
    box-shadow: none;\
    text-shadow: none;\
    overflow: visible;\
}\
.skill-vfx-slash-wave {\
    width: 150px;\
    height: 62px;\
    margin-left: -24px;\
    margin-top: -31px;\
    border-radius: 50%;\
    border: 4px solid rgba(87, 230, 255, 0.95);\
    border-left: 0;\
    border-bottom: 0;\
    filter: drop-shadow(0 0 16px rgba(87, 230, 255, 0.95));\
    animation-name: refinedSlashWave !important;\
}\
.skill-vfx-enemy.skill-vfx-slash-wave { transform: scaleX(-1); }\
.skill-vfx-trail {\
    width: 170px;\
    height: 26px;\
    margin-left: -18px;\
    margin-top: -13px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(91,231,255,0.8), transparent);\
    filter: blur(1px) drop-shadow(0 0 18px rgba(91,231,255,0.9));\
    animation-name: refinedDashTrail !important;\
}\
.skill-vfx-blind-flash {\
    width: 44px;\
    height: 44px;\
    margin-left: -22px;\
    margin-top: -22px;\
    border-radius: 50%;\
    background: rgba(255, 235, 140, 0.96);\
    box-shadow: 0 0 60px 35px rgba(255, 210, 80, 0.42), 0 0 160px rgba(255, 255, 210, 0.38);\
    animation-name: refinedBlindFlash !important;\
}\
.skill-vfx-javelin {\
    width: 148px;\
    height: 7px;\
    margin-left: -10px;\
    margin-top: -4px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, transparent, #ffffff, var(--vfx-color));\
    box-shadow: 0 0 18px var(--vfx-color), 0 0 34px rgba(255,255,255,0.45);\
    animation-name: refinedJavelinFly !important;\
}\
.skill-vfx-exalted-wave {\
    width: 210px;\
    height: 84px;\
    margin-left: -34px;\
    margin-top: -42px;\
    border-radius: 50%;\
    border: 5px solid rgba(255, 102, 255, 0.95);\
    border-left: 0;\
    border-bottom: 0;\
    filter: drop-shadow(0 0 24px rgba(255,102,255,0.95));\
    animation-name: refinedExaltedWave !important;\
}\
.skill-vfx-blade-burst, .skill-vfx-electric-spark {\
    width: 42px;\
    height: 42px;\
    margin-left: -21px;\
    margin-top: -21px;\
    border-radius: 50%;\
    background: radial-gradient(circle, #fff, var(--vfx-color), transparent 70%);\
    box-shadow: 0 0 34px 14px var(--vfx-color);\
    animation-name: refinedImpactBurst !important;\
}\
.skill-vfx-lightning-bolt {\
    width: 18px;\
    height: 6px;\
    margin-left: -9px;\
    margin-top: -3px;\
    border-radius: 8px;\
    background: #dff7ff;\
    box-shadow: 0 0 12px #fff, 0 0 24px var(--vfx-color);\
    animation-name: refinedLightningBolt !important;\
}\
.skill-vfx-lightning-bolt::before, .skill-vfx-lightning-bolt::after {\
    content: "";\
    position: absolute;\
    left: -34px;\
    top: -9px;\
    width: 96px;\
    height: 24px;\
    background: linear-gradient(90deg, transparent, var(--vfx-color), #fff, var(--vfx-color), transparent);\
    clip-path: polygon(0 45%, 28% 45%, 34% 0, 48% 82%, 58% 30%, 70% 55%, 100% 55%, 100% 68%, 66% 68%, 56% 45%, 47% 100%, 32% 22%, 25% 58%, 0 58%);\
}\
.skill-vfx-speed-ring, .skill-vfx-shield-dome, .skill-vfx-discharge-wave, .skill-vfx-polarize-wave {\
    width: 58px;\
    height: 58px;\
    margin-left: -29px;\
    margin-top: -29px;\
    border-radius: 50%;\
    border: 2px solid var(--vfx-color);\
    box-shadow: 0 0 24px var(--vfx-color), inset 0 0 18px rgba(255,255,255,0.28);\
    animation-name: refinedRadialWave !important;\
}\
.skill-vfx-speed-trail {\
    width: 180px;\
    height: 24px;\
    margin-left: -90px;\
    margin-top: -12px;\
    border-radius: 999px;\
    background: repeating-linear-gradient(90deg, transparent 0 10px, rgba(91,231,255,0.85) 10px 18px, transparent 18px 28px);\
    filter: drop-shadow(0 0 16px rgba(91,231,255,0.9));\
    animation-name: refinedSpeedTrail !important;\
}\
.skill-vfx-shield-dome {\
    border-width: 3px;\
    background: radial-gradient(circle, rgba(136,204,255,0.16), transparent 64%);\
    animation-name: refinedShieldDome !important;\
}\
.skill-vfx-discharge-wave {\
    border-color: #ffaa00;\
    box-shadow: 0 0 30px #ffaa00, inset 0 0 24px rgba(255,255,255,0.28);\
    animation-name: refinedDischarge !important;\
}\
.skill-vfx-discharge-em-wave {\
    width: 44px;\
    height: 44px;\
    margin-left: -22px;\
    margin-top: -22px;\
    border-radius: 50%;\
    border: 3px solid rgba(255, 190, 70, 0.95);\
    background: radial-gradient(circle, rgba(255,255,255,0.20), rgba(255,170,0,0.12) 38%, transparent 68%);\
    box-shadow: 0 0 24px rgba(255,170,0,0.95), inset 0 0 18px rgba(255,255,255,0.35);\
    animation-name: refinedDischargeEMWave !important;\
}\
.skill-vfx-discharge-em-wave::before, .skill-vfx-discharge-em-wave::after {\
    content: "";\
    position: absolute;\
    inset: -8px;\
    border-radius: 50%;\
    border: 2px solid rgba(255, 230, 140, 0.75);\
    box-shadow: 0 0 18px rgba(255, 190, 70, 0.75);\
}\
.skill-vfx-discharge-em-wave::after {\
    inset: -18px;\
    border-style: dashed;\
    opacity: 0.72;\
}\
.skill-vfx-discharge-core {\
    width: 34px;\
    height: 34px;\
    margin-left: -17px;\
    margin-top: -17px;\
    border-radius: 50%;\
    background: radial-gradient(circle, #fff, #ffaa00 40%, transparent 72%);\
    box-shadow: 0 0 28px #ffaa00, 0 0 56px rgba(255,170,0,0.55);\
    animation-name: refinedDischargeCore !important;\
}\
.skill-vfx-magnetic-tether {\
    width: 170px;\
    height: 20px;\
    margin-left: -85px;\
    margin-top: -10px;\
    border-radius: 999px;\
    background: repeating-linear-gradient(90deg, rgba(255,102,255,0.12) 0 12px, rgba(255,255,255,0.9) 12px 18px, rgba(204,68,255,0.8) 18px 28px);\
    filter: drop-shadow(0 0 18px rgba(255,102,255,0.95));\
    animation-name: refinedMagneticTether !important;\
}\
.skill-vfx-magnetize-field, .skill-vfx-crush-rings {\
    width: 92px;\
    height: 92px;\
    margin-left: -46px;\
    margin-top: -46px;\
    border-radius: 50%;\
    border: 3px solid var(--vfx-color);\
    box-shadow: 0 0 26px var(--vfx-color), inset 0 0 22px rgba(255,255,255,0.18);\
    animation-name: refinedMagnetizeField !important;\
}\
.skill-vfx-crush-rings { animation-name: refinedCrushRings !important; }\
.skill-vfx-basic-slash {\
    width: 92px;\
    height: 38px;\
    margin-left: -18px;\
    margin-top: -19px;\
    border-radius: 50%;\
    border-top: 3px solid rgba(255,255,255,0.96);\
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));\
    animation-name: refinedBasicSlash !important;\
}\
@keyframes refinedSlashWave {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.35) rotate(-25deg); }\
    25% { opacity: 1; }\
    100% { opacity: 0; transform: translate(var(--vfx-x), calc(var(--vfx-y) - 8px)) scale(1.18) rotate(10deg); }\
}\
@keyframes refinedDashTrail {\
    0% { opacity: 0; transform: translate(0, 0) scaleX(0.2); }\
    25% { opacity: 0.9; }\
    100% { opacity: 0; transform: translate(calc(var(--vfx-x) * 0.78), var(--vfx-y)) scaleX(1.1); }\
}\
@keyframes refinedBlindFlash {\
    0% { opacity: 0; transform: scale(0.18); }\
    35% { opacity: 0.98; transform: scale(7.2); }\
    100% { opacity: 0; transform: scale(11); }\
}\
@keyframes refinedJavelinFly {\
    0% { opacity: 0; transform: translate(0, 0) rotate(-5deg); }\
    15% { opacity: 1; }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) rotate(-5deg); }\
}\
@keyframes refinedExaltedWave {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.38) rotate(-32deg); }\
    22% { opacity: 1; }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.45) rotate(18deg); }\
}\
@keyframes refinedImpactBurst {\
    0% { opacity: 0.95; transform: scale(0.2); }\
    100% { opacity: 0; transform: scale(4.2); }\
}\
@keyframes refinedLightningBolt {\
    0% { opacity: 0; transform: translate(0, 0) scaleX(0.25); filter: brightness(1); }\
    18% { opacity: 1; filter: brightness(3); }\
    45% { transform: translate(calc(var(--vfx-x) * 0.48), calc(var(--vfx-y) * 0.48)) scaleX(1.1); }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scaleX(0.65); }\
}\
@keyframes refinedRadialWave {\
    0% { opacity: 0; transform: scale(0.35); }\
    30% { opacity: 0.95; }\
    100% { opacity: 0; transform: scale(4.8); }\
}\
@keyframes refinedShieldDome {\
    0% { opacity: 0; transform: scale(0.4) rotate(0deg); }\
    35% { opacity: 0.95; transform: scale(1.45) rotate(12deg); }\
    100% { opacity: 0; transform: scale(1.9) rotate(30deg); }\
}\
@keyframes refinedDischarge {\
    0% { opacity: 0; transform: scale(0.25); }\
    28% { opacity: 1; transform: scale(2.2); }\
    100% { opacity: 0; transform: scale(7); }\
}\
@keyframes refinedDischargeEMWave {\
    0% { opacity: 0; transform: scale(0.15); filter: brightness(1); }\
    12% { opacity: 1; transform: scale(0.55); filter: brightness(3); }\
    68% { opacity: 0.9; transform: scale(var(--em-scale-mid)); filter: brightness(2.2); }\
    100% { opacity: 0; transform: scale(var(--em-scale-end)); filter: brightness(1); }\
}\
@keyframes refinedDischargeCore {\
    0% { opacity: 0; transform: scale(0.4); }\
    30% { opacity: 1; transform: scale(1.35); }\
    100% { opacity: 0; transform: scale(0.75); }\
}\
@keyframes refinedSpeedTrail {\
    0% { opacity: 0; transform: translateX(-38px) scaleX(0.3); }\
    30% { opacity: 0.9; }\
    100% { opacity: 0; transform: translateX(70px) scaleX(1.2); }\
}\
@keyframes refinedMagneticTether {\
    0% { opacity: 0; transform: translate(calc(var(--vfx-x) * -0.45), calc(var(--vfx-y) * -0.45)) scaleX(0.2); }\
    30% { opacity: 1; }\
    100% { opacity: 0; transform: translate(0, 0) scaleX(1.2); }\
}\
@keyframes refinedMagnetizeField {\
    0% { opacity: 0; transform: scale(0.45) rotate(0deg); }\
    35% { opacity: 0.95; }\
    100% { opacity: 0; transform: scale(1.55) rotate(360deg); }\
}\
@keyframes refinedCrushRings {\
    0% { opacity: 0; transform: scale(2.2) rotate(0deg); }\
    35% { opacity: 1; }\
    100% { opacity: 0; transform: scale(0.42) rotate(-140deg); }\
}\
@keyframes refinedBasicSlash {\
    0% { opacity: 0; transform: translate(0, 0) scale(0.4) rotate(-18deg); }\
    25% { opacity: 1; }\
    100% { opacity: 0; transform: translate(calc(var(--vfx-x) * 0.72), calc(var(--vfx-y) * 0.72)) scale(1.2) rotate(16deg); }\
}\
@keyframes anim-basic-attack {\
    0% { transform: translateX(0) scale(1); filter: brightness(1); }\
    35% { transform: translateX(18px) scale(1.04); filter: brightness(1.45) drop-shadow(0 0 10px #fff); }\
    62% { transform: translateX(36px) scale(1.08); filter: brightness(1.85) drop-shadow(0 0 18px #fff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-slash-dash {\
    0% { transform: translateX(0) scale(1); filter: brightness(1); }\
    14% { transform: translateX(-12px) scale(0.96); filter: brightness(1.25); }\
    46% { transform: translateX(92px) scale(1.1); filter: brightness(2.2) drop-shadow(0 0 24px #5be7ff); }\
    72% { transform: translateX(50px) scale(1.04); filter: brightness(1.6) drop-shadow(0 0 16px #5be7ff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-radial-blind {\
    0% { transform: scale(1); filter: brightness(1); }\
    26% { transform: scale(0.92); filter: brightness(1.2); }\
    48% { transform: scale(1.18); filter: brightness(4) drop-shadow(0 0 36px #ffe680); }\
    72% { transform: scale(1.05); filter: brightness(2.1) drop-shadow(0 0 22px #ffd66b); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-radial-javelin {\
    0% { transform: translateY(0) scale(1); filter: brightness(1); }\
    24% { transform: translateY(-18px) scale(1.05); filter: brightness(1.7); }\
    46% { transform: translateY(-30px) scale(1.16); filter: brightness(2.5) drop-shadow(0 0 24px #ff4444); }\
    78% { transform: translateY(-8px) scale(1.03); filter: brightness(1.7); }\
    100% { transform: translateY(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-exalted-blade {\
    0% { transform: scale(1) rotate(0deg); filter: brightness(1); }\
    22% { transform: scale(1.12) rotate(-12deg); filter: brightness(1.7) drop-shadow(0 0 18px #ff66ff); }\
    48% { transform: scale(1.24) rotate(16deg); filter: brightness(3) drop-shadow(0 0 38px #ff66ff); }\
    76% { transform: scale(1.08) rotate(-6deg); filter: brightness(1.8) drop-shadow(0 0 20px #ff66ff); }\
    100% { transform: scale(1) rotate(0deg); filter: brightness(1); }\
}\
@keyframes anim-shock {\
    0% { transform: translateX(0); filter: brightness(1); }\
    18% { transform: translateX(-6px); filter: brightness(3.2) drop-shadow(0 0 22px #4488ff); }\
    36% { transform: translateX(20px); filter: brightness(2.2) drop-shadow(0 0 18px #4488ff); }\
    58% { transform: translateX(42px); filter: brightness(3.6) drop-shadow(0 0 28px #88ccff); }\
    100% { transform: translateX(0); filter: brightness(1); }\
}\
@keyframes anim-speed {\
    0% { transform: translateX(0) skewX(0deg); filter: brightness(1); }\
    20% { transform: translateX(-20px) skewX(-10deg); filter: brightness(1.8) drop-shadow(0 0 18px #00d4ff); }\
    45% { transform: translateX(28px) skewX(12deg); filter: brightness(2.5) drop-shadow(0 0 25px #5be7ff); }\
    70% { transform: translateX(-12px) skewX(-7deg); filter: brightness(1.7); }\
    100% { transform: translateX(0) skewX(0deg); filter: brightness(1); }\
}\
@keyframes anim-electric-shield {\
    0% { transform: scale(1); filter: brightness(1); }\
    35% { transform: scale(1.12); filter: brightness(2) drop-shadow(0 0 26px #88ccff); }\
    70% { transform: scale(1.05); filter: brightness(1.5) drop-shadow(0 0 18px #88ccff); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-discharge {\
    0% { transform: scale(1); filter: brightness(1); }\
    24% { transform: scale(0.92); filter: brightness(1.6); }\
    48% { transform: scale(1.28); filter: brightness(4) drop-shadow(0 0 42px #ffaa00); }\
    76% { transform: scale(1.08); filter: brightness(2.2) drop-shadow(0 0 24px #ffaa00); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
@keyframes anim-pull {\
    0% { transform: scale(1); filter: brightness(1); }\
    30% { transform: translateX(-14px) scale(1.08); filter: brightness(1.8) drop-shadow(0 0 20px #ff66ff); }\
    58% { transform: translateX(18px) scale(0.96); filter: brightness(2.4) drop-shadow(0 0 30px #ff66ff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); }\
}\
@keyframes anim-magnetize {\
    0% { transform: rotate(0deg) scale(1); filter: brightness(1); }\
    34% { transform: rotate(120deg) scale(1.12); filter: brightness(2) drop-shadow(0 0 24px #cc44ff); }\
    68% { transform: rotate(260deg) scale(1.2); filter: brightness(2.5) drop-shadow(0 0 34px #cc44ff); }\
    100% { transform: rotate(360deg) scale(1); filter: brightness(1); }\
}\
@keyframes anim-polarize {\
    0% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }\
    34% { transform: scale(1.14); filter: brightness(2.4) hue-rotate(120deg) drop-shadow(0 0 28px #ff44ff); }\
    64% { transform: scale(1.22); filter: brightness(3) hue-rotate(220deg) drop-shadow(0 0 36px #ff44ff); }\
    100% { transform: scale(1); filter: brightness(1) hue-rotate(0deg); }\
}\
@keyframes anim-crush {\
    0% { transform: scale(1); filter: brightness(1); }\
    28% { transform: scale(1.22); filter: brightness(3.2) drop-shadow(0 0 38px #ff00ff); }\
    58% { transform: scale(0.82); filter: brightness(2.2) drop-shadow(0 0 28px #ff00ff); }\
    82% { transform: scale(1.08); filter: brightness(1.8); }\
    100% { transform: scale(1); filter: brightness(1); }\
}\
\
/* ===== 用户指定精修：角色图参与动作与持续状态 ===== */\
.skill-picture-slash-dash {\
    animation: pictureSlashDash 720ms cubic-bezier(.12,.82,.2,1) both !important;\
}\
.skill-picture-speed {\
    animation: pictureSpeedBlur 760ms ease both !important;\
}\
.skill-picture-electric-shield::after {\
    content: "";\
    position: absolute;\
    top: 4px;\
    left: 72%;\
    width: 30px;\
    height: 64px;\
    border-radius: 48% 12px 12px 48%;\
    border: 3px solid rgba(136, 220, 255, 0.95);\
    background: linear-gradient(90deg, rgba(136,220,255,0.28), rgba(136,220,255,0.08));\
    box-shadow: 0 0 18px rgba(136,220,255,0.95), inset 0 0 16px rgba(255,255,255,0.35);\
    animation: pictureShieldPanel 1200ms ease both;\
    pointer-events: none;\
    z-index: 4;\
}\
#battleEnemyIcon.skill-picture-electric-shield::after {\
    left: auto;\
    right: 72%;\
    transform: scaleX(-1);\
}\
.skill-picture-pulled {\
    animation: picturePulledToVortex 760ms cubic-bezier(.22,.9,.16,1) both !important;\
}\
.skill-picture-crushed {\
    animation: pictureCrushedSlam 980ms cubic-bezier(.16,.8,.18,1) both !important;\
}\
.skill-status-blinded-smoke::after {\
    content: "";\
    position: absolute;\
    left: 50%;\
    top: -14px;\
    width: 44px;\
    height: 48px;\
    transform: translateX(-50%);\
    border-radius: 50%;\
    background: radial-gradient(circle, rgba(255,255,210,0.65), rgba(180,180,180,0.22) 42%, transparent 72%);\
    filter: blur(2px);\
    animation: blindedSmokeRise 900ms ease-in-out infinite;\
    pointer-events: none;\
    z-index: 5;\
}\
.skill-status-blinded-smoke::before {\
    content: "";\
    position: absolute;\
    inset: -8px;\
    border-radius: 50%;\
    border: 2px solid rgba(255, 230, 120, 0.7);\
    box-shadow: 0 0 18px rgba(255,230,120,0.75);\
    animation: blindedHalo 1100ms ease-in-out infinite;\
    pointer-events: none;\
}\
.skill-vfx-electric-line {\
    width: var(--vfx-distance);\
    height: 4px;\
    margin-left: 0;\
    margin-top: -2px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, rgba(160,230,255,0.1), #dff7ff, #4488ff, rgba(160,230,255,0.1));\
    box-shadow: 0 0 12px #88ccff, 0 0 26px #4488ff;\
    transform-origin: left center;\
    animation-name: refinedElectricLine !important;\
}\
.skill-vfx-electric-line::before {\
    content: "";\
    position: absolute;\
    inset: -7px 0;\
    background: repeating-linear-gradient(90deg, transparent 0 14px, rgba(255,255,255,0.9) 14px 18px, rgba(68,136,255,0.9) 18px 24px, transparent 24px 34px);\
    clip-path: polygon(0 48%, 8% 48%, 12% 12%, 17% 82%, 23% 30%, 29% 58%, 36% 40%, 44% 56%, 52% 20%, 59% 76%, 66% 43%, 74% 54%, 83% 32%, 91% 60%, 100% 48%, 100% 62%, 90% 72%, 82% 48%, 74% 68%, 65% 56%, 59% 92%, 51% 36%, 44% 70%, 36% 52%, 29% 74%, 22% 46%, 17% 100%, 11% 30%, 8% 62%, 0 62%);\
}\
.skill-vfx-reach-target {\
    width: 42px;\
    height: 42px;\
    margin-left: -21px;\
    margin-top: -21px;\
    animation-name: refinedReachTargetWave !important;\
}\
.skill-vfx-magnetic-vortex {\
    width: 76px;\
    height: 76px;\
    margin-left: -38px;\
    margin-top: -38px;\
    border-radius: 50%;\
    border: 4px dashed rgba(255,102,255,0.95);\
    background: radial-gradient(circle, rgba(255,255,255,0.35), rgba(204,68,255,0.22), transparent 68%);\
    box-shadow: 0 0 26px rgba(255,102,255,0.9), inset 0 0 20px rgba(255,255,255,0.24);\
    animation-name: refinedMagneticVortex !important;\
}\
@keyframes pictureSlashDash {\
    0% { transform: translateX(0) scale(1); filter: brightness(1); opacity: 1; }\
    18% { transform: translateX(calc(var(--dash-x) * -0.08)) scale(0.96); filter: brightness(1.35); }\
    42% { transform: translateX(var(--dash-x)) scale(1.12); filter: brightness(2.5) drop-shadow(0 0 24px #5be7ff); opacity: 0.88; }\
    62% { transform: translateX(calc(var(--dash-x) * 0.72)) scale(1.06); filter: brightness(1.8) drop-shadow(0 0 18px #5be7ff); }\
    100% { transform: translateX(0) scale(1); filter: brightness(1); opacity: 1; }\
}\
@keyframes pictureSpeedBlur {\
    0% { transform: translateX(0) skewX(0deg); filter: brightness(1); }\
    22% { transform: translateX(calc(var(--speed-dir) * -26px)) skewX(calc(var(--speed-dir) * -14deg)); filter: brightness(1.9) drop-shadow(0 0 16px #5be7ff); }\
    48% { transform: translateX(calc(var(--speed-dir) * 36px)) skewX(calc(var(--speed-dir) * 16deg)); filter: brightness(2.8) drop-shadow(0 0 28px #5be7ff); }\
    72% { transform: translateX(calc(var(--speed-dir) * -14px)) skewX(calc(var(--speed-dir) * -8deg)); filter: brightness(1.7); }\
    100% { transform: translateX(0) skewX(0deg); filter: brightness(1); }\
}\
@keyframes pictureShieldPanel {\
    0% { opacity: 0; transform: scaleX(0.2) scaleY(0.4); }\
    30% { opacity: 1; transform: scaleX(1.05) scaleY(1); }\
    78% { opacity: 0.95; transform: scaleX(1) scaleY(1); }\
    100% { opacity: 0; transform: scaleX(0.85) scaleY(1.05); }\
}\
@keyframes picturePulledToVortex {\
    0% { transform: translate(0, 0) rotate(0deg); filter: brightness(1); }\
    42% { transform: translate(var(--pull-x), var(--pull-y)) rotate(-8deg) scale(0.96); filter: brightness(1.7) drop-shadow(0 0 18px #ff66ff); }\
    66% { transform: translate(calc(var(--pull-x) * 0.86), calc(var(--pull-y) * 0.86)) rotate(7deg) scale(1.04); filter: brightness(2.2) drop-shadow(0 0 26px #ff66ff); }\
    100% { transform: translate(0, 0) rotate(0deg) scale(1); filter: brightness(1); }\
}\
@keyframes pictureCrushedSlam {\
    0% { transform: translateY(0) scale(1); filter: brightness(1); }\
    28% { transform: translateY(-88px) scale(0.96); filter: brightness(2.2) drop-shadow(0 0 24px #ff00ff); }\
    54% { transform: translateY(-112px) scale(0.92) rotate(4deg); filter: brightness(2.8) drop-shadow(0 0 34px #ff00ff); }\
    72% { transform: translateY(34px) scale(1.12) rotate(-5deg); filter: brightness(1.7); }\
    84% { transform: translateY(-10px) scale(1.02); }\
    100% { transform: translateY(0) scale(1) rotate(0deg); filter: brightness(1); }\
}\
@keyframes blindedSmokeRise {\
    0% { opacity: 0; transform: translate(-50%, 12px) scale(0.5); }\
    40% { opacity: 0.88; transform: translate(-50%, -2px) scale(0.95); }\
    100% { opacity: 0; transform: translate(-50%, -26px) scale(1.55); }\
}\
@keyframes blindedHalo {\
    0%, 100% { opacity: 0.45; transform: scale(0.95); }\
    50% { opacity: 0.95; transform: scale(1.08); }\
}\
@keyframes refinedElectricLine {\
    0% { opacity: 0; transform: rotate(var(--vfx-angle)) scaleX(0.05); filter: brightness(1); }\
    18% { opacity: 1; transform: rotate(var(--vfx-angle)) scaleX(0.25); filter: brightness(3); }\
    72% { opacity: 1; transform: rotate(var(--vfx-angle)) scaleX(1); filter: brightness(2.4); }\
    100% { opacity: 0; transform: rotate(var(--vfx-angle)) scaleX(1); filter: brightness(1); }\
}\
@keyframes refinedReachTargetWave {\
    0% { opacity: 0; transform: scale(0.25); }\
    22% { opacity: 0.95; transform: scale(1.4); }\
    100% { opacity: 0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.65); }\
}\
@keyframes refinedMagneticVortex {\
    0% { opacity: 0; transform: scale(0.35) rotate(0deg); }\
    28% { opacity: 1; transform: scale(1.05) rotate(160deg); }\
    75% { opacity: 0.95; transform: scale(1.18) rotate(520deg); }\
    100% { opacity: 0; transform: scale(0.5) rotate(720deg); }\
}\
\
/* ===== 敌人专属行为动画 ===== */\
.enemy-vfx-hook-line, .enemy-vfx-aim-line, .enemy-vfx-electric-line {\
    width: var(--vfx-distance);\
    height: 3px;\
    margin-left: 0;\
    margin-top: -1px;\
    transform-origin: left center;\
    transform: rotate(var(--vfx-angle));\
    background: linear-gradient(90deg, rgba(255,255,255,0.15), var(--vfx-color), rgba(255,255,255,0.9));\
    box-shadow: 0 0 10px var(--vfx-color);\
    animation-name: enemyLineGrow !important;\
}\
.enemy-vfx-hook-line {\
    height: 4px;\
    background: repeating-linear-gradient(90deg, #6b4a2f 0 8px, #ffc86b 8px 14px, #6b4a2f 14px 22px);\
    box-shadow: 0 0 12px rgba(255,180,80,0.85);\
}\
.enemy-vfx-hook-tip {\
    width: 26px;\
    height: 18px;\
    margin-left: -13px;\
    margin-top: -9px;\
    color: transparent;\
    background: linear-gradient(135deg, transparent 0 32%, #ffd27a 33% 46%, transparent 47%), linear-gradient(225deg, transparent 0 32%, #ffd27a 33% 46%, transparent 47%);\
    filter: drop-shadow(0 0 10px #ffaa44);\
    animation-name: enemyProjectileFly !important;\
}\
.enemy-vfx-hook-snap {\
    width: 64px;\
    height: 64px;\
    margin-left: -32px;\
    margin-top: -32px;\
    border-radius: 50%;\
    border: 3px solid rgba(255, 204, 102, 0.8);\
    border-left-color: transparent;\
    border-bottom-color: transparent;\
    box-shadow: 0 0 18px rgba(255, 170, 68, 0.85);\
    animation-name: enemyHookSnap !important;\
}\
.enemy-vfx-red-slash, .enemy-vfx-fire-slash {\
    width: 96px;\
    height: 40px;\
    margin-left: -20px;\
    margin-top: -20px;\
    border-radius: 50%;\
    border-top: 4px solid #ff3355;\
    border-right: 2px solid rgba(255,255,255,0.8);\
    filter: drop-shadow(0 0 12px #ff3355);\
    animation-name: enemySlashArc !important;\
}\
.enemy-vfx-fire-slash {\
    border-top-color: #ff7a22;\
    filter: drop-shadow(0 0 18px #ff6622);\
}\
.enemy-vfx-teleport-smoke, .enemy-vfx-teleport-ring {\
    width: 70px;\
    height: 70px;\
    margin-left: -35px;\
    margin-top: -35px;\
    border-radius: 50%;\
    border: 2px dashed #bb66ff;\
    background: radial-gradient(circle, rgba(187,102,255,0.22), transparent 68%);\
    box-shadow: 0 0 22px rgba(187,102,255,0.85);\
    animation-name: enemyTeleportSmoke !important;\
}\
.enemy-vfx-riot-shield {\
    width: 42px;\
    height: 64px;\
    margin-left: -21px;\
    margin-top: -32px;\
    border-radius: 8px 18px 18px 8px;\
    border: 3px solid #8edbff;\
    background: linear-gradient(90deg, rgba(142,219,255,0.38), rgba(142,219,255,0.1));\
    box-shadow: 0 0 18px rgba(142,219,255,0.85);\
    animation-name: enemyShieldCharge !important;\
}\
.enemy-vfx-shield-ghost {\
    width: 68px;\
    height: 82px;\
    margin-left: -34px;\
    margin-top: -41px;\
    border-radius: 10px 26px 26px 10px;\
    border: 2px solid rgba(142,219,255,0.55);\
    background: linear-gradient(90deg, rgba(142,219,255,0.18), transparent);\
    filter: drop-shadow(0 0 20px rgba(142,219,255,0.8));\
    animation-name: enemyShieldGhost !important;\
}\
.enemy-vfx-impact-burst, .enemy-vfx-explosion {\
    width: 44px;\
    height: 44px;\
    margin-left: -22px;\
    margin-top: -22px;\
    border-radius: 50%;\
    background: radial-gradient(circle, #fff, #ff8844 35%, rgba(255,68,34,0.55) 58%, transparent 72%);\
    box-shadow: 0 0 28px #ff8844;\
    animation-name: enemyImpactBurst !important;\
}\
.enemy-vfx-explosion {\
    width: 72px;\
    height: 72px;\
    margin-left: -36px;\
    margin-top: -36px;\
    background: radial-gradient(circle, #fff, #ffaa22 26%, #ff4411 54%, transparent 74%);\
}\
.enemy-vfx-sniper-shot, .enemy-vfx-bullet-line, .enemy-vfx-shotgun-pellet {\
    width: 22px;\
    height: 5px;\
    margin-left: -11px;\
    margin-top: -2px;\
    border-radius: 999px;\
    background: #ffd36b;\
    box-shadow: 0 0 12px #ffaa00;\
    animation-name: enemyProjectileFly !important;\
}\
.enemy-vfx-sniper-shot { width: 70px; background: linear-gradient(90deg, transparent, #fff, #ff3333); }\
.enemy-vfx-heavy-bullet { width: 42px; height: 6px; background: linear-gradient(90deg, #fff, #ffaa00, transparent); }\
.enemy-vfx-sawblade, .enemy-vfx-boomerang {\
    font-size: 2rem;\
    color: #ff4455;\
    text-shadow: 0 0 14px #ff4455;\
    animation-name: enemySpinFly !important;\
}\
.enemy-vfx-flame-cone {\
    width: 160px;\
    height: 72px;\
    margin-left: -6px;\
    margin-top: -36px;\
    border-radius: 999px;\
    background: radial-gradient(ellipse at left, #fff3b0, #ff7a22 34%, rgba(255,45,0,0.6) 58%, transparent 76%);\
    filter: blur(1px) drop-shadow(0 0 18px #ff6622);\
    transform-origin: left center;\
    animation-name: enemyFlameCone !important;\
}\
.enemy-vfx-latcher {\
    font-size: 1.4rem;\
    color: #ffaa00;\
    text-shadow: 0 0 12px #ffaa00;\
    animation-name: enemyLatcherRoll !important;\
}\
.enemy-vfx-rocket {\
    width: 34px;\
    height: 12px;\
    margin-left: -17px;\
    margin-top: -6px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, #333, #fff, #ff8844);\
    box-shadow: 0 0 14px #ff8844;\
    animation-name: enemyRocketFly !important;\
}\
.enemy-vfx-heavy-rocket {\
    width: 48px;\
    height: 16px;\
    margin-left: -24px;\
    margin-top: -8px;\
    background: linear-gradient(90deg, #222, #dedede 35%, #ff6b1a 70%, #ffaa22);\
    box-shadow: 0 0 18px #ff6622, 0 0 32px rgba(255,68,20,0.45);\
}\
.enemy-vfx-rocket::before {\
    content: "";\
    position: absolute;\
    right: 28px;\
    top: 3px;\
    width: 54px;\
    height: 6px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, transparent, rgba(160,160,160,0.45), rgba(255,170,80,0.85));\
}\
.enemy-vfx-warning-reticle {\
    width: 86px;\
    height: 86px;\
    margin-left: -43px;\
    margin-top: -43px;\
    border-radius: 50%;\
    border: 2px dashed rgba(255, 210, 80, 0.85);\
    box-shadow: 0 0 18px rgba(255, 190, 60, 0.65), inset 0 0 18px rgba(255, 80, 30, 0.25);\
    animation-name: enemyWarningReticle !important;\
}\
.enemy-vfx-warning-reticle::before, .enemy-vfx-warning-reticle::after {\
    content: "";\
    position: absolute;\
    left: 50%;\
    top: 50%;\
    width: 96px;\
    height: 2px;\
    margin-left: -48px;\
    background: rgba(255, 190, 60, 0.75);\
    box-shadow: 0 0 8px rgba(255,190,60,0.8);\
}\
.enemy-vfx-warning-reticle::after { transform: rotate(90deg); }\
.enemy-vfx-danger-reticle {\
    border-color: rgba(255, 80, 30, 0.95);\
    box-shadow: 0 0 24px rgba(255, 80, 30, 0.85), inset 0 0 22px rgba(255, 0, 0, 0.28);\
}\
.enemy-vfx-switch-beam {\
    width: var(--vfx-distance);\
    height: 18px;\
    margin-left: 0;\
    margin-top: -9px;\
    transform-origin: left center;\
    background: repeating-linear-gradient(90deg, rgba(255,153,0,0), rgba(255,153,0,0) 10px, rgba(255,210,90,0.75) 10px 18px, rgba(255,255,255,0.9) 18px 22px);\
    filter: drop-shadow(0 0 18px #ff9900);\
    animation-name: enemySwitchBeam !important;\
}\
.enemy-vfx-jet-flame {\
    width: 36px;\
    height: 72px;\
    margin-left: -18px;\
    margin-top: -8px;\
    background: linear-gradient(180deg, #fff, #ffaa22, transparent);\
    filter: blur(1px) drop-shadow(0 0 14px #ff8844);\
    animation-name: enemyJetFlame !important;\
}\
.enemy-vfx-ground-shockwave {\
    width: 48px;\
    height: 18px;\
    margin-left: -24px;\
    margin-top: -9px;\
    border-radius: 50%;\
    border: 3px solid #ff8844;\
    box-shadow: 0 0 20px #ff8844;\
    animation-name: enemyGroundShockwave !important;\
}\
.enemy-vfx-beast-shadow {\
    width: 58px;\
    height: 28px;\
    margin-left: -29px;\
    margin-top: -14px;\
    border-radius: 55% 45% 48% 52%;\
    background: linear-gradient(90deg, rgba(40,18,8,0.95), rgba(120,70,28,0.95));\
    box-shadow: inset 8px 0 0 rgba(255,190,80,0.25), 0 0 14px rgba(255,170,68,0.75);\
    filter: drop-shadow(0 0 14px #ffaa44);\
    animation-name: enemyBeastPounce !important;\
}\
.enemy-vfx-beast-shadow::before {\
    content: "";\
    position: absolute;\
    right: -12px;\
    top: 3px;\
    width: 22px;\
    height: 19px;\
    border-radius: 50% 46% 45% 50%;\
    background: rgba(80,38,14,0.98);\
    box-shadow: 7px -3px 0 -4px #ffd27a, 7px 4px 0 -4px #ffd27a;\
}\
.enemy-vfx-beast-shadow::after {\
    content: "";\
    position: absolute;\
    left: 8px;\
    bottom: -8px;\
    width: 8px;\
    height: 14px;\
    border-radius: 8px;\
    background: rgba(60,28,10,0.95);\
    box-shadow: 18px 1px 0 rgba(60,28,10,0.95), 34px -1px 0 rgba(60,28,10,0.95);\
}\
.enemy-vfx-manic-afterimage {\
    width: 150px;\
    height: 34px;\
    margin-left: -75px;\
    margin-top: -17px;\
    border-radius: 999px;\
    background: repeating-linear-gradient(90deg, transparent 0 12px, rgba(255,40,80,0.65) 12px 22px, transparent 22px 34px);\
    filter: drop-shadow(0 0 16px #ff3355);\
    animation-name: enemyManicAfterimage !important;\
}\
.enemy-vfx-manic-afterimage-2 {\
    background: repeating-linear-gradient(90deg, transparent 0 10px, rgba(180,40,255,0.55) 10px 18px, transparent 18px 30px);\
    filter: drop-shadow(0 0 14px #bb66ff);\
}\
.enemy-vfx-toxic-glob {\
    width: 32px;\
    height: 32px;\
    margin-left: -16px;\
    margin-top: -16px;\
    border-radius: 50%;\
    background: radial-gradient(circle, #d8ffb0, #66ff66 42%, #228822 72%);\
    box-shadow: 0 0 18px #66ff66;\
    animation-name: enemyToxicGlob !important;\
}\
.enemy-vfx-toxic-cloud {\
    width: 72px;\
    height: 54px;\
    margin-left: -36px;\
    margin-top: -27px;\
    border-radius: 50%;\
    background: radial-gradient(circle, rgba(180,255,120,0.78), rgba(60,180,60,0.35) 48%, transparent 72%);\
    filter: blur(3px) drop-shadow(0 0 16px #66ff66);\
    animation-name: enemyToxicCloud !important;\
}\
.enemy-vfx-toxic-splat {\
    width: 62px;\
    height: 42px;\
    margin-left: -31px;\
    margin-top: -21px;\
    border-radius: 48% 52% 42% 58%;\
    background: radial-gradient(circle at 38% 42%, #dcff8a, #66ff66 38%, #1f7f2b 68%, transparent 72%);\
    box-shadow: 0 0 20px #66ff66;\
    animation-name: enemyToxicSplat !important;\
}\
/* ===== 恐鸟专属华丽VFX ===== */\
.moavfx-plasma-bolt { width: 36px !important; height: 14px !important; margin-left: -18px !important; margin-top: -7px !important; border-radius: 999px !important; background: linear-gradient(90deg, rgba(68,255,136,0.2), #44ff88 40%, #aaffcc 70%, #fff 90%) !important; box-shadow: 0 0 12px #44ff88, 0 0 24px rgba(68,255,136,0.5), inset 0 0 6px rgba(255,255,255,0.6) !important; animation-name: enemyProjectileFly !important; }\
.moavfx-plasma-bolt::before { content: "" !important; position: absolute !important; right: -8px !important; top: 2px !important; width: 16px !important; height: 10px !important; border-radius: 999px !important; background: radial-gradient(ellipse, rgba(68,255,136,0.6), transparent) !important; }\
.moavfx-charge-glow { width: 64px !important; height: 84px !important; margin-left: -32px !important; margin-top: -42px !important; border-radius: 12px !important; background: linear-gradient(135deg, rgba(102,170,255,0.35), rgba(102,170,255,0.08)) !important; border: 2px solid rgba(102,170,255,0.6) !important; box-shadow: 0 0 20px rgba(102,170,255,0.7), 0 0 40px rgba(102,170,255,0.3), inset 0 0 15px rgba(102,170,255,0.2) !important; animation-name: enemyShieldCharge !important; }\
@keyframes moaEnergyRing { 0% { opacity: 0; transform: scale(0.3) rotate(0deg); } 20% { opacity: 1; transform: scale(0.8) rotate(60deg); } 50% { opacity: 0.8; transform: scale(1.2) rotate(180deg); } 100% { opacity: 0; transform: scale(1.8) rotate(360deg); } }\
.moavfx-energy-ring { width: 80px !important; height: 80px !important; margin-left: -40px !important; margin-top: -40px !important; border-radius: 50% !important; border: 3px solid rgba(102,170,255,0.7) !important; box-shadow: 0 0 15px rgba(102,170,255,0.6), inset 0 0 15px rgba(102,170,255,0.2) !important; animation-name: moaEnergyRing !important; }\
.moavfx-railgun-beam { width: 120px !important; height: 6px !important; margin-left: -60px !important; margin-top: -3px !important; border-radius: 999px !important; background: linear-gradient(90deg, transparent, #4488ff 20%, #88bbff 50%, #fff 80%, #fff) !important; box-shadow: 0 0 20px #4488ff, 0 0 40px rgba(68,136,255,0.5), 0 0 60px rgba(68,136,255,0.2) !important; animation-name: enemyProjectileFly !important; }\
.moavfx-railgun-spark { width: 24px !important; height: 24px !important; margin-left: -12px !important; margin-top: -12px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #88bbff 30%, #4488ff 60%, transparent 72%) !important; box-shadow: 0 0 18px #4488ff, 0 0 36px rgba(68,136,255,0.5) !important; animation-name: enemyImpactBurst !important; }\
.moavfx-lava-flame { width: 180px !important; height: 80px !important; margin-left: -8px !important; margin-top: -40px !important; border-radius: 999px !important; background: radial-gradient(ellipse at left, #fff8e0, #ffcc44 20%, #ff6600 45%, #cc2200 65%, transparent 80%) !important; filter: blur(1.5px) drop-shadow(0 0 22px #ff6622) drop-shadow(0 0 44px rgba(255,68,0,0.4)) !important; transform-origin: left center !important; animation-name: enemyFlameCone !important; }\
.moavfx-lava-flame::before { content: "" !important; position: absolute !important; left: 20px !important; top: 12px !important; width: 140px !important; height: 55px !important; border-radius: 999px !important; background: radial-gradient(ellipse at left, rgba(255,255,200,0.6), rgba(255,120,30,0.3) 50%, transparent 75%) !important; animation: enemyFlameCone 400ms ease-in-out infinite alternate !important; }\
.moavfx-heat-wave { width: 200px !important; height: 30px !important; margin-left: -100px !important; margin-top: -15px !important; border-radius: 999px !important; background: linear-gradient(90deg, transparent, rgba(255,136,68,0.4) 20%, rgba(255,68,0,0.6) 50%, rgba(255,136,68,0.4) 80%, transparent) !important; filter: blur(2px) drop-shadow(0 0 16px #ff6622) !important; animation-name: enemyGroundShockwave !important; }\
.moavfx-stomp-wave { width: 56px !important; height: 22px !important; margin-left: -28px !important; margin-top: -11px !important; border-radius: 50% !important; border: 3px solid #ffaa00 !important; background: radial-gradient(ellipse, rgba(255,170,0,0.3), transparent 70%) !important; box-shadow: 0 0 24px #ffaa00, 0 0 48px rgba(255,170,0,0.3) !important; animation-name: enemyGroundShockwave !important; }\
.moavfx-shock-field { width: 90px !important; height: 90px !important; margin-left: -45px !important; margin-top: -45px !important; border-radius: 50% !important; background: radial-gradient(circle, rgba(255,255,200,0.4), rgba(255,200,60,0.2) 40%, rgba(255,136,0,0.1) 65%, transparent 75%) !important; box-shadow: 0 0 30px rgba(255,170,0,0.6), 0 0 60px rgba(255,136,0,0.25) !important; animation-name: enemyImpactBurst !important; }\
@keyframes moaDiscSpin { 0% { transform: rotate(0deg) scale(0.8); opacity: 0.8; } 50% { transform: rotate(540deg) scale(1.1); opacity: 1; } 100% { transform: rotate(1080deg) scale(0.9); opacity: 0.6; } }\
.moavfx-energy-disc { width: 44px !important; height: 44px !important; margin-left: -22px !important; margin-top: -22px !important; border-radius: 50% !important; background: radial-gradient(circle, #aaddff, #66aaff 40%, #3388dd 70%, #2255aa) !important; border: 3px solid #88ccff !important; box-shadow: 0 0 16px #66aaff, 0 0 32px rgba(102,170,255,0.4), inset 0 0 10px rgba(255,255,255,0.3) !important; animation-name: moaDiscSpin !important; }\
.moavfx-energy-disc::before { content: "" !important; position: absolute !important; left: 50% !important; top: 50% !important; width: 16px !important; height: 16px !important; margin-left: -8px !important; margin-top: -8px !important; border-radius: 50% !important; background: #fff !important; box-shadow: 0 0 8px #88ccff !important; }\
.moavfx-rocket { width: 40px !important; height: 14px !important; margin-left: -20px !important; margin-top: -7px !important; border-radius: 999px !important; background: linear-gradient(90deg, #444, #888 30%, #ff6644 70%, #ff8866) !important; box-shadow: 0 0 16px #ff6644, 0 0 32px rgba(255,102,68,0.4) !important; animation-name: enemyRocketFly !important; }\
.moavfx-rocket::before { content: "" !important; position: absolute !important; right: -18px !important; top: 3px !important; width: 22px !important; height: 8px !important; border-radius: 999px !important; background: linear-gradient(90deg, rgba(255,136,68,0.8), rgba(255,200,100,0.4), transparent) !important; filter: blur(1px) !important; }\
.moavfx-cryo-beam { width: 160px !important; height: 56px !important; margin-left: -8px !important; margin-top: -28px !important; border-radius: 999px !important; background: radial-gradient(ellipse at left, #e0f8ff, #88ddff 25%, #44aadd 50%, #2288bb 70%, transparent 82%) !important; filter: blur(1px) drop-shadow(0 0 20px #88ddff) drop-shadow(0 0 40px rgba(136,221,255,0.3)) !important; transform-origin: left center !important; animation-name: enemyFlameCone !important; }\
.moavfx-cryo-shard { width: 18px !important; height: 28px !important; margin-left: -9px !important; margin-top: -14px !important; border-radius: 3px 3px 50% 50% !important; background: linear-gradient(180deg, #fff, #ccf0ff 30%, #88ccff 70%) !important; box-shadow: 0 0 10px #88ddff, 0 0 20px rgba(136,221,255,0.4) !important; animation-name: enemyProjectileFly !important; transform: rotate(-15deg) !important; }\
.moavfx-ice-explosion { width: 60px !important; height: 60px !important; margin-left: -30px !important; margin-top: -30px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ccf0ff 30%, #88ccff 55%, rgba(136,204,255,0.3) 75%, transparent) !important; box-shadow: 0 0 30px #88ddff, 0 0 60px rgba(136,221,255,0.4) !important; animation-name: enemyImpactBurst !important; }\
.moavfx-explode-core { width: 56px !important; height: 56px !important; margin-left: -28px !important; margin-top: -28px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffcc44 25%, #ff6600 50%, #cc2200 72%, transparent 85%) !important; box-shadow: 0 0 30px #ff6600, 0 0 60px rgba(255,68,0,0.5), 0 0 90px rgba(255,68,0,0.2) !important; animation-name: enemyExplosion !important; }\
.moavfx-explode-ring { width: 70px !important; height: 24px !important; margin-left: -35px !important; margin-top: -12px !important; border-radius: 50% !important; border: 4px solid rgba(255,136,0,0.7) !important; background: radial-gradient(ellipse, rgba(255,136,0,0.2), transparent 70%) !important; box-shadow: 0 0 24px #ff8800, 0 0 48px rgba(255,136,0,0.3) !important; animation-name: enemyGroundShockwave !important; }\
.moavfx-heal-wave { width: 70px !important; height: 70px !important; margin-left: -35px !important; margin-top: -35px !important; border-radius: 50% !important; border: 2px solid rgba(68,255,136,0.6) !important; background: radial-gradient(circle, rgba(68,255,136,0.3), rgba(68,255,136,0.1) 50%, transparent 70%) !important; box-shadow: 0 0 24px rgba(68,255,136,0.6), 0 0 48px rgba(68,255,136,0.25) !important; animation-name: moaEnergyRing !important; }\
.moavfx-kick-arc { width: 100px !important; height: 44px !important; margin-left: -24px !important; margin-top: -22px !important; border-radius: 50% !important; border-top: 5px solid #cccccc !important; border-right: 3px solid rgba(255,255,255,0.8) !important; filter: drop-shadow(0 0 14px #cccccc) drop-shadow(0 0 28px rgba(200,200,200,0.4)) !important; animation-name: enemySlashArc !important; }\
.moavfx-drone { width: 28px !important; height: 28px !important; margin-left: -14px !important; margin-top: -14px !important; border-radius: 50% !important; background: radial-gradient(circle, #ddddff, #aaaacc 40%, #8888aa 70%) !important; border: 2px solid #bbbbdd !important; box-shadow: 0 0 14px rgba(170,170,204,0.6), 0 0 28px rgba(170,170,204,0.25) !important; animation-name: enemyToxicGlob !important; }\
@keyframes moaDroneProp { 0% { transform: rotate(0deg); opacity: 0.7; } 50% { transform: rotate(180deg); opacity: 1; } 100% { transform: rotate(360deg); opacity: 0.7; } }\
.moavfx-drone::before { content: "" !important; position: absolute !important; top: -10px !important; left: 50% !important; width: 20px !important; height: 4px !important; margin-left: -10px !important; border-radius: 999px !important; background: rgba(187,187,221,0.7) !important; animation-name: moaDroneProp !important; animation-duration: 150ms !important; animation-iteration-count: infinite !important; }\
.moavfx-mini-laser { width: 26px !important; height: 8px !important; margin-left: -13px !important; margin-top: -4px !important; border-radius: 999px !important; background: linear-gradient(90deg, rgba(136,255,170,0.2), #88ffaa 40%, #ccffdd 70%, #fff 90%) !important; box-shadow: 0 0 10px #88ffaa, 0 0 20px rgba(136,255,170,0.4) !important; animation-name: enemyProjectileFly !important; }\
.moavfx-self-destruct-flash { width: 90px !important; height: 90px !important; margin-left: -45px !important; margin-top: -45px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ffcc44 20%, #ff4444 50%, #cc0000 70%, transparent 85%) !important; box-shadow: 0 0 40px #ff4444, 0 0 80px rgba(255,68,68,0.5), 0 0 120px rgba(255,0,0,0.2) !important; animation-name: enemyExplosion !important; }\
.moavfx-magnetized-ball { width: 38px !important; height: 38px !important; margin-left: -19px !important; margin-top: -19px !important; border-radius: 50% !important; background: radial-gradient(circle, #fff, #ff8844 30%, #ff4400 60%, #cc2200 80%) !important; box-shadow: 0 0 20px #ff4400, 0 0 40px rgba(255,68,0,0.5), 0 0 60px rgba(255,68,0,0.2) !important; animation-name: enemyToxicGlob !important; }\
@keyframes moaChargeTrail { 0% { opacity: 0.8; transform: scale(1); } 100% { opacity: 0; transform: scale(0.5) translateX(-40px); } }\
.moavfx-charge-trail { width: 50px !important; height: 70px !important; margin-left: -25px !important; margin-top: -35px !important; border-radius: 10px 26px 26px 10px !important; background: linear-gradient(90deg, rgba(102,170,255,0.4), rgba(102,170,255,0.1), transparent) !important; filter: blur(2px) drop-shadow(0 0 14px rgba(102,170,255,0.6)) !important; animation-name: moaChargeTrail !important; }\
.enemy-target-aim-locked::before, .enemy-target-toxic-stuck::before, .enemy-target-burning::before {\
    content: "";\
    position: absolute;\
    inset: -10px;\
    pointer-events: none;\
    z-index: 6;\
}\
.enemy-target-aim-locked::before {\
    border: 2px solid rgba(255, 55, 55, 0.88);\
    box-shadow: 0 0 18px rgba(255, 55, 55, 0.8), inset 0 0 18px rgba(255,55,55,0.18);\
    clip-path: polygon(0 0, 28% 0, 28% 8%, 8% 8%, 8% 28%, 0 28%, 0 0, 72% 0, 100% 0, 100% 28%, 92% 28%, 92% 8%, 72% 8%, 72% 0, 100% 72%, 100% 100%, 72% 100%, 72% 92%, 92% 92%, 92% 72%, 100% 72%, 28% 100%, 0 100%, 0 72%, 8% 72%, 8% 92%, 28% 92%, 28% 100%);\
    animation: enemyAimLockOn 900ms ease both;\
}\
.enemy-target-toxic-stuck::before {\
    background: radial-gradient(circle, rgba(160,255,90,0.85), rgba(50,180,50,0.35) 45%, transparent 70%);\
    filter: blur(2px) drop-shadow(0 0 12px #66ff66);\
    animation: enemyToxicOnTarget 1100ms ease both;\
}\
.enemy-target-burning::before {\
    background: linear-gradient(0deg, rgba(255,80,0,0.8), rgba(255,210,80,0.35), transparent 70%);\
    filter: blur(1px) drop-shadow(0 0 12px #ff6622);\
    animation: enemyBurnOnTarget 900ms ease both;\
}\
.enemy-target-explosion-hit { animation: enemyTargetExplosionHit 900ms ease both !important; }\
.enemy-target-suppressed { animation: enemyTargetSuppressed 760ms linear both !important; }\
.skill-status-stun::before, .skill-status-bleed::before, .skill-status-burn::before, .skill-status-toxin::before, .skill-status-disarm::before, .skill-status-manic-locked::before {\
    content: "";\
    position: absolute;\
    inset: -10px;\
    display: block !important;\
    pointer-events: none;\
    z-index: 8;\
}\
#battlePlayerIcon.skill-status-stun::before, #battlePlayerIcon.skill-status-bleed::before, #battlePlayerIcon.skill-status-burn::before, #battlePlayerIcon.skill-status-toxin::before, #battlePlayerIcon.skill-status-disarm::before, #battleEnemyIcon.skill-status-bleed::before, #battleEnemyIcon.skill-status-manic-locked::before {\
    display: block !important;\
}\
.skill-status-stun::before {\
    border-radius: 50%;\
    border: 2px dashed rgba(255,220,80,0.9);\
    box-shadow: 0 0 18px rgba(255,220,80,0.95);\
    animation: statusStunSpin 900ms linear infinite;\
}\
.skill-status-stun::after {\
    content: "✦ ✦ ✦";\
    position: absolute;\
    left: 50%;\
    top: -22px;\
    transform: translateX(-50%);\
    color: #ffdc50;\
    font-size: 1rem;\
    text-shadow: 0 0 10px #ffdc50;\
    animation: statusFloat 800ms ease-in-out infinite alternate;\
    z-index: 9;\
}\
.skill-status-bleed::before {\
    background: linear-gradient(180deg, rgba(255,0,60,0.7), transparent 65%);\
    filter: blur(1px) drop-shadow(0 0 12px #ff2244);\
    animation: statusPulse 700ms ease-in-out infinite;\
}\
.skill-status-burn::before {\
    background: linear-gradient(0deg, rgba(255,60,0,0.85), rgba(255,210,70,0.45), transparent 70%);\
    filter: blur(1px) drop-shadow(0 0 14px #ff6622);\
    animation: statusFlame 650ms ease-in-out infinite;\
}\
.skill-status-toxin::before {\
    border-radius: 50%;\
    background: radial-gradient(circle, rgba(160,255,90,0.75), rgba(50,180,50,0.35) 45%, transparent 72%);\
    filter: blur(2px) drop-shadow(0 0 13px #66ff66);\
    animation: statusToxin 950ms ease-in-out infinite;\
}\
.skill-status-disarm::before {\
    border-radius: 50%;\
    border: 2px solid rgba(255,180,60,0.9);\
    box-shadow: 0 0 18px rgba(255,180,60,0.85), inset 0 0 16px rgba(255,180,60,0.25);\
    clip-path: polygon(0 42%, 34% 42%, 34% 0, 66% 0, 66% 42%, 100% 42%, 100% 58%, 66% 58%, 66% 100%, 34% 100%, 34% 58%, 0 58%);\
    animation: statusDisarm 850ms ease-in-out infinite alternate;\
}\
.skill-status-manic-locked::before {\
    border-radius: 12px;\
    background: rgba(130,130,130,0.38);\
    box-shadow: inset 0 0 22px rgba(230,230,230,0.35), 0 0 18px rgba(180,180,180,0.75);\
    animation: manicGrayLock 800ms ease-in-out infinite alternate;\
}\
.enemy-picture-shield-bash { animation: enemyPictureShieldBash 720ms cubic-bezier(.14,.85,.2,1) both !important; }\
.enemy-picture-hook-pulled { animation: enemyPictureHookPulled 760ms cubic-bezier(.2,.9,.2,1) both !important; }\
.enemy-picture-teleport-slash { animation: enemyPictureTeleportSlash 720ms ease both !important; }\
.enemy-picture-jet-hover { animation: enemyPictureJetHover 920ms ease both !important; }\
.enemy-picture-commander-swap { animation: enemyPictureCommanderSwap 900ms ease both !important; }\
.enemy-picture-player-confused { animation: enemyPictureConfused 900ms ease both !important; }\
.enemy-picture-manic-pounce { animation: enemyPictureManicPounce 820ms cubic-bezier(.12,.92,.2,1) both !important; }\
.enemy-picture-nox-charge { animation: enemyPictureNoxCharge 860ms cubic-bezier(.16,.76,.2,1) both !important; }\
@keyframes enemyLineGrow { 0% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(0.05); } 25% { opacity:1; } 100% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(1); } }\
@keyframes enemyProjectileFly { 0% { opacity:0; transform: translate(0,0) rotate(var(--vfx-angle)) scale(0.7); } 18% { opacity:1; } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) rotate(var(--vfx-angle)) scale(1.05); } }\
@keyframes enemyHookSnap { 0% { opacity:0; transform:scale(0.2) rotate(-80deg); } 30% { opacity:1; transform:scale(1) rotate(20deg); } 100% { opacity:0; transform:scale(1.5) rotate(120deg); } }\
@keyframes enemyRocketFly { 0% { opacity:0; transform: translate(0,0) rotate(var(--vfx-angle)) scale(0.75); } 15% { opacity:1; } 55% { transform: translate(calc(var(--vfx-x) * 0.55), calc(var(--vfx-y) * 0.38 + var(--rocket-arc, -32px))) rotate(var(--vfx-angle)) scale(1); } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) rotate(var(--vfx-angle)) scale(1.1); } }\
@keyframes enemySpinFly { 0% { opacity:0; transform: translate(0,0) rotate(0deg) scale(0.6); } 20% { opacity:1; } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) rotate(720deg) scale(1.1); } }\
@keyframes enemySlashArc { 0% { opacity:0; transform: scale(0.4) rotate(-18deg); } 25% { opacity:1; } 100% { opacity:0; transform: translate(calc(var(--vfx-x) * 0.3), calc(var(--vfx-y) * 0.3)) scale(1.25) rotate(18deg); } }\
@keyframes enemyTeleportSmoke { 0% { opacity:0; transform: scale(0.25) rotate(0deg); } 35% { opacity:1; transform: scale(1.2) rotate(160deg); } 100% { opacity:0; transform: scale(1.8) rotate(360deg); } }\
@keyframes enemyShieldCharge { 0% { opacity:0; transform: translateX(0) scaleX(0.4); } 25% { opacity:1; } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) scaleX(1.05); } }\
@keyframes enemyShieldGhost { 0% { opacity:0; transform: translateX(0) scaleX(0.25); } 28% { opacity:0.85; } 100% { opacity:0; transform: translate(calc(var(--vfx-x) * 0.62), var(--vfx-y)) scaleX(1.35); } }\
@keyframes enemyImpactBurst { 0% { opacity:1; transform: scale(0.15); } 100% { opacity:0; transform: scale(3.2); } }\
@keyframes enemyFlameCone { 0% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(0.15); } 25% { opacity:0.95; } 100% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(1.3); } }\
@keyframes enemyLatcherRoll { 0% { opacity:0; transform: translate(0,0) rotate(0deg); } 20% { opacity:1; } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) rotate(900deg); } }\
@keyframes enemyJetFlame { 0%,100% { opacity:0; transform: scaleY(0.3); } 35%,70% { opacity:0.95; transform: scaleY(1.2); } }\
@keyframes enemyGroundShockwave { 0% { opacity:0; transform: scale(0.25); } 35% { opacity:1; } 100% { opacity:0; transform: scale(5.5); } }\
@keyframes enemyBeastPounce { 0% { opacity:0; transform: translate(0,0) scale(0.6); } 25% { opacity:1; } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.2); } }\
@keyframes enemyManicAfterimage { 0% { opacity:0; transform: translateX(0) scaleX(0.2); } 30% { opacity:0.9; } 100% { opacity:0; transform: translate(calc(var(--vfx-x) * 0.75), var(--vfx-y)) scaleX(1.2); } }\
@keyframes enemyToxicGlob { 0% { opacity:0; transform: translate(0,0) scale(0.55); } 25% { opacity:1; } 60% { transform: translate(calc(var(--vfx-x) * 0.58), calc(var(--vfx-y) * 0.45 - 28px)) scale(1); } 100% { opacity:0; transform: translate(var(--vfx-x), var(--vfx-y)) scale(1.18); } }\
@keyframes enemyToxicCloud { 0% { opacity:0; transform: scale(0.25); } 35% { opacity:0.9; transform: scale(1.25); } 100% { opacity:0; transform: scale(2.4); } }\
@keyframes enemyToxicSplat { 0% { opacity:0; transform: scale(0.18) rotate(0deg); } 28% { opacity:1; transform: scale(1.25) rotate(18deg); } 100% { opacity:0; transform: scale(1.8) rotate(-22deg); } }\
@keyframes enemyWarningReticle { 0% { opacity:0; transform: scale(1.55) rotate(0deg); } 30% { opacity:1; transform: scale(0.9) rotate(90deg); } 75% { opacity:0.85; transform: scale(1.04) rotate(180deg); } 100% { opacity:0; transform: scale(0.62) rotate(260deg); } }\
@keyframes enemySwitchBeam { 0% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(0.08); } 24% { opacity:1; transform: rotate(var(--vfx-angle)) scaleX(1); } 70% { opacity:0.9; transform: rotate(var(--vfx-angle)) scaleX(1); } 100% { opacity:0; transform: rotate(var(--vfx-angle)) scaleX(0.18); } }\
@keyframes enemyAimLockOn { 0% { opacity:0; transform:scale(1.5) rotate(0deg); } 35% { opacity:1; transform:scale(1) rotate(0deg); } 70% { opacity:0.95; transform:scale(1.08) rotate(2deg); } 100% { opacity:0; transform:scale(0.85) rotate(-2deg); } }\
@keyframes enemyToxicOnTarget { 0% { opacity:0; transform:scale(0.45); } 35% { opacity:1; transform:scale(1.05); } 100% { opacity:0; transform:scale(1.4); } }\
@keyframes enemyBurnOnTarget { 0% { opacity:0; transform:translateY(16px) scaleY(0.35); } 35% { opacity:1; transform:translateY(0) scaleY(1.05); } 100% { opacity:0; transform:translateY(-18px) scaleY(1.25); } }\
@keyframes enemyTargetExplosionHit { 0%,100% { transform:translate(0,0) scale(1); filter:brightness(1); } 36% { transform:translateX(-12px) scale(1.06); filter:brightness(2.4) drop-shadow(0 0 22px #ff6622); } 52% { transform:translateX(10px) scale(1.03); } 68% { transform:translateX(-5px) scale(1.01); } }\
@keyframes enemyTargetSuppressed { 0%,100% { transform:translateX(0); filter:brightness(1); } 15% { transform:translateX(-3px); filter:brightness(1.5); } 30% { transform:translateX(4px); } 45% { transform:translateX(-4px); } 60% { transform:translateX(3px); } 75% { transform:translateX(-2px); } }\
@keyframes statusStunSpin { 0% { transform:rotate(0deg) scale(0.92); opacity:0.75; } 50% { transform:rotate(180deg) scale(1.08); opacity:1; } 100% { transform:rotate(360deg) scale(0.92); opacity:0.75; } }\
@keyframes statusFloat { 0% { transform:translate(-50%, 0); } 100% { transform:translate(-50%, -6px); } }\
@keyframes statusPulse { 0%,100% { opacity:0.35; transform:scaleY(0.85); } 50% { opacity:0.9; transform:scaleY(1.12); } }\
@keyframes statusFlame { 0%,100% { opacity:0.55; transform:translateY(6px) scaleY(0.9); } 50% { opacity:1; transform:translateY(-5px) scaleY(1.15); } }\
@keyframes statusToxin { 0%,100% { opacity:0.45; transform:scale(0.85); } 50% { opacity:0.9; transform:scale(1.15); } }\
@keyframes statusDisarm { 0% { opacity:0.45; transform:rotate(-18deg) scale(0.9); } 100% { opacity:0.95; transform:rotate(18deg) scale(1.08); } }\
@keyframes manicGrayLock { 0% { opacity:0.45; filter:grayscale(0.6); } 100% { opacity:0.9; filter:grayscale(1); } }\
@keyframes enemyPictureShieldBash { 0% { transform: translateX(0); filter:brightness(1); } 45% { transform: translateX(var(--dash-x)) scale(1.08); filter:brightness(1.7) drop-shadow(0 0 18px #8edbff); } 100% { transform: translateX(0); filter:brightness(1); } }\
@keyframes enemyPictureHookPulled { 0% { transform: translate(0,0); } 28% { transform: translate(calc(var(--pull-x) * .4), calc(var(--pull-y) * .4)) rotate(-3deg); filter:brightness(1.3); } 52% { transform: translate(var(--pull-x), var(--pull-y)) rotate(-9deg) scale(0.96); filter:brightness(1.7) drop-shadow(0 0 16px #ffaa44); } 72% { transform: translate(calc(var(--pull-x) * .35), calc(var(--pull-y) * .35)) rotate(5deg); } 100% { transform: translate(0,0); } }\
@keyframes enemyPictureTeleportSlash { 0% { opacity:1; transform:translateX(0); filter:brightness(1); } 22% { opacity:0; transform:translateX(10px); filter:brightness(2) drop-shadow(0 0 18px #bb66ff); } 42% { opacity:0; transform:translateX(var(--dash-x)); } 58% { opacity:1; transform:translateX(var(--dash-x)) scale(1.12); filter:brightness(2.4) drop-shadow(0 0 24px #ff6633); } 100% { opacity:1; transform:translateX(0); filter:brightness(1); } }\
@keyframes enemyPictureJetHover { 0% { transform:translateY(0) rotate(0deg); filter:brightness(1); } 20% { transform:translateY(-30px) rotate(-4deg); filter:brightness(1.8) drop-shadow(0 0 18px #ff8844); } 44% { transform:translateY(-58px) rotate(5deg); filter:brightness(2.15) drop-shadow(0 0 24px #ff8844); } 76% { transform:translateY(-52px) rotate(-2deg); } 100% { transform:translateY(0) rotate(0deg); filter:brightness(1); } }\
@keyframes enemyPictureCommanderSwap { 0% { transform:translateX(0); filter:brightness(1); } 35% { transform:translateX(var(--swap-x)); filter:brightness(2.2) drop-shadow(0 0 20px #ff9900); } 100% { transform:translateX(0); filter:brightness(1); } }\
@keyframes enemyPictureConfused { 0%,100% { transform:translateX(0) rotate(0deg); } 25% { transform:translateX(var(--swap-x)) rotate(5deg); filter:brightness(1.6); } 55% { transform:translateX(calc(var(--swap-x) * .5)) rotate(-5deg); } }\
@keyframes enemyPictureManicPounce { 0% { opacity:1; transform:translateX(0); } 20% { opacity:.25; transform:translateX(-18px); } 48% { opacity:1; transform:translateX(var(--dash-x)) scale(1.12); filter:brightness(2.4) drop-shadow(0 0 22px #ff3355); } 100% { opacity:1; transform:translateX(0); filter:brightness(1); } }\
@keyframes enemyPictureNoxCharge { 0% { transform:translateX(0) scale(1); } 46% { transform:translateX(var(--dash-x)) scale(1.12); filter:brightness(1.8) drop-shadow(0 0 20px #66ff66); } 100% { transform:translateX(0) scale(1); filter:brightness(1); } }\
.boss-arena-vor {\
    position: relative;\
    isolation: isolate;\
    overflow: hidden;\
    min-height: 660px;\
    padding-top: 22px;\
}\
.boss-arena-vor::before {\
    content: "";\
    position: absolute;\
    inset: 8px -28px 70px -28px;\
    border-radius: 28px;\
    pointer-events: none;\
    z-index: 0;\
    background: linear-gradient(135deg, rgba(15,18,24,0.38), rgba(0,0,0,0.08));\
    border: 1px solid rgba(255,255,255,0.08);\
    box-shadow: inset 0 0 34px rgba(0,0,0,0.32);\
}\
.boss-arena-vor-awakened::before {\
    background: radial-gradient(circle at 72% 34%, rgba(255,210,90,0.30), transparent 24%), radial-gradient(circle at 28% 62%, rgba(139,0,0,0.46), transparent 34%), linear-gradient(135deg, rgba(80,22,0,0.46), rgba(10,8,6,0.08));\
    border-color: rgba(255,176,78,0.42);\
    box-shadow: inset 0 0 70px rgba(255,130,40,0.24), 0 0 36px rgba(255,120,40,0.12);\
    animation: vorArenaBreath 2600ms ease-in-out infinite alternate;\
}\
.boss-arena-vor::after {\
    content: "JANUS KEY LOCK";\
    position: absolute;\
    left: 50%;\
    top: 70px;\
    transform: translateX(-50%);\
    color: rgba(255,210,120,0.38);\
    font-family: Orbitron, monospace;\
    font-size: 0.72rem;\
    letter-spacing: 5px;\
    text-shadow: 0 0 14px rgba(255,190,80,0.7);\
    pointer-events: none;\
    animation: vorArenaSignal 1800ms ease-in-out infinite alternate;\
    z-index: 2;\
    opacity: 0;\
}\
.boss-arena-vor-awakened::after { opacity: 1; }\
.vor-arena-layer {\
    position: absolute;\
    inset: 8px -28px 70px -28px;\
    border-radius: 28px;\
    overflow: hidden;\
    pointer-events: none;\
    z-index: 1;\
}\
.vor-arena-grid {\
    position: absolute;\
    inset: 0;\
    background-image: linear-gradient(rgba(255,190,80,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,190,80,0.10) 1px, transparent 1px);\
    background-size: 34px 34px;\
    opacity: 0.34;\
    transform: perspective(320px) rotateX(58deg) translateY(22px) scale(1.35);\
    animation: vorGridDrift 3600ms linear infinite;\
}\
.vor-arena-core {\
    position: absolute;\
    right: 15%;\
    top: 24%;\
    width: 92px;\
    height: 92px;\
    border-radius: 50%;\
    background: radial-gradient(circle, rgba(255,245,180,0.9), rgba(255,170,50,0.42) 40%, transparent 66%);\
    box-shadow: 0 0 30px rgba(255,210,90,0.85), 0 0 72px rgba(255,120,40,0.45);\
    animation: vorCorePulse 1500ms ease-in-out infinite alternate;\
}\
.vor-arena-core::before, .vor-arena-core::after {\
    content: "";\
    position: absolute;\
    inset: -18px;\
    border-radius: 50%;\
    border: 2px dashed rgba(255,220,130,0.58);\
    animation: vorCoreSpin 3200ms linear infinite;\
}\
.vor-arena-core::after {\
    inset: -32px;\
    border-style: solid;\
    border-color: rgba(114,215,255,0.28);\
    animation-duration: 5200ms;\
    animation-direction: reverse;\
}\
.vor-arena-keymark {\
    position: absolute;\
    right: 12%;\
    top: 14%;\
    font-family: Orbitron, monospace;\
    color: rgba(255,220,130,0.44);\
    font-size: 0.78rem;\
    letter-spacing: 6px;\
    text-shadow: 0 0 12px rgba(255,210,100,0.9);\
}\
.vor-arena-scan {\
    position: absolute;\
    left: -20%;\
    right: -20%;\
    height: 2px;\
    background: linear-gradient(90deg, transparent, rgba(255,215,120,0.78), transparent);\
    box-shadow: 0 0 14px rgba(255,215,120,0.7);\
    animation: vorScanSweep 2200ms linear infinite;\
}\
.vor-arena-scan-a { top: 28%; }\
.vor-arena-scan-b { top: 62%; animation-delay: 780ms; opacity: 0.55; }\
.vor-arena-warning {\
    position: absolute;\
    left: 24px;\
    bottom: 18px;\
    color: rgba(255,120,70,0.54);\
    font-family: Orbitron, monospace;\
    letter-spacing: 4px;\
    font-size: 0.68rem;\
    animation: vorWarningBlink 980ms steps(2,end) infinite;\
}\
.boss-arena-vor-stage2 .vor-arena-core { filter: hue-rotate(18deg) brightness(1.12); }\
.boss-arena-vor-stage3 .vor-arena-core { filter: hue-rotate(70deg) brightness(1.25); animation-duration: 900ms; }\
.boss-arena-vor-stage3::before { box-shadow: inset 0 0 90px rgba(255,90,220,0.26), 0 0 48px rgba(255,80,180,0.18); }\
.boss-vor-avatar {\
    filter: drop-shadow(0 0 16px rgba(255,190,80,0.9)) drop-shadow(0 0 28px rgba(139,0,0,0.8));\
}\
.boss-vor-avatar::after {\
    content: "🔑";\
    position: absolute;\
    right: -18px;\
    top: -18px;\
    font-size: 1.15rem;\
    filter: drop-shadow(0 0 10px #ffd36a);\
    animation: vorKeyOrbit 1500ms linear infinite;\
}\
.boss-vor-target {\
    filter: drop-shadow(0 0 10px rgba(0,212,255,0.45));\
}\
.vor-mechanic-panel {\
    position: absolute;\
    left: auto;\
    right: 10px;\
    top: 10px;\
    transform: none;\
    width: 210px;\
    max-width: calc(100% - 20px);\
    box-sizing: border-box;\
    overflow: hidden;\
    padding: 8px 10px;\
    border-radius: 10px;\
    border: 1px solid rgba(255,215,110,0.72);\
    background: linear-gradient(135deg, rgba(15,8,0,0.88), rgba(92,22,0,0.66));\
    box-shadow: 0 0 24px rgba(255,180,70,0.32), inset 0 0 22px rgba(255,215,110,0.12);\
    z-index: 18;\
    pointer-events: none;\
    animation: vorMechanicPanelIn 260ms ease both;\
}\
.vor-mechanic-panel.completed {\
    border-color: rgba(114,215,255,0.95);\
    box-shadow: 0 0 30px rgba(114,215,255,0.42), inset 0 0 24px rgba(255,215,110,0.16);\
}\
.vor-mechanic-title {\
    color: #ffd36a;\
    font-family: Orbitron, monospace;\
    font-size: 0.6rem;\
    letter-spacing: 1px;\
    margin-bottom: 4px;\
    text-align: left;\
    display: flex;\
    justify-content: space-between;\
    align-items: center;\
    gap: 8px;\
    min-width: 0;\
}\
.vor-mechanic-title span { color: #ff8844; font-size: 0.58rem; flex: 0 0 auto; }\
.vor-mechanic-hint {\
    color: rgba(230,235,255,0.82);\
    font-size: 0.52rem;\
    text-align: left;\
    margin-bottom: 6px;\
    line-height: 1.35;\
    white-space: normal;\
}\
.vor-mechanic-progress {\
    position: relative;\
    height: 8px;\
    border-radius: 999px;\
    overflow: hidden;\
    background: rgba(0,0,0,0.48);\
    border: 1px solid rgba(255,215,110,0.28);\
}\
.vor-mechanic-progress span {\
    position: absolute;\
    inset: -5px 0 0 0;\
    color: #fff2b8;\
    font-family: Orbitron, monospace;\
    font-size: 0.62rem;\
    text-align: center;\
    z-index: 2;\
    text-shadow: 0 0 8px #000;\
}\
.vor-mechanic-progress i {\
    display: block;\
    width: 0%;\
    height: 100%;\
    background: linear-gradient(90deg, #ff8844, #ffd36a, #72d7ff);\
    box-shadow: 0 0 16px rgba(255,215,110,0.8);\
    transition: width 180ms ease;\
}\
.vor-interact-node {\
    position: absolute;\
    width: 64px;\
    height: 64px;\
    margin-left: -32px;\
    margin-top: -32px;\
    border-radius: 50%;\
    border: 2px solid rgba(255,215,110,0.9);\
    background: radial-gradient(circle, rgba(255,245,180,0.92), rgba(255,145,46,0.75) 45%, rgba(90,20,0,0.72));\
    color: #2a1000;\
    font-family: Orbitron, monospace;\
    font-weight: 800;\
    cursor: pointer;\
    z-index: 22;\
    box-shadow: 0 0 18px rgba(255,215,110,0.92), 0 0 36px rgba(255,90,40,0.38);\
    animation: vorInteractNodePulse 850ms ease-in-out infinite alternate;\
}\
.vor-arena-event {\
    position: absolute;\
    inset: 8px -28px 70px -28px;\
    border-radius: 28px;\
    overflow: hidden;\
    pointer-events: none;\
    z-index: 14;\
}\
.vor-event-title {\
    position: absolute;\
    left: 50%;\
    top: 18px;\
    transform: translateX(-50%);\
    color: rgba(255,245,190,0.72);\
    font-family: Orbitron, monospace;\
    font-size: 0.82rem;\
    letter-spacing: 6px;\
    text-shadow: 0 0 18px #ffd36a;\
}\
.vor-skill-active {\
    animation: vorArenaShake 240ms linear 6;\
}\
.vor-event-beam {\
    position: absolute;\
    left: -10%;\
    width: 120%;\
    height: 34px;\
    border-radius: 999px;\
    background: linear-gradient(90deg, transparent, rgba(255,245,180,0.9), rgba(114,215,255,0.7), transparent);\
    box-shadow: 0 0 34px rgba(255,215,110,0.9), 0 0 70px rgba(114,215,255,0.45);\
    transform-origin: center;\
    animation: vorArenaBeamSweep 1280ms ease-in-out both;\
}\
.vor-event-beam-main { top: 46%; transform: rotate(-10deg); }\
.vor-event-beam-sub-a { top: 28%; height: 16px; animation-delay: 160ms; transform: rotate(14deg); opacity: 0.72; }\
.vor-event-beam-sub-b { top: 66%; height: 16px; animation-delay: 280ms; transform: rotate(5deg); opacity: 0.62; }\
.vor-event-rift-door {\
    position: absolute;\
    width: 150px;\
    height: 220px;\
    border-radius: 50%;\
    border: 3px solid rgba(114,215,255,0.66);\
    background: radial-gradient(circle, rgba(114,215,255,0.30), rgba(255,215,110,0.18), transparent 70%);\
    box-shadow: 0 0 42px rgba(114,215,255,0.7), inset 0 0 34px rgba(255,215,110,0.22);\
    animation: vorRiftDoorOpen 1180ms ease both;\
}\
.vor-event-rift-left { left: 6%; top: 28%; }\
.vor-event-rift-mid { left: 43%; top: 18%; }\
.vor-event-rift-right { right: 6%; top: 34%; }\
.vor-event-minefield {\
    position: absolute;\
    inset: 18% 6% 10% 6%;\
    background-image: radial-gradient(circle, rgba(255,80,50,0.52) 0 7px, transparent 8px), linear-gradient(rgba(255,80,50,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,80,50,0.15) 1px, transparent 1px);\
    background-size: 86px 72px, 34px 34px, 34px 34px;\
    border: 1px solid rgba(255,80,50,0.42);\
    border-radius: 24px;\
    animation: vorMinefieldPulse 920ms ease-in-out infinite alternate;\
}\
.vor-event-danger-zone {\
    position: absolute;\
    width: 30%;\
    height: 34%;\
    border-radius: 50%;\
    background: radial-gradient(circle, rgba(255,70,40,0.38), transparent 68%);\
    border: 2px dashed rgba(255,92,60,0.62);\
    animation: vorDangerZone 760ms ease-in-out infinite alternate;\
}\
.vor-event-danger-a { left: 10%; top: 48%; }\
.vor-event-danger-b { left: 38%; top: 22%; animation-delay: 180ms; }\
.vor-event-danger-c { right: 8%; top: 50%; animation-delay: 320ms; }\
.vor-event-rift-path {\
    position: absolute;\
    left: 8%;\
    right: 8%;\
    top: 48%;\
    height: 20px;\
    border-radius: 999px;\
    background: repeating-linear-gradient(90deg, transparent 0 18px, rgba(255,215,110,0.68) 18px 34px, rgba(114,215,255,0.58) 34px 52px, transparent 52px 70px);\
    filter: drop-shadow(0 0 18px #ffd36a);\
    transform: rotate(-7deg);\
    animation: vorRiftPath 980ms linear infinite;\
}\
.vor-event-shield-wall {\
    position: absolute;\
    inset: 12% 7% 12% 7%;\
    border-radius: 38px;\
    border: 4px solid rgba(114,215,255,0.72);\
    background: radial-gradient(circle at 50% 50%, rgba(114,215,255,0.10), rgba(255,215,110,0.12), transparent 70%);\
    box-shadow: inset 0 0 60px rgba(114,215,255,0.35), 0 0 44px rgba(114,215,255,0.5);\
    animation: vorShieldWall 1100ms ease-in-out infinite alternate;\
}\
.vor-event-shield-ring {\
    position: absolute;\
    left: 50%;\
    top: 50%;\
    width: 420px;\
    height: 420px;\
    margin-left: -210px;\
    margin-top: -210px;\
    border-radius: 50%;\
    border: 2px dashed rgba(255,215,110,0.58);\
    animation: vorCoreSpin 3600ms linear infinite;\
}\
.vor-event-shield-ring-b { width: 560px; height: 560px; margin-left: -280px; margin-top: -280px; animation-duration: 5600ms; animation-direction: reverse; }\
.vor-event-target-sweep {\
    position: absolute;\
    inset: 18% 8%;\
    border: 2px solid rgba(255,215,110,0.48);\
    clip-path: polygon(0 0, 100% 0, 100% 18%, 0 18%, 0 0, 0 82%, 100% 82%, 100% 100%, 0 100%);\
    animation: vorTargetSweep 880ms ease-in-out infinite alternate;\
}\
.vor-event-target-sweep-b { transform: rotate(90deg); opacity:0.58; }\
.vor-interact-node::before {\
    content: "";\
    position: absolute;\
    inset: -10px;\
    border-radius: 50%;\
    border: 1px dashed rgba(114,215,255,0.62);\
    animation: vorCoreSpin 1500ms linear infinite;\
}\
.vor-interact-node.hit {\
    pointer-events: none;\
    color: #dfffff;\
    background: radial-gradient(circle, #dfffff, #72d7ff 42%, transparent 70%);\
    border-color: rgba(114,215,255,0.98);\
    animation: vorInteractNodeHit 360ms ease both;\
}\
.vor-interact-node-1 { animation-delay: 120ms; }\
.vor-interact-node-2 { animation-delay: 240ms; }\
.vor-interact-node-3 { animation-delay: 360ms; }\
.vor-target-seer-locked::before, .vor-target-janus-rifted::before, .vor-target-mine-marked::before {\
    content: "";\
    position: absolute;\
    inset: -14px;\
    pointer-events: none;\
    z-index: 8;\
}\
.vor-target-seer-locked::before {\
    border: 2px solid rgba(255,210,90,0.9);\
    box-shadow: 0 0 18px rgba(255,210,90,0.8), inset 0 0 18px rgba(255,210,90,0.2);\
    clip-path: polygon(0 0,34% 0,34% 8%,8% 8%,8% 34%,0 34%,0 0,66% 0,100% 0,100% 34%,92% 34%,92% 8%,66% 8%,66% 0,100% 66%,100% 100%,66% 100%,66% 92%,92% 92%,92% 66%,100% 66%,34% 100%,0 100%,0 66%,8% 66%,8% 92%,34% 92%,34% 100%);\
    animation: vorAimLock 980ms ease both;\
}\
.vor-target-janus-rifted::before {\
    border-radius: 50%;\
    background: conic-gradient(from 0deg, transparent, rgba(255,215,110,0.56), transparent, rgba(114,215,255,0.42), transparent);\
    filter: blur(1px) drop-shadow(0 0 18px #ffd36a);\
    animation: vorRiftOnTarget 1320ms ease both;\
}\
.vor-target-mine-marked::before {\
    background: radial-gradient(circle, rgba(255,68,40,0.38), transparent 58%);\
    border: 2px dashed rgba(255,90,60,0.72);\
    border-radius: 50%;\
    animation: vorMineTargetPulse 1100ms ease both;\
}\
.vor-picture-seer-recoil { animation: vorSeerRecoil 980ms cubic-bezier(.17,.8,.22,1) both !important; }\
.vor-picture-janus-channel { animation: vorJanusChannel 1420ms ease both !important; }\
.vor-picture-command-cast { animation: vorCommandCast 1260ms ease both !important; }\
.vor-picture-sphere-shield { animation: vorSphereShieldPose 1280ms ease both !important; }\
.vor-vfx-seer-scope { width: 92px; height: 92px; margin-left: -46px; margin-top: -46px; border-radius: 50%; border: 2px solid rgba(255,220,100,0.82); box-shadow: 0 0 22px rgba(255,210,80,0.75), inset 0 0 22px rgba(255,210,80,0.18); animation-name: vorSeerScope !important; }\
.vor-vfx-seer-bullet { height: 5px !important; box-shadow: 0 0 12px #ffd36a, 0 0 22px #ff8844; }\
.vor-vfx-hit-sparks { width: 64px; height: 64px; margin-left: -32px; margin-top: -32px; border-radius: 50%; background: radial-gradient(circle, #fff3b0, #ffaa44 34%, transparent 68%); box-shadow: 0 0 24px #ffd36a; animation-name: vorHitSparks !important; }\
.vor-vfx-janus-glyph { width: 58px; height: 58px; margin-left: -29px; margin-top: -29px; border-radius: 50%; display:flex; align-items:center; justify-content:center; font-size:1.35rem; color:#ffd36a; border: 1px solid rgba(255,215,110,0.52); box-shadow: 0 0 24px rgba(255,215,110,0.75), inset 0 0 18px rgba(255,215,110,0.2); animation-name: vorJanusGlyph !important; }\
.vor-vfx-janus-glyph-large { width: 86px; height: 86px; margin-left: -43px; margin-top: -43px; font-size: 1.8rem; }\
.vor-vfx-rift-ring { width: 112px; height: 112px; margin-left: -56px; margin-top: -56px; border-radius:50%; border: 2px dashed rgba(114,215,255,0.7); box-shadow: 0 0 26px rgba(114,215,255,0.72), inset 0 0 24px rgba(255,215,110,0.25); animation-name: vorRiftRing !important; }\
.vor-vfx-beam-warmup { width: 70px; height: 70px; margin-left: -35px; margin-top: -35px; border-radius:50%; background: radial-gradient(circle, #fff8c8, rgba(255,180,60,0.58), transparent 70%); box-shadow: 0 0 34px #ffd36a; animation-name: vorBeamWarmup !important; }\
.vor-vfx-janus-beam-core { height: 10px !important; box-shadow: 0 0 22px #ffd36a, 0 0 42px #72d7ff; }\
.vor-vfx-janus-beam-side { height: 4px; width: var(--vfx-distance); margin-left: 0; margin-top: -2px; transform-origin: left center; background: linear-gradient(90deg, transparent, rgba(114,215,255,0.76), rgba(255,215,110,0.92), transparent); animation-name: enemySwitchBeam !important; }\
.vor-vfx-janus-beam-side-a { filter: drop-shadow(0 0 12px #72d7ff); }\
.vor-vfx-janus-beam-side-b { filter: drop-shadow(0 0 12px #ffd36a); }\
.vor-vfx-void-burst { background: radial-gradient(circle, #fff8c8, #ffd36a 24%, rgba(114,215,255,0.55) 42%, transparent 72%) !important; }\
.vor-vfx-afterimage { width: 92px; height: 46px; margin-left: -46px; margin-top: -23px; border-radius: 999px; background: repeating-linear-gradient(90deg, transparent 0 10px, rgba(255,210,90,0.48) 10px 18px, transparent 18px 28px); filter: drop-shadow(0 0 16px #ffd36a); animation-name: vorAfterimageDash !important; }\
.vor-vfx-rift-cut { width: 120px; height: 120px; margin-left: -60px; margin-top: -60px; border-radius:50%; background: conic-gradient(transparent, rgba(255,215,110,0.62), transparent, rgba(114,215,255,0.42), transparent); animation-name: vorRiftCut !important; }\
.vor-vfx-exec-shot { height: 7px !important; filter: drop-shadow(0 0 16px #ff9966); }\
.vor-vfx-command-pulse { width: 92px; height: 92px; margin-left:-46px; margin-top:-46px; border-radius:50%; border: 2px solid rgba(255,170,68,0.64); box-shadow: 0 0 22px #ffaa44; animation-name: vorCommandPulse !important; }\
.vor-vfx-nervos-mine { animation-name: vorNervosMineRun !important; filter: drop-shadow(0 0 12px #ffaa44); }\
.vor-vfx-mine-grid { width: 126px; height: 126px; margin-left:-63px; margin-top:-63px; border-radius: 18px; background-image: linear-gradient(rgba(255,90,60,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(255,90,60,0.32) 1px, transparent 1px); background-size: 18px 18px; border: 1px solid rgba(255,100,70,0.56); animation-name: vorMineGrid !important; }\
.vor-vfx-mine-detonation { background: radial-gradient(circle, #fff0aa, #ff8844 26%, #ff3355 46%, transparent 74%) !important; }\
.vor-vfx-shield-build { width: 118px; height: 118px; margin-left:-59px; margin-top:-59px; border-radius:50%; background: conic-gradient(rgba(114,215,255,0.15), rgba(255,215,110,0.65), rgba(114,215,255,0.2), rgba(255,215,110,0.62)); box-shadow: 0 0 26px rgba(114,215,255,0.84); animation-name: vorShieldBuild !important; }\
.vor-vfx-shield-dome-outer { border-color: rgba(255,215,110,0.72) !important; box-shadow: 0 0 36px rgba(114,215,255,0.9), inset 0 0 28px rgba(255,215,110,0.32) !important; }\
.vor-vfx-shield-runes { width: 148px; height: 148px; margin-left:-74px; margin-top:-74px; border-radius:50%; border: 2px dashed rgba(255,215,110,0.58); animation-name: vorShieldRunes !important; }\
/* ===== 沃尔 BOSS 战：重新构图，避免战场挤压技能栏 ===== */\
.boss-arena-vor {\
    min-height: 390px;\
    height: clamp(330px, 48vh, 430px);\
    padding: 0 !important;\
    margin-bottom: 12px;\
    border-radius: 18px;\
}\
.boss-arena-vor::before, .vor-arena-layer, .vor-arena-event {\
    inset: 0 !important;\
    border-radius: 18px !important;\
}\
.boss-arena-vor::after {\
    top: 16px;\
    font-size: 0.68rem;\
}\
.vor-battle-stage-row {\
    position: relative !important;\
    width: 100%;\
    height: 100%;\
    min-height: inherit;\
    display: block !important;\
    z-index: 5;\
}\
.vor-combatant-card {\
    position: absolute !important;\
    width: min(30%, 190px);\
    min-width: 98px;\
    padding: 8px 6px;\
    border-radius: 16px;\
    background: linear-gradient(180deg, rgba(0,0,0,0.42), rgba(0,0,0,0.12));\
    border: 1px solid rgba(255,255,255,0.10);\
    backdrop-filter: blur(2px);\
    z-index: 8;\
}\
.vor-player-card {\
    left: 5%;\
    bottom: 24px;\
}\
.vor-enemy-card {\
    right: 5%;\
    top: 62px;\
}\
.boss-arena-vor .skill-combat-avatar {\
    width: clamp(68px, 12vw, 108px);\
    height: clamp(68px, 12vw, 108px);\
}\
.boss-vor-avatar {\
    transform: scale(1.02);\
}\
.vor-arena-core {\
    right: 43%;\
    top: 38%;\
    width: 76px;\
    height: 76px;\
    opacity: 0.72;\
}\
.vor-mechanic-panel {\
    top: 10px;\
    left: auto;\
    right: 10px;\
    width: 210px;\
    max-width: calc(100% - 20px);\
    box-sizing: border-box;\
    z-index: 19;\
}\
.vor-interact-node {\
    width: clamp(46px, 8vw, 58px);\
    height: clamp(46px, 8vw, 58px);\
    margin-left: -29px;\
    margin-top: -29px;\
    z-index: 23;\
}\
.skill-combat-running .skill-bar-panel {\
    position: sticky;\
    bottom: 8px;\
    z-index: 80;\
    margin: 8px 0 10px;\
    padding: 10px;\
    background: linear-gradient(180deg, rgba(5,16,24,0.96), rgba(0,0,0,0.94));\
    backdrop-filter: blur(6px);\
    box-shadow: 0 -8px 28px rgba(0,0,0,0.36), 0 0 22px rgba(0,212,255,0.14);\
}\
.skill-combat-running .skill-bar-buttons {\
    grid-template-columns: repeat(5, minmax(64px, 1fr));\
    gap: 8px;\
}\
.skill-combat-running .skill-btn {\
    min-height: 72px;\
}\
.skill-combat-running #autoBattleLog {\
    max-height: 150px !important;\
}\
@media (max-width: 768px) {\
    body.skill-combat-running { padding-bottom: 172px !important; }\
    .boss-arena-vor {\
        height: 280px;\
        min-height: 280px;\
        margin-left: -12px;\
        margin-right: -12px;\
    }\
    .vor-player-card { left: 3%; bottom: 14px; }\
    .vor-enemy-card { right: 3%; top: 48px; }\
    .vor-combatant-card {\
        width: 35%;\
        min-width: 86px;\
        padding: 5px 3px;\
    }\
    .boss-arena-vor .skill-combat-avatar {\
        width: 58px;\
        height: 58px;\
    }\
    .vor-mechanic-panel {\
        top: 8px;\
        left: auto;\
        right: 8px;\
        width: 170px;\
        max-width: calc(100% - 16px);\
        box-sizing: border-box;\
        padding: 6px 8px;\
    }\
    .vor-mechanic-title { font-size: 0.58rem; }\
    .vor-mechanic-hint { font-size: 0.52rem; }\
    .skill-combat-running .skill-bar-panel {\
        display: block !important;\
        visibility: visible !important;\
        opacity: 1 !important;\
        position: fixed !important;\
        left: 0 !important;\
        right: 0 !important;\
        bottom: calc(62px + env(safe-area-inset-bottom)) !important;\
        width: 100vw !important;\
        max-width: 100vw !important;\
        margin: 0 !important;\
        padding: 7px 8px 8px !important;\
        border-radius: 14px 14px 0 0;\
        border-left: none;\
        border-right: none;\
        border-bottom: none;\
        z-index: 3000 !important;\
        transform: none !important;\
        overflow: visible !important;\
    }\
    .skill-combat-running .skill-bar-title {\
        margin-bottom: 6px;\
        font-size: 0.72rem;\
    }\
    .skill-combat-running .skill-bar-hint { display: none; }\
    .skill-combat-running .skill-bar-buttons {\
        display: grid !important;\
        grid-template-columns: repeat(5, minmax(0, 1fr)) !important;\
        gap: 4px;\
    }\
    .skill-combat-running .skill-btn {\
        display: flex !important;\
        min-height: 54px;\
        border-width: 1px;\
        border-radius: 9px;\
        padding: 2px 1px !important;\
    }\
    .skill-combat-running .skill-btn-icon { font-size: 1.12rem !important; }\
    .skill-combat-running .skill-btn-name { font-size: 0.5rem !important; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }\
    .skill-combat-running .skill-btn-cost { font-size: 0.48rem !important; }\
    .skill-combat-running .skill-btn-key { display: none !important; }\
    .skill-combat-running #autoBattleLog {\
        height: 120px !important;\
        margin-bottom: 8px !important;\
    }\
}\
@keyframes vorArenaSignal { 0% { opacity:0.28; letter-spacing:4px; } 100% { opacity:0.72; letter-spacing:7px; } }\
@keyframes vorKeyOrbit { 0% { transform:rotate(0deg) translateX(0); } 50% { transform:rotate(10deg) translateX(6px); } 100% { transform:rotate(0deg) translateX(0); } }\
@keyframes vorMechanicPanelIn { 0% { opacity:0; transform:translate(-50%, -12px) scale(0.96); } 100% { opacity:1; transform:translate(-50%, 0) scale(1); } }\
@keyframes vorInteractNodePulse { 0% { transform:scale(0.92); filter:brightness(0.9); } 100% { transform:scale(1.12); filter:brightness(1.3); } }\
@keyframes vorInteractNodeHit { 0% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:scale(2.2) rotate(120deg); } }\
@keyframes vorArenaBreath { 0% { opacity:0.78; filter:brightness(1); } 100% { opacity:1; filter:brightness(1.18); } }\
@keyframes vorGridDrift { 0% { background-position:0 0; } 100% { background-position:34px 34px; } }\
@keyframes vorCorePulse { 0% { transform:scale(0.92); opacity:0.55; } 100% { transform:scale(1.12); opacity:0.95; } }\
@keyframes vorCoreSpin { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }\
@keyframes vorScanSweep { 0% { transform:translateY(-80px) skewX(-18deg); opacity:0; } 22% { opacity:1; } 100% { transform:translateY(180px) skewX(-18deg); opacity:0; } }\
@keyframes vorWarningBlink { 0%,48% { opacity:0.25; } 50%,100% { opacity:0.82; } }\
@keyframes vorAimLock { 0% { opacity:0; transform:scale(1.55) rotate(0deg); } 34% { opacity:1; transform:scale(1) rotate(0deg); } 70% { opacity:0.95; transform:scale(1.08) rotate(2deg); } 100% { opacity:0; transform:scale(0.86) rotate(-2deg); } }\
@keyframes vorRiftOnTarget { 0% { opacity:0; transform:scale(0.42) rotate(0deg); } 42% { opacity:0.95; transform:scale(1.18) rotate(180deg); } 100% { opacity:0; transform:scale(1.55) rotate(360deg); } }\
@keyframes vorMineTargetPulse { 0% { opacity:0; transform:scale(1.35) rotate(0deg); } 38% { opacity:1; transform:scale(0.92) rotate(80deg); } 100% { opacity:0; transform:scale(1.22) rotate(180deg); } }\
@keyframes vorSeerRecoil { 0%,100% { transform:translate(0,0); filter:brightness(1); } 22% { transform:translateX(-8px); filter:brightness(1.8) drop-shadow(0 0 18px #ffd36a); } 42% { transform:translateX(7px); } 62% { transform:translateX(-5px); filter:brightness(1.55); } }\
@keyframes vorJanusChannel { 0% { transform:scale(1); filter:brightness(1); } 34% { transform:scale(1.08); filter:brightness(2.2) drop-shadow(0 0 30px #ffd36a); } 76% { transform:scale(1.12); filter:brightness(2.5) drop-shadow(0 0 36px #72d7ff); } 100% { transform:scale(1); filter:brightness(1); } }\
@keyframes vorCommandCast { 0%,100% { transform:translateY(0); filter:brightness(1); } 35% { transform:translateY(-10px) rotate(-3deg); filter:brightness(1.8) drop-shadow(0 0 22px #ffaa44); } 65% { transform:translateY(4px) rotate(3deg); } }\
@keyframes vorSphereShieldPose { 0%,100% { transform:scale(1); filter:brightness(1); } 30% { transform:scale(0.96); } 58% { transform:scale(1.14); filter:brightness(2.2) drop-shadow(0 0 30px #72d7ff); } }\
@keyframes vorSeerScope { 0% { opacity:0; transform:scale(1.8) rotate(0deg); } 34% { opacity:1; transform:scale(0.9) rotate(90deg); } 76% { opacity:.88; transform:scale(1.06) rotate(180deg); } 100% { opacity:0; transform:scale(0.72) rotate(260deg); } }\
@keyframes vorHitSparks { 0% { opacity:0; transform:scale(0.2); } 32% { opacity:1; transform:scale(1.25); } 100% { opacity:0; transform:scale(2.4); } }\
@keyframes vorJanusGlyph { 0% { opacity:0; transform:scale(0.35) rotate(-90deg); } 35% { opacity:1; transform:scale(1.1) rotate(24deg); } 100% { opacity:0; transform:scale(1.65) rotate(180deg); } }\
@keyframes vorRiftRing { 0% { opacity:0; transform:scale(0.3) rotate(0deg); } 35% { opacity:1; transform:scale(1.08) rotate(160deg); } 100% { opacity:0; transform:scale(1.75) rotate(360deg); } }\
@keyframes vorBeamWarmup { 0% { opacity:0; transform:scale(0.18); } 55% { opacity:1; transform:scale(1.2); } 100% { opacity:0; transform:scale(0.82); } }\
@keyframes vorAfterimageDash { 0% { opacity:0; transform:translateX(0) scaleX(0.2); } 30% { opacity:.88; } 100% { opacity:0; transform:translate(calc(var(--vfx-x) * .58), calc(var(--vfx-y) * .2)) scaleX(1.4); } }\
@keyframes vorRiftCut { 0% { opacity:0; transform:scale(0.25) rotate(0deg); } 45% { opacity:.95; transform:scale(1.15) rotate(200deg); } 100% { opacity:0; transform:scale(1.8) rotate(360deg); } }\
@keyframes vorCommandPulse { 0% { opacity:0; transform:scale(0.4); } 45% { opacity:1; transform:scale(1.25); } 100% { opacity:0; transform:scale(2.05); } }\
@keyframes vorNervosMineRun { 0% { opacity:0; transform:translate(0,0) rotate(0deg); } 18% { opacity:1; } 62% { transform:translate(calc(var(--vfx-x) * .62 + var(--mine-offset, 0px)), calc(var(--vfx-y) * .55 - 20px)) rotate(560deg); } 100% { opacity:0; transform:translate(calc(var(--vfx-x) + var(--mine-offset, 0px)), var(--vfx-y)) rotate(980deg); } }\
@keyframes vorMineGrid { 0% { opacity:0; transform:scale(1.45) rotate(0deg); } 35% { opacity:1; transform:scale(1) rotate(2deg); } 100% { opacity:0; transform:scale(0.72) rotate(-4deg); } }\
@keyframes vorShieldBuild { 0% { opacity:0; transform:scale(0.35) rotate(0deg); } 42% { opacity:1; transform:scale(1.08) rotate(180deg); } 100% { opacity:0; transform:scale(1.4) rotate(360deg); } }\
@keyframes vorShieldRunes { 0% { opacity:0; transform:scale(0.65) rotate(0deg); } 36% { opacity:0.9; transform:scale(1) rotate(120deg); } 100% { opacity:0; transform:scale(1.25) rotate(360deg); } }\
@keyframes vorArenaShake { 0%,100% { transform:translate(0,0); } 25% { transform:translate(2px,-1px); } 50% { transform:translate(-2px,1px); } 75% { transform:translate(1px,2px); } }\
@keyframes vorArenaBeamSweep { 0% { opacity:0; transform:translateX(-35%) rotate(var(--beam-rot, -10deg)) scaleX(.3); } 30% { opacity:1; } 100% { opacity:0; transform:translateX(35%) rotate(var(--beam-rot, -10deg)) scaleX(1.25); } }\
@keyframes vorRiftDoorOpen { 0% { opacity:0; transform:scale(.25) rotate(0deg); } 40% { opacity:1; transform:scale(1.08) rotate(160deg); } 100% { opacity:0.55; transform:scale(.96) rotate(360deg); } }\
@keyframes vorMinefieldPulse { 0% { opacity:.36; filter:brightness(.9); } 100% { opacity:.88; filter:brightness(1.45); } }\
@keyframes vorDangerZone { 0% { opacity:.28; transform:scale(.88); } 100% { opacity:.86; transform:scale(1.18); } }\
@keyframes vorRiftPath { 0% { background-position:0 0; opacity:.45; } 100% { background-position:70px 0; opacity:.92; } }\
@keyframes vorShieldWall { 0% { opacity:.44; transform:scale(.96); } 100% { opacity:.9; transform:scale(1.03); } }\
@keyframes vorTargetSweep { 0% { opacity:.28; transform:scale(.94); } 100% { opacity:.86; transform:scale(1.04); } }\
';

        document.head.appendChild(style);
    }

    // 页面加载后注入 CSS
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSkillCombatCSS);
    } else {
        injectSkillCombatCSS();
    }

    // ========== 导出到全局 ==========
    window.SkillCombatDebug = {
        setPlayerDamageMult: function(mult) {
            window.SKILL_COMBAT_PLAYER_DAMAGE_MULT = Number(mult) || 1;
            console.log('玩家伤害倍率 =', window.SKILL_COMBAT_PLAYER_DAMAGE_MULT);
        },
        setEnemyDamageMult: function(mult) {
            window.SKILL_COMBAT_ENEMY_DAMAGE_MULT = Number(mult) || 1;
            console.log('敌人伤害倍率 =', window.SKILL_COMBAT_ENEMY_DAMAGE_MULT);
        },
        listEnemies: function(keyword) {
            if (typeof ENEMIES === 'undefined') {
                console.warn('ENEMIES 不存在，请确认 GAME/enemies.js 已加载');
                return [];
            }
            var list = ENEMIES.filter(function(e) {
                return !keyword || (e.name || '').indexOf(keyword) !== -1;
            }).map(function(e, i) {
                return {
                    index: i,
                    id: e.id,
                    name: e.name,
                    type: e.type,
                    threatLevel: e.threatLevel,
                    threatTag: e.threatTag,
                    level: e.level,
                    hp: e.hp || e.maxHp,
                    attack: e.attack
                };
            });
            console.table(list);
            return list;
        },
        findEnemy: function(keyword) {
            if (typeof ENEMIES === 'undefined') return null;
            return ENEMIES.find(function(e) { return (e.name || '').indexOf(keyword) !== -1; }) || null;
        },
        getEnemySkills: function(keyword) {
            var enemy = typeof keyword === 'string' ? this.findEnemy(keyword) : keyword;
            if (!enemy) {
                console.warn('没找到敌人：', keyword);
                return [];
            }
            var skills = getEnemySkillSet(enemy);
            var tag = getEnemyThreatTag(enemy);
            console.table(skills.map(function(s) {
                return {
                    id: s.id,
                    name: s.name,
                    threatTag: tag,
                    damageRatio: ENEMY_THREAT_DAMAGE_RATIOS[tag],
                    skillWeight: getEnemySkillThreatWeight(s),
                    cooldown: s.cooldown
                };
            }));
            return skills;
        },
        getCurrentDamageInfo: function() {
            if (!SkillCombat.isActive) {
                console.warn('当前没有技能战斗');
                return null;
            }
            var enemy = SkillCombat.enemy;
            var player = SkillCombat.player;
            var tag = getEnemyThreatTag(enemy);
            var info = {
                enemy: enemy.name,
                enemyThreatTag: tag,
                enemyThreatLevel: enemy.threatLevel,
                enemyBaseRatio: ENEMY_THREAT_DAMAGE_RATIOS[tag],
                playerTotalMax: getEntityTotalMax(player),
                enemyTotalMax: getEntityTotalMax(enemy),
                playerDamageMult: window.SKILL_COMBAT_PLAYER_DAMAGE_MULT || 1,
                enemyDamageMult: window.SKILL_COMBAT_ENEMY_DAMAGE_MULT || 1
            };
            console.table([info]);
            return info;
        },
        forceEnemy: function(keyword) {
            if (!SkillCombat.isActive) {
                console.warn('当前没有技能战斗，请先点击肃清进入战斗');
                return null;
            }
            var src = this.findEnemy(keyword);
            if (!src) {
                console.warn('没找到敌人：', keyword);
                return null;
            }
            var enemy = JSON.parse(JSON.stringify(src));
            enemy.maxHp = enemy.maxHp || enemy.hp || 100;
            enemy.hp = enemy.hp || enemy.maxHp;
            enemy.maxShield = enemy.maxShield || enemy.shield || Math.floor(enemy.maxHp * getEnemyShieldRatio(enemy));
            enemy.shield = enemy.shield || enemy.maxShield;
            enemy.energy = enemy.energy || 100;
            enemy.maxEnergy = enemy.maxEnergy || 100;
            enemy.threatLevel = enemy.threatLevel || (enemy.combatThreat && enemy.combatThreat.level) || getThreatLevelFromType(enemy.type);
            enemy.threatTag = enemy.threatTag || (enemy.combatThreat && enemy.combatThreat.tag) || getThreatTagFromLevel(enemy.threatLevel);
            enemy.combatThreat = enemy.combatThreat || { level: enemy.threatLevel, tag: enemy.threatTag };
            enemy.skills = getEnemySkillSet(enemy);
            enemy.isStunned = false;
            enemy.stunTurns = 0;
            enemy.isHpLocked = false;
            enemy.hpLockEnemyTurns = 0;
            SkillCombat.enemy = enemy;
            SkillCombat.enemyCooldowns = enemy.skills.map(function() { return 0; });
            SkillCombat.enemyTookDirectHitThisRound = false;
            updateBattleUI();
            console.log('当前敌人已替换为：', enemy.name, enemy.skills);
            return enemy;
        }
    };

    window.SkillCombat = SkillCombat;
    window.initSkillCombat = initSkillCombat;
    window.stopSkillCombat = stopSkillCombat;
    window.playerUseSkill = playerUseSkill;
    window.tryAutoCastSkills = tryAutoCastSkills;
    window.WARFRAME_SKILLS = WARFRAME_SKILLS;
    window.ENEMY_SKILLS = ENEMY_SKILLS;
    window.ENEMY_FAMILY_SKILLS = ENEMY_FAMILY_SKILLS;
	
	

    // ═══════ 暴露到 window 以便增强补丁替换 ═══════
    window._originalSpawnVfx = spawnSkillVfx;
    window._originalPlayAnim = playSkillAnimation;
    window.spawnSkillVfx = spawnSkillVfx;
    window.playSkillAnimation = playSkillAnimation;
})();