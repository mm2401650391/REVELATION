//防开发者和右键工具

(function() {
    var destroyed = false;
    
    function destroy() {
        if (destroyed) return;
        destroyed = true;
        document.body.innerHTML = '<div style="position:fixed;inset:0;background:#000;color:#ff4444;display:flex;align-items:center;justify-content:center;font-size:2rem;">请关闭开发者工具并刷新</div>';
    }
    
    // F12
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === 123) {
            e.preventDefault();
            destroy();
        }
    });
    
    // 右键
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 选择文本
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 拖拽
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // 复制
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        return false;
    });
    
})();









// =============================================
//交易 - 物品数据库
// =============================================

// 物品分类说明：
// Prime战甲  - Prime Warframe（含整套/总图/头部/机体/系统）
// Prime武器  - Prime Weapon（含整套/总图/各种武器部件）
// 特殊武器   - 特殊武器/特殊MOD（含整套/总图/各种武器部件）
// MOD        - 普通MOD
// 未经分类   - 其他物品

// 子分类映射（武器部件 → 统一中文子分类名）：
//   整套 = Set / 完整一套   
//   总图 = Blueprint
//   头部 = Neuroptics（战甲）
//   机体 = Chassis（战甲）
//   系统 = Systems（战甲）
//   枪管 = Barrel（主要武器/曲翼武器）
//   枪机 = Receiver（主要武器/次要武器）
//   枪托 = Stock（主要武器/曲翼武器）
//   刀刃 = Blade（近战武器）
//   握柄 = Handle（近战武器）
//   护手 = Guard（近战武器）
//   链条 = Chain（近战武器）
//   手套 = Gauntlet（近战武器）
//   爪刃 = Claw（近战武器）
//   圆盘 = Disc（近战武器）
//   拳套 = Gauntlet/Fist（近战武器）
//   靴子 = Boot（近战武器）
//   锤头 = Head（近战武器）
//   饰物 = Ornament（近战武器）
//   镖袋 = Quiver（次要武器）
//   星镖 = Star（次要武器）
//   连接器 = Link（次要武器-双枪）
//   上弓臂 = Upper Limb（弓）
//   下弓臂 = Lower Limb（弓）
//   弓身 = Grip（弓/弩）
//   弓弦 = String（弓/弩）
//   外壳 = Shell（守护）


//以下皆需要总图

//主要武器/曲翼武器通用：枪管/枪机/枪托(除以下特别说明)，
//只有完整一套：骨葬Prime   
//枪管/刀刃/握柄：圣英Prime/祸根Prime
//上弓臂/下弓臂/弓身/弓弦：西诺斯Prime/大久和弓Prime/帕里斯Prime
//枪管/枪机/弓身/弓弦：噬蛇弩Prime/诸葛连弩Prime
//上弓臂/下弓臂/枪机/弓弦：布里斯提卡Prime

//次要武器通用：枪管/枪机(除以下特别说明)，
//XXX双枪在次要武器通用基础上：额外需要连接器
//只有连接器的：雷克斯双枪Prime/麦格努斯双枪Prime/瓦斯托双枪Prime/轻灵月神双枪Prime/史提托双枪Prime
//飞扬Prime(镖袋,星镖),旋刃飞刀Prime(镖袋,刀刃)

//近战武器通用：刀刃/握柄(除以下特别说明)，
//刀刃/握柄/护手：席瓦&神盾Prime/眼镜蛇&鹤Prime
//握柄/链条：降灵追猎者Prime
//手套/爪刃：凯旋之爪Prime
//刀刃/圆盘：战刃Prime
//刀刃/拳套：铁钩手甲Prime/甲龙双拳Prime
//拳套/靴子：科加基Prime
//锤头/握柄：重击巨锤Prime/创伤Prime
//饰物/握柄：提佩多Prime

//守护通用：头部/外壳/系统

var ITEM_CATALOG = [
	// ═══════════════ Prime 战甲 ═══════════════
	{ name: 'Ash Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Ash Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Ash Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Ash Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Ash Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Atlas Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Atlas Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Atlas Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Atlas Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Atlas Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Banshee Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Banshee Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Banshee Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Banshee Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Banshee Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Baruuk Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Baruuk Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Baruuk Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Baruuk Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Baruuk Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Caliban Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Caliban Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Caliban Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Caliban Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Caliban Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Chroma Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Chroma Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Chroma Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Chroma Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Chroma Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Ember Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Ember Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Ember Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Ember Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Ember Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Equinox Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Equinox Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Equinox Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Equinox Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Equinox Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Frost Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Frost Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Frost Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Frost Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Frost Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Gara Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Gara Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Gara Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Gara Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Gara Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Garuda Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Garuda Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Garuda Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Garuda Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Garuda Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Gauss Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Gauss Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Gauss Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Gauss Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Gauss Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Grendel Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Grendel Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Grendel Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Grendel Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Grendel Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Gyre Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Gyre Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Gyre Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Gyre Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Gyre Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Harrow Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Harrow Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Harrow Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Harrow Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Harrow Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Hildryn Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Hildryn Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Hildryn Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Hildryn Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Hildryn Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Hydroid Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Hydroid Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Hydroid Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Hydroid Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Hydroid Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Inaros Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Inaros Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Inaros Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Inaros Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Inaros Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Ivara Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Ivara Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Ivara Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Ivara Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Ivara Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Khora Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Khora Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Khora Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Khora Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Khora Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Lavos Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Lavos Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Lavos Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Lavos Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Lavos Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Limbo Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Limbo Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Limbo Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Limbo Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Limbo Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Loki Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Loki Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Loki Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Loki Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Loki Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Mag Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Mag Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Mag Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Mag Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Mag Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Mesa Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Mesa Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Mesa Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Mesa Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Mesa Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Mirage Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Mirage Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Mirage Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Mirage Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Mirage Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Nekros Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Nekros Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Nekros Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Nekros Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Nekros Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Nezha Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Nezha Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Nezha Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Nezha Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Nezha Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Nidus Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Nidus Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Nidus Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Nidus Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Nidus Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Nova Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Nova Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Nova Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Nova Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Nova Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Nyx Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Nyx Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Nyx Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Nyx Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Nyx Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Oberon Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Oberon Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Oberon Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Oberon Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Oberon Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Octavia Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Octavia Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Octavia Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Octavia Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Octavia Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Protea Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Protea Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Protea Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Protea Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Protea Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Revenant Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Revenant Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Revenant Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Revenant Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Revenant Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Rhino Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Rhino Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Rhino Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Rhino Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Rhino Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Saryn Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Saryn Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Saryn Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Saryn Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Saryn Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Sevagoth Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Sevagoth Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Sevagoth Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Sevagoth Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Sevagoth Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Styanax Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Styanax Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Styanax Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Styanax Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Styanax Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Titania Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Titania Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Titania Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Titania Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Titania Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Trinity Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Trinity Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Trinity Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Trinity Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Trinity Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Valkyr Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Valkyr Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Valkyr Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Valkyr Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Valkyr Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Vauban Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Vauban Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Vauban Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Vauban Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Vauban Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Volt Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Volt Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Volt Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Volt Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Volt Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Voruna Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Voruna Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Voruna Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Voruna Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Voruna Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Wisp Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Wisp Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Wisp Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Wisp Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Wisp Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Wukong Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Wukong Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Wukong Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Wukong Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Wukong Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Xaku Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Xaku Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Xaku Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Xaku Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Xaku Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Yareli Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Yareli Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Yareli Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Yareli Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Yareli Prime 系统', type: 'Prime战甲', subcategory: '系统' },
	{ name: 'Zephyr Prime 整套', type: 'Prime战甲', subcategory: '整套' },
	{ name: 'Zephyr Prime 总图', type: 'Prime战甲', subcategory: '总图' },
	{ name: 'Zephyr Prime 头部', type: 'Prime战甲', subcategory: '头部' },
	{ name: 'Zephyr Prime 机体', type: 'Prime战甲', subcategory: '机体' },
	{ name: 'Zephyr Prime 系统', type: 'Prime战甲', subcategory: '系统' },

	// ═══════════════ Prime 武器 - 主武器（枪管/枪机/枪托 + 总图） ═══════════════
	{ name: '迅发电浆炮Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '迅发电浆炮Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '迅发电浆炮Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '迅发电浆炮Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '迅发电浆炮Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '电幻步枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '电幻步枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '电幻步枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '电幻步枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '电幻步枪Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '苍鹰Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '苍鹰Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '苍鹰Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '苍鹰Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '苍鹰Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '螺钉步枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '螺钉步枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '螺钉步枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '螺钉步枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '螺钉步枪Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '布莱顿Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '布莱顿Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '布莱顿Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '布莱顿Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '布莱顿Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '伯斯顿Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '伯斯顿Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '伯斯顿Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '伯斯顿Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '伯斯顿Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '雷霆Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '雷霆Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '雷霆Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '雷霆Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '雷霆Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	// 骨葬Prime - 只有完整一套
	{ name: '骨葬Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '拉特昂Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '拉特昂Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '拉特昂Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '拉特昂Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '拉特昂Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '猎豹Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '猎豹Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '猎豹Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '猎豹Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '猎豹Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '月神Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '月神Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '月神Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '月神Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '月神Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '斯特拉迪瓦Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '斯特拉迪瓦Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '斯特拉迪瓦Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '斯特拉迪瓦Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '斯特拉迪瓦Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '席芭莉丝Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '席芭莉丝Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '席芭莉丝Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '席芭莉丝Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '席芭莉丝Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '双簧管Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '双簧管Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '双簧管Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '双簧管Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '双簧管Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '狂鲨Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '狂鲨Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '狂鲨Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '狂鲨Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '狂鲨Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '灭杀者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '灭杀者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '灭杀者Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '灭杀者Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '灭杀者Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '月面狂风Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '月面狂风Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '月面狂风Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '月面狂风Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '月面狂风Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '绝路Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '绝路Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '绝路Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '绝路Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '绝路Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '守望者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '守望者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '守望者Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '守望者Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '守望者Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '瓦德雅Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '瓦德雅Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '瓦德雅Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '瓦德雅Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '瓦德雅Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '碎裂者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '碎裂者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '碎裂者Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '碎裂者Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '碎裂者Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '野猪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '野猪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '野猪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '野猪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '野猪Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '塞多Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '塞多Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '塞多Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '塞多Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '塞多Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '科林斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '科林斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '科林斯Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '科林斯Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '科林斯Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '幻离子Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '幻离子Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '幻离子Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '幻离子Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '幻离子Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '斯特朗Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '斯特朗Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '斯特朗Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '斯特朗Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '斯特朗Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '猛虎Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '猛虎Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '猛虎Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '猛虎Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '猛虎Prime 枪托', type: 'Prime武器', subcategory: '枪托' },

	// ═══════════════ Prime 武器 - 曲翼武器（枪管/枪机/枪托 + 总图） ═══════════════
	{ name: '翠雀Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '翠雀Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '翠雀Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '翠雀Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '翠雀Prime 枪托', type: 'Prime武器', subcategory: '枪托' },
	{ name: '黑鸦Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '黑鸦Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '黑鸦Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '黑鸦Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '黑鸦Prime 枪托', type: 'Prime武器', subcategory: '枪托' },

	// ═══════════════ Prime 武器 - 弓（上弓臂/下弓臂/弓身/弓弦 + 总图） ═══════════════
	{ name: '西诺斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '西诺斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '西诺斯Prime 上弓臂', type: 'Prime武器', subcategory: '上弓臂' },
	{ name: '西诺斯Prime 下弓臂', type: 'Prime武器', subcategory: '下弓臂' },
	{ name: '西诺斯Prime 弓身', type: 'Prime武器', subcategory: '弓身' },
	{ name: '西诺斯Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },
	{ name: '大久和弓Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '大久和弓Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '大久和弓Prime 上弓臂', type: 'Prime武器', subcategory: '上弓臂' },
	{ name: '大久和弓Prime 下弓臂', type: 'Prime武器', subcategory: '下弓臂' },
	{ name: '大久和弓Prime 弓身', type: 'Prime武器', subcategory: '弓身' },
	{ name: '大久和弓Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },
	{ name: '帕里斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '帕里斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '帕里斯Prime 上弓臂', type: 'Prime武器', subcategory: '上弓臂' },
	{ name: '帕里斯Prime 下弓臂', type: 'Prime武器', subcategory: '下弓臂' },
	{ name: '帕里斯Prime 弓身', type: 'Prime武器', subcategory: '弓身' },
	{ name: '帕里斯Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },

	// ═══════════════ Prime 武器 - 弩（枪管/枪机/弓身/弓弦 + 总图） ═══════════════
	{ name: '噬蛇弩Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '噬蛇弩Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '噬蛇弩Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '噬蛇弩Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '噬蛇弩Prime 弓身', type: 'Prime武器', subcategory: '弓身' },
	{ name: '噬蛇弩Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },
	{ name: '诸葛连弩Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '诸葛连弩Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '诸葛连弩Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '诸葛连弩Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '诸葛连弩Prime 弓身', type: 'Prime武器', subcategory: '弓身' },
	{ name: '诸葛连弩Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },

	// ═══════════════ Prime 武器 - 弓弩复合（上弓臂/下弓臂/枪机/弓弦 + 总图） ═══════════════
	{ name: '布里斯提卡Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '布里斯提卡Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '布里斯提卡Prime 上弓臂', type: 'Prime武器', subcategory: '上弓臂' },
	{ name: '布里斯提卡Prime 下弓臂', type: 'Prime武器', subcategory: '下弓臂' },
	{ name: '布里斯提卡Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '布里斯提卡Prime 弓弦', type: 'Prime武器', subcategory: '弓弦' },

	// ═══════════════ Prime 武器 - 枪管/刀刃/握柄（+ 总图） ═══════════════
	{ name: '圣英Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '圣英Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '圣英Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '圣英Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '圣英Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '祸根Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '祸根Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '祸根Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '祸根Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '祸根Prime 握柄', type: 'Prime武器', subcategory: '握柄' },

	// ═══════════════ Prime 武器 - 次要武器（枪管/枪机 + 总图） ═══════════════
	{ name: '阿索代Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '阿索代Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '阿索代Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '阿索代Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '葬铭Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '葬铭Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '葬铭Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '葬铭Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '豪猪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '豪猪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '豪猪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '豪猪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '丧钟Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '丧钟Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '丧钟Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '丧钟Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '卡帕压力枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '卡帕压力枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '卡帕压力枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '卡帕压力枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '雷克斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '雷克斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '雷克斯Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '雷克斯Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '麦格努斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '麦格努斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '麦格努斯Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '麦格努斯Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '手鼓Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '手鼓Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '手鼓Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '手鼓Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '暗杀者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '暗杀者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '暗杀者Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '暗杀者Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '瓦斯托Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '瓦斯托Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '瓦斯托Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '瓦斯托Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '逐电Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '逐电Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '逐电Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '逐电Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '毒芽Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '毒芽Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '毒芽Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '毒芽Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '席尔火枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '席尔火枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '席尔火枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '席尔火枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '野马Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '野马Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '野马Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '野马Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '食人鱼Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '食人鱼Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '食人鱼Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '食人鱼Prime 枪机', type: 'Prime武器', subcategory: '枪机' },

	// ═══════════════ Prime 武器 - 次要武器-双枪（枪管/枪机/连接器 + 总图） ═══════════════
	{ name: '盗贼双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '盗贼双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '盗贼双枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '盗贼双枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '盗贼双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '阿利乌双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '阿利乌双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '阿利乌双枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '阿利乌双枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '阿利乌双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '螺钉双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '螺钉双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '螺钉双枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '螺钉双枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '螺钉双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '觉醒双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '觉醒双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '觉醒双枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '觉醒双枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '觉醒双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '野马双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '野马双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '野马双枪Prime 枪管', type: 'Prime武器', subcategory: '枪管' },
	{ name: '野马双枪Prime 枪机', type: 'Prime武器', subcategory: '枪机' },
	{ name: '野马双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },

	// ═══════════════ Prime 武器 - 次要武器-只有连接器（仅 总图/连接器） ═══════════════
	{ name: '雷克斯双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '雷克斯双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '雷克斯双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '麦格努斯双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '麦格努斯双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '麦格努斯双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '瓦斯托双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '瓦斯托双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '瓦斯托双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '轻灵月神双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '轻灵月神双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '轻灵月神双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },
	{ name: '史提托双枪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '史提托双枪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '史提托双枪Prime 连接器', type: 'Prime武器', subcategory: '连接器' },

	// ═══════════════ Prime 武器 - 次要武器-特殊 ═══════════════
	// 飞扬Prime（总图/镖袋/星镖）
	{ name: '飞扬Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '飞扬Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '飞扬Prime 镖袋', type: 'Prime武器', subcategory: '镖袋' },
	{ name: '飞扬Prime 星镖', type: 'Prime武器', subcategory: '星镖' },
	// 旋刃飞刀Prime（总图/镖袋/刀刃）
	{ name: '旋刃飞刀Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '旋刃飞刀Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '旋刃飞刀Prime 镖袋', type: 'Prime武器', subcategory: '镖袋' },
	{ name: '旋刃飞刀Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },

	// ═══════════════ Prime 武器 - 近战武器（刀刃/握柄 + 总图） ═══════════════
	{ name: '鲮鲤剑Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '鲮鲤剑Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '鲮鲤剑Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '鲮鲤剑Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '达克拉Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '达克拉Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '达克拉Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '达克拉Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '迦伦提恩Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '迦伦提恩Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '迦伦提恩Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '迦伦提恩Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '格拉姆Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '格拉姆Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '格拉姆Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '格拉姆Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '咀嚼金杖Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '咀嚼金杖Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '咀嚼金杖Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '咀嚼金杖Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '沙罗之牙Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '沙罗之牙Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '沙罗之牙Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '沙罗之牙Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '分裂斩斧Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '分裂斩斧Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '分裂斩斧Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '分裂斩斧Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '红隼Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '红隼Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '红隼Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '红隼Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '皇家拐刃Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '皇家拐刃Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '皇家拐刃Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '皇家拐刃Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '凯洛斯特Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '凯洛斯特Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '凯洛斯特Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '凯洛斯特Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '救赎者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '救赎者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '救赎者Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '救赎者Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '军扇Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '军扇Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '军扇Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '军扇Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '佐伦双斧Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '佐伦双斧Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '佐伦双斧Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '佐伦双斧Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '海波斯库拉对剑Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '海波斯库拉对剑Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '海波斯库拉对剑Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '海波斯库拉对剑Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '双短柄战镰Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '双短柄战镰Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '双短柄战镰Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '双短柄战镰Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '凯瑞斯双刀Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '凯瑞斯双刀Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '凯瑞斯双刀Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '凯瑞斯双刀Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '技巧之剑Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '技巧之剑Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '技巧之剑Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '技巧之剑Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '狼牙Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '狼牙Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '狼牙Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '狼牙Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '翁Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '翁Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '翁Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '翁Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '龙辰Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '龙辰Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '龙辰Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '龙辰Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '脉纹Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '脉纹Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '脉纹Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '脉纹Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '关刀Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '关刀Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '关刀Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '关刀Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '欧特鲁斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '欧特鲁斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '欧特鲁斯Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '欧特鲁斯Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '收割者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '收割者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '收割者Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '收割者Prime 握柄', type: 'Prime武器', subcategory: '握柄' },

	// ═══════════════ Prime 武器 - 近战-特殊（各自独特部件 + 总图） ═══════════════
	// 席瓦&神盾Prime（刀刃/握柄/护手）
	{ name: '席瓦&神盾Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '席瓦&神盾Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '席瓦&神盾Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '席瓦&神盾Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '席瓦&神盾Prime 护手', type: 'Prime武器', subcategory: '护手' },
	// 眼镜蛇&鹤Prime（刀刃/握柄/护手）
	{ name: '眼镜蛇&鹤Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '眼镜蛇&鹤Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '眼镜蛇&鹤Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '眼镜蛇&鹤Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '眼镜蛇&鹤Prime 护手', type: 'Prime武器', subcategory: '护手' },
	// 降灵追猎者Prime（握柄/链条）
	{ name: '降灵追猎者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '降灵追猎者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '降灵追猎者Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	{ name: '降灵追猎者Prime 链条', type: 'Prime武器', subcategory: '链条' },
	// 凯旋之爪Prime（手套/爪刃）
	{ name: '凯旋之爪Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '凯旋之爪Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '凯旋之爪Prime 手套', type: 'Prime武器', subcategory: '手套' },
	{ name: '凯旋之爪Prime 爪刃', type: 'Prime武器', subcategory: '爪刃' },
	// 战刃Prime（刀刃/圆盘）
	{ name: '战刃Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '战刃Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '战刃Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '战刃Prime 圆盘', type: 'Prime武器', subcategory: '圆盘' },
	// 铁钩手甲Prime（刀刃/拳套）
	{ name: '铁钩手甲Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '铁钩手甲Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '铁钩手甲Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '铁钩手甲Prime 拳套', type: 'Prime武器', subcategory: '拳套' },
	// 甲龙双拳Prime（刀刃/拳套）
	{ name: '甲龙双拳Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '甲龙双拳Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '甲龙双拳Prime 刀刃', type: 'Prime武器', subcategory: '刀刃' },
	{ name: '甲龙双拳Prime 拳套', type: 'Prime武器', subcategory: '拳套' },
	// 科加基Prime（拳套/靴子）
	{ name: '科加基Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '科加基Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '科加基Prime 拳套', type: 'Prime武器', subcategory: '拳套' },
	{ name: '科加基Prime 靴子', type: 'Prime武器', subcategory: '靴子' },
	// 重击巨锤Prime（锤头/握柄）
	{ name: '重击巨锤Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '重击巨锤Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '重击巨锤Prime 锤头', type: 'Prime武器', subcategory: '锤头' },
	{ name: '重击巨锤Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	// 创伤Prime（锤头/握柄）
	{ name: '创伤Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '创伤Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '创伤Prime 锤头', type: 'Prime武器', subcategory: '锤头' },
	{ name: '创伤Prime 握柄', type: 'Prime武器', subcategory: '握柄' },
	// 提佩多Prime（饰物/握柄）
	{ name: '提佩多Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '提佩多Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '提佩多Prime 饰物', type: 'Prime武器', subcategory: '饰物' },
	{ name: '提佩多Prime 握柄', type: 'Prime武器', subcategory: '握柄' },

	// ═══════════════ Prime 武器 - 守护（头部/外壳/系统 + 总图） ═══════════════
	{ name: '搬运者Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '搬运者Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '搬运者Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '搬运者Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '搬运者Prime 系统', type: 'Prime武器', subcategory: '系统' },
	{ name: '死亡魔方 Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '死亡魔方 Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '死亡魔方 Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '死亡魔方 Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '死亡魔方 Prime 系统', type: 'Prime武器', subcategory: '系统' },
	{ name: '赫利俄斯Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '赫利俄斯Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '赫利俄斯Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '赫利俄斯Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '赫利俄斯Prime 系统', type: 'Prime武器', subcategory: '系统' },
	{ name: '蛟龙Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '蛟龙Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '蛟龙Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '蛟龙Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '蛟龙Prime 系统', type: 'Prime武器', subcategory: '系统' },
	{ name: '鹦鹉螺 Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '鹦鹉螺 Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '鹦鹉螺 Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '鹦鹉螺 Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '鹦鹉螺 Prime 系统', type: 'Prime武器', subcategory: '系统' },
	{ name: '阴影 Prime 整套', type: 'Prime武器', subcategory: '整套' },
	{ name: '阴影 Prime 总图', type: 'Prime武器', subcategory: '总图' },
	{ name: '阴影 Prime 头部', type: 'Prime武器', subcategory: '头部' },
	{ name: '阴影 Prime 外壳', type: 'Prime武器', subcategory: '外壳' },
	{ name: '阴影 Prime 系统', type: 'Prime武器', subcategory: '系统' },

	// ═══════════════ 特殊武器 ═══════════════
	// Destreza Prime → 总图/刀刃/握柄
	{ name: '占位符 整套', type: '特殊武器', subcategory: '整套' },
	{ name: '占位符 总图', type: '特殊武器', subcategory: '总图' },
	{ name: '占位符 刀刃', type: '特殊武器', subcategory: '刀刃' },
	{ name: '占位符 握柄', type: '特殊武器', subcategory: '握柄' },
	

	// ═══════════════ MOD ═══════════════
	{ name: '占位符', type: 'MOD', subcategory: null },
	

	// ═══════════════ 未经分类 ═══════════════
	{ name: '占位符', type: '未经分类', subcategory: null },

];

// 物品类型对应的颜色（用于预览图标和色点）
var TYPE_COLORS = {
	'Prime战甲':   { bg: 'linear-gradient(135deg, rgba(201,164,74,0.3) 0%, rgba(160,128,48,0.15) 50%, rgba(80,60,20,0.4) 100%)', color: '#c9a44a' },
	'Prime武器':   { bg: 'linear-gradient(135deg, rgba(180,140,50,0.3) 0%, rgba(140,100,35,0.15) 50%, rgba(70,50,15,0.4) 100%)', color: '#b48c32' },
	'特殊武器':    { bg: 'linear-gradient(135deg, rgba(0,200,255,0.3) 0%, rgba(0,100,180,0.15) 50%, rgba(0,50,100,0.4) 100%)', color: '#00c8ff' },
	'MOD':         { bg: 'linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(100,60,200,0.15) 50%, rgba(60,30,120,0.4) 100%)', color: '#8b5cf6' },
	'未经分类':    { bg: 'linear-gradient(135deg, rgba(150,180,200,0.2) 0%, rgba(100,130,160,0.1) 50%, rgba(50,70,90,0.3) 100%)', color: 'rgba(150,180,200,0.6)' }
};

// 支持子分类筛选的类型
var SUBCATEGORY_TYPES = ['Prime战甲', 'Prime武器', '特殊武器'];

// 子分类选项
var SUBCATEGORIES = ['整套', '总图', '头部', '机体', '系统', '枪管', '枪机', '枪托', '刀刃', '握柄', '护手', '链条', '手套', '爪刃', '圆盘', '拳套', '靴子', '锤头', '饰物', '镖袋', '星镖', '连接器', '上弓臂', '下弓臂', '弓身', '弓弦', '外壳'];

// ==================== 物品图片映射 ====================
// 主名称 → 图片路径（整套/部件共用同一张主名称图片）
var ITEM_IMAGE_MAP = {
	// Prime战甲 (1)
	'Ash Prime': 'IMG/trade_items/1/Ash Prime.png',
	'Atlas Prime': 'IMG/trade_items/1/Atlas Prime.png',
	'Banshee Prime': 'IMG/trade_items/1/Banshee Prime.png',
	'Baruuk Prime': 'IMG/trade_items/1/Baruuk Prime.png',
	'Caliban Prime': 'IMG/trade_items/1/Caliban Prime.png',
	'Chroma Prime': 'IMG/trade_items/1/Chroma Prime.png',
	'Ember Prime': 'IMG/trade_items/1/Ember Prime.png',
	'Equinox Prime': 'IMG/trade_items/1/Equinox Prime.png',
	'Frost Prime': 'IMG/trade_items/1/Frost Prime.png',
	'Gara Prime': 'IMG/trade_items/1/Gara Prime.png',
	'Garuda Prime': 'IMG/trade_items/1/Garuda Prime.png',
	'Gauss Prime': 'IMG/trade_items/1/Gauss Prime.png',
	'Grendel Prime': 'IMG/trade_items/1/Grendel Prime.png',
	'Gyre Prime': 'IMG/trade_items/1/Gyre Prime.png',
	'Harrow Prime': 'IMG/trade_items/1/Harrow Prime.png',
	'Hildryn Prime': 'IMG/trade_items/1/Hildryn Prime.png',
	'Hydroid Prime': 'IMG/trade_items/1/Hydroid Prime.png',
	'Inaros Prime': 'IMG/trade_items/1/Inaros Prime.png',
	'Ivara Prime': 'IMG/trade_items/1/Ivara Prime.png',
	'Khora Prime': 'IMG/trade_items/1/Khora Prime.png',	
	'Lavos Prime': 'IMG/trade_items/1/Lavos Prime.png',
	'Limbo Prime': 'IMG/trade_items/1/Limbo Prime.png',
	'Loki Prime': 'IMG/trade_items/1/Loki Prime.png',
	'Mag Prime': 'IMG/trade_items/1/Mag Prime.png',
	'Mesa Prime': 'IMG/trade_items/1/Mesa Prime.png',
	'Mirage Prime': 'IMG/trade_items/1/Mirage Prime.png',
	'Nekros Prime': 'IMG/trade_items/1/Nekros Prime.png',	
	'Nezha Prime': 'IMG/trade_items/1/Nezha Prime.png',
	'Nidus Prime': 'IMG/trade_items/1/Nidus Prime.png',
	'Nyx Prime': 'IMG/trade_items/1/Nyx Prime.png',
	'Oberon Prime': 'IMG/trade_items/1/Oberon Prime.png',
	'Octavia Prime': 'IMG/trade_items/1/Octavia Prime.png',
	'Protea Prime': 'IMG/trade_items/1/Protea Prime.png',
	'Revenant Prime': 'IMG/trade_items/1/Revenant Prime.png',
	'Rhino Prime': 'IMG/trade_items/1/Rhino Prime.png',
	'Saryn Prime': 'IMG/trade_items/1/Saryn Prime.png',
	'Sevagoth Prime': 'IMG/trade_items/1/Sevagoth Prime.png',
	'Styanax Prime': 'IMG/trade_items/1/Styanax Prime.png',	
	'Titania Prime': 'IMG/trade_items/1/Titania Prime.png',
	'Trinity Prime': 'IMG/trade_items/1/Trinity Prime.png',
	'Valkyr Prime': 'IMG/trade_items/1/Valkyr Prime.png',
	'Vauban Prime': 'IMG/trade_items/1/Vauban Prime.png',
	'Volt Prime': 'IMG/trade_items/1/Volt Prime.png',
	'Voruna Prime': 'IMG/trade_items/1/Voruna Prime.png',
	'Wisp Prime': 'IMG/trade_items/1/Wisp Prime.png',
	'Wukong Prime': 'IMG/trade_items/1/Wukong Prime.png',
	'Xaku Prime': 'IMG/trade_items/1/Xaku Prime.png',
	'Yareli Prime': 'IMG/trade_items/1/Yareli Prime.png',
	'Zephyr Prime': 'IMG/trade_items/1/Zephyr Prime.png',
	
	
	
	// Prime武器 (2)
	//主武器
	'迅发电浆炮Prime': 'IMG/trade_items/2/迅发电浆炮Prime.png',
	'电幻步枪Prime': 'IMG/trade_items/2/电幻步枪Prime.png',
	'苍鹰Prime': 'IMG/trade_items/2/苍鹰Prime.png',
	'螺钉步枪Prime': 'IMG/trade_items/2/螺钉步枪Prime.png',
	'布莱顿Prime': 'IMG/trade_items/2/布莱顿Prime.png',
	'伯斯顿Prime': 'IMG/trade_items/2/伯斯顿Prime.png',
	'雷霆Prime': 'IMG/trade_items/2/雷霆Prime.png',
	'骨葬Prime': 'IMG/trade_items/2/骨葬Prime.png',
	'拉特昂Prime': 'IMG/trade_items/2/拉特昂Prime.png',
	'猎豹Prime': 'IMG/trade_items/2/猎豹Prime.png',
	'月神Prime': 'IMG/trade_items/2/月神Prime.png',
	'斯特拉迪瓦Prime': 'IMG/trade_items/2/斯特拉迪瓦Prime.png',
	'席芭莉丝Prime': 'IMG/trade_items/2/席芭莉丝Prime.png',
	'双簧管Prime': 'IMG/trade_items/2/双簧管Prime.png',
	'狂鲨Prime': 'IMG/trade_items/2/狂鲨Prime.png',
	'灭杀者Prime': 'IMG/trade_items/2/灭杀者Prime.png',
	'月面狂风Prime': 'IMG/trade_items/2/月面狂风Prime.png',
	'绝路Prime': 'IMG/trade_items/2/绝路Prime.png',
	'守望者Prime': 'IMG/trade_items/2/守望者Prime.png',
	'瓦德雅Prime': 'IMG/trade_items/2/瓦德雅Prime.png',
	'碎裂者Prime': 'IMG/trade_items/2/碎裂者Prime.png',
	'野猪Prime': 'IMG/trade_items/2/野猪Prime.png',
	'塞多Prime': 'IMG/trade_items/2/塞多Prime.png',
	'科林斯Prime': 'IMG/trade_items/2/科林斯Prime.png',
	'幻离子Prime': 'IMG/trade_items/2/幻离子Prime.png',
	'斯特朗Prime': 'IMG/trade_items/2/斯特朗Prime.png',
	'猛虎Prime': 'IMG/trade_items/2/猛虎Prime.png',	
	'西诺斯Prime': 'IMG/trade_items/2/西诺斯Prime.png',
	'大久和弓Prime': 'IMG/trade_items/2/大久和弓Prime.png',
	'帕里斯Prime': 'IMG/trade_items/2/帕里斯Prime.png',
	'噬蛇弩Prime': 'IMG/trade_items/2/噬蛇弩Prime.png',
	'诸葛连弩Prime': 'IMG/trade_items/2/诸葛连弩Prime.png',
	'圣英Prime': 'IMG/trade_items/2/圣英Prime.png',
	'祸根Prime': 'IMG/trade_items/2/祸根Prime.png',
	
	//次要武器
	'阿索代Prime': 'IMG/trade_items/2/阿索代Prime.png',
	'葬铭Prime': 'IMG/trade_items/2/葬铭Prime.png',
	'豪猪Prime': 'IMG/trade_items/2/豪猪Prime.png',
	'丧钟Prime': 'IMG/trade_items/2/丧钟Prime.png',
	'卡帕压力枪Prime': 'IMG/trade_items/2/卡帕压力枪Prime.png',
	'雷克斯Prime': 'IMG/trade_items/2/雷克斯Prime.png',
	'麦格努斯Prime': 'IMG/trade_items/2/麦格努斯Prime.png',
	'手鼓Prime': 'IMG/trade_items/2/手鼓Prime.png',
	'暗杀者Prime': 'IMG/trade_items/2/暗杀者Prime.png',
	'瓦斯托Prime': 'IMG/trade_items/2/瓦斯托Prime.png',
	'逐电Prime': 'IMG/trade_items/2/逐电Prime.png',
	'毒芽Prime': 'IMG/trade_items/2/毒芽Prime.png',
	'席尔火枪Prime': 'IMG/trade_items/2/席尔火枪Prime.png',
	'盗贼双枪Prime': 'IMG/trade_items/2/盗贼双枪Prime.png',
	'阿利乌双枪Prime': 'IMG/trade_items/2/阿利乌双枪Prime.png',
	'螺钉双枪Prime': 'IMG/trade_items/2/螺钉双枪Prime.png',
	'觉醒双枪Prime': 'IMG/trade_items/2/觉醒双枪Prime.png',
	'雷克斯双枪Prime': 'IMG/trade_items/2/雷克斯双枪Prime.png',
	'麦格努斯双枪Prime': 'IMG/trade_items/2/麦格努斯双枪Prime.png',
	'轻灵月神双枪Prime': 'IMG/trade_items/2/轻灵月神双枪Prime.png',
	'史提托双枪Prime': 'IMG/trade_items/2/史提托双枪Prime.png',
	'瓦斯托双枪Prime': 'IMG/trade_items/2/瓦斯托双枪Prime.png',
	'野马Prime': 'IMG/trade_items/2/野马Prime.png',
	'食人鱼Prime': 'IMG/trade_items/2/食人鱼Prime.png',
	'野马双枪Prime': 'IMG/trade_items/2/野马双枪Prime.png',
	'布里斯提卡Prime': 'IMG/trade_items/2/布里斯提卡Prime.png',
	'飞扬Prime': 'IMG/trade_items/2/飞扬Prime.png',
	'旋刃飞刀Prime': 'IMG/trade_items/2/旋刃飞刀Prime.png',
	
	//近战武器
	'鲮鲤剑Prime': 'IMG/trade_items/2/鲮鲤剑Prime.png',
	'达克拉Prime': 'IMG/trade_items/2/达克拉Prime.png',
	'迦伦提恩Prime': 'IMG/trade_items/2/迦伦提恩Prime.png',
	'格拉姆Prime': 'IMG/trade_items/2/格拉姆Prime.png',
	'咀嚼金杖Prime': 'IMG/trade_items/2/咀嚼金杖Prime.png',
	'沙罗之牙Prime': 'IMG/trade_items/2/沙罗之牙Prime.png',
	'分裂斩斧Prime': 'IMG/trade_items/2/分裂斩斧Prime.png',
	'席瓦&神盾Prime': 'IMG/trade_items/2/席瓦&神盾Prime.png',
	'眼镜蛇&鹤Prime': 'IMG/trade_items/2/眼镜蛇&鹤Prime.png',
	'战刃Prime': 'IMG/trade_items/2/战刃Prime.png',
	'红隼Prime': 'IMG/trade_items/2/红隼Prime.png',
	'皇家拐刃Prime': 'IMG/trade_items/2/皇家拐刃Prime.png',
	'铁钩手甲Prime': 'IMG/trade_items/2/铁钩手甲Prime.png',
	'甲龙双拳Prime': 'IMG/trade_items/2/甲龙双拳Prime.png',
	'凯洛斯特Prime': 'IMG/trade_items/2/凯洛斯特Prime.png',
	'科加基Prime': 'IMG/trade_items/2/科加基Prime.png',
	'救赎者Prime': 'IMG/trade_items/2/救赎者Prime.png',
	'军扇Prime': 'IMG/trade_items/2/军扇Prime.png',
	'佐伦双斧Prime': 'IMG/trade_items/2/佐伦双斧Prime.png',
	'海波斯库拉对剑Prime': 'IMG/trade_items/2/海波斯库拉对剑Prime.png',
	'双短柄战镰Prime': 'IMG/trade_items/2/双短柄战镰Prime.png',
	'凯瑞斯双刀Prime': 'IMG/trade_items/2/凯瑞斯双刀Prime.png',
	'技巧之剑Prime': 'IMG/trade_items/2/技巧之剑Prime.png',
	'狼牙Prime': 'IMG/trade_items/2/狼牙Prime.png',
	'翁Prime': 'IMG/trade_items/2/翁Prime.png',
	'降灵追猎者Prime': 'IMG/trade_items/2/降灵追猎者Prime.png',
	'龙辰Prime': 'IMG/trade_items/2/龙辰Prime.png',
	'重击巨锤Prime': 'IMG/trade_items/2/重击巨锤Prime.png',
	'凯旋之爪Prime': 'IMG/trade_items/2/凯旋之爪Prime.png',
	'脉纹Prime': 'IMG/trade_items/2/脉纹Prime.png',	
	'关刀Prime': 'IMG/trade_items/2/关刀Prime.png',
	'欧特鲁斯Prime': 'IMG/trade_items/2/欧特鲁斯Prime.png',
	'提佩多Prime': 'IMG/trade_items/2/提佩多Prime.png',
	'创伤Prime': 'IMG/trade_items/2/创伤Prime.png',
	'收割者Prime': 'IMG/trade_items/2/收割者Prime.png',
	
	//曲翼武器
	'翠雀Prime': 'IMG/trade_items/2/翠雀Prime.png',
	'黑鸦Prime': 'IMG/trade_items/2/黑鸦Prime.png',
	
	//守护
	'搬运者Prime': 'IMG/trade_items/2/搬运者Prime.png',
	'死亡魔方 Prime': 'IMG/trade_items/2/死亡魔方 Prime.png',
	'赫利俄斯Prime': 'IMG/trade_items/2/赫利俄斯Prime.png',
	'蛟龙Prime': 'IMG/trade_items/2/蛟龙Prime.png',
	'鹦鹉螺 Prime': 'IMG/trade_items/2/鹦鹉螺 Prime.png',
	'阴影 Prime': 'IMG/trade_items/2/阴影 Prime.png',

	
	
	// 特殊武器 (3)
	'占位符': 'IMG/trade_items/3/Destreza Prime.png',
	


	// MOD (4)
	'占位符': 'IMG/trade_items/4/Arcane Energize.png',
	




	// 未经分类 (5)
	'占位符': 'IMG/trade_items/5/Forma.png',

};

// 暴露到全局
window.ITEM_CATALOG = ITEM_CATALOG;
window.TYPE_COLORS = TYPE_COLORS;
window.SUBCATEGORY_TYPES = SUBCATEGORY_TYPES;
window.SUBCATEGORIES = SUBCATEGORIES;
window.ITEM_IMAGE_MAP = ITEM_IMAGE_MAP;
