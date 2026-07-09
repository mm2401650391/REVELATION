// ═══════════════════════════════════════════════════════════════
//  游戏数据配置 (enemies.js)
// ═══════════════════════════════════════════════════════════════

// ─── 敌人数据 ───
var ENEMIES = [	//faction	✅	派系	'grineer'，type	✅	类型（决定属性倍率）'normal'，baseLevel	✅	基础等级	1，dropRate	✅	掉落率 0~1	0.35，codexId	❌	图鉴ID（可选）	'c_ylxx_01'，cardDrop	❌	卡片掉落配置（可选）	{chance: 0.05}
    // ═══════════════════════════════════════════════════════════════
    //  寰宇-Grineer
    // ═══════════════════════════════════════════════════════════════
    
    // 《游掠凶形》- 基础步兵 → type: normal, cardType: normal(绿卡)
    { id: 'g_001', name: '屠夫', icon: '🔴', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_01', cardDrop: {chance: 0.05} },
    { id: 'g_002', name: '沙漠屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_02', cardDrop: {chance: 0.06} },
    { id: 'g_003', name: '前线屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.40, codexId: 'c_ylxx_03', cardDrop: {chance: 0.06} },
    { id: 'g_004', name: '龙舰屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.42, codexId: 'c_ylxx_04', cardDrop: {chance: 0.06} },
    { id: 'g_005', name: '赤毒屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.45, codexId: 'c_ylxx_05', cardDrop: {chance: 0.07} },
    { id: 'g_006', name: '巨牙屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.42, codexId: 'c_ylxx_06', cardDrop: {chance: 0.06} },
    { id: 'g_007', name: '深空屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-6.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_07', cardDrop: {chance: 0.07} },
    { id: 'g_008', name: '回旋屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-7.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_08', cardDrop: {chance: 0.07} },
    { id: 'g_009', name: '邃域屠夫', icon: '👹', image: 'GAME/IMGs/enemies/Grineer/P1/a/1Butcher1-8.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.48, codexId: 'c_ylxx_09', cardDrop: {chance: 0.08} },
    
    { id: 'g_010', name: '烈焰刀客', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_10', cardDrop: {chance: 0.06} },
    { id: 'g_011', name: '巨牙烈焰刀客', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_11', cardDrop: {chance: 0.07} },
    { id: 'g_012', name: '赤毒烈焰刀客', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-2.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_12', cardDrop: {chance: 0.07} },
    { id: 'g_013', name: '夜巡者烈焰刀客', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_ylxx_13', cardDrop: {chance: 0.08} },
    { id: 'g_014', name: '合一众烈焰刀客', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/a/2Flameblade1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_14', cardDrop: {chance: 0.09} },
    
    { id: 'g_015', name: '禁卫军', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/3GrineerProsecutor.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_15', cardDrop: {chance: 0.06} },
    
    { id: 'g_016', name: '重击手', icon: '👊', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_16', cardDrop: {chance: 0.06} },
    { id: 'g_017', name: '赤毒猛力爪兵', icon: '👊', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_17', cardDrop: {chance: 0.07} },
    { id: 'g_018', name: '夜巡者猛力爪兵', icon: '👊', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_ylxx_18', cardDrop: {chance: 0.08} },
    { id: 'g_019', name: '巨牙掠食者', icon: '👊', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_19', cardDrop: {chance: 0.07} },
    { id: 'g_020', name: '合一众重击手', icon: '👊', image: 'GAME/IMGs/enemies/Grineer/P1/a/4PowerfistDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_20', cardDrop: {chance: 0.09} },
    
    { id: 'g_021', name: '天蝎', icon: '🦂', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_21', cardDrop: {chance: 0.06} },
    { id: 'g_022', name: '龙舰天蝎', icon: '🦂', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_22', cardDrop: {chance: 0.07} },
    { id: 'g_023', name: '赤毒天蝎', icon: '🦂', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_23', cardDrop: {chance: 0.07} },
    { id: 'g_024', name: '合一众天蝎', icon: '🦂', image: 'GAME/IMGs/enemies/Grineer/P1/a/5ScorpionDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_24', cardDrop: {chance: 0.09} },
    
    { id: 'g_025', name: '盾枪兵', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_ylxx_25', cardDrop: {chance: 0.06} },
    { id: 'g_026', name: '巨牙盾枪兵', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-1.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_ylxx_26', cardDrop: {chance: 0.07} },
    { id: 'g_027', name: '赤毒盾枪兵', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_ylxx_27', cardDrop: {chance: 0.07} },
    { id: 'g_028', name: '精英盾枪兵', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-3.jpg', mirror: true, faction: 'grineer', type: 'elite', baseLevel: 5, dropRate: 0.48, codexId: 'c_ylxx_28', cardDrop: {chance: 0.08} },
    { id: 'g_029', name: '合一众盾枪兵', icon: '🛡️', image: 'GAME/IMGs/enemies/Grineer/P1/a/6ShieldLancerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_ylxx_29', cardDrop: {chance: 0.09} },
    
    // 《交锋异士》- 精英战斗单位 → type: normal/elite, cardType: elite(蓝卡)
    { id: 'g_030', name: '弩炮', icon: '🎯', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_01', cardDrop: {chance: 0.06} },
    { id: 'g_031', name: '龙舰弩炮', icon: '🎯', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_02', cardDrop: {chance: 0.07} },
    { id: 'g_032', name: '赤毒弩炮', icon: '🎯', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-2.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_03', cardDrop: {chance: 0.08} },
    { id: 'g_033', name: '巨牙弩炮', icon: '🎯', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_04', cardDrop: {chance: 0.07} },
    { id: 'g_034', name: '合一众弩炮', icon: '🎯', image: 'GAME/IMGs/enemies/Grineer/P1/b/1Ballista1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_05', cardDrop: {chance: 0.09} },
    
    { id: 'g_035', name: '爪喀', icon: '🐾', image: 'GAME/IMGs/enemies/Grineer/P1/b/2GrnArm.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.38, codexId: 'c_jfys_06', cardDrop: {chance: 0.05} },
    { id: 'g_036', name: '堕落爪喀', icon: '🐾', image: 'GAME/IMGs/enemies/Grineer/P1/b/2GrnArm1-1.jpg', faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.50, codexId: 'c_jfys_07', cardDrop: {chance: 0.10} },
    
    { id: 'g_037', name: '开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_08', cardDrop: {chance: 0.06} },
    { id: 'g_038', name: '沙漠开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-1.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_09', cardDrop: {chance: 0.07} },
    { id: 'g_039', name: '前线开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-2.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_10', cardDrop: {chance: 0.07} },
    { id: 'g_040', name: '龙舰开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_11', cardDrop: {chance: 0.07} },
    { id: 'g_041', name: '赤毒开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_12', cardDrop: {chance: 0.08} },
    { id: 'g_042', name: '巨牙开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_13', cardDrop: {chance: 0.07} },
    { id: 'g_043', name: '深空开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.48, codexId: 'c_jfys_14', cardDrop: {chance: 0.08} },
    { id: 'g_044', name: '回旋开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-7.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_15', cardDrop: {chance: 0.08} },
    { id: 'g_045', name: '邃域开膛者', icon: '🔪', image: 'GAME/IMGs/enemies/Grineer/P1/b/3Eliter1-8.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_16', cardDrop: {chance: 0.09} },
    
    { id: 'g_046', name: '恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_17', cardDrop: {chance: 0.06} },
    { id: 'g_047', name: '沙漠恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_18', cardDrop: {chance: 0.07} },
    { id: 'g_048', name: '前线恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.43, codexId: 'c_jfys_19', cardDrop: {chance: 0.07} },
    { id: 'g_049', name: '龙舰恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_20', cardDrop: {chance: 0.07} },
    { id: 'g_050', name: '赤毒恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_21', cardDrop: {chance: 0.08} },
    { id: 'g_051', name: '巨牙恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_22', cardDrop: {chance: 0.07} },
    { id: 'g_052', name: '合一众恶徒', icon: '💀', image: 'GAME/IMGs/enemies/Grineer/P1/b/4HellionDE1-6.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_23', cardDrop: {chance: 0.09} },
    
    { id: 'g_053', name: '鬣猫', icon: '🐱', image: 'GAME/IMGs/enemies/Grineer/P1/b/5Combat.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.40, codexId: 'c_jfys_24', cardDrop: {chance: 0.06} },
    { id: 'g_054', name: '赤毒鬣猫', icon: '🐱', image: 'GAME/IMGs/enemies/Grineer/P1/b/5Combat1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_25', cardDrop: {chance: 0.08} },
    
    { id: 'g_055', name: '枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 1, dropRate: 0.38, codexId: 'c_jfys_26', cardDrop: {chance: 0.05} },
    { id: 'g_056', name: '沙漠枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_jfys_27', cardDrop: {chance: 0.06} },
    { id: 'g_057', name: '前线枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 2, dropRate: 0.40, codexId: 'c_jfys_28', cardDrop: {chance: 0.06} },
    { id: 'g_058', name: '龙舰枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_29', cardDrop: {chance: 0.06} },
    { id: 'g_059', name: '赤毒枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_30', cardDrop: {chance: 0.07} },
    { id: 'g_060', name: '巨牙枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-5.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_31', cardDrop: {chance: 0.06} },
    { id: 'g_061', name: '夜巡者枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_jfys_32', cardDrop: {chance: 0.08} },
    { id: 'g_062', name: '合一众枪兵', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-7.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.50, codexId: 'c_jfys_33', cardDrop: {chance: 0.09} },
    { id: 'g_063', name: '枪兵幸存者', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/b/6LancerDE1-8.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.55, codexId: 'c_jfys_34', cardDrop: {chance: 0.10} },
    
    { id: 'g_064', name: '怒焚者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.43, codexId: 'c_jfys_35', cardDrop: {chance: 0.07} },
    { id: 'g_065', name: '赤毒怒焚者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL1-1.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_36', cardDrop: {chance: 0.08} },
    { id: 'g_066', name: '合一众怒焚者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/b/7FlameL1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_37', cardDrop: {chance: 0.09} },
    
    { id: 'g_067', name: '追踪者', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.40, codexId: 'c_jfys_38', cardDrop: {chance: 0.06} },
    { id: 'g_068', name: '沙漠追踪者', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_39', cardDrop: {chance: 0.06} },
    { id: 'g_069', name: '前线追踪者', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 3, dropRate: 0.42, codexId: 'c_jfys_40', cardDrop: {chance: 0.06} },
    { id: 'g_070', name: '龙舰追踪者', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_41', cardDrop: {chance: 0.07} },
    { id: 'g_071', name: '赤毒者追踪兵', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_42', cardDrop: {chance: 0.08} },
    { id: 'g_072', name: '巨牙追踪者', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-5.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.45, codexId: 'c_jfys_43', cardDrop: {chance: 0.07} },
    { id: 'g_073', name: '夜巡者追踪兵', icon: '👁️', image: 'GAME/IMGs/enemies/Grineer/P1/b/8SeekerDE1-6.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.46, codexId: 'c_jfys_44', cardDrop: {chance: 0.08} },
    
    { id: 'g_074', name: '骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.43, codexId: 'c_jfys_45', cardDrop: {chance: 0.07} },
    { id: 'g_075', name: '沙漠骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-1.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.44, codexId: 'c_jfys_46', cardDrop: {chance: 0.07} },
    { id: 'g_076', name: '前线骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-2.jpg', faction: 'grineer', type: 'normal', baseLevel: 4, dropRate: 0.44, codexId: 'c_jfys_47', cardDrop: {chance: 0.07} },
    { id: 'g_077', name: '龙舰骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-3.jpg', faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_48', cardDrop: {chance: 0.08} },
    { id: 'g_078', name: '赤毒骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-4.jpg', faction: 'grineer', type: 'normal', baseLevel: 6, dropRate: 0.48, codexId: 'c_jfys_49', cardDrop: {chance: 0.08} },
    { id: 'g_079', name: '巨牙骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-5.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 5, dropRate: 0.47, codexId: 'c_jfys_50', cardDrop: {chance: 0.08} },
    { id: 'g_080', name: '合一众骑兵', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-6.jpg', mirror: true, faction: 'grineer', type: 'normal', baseLevel: 7, dropRate: 0.52, codexId: 'c_jfys_51', cardDrop: {chance: 0.09} },
    { id: 'g_081', name: '骑兵幸存者', icon: '🐎', image: 'GAME/IMGs/enemies/Grineer/P1/b/9Shotgun1-7.jpg', faction: 'grineer', type: 'elite', baseLevel: 9, dropRate: 0.55, codexId: 'c_jfys_52', cardDrop: {chance: 0.10} },
    
    // 《暴戾战将》- 重型/Boss单位 → type: boss, cardType: boss(红卡)/mechanic(金卡)
    { id: 'g_082', name: '执法员', icon: '⚖️', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher.jpg', faction: 'grineer', type: 'boss', baseLevel: 5, dropRate: 0.45, codexId: 'c_blzj_01', cardDrop: {chance: 0.08} },
    { id: 'g_083', name: '巨牙掠夺者', icon: '⚖️', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 6, dropRate: 0.48, codexId: 'c_blzj_02', cardDrop: {chance: 0.09} },
    { id: 'g_084', name: '夜巡执法员', icon: '⚖️', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_03', cardDrop: {chance: 0.09} },
    { id: 'g_085', name: '夜巡掠夺者', icon: '⚖️', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_04', cardDrop: {chance: 0.10} },
    { id: 'g_086', name: '爆破型执法员', icon: '⚖️', image: 'GAME/IMGs/enemies/Grineer/P1/c/1Crusher1-4.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.55, codexId: 'c_blzj_05', cardDrop: {chance: 0.12} },
    
    { id: 'g_087', name: '轰击者', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE.jpg', faction: 'grineer', type: 'boss', baseLevel: 6, dropRate: 0.47, codexId: 'c_blzj_06', cardDrop: {chance: 0.08} },
    { id: 'g_088', name: '赤毒轰击者', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_07', cardDrop: {chance: 0.09} },
    { id: 'g_089', name: '巨牙轰击者', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.50, codexId: 'c_blzj_08', cardDrop: {chance: 0.09} },
    { id: 'g_090', name: '巨牙迫击炮轰击者', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.53, codexId: 'c_blzj_09', cardDrop: {chance: 0.10} },
    { id: 'g_091', name: '夜巡者机枪手', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-4.jpg', mirror: true, faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.53, codexId: 'c_blzj_10', cardDrop: {chance: 0.10} },
    { id: 'g_092', name: '合一众轰击者', icon: '💥', image: 'GAME/IMGs/enemies/Grineer/P1/c/2BombardDE1-5.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.55, codexId: 'c_blzj_11', cardDrop: {chance: 0.11} },
    
    { id: 'g_093', name: '指挥官', icon: '👑', image: 'GAME/IMGs/enemies/Grineer/P1/c/3GrineerMariner.jpg', faction: 'grineer', type: 'elite', baseLevel: 7, dropRate: 0.48, codexId: 'c_blzj_12', cardDrop: {chance: 0.09} },
    
    { id: 'g_094', name: '爪喀驯兽师', icon: '🐾', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster.jpg', faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.45, codexId: 'c_blzj_13', cardDrop: {chance: 0.08} },
    { id: 'g_095', name: '赤毒爪喀驯兽师', icon: '🐾', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster1-1.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_14', cardDrop: {chance: 0.09} },
    { id: 'g_096', name: '堕落爪喀驯兽师', icon: '🐾', image: 'GAME/IMGs/enemies/Grineer/P1/c/4BeastMaster1-2.jpg', faction: 'grineer', type: 'elite', baseLevel: 9, dropRate: 0.55, codexId: 'c_blzj_15', cardDrop: {chance: 0.11} },
    
    { id: 'g_097', name: '重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.48, codexId: 'c_blzj_16', cardDrop: {chance: 0.09} },
    { id: 'g_098', name: '沙漠重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.49, codexId: 'c_blzj_17', cardDrop: {chance: 0.09} },
    { id: 'g_099', name: '前线重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 7, dropRate: 0.49, codexId: 'c_blzj_18', cardDrop: {chance: 0.09} },
    { id: 'g_100', name: '龙舰重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_19', cardDrop: {chance: 0.10} },
    { id: 'g_101', name: '赤毒重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-4.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_20', cardDrop: {chance: 0.10} },
    { id: 'g_102', name: '巨牙重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-5.jpg', faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.52, codexId: 'c_blzj_21', cardDrop: {chance: 0.10} },
    { id: 'g_103', name: '爆破型重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-6.jpg', mirror: true, faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.58, codexId: 'c_blzj_22', cardDrop: {chance: 0.13} },
    { id: 'g_104', name: '合一众重型机枪手', icon: '🔫', image: 'GAME/IMGs/enemies/Grineer/P1/c/5GunnerDE1-7.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.55, codexId: 'c_blzj_23', cardDrop: {chance: 0.11} },
    
    { id: 'g_105', name: '鬣猫驯兽师', icon: '🐱', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster.jpg', mirror: true, faction: 'grineer', type: 'elite', baseLevel: 6, dropRate: 0.45, codexId: 'c_blzj_24', cardDrop: {chance: 0.08} },
    { id: 'g_106', name: '赤毒鬣猫驯兽师', icon: '🐱', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster1-1.jpg', mirror: true, faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_25', cardDrop: {chance: 0.09} },
    { id: 'g_107', name: '夜巡者鬣猫驯兽师', icon: '🐱', image: 'GAME/IMGs/enemies/Grineer/P1/c/6CatMaster1-2.jpg', mirror: true, faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_26', cardDrop: {chance: 0.09} },
    
    { id: 'g_108', name: '狂躁者', icon: '😤', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic.jpg', faction: 'grineer', type: 'elite', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_27', cardDrop: {chance: 0.09} },
    { id: 'g_109', name: '龙舰狂躁者', icon: '😤', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.55, codexId: 'c_blzj_28', cardDrop: {chance: 0.11} },
    { id: 'g_110', name: '夜巡狂躁者', icon: '😤', image: 'GAME/IMGs/enemies/Grineer/P1/c/7GrineerManic1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 11, dropRate: 0.57, codexId: 'c_blzj_29', cardDrop: {chance: 0.12} },
    
    { id: 'g_111', name: '火焰轰击者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar.jpg', mirror: true, faction: 'grineer', type: 'boss', baseLevel: 8, dropRate: 0.50, codexId: 'c_blzj_30', cardDrop: {chance: 0.09} },
    { id: 'g_112', name: '赤毒火焰轰击者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_31', cardDrop: {chance: 0.10} },
    { id: 'g_113', name: '巨牙火焰轰击者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-2.jpg', faction: 'grineer', type: 'boss', baseLevel: 9, dropRate: 0.53, codexId: 'c_blzj_32', cardDrop: {chance: 0.10} },
    { id: 'g_114', name: '合一众火焰轰击者', icon: '🔥', image: 'GAME/IMGs/enemies/Grineer/P1/c/8BombardAvatar1-3.jpg', faction: 'grineer', type: 'boss', baseLevel: 11, dropRate: 0.57, codexId: 'c_blzj_33', cardDrop: {chance: 0.12} },
    
    { id: 'g_115', name: '毒化者', icon: '☠️', image: 'GAME/IMGs/enemies/Grineer/P1/c/9NoxTemp.jpg', faction: 'grineer', type: 'boss', baseLevel: 10, dropRate: 0.52, codexId: 'c_blzj_34', cardDrop: {chance: 0.10} },
    { id: 'g_116', name: '爆破型毒化者', icon: '☠️', image: 'GAME/IMGs/enemies/Grineer/P1/c/9NoxTemp1-1.jpg', faction: 'grineer', type: 'boss', baseLevel: 12, dropRate: 0.60, codexId: 'c_blzj_35', cardDrop: {chance: 0.15} },

    // 《雅努斯之钥》- 首领战：沃尔上尉
    { id: 'boss_vor_01', name: '沃尔上尉', icon: '🔑', image: 'GAME/IMGs/enemies/Grineer/CaptainVor.jpg', faction: 'grineer', type: 'mechanic', baseLevel: 28, level: 28, hp: 500, maxHp: 500, shield: 240, maxShield: 240, attack: 45, defense: 30, armor: 230, dropRate: 0.85, codexId: 'c_vor_01', cardDrop: {chance: 0.18}, bossStage: 1, threatLevel: 4, threatTag: 'mechanic', combatThreat: { level: 4, tag: 'mechanic' } },
    { id: 'boss_vor_02', name: '沃尔上尉·护盾相位', icon: '🛡️', image: 'GAME/', faction: 'grineer', type: 'mechanic', baseLevel: 31, level: 31, hp: 620, maxHp: 620, shield: 390, maxShield: 390, attack: 51, defense: 35, armor: 255, dropRate: 0.90, codexId: 'c_vor_01', cardDrop: {chance: 0.22}, bossStage: 2, threatLevel: 4, threatTag: 'mechanic', combatThreat: { level: 4, tag: 'mechanic' } },
    { id: 'boss_vor_03', name: '沃尔上尉·雅努斯觉醒', icon: '☄️', image: 'GAME/', faction: 'grineer', type: 'super', baseLevel: 34, level: 34, hp: 740, maxHp: 740, shield: 480, maxShield: 480, attack: 59, defense: 41, armor: 295, dropRate: 1.00, codexId: 'c_vor_01', cardDrop: {chance: 0.28}, bossStage: 3, threatLevel: 5, threatTag: 'super', combatThreat: { level: 5, tag: 'super' } },

    // ═══════════════════════════════════════════════════════════════
    //  寰宇-Corpus
    // ═══════════════════════════════════════════════════════════════
    // 《机械代理人》
    { id: 'c_001', name: '船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman.jpg', faction: 'corpus', type: 'normal', baseLevel: 3, hp: 100, maxHp: 100, attack: 14, defense: 8, speed: 5, shield: 60, maxShield: 60, armor: 10, dropRate: 0.40, codexId: 'c_corpus_01', cardDrop: {chance: 0.05} },
	{ id: 'c_101', name: '大地船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-1.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 4, hp: 110, maxHp: 110, attack: 15, defense: 9, speed: 5, shield: 66, maxShield: 66, armor: 11, dropRate: 0.41, codexId: 'c_corpus_v01', cardDrop: {chance: 0.07} },
	{ id: 'c_102', name: '气雾船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-2.jpg',faction: 'corpus', type: 'normal', baseLevel: 4, hp: 90, maxHp: 90, attack: 17, defense: 6, speed: 7, shield: 54, maxShield: 54, armor: 8, dropRate: 0.42, codexId: 'c_corpus_v02', cardDrop: {chance: 0.07} },
	{ id: 'c_103', name: '朱诺船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-3.jpg',faction: 'corpus', type: 'normal', baseLevel: 5, hp: 110, maxHp: 110, attack: 15, defense: 9, speed: 5, shield: 66, maxShield: 66, armor: 11, dropRate: 0.43, codexId: 'c_corpus_v03', cardDrop: {chance: 0.07} },
	{ id: 'c_104', name: '泰洛船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-4.jpg', mirror: true,faction: 'corpus', type: 'normal', baseLevel: 4, hp: 90, maxHp: 90, attack: 18, defense: 8, speed: 6, shield: 54, maxShield: 54, armor: 9, dropRate: 0.42, codexId: 'c_corpus_v04', cardDrop: {chance: 0.07} },
	{ id: 'c_105', name: '艾汐船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-5.jpg', mirror: true,faction: 'corpus', type: 'normal', baseLevel: 5, hp: 100, maxHp: 100, attack: 14, defense: 10, speed: 5, shield: 60, maxShield: 60, armor: 13, dropRate: 0.43, codexId: 'c_corpus_v05', cardDrop: {chance: 0.07} },
	{ id: 'c_106', name: '沃拉船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-6.jpg', mirror: true,faction: 'corpus', type: 'normal', baseLevel: 5, hp: 130, maxHp: 130, attack: 17, defense: 8, speed: 4, shield: 78, maxShield: 78, armor: 10, dropRate: 0.43, codexId: 'c_corpus_v06', cardDrop: {chance: 0.07} },
	{ id: 'c_107', name: '奥穆船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-7.jpg', mirror: true,faction: 'corpus', type: 'normal', baseLevel: 5, hp: 110, maxHp: 110, attack: 15, defense: 9, speed: 6, shield: 66, maxShield: 66, armor: 11, dropRate: 0.43, codexId: 'c_corpus_v07', cardDrop: {chance: 0.07} },
	{ id: 'c_108', name: '合一众船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/1Crewman1-8.jpg',faction: 'corpus', type: 'normal', baseLevel: 7, hp: 110, maxHp: 110, attack: 15, defense: 9, speed: 6, shield: 66, maxShield: 66, armor: 11, dropRate: 0.48, codexId: 'c_corpus_v08', cardDrop: {chance: 0.08} },

	{ id: 'c_002', name: '德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 140, maxHp: 140, attack: 18, defense: 10, speed: 5, shield: 80, maxShield: 80, armor: 15, dropRate: 0.42, codexId: 'c_corpus_02', cardDrop: {chance: 0.06} },
	{ id: 'c_201', name: '气雾德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 126, maxHp: 126, attack: 22, defense: 8, speed: 7, shield: 72, maxShield: 72, armor: 12, dropRate: 0.44, codexId: 'c_corpus_v09', cardDrop: {chance: 0.07} },
	{ id: 'c_202', name: '气雾德特昂突击队员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-2.jpg',  faction: 'corpus', type: 'normal', baseLevel: 7, hp: 126, maxHp: 126, attack: 25, defense: 8, speed: 7, shield: 72, maxShield: 72, armor: 12, dropRate: 0.46, codexId: 'c_corpus_v10', cardDrop: {chance: 0.07} },
	{ id: 'c_203', name: '泰洛德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-3.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 126, maxHp: 126, attack: 23, defense: 9, speed: 6, shield: 72, maxShield: 72, armor: 14, dropRate: 0.44, codexId: 'c_corpus_v11', cardDrop: {chance: 0.07} },
	{ id: 'c_204', name: '艾汐德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-4.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 140, maxHp: 140, attack: 18, defense: 13, speed: 5, shield: 80, maxShield: 80, armor: 20, dropRate: 0.45, codexId: 'c_corpus_v12', cardDrop: {chance: 0.07} },
	{ id: 'c_205', name: '沃拉德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-5.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 182, maxHp: 182, attack: 22, defense: 10, speed: 4, shield: 104, maxShield: 104, armor: 18, dropRate: 0.45, codexId: 'c_corpus_v13', cardDrop: {chance: 0.07} },
	{ id: 'c_206', name: '奥穆德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-6.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 154, maxHp: 154, attack: 20, defense: 11, speed: 6, shield: 88, maxShield: 88, armor: 17, dropRate: 0.45, codexId: 'c_corpus_v14', cardDrop: {chance: 0.07} },
	{ id: 'c_207', name: '合一众德特昂船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/2Shotgun1-7.jpg', faction: 'corpus', type: 'normal', baseLevel: 9, hp: 154, maxHp: 154, attack: 20, defense: 11, speed: 6, shield: 88, maxShield: 88, armor: 17, dropRate: 0.50, codexId: 'c_corpus_v15', cardDrop: {chance: 0.08} },
	
    { id: 'c_003', name: '精英船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/3CrewmanElite.jpg', faction: 'corpus', type: 'normal', baseLevel: 8, hp: 200, maxHp: 200, attack: 24, defense: 15, speed: 6, shield: 110, maxShield: 110, armor: 20, dropRate: 0.45, codexId: 'c_corpus_03', cardDrop: {chance: 0.07} },
    { id: 'c_301', name: '气雾精英船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/3CrewmanElite1-1.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 9, hp: 180, maxHp: 180, attack: 29, defense: 12, speed: 8, shield: 99, maxShield: 99, armor: 16, dropRate: 0.47, codexId: 'c_corpus_v16', cardDrop: {chance: 0.08} },
    { id: 'c_302', name: '气雾精英突击队员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/3CrewmanElite1-2.jpg', faction: 'corpus', type: 'elite', baseLevel: 10, hp: 180, maxHp: 180, attack: 34, defense: 12, speed: 8, shield: 99, maxShield: 99, armor: 16, dropRate: 0.49, codexId: 'c_corpus_v17', cardDrop: {chance: 0.08} },
    { id: 'c_303', name: '朱诺精英船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/3CrewmanElite1-3.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 10, hp: 220, maxHp: 220, attack: 26, defense: 17, speed: 6, shield: 121, maxShield: 121, armor: 22, dropRate: 0.48, codexId: 'c_corpus_v18', cardDrop: {chance: 0.08} },
    { id: 'c_304', name: '大地精英船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/3CrewmanElite1-4.jpg', faction: 'corpus', type: 'normal', baseLevel: 9, hp: 240, maxHp: 240, attack: 24, defense: 18, speed: 5, shield: 132, maxShield: 132, armor: 24, dropRate: 0.47, codexId: 'c_corpus_v19', cardDrop: {chance: 0.08} },
	
	{ id: 'c_004', name: '虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul.jpg', faction: 'corpus', type: 'normal', baseLevel: 10, hp: 250, maxHp: 250, attack: 30, defense: 18, speed: 5, shield: 140, maxShield: 140, armor: 25, dropRate: 0.48, codexId: 'c_corpus_04', cardDrop: {chance: 0.08} },
    { id: 'c_401', name: '气雾虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-1.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 225, maxHp: 225, attack: 36, defense: 14, speed: 7, shield: 126, maxShield: 126, armor: 20, dropRate: 0.50, codexId: 'c_corpus_v20', cardDrop: {chance: 0.08} },
    { id: 'c_402', name: '气雾虚能突击队员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-2.jpg', faction: 'corpus', type: 'elite', baseLevel: 12, hp: 225, maxHp: 225, attack: 42, defense: 14, speed: 7, shield: 126, maxShield: 126, armor: 20, dropRate: 0.52, codexId: 'c_corpus_v21', cardDrop: {chance: 0.08} },
    { id: 'c_403', name: '朱诺虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-3.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 12, hp: 275, maxHp: 275, attack: 33, defense: 20, speed: 5, shield: 154, maxShield: 154, armor: 28, dropRate: 0.51, codexId: 'c_corpus_v22', cardDrop: {chance: 0.08} },
    { id: 'c_404', name: '泰洛虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-4.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 225, maxHp: 225, attack: 39, defense: 16, speed: 6, shield: 126, maxShield: 126, armor: 23, dropRate: 0.50, codexId: 'c_corpus_v23', cardDrop: {chance: 0.08} },
    { id: 'c_405', name: '艾汐虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-5.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 12, hp: 250, maxHp: 250, attack: 30, defense: 23, speed: 5, shield: 140, maxShield: 140, armor: 33, dropRate: 0.51, codexId: 'c_corpus_v24', cardDrop: {chance: 0.08} },
    { id: 'c_406', name: '沃拉虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-6.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 12, hp: 325, maxHp: 325, attack: 36, defense: 18, speed: 4, shield: 182, maxShield: 182, armor: 30, dropRate: 0.51, codexId: 'c_corpus_v25', cardDrop: {chance: 0.08} },
    { id: 'c_407', name: '奥穆虚能船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/4CrpNul1-7.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 12, hp: 275, maxHp: 275, attack: 33, defense: 20, speed: 6, shield: 154, maxShield: 154, armor: 28, dropRate: 0.51, codexId: 'c_corpus_v26', cardDrop: {chance: 0.08} },
	
	{ id: 'c_005', name: '监工船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/5CrewmanProd.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 12, hp: 300, maxHp: 300, attack: 35, defense: 22, speed: 4, shield: 170, maxShield: 170, armor: 30, dropRate: 0.50, codexId: 'c_corpus_05', cardDrop: {chance: 0.09} },
    { id: 'c_501', name: '气雾监工船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/5CrewmanProd1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 13, hp: 270, maxHp: 270, attack: 42, defense: 18, speed: 5, shield: 153, maxShield: 153, armor: 24, dropRate: 0.52, codexId: 'c_corpus_v27', cardDrop: {chance: 0.08} },
    { id: 'c_502', name: '合一众监工船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/5CrewmanProd1-2.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 15, hp: 330, maxHp: 330, attack: 39, defense: 24, speed: 4, shield: 187, maxShield: 187, armor: 33, dropRate: 0.56, codexId: 'c_corpus_v28', cardDrop: {chance: 0.09} },
	
	{ id: 'c_006', name: '狙击手船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/6Sniper.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 160, maxHp: 160, attack: 28, defense: 8, speed: 6, shield: 90, maxShield: 90, armor: 12, dropRate: 0.43, codexId: 'c_corpus_06', cardDrop: {chance: 0.07} },
    { id: 'c_601', name: '大地狙击手船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/6Sniper1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 8, hp: 192, maxHp: 192, attack: 28, defense: 10, speed: 5, shield: 108, maxShield: 108, armor: 14, dropRate: 0.45, codexId: 'c_corpus_v29', cardDrop: {chance: 0.07} },
    { id: 'c_602', name: '气雾狙击手船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/6Sniper1-2.jpg', faction: 'corpus', type: 'normal', baseLevel: 8, hp: 144, maxHp: 144, attack: 34, defense: 6, speed: 8, shield: 81, maxShield: 81, armor: 10, dropRate: 0.46, codexId: 'c_corpus_v30', cardDrop: {chance: 0.07} },
    { id: 'c_603', name: '气雾狙击手突击队员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/6Sniper1-3.jpg', faction: 'corpus', type: 'elite', baseLevel: 9, hp: 144, maxHp: 144, attack: 39, defense: 6, speed: 8, shield: 81, maxShield: 81, armor: 10, dropRate: 0.48, codexId: 'c_corpus_v31', cardDrop: {chance: 0.08} },
    { id: 'c_604', name: '朱诺狙击手船员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/6Sniper1-4.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 9, hp: 176, maxHp: 176, attack: 31, defense: 9, speed: 6, shield: 99, maxShield: 99, armor: 13, dropRate: 0.47, codexId: 'c_corpus_v32', cardDrop: {chance: 0.08} },
    
	{ id: 'c_007', name: 'Corpus技师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech.jpg', faction: 'corpus', type: 'normal', baseLevel: 9, hp: 180, maxHp: 180, attack: 20, defense: 14, speed: 5, shield: 120, maxShield: 120, armor: 18, dropRate: 0.46, codexId: 'c_corpus_07', cardDrop: {chance: 0.08} },
	{ id: 'c_701', name: '气雾技师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 10, hp: 162, maxHp: 162, attack: 24, defense: 11, speed: 7, shield: 108, maxShield: 108, armor: 14, dropRate: 0.48, codexId: 'c_corpus_v33', cardDrop: {chance: 0.08} },
	{ id: 'c_702', name: '朱诺技工', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-2.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 198, maxHp: 198, attack: 22, defense: 15, speed: 5, shield: 132, maxShield: 132, armor: 20, dropRate: 0.49, codexId: 'c_corpus_v34', cardDrop: {chance: 0.08} },
	{ id: 'c_703', name: '气雾技师突击队员', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-3.jpg', faction: 'corpus', type: 'elite', baseLevel: 11, hp: 162, maxHp: 162, attack: 28, defense: 11, speed: 7, shield: 108, maxShield: 108, armor: 14, dropRate: 0.50, codexId: 'c_corpus_v35', cardDrop: {chance: 0.08} },
	{ id: 'c_704', name: '泰洛技师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-4.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 10, hp: 162, maxHp: 162, attack: 26, defense: 13, speed: 6, shield: 108, maxShield: 108, armor: 16, dropRate: 0.48, codexId: 'c_corpus_v36', cardDrop: {chance: 0.08} },
	{ id: 'c_705', name: '艾汐技工', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-5.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 180, maxHp: 180, attack: 20, defense: 18, speed: 5, shield: 120, maxShield: 120, armor: 23, dropRate: 0.49, codexId: 'c_corpus_v37', cardDrop: {chance: 0.08} },
	{ id: 'c_706', name: '沃拉技工', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-6.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 234, maxHp: 234, attack: 24, defense: 14, speed: 4, shield: 156, maxShield: 156, armor: 22, dropRate: 0.49, codexId: 'c_corpus_v38', cardDrop: {chance: 0.08} },
	{ id: 'c_707', name: '奥穆技工', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/7Tech1-7.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 11, hp: 198, maxHp: 198, attack: 22, defense: 15, speed: 6, shield: 132, maxShield: 132, armor: 20, dropRate: 0.49, codexId: 'c_corpus_v39', cardDrop: {chance: 0.08} },
	
	// 驱逐员
	{ id: 'c_901', name: '驱逐员（迷雾）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/8FogComba1-1.jpg', faction: 'corpus', type: 'elite', baseLevel: 8, hp: 220, maxHp: 220, attack: 28, defense: 16, speed: 7, shield: 130, maxShield: 130, armor: 18, dropRate: 0.55, codexId: 'c_corpus_e01', cardDrop: {chance: 0.10} },
	{ id: 'c_902', name: '驱逐员（虚无）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/8FogComba1-2.jpg', faction: 'corpus', type: 'elite', baseLevel: 8, hp: 190, maxHp: 190, attack: 32, defense: 12, speed: 9, shield: 150, maxShield: 150, armor: 10, dropRate: 0.55, codexId: 'c_corpus_e02', cardDrop: {chance: 0.10} },
	{ id: 'c_903', name: '驱逐员（衰竭）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/8FogComba1-3.jpg', mirror: true, faction: 'corpus', type: 'elite', baseLevel: 9, hp: 260, maxHp: 260, attack: 24, defense: 22, speed: 5, shield: 100, maxShield: 100, armor: 25, dropRate: 0.56, codexId: 'c_corpus_e03', cardDrop: {chance: 0.10} },
	{ id: 'c_904', name: '驱逐员（滞缓）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/8FogComba1-4.jpg', faction: 'corpus', type: 'elite', baseLevel: 9, hp: 240, maxHp: 240, attack: 26, defense: 20, speed: 4, shield: 140, maxShield: 140, armor: 22, dropRate: 0.56, codexId: 'c_corpus_e04', cardDrop: {chance: 0.10} },
	// 扰敌员
	{ id: 'c_911', name: '扰敌员（迷雾）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/9Scrambus1-1.jpg', mirror: true, faction: 'corpus', type: 'elite', baseLevel: 8, hp: 200, maxHp: 200, attack: 30, defense: 14, speed: 8, shield: 120, maxShield: 120, armor: 15, dropRate: 0.54, codexId: 'c_corpus_e05', cardDrop: {chance: 0.10} },
	{ id: 'c_912', name: '扰敌员（虚无）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/9Scrambus1-2.jpg', mirror: true, faction: 'corpus', type: 'elite', baseLevel: 8, hp: 180, maxHp: 180, attack: 34, defense: 10, speed: 10, shield: 140, maxShield: 140, armor: 8, dropRate: 0.54, codexId: 'c_corpus_e06', cardDrop: {chance: 0.10} },
	{ id: 'c_913', name: '扰敌员（衰减）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/9Scrambus1-3.jpg', faction: 'corpus', type: 'elite', baseLevel: 9, hp: 230, maxHp: 230, attack: 26, defense: 18, speed: 6, shield: 110, maxShield: 110, armor: 20, dropRate: 0.55, codexId: 'c_corpus_e07', cardDrop: {chance: 0.10} },
	{ id: 'c_914', name: '扰敌员（滞缓）', icon: '💀', image: 'GAME/IMGs/enemies/Corpus/P1/a/9Scrambus1-4.jpg', faction: 'corpus', type: 'elite', baseLevel: 9, hp: 210, maxHp: 210, attack: 28, defense: 16, speed: 5, shield: 130, maxShield: 130, armor: 18, dropRate: 0.55, codexId: 'c_corpus_e08', cardDrop: {chance: 0.10} },
	{ id: 'c_boss_02', name: '资料师', icon: '👹', image: 'GAME/IMGs/enemies/Corpus/P1/a/9Scrambus1-5.jpg', faction: 'corpus', type: 'boss', baseLevel: 14, hp: 520, maxHp: 520, attack: 42, defense: 28, speed: 4, shield: 320, maxShield: 320, armor: 45, dropRate: 0.78, codexId: 'c_corpus_b02', cardDrop: {chance: 0.20} },
	
	{ id: 'c_008', name: '机械师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/10Machinist.jpg', faction: 'corpus', type: 'normal', baseLevel: 15, hp: 360, maxHp: 360, attack: 32, defense: 30, speed: 4, shield: 200, maxShield: 200, armor: 35, dropRate: 0.52, codexId: 'c_corpus_08', cardDrop: {chance: 0.10} },
	{ id: 'c_801', name: '朱诺锤骨机械师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/10Machinist1-1.jpg', mirror: true, faction: 'corpus', type: 'elite', baseLevel: 18, hp: 432, maxHp: 432, attack: 37, defense: 33, speed: 4, shield: 220, maxShield: 220, armor: 39, dropRate: 0.56, codexId: 'c_corpus_v40', cardDrop: {chance: 0.09} },
	{ id: 'c_802', name: '爆破型机械师', icon: '🔵', image: 'GAME/IMGs/enemies/Corpus/P1/a/10Machinist1-2.jpg', mirror: true, faction: 'corpus', type: 'boss', baseLevel: 20, hp: 252, maxHp: 252, attack: 64, defense: 15, speed: 6, shield: 140, maxShield: 140, armor: 18, dropRate: 0.58, codexId: 'c_corpus_v41', cardDrop: {chance: 0.09} },
	
	{ id: 'c_boss_01', name: '引能船员', icon: '👹', image: 'GAME/IMGs/enemies/Corpus/P1/a/11Crewman.jpg', mirror: true, faction: 'corpus', type: 'boss', baseLevel: 12, hp: 450, maxHp: 450, attack: 38, defense: 25, speed: 5, shield: 280, maxShield: 280, armor: 40, dropRate: 0.75, codexId: 'c_corpus_b01', cardDrop: {chance: 0.18} },
	
    // 《步行机》
    { id: 'c_moa_001', name: '逆进恐鸟', icon: '🤖', image: 'GAME/IMGs/enemies/Corpus/P1/b/1MOA.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 5, hp: 100, maxHp: 100, attack: 14, defense: 8, speed: 4, shield: 60, maxShield: 60, armor: 15, dropRate: 0.40, codexId: 'c_moa_01', cardDrop: {chance: 0.05} },
	{ id: 'c_m102', name: '气雾逆进恐鸟', icon: '🤖', image: 'GAME/IMGs/enemies/Corpus/P1/b/1MOA1-1.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 5, hp: 90, maxHp: 90, attack: 17, defense: 6, speed: 5, shield: 54, maxShield: 54, armor: 12, dropRate: 0.4, codexId: 'c_moa_v51', cardDrop: {chance: 0.06} },
	{ id: 'c_md01', name: '爆破型逆进恐鸟', icon: '🤖', image: 'GAME/IMGs/enemies/Corpus/P1/b/1MOA1-2.jpg', faction: 'corpus', type: 'boss', baseLevel: 5, hp: 70, maxHp: 70, attack: 28, defense: 4, speed: 6, shield: 42, maxShield: 42, armor: 8, dropRate: 0.6, codexId: 'c_moa_v113', cardDrop: {chance: 0.09} },
	
	{ id: 'c_moa_002', name: '熔岩恐鸟', icon: '🔥', image: 'GAME/IMGs/enemies/Corpus/P1/b/2FusionMOA.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 90, maxHp: 90, attack: 18, defense: 7, speed: 4, shield: 55, maxShield: 55, armor: 12, dropRate: 0.42, codexId: 'c_moa_02', cardDrop: {chance: 0.06} },
	{ id: 'c_m209', name: '气雾熔岩恐鸟', icon: '🔥', image: 'GAME/IMGs/enemies/Corpus/P1/b/2FusionMOA1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 81, maxHp: 81, attack: 22, defense: 6, speed: 5, shield: 50, maxShield: 50, armor: 10, dropRate: 0.42, codexId: 'c_moa_v115', cardDrop: {chance: 0.06} },
	
	{ id: 'c_moa_003', name: '恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 100, maxHp: 100, attack: 15, defense: 9, speed: 5, shield: 65, maxShield: 65, armor: 14, dropRate: 0.40, codexId: 'c_moa_03', cardDrop: {chance: 0.05} },
	{ id: 'c_m302', name: '气雾恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-1.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 5, hp: 90, maxHp: 90, attack: 18, defense: 7, speed: 6, shield: 58, maxShield: 58, armor: 11, dropRate: 0.4, codexId: 'c_moa_v66', cardDrop: {chance: 0.06} },
	{ id: 'c_m301', name: '大地恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-2.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 120, maxHp: 120, attack: 15, defense: 11, speed: 4, shield: 78, maxShield: 78, armor: 17, dropRate: 0.44, codexId: 'c_moa_v65', cardDrop: {chance: 0.07} },
	{ id: 'c_m303', name: '泰洛恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-3.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 90, maxHp: 90, attack: 20, defense: 8, speed: 6, shield: 58, maxShield: 58, armor: 13, dropRate: 0.44, codexId: 'c_moa_v67', cardDrop: {chance: 0.07} },
	{ id: 'c_m304', name: '艾汐恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-4.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 100, maxHp: 100, attack: 15, defense: 12, speed: 5, shield: 65, maxShield: 65, armor: 18, dropRate: 0.48, codexId: 'c_moa_v68', cardDrop: {chance: 0.07} },
	{ id: 'c_m305', name: '沃拉恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-5.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 130, maxHp: 130, attack: 18, defense: 9, speed: 4, shield: 84, maxShield: 84, armor: 14, dropRate: 0.48, codexId: 'c_moa_v69', cardDrop: {chance: 0.07} },
	{ id: 'c_m306', name: '奥穆恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/3MOADE1-6.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 110, maxHp: 110, attack: 16, defense: 10, speed: 6, shield: 72, maxShield: 72, armor: 15, dropRate: 0.44, codexId: 'c_moa_v70', cardDrop: {chance: 0.07} },
	
	{ id: 'c_moa_004', name: '磁轨炮恐鸟', icon: '🔫', image: 'GAME/IMGs/enemies/Corpus/P1/b/4MoaRailgun.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 110, maxHp: 110, attack: 18, defense: 6, speed: 4, shield: 70, maxShield: 70, armor: 16, dropRate: 0.43, codexId: 'c_moa_04', cardDrop: {chance: 0.07} },
	{ id: 'c_m402', name: '气雾磁轨炮恐鸟', icon: '🔫', image: 'GAME/IMGs/enemies/Corpus/P1/b/4MoaRailgun1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 99, maxHp: 99, attack: 22, defense: 5, speed: 5, shield: 63, maxShield: 63, armor: 13, dropRate: 0.43, codexId: 'c_moa_v74', cardDrop: {chance: 0.06} },

	{ id: 'c_moa_005', name: '震荡恐鸟', icon: '⚡', image: 'GAME/IMGs/enemies/Corpus/P1/b/5MoaSh.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 95, maxHp: 95, attack: 13, defense: 10, speed: 5, shield: 60, maxShield: 60, armor: 13, dropRate: 0.42, codexId: 'c_moa_05', cardDrop: {chance: 0.06} },
	{ id: 'c_m502', name: '气雾震荡恐鸟', icon: '⚡', image: 'GAME/IMGs/enemies/Corpus/P1/b/5MoaSh1-1.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 86, maxHp: 86, attack: 16, defense: 8, speed: 6, shield: 54, maxShield: 54, armor: 10, dropRate: 0.42, codexId: 'c_moa_v82', cardDrop: {chance: 0.06} },
	{ id: 'c_m501', name: '大地震荡恐鸟', icon: '⚡', image: 'GAME/IMGs/enemies/Corpus/P1/b/5MoaSh1-2.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 6, hp: 114, maxHp: 114, attack: 13, defense: 12, speed: 4, shield: 72, maxShield: 72, armor: 16, dropRate: 0.46, codexId: 'c_moa_v81', cardDrop: {chance: 0.07} },
	
	{ id: 'c_moa_006', name: '微型恐鸟', icon: '🤏', image: 'GAME/IMGs/enemies/Corpus/P1/b/6Minima.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 80, maxHp: 80, attack: 12, defense: 6, speed: 8, shield: 50, maxShield: 50, armor: 10, dropRate: 0.38, codexId: 'c_moa_06', cardDrop: {chance: 0.05} },
	
	{ id: 'c_m901', name: '朱诺德拉恐鸟', icon: '🤖', image: 'GAME/IMGs/enemies/Corpus/P1/b/7JunoDera.jpg', mirror: true, faction: 'corpus', type: 'normal', baseLevel: 7, hp: 127, maxHp: 127, attack: 19, defense: 10, speed: 5, shield: 77, maxShield: 77, armor: 18, dropRate: 0.47, codexId: 'c_moa_v106', cardDrop: {chance: 0.07} },
		
	{ id: 'c_m803', name: '朱诺圆盘恐鸟', icon: '🛸', image: 'GAME/IMGs/enemies/Corpus/P1/b/8JunoDisc1-1.jpg',mirror: true, faction: 'corpus', type: 'normal', baseLevel: 5, hp: 94, maxHp: 94, attack: 15, defense: 8, speed: 6, shield: 61, maxShield: 61, armor: 12, dropRate: 0.44, codexId: 'c_moa_v100', cardDrop: {chance: 0.07} },
	{ id: 'c_m804', name: '泰洛圆盘恐鸟', icon: '🛸', image: 'GAME/IMGs/enemies/Corpus/P1/b/8JunoDisc1-2.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 76, maxHp: 76, attack: 18, defense: 6, speed: 7, shield: 50, maxShield: 50, armor: 10, dropRate: 0.44, codexId: 'c_moa_v101', cardDrop: {chance: 0.07} },
	{ id: 'c_m805', name: '艾汐圆盘恐鸟', icon: '🛸', image: 'GAME/IMGs/enemies/Corpus/P1/b/8JunoDisc1-3.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 85, maxHp: 85, attack: 14, defense: 9, speed: 6, shield: 55, maxShield: 55, armor: 14, dropRate: 0.48, codexId: 'c_moa_v102', cardDrop: {chance: 0.07} },
	{ id: 'c_m806', name: '沃拉圆盘恐鸟', icon: '🛸', image: 'GAME/IMGs/enemies/Corpus/P1/b/8JunoDisc1-4.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 110, maxHp: 110, attack: 17, defense: 7, speed: 5, shield: 72, maxShield: 72, armor: 11, dropRate: 0.48, codexId: 'c_moa_v103', cardDrop: {chance: 0.07} },
	{ id: 'c_m807', name: '奥穆圆盘恐鸟', icon: '🛸', image: 'GAME/IMGs/enemies/Corpus/P1/b/8JunoDisc1-5.jpg', faction: 'corpus', type: 'normal', baseLevel: 5, hp: 94, maxHp: 94, attack: 15, defense: 8, speed: 7, shield: 61, maxShield: 61, armor: 12, dropRate: 0.44, codexId: 'c_moa_v104', cardDrop: {chance: 0.07} },	
	
	{ id: 'c_m902', name: '朱诺双子炮恐鸟', icon: '🔫', image: 'GAME/IMGs/enemies/Corpus/P1/b/9Geminex.jpg', faction: 'corpus', type: 'normal', baseLevel: 7, hp: 132, maxHp: 132, attack: 22, defense: 9, speed: 3, shield: 82, maxShield: 82, armor: 20, dropRate: 0.48, codexId: 'c_moa_v107', cardDrop: {chance: 0.07} },
	
    { id: 'c_m903', name: '朱诺冷冻光束步枪恐鸟', icon: '❄️', image: 'GAME/IMGs/enemies/Corpus/P1/b/10Glaxion.jpg', faction: 'corpus', type: 'normal', baseLevel: 6, hp: 110, maxHp: 110, attack: 18, defense: 8, speed: 4, shield: 72, maxShield: 72, armor: 14, dropRate: 0.46, codexId: 'c_moa_v108', cardDrop: {chance: 0.07} },

    // ── 金流恐鸟
    { id: 'c_me01', name: '金流恐鸟（守护）', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/11Dispersion1-1.jpg', faction: 'corpus', type: 'elite', baseLevel: 5, hp: 200, maxHp: 200, attack: 22, defense: 14, speed: 6, shield: 130, maxShield: 130, armor: 21, dropRate: 0.8, codexId: 'c_moa_v109', cardDrop: {chance: 0.12} },
    { id: 'c_me02', name: '金流恐鸟（驱引）', icon: '🤖', image: 'GAME/IMGs/enemies/Corpus/P1/b/11Dispersion1-2.jpg', faction: 'corpus', type: 'elite', baseLevel: 5, hp: 200, maxHp: 200, attack: 21, defense: 12, speed: 5, shield: 120, maxShield: 120, armor: 22, dropRate: 0.8, codexId: 'c_moa_v110', cardDrop: {chance: 0.12} },
    { id: 'c_me03', name: '金流恐鸟（隔离）', icon: '🔫', image: 'GAME/IMGs/enemies/Corpus/P1/b/11Dispersion1-3.jpg', faction: 'corpus', type: 'elite', baseLevel: 7, hp: 220, maxHp: 220, attack: 27, defense: 9, speed: 5, shield: 140, maxShield: 140, armor: 24, dropRate: 0.86, codexId: 'c_moa_v111', cardDrop: {chance: 0.13} },
    { id: 'c_me04', name: '金流恐鸟（穷凶）', icon: '⚡', image: 'GAME/IMGs/enemies/Corpus/P1/b/11Dispersion1-4.jpg', mirror: true, faction: 'corpus', type: 'elite', baseLevel: 6, hp: 190, maxHp: 190, attack: 20, defense: 15, speed: 6, shield: 120, maxShield: 120, armor: 20, dropRate: 0.84, codexId: 'c_moa_v112', cardDrop: {chance: 0.13} },
    { id: 'c_md02', name: '爆破型金流恐鸟', icon: '🦾', image: 'GAME/IMGs/enemies/Corpus/P1/b/11Dispersion1-5.jpg', faction: 'corpus', type: 'boss', baseLevel: 5, hp: 70, maxHp: 70, attack: 30, defense: 4, speed: 8, shield: 46, maxShield: 46, armor: 7, dropRate: 0.6, codexId: 'c_moa_v114', cardDrop: {chance: 0.09} },
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

// ═══════════════════════════════════════════════════════════════
//  Corpus 变体前缀轮换系统
// ═══════════════════════════════════════════════════════════════

// Corpus 变体前缀池
var CORPUS_ROTATION_PREFIXES = [
    { key: 'terra',      name: '大地',    theme: '凛冬驻防',   color: '#c8a84b', buff: '大地财阀寒潮压境' },
    { key: 'vapor',      name: '气雾',    theme: '云端空袭',   color: '#66ccff', buff: '气雾空降兵云端掠影' },
    { key: 'juno',       name: '朱诺',    theme: '舰列镇压',   color: '#ff88cc', buff: '朱诺舰列整编巡逻' },
    { key: 'taytel',     name: '泰洛',    theme: '星域前哨',   color: '#44ff88', buff: '泰洛前哨舰深入星域' },
    { key: 'axi',        name: '艾汐',    theme: '深空封锁',   color: '#ffcc44', buff: '艾汐巡航舰深空扼守' },
    { key: 'vola',       name: '沃拉',    theme: '极境碾压',   color: '#ff6644', buff: '沃拉突击舰极境强袭' },
    { key: 'omo',        name: '奥穆',    theme: '暗面渗透',   color: '#aa88ff', buff: '奥穆隐匿舰暗面潜行' },
    { key: 'narmer_c',   name: '合一众',  theme: '终焉同化',   color: '#ff4444', buff: '合一众协约军蜂拥而至' }
];

var CORPUS_RARE_PREFIXES = [
    { key: 'c_elite',      name: '精英',     theme: '精英型',      color: '#ffd700', chance: 0.03 },
    { key: 'c_demolition', name: '爆破型',   theme: '自爆型',      color: '#ff6600', chance: 0.02 },
    { key: 'c_corrupted',  name: '堕落',     theme: '虚空腐化',    color: '#ff00ff', chance: 0.015 }
];

// Corpus 前缀属性修正
var CORPUS_PREFIX_MODS = {
    'terra':      { hpMod: 1.2,  atkMod: 1.0,  defMod: 1.2,  spdMod: 0.9,  dropBonus: 1.1 },
    'vapor':      { hpMod: 0.9,  atkMod: 1.2,  defMod: 0.8,  spdMod: 1.3,  dropBonus: 1.0 },
    'juno':       { hpMod: 1.1,  atkMod: 1.1,  defMod: 1.1,  spdMod: 1.0,  dropBonus: 1.1 },
    'taytel':     { hpMod: 0.9,  atkMod: 1.3,  defMod: 0.9,  spdMod: 1.2,  dropBonus: 1.1 },
    'axi':        { hpMod: 1.0,  atkMod: 1.0,  defMod: 1.3,  spdMod: 1.0,  dropBonus: 1.2 },
    'vola':       { hpMod: 1.3,  atkMod: 1.2,  defMod: 1.0,  spdMod: 0.8,  dropBonus: 1.2 },
    'omo':        { hpMod: 1.1,  atkMod: 1.1,  defMod: 1.1,  spdMod: 1.1,  dropBonus: 1.1 },
    'narmer_c':   { hpMod: 1.1,  atkMod: 1.1,  defMod: 1.1,  spdMod: 1.1,  dropBonus: 1.2 },
    'c_elite':    { hpMod: 2.0,  atkMod: 1.5,  defMod: 1.5,  spdMod: 1.2,  dropBonus: 2.0, xpBonus: 2.0 },
    'c_demolition':{ hpMod: 0.7,  atkMod: 2.0,  defMod: 0.5,  spdMod: 1.5,  dropBonus: 1.5, selfDestruct: true },
    'c_corrupted': { hpMod: 1.8,  atkMod: 1.8,  defMod: 1.0,  spdMod: 0.8,  dropBonus: 2.5, xpBonus: 3.0 }
};

// Corpus 变体前缀映射：哪些基础敌人可使用哪些变体前缀
var CORPUS_VARIANT_MAP = {
    'c_001': { baseName: '船员', variants: ['大地船员', '气雾船员', '朱诺船员', '泰洛船员', '艾汐船员', '沃拉船员', '奥穆船员', '合一众船员'] },
    'c_002': { baseName: '德特昂船员', variants: ['气雾德特昂船员', '气雾德特昂突击队员', '泰洛德特昂船员', '艾汐德特昂船员', '沃拉德特昂船员', '奥穆德特昂船员', '合一众德特昂船员'] },
    'c_003': { baseName: '精英船员', variants: ['气雾精英船员', '气雾精英突击队员', '朱诺精英船员', '大地精英船员'] },
    'c_004': { baseName: '虚能船员', variants: ['气雾虚能船员', '气雾虚能突击队员', '朱诺虚能船员', '泰洛虚能船员', '艾汐虚能船员', '沃拉虚能船员', '奥穆虚能船员'] },
    'c_005': { baseName: '监工船员', variants: ['气雾监工船员', '合一众监工船员'] },
    'c_006': { baseName: '狙击手船员', variants: ['大地狙击手船员', '气雾狙击手船员', '气雾狙击手突击队员', '朱诺狙击手船员'] },
    'c_007': { baseName: 'Corpus技师', variants: ['气雾技师', '朱诺技工', '气雾技师突击队员', '泰洛技师', '艾汐技工', '沃拉技工', '奥穆技工'] },
    'c_008': { baseName: '机械师', variants: ['朱诺锤骨机械师', '爆破型机械师'] },
    // 恐鸟（步行机区域）- 使用与船员相同的前缀轮换系统
    'c_moa_001': { baseName: '逆进恐鸟', variants: ['大地逆进恐鸟', '气雾逆进恐鸟', '朱诺逆进恐鸟', '泰洛逆进恐鸟', '艾汐逆进恐鸟', '沃拉逆进恐鸟', '奥穆逆进恐鸟', '合一众逆进恐鸟'] },
    'c_moa_002': { baseName: '熔岩恐鸟', variants: ['大地熔岩恐鸟', '气雾熔岩恐鸟', '朱诺熔岩恐鸟', '泰洛熔岩恐鸟', '艾汐熔岩恐鸟', '沃拉熔岩恐鸟', '奥穆熔岩恐鸟', '合一众熔岩恐鸟'] },
    'c_moa_003': { baseName: '恐鸟', variants: ['大地恐鸟', '气雾恐鸟', '朱诺恐鸟', '泰洛恐鸟', '艾汐恐鸟', '沃拉恐鸟', '奥穆恐鸟', '合一众恐鸟'] },
    'c_moa_004': { baseName: '磁轨炮恐鸟', variants: ['大地磁轨炮恐鸟', '气雾磁轨炮恐鸟', '朱诺磁轨炮恐鸟', '泰洛磁轨炮恐鸟', '艾汐磁轨炮恐鸟', '沃拉磁轨炮恐鸟', '奥穆磁轨炮恐鸟', '合一众磁轨炮恐鸟'] },
    'c_moa_005': { baseName: '震荡恐鸟', variants: ['大地震荡恐鸟', '气雾震荡恐鸟', '朱诺震荡恐鸟', '泰洛震荡恐鸟', '艾汐震荡恐鸟', '沃拉震荡恐鸟', '奥穆震荡恐鸟', '合一众震荡恐鸟'] },
    'c_moa_006': { baseName: '微型恐鸟', variants: ['大地微型恐鸟', '气雾微型恐鸟', '朱诺微型恐鸟', '泰洛微型恐鸟', '艾汐微型恐鸟', '沃拉微型恐鸟', '奥穆微型恐鸟', '合一众微型恐鸟'] },
    //'c_moa_007': { baseName: '融合恐鸟', variants: ['气雾融合恐鸟'] },
    'c_moa_008': { baseName: '圆盘恐鸟', variants: ['大地圆盘恐鸟', '气雾圆盘恐鸟', '朱诺圆盘恐鸟', '泰洛圆盘恐鸟', '艾汐圆盘恐鸟', '沃拉圆盘恐鸟', '奥穆圆盘恐鸟', '合一众圆盘恐鸟'] },
    'c_moa_009': { baseName: '德拉恐鸟', variants: ['朱诺德拉恐鸟'] },
    //'c_moa_010': { baseName: '双子炮恐鸟', variants: ['朱诺双子炮恐鸟'] },
    //'c_moa_011': { baseName: '冷冻光束步枪恐鸟', variants: ['朱诺冷冻光束步枪恐鸟'] },
};

// Corpus 轮换函数
function getCorpusRotationPrefix() {
    var hour = new Date().getHours();
    var index = hour % CORPUS_ROTATION_PREFIXES.length;
    return CORPUS_ROTATION_PREFIXES[index];
}

function rollCorpusRarePrefix() {
    var rand = Math.random();
    var cumulative = 0;
    for (var i = 0; i < CORPUS_RARE_PREFIXES.length; i++) {
        cumulative += CORPUS_RARE_PREFIXES[i].chance;
        if (rand < cumulative) return CORPUS_RARE_PREFIXES[i];
    }
    return null;
}

function rollCorpusPrefix() {
    var rand = Math.random();
    if (rand < 0.50) return null; // 50% 无前缀
    rand -= 0.50;
    if (rand < 0.35) return getCorpusRotationPrefix(); // 35% 轮换前缀
    return rollCorpusRarePrefix(); // 15% 稀有
}

function applyCorpusPrefixModifiers(enemy, prefix) {
    if (!prefix || !CORPUS_PREFIX_MODS[prefix.key]) return enemy;
    var mod = CORPUS_PREFIX_MODS[prefix.key];
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
    if (mod.dropBonus) result.dropRate = Math.min(1.0, (result.dropRate || 0.35) * mod.dropBonus);
    if (mod.xpBonus) result.xpBonus = mod.xpBonus;
    if (mod.selfDestruct) result.selfDestruct = true;
    result.displayName = prefix.name + result.name;
    result.fullName = '[' + prefix.name + ']' + result.name + ' (' + prefix.theme + ')';
    return result;
}

function getCorpusPrefixRotationStatus() {
    var current = getCorpusRotationPrefix();
    var nextIndex = (new Date().getHours() + 1) % CORPUS_ROTATION_PREFIXES.length;
    var next = CORPUS_ROTATION_PREFIXES[nextIndex];
    var remainMin = 60 - new Date().getMinutes();
    return {
        current: current,
        next: next,
        remainMinutes: remainMin
    };
}

// 生成Corpus变体敌人（按当前轮换前缀）
function generateCorpusVariant(baseEnemy) {
    var prefix = rollCorpusPrefix();
    if (!prefix) return baseEnemy; // 50%概率返回原版
    var result = applyCorpusPrefixModifiers(baseEnemy, prefix);
    // 尝试用映射表替换名字
    var vmap = CORPUS_VARIANT_MAP[baseEnemy.id];
    if (vmap && prefix.key !== 'c_elite' && prefix.key !== 'c_demolition' && prefix.key !== 'c_corrupted') {
        // 查找对应前缀的变体名
        var variantName = null;
        if (prefix.key === 'narmer_c') {
            variantName = vmap.variants.find(function(v) { return v.indexOf('合一众') >= 0; });
        } else {
            var prefixNameMap = { terra:'大地', vapor:'气雾', juno:'朱诺', taytel:'泰洛', axi:'艾汐', vola:'沃拉', omo:'奥穆' };
            var targetName = prefixNameMap[prefix.key];
            if (targetName) variantName = vmap.variants.find(function(v) { return v.indexOf(targetName) >= 0; });
        }
        if (variantName) {
            result.displayName = variantName;
            result.fullName = '[' + prefix.name + ']' + variantName + ' (' + prefix.theme + ')';
        }
    }
    return result;
}
