// 第1页 - 星图导航（10个派系大入口）
var PLANETS = [
    { id: 'grineer', name: 'Grineer', icon: '🌍', image: 'GAME/Faction/Grineer.jpg', maxLevel: 35, faction: 'grineer', factionName: '', dropMult: 1.0, desc: '起源系统的摇篮，Grineer帝国的核心领地', color: '#4a8c4a', locked: false },
    { id: 'corpus', name: 'Corpus', icon: '🌟', image: 'GAME/Faction/Corpus.jpg', minLevel: 3, maxLevel: 40, faction: 'corpus', factionName: '', dropMult: 1.1, desc: '被Corpus商会控制的工业星球群', color: '#c8a84b', locked: true },
    { id: 'infested', name: 'Infested', icon: '☿️', image: 'GAME/Faction/Infested.jpg',minLevel: 5, maxLevel: 35, faction: 'infested', factionName: '', dropMult: 1.2, desc: '被Infested瘟疫吞噬的死亡星球', color: '#4eff4e', locked: true },
    { id: 'orokin', name: 'Orokin', icon: '🔴', image: 'GAME/Faction/Orokin.jpg',  minLevel: 8, maxLevel: 40, faction: 'orokin', factionName: '', dropMult: 1.3, desc: '古老Orokin文明的神秘遗迹', color: '#cc4444', locked: true },
    { id: 'sentient', name: 'Sentient', icon: '🌑', image: 'GAME/Faction/Sentient.jpg', minLevel: 10, maxLevel: 40, faction: 'sentient', factionName: '', dropMult: 1.4, desc: 'Sentient异构体的虚空领域', color: '#ff66ff', locked: true },
    { id: 'unum', name: '合一众', icon: '⚙️', image: 'GAME/Faction/合一众.jpg', minLevel: 12, maxLevel: 40, faction: 'unum', factionName: '', dropMult: 1.5, desc: 'Narmer合一众的精神控制区', color: '#aaaaaa', locked: true },
    { id: 'whisper', name: '低语者', icon: '🪐', image: 'GAME/Faction/低语者.jpg', minLevel: 15, maxLevel: 40, faction: 'whisper', factionName: '', dropMult: 1.6, desc: '墙中低语的诡异虚空领域', color: '#d4a574', locked: true },
    { id: 'snake', name: '炽蛇军', icon: '🪐', image: 'GAME/Faction/炽蛇军.jpg',  minLevel: 18, maxLevel: 40, faction: 'snake', factionName: '', dropMult: 1.7, desc: '炽蛇军的灼热军事据点', color: '#c8b896', locked: true },
    { id: 'tech', name: '科腐者', icon: '💠', image: 'GAME/Faction/科腐者.jpg', minLevel: 20, maxLevel: 40, faction: 'tech', factionName: '', dropMult: 1.8, desc: '科腐者的禁忌实验基地', color: '#4ecdc4', locked: true },
    { id: 'free', name: '自由派', icon: '🔷', image: 'GAME/Faction/自由派.jpg',minLevel: 25, maxLevel: 40, faction: 'free', factionName: '', dropMult: 1.9, desc: '自由派的独立星际领地', color: '#4488ff', locked: true }
];

// 第2页 - 各派系下属的星球（独立配置）
var PLANETS_GRINEER = [
    { id: 'earth', name: '寰宇-Grineer', icon: '🌍', image: 'GAME/Faction/earth.jpg', minLevel: 1, maxLevel: 5, faction: 'grineer', factionName: 'Grineer', dropMult: 1.0, desc: '起源系统的摇篮', color: '#4a8c4a', locked: false },
    { id: 'sedna', name: '夜灵之墓', icon: '🔴', image: 'GAME/Faction/sedna.jpg', minLevel: 15, maxLevel: 25, faction: 'grineer', factionName: 'Grineer', dropMult: 1.5, desc: 'Grineer女皇的领地', color: '#cc4444', locked: true },
    { id: 'kuva', name: '星域凶顽', icon: '💀', image: 'GAME/Faction/kuva.jpg', minLevel: 25, maxLevel: 35, faction: 'grineer', factionName: 'Grineer', dropMult: 2.0, desc: '赤毒Grineer的核心要塞', color: '#8b0000', locked: true }
];

var PLANETS_CORPUS = [
    { id: 'venus', name: '金星', icon: '🌟', image: 'GAME/Faction/venus.jpg',  minLevel: 3, maxLevel: 8, faction: 'corpus', factionName: 'Corpus', dropMult: 1.1, desc: 'Corpus工业星球', color: '#c8a84b' },
    { id: 'neptune', name: '海王星', icon: '🔷', image: 'GAME/Faction/neptune.jpg', minLevel: 25, maxLevel: 35, faction: 'corpus', factionName: 'Corpus', dropMult: 1.9, desc: 'Corpus高级研究所', color: '#4488ff' },
    { id: 'pluto', name: '冥王星', icon: '⚫', image: 'GAME/Faction/pluto.jpg',  minLevel: 30, maxLevel: 40, faction: 'corpus', factionName: 'Corpus', dropMult: 2.2, desc: 'Corpus外域前哨', color: '#666666' }
];

var PLANETS_INFESTED = [
    { id: 'eris', name: '阋神星', icon: '☿️', image: 'GAME/Faction/eris.jpg', level: '20-30', minLevel: 20, maxLevel: 30, faction: 'infested', factionName: 'Infested', dropMult: 1.8, desc: 'Infested瘟疫核心', color: '#4eff4e' },
    { id: 'deimos', name: '火卫二', icon: '🌑', image: 'GAME/Faction/deimos.jpg', level: '15-25', minLevel: 15, maxLevel: 25, faction: 'infested', factionName: 'Infested', dropMult: 1.6, desc: 'Infested巢穴', color: '#2a5a2a' }
];

var PLANETS_SENTIENT = [
    { id: 'lua', name: '月球', icon: '🌑', image: 'GAME/Faction/lua.jpg', level: '20-30', minLevel: 20, maxLevel: 30, faction: 'sentient', factionName: 'Sentient', dropMult: 2.0, desc: 'Orokin之月，Sentient战场', color: '#888888' },
    { id: 'veil', name: '虚空Veil', icon: '💠', image: 'GAME/Faction/veil.jpg', level: '30-40', minLevel: 30, maxLevel: 40, faction: 'sentient', factionName: 'Sentient', dropMult: 2.5, desc: 'Sentient虚空领域', color: '#ff66ff' }
];

var PLANETS_OROKIN = [
    { id: 'void', name: '虚空', icon: '🔴', image: 'GAME/Faction/void.jpg', level: '10-20', minLevel: 10, maxLevel: 20, faction: 'orokin', factionName: 'Orokin', dropMult: 1.5, desc: 'Orokin虚空遗迹', color: '#cc4444' },
    { id: 'derelict', name: '废弃船', icon: '⚓', image: 'GAME/Faction/derelict.jpg', level: '20-35', minLevel: 20, maxLevel: 35, faction: 'orokin', factionName: 'Orokin', dropMult: 2.0, desc: 'Orokin废弃飞船', color: '#8b4513' }
];

var PLANETS_WHISPER = [
    { id: 'duviri', name: '双衍王境', icon: '🪐', image: 'GAME/Faction/duviri.jpg', level: '15-25', minLevel: 15, maxLevel: 25, faction: 'whisper', factionName: '低语者', dropMult: 1.8, desc: '墙中低语的虚空王境', color: '#d4a574' },
    { id: 'albrecht', name: '阿尔布雷希特', icon: '🔮', image: 'GAME/Faction/albrecht.jpg', level: '25-40', minLevel: 25, maxLevel: 40, faction: 'whisper', factionName: '低语者', dropMult: 2.2, desc: '阿尔布雷希特的实验室', color: '#8b7355' }
];

// 第3页 - 各派系下属星球的区域配置
var PLANET_ZONES_GRINEER = {
    earth: [
        { id: 'e_zone1', name: '☿️游掠凶形☿️', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 5, minLevel: 5, maxLevel: 10, faction: 'grineer', factionName: 'Grineer', dropMult: 1.2, desc: 'Grineer巡逻区域', color: '#4a8c4a', locked: false },
        { id: 'e_zone2', name: '☿交锋异士☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: false },
        { id: 'e_zone3', name: '☿暴戾战将☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: false },
        { id: 'e_zone4', name: '☿畸变造物☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: true },
        { id: 'e_zone5', name: '☿长空掠影☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: true },
        { id: 'e_zone6', name: '☿澜下械躯☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: true },
        { id: 'e_zone7', name: '☿工坊役众☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: true },
        { id: 'e_zone8', name: '☿统御凶僚☿', icon: '☿️', image: 'GAME/Faction/Infested.jpg', level: 8, minLevel: 8, maxLevel: 12, faction: 'grineer', factionName: 'Grineer', dropMult: 1.3, desc: 'Grineer精英交战区', color: '#4a8c4a', locked: true }
    ],
    sedna: [
        { id: 's_zone1', name: '女皇禁地', icon: '👑', image: 'GAME/Faction/sedna.jpg', level: 18, minLevel: 18, maxLevel: 25, faction: 'grineer', factionName: 'Grineer', dropMult: 1.8, desc: 'Grineer女皇的私人领地', color: '#cc4444', locked: true }
    ],
    kuva: [
        { id: 'k_zone1', name: '赤毒熔炉', icon: '🔥', image: 'GAME/Faction/kuva.jpg', level: 28, minLevel: 28, maxLevel: 35, faction: 'grineer', factionName: 'Grineer', dropMult: 2.5, desc: '赤毒提炼核心区域', color: '#8b0000', locked: true }
    ]
};

var PLANET_ZONES_CORPUS = {
    venus: [
        { id: 'v_zone1', name: '集气城市', icon: '🏭', image: 'GAME/Faction/venus.jpg', level: 5, minLevel: 5, maxLevel: 8, faction: 'corpus', factionName: 'Corpus', dropMult: 1.2, desc: 'Corpus气体采集站', color: '#c8a84b' }
    ],
    neptune: [
        { id: 'n_zone1', name: '研究核心', icon: '🔬', image: 'GAME/Faction/neptune.jpg', level: 28, minLevel: 28, maxLevel: 35, faction: 'corpus', factionName: 'Corpus', dropMult: 2.0, desc: 'Corpus最高机密研究所', color: '#4488ff' }
    ]
};

var PLANET_ZONES_INFESTED = {
    eris: [
        { id: 'er_zone1', name: '瘟疫核心', icon: '☣️', image: 'GAME/Faction/eris.jpg', level: 22, minLevel: 22, maxLevel: 30, faction: 'infested', factionName: 'Infested', dropMult: 2.0, desc: 'Infested瘟疫源头', color: '#4eff4e' }
    ],
    deimos: [
        { id: 'd_zone1', name: '感染深渊', icon: '🕳️', image: 'GAME/Faction/deimos.jpg', level: 18, minLevel: 18, maxLevel: 25, faction: 'infested', factionName: 'Infested', dropMult: 1.8, desc: 'Infested巢穴深处', color: '#2a5a2a' }
    ]
};

var PLANET_ZONES_SENTIENT = {
    lua: [
        { id: 'l_zone1', name: '月球表面', icon: '🌑', image: 'GAME/Faction/lua.jpg', level: 22, minLevel: 22, maxLevel: 30, faction: 'sentient', factionName: 'Sentient', dropMult: 2.2, desc: 'Sentient月球战场', color: '#888888' }
    ],
    veil: [
        { id: 've_zone1', name: '虚空裂隙', icon: '💫', image: 'GAME/Faction/veil.jpg', level: 32, minLevel: 32, maxLevel: 40, faction: 'sentient', factionName: 'Sentient', dropMult: 3.0, desc: 'Sentient虚空核心', color: '#ff66ff' }
    ]
};

var PLANET_ZONES_OROKIN = {
    void: [
        { id: 'vo_zone1', name: '虚空塔', icon: '🏛️', image: 'GAME/Faction/void.jpg', level: 12, minLevel: 12, maxLevel: 20, faction: 'orokin', factionName: 'Orokin', dropMult: 1.8, desc: 'Orokin虚空防御塔', color: '#cc4444' }
    ],
    derelict: [
        { id: 'de_zone1', name: '废弃核心', icon: '⚙️', image: 'GAME/Faction/derelict.jpg', level: 25, minLevel: 25, maxLevel: 35, faction: 'orokin', factionName: 'Orokin', dropMult: 2.5, desc: 'Orokin废弃飞船核心', color: '#8b4513' }
    ]
};

var PLANET_ZONES_WHISPER = {
    duviri: [
        { id: 'du_zone1', name: '王境入口', icon: '🚪', image: 'GAME/Faction/duviri.jpg', level: 18, minLevel: 18, maxLevel: 25, faction: 'whisper', factionName: '低语者', dropMult: 2.0, desc: '双衍王境入口区域', color: '#d4a574' }
    ],
    albrecht: [
        { id: 'al_zone1', name: '实验室深处', icon: '🧪', image: 'GAME/Faction/albrecht.jpg', level: 28, minLevel: 28, maxLevel: 40, faction: 'whisper', factionName: '低语者', dropMult: 2.5, desc: '阿尔布雷希特的秘密实验室', color: '#8b7355' }
    ]
};

// 派系配置映射
var FACTION_CONFIG = {
    grineer: { page2: 'page-faction-grineer', page3: 'page-zone-grineer', planets: 'PLANETS_GRINEER', zones: 'PLANET_ZONES_GRINEER', color: '#4a8c4a' },
    corpus: { page2: 'page-faction-corpus', page3: 'page-zone-corpus', planets: 'PLANETS_CORPUS', zones: 'PLANET_ZONES_CORPUS', color: '#c8a84b' },
    infested: { page2: 'page-faction-infested', page3: 'page-zone-infested', planets: 'PLANETS_INFESTED', zones: 'PLANET_ZONES_INFESTED', color: '#4eff4e' },
    sentient: { page2: 'page-faction-sentient', page3: 'page-zone-sentient', planets: 'PLANETS_SENTIENT', zones: 'PLANET_ZONES_SENTIENT', color: '#ff66ff' },
    orokin: { page2: 'page-faction-orokin', page3: 'page-zone-orokin', planets: 'PLANETS_OROKIN', zones: 'PLANET_ZONES_OROKIN', color: '#cc4444' },
    whisper: { page2: 'page-faction-whisper', page3: 'page-zone-whisper', planets: 'PLANETS_WHISPER', zones: 'PLANET_ZONES_WHISPER', color: '#d4a574' }
};

let currentFaction = null;
let selectedFactionPlanet = null;
let selectedFactionZone = null;



// ═══════════════════════════════════════════════════════════════
// 【新】挖矿/采集专用星球配置
// ═══════════════════════════════════════════════════════════════

// 1. 挖矿星球列表
var MINING_PLANETS = [
    { id: 'earth_mine', name: '晨潮矿坑', icon: '⛏️', image: 'GAME/Faction/Cetus.jpg', level: '1-10', minLevel: 1, maxLevel: 10, faction: 'mining', factionName: '采矿区', dropMult: 1.0, desc: '起源系统的丰富矿脉，适合新手矿工', color: '#4a8c4a', locked: false },
    { id: 'mars_mine', name: '冷却液与矿尘', icon: '🔥', image: 'GAME/Faction/Preview.jpg', level: '5-15', minLevel: 5, maxLevel: 15, faction: 'mining', factionName: '采矿区', dropMult: 1.2, desc: '火星地下的高温矿脉，产出稀有金属', color: '#cc4444', locked: false },
    { id: 'void_mine', name: 'Infested摇篮', icon: '💠', image: 'GAME/Faction/CambionDrift.jpg', level: '10-25', minLevel: 10, maxLevel: 25, faction: 'mining', factionName: '采矿区', dropMult: 1.5, desc: '虚空深处的神秘矿脉，蕴含Orokin矿物', color: '#ff66ff', locked: false },
 
];




// 2. 采集星球列表
var GATHERING_PLANETS = [
    { id: 'earth_gather', name: '地核裂谷', icon: '🌿', image: 'GAME/Faction/GuidingLight.jpg', level: '1-10', minLevel: 1, maxLevel: 10, faction: 'gathering', factionName: '采集区', dropMult: 1.0, desc: '起源系统的原始丛林，植物资源丰富', color: '#4eff4e', locked: false },
    { id: 'venus_gather', name: '异星生态', icon: '🌸', image: 'GAME/Faction/Teshin.jpg', level: '5-15', minLevel: 5, maxLevel: 15, faction: 'gathering', factionName: '采集区', dropMult: 1.2, desc: '金星温室中的珍稀植物，适合中级采集者', color: '#c8a84b', locked: false },
    { id: 'deimos_gather', name: '火卫二沼泽', icon: '🍄', image: 'GAME/Faction/Tesshin.jpg', level: '10-25', minLevel: 10, maxLevel: 25, faction: 'gathering', factionName: '采集区', dropMult: 1.5, desc: '火卫二的诡异沼泽，生长着变异植物', color: '#2a5a2a', locked: true },
    { id: 'duviri_gather', name: '双衍原野', icon: '🪐', image: 'GAME/Faction/iLandscape.jpg', level: '15-30', minLevel: 15, maxLevel: 30, faction: 'gathering', factionName: '采集区', dropMult: 1.8, desc: '双衍王境的虚空原野，出产传说中的灵草', color: '#d4a574', locked: true }
];

// 3. 状态变量（记录玩家选了哪个星球）
let selectedMiningPlanet = null;
let selectedGatheringPlanet = null;


// ═══════════════════════════════════════════════════════════════
// 挖矿/采集区域配置（三级页面用）
// ═══════════════════════════════════════════════════════════════

var MINING_ZONES = {
    earth_mine: [
        { id: 'em_z1', name: '巨兽之骸', icon: '⛏️', level: 1, minLevel: 1, dropMult: 1.0, desc: '地球表面的浅层矿脉，适合新手', locked: false },
        { id: 'em_z2', name: '希图斯的守望', icon: '🏔️', level: 3, minLevel: 3, dropMult: 1.2, desc: '峡谷深处的裂隙矿脉', locked: true },
    ],
    mars_mine: [
        { id: 'mm_z1', name: '蓝晶与赤晶', icon: '🔥', level: 5, minLevel: 5, dropMult: 1.3, desc: '火星地下的熔岩隧道', locked: false  },
        { id: 'mm_z2', name: 'Corpus利润之霜', icon: '🌋', level: 8, minLevel: 8, dropMult: 1.6, desc: '火山深处的核心矿脉', locked: true },

    ],
    void_mine: [
        { id: 'vm_z1', name: '共生结晶协议', icon: '💠', level: 10, minLevel: 10, dropMult: 1.5, desc: '虚空边缘的表层矿脉', locked: false },
        { id: 'vm_z2', name: '双生蠕虫的低语', icon: '🌀', level: 15, minLevel: 15, dropMult: 1.8, desc: '虚空裂隙的深层矿脉', locked: true },
    ],
    lua_mine: [
        { id: 'lm_z1', name: '月面陨石坑', icon: '🌑', level: 15, minLevel: 15, dropMult: 1.8, desc: '月球表面的陨石坑矿区', locked: true },
        { id: 'lm_z2', name: '月核隧道', icon: '🕳️', level: 20, minLevel: 20, dropMult: 2.1, desc: '通往月球核心的隧道', locked: true },
    ]
};

var GATHERING_ZONES = {
    earth_gather: [
        { id: 'eg_z1', name: '高压断层', icon: '🗻', level: 1, dropMult: 1.0, desc: '茂密的原始雨林', locked: false },
        { id: 'eg_z2', name: '硅基熔炉', icon: '♨️', level: 3, dropMult: 1.2, desc: '潮湿的沼泽地带', locked: true },
        { id: 'eg_z3', name: '地心暗流', icon: '🌋', level: 5, dropMult: 1.4, desc: '千年古树环绕的森林', locked: true }
    ],
    venus_gather: [
        { id: 'vg_z1', name: '迷雾林', icon: '🌸', level: 5, dropMult: 1.3, desc: 'Corpus控制的温室花房', locked: false },
        { id: 'vg_z2', name: '荧光菌毯', icon: '☣️', level: 8, dropMult: 1.6, desc: '酸性气体弥漫的平原', locked: true },
        { id: 'vg_z3', name: '畸变地带', icon: '☁️', level: 12, dropMult: 1.9, desc: '漂浮在云端的空中花园', locked: true }
    ],
    deimos_gather: [
        { id: 'dg_z1', name: '感染沼泽', icon: '🦠', level: 10, dropMult: 1.5, desc: '被Infested感染的沼泽', locked: true },
        { id: 'dg_z2', name: '变异丛林', icon: '🧬', level: 15, dropMult: 1.8, desc: '植物发生变异的丛林', locked: true },
        { id: 'dg_z3', name: '母巢花园', icon: '👁️', level: 20, dropMult: 2.2, desc: 'Infested母巢附近的诡异花园', locked: true }
    ],
    duviri_gather: [
        { id: 'dug_z1', name: '虚空草原', icon: '🌾', level: 15, dropMult: 1.8, desc: '双衍王境的虚空草原', locked: true },
        { id: 'dug_z2', name: '时间裂隙', icon: '⏳', level: 20, dropMult: 2.1, desc: '时间扭曲的裂隙地带', locked: true },
        { id: 'dug_z3', name: '王境禁地', icon: '👑', level: 25, dropMult: 2.5, desc: '双衍王者的私人花园', locked: true }
    ]
};let selectedMiningZone = null;
let selectedGatheringZone = null;


// ═══════════════════════════════════════════════════════════════
// 【掉落数据】各区域/星球可能掉落的物品（与 items.js 对齐）
// ═══════════════════════════════════════════════════════════════

// 肃清区域掉落（共用 BATTLE_DROPS）
var ZONE_DROP_TABLES = {
    grineer: {
        e_zone1: { drops: ['Excalibur蓝图部件', 'Volt蓝图部件', 'Mag蓝图部件'], rare: ['奥席金属'] },
        e_zone2: { drops: ['Excalibur蓝图部件', 'Volt蓝图部件', 'Mag蓝图部件'], rare: ['奥席金属'] },
        e_zone3: { drops: ['Excalibur蓝图部件', 'Volt蓝图部件', 'Mag蓝图部件'], rare: ['奥席金属']  },
        e_zone4: { drops: ['合金板', '控制模块', '红化结晶', '生物质'], rare: ['神经传感器', '奥罗金电池', 'Excalibur系统蓝图'] },
        e_zone5: { drops: ['聚合物束', '红化结晶', '回收金属', '奥席金属'], rare: ['控制模块', '氩结晶'] },
        e_zone6: { drops: ['铁氧体', '纳米孢子', '电路', '回收金属'], rare: ['合金板', '神经元', 'Volt蓝图'] },
        e_zone7: { drops: ['合金板', '控制模块', '聚合物束', '生物质'], rare: ['红化结晶', '奥罗金电池', 'Volt头部神经光元蓝图'] },
        e_zone8: { drops: ['红化结晶', '生物质', '奥罗金电池', '合金板'], rare: ['神经传感器', '神经元', 'Volt机体蓝图'] },
        s_zone1: { drops: ['合金板', '电路', '控制模块', '奥罗金电池'], rare: ['神经传感器', '神经元', '氩结晶', 'Volt系统蓝图'] },
        k_zone1: { drops: ['合金板', '控制模块', '神经传感器', '奥罗金电池'], rare: ['虚空光体', '神经元', 'Mag蓝图'] }
    }
};


// 采矿星球掉落
var MINING_DROP_TABLES = {
    earth_mine: { drops: ['炎晶', '亚铜', '石青', '兄弟之石', '翠萤石', '永冻晶矿'], rare: ['绯红石', '铁岩', '心智晶核', '灵息石', '金辉'] },
    mars_mine: { drops: ['酸化矿物', '铁镍矿', '翡斯敏石', '夜石', '填充细石', '永冻晶矿'], rare: ['启明矿石', '紫苋石', '长庚矿石', '黄道宝石', '赤色水晶'] },
    void_mine: { drops: ['阿拉德玛金属', '巴弗结晶', '达戈琥珀', '提亚美凝石', '纳莫原石', '永冻晶矿'], rare: ['聚合荧石', '萨莫感染石', '栓子凝石', '异源石', '殁世烯'] }
};

// 回收星球掉落
var GATHERING_DROP_TABLES = {
    earth_gather: { drops: ['合金板', '电路', '控制模块', '铁氧体', '镓', '非晶态合金' ], rare: ['碲', '氩结晶'] },
    venus_gather: { drops: ['纳米孢子', '神经传感器', '生物质', '聚合物束', '红化结晶', '回收金属'], rare: ['神经元', '奥罗金电池','碲'] },
    
};

function getDropsHtml(dropTable) {
    if (!dropTable) return '';
    let html = '';
    if (dropTable.drops) {
        dropTable.drops.forEach(drop => {
            html += `<span style="background: rgba(200,168,75,0.1); border: 1px solid var(--tenno-gold-dim); color: var(--tenno-gold); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">${drop}</span>`;
        });
    }
    if (dropTable.rare) {
        dropTable.rare.forEach(drop => {
            html += `<span style="background: rgba(255,102,255,0.1); border: 1px solid var(--sentient-purple); color: var(--sentient-purple); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem;">✨ ${drop}</span>`;
        });
    }
    return html;
}

function updatePanelDrops(panelDropsId, panelDropsListId, dropTable) {
    const container = document.getElementById(panelDropsId);
    const list = document.getElementById(panelDropsListId);
    if (!container || !list) return;
    if (!dropTable) {
        container.style.display = 'none';
        return;
    }
    list.innerHTML = getDropsHtml(dropTable);
    container.style.display = 'block';
}

function hidePanelDrops(panelDropsId) {
    const container = document.getElementById(panelDropsId);
    if (container) container.style.display = 'none';
}