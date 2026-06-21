    // ═══════════════════════════════════════════════════════════════
    //  【配置】Supabase 
    // ═══════════════════════════════════════════════════════════════
    const SUPABASE_URL = 'https://rfmgembzxqbqsegquxmh.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_9qFlq7jJcXvnkZOIoxinug_RVotHtGw';
    
    let sb = null;
    let currentUser = null;
    let panelOpen = false;
    let redeemItem = null;
    
    // 游戏跳转基础路径
    const GAME_PATH = 'GAME.html';
    
    function initSupabase() {
        if (sb) return true;
        if (typeof supabase === 'undefined') {
            console.error('Supabase 库未加载');
            return false;
        }
        sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        return true;
    }