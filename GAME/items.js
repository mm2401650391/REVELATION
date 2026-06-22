//


// ═══════════════════════════════════════════════════════════════
//  物品与商城数据配置 (items.js)
// ═══════════════════════════════════════════════════════════════
// ─── 铸造厂配方 ───
const FOUNDRY_RECIPES = [
    // ========== Excalibur ==========
    {
        id: 'f_excalibur',
        name: 'Excalibur',
        icon: '⚔️',
        image: 'GAME/Wf/Excalibur.jpg',
        category: 'warframe',
        warframeKey: 'excalibur',
        desc: '剑术大师战甲，平衡型近战战士',
        cost: {

			'Excalibur蓝图': 1,
            'Excalibur头部神经光元': 1,
            'Excalibur机体': 1,
            'Excalibur系统': 1,
            'Orokin电池': 1,
			
        
        },
        time: 24,
        requireBlueprint: 'Excalibur蓝图'  // ← 新增：需要这个蓝图才显示
    },
    {
        id: 'f_excal_neuroptics',
        name: 'Excalibur头部神经光元',
        icon: '⛑️',
        image: 'GAME/Wf/1Helmet.jpg',
        category: 'warframe',
        desc: 'Excalibur战甲的头部神经光元组件',
        cost: {

			'Excalibur头部神经光元蓝图':1,
            '合金板': 225,
            '神经传感器': 1,
            '聚合物束': 225,
            '红化结晶': 750
        
        },
        time: 12,
        requireBlueprint: 'Excalibur头部神经光元蓝图'  // ← 新增
    },
    {
        id: 'f_excal_chassis',
        name: 'Excalibur机体',
        icon: '🦾',
        image: 'GAME/Wf/2Chassis.jpg',
        category: 'warframe',
        desc: 'Excalibur战甲的机体组件',
        cost: {

			'Excalibur机体蓝图': 1,
            '铁氧体': 225,
            '非晶态合金': 1,
            '控制模块': 1,
            '回收金属': 120
        
        },
        time: 12,
        requireBlueprint: 'Excalibur机体蓝图'  // ← 新增
    },
    {
        id: 'f_excal_systems',
        name: 'Excalibur系统',
        icon: '⚙️',
        image: 'GAME/Wf/3Systems.jpg',
        category: 'warframe',
        desc: 'Excalibur战甲的系统组件',
        cost: {

			'Excalibur系统蓝图':1,
            '生物质': 150,
            '聚合物束': 60,
            '神经传感器': 1,
            '红化结晶': 30
        
        },
        time: 12,
        requireBlueprint: 'Excalibur系统蓝图'  // ← 新增
    },

    // ========== Volt ==========
    {
        id: 'f_volt',
        name: 'Volt',
        icon: '⚡',
        image: 'GAME/Wf/Volt.jpg',
        category: 'warframe',
        warframeKey: 'volt',
		warframeKey: 'excalibur',
        desc: '电能大师战甲，擅长护盾与电击',
        cost: {

            'Volt头部神经光元': 1,
            'Volt机体': 1,
            'Volt系统': 1,
            'Orokin电池': 1
        
        },
        time: 24,
        requireBlueprint: 'Volt蓝图'  // ← 新增
    },
    {
        id: 'f_volt_neuroptics',
        name: 'Volt头部神经光元',
        icon: '⛑️',
        image: 'GAME/Wf/1Helmet.jpg',
        category: 'warframe',
        desc: 'Volt战甲的头部神经光元组件',
        cost: {

            '合金板': 225,
            '神经传感器': 1,
            '聚合物束': 225,
            '红化结晶': 750
        
        },
        time: 12,
        requireBlueprint: 'Volt头部神经光元蓝图'  // ← 新增
    },
    {
        id: 'f_volt_chassis',
        name: 'Volt机体',
        icon: '🦾',
        image: 'GAME/Wf/2Chassis.jpg',
        category: 'warframe',
        desc: 'Volt战甲的机体组件',
        cost: {

            '铁氧体': 225,
            '非晶态合金': 1,
            '控制模块': 1,
            '回收金属': 120
        
        },
        time: 12,
        requireBlueprint: 'Volt机体蓝图'  // ← 新增
    },
    {
        id: 'f_volt_systems',
        name: 'Volt系统',
        icon: '⚙️',
        image: 'GAME/Wf/3Systems.jpg',
        category: 'warframe',
        desc: 'Volt战甲的系统组件',
        cost: {

            '生物质': 150,
            '聚合物束': 60,
            '神经传感器': 1,
            '红化结晶': 30
        
        },
        time: 12,
        requireBlueprint: 'Volt系统蓝图'  // ← 新增
    },

    // ========== Mag ==========
    {
        id: 'f_mag',
        name: 'Mag',
        icon: '🧲',
        image: 'GAME/Wf/Mag.jpg',
        category: 'warframe',
        warframeKey: 'mag',
		warframeKey: 'excalibur',
        desc: '磁力大师战甲，操控磁场与金属',
        cost: {

            'Mag头部神经光元': 1,
            'Mag机体': 1,
            'Mag系统': 1,
            'Orokin电池': 1
        
        },
        time: 24,
        requireBlueprint: 'Mag蓝图'  // ← 新增
    },
    {
        id: 'f_mag_neuroptics',
        name: 'Mag头部神经光元',
        icon: '⛑️',
        image: 'GAME/Wf/1Helmet.jpg',
        category: 'warframe',
        desc: 'Mag战甲的头部神经光元组件',
        cost: {

            '合金板': 225,
            '神经传感器': 1,
            '聚合物束': 225,
            '红化结晶': 750
        
        },
        time: 12,
        requireBlueprint: 'Mag头部神经光元蓝图'  // ← 新增
    },
    {
        id: 'f_mag_chassis',
        name: 'Mag机体',
        icon: '🦾',
        image: 'GAME/Wf/2Chassis.jpg',
        category: 'warframe',
        desc: 'Mag战甲的机体组件',
        cost: {

            '铁氧体': 225,
            '非晶态合金': 1,
            '控制模块': 1,
            '回收金属': 120
        
        },
        time: 12,
        requireBlueprint: 'Mag机体蓝图'  // ← 新增
    },
    {
        id: 'f_mag_systems',
        name: 'Mag系统',
        icon: '⚙️',
        image: 'GAME/Wf/3Systems.jpg',
        category: 'warframe',
        desc: 'Mag战甲的系统组件',
        cost: {

            '生物质': 150,
            '聚合物束': 60,
            '神经传感器': 1,
            '红化结晶': 30
        
        },
        time: 12,
        requireBlueprint: 'Mag系统蓝图'  ,// ← 新增
		bossOnly: true   // 只有Boss掉落
    }
];




// 战斗掉落物品配置
const BATTLE_DROPS = [
	// ==========低概率==========
	{ 
	    id: 'bp_Oxium',
	    name: '奥席金属', 
	    icon: '⚙️', 
	    image: 'GAME/items/2/1Oxium.jpg',
	    color: '#c8a84b',
	    dropRate: 0.1, 
	    minAmount: 1, 
	    maxAmount: 3, 
	    type: 'material'
	},
	// ========== 战甲蓝图（Boss专属）==========
    { 
        id: 'bp_excalibur',
        name: 'Excalibur蓝图', 
        exclusiveGroup: 'excalibur_set',
        icon: '📜', 
        image: 'GAME/Wf/Excalibur.jpg',
        color: '#c8a84b',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_excal_neuroptics',
        name: 'Excalibur头部神经光元蓝图', 
        exclusiveGroup: 'excalibur_set',
        icon: '📜', 
        image: 'GAME/Wf/1Helmet.jpg',
        color: '#c8a84b',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_excal_chassis',
        name: 'Excalibur机体蓝图', 
        exclusiveGroup: 'excalibur_set',
        icon: '📜', 
        image: 'GAME/Wf/2Chassis.jpg',
        color: '#c8a84b',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_excal_systems',
        name: 'Excalibur系统蓝图', 
        exclusiveGroup: 'excalibur_set',
        icon: '📜', 
        image: 'GAME/Wf/3Systems.jpg',
        color: '#c8a84b',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },

    // Volt 蓝图
    { 
        id: 'bp_volt',
        name: 'Volt蓝图', 
        exclusiveGroup: 'volt_set',
        icon: '📜', 
        image: 'GAME/Wf/Volt.jpg',
        color: '#00d4ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_volt_neuroptics',
        name: 'Volt头部神经光元蓝图', 
        exclusiveGroup: 'volt_set',
        icon: '📜', 
        image: 'GAME/Wf/1Helmet.jpg',
        color: '#00d4ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_volt_chassis',
        name: 'Volt机体蓝图', 
        exclusiveGroup: 'volt_set',
        icon: '📜', 
        image: 'GAME/Wf/2Chassis.jpg',
        color: '#00d4ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_volt_systems',
        name: 'Volt系统蓝图', 
        exclusiveGroup: 'volt_set',
        icon: '📜', 
        image: 'GAME/Wf/3Systems.jpg',
        color: '#00d4ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },

    // Mag 蓝图
    { 
        id: 'bp_mag',
        name: 'Mag蓝图', 
        exclusiveGroup: 'mag_set',
        icon: '📜', 
        image: 'GAME/Wf/Mag.jpg',
        color: '#ff66ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_mag_neuroptics',
        name: 'Mag头部神经光元蓝图', 
        exclusiveGroup: 'mag_set',
        icon: '📜', 
        image: 'GAME/Wf/1Helmet.jpg',
        color: '#ff66ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_mag_chassis',
        name: 'Mag机体蓝图', 
        exclusiveGroup: 'mag_set',
        icon: '📜', 
        image: 'GAME/Wf/2Chassis.jpg',
        color: '#ff66ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    },
    { 
        id: 'bp_mag_systems',
        name: 'Mag系统蓝图', 
        exclusiveGroup: 'mag_set',
        icon: '📜', 
        image: 'GAME/Wf/3Systems.jpg',
        color: '#ff66ff',
        dropRate: 0.15, 
        minAmount: 1, 
        maxAmount: 1, 
        type: 'blueprint',
        bossOnly: true
    }
];






// 矿脉配置
const VEIN_TYPES = [
    // ==========低概率==========
    { id: 'flame_Cryotic', name: '永冻晶矿', icon: '🔥', image: 'GAME/items/2/2Cryotic.jpg', color: '#ff6600', rarity: 'common', region: ['beast_bone', 'blue_red_crystal', 'symbiotic'], dropWeight: 35, cardId: 'g_amorphous_stabilizer2' },
    
    // 巨兽之骸区域 (m_zone1)
    { id: 'flame_crystal', name: '炎晶', icon: '🔥', image: 'GAME/items/1/a/Pyrol.jpg', color: '#ff6600', rarity: 'common', region: 'beast_bone', dropWeight: 35, cardId: 'm_iron' },
    { id: 'subcopper', name: '亚铜', icon: '🟫', image: 'GAME/items/1/a/Coprun.jpg', color: '#b87333', rarity: 'common', region: 'beast_bone', dropWeight: 35, cardId: 'm_copper' },
    { id: 'azurite', name: '石青', icon: '🔵', image: 'GAME/items/1/a/Azurite.jpg', color: '#0088ff', rarity: 'common', region: 'beast_bone', dropWeight: 30, cardId: 'm_orokin' },
    { id: 'brother_stone', name: '兄弟之石', icon: '🤝', image: 'GAME/items/1/a/Devar.jpg', color: '#888', rarity: 'common', region: 'beast_bone', dropWeight: 30, cardId: 'm_orokin2' },
    { id: 'jade_fluorite', name: '翠萤石', icon: '💚', image: 'GAME/items/1/a/Veridos.jpg', color: '#4eff4e', rarity: 'common', region: 'beast_bone', dropWeight: 25, cardId: 'm_orokin3' },
    { id: 'crimson_stone', name: '绯红石', icon: '🔴', image: 'GAME/items/1/a/Crimzian.jpg', color: '#ff4444', rarity: 'common', region: 'beast_bone', dropWeight: 25, cardId: 'm_orokin4' },
    { id: 'iron_rock', name: '铁岩', icon: '⬛', image: 'GAME/items/1/a/Ferros.jpg', color: '#555', rarity: 'uncommon', region: 'beast_bone', dropWeight: 15, cardId: 'm_silver' },
    { id: 'mind_crystal', name: '心智晶核', icon: '🧠', image: 'GAME/items/1/a/Sentrium.jpg', color: '#ff66ff', rarity: 'uncommon', region: 'beast_bone', dropWeight: 12, cardId: 'm_orokin5' },
    { id: 'spirit_stone', name: '灵息石', icon: '✨', image: 'GAME/items/1/a/Nyth.jpg', color: '#00d4ff', rarity: 'uncommon', region: 'beast_bone', dropWeight: 12, cardId: 'm_orokin6' },
    { id: 'gold_shine', name: '金辉', icon: '🟨', image: 'GAME/items/1/a/Auron.jpg', color: '#ffd700', rarity: 'rare', region: 'beast_bone', dropWeight: 5, cardId: 'm_gold' },

    // 蓝晶与赤晶区域 (m_zone2)
    { id: 'acid_mineral', name: '酸化矿物', icon: '🧪', image: 'GAME/items/1/b/Axidite.jpg', color: '#88ff44', rarity: 'common', region: 'blue_red_crystal', dropWeight: 35, cardId: 'm_iron1' },
    { id: 'ferronickel', name: '铁镍矿', icon: '⚫', image: 'GAME/items/1/b/Travoride.jpg', color: '#666', rarity: 'common', region: 'blue_red_crystal', dropWeight: 35, cardId: 'm_copper2' },
    { id: 'fesmin', name: '翡斯敏石', icon: '💎', image: 'GAME/items/1/b/Phasmin.jpg', color: '#44ff88', rarity: 'common', region: 'blue_red_crystal', dropWeight: 30, cardId: 'm_orokin2' },
    { id: 'night_stone', name: '夜石', icon: '🌙', image: 'GAME/items/1/b/Noctrul.jpg', color: '#4444ff', rarity: 'common', region: 'blue_red_crystal', dropWeight: 30, cardId: 'm_orokin3' },
    { id: 'filler_grit', name: '填充细石', icon: '⬜', image: 'GAME/items/1/b/Goblite.jpg', color: '#aaa', rarity: 'common', region: 'blue_red_crystal', dropWeight: 25, cardId: 'm_orokin4' },
    { id: 'dawn_ore', name: '启明矿石', icon: '🌅', image: 'GAME/items/1/b/Venerol.jpg', color: '#ffaa00', rarity: 'uncommon', region: 'blue_red_crystal', dropWeight: 15, cardId: 'm_silver2' },
    { id: 'amaranth', name: '紫苋石', icon: '💜', image: 'GAME/items/1/b/Amarast.jpg', color: '#aa44ff', rarity: 'uncommon', region: 'blue_red_crystal', dropWeight: 12, cardId: 'm_orokin5' },
    { id: 'changeng', name: '长庚矿石', icon: '⭐', image: 'GAME/items/1/b/Hesperon.jpg', color: '#c0c0c0', rarity: 'rare', region: 'blue_red_crystal', dropWeight: 5, cardId: 'm_gold2' },
    { id: 'zodiac_gem', name: '黄道宝石', icon: '♈', image: 'GAME/items/1/b/Zodian.jpg', color: '#ffd700', rarity: 'rare', region: 'blue_red_crystal', dropWeight: 4, cardId: 'm_orokin6' },
    { id: 'red_crystal', name: '赤色水晶', icon: '🔴', image: 'GAME/items/1/b/Thyst.jpg', color: '#ff0000', rarity: 'rare', region: 'blue_red_crystal', dropWeight: 4, cardId: 'm_orokin7' },

    // 共生结晶协议区域 (m_zone3)
    { id: 'aladima', name: '阿拉德玛金属', icon: '⚙️', image: 'GAME/items/1/c/Adramalium.jpg', color: '#888', rarity: 'common', region: 'symbiotic', dropWeight: 35, cardId: 'm_iron3' },
    { id: 'baf_crystal', name: '巴弗结晶', icon: '💠', image: 'GAME/items/1/c/Bapholite.jpg', color: '#00aaff', rarity: 'common', region: 'symbiotic', dropWeight: 35, cardId: 'm_copper3' },
    { id: 'dago_amber', name: '达戈琥珀', icon: '🟡', image: 'GAME/items/1/c/Dagonic.jpg', color: '#ffaa00', rarity: 'common', region: 'symbiotic', dropWeight: 30, cardId: 'm_orokin3' },
    { id: 'tiamat_stone', name: '提亚美凝石', icon: '🔷', image: 'GAME/items/1/c/Tiametrite.jpg', color: '#4488ff', rarity: 'common', region: 'symbiotic', dropWeight: 30, cardId: 'm_orokin4' },
    { id: 'namo', name: '纳莫原石', icon: '🪨', image: 'GAME/items/1/c/Namalon.jpg', color: '#666', rarity: 'uncommon', region: 'symbiotic', dropWeight: 15, cardId: 'm_silver3' },
    { id: 'poly_fluorite', name: '聚合荧石', icon: '💡', image: 'GAME/items/1/c/Heciphron.jpg', color: '#88ff88', rarity: 'uncommon', region: 'symbiotic', dropWeight: 12, cardId: 'm_orokin5' },
    { id: 'samo_infected', name: '萨莫感染石', icon: '🦠', image: 'GAME/items/1/c/Thaumica.jpg', color: '#4eff4e', rarity: 'rare', region: 'symbiotic', dropWeight: 5, cardId: 'm_gold3' },
    { id: 'bolt_stone', name: '栓子凝石', icon: '🔩', image: 'GAME/items/1/c/Embolos.jpg', color: '#aa7744', rarity: 'rare', region: 'symbiotic', dropWeight: 4, cardId: 'm_orokin6' },
    { id: 'alien_stone', name: '异源石', icon: '👽', image: 'GAME/items/1/c/Xenorhast.jpg', color: '#ff66ff', rarity: 'rare', region: 'symbiotic', dropWeight: 4, cardId: 'm_orokin7' },
    { id: 'deimos_ene', name: '殁世烯', icon: '💀', image: 'GAME/items/1/c/Necrathene.jpg', color: '#8800ff', rarity: 'rare', region: 'symbiotic', dropWeight: 3, cardId: 'm_orokin8' }
];








// ═══════════════════════════════════════════════════════════════
//  全局伴生稀有掉落配置（不绑定区域，任何采集都可能触发）
// ═══════════════════════════════════════════════════════════════
const GLOBAL_GATHERING_DROPS = [
    {
        id: 'deimos_Tellurium',
        name: '碲',
        icon: '💀',
        image: 'GAME/items/2/3Tellurium.jpg',
        color: '#8800ff',
        rarity: 'legendary',
        cardId: 'g_storage_box_6',  // 对应卡片ID
        // 伴生掉落概率：每次采集有基础概率触发
        baseChance: 0.08,  // 8%基础概率
        // 数量范围
        minAmount: 1,
        maxAmount: 1,
        // 描述
        desc: '仅能在水下 Archwing 任务中获取的极稀有金属，碲是深海科技的必需品'
    }
    // 可以添加更多全局伴生掉落物...
];

// ═══════════════════════════════════════════════════════════════
//  采集区掉落配置 - 参考 Warframe 官方资源稀有度
//  ═══════════════════════════════════════════════════════════════
//  key 必须与 GATHERING_PLANETS 的 id 匹配：
//  earth_gather, venus_gather, deimos_gather, duviri_gather
//  ═══════════════════════════════════════════════════════════════
const GATHERING_DROP_CONFIG = {
    // ===== 地球丛林 - 热带雨林 =====
    earth_gather: {
        name: '地球丛林',
        subName: '热带雨林',
        icon: '🌴',
        color: '#4eff4e',
        gatherables: [
            {
                id: 'alloy_barrel',
                name: '合金桶',
                icon: '🛢️',
                image: 'GAME/items/2/AlloyPlate.jpg',
                color: '#888',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 50,
                maxAmount: 100,
                cardId: 'g_alloy_barrel',  // ← 添加
                drops: [
                    { name: '合金板', image: 'GAME/items/2/AlloyPlate1.jpg', icon: '🔩', type: 'material' }
                ]
            },
            {
                id: 'argon_pegmatite',
                name: '氩伟晶岩',
                icon: '💎',
                image: 'GAME/items/2/Crystal.jpg',
                color: '#00d4ff',
                rarity: 'rare',
                dropRate: 0.15,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_argon_pegmatite',  // ← 添加
                drops: [
                    { name: '氩结晶', image: 'GAME/items/2/Crystal1.jpg', icon: '💠', type: 'material' }
                ]
            },
            {
                id: 'circuit_container',
                name: '电路学存储箱',
                icon: '📦',
                image: 'GAME/items/2/Circuits.jpg',
                color: '#ffaa00',
                rarity: 'uncommon',
                dropRate: 0.50,
                minAmount: 15,
                maxAmount: 25,
                cardId: 'g_circuit_container',  // ← 添加
                drops: [
                    { name: '电路', image: 'GAME/items/2/Circuits1.jpg', icon: '🔌', type: 'material' }
                ]
            },
            {
                id: 'control_box_1',
                name: '机器人学存储器',
                icon: '📦',
                image: 'GAME/items/2/Contdule.jpg',
                color: '#4488ff',
                rarity: 'rare',
                dropRate: 0.25,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_control_box_1',  // ← 添加
                drops: [
                    { name: '控制模块', image: 'GAME/items/2/Contdule1.jpg', icon: '⚙️', type: 'material' }
                ]
            },
            {
                id: 'sediment_1',
                name: '铁氧沉积物',
                icon: '🪨',
                image: 'GAME/items/2/Ferrite.jpg',
                color: '#8B4513',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 50,
                maxAmount: 100,
                cardId: 'g_sediment_1',  // ← 添加
                drops: [
                    { name: '铁氧体', image: 'GAME/items/2/Ferrite1.jpg', icon: '⬛', type: 'material' }
                ]
            },
            {
                id: 'sediment_2',
                name: '镓沉积物',
                icon: '🪨',
                image: 'GAME/items/2/Gallium.jpg',
                color: '#C0C0C0',
                rarity: 'rare',
                dropRate: 0.25,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_sediment_2',  // ← 添加
                drops: [
                    { name: '镓', image: 'GAME/items/2/Gallium1.jpg', icon: '⚪', type: 'material' }
                ]
            },
            {
                id: 'amorphous_stabilizer',
                name: '非晶稳定器',
                icon: '🔮',
                image: 'GAME/items/2/Morphics.jpg',
                color: '#ff66ff',
                rarity: 'rare',
                dropRate: 0.25,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_amorphous_stabilizer',  // ← 添加
                drops: [
                    { name: '非晶态合金', image: 'GAME/items/2/Morphics1.jpg', icon: '💎', type: 'material' }
                ]
            }
        ]
    },

    // ===== 金星花园 - 温室花房 =====
    venus_gather: {
        name: '金星花园',
        subName: '温室花房',
        icon: '🌸',
        color: '#ff66ff',
        gatherables: [
            {
                id: 'sediment_3',
                name: '孢子培养皿',
                icon: '🪨',
                image: 'GAME/items/2/Spores.jpg',
                color: '#4eff4e',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 150,
                maxAmount: 200,
                cardId: 'g_sediment_3',  // ← 添加
                drops: [
                    { name: '纳米孢子', image: 'GAME/items/2/Spores1.jpg', icon: '🦠', type: 'material' }
                ]
            },
            {
                id: 'storage_box_2',
                name: '神经阵列',
                icon: '📦',
                image: 'GAME/items/2/tensor.jpg',
                color: '#ff4444',
                rarity: 'rare',
                dropRate: 0.15,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_storage_box_2',  // ← 添加
                drops: [
                    { name: '神经传感器', image: 'GAME/items/2/tensor1.jpg', icon: '🧠', type: 'material' }
                ]
            },
            {
                id: 'sediment_4',
                name: '神经团块',
                icon: '🪨',
                image: 'GAME/items/2/Neurodes.jpg',
                color: '#ffd700',
                rarity: 'rare',
                dropRate: 0.25,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_sediment_4',  // ← 添加
                drops: [
                    { name: '神经元', image: 'GAME/items/2/Neurodes1.jpg', icon: '🧠', type: 'material' }
                ]
            },
            {
                id: 'storage_box_3',
                name: '电池阵列',
                icon: '📦',
                image: 'GAME/items/2/OrokinCel.jpg',
                color: '#ffaa00',
                rarity: 'rare',
                dropRate: 0.25,
                minAmount: 1,
                maxAmount: 2,
                cardId: 'g_storage_box_3',  // ← 添加
                drops: [
                    { name: '奥罗金电池', image: 'GAME/items/2/OrokinCel1.jpg', icon: '🔋', type: 'material' }
                ]
            },
            {
                id: 'sediment_5',
                name: '生物甲壳',
                icon: '🪨',
                image: 'GAME/items/2/Plainer.jpg',
                color: '#228B22',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 50,
                maxAmount: 100,
                cardId: 'g_sediment_5',  // ← 添加
                drops: [
                    { name: '生物质', image: 'GAME/items/2/Plainer1.jpg', icon: '🌿', type: 'material' }
                ]
            },
            {
                id: 'storage_box_4',
                name: '聚合物容器',
                icon: '📦',
                image: 'GAME/items/2/Pomedle.jpg',
                color: '#ff6600',
                rarity: 'uncommon',
                dropRate: 0.50,
                minAmount: 15,
                maxAmount: 25,
                cardId: 'g_storage_box_4',  // ← 添加
                drops: [
                    { name: '聚合物束', image: 'GAME/items/2/Pomedle1.jpg', icon: '🧵', type: 'material' }
                ]
            },
            {
                id: 'sediment_6',
                name: '红化结晶构成物',
                icon: '🪨',
                image: 'GAME/items/2/Rubedo.jpg',
                color: '#ff4444',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 15,
                maxAmount: 25,
                cardId: 'g_sediment_6',  // ← 添加
                drops: [
                    { name: '红化结晶', image: 'GAME/items/2/Rubedo1.jpg', icon: '💎', type: 'material' }
                ]
            },
            {
                id: 'storage_box_5',
                name: '压缩过的回收金属',
                icon: '📦',
                image: 'GAME/items/2/Salvage.jpg',
                color: '#888',
                rarity: 'common',
                dropRate: 0.85,
                minAmount: 50,
                maxAmount: 100,
                cardId: 'g_storage_box_5',  // ← 添加
                drops: [
                    { name: '回收金属', image: 'GAME/items/2/Salvage1.jpg', icon: '🔧', type: 'material' }
                ]
            }
        ]
    }
};

// 导出供主程序使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GATHERING_DROP_CONFIG };
}
					
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
					
// ─── 铸造厂分类 ───
const FOUNDRY_CATEGORIES = [
    { key: 'all', label: '📋 全部' },
    { key: 'warframe', label: '🥷 战甲' },
    { key: 'weapon', label: '🔫 武器' },
    { key: 'product', label: '⚙️ 道具' }
];

// ─── 获取配方分类 ───
function getFoundryCategory(recipe) {
    return recipe.category || 'product';
}					
					
					
// ─── 材料图标映射 ───
function getMaterialIcon(name) {
    const icons = {
        '合金板': '🔩',
        '聚合物束': '🧬',
        'Orokin电池': '🔋',
        '电路板': '💠',
        '控制模块': '⚙️',
        '回收金属': '♻️',
        '氩结晶': '💎',
        '神经元': '🧠',
        '虚空光体': '✨',
        '虚空遗物': '📜',
        '虚空精华': '💠',
        'Forma蓝图': '🔷',
        'Orokin催化剂': '🔮',
        '传说核心': '⭐',
        '神经传感器': '🧠',
        '红化结晶': '💎',
        '非晶态合金': '⚪',
        '铁氧体': '⬛',
        '生物质': '🌿',
		'奥罗金电池': '🌿',
        'Excalibur蓝图': '📜',
		'Excalibur头部神经光元蓝图': '📜',
        'Excalibur机体蓝图': '🥷',
        'Excalibur系统蓝图': '🔧',
		'Excalibur头部神经光元': '📜',
		'Excalibur机体': '🥷',
		'Excalibur系统': '🔧'
    };
    return icons[name] || '📦';
}






