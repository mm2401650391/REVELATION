// ═══════════════════════════════════════════════════════════════
//  三级图鉴系统 - 卡片掉落与收集
// ═══════════════════════════════════════════════════════════════

// 图鉴层级结构：大条目(派系) -> 中条目(星球) -> 小条目(卡组) -> 卡片
var CODEX_STRUCTURE = {
    grineer: {
        name: 'Grineer',
        icon: '🔴',
        color: '#ff4444',
        image: 'GAME/Faction/Grineer.jpg',
        blocks: {
            huanyu: {
                name: '🌟寰宇🌟',
                icon: '',
                image: 'GAME/Faction/Grineer.jpg',
                desc: 'Grineer帝国的核心领地',
                decks: {
                    'e_zone1': { name: '☿️游掠凶形☿️', icon: '☿️', desc: '基础步兵与游掠单位' },
                    'e_zone2': { name: '☿交锋异士☿', icon: '☿', desc: '精英战斗单位' },
                    'e_zone3': { name: '☿暴戾战将☿', icon: '☿', desc: '重型突击单位' },
                    'e_zone4': { name: '☿畸变造物☿', icon: '☿', desc: '实验性生物武器' },
                    'e_zone5': { name: '☿长空掠影☿', icon: '☿', desc: '空中作战单位' },
                    'e_zone6': { name: '☿澜下械躯☿', icon: '☿', desc: '水下机械单位' },
                    'e_zone7': { name: '☿工坊役众☿', icon: '☿', desc: '工程与维护单位' },
                    'e_zone8': { name: '☿统御凶僚☿', icon: '☿', desc: '指挥与统治阶层' }
                }
            }
        }
    },
    corpus: { name: 'Corpus', icon: '🔵', color: '#4488ff', image: 'GAME/Faction/Corpus.jpg', blocks: {} },
    infested: { name: 'Infested', icon: '🟢', color: '#4eff4e', image: 'GAME/Faction/Infested.jpg', blocks: {} },
    sentient: { name: 'Sentient', icon: '🟣', color: '#ff66ff', image: 'GAME/Faction/Sentient.jpg', blocks: {} },
    orokin: { name: 'Orokin', icon: '👑', color: '#ffd700', image: 'GAME/Faction/Orokin.jpg', blocks: {} },
    // ========== 新增：矿物与采集卡包 ==========
    // ========== 新增：矿物与采集卡包 ==========
    mining: {
        name: '渊岩',
        icon: '👑',
        color: '#ffd700',
        image: 'GAME/items/1/c/Necrathene.jpg',
        blocks: {
            huanyu: { // 补全了缺失的中间层级 huanyu
                name: '🌟渊岩🌟',
                icon: '',
                image: 'GAME/items/1/c/Necrathene.jpg',
                desc: '蕴含宇宙能量的稀有矿物与结晶',
                decks: { 
                    'm_zone1': { name: '☿️晨潮矿坑☿️', icon: '☿️', desc: '基础矿物与伴生矿的采集点' },
                    'm_zone2': { name: '☿️冷却液与矿尘☿️', icon: '☿️', desc: '工业废料与特殊矿尘的回收点' },
                    'm_zone3': { name: '☿️Infested摇篮☿️', icon: '☿️', desc: '感染区深处的异化矿物' }
                }
            }
        }
    },
    gathering: {
        name: '繁生',
        icon: '👑',
        color: '#4eff4e',
        image: 'GAME/items/2/Neurodes.jpg',
        blocks: {
            huanyu: { 
                name: '️🌱繁生🌱️', // 建议把名字也改成'繁生'，保持风格统一
                icon: '️',
                image: 'GAME/items/2/Neurodes.jpg',
                desc: '',
                decks: {
                    'g_zone1': { 
                        name: '☿地核裂谷☿', 
                        icon: '☿️', 
                        desc: '' 
                    },
                    'g_zone2': { 
                        name: '☿异星生态☿', 
                        icon: '☿️', 
                        desc: '' 
                    }
                
                }
            }
        }
    }
    // 注意：这里不要加逗号，因为 CODEX_STRUCTURE 对象结束了
};

 



// 卡片数据 - 按小条目(deck)分组
// cardType 字段决定卡片视觉风格（覆盖 rarity 的默认映射）：
// normal=绿卡(普通步兵), elite=蓝卡(精英), boss=红卡(Boss), mechanic=金卡(机制), super=闪红卡(终极)
var DECK_CARDS = {
    // ═══════════════════════════════════════════════════════════════
    //  游掠凶形 - 基础步兵 → 绿卡(normal)
    // ═══════════════════════════════════════════════════════════════
    'e_zone1': [
        // 屠夫系列
        { id: 'c_ylxx_01', name: '屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer帝国最基础的步兵单位，装备简陋但数量庞大', faction: 'grineer' },
        { id: 'c_ylxx_02', name: '沙漠屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-1.jpg', cardType: 'normal', rarity: 1, desc: '适应沙漠环境的屠夫变体，耐热装甲使其能在高温地带作战', faction: 'grineer' },
        { id: 'c_ylxx_03', name: '前线屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-2.jpg', cardType: 'normal', rarity: 1, desc: '部署于战线前沿的屠夫，经历过更多实战磨练', faction: 'grineer' },
        { id: 'c_ylxx_04', name: '龙舰屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-3.jpg', cardType: 'normal', rarity: 2, desc: '龙舰舰队配备的屠夫，接受过零重力作战训练', faction: 'grineer' },
        { id: 'c_ylxx_05', name: '赤毒屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-4.jpg', cardType: 'normal', rarity: 2, desc: '被赤毒强化的屠夫，攻击欲望更加强烈', faction: 'grineer' },
        { id: 'c_ylxx_06', name: '巨牙屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落征召的屠夫，体格更为健壮', faction: 'grineer' },
        { id: 'c_ylxx_07', name: '深空屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-6.jpg', cardType: 'normal', rarity: 2, desc: '在深空哨站服役的屠夫，装备有简易维生系统', faction: 'grineer' },
        { id: 'c_ylxx_08', name: '回旋屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-7.jpg', cardType: 'normal', rarity: 2, desc: '机动性极强的屠夫变体，擅长快速突袭', faction: 'grineer' },
        { id: 'c_ylxx_09', name: '邃域屠夫', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-8.jpg', cardType: 'normal', rarity: 3, desc: '来自虚空边缘的屠夫，身上带有不明能量痕迹', faction: 'grineer' },
        
        // 烈焰刀客系列
        { id: 'c_ylxx_10', name: '烈焰刀客', image: 'GAME/enemies/Grineer/P1/a/2Flameblade.jpg', cardType: 'normal', rarity: 2, desc: '装备火焰喷射器的近战单位，擅长近距离焚烧敌人', faction: 'grineer' },
        { id: 'c_ylxx_11', name: '巨牙烈焰刀客', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-1.jpg', cardType: 'normal', rarity: 2, desc: '巨牙部落改装的烈焰刀客，火焰温度更高', faction: 'grineer' },
        { id: 'c_ylxx_12', name: '赤毒烈焰刀客', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-2.jpg', cardType: 'normal', rarity: 3, desc: '赤毒强化使火焰呈现诡异的深红色', faction: 'grineer' },
        { id: 'c_ylxx_13', name: '夜巡者烈焰刀客', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-3.jpg', cardType: 'normal', rarity: 3, desc: '夜巡部队的火焰专家，在黑暗中如明灯般醒目', faction: 'grineer' },
        { id: 'c_ylxx_14', name: '合一众烈焰刀客', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-4.jpg', cardType: 'normal', rarity: 4, desc: '被合一众思想控制的烈焰刀客，火焰中带有虚空能量', faction: 'grineer' },
        
        // 禁卫军
        { id: 'c_ylxx_15', name: '禁卫军', image: 'GAME/enemies/Grineer/P1/a/3GrineerProsecutor.jpg', cardType: 'normal', rarity: 2, desc: 'Grineer宫廷守卫，装备 ceremonial 护甲', faction: 'grineer' },
        
        // 重击手系列
        { id: 'c_ylxx_16', name: '重击手', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE.jpg', cardType: 'normal', rarity: 2, desc: '装备重型动力拳套的近战单位，一击可粉碎轻型装甲', faction: 'grineer' },
        { id: 'c_ylxx_17', name: '赤毒猛力爪兵', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-1.jpg', cardType: 'normal', rarity: 3, desc: '赤毒强化的重击手，拳套带有腐蚀性能量', faction: 'grineer' },
        { id: 'c_ylxx_18', name: '夜巡者猛力爪兵', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-2.jpg', cardType: 'normal', rarity: 3, desc: '夜巡部队的重击专家，擅长夜间突袭', faction: 'grineer' },
        { id: 'c_ylxx_19', name: '巨牙掠食者', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-3.jpg', cardType: 'normal', rarity: 2, desc: '巨牙部落的狩猎专家，追踪能力出众', faction: 'grineer' },
        { id: 'c_ylxx_20', name: '合一众重击手', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-4.jpg', cardType: 'normal', rarity: 4, desc: '被合一众改造的重击手，拳套中注入了虚空之力', faction: 'grineer' },
        
        // 天蝎系列
        { id: 'c_ylxx_21', name: '天蝎', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE.jpg', cardType: 'normal', rarity: 2, desc: '装备钩索枪的敏捷单位，可将敌人拉至近身', faction: 'grineer' },
        { id: 'c_ylxx_22', name: '龙舰天蝎', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-1.jpg', cardType: 'normal', rarity: 2, desc: '龙舰舰队的天蝎，钩索经过磁化改良', faction: 'grineer' },
        { id: 'c_ylxx_23', name: '赤毒天蝎', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-2.jpg', cardType: 'normal', rarity: 3, desc: '赤毒强化的天蝎，钩索带有毒性', faction: 'grineer' },
        { id: 'c_ylxx_24', name: '合一众天蝎', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-3.jpg', cardType: 'normal', rarity: 4, desc: '被合一众控制的天蝎，钩索可撕裂空间', faction: 'grineer' },
        
        // 盾枪兵系列
        { id: 'c_ylxx_25', name: '盾枪兵', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE.jpg', cardType: 'normal', rarity: 1, desc: '装备能量盾牌的防御型步兵，可有效抵挡正面攻击', faction: 'grineer' },
        { id: 'c_ylxx_26', name: '巨牙盾枪兵', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的盾兵，盾牌由野兽骨骼加固', faction: 'grineer' },
        { id: 'c_ylxx_27', name: '赤毒盾枪兵', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-2.jpg', cardType: 'normal', rarity: 2, desc: '赤毒强化的盾兵，盾牌可反弹部分伤害', faction: 'grineer' },
        { id: 'c_ylxx_28', name: '精英盾枪兵', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-3.jpg', cardType: 'elite', rarity: 3, desc: '经过特殊训练的盾兵精英，防御技巧炉火纯青', faction: 'grineer' },
        { id: 'c_ylxx_29', name: '合一众盾枪兵', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-4.jpg', cardType: 'normal', rarity: 4, desc: '合一众的盾墙卫士，盾牌上刻有虚空符文', faction: 'grineer' }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    //  交锋异士 - 精英战斗单位 → 蓝卡(elite)
    // ═══════════════════════════════════════════════════════════════
    'e_zone2': [
        // 弩炮系列
        { id: 'c_jfys_01', name: '弩炮', image: 'GAME/enemies/Grineer/P1/b/1Ballista.jpg', cardType: 'elite', rarity: 2, desc: '装备重型弩炮的远程精英，可在极远距离造成致命伤害', faction: 'grineer' },
        { id: 'c_jfys_02', name: '龙舰弩炮', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-1.jpg', cardType: 'elite', rarity: 2, desc: '龙舰舰队的弩炮手，弩箭可在真空中飞行', faction: 'grineer' },
        { id: 'c_jfys_03', name: '赤毒弩炮', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-2.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的弩炮，弩箭带有爆炸效果', faction: 'grineer' },
        { id: 'c_jfys_04', name: '巨牙弩炮', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-3.jpg', cardType: 'elite', rarity: 2, desc: '巨牙部落的狩猎弩炮，精准度极高', faction: 'grineer' },
        { id: 'c_jfys_05', name: '合一众弩炮', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-4.jpg', cardType: 'elite', rarity: 4, desc: '合一众的虚空弩炮，弩箭可穿透维度', faction: 'grineer' },
        
        // 爪喀系列
        { id: 'c_jfys_06', name: '爪喀', image: 'GAME/enemies/Grineer/P1/b/2GrnArm.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer驯化的凶猛野兽，成群出没时极具威胁', faction: 'grineer' },
        { id: 'c_jfys_07', name: '堕落爪喀', image: 'GAME/enemies/Grineer/P1/b/2GrnArm1-1.jpg', cardType: 'elite', rarity: 4, desc: '被虚空能量腐化的爪喀，身体发生诡异变异', faction: 'grineer' },
        
        // 开膛者系列
        { id: 'c_jfys_08', name: '开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter.jpg', cardType: 'elite', rarity: 2, desc: '装备链锯剑的残忍战士，以撕裂敌人肉体为乐', faction: 'grineer' },
        { id: 'c_jfys_09', name: '沙漠开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-1.jpg', cardType: 'elite', rarity: 2, desc: '沙漠地带的开膛者，链锯经过防沙处理', faction: 'grineer' },
        { id: 'c_jfys_10', name: '前线开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-2.jpg', cardType: 'elite', rarity: 2, desc: '战线前沿的开膛者，杀戮效率经过实战检验', faction: 'grineer' },
        { id: 'c_jfys_11', name: '龙舰开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-3.jpg', cardType: 'elite', rarity: 3, desc: '龙舰舰队的开膛者，链锯可在失重环境下使用', faction: 'grineer' },
        { id: 'c_jfys_12', name: '赤毒开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-4.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的开膛者，链锯带有腐蚀性能量', faction: 'grineer' },
        { id: 'c_jfys_13', name: '巨牙开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-5.jpg', cardType: 'elite', rarity: 2, desc: '巨牙部落的开膛者，链锯由野兽牙齿打造', faction: 'grineer' },
        { id: 'c_jfys_14', name: '深空开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-6.jpg', cardType: 'elite', rarity: 3, desc: '深空哨站的开膛者，装备有真空密封装甲', faction: 'grineer' },
        { id: 'c_jfys_15', name: '回旋开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-7.jpg', cardType: 'elite', rarity: 3, desc: '机动性极强的开膛者，可边移动边攻击', faction: 'grineer' },
        { id: 'c_jfys_16', name: '邃域开膛者', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-8.jpg', cardType: 'elite', rarity: 4, desc: '来自虚空边缘的开膛者，链锯可切割空间', faction: 'grineer' },
        
        // 恶徒系列
        { id: 'c_jfys_17', name: '恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE.jpg', cardType: 'elite', rarity: 2, desc: '装备火焰喷射器的精英单位，擅长区域控制', faction: 'grineer' },
        { id: 'c_jfys_18', name: '沙漠恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-1.jpg', cardType: 'elite', rarity: 2, desc: '沙漠地带的火焰专家，火焰温度可达数千度', faction: 'grineer' },
        { id: 'c_jfys_19', name: '前线恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-2.jpg', cardType: 'elite', rarity: 2, desc: '战线前沿的火焰支援，可有效封锁通道', faction: 'grineer' },
        { id: 'c_jfys_20', name: '龙舰恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-3.jpg', cardType: 'elite', rarity: 3, desc: '龙舰舰队的火焰兵，喷射器使用特殊燃料', faction: 'grineer' },
        { id: 'c_jfys_21', name: '赤毒恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-4.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的恶徒，火焰呈现深红色', faction: 'grineer' },
        { id: 'c_jfys_22', name: '巨牙恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-5.jpg', cardType: 'elite', rarity: 2, desc: '巨牙部落的火焰萨满，火焰中带有部落符文', faction: 'grineer' },
        { id: 'c_jfys_23', name: '合一众恶徒', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-6.jpg', cardType: 'elite', rarity: 4, desc: '合一众的虚空火焰使者，火焰可燃烧灵魂', faction: 'grineer' },
        
        // 鬣猫系列
        { id: 'c_jfys_24', name: '鬣猫', image: 'GAME/enemies/Grineer/P1/b/5Combat.jpg', cardType: 'normal', rarity: 2, desc: 'Grineer驯化的另一种野兽，比爪喀更加狡猾', faction: 'grineer' },
        { id: 'c_jfys_25', name: '赤毒鬣猫', image: 'GAME/enemies/Grineer/P1/b/5Combat1-1.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的鬣猫，速度和攻击性大幅提升', faction: 'grineer' },
        
        // 枪兵系列
        { id: 'c_jfys_26', name: '枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE.jpg', cardType: 'normal', rarity: 1, desc: 'Grineer最基础的远程单位，装备制式步枪', faction: 'grineer' },
        { id: 'c_jfys_27', name: '沙漠枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-1.jpg', cardType: 'normal', rarity: 1, desc: '沙漠地带的枪兵，步枪经过防沙改装', faction: 'grineer' },
        { id: 'c_jfys_28', name: '前线枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-2.jpg', cardType: 'normal', rarity: 1, desc: '战线前沿的枪兵，射击精度更高', faction: 'grineer' },
        { id: 'c_jfys_29', name: '龙舰枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-3.jpg', cardType: 'normal', rarity: 2, desc: '龙舰舰队的枪兵，步枪可在真空环境使用', faction: 'grineer' },
        { id: 'c_jfys_30', name: '赤毒枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-4.jpg', cardType: 'normal', rarity: 2, desc: '赤毒强化的枪兵，子弹带有腐蚀效果', faction: 'grineer' },
        { id: 'c_jfys_31', name: '巨牙枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-5.jpg', cardType: 'normal', rarity: 1, desc: '巨牙部落的枪兵，使用部落特制弹药', faction: 'grineer' },
        { id: 'c_jfys_32', name: '夜巡者枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-6.jpg', cardType: 'normal', rarity: 2, desc: '夜巡部队的枪兵，装备夜视瞄准镜', faction: 'grineer' },
        { id: 'c_jfys_33', name: '合一众枪兵', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-7.jpg', cardType: 'normal', rarity: 3, desc: '合一众的虚空枪兵，子弹可穿透护盾', faction: 'grineer' },
        { id: 'c_jfys_34', name: '枪兵幸存者', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-8.jpg', cardType: 'elite', rarity: 4, desc: '从无数次战斗中幸存的枪兵，战斗直觉极其敏锐', faction: 'grineer' },
        
        // 怒焚者系列
        { id: 'c_jfys_35', name: '怒焚者', image: 'GAME/enemies/Grineer/P1/b/7FlameL.jpg', cardType: 'elite', rarity: 3, desc: '极度狂暴的火焰战士，全身缠绕着永不熄灭的烈焰', faction: 'grineer' },
        { id: 'c_jfys_36', name: '赤毒怒焚者', image: 'GAME/enemies/Grineer/P1/b/7FlameL1-1.jpg', cardType: 'elite', rarity: 3, desc: '赤毒与火焰融合的产物，触碰即被焚烧殆尽', faction: 'grineer' },
        { id: 'c_jfys_37', name: '合一众怒焚者', image: 'GAME/enemies/Grineer/P1/b/7FlameL1-2.jpg', cardType: 'elite', rarity: 4, desc: '合一众的终极火焰兵器，火焰中蕴含虚空毁灭之力', faction: 'grineer' },
        
        // 追踪者系列
        { id: 'c_jfys_38', name: '追踪者', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE.jpg', cardType: 'normal', rarity: 2, desc: '装备追踪弹药的精英射手，擅长锁定移动目标', faction: 'grineer' },
        { id: 'c_jfys_39', name: '沙漠追踪者', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-1.jpg', cardType: 'normal', rarity: 2, desc: '沙漠地带的追踪专家，可在沙尘暴中精准射击', faction: 'grineer' },
        { id: 'c_jfys_40', name: '前线追踪者', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-2.jpg', cardType: 'normal', rarity: 2, desc: '战线前沿的追踪射手，负责清除高价值目标', faction: 'grineer' },
        { id: 'c_jfys_41', name: '龙舰追踪者', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-3.jpg', cardType: 'normal', rarity: 3, desc: '龙舰舰队的追踪者，弹药可在太空中追踪目标', faction: 'grineer' },
        { id: 'c_jfys_42', name: '赤毒者追踪兵', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-4.jpg', cardType: 'normal', rarity: 3, desc: '赤毒强化的追踪者，弹药带有追踪孢子', faction: 'grineer' },
        { id: 'c_jfys_43', name: '巨牙追踪者', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-5.jpg', cardType: 'normal', rarity: 2, desc: '巨牙部落的追踪猎手，使用野兽骨骼制作的追踪箭', faction: 'grineer' },
        { id: 'c_jfys_44', name: '夜巡者追踪兵', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-6.jpg', cardType: 'normal', rarity: 3, desc: '夜巡部队的追踪专家，可在完全黑暗中锁定目标', faction: 'grineer' },
        
        // 骑兵系列
        { id: 'c_jfys_45', name: '骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun.jpg', cardType: 'elite', rarity: 2, desc: '装备喷气背包的空中单位，可从空中发动突袭', faction: 'grineer' },
        { id: 'c_jfys_46', name: '沙漠骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-1.jpg', cardType: 'elite', rarity: 2, desc: '沙漠地带的骑兵，喷气背包经过防沙改装', faction: 'grineer' },
        { id: 'c_jfys_47', name: '前线骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-2.jpg', cardType: 'elite', rarity: 2, desc: '战线前沿的骑兵，负责快速支援和包抄', faction: 'grineer' },
        { id: 'c_jfys_48', name: '龙舰骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-3.jpg', cardType: 'elite', rarity: 3, desc: '龙舰舰队的骑兵，可在零重力环境中自由飞行', faction: 'grineer' },
        { id: 'c_jfys_49', name: '赤毒骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-4.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的骑兵，飞行轨迹带有腐蚀性尾迹', faction: 'grineer' },
        { id: 'c_jfys_50', name: '巨牙骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-5.jpg', cardType: 'elite', rarity: 2, desc: '巨牙部落的空中猎手，使用野兽皮革制作的飞行翼', faction: 'grineer' },
        { id: 'c_jfys_51', name: '合一众骑兵', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-6.jpg', cardType: 'elite', rarity: 4, desc: '合一众的虚空骑兵，飞行时可短暂穿越维度', faction: 'grineer' },
        { id: 'c_jfys_52', name: '骑兵幸存者', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-7.jpg', cardType: 'elite', rarity: 4, desc: '从无数次空战中幸存的骑兵，飞行技巧出神入化', faction: 'grineer' }
    ],
    
    // ═══════════════════════════════════════════════════════════════
    //  暴戾战将 - 重型/Boss单位 → 红卡(boss) / 金卡(mechanic)
    // ═══════════════════════════════════════════════════════════════
    'e_zone3': [
        // 执法员系列
        { id: 'c_blzj_01', name: '执法员', image: 'GAME/enemies/Grineer/P1/c/1Crusher.jpg', cardType: 'boss', rarity: 3, desc: 'Grineer的执法精英，装备重型护甲和能量武器', faction: 'grineer' },
        { id: 'c_blzj_02', name: '巨牙掠夺者', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-1.jpg', cardType: 'super', rarity: 3, desc: '巨牙部落的掠夺专家，擅长搜刮和破坏', faction: 'grineer' },
        { id: 'c_blzj_03', name: '夜巡执法员', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-2.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的执法者，在黑暗中如同死神', faction: 'grineer' },
        { id: 'c_blzj_04', name: '夜巡掠夺者', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-3.jpg', cardType: 'boss', rarity: 4, desc: '夜巡部队的掠夺精英，从不留下活口', faction: 'grineer' },
        { id: 'c_blzj_05', name: '爆破型执法员', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-4.jpg', cardType: 'mechanic', rarity: 4, desc: '装备自爆装置的执法员，死亡时引发大规模爆炸', faction: 'grineer' },
        
        // 轰击者系列
        { id: 'c_blzj_06', name: '轰击者', image: 'GAME/enemies/Grineer/P1/c/2BombardDE.jpg', cardType: 'boss', rarity: 3, desc: '装备重型火箭发射器的毁灭者，一击可摧毁整片区域', faction: 'grineer' },
        { id: 'c_blzj_07', name: '赤毒轰击者', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-1.jpg', cardType: 'boss', rarity: 3, desc: '赤毒强化的轰击者，火箭弹带有腐蚀云雾', faction: 'grineer' },
        { id: 'c_blzj_08', name: '巨牙轰击者', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-2.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的重型炮兵，使用部落特制炸药', faction: 'grineer' },
        { id: 'c_blzj_09', name: '巨牙迫击炮轰击者', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-3.jpg', cardType: 'boss', rarity: 4, desc: '装备迫击炮的轰击者，可进行超远程曲射打击', faction: 'grineer' },
        { id: 'c_blzj_10', name: '夜巡者机枪手', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-4.jpg', cardType: 'boss', rarity: 3, desc: '夜巡部队的重型机枪手，火力压制能力极强', faction: 'grineer' },
        { id: 'c_blzj_11', name: '合一众轰击者', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-5.jpg', cardType: 'boss', rarity: 4, desc: '合一众的虚空炮兵，火箭弹可撕裂空间', faction: 'grineer' },
        
        // 指挥官
        { id: 'c_blzj_12', name: '指挥官', image: 'GAME/enemies/Grineer/P1/c/3GrineerMariner.jpg', cardType: 'elite', rarity: 3, desc: 'Grineer部队的战术指挥官，可呼叫增援和空袭', faction: 'grineer' },
        
        // 爪喀驯兽师系列
        { id: 'c_blzj_13', name: '爪喀驯兽师', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster.jpg', cardType: 'elite', rarity: 3, desc: '精通爪喀驯化的大师，可同时指挥多只爪喀作战', faction: 'grineer' },
        { id: 'c_blzj_14', name: '赤毒爪喀驯兽师', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster1-1.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的驯兽师，爪喀群更加狂暴难以控制', faction: 'grineer' },
        { id: 'c_blzj_15', name: '堕落爪喀驯兽师', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster1-2.jpg', cardType: 'elite', rarity: 4, desc: '被虚空腐化的驯兽师，指挥着变异的虚空爪喀', faction: 'grineer' },
        
        // 重型机枪手系列
        { id: 'c_blzj_16', name: '重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE.jpg', cardType: 'boss', rarity: 3, desc: '装备转轮机枪的重型单位，可持续输出毁灭性火力', faction: 'grineer' },
        { id: 'c_blzj_17', name: '沙漠重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-1.jpg', cardType: 'boss', rarity: 3, desc: '沙漠地带的重型机枪手，机枪经过防沙冷却改装', faction: 'grineer' },
        { id: 'c_blzj_18', name: '前线重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-2.jpg', cardType: 'boss', rarity: 3, desc: '战线前沿的重型火力点，可有效封锁整条通道', faction: 'grineer' },
        { id: 'c_blzj_19', name: '龙舰重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-3.jpg', cardType: 'boss', rarity: 4, desc: '龙舰舰队的重型机枪手，机枪可在真空环境持续射击', faction: 'grineer' },
        { id: 'c_blzj_20', name: '赤毒重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-4.jpg', cardType: 'boss', rarity: 4, desc: '赤毒强化的重型机枪手，子弹带有腐蚀和燃烧双重效果', faction: 'grineer' },
        { id: 'c_blzj_21', name: '巨牙重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-5.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的重型战士，机枪由野兽骨骼加固', faction: 'grineer' },
        { id: 'c_blzj_22', name: '爆破型重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-6.jpg', cardType: 'mechanic', rarity: 4, desc: '装备自爆核心的重型机枪手，死亡时引发连锁爆炸', faction: 'grineer' },
        { id: 'c_blzj_23', name: '合一众重型机枪手', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-7.jpg', cardType: 'boss', rarity: 4, desc: '合一众的虚空重型战士，机枪可发射虚空能量弹', faction: 'grineer' },
        
        // 鬣猫驯兽师系列
        { id: 'c_blzj_24', name: '鬣猫驯兽师', image: 'GAME/enemies/Grineer/P1/c/6CatMaster.jpg', cardType: 'elite', rarity: 3, desc: '精通鬣猫驯化的大师，可同时指挥多只鬣猫作战', faction: 'grineer' },
        { id: 'c_blzj_25', name: '赤毒鬣猫驯兽师', image: 'GAME/enemies/Grineer/P1/c/6CatMaster1-1.jpg', cardType: 'elite', rarity: 3, desc: '赤毒强化的驯兽师，鬣猫群更加狡猾致命', faction: 'grineer' },
        { id: 'c_blzj_26', name: '夜巡者鬣猫驯兽师', image: 'GAME/enemies/Grineer/P1/c/6CatMaster1-2.jpg', cardType: 'elite', rarity: 3, desc: '夜巡部队的驯兽师，鬣猫可在黑暗中完美隐匿', faction: 'grineer' },
        
        // 狂躁者系列
        { id: 'c_blzj_27', name: '狂躁者', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic.jpg', cardType: 'elite', rarity: 3, desc: '极度狂暴的近战精英，攻击速度极快且无法被控制', faction: 'grineer' },
        { id: 'c_blzj_28', name: '龙舰狂躁者', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic1-1.jpg', cardType: 'boss', rarity: 4, desc: '龙舰舰队的狂躁者，在零重力环境中更加致命', faction: 'grineer' },
        { id: 'c_blzj_29', name: '夜巡狂躁者', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic1-2.jpg', cardType: 'boss', rarity: 4, desc: '夜巡部队的狂躁精英，黑暗中如同鬼魅般难以捕捉', faction: 'grineer' },
        
        // 火焰轰击者系列
        { id: 'c_blzj_30', name: '火焰轰击者', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar.jpg', cardType: 'boss', rarity: 3, desc: '装备火焰喷射器的重型单位，可持续焚烧大片区域', faction: 'grineer' },
        { id: 'c_blzj_31', name: '赤毒火焰轰击者', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-1.jpg', cardType: 'boss', rarity: 4, desc: '赤毒与火焰融合的重型兵器，焚烧一切生灵', faction: 'grineer' },
        { id: 'c_blzj_32', name: '巨牙火焰轰击者', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-2.jpg', cardType: 'boss', rarity: 3, desc: '巨牙部落的火焰重型战士，使用部落圣火', faction: 'grineer' },
        { id: 'c_blzj_33', name: '合一众火焰轰击者', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-3.jpg', cardType: 'boss', rarity: 4, desc: '合一众的虚空火焰兵器，火焰可燃烧灵魂', faction: 'grineer' },
        
        // 毒化者系列
        { id: 'c_blzj_34', name: '毒化者', image: 'GAME/enemies/Grineer/P1/c/9NoxTemp.jpg', cardType: 'boss', rarity: 4, desc: '释放剧毒云雾的重型单位，触碰即中剧毒', faction: 'grineer' },
        { id: 'c_blzj_35', name: '爆破型毒化者', image: 'GAME/enemies/Grineer/P1/c/9NoxTemp1-1.jpg', cardType: 'mechanic', rarity: 4, desc: '死亡时释放剧毒爆炸的恐怖存在，毒雾可持续数分钟', faction: 'grineer' }
    ],
	
    // ========== 新增：矿物与采集卡片数据 ==========
'm_zone1': [ // 晨潮矿坑 - 基础矿物
    { id: 'm_iron', name: '炎晶', image: 'GAME/items/1/a/Pyrol.jpg', cardType: 'normal', rarity: 1, desc: '夜灵平原最常见的基础矿物，炎晶是入门级锻造材料。', faction: 'mining' },
    { id: 'm_copper', name: '亚铜', image: 'GAME/items/1/a/Coprun.jpg', cardType: 'normal', rarity: 1, desc: '导电性良好的常见矿物，亚铜是电子元件的基础材料。', faction: 'mining' },
    { id: 'm_silver', name: '铁岩', image: 'GAME/items/1/a/Ferros.jpg', cardType: 'normal', rarity: 2, desc: '较为坚固的常见矿物，铁岩用于制造中级合金。', faction: 'mining' },
    { id: 'm_gold', name: '金辉', image: 'GAME/items/1/a/Auron.jpg', cardType: 'elite', rarity: 3, desc: '稀有的贵金属矿物，金辉是财富和高级工艺的象征。', faction: 'mining' },
    { id: 'm_orokin', name: '石青', image: 'GAME/items/1/a/Azurite.jpg', cardType: 'boss', rarity: 4, desc: '需要完美采集才能获得的传说矿物，石青蕴含神秘能量。', faction: 'mining' },
    { id: 'm_orokin2', name: '兄弟之石', image: 'GAME/items/1/a/Devar.jpg', cardType: 'boss', rarity: 4, desc: '稀有的双生矿物，兄弟之石在特定矿脉中才能发现。', faction: 'mining' },
    { id: 'm_orokin3', name: '翠萤石', image: 'GAME/items/1/a/Veridos.jpg', cardType: 'boss', rarity: 4, desc: '散发着翠绿光芒的稀有宝石，翠萤石是高级装饰品的原料。', faction: 'mining' },
    { id: 'm_orokin4', name: '绯红石', image: 'GAME/items/1/a/Crimzian.jpg', cardType: 'boss', rarity: 4, desc: '血红色的稀有宝石，绯红石蕴含着炽热的能量。', faction: 'mining' },
    { id: 'm_orokin5', name: '心智晶核', image: 'GAME/items/1/a/Sentrium.jpg', cardType: 'mechanic', rarity: 4, desc: '极其稀有的心智系矿物，心智晶核与 Sentient 技术有关。', faction: 'mining' },
    { id: 'm_orokin6', name: '灵息石', image: 'GAME/items/1/a/Nyth.jpg', cardType: 'mechanic', rarity: 4, desc: '传说中的灵息石，仅在最完美的矿脉中才能发现。', faction: 'mining' },
],

'm_zone2': [ // 冷却液与矿尘 - 工业废料
    { id: 'm_iron1', name: '酸化矿物', image: 'GAME/items/1/b/Axidite.jpg', cardType: 'normal', rarity: 1, desc: '奥布山谷中常见的基础矿物，酸化矿物是工业废料回收的产物。', faction: 'mining' },
    { id: 'm_copper2', name: '铁镍矿', image: 'GAME/items/1/b/Travoride.jpg', cardType: 'normal', rarity: 1, desc: '含有大量铁镍成分的常见矿物，铁镍矿是基础合金原料。', faction: 'mining' },
    { id: 'm_silver2', name: '启明矿石', image: 'GAME/items/1/b/Venerol.jpg', cardType: 'normal', rarity: 2, desc: '在寒冷地带发现的不常见矿物，启明矿石有微弱的荧光。', faction: 'mining' },
    { id: 'm_gold2', name: '长庚矿石', image: 'GAME/items/1/b/Hesperon.jpg', cardType: 'elite', rarity: 3, desc: '稀有的贵金属矿石，长庚矿石在极端环境下形成。', faction: 'mining' },
    { id: 'm_orokin2_b', name: '翡斯敏石', image: 'GAME/items/1/b/Phasmin.jpg', cardType: 'boss', rarity: 4, desc: '散发着翡翠光芒的稀有宝石，翡斯敏石极为珍贵。', faction: 'mining' },
    { id: 'm_orokin3_b', name: '夜石', image: 'GAME/items/1/b/Noctrul.jpg', cardType: 'boss', rarity: 4, desc: '在黑暗中发光的神秘宝石，夜石仅在特定时间出现。', faction: 'mining' },
    { id: 'm_orokin4_b', name: '填充细石', image: 'GAME/items/1/b/Goblite.jpg', cardType: 'boss', rarity: 4, desc: '内部充满液态矿物的稀有宝石，填充细石是高级工艺材料。', faction: 'mining' },
    { id: 'm_orokin5_b', name: '紫苋石', image: 'GAME/items/1/b/Amarast.jpg', cardType: 'boss', rarity: 4, desc: '深紫色的稀有宝石，紫苋石在贵族中极受欢迎。', faction: 'mining' },
    { id: 'm_orokin6_b', name: '黄道宝石', image: 'GAME/items/1/b/Zodian.jpg', cardType: 'mechanic', rarity: 4, desc: '与黄道十二宫相关的传说宝石，黄道宝石蕴含星辰之力。', faction: 'mining' },
    { id: 'm_orokin7', name: '赤色水晶', image: 'GAME/items/1/b/Thyst.jpg', cardType: 'mechanic', rarity: 4, desc: '血红色的传说水晶，赤色水晶是顶级装备的关键材料。', faction: 'mining' },
],

'm_zone3': [ // Infested摇篮 - 异化矿物
    { id: 'm_iron3', name: '阿拉德玛金属', image: 'GAME/items/1/c/Adramalium.jpg', cardType: 'normal', rarity: 1, desc: '魔胎之境中最常见的基础矿物，阿拉德玛金属被 Infested 侵蚀。', faction: 'mining' },
    { id: 'm_copper3', name: '巴弗结晶', image: 'GAME/items/1/c/Bapholite.jpg', cardType: 'normal', rarity: 1, desc: '被 Infested 感染的常见结晶，巴弗结晶有生物活性。', faction: 'mining' },
    { id: 'm_silver3', name: '纳莫原石', image: 'GAME/items/1/c/Namalon.jpg', cardType: 'normal', rarity: 2, desc: '较为稀有的异化矿物，纳莫原石在深层矿脉中发现。', faction: 'mining' },
    { id: 'm_gold3', name: '萨莫感染石', image: 'GAME/items/1/c/Thaumica.jpg', cardType: 'elite', rarity: 3, desc: '高度感染的稀有矿物，萨莫感染石蕴含危险能量。', faction: 'mining' },
    { id: 'm_orokin3_c', name: '达戈琥珀', image: 'GAME/items/1/c/Dagonic.jpg', cardType: 'boss', rarity: 4, desc: '远古达戈文明的琥珀化石，达戈琥珀是考古级珍品。', faction: 'mining' },
    { id: 'm_orokin4_c', name: '提亚美凝石', image: 'GAME/items/1/c/Tiametrite.jpg', cardType: 'boss', rarity: 4, desc: '以古神提亚美命名的稀有宝石，提亚美凝石蕴含混沌之力。', faction: 'mining' },
    { id: 'm_orokin5_c', name: '聚合荧石', image: 'GAME/items/1/c/Heciphron.jpg', cardType: 'boss', rarity: 4, desc: '多种矿物聚合而成的荧光宝石，聚合荧石极为罕见。', faction: 'mining' },
    { id: 'm_orokin6_c', name: '栓子凝石', image: 'GAME/items/1/c/Embolos.jpg', cardType: 'boss', rarity: 4, desc: '形状如血栓的诡异宝石，栓子凝石在 Infested 核心附近形成。', faction: 'mining' },
    { id: 'm_orokin7_b', name: '异源石', image: 'GAME/items/1/c/Xenorhast.jpg', cardType: 'mechanic', rarity: 4, desc: '来自异次元的传说宝石，异源石的存在违反物理法则。', faction: 'mining' },
    { id: 'm_orokin8', name: '殁世烯', image: 'GAME/items/1/c/Necrathene.jpg', cardType: 'mechanic', rarity: 4, desc: '殁世机甲的核心材料，殁世烯是魔胎之境最珍贵的矿物。', faction: 'mining' },
],
    
'g_zone1': [ // 地球丛林 - 热带雨林
    { id: 'g_alloy_barrel', name: '合金板', image: 'GAME/items/2/AlloyPlate1.jpg', cardType: 'normal', rarity: 1, desc: '地球丛林中常见的工业容器，从中可提取合金板用于战甲制造。', faction: 'gathering' },
    { id: 'g_argon_pegmatite', name: '氩结晶', image: 'GAME/items/2/Crystal1.jpg', cardType: 'elite', rarity: 3, desc: '蕴含氩气的稀有晶体矿脉，是氩结晶的天然来源。', faction: 'gathering' },
    { id: 'g_circuit_container', name: '电路', image: 'GAME/items/2/Circuits1.jpg', cardType: 'normal', rarity: 2, desc: '储存着大量电路元件的密封容器，电路是 Corpus 科技的基础。', faction: 'gathering' },
    { id: 'g_control_box_1', name: '控制模块', image: 'GAME/items/2/Contdule1.jpg', cardType: 'elite', rarity: 3, desc: '高级机器人控制模块的存储单元，内含珍贵的控制模块。', faction: 'gathering' },
    { id: 'g_sediment_1', name: '铁氧体', image: 'GAME/items/2/Ferrite1.jpg', cardType: 'normal', rarity: 1, desc: '地球丛林地表常见的铁矿沉积，可提炼铁氧体用于基础制造。', faction: 'gathering' },
    { id: 'g_sediment_2', name: '镓', image: 'GAME/items/2/Gallium1.jpg', cardType: 'elite', rarity: 3, desc: '稀有的镓元素沉积矿，镓是高级合金的关键材料。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer', name: '非晶态合金', image: 'GAME/items/2/Morphics1.jpg', cardType: 'elite', rarity: 3, desc: '维持非晶态合金稳定性的特殊装置，非晶态合金极其珍贵。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer1', name: '奥席金属', image: 'GAME/items/2/1Oxium.jpg', cardType: 'boss', rarity: 4, desc: '仅能在 Archwing 任务中获取的稀有金属，奥席金属是高级航天的关键材料。', faction: 'gathering' },
    { id: 'g_amorphous_stabilizer2', name: '永冻晶矿', image: 'GAME/items/2/2Cryotic.jpg', cardType: 'normal', rarity: 2, desc: '在挖掘任务中可大量获取的冷冻晶体，永冻晶矿是温控设备的原料。', faction: 'gathering' },
],

'g_zone2': [ // 金星花园 - 温室花房
    { id: 'g_sediment_3', name: '纳米孢子', image: 'GAME/items/2/Spores1.jpg', cardType: 'normal', rarity: 1, desc: '金星温室中培育的活性孢子培养皿，纳米孢子是生物研究的基础材料。', faction: 'gathering' },
    { id: 'g_storage_box_2', name: '神经传感器', image: 'GAME/items/2/tensor1.jpg', cardType: 'elite', rarity: 3, desc: '精密的神经传感器阵列，神经传感器用于高科技装备制造。', faction: 'gathering' },
    { id: 'g_sediment_4', name: '神经元', image: 'GAME/items/2/Neurodes1.jpg', cardType: 'elite', rarity: 3, desc: '浓缩的神经组织团块，可提取神经元用于生物工程。', faction: 'gathering' },
    { id: 'g_storage_box_3', name: '奥罗金电池', image: 'GAME/items/2/OrokinCel1.jpg', cardType: 'elite', rarity: 3, desc: '储存奥罗金能量的电池组，奥罗金电池是稀有能源材料。', faction: 'gathering' },
    { id: 'g_sediment_5', name: '生物质', image: 'GAME/items/2/Plainer1.jpg', cardType: 'normal', rarity: 1, desc: '金星生物的外壳残骸，生物质是生物材料的重要来源。', faction: 'gathering' },
    { id: 'g_storage_box_4', name: '聚合物束', image: 'GAME/items/2/Pomedle1.jpg', cardType: 'normal', rarity: 2, desc: '装满高分子聚合物的容器，聚合物束广泛应用于装备制造。', faction: 'gathering' },
    { id: 'g_sediment_6', name: '红化结晶', image: 'GAME/items/2/Rubedo1.jpg', cardType: 'normal', rarity: 1, desc: '含有红化结晶的矿物构造，红化结晶具有独特的光学特性。', faction: 'gathering' },
    { id: 'g_storage_box_5', name: '回收金属', image: 'GAME/items/2/Salvage1.jpg', cardType: 'normal', rarity: 1, desc: '压缩处理的废旧金属块，回收金属是资源回收再利用的产物。', faction: 'gathering' },
    { id: 'g_storage_box_6', name: '碲', image: 'GAME/items/2/3Tellurium.jpg', cardType: 'boss', rarity: 4, desc: '仅能在水下 Archwing 任务中获取的极稀有金属，碲是深海科技的必需品。', faction: 'gathering' },
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
    super:    { 1: 5,  2: 15, 3: 25, 4: 40 }     // 闪红卡
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
    // 遗落绿卡（基础单位）
    normal: {
        name: '遗落',
        color: '#4eff4e',
        glow: '0 0 10px rgba(78,255,78,0.3)',
        stars: {
            1: { 
                bg: 'linear-gradient(180deg, #1a2a1a 0%, #0a1a0a 100%)',
                border: '#4eff4e',
                borderWidth: 1,
                shadow: '0 0 5px rgba(78,255,78,0.2)',
                particle: '●',
                particleColor: '#4eff4e',
                desc: '低语'
            },
            2: { 
                bg: 'linear-gradient(180deg, #1a3a1a 0%, #0a2a0a 100%)',
                border: '#66ff66',
                borderWidth: 2,
                shadow: '0 0 10px rgba(78,255,78,0.3)',
                particle: '◆',
                particleColor: '#66ff66',
                desc: '呢喃'
            },
            3: { 
                bg: 'linear-gradient(180deg, #1a4a1a 0%, #0a3a0a 100%)',
                border: '#88ff88',
                borderWidth: 2,
                shadow: '0 0 15px rgba(78,255,78,0.4), inset 0 0 10px rgba(78,255,78,0.1)',
                particle: '★',
                particleColor: '#88ff88',
                desc: '窥视'
            },
            4: { 
                bg: 'linear-gradient(180deg, #2a5a2a 0%, #1a4a1a 100%)',
                border: '#aaffaa',
                borderWidth: 3,
                shadow: '0 0 20px rgba(78,255,78,0.5), inset 0 0 15px rgba(78,255,78,0.15)',
                particle: '✦',
                particleColor: '#aaffaa',
                desc: '凝视'
            },
            5: { 
                bg: 'linear-gradient(180deg, #3a6a3a 0%, #2a5a2a 100%)',
                border: '#ccffcc',
                borderWidth: 3,
                shadow: '0 0 30px rgba(78,255,78,0.6), inset 0 0 20px rgba(78,255,78,0.2)',
                particle: '✪',
                particleColor: '#ccffcc',
                desc: '⭐苏醒⭐'
            }
        }
    },
    // 异变蓝卡（精英单位）
    elite: {
        name: '异变',
        color: '#4488ff',
        glow: '0 0 15px rgba(68,136,255,0.4)',
        stars: {
            1: { 
                bg: 'linear-gradient(180deg, #1a1a3a 0%, #0a0a2a 100%)',
                border: '#4488ff',
                borderWidth: 1,
                shadow: '0 0 5px rgba(68,136,255,0.2)',
                particle: '●',
                particleColor: '#4488ff',
                desc: '畸变'
            },
            2: { 
                bg: 'linear-gradient(180deg, #1a2a4a 0%, #0a1a3a 100%)',
                border: '#6699ff',
                borderWidth: 2,
                shadow: '0 0 10px rgba(68,136,255,0.3)',
                particle: '◆',
                particleColor: '#6699ff',
                desc: '腐化'
            },
            3: { 
                bg: 'linear-gradient(180deg, #1a3a5a 0%, #0a2a4a 100%)',
                border: '#88bbff',
                borderWidth: 2,
                shadow: '0 0 15px rgba(68,136,255,0.4), inset 0 0 10px rgba(68,136,255,0.1)',
                particle: '★',
                particleColor: '#88bbff',
                desc: '侵蚀'
            },
            4: { 
                bg: 'linear-gradient(180deg, #2a4a6a 0%, #1a3a5a 100%)',
                border: '#aaddff',
                borderWidth: 3,
                shadow: '0 0 20px rgba(68,136,255,0.5), inset 0 0 15px rgba(68,136,255,0.15)',
                particle: '✦',
                particleColor: '#aaddff',
                desc: '同化'
            },
            5: { 
                bg: 'linear-gradient(180deg, #3a5a7a 0%, #2a4a6a 100%)',
                border: '#cceeff',
                borderWidth: 3,
                shadow: '0 0 30px rgba(68,136,255,0.6), inset 0 0 20px rgba(68,136,255,0.2)',
                particle: '✪',
                particleColor: '#cceeff',
                desc: '⭐降临⭐'
            }
        }
    },
    // 古神红卡（Boss单位）
    boss: {
        name: '古神',
        color: '#ff4444',
        glow: '0 0 20px rgba(255,68,68,0.5)',
        stars: {
            1: { 
                bg: 'linear-gradient(180deg, #3a1a1a 0%, #2a0a0a 100%)',
                border: '#ff4444',
                borderWidth: 1,
                shadow: '0 0 5px rgba(255,68,68,0.2)',
                particle: '●',
                particleColor: '#ff4444',
                desc: '深潜'
            },
            2: { 
                bg: 'linear-gradient(180deg, #4a1a1a 0%, #3a0a0a 100%)',
                border: '#ff6666',
                borderWidth: 2,
                shadow: '0 0 10px rgba(255,68,68,0.3)',
                particle: '◆',
                particleColor: '#ff6666',
                desc: '星之彩'
            },
            3: { 
                bg: 'linear-gradient(180deg, #5a1a1a 0%, #4a0a0a 100%)',
                border: '#ff8888',
                borderWidth: 2,
                shadow: '0 0 15px rgba(255,68,68,0.4), inset 0 0 10px rgba(255,68,68,0.1)',
                particle: '★',
                particleColor: '#ff8888',
                desc: '廷达罗斯'
            },
            4: { 
                bg: 'linear-gradient(180deg, #6a2a2a 0%, #5a1a1a 100%)',
                border: '#ffaaaa',
                borderWidth: 3,
                shadow: '0 0 20px rgba(255,68,68,0.5), inset 0 0 15px rgba(255,68,68,0.15)',
                particle: '✦',
                particleColor: '#ffaaaa',
                desc: '莎布'
            },
            5: { 
                bg: 'linear-gradient(180deg, #7a3a3a 0%, #6a2a2a 100%)',
                border: '#ffcccc',
                borderWidth: 3,
                shadow: '0 0 30px rgba(255,68,68,0.6), inset 0 0 20px rgba(255,68,68,0.2)',
                particle: '✪',
                particleColor: '#ffcccc',
                desc: '⭐克苏鲁⭐'
            }
        }
    },
    // 混沌金卡（机制Boss）
    mechanic: {
        name: '混沌',
        color: '#ffd700',
        glow: '0 0 25px rgba(255,215,0,0.6)',
        stars: {
            1: { 
                bg: 'linear-gradient(180deg, #3a3a1a 0%, #2a2a0a 100%)',
                border: '#ffd700',
                borderWidth: 1,
                shadow: '0 0 5px rgba(255,215,0,0.2)',
                particle: '●',
                particleColor: '#ffd700',
                desc: '奈亚'
            },
            2: { 
                bg: 'linear-gradient(180deg, #4a4a1a 0%, #3a3a0a 100%)',
                border: '#ffdd33',
                borderWidth: 2,
                shadow: '0 0 10px rgba(255,215,0,0.3)',
                particle: '◆',
                particleColor: '#ffdd33',
                desc: '犹格'
            },
            3: { 
                bg: 'linear-gradient(180deg, #5a5a1a 0%, #4a4a0a 100%)',
                border: '#ffee66',
                borderWidth: 2,
                shadow: '0 0 15px rgba(255,215,0,0.4), inset 0 0 10px rgba(255,215,0,0.1)',
                particle: '★',
                particleColor: '#ffee66',
                desc: '阿撒托斯'
            },
            4: { 
                bg: 'linear-gradient(180deg, #6a6a2a 0%, #5a5a1a 100%)',
                border: '#ffff99',
                borderWidth: 3,
                shadow: '0 0 20px rgba(255,215,0,0.5), inset 0 0 15px rgba(255,215,0,0.15)',
                particle: '✦',
                particleColor: '#ffff99',
                desc: '盲目'
            },
            5: { 
                bg: 'linear-gradient(180deg, #7a7a3a 0%, #6a6a2a 100%)',
                border: '#ffffcc',
                borderWidth: 3,
                shadow: '0 0 30px rgba(255,215,0,0.6), inset 0 0 20px rgba(255,215,0,0.2)',
                particle: '✪',
                particleColor: '#ffffcc',
                desc: '⭐原初混沌⭐'
            }
        }
    },
    // 终焉闪红卡（终极Boss）
    super: {
        name: '终焉',
        color: '#ff0000',
        glow: '0 0 30px rgba(255,0,0,0.8), 0 0 60px rgba(255,0,0,0.4)',
        stars: {
            1: { 
                bg: 'linear-gradient(180deg, #4a0a0a 0%, #3a0000 100%)',
                border: '#ff0000',
                borderWidth: 1,
                shadow: '0 0 8px rgba(255,0,0,0.3)',
                particle: '●',
                particleColor: '#ff0000',
                desc: '熵增'
            },
            2: { 
                bg: 'linear-gradient(180deg, #5a0a0a 0%, #4a0000 100%)',
                border: '#ff3333',
                borderWidth: 2,
                shadow: '0 0 15px rgba(255,0,0,0.4)',
                particle: '◆',
                particleColor: '#ff3333',
                desc: '热寂'
            },
            3: { 
                bg: 'linear-gradient(180deg, #6a0a0a 0%, #5a0000 100%)',
                border: '#ff6666',
                borderWidth: 2,
                shadow: '0 0 25px rgba(255,0,0,0.5), inset 0 0 15px rgba(255,0,0,0.15)',
                particle: '★',
                particleColor: '#ff6666',
                desc: '归零'
            },
            4: { 
                bg: 'linear-gradient(180deg, #7a1a1a 0%, #6a0a0a 100%)',
                border: '#ff9999',
                borderWidth: 3,
                shadow: '0 0 35px rgba(255,0,0,0.6), inset 0 0 20px rgba(255,0,0,0.2)',
                particle: '✦',
                particleColor: '#ff9999',
                desc: '虚无'
            },
            5: { 
                bg: 'linear-gradient(180deg, #8a2a2a 0%, #7a1a1a 100%)',
                border: '#ffcccc',
                borderWidth: 3,
                shadow: '0 0 50px rgba(255,0,0,0.8), inset 0 0 30px rgba(255,0,0,0.25)',
                particle: '✪',
                particleColor: '#ffcccc',
                desc: '⭐阿撒托斯之梦⭐'
            }
        }
    }
};

// 卡片类型映射（根据稀有度或自定义字段）
var CARD_TYPE_MAP = {
    1: 'normal',    // 普通 → 绿卡
    2: 'elite',     // 稀有 → 蓝卡
    3: 'boss',      // 史诗 → 红卡
    4: 'mechanic'   ,// 传说 → 金卡
	
    // 5星稀有度或特殊标记 → 超级Boss闪红卡
};






// ═══════════════════════════════════════════════════════════════
//  战斗保底计数器 - 按战斗次数累计
// ═══════════════════════════════════════════════════════════════

var _battlePityCounter = 0;  // 全局计数

function tryDropCardFromEnemy(codexId, chance) {
    if (!codexId) return null;
    
    var card = findCardById(codexId);
    if (!card) return null;
    
    // 使用传入的掉率，或默认 35%
    var dropChance = (typeof chance === 'number') ? chance : 0.35;
    
    // 战斗次数+1
    _battlePityCounter++;
    
    // 保底触发：第20次战斗必掉当前敌人卡片
    if (_battlePityCounter >= 20) {
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
function addPlayerCard(cardData) {
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

    // 返回对象，兼容调用处的 isNew / converted 检查
    return {
        count: playerCards[cardData.id].count,
        isNew: isNew,
        converted: isNew ? null : { shardType: 'generic', amount: 1 }
    };
}

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
}


function getCardStarStyle(cardData, starLevel) {
    // 优先使用卡片指定的 cardType，其次按 rarity 映射，最后默认 normal
    var type = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
    var level = Math.min(5, Math.max(1, starLevel || 1));
    
    // ═══════════════════════════════════════════════════════════════
    //  星级视觉升级系统：高星级可跨级改变颜色/特效
    // ═══════════════════════════════════════════════════════════════
    
    // 星级颜色升级表：当星级足够高时，颜色向更高级别进化
    // 例如：绿卡3星→青绿，4星→蓝绿，5星→金绿（传奇蜕变）
    var starColorEvolution = {
        normal: {    // 绿卡进化路径
            1: '#4eff4e', 2: '#66ff66', 3: '#88ff88', 
            4: '#aaffaa', 5: '#ccffcc'
        },
        elite: {     // 蓝卡进化路径
            1: '#4488ff', 2: '#6699ff', 3: '#88bbff', 
            4: '#aaddff', 5: '#e0f0ff'
        },
        boss: {      // 红卡进化路径
            1: '#ff4444', 2: '#ff6666', 3: '#ff8888', 
            4: '#ffaaaa', 5: '#ffdddd'
        },
        mechanic: {  // 金卡进化路径
            1: '#ffd700', 2: '#ffdd33', 3: '#ffee66', 
            4: '#ffff99', 5: '#ffffcc'
        },
        super: {     // 闪红卡进化路径（最高级）
            1: '#ff0000', 2: '#ff3333', 3: '#ff6666', 
            4: '#ff9999', 5: '#ffcccc'
        }
    };
    
    // 星级特效强度系数：1.0 ~ 3.0
    var intensityMult = 1 + (level - 1) * 0.5; // 1星=1.0, 3星=2.0, 5星=3.0
    
    // 星级类型进化：4星卡片类型名称变化，5星完全蜕变
    // 星级类型进化名称
    var typeNameEvolution = {
        normal: ['遗落', '遗落·改', '窥视', '凝视', '⭐苏醒⭐'],
        elite: ['异变', '异变·改', '侵蚀', '同化', '⭐降临⭐'],
        boss: ['古神', '星之彩', '廷达罗斯', '莎布', '⭐克苏鲁⭐'],
        mechanic: ['混沌', '犹格', '阿撒托斯', '盲目', '⭐原初混沌⭐'],
        super: ['终焉', '热寂', '归零', '虚无', '⭐阿撒托斯之梦⭐']
    };
    
    var typeConfig = CARD_STAR_STYLES[type];
    if (!typeConfig) return null;
    
    var starConfig = typeConfig.stars[level];
    if (!starConfig) return null;
    
    // 获取进化后的颜色
    var evolvedColor = starColorEvolution[type] ? starColorEvolution[type][level] : typeConfig.color;
    var evolvedName = typeNameEvolution[type] ? typeNameEvolution[type][level - 1] : typeConfig.name;
    
    // 动态增强背景：高星级背景更亮更华丽
    var bgBrightness = 1 + (level - 1) * 0.15; // 1星=1.0, 5星=1.6
    var enhancedBg = starConfig.bg.replace(/#([0-9a-f]{2})/gi, function(match, hex) {
        var val = Math.min(255, Math.floor(parseInt(hex, 16) * bgBrightness));
        return '#' + val.toString(16).padStart(2, '0');
    });
    
    // 动态增强发光：星级越高发光越强
    var glowBlur = Math.floor(10 * intensityMult);
    var glowSpread = Math.floor(5 * intensityMult);
    var enhancedGlow = '0 0 ' + glowBlur + 'px ' + evolvedColor + Math.floor(80 * intensityMult).toString(16).padStart(2,'0') + 
                       ', 0 0 ' + (glowBlur * 2) + 'px ' + evolvedColor + Math.floor(40 * intensityMult).toString(16).padStart(2,'0');
    
    // 5星专属：添加彩虹边缘发光
    if (level >= 5) {
        enhancedGlow += ', 0 0 ' + (glowBlur * 3) + 'px rgba(255,215,0,0.3)' +
                        ', inset 0 0 ' + glowBlur + 'px ' + evolvedColor + '20';
    }
    
    // 动态增强边框：星级越高边框越粗越亮
    var enhancedBorderWidth = Math.min(5, starConfig.borderWidth + Math.floor((level - 1) / 2));
    
    // 粒子进化：高星级粒子变成更华丽的符号
    var particleEvolution = {
        1: '●', 2: '◆', 3: '★', 4: '✦', 5: '✪'
    };
    var enhancedParticle = particleEvolution[level] || starConfig.particle;
    
    return {
        type: type,
        typeName: evolvedName,  // ← 使用进化后的名称
        color: evolvedColor,    // ← 使用进化后的颜色
        glow: enhancedGlow,     // ← 使用增强后的发光
        starLevel: level,
        // CSS 样式属性
        bg: enhancedBg,
        border: evolvedColor,   // ← 边框颜色也进化
        borderWidth: enhancedBorderWidth,
        shadow: enhancedGlow,
        particle: enhancedParticle,
        particleColor: evolvedColor,
        desc: starConfig.desc,
        // 动态增强效果
        effects: {
            borderWidth: enhancedBorderWidth,
            shadowBlur: Math.floor(10 * level * intensityMult),
            particleCount: Math.floor(2 * level * intensityMult),
            animationSpeed: Math.max(0.3, 1 / level),
            intensity: intensityMult  // ← 新增：特效强度系数
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
    html += ' <span style="color: #555;">/</span> <span style="color: #fff;">' + dData.icon + ' ' + dData.name + '</span>';
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
        html += '<div onclick="enterCodexBlock(\'' + factionKey + '\', \'' + key + '\')" style="background: linear-gradient(180deg, rgba(18,18,26,0.95) 0%, rgba(10,10,15,0.95) 100%); border: 2px solid ' + faction.color + '30; border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.3s; position: relative; aspect-ratio: 16/9;" onmouseover="this.style.borderColor=\'' + faction.color + '80\'; this.style.transform=\'translateY(-5px)\';" onmouseout="this.style.borderColor=\'' + faction.color + '30\'; this.style.transform=\'none\';"><div style="position: absolute; inset: 0; z-index: 1;">' + (block.image ? '<img src="' + block.image + '" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.35);" onerror="this.style.display=\'none\'">' : '') + '</div><div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 20%, rgba(0,0,0,0.85) 100%); z-index: 2;"></div><div style="position: absolute; inset: 0; z-index: 3; padding: 20px; display: flex; flex-direction: column; justify-content: flex-end;"><div style="font-size: 2rem; margin-bottom: 6px;">' + block.icon + '</div><div style="font-family: Orbitron; font-size: 1.2rem; color: var(--tenno-gold); margin-bottom: 4px;">' + block.name + '</div><div style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">' + block.desc + '</div><div style="display: flex; align-items: center; gap: 8px;"><div style="flex: 1; height: 5px; background: #222; border-radius: 3px; overflow: hidden;"><div style="width: ' + percent + '%; height: 100%; background: ' + faction.color + '; border-radius: 3px;"></div></div><span style="font-family: Orbitron; font-size: 0.75rem; color: ' + faction.color + ';">' + percent + '%</span></div><div style="color: #666; font-size: 0.7rem; margin-top: 5px;">' + stats.collected + ' / ' + stats.total + ' 卡片 · ' + Object.keys(block.decks || {}).length + ' 个卡组</div></div></div>';
    }
    grid.innerHTML = html || '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 60px;">该派系暂无区域数据</div>';
}

function renderCodexDecks(factionKey, blockKey) {
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
        var percent = stats.total > 0 ? Math.floor((stats.collected / stats.total) * 100) : 0;
        html += '<div onclick="enterCodexDeck(\'' + factionKey + '\', \'' + blockKey + '\', \'' + deckId + '\')" style="background: var(--panel-bg); border: 2px solid ' + faction.color + '25; border-radius: 14px; padding: 25px; cursor: pointer; transition: all 0.3s; text-align: center;" onmouseover="this.style.borderColor=\'' + faction.color + '80\'; this.style.transform=\'translateY(-5px)\'; this.style.boxShadow=\'0 10px 30px ' + faction.color + '15\';" onmouseout="this.style.borderColor=\'' + faction.color + '25\'; this.style.transform=\'none\'; this.style.boxShadow=\'none\';"><div style="font-size: 3rem; margin-bottom: 12px;">' + deck.icon + '</div><div style="font-family: Orbitron; font-size: 1.1rem; color: #fff; margin-bottom: 6px;">' + deck.name + '</div><div style="color: #888; font-size: 0.8rem; margin-bottom: 15px;">' + deck.desc + '</div><div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;"><div style="flex: 1; height: 6px; background: #222; border-radius: 3px; overflow: hidden;"><div style="width: ' + percent + '%; height: 100%; background: linear-gradient(90deg, ' + faction.color + '80, ' + faction.color + '); border-radius: 3px;"></div></div><span style="font-family: Orbitron; font-size: 0.8rem; color: ' + faction.color + '; min-width: 40px;">' + percent + '%</span></div><div style="color: #666; font-size: 0.75rem;">' + stats.collected + ' / ' + stats.total + ' 卡片已收集</div></div>';
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

            // 【修改2】获取卡片类型和升星需求
            var cardType = card.cardType || CARD_TYPE_MAP[card.rarity] || 'normal';
            var upgradeCost = getUpgradeRequirement(cardType, displayStarLevel);
            var progressPercent = upgradeCost ? Math.min(100, (count / upgradeCost) * 100) : 100;

            // 【修改3】使用 displayStarLevel 获取星级样式
            var starStyle = getCardStarStyle(card, displayStarLevel);
            var styleColor = starStyle ? starStyle.color : rarity.color;
            var styleGlow = starStyle ? starStyle.shadow : rarity.glow;
            var cardBg = starStyle ? starStyle.bg : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)';
            var cardBorderWidth = starStyle ? starStyle.borderWidth : 2;
            var sParticle = starStyle ? starStyle.particle : '✦';
            var sParticleColor = starStyle ? starStyle.particleColor : styleColor;
            var sTypeName = starStyle ? starStyle.typeName : rarity.name;
            var sDesc = starStyle ? starStyle.desc : '';

            // 星级特效强度
            var isHighStar = displayStarLevel >= 3;
            var isMaxStar = displayStarLevel >= 5;
            var isEliteStar = displayStarLevel >= 4;

            // 动态阴影
            var dynamicShadow = styleGlow;
            if (isHighStar) {
                dynamicShadow += ', 0 0 ' + (displayStarLevel * 8) + 'px ' + styleColor + '30';
            }
            if (isEliteStar) {
                dynamicShadow += ', 0 0 ' + (displayStarLevel * 12) + 'px ' + styleColor + '20';
            }
            if (isMaxStar) {
                dynamicShadow += ', 0 0 ' + (displayStarLevel * 20) + 'px ' + styleColor + '15, inset 0 0 ' + (displayStarLevel * 8) + 'px ' + styleColor + '10';
            }

            // 动态边框
            var dynamicBorder = cardBorderWidth + 'px solid ' + styleColor;

            // 3星以上添加边框发光动画
            var borderAnim = isHighStar ? 'animation: cardBorderPulse' + displayStarLevel + ' 2s ease-in-out infinite alternate;' : '';

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
                borderAnim +
                '" ' +
                'onmouseover="this.style.transform=' + "'" + 'translateY(-8px) scale(1.02)' + "'" + '; ' +
                'this.style.boxShadow=' + "'" + dynamicShadow + ', 0 20px 40px rgba(0,0,0,0.5), 0 0 ' + (displayStarLevel * 15) + 'px ' + styleColor + '40' + "'" + ';" ' +
                'onmouseout="this.style.transform=' + "'" + 'none' + "'" + '; ' +
                'this.style.boxShadow=' + "'" + dynamicShadow + "'" + ';">';

            // 3-5星专属：背景粒子层
            if (isHighStar) {
                var particleCount = displayStarLevel * 2 + 3;
                var particles = '';
                for (var pi = 0; pi < particleCount; pi++) {
                    var px = 5 + (Math.random() * 90);
                    var py = 5 + (Math.random() * 90);
                    var pDelay = (Math.random() * 3).toFixed(2);
                    var pDuration = (2 + Math.random() * 3).toFixed(2);
                    var pSize = (0.4 + Math.random() * 0.8).toFixed(2);
                    var pOpacity = (0.2 + Math.random() * 0.4).toFixed(2);

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

            // 4-5星专属：内发光层
            if (isEliteStar) {
                var innerGlowIntensity = isMaxStar ? 'inset 0 0 30px ' + styleColor + '20, inset 0 0 60px ' + styleColor + '10' : 'inset 0 0 20px ' + styleColor + '15';
                html += '<div style="position: absolute; inset: 0; z-index: 3; pointer-events: none; box-shadow: ' + innerGlowIntensity + '; border-radius: inherit;"></div>';
            }

            // 5星专属：流光线条
            if (isMaxStar) {
                html += 
                    '<div style="position: absolute; top: 0; left: -100%; width: 50%; height: 2px; ' +
                    'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); ' +
                    'animation: cardBorderFlow 2s linear infinite; z-index: 6;"></div>' +
                    '<div style="position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; ' +
                    'background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); ' +
                    'animation: cardBorderFlow 2s linear infinite reverse; z-index: 6;"></div>';
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
    var sTypeName = starStyle ? starStyle.typeName : '遗落';
    var sDesc = starStyle ? starStyle.desc : '';

    var starLevel = actualStarLevel;
    var isHighStar = starLevel >= 3;
    var isMaxStar = starLevel >= 5;
    var isEliteStar = starLevel >= 4;

    // 动态样式
    var borderWidth = starLevel;
    var glowIntensityArr = [
        '0 0 5px ' + sBorder + '30',
        '0 0 10px ' + sBorder + '50, 0 0 20px ' + sBorder + '20',
        '0 0 15px ' + sBorder + '70, 0 0 30px ' + sBorder + '40, 0 0 45px ' + sBorder + '15',
        '0 0 20px ' + sBorder + '90, 0 0 40px ' + sBorder + '60, 0 0 60px ' + sBorder + '30, inset 0 0 20px ' + sBorder + '20',
        '0 0 25px ' + sBorder + '100, 0 0 50px ' + sBorder + '80, 0 0 80px ' + sBorder + '50, 0 0 120px ' + sBorder + '25, inset 0 0 30px ' + sBorder + '30'
    ];
    var glowIntensity = glowIntensityArr[starLevel - 1] || glowIntensityArr[0];

    var innerGlowArr = [
        'inset 0 0 10px ' + sBorder + '05',
        'inset 0 0 15px ' + sBorder + '10',
        'inset 0 0 25px ' + sBorder + '15, inset 0 0 40px ' + sBorder + '08',
        'inset 0 0 35px ' + sBorder + '20, inset 0 0 60px ' + sBorder + '10, inset 0 0 80px ' + sBorder + '05',
        'inset 0 0 50px ' + sBorder + '25, inset 0 0 80px ' + sBorder + '15, inset 0 0 120px ' + sBorder + '08, inset 0 0 150px ' + sBorder + '03'
    ];
    var innerGlow = innerGlowArr[starLevel - 1] || innerGlowArr[0];

    var particleCount = starLevel * 3 + 2;

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
        @keyframes cardRainbowRotate {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
        @keyframes cardAcquirePop {
            0% { transform: scale(0.5) translateY(50px); opacity: 0; }
            60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .card-acquire-glow-${starLevel} {
            animation: ${isMaxStar ? 'cardRainbowGlow 4s ease-in-out infinite' : (starLevel >= 4 ? 'cardBorderPulse' + starLevel + ' 2s ease-in-out infinite alternate' : 'none')};
        }
    `;
    document.head.appendChild(dynamicStyle);

    // 粒子HTML
    var particlesHtml = '';
    for (var pi = 0; pi < particleCount; pi++) {
        var px = 5 + Math.random() * 90;
        var py = 5 + Math.random() * 90;
        var pDelay = (Math.random() * 2).toFixed(2);
        var pDuration = (1.5 + Math.random() * 2).toFixed(2);
        var pSize = (0.5 + Math.random() * 0.8).toFixed(2);
        var pOpacity = (0.3 + Math.random() * 0.5).toFixed(2);
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
    modalBox.style.cssText = 'text-align: center; max-width: 360px; width: 90%; animation: cardAcquirePop 0.5s ease forwards;';

    // 标题
    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-family: Orbitron; font-size: 1.3rem; color: var(--tenno-gold); margin-bottom: 20px; text-shadow: 0 0 15px rgba(200,168,75,0.3);';
    titleEl.textContent = '🎴 获得卡片';
    modalBox.appendChild(titleEl);

    // ========== 卡片展示区域（图鉴风格）==========
    var cardBox = document.createElement('div');
    cardBox.className = containerClass;
    cardBox.style.cssText = containerStyle + 'margin: 0 auto 20px; position: relative;';

    // 粒子层
    var particleLayer = document.createElement('div');
    particleLayer.style.cssText = 'position: absolute; inset: 0; z-index: 10; pointer-events: none; overflow: hidden;';
    particleLayer.innerHTML = particlesHtml;
    cardBox.appendChild(particleLayer);

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

    // 图片区域（图鉴风格）
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'height: 220px; background: #0a0a0f; position: relative; overflow: hidden; border-radius: 12px 12px 0 0;';

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
    gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, ' + sBg + ' 100%); z-index: 2; pointer-events: none;';
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

    var overlay = document.createElement('div');
    overlay.id = 'cardDetailOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.92); z-index: 3000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s ease;';

    // ========== 静态卡片展示（无翻转）==========
    var cardBox = document.createElement('div');
    cardBox.style.cssText = 'width: 320px; background: ' + currentStyle.bg + '; border: ' + currentStyle.borderWidth + 'px solid ' + currentStyle.border + '; border-radius: 16px; overflow: hidden; box-shadow: ' + currentStyle.shadow + '; margin: 0 auto 20px; position: relative;';

    // 图片区域
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'height: 240px; background: #0a0a0f; position: relative; overflow: hidden;';

    var img = document.createElement('img');
    img.src = card.image;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; object-position: top center;';
    img.onerror = function() {
        this.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText = 'font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: ' + currentStyle.color + ';';
        placeholder.textContent = '🎴';
        imgWrap.appendChild(placeholder);
    };
    imgWrap.appendChild(img);

    var gradient = document.createElement('div');
    gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 60px; background: linear-gradient(180deg, transparent 0%, ' + currentStyle.bg + ' 100%);';
    imgWrap.appendChild(gradient);

    // 星级角标
    var starBadge = document.createElement('div');
    var starsStr = '★'.repeat(currentStar) + '☆'.repeat(5 - currentStar);
    starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid ' + currentStyle.border + '; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: ' + currentStyle.color + '; font-family: Orbitron;';
    starBadge.textContent = starsStr;
    imgWrap.appendChild(starBadge);

    cardBox.appendChild(imgWrap);

    // 信息区域
    var infoWrap = document.createElement('div');
    infoWrap.style.cssText = 'padding: 18px; text-align: center;';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 6px; text-shadow: 0 0 10px ' + currentStyle.color + '50;';
    nameEl.textContent = card.name;
    infoWrap.appendChild(nameEl);

    var typeEl = document.createElement('div');
    typeEl.style.cssText = 'font-size: 0.9rem; color: ' + currentStyle.color + '; font-weight: 700; margin-bottom: 8px;';
    typeEl.textContent = currentStyle.typeName + ' · ' + currentStar + '星';
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
    progressFill.style.cssText = 'height: 100%; width: ' + progressPercent + '%; background: linear-gradient(90deg, ' + currentStyle.color + '60, ' + currentStyle.color + '); border-radius: 3px;';
    progressBar.appendChild(progressFill);
    
    var progressText = document.createElement('span');
    progressText.style.cssText = 'font-size: 0.8rem; color: ' + currentStyle.color + '; font-family: Orbitron; min-width: 50px;';
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
        btnUpgrade.style.cssText = 'padding: 10px 24px; background: linear-gradient(135deg, ' + currentStyle.color + '60, ' + currentStyle.color + '); border: 2px solid ' + currentStyle.border + '; border-radius: 10px; color: #fff; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; transition: all 0.3s;';
        btnUpgrade.onmouseover = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 0 30px ' + currentStyle.color + '60';
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
        gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, ' + style.bg + ' 100%);';
        imgWrap.appendChild(gradient);

        var starBadge = document.createElement('div');
        starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid ' + style.border + '; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: ' + style.color + '; text-shadow: 0 0 8px ' + style.color + '60; font-family: Orbitron;';
        starBadge.textContent = starsStr;
        imgWrap.appendChild(starBadge);

        var faceLabel = document.createElement('div');
        faceLabel.style.cssText = 'position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); border: 1px solid ' + style.border + '80; border-radius: 6px; padding: 4px 8px; font-size: 0.7rem; color: ' + style.color + '; font-weight: bold;';
        faceLabel.textContent = isFront ? '【当前】' : '【升星后】';
        imgWrap.appendChild(faceLabel);

        cardContainer.appendChild(imgWrap);

        var infoWrap = document.createElement('div');
        infoWrap.style.cssText = 'flex: 1; padding: 18px; display: flex; flex-direction: column; align-items: center; justify-content: center;';

        var nameEl = document.createElement('div');
        nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 8px; text-shadow: 0 0 10px ' + style.color + '50;';
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
        hintEl.style.cssText = 'padding: 6px 16px; background: ' + style.color + '15; border: 1px solid ' + style.border + '60; border-radius: 20px; font-size: 0.75rem; color: ' + style.color + '; margin-top: 8px;';
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