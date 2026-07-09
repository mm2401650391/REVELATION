// ═══════════════════════════════════════════════════════════════
//  三级图鉴系统 - 卡片掉落与收集
// ═══════════════════════════════════════════════════════════════

// 图鉴层级结构：大条目(派系) -> 中条目(星球) -> 小条目(卡组) -> 卡片
var CODEX_STRUCTURE = {
	warframe: {
	    name: 'Warframe',
	    icon: '⚔️',
	    color: '#c8a84b',
	    image: 'GAME/IMGs/Wf/mg/1.jpg',
	    blocks: {
	        normal: {
	            name: '⚔️️Base⚔️',
	            icon: '',
	            image: 'GAME/IMGs/Wf/mg/2.jpg',
	            desc: '成长',
	            decks: {
	                'warframe_normal': { name: '⚔️Base⚔️', icon: '<img src="GAME/IMGs/Lo/Tenno.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '普通版本战甲成长回响' }
	            }
	        },
	        prime: {
	            name: '👑Prime👑',
	            icon: '',
	            image: 'GAME/IMGs/Wf/mg/3.jpg',
	            desc: '传承',
	            decks: {
	                'warframe_prime': { name: '👑Prime👑',icon: '<img src="GAME/IMGs/Lo/Tenno.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: 'Prime版本战甲传承回响' }
	            }
	        }
	    }
	},
    grineer: {
        name: 'Grineer',
        icon: '',
        color: '#ff4444',
        image: 'GAME/IMGs/Faction/Grineer.jpg',
        blocks: {
            huanyu: {
                name: '🌟寰宇🌟',
                icon: '',
                image: 'GAME/IMGs/Faction/Grineer.jpg',
                desc: 'Grineer帝国的核心领地',
                decks: {
                    'e_zone1': { name: '☿️游掠凶形☿️', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '基础步兵与游掠单位' },
                    'e_zone2': { name: '☿交锋异士☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '精英战斗单位' },
                    'e_zone3': { name: '☿暴戾战将☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '重型突击单位' },
                    'e_zone4': { name: '☿畸变造物☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '实验性生物武器' },
                    'e_zone5': { name: '☿长空掠影☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '空中作战单位' },
                    'e_zone6': { name: '☿澜下械躯☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '水下机械单位' },
                    'e_zone7': { name: '☿工坊役众☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '工程与维护单位' },
                    'e_zone8': { name: '☿统御凶僚☿', icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '指挥与统治阶层' }
                }
            },
            xingyu_xiongwang: {
                name: '⭐星域凶顽',
                icon: '',
                image: 'GAME/IMGs/Faction/Grineer.jpg',
                desc: '凶悍头目与特殊目标',
                decks: {
                    'janus_key': { name: '🔑雅努斯之钥🔑',  icon: '<img src="GAME/IMGs/Lo/GrineerLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '沃尔与他的雅努斯之钥' }
                }
            }
        }
    },
    corpus: {
        name: 'Corpus', icon: '🔵', color: '#4488ff', image: 'GAME/IMGs/Faction/Corpus.jpg',
        blocks: {
            huanyu_corpus: {
                name: '🌟寰宇🌟',
                icon: '',
                image: 'GAME/IMGs/Faction/Corpus.jpg',
                desc: '工业集团的商业与科研领地',
                decks: {
                    'c_zone1_gas': { name: '☿️机械代理人☿️️', icon: '<img src="GAME/IMGs/Lo/CorpusLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '机械代理人军团' },
                    'c_zone2_walker': { name: '☿️步行机☿️', icon: '<img src="GAME/IMGs/Lo/CorpusLo.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '恐鸟步行机军团' }
                }
            }
        }
    },
    infested: { name: 'Infested', icon: '🟢', color: '#4eff4e', image: 'GAME/IMGs/Faction/Infested.jpg', blocks: {} },
    sentient: { name: 'Sentient', icon: '🟣', color: '#ff66ff', image: 'GAME/IMGs/Faction/Sentient.jpg', blocks: {} },
    orokin: { name: 'Orokin', icon: '👑', color: '#ffd700', image: 'GAME/IMGs/Faction/Orokin.jpg', blocks: {} },
    // ========== 新增：矿物与采集卡包 ==========
    mining: {
        name: '渊岩',
        icon: '👑',
        color: '#ffd700',
        image: 'GAME/IMGs/items/1/c/Necrathene.jpg',
        blocks: {
            huanyu: { // 补全了缺失的中间层级 huanyu
                name: '🌟渊岩🌟',
                icon: '',
                image: 'GAME/IMGs/items/1/c/Necrathene.jpg',
                desc: '蕴含能量的稀有矿物与结晶',
                decks: { 
                    'm_zone1': { name: '☿️晨潮矿坑☿️', icon: '<img src="GAME/IMGs/Lo/Resource.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '基础矿物与伴生矿的采集点' },
                    'm_zone2': { name: '☿️冷却液与矿尘☿️',icon: '<img src="GAME/IMGs/Lo/Resource.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '工业废料与特殊矿尘的回收点' },
                    'm_zone3': { name: '☿️Infested摇篮☿️',icon: '<img src="GAME/IMGs/Lo/Resource.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">', desc: '感染区深处的异化矿物' }
                }
            }
        }
    },
    gathering: {
        name: '繁生',
        icon: '👑',
        color: '#4eff4e',
        image: 'GAME/IMGs/items/2/Neurodes.jpg',
        blocks: {
            huanyu: { 
                name: '️🌱繁生🌱️', // 建议把名字也改成'繁生'，保持风格统一
                icon: '️',
                image: 'GAME/IMGs/items/2/Neurodes.jpg',
                desc: '',
                decks: {
                    'g_zone1': {name: '☿地核裂谷☿', icon: '<img src="GAME/IMGs/Lo/Resource.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">',desc: '' },
                    'g_zone2': {name: '☿异星生态☿',icon: '<img src="GAME/IMGs/Lo/Resource.jpg" style="width:2.8rem;height:2.8rem;filter:drop-shadow(0 0 6px rgba(200,168,75,0.5));">',desc: '' } 
                }
            }
        }
    }
    // 注意：这里不要加逗号，因为 CODEX_STRUCTURE 对象结束了
};

 



// 卡片数据 - 按小条目(deck)分组
// cardType 字段决定卡片视觉风格（覆盖 rarity 的默认映射）：
// normal=绿卡(普通步兵), elite=蓝卡(精英), boss=红卡(高级精英), mechanic=金卡(机制Boss), super=闪红卡(终极Boss)
var DECK_CARDS = {
    // ═══════════════════════════════════════════════════════════════
    //  游掠凶形 - 基础步兵 → 绿卡(normal)
    // ═══════════════════════════════════════════════════════════════
    'e_zone1': [
        // 屠夫系列
        { id: 'c_ylxx_01', name: '屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer帝国最基础的步兵单位，装备简陋但数量庞大', faction: 'grineer' },
        { id: 'c_ylxx_02', name: '沙漠屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-1.jpg', cardType: 'normal', rarity: 1, desc: '适应沙漠环境的屠夫变体，耐热装甲使其能在高温地带作战', faction: 'grineer' },
        { id: 'c_ylxx_03', name: '前线屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-2.jpg', cardType: 'normal', rarity: 1, desc: '部署于战线前沿的屠夫，经历过更多实战磨练', faction: 'grineer' },
        { id: 'c_ylxx_04', name: '龙舰屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队配备的屠夫，接受过零重力作战训练', faction: 'grineer' },
        { id: 'c_ylxx_05', name: '赤毒屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-4.jpg', cardType: 'normal', rarity: 1, desc: '被赤毒强化的屠夫，攻击欲望更加强烈', faction: 'grineer' },
        { id: 'c_ylxx_06', name: '巨牙屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落征召的屠夫，体格更为健壮', faction: 'grineer' },
        { id: 'c_ylxx_07', name: '深空屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-6.jpg', cardType: 'normal', rarity: 1, desc: '在深空哨站服役的屠夫，装备有简易维生系统', faction: 'grineer' },
        { id: 'c_ylxx_08', name: '回旋屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-7.jpg', cardType: 'normal', rarity: 1, desc: '机动性极强的屠夫变体，擅长快速突袭', faction: 'grineer' },
        { id: 'c_ylxx_09', name: '邃域屠夫', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-8.jpg', cardType: 'normal', rarity: 1, desc: '来自虚空边缘的屠夫，身上带有不明能量痕迹', faction: 'grineer' },
        
        // 烈焰刀客系列
        { id: 'c_ylxx_10', name: '烈焰刀客', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade.jpg', cardType: 'normal', rarity: 1, desc: '装备火焰喷射器的近战单位，擅长近距离焚烧敌人', faction: 'grineer' },
        { id: 'c_ylxx_11', name: '巨牙烈焰刀客', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-1.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落改装的烈焰刀客，火焰温度更高', faction: 'grineer' },
        { id: 'c_ylxx_12', name: '赤毒烈焰刀客', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-2.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化使火焰呈现诡异的深红色', faction: 'grineer' },
        { id: 'c_ylxx_13', name: '夜巡者烈焰刀客', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-3.jpg', cardType: 'normal', rarity: 1, desc: '夜巡部队的火焰专家，在黑暗中如明灯般醒目', faction: 'grineer' },
        { id: 'c_ylxx_14', name: '合一众烈焰刀客', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-4.jpg', cardType: 'normal', rarity: 1, desc: '被合一众思想控制的烈焰刀客，火焰中带有虚空能量', faction: 'grineer' },
        
        // 禁卫军
        { id: 'c_ylxx_15', name: '禁卫军', image: 'GAME/IMGs/enemies/Grineer/P1/a/3GrineerProsecutor.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer宫廷守卫，装备 ceremonial 护甲', faction: 'grineer' },
        
        // 重击手系列
        { id: 'c_ylxx_16', name: '重击手', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE.jpg', cardType: 'normal', rarity: 1, desc: '装备重型动力拳套的近战单位，一击可粉碎轻型装甲', faction: 'grineer' },
        { id: 'c_ylxx_17', name: '赤毒猛力爪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的重击手，拳套带有腐蚀性能量', faction: 'grineer' },
        { id: 'c_ylxx_18', name: '夜巡者猛力爪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '夜巡部队的重击专家，擅长夜间突袭', faction: 'grineer' },
        { id: 'c_ylxx_19', name: '巨牙掠食者', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-3.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的狩猎专家，追踪能力出众', faction: 'grineer' },
        { id: 'c_ylxx_20', name: '合一众重击手', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-4.jpg', cardType: 'normal', rarity: 1, desc: '被合一众改造的重击手，拳套中注入了虚空之力', faction: 'grineer' },
        
        // 天蝎系列
        { id: 'c_ylxx_21', name: '天蝎', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE.jpg', cardType: 'normal', rarity: 1, desc: '装备钩索枪的敏捷单位，可将敌人拉至近身', faction: 'grineer' },
        { id: 'c_ylxx_22', name: '龙舰天蝎', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的天蝎，钩索经过磁化改良', faction: 'grineer' },
        { id: 'c_ylxx_23', name: '赤毒天蝎', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的天蝎，钩索带有毒性', faction: 'grineer' },
        { id: 'c_ylxx_24', name: '合一众天蝎', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-3.jpg', cardType: 'normal', rarity: 1, desc: '被合一众控制的天蝎，钩索可撕裂空间', faction: 'grineer' },
        
        // 盾枪兵系列
        { id: 'c_ylxx_25', name: '盾枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE.jpg', cardType: 'normal', rarity: 1, desc: '装备能量盾牌的防御型步兵，可有效抵挡正面攻击', faction: 'grineer' },
        { id: 'c_ylxx_26', name: '巨牙盾枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的盾兵，盾牌由野兽骨骼加固', faction: 'grineer' },
        { id: 'c_ylxx_27', name: '赤毒盾枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的盾兵，盾牌可反弹部分伤害', faction: 'grineer' },
        { id: 'c_ylxx_28', name: '精英盾枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-3.jpg', cardType: 'elite', rarity: 2, desc: '经过特殊训练的盾兵精英，防御技巧炉火纯青', faction: 'grineer' },
        { id: 'c_ylxx_29', name: '合一众盾枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-4.jpg', cardType: 'normal', rarity: 1, desc: '合一众的盾墙卫士，盾牌上刻有虚空符文', faction: 'grineer' }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    //  交锋异士 - 精英战斗单位 → 蓝卡(elite)
    // ═══════════════════════════════════════════════════════════════
    'e_zone2': [
        // 弩炮系列
        { id: 'c_jfys_01', name: '弩炮', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista.jpg', cardType: 'normal', rarity: 1, desc: '装备重型弩炮的远程精英，可在极远距离造成致命伤害', faction: 'grineer' },
        { id: 'c_jfys_02', name: '龙舰弩炮', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-1.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的弩炮手，弩箭可在真空中飞行', faction: 'grineer' },
        { id: 'c_jfys_03', name: '赤毒弩炮', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-2.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的弩炮，弩箭带有爆炸效果', faction: 'grineer' },
        { id: 'c_jfys_04', name: '巨牙弩炮', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-3.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的狩猎弩炮，精准度极高', faction: 'grineer' },
        { id: 'c_jfys_05', name: '合一众弩炮', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-4.jpg', cardType: 'normal', rarity: 1, desc: '合一众的虚空弩炮，弩箭可穿透维度', faction: 'grineer' },
        
        // 爪喀系列
        { id: 'c_jfys_06', name: '爪喀', image: 'GAME/IMGs/enemies/Grineer/P1/b/2GrnArm.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer驯化的凶猛野兽，成群出没时极具威胁', faction: 'grineer' },
        { id: 'c_jfys_07', name: '堕落爪喀', image: 'GAME/IMGs/enemies/Grineer/P1/b/2GrnArm1-1.jpg', cardType: 'elite', rarity: 2, desc: '被虚空能量腐化的爪喀，身体发生诡异变异', faction: 'grineer' },
        
        // 开膛者系列
        { id: 'c_jfys_08', name: '开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter.jpg', cardType: 'normal', rarity: 1, desc: '装备链锯剑的残忍战士，以撕裂敌人肉体为乐', faction: 'grineer' },
        { id: 'c_jfys_09', name: '沙漠开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的开膛者，链锯经过防沙处理', faction: 'grineer' },
        { id: 'c_jfys_10', name: '前线开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的开膛者，杀戮效率经过实战检验', faction: 'grineer' },
        { id: 'c_jfys_11', name: '龙舰开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的开膛者，链锯可在失重环境下使用', faction: 'grineer' },
        { id: 'c_jfys_12', name: '赤毒开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-4.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的开膛者，链锯带有腐蚀性能量', faction: 'grineer' },
        { id: 'c_jfys_13', name: '巨牙开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的开膛者，链锯由野兽牙齿打造', faction: 'grineer' },
        { id: 'c_jfys_14', name: '深空开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-6.jpg', cardType: 'normal', rarity: 1, desc: '深空哨站的开膛者，装备有真空密封装甲', faction: 'grineer' },
        { id: 'c_jfys_15', name: '回旋开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-7.jpg', cardType: 'normal', rarity: 1, desc: '机动性极强的开膛者，可边移动边攻击', faction: 'grineer' },
        { id: 'c_jfys_16', name: '邃域开膛者', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-8.jpg', cardType: 'normal', rarity: 1, desc: '来自虚空边缘的开膛者，链锯可切割空间', faction: 'grineer' },
        
        // 恶徒系列
        { id: 'c_jfys_17', name: '恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE.jpg', cardType: 'normal', rarity: 1, desc: '装备火焰喷射器的精英单位，擅长区域控制', faction: 'grineer' },
        { id: 'c_jfys_18', name: '沙漠恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的火焰专家，火焰温度可达数千度', faction: 'grineer' },
        { id: 'c_jfys_19', name: '前线恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的火焰支援，可有效封锁通道', faction: 'grineer' },
        { id: 'c_jfys_20', name: '龙舰恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的火焰兵，喷射器使用特殊燃料', faction: 'grineer' },
        { id: 'c_jfys_21', name: '赤毒恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-4.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的恶徒，火焰呈现深红色', faction: 'grineer' },
        { id: 'c_jfys_22', name: '巨牙恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的火焰萨满，火焰中带有部落符文', faction: 'grineer' },
        { id: 'c_jfys_23', name: '合一众恶徒', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-6.jpg', cardType: 'normal', rarity: 1, desc: '合一众的虚空火焰使者，火焰可燃烧灵魂', faction: 'grineer' },
        
        // 鬣猫系列
        { id: 'c_jfys_24', name: '鬣猫', image: 'GAME/IMGs/enemies/Grineer/P1/b/5Combat.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer驯化的另一种野兽，比爪喀更加狡猾', faction: 'grineer' },
        { id: 'c_jfys_25', name: '赤毒鬣猫', image: 'GAME/IMGs/enemies/Grineer/P1/b/5Combat1-1.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的鬣猫，速度和攻击性大幅提升', faction: 'grineer' },
        
        // 枪兵系列
        { id: 'c_jfys_26', name: '枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer最基础的远程单位，装备制式步枪', faction: 'grineer' },
        { id: 'c_jfys_27', name: '沙漠枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的枪兵，步枪经过防沙改装', faction: 'grineer' },
        { id: 'c_jfys_28', name: '前线枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的枪兵，射击精度更高', faction: 'grineer' },
        { id: 'c_jfys_29', name: '龙舰枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的枪兵，步枪可在真空环境使用', faction: 'grineer' },
        { id: 'c_jfys_30', name: '赤毒枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-4.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的枪兵，子弹带有腐蚀效果', faction: 'grineer' },
        { id: 'c_jfys_31', name: '巨牙枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的枪兵，使用部落特制弹药', faction: 'grineer' },
        { id: 'c_jfys_32', name: '夜巡者枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-6.jpg', cardType: 'normal', rarity: 1, desc: '夜巡部队的枪兵，装备夜视瞄准镜', faction: 'grineer' },
        { id: 'c_jfys_33', name: '合一众枪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-7.jpg', cardType: 'normal', rarity: 1, desc: '合一众的虚空枪兵，子弹可穿透护盾', faction: 'grineer' },
        { id: 'c_jfys_34', name: '枪兵幸存者', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-8.jpg', cardType: 'elite', rarity: 2, desc: '从无数次战斗中幸存的枪兵，战斗直觉极其敏锐', faction: 'grineer' },
        
        // 怒焚者系列
        { id: 'c_jfys_35', name: '怒焚者', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL.jpg', cardType: 'normal', rarity: 1, desc: '极度狂暴的火焰战士，全身缠绕着永不熄灭的烈焰', faction: 'grineer' },
        { id: 'c_jfys_36', name: '赤毒怒焚者', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL1-1.jpg', cardType: 'normal', rarity: 1, desc: '赤毒与火焰融合的产物，触碰即被焚烧殆尽', faction: 'grineer' },
        { id: 'c_jfys_37', name: '合一众怒焚者', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL1-2.jpg', cardType: 'normal', rarity: 1, desc: '合一众的终极火焰兵器，火焰中蕴含虚空毁灭之力', faction: 'grineer' },
        
        // 追踪者系列
        { id: 'c_jfys_38', name: '追踪者', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE.jpg', cardType: 'normal', rarity: 1, desc: '装备追踪弹药的精英射手，擅长锁定移动目标', faction: 'grineer' },
        { id: 'c_jfys_39', name: '沙漠追踪者', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的追踪专家，可在沙尘暴中精准射击', faction: 'grineer' },
        { id: 'c_jfys_40', name: '前线追踪者', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的追踪射手，负责清除高价值目标', faction: 'grineer' },
        { id: 'c_jfys_41', name: '龙舰追踪者', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的追踪者，弹药可在太空中追踪目标', faction: 'grineer' },
        { id: 'c_jfys_42', name: '赤毒者追踪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-4.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的追踪者，弹药带有追踪孢子', faction: 'grineer' },
        { id: 'c_jfys_43', name: '巨牙追踪者', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的追踪猎手，使用野兽骨骼制作的追踪箭', faction: 'grineer' },
        { id: 'c_jfys_44', name: '夜巡者追踪兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-6.jpg', cardType: 'normal', rarity: 1, desc: '夜巡部队的追踪专家，可在完全黑暗中锁定目标', faction: 'grineer' },
        
        // 骑兵系列
        { id: 'c_jfys_45', name: '骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun.jpg', cardType: 'normal', rarity: 1, desc: '装备喷气背包的空中单位，可从空中发动突袭', faction: 'grineer' },
        { id: 'c_jfys_46', name: '沙漠骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的骑兵，喷气背包经过防沙改装', faction: 'grineer' },
        { id: 'c_jfys_47', name: '前线骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的骑兵，负责快速支援和包抄', faction: 'grineer' },
        { id: 'c_jfys_48', name: '龙舰骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-3.jpg', cardType: 'normal', rarity: 1, desc: '龙舰舰队的骑兵，可在零重力环境中自由飞行', faction: 'grineer' },
        { id: 'c_jfys_49', name: '赤毒骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-4.jpg', cardType: 'normal', rarity: 1, desc: '赤毒强化的骑兵，飞行轨迹带有腐蚀性尾迹', faction: 'grineer' },
        { id: 'c_jfys_50', name: '巨牙骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的空中猎手，使用野兽皮革制作的飞行翼', faction: 'grineer' },
        { id: 'c_jfys_51', name: '合一众骑兵', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-6.jpg', cardType: 'normal', rarity: 1, desc: '合一众的虚空骑兵，飞行时可短暂穿越维度', faction: 'grineer' },
        { id: 'c_jfys_52', name: '骑兵幸存者', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-7.jpg', cardType: 'elite', rarity: 2, desc: '从无数次空战中幸存的骑兵，飞行技巧出神入化', faction: 'grineer' }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    //  暴戾战将 - 重型/Boss单位 → 红卡(boss) / 金卡(mechanic)
    // ═══════════════════════════════════════════════════════════════
    'e_zone3': [
        // 执法员系列
        { id: 'c_blzj_01', name: '执法员', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher.jpg', cardType: 'boss', rarity: 3, desc: 'Grineer的执法精英，装备重型护甲和能量武器', faction: 'grineer' },
        { id: 'c_blzj_02', name: '巨牙掠夺者', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-1.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的掠夺专家，擅长搜刮和破坏', faction: 'grineer' },
        { id: 'c_blzj_03', name: '夜巡执法员', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-2.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的执法者，在黑暗中如同死神', faction: 'grineer' },
        { id: 'c_blzj_04', name: '夜巡掠夺者', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-3.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的掠夺精英，从不留下活口', faction: 'grineer' },
        { id: 'c_blzj_05', name: '爆破型执法员', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-4.jpg', cardType: 'boss', rarity: 3, desc: '装备自爆装置的执法员，死亡时引发大规模爆炸', faction: 'grineer' },
        
        // 轰击者系列
        { id: 'c_blzj_06', name: '轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE.jpg', cardType: 'boss', rarity: 3, desc: '装备重型火箭发射器的毁灭者，一击可摧毁整片区域', faction: 'grineer' },
        { id: 'c_blzj_07', name: '赤毒轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-1.jpg', cardType: 'boss', rarity: 3, desc: '赤毒强化的轰击者，火箭弹带有腐蚀云雾', faction: 'grineer' },
        { id: 'c_blzj_08', name: '巨牙轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-2.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的重型炮兵，使用部落特制炸药', faction: 'grineer' },
        { id: 'c_blzj_09', name: '巨牙迫击炮轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-3.jpg', cardType: 'boss', rarity: 3, desc: '装备迫击炮的轰击者，可进行超远程曲射打击', faction: 'grineer' },
        { id: 'c_blzj_10', name: '夜巡者机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-4.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的重型机枪手，火力压制能力极强', faction: 'grineer' },
        { id: 'c_blzj_11', name: '合一众轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-5.jpg', cardType: 'boss', rarity: 3, desc: '合一众的虚空炮兵，火箭弹可撕裂空间', faction: 'grineer' },
        
        // 指挥官
        { id: 'c_blzj_12', name: '指挥官', image: 'GAME/IMGs/enemies/Grineer/P1/c/3GrineerMariner.jpg', cardType: 'elite', rarity: 2, desc: 'Grineer部队的战术指挥官，可呼叫增援和空袭', faction: 'grineer' },
        
        // 爪喀驯兽师系列
        { id: 'c_blzj_13', name: '爪喀驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster.jpg', cardType: 'elite', rarity: 2, desc: '精通爪喀驯化的大师，可同时指挥多只爪喀作战', faction: 'grineer' },
        { id: 'c_blzj_14', name: '赤毒爪喀驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster1-1.jpg', cardType: 'elite', rarity: 2, desc: '赤毒强化的驯兽师，爪喀群更加狂暴难以控制', faction: 'grineer' },
        { id: 'c_blzj_15', name: '堕落爪喀驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster1-2.jpg', cardType: 'elite', rarity: 2, desc: '被虚空腐化的驯兽师，指挥着变异的虚空爪喀', faction: 'grineer' },
        
        // 重型机枪手系列
        { id: 'c_blzj_16', name: '重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE.jpg', cardType: 'boss', rarity: 3, desc: '装备转轮机枪的重型单位，可持续输出毁灭性火力', faction: 'grineer' },
        { id: 'c_blzj_17', name: '沙漠重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-1.jpg', cardType: 'boss', rarity: 3, desc: '沙漠地带的重型机枪手，机枪经过防沙冷却改装', faction: 'grineer' },
        { id: 'c_blzj_18', name: '前线重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-2.jpg', cardType: 'boss', rarity: 3, desc: '战线前沿的重型火力点，可有效封锁整条通道', faction: 'grineer' },
        { id: 'c_blzj_19', name: '龙舰重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-3.jpg', cardType: 'boss', rarity: 3, desc: '龙舰舰队的重型机枪手，机枪可在真空环境持续射击', faction: 'grineer' },
        { id: 'c_blzj_20', name: '赤毒重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-4.jpg', cardType: 'boss', rarity: 3, desc: '赤毒强化的重型机枪手，子弹带有腐蚀和燃烧双重效果', faction: 'grineer' },
        { id: 'c_blzj_21', name: '巨牙重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-5.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的重型战士，机枪由野兽骨骼加固', faction: 'grineer' },
        { id: 'c_blzj_22', name: '爆破型重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-6.jpg', cardType: 'boss', rarity: 3, desc: '装备自爆核心的重型机枪手，死亡时引发连锁爆炸', faction: 'grineer' },
        { id: 'c_blzj_23', name: '合一众重型机枪手', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-7.jpg', cardType: 'boss', rarity: 3, desc: '合一众的虚空重型战士，机枪可发射虚空能量弹', faction: 'grineer' },
        
        // 鬣猫驯兽师系列
        { id: 'c_blzj_24', name: '鬣猫驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster.jpg', cardType: 'elite', rarity: 2, desc: '精通鬣猫驯化的大师，可同时指挥多只鬣猫作战', faction: 'grineer' },
        { id: 'c_blzj_25', name: '赤毒鬣猫驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster1-1.jpg', cardType: 'elite', rarity: 2, desc: '赤毒强化的驯兽师，鬣猫群更加狡猾致命', faction: 'grineer' },
        { id: 'c_blzj_26', name: '夜巡者鬣猫驯兽师', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster1-2.jpg', cardType: 'elite', rarity: 2, desc: '夜巡部队的驯兽师，鬣猫可在黑暗中完美隐匿', faction: 'grineer' },
        
        // 狂躁者系列
        { id: 'c_blzj_27', name: '狂躁者', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic.jpg', cardType: 'elite', rarity: 2, desc: '极度狂暴的近战精英，攻击速度极快且无法被控制', faction: 'grineer' },
        { id: 'c_blzj_28', name: '龙舰狂躁者', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic1-1.jpg', cardType: 'boss', rarity: 3, desc: '龙舰舰队的狂躁者，在零重力环境中更加致命', faction: 'grineer' },
        { id: 'c_blzj_29', name: '夜巡狂躁者', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic1-2.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的狂躁精英，黑暗中如同鬼魅般难以捕捉', faction: 'grineer' },
        
        // 火焰轰击者系列
        { id: 'c_blzj_30', name: '火焰轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar.jpg', cardType: 'boss', rarity: 3, desc: '装备火焰喷射器的重型单位，可持续焚烧大片区域', faction: 'grineer' },
        { id: 'c_blzj_31', name: '赤毒火焰轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-1.jpg', cardType: 'boss', rarity: 3, desc: '赤毒与火焰融合的重型兵器，焚烧一切生灵', faction: 'grineer' },
        { id: 'c_blzj_32', name: '巨牙火焰轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-2.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的火焰重型战士，使用部落圣火', faction: 'grineer' },
        { id: 'c_blzj_33', name: '合一众火焰轰击者', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-3.jpg', cardType: 'boss', rarity: 3, desc: '合一众的虚空火焰兵器，火焰可燃烧灵魂', faction: 'grineer' },
        
        // 毒化者系列
        { id: 'c_blzj_34', name: '毒化者', image: 'GAME/IMGs/enemies/Grineer/P1/c/9NoxTemp.jpg', cardType: 'boss', rarity: 3, desc: '释放剧毒云雾的重型单位，触碰即中剧毒', faction: 'grineer' },
        { id: 'c_blzj_35', name: '爆破型毒化者', image: 'GAME/IMGs/enemies/Grineer/P1/c/9NoxTemp1-1.jpg', cardType: 'boss', rarity: 3, desc: '死亡时释放剧毒爆炸的恐怖存在，毒雾可持续数分钟', faction: 'grineer' }
    ],
	
    // ========== 新增：矿物与采集卡片数据 ==========
'm_zone1': [ // 晨潮矿坑 - 基础矿物
    { id: 'm_iron', name: '炎晶', image: 'GAME/IMGs/items/1/a/Pyrol.jpg', cardType: 'normal', rarity: 1, desc: '夜灵平原最常见的基础矿物，炎晶是入门级锻造材料。', faction: 'mining' },
    { id: 'm_copper', name: '亚铜', image: 'GAME/IMGs/items/1/a/Coprun.jpg', cardType: 'normal', rarity: 1, desc: '导电性良好的常见矿物，亚铜是电子元件的基础材料。', faction: 'mining' },
    { id: 'm_silver', name: '铁岩', image: 'GAME/IMGs/items/1/a/Ferros.jpg', cardType: 'normal', rarity: 1, desc: '较为坚固的常见矿物，铁岩用于制造中级合金。', faction: 'mining' },
    { id: 'm_gold', name: '金辉', image: 'GAME/IMGs/items/1/a/Auron.jpg', cardType: 'elite', rarity: 2, desc: '稀有的贵金属矿物，金辉是财富和高级工艺的象征。', faction: 'mining' },
    { id: 'm_orokin', name: '石青', image: 'GAME/IMGs/items/1/a/Azurite.jpg', cardType: 'boss', rarity: 3, desc: '需要完美采集才能获得的传说矿物，石青蕴含神秘能量。', faction: 'mining' },
    { id: 'm_orokin2', name: '兄弟之石', image: 'GAME/IMGs/items/1/a/Devar.jpg', cardType: 'boss', rarity: 3, desc: '稀有的双生矿物，兄弟之石在特定矿脉中才能发现。', faction: 'mining' },
    { id: 'm_orokin3', name: '翠萤石', image: 'GAME/IMGs/items/1/a/Veridos.jpg', cardType: 'boss', rarity: 3, desc: '散发着翠绿光芒的稀有宝石，翠萤石是高级装饰品的原料。', faction: 'mining' },
    { id: 'm_orokin4', name: '绯红石', image: 'GAME/IMGs/items/1/a/Crimzian.jpg', cardType: 'boss', rarity: 3, desc: '血红色的稀有宝石，绯红石蕴含着炽热的能量。', faction: 'mining' },
    { id: 'm_orokin5', name: '心智晶核', image: 'GAME/IMGs/items/1/a/Sentrium.jpg', cardType: 'mechanic', rarity: 4, desc: '极其稀有的心智系矿物，心智晶核与 Sentient 技术有关。', faction: 'mining' },
    { id: 'm_orokin6', name: '灵息石', image: 'GAME/IMGs/items/1/a/Nyth.jpg', cardType: 'mechanic', rarity: 4, desc: '传说中的灵息石，仅在最完美的矿脉中才能发现。', faction: 'mining' },
],

'm_zone2': [ // 冷却液与矿尘 - 工业废料
    { id: 'm_iron1', name: '酸化矿物', image: 'GAME/IMGs/items/1/b/Axidite.jpg', cardType: 'normal', rarity: 1, desc: '奥布山谷中常见的基础矿物，酸化矿物是工业废料回收的产物。', faction: 'mining' },
    { id: 'm_copper2', name: '铁镍矿', image: 'GAME/IMGs/items/1/b/Travoride.jpg', cardType: 'normal', rarity: 1, desc: '含有大量铁镍成分的常见矿物，铁镍矿是基础合金原料。', faction: 'mining' },
    { id: 'm_silver2', name: '启明矿石', image: 'GAME/IMGs/items/1/b/Venerol.jpg', cardType: 'normal', rarity: 1, desc: '在寒冷地带发现的不常见矿物，启明矿石有微弱的荧光。', faction: 'mining' },
    { id: 'm_gold2', name: '长庚矿石', image: 'GAME/IMGs/items/1/b/Hesperon.jpg', cardType: 'elite', rarity: 2, desc: '稀有的贵金属矿石，长庚矿石在极端环境下形成。', faction: 'mining' },
    { id: 'm_orokin2_b', name: '翡斯敏石', image: 'GAME/IMGs/items/1/b/Phasmin.jpg', cardType: 'boss', rarity: 3, desc: '散发着翡翠光芒的稀有宝石，翡斯敏石极为珍贵。', faction: 'mining' },
    { id: 'm_orokin3_b', name: '夜石', image: 'GAME/IMGs/items/1/b/Noctrul.jpg', cardType: 'boss', rarity: 3, desc: '在黑暗中发光的神秘宝石，夜石仅在特定时间出现。', faction: 'mining' },
    { id: 'm_orokin4_b', name: '填充细石', image: 'GAME/IMGs/items/1/b/Goblite.jpg', cardType: 'boss', rarity: 3, desc: '内部充满液态矿物的稀有宝石，填充细石是高级工艺材料。', faction: 'mining' },
    { id: 'm_orokin5_b', name: '紫苋石', image: 'GAME/IMGs/items/1/b/Amarast.jpg', cardType: 'boss', rarity: 3, desc: '深紫色的稀有宝石，紫苋石在贵族中极受欢迎。', faction: 'mining' },
    { id: 'm_orokin6_b', name: '黄道宝石', image: 'GAME/IMGs/items/1/b/Zodian.jpg', cardType: 'mechanic', rarity: 4, desc: '与黄道十二宫相关的传说宝石，黄道宝石蕴含星辰之力。', faction: 'mining' },
    { id: 'm_orokin7', name: '赤色水晶', image: 'GAME/IMGs/items/1/b/Thyst.jpg', cardType: 'mechanic', rarity: 4, desc: '血红色的传说水晶，赤色水晶是顶级装备的关键材料。', faction: 'mining' },
],

'm_zone3': [ // Infested摇篮 - 异化矿物
    { id: 'm_iron3', name: '阿拉德玛金属', image: 'GAME/IMGs/items/1/c/Adramalium.jpg', cardType: 'normal', rarity: 1, desc: '魔胎之境中最常见的基础矿物，阿拉德玛金属被 Infested 侵蚀。', faction: 'mining' },
    { id: 'm_copper3', name: '巴弗结晶', image: 'GAME/IMGs/items/1/c/Bapholite.jpg', cardType: 'normal', rarity: 1, desc: '被 Infested 感染的常见结晶，巴弗结晶有生物活性。', faction: 'mining' },
    { id: 'm_silver3', name: '纳莫原石', image: 'GAME/IMGs/items/1/c/Namalon.jpg', cardType: 'normal', rarity: 1, desc: '较为稀有的异化矿物，纳莫原石在深层矿脉中发现。', faction: 'mining' },
    { id: 'm_gold3', name: '萨莫感染石', image: 'GAME/IMGs/items/1/c/Thaumica.jpg', cardType: 'elite', rarity: 2, desc: '高度感染的稀有矿物，萨莫感染石蕴含危险能量。', faction: 'mining' },
    { id: 'm_orokin3_c', name: '达戈琥珀', image: 'GAME/IMGs/items/1/c/Dagonic.jpg', cardType: 'boss', rarity: 3, desc: '远古达戈文明的琥珀化石，达戈琥珀是考古级珍品。', faction: 'mining' },
    { id: 'm_orokin4_c', name: '提亚美凝石', image: 'GAME/IMGs/items/1/c/Tiametrite.jpg', cardType: 'boss', rarity: 3, desc: '以古神提亚美命名的稀有宝石，提亚美凝石蕴含混沌之力。', faction: 'mining' },
    { id: 'm_orokin5_c', name: '聚合荧石', image: 'GAME/IMGs/items/1/c/Heciphron.jpg', cardType: 'boss', rarity: 3, desc: '多种矿物聚合而成的荧光宝石，聚合荧石极为罕见。', faction: 'mining' },
    { id: 'm_orokin6_c', name: '栓子凝石', image: 'GAME/IMGs/items/1/c/Embolos.jpg', cardType: 'boss', rarity: 3, desc: '形状如血栓的诡异宝石，栓子凝石在 Infested 核心附近形成。', faction: 'mining' },
    { id: 'm_orokin7_b', name: '异源石', image: 'GAME/IMGs/items/1/c/Xenorhast.jpg', cardType: 'mechanic', rarity: 4, desc: '来自异次元的传说宝石，异源石的存在违反物理法则。', faction: 'mining' },
    { id: 'm_orokin8', name: '殁世烯', image: 'GAME/IMGs/items/1/c/Necrathene.jpg', cardType: 'mechanic', rarity: 4, desc: '殁世机甲的核心材料，殁世烯是魔胎之境最珍贵的矿物。', faction: 'mining' },
],
    
'g_zone1': [ // 地球丛林 - 热带雨林
    { id: 'g_alloy_barrel', name: '合金板', image: 'GAME/IMGs/items/2/AlloyPlate1.jpg', cardType: 'normal', rarity: 1, desc: '地球丛林中常见的工业容器，从中可提取合金板用于战甲制造。', faction: 'gathering' },
    { id: 'g_argon_pegmatite', name: '氩结晶', image: 'GAME/IMGs/items/2/Crystal1.jpg', cardType: 'elite', rarity: 2, desc: '蕴含氩气的稀有晶体矿脉，是氩结晶的天然来源。', faction: 'gathering' },
    { id: 'g_circuit_container', name: '电路', image: 'GAME/IMGs/items/2/Circuits1.jpg', cardType: 'normal', rarity: 1, desc: '储存着大量电路元件的密封容器，电路是 Corpus 科技的基础。', faction: 'gathering' },
    { id: 'g_control_box_1', name: '控制模块', image: 'GAME/IMGs/items/2/Contdule1.jpg', cardType: 'elite', rarity: 2, desc: '高级机器人控制模块的存储单元，内含珍贵的控制模块。', faction: 'gathering' },
    { id: 'g_sediment_1', name: '铁氧体', image: 'GAME/IMGs/items/2/Ferrite1.jpg', cardType: 'normal', rarity: 1, desc: '地球丛林地表常见的铁矿沉积，可提炼铁氧体用于基础制造。', faction: 'gathering' },
    { id: 'g_sediment_2', name: '镓', image: 'GAME/IMGs/items/2/Gallium1.jpg', cardType: 'elite', rarity: 2, desc: '稀有的镓元素沉积矿，镓是高级合金的关键材料。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer', name: '非晶态合金', image: 'GAME/IMGs/items/2/Morphics1.jpg', cardType: 'elite', rarity: 2, desc: '维持非晶态合金稳定性的特殊装置，非晶态合金极其珍贵。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer1', name: '奥席金属', image: 'GAME/IMGs/items/2/1Oxium.jpg', cardType: 'boss', rarity: 3, desc: '仅能在 Archwing 任务中获取的稀有金属，奥席金属是高级航天的关键材料。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer2', name: '永冻晶矿', image: 'GAME/IMGs/items/2/2Cryotic.jpg', cardType: 'normal', rarity: 1, desc: '在挖掘任务中可大量获取的冷冻晶体，永冻晶矿是温控设备的原料。', faction: 'gathering' },
],

'g_zone2': [ // 金星花园 - 温室花房
    { id: 'g_sediment_3', name: '纳米孢子', image: 'GAME/IMGs/items/2/Spores1.jpg', cardType: 'normal', rarity: 1, desc: '金星温室中培育的活性孢子培养皿，纳米孢子是生物研究的基础材料。', faction: 'gathering' },
    { id: 'g_storage_box_2', name: '神经传感器', image: 'GAME/IMGs/items/2/tensor1.jpg', cardType: 'elite', rarity: 2, desc: '精密的神经传感器阵列，神经传感器用于高科技装备制造。', faction: 'gathering' },
    { id: 'g_sediment_4', name: '神经元', image: 'GAME/IMGs/items/2/Neurodes1.jpg', cardType: 'elite', rarity: 2, desc: '浓缩的神经组织团块，可提取神经元用于生物工程。', faction: 'gathering' },
    { id: 'g_storage_box_3', name: '奥罗金电池', image: 'GAME/IMGs/items/2/OrokinCel1.jpg', cardType: 'elite', rarity: 2, desc: '储存奥罗金能量的电池组，奥罗金电池是稀有能源材料。', faction: 'gathering' },
    { id: 'g_sediment_5', name: '生物质', image: 'GAME/IMGs/items/2/Plainer1.jpg', cardType: 'normal', rarity: 1, desc: '金星生物的外壳残骸，生物质是生物材料的重要来源。', faction: 'gathering' },
    { id: 'g_storage_box_4', name: '聚合物束', image: 'GAME/IMGs/items/2/Pomedle1.jpg', cardType: 'normal', rarity: 1, desc: '装满高分子聚合物的容器，聚合物束广泛应用于装备制造。', faction: 'gathering' },
    { id: 'g_sediment_6', name: '红化结晶', image: 'GAME/IMGs/items/2/Rubedo1.jpg', cardType: 'normal', rarity: 1, desc: '含有红化结晶的矿物构造，红化结晶具有独特的光学特性。', faction: 'gathering' },
    { id: 'g_storage_box_5', name: '回收金属', image: 'GAME/IMGs/items/2/Salvage1.jpg', cardType: 'normal', rarity: 1, desc: '压缩处理的废旧金属块，回收金属是资源回收再利用的产物。', faction: 'gathering' },
    { id: 'g_storage_box_6', name: '碲', image: 'GAME/IMGs/items/2/3Tellurium.jpg', cardType: 'boss', rarity: 3, desc: '仅能在水下 Archwing 任务中获取的极稀有金属，碲是深海科技的必需品。', faction: 'gathering' },
],

    // ═══════════════════════════════════════════════════════════════
    //  雅努斯之钥卡组 - 星域凶顽
    // ═══════════════════════════════════════════════════════════════
    'janus_key': [
        { id: 'c_vor_01', name: '沃尔上尉', image: 'GAME/IMGs/enemies/Grineer/CaptainVor.jpg', cardType: 'mechanic', rarity: 4, desc: 'Grineer双子女皇麾下大将，雅努斯之钥的守护者。手持灵能之钥，可操控雅努斯能量场压制敌人。', faction: 'grineer' }
    ],

// ═══ Corpus 集气城市卡组 ═══
'c_zone1_gas': [
    // 基础船员（普通·绿卡）
    { id: 'c_corpus_01', name: '船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: 'Corpus工业集团最基础的武装人员，配备标准激光步枪和能量护盾，负责设施的日常安保巡逻。', faction: 'corpus' },
    { id: 'c_corpus_02', name: '德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '配备德特昂地雷的Corpus工兵，擅长在要道布设陷阱，是防御体系中的重要一环。', faction: 'corpus' },
    { id: 'c_corpus_03', name: '精英船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '经过强化训练的高级船员，装备Dera冲锋枪和增强型护盾，战斗力远超普通船员。', faction: 'corpus' },
    { id: 'c_corpus_04', name: '虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '经过虚空能量强化的船员，虚能辐射使其攻击附带虚空腐蚀效果。', faction: 'corpus' },
    { id: 'c_corpus_05', name: '监工船员', image: 'GAME/IMGs/enemies/Corpus/crewman_supervisor.jpg', cardType: 'normal', rarity: 1, desc: '负责监督生产线运作的高级船员，拥有更强的护盾和战术指挥能力。', faction: 'corpus' },
    { id: 'c_corpus_06', name: '狙击手船员', image: 'GAME/IMGs/enemies/Corpus/crewman_sniper.jpg', cardType: 'normal', rarity: 1, desc: '配备Vulcar狙击步枪的远程单位，能在远距离精准打击目标。', faction: 'corpus' },
    { id: 'c_corpus_07', name: 'Corpus技师', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '负责设施维护和技术支持的Corpus技术人员，能快速修复受损防御系统。', faction: 'corpus' },
    // 变体船员（普通·绿卡）
    { id: 'c_corpus_v01', name: '大地船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '大地产业派遣的驻防船员，装备重型护甲，防御能力突出。', faction: 'corpus' },
    { id: 'c_corpus_v02', name: '气雾船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装侦察兵，行动迅捷，擅长渗透和侦察任务。', faction: 'corpus' },
    { id: 'c_corpus_v03', name: '朱诺船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队成员，攻防均衡，镇压行动的骨干力量。', faction: 'corpus' },
    { id: 'c_corpus_v04', name: '泰洛船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队突击手，高攻击高机动，执行深入敌后破坏任务。', faction: 'corpus' },
    { id: 'c_corpus_v05', name: '艾汐船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队巡逻兵，防御强化型，守护重要设施。', faction: 'corpus' },
    { id: 'c_corpus_v06', name: '沃拉船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击兵，生命值和攻击力大幅强化，正面推进主力。', faction: 'corpus' },
    { id: 'c_corpus_v07', name: '奥穆船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队成员，各项能力均衡，快速响应突发状况。', faction: 'corpus' },
    { id: 'c_corpus_v08', name: '合一众船员', image: 'GAME/IMGs/enemies/Corpus/crewman.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的船员，更加狂暴且不可预测。', faction: 'corpus' },
    { id: 'c_corpus_v09', name: '气雾德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装的德特昂工兵，在侦察任务中也能布设致命陷阱。', faction: 'corpus' },
    { id: 'c_corpus_v10', name: '气雾德特昂突击队员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '气雾突击队的德特昂精英，兼具快速布雷与正面突击能力。', faction: 'corpus' },
    { id: 'c_corpus_v11', name: '泰洛德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队德特昂专家，擅长在敌方阵地秘密布雷。', faction: 'corpus' },
    { id: 'c_corpus_v12', name: '艾汐德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队德特昂工兵，防御突出，保护重要设施入口。', faction: 'corpus' },
    { id: 'c_corpus_v13', name: '沃拉德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装德特昂，生命值大幅提升，能在交火中持续布雷。', faction: 'corpus' },
    { id: 'c_corpus_v14', name: '奥穆德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队德特昂成员，攻防均衡，快速响应布雷任务。', faction: 'corpus' },
    { id: 'c_corpus_v15', name: '合一众德特昂船员', image: 'GAME/IMGs/enemies/Corpus/crewman_detecon.jpg', cardType: 'normal', rarity: 1, desc: '合一众控制的德特昂船员，陷阱更具破坏性，布雷更快。', faction: 'corpus' },
    { id: 'c_corpus_v16', name: '气雾精英船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装精英船员，攻击力和速度大幅强化。', faction: 'corpus' },
    { id: 'c_corpus_v17', name: '气雾精英突击队员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '气雾突击队精英突击手，Dera冲锋枪火力凶猛，突击能力极强。', faction: 'corpus' },
    { id: 'c_corpus_v18', name: '朱诺精英船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴队精英，攻守兼备，防暴行动核心力量。', faction: 'corpus' },
    { id: 'c_corpus_v19', name: '大地精英船员', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'normal', rarity: 1, desc: '大地产业精英护卫，护甲护盾重装强化，防御极强。', faction: 'corpus' },
    { id: 'c_corpus_v20', name: '气雾虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '气雾改造加虚空强化的双重增强船员，攻击附带腐蚀和虚空效果。', faction: 'corpus' },
    { id: 'c_corpus_v21', name: '气雾虚能突击队员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'elite', rarity: 2, desc: '气雾虚能突击精英，高攻击高机动，战场毁灭性打击。', faction: 'corpus' },
    { id: 'c_corpus_v22', name: '朱诺虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴虚能兵，防御攻击系统性提升。', faction: 'corpus' },
    { id: 'c_corpus_v23', name: '泰洛虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '泰洛虚能渗透兵，攻击力极高，擅长游击战术。', faction: 'corpus' },
    { id: 'c_corpus_v24', name: '艾汐虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '艾汐虚能安保兵，防御导向，守护虚空研究设施。', faction: 'corpus' },
    { id: 'c_corpus_v25', name: '沃拉虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装虚能兵，生命护盾大幅强化，正面坚壁。', faction: 'corpus' },
    { id: 'c_corpus_v26', name: '奥穆虚能船员', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动虚能兵，各项均衡，适应各种战场环境。', faction: 'corpus' },
    { id: 'c_corpus_v27', name: '气雾监工船员', image: 'GAME/IMGs/enemies/Corpus/crewman_supervisor.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装监工船员，攻击强化，指挥战斗。', faction: 'corpus' },
    { id: 'c_corpus_v28', name: '合一众监工船员', image: 'GAME/IMGs/enemies/Corpus/crewman_supervisor.jpg', cardType: 'normal', rarity: 1, desc: '合一众控制的高级监工，指挥能力更强。', faction: 'corpus' },
    { id: 'c_corpus_v29', name: '大地狙击手船员', image: 'GAME/IMGs/enemies/Corpus/crewman_sniper.jpg', cardType: 'normal', rarity: 1, desc: '大地产业狙击手，防御强化，远距离火力支援。', faction: 'corpus' },
    { id: 'c_corpus_v30', name: '气雾狙击手船员', image: 'GAME/IMGs/enemies/Corpus/crewman_sniper.jpg', cardType: 'normal', rarity: 1, desc: '气雾狙击手，高攻击高机动，快速移动中精准射击。', faction: 'corpus' },
    { id: 'c_corpus_v31', name: '气雾狙击手突击队员', image: 'GAME/IMGs/enemies/Corpus/crewman_sniper.jpg', cardType: 'elite', rarity: 2, desc: '气雾突击队狙击精英，移动速度极快，边移动边射击。', faction: 'corpus' },
    { id: 'c_corpus_v32', name: '朱诺狙击手船员', image: 'GAME/IMGs/enemies/Corpus/crewman_sniper.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴狙击手，攻守兼备，提供精准火力。', faction: 'corpus' },
    { id: 'c_corpus_v33', name: '气雾技师', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装Corpus技师，快速修复设施同时保持战斗力。', faction: 'corpus' },
    { id: 'c_corpus_v34', name: '朱诺技工', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴队技工，防御强化，维护防暴屏障。', faction: 'corpus' },
    { id: 'c_corpus_v35', name: '气雾技师突击队员', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'elite', rarity: 2, desc: '气雾突击队技工精英，兼具技术和突击能力。', faction: 'corpus' },
    { id: 'c_corpus_v36', name: '泰洛技师', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透技师，敌后快速修复破坏设施。', faction: 'corpus' },
    { id: 'c_corpus_v37', name: '艾汐技工', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保技工，防御强化，维护安保系统。', faction: 'corpus' },
    { id: 'c_corpus_v38', name: '沃拉技工', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装技工，高生命值，交火中持续修复设施。', faction: 'corpus' },
    { id: 'c_corpus_v39', name: '奥穆技工', image: 'GAME/IMGs/enemies/Corpus/technician.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动技工，均衡，快速响应各类维修。', faction: 'corpus' },
    // 机械师（机制·金卡）
    { id: 'c_corpus_08', name: '机械师', image: 'GAME/IMGs/enemies/Corpus/tech.jpg', cardType: 'normal', rarity: 1, desc: 'Corpus高级机械师，操控无人机和自动炮台，设施防御核心。', faction: 'corpus' },
    { id: 'c_corpus_v40', name: '朱诺锤骨机械师', image: 'GAME/IMGs/enemies/Corpus/tech.jpg', cardType: 'elite', rarity: 2, desc: '朱诺防暴机械师，操控锤骨无人机群进行压制性攻击。', faction: 'corpus' },
    { id: 'c_corpus_v41', name: '爆破型机械师', image: 'GAME/IMGs/enemies/Corpus/tech.jpg', cardType: 'boss', rarity: 3, desc: '装备自爆装置的疯狂机械师，攻击极高但生命较低。', faction: 'corpus' },
    // 集气城市专属精英（精英·蓝卡）
    { id: 'c_corpus_e01', name: '驱逐员（迷雾）', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '释放迷雾干扰视野，使目标迷失方向。', faction: 'corpus' },
    { id: 'c_corpus_e02', name: '驱逐员（虚无）', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'elite', rarity: 2, desc: '虚无化能力使其短暂免疫伤害，速度极快。', faction: 'corpus' },
    { id: 'c_corpus_e03', name: '驱逐员（衰竭）', image: 'GAME/IMGs/enemies/Corpus/crewman_supervisor.jpg', cardType: 'elite', rarity: 2, desc: '衰竭力场使周围敌人持续掉血。', faction: 'corpus' },
    { id: 'c_corpus_e04', name: '驱逐员（滞缓）', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '滞缓力场大幅降低周围敌人速度。', faction: 'corpus' },
    { id: 'c_corpus_e05', name: '扰敌员（迷雾）', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '利用迷雾掩护突袭，攻击速度极快。', faction: 'corpus' },
    { id: 'c_corpus_e06', name: '扰敌员（虚无）', image: 'GAME/IMGs/enemies/Corpus/crewman_void.jpg', cardType: 'elite', rarity: 2, desc: '虚无化后发动致命突袭。', faction: 'corpus' },
    { id: 'c_corpus_e07', name: '扰敌员（衰减）', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '衰减攻击削弱目标护甲和护盾。', faction: 'corpus' },
    { id: 'c_corpus_e08', name: '扰敌员（滞缓）', image: 'GAME/IMGs/enemies/Corpus/crewman_elite.jpg', cardType: 'elite', rarity: 2, desc: '滞缓攻击使目标行动迟缓。', faction: 'corpus' },
    // Boss（Boss红卡）
    { id: 'c_corpus_b01', name: '引能船员', image: 'GAME/IMGs/enemies/Corpus/tech.jpg', cardType: 'boss', rarity: 3, desc: '掌控设施能源系统的Corpus指挥官，超强护盾和毁灭性攻击。', faction: 'corpus' },
    { id: 'c_corpus_b02', name: '资料师', image: 'GAME/IMGs/enemies/Corpus/tech.jpg', cardType: 'boss', rarity: 3, desc: '掌握Corpus核心机密的高级研究员，防御极高且拥有特殊能力。', faction: 'corpus' },
    
],

// ═══ Corpus 步行机区域卡组 ═══
'c_zone2_walker': [
    // 基础恐鸟（普通·绿卡）
    { id: 'c_moa_01', name: '逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: 'Corpus基础型步行机，配备激光炮和冲撞攻击程序，是设施巡逻的主力单位。', faction: 'corpus' },
    { id: 'c_moa_02', name: '熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_03', name: '恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: 'Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_04', name: '磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_05', name: '震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_06', name: '微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    // 新增基础恐鸟卡片
    { id: 'c_moa_07', name: '融合恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_fusion.jpg', cardType: 'normal', rarity: 1, desc: 'Corpus融合型步行机，结合多种武器系统，攻防兼备的多用途作战单位。', faction: 'corpus' },
    { id: 'c_moa_08', name: '圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_09', name: '德拉恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_dera.jpg', cardType: 'normal', rarity: 1, desc: '配备德拉脉冲步枪的重型步行机，火力精准且护盾厚实。', faction: 'corpus' },
    { id: 'c_moa_10', name: '双子炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_twin.jpg', cardType: 'normal', rarity: 1, desc: '搭载双联装自动炮的重火力步行机，压制能力极强。', faction: 'corpus' },
    { id: 'c_moa_11', name: '冷冻光束步枪恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_cryo.jpg', cardType: 'normal', rarity: 1, desc: '装备冷冻光束步枪的步行机，可对目标施加冰冻减速效果。', faction: 'corpus' },

    // 金流精英恐鸟卡片
    { id: 'c_moa_v109', name: '金流恐鸟（守护）', image: 'GAME/IMGs/enemies/Corpus/moa_elite_guard.jpg', cardType: 'elite', rarity: 2, desc: '金流精英型步行机，搭载能量护盾发生器，能持续恢复自身护盾。', faction: 'corpus' },
    { id: 'c_moa_v110', name: '金流恐鸟（驱引）', image: 'GAME/IMGs/enemies/Corpus/moa_elite_draw.jpg', cardType: 'elite', rarity: 2, desc: '金流精英型步行机，配备牵引光束发生器，能将目标拖拽至近身距离。', faction: 'corpus' },
    { id: 'c_moa_v111', name: '金流恐鸟（隔离）', image: 'GAME/IMGs/enemies/Corpus/moa_elite_quarantine.jpg', cardType: 'elite', rarity: 2, desc: '金流精英型步行机，部署隔离力场切断敌方能量恢复。', faction: 'corpus' },
    { id: 'c_moa_v112', name: '金流恐鸟（穷凶）', image: 'GAME/IMGs/enemies/Corpus/moa_elite_vicious.jpg', cardType: 'elite', rarity: 2, desc: '金流精英型步行机，暴怒模式下攻击力和移速大幅提升。', faction: 'corpus' },

    // 爆破型恐鸟卡片
    { id: 'c_moa_v113', name: '爆破型逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_demo_reverse.jpg', cardType: 'boss', rarity: 3, desc: '加装自爆系统的逆进恐鸟，受到致命伤害后会引爆核心造成大范围伤害。', faction: 'corpus' },
    { id: 'c_moa_v114', name: '爆破型金流恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_demo_elite.jpg', cardType: 'boss', rarity: 3, desc: '搭载超载自爆装置的精英恐鸟，自爆伤害极高，需优先击毁。', faction: 'corpus' },
    { id: 'c_moa_v50', name: '大地逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v51', name: '气雾逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v52', name: '朱诺逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v53', name: '泰洛逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v54', name: '艾汐逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v55', name: '沃拉逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v56', name: '奥穆逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v57', name: '合一众逆进恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_reverse.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：基础型步行机，配备激光炮和冲撞攻击程序。', faction: 'corpus' },
    { id: 'c_moa_v58', name: '大地熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v115', name: '气雾熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v59', name: '朱诺熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v60', name: '泰洛熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v61', name: '艾汐熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v62', name: '沃拉熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v63', name: '奥穆熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v64', name: '合一众熔岩恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_lava.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：改装了火焰喷射系统的攻击型步行机，灼烧效果可使目标持续掉血。', faction: 'corpus' },
    { id: 'c_moa_v65', name: '大地恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v66', name: '气雾恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v67', name: '泰洛恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v68', name: '艾汐恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v69', name: '沃拉恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v70', name: '奥穆恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v71', name: '合一众恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v72', name: '朱诺恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：Corpus标准型步行机，攻防均衡，配备激光手枪和冲撞程序。', faction: 'corpus' },
    { id: 'c_moa_v73', name: '大地磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v74', name: '气雾磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v75', name: '朱诺磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v76', name: '泰洛磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v77', name: '艾汐磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v78', name: '沃拉磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v79', name: '奥穆磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v80', name: '合一众磁轨炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_railgun.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：配备磁轨炮的远程型步行机，攻击极高但移动缓慢，还能部署无人机辅助作战。', faction: 'corpus' },
    { id: 'c_moa_v81', name: '大地震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v82', name: '气雾震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v83', name: '朱诺震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v84', name: '泰洛震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v85', name: '艾汐震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v86', name: '沃拉震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v87', name: '奥穆震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v88', name: '合一众震荡恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_shock.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：搭载震荡波发生器的控制型步行机，震荡波可使目标眩晕，擅长干扰和群体控制。', faction: 'corpus' },
    { id: 'c_moa_v89', name: '大地微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v90', name: '气雾微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v91', name: '朱诺微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v92', name: '泰洛微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v93', name: '艾汐微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v94', name: '沃拉微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v95', name: '奥穆微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v96', name: '合一众微型恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_mini.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：轻型迷你步行机，体型小巧移动极快，虽攻击力较低但数量众多难以应付。', faction: 'corpus' },
    { id: 'c_moa_v97', name: '气雾融合恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_fusion.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：Corpus融合型步行机，结合多种武器系统，攻防兼备的多用途作战单位。', faction: 'corpus' },
    { id: 'c_moa_v98', name: '大地圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '大地产业强化型，防御和生命值大幅提升，正面推进的主力。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v99', name: '气雾圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '气雾武装改造型，攻击力和速度大幅强化，机动性极高。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v100', name: '朱诺圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v101', name: '泰洛圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '泰洛渗透部队型，高攻击高机动，执行敌后破坏和突袭任务。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v102', name: '艾汐圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '艾汐安保部队型，防御强化型，守护重要设施的安全。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v103', name: '沃拉圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '沃拉重装突击型，生命值和攻击力大幅强化，正面火力压制。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v104', name: '奥穆圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '奥穆机动队型，各项能力均衡，快速响应各种突发状况。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v105', name: '合一众圆盘恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_disc.jpg', cardType: 'normal', rarity: 1, desc: '被Narmer精神控制的狂暴型，各项能力均有所提升且更加不可预测。基础特性：轻型碟状步行机，机动性极强，擅长快速侦察和骚扰作战。', faction: 'corpus' },
    { id: 'c_moa_v106', name: '朱诺德拉恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_dera.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：配备德拉脉冲步枪的重型步行机，火力精准且护盾厚实。', faction: 'corpus' },
    { id: 'c_moa_v107', name: '朱诺双子炮恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_twin.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：搭载双联装自动炮的重火力步行机，压制能力极强。', faction: 'corpus' },
    { id: 'c_moa_v108', name: '朱诺冷冻光束步枪恐鸟', image: 'GAME/IMGs/enemies/Corpus/moa_cryo.jpg', cardType: 'normal', rarity: 1, desc: '朱诺防暴部队型，攻防均衡，防暴镇压行动的核心力量。基础特性：装备冷冻光束步枪的步行机，可对目标施加冰冻减速效果。', faction: 'corpus' },
],

    // ═══════════════════════════════════════════════════════════════
    //  Warframe 普通版卡组 - 由战甲等级达标获得
    // ═══════════════════════════════════════════════════════════════
    'warframe_normal': [
        { id: 'c_wf_excalibur', name: 'Excalibur', icon: '🥷', image: 'GAME/IMGs/Wf/Excalibur.jpg', cardType: 'warframe', rarity: 4, desc: 'Excalibur 是战士精神的缩影。他炉火纯青的剑术可造成高额伤害。他是卓越武学的化身', faction: 'warframe', warframeType: 'excalibur' },
        { id: 'c_wf_volt', name: 'Volt', icon: '⚡', image: 'GAME/IMGs/Wf/Volt.jpg', cardType: 'warframe', rarity: 4, desc: 'Volt的兵装是强大且充满电力的。电流在 Volt 身上涌动。他的攻击可造成高额伤害，并震慑敌人', faction: 'warframe', warframeType: 'volt' },
        { id: 'c_wf_mag', name: 'Mag', icon: '🧲', image: 'GAME/IMGs/Wf/Mag.jpg', cardType: 'warframe', rarity: 4, desc: 'Mag 通过改变磁场来提供群体控制，同时削减敌人的防御力。几乎无人能抵挡她的吸引力或排斥力', faction: 'warframe', warframeType: 'mag' },
        { id: 'c_wf_rhino', name: 'Rhino', icon: '🦏', image: 'GAME/IMGs/Wf/Rhino.jpg', cardType: 'warframe', rarity: 4, desc: 'Rhino 重拳以待。他拥有很高的生存能力和群体控制技能。当他冲锋时，明智的人都会选择不要站在他的对面', faction: 'warframe', warframeType: 'rhino' },
        { id: 'c_wf_ash', name: 'Ash', icon: '🗡️', image: 'GAME/IMGs/Wf/Ash.jpg', cardType: 'warframe', rarity: 4, desc: '看那 Orokin 政治刺杀学派的先师圣人。 Ash 擅长潜行。还没见其刀光，就已命归黄泉', faction: 'warframe', warframeType: 'ash' },
        { id: 'c_wf_ember', name: 'Ember', icon: '🔥', image: 'GAME/IMGs/Wf/Ember.jpg', cardType: 'warframe', rarity: 4, desc: '操纵烈焰之力。Ember 的火焰会造成很高的伤害。即使战斗进入白热化时，她仍能保持冷静的头脑', faction: 'warframe', warframeType: 'ember' }
    ],

    // Prime卡组先预留，不设置卡片与奖励
    'warframe_prime': [
		
    ]
			
};





// 统一的卡片掉落入口（可选，用于统一调用）
function tryDropCard(sourceType, sourceData, quality, extraParam) {
    switch(sourceType) {
        case 'mining':
            return tryDropMiningCard(sourceData, quality, extraParam);
        case 'gathering':
            return tryDropGatheringCard(sourceData, quality, extraParam);
        case 'battle':
            var codexId = (typeof sourceData === 'string') ? sourceData : (sourceData && sourceData.codexId ? sourceData.codexId : null);
            return tryDropCardFromEnemy(codexId, extraParam);
        default:
            return null;
    }
}





var CARD_RARITY = {
    1: { name: '遗落', color: '#888', stars: '★☆☆☆☆', glow: 'none' },
    2: { name: '异变', color: '#4488ff', stars: '★★☆☆☆', glow: '0 0 10px rgba(68,136,255,0.3)' },
    3: { name: '古神', color: '#aa44ff', stars: '★★★☆☆', glow: '0 0 15px rgba(170,68,255,0.4)' },
    4: { name: '混沌', color: '#ffaa00', stars: '★★★★☆', glow: '0 0 20px rgba(255,170,0,0.5)' }
};

var RARITY_NAMES = { 1: 'common', 2: 'rare', 3: 'epic', 4: 'legendary' };

// ═══════════════════════════════════════════════════════════════
//  卡片星级样式配置（外部图片路径）
// ═══════════════════════════════════════════════════════════════

// 星级基础路径
var CARD_STAR_BASE = 'GAME/cards/stars';

// 星级样式配置：5种类型 × 5个星级 = 25种样式
// ═══════════════════════════════════════════════════════════════
//  卡片星级样式配置（纯 CSS 实现，无需外部图片）
// ═══════════════════════════════════════════════════════════════

// 卡片类型映射（根据稀有度或自定义字段）
var CARD_TYPE_MAP = {
    1: 'normal',    // 普通 → 绿卡
    2: 'elite',     // 稀有 → 蓝卡
    3: 'boss',      // 史诗 → 红卡
    4: 'mechanic'   // 传说 → 金卡
    // 5: 'super' → 超级Boss闪红卡
};



// ═══════════════════════════════════════════════════════════════
//  升星需求配置：每种 cardType 的升星所需卡片数量
// ═══════════════════════════════════════════════════════════════
var STAR_UPGRADE_REQUIREMENTS = {
    normal:   { 1: 20, 2: 45, 3: 75, 4: 100 },   // 绿卡
    elite:    { 1: 15, 2: 40, 3: 60, 4: 80 },    // 蓝卡
    boss:     { 1: 10, 2: 30, 3: 50, 4: 70 },    // 红卡
    mechanic: { 1: 8,  2: 25, 3: 40, 4: 60 },    // 金卡
    super:    { 1: 5,  2: 15, 3: 25, 4: 40 },    // 闪红卡
    warframe: { 1: 1,  2: 1,  3: 1,  4: 1 }      // 战甲卡：每级升星只需1张
};

// 获取升星所需数量
function getUpgradeRequirement(cardType, currentStarLevel) {
    var type = cardType || 'normal';
    var reqs = STAR_UPGRADE_REQUIREMENTS[type] || STAR_UPGRADE_REQUIREMENTS['normal'];
    return reqs[currentStarLevel] || null; // 满星返回null
}

// 检查是否满足升星条件
function canUpgradeStar(cardData, currentStarLevel, count) {
    var type = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
    var req = getUpgradeRequirement(type, currentStarLevel);
    if (!req) return false; // 已满星
    return count >= req;
}

// 星级样式配置：5种类型 × 5个星级 = 25种纯 CSS 样式
var CARD_STAR_STYLES = {
    // ═══════════════════════════════════════════════════════════════
    //  华丽版卡片星级样式 - 5种类型 × 5个星级 = 25种特效
    //  每个星级使用双色(c/c2)径向渐变 + 纹理 + 强内光 + 主题粒子
    // ═══════════════════════════════════════════════════════════════

    // 遗落系（绿/铜色 - 旧遗物苏醒主题）
    normal: {
        name: '遗落',
        color: '#65f0a3',
        color2: '#b08c52',
        glow: '0 0 15px rgba(101,240,163,0.35)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(176,140,82,0.12), transparent 32%), radial-gradient(circle at 82% 78%, rgba(101,240,163,0.08), transparent 30%), linear-gradient(145deg, rgba(101,240,163,0.08), #111018)',
                border: 'rgba(101,240,163,0.55)',
                border2: 'rgba(176,140,82,0.35)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(101,240,163,0.20), inset 0 0 18px rgba(176,140,82,0.08)',
                innerBorder: '1px solid rgba(176,140,82,0.32)',
                innerShadow: 'inset 0 0 20px rgba(101,240,163,0.10), 0 0 18px rgba(101,240,163,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(101,240,163,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '✦',
                particleColor: '#b08c52',
                particleOpacity: 0,
                desc: '低语'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(176,140,82,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(101,240,163,0.12), transparent 30%), linear-gradient(145deg, rgba(101,240,163,0.12), #111018)',
                border: 'rgba(101,240,163,0.63)',
                border2: 'rgba(176,140,82,0.40)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(101,240,163,0.26), inset 0 0 25px rgba(176,140,82,0.10)',
                innerBorder: '1px solid rgba(176,140,82,0.40)',
                innerShadow: 'inset 0 0 28px rgba(101,240,163,0.13), 0 0 25px rgba(101,240,163,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(101,240,163,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '◆',
                particleColor: '#b08c52',
                particleOpacity: 0.16,
                desc: '呢喃'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(176,140,82,0.20), transparent 32%), radial-gradient(circle at 82% 78%, rgba(101,240,163,0.16), transparent 30%), linear-gradient(145deg, rgba(101,240,163,0.16), #111018)',
                border: 'rgba(101,240,163,0.71)',
                border2: 'rgba(176,140,82,0.48)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(101,240,163,0.32), inset 0 0 32px rgba(176,140,82,0.13)',
                innerBorder: '1px solid rgba(176,140,82,0.50)',
                innerShadow: 'inset 0 0 36px rgba(101,240,163,0.16), 0 0 32px rgba(101,240,163,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(101,240,163,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '✦',
                particleColor: '#b08c52',
                particleOpacity: 0.35,
                desc: '窥视'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(176,140,82,0.24), transparent 32%), radial-gradient(circle at 82% 78%, rgba(101,240,163,0.20), transparent 30%), linear-gradient(145deg, rgba(101,240,163,0.20), #111018)',
                border: 'rgba(101,240,163,0.80)',
                border2: 'rgba(176,140,82,0.55)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(101,240,163,0.38), inset 0 0 38px rgba(176,140,82,0.16)',
                innerBorder: '1px solid rgba(176,140,82,0.58)',
                innerShadow: 'inset 0 0 44px rgba(101,240,163,0.19), 0 0 40px rgba(101,240,163,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(101,240,163,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: '✦',
                particleColor: '#b08c52',
                particleOpacity: 0.55,
                desc: '凝视'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(176,140,82,0.28), transparent 32%), radial-gradient(circle at 82% 78%, rgba(101,240,163,0.24), transparent 30%), linear-gradient(145deg, rgba(101,240,163,0.24), #111018)',
                border: 'rgba(101,240,163,0.90)',
                border2: 'rgba(176,140,82,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(101,240,163,0.44), inset 0 0 44px rgba(176,140,82,0.19)',
                innerBorder: '1px solid rgba(176,140,82,0.68)',
                innerShadow: 'inset 0 0 52px rgba(101,240,163,0.22), 0 0 48px rgba(101,240,163,0.22)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(101,240,163,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '✪',
                particleColor: '#b08c52',
                particleOpacity: 0.72,
                desc: '⭐苏醒⭐'
            }
        }
    },
    // 异变系（蓝/紫色 - 感染同化主题）
    elite: {
        name: '异变',
        color: '#5adfff',
        color2: '#b56cff',
        glow: '0 0 18px rgba(90,223,255,0.4)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(181,108,255,0.12), transparent 32%), radial-gradient(circle at 82% 78%, rgba(90,223,255,0.08), transparent 30%), linear-gradient(145deg, rgba(90,223,255,0.08), #0e0818)',
                border: 'rgba(90,223,255,0.55)',
                border2: 'rgba(181,108,255,0.35)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(90,223,255,0.20), inset 0 0 18px rgba(181,108,255,0.08)',
                innerBorder: '1px solid rgba(181,108,255,0.32)',
                innerShadow: 'inset 0 0 20px rgba(90,223,255,0.10), 0 0 18px rgba(90,223,255,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(90,223,255,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '✦',
                particleColor: '#b56cff',
                particleOpacity: 0,
                desc: '畸变'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(181,108,255,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(90,223,255,0.12), transparent 30%), linear-gradient(145deg, rgba(90,223,255,0.12), #0e0818)',
                border: 'rgba(90,223,255,0.63)',
                border2: 'rgba(181,108,255,0.40)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(90,223,255,0.26), inset 0 0 25px rgba(181,108,255,0.10)',
                innerBorder: '1px solid rgba(181,108,255,0.40)',
                innerShadow: 'inset 0 0 28px rgba(90,223,255,0.13), 0 0 25px rgba(90,223,255,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(90,223,255,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '◆',
                particleColor: '#b56cff',
                particleOpacity: 0.16,
                desc: '腐化'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(181,108,255,0.20), transparent 32%), radial-gradient(circle at 82% 78%, rgba(90,223,255,0.16), transparent 30%), linear-gradient(145deg, rgba(90,223,255,0.16), #0e0818)',
                border: 'rgba(90,223,255,0.71)',
                border2: 'rgba(181,108,255,0.48)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(90,223,255,0.32), inset 0 0 32px rgba(181,108,255,0.13)',
                innerBorder: '1px solid rgba(181,108,255,0.50)',
                innerShadow: 'inset 0 0 36px rgba(90,223,255,0.16), 0 0 32px rgba(90,223,255,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(90,223,255,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '✹',
                particleColor: '#b56cff',
                particleOpacity: 0.35,
                desc: '侵蚀'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(181,108,255,0.24), transparent 32%), radial-gradient(circle at 82% 78%, rgba(90,223,255,0.20), transparent 30%), linear-gradient(145deg, rgba(90,223,255,0.20), #0e0818)',
                border: 'rgba(90,223,255,0.80)',
                border2: 'rgba(181,108,255,0.55)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(90,223,255,0.38), inset 0 0 38px rgba(181,108,255,0.16)',
                innerBorder: '1px solid rgba(181,108,255,0.58)',
                innerShadow: 'inset 0 0 44px rgba(90,223,255,0.19), 0 0 40px rgba(90,223,255,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(90,223,255,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: '✹',
                particleColor: '#b56cff',
                particleOpacity: 0.55,
                desc: '同化'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(181,108,255,0.28), transparent 32%), radial-gradient(circle at 82% 78%, rgba(90,223,255,0.24), transparent 30%), linear-gradient(145deg, rgba(90,223,255,0.24), #0e0818)',
                border: 'rgba(90,223,255,0.90)',
                border2: 'rgba(181,108,255,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(90,223,255,0.44), inset 0 0 44px rgba(181,108,255,0.19)',
                innerBorder: '1px solid rgba(181,108,255,0.68)',
                innerShadow: 'inset 0 0 52px rgba(90,223,255,0.22), 0 0 48px rgba(90,223,255,0.22)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(90,223,255,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '✷',
                particleColor: '#b56cff',
                particleOpacity: 0.72,
                desc: '⭐降临⭐'
            }
        }
    },
    // 古神系（红/绿色 - 恐惧凝视主题）
    boss: {
        name: '古神',
        color: '#ff4e5f',
        color2: '#42f5b3',
        glow: '0 0 22px rgba(255,78,95,0.45)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(66,245,179,0.12), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,78,95,0.08), transparent 30%), linear-gradient(145deg, rgba(255,78,95,0.08), #180810)',
                border: 'rgba(255,78,95,0.55)',
                border2: 'rgba(66,245,179,0.35)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(255,78,95,0.20), inset 0 0 18px rgba(66,245,179,0.08)',
                innerBorder: '1px solid rgba(66,245,179,0.32)',
                innerShadow: 'inset 0 0 20px rgba(255,78,95,0.10), 0 0 18px rgba(255,78,95,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,78,95,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '☽',
                particleColor: '#42f5b3',
                particleOpacity: 0,
                desc: '深潜'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(66,245,179,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,78,95,0.12), transparent 30%), linear-gradient(145deg, rgba(255,78,95,0.12), #180810)',
                border: 'rgba(255,78,95,0.63)',
                border2: 'rgba(66,245,179,0.40)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(255,78,95,0.26), inset 0 0 25px rgba(66,245,179,0.10)',
                innerBorder: '1px solid rgba(66,245,179,0.40)',
                innerShadow: 'inset 0 0 28px rgba(255,78,95,0.13), 0 0 25px rgba(255,78,95,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,78,95,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '✶',
                particleColor: '#42f5b3',
                particleOpacity: 0.16,
                desc: '星之彩'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(66,245,179,0.20), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,78,95,0.16), transparent 30%), linear-gradient(145deg, rgba(255,78,95,0.16), #180810)',
                border: 'rgba(255,78,95,0.71)',
                border2: 'rgba(66,245,179,0.48)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(255,78,95,0.32), inset 0 0 32px rgba(66,245,179,0.13)',
                innerBorder: '1px solid rgba(66,245,179,0.50)',
                innerShadow: 'inset 0 0 36px rgba(255,78,95,0.16), 0 0 32px rgba(255,78,95,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,78,95,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '⌁',
                particleColor: '#42f5b3',
                particleOpacity: 0.35,
                desc: '廷达罗斯'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(66,245,179,0.24), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,78,95,0.20), transparent 30%), linear-gradient(145deg, rgba(255,78,95,0.20), #180810)',
                border: 'rgba(255,78,95,0.80)',
                border2: 'rgba(66,245,179,0.55)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(255,78,95,0.38), inset 0 0 38px rgba(66,245,179,0.16)',
                innerBorder: '1px solid rgba(66,245,179,0.58)',
                innerShadow: 'inset 0 0 44px rgba(255,78,95,0.19), 0 0 40px rgba(255,78,95,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,78,95,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: 'ψ',
                particleColor: '#42f5b3',
                particleOpacity: 0.55,
                desc: '莎布'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(66,245,179,0.28), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,78,95,0.24), transparent 30%), linear-gradient(145deg, rgba(255,78,95,0.24), #180810)',
                border: 'rgba(255,78,95,0.90)',
                border2: 'rgba(66,245,179,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(255,78,95,0.44), inset 0 0 44px rgba(66,245,179,0.19)',
                innerBorder: '1px solid rgba(66,245,179,0.68)',
                innerShadow: 'inset 0 0 52px rgba(255,78,95,0.22), 0 0 48px rgba(255,78,95,0.22)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,78,95,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '☄',
                particleColor: '#42f5b3',
                particleOpacity: 0.72,
                desc: '⭐克苏鲁⭐'
            }
        }
    },
    // 混沌系（金/白色 - 金色秘仪主题）
    mechanic: {
        name: '混沌',
        color: '#ffd36a',
        color2: '#fff0bd',
        glow: '0 0 25px rgba(255,211,106,0.55)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.12), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,211,106,0.08), transparent 30%), linear-gradient(145deg, rgba(255,211,106,0.08), #141008)',
                border: 'rgba(255,211,106,0.55)',
                border2: 'rgba(255,240,189,0.35)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(255,211,106,0.20), inset 0 0 18px rgba(255,240,189,0.08)',
                innerBorder: '1px solid rgba(255,240,189,0.32)',
                innerShadow: 'inset 0 0 20px rgba(255,211,106,0.10), 0 0 18px rgba(255,211,106,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,211,106,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '△',
                particleColor: '#fff0bd',
                particleOpacity: 0,
                desc: '奈亚'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,211,106,0.12), transparent 30%), linear-gradient(145deg, rgba(255,211,106,0.12), #141008)',
                border: 'rgba(255,211,106,0.63)',
                border2: 'rgba(255,240,189,0.40)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(255,211,106,0.26), inset 0 0 25px rgba(255,240,189,0.10)',
                innerBorder: '1px solid rgba(255,240,189,0.40)',
                innerShadow: 'inset 0 0 28px rgba(255,211,106,0.13), 0 0 25px rgba(255,211,106,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,211,106,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '◇',
                particleColor: '#fff0bd',
                particleOpacity: 0.16,
                desc: '犹格'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.20), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,211,106,0.16), transparent 30%), linear-gradient(145deg, rgba(255,211,106,0.16), #141008)',
                border: 'rgba(255,211,106,0.71)',
                border2: 'rgba(255,240,189,0.48)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(255,211,106,0.32), inset 0 0 32px rgba(255,240,189,0.13)',
                innerBorder: '1px solid rgba(255,240,189,0.50)',
                innerShadow: 'inset 0 0 36px rgba(255,211,106,0.16), 0 0 32px rgba(255,211,106,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,211,106,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '✦',
                particleColor: '#fff0bd',
                particleOpacity: 0.35,
                desc: '阿撒托斯'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.24), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,211,106,0.20), transparent 30%), linear-gradient(145deg, rgba(255,211,106,0.20), #141008)',
                border: 'rgba(255,211,106,0.80)',
                border2: 'rgba(255,240,189,0.55)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(255,211,106,0.38), inset 0 0 38px rgba(255,240,189,0.16)',
                innerBorder: '1px solid rgba(255,240,189,0.58)',
                innerShadow: 'inset 0 0 44px rgba(255,211,106,0.19), 0 0 40px rgba(255,211,106,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,211,106,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: '✧',
                particleColor: '#fff0bd',
                particleOpacity: 0.55,
                desc: '盲目'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.28), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,211,106,0.24), transparent 30%), linear-gradient(145deg, rgba(255,211,106,0.24), #141008)',
                border: 'rgba(255,211,106,0.90)',
                border2: 'rgba(255,240,189,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(255,211,106,0.44), inset 0 0 44px rgba(255,240,189,0.19)',
                innerBorder: '1px solid rgba(255,240,189,0.68)',
                innerShadow: 'inset 0 0 52px rgba(255,211,106,0.22), 0 0 48px rgba(255,211,106,0.22)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,211,106,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '✺',
                particleColor: '#fff0bd',
                particleOpacity: 0.72,
                desc: '⭐原初混沌⭐'
            }
        }
    },
    // 终焉系（黑红/白色 - 虚无崩坏主题）
    super: {
        name: '终焉',
        color: '#ff335f',
        color2: '#c7d2ff',
        glow: '0 0 30px rgba(255,51,95,0.5), 0 0 60px rgba(255,51,95,0.25)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(199,210,255,0.12), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,51,95,0.08), transparent 30%), linear-gradient(145deg, rgba(255,51,95,0.08), #0a0608)',
                border: 'rgba(255,51,95,0.55)',
                border2: 'rgba(199,210,255,0.35)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(255,51,95,0.20), inset 0 0 18px rgba(199,210,255,0.08)',
                innerBorder: '1px solid rgba(199,210,255,0.32)',
                innerShadow: 'inset 0 0 20px rgba(255,51,95,0.10), 0 0 18px rgba(255,51,95,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,51,95,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '◼',
                particleColor: '#c7d2ff',
                particleOpacity: 0,
                desc: '熵增'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(199,210,255,0.16), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,51,95,0.12), transparent 30%), linear-gradient(145deg, rgba(255,51,95,0.12), #0a0608)',
                border: 'rgba(255,51,95,0.63)',
                border2: 'rgba(199,210,255,0.40)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(255,51,95,0.26), inset 0 0 25px rgba(199,210,255,0.10)',
                innerBorder: '1px solid rgba(199,210,255,0.40)',
                innerShadow: 'inset 0 0 28px rgba(255,51,95,0.13), 0 0 25px rgba(255,51,95,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,51,95,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '◫',
                particleColor: '#c7d2ff',
                particleOpacity: 0.16,
                desc: '热寂'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(199,210,255,0.20), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,51,95,0.16), transparent 30%), linear-gradient(145deg, rgba(255,51,95,0.16), #0a0608)',
                border: 'rgba(255,51,95,0.71)',
                border2: 'rgba(199,210,255,0.48)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(255,51,95,0.32), inset 0 0 32px rgba(199,210,255,0.13)',
                innerBorder: '1px solid rgba(199,210,255,0.50)',
                innerShadow: 'inset 0 0 36px rgba(255,51,95,0.16), 0 0 32px rgba(255,51,95,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,51,95,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '⊘',
                particleColor: '#c7d2ff',
                particleOpacity: 0.35,
                desc: '归零'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(199,210,255,0.24), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,51,95,0.20), transparent 30%), linear-gradient(145deg, rgba(255,51,95,0.20), #0a0608)',
                border: 'rgba(255,51,95,0.80)',
                border2: 'rgba(199,210,255,0.55)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(255,51,95,0.38), inset 0 0 38px rgba(199,210,255,0.16)',
                innerBorder: '1px solid rgba(199,210,255,0.58)',
                innerShadow: 'inset 0 0 44px rgba(255,51,95,0.19), 0 0 40px rgba(255,51,95,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,51,95,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: '◌',
                particleColor: '#c7d2ff',
                particleOpacity: 0.55,
                desc: '虚无'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(199,210,255,0.28), transparent 32%), radial-gradient(circle at 82% 78%, rgba(255,51,95,0.24), transparent 30%), linear-gradient(145deg, rgba(255,51,95,0.24), #0a0608)',
                border: 'rgba(255,51,95,0.90)',
                border2: 'rgba(199,210,255,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(255,51,95,0.44), inset 0 0 44px rgba(199,210,255,0.19)',
                innerBorder: '1px solid rgba(199,210,255,0.68)',
                innerShadow: 'inset 0 0 52px rgba(255,51,95,0.22), 0 0 48px rgba(255,51,95,0.22)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(255,51,95,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '◉',
                particleColor: '#c7d2ff',
                particleOpacity: 0.72,
                desc: '⭐阿撒托斯之梦⭐'
            }
        }
    },
    // 战甲金卡（Warframe成长回响 - 铜金主题）
    warframe: {
        name: '战甲',
        color: '#c8a84b',
        color2: '#fff0bd',
        glow: '0 0 22px rgba(200,168,75,0.5)',
        stars: {
            1: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.10), transparent 32%), radial-gradient(circle at 82% 78%, rgba(200,168,75,0.08), transparent 30%), linear-gradient(145deg, rgba(200,168,75,0.10), #12100a)',
                border: 'rgba(200,168,75,0.55)',
                border2: 'rgba(255,240,189,0.30)',
                borderWidth: 2,
                shadow: '0 0 16px rgba(200,168,75,0.20), inset 0 0 18px rgba(255,240,189,0.06)',
                innerBorder: '1px solid rgba(255,240,189,0.28)',
                innerShadow: 'inset 0 0 20px rgba(200,168,75,0.08), 0 0 18px rgba(200,168,75,0.08)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(200,168,75,0.03) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.36,
                particle: '⚔️',
                particleColor: '#fff0bd',
                particleOpacity: 0,
                desc: '初醒'
            },
            2: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.14), transparent 32%), radial-gradient(circle at 82% 78%, rgba(200,168,75,0.12), transparent 30%), linear-gradient(145deg, rgba(200,168,75,0.14), #12100a)',
                border: 'rgba(200,168,75,0.63)',
                border2: 'rgba(255,240,189,0.38)',
                borderWidth: 2,
                shadow: '0 0 20px rgba(200,168,75,0.26), inset 0 0 25px rgba(255,240,189,0.08)',
                innerBorder: '1px solid rgba(255,240,189,0.38)',
                innerShadow: 'inset 0 0 28px rgba(200,168,75,0.10), 0 0 25px rgba(200,168,75,0.10)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(200,168,75,0.05) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.46,
                particle: '◆',
                particleColor: '#fff0bd',
                particleOpacity: 0.16,
                desc: '熟练'
            },
            3: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.18), transparent 32%), radial-gradient(circle at 82% 78%, rgba(200,168,75,0.16), transparent 30%), linear-gradient(145deg, rgba(200,168,75,0.18), #12100a)',
                border: 'rgba(200,168,75,0.71)',
                border2: 'rgba(255,240,189,0.46)',
                borderWidth: 3,
                shadow: '0 0 28px rgba(200,168,75,0.32), inset 0 0 32px rgba(255,240,189,0.10)',
                innerBorder: '1px solid rgba(255,240,189,0.48)',
                innerShadow: 'inset 0 0 36px rgba(200,168,75,0.13), 0 0 32px rgba(200,168,75,0.13)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(200,168,75,0.07) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.56,
                particle: '★',
                particleColor: '#fff0bd',
                particleOpacity: 0.35,
                desc: '共鸣'
            },
            4: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.22), transparent 32%), radial-gradient(circle at 82% 78%, rgba(200,168,75,0.20), transparent 30%), linear-gradient(145deg, rgba(200,168,75,0.22), #12100a)',
                border: 'rgba(200,168,75,0.80)',
                border2: 'rgba(255,240,189,0.54)',
                borderWidth: 3,
                shadow: '0 0 36px rgba(200,168,75,0.38), inset 0 0 38px rgba(255,240,189,0.13)',
                innerBorder: '1px solid rgba(255,240,189,0.56)',
                innerShadow: 'inset 0 0 44px rgba(200,168,75,0.16), 0 0 40px rgba(200,168,75,0.16)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(200,168,75,0.09) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.66,
                particle: '✦',
                particleColor: '#fff0bd',
                particleOpacity: 0.55,
                desc: '超频'
            },
            5: {
                bg: 'radial-gradient(circle at 18% 12%, rgba(255,240,189,0.26), transparent 32%), radial-gradient(circle at 82% 78%, rgba(200,168,75,0.24), transparent 30%), linear-gradient(145deg, rgba(200,168,75,0.26), #12100a)',
                border: 'rgba(200,168,75,0.90)',
                border2: 'rgba(255,240,189,0.62)',
                borderWidth: 4,
                shadow: '0 0 44px rgba(200,168,75,0.44), inset 0 0 44px rgba(255,240,189,0.16)',
                innerBorder: '1px solid rgba(255,240,189,0.66)',
                innerShadow: 'inset 0 0 52px rgba(200,168,75,0.19), 0 0 48px rgba(200,168,75,0.19)',
                pattern: 'repeating-conic-gradient(from 25deg, rgba(200,168,75,0.11) 0deg 8deg, transparent 8deg 24deg)',
                patternOpacity: 0.76,
                particle: '✪',
                particleColor: '#fff0bd',
                particleOpacity: 0.72,
                desc: '⭐完全同调⭐'
            }
        }
    }
};

// 卡片类型映射（根据稀有度或自定义字段）






// ═══════════════════════════════════════════════════════════════
//  战斗保底计数器 - 按战斗次数累计
// ═══════════════════════════════════════════════════════════════

var _battlePityCounter = 0;  // 全局计数

function tryDropCardFromEnemy(codexId, chance) {
    if (!codexId) return null;

    var card = findCardById(codexId);
    if (!card) return null;

    // 从 DROP_CONFIG 读取全局配置，或默认 35%
    var defaultChance = (typeof DROP_CONFIG !== 'undefined' && DROP_CONFIG.card && typeof DROP_CONFIG.card.baseChance === 'number')
        ? DROP_CONFIG.card.baseChance : 0.35;
    // DROP_CONFIG 优先（允许全局覆盖），若配置为 100% 则强制必掉
    var dropChance = defaultChance;
    // 仅当未配置全局覆盖（<1）且传入的 chance 更高时才使用传入值
    if (typeof chance === 'number' && defaultChance < 1 && chance > dropChance) {
        dropChance = chance;
    }

    // 战斗次数+1
    _battlePityCounter++;

    // 保底触发：第20次战斗必掉当前敌人卡片
    if (_battlePityCounter >= ((typeof DROP_CONFIG !== 'undefined' && DROP_CONFIG.card && DROP_CONFIG.card.pityThreshold) || 20)) {
        _battlePityCounter = 0;
        console.log('🎴 保底触发! 第20次战斗强制掉落:', card.name);
        return card;
    }

    // 正常掉落判定
    if (Math.random() < dropChance) {
        _battlePityCounter = 0;  // 掉了就重置
        return card;
    }

    return null;
}

// ═══════════════════════════════════════════════════════════════
//  挖矿掉落（无保底）
// ═══════════════════════════════════════════════════════════════

function tryDropMiningCard(vein, quality, nodeType) {
    if (!vein || !vein.cardId) return null;
    
    var card = findCardById(vein.cardId);
    if (!card) return null;
    
    // 计算掉率：基础30%，品质×节点类型调整
    var qMult = { perfect: 1.5, good: 1.2, normal: 1.0 }[quality] || 1.0;
    var nMult = { red: 1.3, yellow: 1.15, blue: 1.0 }[nodeType] || 1.0;
    var chance = 0.30 * qMult * nMult;
    
    if (Math.random() < chance) {
        return card;
    }
    return null;
}

// ═══════════════════════════════════════════════════════════════
//  采集掉落（无保底）
// ═══════════════════════════════════════════════════════════════

function tryDropGatheringCard(plant, quality, weatherType) {
    if (!plant || !plant.cardId) return null;
    
    var card = findCardById(plant.cardId);
    if (!card) return null;
    
    // 计算掉率：基础30%，品质×天气调整
    var qMult = { perfect: 1.5, good: 1.2, normal: 1.0, poor: 0.8, immature: 0.6 }[quality] || 1.0;
    var wMult = { sunny: 1.0, cloudy: 1.1, rainy: 1.2, storm: 1.3, foggy: 1.15, toxic: 1.25 }[weatherType] || 1.0;
    var chance = 0.30 * qMult * wMult;
    
    if (Math.random() < chance) {
        return card;
    }
    return null;
}


// 根据敌人的 codexId 查找对应卡片数据
function findCardById(cardId) {
    if (!cardId) return null;
    for (var deckId in DECK_CARDS) {
        var deck = DECK_CARDS[deckId];
        for (var i = 0; i < deck.length; i++) {
            if (deck[i].id === cardId) {
                return deck[i];
            }
        }
    }
    return null;
}

// 敌人掉落：codexId 精确对应卡片id，30%掉率


// 从敌人 codexId 尝试掉落卡片（每张卡片独立判定）
// codexId 直接对应卡片ID
// 保底计数器
var _pityCounter = {};








// 保留兼容：从指定卡组中尝试掉落（用于其他非敌人掉落场景）
function tryDropCardFromDeck(deckId) {
    if (Math.random() >= 0.30) return null;  // 30% 基础掉率
    
    var cards = DECK_CARDS[deckId];
    if (!cards || cards.length === 0) return null;
    
    // 按稀有度加权随机（稀有度越高概率越低）
    var weights = [];
    for (var i = 0; i < cards.length; i++) {
        weights.push(5 - (cards[i].rarity || 1));  // 1→4, 2→3, 3→2, 4→1
    }
    
    var totalWeight = 0;
    for (var i = 0; i < weights.length; i++) totalWeight += weights[i];
    
    var roll = Math.random() * totalWeight;
    var cumulative = 0;
    for (var i = 0; i < cards.length; i++) {
        cumulative += weights[i];
        if (roll < cumulative) {
            return cards[i];
        }
    }
    return cards[cards.length - 1];
}

// 玩家卡片库存 - 延迟初始化，等 currentUser 可用
var playerCards = {};
var codexViewState = { level: 'factions', faction: null, block: null, deck: null };

// ═══════════════════════════════════════════════════════════════
//  卡片库存管理（安全版本，不依赖 currentUser 立即存在）
// ═══════════════════════════════════════════════════════════════

function getCardsStorageKey() {
    // 安全获取用户ID，如果 currentUser 不存在则返回 null
    if (typeof currentUser !== 'undefined' && currentUser && currentUser.id) {
        return 'cards_' + currentUser.id;
    }
    return null;
}

function initPlayerCards() {
    // 优先使用全局已加载的数据
    if (window.playerCards && Object.keys(window.playerCards).length > 0) {
        playerCards = window.playerCards;
        return;
    }
    const key = getCardsStorageKey();
    if (!key) {
        playerCards = {};
        window.playerCards = playerCards;  // 同步到全局
        return;
    }
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            playerCards = JSON.parse(saved);
        } else {
            playerCards = {};
        }
    } catch (e) {
        playerCards = {};
    }
    window.playerCards = playerCards;  // 同步到全局
}


function savePlayerCards() {
    const key = getCardsStorageKey();
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(playerCards));
    } catch (e) {
        console.error('保存卡片失败:', e);
    }
}

// 修改 addPlayerCard 函数
function addPlayerCard(cardData, skipShard) {
    var isNew = !playerCards[cardData.id];

    if (!playerCards[cardData.id]) {
        playerCards[cardData.id] = {
            count: 0,
            starLevel: 1, // 默认初始为1星
            firstGetTime: new Date().toISOString(),
            data: cardData
        };
    }
    playerCards[cardData.id].count++;
    savePlayerCards();

    // 重复卡片：掉落回响碎片（skipShard=true 时不给，用于盲盒等场景）
    if (!isNew && !skipShard && typeof gainEchoFragment === 'function') {
        var fragRarity = cardData.rarity || 1;
        gainEchoFragment(fragRarity, 1);
        if (typeof showFloatingShard === 'function') showFloatingShard(fragRarity);
    }

    // 返回对象，兼容调用处的 isNew / converted 检查
    return {
        count: playerCards[cardData.id].count,
        isNew: isNew,
        converted: isNew ? null : { shardType: 'generic', amount: 1 }
    };
}

// ═══════════════════════════════════════════════════════════════
//  Warframe等级卡片奖励
// ═══════════════════════════════════════════════════════════════
var WARFRAME_LEVEL_CARD_THRESHOLDS = [30, 50, 70, 90, 100];
var WARFRAME_CARD_ID_MAP = {
    excalibur: 'c_wf_excalibur',
    volt: 'c_wf_volt',
    mag: 'c_wf_mag',
    rhino: 'c_wf_rhino',
    ash: 'c_wf_ash',
    ember: 'c_wf_ember'
};

function getWarframeCardClaimStorageKey() {
    var userId = (typeof currentUser !== 'undefined' && currentUser && currentUser.id) ? currentUser.id : 'guest';
    return 'warframe_level_card_claims_' + userId;
}

function getWarframeCardClaims() {
    // 优先从数据库（gameData）读取，以数据库为主
    var fromDB = {};
    if (typeof gameData !== 'undefined' && gameData && gameData.warframe_card_claims) {
        try {
            fromDB = (typeof gameData.warframe_card_claims === 'string')
                ? JSON.parse(gameData.warframe_card_claims)
                : JSON.parse(JSON.stringify(gameData.warframe_card_claims));
        } catch (e) {}
    }
    // 若数据库无记录，回退到 localStorage
    if (Object.keys(fromDB).length === 0) {
        var storageKey = getWarframeCardClaimStorageKey();
        try {
            var fromStorage = JSON.parse(localStorage.getItem(storageKey) || '{}');
            if (Object.keys(fromStorage).length > 0) {
                fromDB = fromStorage;
                // 同步回 gameData
                if (typeof gameData !== 'undefined' && gameData) {
                    gameData.warframe_card_claims = fromDB;
                }
            }
        } catch (e) {}
    }
    return fromDB;
}

function saveWarframeCardClaims(data) {
    if (typeof gameData !== 'undefined' && gameData) {
        gameData.warframe_card_claims = data || {};
    }
    localStorage.setItem(getWarframeCardClaimStorageKey(), JSON.stringify(data || {}));
}

function getWarframeCardData(warframeType) {
    var cardId = WARFRAME_CARD_ID_MAP[warframeType];
    return cardId ? findCardById(cardId) : null;
}

function grantWarframeLevelCards(warframeType, level) {
    initPlayerCards();
    var cardData = getWarframeCardData(warframeType);
    if (!cardData || !level) return;

    var claims = getWarframeCardClaims();
    if (!claims[warframeType]) claims[warframeType] = {};

    for (var i = 0; i < WARFRAME_LEVEL_CARD_THRESHOLDS.length; i++) {
        var threshold = WARFRAME_LEVEL_CARD_THRESHOLDS[i];
        if (level >= threshold && !claims[warframeType][threshold]) {
            var result = addPlayerCard(cardData);
            claims[warframeType][threshold] = new Date().toISOString();
            saveWarframeCardClaims(claims);
            if (typeof saveGameData === 'function') saveGameData();
            if (typeof showCardAcquireModal === 'function') {
                showCardAcquireModal(cardData, (cardData.name || 'Warframe') + ' Lv.' + threshold + ' 达成');
            }
            if (typeof showToast === 'function') {
                showToast('🎴 ' + (cardData.name || '战甲') + ' 等级回响卡片已获得（Lv.' + threshold + '）', 'success');
            }
        }
    }
}
window.grantWarframeLevelCards = grantWarframeLevelCards;

// 手动升星
function upgradeCardStar(cardId) {
    var cardInfo = playerCards[cardId];
    if (!cardInfo) return false;
    
    var cardData = cardInfo.data;
    var currentStar = cardInfo.starLevel || 1;
    if (currentStar >= 5) {
        showToast('该卡片已达到最高星级！', 'warning');
        return false;
    }
    
    var type = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
    var req = getUpgradeRequirement(type, currentStar);
    if (!req) return false;
    
    if (cardInfo.count < req) {
        showToast('卡片数量不足，无法升星！', 'error');
        return false;
    }
    
    // 消耗卡片并升星
    cardInfo.count -= req;
    cardInfo.starLevel = currentStar + 1;
    savePlayerCards();
    
    showToast(cardData.name + ' 升至 ' + cardInfo.starLevel + ' 星！', 'success');
    return true;
	// ========== 关键修复：升星后刷新徽章 ==========
	    updateUpgradeBadge();

}


function getCardStarStyle(cardData, starLevel) {
    // 优先使用卡片指定的 cardType，其次按 rarity 映射，最后默认 normal
    var type = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
    var level = Math.min(5, Math.max(1, starLevel || 1));
    
    // ═══════════════════════════════════════════════════════════════
    //  华丽版星级视觉升级系统
    // ═══════════════════════════════════════════════════════════════
    
    // 星级类型进化名称
    var typeNameEvolution = {
        normal: ['遗落', '遗落·改', '窥视', '凝视', '⭐苏醒⭐'],
        elite: ['异变', '异变·改', '侵蚀', '同化', '⭐降临⭐'],
        boss: ['古神', '星之彩', '廷达罗斯', '莎布', '⭐克苏鲁⭐'],
        mechanic: ['混沌', '犹格', '阿撒托斯', '盲目', '⭐原初混沌⭐'],
        super: ['终焉', '热寂', '归零', '虚无', '⭐阿撒托斯之梦⭐'],
        warframe: ['战甲', '战甲·熟练', '战甲·共鸣', '战甲·超频', '⭐完全同调⭐']
    };
    
    var typeConfig = CARD_STAR_STYLES[type];
    if (!typeConfig) {
        type = 'normal';
        typeConfig = CARD_STAR_STYLES.normal;
    }
    
    var starConfig = typeConfig.stars[level];
    if (!starConfig) return null;
    
    var evolvedName = typeNameEvolution[type] ? typeNameEvolution[type][level - 1] : typeConfig.name;
    var primaryColor = typeConfig.color;
    var secondaryColor = typeConfig.color2 || typeConfig.color;
    
    // 星级特效强度系数：1.0 ~ 3.0
    var intensityMult = 1 + (level - 1) * 0.5;
    
    // 粒子数量：1星无粒子，2星少量，3星+随等级增加
    var particleCount = level >= 3 ? Math.floor(level * 2 + 3) : 0;
    // 粒子透明度
    var particleOpacity = starConfig.particleOpacity || (level >= 3 ? 0.35 : 0);
    
    // 5星专属：脉冲呼吸效果
    var hasAura = level >= 5;
    
    // 4星+：内发光层
    var hasInnerGlow = level >= 4;
    // 5星：流光线条
    var hasFlowLine = level >= 5;
    // 3星+：边框脉冲动画
    var hasBorderPulse = level >= 3;
    
    return {
        type: type,
        typeName: evolvedName,
        color: primaryColor,
        color2: secondaryColor,
        glow: starConfig.shadow,
        starLevel: level,
        // 华丽版 CSS 样式属性 - 直接使用配置值
        bg: starConfig.bg,
        border: starConfig.border,
        border2: starConfig.border2 || starConfig.border,
        borderWidth: starConfig.borderWidth,
        shadow: starConfig.shadow,
        innerBorder: starConfig.innerBorder || '',
        innerShadow: starConfig.innerShadow || '',
        pattern: starConfig.pattern || '',
        patternOpacity: starConfig.patternOpacity || 0,
        // 粒子
        particle: starConfig.particle,
        particleColor: starConfig.particleColor,
        particleOpacity: particleOpacity,
        particleCount: particleCount,
        // 描述
        desc: starConfig.desc,
        // 动态增强效果
        effects: {
            borderWidth: starConfig.borderWidth,
            shadowBlur: Math.floor(16 * level * intensityMult / 2),
            particleCount: particleCount,
            animationSpeed: Math.max(0.3, 1 / level),
            intensity: intensityMult,
            hasAura: hasAura,
            hasInnerGlow: hasInnerGlow,
            hasFlowLine: hasFlowLine,
            hasBorderPulse: hasBorderPulse
        }
    };
}

function hasPlayerCard(cardId) {
    var cards = window.playerCards || playerCards || {};  // 优先读全局
    return !!cards[cardId];
}

function getPlayerCardCount(cardId) {
    var cards = window.playerCards || playerCards || {};  // 优先读全局
    return cards[cardId] ? cards[cardId].count : 0;
}

// ═══════════════════════════════════════════════════════════════
//  卡片掉落逻辑
// ═══════════════════════════════════════════════════════════════
// 从敌人专属卡片池中掉落（敌人→专属卡片）
// 敌人掉落：codexId 通过映射表找到卡片id，30%掉率
function dropCardFromEnemy(enemy) {
    if (!enemy || !enemy.codexId) return null;
    if (Math.random() >= 0.30) return null;  // 30% 掉率
    
    // codexId → cardId → 卡片数据
    var cardId = CODEXID_TO_CARDID[enemy.codexId];
    if (!cardId) return null;
    
    var card = findCardById(cardId);
    return card;  // 找到返回卡片，找不到返回null
}




function dropCardFromBattle(zoneId) {
    // 优先使用传入的参数，兼容全局 selectedZone
    var deckId = zoneId || (typeof selectedZone !== 'undefined' && selectedZone ? selectedZone.id : null);
    if (!deckId) return null;
    return tryDropCardFromDeck(deckId);
}

// ═══════════════════════════════════════════════════════════════
//  进度计算
// ═══════════════════════════════════════════════════════════════

function calculateFactionProgress(factionKey) {
    var faction = CODEX_STRUCTURE[factionKey];
    var total = 0, collected = 0;
    for (var blockKey in faction.blocks) {
        var block = faction.blocks[blockKey];
        for (var deckId in block.decks) {
            var cards = DECK_CARDS[deckId] || [];
            total += cards.length;
            for (var i = 0; i < cards.length; i++) {
                if (hasPlayerCard(cards[i].id)) collected++;
            }
        }
    }
    return { total: total, collected: collected };
}

function calculateBlockProgress(factionKey, blockKey) {
    var block = CODEX_STRUCTURE[factionKey] && CODEX_STRUCTURE[factionKey].blocks ? CODEX_STRUCTURE[factionKey].blocks[blockKey] : null;
    var total = 0, collected = 0;
    if (!block) return { total: 0, collected: 0 };
    for (var deckId in block.decks) {
        var cards = DECK_CARDS[deckId] || [];
        total += cards.length;
        for (var i = 0; i < cards.length; i++) {
            if (hasPlayerCard(cards[i].id)) collected++;
        }
    }
    return { total: total, collected: collected };
}

function calculateDeckProgress(deckId) {
    var cards = DECK_CARDS[deckId] || [];
    var collected = 0;
    for (var i = 0; i < cards.length; i++) {
        if (hasPlayerCard(cards[i].id)) collected++;
    }
    return { total: cards.length, collected: collected };
}

function calculateTotalProgress() {
    var total = 0, collected = 0;
    for (var deckId in DECK_CARDS) {
        var deck = DECK_CARDS[deckId];
        total += deck.length;
        for (var i = 0; i < deck.length; i++) {
            if (hasPlayerCard(deck[i].id)) collected++;
        }
    }
    return { total: total, collected: collected };
}

// ═══════════════════════════════════════════════════════════════
//  面包屑导航
// ═══════════════════════════════════════════════════════════════

function updateCodexBreadcrumb() {
    var container = document.getElementById('codexBreadcrumb');
    if (!container) return;
    var level = codexViewState.level;
    var faction = codexViewState.faction;
    var block = codexViewState.block;
    var deck = codexViewState.deck;

    var html = '<span style="color: var(--orokin-cyan); cursor: pointer;" onclick="renderCodexFactions()" onmouseover="this.style.color=\'var(--tenno-gold)\'" onmouseout="this.style.color=\'var(--orokin-cyan)\'">📖 图鉴总览</span>';

    if (level === 'factions') { container.innerHTML = html; return; }

    var fData = CODEX_STRUCTURE[faction];
    html += ' <span style="color: #555;">/</span> <span style="cursor: pointer; color: ' + fData.color + ';" onclick="enterCodexFaction(\'' + faction + '\')" onmouseover="this.style.color=\'var(--tenno-gold)\'" onmouseout="this.style.color=\'' + fData.color + '\'">' + fData.icon + ' ' + fData.name + '</span>';

    if (level === 'blocks') { container.innerHTML = html; return; }

    var bData = fData.blocks[block];
    html += ' <span style="color: #555;">/</span> <span style="cursor: pointer; color: var(--tenno-gold);" onclick="enterCodexBlock(\'' + faction + '\', \'' + block + '\')" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'var(--tenno-gold)\'">' + bData.icon + ' ' + bData.name + '</span>';

    if (level === 'decks') { container.innerHTML = html; return; }

    var dData = bData.decks[deck];
    html += ' <span style="color: #555;">/</span> <span style="color: #fff;">' + ' ' + dData.name + '</span>';
    container.innerHTML = html;
}

// ═══════════════════════════════════════════════════════════════
//  渲染函数
// ═══════════════════════════════════════════════════════════════

function renderCodexFactions() {
    var grid = document.getElementById('codexGrid');
    if (!grid) return;
    codexViewState = { level: 'factions', faction: null, block: null, deck: null };
    updateCodexBreadcrumb();
    var html = '';
    for (var key in CODEX_STRUCTURE) {
        var faction = CODEX_STRUCTURE[key];
        var stats = calculateFactionProgress(key);
        var percent = stats.total > 0 ? Math.floor((stats.collected / stats.total) * 100) : 0;
        html += '<div onclick="enterCodexFaction(\'' + key + '\')" style="background: linear-gradient(180deg, rgba(18,18,26,0.95) 0%, rgba(10,10,15,0.95) 100%); border: 2px solid ' + faction.color + '40; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s; position: relative; aspect-ratio: 16/10;" onmouseover="this.style.borderColor=\'' + faction.color + '\'; this.style.transform=\'translateY(-5px)\'; this.style.boxShadow=\'0 10px 30px ' + faction.color + '30\';" onmouseout="this.style.borderColor=\'' + faction.color + '40\'; this.style.transform=\'none\'; this.style.boxShadow=\'none\';"><div style="position: absolute; inset: 0; z-index: 1;">' + (faction.image ? '<img src="' + faction.image + '" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.4) saturate(0.8);" onerror="this.style.display=\'none\'">' : '') + '</div><div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9) 100%); z-index: 2;"></div><div style="position: absolute; inset: 0; z-index: 3; padding: 20px; display: flex; flex-direction: column; justify-content: flex-end;"><div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;"><span style="font-family: Orbitron; font-size: 1.4rem; color: #fff; text-shadow: 0 0 10px ' + faction.color + '80;">' + faction.name + '</span></div><div style="display: flex; align-items: center; gap: 10px;"><div style="flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden;"><div style="width: ' + percent + '%; height: 100%; background: ' + faction.color + '; border-radius: 3px; transition: width 0.5s;"></div></div><span style="font-family: Orbitron; font-size: 0.85rem; color: ' + faction.color + '; min-width: 45px; text-align: right;">' + percent + '%</span></div><div style="color: #888; font-size: 0.75rem; margin-top: 6px;">' + stats.collected + ' / ' + stats.total + ' 卡片</div></div></div>';
    }
    grid.innerHTML = html || '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 60px;">暂无派系数据</div>';
    updateCodexCategoryStats();
}

function updateCodexCategoryStats() {
    var cards = window.playerCards || playerCards || {};
    var totalBattle = 0, collectedBattle = 0;
    var totalMining = 0, collectedMining = 0;
    var totalGathering = 0, collectedGathering = 0;
    
    // 遍历所有DECK_CARDS统计
    if (typeof DECK_CARDS !== 'undefined') {
        for (var deckId in DECK_CARDS) {
            var deck = DECK_CARDS[deckId];
            for (var i = 0; i < deck.length; i++) {
                var card = deck[i];
                var category = getCardCategory(card);
                var isCollected = cards[card.id] && cards[card.id].count > 0;
                
                if (category === 'mining') {
                    totalMining++;
                    if (isCollected) collectedMining++;
                } else if (category === 'gathering') {
                    totalGathering++;
                    if (isCollected) collectedGathering++;
                } else {
                    totalBattle++;
                    if (isCollected) collectedBattle++;
                }
            }
        }
    }
    
    // 更新DOM显示
    var battleEl = document.getElementById('battleCardCount');
    var miningEl = document.getElementById('miningCardCount');
    var gatheringEl = document.getElementById('gatheringCardCount');
    
    if (battleEl) battleEl.textContent = collectedBattle + '/' + totalBattle;
    if (miningEl) miningEl.textContent = collectedMining + '/' + totalMining;
    if (gatheringEl) gatheringEl.textContent = collectedGathering + '/' + totalGathering;
    
    // 更新百分比
    var battlePct = document.getElementById('battleCardPercent');
    var miningPct = document.getElementById('miningCardPercent');
    var gatheringPct = document.getElementById('gatheringCardPercent');
    
    if (battlePct) battlePct.textContent = totalBattle > 0 ? Math.floor(collectedBattle / totalBattle * 100) + '%' : '0%';
    if (miningPct) miningPct.textContent = totalMining > 0 ? Math.floor(collectedMining / totalMining * 100) + '%' : '0%';
    if (gatheringPct) gatheringPct.textContent = totalGathering > 0 ? Math.floor(collectedGathering / totalGathering * 100) + '%' : '0%';
    
    // 更新总进度
    var totalCollected = collectedBattle + collectedMining + collectedGathering;
    var totalCards = totalBattle + totalMining + totalGathering;
    var codexCount = document.getElementById('codexCardCount');
    var codexTotal = document.getElementById('codexTotalCards');
    var codexPct = document.getElementById('codexPercent');
    
    if (codexCount) codexCount.textContent = totalCollected;
    if (codexTotal) codexTotal.textContent = totalCards;
    if (codexPct) codexPct.textContent = totalCards > 0 ? Math.floor(totalCollected / totalCards * 100) + '%' : '0%';
}

function getCodexCategoryProgress(categoryKey) {
    var cards = window.playerCards || playerCards || {};
    var total = 0;
    var collected = 0;
    if (typeof DECK_CARDS !== 'undefined') {
        for (var deckId in DECK_CARDS) {
            var deck = DECK_CARDS[deckId] || [];
            for (var i = 0; i < deck.length; i++) {
                var card = deck[i];
                if (getCardCategory(card) !== categoryKey) continue;
                total++;
                if (cards[card.id] && cards[card.id].count > 0) collected++;
            }
        }
    }
    return { total: total, collected: collected };
}

function getCodexRewardStorageKey() {
    var userId = (typeof currentUser !== 'undefined' && currentUser && currentUser.id) ? currentUser.id : 'guest';
    return 'codex_category_rewards_' + userId;
}

function getClaimedCodexRewards() {
    try {
        return JSON.parse(localStorage.getItem(getCodexRewardStorageKey()) || '{}');
    } catch (e) {
        return {};
    }
}

function saveClaimedCodexRewards(data) {
    localStorage.setItem(getCodexRewardStorageKey(), JSON.stringify(data || {}));
}

function claimCodexCategoryReward(categoryKey) {
    initPlayerCards();
    var names = {
        battle: '肃清',
        mining: '勘探',
        gathering: '回收'
    };
    var rewards = {
        battle: { rout: 120, prime: 3, label: '💰120 + 💎3' },
        mining: { rout: 40, prime: 4, label: '💰40 + 💎4' },
        gathering: { rout: 80, prime: 2, label: '💰80 + 💎2' }
    };
    var progress = getCodexCategoryProgress(categoryKey);
    var displayName = names[categoryKey] || '图鉴';
    if (!progress.total || progress.collected < progress.total) {
        showToast(displayName + '卡组尚未集齐：' + progress.collected + '/' + progress.total, 'warning');
        return false;
    }

    var claimed = getClaimedCodexRewards();
    if (claimed[categoryKey]) {
        showToast(displayName + '集齐奖励已领取', 'info');
        return false;
    }

    // 集齐奖励已合并到卡组1星奖励中，引导用户去卡组页面领取
    showToast('🎁 ' + displayName + '卡组集齐奖励已合并到卡组星级奖励中，请前往对应卡组领取1星奖励！', 'info');
    return true;
}
window.claimCodexCategoryReward = claimCodexCategoryReward;

// ═══════════════════════════════════════════════════════════════
//  卡组星级奖励系统
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
//  卡组星级奖励系统 - 修复版（确保数据库持久化）
// ═══════════════════════════════════════════════════════════════

// 获取存储键（同时用于 localStorage 和数据库字段标识）
function getDeckRewardStorageKey() {
    var userId = (typeof currentUser !== 'undefined' && currentUser && currentUser.id) ? currentUser.id : 'guest';
    return 'codex_deck_rewards_' + userId;
}

// 【修复】读取已领取奖励 - 优先从数据库读取，确保跨设备同步
function getClaimedDeckRewards() {
    // 1. 优先从数据库 gameData 读取（实现跨设备同步）
    if (typeof gameData !== 'undefined' && gameData && gameData.codex_deck_rewards) {
        // 确保是对象格式（兼容旧版字符串存储）
        var dbData = gameData.codex_deck_rewards;
        if (typeof dbData === 'string') {
            try { dbData = JSON.parse(dbData); } catch (e) { dbData = {}; }
        }
        return dbData || {};
    }
    
    // 2. 数据库无记录，回退到 localStorage（兼容旧用户）
    try {
        var fromStorage = JSON.parse(localStorage.getItem(getDeckRewardStorageKey()) || '{}');
        if (Object.keys(fromStorage).length > 0) {
            // 【关键】同步回 gameData，确保下次从数据库读取
            if (typeof gameData !== 'undefined' && gameData) {
                gameData.codex_deck_rewards = fromStorage;
                // 立即触发数据库保存
                if (typeof saveGameData === 'function') {
                    saveGameData();
                }
            }
            return fromStorage;
        }
    } catch (e) {
        console.error('读取 localStorage 奖励数据失败:', e);
    }
    
    return {};
}

// 【修复】保存已领取奖励 - 同时保存到数据库和 localStorage
function saveClaimedDeckRewards(data) {
    var cleanData = data || {};
    
    // 1. 保存到 gameData（数据库持久化）
    if (typeof gameData !== 'undefined' && gameData) {
        gameData.codex_deck_rewards = cleanData;
    }
    
    // 2. 保存到 localStorage（离线备用）
    try {
        localStorage.setItem(getDeckRewardStorageKey(), JSON.stringify(cleanData));
    } catch (e) {
        console.error('localStorage 保存失败:', e);
    }
    
    // 3. 【关键】触发数据库保存
    if (typeof saveGameData === 'function') {
        saveGameData();
    }
}


// 计算卡组当前星级 = 所有卡片最低starLevel（未集齐则为0）
function calculateDeckStarLevel(deckId) {
    var cards = DECK_CARDS[deckId] || [];
    if (cards.length === 0) return 0;
    var minStar = 5;
    var allCollected = true;
    for (var i = 0; i < cards.length; i++) {
        var info = playerCards[cards[i].id];
        if (!info) { allCollected = false; break; }
        minStar = Math.min(minStar, info.starLevel || 1);
    }
    return allCollected ? minStar : 0;
}

// 卡组视觉星级：只有对应奖励领取后，才显示该星级外观
function calculateDeckVisualStarLevel(deckId) {
    if (DECK_REWARD_DISABLED[deckId]) return 0;
    var actualStar = calculateDeckStarLevel(deckId);
    if (actualStar <= 0) return 0;
    var claimed = getClaimedDeckRewards();
    var list = claimed[deckId] || [];
    var visual = 0;
    for (var i = 0; i < list.length; i++) {
        var tier = parseInt(list[i], 10);
        if (!isNaN(tier)) visual = Math.max(visual, tier);
    }
    return Math.min(actualStar, Math.max(0, visual));
}

// 获取卡组下一个可领取的星级奖励档位（1-5=升星奖励，null=无）
function getDeckNextClaimableStar(deckId) {
    if (DECK_REWARD_DISABLED[deckId]) return null;
    var star = calculateDeckStarLevel(deckId);
    if (star <= 0) return null;
    var claimed = getClaimedDeckRewards();
    var list = claimed[deckId] || [];
    // 1-5星奖励：整体达到对应星级即可领取
    var maxRewardTier = Math.min(5, star);
    for (var s = 1; s <= maxRewardTier; s++) {
        if (list.indexOf(s) === -1) return s;
    }
    return null;
}

// 是否可以领取奖励
function canClaimDeckReward(deckId) {
    return getDeckNextClaimableStar(deckId) !== null;
}

//添加禁用卡组奖励
var DECK_REWARD_DISABLED = {
    janus_key: true,
    warframe_normal: true,
    warframe_prime: true,
};

var FIXED_DECK_STAR_REWARDS = {
    1: { rout: 150, prime: 0, label: '💰150' },
    2: { rout: 200, prime: 0, label: '💰200' },
    3: { rout: 150, prime: 2, label: '💰150 + 💎2' },
    4: { rout: 200, prime: 5, label: '💰200 + 💎5' },
    5: { rout: 250, prime: 10, label: '💰250 + 💎10' }
};

// 生成卡组星级奖励（根据卡组和星级）
function getDeckStarReward(deckId, starLevel) {
    if (DECK_REWARD_DISABLED[deckId]) return null;
    return FIXED_DECK_STAR_REWARDS[starLevel] || null;
}

// 【修复】领取卡组星级奖励 - 确保原子性操作
async function claimDeckReward(deckId, factionKey, blockKey) {
    initPlayerCards();
    var star = getDeckNextClaimableStar(deckId);
    if (star === null) {
        showToast('当前没有可领取的奖励', 'info');
        return false;
    }
    var reward = getDeckStarReward(deckId, star);
    if (!reward) {
        showToast('该卡组暂未设置奖励', 'info');
        return false;
    }

    // 数据库级防重复：成功写入唯一领取记录后，才真正发奖励
    if (typeof sb !== 'undefined' && typeof currentUser !== 'undefined' && currentUser && currentUser.id) {
        try {
            var rpcResult = await sb.rpc('claim_codex_reward_once', {
                p_user_id: currentUser.id,
                p_deck_id: deckId,
                p_reward_tier: star,
                p_reward: reward
            });
            if (rpcResult.error) throw rpcResult.error;
            if (rpcResult.data !== true) {
                showToast('该卡组奖励已领取，不能重复领取', 'warning');
                // 【修复】同步更新本地状态，防止前端显示不一致
                var alreadyClaimed = getClaimedDeckRewards();
                if (!alreadyClaimed[deckId]) alreadyClaimed[deckId] = [];
                if (alreadyClaimed[deckId].indexOf(star) === -1) {
                    alreadyClaimed[deckId].push(star);
                    saveClaimedDeckRewards(alreadyClaimed);
                }
                renderCodexDecks(factionKey, blockKey);
                return false;
            }
        } catch (e) {
            showToast('数据库奖励防重复未启用：请先执行 supabase_maintenance.sql', 'error');
            console.error('claim_codex_reward_once failed:', e);
            return false;
        }
    }

    // 【修复】先更新本地状态，再发奖励，确保数据一致性
    var claimed = getClaimedDeckRewards();
    if (!claimed[deckId]) claimed[deckId] = [];
    claimed[deckId].push(star);
    
    // 保存到数据库（原子操作）
    saveClaimedDeckRewards(claimed);
    
    // 发放奖励（图鉴奖励不受每日 Rout 上限限制）
    if (typeof gameData !== 'undefined') {
        gameData.rout_points = (gameData.rout_points || 0) + reward.rout;
        gameData.prime_points = (gameData.prime_points || 0) + reward.prime;
    }
    if (typeof currentUser !== 'undefined' && currentUser) {
        currentUser.rout_points = (currentUser.rout_points || 0) + reward.rout;
        currentUser.prime_points = (currentUser.prime_points || 0) + reward.prime;
    }
    
	// 保存领取状态
	    var claimed = getClaimedDeckRewards();
	    if (!claimed[deckId]) claimed[deckId] = [];
	    claimed[deckId].push(star);
	    saveClaimedDeckRewards(claimed);
	
    // 再次保存（包含积分变动）
    if (typeof saveGameData === 'function') saveGameData();
    if (typeof updateUI === 'function') updateUI();
	
	// ========== 关键修复：立即更新徽章（不等待动画）==========
	    if (typeof updateDeckRewardBadge === 'function') {
	        updateDeckRewardBadge();
	    }
	    // ==================================================
	
    // 播放领取动画后再刷新界面
        showDeckClaimAnimation(deckId, star, reward.label, function() {
            renderCodexDecks(factionKey, blockKey);
            // 动画完成后再更新一次（保险）
                    if (typeof updateDeckRewardBadge === 'function') {
                        updateDeckRewardBadge();
                    }
        });
    return true;
}
window.claimDeckReward = claimDeckReward;

// 星级指示器HTML
function renderDeckStarDots(starLevel) {
    var html = '<div class="deck-star-bar">';
    for (var s = 1; s <= 5; s++) {
        var cls = s <= starLevel ? (starLevel >= 5 ? 'active max' : 'active') : '';
        html += '<div class="deck-star-dot ' + cls + '"></div>';
    }
    html += '</div>';
    return html;
}

// 升星进度（用于已集齐的卡组）
function getDeckStarUpgradeProgress(deckId) {
    var cards = DECK_CARDS[deckId] || [];
    if (cards.length === 0) return { current: 0, target: 0, percent: 0, targetStar: 0 };
    var currentDeckStar = calculateDeckStarLevel(deckId);
    var targetStar = currentDeckStar >= 5 ? 5 : currentDeckStar + 1;
    var reached = 0;
    for (var i = 0; i < cards.length; i++) {
        var info = playerCards[cards[i].id];
        if (info && (info.starLevel || 1) >= targetStar) reached++;
    }
    var percent = cards.length > 0 ? Math.min(100, Math.floor((reached / cards.length) * 100)) : 0;
    return { current: reached, target: cards.length, percent: percent, deckStar: currentDeckStar, targetStar: targetStar };
}

// 奖励领取动画
function showDeckClaimAnimation(deckId, star, label, onDone) {
    var grid = document.getElementById('codexGrid');
    if (!grid) { if (onDone) onDone(); return; }
    var card = grid.querySelector('[data-deck-id="' + deckId + '"]');
    if (!card) { if (onDone) onDone(); return; }

    var overlay = document.createElement('div');
    overlay.className = 'deck-reward-overlay active';
    overlay.innerHTML =
        '<div class="deck-reward-icon">🎁</div>' +
        '<div class="deck-reward-text">' + star + '星奖励</div>' +
        '<div style="color:#ccc;font-size:0.8rem;margin-top:4px;">' + label + '</div>';
    card.appendChild(overlay);

    setTimeout(function() {
        overlay.classList.remove('active');
        setTimeout(function() {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            showToast('🎁 卡组 ' + star + ' 星奖励已领取：' + label, 'success');
            if (onDone) onDone();
        }, 400);
    }, 1400);
}

function renderCodexBlocks(factionKey) {
    var grid = document.getElementById('codexGrid');
    var faction = CODEX_STRUCTURE[factionKey];
    if (!grid || !faction) return;
    codexViewState = { level: 'blocks', faction: factionKey, block: null, deck: null };
    updateCodexBreadcrumb();
    var html = '';
    for (var key in faction.blocks) {
        var block = faction.blocks[key];
        var stats = calculateBlockProgress(factionKey, key);
        var percent = stats.total > 0 ? Math.floor((stats.collected / stats.total) * 100) : 0;
        html += '<div onclick="enterCodexBlock(\'' + factionKey + '\', \'' + key + '\')" style="background: linear-gradient(180deg, rgba(18,18,26,0.95) 0%, rgba(10,10,15,0.95) 100%); border: 2px solid ' + faction.color + '30; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s; position: relative; aspect-ratio: 16/9;" onmouseover="this.style.borderColor=\'' + faction.color + '80\'; this.style.transform=\'translateY(-5px)\';" onmouseout="this.style.borderColor=\'' + faction.color + '30\'; this.style.transform=\'none\';"><div style="position: absolute; inset: 0; z-index: 1;">' + (block.image ? '<img src="' + block.image + '" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.35);" onerror="this.style.display=\'none\'">' : '') + '</div><div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%); z-index: 2;"></div><div style="position: absolute; inset: 0; z-index: 3; padding: 20px; display: flex; flex-direction: column; justify-content: flex-end;"><div style="font-size: 2rem; margin-bottom: 6px;">' + block.icon + '</div><div style="font-family: Orbitron; font-size: 1.2rem; color: var(--tenno-gold); margin-bottom: 4px;">' + block.name + '</div><div style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">' + block.desc + '</div><div style="display: flex; align-items: center; gap: 8px;"><div style="flex: 1; height: 5px; background: #222; border-radius: 3px; overflow: hidden;"><div style="width: ' + percent + '%; height: 100%; background: ' + faction.color + '; border-radius: 3px;"></div></div><span style="font-family: Orbitron; font-size: 0.75rem; color: ' + faction.color + ';">' + percent + '%</span></div><div class="codex-stats-summary" style="color: #666; font-size: 0.7rem; margin-top: 5px;">' + stats.collected + ' / ' + stats.total + ' 卡片 · ' + Object.keys(block.decks || {}).length + ' 个卡组</div></div></div>';
    }
    grid.innerHTML = html || '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 60px;">该派系暂无区域数据</div>';
}

function renderCodexDecks(factionKey, blockKey) {
    initPlayerCards();
    var grid = document.getElementById('codexGrid');
    var faction = CODEX_STRUCTURE[factionKey];
    var block = faction && faction.blocks ? faction.blocks[blockKey] : null;
    if (!grid || !block) return;
    codexViewState = { level: 'decks', faction: factionKey, block: blockKey, deck: null };
    updateCodexBreadcrumb();
    var html = '';
    for (var deckId in block.decks) {
        var deck = block.decks[deckId];
        var stats = calculateDeckProgress(deckId);
        var star = calculateDeckStarLevel(deckId);
        var visualStar = calculateDeckVisualStarLevel(deckId);
        var claimable = canClaimDeckReward(deckId);
        var starCls = 'deck-star-' + visualStar + (claimable ? ' deck-can-claim' : '');

        // 点击行为：可领取时领奖励，否则进入卡组
        var clickAction = claimable
            ? 'claimDeckReward(\'' + deckId + '\', \'' + factionKey + '\', \'' + blockKey + '\')'
            : 'enterCodexDeck(\'' + factionKey + '\', \'' + blockKey + '\', \'' + deckId + '\')';

        // 进度条与文字（严格基于已领取的视觉星级，不提前暴露）
        var progressHtml = '';
        var infoHtml = '';

        if (visualStar === 0) {
            if (star > 0 && claimable) {
                // 已达成0星条件且可领取：提示领取
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s1" style="width: 0%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: var(--tenno-gold); min-width: 52px;">待领取</span>' +
                    '</div>';
                infoHtml = '<div style="color: var(--tenno-gold); font-size: 0.75rem;">🎁 领取回响进度奖励</div>';
            } else if (star > 0) {
                // 已达成0星但不可领取（极端情况）：不暴露真实进度
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s1" style="width: 0%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: #666; min-width: 40px;">???</span>' +
                    '</div>';
                infoHtml = '<div style="color: #555; font-size: 0.75rem;">暂无进度奖励...</div>';
            } else {
                // 未达成0星：正常显示收集进度
                var percent = stats.total > 0 ? Math.floor((stats.collected / stats.total) * 100) : 0;
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s1" style="width: ' + percent + '%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: ' + faction.color + '; min-width: 40px;">' + percent + '%</span>' +
                    '</div>';
                infoHtml = '<div style="color: #666; font-size: 0.75rem;">' + stats.collected + ' / ' + stats.total + ' 回响已收集</div>';
            }
        } else {
            // 已有领取记录：显示当前已领取的最高星级状态
            if (visualStar >= 5) {
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s5" style="width: 100%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: var(--tenno-gold); min-width: 45px;">100%</span>' +
                    '</div>';
                infoHtml = '<div style="color: #888; font-size: 0.72rem;">⭐ 已达到最高星级 ⭐</div>';
            } else if (claimable) {
                // 下一星级条件已达成且可领取：提示领取，不暴露进度细节
                var nextClaimStar = visualStar + 1;
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s' + nextClaimStar + '" style="width: 0%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: var(--tenno-gold); min-width: 52px;">待领取</span>' +
                    '</div>';
                infoHtml = '<div style="color: var(--tenno-gold); font-size: 0.72rem;">🎁 点击领取 ' + nextClaimStar + '星奖励</div>';
            } else {
                // 显示已领取的最高星级信息（不显示下一级未领取的进度）
                progressHtml =
                    '<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">' +
                        '<div class="deck-star-progress-bg"><div class="deck-star-progress-fill s' + visualStar + '" style="width: 100%;"></div></div>' +
                        '<span style="font-family: Orbitron; font-size: 0.8rem; color: var(--tenno-gold); min-width: 45px;">100%</span>' +
                    '</div>';
                infoHtml = '<div style="color: #888; font-size: 0.72rem;">已达成全 ' + visualStar + '星</div>';
            }
        }

        var badgeHtml = claimable ? '<div class="deck-claim-badge">领取</div>' : '';

        html += '<div data-deck-id="' + deckId + '" onclick="' + clickAction + '" class="deck-card-wrap ' + starCls + '">' +
            badgeHtml +
            '<div class="deck-card-content">' +
                '<div style="font-size: 3rem; margin-bottom: 10px;">' + deck.icon + '</div>' +
                '<div style="font-family: Orbitron; font-size: 1.1rem; color: #fff; margin-bottom: 4px;">' + deck.name + '</div>' +
                '<div style="color: #888; font-size: 0.78rem; margin-bottom: 10px;">' + deck.desc + '</div>' +
                renderDeckStarDots(visualStar) +
                progressHtml +
                infoHtml +
            '</div>' +
        '</div>';
    }
    grid.innerHTML = html || '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 60px;">该区域暂无卡组数据</div>';
}



function renderCodexCards(factionKey, blockKey, deckId) {
    var grid = document.getElementById('codexGrid');
    var cards = DECK_CARDS[deckId];
    if (!grid || !cards) return;
    
    // 关键修复：每次渲染前重新加载玩家卡片数据，确保同步
    initPlayerCards();
    
    codexViewState = { level: 'cards', faction: factionKey, block: blockKey, deck: deckId };
    updateCodexBreadcrumb();
    
	    // ========== 分类筛选 ==========
	    var filteredCards = cards;
	    if (currentCodexCategory !== 'all') {
	        filteredCards = [];
	        for (var i = 0; i < cards.length; i++) {
	            if (getCardCategory(cards[i]) === currentCodexCategory) {
	                filteredCards.push(cards[i]);
	            }
	        }
	    }
	    
	    // 如果筛选后没有卡片，显示提示
	    if (filteredCards.length === 0) {
	        var categoryNames = { battle: '战斗卡', mining: '矿物卡', gathering: '采集卡' };
	        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 60px;">' +
	            '该卡组中暂无 ' + categoryNames[currentCodexCategory] + '</div>';
	        return;
	    }
	
    var html = '';
        for (var i = 0; i < filteredCards.length; i++) {
            var card = filteredCards[i];
        var card = filteredCards[i];
        // 关键修复：实时检查，使用最新的 playerCards
        var cardInfo = playerCards[card.id];  // 获取 {count, starLevel, firstGetTime, data}
        var hasCard = !!cardInfo;             // 是否已收集（对象存在即为已收集）
        var count = cardInfo ? cardInfo.count : 0;  // 已收集数量
        var rarity = CARD_RARITY[card.rarity] || CARD_RARITY[1];
        
        if (!hasCard) {
            // ═══════════════════════════════════════════════════════════════
            //  未解锁卡片 - 锁定状态（恢复原样）
            // ═══════════════════════════════════════════════════════════════
            html += '<div style="' +
                'background: linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%); ' +
                'border-radius: 12px; ' +
                'border: 2px solid #333; ' +
                'overflow: hidden; ' +
                'position: relative; ' +
                'transition: all 0.3s; ' +
                'filter: grayscale(1) brightness(0.3); ' +
                '" ' +
                'onmouseover="this.style.borderColor=\'#555\'; this.style.filter=\'grayscale(0.8) brightness(0.4)\';" ' +
                'onmouseout="this.style.borderColor=\'#333\'; this.style.filter=\'grayscale(1) brightness(0.3)\';">' +
                
                // 锁定图标层
                '<div style="height: 200px; background: #0a0a0f; display: flex; align-items: center; justify-content: center; position: relative;">' +
                    '<div style="text-align: center;">' +
                        '<div style="font-size: 3rem; opacity: 0.7; filter: drop-shadow(0 0 15px rgba(255,255,255,0.2));">🔒</div>' +
                        '<div style="font-family: Orbitron; font-size: 0.8rem; color: #666; letter-spacing: 3px; text-transform: uppercase; margin-top: 10px;">未解锁</div>' +
                    '</div>' +
                '</div>' +
                
                // 底部信息
                '<div style="padding: 14px;">' +
                    '<div style="color: #444; text-align: center; font-family: Orbitron;">???</div>' +
                    '<div style="display: flex; justify-content: center; margin-top: 8px;">' +
                        '<span style="color: ' + rarity.color + ';">' + rarity.stars + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>';
} else {
            // ═══════════════════════════════════════════════════════════════
            //  已解锁卡片 - 完整特效（使用 starLevel 而非 count/5）
            // ═══════════════════════════════════════════════════════════════

            // 【关键】获取卡片库存信息
            var cardInfo = playerCards[card.id];
            var count = cardInfo ? cardInfo.count : 0;

            // 【修改1】使用 starLevel 字段显示星级，默认1星
            var displayStarLevel = cardInfo ? (cardInfo.starLevel || 1) : 1;
            displayStarLevel = Math.min(5, Math.max(1, displayStarLevel));

            // 【关键】卡片星级显示受限于卡组已领取的视觉星级
            var deckVisualStar = calculateDeckVisualStarLevel(deckId);
            if (deckVisualStar > 0) {
                displayStarLevel = Math.min(displayStarLevel, deckVisualStar);
            }

            // 【修改2】获取卡片类型和升星需求
            var cardType = card.cardType || CARD_TYPE_MAP[card.rarity] || 'normal';
            var upgradeCost = getUpgradeRequirement(cardType, displayStarLevel);
            var progressPercent = upgradeCost ? Math.min(100, (count / upgradeCost) * 100) : 100;

            // 【修改3】使用 displayStarLevel 获取星级样式
            var starStyle = getCardStarStyle(card, displayStarLevel);
            var styleColor = starStyle ? starStyle.color : rarity.color;
            var styleColor2 = starStyle ? starStyle.color2 : styleColor;
            var styleGlow = starStyle ? starStyle.shadow : rarity.glow;
            var cardBg = starStyle ? starStyle.bg : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)';
            var cardBorderWidth = starStyle ? starStyle.borderWidth : 2;
            var sParticle = starStyle ? starStyle.particle : '✦';
            var sParticleColor = starStyle ? starStyle.particleColor : styleColor;
            var sParticleOpacity = starStyle ? starStyle.particleOpacity : 0;
            var sTypeName = starStyle ? starStyle.typeName : rarity.name;
            var sDesc = starStyle ? starStyle.desc : '';
            var sInnerBorder = starStyle ? starStyle.innerBorder : '';
            var sInnerShadow = starStyle ? starStyle.innerShadow : '';
            var sPattern = starStyle ? starStyle.pattern : '';
            var sPatternOpacity = starStyle ? starStyle.patternOpacity : 0;
            var sBorderVal = starStyle ? starStyle.border : styleColor;

            // 星级特效强度
            var isHighStar = displayStarLevel >= 3;
            var isMaxStar = displayStarLevel >= 5;
            var isEliteStar = displayStarLevel >= 4;

            // 华丽版：直接使用配置的shadow，不再手动拼接hex suffix
            var dynamicShadow = styleGlow;
            if (isMaxStar) {
                dynamicShadow += ', 0 0 60px rgba(0,0,0,0.4)';
            }

            // 华丽版：使用配置的rgba边框值
            var dynamicBorder = cardBorderWidth + 'px solid ' + sBorderVal;

            // 3星以上添加边框发光动画
            var borderAnim = isHighStar ? 'animation: cardBorderPulse' + displayStarLevel + ' 2s ease-in-out infinite alternate;' : '';

            // 5星：呼吸光环
            var auraAnim = isMaxStar ? 'animation: cardStarAura 3s ease-in-out infinite;' : '';

            // 卡片容器开始
            html += '<div onclick="showCardDetailModal(' + "'" + card.id + "'" + ', ' + "'" + deckId + "'" + ')" ' +
                'style="' +
                'background: ' + cardBg + '; ' +
                'border-radius: 12px; ' +
                'border: ' + dynamicBorder + '; ' +
                'overflow: hidden; ' +
                'position: relative; ' +
                'cursor: pointer; ' +
                'transition: all 0.3s; ' +
                'box-shadow: ' + dynamicShadow + '; ' +
                'isolation: isolate; ' +
                borderAnim +
                auraAnim +
                '" ' +
                'onmouseover="this.style.transform=' + "'" + 'translateY(-8px) scale(1.02)' + "'" + '; ' +
                'this.style.boxShadow=' + "'" + dynamicShadow + ', 0 20px 40px rgba(0,0,0,0.5)' + "'" + ';" ' +
                'onmouseout="this.style.transform=' + "'" + 'none' + "'" + '; ' +
                'this.style.boxShadow=' + "'" + dynamicShadow + "'" + ';">';

            // 华丽版：纹理背景层 (::before 模拟)
            if (sPattern) {
                html += '<div style="position: absolute; inset: 0; background: ' + sPattern + '; opacity: ' + sPatternOpacity + '; border-radius: inherit; pointer-events: none; z-index: 0;"></div>';
            }

            // 华丽版：内发光边框层 (::after 模拟)
            if (sInnerBorder || sInnerShadow) {
                var innerDivStyle = 'position: absolute; inset: 4px; pointer-events: none; border-radius: 10px; z-index: 1;';
                if (sInnerBorder) innerDivStyle += ' border: ' + sInnerBorder + ';';
                if (sInnerShadow) innerDivStyle += ' box-shadow: ' + sInnerShadow + ';';
                html += '<div style="' + innerDivStyle + '"></div>';
            }

            // 3-5星专属：背景粒子层
            if (isHighStar && sParticleOpacity > 0) {
                var particleCount = starStyle ? starStyle.particleCount : (displayStarLevel * 2 + 3);
                var particles = '';
                for (var pi = 0; pi < particleCount; pi++) {
                    var px = 5 + (Math.random() * 90);
                    var py = 5 + (Math.random() * 90);
                    var pDelay = (Math.random() * 3).toFixed(2);
                    var pDuration = (2 + Math.random() * 3).toFixed(2);
                    var pSize = (0.4 + Math.random() * 0.8).toFixed(2);
                    var pOpacity = Math.min(1, parseFloat(sParticleOpacity) + (Math.random() * 0.2)).toFixed(2);

                    var pColor = isMaxStar ? 
                        'linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff)' : 
                        sParticleColor;
                    var pStyle = isMaxStar ? 
                        'background: ' + pColor + '; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' : 
                        'color: ' + pColor + ';';

                    particles += '<span style="' +
                        'position: absolute; ' +
                        'left: ' + px + '%; ' +
                        'top: ' + py + '%; ' +
                        'font-size: ' + pSize + 'rem; ' +
                        'opacity: ' + pOpacity + '; ' +
                        'animation: cardStarFloat ' + pDuration + 's ease-in-out ' + pDelay + 's infinite; ' +
                        'z-index: 4; ' +
                        'pointer-events: none; ' +
                        pStyle +
                        'text-shadow: 0 0 ' + (displayStarLevel * 2) + 'px ' + sParticleColor + '; ' +
                        '">' + sParticle + '</span>';
                }
                html += '<div style="position: absolute; inset: 0; z-index: 4; pointer-events: none; overflow: hidden;">' + particles + '</div>';
            }

            // 4-5星专属：内发光层（华丽版使用 innerShadow）
            if (isEliteStar && sInnerShadow) {
                var innerGlowIntensity = sInnerShadow;
                html += '<div style="position: absolute; inset: 0; z-index: 3; pointer-events: none; box-shadow: ' + innerGlowIntensity + '; border-radius: inherit;"></div>';
            }

            // 5星专属：流光线条
            if (isMaxStar) {
                html += 
                    '<div style="position: absolute; top: 0; left: -100%; width: 50%; height: 2px; ' +
                    'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent); ' +
                    'animation: cardBorderFlow 2.4s linear infinite; z-index: 6;"></div>' +
                    '<div style="position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; ' +
                    'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent); ' +
                    'animation: cardBorderFlow 2.4s linear infinite reverse; z-index: 6;"></div>';
            }

            // 卡片图片区域
            var imgGlow = isMaxStar ? 
                'filter: drop-shadow(0 0 20px ' + styleColor + ') drop-shadow(0 0 40px ' + styleColor + '50);' : 
                (isHighStar ? 'filter: drop-shadow(0 0 10px ' + styleColor + ');' : '');

            html += '<div style="height: 200px; background: #0a0a0f; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">' +
                '<img src="' + card.image + '" style="width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease; ' + imgGlow + '" ' +
                'onerror="this.style.display=' + "'" + 'none' + "'" + '; this.parentElement.innerHTML=' + "'" + '<div style=font-size:4rem;color:' + styleColor + ';filter:drop-shadow(0 0 15px ' + styleColor + ');>🎴</div>' + "'" + ';" ' +
                'onload="this.style.opacity=1;" ' +
                'onmouseover="this.style.transform=' + "'" + 'scale(1.08)' + "'" + ';" ' +
                'onmouseout="this.style.transform=' + "'" + 'none' + "'" + ';">' +
                '<div style="position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, ' + cardBg.replace('180deg', '0deg').replace('0%,', '20%,') + ' 100%); z-index: 3; pointer-events: none;"></div>' +
            '</div>';

            // 卡片信息区域
            var nameGlow = isHighStar ? 'text-shadow: 0 0 ' + (displayStarLevel * 2) + 'px ' + styleColor + '80, 0 0 ' + (displayStarLevel * 4) + 'px ' + styleColor + '40;' : '';
            var descColor = isHighStar ? styleColor : '#888';

            html += '<div style="padding: 14px; position: relative; z-index: 5;">' +
                '<div style="font-family: Orbitron; font-size: 0.95rem; color: #fff; margin-bottom: 6px; text-align: center; ' + nameGlow + '">' + card.name + '</div>' +

                '<div style="display: flex; justify-content: center; gap: 12px; font-size: 0.75rem; color: #888; margin-bottom: 12px;">' +
                    '<span style="display: flex; align-items: center; gap: 4px;">' +
                        '<span style="color: ' + styleColor + '; text-shadow: 0 0 5px ' + styleColor + '40;">' + 
                            '★'.repeat(displayStarLevel) + '☆'.repeat(5 - displayStarLevel) + 
                        '</span>' +
                    '</span>' +
                '</div>' +

                '<div style="color: ' + descColor + '; font-size: 0.8rem; line-height: 1.4; text-align: center; margin-bottom: 10px; ' + 
                (isHighStar ? 'text-shadow: 0 0 5px ' + styleColor + '30;' : '') + 
                (window.innerWidth <= 768 ? 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' : '') + 
                '">' + card.desc + '</div>' +

                // 【修正后的进度条】
                '<div style="display: flex; align-items: center; gap: 10px;">' +
                    '<div style="flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden;">' +
                        '<div style="height: 100%; background: linear-gradient(90deg, ' + styleColor + '80, ' + styleColor + '); border-radius: 3px; width: ' + progressPercent + '%; ' +
                        'box-shadow: 0 0 6px ' + styleColor + '40; transition: width 0.5s ease;"></div>' +
                    '</div>' +
                    '<span style="font-size: 0.75rem; color: ' + styleColor + '; font-family: Orbitron; min-width: 55px; text-align: right;">' + 
                        count + '/' + (upgradeCost || 'MAX') + 
                    '</span>' +
                '</div>' +

                // 【新增】形态名称
                '<div style="color: ' + styleColor + '; font-size: 0.7rem; text-align: center; margin-top: 6px; opacity: 0.8;">' + 
                    sTypeName + 
                '</div>' +
            '</div>' +
            '</div>';
        }

        }
    grid.innerHTML = html;
}




function enterCodexFaction(factionKey) { renderCodexBlocks(factionKey); }
function enterCodexBlock(factionKey, blockKey) { renderCodexDecks(factionKey, blockKey); }
function enterCodexDeck(factionKey, blockKey, deckId) { renderCodexCards(factionKey, blockKey, deckId); }



function updateCodexOverview() {
    var stats = calculateTotalProgress();
    var percent = stats.total > 0 ? Math.floor((stats.collected / stats.total) * 100) : 0;
    var cEl = document.getElementById('codexCardCount');
    var tEl = document.getElementById('codexTotalCards');
    var pEl = document.getElementById('codexPercent');
    if (cEl) cEl.textContent = stats.collected;
    if (tEl) tEl.textContent = stats.total;
    if (pEl) pEl.textContent = percent + '%';
}

// ═══════════════════════════════════════════════════════════════
//  图鉴分类系统
// ═══════════════════════════════════════════════════════════════
var currentCodexCategory = 'all';
window.currentCodexCategory = currentCodexCategory;

function switchCodexTab(category) {
    currentCodexCategory = category;
    
    // 更新标签样式
    document.querySelectorAll('.codex-tab').forEach(function(tab) {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
            tab.style.borderColor = 'var(--orokin-cyan)';
            tab.style.color = 'var(--orokin-cyan)';
        } else {
            tab.classList.remove('active');
            tab.style.borderColor = '#333';
            tab.style.color = '#888';
        }
    });
    
    // 重新渲染当前视图
    if (codexViewState.level === 'factions') {
        renderCodexFactions();
    } else if (codexViewState.level === 'cards') {
        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
    }
}

// 判断卡片属于哪个分类
function getCardCategory(card) {
    if (!card) return 'battle';
    
    // 矿物卡：id以m_开头 或 type为mineral 或 faction为mining
    if (card.id && card.id.indexOf('m_') === 0) return 'mining';
    if (card.type === 'mineral') return 'mining';
    if (card.faction === 'mining') return 'mining';
    
    // 采集卡：id以p_或g_开头 或 type为plant 或 faction为gathering
    if (card.id && (card.id.indexOf('p_') === 0 || card.id.indexOf('g_') === 0)) return 'gathering';
    if (card.type === 'plant') return 'gathering';
    if (card.faction === 'gathering') return 'gathering';
    
    // 其他都是战斗卡
    return 'battle';
}



// 卡片获得弹窗
function showCardAcquireModal(cardData, sourceName) {
    // 确保数据已加载
    initPlayerCards();

    // ═══════════════════════════════════════════════════════════════
    //  队列机制：一次只显示一张卡片获得弹窗
    // ═══════════════════════════════════════════════════════════════
    if (!window._cardAcquireQueue) window._cardAcquireQueue = [];
    if (!window._cardAcquireShowing) window._cardAcquireShowing = false;

    // 将当前卡片加入队列
    window._cardAcquireQueue.push({ cardData: cardData, sourceName: sourceName });

    // 如果已有弹窗显示中，直接返回（等待当前弹窗关闭后自动显示下一张）
    if (window._cardAcquireShowing) return;

    // 显示队列中的下一张卡片
    _showNextCardAcquire();
}

// 内部函数：显示队列中的下一张卡片
function _showNextCardAcquire() {
    if (!window._cardAcquireQueue || window._cardAcquireQueue.length === 0) {
        window._cardAcquireShowing = false;
        return;
    }

    window._cardAcquireShowing = true;
    var item = window._cardAcquireQueue.shift();
    var cardData = item.cardData;
    var sourceName = item.sourceName;

    // 关闭已存在的获得弹窗
    var existing = document.getElementById('cardAcquireOverlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'cardAcquireOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 3000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;';

    // 获取卡片数据
    initPlayerCards();
    var count = getPlayerCardCount(cardData.id);
    var cardInfo = playerCards[cardData.id];
    var actualStarLevel = cardInfo ? (cardInfo.starLevel || 1) : 1;
    var starStyle = getCardStarStyle(cardData, actualStarLevel);

    var styleColor = starStyle ? starStyle.color : '#888';
    var sBorder = starStyle ? starStyle.border : styleColor;
    var sBg = starStyle ? starStyle.bg : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)';
    var sGlow = starStyle ? starStyle.shadow : '0 0 50px ' + styleColor + '40';
    var sParticle = starStyle ? starStyle.particle : '✦';
    var sParticleColor = starStyle ? starStyle.particleColor : styleColor;
    var sParticleOpacity = starStyle ? starStyle.particleOpacity : 0.5;
    var sTypeName = starStyle ? starStyle.typeName : '遗落';
    var sDesc = starStyle ? starStyle.desc : '';
    var sInnerShadow = starStyle ? starStyle.innerShadow : '';
    var sPattern = starStyle ? starStyle.pattern : '';
    var sPatternOpacity = starStyle ? starStyle.patternOpacity : 0;
    var sInnerBorder = starStyle ? starStyle.innerBorder : '';

    var starLevel = actualStarLevel;
    var isHighStar = starLevel >= 3;
    var isMaxStar = starLevel >= 5;
    var isEliteStar = starLevel >= 4;

    // 华丽版：直接使用配置的shadow
    var borderWidth = starStyle ? starStyle.borderWidth : starLevel;
    var glowIntensity = sGlow;
    if (isMaxStar) glowIntensity += ', 0 0 60px rgba(0,0,0,0.4)';
    var innerGlow = sInnerShadow || 'inset 0 0 10px ' + styleColor + '05';

    var particleCount = isHighStar ? (starStyle ? starStyle.particleCount : (starLevel * 2 + 3)) : 0;

    // 动态CSS
    var styleId = 'cardAcquireDynamicStyle';
    var existingStyle = document.getElementById(styleId);
    if (existingStyle) existingStyle.remove();

    var dynamicStyle = document.createElement('style');
    dynamicStyle.id = styleId;
    dynamicStyle.textContent = `
        @keyframes cardBorderPulse${starLevel} {
            0% { box-shadow: ${glowIntensity}; }
            50% { box-shadow: ${glowIntensity.replace(/\d+px/g, function(m){ return Math.round(parseInt(m)*1.3)+'px'; })}; }
            100% { box-shadow: ${glowIntensity}; }
        }
        @keyframes cardRainbowGlow {
            0%, 100% { box-shadow: 0 0 30px rgba(255,0,0,0.6), 0 0 60px rgba(255,128,0,0.4), 0 0 90px rgba(255,255,0,0.2); }
            25% { box-shadow: 0 0 30px rgba(0,255,0,0.6), 0 0 60px rgba(0,255,255,0.4), 0 0 90px rgba(0,128,255,0.2); }
            50% { box-shadow: 0 0 30px rgba(0,0,255,0.6), 0 0 60px rgba(128,0,255,0.4), 0 0 90px rgba(255,0,128,0.2); }
            75% { box-shadow: 0 0 30px rgba(255,0,128,0.6), 0 0 60px rgba(255,0,0,0.4), 0 0 90px rgba(255,128,0,0.2); }
        }
        @keyframes cardStarFloat {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
            50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
        }
        @keyframes cardBorderFlow {
            0% { left: -100%; }
            100% { left: 200%; }
        }
        @keyframes cardStarAura {
            0%, 100% { filter: brightness(1) saturate(1); }
            50% { filter: brightness(1.12) saturate(1.18); }
        }
        @keyframes cardAcquirePop {
            0% { transform: scale(0.5) translateY(50px); opacity: 0; }
            60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .card-acquire-glow-${starLevel} {
            animation: ${isMaxStar ? 'cardRainbowGlow 4s ease-in-out infinite' : (starLevel >= 3 ? 'cardBorderPulse' + starLevel + ' 2s ease-in-out infinite alternate' : 'none')};
        }
    `;
    document.head.appendChild(dynamicStyle);

    // 粒子HTML
    var particlesHtml = '';
    if (isHighStar && sParticleOpacity > 0) {
        for (var pi = 0; pi < particleCount; pi++) {
            var px = 5 + Math.random() * 90;
            var py = 5 + Math.random() * 90;
            var pDelay = (Math.random() * 2).toFixed(2);
            var pDuration = (1.5 + Math.random() * 2).toFixed(2);
            var pSize = (0.5 + Math.random() * 0.8).toFixed(2);
            var pOpacity = Math.min(1, parseFloat(sParticleOpacity) + (Math.random() * 0.2)).toFixed(2);
            var particleStyle = isMaxStar ? 
                'background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' : 
                'color: ' + sParticleColor + ';';
            particlesHtml += '<span style="' +
                'position: absolute;' +
                'left: ' + px + '%;' +
                'top: ' + py + '%;' +
                'font-size: ' + pSize + 'rem;' +
                'opacity: ' + pOpacity + ';' +
                'animation: cardStarFloat ' + pDuration + 's ease-in-out ' + pDelay + 's infinite;' +
                'z-index: 10;' +
                'pointer-events: none;' +
                particleStyle +
                'text-shadow: 0 0 ' + (starLevel * 2) + 'px ' + sParticleColor + ';' +
                '">' + sParticle + '</span>';
        }
    }

    // 卡片容器样式
    var containerClass = 'card-acquire-glow-' + starLevel;
    var containerStyle = isMaxStar ? '' : 
        'background: ' + sBg + ';' +
        'border: ' + borderWidth + 'px solid ' + sBorder + ';' +
        'border-radius: 16px;' +
        'box-shadow: ' + glowIntensity + ', ' + innerGlow + ';' +
        'position: relative;' +
        'overflow: hidden;';

    // 5星流光线条
    var flowLines = isMaxStar ? 
        '<div style="position: absolute; top: 0; left: -100%; width: 50%; height: 2px; ' +
        'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); ' +
        'animation: cardBorderFlow 2s linear infinite; z-index: 6;"></div>' +
        '<div style="position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; ' +
        'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); ' +
        'animation: cardBorderFlow 2s linear infinite reverse; z-index: 6;"></div>' : '';

    // 图标发光
    var iconGlow = 'filter: drop-shadow(0 0 ' + (starLevel * 4) + 'px ' + styleColor + ') drop-shadow(0 0 ' + (starLevel * 8) + 'px ' + styleColor + '40);';
    var iconAnimation = starLevel >= 3 ? 'cardStarFloat 3s ease-in-out infinite' : 'none';

    // 图片发光
    var imgGlow = isMaxStar ? 
        'filter: drop-shadow(0 0 20px ' + styleColor + ') drop-shadow(0 0 40px ' + styleColor + '50);' : 
        (isHighStar ? 'filter: drop-shadow(0 0 10px ' + styleColor + ');' : '');

    // 名称发光
    var nameGlow = 'text-shadow: 0 0 ' + (starLevel * 3) + 'px ' + styleColor + '80, 0 0 ' + (starLevel * 6) + 'px ' + styleColor + '40;';

    // 进度条
    var type = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
    var upgradeCost = getUpgradeRequirement(type, actualStarLevel);
    var progressPercent = upgradeCost ? Math.min(100, (count / upgradeCost) * 100) : 100;

    // 构建弹窗内容 - 采用图鉴弹窗风格
    var modalBox = document.createElement('div');
    modalBox.style.cssText = 'text-align: center; max-width: 340px; width: 90%; animation: cardAcquirePop 0.5s ease forwards;';

    // 标题
    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-family: Orbitron; font-size: 1.3rem; color: var(--tenno-gold); margin-bottom: 20px; text-shadow: 0 0 15px rgba(200,168,75,0.3);';
    titleEl.textContent = '🎴 获得卡片';
    modalBox.appendChild(titleEl);

    // ========== 卡片展示区域（华丽版图鉴风格）==========
    var cardBox = document.createElement('div');
    cardBox.className = containerClass;
    cardBox.style.cssText = containerStyle + 'width: 300px; height: 450px; margin: 0 auto 20px; position: relative; isolation: isolate; display: flex; flex-direction: column; overflow: hidden;';

    // 华丽版：纹理层
    if (sPattern) {
        var patternLayer = document.createElement('div');
        patternLayer.style.cssText = 'position: absolute; inset: 0; background: ' + sPattern + '; opacity: ' + sPatternOpacity + '; border-radius: inherit; pointer-events: none; z-index: 0;';
        cardBox.appendChild(patternLayer);
    }

    // 华丽版：内发光边框层
    if (sInnerBorder || sInnerShadow) {
        var innerDiv = document.createElement('div');
        var innerStyle2 = 'position: absolute; inset: 4px; pointer-events: none; border-radius: 12px; z-index: 1;';
        if (sInnerBorder) innerStyle2 += ' border: ' + sInnerBorder + ';';
        if (sInnerShadow) innerStyle2 += ' box-shadow: ' + sInnerShadow + ';';
        innerDiv.style.cssText = innerStyle2;
        cardBox.appendChild(innerDiv);
    }

    // 粒子层
    if (particlesHtml) {
        var particleLayer = document.createElement('div');
        particleLayer.style.cssText = 'position: absolute; inset: 0; z-index: 10; pointer-events: none; overflow: hidden;';
        particleLayer.innerHTML = particlesHtml;
        cardBox.appendChild(particleLayer);
    }

    // 内发光层
    var innerGlowLayer = document.createElement('div');
    innerGlowLayer.style.cssText = 'position: absolute; inset: 0; z-index: 3; pointer-events: none; box-shadow: ' + innerGlow + '; border-radius: inherit;';
    cardBox.appendChild(innerGlowLayer);

    // 流光线条
    if (isMaxStar) {
        var flowLayer = document.createElement('div');
        flowLayer.style.cssText = 'position: absolute; inset: 0; z-index: 6; pointer-events: none; overflow: hidden;';
        flowLayer.innerHTML = flowLines;
        cardBox.appendChild(flowLayer);
    }

    // 图片区域（与卡片详情一致：60%高度）
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'height: 270px; background: #0a0a0f; position: relative; overflow: hidden; border-radius: 12px 12px 0 0; flex-shrink: 0;';

    var img = document.createElement('img');
    img.src = cardData.image || '';
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease; ' + imgGlow;
    img.onerror = function() {
        this.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText = 'font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: ' + styleColor + '; filter: drop-shadow(0 0 15px ' + styleColor + ');';
        placeholder.textContent = cardData.icon || '🎴';
        imgWrap.appendChild(placeholder);
    };
    imgWrap.appendChild(img);

    // 渐变遮罩（图鉴风格）
    var gradient = document.createElement('div');
    gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, #0a0a0f 100%); z-index: 2; pointer-events: none;';
    imgWrap.appendChild(gradient);

    // 星级角标（图鉴风格）
    var starBadge = document.createElement('div');
    var starsStr = '★'.repeat(starLevel) + '☆'.repeat(5 - starLevel);
    starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid ' + sBorder + '; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: ' + styleColor + '; text-shadow: 0 0 8px ' + styleColor + '60; font-family: Orbitron; z-index: 5;';
    starBadge.textContent = starsStr;
    imgWrap.appendChild(starBadge);

    // 类型标签
    var typeLabel = document.createElement('div');
    typeLabel.style.cssText = 'position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); border: 1px solid ' + sBorder + '80; border-radius: 6px; padding: 4px 8px; font-size: 0.7rem; color: ' + styleColor + '; font-weight: bold; z-index: 5;';
    typeLabel.textContent = '【新获得】';
    imgWrap.appendChild(typeLabel);

    cardBox.appendChild(imgWrap);

    // 信息区域（图鉴风格）
    var infoWrap = document.createElement('div');
    infoWrap.style.cssText = 'padding: 18px; position: relative; z-index: 5;';

    // 名称
    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 6px; text-align: center; ' + nameGlow;
    nameEl.textContent = cardData.name;
    infoWrap.appendChild(nameEl);

    // 星级文字
    var starText = document.createElement('div');
    starText.style.cssText = 'font-size: 0.9rem; color: ' + styleColor + '; font-weight: 700; margin-bottom: 8px; text-align: center; letter-spacing: 1px;';
    starText.textContent = sTypeName + ' · ' + starLevel + '星';
    infoWrap.appendChild(starText);

    // 描述
    var descEl = document.createElement('div');
    descEl.style.cssText = 'font-size: 0.8rem; color: #888; line-height: 1.5; text-align: center; margin-bottom: 12px;';
    descEl.textContent = cardData.desc || '';
    infoWrap.appendChild(descEl);

    // 来源
    var sourceEl = document.createElement('div');
    sourceEl.style.cssText = 'color: #666; font-size: 0.75rem; margin-bottom: 12px; text-align: center;';
    sourceEl.textContent = '来源: ' + (sourceName || '未知敌人');
    infoWrap.appendChild(sourceEl);

    // 状态提示
    var statusEl = document.createElement('div');
    statusEl.style.cssText = 'color: var(--infested-green); font-size: 0.85rem; font-weight: 700; text-align: center; text-shadow: 0 0 10px rgba(78,255,78,0.3); margin-bottom: 12px;';
    statusEl.textContent = count > 1 ? '⭐ 卡片星级提升！' : '✨ 已加入您的卡片收藏！';
    infoWrap.appendChild(statusEl);

    // 进度条（图鉴风格）
    if (upgradeCost) {
        var progressWrap = document.createElement('div');
        progressWrap.style.cssText = 'display: flex; align-items: center; gap: 10px; margin-bottom: 10px;';

        var progressBar = document.createElement('div');
        progressBar.style.cssText = 'flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden;';

        var progressFill = document.createElement('div');
        progressFill.style.cssText = 'height: 100%; width: ' + progressPercent + '%; background: linear-gradient(90deg, ' + styleColor + '60, ' + styleColor + '); border-radius: 3px; box-shadow: 0 0 6px ' + styleColor + '40; transition: width 0.5s ease;';
        progressBar.appendChild(progressFill);

        var progressText = document.createElement('span');
        progressText.style.cssText = 'font-size: 0.75rem; color: ' + styleColor + '; font-family: Orbitron; min-width: 55px; text-align: right;';
        progressText.textContent = count + '/' + upgradeCost;

        progressWrap.appendChild(progressBar);
        progressWrap.appendChild(progressText);
        infoWrap.appendChild(progressWrap);
    }

    // 形态名称
    var formName = document.createElement('div');
    formName.style.cssText = 'color: ' + styleColor + '; font-size: 0.7rem; text-align: center; margin-top: 6px; opacity: 0.8;';
    formName.textContent = sDesc;
    infoWrap.appendChild(formName);

    cardBox.appendChild(infoWrap);
    modalBox.appendChild(cardBox);

    // 关闭按钮
    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✓ 确认';
    closeBtn.style.cssText = 'padding: 10px 30px; background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan)); border: none; border-radius: 8px; color: var(--void-black); font-family: Orbitron; font-size: 0.9rem; cursor: pointer; transition: all 0.3s; font-weight: 700;';
    closeBtn.onmouseover = function() { this.style.transform = 'scale(1.05)'; this.style.boxShadow = '0 5px 20px rgba(0,212,255,0.4)'; };
    closeBtn.onmouseout = function() { this.style.transform = 'none'; this.style.boxShadow = 'none'; };
    closeBtn.onclick = function() { _closeCardAcquire(overlay); };
    modalBox.appendChild(closeBtn);

    // 队列提示
    if (window._cardAcquireQueue && window._cardAcquireQueue.length > 0) {
        var queueHint = document.createElement('div');
        queueHint.style.cssText = 'color: #666; font-size: 0.75rem; margin-top: 12px; text-align: center;';
        queueHint.textContent = '还有 ' + window._cardAcquireQueue.length + ' 张卡片等待领取...';
        modalBox.appendChild(queueHint);
    }

    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    // 点击背景关闭
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            _closeCardAcquire(overlay);
        }
    };
}

// 内部函数：关闭卡片获得弹窗并显示下一张
function _closeCardAcquire(overlay) {
    var styleEl = document.getElementById('cardAcquireDynamicStyle');
    if (styleEl) styleEl.remove();
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(function() {
            overlay.remove();
            // 显示队列中的下一张卡片
            _showNextCardAcquire();
        }, 300);
    } else {
        // 如果 overlay 已经被移除，直接显示下一张
        _showNextCardAcquire();
    }
}

function showCardDetailModal(cardId, deckId) {
    // 从 DECK_CARDS 查找原始卡片数据
    var card = null;
    for (var dId in DECK_CARDS) {
        var deck = DECK_CARDS[dId];
        for (var i = 0; i < deck.length; i++) {
            if (deck[i].id === cardId) {
                card = deck[i];
                break;
            }
        }
        if (card) break;
    }
    if (!card) return;

    initPlayerCards();
    var count = getPlayerCardCount(cardId);
    var cardInfo = playerCards[cardId];
    var currentStar = cardInfo ? (cardInfo.starLevel || 1) : 1;

    var currentStyle = getCardStarStyle(card, currentStar);
    var type = card.cardType || CARD_TYPE_MAP[card.rarity] || 'normal';
    var cost = getUpgradeRequirement(type, currentStar);
    var canUpgrade = cost !== null && count >= cost;
    var detailColor = currentStyle ? currentStyle.color : '#888';
    var detailColor2 = currentStyle ? currentStyle.color2 : detailColor;
    var detailShadow = currentStyle ? currentStyle.shadow : '0 0 20px rgba(136,136,136,0.25)';
    var detailBg = currentStyle ? currentStyle.bg : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)';
    var detailBorder = currentStyle ? currentStyle.border : detailColor;
    var detailBorderWidth = currentStyle ? currentStyle.borderWidth : 2;
    var detailParticle = currentStyle ? currentStyle.particle : '✦';
    var detailParticleColor = currentStyle ? currentStyle.particleColor : detailColor;
    var detailParticleOpacity = currentStyle ? currentStyle.particleOpacity : 0;
    var detailTypeName = currentStyle ? currentStyle.typeName : '遗落';
    var detailInnerBorder = currentStyle ? currentStyle.innerBorder : '';
    var detailInnerShadow = currentStyle ? currentStyle.innerShadow : '';
    var detailPattern = currentStyle ? currentStyle.pattern : '';
    var detailPatternOpacity = currentStyle ? currentStyle.patternOpacity : 0;
    var detailHighStar = currentStar >= 3;
    var detailEliteStar = currentStar >= 4;
    var detailMaxStar = currentStar >= 5;

    // 华丽版：直接使用配置的shadow
    var detailDynamicShadow = detailShadow;
    if (detailMaxStar) detailDynamicShadow += ', 0 0 60px rgba(0,0,0,0.4)';
    var detailBorderCss = detailBorderWidth + 'px solid ' + detailBorder;
    var detailBorderAnim = detailHighStar ? 'animation: cardBorderPulse' + currentStar + ' 2s ease-in-out infinite alternate;' : '';
    var detailAuraAnim = detailMaxStar ? 'animation: cardStarAura 3s ease-in-out infinite;' : '';

    var overlay = document.createElement('div');
    overlay.id = 'cardDetailOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 3000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;';

    // ========== 静态卡片展示（华丽版）==========
    var cardBox = document.createElement('div');
    cardBox.style.cssText = 'width: 300px; height: 450px; background: ' + detailBg + '; border: ' + detailBorderCss + '; border-radius: 16px; overflow: hidden; box-shadow: ' + detailDynamicShadow + '; margin: 0 auto 20px; position: relative; isolation: isolate; display: flex; flex-direction: column; ' + detailBorderAnim + detailAuraAnim;

    // 华丽版：纹理层
    if (detailPattern) {
        var patternLayer = document.createElement('div');
        patternLayer.style.cssText = 'position:absolute; inset:0; background:' + detailPattern + '; opacity:' + detailPatternOpacity + '; border-radius:inherit; pointer-events:none; z-index:0;';
        cardBox.appendChild(patternLayer);
    }

    // 华丽版：内发光边框层
    if (detailInnerBorder || detailInnerShadow) {
        var innerDiv = document.createElement('div');
        var innerStyle = 'position:absolute; inset:4px; pointer-events:none; border-radius:12px; z-index:1;';
        if (detailInnerBorder) innerStyle += ' border:' + detailInnerBorder + ';';
        if (detailInnerShadow) innerStyle += ' box-shadow:' + detailInnerShadow + ';';
        innerDiv.style.cssText = innerStyle;
        cardBox.appendChild(innerDiv);
    }

    // 3-5星粒子层
    if (detailHighStar && detailParticleOpacity > 0) {
        var particleLayer = document.createElement('div');
        particleLayer.style.cssText = 'position:absolute; inset:0; pointer-events:none; z-index:4; overflow:hidden;';
        var particleCount = currentStyle ? currentStyle.particleCount : (currentStar * 2 + 3);
        var particles = '';
        for (var pi = 0; pi < particleCount; pi++) {
            var px = 5 + (Math.random() * 90);
            var py = 5 + (Math.random() * 90);
            var pDelay = (Math.random() * 3).toFixed(2);
            var pDuration = (2 + Math.random() * 3).toFixed(2);
            var pSize = (0.4 + Math.random() * 0.8).toFixed(2);
            var pOpacity = Math.min(1, parseFloat(detailParticleOpacity) + (Math.random() * 0.2)).toFixed(2);
            var pStyle = detailMaxStar
                ? 'background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;'
                : 'color: ' + detailParticleColor + ';';
            particles += '<span style="position:absolute; left:' + px + '%; top:' + py + '%; font-size:' + pSize + 'rem; opacity:' + pOpacity + '; animation: cardStarFloat ' + pDuration + 's ease-in-out ' + pDelay + 's infinite; z-index:4; pointer-events:none; text-shadow:0 0 ' + (currentStar * 2) + 'px ' + detailParticleColor + '; ' + pStyle + '">' + detailParticle + '</span>';
        }
        particleLayer.innerHTML = particles;
        cardBox.appendChild(particleLayer);
    }

    // 4-5星内发光
    if (detailEliteStar && detailInnerShadow) {
        var detailInnerGlow = document.createElement('div');
        detailInnerGlow.style.cssText = 'position:absolute; inset:0; z-index:3; pointer-events:none; box-shadow:' + detailInnerShadow + '; border-radius:inherit;';
        cardBox.appendChild(detailInnerGlow);
    }

    // 5星流光线条
    if (detailMaxStar) {
        var flowTop = document.createElement('div');
        flowTop.style.cssText = 'position:absolute; top:0; left:-100%; width:50%; height:2px; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent); animation:cardBorderFlow 2.4s linear infinite; z-index:6;';
        var flowBottom = document.createElement('div');
        flowBottom.style.cssText = 'position:absolute; bottom:0; right:-100%; width:50%; height:2px; background:linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent); animation:cardBorderFlow 2.4s linear infinite reverse; z-index:6;';
        cardBox.appendChild(flowTop);
        cardBox.appendChild(flowBottom);
    }

    // 图片区域
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'height: 60%; background: #0a0a0f; position: relative; overflow: hidden;';

    var img = document.createElement('img');
    img.src = card.image;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: top center;';
    img.onerror = function() {
        this.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText = 'font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: ' + detailColor + ';';
        placeholder.textContent = '🎴';
        imgWrap.appendChild(placeholder);
    };
    imgWrap.appendChild(img);

    var gradient = document.createElement('div');
    gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(180deg, transparent 0%, #0a0a0f 100%);';
    imgWrap.appendChild(gradient);

    // 星级角标
    var starBadge = document.createElement('div');
    var starsStr = '★'.repeat(currentStar) + '☆'.repeat(5 - currentStar);
    starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid ' + detailColor + '; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: ' + detailColor + '; font-family: Orbitron; box-shadow: 0 0 14px ' + detailColor + ';';
    starBadge.textContent = starsStr;
    imgWrap.appendChild(starBadge);

    cardBox.appendChild(imgWrap);

    // 信息区域
    var infoWrap = document.createElement('div');
    infoWrap.style.cssText = 'padding: 18px; text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center;';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 6px; text-shadow: 0 0 10px ' + detailColor + ';';
    nameEl.textContent = card.name;
    infoWrap.appendChild(nameEl);

    var typeEl = document.createElement('div');
    typeEl.style.cssText = 'font-size: 0.9rem; color: ' + detailColor + '; font-weight: 700; margin-bottom: 8px;';
    typeEl.textContent = detailTypeName + ' · ' + currentStar + '星';
    infoWrap.appendChild(typeEl);

    var descEl = document.createElement('div');
    descEl.style.cssText = 'font-size: 0.8rem; color: #888; line-height: 1.5; margin-bottom: 12px;';
    descEl.textContent = card.desc;
    infoWrap.appendChild(descEl);

    // 进度条
    var progressWrap = document.createElement('div');
    progressWrap.style.cssText = 'display: flex; align-items: center; gap: 8px; margin-bottom: 10px;';
    
    var progressBar = document.createElement('div');
    progressBar.style.cssText = 'flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden;';
    
    var progressFill = document.createElement('div');
    var progressPercent = cost ? Math.min(100, (count / cost) * 100) : 100;
    progressFill.style.cssText = 'height: 100%; width: ' + progressPercent + '%; background: linear-gradient(90deg, ' + detailColor + '60, ' + detailColor + '); border-radius: 3px;';
    progressBar.appendChild(progressFill);
    
    var progressText = document.createElement('span');
    progressText.style.cssText = 'font-size: 0.8rem; color: ' + detailColor + '; font-family: Orbitron; min-width: 50px;';
    progressText.textContent = count + '/' + (cost || 'MAX');
    
    progressWrap.appendChild(progressBar);
    progressWrap.appendChild(progressText);
    infoWrap.appendChild(progressWrap);

    cardBox.appendChild(infoWrap);
    // ========== 静态卡片结束 ==========

    // 弹窗内容
    var modalBox = document.createElement('div');
    modalBox.style.cssText = 'text-align: center; max-width: 400px; width: 90%;';

    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-family: Orbitron; font-size: 1.3rem; color: var(--orokin-cyan); margin-bottom: 15px;';
    titleEl.textContent = '🎴 卡片详情';
    modalBox.appendChild(titleEl);

    modalBox.appendChild(cardBox);

    // 按钮
    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-top: 15px;';

    if (canUpgrade) {
        var btnUpgrade = document.createElement('button');
        btnUpgrade.textContent = '✨ 升星 (消耗 ' + cost + ' 张)';
        btnUpgrade.style.cssText = 'padding: 10px 24px; background: linear-gradient(135deg, ' + detailColor + '60, ' + detailColor + '); border: 2px solid ' + detailBorder + '; border-radius: 10px; color: #fff; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; transition: all 0.3s;';
        btnUpgrade.onmouseover = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 30px ' + detailColor + '60';
        };
        btnUpgrade.onmouseout = function() {
            this.style.transform = 'none';
            this.style.boxShadow = 'none';
        };
        btnUpgrade.onclick = function() {
            overlay.remove();
            openUpgradeModal(cardId);
        };
        btnWrap.appendChild(btnUpgrade);
    } else if (currentStar >= 5) {
        var maxBadge = document.createElement('div');
        maxBadge.textContent = '⭐ 已达最高星级';
        maxBadge.style.cssText = 'padding: 10px 24px; background: linear-gradient(135deg, #ffd70040, #ffd70080); border: 2px solid #ffd700; border-radius: 10px; color: #ffd700; font-family: Orbitron; font-size: 0.9rem;';
        btnWrap.appendChild(maxBadge);
    } else {
        var needText = document.createElement('div');
        needText.textContent = '📦 还需 ' + (cost - count) + ' 张可升星';
        needText.style.cssText = 'padding: 10px 24px; background: rgba(100,100,100,0.2); border: 1px solid #555; border-radius: 10px; color: #888; font-family: Orbitron; font-size: 0.85rem;';
        btnWrap.appendChild(needText);
    }

    var btnClose = document.createElement('button');
    btnClose.textContent = '关闭';
    btnClose.style.cssText = 'padding: 10px 24px; background: rgba(255,255,255,0.1); border: 1px solid #444; border-radius: 10px; color: #aaa; font-family: Orbitron; font-size: 0.85rem; cursor: pointer;';
    btnClose.onclick = function() {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(function() { overlay.remove(); }, 300);
    };
    btnWrap.appendChild(btnClose);

    modalBox.appendChild(btnWrap);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);
}

function closeCardDetailModal() {
    var el = document.getElementById('cardDetailOverlay');
    if (el) { 
        el.style.animation = 'fadeOut 0.3s ease forwards'; 
        setTimeout(function() { el.remove(); }, 300); 
    }
}



// ═══════════════════════════════════════════════════════════════
//  暴露全局函数（最终修复版）
// ═══════════════════════════════════════════════════════════════

// 先定义/覆盖 closeCardAcquireModal，确保它在 IIFE 内部和 window 上都存在

function closeCardAcquireModal() {
    var el = document.getElementById('cardAcquireOverlay');
    if (el) { 
        el.style.animation = 'fadeOut 0.3s ease forwards'; 
        setTimeout(function() { el.remove(); }, 300); 
    }
}


// ═══════════════════════════════════════════════════════════════
//  升星确认弹窗（增强版 - 带星级能力对比）
// ═══════════════════════════════════════════════════════════════
function openUpgradeModal(cardId) {
    var cardInfo = playerCards[cardId];
    if (!cardInfo) return;

    // 从 DECK_CARDS 查找原始卡片数据
    var card = null;
    for (var dId in DECK_CARDS) {
        var deck = DECK_CARDS[dId];
        for (var i = 0; i < deck.length; i++) {
            if (deck[i].id === cardId) {
                card = deck[i];
                break;
            }
        }
        if (card) break;
    }
    if (!card) card = cardInfo.data;

    var currentStar = cardInfo.starLevel || 1;
    var nextStar = currentStar + 1;
    if (nextStar > 5) return;

    var type = card.cardType || CARD_TYPE_MAP[card.rarity] || 'normal';
    var cost = getUpgradeRequirement(type, currentStar);
    if (!cost || cardInfo.count < cost) {
        showToast('卡片数量不足，无法升星！', 'error');
        return;
    }

    var currentStyle = getCardStarStyle(card, currentStar);
    var nextStyle = getCardStarStyle(card, nextStar);

    var modal = document.createElement('div');
    modal.id = 'upgradeConfirmModal';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 3001; display: flex; align-items: center; justify-content: center; font-family: Orbitron;';

    // ========== 翻转卡片容器 ==========
    var flipWrap = document.createElement('div');
    flipWrap.style.cssText = 'width: 300px; height: 450px; perspective: 1200px; margin: 0 auto 20px; cursor: pointer; position: relative;';

    var flipInner = document.createElement('div');
    flipInner.style.cssText = 'position: relative; width: 100%; height: 100%; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d;';

    function createCardFace(style, star, isFront) {
        var starsStr = '★'.repeat(star) + '☆'.repeat(5 - star);
        var label = isFront ? '当前 ' + star + ' 星 · ' + style.typeName : '升星后 ' + star + ' 星 · ' + style.typeName;
        var hint = isFront ? '点击预览升星后' : '点击返回当前';

        var face = document.createElement('div');
        face.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; backface-visibility: hidden; border-radius: 16px; overflow: hidden; box-shadow: ' + style.shadow + '; border: ' + style.borderWidth + 'px solid ' + style.border + ';';
        if (!isFront) face.style.transform = 'rotateY(180deg)';

        var cardContainer = document.createElement('div');
        cardContainer.style.cssText = 'width: 100%; height: 100%; background: ' + style.bg + '; display: flex; flex-direction: column; position: relative;';

        var imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'height: 60%; background: #0a0a0f; position: relative; overflow: hidden;';

        var img = document.createElement('img');
        img.src = card.image;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: top center; transition: transform 0.4s ease;';
        img.onerror = function() {
            this.style.display = 'none';
            imgWrap.style.background = style.color + '20';
            var placeholder = document.createElement('div');
            placeholder.style.cssText = 'font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: ' + style.color + '; filter: drop-shadow(0 0 15px ' + style.color + ');';
            placeholder.textContent = '🎴';
            imgWrap.appendChild(placeholder);
        };
        img.onmouseover = function() { this.style.transform = 'scale(1.08)'; };
        img.onmouseout = function() { this.style.transform = 'none'; };
        imgWrap.appendChild(img);

        var gradient = document.createElement('div');
        gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, #0a0a0f 100%);';
        imgWrap.appendChild(gradient);

        var starBadge = document.createElement('div');
        starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid ' + style.color + '; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: ' + style.color + '; text-shadow: 0 0 8px ' + style.color + '; font-family: Orbitron;';
        starBadge.textContent = starsStr;
        imgWrap.appendChild(starBadge);

        var faceLabel = document.createElement('div');
        faceLabel.style.cssText = 'position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); border: 1px solid ' + style.color + '; border-radius: 6px; padding: 4px 8px; font-size: 0.7rem; color: ' + style.color + '; font-weight: bold;';
        faceLabel.textContent = isFront ? '【当前】' : '【升星后】';
        imgWrap.appendChild(faceLabel);

        cardContainer.appendChild(imgWrap);

        var infoWrap = document.createElement('div');
        infoWrap.style.cssText = 'flex: 1; padding: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center;';

        var nameEl = document.createElement('div');
        nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 8px; text-shadow: 0 0 10px ' + style.color + ';';
        nameEl.textContent = card.name;
        infoWrap.appendChild(nameEl);

        var typeEl = document.createElement('div');
        typeEl.style.cssText = 'font-size: 0.9rem; color: ' + style.color + '; font-weight: 700; margin-bottom: 10px; letter-spacing: 1px;';
        typeEl.textContent = label;
        infoWrap.appendChild(typeEl);

        var descEl = document.createElement('div');
        descEl.style.cssText = 'font-size: 0.75rem; color: #888; text-align: center; line-height: 1.5; margin-bottom: 12px;';
        descEl.textContent = card.desc;
        infoWrap.appendChild(descEl);

        if (star >= 3) {
            var particleWrap = document.createElement('div');
            particleWrap.style.cssText = 'position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 5;';
            var particles = ['✦', '★', '✪', '◆', '●'];
            for (var pi = 0; pi < star * 2; pi++) {
                var p = document.createElement('span');
                p.textContent = particles[Math.floor(Math.random() * particles.length)];
                p.style.cssText = 'position: absolute; left: ' + (10 + Math.random() * 80) + '%; top: ' + (10 + Math.random() * 80) + '%; font-size: ' + (0.5 + Math.random() * 0.8) + 'rem; color: ' + style.color + '; opacity: ' + (0.2 + Math.random() * 0.4) + '; animation: cardStarFloat ' + (2 + Math.random() * 3) + 's ease-in-out ' + (Math.random() * 2) + 's infinite; text-shadow: 0 0 8px ' + style.color + ';';
                particleWrap.appendChild(p);
            }
            face.appendChild(particleWrap);
        }

        if (star >= 5) {
            var flowLine1 = document.createElement('div');
            flowLine1.style.cssText = 'position: absolute; top: 0; left: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite; z-index: 6;';
            face.appendChild(flowLine1);
            
            var flowLine2 = document.createElement('div');
            flowLine2.style.cssText = 'position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite reverse; z-index: 6;';
            face.appendChild(flowLine2);
        }

        var hintEl = document.createElement('div');
        hintEl.style.cssText = 'padding: 6px 16px; background: rgba(0,0,0,0.5); border: 1px solid ' + style.color + '; border-radius: 20px; font-size: 0.75rem; color: ' + style.color + '; margin-top: 8px;';
        hintEl.textContent = hint;
        infoWrap.appendChild(hintEl);

        cardContainer.appendChild(infoWrap);
        face.appendChild(cardContainer);

        return face;
    }

    var frontFace = createCardFace(currentStyle, currentStar, true);
    var backFace = createCardFace(nextStyle, nextStar, false);

    flipInner.appendChild(frontFace);
    flipInner.appendChild(backFace);
    flipWrap.appendChild(flipInner);

    var isFlipped = false;
    flipWrap.addEventListener('click', function(e) {
        e.stopPropagation();
        isFlipped = !isFlipped;
        flipInner.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    });

    var contentDiv = document.createElement('div');
    contentDiv.style.textAlign = 'center';

    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-size: 1.4rem; color: var(--orokin-cyan); margin-bottom: 15px; text-shadow: 0 0 15px rgba(0,255,255,0.3);';
    titleEl.textContent = '✨ 星级进化';
    contentDiv.appendChild(titleEl);

    contentDiv.appendChild(flipWrap);

    var hintText = document.createElement('div');
    hintText.style.cssText = 'color: #666; font-size: 0.8rem; margin-bottom: 20px;';
    hintText.textContent = '👆 点击翻转查看升星效果';
    contentDiv.appendChild(hintText);

    // ========== 按钮区域 ==========
    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display: flex; gap: 15px; justify-content: center;';

    var btnCancel = document.createElement('button');
    btnCancel.textContent = '取消';
    btnCancel.style.cssText = 'padding: 10px 24px; background: rgba(255,255,255,0.08); border: 1px solid #444; border-radius: 8px; color: #aaa; font-family: Orbitron; font-size: 0.8rem; cursor: pointer; transition: all 0.3s;';
    btnCancel.onmouseover = function() { this.style.background = 'rgba(255,255,255,0.15)'; };
    btnCancel.onmouseout = function() { this.style.background = 'rgba(255,255,255,0.08)'; };
    btnCancel.onclick = function() { modal.remove(); };

    // 【修改】升星按钮包含消耗信息
    var btnConfirm = document.createElement('button');
    btnConfirm.innerHTML = '✨ 消耗 ' + cost + ' 张';
    btnConfirm.style.cssText = 'padding: 10px 24px; background: linear-gradient(135deg, ' + currentStyle.color + '40, ' + currentStyle.color + '90); border: 2px solid ' + currentStyle.border + '; border-radius: 8px; color: #fff; font-family: Orbitron; font-size: 0.85rem; cursor: pointer; font-weight: 700; transition: all 0.3s; text-shadow: 0 0 8px ' + currentStyle.color + '80; box-shadow: 0 0 20px ' + currentStyle.color + '30; line-height: 1.4;';
    btnConfirm.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 30px ' + currentStyle.color + '60';
    };
    btnConfirm.onmouseout = function() {
        this.style.transform = 'none';
        this.style.boxShadow = '0 0 20px ' + currentStyle.color + '30';
    };
    btnConfirm.onclick = function() { performUpgrade(cardId, cost); };

    btnWrap.appendChild(btnCancel);
    btnWrap.appendChild(btnConfirm);
    contentDiv.appendChild(btnWrap);

    modal.appendChild(contentDiv);
    document.body.appendChild(modal);
}



function performUpgrade(cardId, cost) {
    var cardInfo = playerCards[cardId];
    if (!cardInfo) return;

    var currentStar = cardInfo.starLevel || 1;
    var nextStar = currentStar + 1;
    if (nextStar > 5) return;

    var type = cardInfo.data.cardType || CARD_TYPE_MAP[cardInfo.data.rarity] || 'normal';
    var required = getUpgradeRequirement(type, currentStar);
    
    if (cardInfo.count < required) {
        showToast('卡片数量不足！', 'error');
        return;
    }

    // 执行扣除和升星
    cardInfo.count -= required;
    cardInfo.starLevel = nextStar;
    savePlayerCards();

    // 关闭弹窗
    var modal = document.getElementById('upgradeConfirmModal');
    if (modal) modal.remove();
    closeCardDetailModal();

    // 提示成功
    var nextStyle = getCardStarStyle(cardInfo.data, nextStar);
    showToast(cardInfo.data.name + ' 成功升至 ' + nextStar + ' 星！进化至 ' + nextStyle.typeName, 3000);
    
    // 刷新图鉴
    if (codexViewState.level === 'cards') {
        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
    }
}


// 锁定 DECK_CARDS，防止被篡改
(function lockDeckCards() {
    var originalData = {};
    for (var deckId in DECK_CARDS) {
        originalData[deckId] = [];
        for (var i = 0; i < DECK_CARDS[deckId].length; i++) {
            originalData[deckId].push(DECK_CARDS[deckId][i].image);
        }
    }
    
    // 每秒检查一次是否被篡改
    setInterval(function() {
        for (var deckId in DECK_CARDS) {
            var deck = DECK_CARDS[deckId];
            for (var i = 0; i < deck.length; i++) {
                var card = deck[i];
                var orig = originalData[deckId][i];
                if (card.image !== orig) {
                    console.error('【篡改检测到】', card.id, '被从', orig, '改为', card.image);
                    console.trace(); // 打印调用栈，定位篡改代码位置
                    card.image = orig; // 自动修复
                }
            }
        }
    }, 1000);
})();

// 显式挂到 window 上
window.closeCardAcquireModal = closeCardAcquireModal;

// 其他函数暴露
window.showCardAcquireModal = showCardAcquireModal;
window.closeCardDetailModal = closeCardDetailModal;
window.showCardDetailModal = showCardDetailModal;

// 卡片库存
window.initPlayerCards = initPlayerCards;
window.addPlayerCard = addPlayerCard;
window.hasPlayerCard = hasPlayerCard;
window.getPlayerCardCount = getPlayerCardCount;
window.dropCardFromBattle = dropCardFromBattle;
window.tryDropCardFromDeck = tryDropCardFromDeck;
window.tryDropCardFromEnemy = tryDropCardFromEnemy;
// 图鉴渲染
window.renderCodexFactions = renderCodexFactions;
window.renderCodexBlocks = renderCodexBlocks;
window.renderCodexDecks = renderCodexDecks;
window.renderCodexCards = renderCodexCards;
window.enterCodexFaction = enterCodexFaction;
window.enterCodexBlock = enterCodexBlock;
window.enterCodexDeck = enterCodexDeck;
window.switchCodexTab = switchCodexTab;
window.updateCodexOverview = updateCodexOverview;
window.DECK_CARDS = DECK_CARDS;

// 进度计算
window.calculateTotalProgress = calculateTotalProgress;
window.calculateFactionProgress = calculateFactionProgress;
window.calculateBlockProgress = calculateBlockProgress;
window.calculateDeckProgress = calculateDeckProgress;
window.calculateDeckStarLevel = calculateDeckStarLevel;
window.calculateDeckVisualStarLevel = calculateDeckVisualStarLevel;
window.getDeckNextClaimableStar = getDeckNextClaimableStar;
window.canClaimDeckReward = canClaimDeckReward;
window.getDeckStarReward = getDeckStarReward;
window.getDeckStarUpgradeProgress = getDeckStarUpgradeProgress;
window.renderDeckStarDots = renderDeckStarDots;
window.showDeckClaimAnimation = showDeckClaimAnimation;
window.getClaimedDeckRewards = getClaimedDeckRewards;

// ═══════════════════════════════════════════════════════════════
function checkWarframeLevelRewards() {
    if (!gameData) return;
    var level = gameData.warframe_level || 1;
    // 统一使用 warframe_card_claims（和 grantWarframeLevelCards 共享同一份数据）
    var claims = getWarframeCardClaims();
    var warframeType = (gameData.activeWarframe || gameData.selectedWarframe || 'excalibur');
    if (!claims[warframeType]) claims[warframeType] = {};
    var claimed = claims[warframeType];
    var rewards = [30, 50, 70, 90, 100];
    var deck = (typeof DECK_CARDS !== 'undefined') ? DECK_CARDS['warframe_normal'] : [];
    if (!deck || deck.length === 0) return;
    var hasNew = false;
    for (var i = 0; i < rewards.length; i++) {
        var targetLv = rewards[i];
        if (level >= targetLv && !claimed[targetLv]) {
            claimed[targetLv] = new Date().toISOString();
            hasNew = true;
            var card = deck[Math.floor(Math.random() * deck.length)];
            if (typeof addPlayerCard === 'function') {
                var result = addPlayerCard(card);
                if (typeof showCardAcquireModal === 'function') {
                    setTimeout(function(c, r) {
                        return function() {
                            showCardAcquireModal(c, '战甲等级奖励 Lv.' + r);
                        };
                    }(card, targetLv), 500);
                }
            }
        }
    }
    if (hasNew) {
        saveWarframeCardClaims(claims);
        if (typeof saveGameData === 'function') saveGameData();
    }
}
window.checkWarframeLevelRewards = checkWarframeLevelRewards;

// 检查战甲等级奖励
setTimeout(function() {
    if (typeof checkWarframeLevelRewards === 'function') checkWarframeLevelRewards();
}, 2000);
