// ═══════════════════════════════════════════════════════════════
//  showToast 兜底实现（如果 GAME.html 中未定义则使用此版本）
// ═══════════════════════════════════════════════════════════════
if (typeof showToast === 'undefined') {
    function showToast(message, type) {
        // 如果 GAME.html 中已定义全局 showToast，优先使用
        if (typeof window.showToast === 'function' && window.showToast !== showToast) {
            window.showToast(message, type);
            return;
        }

        // 兜底实现：简单的 alert 或 console
        console.log('[' + (type || 'info') + '] ' + message);

        // 尝试创建简单的 toast 提示
        var toast = document.createElement('div');
        toast.style.cssText = 'position: fixed; top: 20px; left: 50%; transform: translateX(-50%); ' +
            'background: rgba(0,0,0,0.85); color: #fff; padding: 10px 24px; border-radius: 8px; ' +
            'font-size: 0.9rem; z-index: 99999; pointer-events: none; opacity: 0; ' +
            'transition: opacity 0.3s; border: 1px solid rgba(255,255,255,0.1); ' +
            'box-shadow: 0 4px 20px rgba(0,0,0,0.5); font-family: "Noto Sans SC", sans-serif;';

        // 根据类型设置颜色
        var colors = {
            'success': '#4eff4e',
            'error': '#ff4444',
            'warning': '#ffaa00',
            'info': '#00d4ff'
        };
        var color = colors[type] || '#fff';
        toast.style.borderLeft = '4px solid ' + color;
        toast.textContent = message;

        document.body.appendChild(toast);

        // 显示动画
        requestAnimationFrame(function() {
            toast.style.opacity = '1';
        });

        // 2秒后自动消失
        setTimeout(function() {
            toast.style.opacity = '0';
            setTimeout(function() { toast.remove(); }, 300);
        }, 2000);
    }

    // 挂载到 window
    window.showToast = showToast;
}

					// ═══════════════════════════════════════════════════════════════
					//  卡片测试子面板 - 添加到测试面板中
					// ═══════════════════════════════════════════════════════════════
					
					// 全局变量：标记是否已显示卡片测试子面板
					var cardTestPanelVisible = false;
					
					// ═══════════════════════════════════════════════════════════════
					//  1. 打开卡片测试子面板
					// ═══════════════════════════════════════════════════════════════
					function openCardTestPanel() {
					    var modalOverlay = document.getElementById('modalOverlay');
					    var modalTitle = document.getElementById('modalTitle');
					    var modalContent = document.getElementById('modalContent');
					
					    if (!modalOverlay || !modalTitle || !modalContent) return;
					
					    modalTitle.textContent = '🎴 卡片测试控制台';
					    var modalBox = modalContent.closest('.modal');
					    if (modalBox) {
					        modalBox.style.maxWidth = '1220px';
					        modalBox.style.width = '96vw';
					        modalBox.style.minWidth = '960px';
					        modalBox.style.maxHeight = '92vh';
					        modalBox.style.overflow = 'visible';
					        modalBox.style.padding = '18px';
					    }
					
					    modalContent.style.maxWidth = '1180px';
					    modalContent.style.width = '96vw';
					    modalContent.style.maxHeight = 'none';
					    modalContent.style.overflow = 'visible';
					    modalContent.innerHTML = 
					        '<div style="width: 100%; max-width: 1180px; font-size: 0.82rem;">' +
					
					            // ===== 第一行：基础操作 =====
					            '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 12px;">' +
					                '<button class="btn" onclick="adminCardClearAll()" style="background: linear-gradient(135deg, #5a1a1a, var(--grineer-red)); font-size: 0.85rem;">' +
					                    '🗑️ 卡片清零' +
					                '</button>' +
					                '<button class="btn" onclick="adminCardUnlockAll()" style="background: linear-gradient(135deg, #2a5a2a, var(--infested-green)); font-size: 0.85rem;">' +
					                    '📖 全图鉴解锁' +
					                '</button>' +
					                '<button class="btn" onclick="adminCardResetStars()" style="background: linear-gradient(135deg, #5a5a1a, var(--tenno-gold)); font-size: 0.85rem;">' +
					                    '⭐ 星级清零' +
					                '</button>' +
					                '<button class="btn" onclick="adminMakeDeckRewardClaimable()" style="background: linear-gradient(135deg, #7a4b00, #ffd700); color: #111; font-size: 0.85rem;">' +
					                    '🎁 触发卡组奖励' +
					                '</button>' +
					            '</div>' +
					
					            '<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start;">' +
					            // ===== 第二行：卡片弹窗测试 =====
					            '<div style="background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 10px; padding: 12px;">' +
					                '<div style="font-family: Orbitron; color: var(--orokin-cyan); font-size: 0.86rem; margin-bottom: 10px; letter-spacing: 1px;">🎴 卡片弹窗测试</div>' +
					                '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">' +
					                    '<button class="btn" onclick="testCardAcquireModal(&quot;battle&quot;)" style="background: linear-gradient(135deg, var(--grineer-red), #ff6666); font-size: 0.8rem;">' +
					                        '⚔️ 战斗卡片弹窗' +
					                    '</button>' +
					                    '<button class="btn" onclick="testCardAcquireModal(&quot;mining&quot;)" style="background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: #000; font-size: 0.8rem;">' +
					                        '⛏️ 挖矿卡片弹窗' +
					                    '</button>' +
					                    '<button class="btn" onclick="testCardAcquireModal(&quot;gathering&quot;)" style="background: linear-gradient(135deg, #2a5a2a, var(--infested-green)); font-size: 0.8rem;">' +
					                        '🌿 采集卡片弹窗' +
					                    '</button>' +
					                    '<button class="btn" onclick="testCardAcquireModal(&quot;random&quot;)" style="background: linear-gradient(135deg, var(--sentient-purple), #cc44cc); color: #fff; font-size: 0.8rem;">' +
					                        '🎲 随机卡片弹窗' +
					                    '</button>' +
					                '</div>' +
					            '</div>' +
					
					            // ===== 第三行：卡片升星测试 =====
					            '<div style="background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 10px; padding: 12px;">' +
					                '<div style="font-family: Orbitron; color: var(--tenno-gold); font-size: 0.86rem; margin-bottom: 10px; letter-spacing: 1px;">⭐ 卡片升星测试</div>' +
					                '<div id="cardUpgradeTestArea" style="max-height: 260px; overflow-y: auto;">' +
					                    '<div style="color: #666; text-align: center; padding: 20px;">点击"加载卡片列表"查看可升星卡片</div>' +
					                '</div>' +
					                '<button class="btn" onclick="renderCardUpgradeList()" style="width: 100%; margin-top: 10px; background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan)); font-size: 0.85rem;">' +
					                    '📋 加载卡片列表' +
					                '</button>' +
					            '</div>' +
					
					            // ===== 第四行：掉落测试 =====
					            '<div style="background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 10px; padding: 12px;">' +
					                '<div style="font-family: Orbitron; color: var(--infested-green); font-size: 0.86rem; margin-bottom: 10px; letter-spacing: 1px;">🎲 掉落测试</div>' +
					                '<div style="display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 10px;">' +
					                    '<button class="btn" onclick="testCardDropBattle()" style="background: linear-gradient(135deg, var(--grineer-red), #ff6666); font-size: 0.8rem;">' +
					                        '⚔️ 战斗卡片掉落' +
					                    '</button>' +
					                    '<button class="btn" onclick="testCardDropMining()" style="background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: #000; font-size: 0.8rem;">' +
					                        '⛏️ 挖矿卡片掉落' +
					                    '</button>' +
					                    '<button class="btn" onclick="testCardDropGathering()" style="background: linear-gradient(135deg, #2a5a2a, var(--infested-green)); font-size: 0.8rem;">' +
					                        '🌿 采集卡片掉落' +
					                    '</button>' +
					                '</div>' +
					                '<div id="cardDropTestResult" style="background: rgba(0,0,0,0.5); border: 1px solid #222; border-radius: 6px; padding: 8px; max-height: 90px; overflow-y: auto; font-size: 0.72rem; color: #888; display: none;"></div>' +
					            '</div>' +
					            '</div>' +
					
					            // ===== 关闭按钮 =====
					            '<button class="btn" onclick="closeModal()" style="width: 100%; margin-top: 12px; background: rgba(255,255,255,0.05); border-color: #444; color: #888;">' +
					                '❌ 关闭面板' +
					            '</button>' +
					        '</div>';
					
					    modalOverlay.style.zIndex = '9999';
					    modalOverlay.classList.add('active');
					    cardTestPanelVisible = true;
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  2. 卡片清零（删除所有卡片，保留碎片）
					// ═══════════════════════════════════════════════════════════════
					function adminCardClearAll() {
					    if (!confirm('确定要清空所有卡片吗？此操作不可恢复！')) return;
					
					    var cards = window.playerCards || playerCards || {};
					    var count = 0;
					
					    for (var id in cards) {
					        if (id !== '_shards') {
					            delete cards[id];
					            count++;
					        }
					    }
					
					    savePlayerCards();
					    updateCodexOverview();
					
					    if (codexViewState.level === 'cards') {
					        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
					    }
					
					    showToast('已清空 ' + count + ' 张卡片', 'warning');
					
					    // 刷新升星列表
					    if (cardTestPanelVisible) {
					        renderCardUpgradeList();
					    }
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  3. 全图鉴解锁（获得所有卡片各1张，1星）
					// ═══════════════════════════════════════════════════════════════
					function adminCardUnlockAll() {
					    if (!confirm('确定要解锁全图鉴吗？')) return;
					
					    var cards = window.playerCards || playerCards || {};
					    var count = 0;
					
					    for (var deckId in DECK_CARDS) {
					        var deck = DECK_CARDS[deckId];
					        for (var i = 0; i < deck.length; i++) {
					            var card = deck[i];
					            if (!cards[card.id]) {
					                cards[card.id] = {
					                    count: 1,
					                    starLevel: 1,
					                    firstGetTime: new Date().toISOString(),
					                    data: card
					                };
					                count++;
					            }
					        }
					    }
					
					    savePlayerCards();
					    updateCodexOverview();
					
					    if (codexViewState.level === 'cards') {
					        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
					    }
					
					    showToast('已解锁 ' + count + ' 张新卡片！', 'success');
					
					    // 刷新升星列表
					    if (cardTestPanelVisible) {
					        renderCardUpgradeList();
					    }
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  4. 星级清零（所有已收集卡片重置为1星）
					// ═══════════════════════════════════════════════════════════════
					function adminCardResetStars() {
					    if (!confirm('确定要重置所有卡片星级为1星吗？')) return;
					
					    var cards = window.playerCards || playerCards || {};
					    var count = 0;
					
					    for (var id in cards) {
					        if (id !== '_shards' && cards[id]) {
					            cards[id].starLevel = 1;
					            count++;
					        }
					    }
					
					    savePlayerCards();
					
					    if (codexViewState.level === 'cards') {
					        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
					    }
					
					    showToast('已重置 ' + count + ' 张卡片的星级为1星', 'warning');
					
					    // 刷新升星列表
					    if (cardTestPanelVisible) {
					        renderCardUpgradeList();
					    }
					}

					// ═══════════════════════════════════════════════════════════════
					//  4.1 触发卡组奖励测试（制造可领取状态，不直接发奖励）
					// ═══════════════════════════════════════════════════════════════
					function adminMakeDeckRewardClaimable() {
					    if (typeof DECK_CARDS === 'undefined') {
					        showToast('未找到卡组数据', 'error');
					        return;
					    }
					    var deckId = 'e_zone1';
					    var deck = DECK_CARDS[deckId];
					    if (!deck || deck.length === 0) {
					        showToast('测试卡组不存在', 'error');
					        return;
					    }
					    var cards = window.playerCards || playerCards || {};
					    var currentStar = (typeof calculateDeckStarLevel === 'function') ? calculateDeckStarLevel(deckId) : 0;
					    var targetStar = Math.min(5, Math.max(1, currentStar + 1));
					    var previousClaimed = [];
					    for (var ps = 0; ps < targetStar; ps++) previousClaimed.push(ps);
					    for (var i = 0; i < deck.length; i++) {
					        var card = deck[i];
					        cards[card.id] = {
					            count: Math.max(1, cards[card.id] ? (cards[card.id].count || 1) : 1),
					            starLevel: targetStar,
					            firstGetTime: (cards[card.id] && cards[card.id].firstGetTime) || new Date().toISOString(),
					            data: card
					        };
					    }
					    window.playerCards = cards;
					    playerCards = cards;
					    if (typeof savePlayerCards === 'function') savePlayerCards();

					    // 设置为：之前档位已领，当前targetStar档位可领取；点击卡组后才发放奖励
					    if (typeof getClaimedDeckRewards === 'function' && typeof saveClaimedDeckRewards === 'function') {
					        var claimed = getClaimedDeckRewards();
					        claimed[deckId] = previousClaimed;
					        saveClaimedDeckRewards(claimed);
					    } else {
					        var userId = (typeof currentUser !== 'undefined' && currentUser && currentUser.id) ? currentUser.id : 'guest';
					        var key = 'codex_deck_rewards_' + userId;
					        var data = {};
					        try { data = JSON.parse(localStorage.getItem(key) || '{}'); } catch (e) { data = {}; }
					        data[deckId] = previousClaimed;
					        localStorage.setItem(key, JSON.stringify(data));
					    }

					    if (typeof renderCodexDecks === 'function') {
					        renderCodexDecks('grineer', 'huanyu');
					    }
					    if (typeof updateCodexOverview === 'function') updateCodexOverview();
					    if (typeof saveGameData === 'function') saveGameData();
					    if (cardTestPanelVisible) renderCardUpgradeList();
					    showToast('已触发“游掠凶形”整体' + targetStar + '星奖励可领取状态，请到该卡组卡片点击领取。', 'success');
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  5. 卡片获得弹窗测试（不自动关闭）
					// ═══════════════════════════════════════════════════════════════
					function testCardAcquireModal(type) {
					    var card = null;
					    var sourceName = '测试掉落';
					
					    if (type === 'battle') {
					        // 随机选择一张战斗卡片
					        var battleDecks = ['e_zone1', 'e_zone2', 'e_zone3'];
					        var randomDeck = battleDecks[Math.floor(Math.random() * battleDecks.length)];
					        var deck = DECK_CARDS[randomDeck];
					        card = deck[Math.floor(Math.random() * deck.length)];
					        sourceName = 'Grineer ' + card.name;
					    } else if (type === 'mining') {
					        // 随机选择一张挖矿卡片
					        var miningDecks = ['m_zone1', 'm_zone2', 'm_zone3'];
					        var randomDeck = miningDecks[Math.floor(Math.random() * miningDecks.length)];
					        var deck = DECK_CARDS[randomDeck];
					        card = deck[Math.floor(Math.random() * deck.length)];
					        sourceName = '矿脉采集';
					    } else if (type === 'gathering') {
					        // 随机选择一张采集卡片
					        var gatheringDecks = ['g_zone1', 'g_zone2'];
					        var randomDeck = gatheringDecks[Math.floor(Math.random() * gatheringDecks.length)];
					        var deck = DECK_CARDS[randomDeck];
					        card = deck[Math.floor(Math.random() * deck.length)];
					        sourceName = '植物采集';
					    } else {
					        // 随机选择任意类型
					        var allDecks = Object.keys(DECK_CARDS);
					        var randomDeck = allDecks[Math.floor(Math.random() * allDecks.length)];
					        var deck = DECK_CARDS[randomDeck];
					        card = deck[Math.floor(Math.random() * deck.length)];
					        sourceName = '随机测试';
					    }
					
					    if (!card) {
					        showToast('未找到卡片数据', 'error');
					        return;
					    }
					
					    // 先添加到玩家库存（模拟真实获得）
					    var result = addPlayerCard(card);
					
					    // 显示弹窗（不自动关闭）
					    showCardAcquireModalNoAutoClose(card, sourceName, result.isNew);
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  6. 卡片获得弹窗（不自动关闭版本）
					// ═══════════════════════════════════════════════════════════════
					function showCardAcquireModalNoAutoClose(cardData, sourceName, isNew) {
					    var modalOverlay = document.getElementById('modalOverlay');
					    var modalTitle = document.getElementById('modalTitle');
					    var modalContent = document.getElementById('modalContent');
					
					    if (!modalOverlay || !modalTitle || !modalContent) return;
					
					    var rarityColors = ['#888', '#4eff4e', '#4488ff', '#ff66ff'];
					    var rarityNames = ['普通', '稀有', '史诗', '传说'];
					    var rarityColor = rarityColors[(cardData.rarity || 1) - 1] || '#888';
					    var rarityName = rarityNames[(cardData.rarity || 1) - 1] || '普通';
					
					    // 获取星级样式（新获得默认1星）
					    var cards = window.playerCards || playerCards || {};
					    var cardInfo = cards[cardData.id];
					    var currentStar = cardInfo ? (cardInfo.starLevel || 1) : 1;
					    var starStyle = getCardStarStyle(cardData, currentStar);
					
					    var styleColor = starStyle ? starStyle.color : rarityColor;
					    var sBg = starStyle ? starStyle.bg : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a1a 100%)';
					    var sBorder = starStyle ? starStyle.border : styleColor;
					    var sGlow = starStyle ? starStyle.shadow : '0 0 50px ' + rarityColor + '40';
					    var sParticle = starStyle ? starStyle.particle : '✦';
					    var sParticleColor = starStyle ? starStyle.particleColor : styleColor;
					    var sTypeName = starStyle ? starStyle.typeName : rarityName;
					
					    var starLevel = currentStar;
					    var borderWidth = starLevel;
					    var isMaxStar = starLevel >= 5;
					    var isHighStar = starLevel >= 3;
					    var isEliteStar = starLevel >= 4;
					
					    // 动态阴影
					    var dynamicShadow = sGlow;
					    if (isHighStar) dynamicShadow += ', 0 0 ' + (starLevel * 8) + 'px ' + styleColor + '30';
					    if (isEliteStar) dynamicShadow += ', 0 0 ' + (starLevel * 12) + 'px ' + styleColor + '20';
					    if (isMaxStar) dynamicShadow += ', 0 0 ' + (starLevel * 20) + 'px ' + styleColor + '15, inset 0 0 ' + (starLevel * 8) + 'px ' + styleColor + '10';
					
					    var dynamicBorder = borderWidth + 'px solid ' + sBorder;
					    var borderAnim = isHighStar ? 'animation: cardBorderPulse' + starLevel + ' 2s ease-in-out infinite alternate;' : '';
					
					    // 生成粒子
					    var particlesHtml = '';
					    if (isHighStar) {
					        var particleCount = starLevel * 2 + 3;
					        for (var pi = 0; pi < particleCount; pi++) {
					            var px = 5 + Math.random() * 90;
					            var py = 5 + Math.random() * 90;
					            var pDelay = (Math.random() * 3).toFixed(2);
					            var pDuration = (2 + Math.random() * 3).toFixed(2);
					            var pSize = (0.4 + Math.random() * 0.8).toFixed(2);
					            var pOpacity = (0.2 + Math.random() * 0.4).toFixed(2);
					
					            var pStyle = isMaxStar ? 
					                'background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' : 
					                'color: ' + sParticleColor + ';';
					
					            particlesHtml += '<span style="position: absolute; left: ' + px + '%; top: ' + py + '%; font-size: ' + pSize + 'rem; opacity: ' + pOpacity + '; animation: cardStarFloat ' + pDuration + 's ease-in-out ' + pDelay + 's infinite; z-index: 10; pointer-events: none; ' + pStyle + ' text-shadow: 0 0 ' + (starLevel * 2) + 'px ' + sParticleColor + ';">' + sParticle + '</span>';
					        }
					    }
					
					    // 5星流光线条
					    var flowLines = isMaxStar ? 
					        '<div style="position: absolute; top: 0; left: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite; z-index: 6;"></div>' +
					        '<div style="position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite reverse; z-index: 6;"></div>' : '';
					
					    // 图标动画
					    var iconAnimation = starLevel >= 3 ? 'cardStarFloat 3s ease-in-out infinite' : 'none';
					    var cardIconAnimation = starLevel >= 4 ? 'cardStarFloat 2.5s ease-in-out infinite' : 'none';
					
					    var iconGlow = 'filter: drop-shadow(0 0 ' + (starLevel * 4) + 'px ' + styleColor + ') drop-shadow(0 0 ' + (starLevel * 8) + 'px ' + styleColor + '40);';
					    var cardIconGlow = 'filter: drop-shadow(0 0 ' + (starLevel * 5) + 'px ' + styleColor + ') drop-shadow(0 0 ' + (starLevel * 10) + 'px ' + styleColor + '50);';
					
					    modalTitle.textContent = '🎴 获得卡片';
					
					    modalContent.innerHTML = 
					        '<div style="text-align: center; padding: 20px; background: ' + sBg + '; border: ' + dynamicBorder + '; border-radius: 14px; box-shadow: ' + dynamicShadow + '; position: relative; overflow: hidden; ' + borderAnim + '">' +
					
					            // 粒子层
					            (isHighStar ? '<div style="position: absolute; inset: 0; z-index: 5; pointer-events: none; overflow: hidden;">' + particlesHtml + '</div>' : '') +
					
					            // 内发光叠加层
					            (isEliteStar ? '<div style="position: absolute; inset: 0; z-index: 3; pointer-events: none; box-shadow: inset 0 0 ' + (starLevel * 10) + 'px ' + styleColor + '20; border-radius: inherit;"></div>' : '') +
					
					            // 5星流光线条
					            flowLines +
					
					            // 内容区
					            '<div style="position: relative; z-index: 4;">' +
					                '<div style="font-size: 3rem; margin-bottom: 10px; color: ' + styleColor + '; ' + iconGlow + ' animation: ' + iconAnimation + ';">' + sParticle + '</div>' +
					                '<div style="font-size: 4rem; margin-bottom: 10px; color: ' + styleColor + '; ' + cardIconGlow + ' animation: ' + cardIconAnimation + ';">' + (cardData.icon || '🎴') + '</div>' +
					                '<div style="font-family: Orbitron; color: ' + styleColor + '; font-size: 1.5rem; margin-bottom: 5px; text-shadow: 0 0 ' + (starLevel * 3) + 'px ' + styleColor + '80, 0 0 ' + (starLevel * 6) + 'px ' + styleColor + '40;">' + cardData.name + '</div>' +
					                '<div style="color: ' + styleColor + '; font-size: 0.9rem; margin-bottom: 5px; letter-spacing: 2px; text-shadow: 0 0 ' + (starLevel * 2) + 'px ' + styleColor + '60;">' + '★'.repeat(currentStar) + '☆'.repeat(5 - currentStar) + '</div>' +
					                '<div style="color: #888; font-size: 0.85rem; margin-bottom: 5px;">' + (cardData.desc || '') + '</div>' +
					                '<div style="color: #666; font-size: 0.8rem; margin-bottom: 15px;">来源: ' + (sourceName || '未知') + '</div>' +
					                '<div style="color: var(--infested-green); font-size: 0.85rem; font-weight: 700; text-shadow: 0 0 10px rgba(78,255,78,0.3);">' + (isNew ? '✨ 新卡片获得！' : '♻️ 卡片重复，已转化为碎片') + '</div>' +
					
					                // 手动关闭按钮（因为没有自动关闭）
					                '<button class="btn" onclick="closeModal()" style="margin-top: 20px; width: 200px; background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan));">' +
					                    '✓ 确认' +
					                '</button>' +
					            '</div>' +
					        '</div>';
					
					    modalOverlay.style.zIndex = '9999';
					    modalOverlay.classList.add('active');
					
					    // 【关键】不设置自动关闭定时器
					    // 原版的 showCardAcquireModal 有 setTimeout(closeModal, 3000)
					    // 这里故意不调用，让玩家手动关闭
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  7. 渲染卡片升星列表
					// ═══════════════════════════════════════════════════════════════
					function renderCardUpgradeList() {
					    var container = document.getElementById('cardUpgradeTestArea');
					    if (!container) return;
					
					    var cards = window.playerCards || playerCards || {};
					    var collectedCards = [];
					
					    // 收集所有已拥有的卡片
					    for (var id in cards) {
					        if (id === '_shards') continue;
					        var cardInfo = cards[id];
					        if (cardInfo && cardInfo.data) {
					            collectedCards.push({
					                id: id,
					                data: cardInfo.data,
					                count: cardInfo.count || 0,
					                starLevel: cardInfo.starLevel || 1
					            });
					        }
					    }
					
					    if (collectedCards.length === 0) {
					        container.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">暂无卡片，请先解锁图鉴</div>';
					        return;
					    }
					
					    // 按星级排序（低星在前，方便一级级升）
					    collectedCards.sort(function(a, b) {
					        return a.starLevel - b.starLevel;
					    });
					
					    var html = '<div style="display: flex; flex-direction: column; gap: 8px;">';
					
					    collectedCards.forEach(function(card) {
					        var cardData = card.data;
					        var currentStar = card.starLevel;
					        var maxStar = 5;
					        var isMaxed = currentStar >= maxStar;
					
					        // 计算升星需求
					        var cardType = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
					        var req = getUpgradeRequirement(cardType, currentStar);
					        var canUpgrade = !isMaxed;
					
					        var starColor = currentStar >= 5 ? '#ff0000' : currentStar >= 4 ? '#ffd700' : currentStar >= 3 ? '#ff66ff' : currentStar >= 2 ? '#4488ff' : '#4eff4e';
					
					        html += 
					            '<div style="display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.3); border: 1px solid #333; border-radius: 8px; padding: 10px;">' +
					                '<div style="font-size: 2rem; min-width: 40px; text-align: center;">' + (cardData.icon || '🎴') + '</div>' +
					                '<div style="flex: 1; min-width: 0;">' +
					                    '<div style="font-size: 0.85rem; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + cardData.name + '</div>' +
					                    '<div style="font-size: 0.75rem; color: ' + starColor + ';">' + '★'.repeat(currentStar) + '☆'.repeat(maxStar - currentStar) + ' | 持有: ' + card.count + '张</div>' +
					                '</div>' +
					                '<button class="btn" onclick="adminUpgradeCardStar(\'' + card.id + '\')" ' +
					                    'style="width: auto; padding: 6px 12px; font-size: 0.75rem; ' + 
					                    (isMaxed ? 'background: #333; color: #666; cursor: not-allowed;' : 'background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: #000;') + '" ' +
					                    (isMaxed ? 'disabled' : '') + '>' +
					                    (isMaxed ? '⭐ 已满' : '⭐ 升星') +
					                '</button>' +
					            '</div>';
					    });
					
					    html += '</div>';
					    container.innerHTML = html;
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  8. 单个卡片升星
					// ═══════════════════════════════════════════════════════════════
function adminUpgradeCardStar(cardId) {
    var cards = window.playerCards || playerCards || {};
    var cardInfo = cards[cardId];
    if (!cardInfo) return;

    var cardData = cardInfo.data;
    var currentStar = cardInfo.starLevel || 1;

    if (currentStar >= 5) {
        showToast('该卡片已达到最高星级！', 'warning');
        return;
    }

    // 管理员模式：无消耗升星
    cardInfo.starLevel = currentStar + 1;
    savePlayerCards();

    showToast(cardData.name + ' 升至 ' + cardInfo.starLevel + ' 星！', 'success');

    // 刷新列表
    renderCardUpgradeList();

    // 刷新图鉴显示
    if (codexViewState.level === 'cards') {
        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
    }
}
					
					// ═══════════════════════════════════════════════════════════════
					//  9. 战斗卡片掉落测试
					// ═══════════════════════════════════════════════════════════════
					function testCardDropBattle() {
					    var resultDiv = document.getElementById('cardDropTestResult');
					    if (!resultDiv) return;
					    resultDiv.style.display = 'block';
					
					    var results = {};
					    var totalRuns = 100;
					    var totalDrops = 0;
					
					    for (var i = 0; i < totalRuns; i++) {
					        // 模拟战斗掉落 - 遍历所有战斗卡组
					        var battleDecks = ['e_zone1', 'e_zone2', 'e_zone3'];
					        var randomDeck = battleDecks[Math.floor(Math.random() * battleDecks.length)];
					        var deck = DECK_CARDS[randomDeck];
					
					        if (deck) {
					            var randomCard = deck[Math.floor(Math.random() * deck.length)];
					            var dropChance = 0.30; // 30%基础掉率
					
					            if (Math.random() < dropChance) {
					                var key = randomCard.icon + ' ' + randomCard.name;
					                results[key] = (results[key] || 0) + 1;
					                totalDrops++;
					
					                // 实际添加到玩家库存（测试用）
					                addPlayerCard(randomCard);
					            }
					        }
					    }
					
					    var html = '<div style="color: var(--tenno-gold); font-family: Orbitron; margin-bottom: 8px;">⚔️ ' + totalRuns + '次战斗模拟</div>';
					    for (var key in results) {
					        var percent = (results[key] / totalRuns * 100).toFixed(1);
					        html += '<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #222;">' +
					            '<span>' + key + '</span>' +
					            '<span style="color: var(--orokin-cyan);">' + results[key] + '次 (' + percent + '%)</span>' +
					            '</div>';
					    }
					    html += '<div style="margin-top: 8px; color: #666; font-size: 0.7rem;">总掉落: ' + totalDrops + ' | 平均掉率: ' + (totalDrops / totalRuns * 100).toFixed(1) + '%</div>';
					
					    resultDiv.innerHTML = html;
					    showToast('战斗卡片掉落测试完成，卡片已添加到库存！', 'success');
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  10. 挖矿卡片掉落测试
					// ═══════════════════════════════════════════════════════════════
					function testCardDropMining() {
					    var resultDiv = document.getElementById('cardDropTestResult');
					    if (!resultDiv) return;
					    resultDiv.style.display = 'block';
					
					    var results = {};
					    var totalRuns = 100;
					    var totalDrops = 0;
					
					    for (var i = 0; i < totalRuns; i++) {
					        // 模拟挖矿 - 使用 VEIN_TYPES 中的 cardId
					        if (typeof VEIN_TYPES !== 'undefined' && VEIN_TYPES.length > 0) {
					            var randomVein = VEIN_TYPES[Math.floor(Math.random() * VEIN_TYPES.length)];
					
					            if (randomVein.cardId) {
					                var card = findCardById(randomVein.cardId);
					                if (card) {
					                    var dropChance = 0.20; // 20%基础掉率
					                    var quality = ['perfect', 'good', 'normal'][Math.floor(Math.random() * 3)];
					                    var qMult = { perfect: 1.5, good: 1.2, normal: 1.0 }[quality] || 1.0;
					
					                    if (Math.random() < dropChance * qMult) {
					                        var key = card.icon + ' ' + card.name;
					                        results[key] = (results[key] || 0) + 1;
					                        totalDrops++;
					
					                        // 实际添加
					                        addPlayerCard(card);
					                    }
					                }
					            }
					        }
					    }
					
					    var html = '<div style="color: var(--tenno-gold); font-family: Orbitron; margin-bottom: 8px;">⛏️ ' + totalRuns + '次挖矿模拟</div>';
					    for (var key in results) {
					        var percent = (results[key] / totalRuns * 100).toFixed(1);
					        html += '<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #222;">' +
					            '<span>' + key + '</span>' +
					            '<span style="color: var(--orokin-cyan);">' + results[key] + '次 (' + percent + '%)</span>' +
					            '</div>';
					    }
					    html += '<div style="margin-top: 8px; color: #666; font-size: 0.7rem;">总掉落: ' + totalDrops + ' | 平均掉率: ' + (totalDrops / totalRuns * 100).toFixed(1) + '%</div>';
					
					    resultDiv.innerHTML = html;
					    showToast('挖矿卡片掉落测试完成，卡片已添加到库存！', 'success');
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  11. 采集卡片掉落测试
					// ═══════════════════════════════════════════════════════════════
					function testCardDropGathering() {
					    var resultDiv = document.getElementById('cardDropTestResult');
					    if (!resultDiv) return;
					    resultDiv.style.display = 'block';
					
					    var results = {};
					    var totalRuns = 100;
					    var totalDrops = 0;
					
					    for (var i = 0; i < totalRuns; i++) {
					        // 模拟采集 - 使用 GATHERING_DROP_CONFIG 中的 cardId
					        if (typeof GATHERING_DROP_CONFIG !== 'undefined') {
					            var regions = Object.keys(GATHERING_DROP_CONFIG);
					            var randomRegion = regions[Math.floor(Math.random() * regions.length)];
					            var region = GATHERING_DROP_CONFIG[randomRegion];
					
					            if (region && region.gatherables && region.gatherables.length > 0) {
					                var randomPlant = region.gatherables[Math.floor(Math.random() * region.gatherables.length)];
					
					                if (randomPlant.cardId) {
					                    var card = findCardById(randomPlant.cardId);
					                    if (card) {
					                        var dropChance = 0.20;
					                        var quality = ['perfect', 'good', 'normal'][Math.floor(Math.random() * 3)];
					                        var qMult = { perfect: 1.5, good: 1.2, normal: 1.0 }[quality] || 1.0;
					
					                        if (Math.random() < dropChance * qMult) {
					                            var key = card.icon + ' ' + card.name;
					                            results[key] = (results[key] || 0) + 1;
					                            totalDrops++;
					
					                            // 实际添加
					                            addPlayerCard(card);
					                        }
					                    }
					                }
					            }
					        }
					    }
					
					
					    var html = '<div style="color: var(--tenno-gold); font-family: Orbitron; margin-bottom: 8px;">🌿 ' + totalRuns + '次采集模拟</div>';
					    for (var key in results) {
					        var percent = (results[key] / totalRuns * 100).toFixed(1);
					        html += '<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #222;">' +
					            '<span>' + key + '</span>' +
					            '<span style="color: var(--orokin-cyan);">' + results[key] + '次 (' + percent + '%)</span>' +
					            '</div>';
					    }
					    html += '<div style="margin-top: 8px; color: #666; font-size: 0.7rem;">总掉落: ' + totalDrops + ' | 平均掉率: ' + (totalDrops / totalRuns * 100).toFixed(1) + '%</div>';
					
					    resultDiv.innerHTML = html;
					    showToast('采集卡片掉落测试完成，卡片已添加到库存！', 'success');
					}
