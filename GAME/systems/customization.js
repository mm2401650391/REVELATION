// ═══════════════════════════════════════════════════════════════
//  装扮 / 主题系统 (customization.js)
// ═══════════════════════════════════════════════════════════════

function applyUITheme(theme) {
    var body = document.body;
    if (!body) return;
    body.classList.remove('theme-cyber', 'theme-voidstel', 'theme-orokin');
    if (theme === 'cyber') body.classList.add('theme-cyber');
    else if (theme === 'voidstel') body.classList.add('theme-voidstel');
    else if (theme === 'orokin') body.classList.add('theme-orokin');
}

function getEffectiveStreak() {
    if (typeof gameData === 'undefined' || !gameData) return 0;
    var streak = gameData.streak ?? 0;
    var lastDate = gameData.last_login_reward_date || '';
    // 未签到过的新帐号（lastDate 为空或 '1970-01-01'），streak 视为 0
    if (!lastDate || lastDate === '1970-01-01') return 0;
    return streak;
}

function setUITheme(theme) {
    // 主题解锁天数配置（admin 帐号不受限）
    var THEME_REQUIREMENTS = {
        cyber:    { days: 10, name: '💠 霓虹' },
        voidstel: { days: 20, name: '🌌 虚空' },
        orokin:   { days: 30, name: '🔺 遗迹' }
    };
    if (typeof isAdmin === 'function' && !isAdmin()) {
        var req = THEME_REQUIREMENTS[theme];
        if (req) {
            var streak = getEffectiveStreak();
            if (streak < req.days) {
                if (typeof showToast === 'function') {
                    showToast(req.name + '需要连续签到 ' + req.days + ' 天解锁（当前 ' + streak + ' 天）', 'warning');
                }
                return;
            }
        }
    }
    if (typeof setSetting === 'function') setSetting('uiTheme', theme);
    applyUITheme(theme);
    renderThemeSelector();
    if (typeof showToast === 'function') showToast('界面主题已切换', 'success');
}

function renderThemeSelector() {
    var container = document.getElementById('themeSelectorContainer');
    if (!container) return;

    var s = (typeof getSettings === 'function') ? getSettings() : {};
    var streak = getEffectiveStreak();
    var admin = (typeof isAdmin === 'function') ? isAdmin() : false;
    var currentTheme = (s && s.uiTheme) || 'default';

    var themeOptions = [
        { key: 'default',  label: '🌑 默认', color: '#c8a84b' },
        { key: 'cyber',    label: '💠 霓虹' + ((!admin && streak < 10) ? ' (' + streak + '/10)' : ''), color: '#00d4ff' },
        { key: 'voidstel', label: '🌌 虚空' + ((!admin && streak < 20) ? ' (' + streak + '/20)' : ''), color: '#7b68ee' },
        { key: 'orokin',   label: '🔺 遗迹' + ((!admin && streak < 30) ? ' (' + streak + '/30)' : ''), color: '#ffd700' }
    ];

    var themeHtml = themeOptions.map(function(o) {
        var isActive = currentTheme === o.key;
        var style = isActive
            ? 'background: ' + o.color + '; color: #000; border-color: ' + o.color + '; box-shadow: 0 0 12px ' + o.color + ', inset 0 0 8px rgba(255,255,255,0.3); transform: scale(1.05);'
            : 'border-color: #444; color: #888;';
        return '<button class="btn" onclick="setUITheme(\'' + o.key + '\')" style="flex:1; font-size:0.85rem; padding:10px 6px; ' + style + '">' + o.label + '</button>';
    }).join('');

    container.innerHTML =
        '<div style="margin-bottom: 20px;">' +
            '<div style="color: var(--tenno-gold); font-family: \'Orbitron\'; font-size: 0.95rem; margin-bottom: 10px;">🎨 界面主题</div>' +
            '<div style="display: flex; gap: 8px; flex-wrap: wrap;">' + themeHtml + '</div>' +
        '</div>';
}

// 挂载到全局
window.applyUITheme = applyUITheme;
window.setUITheme = setUITheme;
window.renderThemeSelector = renderThemeSelector;
window.getEffectiveStreak = getEffectiveStreak;
