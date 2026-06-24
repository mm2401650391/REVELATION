// ═══════════════════════════════════════════════════════════════
//  游戏数据配置 (enemies.js)
// ═══════════════════════════════════════════════════════════════

// ─── 敌人数据 ───
var ENEMIES = [	//faction	✅	派系	'grineer'，type	✅	类型（决定属性倍率）'normal'，baseLevel	✅	基础等级	1，dropRate	✅	掉落率 0~1	0.35，codexId	❌	图鉴ID（可选）	'c_ylxx_01'，cardDrop	❌	卡片掉落配置（可选）	{chance: 0.05}
    // ═══════════════════════════════════════════════════════════════
    //  寰宇-Grineer
    // ═══════════════════════════════════════════════════════════════
    
    // 《游掠凶形》- 基础步兵 → type: normal, cardType: normal(绿卡)
    { id: 'g_001', name: '屠夫', icon: '🔴', image: 'GAME/enemies/Grineer/P1/a/1Butcher.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_01', cardDrop: {chance: 0.05} },
    { id: 'g_002', name: '沙漠屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_02', cardDrop: {chance: 0.06} },
    { id: 'g_003', name: '前线屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_03', cardDrop: {chance: 0.06} },
    { id: 'g_004', name: '龙舰屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.42, codexId: 'c_ylxx_04', cardDrop: {chance: 0.06} },
    { id: 'g_005', name: '赤毒屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.45, codexId: 'c_ylxx_05', cardDrop: {chance: 0.07} },
    { id: 'g_006', name: '巨牙屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.42, codexId: 'c_ylxx_06', cardDrop: {chance: 0.06} },
    { id: 'g_007', name: '深空屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_07', cardDrop: {chance: 0.07} },
    { id: 'g_008', name: '回旋屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-7.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_08', cardDrop: {chance: 0.07} },
    { id: 'g_009', name: '邃域屠夫', icon: '👹', image: 'GAME/enemies/Grineer/P1/a/1Butcher1-8.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.48, codexId: 'c_ylxx_09', cardDrop: {chance: 0.08} },
    
    { id: 'g_010', name: '烈焰刀客', icon: '🔥', image: 'GAME/enemies/Grineer/P1/a/2Flameblade.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_10', cardDrop: {chance: 0.06} },
    { id: 'g_011', name: '巨牙烈焰刀客', icon: '🔥', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_11', cardDrop: {chance: 0.07} },
    { id: 'g_012', name: '赤毒烈焰刀客', icon: '🔥', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_12', cardDrop: {chance: 0.07} },
    { id: 'g_013', name: '夜巡者烈焰刀客', icon: '🔥', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_ylxx_13', cardDrop: {chance: 0.08} },
    { id: 'g_014', name: '合一众烈焰刀客', icon: '🔥', image: 'GAME/enemies/Grineer/P1/a/2Flameblade1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_14', cardDrop: {chance: 0.09} },
    
    { id: 'g_015', name: '禁卫军', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/3GrineerProsecutor.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_15', cardDrop: {chance: 0.06} },
    
    { id: 'g_016', name: '重击手', icon: '👊', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_16', cardDrop: {chance: 0.06} },
    { id: 'g_017', name: '赤毒猛力爪兵', icon: '👊', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_17', cardDrop: {chance: 0.07} },
    { id: 'g_018', name: '夜巡者猛力爪兵', icon: '👊', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_ylxx_18', cardDrop: {chance: 0.08} },
    { id: 'g_019', name: '巨牙掠食者', icon: '👊', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_19', cardDrop: {chance: 0.07} },
    { id: 'g_020', name: '合一众重击手', icon: '👊', image: 'GAME/enemies/Grineer/P1/a/4PowerfistDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_20', cardDrop: {chance: 0.09} },
    
    { id: 'g_021', name: '天蝎', icon: '🦂', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_21', cardDrop: {chance: 0.06} },
    { id: 'g_022', name: '龙舰天蝎', icon: '🦂', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_22', cardDrop: {chance: 0.07} },
    { id: 'g_023', name: '赤毒天蝎', icon: '🦂', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_23', cardDrop: {chance: 0.07} },
    { id: 'g_024', name: '合一众天蝎', icon: '🦂', image: 'GAME/enemies/Grineer/P1/a/5ScorpionDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_24', cardDrop: {chance: 0.09} },
    
    { id: 'g_025', name: '盾枪兵', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_25', cardDrop: {chance: 0.06} },
    { id: 'g_026', name: '巨牙盾枪兵', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_26', cardDrop: {chance: 0.07} },
    { id: 'g_027', name: '赤毒盾枪兵', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_27', cardDrop: {chance: 0.07} },
    { id: 'g_028', name: '精英盾枪兵', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-3.jpg', faction: 'grineer', type: 'elite', baseLevel: 5, dropRate: 0.48, codexId: 'c_ylxx_28', cardDrop: {chance: 0.08} },
    { id: 'g_029', name: '合一众盾枪兵', icon: '🛡️', image: 'GAME/enemies/Grineer/P1/a/6ShieldLancerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_29', cardDrop: {chance: 0.09} },
    
    // 《交锋异士》- 精英战斗单位 → type: normal/elite, cardType: elite(蓝卡)
    { id: 'g_030', name: '弩炮', icon: '🎯', image: 'GAME/enemies/Grineer/P1/b/1Ballista.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_01', cardDrop: {chance: 0.06} },
    { id: 'g_031', name: '龙舰弩炮', icon: '🎯', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_02', cardDrop: {chance: 0.07} },
    { id: 'g_032', name: '赤毒弩炮', icon: '🎯', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_03', cardDrop: {chance: 0.08} },
    { id: 'g_033', name: '巨牙弩炮', icon: '🎯', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_04', cardDrop: {chance: 0.07} },
    { id: 'g_034', name: '合一众弩炮', icon: '🎯', image: 'GAME/enemies/Grineer/P1/b/1Ballista1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_05', cardDrop: {chance: 0.09} },
    
    { id: 'g_035', name: '爪喀', icon: '🐾', image: 'GAME/enemies/Grineer/P1/b/2GrnArm.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.38, codexId: 'c_jfys_06', cardDrop: {chance: 0.05} },
    { id: 'g_036', name: '堕落爪喀', icon: '🐾', image: 'GAME/enemies/Grineer/P1/b/2GrnArm1-1.jpg', faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.50, codexId: 'c_jfys_07', cardDrop: {chance: 0.10} },
    
    { id: 'g_037', name: '开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_08', cardDrop: {chance: 0.06} },
    { id: 'g_038', name: '沙漠开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_09', cardDrop: {chance: 0.07} },
    { id: 'g_039', name: '前线开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_10', cardDrop: {chance: 0.07} },
    { id: 'g_040', name: '龙舰开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_11', cardDrop: {chance: 0.07} },
    { id: 'g_041', name: '赤毒开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_12', cardDrop: {chance: 0.08} },
    { id: 'g_042', name: '巨牙开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_13', cardDrop: {chance: 0.07} },
    { id: 'g_043', name: '深空开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.48, codexId: 'c_jfys_14', cardDrop: {chance: 0.08} },
    { id: 'g_044', name: '回旋开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-7.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_15', cardDrop: {chance: 0.08} },
    { id: 'g_045', name: '邃域开膛者', icon: '🔪', image: 'GAME/enemies/Grineer/P1/b/3Eliter1-8.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_16', cardDrop: {chance: 0.09} },
    
    { id: 'g_046', name: '恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_17', cardDrop: {chance: 0.06} },
    { id: 'g_047', name: '沙漠恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_18', cardDrop: {chance: 0.07} },
    { id: 'g_048', name: '前线恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_19', cardDrop: {chance: 0.07} },
    { id: 'g_049', name: '龙舰恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_20', cardDrop: {chance: 0.07} },
    { id: 'g_050', name: '赤毒恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_21', cardDrop: {chance: 0.08} },
    { id: 'g_051', name: '巨牙恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_22', cardDrop: {chance: 0.07} },
    { id: 'g_052', name: '合一众恶徒', icon: '💀', image: 'GAME/enemies/Grineer/P1/b/4HellionDE1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_23', cardDrop: {chance: 0.09} },
    
    { id: 'g_053', name: '鬣猫', icon: '🐱', image: 'GAME/enemies/Grineer/P1/b/5Combat.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.40, codexId: 'c_jfys_24', cardDrop: {chance: 0.06} },
    { id: 'g_054', name: '赤毒鬣猫', icon: '🐱', image: 'GAME/enemies/Grineer/P1/b/5Combat1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_25', cardDrop: {chance: 0.08} },
    
    { id: 'g_055', name: '枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.38, codexId: 'c_jfys_26', cardDrop: {chance: 0.05} },
    { id: 'g_056', name: '沙漠枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_jfys_27', cardDrop: {chance: 0.06} },
    { id: 'g_057', name: '前线枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_jfys_28', cardDrop: {chance: 0.06} },
    { id: 'g_058', name: '龙舰枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_29', cardDrop: {chance: 0.06} },
    { id: 'g_059', name: '赤毒枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_30', cardDrop: {chance: 0.07} },
    { id: 'g_060', name: '巨牙枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_31', cardDrop: {chance: 0.06} },
    { id: 'g_061', name: '夜巡者枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_jfys_32', cardDrop: {chance: 0.08} },
    { id: 'g_062', name: '合一众枪兵', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-7.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_jfys_33', cardDrop: {chance: 0.09} },
    { id: 'g_063', name: '枪兵幸存者', icon: '🔫', image: 'GAME/enemies/Grineer/P1/b/6LancerDE1-8.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.55, codexId: 'c_jfys_34', cardDrop: {chance: 0.10} },
    
    { id: 'g_064', name: '怒焚者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/b/7FlameL.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.43, codexId: 'c_jfys_35', cardDrop: {chance: 0.07} },
    { id: 'g_065', name: '赤毒怒焚者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/b/7FlameL1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_36', cardDrop: {chance: 0.08} },
    { id: 'g_066', name: '合一众怒焚者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/b/7FlameL1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_37', cardDrop: {chance: 0.09} },
    
    { id: 'g_067', name: '追踪者', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.40, codexId: 'c_jfys_38', cardDrop: {chance: 0.06} },
    { id: 'g_068', name: '沙漠追踪者', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_39', cardDrop: {chance: 0.06} },
    { id: 'g_069', name: '前线追踪者', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_40', cardDrop: {chance: 0.06} },
    { id: 'g_070', name: '龙舰追踪者', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_41', cardDrop: {chance: 0.07} },
    { id: 'g_071', name: '赤毒者追踪兵', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_42', cardDrop: {chance: 0.08} },
    { id: 'g_072', name: '巨牙追踪者', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_43', cardDrop: {chance: 0.07} },
    { id: 'g_073', name: '夜巡者追踪兵', icon: '👁️', image: 'GAME/enemies/Grineer/P1/b/8SeekerDE1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_jfys_44', cardDrop: {chance: 0.08} },
    
    { id: 'g_074', name: '骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.43, codexId: 'c_jfys_45', cardDrop: {chance: 0.07} },
    { id: 'g_075', name: '沙漠骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.44, codexId: 'c_jfys_46', cardDrop: {chance: 0.07} },
    { id: 'g_076', name: '前线骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.44, codexId: 'c_jfys_47', cardDrop: {chance: 0.07} },
    { id: 'g_077', name: '龙舰骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_48', cardDrop: {chance: 0.08} },
    { id: 'g_078', name: '赤毒骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.48, codexId: 'c_jfys_49', cardDrop: {chance: 0.08} },
    { id: 'g_079', name: '巨牙骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_50', cardDrop: {chance: 0.08} },
    { id: 'g_080', name: '合一众骑兵', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_51', cardDrop: {chance: 0.09} },
    { id: 'g_081', name: '骑兵幸存者', icon: '🐎', image: 'GAME/enemies/Grineer/P1/b/9Shotgun1-7.jpg', faction: 'grineer', type: 'elite', baseLevel: 9, dropRate: 0.55, codexId: 'c_jfys_52', cardDrop: {chance: 0.10} },
    
    // 《暴戾战将》- 重型/Boss单位 → type: boss, cardType: boss(红卡)/mechanic(金卡)
    { id: 'g_082', name: '执法员', icon: '⚖️', image: 'GAME/enemies/Grineer/P1/c/1Crusher.jpg', faction: 'grineer', type: 'boss', baseLevel: 5, dropRate: 0.45, codexId: 'c_blzj_01', cardDrop: {chance: 0.08} },
    { id: 'g_083', name: '巨牙掠夺者', icon: '⚖️', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 6, dropRate: 0.48, codexId: 'c_blzj_02', cardDrop: {chance: 0.09} },
    { id: 'g_084', name: '夜巡执法员', icon: '⚖️', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_03', cardDrop: {chance: 0.09} },
    { id: 'g_085', name: '夜巡掠夺者', icon: '⚖️', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_04', cardDrop: {chance: 0.10} },
    { id: 'g_086', name: '爆破型执法员', icon: '⚖️', image: 'GAME/enemies/Grineer/P1/c/1Crusher1-4.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.55, codexId: 'c_blzj_05', cardDrop: {chance: 0.12} },
    
    { id: 'g_087', name: '轰击者', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE.jpg', faction: 'grineer', type: 'boss', baseLevel: 6, dropRate: 0.47, codexId: 'c_blzj_06', cardDrop: {chance: 0.08} },
    { id: 'g_088', name: '赤毒轰击者', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_07', cardDrop: {chance: 0.09} },
    { id: 'g_089', name: '巨牙轰击者', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_08', cardDrop: {chance: 0.09} },
    { id: 'g_090', name: '巨牙迫击炮轰击者', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.53, codexId: 'c_blzj_09', cardDrop: {chance: 0.10} },
    { id: 'g_091', name: '夜巡者机枪手', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-4.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.53, codexId: 'c_blzj_10', cardDrop: {chance: 0.10} },
    { id: 'g_092', name: '合一众轰击者', icon: '💥', image: 'GAME/enemies/Grineer/P1/c/2BombardDE1-5.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.55, codexId: 'c_blzj_11', cardDrop: {chance: 0.11} },
    
    { id: 'g_093', name: '指挥官', icon: '👑', image: 'GAME/enemies/Grineer/P1/c/3GrineerMariner.jpg', faction: 'grineer', type: 'elite', baseLevel: 7, dropRate: 0.48, codexId: 'c_blzj_12', cardDrop: {chance: 0.09} },
    
    { id: 'g_094', name: '爪喀驯兽师', icon: '🐾', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster.jpg', faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.45, codexId: 'c_blzj_13', cardDrop: {chance: 0.08} },
    { id: 'g_095', name: '赤毒爪喀驯兽师', icon: '🐾', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster1-1.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_14', cardDrop: {chance: 0.09} },
    { id: 'g_096', name: '堕落爪喀驯兽师', icon: '🐾', image: 'GAME/enemies/Grineer/P1/c/4BeastMaster1-2.jpg', faction: 'grineer', type: 'elite', baseLevel: 9, dropRate: 0.55, codexId: 'c_blzj_15', cardDrop: {chance: 0.11} },
    
    { id: 'g_097', name: '重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.48, codexId: 'c_blzj_16', cardDrop: {chance: 0.09} },
    { id: 'g_098', name: '沙漠重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.49, codexId: 'c_blzj_17', cardDrop: {chance: 0.09} },
    { id: 'g_099', name: '前线重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.49, codexId: 'c_blzj_18', cardDrop: {chance: 0.09} },
    { id: 'g_100', name: '龙舰重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_19', cardDrop: {chance: 0.10} },
    { id: 'g_101', name: '赤毒重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-4.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_20', cardDrop: {chance: 0.10} },
    { id: 'g_102', name: '巨牙重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-5.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_21', cardDrop: {chance: 0.10} },
    { id: 'g_103', name: '爆破型重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-6.jpg', faction: 'grineer', type: 'mechanic', baseLevel: 10, dropRate: 0.58, codexId: 'c_blzj_22', cardDrop: {chance: 0.13} },
    { id: 'g_104', name: '合一众重型机枪手', icon: '🔫', image: 'GAME/enemies/Grineer/P1/c/5GunnerDE1-7.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.55, codexId: 'c_blzj_23', cardDrop: {chance: 0.11} },
    
    { id: 'g_105', name: '鬣猫驯兽师', icon: '🐱', image: 'GAME/enemies/Grineer/P1/c/6CatMaster.jpg', faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.45, codexId: 'c_blzj_24', cardDrop: {chance: 0.08} },
    { id: 'g_106', name: '赤毒鬣猫驯兽师', icon: '🐱', image: 'GAME/enemies/Grineer/P1/c/6CatMaster1-1.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_25', cardDrop: {chance: 0.09} },
    { id: 'g_107', name: '夜巡者鬣猫驯兽师', icon: '🐱', image: 'GAME/enemies/Grineer/P1/c/6CatMaster1-2.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_26', cardDrop: {chance: 0.09} },
    
    { id: 'g_108', name: '狂躁者', icon: '😤', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_27', cardDrop: {chance: 0.09} },
    { id: 'g_109', name: '龙舰狂躁者', icon: '😤', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.55, codexId: 'c_blzj_28', cardDrop: {chance: 0.11} },
    { id: 'g_110', name: '夜巡狂躁者', icon: '😤', image: 'GAME/enemies/Grineer/P1/c/7GrineerManic1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 11, dropRate: 0.57, codexId: 'c_blzj_29', cardDrop: {chance: 0.12} },
    
    { id: 'g_111', name: '火焰轰击者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_30', cardDrop: {chance: 0.09} },
    { id: 'g_112', name: '赤毒火焰轰击者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_31', cardDrop: {chance: 0.10} },
    { id: 'g_113', name: '巨牙火焰轰击者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_32', cardDrop: {chance: 0.10} },
    { id: 'g_114', name: '合一众火焰轰击者', icon: '🔥', image: 'GAME/enemies/Grineer/P1/c/8BombardAvatar1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 11, dropRate: 0.57, codexId: 'c_blzj_33', cardDrop: {chance: 0.12} },
    
    { id: 'g_115', name: '毒化者', icon: '☠️', image: 'GAME/enemies/Grineer/P1/c/9NoxTemp.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.52, codexId: 'c_blzj_34', cardDrop: {chance: 0.10} },
    { id: 'g_116', name: '爆破型毒化者', icon: '☠️', image: 'GAME/enemies/Grineer/P1/c/9NoxTemp1-1.jpg', faction: 'grineer', type: 'mechanic', baseLevel: 12, dropRate: 0.60, codexId: 'c_blzj_35', cardDrop: {chance: 0.15} },

    // 《雅努斯之钥》- 首领战：沃尔上尉
    { id: 'boss_vor_01', name: '沃尔上尉', icon: '🔑', image: 'GAME/enemies/Grineer/CaptainVor.jpg', faction: 'grineer', type: 'mechanic', baseLevel: 28, level: 28, hp: 520, maxHp: 520, shield: 260, maxShield: 260, attack: 48, defense: 32, armor: 250, dropRate: 0.85, codexId: 'boss_vor_01', cardDrop: {chance: 0.18}, bossStage: 1, threatLevel: 4, threatTag: 'mechanic', combatThreat: { level: 4, tag: 'mechanic' } },
    { id: 'boss_vor_02', name: '沃尔上尉·护盾相位', icon: '🛡️', image: 'GAME/enemies/Grineer/kuva.jpg', faction: 'grineer', type: 'mechanic', baseLevel: 31, level: 31, hp: 650, maxHp: 650, shield: 420, maxShield: 420, attack: 55, defense: 38, armor: 280, dropRate: 0.90, codexId: 'boss_vor_02', cardDrop: {chance: 0.22}, bossStage: 2, threatLevel: 4, threatTag: 'mechanic', combatThreat: { level: 4, tag: 'mechanic' } },
    { id: 'boss_vor_03', name: '沃尔上尉·雅努斯觉醒', icon: '☄️', image: 'GAME/enemies/Grineer/kuva.jpg', faction: 'grineer', type: 'super', baseLevel: 34, level: 34, hp: 780, maxHp: 780, shield: 520, maxShield: 520, attack: 64, defense: 45, armor: 320, dropRate: 1.00, codexId: 'boss_vor_03', cardDrop: {chance: 0.28}, bossStage: 3, threatLevel: 5, threatTag: 'super', combatThreat: { level: 5, tag: 'super' } }
];

// ─── 敌人威胁标签 ───
// 只使用当前肃清战斗的 1/2/3 档：
// 1 normal：普通敌人
// 2 elite：中等/危险敌人
// 3 boss：精英/重型敌人
// 4 mechanic、5 super 暂不分配给普通肃清敌人，留给专属战场首领。
const ENEMY_THREAT_TAGS = {
    1: 'normal',
    2: 'elite',
    3: 'boss',
    4: 'mechanic',
    5: 'super'
};

function getEnemyThreatLevel(enemy) {
    const name = enemy && enemy.name ? enemy.name : '';

    if (name.includes('沃尔上尉')) {
        return name.includes('雅努斯觉醒') ? 5 : 4;
    }

    // 当前版本不把普通肃清敌人分到 4/5，即使原 type 是 mechanic，也先作为 3 档精英处理。
    if (
        name.includes('爆破型重型机枪手') ||
        name.includes('爆破型毒化者') ||
        name.includes('毒化者') ||
        name.includes('狂躁者') ||
        name.includes('火焰轰击者') ||
        name.includes('迫击炮轰击者') ||
        name.includes('轰击者') ||
        name.includes('重型机枪手') ||
        name.includes('机枪手') ||
        name.includes('执法员') ||
        name.includes('掠夺者')
    ) {
        return 3;
    }

    // Wiki 行为上有强控制、召唤、位移、爆发、狙击、飞行导弹的单位，归为 2 档危险敌人。
    if (
        name.includes('指挥官') ||
        name.includes('爪喀驯兽师') ||
        name.includes('鬣猫驯兽师') ||
        name.includes('骑兵幸存者') ||
        name.includes('骑兵') ||
        name.includes('弩炮') ||
        name.includes('天蝎') ||
        name.includes('盾枪兵') ||
        name.includes('烈焰刀客') ||
        name.includes('怒焚者') ||
        name.includes('追踪者') ||
        name.includes('追踪兵') ||
        name.includes('开膛者') ||
        name.includes('堕落爪喀') ||
        name.includes('合一众') ||
        name.includes('夜巡者') ||
        name.includes('夜巡') ||
        name.includes('赤毒')
    ) {
        return 2;
    }

    return 1;
}

function applyEnemyThreatTags() {
    if (!Array.isArray(ENEMIES)) return;

    ENEMIES.forEach(function(enemy) {
        const level = getEnemyThreatLevel(enemy);
        enemy.threatLevel = level;
        enemy.threatTag = ENEMY_THREAT_TAGS[level];

        // 保留原 type 给旧系统使用，同时给新战斗系统一个更明确的威胁字段。
        // 旧 type 如果是 mechanic，当前肃清里也不自动升到 4 档。
        enemy.combatThreat = {
            level: level,
            tag: ENEMY_THREAT_TAGS[level]
        };
    });
}

applyEnemyThreatTags();

// ─── 派系映射 ───
const FACTION_ICONS = {
    grineer: '🔴',
    corpus: '🔵',
    infested: '🟢',
    sentient: '🟣'
};

const FACTION_COLORS = {
    grineer: 'var(--grineer-red)',
    corpus: 'var(--corpus-blue)',
    infested: 'var(--infested-green)',
    sentient: 'var(--sentient-purple)'
};



// ─── 辅助函数 ───
function getEnemyData(enemyId) {
    return ENEMIES[enemyId] || ENEMIES.grineer_lancer;
}

function getFactionColor(faction) {
    return FACTION_COLORS[faction] || '#fff';
}
