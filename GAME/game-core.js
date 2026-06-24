//防开发者和右键工具

(function() {
    var destroyed = false;
    
    function destroy() {
        if (destroyed) return;
        destroyed = true;
        document.body.innerHTML = '<div style="position:fixed;inset:0;background:#000;color:#ff4444;display:flex;align-items:center;justify-content:center;font-size:2rem;">请关闭开发者工具并刷新游戏</div>';
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


// 变量名兼容（音频控制台使用currentTrack，用户代码使用currentTrackIndex）
if (typeof currentTrackIndex !== 'undefined' && typeof currentTrack === 'undefined') {
    currentTrack = currentTrackIndex;
}
if (typeof currentTrack !== 'undefined' && typeof currentTrackIndex === 'undefined') {
    currentTrackIndex = currentTrack;
}
// 确保两个变量都有初始值
if (typeof currentTrack === 'undefined') {
    currentTrack = 0;
}
if (typeof currentTrackIndex === 'undefined') {
    currentTrackIndex = 0;
}

// 确保音频播放器变量和函数存在
if (typeof isPlaying === 'undefined') {
    isPlaying = false;
}

// playTrack 函数（如果未定义）
if (typeof playTrack === 'undefined') {
    playTrack = function() {
        var audio = document.getElementById('bgMusic');
        if (!audio) return;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() {
                isPlaying = true;
                updatePlayButton();
            }).catch(function(e) {
                console.error('播放失败:', e);
                isPlaying = false;
                updatePlayButton();
            });
        }
    };
}

// updatePlayButton 函数（如果未定义）
if (typeof updatePlayButton === 'undefined') {
    updatePlayButton = function() {
        var btn = document.getElementById('playPauseBtn');
        if (btn) {
            btn.textContent = isPlaying ? '⏸' : '▶';
        }
        var consoleBtn = document.getElementById('musicConsolePlayBtn');
        if (consoleBtn) {
            consoleBtn.textContent = isPlaying ? '⏸' : '▶';
        }
    };
}

// updateProgress 函数（如果未定义）
if (typeof updateProgress === 'undefined') {
    updateProgress = function() {
        var audio = document.getElementById('bgMusic');
        if (!audio) return;
        var progressBar = document.getElementById('progressBar');
        if (progressBar && audio.duration) {
            progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
        }
    };
}

// renderPlaylist 函数（如果未定义）
if (typeof renderPlaylist === 'undefined') {
    renderPlaylist = function() {
        var container = document.getElementById('playlistItems');
        if (!container || !playlist) return;
        container.innerHTML = '';
        playlist.forEach(function(track, index) {
            var item = document.createElement('div');
            item.className = 'playlist-item' + (index === currentTrack ? ' active' : '');
            item.innerHTML = '<span class="playlist-item-index">' + (index + 1) + '</span>' +
                '<div class="playlist-item-info"><div class="playlist-item-title">' + (track.title || '未知') + '</div>' +
                '<div class="playlist-item-artist">' + (track.artist || '') + '</div></div>' +
                '<span class="playlist-item-duration">' + (track.duration || '--:--') + '</span>';
            item.onclick = function() {
                currentTrack = index;
                loadTrack(currentTrack);
                playTrack();
                renderPlaylist();
            };
            container.appendChild(item);
        });
    };
}


// getPlayerStats 函数（如果 combat_system.js 未加载）
if (typeof getPlayerStats === 'undefined') {
    getPlayerStats = function() {
        // 优先使用 combat_system.js 中的 getPlayerBaseStats
        if (typeof getPlayerBaseStats === 'function') {
            var level = (gameData && gameData.warframe_level) || 1;
            var stats = getPlayerBaseStats(level);
            return {
                hp: stats.maxHp,
                maxHp: stats.maxHp,
                shield: stats.maxShield || 100,
                maxShield: stats.maxShield || 100,
                energy: 100,
                attack: stats.attack,
                defense: stats.defense,
                speed: stats.speed,
                level: level,
                name: stats.name || 'Tenno'
            };
        }

        // 后备计算
        if (!gameData) return { hp: 100, maxHp: 100, attack: 10, defense: 5, speed: 10, shield: 100, energy: 100, level: 1, name: 'Tenno' };

        var level = gameData.warframe_level || 1;
        var wf = (typeof WARFRAMES !== 'undefined') ? (WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur) : null;
        var stats = wf ? (wf.stats || { health: 100, shield: 100, energy: 100, armor: 100, speed: 10 }) : { health: 100, shield: 100, energy: 100, armor: 100, speed: 10 };

        var maxHp = Math.floor(80 + (level - 1) * 5);
        var maxShield = Math.floor(60 + (level - 1) * 4);
        var attack = Math.floor(20 + (level - 1) * 3);
        var defense = Math.floor(10 + (level - 1) * 1);
        var speed = Math.floor(10 + (level - 1) * 0.2);

        return {
            hp: maxHp,
            maxHp: maxHp,
            shield: maxShield,
            maxShield: maxShield,
            energy: stats.energy || 100,
            attack: attack,
            defense: defense,
            speed: speed,
            level: level,
            name: wf ? (wf.name || 'Tenno') : 'Tenno'
        };
    };
}


// getRandomEnemy 函数（包装 getRandomEnemyByZone）
if (typeof getRandomEnemy === 'undefined' && typeof getRandomEnemyByZone === 'function') {
    getRandomEnemy = function(planet, zone) {
        // 获取玩家等级
        var playerLevel = 1;
        if (typeof getCurrentWarframeData === 'function') {
            var wfData = getCurrentWarframeData();
            playerLevel = wfData.level || 1;
        } else if (gameData && gameData.warframe_level) {
            playerLevel = gameData.warframe_level;
        }

        // 使用 combat_system.js 中的 getRandomEnemyByZone
        if (zone) {
            return getRandomEnemyByZone(zone, playerLevel);
        } else if (planet && planet.zones && planet.zones.length > 0) {
            // 如果没有选择具体区域，随机选择一个
            var randomZone = planet.zones[Math.floor(Math.random() * planet.zones.length)];
            return getRandomEnemyByZone(randomZone, playerLevel);
        }

        // 最后的后备
        return {
            id: 'g_001',
            name: '屠夫',
            icon: '🔴',
            level: 1,
            hp: 100,
            maxHp: 100,
            attack: 10,
            defense: 5,
            speed: 10,
            dropRate: 0.35,
            faction: 'grineer',
            type: 'normal'
        };
    };
}

// ═══════════════════════════════════════════════════════════════
//  Maroo 市集申秉之魂显示（从矩阵 id: excalibur_umbra_prime 读取）
// ═══════════════════════════════════════════════════════════════
function updateMarooPoints() {
	var marooPointsEl = document.getElementById('marooPoints');
	if (!marooPointsEl) return;

	var warehouse = window.warehouse || [];
	var sbItem = null;

	// 方法1: 通过 name 查找（矩阵中存储的是 name）
	sbItem = warehouse.find(function(w) { return w && w.name === '申秉之魂'; });

	

	// 获取数量
	var amount = sbItem ? (sbItem.amount || 0) : 0;

	marooPointsEl.textContent = amount;
}

// 覆盖 enterMarooMarket 函数
window.enterMarooMarket = function() {
	document.getElementById('marooMarketEntrance').style.display = 'none';
	document.getElementById('primeShopArea').style.display = 'none';
	document.getElementById('page-maroo').style.display = 'block';
	updateMarooPoints();

	if (typeof renderMarooSellGrid === 'function') renderMarooSellGrid();
	if (typeof renderMarooBuyGrid === 'function') renderMarooBuyGrid();

	document.querySelectorAll('.nav-item').forEach(function(item) { item.classList.remove('active'); });
	var navItems = document.querySelectorAll('.nav-item');
	for (var i = 0; i < navItems.length; i++) {
		if (navItems[i].getAttribute('onclick') && navItems[i].getAttribute('onclick').includes("'shop'")) {
			navItems[i].classList.add('active');
			break;
		}
	}
};

// 覆盖 backToPrimeShop 函数
window.backToPrimeShop = function() {
	document.getElementById('marooMarketEntrance').style.display = 'block';
	document.getElementById('primeShopArea').style.display = 'block';
	document.getElementById('page-maroo').style.display = 'none';
	updateMarooPoints();
};

// ═══════════════════════════════════════════════════════════════
//  音频控制台全局函数挂载（确保HTML onclick可访问）
// ═══════════════════════════════════════════════════════════════
window.musicTogglePlay = function() {
    if (typeof togglePlay === 'function') togglePlay();
    if (typeof updateMusicConsolePlayButton === 'function') updateMusicConsolePlayButton();
    if (typeof musicConsoleUpdateProgress === 'function') musicConsoleUpdateProgress();
};
window.musicPrev = function() {
    if (typeof prevTrack === 'function') prevTrack();
    setTimeout(function() {
        if (typeof renderMusicConsole === 'function') renderMusicConsole();
    }, 100);
};
window.musicNext = function() {
    if (typeof nextTrack === 'function') nextTrack();
    setTimeout(function() {
        if (typeof renderMusicConsole === 'function') renderMusicConsole();
    }, 100);
};
window.musicSetMode = function(mode) {
    if (typeof playMode !== 'undefined') playMode = mode;
    if (typeof updateMusicModeButtons === 'function') updateMusicModeButtons();
    if (typeof showToast === 'function') showToast('播放模式: ' + (mode === 'loop' ? '列表循环' : mode === 'single' ? '单曲循环' : '随机播放'), 'info');
};
window.musicToggleMute = function() {
    if (typeof toggleMute === 'function') toggleMute();
    var volumeSlider = document.getElementById('musicConsoleVolumeSlider');
    var volumeText = document.getElementById('musicConsoleVolumeText');
    var volumeIcon = document.getElementById('musicConsoleVolumeIcon');
    if (volumeSlider && typeof currentVolume !== 'undefined') volumeSlider.value = currentVolume;
    if (volumeText && typeof currentVolume !== 'undefined') volumeText.textContent = currentVolume + '%';
    if (volumeIcon && typeof currentVolume !== 'undefined') {
        volumeIcon.textContent = currentVolume === 0 ? '🔇' : (currentVolume < 30 ? '🔈' : (currentVolume < 70 ? '🔉' : '🔊'));
    }
};
window.musicSeek = function(event) {
    var audio = document.getElementById('bgMusic');
    if (!audio || !audio.duration) return;
    var container = document.getElementById('musicConsoleProgressContainer');
    if (!container) return;
    var rect = container.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var percent = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = percent * audio.duration;
    if (typeof musicConsoleUpdateProgress === 'function') musicConsoleUpdateProgress();
};
window.musicSetVolume = function(value) {
    if (typeof setVolume === 'function') setVolume(value);
    var volumeText = document.getElementById('musicConsoleVolumeText');
    if (volumeText) volumeText.textContent = value + '%';
    var volumeIcon = document.getElementById('musicConsoleVolumeIcon');
    if (volumeIcon) {
        volumeIcon.textContent = value == 0 ? '🔇' : (value < 30 ? '🔈' : (value < 70 ? '🔉' : '🔊'));
    }
};
window.musicSelectTrack = function(index) {
    if (typeof playlist === 'undefined' || index < 0 || index >= playlist.length) return;
    if (typeof currentTrack !== 'undefined') currentTrack = index;
    if (typeof loadTrack === 'function') loadTrack(index);
    if (typeof playTrack === 'function') playTrack();
    if (typeof renderMusicConsole === 'function') renderMusicConsole();
    if (typeof updatePlayButton === 'function') updatePlayButton();
    if (typeof updateProgress === 'function') updateProgress();
    if (typeof renderPlaylist === 'function') renderPlaylist();
};


// ═══════════════════════════════════════════════════════════════
//  移动端检测与适配系统
// ═══════════════════════════════════════════════════════════════
(function() {
    "use strict";

    // 检测是否为移动设备
    window.isMobile = function() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // 检测是否为触摸设备
    window.isTouchDevice = function() {
        return 'ontouchstart' in window || 
               navigator.maxTouchPoints > 0 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    // 获取设备方向
    window.getOrientation = function() {
        if (window.screen && window.screen.orientation) {
            return window.screen.orientation.type;
        }
        return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
    };

    // 防抖resize处理
    let resizeTimer = null;
    window.addEventListener('resize', function() {
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // 触发移动端布局调整
            if (window.isMobile()) {
                adjustMobileLayout();
            }
        }, 250);
    });

    // 方向变化监听
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            if (window.isMobile()) {
                adjustMobileLayout();
            }
        }, 300);
    });

    // 移动端布局调整
    function adjustMobileLayout() {
        // 调整导航菜单滚动位置
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && window.isMobile()) {
            const activeItem = navMenu.querySelector('.nav-item.active');
            if (activeItem) {
                activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }

        // 调整模态框位置
        const modals = document.querySelectorAll('.modal-overlay.active');
        modals.forEach(function(modal) {
            const modalContent = modal.querySelector('.modal, .confirm-modal');
            if (modalContent) {
                modalContent.style.maxHeight = (window.innerHeight * 0.85) + 'px';
            }
        });

        // 确保内容区域不被底部导航遮挡
        const mainContent = document.querySelector('.main-content');
        if (mainContent && window.isMobile()) {
            const navHeight = document.querySelector('.nav-menu')?.offsetHeight || 70;
            mainContent.style.paddingBottom = (navHeight + 20) + 'px';
        }
    }

    // 初始化时检测
    document.addEventListener('DOMContentLoaded', function() {
        
        if (window.isMobile()) {
            document.body.classList.add('mobile-device');
            adjustMobileLayout();

            // 添加触摸反馈
            document.querySelectorAll('.btn, .nav-item, .mission-card, .shop-item, .foundry-item, .planet-card, .codex-tab').forEach(function(el) {
                el.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.97)';
                    this.style.opacity = '0.9';
                }, { passive: true });
                el.addEventListener('touchend', function() {
                    this.style.transform = '';
                    this.style.opacity = '';
                }, { passive: true });
            });

            // 防止双击缩放
            let lastTouchEnd = 0;
            document.addEventListener('touchend', function(e) {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });

            // 隐藏键盘时调整布局
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(function(input) {
                input.addEventListener('blur', function() {
                    setTimeout(function() {
                        window.scrollTo(0, 0);
                        document.body.scrollTop = 0;
                    }, 100);
                });
            });
        }

        if (window.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    });

    // 暴露全局方法
    window.adjustMobileLayout = adjustMobileLayout;
})();





	(function() {
		"use strict";
		// ═══════════════════════════════════════════════════════════════
		//  战甲选择（提前定义，确保 loadGameData 调用时可用）
		// ═══════════════════════════════════════════════════════════════
function showWarframeSelect(user) {
    const loginScreen = document.getElementById('loginScreen');
    if (loginScreen) loginScreen.classList.add('hidden');

    const gameContainer = document.getElementById('gameContainer');
    if (gameContainer) gameContainer.style.display = 'block';

    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');

    if (!modalOverlay || !modalTitle || !modalContent) {
        console.error('Modal 元素不存在！');
        setTimeout(() => showWarframeSelect(user), 100);
        return;
    }

    if (typeof STARTER_WARFRAMES === 'undefined') {
        console.error('STARTER_WARFRAMES 未定义！');
        showToast('战甲数据加载失败，请刷新页面', 'error');
        return;
    }

    modalOverlay.classList.remove('hidden');
    modalOverlay.style.display = 'flex';
    modalOverlay.classList.add('active');
    modalOverlay.style.zIndex = '9999';
    modalOverlay._warframeSelectMode = true;

    const closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.style.display = 'none';
    modalTitle.style.display = 'none';

    // ===== DOM API 构建 =====
    const container = document.createElement('div');
    container.id = 'warframeSelectContainer';
    container.style.cssText = 'width:100%;max-width:600px;margin:0 auto;position:relative;';

    // 桌面端箭头
    const prevArrow = document.createElement('div');
    prevArrow.className = 'wf-nav-arrow wf-nav-prev';
    prevArrow.textContent = '◀';
    prevArrow.style.cssText = 'position:absolute;left:-50px;top:50%;transform:translateY(-50%);width:40px;height:40px;background:rgba(0,0,0,0.6);border:1px solid var(--tenno-gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.2rem;color:var(--tenno-gold);z-index:10;transition:all 0.3s;user-select:none;';
    container.appendChild(prevArrow);

    const nextArrow = document.createElement('div');
    nextArrow.className = 'wf-nav-arrow wf-nav-next';
    nextArrow.textContent = '▶';
    nextArrow.style.cssText = 'position:absolute;right:-50px;top:50%;transform:translateY(-50%);width:40px;height:40px;background:rgba(0,0,0,0.6);border:1px solid var(--tenno-gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1.2rem;color:var(--tenno-gold);z-index:10;transition:all 0.3s;user-select:none;';
    container.appendChild(nextArrow);

    // 滑动容器 - 关键：overflow:hidden 防止露出其他回响
    const slider = document.createElement('div');
    slider.style.cssText = 'overflow:hidden;position:relative;width:100%;';

    const track = document.createElement('div');
    track.id = 'warframeTrack';
    track.style.cssText = 'display:flex;transition:transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);';

    // 构建战甲回响
    for (let i = 0; i < STARTER_WARFRAMES.length; i++) {
        const key = STARTER_WARFRAMES[i];
        const wf = WARFRAMES[key];

        const card = document.createElement('div');
        card.className = 'warframe-slide-card';
        card.dataset.index = i;
        card.dataset.key = key;
        card.style.cssText = 'flex:0 0 100%;padding:20px;box-sizing:border-box;text-align:center;transition:all 0.3s;min-width:0;';

        // 图片区域
        const imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'position:relative;margin-bottom:15px;';

        const imgCircle = document.createElement('div');
        imgCircle.style.cssText = 'width:180px;height:180px;margin:0 auto;background:radial-gradient(circle, rgba(200,168,75,0.15) 0%, transparent 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;';

        if (wf.image) {
            const img = document.createElement('img');
            img.src = wf.image;
            img.style.cssText = 'width:160px;height:160px;object-fit:contain;filter:drop-shadow(0 0 20px rgba(200,168,75,0.5));transition:transform 0.3s;';
            img.onerror = function() {
                this.style.display = 'none';
                const span = document.createElement('span');
                span.style.cssText = 'font-size:6rem;filter:drop-shadow(0 0 15px rgba(200,168,75,0.4));';
                span.textContent = wf.icon;
                imgCircle.appendChild(span);
            };
            imgCircle.appendChild(img);
        } else {
            const span = document.createElement('span');
            span.style.cssText = 'font-size:6rem;filter:drop-shadow(0 0 15px rgba(200,168,75,0.4));';
            span.textContent = wf.icon;
            imgCircle.appendChild(span);
        }

        imgWrap.appendChild(imgCircle);

        const ring = document.createElement('div');
        ring.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);width:200px;height:200px;border:2px dashed rgba(200,168,75,0.3);border-radius:50%;animation:rotate 20s linear infinite;pointer-events:none;';
        imgWrap.appendChild(ring);
        card.appendChild(imgWrap);

        // 名称
        const nameDiv = document.createElement('div');
        nameDiv.style.cssText = 'font-family:Orbitron;color:var(--tenno-gold);font-size:1.6rem;margin-bottom:8px;text-shadow:0 0 15px rgba(200,168,75,0.4);';
        nameDiv.textContent = wf.name;
        card.appendChild(nameDiv);

        // 描述
        const descDiv = document.createElement('div');
        descDiv.style.cssText = 'color:#888;font-size:0.85rem;margin-bottom:15px;line-height:1.5;max-width:280px;margin-left:auto;margin-right:auto;';
        descDiv.textContent = wf.desc || '';
        card.appendChild(descDiv);

        // 按钮区域：◀ [选择按钮] ▶
        const btnArea = document.createElement('div');
        btnArea.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:10px;';

        // 手机端左箭头
        const mobilePrev = document.createElement('div');
        mobilePrev.className = 'wf-nav-arrow wf-nav-prev-mobile';
        mobilePrev.textContent = '◀';
        mobilePrev.style.cssText = 'width:36px;height:36px;background:rgba(0,0,0,0.6);border:1px solid var(--tenno-gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;color:var(--tenno-gold);transition:all 0.3s;user-select:none;flex-shrink:0;';
        btnArea.appendChild(mobilePrev);

        // 选择按钮
        const selectBtn = document.createElement('button');
        selectBtn.className = 'wf-select-btn';
        selectBtn.dataset.key = key;
        selectBtn.style.cssText = 'padding:10px 30px;background:linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold));color:var(--void-black);border:none;border-radius:8px;font-family:Orbitron;font-size:0.9rem;cursor:pointer;transition:all 0.3s;letter-spacing:2px;white-space:nowrap;';
        selectBtn.textContent = '✨ 选择 ' + wf.name;
        btnArea.appendChild(selectBtn);

        // 手机端右箭头
        const mobileNext = document.createElement('div');
        mobileNext.className = 'wf-nav-arrow wf-nav-next-mobile';
        mobileNext.textContent = '▶';
        mobileNext.style.cssText = 'width:36px;height:36px;background:rgba(0,0,0,0.6);border:1px solid var(--tenno-gold-dim);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:0.9rem;color:var(--tenno-gold);transition:all 0.3s;user-select:none;flex-shrink:0;';
        btnArea.appendChild(mobileNext);

        card.appendChild(btnArea);
        track.appendChild(card);
    }

    slider.appendChild(track);
    container.appendChild(slider);

    // 指示器
    const indicatorWrap = document.createElement('div');
    indicatorWrap.style.cssText = 'display:flex;justify-content:center;margin-top:12px;gap:8px;';

    const indicatorDots = [];
    for (let i = 0; i < STARTER_WARFRAMES.length; i++) {
        const dot = document.createElement('div');
        dot.className = 'wf-indicator';
        dot.dataset.index = i;
        dot.style.cssText = 'width:8px;height:8px;border-radius:50%;background:#333;transition:all 0.3s;cursor:pointer;';
        indicatorWrap.appendChild(dot);
        indicatorDots.push(dot);
    }
    container.appendChild(indicatorWrap);

    modalContent.innerHTML = '';
    modalContent.appendChild(container);

    // 样式
    let style = document.getElementById('warframeSelectStyle');
    if (style) style.remove();

    style = document.createElement('style');
    style.id = 'warframeSelectStyle';
    style.textContent = 
        '.warframe-slide-card:hover img { transform: scale(1.05); } ' +
        '.warframe-slide-card:active { transform: scale(0.98); } ' +
        '@keyframes rotate { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } } ' +
        '.wf-indicator.active { background: var(--tenno-gold) !important; box-shadow: 0 0 8px var(--tenno-gold); } ' +
        '.wf-nav-arrow:hover { background: rgba(200,168,75,0.2) !important; border-color: var(--tenno-gold) !important; } ' +
        '.wf-nav-prev:hover, .wf-nav-next:hover { transform: translateY(-50%) scale(1.1); } ' +
        '.wf-nav-prev-mobile:hover, .wf-nav-next-mobile:hover { transform: scale(1.1); background: rgba(200,168,75,0.2) !important; } ' +
        '@media (max-width: 768px) { ' +
        '  #warframeSelectContainer { max-width: 100% !important; padding: 0 10px; } ' +
        '  .warframe-slide-card { padding: 15px 5px !important; } ' +
        '  .warframe-slide-card img { width: 120px !important; height: 120px !important; } ' +
        '  .wf-nav-prev, .wf-nav-next { display: none !important; } ' +
        '  .wf-select-btn { padding: 10px 20px !important; font-size: 0.85rem !important; } ' +
        '}' +
        '@media (min-width: 769px) { ' +
        '  .wf-nav-prev-mobile, .wf-nav-next-mobile { display: none !important; } ' +
        '}';
    document.head.appendChild(style);

    initWarframeSliderDOM(prevArrow, nextArrow, track, indicatorDots);
}

function showWarframeConfirm(warframeKey) {
    const wf = WARFRAMES[warframeKey];
    if (!wf) return;
    
    let confirmOverlay = document.getElementById('warframeConfirmOverlay');
    if (confirmOverlay) confirmOverlay.remove();
    
    confirmOverlay = document.createElement('div');
    confirmOverlay.id = 'warframeConfirmOverlay';
    confirmOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    
    const modalBox = document.createElement('div');
    modalBox.style.cssText = 'background:linear-gradient(135deg, #1a1a1a, #0a0a0a);border:2px solid var(--tenno-gold);border-radius:16px;padding:30px;max-width:350px;width:90%;text-align:center;animation:slideUp 0.3s ease;';

    const title = document.createElement('div');
    title.style.cssText = 'font-family:Orbitron;color:var(--tenno-gold);font-size:1.3rem;margin-bottom:15px;';
    title.textContent = '⚔️ 确认选择';
    modalBox.appendChild(title);
    
    const infoWrap = document.createElement('div');
    infoWrap.style.cssText = 'margin-bottom:20px;';
    
    const imgCircle = document.createElement('div');
    imgCircle.style.cssText = 'width:120px;height:120px;margin:0 auto 15px;background:radial-gradient(circle,rgba(200,168,75,0.2) 0%,transparent 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;';
    
    if (wf.image) {
        const img = document.createElement('img');
        img.src = wf.image;
        img.style.cssText = 'width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(200,168,75,0.5));';
        img.onerror = function() {
            this.style.display = 'none';
            const span = document.createElement('span');
            span.style.cssText = 'font-size:5rem;';
            span.textContent = wf.icon;
            imgCircle.appendChild(span);
        };
        imgCircle.appendChild(img);
    } else {
        const span = document.createElement('span');
        span.style.cssText = 'font-size:5rem;';
        span.textContent = wf.icon;
        imgCircle.appendChild(span);
    }
    infoWrap.appendChild(imgCircle);
    
    const nameDiv = document.createElement('div');
    nameDiv.style.cssText = 'font-family:Orbitron;color:#fff;font-size:1.2rem;margin-bottom:5px;';
    nameDiv.textContent = wf.name;
    infoWrap.appendChild(nameDiv);
    
    const descDiv = document.createElement('div');
    descDiv.style.cssText = 'color:#888;font-size:0.85rem;';
    descDiv.textContent = wf.desc || '';
    infoWrap.appendChild(descDiv);
    modalBox.appendChild(infoWrap);
    
    const warning = document.createElement('div');
    warning.style.cssText = 'background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:8px;padding:10px;margin-bottom:20px;';
    warning.innerHTML = '<span style="color:var(--grineer-red);font-size:0.8rem;">⚠️ 此选择不可更改，确定要觉醒为 ' + wf.name + ' 吗？</span>';
    modalBox.appendChild(warning);
    
    const btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display:flex;gap:10px;justify-content:center;';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.style.cssText = 'padding:10px 25px;background:#333;color:#fff;border:1px solid #555;border-radius:6px;cursor:pointer;font-family:Orbitron;transition:all 0.3s;';
    cancelBtn.textContent = '取消';
    cancelBtn.onclick = function() {
        document.getElementById('warframeConfirmOverlay').remove();
    };
    btnWrap.appendChild(cancelBtn);
    
    const confirmBtn = document.createElement('button');
    confirmBtn.style.cssText = 'padding:10px 25px;background:linear-gradient(135deg,var(--tenno-gold-dim),var(--tenno-gold));color:var(--void-black);border:none;border-radius:6px;cursor:pointer;font-family:Orbitron;font-weight:bold;transition:all 0.3s;';
    confirmBtn.textContent = '确认觉醒';
    confirmBtn.onclick = function() {
        confirmSelectWarframe(warframeKey);
    };
    btnWrap.appendChild(confirmBtn);
    
    modalBox.appendChild(btnWrap);
    confirmOverlay.appendChild(modalBox);
    document.body.appendChild(confirmOverlay);
    
    confirmOverlay.addEventListener('click', function(e) {
        if (e.target === confirmOverlay) {
            const box = confirmOverlay.querySelector('div');
            if (box) {
                box.style.animation = 'none';
                box.offsetHeight;
                box.style.animation = 'shake 0.5s ease';
                setTimeout(function() {
                    box.style.animation = 'slideUp 0.3s ease';
                }, 500);
            }
        }
    });
}

function confirmSelectWarframe(warframeKey) {
    const confirmOverlay = document.getElementById('warframeConfirmOverlay');
    if (confirmOverlay) confirmOverlay.remove();

    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay._warframeSelectMode = false;

    const closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.style.display = '';

    if (typeof selectWarframe === 'function') {
        selectWarframe(warframeKey);
    } else {
        console.error('selectWarframe 函数未找到');
    }
}

function initWarframeSliderDOM(prevBtn, nextBtn, track, indicators) {
    const cards = track.querySelectorAll('.warframe-slide-card');
    if (cards.length === 0) return;

    let currentIndex = 0;

    function updateSlider() {
        track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function goNext() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    cards.forEach((card) => {
        const prevMobile = card.querySelector('.wf-nav-prev-mobile');
        const nextMobile = card.querySelector('.wf-nav-next-mobile');
        const btn = card.querySelector('.wf-select-btn');
        
        if (prevMobile) prevMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            goPrev();
        });
        if (nextMobile) nextMobile.addEventListener('click', function(e) {
            e.stopPropagation();
            goNext();
        });
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = this.dataset.key;
                if (key) showWarframeConfirm(key);
            });
        }
    });

    indicators.forEach((ind, i) => {
        ind.addEventListener('click', function() {
            currentIndex = i;
            updateSlider();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') goPrev();
        else if (e.key === 'ArrowRight') goNext();
    });

    updateSlider();
}

function TEST_FUNCTION() { return "test"; }

function showWarframeConfirm(warframeKey) {
    const wf = WARFRAMES[warframeKey];
    if (!wf) return;
    
    // 创建确认遮罩
    let confirmOverlay = document.getElementById('warframeConfirmOverlay');
    if (confirmOverlay) confirmOverlay.remove();
    
    confirmOverlay = document.createElement('div');
    confirmOverlay.id = 'warframeConfirmOverlay';
    confirmOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.3s ease;';
    
    confirmOverlay.innerHTML = 
        '<div style="background:linear-gradient(135deg, #1a1a1a, #0a0a0a);border:2px solid var(--tenno-gold);border-radius:16px;padding:30px;max-width:350px;width:90%;text-align:center;animation:slideUp 0.3s ease;">' +
        // 标题
        '<div style="font-family:\'Orbitron\';color:var(--tenno-gold);font-size:1.3rem;margin-bottom:15px;">⚔️ 确认选择</div>' +
        // 战甲信息
        '<div style="margin-bottom:20px;">' +
        '<div style="width:120px;height:120px;margin:0 auto 15px;background:radial-gradient(circle,rgba(200,168,75,0.2) 0%,transparent 70%);border-radius:50%;display:flex;align-items:center;justify-content:center;">' +
        (wf.image ? 
            '<img src="' + wf.image + '" style="width:100px;height:100px;object-fit:contain;filter:drop-shadow(0 0 10px rgba(200,168,75,0.5));" onerror="this.parentElement.innerHTML=\'<<span style=font-size:5rem;>' + wf.icon + '</span>\'">' : 
            '<span style="font-size:5rem;">' + wf.icon + '</span>'
        ) +
        '</div>' +
        '<div style="font-family:\'Orbitron\';color:#fff;font-size:1.2rem;margin-bottom:5px;">' + wf.name + '</div>' +
        '<div style="color:#888;font-size:0.85rem;">' + (wf.desc || '') + '</div>' +
        '</div>' +
        // 警告
        '<div style="background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:8px;padding:10px;margin-bottom:20px;">' +
        '<span style="color:var(--grineer-red);font-size:0.8rem;">⚠️ 此选择不可更改，确定要觉醒为 ' + wf.name + ' 吗？</span>' +
        '</div>' +
        // 按钮
        '<div style="display:flex;gap:10px;justify-content:center;">' +
        '<button onclick="document.getElementById(\'warframeConfirmOverlay\').remove()" style="padding:10px 25px;background:#333;color:#fff;border:1px solid #555;border-radius:6px;cursor:pointer;font-family:\'Orbitron\';transition:all 0.3s;">取消</button>' +
        '<button onclick="confirmSelectWarframe(\'' + warframeKey + '\')" style="padding:10px 25px;background:linear-gradient(135deg,var(--tenno-gold-dim),var(--tenno-gold));color:var(--void-black);border:none;border-radius:6px;cursor:pointer;font-family:\'Orbitron\';font-weight:bold;transition:all 0.3s;">确认觉醒</button>' +
        '</div>' +
        '</div>';
    
    document.body.appendChild(confirmOverlay);
    
    // 禁止点击背景关闭，必须通过按钮操作
    confirmOverlay.addEventListener('click', function(e) {
        // 只允许点击按钮区域，背景点击无效
        if (e.target === confirmOverlay) {
            // 添加视觉反馈提示不能关闭
            var modalBox = confirmOverlay.querySelector('div');
            if (modalBox) {
                modalBox.style.animation = 'none';
                modalBox.offsetHeight; // 触发重绘
                modalBox.style.animation = 'shake 0.5s ease';
                setTimeout(function() {
                    modalBox.style.animation = 'slideUp 0.3s ease';
                }, 500);
            }
        }
    });
}

// 确认选择战甲
function confirmSelectWarframe(warframeKey) {
    // 移除确认弹窗
    const confirmOverlay = document.getElementById('warframeConfirmOverlay');
    if (confirmOverlay) confirmOverlay.remove();

    // 清除战甲选择模式标记（允许后续正常关闭弹窗）
    const modalOverlay = document.getElementById('modalOverlay');
    if (modalOverlay) modalOverlay._warframeSelectMode = false;

    // 恢复关闭按钮显示
    const closeBtn = modalOverlay.querySelector('.modal-close');
    if (closeBtn) closeBtn.style.display = '';

    // 调用原生的 selectWarframe
    if (typeof selectWarframe === 'function') {
        selectWarframe(warframeKey);
    } else {
        console.error('selectWarframe 函数未找到');
    }
}
// 滑动逻辑
// 战甲选择切换逻辑（左右箭头点击）
function initWarframeSlider() {
    const track = document.getElementById('warframeTrack');
    const cards = document.querySelectorAll('.warframe-slide-card');
    const indicators = document.querySelectorAll('.wf-indicator');
    const prevBtn = document.querySelector('.wf-nav-prev');
    const nextBtn = document.querySelector('.wf-nav-next');
    if (!track || cards.length === 0) return;

    let currentIndex = 0;

    function updateSlider() {
        track.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
        track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentIndex);
        });
    }

    function goPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    }

    function goNext() {
        if (currentIndex < cards.length - 1) {
            currentIndex++;
            updateSlider();
        }
    }

    // 桌面端箭头点击
    if (prevBtn) prevBtn.addEventListener('click', goPrev);
    if (nextBtn) nextBtn.addEventListener('click', goNext);

    // 手机端箭头点击（按钮左右）
    const prevMobile = document.querySelector('.wf-nav-prev-mobile');
    const nextMobile = document.querySelector('.wf-nav-next-mobile');
    if (prevMobile) prevMobile.addEventListener('click', goPrev);
    if (nextMobile) nextMobile.addEventListener('click', goNext);

    // 指示器点击
    indicators.forEach((ind, i) => {
        ind.addEventListener('click', function() {
            currentIndex = i;
            updateSlider();
        });
    });

    // 键盘支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') goPrev();
        else if (e.key === 'ArrowRight') goNext();
    });

    // 选择按钮点击
    cards.forEach((card) => {
        const btn = card.querySelector('.wf-select-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const key = this.getAttribute('data-key');
                if (key) showWarframeConfirm(key);
            });
        }
    });

    updateSlider();
}

function TEST_FUNCTION() { return "test"; }
		
// ═══════════════════════════════════════════════════════════════
//  安全时间获取（防本地时间修改）
// ═══════════════════════════════════════════════════════════════
function getSecureTime() {
    var offset = window.serverTimeOffset;
    if (typeof offset !== 'number' || isNaN(offset)) {
        offset = 0;
    }
    return Date.now() + offset;
}

// ═══════════════════════════════════════════════════════════════
//  一小时无限负荷卡核心功能（修复版 - 使用服务器时间防作弊）
// ═══════════════════════════════════════════════════════════════

/**
 * 检查无限负荷是否生效
 */
function isUnlimitedStaminaActive() {
    if (!unlimitedStaminaBuff.active) return false;
    
    var now = getSecureTime();  // ← 使用服务器时间
    
    if (now >= unlimitedStaminaBuff.endTime) {
        deactivateUnlimitedStamina();
        return false;
    }
    return true;
}

/**
 * 激活无限负荷Buff
 */
function activateUnlimitedStamina(durationMs) {
    if (!currentUser) {
        showToast('请先登录', 'error');
        return false;
    }
    
    var now = getSecureTime();  // ← 使用服务器时间
    var endTime = now + durationMs;
    
    // 如果已有buff，延长持续时间
    if (unlimitedStaminaBuff.active && unlimitedStaminaBuff.endTime > now) {
        endTime = unlimitedStaminaBuff.endTime + durationMs;
    }
    
    unlimitedStaminaBuff.active = true;
    unlimitedStaminaBuff.endTime = endTime;
    
    // 保存到本地存储（保存endTime + 当前本地时间戳用于防回拨校验）
    localStorage.setItem('unlimited_stamina_end_' + currentUser.id, String(endTime));
    localStorage.setItem('unlimited_stamina_local_' + currentUser.id, String(Date.now()));
    
    // 启动倒计时
    startUnlimitedStaminaTimer();
    
    // 显示视觉效果
    showUnlimitedStaminaEffect();
    
    showToast('⚡ 无限负荷已激活！持续时间内不减少负荷', 'success');
    if (typeof addBattleLog === 'function') {
        addBattleLog('⚡ 【系统】无限负荷模式已启动！', 'info');
    }
    
    return true;
}

/**
 * 启动无限负荷倒计时
 */
function startUnlimitedStaminaTimer() {
    if (unlimitedStaminaBuff.timer) {
        clearInterval(unlimitedStaminaBuff.timer);
    }
    unlimitedStaminaBuff.timer = setInterval(function() {
        checkUnlimitedStaminaExpiry();
    }, 1000);
    updateUnlimitedStaminaUI();
}

/**
 * 检查是否到期
 */
function checkUnlimitedStaminaExpiry() {
    if (!unlimitedStaminaBuff.active) return;
    
    var now = getSecureTime();  // ← 使用服务器时间
    
    if (now >= unlimitedStaminaBuff.endTime) {
        deactivateUnlimitedStamina();
    } else {
        updateUnlimitedStaminaUI();
    }
}

/**
 * 关闭无限负荷
 */
function deactivateUnlimitedStamina() {
    unlimitedStaminaBuff.active = false;
    unlimitedStaminaBuff.endTime = 0;
    if (unlimitedStaminaBuff.timer) {
        clearInterval(unlimitedStaminaBuff.timer);
        unlimitedStaminaBuff.timer = null;
    }
    if (currentUser) {
        localStorage.removeItem('unlimited_stamina_end_' + currentUser.id);
        localStorage.removeItem('unlimited_stamina_local_' + currentUser.id);
    }
    removeUnlimitedStaminaUI();
    showToast('⏰ 无限负荷效果已结束', 'warning');
    if (typeof addBattleLog === 'function') {
        addBattleLog('⏰ 【系统】无限负荷模式已结束', 'info');
    }
}

/**
 * 显示无限负荷视觉效果
 */
function showUnlimitedStaminaEffect() {
    // 添加CSS样式
    if (!document.getElementById('unlimitedStaminaStyle')) {
        var style = document.createElement('style');
        style.id = 'unlimitedStaminaStyle';
        style.textContent = 
            '.unlimited-stamina-active { animation: unlimitedPulse 2s ease-in-out infinite !important; } ' +
            '@keyframes unlimitedPulse { ' +
            '  0%, 100% { box-shadow: 0 0 5px rgba(255,102,255,0.3); } ' +
            '  50% { box-shadow: 0 0 20px rgba(255,102,255,0.8), 0 0 40px rgba(255,102,255,0.4); } ' +
            '} ' +
            '.unlimited-stamina-badge { ' +
            '  position: fixed; top: 70px; right: 15px; ' +
            '  background: linear-gradient(135deg, rgba(255,102,255,0.9), rgba(200,50,200,0.9)); ' +
            '  border: 1px solid #ff66ff; border-radius: 8px; ' +
            '  padding: 8px 15px; font-family: "Orbitron"; font-size: 0.8rem; ' +
            '  color: #fff; z-index: 9998; ' +
            '  animation: badgePulse 1.5s ease-in-out infinite; ' +
            '  text-shadow: 0 0 8px rgba(255,255,255,0.5); ' +
            '} ' +
            '@keyframes badgePulse { ' +
            '  0%, 100% { opacity: 1; transform: scale(1); } ' +
            '  50% { opacity: 0.9; transform: scale(1.02); } ' +
            '} ' +
            '.unlimited-stamina-timer { color: #ffd700; font-size: 0.75rem; margin-top: 2px; }';
        document.head.appendChild(style);
    }
    
    // 无限负荷模式：同步修改所有负荷显示为倒计时 59:58 格式
    var staminaElements = document.querySelectorAll('[id="battleStaminaValue"], #infoStamina, #staminaValue');
    staminaElements.forEach(function(el) {
        if (el) {
            el.classList.add('unlimited-stamina-active');
            // 显示倒计时，不显示 ∞/xxx
            var remaining = Math.max(0, unlimitedStaminaBuff.endTime - getSecureTime());
            var minutes = Math.floor(remaining / 60000);
            var seconds = Math.floor((remaining % 60000) / 1000);
            var timeStr = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
            el.textContent = timeStr;
        }
    });
}

/**
 * 更新倒计时UI
 */
function updateUnlimitedStaminaUI() {
    var remaining = Math.max(0, unlimitedStaminaBuff.endTime - getSecureTime());
    var minutes = Math.floor(remaining / 60000);
    var seconds = Math.floor((remaining % 60000) / 1000);
    var timeStr = minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    // 同步更新所有负荷显示为倒计时格式
    var staminaElements = document.querySelectorAll('[id="battleStaminaValue"], #infoStamina, #staminaValue');
    staminaElements.forEach(function(el) {
        if (el) el.textContent = timeStr;
    });
}

/**
 * 移除无限负荷UI
 */
function removeUnlimitedStaminaUI() {
    var staminaElements = document.querySelectorAll('.unlimited-stamina-active');
    staminaElements.forEach(function(el) {
        el.classList.remove('unlimited-stamina-active');
        el.textContent = stamina + '/100';
    });
}

/**
 * 页面加载时恢复状态（修复版 - 增加防作弊校验）
 */
function restoreUnlimitedStaminaState() {
    if (!currentUser) return;
    
    var savedEndTime = localStorage.getItem('unlimited_stamina_end_' + currentUser.id);
    if (!savedEndTime) return;
    
    var endTime = parseInt(savedEndTime);
    var now = getSecureTime();
    
    // ========== 防作弊校验 ==========
    var lastLocalTime = localStorage.getItem('unlimited_stamina_local_' + currentUser.id);
    var currentLocal = Date.now();
    
    if (lastLocalTime) {
        var lastLocal = parseInt(lastLocalTime);
        
        // 本地时间被回拨超过1分钟（作弊）
        if (currentLocal < lastLocal - 60000) {
            console.warn('【无限负荷】检测到时间回拨，清除状态');
            clearUnlimitedStaminaState();
            return;
        }
        
        // endTime异常遥远（超过30天，明显作弊）
        if (endTime > now + 30 * 24 * 3600000) {
            console.warn('【无限负荷】endTime异常，清除状态');
            clearUnlimitedStaminaState();
            return;
        }
    }
    
    // 更新本地时间记录
    localStorage.setItem('unlimited_stamina_local_' + currentUser.id, String(currentLocal));
    // ================================
    
    if (endTime > now) {
        unlimitedStaminaBuff.active = true;
        unlimitedStaminaBuff.endTime = endTime;
        startUnlimitedStaminaTimer();
        showUnlimitedStaminaEffect();
        console.log('恢复无限负荷状态，剩余:', Math.floor((endTime - now) / 1000), '秒');
    } else {
        localStorage.removeItem('unlimited_stamina_end_' + currentUser.id);
        localStorage.removeItem('unlimited_stamina_local_' + currentUser.id);
    }
}

// 辅助：清除无限负荷状态
function clearUnlimitedStaminaState() {
    unlimitedStaminaBuff.active = false;
    unlimitedStaminaBuff.endTime = 0;
    if (unlimitedStaminaBuff.timer) {
        clearInterval(unlimitedStaminaBuff.timer);
        unlimitedStaminaBuff.timer = null;
    }
    localStorage.removeItem('unlimited_stamina_end_' + currentUser.id);
    localStorage.removeItem('unlimited_stamina_local_' + currentUser.id);
}

// 暴露到全局
window.isUnlimitedStaminaActive = isUnlimitedStaminaActive;
window.activateUnlimitedStamina = activateUnlimitedStamina;
window.deactivateUnlimitedStamina = deactivateUnlimitedStamina;
window.restoreUnlimitedStaminaState = restoreUnlimitedStaminaState;
window.getSecureTime = getSecureTime;
window.clearUnlimitedStaminaState = clearUnlimitedStaminaState;
	
	
// ═══════════════════════════════════════════════════════════════
//  兑换码系统（使用 Supabase 数据库）
// ═══════════════════════════════════════════════════════════════
// 检查是否为管理员
function isAdmin() {
    return currentUser && currentUser.clan_rank === 'admin';
}




// ═══════════════════════════════════════════════════════════════
//  兑换码处理 （允许突破负荷上限）
// ═══════════════════════════════════════════════════════════════
async function redeemCodeServer(code) {
    if (!currentUser) {
        updateRedeemResult('请先登录', 'error');
        return false;
    }
    
    try {
        const { data, error } = await sb.rpc('redeem_code', {
            p_code: code.toUpperCase().trim(),
            p_user_id: currentUser.id
        });
        
        if (error) {
            console.error('兑换错误:', error);
            updateRedeemResult('兑换失败: ' + error.message, 'error');
            return false;
        }
        
        let result = data;
        if (typeof data === 'string') {
            try { result = JSON.parse(data); } catch (e) {}
        }
        if (Array.isArray(result)) {
            result = result[0] || {};
        }
        
        if (!result || result.success !== true) {
            updateRedeemResult(result?.msg || result?.error || '兑换失败', 'error');
            return false;
        }
        
        const rewards = [];
        
                // 负荷奖励（关键修复：允许突破上限）
                const staminaReward = parseInt(result.stamina || 0);
                if (staminaReward > 0) {
                    const newMax = Math.max(STAMINA_MAX || 100, stamina + staminaReward);
                    STAMINA_MAX = newMax;
                    if (gameData) gameData.stamina_max = newMax;
                    
                    modifyStamina(staminaReward, true); // skipSave=true，后面统一保存
                    rewards.push(`⚡+${staminaReward} 负荷`);
                    
                }
        
        // 现金奖励
        const creditsReward = parseInt(result.credits || 0);
        if (creditsReward > 0) {
            if (!gameData) gameData = {};
            gameData.rout_points = (gameData.rout_points || 0) + creditsReward;
            currentUser.rout_points = gameData.rout_points;
            rewards.push(`💰+${creditsReward} Rout`);
        }
        
        // Prime奖励
        const pointsReward = parseInt(result.points || 0);
        if (pointsReward > 0) {
            if (!gameData) gameData = {};
            gameData.prime_points = (gameData.prime_points || 0) + pointsReward;
            currentUser.prime_points = gameData.prime_points;
            rewards.push(`💎+${pointsReward} Prime`);
        }
        
        // 同步积分缓存
        const pointsKey = `points_${currentUser.id}`;
        localStorage.setItem(pointsKey, JSON.stringify({
            rout_points: gameData?.rout_points || 0,
            prime_points: gameData?.prime_points || 0,
            vip_points: gameData?.vip_points || 0
        }));
        
        // 保存到数据库
        await saveGameData();
        updateUI();
        
        const rewardMsg = rewards.length > 0 ? rewards.join(' | ') : '（无额外奖励）';
        updateRedeemResult(`${result.msg || '兑换成功！'} ${rewardMsg}`, 'success');
        return true;
        
    } catch (err) {
        console.error('兑换请求失败:', err);
        updateRedeemResult('网络错误，请稍后重试', 'error');
        return false;
    }
}



// 辅助函数：更新兑换结果显示
function updateRedeemResult(msg, type) {
    var result = document.getElementById('redeemResult');
    if (!result) return;
    var color = type === 'success' ? 'var(--infested-green)' : 'var(--grineer-red)';
    var icon = type === 'success' ? '✅' : '❌';
    result.innerHTML = '<span style="color: ' + color + ';">' + icon + ' ' + msg + '</span>';
}

// ═══════════════════════════════════════════════════════════════
//  新用户负荷奖励弹窗
// ═══════════════════════════════════════════════════════════════
function showNewUserRewardModal() {
    var overlay = document.createElement('div');
    overlay.id = 'newUserRewardOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease;';

    overlay.innerHTML = 
        '<div style="background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 2px solid var(--infested-green); border-radius: 16px; padding: 35px; max-width: 380px; width: 90%; text-align: center; animation: cardPopIn 0.5s ease;">' +
        '<div style="font-size: 3.5rem; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(78,255,78,0.5));">⚡</div>' +
        '<div style="font-family: Orbitron; color: var(--infested-green); font-size: 1.3rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(78,255,78,0.3);">新用户觉醒奖励</div>' +
        '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
        '欢迎加入【星渊】！<br>' +
        '作为新觉醒的Tenno，你获得了<br>' +
        '<span style="color: var(--infested-green); font-family: Orbitron; font-size: 1.4rem; font-weight: 700;">+200 负荷</span>' +
        '</div>' +
        '<div style="background: rgba(78,255,78,0.1); border: 1px solid rgba(78,255,78,0.3); border-radius: 10px; padding: 12px; margin-bottom: 20px;">' +
        '<div style="color: var(--infested-green); font-size: 0.85rem;">当前负荷: <span style="font-family: Orbitron; font-size: 1.1rem;">' + stamina + '/100</span></div>' +
        '</div>' +
        '<button id="newUserRewardBtn" style="padding: 12px 35px; background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000; border: none; border-radius: 8px; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700; transition: all 0.3s;">' +
        '✨ 开始冒险' +
        '</button>' +
        '</div>';

    document.body.appendChild(overlay);

    // 按钮点击关闭
    var btn = document.getElementById('newUserRewardBtn');
    if (btn) {
        btn.addEventListener('click', function() {
            overlay.remove();
        });
    }

    // 点击背景关闭
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}

// 前端兑换函数（按钮调用）
function redeemCode() {
    var input = document.getElementById('redeemCodeInput');
    var result = document.getElementById('redeemResult');
    
    if (!input || !result) return;

    var code = input.value.trim();
    
    if (!code) {
        result.innerHTML = '<span style="color: var(--grineer-red);">❌ 请输入兑换码</span>';
        return;
    }

    // 显示加载状态
    result.innerHTML = '<span style="color: var(--orokin-cyan);">⏳ 验证中...</span>';
    
    // 调用服务端兑换
    redeemCodeServer(code).then(function(success) {
        if (success) {
            // 成功信息已在 redeemCodeServer 中显示到 result
            // 3秒后关闭弹窗
            setTimeout(function() {
                closeModal();
            }, 3000);
        }
        // 失败信息已在 redeemCodeServer 中显示到 result，无需重复设置
    });
}



function showRedeemCodeModal() {
    var modalOverlay = document.getElementById('modalOverlay');
    var modalTitle = document.getElementById('modalTitle');
    var modalContent = document.getElementById('modalContent');

    if (!modalOverlay || !modalTitle || !modalContent) return;

    var adminBtn = isAdmin() ? 
        '<button class="btn" onclick="showRedeemAdmin()" style="width: 100%; margin-bottom: 15px; background: linear-gradient(135deg, var(--grineer-red), #ff6666); color: #fff; font-size: 0.85rem;">' +
            '⚡ 管理后台' +
        '</button>' : '';

    modalTitle.textContent = '🎁 兑换码';
    modalContent.innerHTML = 
        '<div style="text-align: center; min-width: 300px;">' +
            adminBtn +
            '<div style="font-size: 3rem; margin-bottom: 15px;">🎁</div>' +
            '<div style="color: var(--tenno-gold); font-family: \'Orbitron\'; font-size: 1.2rem; margin-bottom: 10px;">输入兑换码</div>' +
            '<div style="color: #888; font-size: 0.85rem; margin-bottom: 20px;">输入有效的兑换码获取奖励</div>' +
            '<div class="input-group" style="margin-bottom: 20px;">' +
                '<input type="text" id="redeemCodeInput" placeholder="输入兑换码..." style="text-align: center; font-family: \'Orbitron\'; letter-spacing: 2px; text-transform: uppercase;">' +
            '</div>' +
            '<button class="btn" onclick="redeemCode()" style="background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: var(--void-black);">' +
                '✨ 兑换' +
            '</button>' +
            '<div id="redeemResult" style="margin-top: 15px; font-size: 0.85rem;"></div>' +
        '</div>';

    modalOverlay.style.zIndex = '9999';
    modalOverlay.classList.add('active');
}


// ═══════════════════════════════════════════════════════════════
//  兑换码管理后台（Admin 专用）
// ═══════════════════════════════════════════════════════════════

// 显示管理界面
function showRedeemAdmin() {
    if (!isAdmin()) {
        showToast('权限不足，需要管理员权限', 'error');
        return;
    }
    
    var modalOverlay = document.getElementById('modalOverlay');
    var modalTitle = document.getElementById('modalTitle');
    var modalContent = document.getElementById('modalContent');
    
    if (!modalOverlay || !modalTitle || !modalContent) return;
    
    modalTitle.textContent = '⚡ 兑换码管理';
    modalContent.innerHTML = 
        '<div style="min-width: 400px;">' +
            '<div style="display: flex; gap: 10px; margin-bottom: 20px;">' +
                '<button class="btn" onclick="showAddCodeForm()" style="background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000;">' +
                    '➕ 添加兑换码' +
                '</button>' +
                '<button class="btn" onclick="loadRedeemStats()" style="background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan));">' +
                    '📊 查看统计' +
                '</button>' +
            '</div>' +
            '<div id="adminContent" style="max-height: 400px; overflow-y: auto;">' +
                '<div style="color: #666; text-align: center; padding: 40px;">点击上方按钮操作</div>' +
            '</div>' +
        '</div>';
    
    modalOverlay.style.zIndex = '9999';
    modalOverlay.classList.add('active');
}

// 显示添加兑换码表单
function showAddCodeForm() {
    var adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = 
        '<div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; border: 1px solid #333;">' +
            '<h3 style="color: var(--tenno-gold); margin-bottom: 15px;">➕ 添加新兑换码</h3>' +
            '<div class="input-group" style="margin-bottom: 12px;">' +
                '<label style="color: #888; font-size: 0.8rem;">兑换码 *</label>' +
                '<input type="text" id="adminCodeInput" placeholder="例如: TENNO2024" style="text-transform: uppercase;">' +
            '</div>' +
            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;">' +
                '<div class="input-group">' +
                    '<label style="color: #888; font-size: 0.8rem;">💰 Rout</label>' +
                    '<input type="number" id="adminCredits" value="0" min="0">' +
                '</div>' +
                '<div class="input-group">' +
                    '<label style="color: #888; font-size: 0.8rem;">💎 Prime</label>' +
                    '<input type="number" id="adminPoints" value="0" min="0">' +
                '</div>' +
            '</div>' +
            '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">' +
                '<div class="input-group">' +
                    '<label style="color: #888; font-size: 0.8rem;">⚡ 负荷</label>' +
                    '<input type="number" id="adminStamina" value="0" min="0">' +
                '</div>' +
                '<div class="input-group">' +
                    '<label style="color: #888; font-size: 0.8rem;">最大兑换次数</label>' +
                    '<input type="number" id="adminMaxUses" value="100" min="1">' +
                '</div>' +
            '</div>' +
            '<button class="btn" onclick="submitNewCode()" style="width: 100%; background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000;">' +
                '✅ 确认添加' +
            '</button>' +
            '<div id="adminResult" style="margin-top: 10px; font-size: 0.85rem;"></div>' +
        '</div>';
}


// 提交新兑换码
async function submitNewCode() {
    if (!isAdmin()) {
        showToast('权限不足', 'error');
        return;
    }
    
    var code = document.getElementById('adminCodeInput').value.trim().toUpperCase();
    var credits = parseInt(document.getElementById('adminCredits').value) || 0;
    var points = parseInt(document.getElementById('adminPoints').value) || 0;
    var staminaVal = parseInt(document.getElementById('adminStamina').value) || 0;
    var maxUses = parseInt(document.getElementById('adminMaxUses').value) || 1;
    
    var resultDiv = document.getElementById('adminResult');
    
    if (!code) {
        resultDiv.innerHTML = '<span style="color: var(--grineer-red);">请输入兑换码</span>';
        return;
    }
    
    // 验证兑换码格式
    if (!/^[A-Z0-9]{4,20}$/.test(code)) {
        resultDiv.innerHTML = '<span style="color: var(--grineer-red);">兑换码只能包含字母和数字，长度4-20位</span>';
        return;
    }
    
    try {
        // ========== 关键修复：先检查兑换码是否已存在 ==========
        const { data: existing, error: checkError } = await sb
            .from('redeem_codes')
            .select('code')
            .eq('code', code)
            .maybeSingle();
        
        if (checkError) throw checkError;
        
        if (existing) {
            resultDiv.innerHTML = '<span style="color: var(--grineer-red);">❌ 兑换码 ' + code + ' 已存在</span>';
            return;
        }
        
        // ========== 关键修复：执行 INSERT 写入数据库 ==========
        const insertData = {
            code: code,
            credits: credits,
            points: points,
            stamina: staminaVal,
            max_uses: maxUses,
            used_count: 0,
            is_active: true,
            created_at: new Date().toISOString()
        };
        
        const { data: inserted, error: insertError } = await sb
            .from('redeem_codes')
            .insert(insertData)
            .select()
            .single();
        
        if (insertError) {
            if (insertError.code === '23505') {
                resultDiv.innerHTML = '<span style="color: var(--grineer-red);">❌ 兑换码已存在</span>';
            } else {
                resultDiv.innerHTML = '<span style="color: var(--grineer-red);">❌ 添加失败: ' + insertError.message + '</span>';
            }
            return;
        }
        
        resultDiv.innerHTML = '<span style="color: var(--infested-green);">✅ 兑换码 ' + code + ' 添加成功！</span>' +
            '<div style="color: #666; font-size: 0.8rem; margin-top: 8px;">奖励: 💰' + credits + ' 💎' + points + ' ⚡' + staminaVal + ' | 限' + maxUses + '次</div>';
        
        // 清空输入
        document.getElementById('adminCodeInput').value = '';
        
        // 3秒后刷新统计
        setTimeout(function() {
            loadRedeemStats();
        }, 1500);
        
    } catch (err) {
        resultDiv.innerHTML = '<span style="color: var(--grineer-red);">❌ 错误: ' + err.message + '</span>';
    }
}



// 加载兑换统计（修复 400 错误）
async function loadRedeemStats() {
    if (!isAdmin()) {
        showToast('权限不足', 'error');
        return;
    }
    
    var adminContent = document.getElementById('adminContent');
    if (!adminContent) return;
    
    adminContent.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--orokin-cyan);">⏳ 加载中...</div>';
    
    try {

        // 正确的代码
        const { data, error } = await sb
            .from('redeem_codes')
            .select('code, credits, points, stamina, max_uses, used_count, is_active, created_at');
        
        if (error) throw error;
        
        // 手动排序
        if (data) {
            data.sort(function(a, b) {
                return new Date(b.created_at) - new Date(a.created_at);
            });
        }
        
        if (!data || data.length === 0) {
            adminContent.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">暂无兑换码</div>';
            return;
        }
        
        // ... 其余显示代码不变
        var html = '<div style="overflow-x: auto;">' +
            '<table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">' +
            '<thead>' +
            '<tr style="color: var(--tenno-gold); border-bottom: 2px solid #333;">' +
            '<th style="padding: 10px; text-align: left;">兑换码</th>' +
            '<th style="padding: 10px; text-align: center;">奖励</th>' +
            '<th style="padding: 10px; text-align: center;">使用</th>' +
            '<th style="padding: 10px; text-align: center;">剩余</th>' +
            '<th style="padding: 10px; text-align: center;">状态</th>' +
            '<th style="padding: 10px; text-align: center;">操作</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        
        data.forEach(function(item) {
            var remaining = item.max_uses - item.used_count;
            var isExpired = item.expires_at && new Date(item.expires_at) < new Date();
            var status = item.is_active && !isExpired ? 
                '<span style="color: var(--infested-green);">✓ 有效</span>' : 
                '<span style="color: var(--grineer-red);">✗ 失效</span>';
            
            var reward = [];
            if (item.credits) reward.push('💰' + item.credits);
            if (item.points) reward.push('💎' + item.points);
            if (item.stamina) reward.push('⚡' + item.stamina);
            
            html += '<tr style="border-bottom: 1px solid #222;">' +
                '<td style="padding: 10px; font-family: Orbitron; color: var(--orokin-cyan);">' + item.code + '</td>' +
                '<td style="padding: 10px; text-align: center;">' + reward.join(' ') + '</td>' +
                '<td style="padding: 10px; text-align: center;">' + item.used_count + '/' + item.max_uses + '</td>' +
                '<td style="padding: 10px; text-align: center; color: ' + (remaining > 0 ? 'var(--infested-green)' : 'var(--grineer-red)') + ';">' + remaining + '</td>' +
                '<td style="padding: 10px; text-align: center;">' + status + '</td>' +
                '<td style="padding: 10px; text-align: center;">' +
                    '<button onclick="deleteRedeemCode(\'' + item.code + '\')" style="background: rgba(255,68,68,0.2); border: 1px solid var(--grineer-red); color: var(--grineer-red); padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">删除</button>' +
                '</td>' +
                '</tr>';
        });
        
        html += '</tbody></table></div>';
        
        adminContent.innerHTML = html;
        
    } catch (err) {
        adminContent.innerHTML = '<div style="color: var(--grineer-red); padding: 40px; text-align: center;">加载失败: ' + err.message + '</div>';
    }
}

// 删除兑换码
async function deleteRedeemCode(code) {
    if (!isAdmin()) {
        showToast('权限不足', 'error');
        return;
    }
    
    if (!confirm('确定要删除兑换码 ' + code + ' 吗？')) {
        return;
    }
    
    try {
        const { data, error } = await sb
            .from('redeem_codes')
            .delete()
            .eq('code', code);
        
        if (error) throw error;
        
        showToast('兑换码 ' + code + ' 已删除', 'success');
        loadRedeemStats();
        
    } catch (err) {
        showToast('删除失败: ' + err.message, 'error');
    }
}


async function selectWarframe(type) {
    document.querySelectorAll('.warframe-select-card').forEach(c => c.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    setTimeout(async () => {
        const style = document.getElementById('warframeSelectStyle');
        if (style) style.remove();
        closeModal();
        showLoading(true);

        try {
            const wf = WARFRAMES[type] || WARFRAMES.excalibur;
            const stats = wf.stats;

const newData = {
    user_id: currentUser.id,
    username: currentUser.username,
    warframe_type: type || 'excalibur',
    warframe_level: 1,
    warframe_xp: 0,
    warframe_max_xp: 100,
    warframe_levels: {
        excalibur: { level: 1, xp: 0, max_xp: 100 },
        volt: { level: 1, xp: 0, max_xp: 100 },
        mag: { level: 1, xp: 0, max_xp: 100 },
        rhino: { level: 1, xp: 0, max_xp: 100 }
    },
    stat_shield: stats.shield || 100,
    stat_health: stats.health || 100,
    stat_energy: stats.energy || 100,
    stat_armor: stats.armor || 100,
    stat_speed: stats.speed || 10,
    stamina: 300,  // 新用户基础100 + 赠送200 = 300
    stamina_max: 300,
    stamina_natural_max: 300,
    warehouse: [],
    player_cards: {},
    card_shards: {},
    codex: { grineer: 0, corpus: 0, infested: 0, sentient: 0 },
    missions: {},
    foundry: {},
    today_stats: { battles: 0, kills: 0, mining: 0, gathering: 0 },
    total_stats: { kills: 0, mining: 0, gathering: 0, miningTime: 0, gatheringTime: 0 },
    streak: 1,
    last_login: new Date().toISOString(),
    today_completed: 0,
    today_points: 0
};

            // 先查询是否已有记录
            let { data: record, error } = await sb
                .from('game_data')
                .select('*')
                .eq('user_id', currentUser.id)
                .maybeSingle();

            if (error) throw error;

            // 如果没有记录，插入新数据
            if (!record) {
                let { data: inserted, error: insertError } = await sb
                    .from('game_data')
                    .insert(newData)
                    .select()
                    .single();
                
                if (insertError) throw insertError;
                record = inserted;
            }

            // 关键修复：正确处理返回数据
            gameData = Array.isArray(record) ? record[0] : record;
            if (!gameData) {
                throw new Error('初始化 game_data 失败');
            }
                            
            gameData.rout_points = currentUser.rout_points || 0;
            gameData.prime_points = currentUser.prime_points || 0;
            gameData.vip_points = currentUser.vip_points || 0;
            
            const pointsKey = `points_${currentUser.id}`;
            localStorage.setItem(pointsKey, JSON.stringify({
                rout_points: gameData.rout_points,
                prime_points: gameData.prime_points,
                vip_points: gameData.vip_points
            }));
            
                        STAMINA_MAX = 300;
                        
                        modifyStamina(300 - stamina, true); // 设置负荷为300
                        
                        if (gameData) {
                            gameData.stamina_max = STAMINA_MAX;
                            gameData.stamina_natural_max = STAMINA_NATURAL_MAX;
                        }
                        
                        // 弹窗新用户奖励
                        setTimeout(function() {
                            showNewUserRewardModal();
                        }, 800);
            
						// 添加新函数：
                        function showNewUserRewardModal() {
                            var overlay = document.createElement('div');
                            overlay.id = 'newUserRewardOverlay';
                            overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease;';
                            
                            overlay.innerHTML = 
                                '<div style="background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 2px solid var(--infested-green); border-radius: 16px; padding: 35px; max-width: 380px; width: 90%; text-align: center; animation: cardPopIn 0.5s ease;">' +
                                '<div style="font-size: 3.5rem; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(78,255,78,0.5));">⚡</div>' +
                                '<div style="font-family: Orbitron; color: var(--infested-green); font-size: 1.3rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(78,255,78,0.3);">新用户觉醒奖励</div>' +
                                '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
                                '欢迎加入【星渊】！<br>' +
                                '作为新觉醒的Tenno，你获得了<br>' +
                                '<span style="color: var(--infested-green); font-family: Orbitron; font-size: 1.4rem; font-weight: 700;">+200 负荷</span>' +
                                '</div>' +
                                '<div style="background: rgba(78,255,78,0.1); border: 1px solid rgba(78,255,78,0.3); border-radius: 10px; padding: 12px; margin-bottom: 20px;">' +
                                '<div style="color: var(--infested-green); font-size: 0.85rem;">当前负荷: <span style="font-family: Orbitron; font-size: 1.1rem;">300/300</span></div>' +
                                '<div style="color: #888; font-size: 0.75rem; margin-top: 4px;">(新用户额外奖励200)</div>' +
                                '</div>' +
                                '<button onclick="document.getElementById(\'newUserRewardOverlay\').remove()" style="padding: 12px 35px; background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000; border: none; border-radius: 8px; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700; transition: all 0.3s;">' +
                                '✨ 开始冒险' +
                                '</button>' +
                                '</div>';
                            
                            document.body.appendChild(overlay);
                            
                            // 点击背景关闭
                            overlay.addEventListener('click', function(e) {
                                if (e.target === overlay) overlay.remove();
                            });
                        }
                        localStorage.setItem('stamina_' + currentUser.id, String(stamina));
            
            await checkDailyReset();
            
            // ========== 关键修复：确保调用 enterGame 进入游戏 ==========
            enterGame();
            // =========================================
            
            updateSyncStatus(true);
            
            const now = new Date().getTime();
            const last = gameData.last_login ? new Date(gameData.last_login).getTime() : 0;
            if (now - last >= 600000) {
                showToast(`欢迎觉醒，${currentUser.username}！你选择了 ${WARFRAMES[type]?.name || 'Excalibur'}`, 'success');
            }
            gameData.last_login = new Date().toISOString();
            await saveGameData();
        } catch (err) {
            console.error('创建游戏数据失败:', err);
            showToast('初始化失败: ' + err.message, 'error');
        } finally {
            showLoading(false);
        }
    }, 500);
}				
		
				// ═══════════════════════════════════════════════════════════════
				//  显示已拥有的战甲选择列表（信息页用）- 全局函数
				// ═══════════════════════════════════════════════════════════════
				function showOwnedWarframeSelect() {
				    if (!gameData) return;
				    
				    // 确保有已拥有列表
				    if (!gameData.ownedWarframes || gameData.ownedWarframes.length === 0) {
				        gameData.ownedWarframes = [gameData.warframe_type || 'excalibur'];
				    }
				    
				    const modalOverlay = document.getElementById('modalOverlay');
				    const modalTitle = document.getElementById('modalTitle');
				    const modalContent = document.getElementById('modalContent');
				    
				    if (!modalOverlay || !modalTitle || !modalContent) return;
				    
				    modalTitle.textContent = '⚔️ 选择出战战甲';
				    
				    const currentType = gameData.activeWarframe || gameData.warframe_type || 'excalibur';
				    
				    // 构建战甲回响
				    const cardsHtml = gameData.ownedWarframes.map(key => {
				        const wf = WARFRAMES[key];
				        if (!wf) return '';
				        
				        const isActive = key === currentType;
				        const wfData = gameData.warframe_levels?.[key] || { level: 1, xp: 0, max_xp: 100 };
				        
				        return `
				            <div class="warframe-select-card ${isActive ? 'selected' : ''}" 
				                 onclick="switchToWarframe('${key}')"
				                 style="cursor: pointer; background: ${isActive ? 'rgba(78,255,78,0.15)' : 'rgba(0,0,0,0.3)'}; 
				                        border: 2px solid ${isActive ? 'var(--infested-green)' : '#333'}; 
				                        border-radius: 12px; padding: 20px; text-align: center; 
				                        transition: all 0.3s; position: relative;">
				                ${isActive ? '<div style="position: absolute; top: 8px; right: 8px; color: var(--infested-green); font-size: 1.2rem;">✓ 当前</div>' : ''}
				                <div style="font-size: 3rem; margin-bottom: 10px;">
				                    ${wf.image ? `<img src="${wf.image}" style="width: 80px; height: 80px; object-fit: contain;" onerror="this.parentNode.innerHTML='${wf.icon}'">` : wf.icon}
				                </div>
				                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.1rem; margin-bottom: 5px;">
				                    ${wf.name}
				                </div>
				                <div style="color: #888; font-size: 0.8rem; margin-bottom: 8px;">${wf.desc || ''}</div>
				                <div style="color: var(--orokin-cyan); font-size: 0.85rem; font-family: 'Orbitron';">
				                    Lv.${wfData.level || 1}
				                </div>
				                <div style="margin-top: 8px; width: 100%; height: 6px; background: #1a1a1a; border-radius: 3px; overflow: hidden;">
				                    <div style="width: ${wfData.max_xp > 0 ? Math.min(100, (wfData.xp / wfData.max_xp) * 100) : 0}%; 
				                                height: 100%; background: linear-gradient(90deg, var(--orokin-cyan-dim), var(--orokin-cyan));"></div>
				                </div>
				                <div style="color: #666; font-size: 0.7rem; margin-top: 4px;">
				                    ${isActive ? '当前使用中' : '点击切换'}
				                </div>
				            </div>
				        `;
				    }).join('');
				    
				    modalContent.innerHTML = `
				        <div style="min-width: 280px;">
				            <div style="text-align: center; margin-bottom: 20px; color: #888;">
				                <p>选择要出战的战甲</p>
				                <p style="font-size: 0.8rem; color: var(--tenno-gold);">已拥有 ${gameData.ownedWarframes.length} 台战甲</p>
				            </div>
				            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
				                ${cardsHtml}
				            </div>
				            <div style="text-align: center; color: #666; font-size: 0.8rem;">
				                提示：在重构厂重构新战甲可扩展选择
				            </div>
				        </div>
				    `;
				    
				    // 添加悬停样式
				    let style = document.getElementById('ownedWarframeStyle');
				    if (style) style.remove();
				    
				    style = document.createElement('style');
				    style.id = 'ownedWarframeStyle';
				    style.textContent = `
				        .warframe-select-card:hover {
				            border-color: var(--tenno-gold) !important;
				            transform: translateY(-3px);
				            box-shadow: 0 8px 25px rgba(200, 168, 75, 0.15);
				        }
				    `;
				    document.head.appendChild(style);
				    
				    modalOverlay.style.zIndex = '9999';
				    modalOverlay.classList.add('active');
				}
				
				// ═══════════════════════════════════════════════════════════════
				//  切换到指定战甲 - 全局函数
				// ═══════════════════════════════════════════════════════════════
				function switchToWarframe(warframeKey) {
				    if (!gameData || !WARFRAMES[warframeKey]) return;
				    
				    // 如果已经是当前战甲，直接关闭
				    if (gameData.activeWarframe === warframeKey && gameData.warframe_type === warframeKey) {
				        closeModal();
				        return;
				    }
				    const wf = WARFRAMES[warframeKey];
				    
				    // 切换战甲
				    gameData.activeWarframe = warframeKey;
				    gameData.warframe_type = warframeKey;
				    
				    // 确保该战甲有等级数据
				    if (!gameData.warframe_levels) gameData.warframe_levels = {};
				    if (!gameData.warframe_levels[warframeKey]) {
				        gameData.warframe_levels[warframeKey] = {
				            level: 1,
				            xp: 0,
				            max_xp: 100
				        };
				    }
				    
				    // 同步到旧字段（兼容）
				    const wfData = gameData.warframe_levels[warframeKey];
				    gameData.warframe_level = wfData.level;
				    gameData.warframe_xp = wfData.xp;
				    gameData.warframe_max_xp = wfData.max_xp;
				    
				    // 更新属性
				    if (wf && wf.stats) {
				        gameData.stat_shield = wf.stats.shield || 100;
				        gameData.stat_health = wf.stats.health || 100;
				        gameData.stat_energy = wf.stats.energy || 100;
				        gameData.stat_armor = wf.stats.armor || 100;
				        gameData.stat_speed = wf.stats.speed || 10;
				    }
				    
				    saveGameData();
				    updateUI();
				    updateInfoUI();
				    updateBattleUI();
				    updateMiningUI();
				    updateGatheringUI();
				    
				    closeModal();
				    showToast(`已切换至 ${wf.name}`, 'success');
				}
		
		
					// ═══════════════════════════════════════════════════════════════
					//  SUPABASE 配置
					// ═══════════════════════════════════════════════════════════════
					const SUPABASE_URL = 'https://rfmgembzxqbqsegquxmh.supabase.co';
					const SUPABASE_ANON_KEY = 'sb_publishable_9qFlq7jJcXvnkZOIoxinug_RVotHtGw';

					let sb = null;
					let currentUser = null;
					let gameData = null;
					window.gameData = gameData; 
					function initSupabase() {
					    if (sb) return true;
					    if (typeof supabase === 'undefined') {
					        console.error('Supabase 库未加载');
					        return false;
					    }
					    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
					    window.sb = sb;  
					    return true;
					}

					// ═══════════════════════════════════════════════════════════════
					//  游戏数据定义
					// ═══════════════════════════════════════════════════════════════

					let selectedPlanet = null;
					let selectedZone = null; // ← 确保有这个，肃清系统会用到
					let currentFaction = null;
					let selectedFactionPlanet = null;
					let selectedFactionZone = null;
					let selectedFactionParentZone = null;

					// 负荷系统
					var stamina = 100;
					 // ← 暴露到全局
					var STAMINA_NATURAL_MAX = 100; // 自然恢复上限
					var STAMINA_MAX = 1000; // 绝对上限（可通过道具突破）
					var STAMINA_BATTLE_COST = 3;
					var STAMINA_MINING_COST = 15;
					var STAMINA_GATHERING_COST = 3;
					var STAMINA_REGEN_INTERVAL = 60000; // 60秒回复1点
					let staminaRegenTimer = null;
					
					// ═══════════════════════════════════════════════════════════════
					//  一小时无限负荷卡全局状态
					// ═══════════════════════════════════════════════════════════════
					var unlimitedStaminaBuff = {
						active: false,
						endTime: 0,
						timer: null
					};
					
					window.unlimitedStaminaBuff = unlimitedStaminaBuff;
					
					
// ═══════════════════════════════════════════════════════════════
//  每日现金获取上限管理（使用 window 挂载确保全局可访问）
// ═══════════════════════════════════════════════════════════════
window.DAILY_CASH_LIMIT = 100;

// 战斗中上限提示标记（战斗中只提示一次）
window._battleCashLimitWarned = false;

window.canEarnCashToday = function(amount) {
    if (!gameData) return false;
    if (!gameData.today_cash_earned) gameData.today_cash_earned = 0;
    
    var todayEarned = gameData.today_cash_earned;
    
    if (todayEarned >= window.DAILY_CASH_LIMIT) {
        // 战斗中只提示一次（非战斗场景如出售不受限制）
        if (!window._battleCashLimitWarned) {
            window._battleCashLimitWarned = true;
            showToast(`💰 Rout获取已达日上限 (${window.DAILY_CASH_LIMIT})，请明日再来吧!`, 'warning');
        }
        return false;
    }
    
    // 未达到上限时，重置标记（允许下次达到上限时再提示）
    window._battleCashLimitWarned = false;
    
    var canGet = window.DAILY_CASH_LIMIT - todayEarned;
    if (amount > canGet) {
        return canGet;
    }
    return amount;
};

window.recordCashEarned = function(amount) {
    if (!gameData) {
        return;
    }
    if (amount <= 0) {
        return;
    }
    
    if (!gameData.today_cash_earned) {
        gameData.today_cash_earned = 0;
    }
    
    var oldVal = gameData.today_cash_earned;
    gameData.today_cash_earned += amount;
};
					
					
					
					
					
					// ═══════════════════════════════════════════════════════════════
					//  负荷修改统一入口（防数据不一致）
					// ═══════════════════════════════════════════════════════════════
					function modifyStamina(delta, skipSave) {
					    var oldStamina = stamina;
					    
					    // ═══════════════════════════════════════════════════════════════
					    //  一小时无限负荷卡：消耗时检查
					    // ═══════════════════════════════════════════════════════════════
					    					    if (delta < 0 && isUnlimitedStaminaActive()) {
					    					        var now = Date.now();
					    					        if (!window._lastUnlimitedNotify || now - window._lastUnlimitedNotify > 30000) {
					    					            showToast('⚡ 无限负荷生效中，本次不消耗负荷！', 'info');
					    					            window._lastUnlimitedNotify = now;
					    					        }
					    					        return stamina; // 直接返回，不执行后续扣除逻辑
					    					    }
					    
					    if (typeof STAMINA_MAX === 'undefined') STAMINA_MAX = 1000;
					    if (STAMINA_MAX < stamina) STAMINA_MAX = stamina;
					    stamina = Math.max(0, Math.min(STAMINA_MAX, stamina + delta));
					    
					    if (gameData) {
					        gameData.stamina = stamina;
					    }
					    
					    if (currentUser) {
					        localStorage.setItem('stamina_' + currentUser.id, String(stamina));
					    }
					    
					    updateUI();
					    
					    if (!skipSave) {
					        clearTimeout(window._staminaSaveTimer);
					        window._staminaSaveTimer = setTimeout(function() {
					            saveGameData();
					        }, 2000);
					    }
					    
					    return stamina;
					}
					// 肃清停止请求标记（点击停止后等待当前肃清完成）
					let battleStopRequested = false;
					// 自动肃清循环定时器
					let autoBattleLoopTimer = null;
					// 长按/自动肃清状态
					let battleBtnPressState = {
						pressing: false,
						timer: null,
						longPressThreshold: 800, // 800ms 触发长按
						autoMode: false
					};
					let autoBattleState = {
						active: false,
						timer: null,
						playerHp: 100,
						playerMaxHp: 100,
						enemy: null,
						enemyHp: 0,
						enemyMaxHp: 0,
						totalKills: 0,
						todayKills: 0,
						drops: [],
						currentPlanet: null,
						currentZone: null // 新增
					};

					// 自动勘探状态
					let autoMiningState = {
						active: false,
						timer: null,
						currentMineral: null,
						progress: 0,
						totalMined: 0,
						todayMined: 0,
						totalTime: 0,
						drops: []
					};

					// 自动回收状态
					let autoGatheringState = {
						active: false,
						timer: null,
						currentItem: null,
						progress: 0,
						totalGathered: 0,
						todayGathered: 0,
						totalTime: 0,
						drops: []
					};

					// 肃清页面状态：标记是否已进入过肃清页面（选择了星球）
					let battlePageEntered = false;

					// ═══════════════════════════════════════════════════════════════
					//  初始化
					// ═══════════════════════════════════════════════════════════════

					async function init() {
						// 重置回响奖励弹窗标记
						window._codexRewardShown = false;
						

						createStars();
						    initSupabase();
							
							
							    // ═══════════════════════════════════════════════════════════════
							    //  网络状态监听（断网锁定游戏）
							    // ═══════════════════════════════════════════════════════════════
							    
							    function handleNetworkChange() {
							        if (!navigator.onLine) {
							            // 断网：锁定操作
							            window._offlineLock = true;
							            window._globalActionLock = true;
							            
							            // 显示断网提示遮罩
							            var offlineOverlay = document.getElementById('offlineOverlay');
							            if (!offlineOverlay) {
							                offlineOverlay = document.createElement('div');
							                offlineOverlay.id = 'offlineOverlay';
							                offlineOverlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 99999; display: flex; align-items: center; justify-content: center;';
							                offlineOverlay.innerHTML = 
							                    '<div style="text-align: center; padding: 40px; max-width: 400px;">' +
							                    '<div style="font-size: 4rem; margin-bottom: 20px;">📡</div>' +
							                    '<div style="font-family: Orbitron; color: var(--grineer-red); font-size: 1.3rem; margin-bottom: 15px;">【星渊】链接中断</div>' +
							                    '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
							                    '与【星渊】的连接已断开<br>' +
							                    '请检查网络连接后尝试恢复' +
							                    '</div>' +
							                    '<button id="offlineReconnectBtn" style="padding: 12px 35px; background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: var(--void-black); border: none; border-radius: 8px; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700;">' +
							                    '🔄 恢复连接' +
							                    '</button>' +
							                    '</div>';
							                document.body.appendChild(offlineOverlay);
							                
							                // 恢复按钮点击
							                document.getElementById('offlineReconnectBtn').addEventListener('click', function() {
							                    if (navigator.onLine) {
							                        window._offlineLock = false;
							                        window._globalActionLock = false;
							                        offlineOverlay.remove();
							                        showToast('【星渊】链接已恢复', 'success');
							                        // 强制同步一次数据
							                        saveGameData();
							                    } else {
							                        showToast('网络仍未恢复，请检查连接', 'error');
							                    }
							                });
							            } else {
							                offlineOverlay.style.display = 'flex';
							            }
							        } else {
							            // 网络恢复：如果遮罩存在，显示恢复按钮
							            var offlineOverlay = document.getElementById('offlineOverlay');
							            if (offlineOverlay) {
							                var btn = document.getElementById('offlineReconnectBtn');
							                if (btn) {
							                    btn.textContent = '🔄 网络已恢复，点击解锁';
							                    btn.style.background = 'linear-gradient(135deg, var(--infested-green), #88ff88)';
							                }
							            }
							        }
							    }
							    
							    window.addEventListener('online', handleNetworkChange);
							    window.addEventListener('offline', handleNetworkChange);
							    
							    // 初始检查
							    if (!navigator.onLine) {
							        handleNetworkChange();
							    }
							
							
						    
						    // ═══════════════════════════════════════════════════════════════
						    //  全局服务器时间偏移（防时间作弊）
						    // ═══════════════════════════════════════════════════════════════
						    window.serverTimeOffset = 0;
						    async function syncServerTime() {
						        if (!sb) return;
						        try {
						            var { data, error } = await sb.rpc('get_server_time');
						            if (!error && data) {
						                window.serverTimeOffset = new Date(data).getTime() - Date.now();
						                console.log('服务器时间偏移:', window.serverTimeOffset, 'ms');
						            }
						        } catch(e) {}
						    }
						    syncServerTime();
						    // 每小时重新同步
						    setInterval(syncServerTime, 3600000);

						const savedId = localStorage.getItem('clan_user_id');
						if (savedId && sb) {
							await autoLogin(savedId);
						} else {
							const loginScreen = document.getElementById('loginScreen');
							if (loginScreen) {
								loginScreen.classList.remove('hidden');
							}
						}
						
						// ═══════════════════════════════════════════════════════════════
						    //  页面关闭保护 + 定期自动保存
						    // ═══════════════════════════════════════════════════════════════
						    
						    // 页面关闭/刷新前强制保存
						    window.addEventListener('beforeunload', function(e) {
						        if (gameData && currentUser) {
						            clearTimeout(window._staminaSaveTimer);
						            saveGameData();
						            if (_pendingSave) {
						                e.preventDefault();
						                e.returnValue = '有未保存的游戏进度，确定要离开吗？';
						            }
						        }
						    });
						    
						    // 每30秒自动保存
						    setInterval(function() {
						        if (gameData && currentUser) {
						            clearTimeout(window._staminaSaveTimer);
						            saveGameData();
						        }
						    }, 30000);
						}
						
					
					// 全局负荷同步：确保所有页面的负荷显示一致
					function syncAllStaminaDisplays() {
					    var allStaminaValues = document.querySelectorAll('[id="battleStaminaValue"]');
					    allStaminaValues.forEach(function(el) {
					        el.textContent = stamina + '/100';
					    });
					}

					async function autoLogin(savedId) {
						showLoading(true);
						try {
							const {
								data: user,
								error: userError
							} = await sb
								.from('game_users')
								.select('*')
								.eq('id', savedId)
								.single();

							if (userError || !user) {
								localStorage.removeItem('clan_user_id');
								document.getElementById('loginScreen').classList.remove('hidden');
								showToast('登录已过期，请重新登录', 'error');
								showLoading(false);
								return;
							}

							currentUser = user;
							await loadGameData(user);
						} catch (err) {
							console.error('自动登录失败:', err);
							document.getElementById('loginScreen').classList.remove('hidden');
							showToast('连接失败，请检查网络', 'error');
						} finally {
							showLoading(false);
						}
					}

					function createStars() {
						const container = document.getElementById('starsBg');
						// 关键修复：添加空值保护，失败时自动重试
						if (!container) {
setTimeout(createStars, 1000);
							return;
						}
						for (let i = 0; i < 150; i++) {
							const star = document.createElement('div');
							star.className = 'star';
							star.style.left = Math.random() * 100 + '%';
							star.style.top = Math.random() * 100 + '%';
							star.style.width = Math.random() * 3 + 'px';
							star.style.height = star.style.width;
							star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
							star.style.animationDelay = Math.random() * 5 + 's';
							container.appendChild(star);
						}
					}

					// ═══════════════════════════════════════════════════════════════
					//  加载游戏数据
					// ═══════════════════════════════════════════════════════════════
					async function loadGameData(user) {
					    try {
					        let { data: record, error } = await sb
					            .from('game_data')
					            .select('*')
					            .eq('user_id', user.id)
					            .maybeSingle();
					
					        if (!record) {
					            showLoading(false);
					            showToast('欢迎，Tenno！请选择你的初始战甲', 'info');
					            showWarframeSelect(user);
					            return;
					        }
					        if (error) throw error;
					
					                        gameData = record;
					                        window.gameData = gameData;


					                        if (typeof record?.today_cash_earned !== 'undefined') {
					                            gameData.today_cash_earned = record.today_cash_earned;
					                            
					                        } else {
					                            
					                            gameData.today_cash_earned = 0;
					                        }
					
					        gameData.codexRewardClaimed = record.codex_reward_claimed || false;
							
							
					
					        gameData.rout_points = user.rout_points || 0;
					        gameData.prime_points = user.prime_points || 0;
					        gameData.vip_points = user.vip_points || 0;
					
					        stamina = gameData.stamina || 100;
					        STAMINA_MAX = Math.max(gameData.stamina_max || 100, stamina);
					        STAMINA_NATURAL_MAX = 100; // 自然恢复上限固定100，永远不变
							
							        // 重构队列恢复（从数据库读取）
							        gameData.foundryQueue = gameData.foundry_queue || {};
					
					        // ========== 关键修复：反向同步到 gameData ==========
					        gameData.stamina = stamina;
					        gameData.stamina_max = STAMINA_MAX;
					        gameData.stamina_natural_max = STAMINA_NATURAL_MAX;
					
					        // 恢复重构队列
					        gameData.foundryQueue = gameData.foundry_queue || {};
					        // 恢复战甲列表
					        gameData.ownedWarframes = gameData.owned_warframes || [gameData.warframe_type || 'excalibur'];
					        gameData.activeWarframe = gameData.active_warframe || gameData.warframe_type || 'excalibur';
							        // 恢复每日现金获取记录
							                // 恢复每日现金获取记录
							                gameData.today_cash_earned = gameData.today_cash_earned || 0;
							
					        warehouse = gameData.warehouse || [];
					        window.warehouse = warehouse;
					        playerCards = gameData.player_cards || {};
					        window.playerCards = playerCards;
					
					        if (gameData.card_shards) {
					            if (!playerCards._shards) playerCards._shards = {};
					            Object.assign(playerCards._shards, gameData.card_shards);
					        }
					
					        const todayStats = gameData.today_stats || {};
					        const totalStats = gameData.total_stats || {};
					
					        autoBattleState.todayKills = todayStats.kills || 0;
					        autoBattleState.totalKills = totalStats.kills || 0;
					        autoMiningState.todayMined = todayStats.mining || 0;
					        autoMiningState.totalMined = totalStats.mining || 0;
					        autoMiningState.totalTime = totalStats.miningTime || 0;
					        autoGatheringState.todayGathered = todayStats.gathering || 0;
					        autoGatheringState.totalGathered = totalStats.gathering || 0;
					        autoGatheringState.totalTime = totalStats.gatheringTime || 0;
					
					        const pointsKey = `points_${user.id}`;
					        localStorage.setItem(pointsKey, JSON.stringify({
					            rout_points: gameData.rout_points,
					            prime_points: gameData.prime_points,
					            vip_points: gameData.vip_points
					        }));
					        localStorage.setItem('stamina_' + user.id, String(stamina));
					
					        await checkDailyReset();
					        enterGame();
					
					        updateSyncStatus(true);
					        const now = new Date().getTime();
					        const last = gameData.last_login ? new Date(gameData.last_login).getTime() : 0;
					        const thirtyMinutes = 10 * 60 * 1000;
					        if (now - last >= thirtyMinutes) {
					            showToast(`欢迎回来， ${user.username}`, 'success');
					        }
					        gameData.last_login = new Date().toISOString();
					        await saveGameData();
					    } catch (err) {
					        console.error('加载游戏数据失败:', err);
					        showToast('加载游戏数据失败: ' + err.message, 'error');
					    } finally {
					        showLoading(false);
					    }
					}

					async function createGameData(user, selectedType) {
						const wf = WARFRAMES[selectedType] || WARFRAMES.excalibur;
						const stats = wf.stats || {
							shield: 100,
							health: 100,
							energy: 100,
							armor: 100,
							speed: 10
						};

						const newData = {
							user_id: user.id,
							username: user.username,

							warframe_type: selectedType || 'excalibur',
							warframe_level: 1,
							warframe_xp: 0,
							warframe_max_xp: 100,
							warframe_levels: {
								excalibur: {
									level: 1,
									xp: 0,
									max_xp: 100
								},
								volt: {
									level: 1,
									xp: 0,
									max_xp: 100
								},
								mag: {
									level: 1,
									xp: 0,
									max_xp: 100
								},
								rhino: {
									level: 1,
									xp: 0,
									max_xp: 100
								}
							},

							stat_shield: stats.shield || 100,
							stat_health: stats.health || 100,
							stat_energy: stats.energy || 100,
							stat_armor: stats.armor || 100,
							stat_speed: stats.speed || 10,

							stamina: 100,
							stamina_max: 100,
							stamina_natural_max: 100,

							warehouse: [],
							player_cards: {},
							card_shards: {},

							codex: {
								grineer: 0,
								corpus: 0,
								infested: 0,
								sentient: 0
							},
							missions: {},
							ownedWarframes: ['excalibur'], // 已拥有的战甲列表（初始只有Excalibur）
							activeWarframe: 'excalibur',   // 当前使用的战甲
							foundry: {},

							today_stats: {
								battles: 0,
								kills: 0,
								mining: 0,
								gathering: 0
							},
							total_stats: {
								kills: 0,
								mining: 0,
								gathering: 0,
								miningTime: 0,
								gatheringTime: 0
							},

							streak: 1,
							last_login: new Date().toISOString(),
							last_login_reward_date: new Date().toISOString().split('T')[0],
							today_completed: 0,
							today_points: 0
						};
const {
							data,
							error
						} = await sb
							.from('game_data')
							.insert(newData)
							.select();

						if (error) {
							console.error('createGameData INSERT 失败:', error);
							throw error;
						}
// 确保返回的是对象
						const result = Array.isArray(data) ? data[0] : data;
						if (!result) {
							throw new Error('createGameData 失败：无返回数据');
						}

						return result;
					}



// 保存锁（防止并发覆盖）
let _isSaving = false;
let _pendingSave = false;
window.saveGameData = saveGameData;
async function saveGameData() {
    if (!gameData || !currentUser) return;
     // 调试日志：保存前检查
        
    // 如果正在保存，标记待保存并返回
    if (_isSaving) {
        _pendingSave = true;
        return;
    }
    
    _isSaving = true;
    _pendingSave = false;
    updateSyncStatus(false, 'syncing');

    try {
        // 保存 game_users 表
        const { error: userError } = await sb
            .from('game_users')
            .update({
                username: currentUser.username,
                password: currentUser.password,
                rout_points: gameData.rout_points || 0,
                prime_points: gameData.prime_points || 0,
                vip_points: gameData.vip_points || 0
            })
            .eq('id', currentUser.id);

        if (userError) throw userError;

        const todayStats = {
            battles: autoBattleState.todayKills || 0,
            kills: autoBattleState.todayKills || 0,
            mining: autoMiningState.todayMined || 0,
            gathering: autoGatheringState.todayGathered || 0
        };

        const totalStats = {
            kills: autoBattleState.totalKills || 0,
            mining: autoMiningState.totalMined || 0,
            gathering: autoGatheringState.totalGathered || 0,
            miningTime: autoMiningState.totalTime || 0,
            gatheringTime: autoGatheringState.totalTime || 0
        };

        const cardShards = playerCards._shards || {};
		
        // ========== 关键修复：构建安全的数据对象，所有字段都有默认值 ==========
        const safeGameData = {
            warframe_type: gameData.warframe_type || 'excalibur',
            warframe_level: gameData.warframe_level || 1,
            warframe_xp: gameData.warframe_xp || 0,
            warframe_max_xp: gameData.warframe_max_xp || 100,
            warframe_levels: gameData.warframe_levels || {
                excalibur: { level: 1, xp: 0, max_xp: 100 },
                volt: { level: 1, xp: 0, max_xp: 100 },
                mag: { level: 1, xp: 0, max_xp: 100 },
                rhino: { level: 1, xp: 0, max_xp: 100 }
            },
            stat_shield: gameData.stat_shield || 100,
			
            stat_health: gameData.stat_health || 100,
            stat_energy: gameData.stat_energy || 100,
            stat_armor: gameData.stat_armor || 100,
            stat_speed: gameData.stat_speed || 10,
            stamina: (gameData.stamina ?? stamina ?? 100),
            stamina_max: (gameData?.stamina_max ?? STAMINA_MAX ?? 100),
            stamina_natural_max: (gameData.stamina_natural_max ?? STAMINA_NATURAL_MAX ?? 100),
            warehouse: warehouse || [],
            player_cards: playerCards || {},
            card_shards: cardShards || {},
            codex: gameData.codex || { grineer: 0, corpus: 0, infested: 0, sentient: 0 },
            missions: gameData.missions || {},
            foundry: gameData.foundry || {},
            foundry_queue: gameData.foundryQueue || {},
            owned_warframes: gameData.ownedWarframes || [gameData.warframe_type || 'excalibur'],
            active_warframe: gameData.activeWarframe || gameData.warframe_type || 'excalibur',
today_stats: todayStats,
            total_stats: totalStats,
            today_cash_earned: gameData.today_cash_earned || 0,
            last_login_reward_date: gameData.last_login_reward_date || gameData.last_login || new Date().toISOString().split('T')[0],  // ← 添加这行
                last_weekly_reward_date: gameData.last_weekly_reward_date || null,  // ← 同时添加这行（如果存在）
            codex_reward_claimed: gameData.codexRewardClaimed === true,
            streak: gameData.streak || 1,
            last_login: gameData.last_login || new Date().toISOString(),
            today_completed: gameData.today_completed || 0,
            today_points: gameData.today_points || 0
        };
		
		        

        // ========== 关键修复：使用 RPC 合并更新，避免替换整个 JSONB 列导致数据丢失 ==========
        let saveSuccess = false;
        try {
            const { error: rpcError } = await sb.rpc('merge_game_data', {
                p_user_id: currentUser.id,
                p_data: safeGameData
            });

            if (!rpcError) {
                saveSuccess = true;
                
            } else {
                console.warn('merge_game_data RPC 失败，尝试后备方案:', rpcError);
            }
        } catch (rpcErr) {
            console.warn('merge_game_data RPC 异常，尝试后备方案:', rpcErr);
        }

        // 后备方案：如果 RPC 失败，使用传统 update
        if (!saveSuccess) {
            
            const { data: existingRecord, error: checkError } = await sb
                .from('game_data')
                .select('id')
                .eq('user_id', currentUser.id)
                .maybeSingle();

            if (checkError) throw checkError;

            if (existingRecord) {
                const { error: updateError } = await sb
                    .from('game_data')
                    .update(safeGameData)
                    .eq('id', existingRecord.id);

                if (updateError) {
                    console.error('UPDATE 失败:', updateError);
                    throw updateError;
                }
            } else {
                const { data: insertedData, error: insertError } = await sb
                    .from('game_data')
                    .insert({
                        user_id: currentUser.id,
                        username: currentUser.username,
                        ...safeGameData
                    })
                    .select();

                if (insertError) {
                    console.error('INSERT 失败:', insertError);
                    throw insertError;
                }
            }
        }

		


        // 更新本地缓存
        currentUser.rout_points = gameData.rout_points || 0;
        currentUser.prime_points = gameData.prime_points || 0;
        currentUser.vip_points = gameData.vip_points || 0;

        const pointsKey = `points_${currentUser.id}`;
        localStorage.setItem(pointsKey, JSON.stringify({
            rout_points: gameData.rout_points || 0,
            prime_points: gameData.prime_points || 0,
            vip_points: gameData.vip_points || 0
        }));
        localStorage.setItem('stamina_' + currentUser.id, String(safeGameData.stamina));

                        updateSyncStatus(true);
                        
        
            } catch (err) {
               
                updateSyncStatus(false, 'offline');
            } finally {
                _isSaving = false;
                // 如果有待保存数据，100ms后执行
                if (_pendingSave) {
                    setTimeout(() => saveGameData(), 100);
                }
            }
			
			    // 页面加载完成后验证矩阵图片
			    setTimeout(function() {
			        validateWarehouseImages();
			    }, 2000);
        }

					// ═══════════════════════════════════════════════════════════════
					//  登录 / 注册
					// ═══════════════════════════════════════════════════════════════
					function switchTab(tab) {
						document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
						event.target.classList.add('active');

						if (tab === 'login') {
							document.getElementById('loginForm').classList.remove('hidden');
							document.getElementById('registerForm').classList.add('hidden');
						} else {
							document.getElementById('loginForm').classList.add('hidden');
							document.getElementById('registerForm').classList.remove('hidden');
						}
					}

					async function handleLogin() {
						const username = document.getElementById('loginEmail').value.trim();
						const password = document.getElementById('loginPassword').value;

						if (!username || !password) {
							showToast('请输入代号与密钥', 'error');
							return;
						}

						showLoading(true);
						try {
							const {
								data,
								error
							} = await sb
								.from('game_users')
								.select('*')
								.eq('username', username)
								.eq('password', password)
								.single();

							if (error || !data) {
								showToast('代号或密钥错误', 'error');
								showLoading(false);
								return;
							}

							currentUser = data;
							localStorage.setItem('clan_user_id', data.id);
							await loadGameData(data);
							showLoading(false);
						} catch (err) {
							showToast('登录失败: ' + err.message, 'error');
							showLoading(false);
						}
					}

					async function handleRegister() {
						const username = document.getElementById('regUsername').value.trim();
						const password = document.getElementById('regPassword').value;
						const password2 = document.getElementById('regPassword2').value;

						if (!username || !password) {
							showToast('请填写完整信息', 'error');
							return;
						}

						if (password.length < 4) {
							showToast('密钥至少需要4位', 'error');
							return;
						}

						if (password !== password2) {
							showToast('两次密钥输入不一致', 'error');
							return;
						}

						showLoading(true);
						try {
							const {
								data: existing
							} = await sb
								.from('game_users')
								.select('username')
								.eq('username', username)
								.single();

							if (existing) {
								showToast('该代号已被占用', 'error');
								showLoading(false);
								return;
							}

							const {
								data: user,
								error
							} = await sb
								.from('game_users')
								.insert({
									username: username,
									password: password,
									clan_rank: 'member',
									created_at: new Date().toISOString(),
									rout_points: 0,
									prime_points: 0,
									vip_points: 0,
									daily_draw_count: 0,
									last_draw_date: null
								})
								.select()
								.single();

							if (error) throw error;

							currentUser = user;
							localStorage.setItem('clan_user_id', user.id);
							showWarframeSelect(user);
							showLoading(false);
							showToast('觉醒成功！请选择你的战甲', 'success');
							createFissureEffect();
						} catch (err) {
							showToast('注册失败: ' + err.message, 'error');
						} finally {
							showLoading(false);
						}
					}

					async function logout() {
						await saveGameData();
						localStorage.removeItem('clan_user_id');
						currentUser = null;
						gameData = null;
						document.getElementById('gameContainer').style.display = 'none';
						document.getElementById('loginScreen').classList.remove('hidden');
						document.getElementById('loginEmail').value = '';
						document.getElementById('loginPassword').value = '';
						updateSyncStatus(false, 'offline');
						showToast('已安全断开与【星渊】的链接', 'success');
					}


					// ═══════════════════════════════════════════════════════════════
					//  服务器日期获取（登录奖励防作弊）
					// ═══════════════════════════════════════════════════════════════
					async function getServerDate() {
					    try {
					        const { data, error } = await sb.rpc('get_server_date');
					        if (error) throw error;
					        // 服务器返回 UTC 日期，转换为北京时间（UTC+8）
					        var utcDate = new Date(data + 'T00:00:00Z');
					        var beijingDate = new Date(utcDate.getTime() + 8 * 60 * 60 * 1000);
					        return beijingDate.getFullYear() + '-' + 
					               String(beijingDate.getMonth() + 1).padStart(2, '0') + '-' + 
					               String(beijingDate.getDate()).padStart(2, '0');
					    } catch (err) {
					        console.error('获取服务器日期失败:', err);
					        // 后备：本地日期转换为北京时间
					        var now = new Date();
					        var beijingNow = new Date(now.getTime() + (now.getTimezoneOffset() + 480) * 60 * 1000);
					        return beijingNow.getFullYear() + '-' + 
					               String(beijingNow.getMonth() + 1).padStart(2, '0') + '-' + 
					               String(beijingNow.getDate()).padStart(2, '0');
					    }
					}
					
					// 检查今日是否已领取
					async function checkDailyLoginReward() {
					    if (!gameData || !currentUser) return false;
					    var serverDate = await getServerDate();
					    var lastDate = gameData.last_login_reward_date || '';
					    return lastDate !== serverDate; // 日期不同 = 可领取
					}
					
					// 领取每日奖励（+100负荷）
async function claimDailyLoginReward() {
    if (!await checkDailyLoginReward()) {
        return;
    }
    
    var serverDate = await getServerDate();
    var currentStamina = stamina || 0;
    
    var recover = Math.max(0, Math.min(100, 1000 - currentStamina));
    var newStamina = currentStamina + recover;
    
    if (recover > 0) {
        stamina = newStamina;
        STAMINA_MAX = Math.max(STAMINA_MAX, stamina);
        if (gameData) {
            gameData.stamina = stamina;
            gameData.stamina_max = STAMINA_MAX;
            gameData.stamina_natural_max = 100;
        }
        if (currentUser) localStorage.setItem('stamina_' + currentUser.id, String(stamina));
        updateUI();
    }
    
    gameData.last_login_reward_date = serverDate;
    await saveGameData();
    
    showDailyLoginRewardModal(recover, currentStamina, newStamina);
}
					
					// 检查7天奖励
					async function checkWeeklyLoginReward() {
					    if (!gameData || !currentUser) return false;
					    if (!gameData.streak || gameData.streak % 7 !== 0) return false;
					    var serverDate = await getServerDate();
					    return gameData.last_weekly_reward_date !== serverDate;
					}
					
					// 领取7天奖励（+3💎）
					async function claimWeeklyLoginReward() {
					    if (!await checkWeeklyLoginReward()) return;
					    
					    var serverDate = await getServerDate();
					    gameData.prime_points = (gameData.prime_points || 0) + 3;
					    currentUser.prime_points = gameData.prime_points;
					    gameData.last_weekly_reward_date = serverDate;
					    
					    await saveGameData();
					    updateUI();
					    showWeeklyLoginRewardModal();
					}

async function checkDailyReset() {
    if (!gameData) return;

    var serverDate = await getServerDate();
    var lastDate = gameData.last_login_reward_date || '';

    if (!lastDate) {
        // 首次登录
        gameData.last_login_reward_date = serverDate;
        gameData.streak = 1;
        await saveGameData();
        setTimeout(claimDailyLoginReward, 500);
        return;
    }

    // 服务器日期 > 上次领取日期 = 跨天
    if (serverDate > lastDate) {
        var lastObj = new Date(lastDate + 'T00:00:00+08:00');
        var nowObj = new Date(serverDate + 'T00:00:00+08:00');
        var dayDiff = Math.floor((nowObj - lastObj) / 86400000);

        if (dayDiff === 1) {
            gameData.streak = (gameData.streak || 0) + 1;
            showToast(`连续登录 ${gameData.streak} 天！`, 'success');
            if (gameData.streak % 7 === 0) {
                setTimeout(claimWeeklyLoginReward, 1500);
            }
        } else {
            gameData.streak = 1;
            showToast('欢迎回来，连续登录已重置', 'warning');
        }

        // 重置所有每日数据
        gameData.today_completed = 0;
        gameData.today_points = 0;
        gameData.missions = {};
        gameData.today_stats = { battles: 0, kills: 0, mining: 0, gathering: 0 };
        gameData.today_cash_earned = 0;

        await saveGameData();
        setTimeout(claimDailyLoginReward, 500);
    }
}
					
					// ═══════════════════════════════════════════════════════════════
					//  每日登录奖励弹窗（+100负荷）
					// ═══════════════════════════════════════════════════════════════
function showDailyLoginRewardModal(recover, oldVal, newVal) {
    var overlay = document.createElement('div');
    overlay.id = 'dailyLoginRewardOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease;';

    // 根据是否有实际恢复量显示不同内容
    var rewardHtml;
    if (recover > 0) {
        rewardHtml = 
            '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
            '欢迎回来，Tenno！<br>' +
            '每日登录奖励<br>' +
            '<span style="color: var(--infested-green); font-family: Orbitron; font-size: 1.4rem; font-weight: 700;">+' + recover + ' 负荷</span>' +
            '</div>' +
            '<div style="background: rgba(78,255,78,0.1); border: 1px solid rgba(78,255,78,0.3); border-radius: 10px; padding: 12px; margin-bottom: 20px;">' +
            '<div style="color: var(--infested-green); font-size: 0.85rem;">当前负荷: <span style="font-family: Orbitron; font-size: 1.1rem;">' + oldVal + ' → ' + newVal + '</span></div>' +
            '<div style="color: #888; font-size: 0.75rem; margin-top: 4px;">(绝对上限 1000)</div>' +
            '</div>';
    } else {
        rewardHtml = 
            '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
            '欢迎回来，Tenno！<br>' +
            '<span style="color: var(--tenno-gold); font-size: 1.1rem;">⚡ 负荷已满</span><br>' +
            '<span style="color: #666; font-size: 0.85rem;">当前负荷已达到上限，无需恢复</span>' +
            '</div>' +
            '<div style="background: rgba(200,168,75,0.1); border: 1px solid rgba(200,168,75,0.3); border-radius: 10px; padding: 12px; margin-bottom: 20px;">' +
            '<div style="color: var(--tenno-gold); font-size: 0.85rem;">当前负荷: <span style="font-family: Orbitron; font-size: 1.1rem;">' + oldVal + ' / 1000</span></div>' +
            '</div>';
    }

    overlay.innerHTML = 
        '<div style="background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 2px solid var(--infested-green); border-radius: 16px; padding: 35px; max-width: 380px; width: 90%; text-align: center; animation: cardPopIn 0.5s ease;">' +
        '<div style="font-size: 3.5rem; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(78,255,78,0.5));">⚡</div>' +
        '<div style="font-family: Orbitron; color: var(--infested-green); font-size: 1.3rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(78,255,78,0.3);">每日登录奖励</div>' +
        rewardHtml +
        '<button id="dailyLoginRewardBtn" style="padding: 12px 35px; background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000; border: none; border-radius: 8px; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700; transition: all 0.3s;">' +
        '✨ 领取奖励' +
        '</button>' +
        '</div>';

    document.body.appendChild(overlay);
document.getElementById('dailyLoginRewardBtn').addEventListener('click', function() {
    overlay.remove();
    if (recover > 0) {
        showToast('⚡ 每日登录奖励已领取：+' + recover + ' 负荷', 'success');
    }
});
}

function showWeeklyLoginRewardModal() {
    var currentPoints = gameData?.prime_points || 0;
    var overlay = document.createElement('div');
    overlay.id = 'weeklyLoginRewardOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 10001; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease;';

    overlay.innerHTML = 
        '<div style="background: linear-gradient(135deg, #1a1a1a, #0a0a0a); border: 2px solid var(--orokin-cyan); border-radius: 16px; padding: 35px; max-width: 380px; width: 90%; text-align: center; animation: cardPopIn 0.5s ease;">' +
        '<div style="font-size: 3.5rem; margin-bottom: 15px; filter: drop-shadow(0 0 15px rgba(0,212,255,0.5));">💎</div>' +
        '<div style="font-family: Orbitron; color: var(--orokin-cyan); font-size: 1.3rem; margin-bottom: 10px; text-shadow: 0 0 10px rgba(0,212,255,0.3);">连续登录7天奖励</div>' +
        '<div style="color: #888; font-size: 0.9rem; margin-bottom: 20px; line-height: 1.6;">' +
        '恭喜！你已连续登录7天！<br>' +
        '获得额外奖励<br>' +
        '<span style="color: var(--orokin-cyan); font-family: Orbitron; font-size: 1.4rem; font-weight: 700;">+3 Prime</span>' +
        '</div>' +
        '<div style="background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); border-radius: 10px; padding: 12px; margin-bottom: 20px;">' +
        '<div style="color: var(--orokin-cyan); font-size: 0.85rem;">当前Prime: <span style="font-family: Orbitron; font-size: 1.1rem;">' + currentPoints + ' → ' + (currentPoints + 3) + '</span></div>' +
        '</div>' +
        '<button id="weeklyLoginRewardBtn" style="padding: 12px 35px; background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan)); color: #000; border: none; border-radius: 8px; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700; transition: all 0.3s;">' +
        '✨ 领取奖励' +
        '</button>' +
        '</div>';

    document.body.appendChild(overlay);
    document.getElementById('weeklyLoginRewardBtn').addEventListener('click', function() {
        overlay.remove();
        showToast('已领取7天登录奖励 +3 Prime！', 'success');
    });
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.remove();
    });
}
						
						
						
						
					// ═══════════════════════════════════════════════════════════════
					//  页面切换
					// ═══════════════════════════════════════════════════════════════
					function switchPage(page) {

						// 特殊处理：点击"肃清"导航时
						if (page === 'planetselect') {
							// 如果已经进入过肃清页面（选择了星球），保持显示肃清页面
							if (battlePageEntered) {
								document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
								document.getElementById('page-dashboard').classList.remove('hidden');

								// 更新导航高亮
								document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
								const navItems = document.querySelectorAll('.nav-item');
								for (let i = 0; i < navItems.length; i++) {
									const onclick = navItems[i].getAttribute('onclick');
									if (onclick && onclick.includes("'planetselect'")) {
										navItems[i].classList.add('active');
										break;
									}
								}

								// 同步按钮状态
								const startBtn = document.getElementById('startBattleBtn');
								const continueBtn = document.getElementById('continueBattleBtn');
								const stopBtn = document.getElementById('stopBattleBtn');

								if (autoBattleState.active) {
									// 正在肃清中
									if (startBtn) startBtn.style.display = 'none';
									if (continueBtn) continueBtn.style.display = 'none';
									if (stopBtn) {
										stopBtn.style.display = 'block';
										if (battleStopRequested) {
											// 已请求停止，等待结束中
											stopBtn.textContent = '⏳ 等待结束中';
											stopBtn.style.background = 'linear-gradient(135deg, #5a4a2a, var(--tenno-gold))';
										} else {
											// 肃清中，可以点停止
											stopBtn.textContent = '🛑 停止肃清';
											stopBtn.style.background = '';
										}
										stopBtn.disabled = false;
									}

								} else if (battleBtnPressState.autoMode) {
									// 自动模式但当前没在肃清（等待负荷或间隔）：只显示停止按钮
									if (startBtn) startBtn.style.display = 'none';
									if (continueBtn) continueBtn.style.display = 'none';
									if (stopBtn) {
										stopBtn.style.display = 'block';
										if (battleStopRequested) {
											stopBtn.textContent = '⏳ 等待结束中';
											stopBtn.style.background = 'linear-gradient(135deg, #5a4a2a, var(--tenno-gold))';
										} else {
											stopBtn.textContent = '🛑 停止肃清';
											stopBtn.style.background = '';
										}
										stopBtn.disabled = false;
									}
								} else {
									// 普通状态，未在自动肃清
									if (startBtn) {
										startBtn.style.display = 'block';
										startBtn.textContent = '🌍 肃清导航';
									}
									if (continueBtn) {
										continueBtn.style.display = selectedPlanet ? 'block' : 'none';
										continueBtn.classList.remove('btn-auto-mode');
										continueBtn.disabled = false;
										document.getElementById('continueBattleBtnText').textContent = '⚔️ 肃清(-3⚡)';
									}
									if (stopBtn) {
										stopBtn.style.display = 'none';
										stopBtn.textContent = '🛑 停止肃清';
										stopBtn.style.background = '';
										stopBtn.disabled = false;
									}
								}
								return;
							}
						}

						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

						const allNavItems = document.querySelectorAll('.nav-item');
						for (let i = 0; i < allNavItems.length; i++) {
							const onclick = allNavItems[i].getAttribute('onclick');
							if (onclick && onclick.includes("'" + page + "'")) {
								allNavItems[i].classList.add('active');
								break;
							}
						}

						document.querySelectorAll('.page-section').forEach(section => section.classList.add('hidden'));
						document.getElementById('page-' + page).classList.remove('hidden');

						if (page === 'foundry') renderFoundry();
						if (page === 'warehouse') renderWarehouse();
						if (page === 'leaderboard') loadLeaderboard();
						if (page === 'shop') {
						    renderShop();
						    renderStaminaShop();

						    var shopPointsEl = document.getElementById('shopPoints');
						    if (shopPointsEl) shopPointsEl.textContent = gameData.rout_points || 0;

						    document.getElementById('marooMarketEntrance').style.display = 'block';
						    document.getElementById('primeShopArea').style.display = 'block';
						    document.getElementById('page-maroo').style.display = 'none';

						    // 更新申秉之魂显示
						    var marooPointsEl = document.getElementById('marooPoints');
						    if (marooPointsEl) {
						        var sbItem = (window.warehouse || []).find(function(w) { return w && w.name === '申秉之魂'; });
						        marooPointsEl.textContent = sbItem ? (sbItem.amount || 0) : 0;
						    }
						}
						if (page === 'dashboard') updateBattleUI();
						
						if (page === 'mining') {
						    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						    document.getElementById('page-mining-select').classList.remove('hidden');
						    renderMiningPlanetSelect();
						}
						if (page === 'gathering') {
						    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						    document.getElementById('page-gathering-select').classList.remove('hidden');
						    renderGatheringPlanetSelect();
						}
						
											
						if (page === 'info') updateInfoUI();
						if (page === 'music') {
    // 隐藏迷你播放器
    var miniPlayer = document.getElementById('musicPlayerWidget');
    if (miniPlayer) miniPlayer.style.display = 'none';
    renderMusicConsole();
}
						if (page === 'planetselect') renderPlanetSelect();
						if (page === 'admintest') {
							// admin 测试页面不需要额外初始化
						}
						if (page === 'codex') {
						    initPlayerCards();
						    currentCodexCategory = 'all'; // 重置为全部
						    // 重置标签样式
						    document.querySelectorAll('.codex-tab').forEach(function(tab) {
						        if (tab.dataset.category === 'all') {
						            tab.classList.add('active');
						            tab.style.borderColor = 'var(--orokin-cyan)';
						            tab.style.color = 'var(--orokin-cyan)';
						        } else {
						            tab.classList.remove('active');
						            tab.style.borderColor = '#333';
						            tab.style.color = '#888';
						        }
						    });
						    updateCodexOverview();
						    renderCodexFactions();
						}
					}



					function enterGame() {
						closeModal();
						document.getElementById('loginScreen').classList.add('hidden');
						document.getElementById('gameContainer').style.display = 'block';

						// 关键修复：确保 gameData 所有必要字段都有默认值
						if (!gameData) {
							console.error('enterGame: gameData 为空');
							showToast('游戏数据加载失败，请重新登录', 'error');
							logout();
							return;
						}

    // 防御性初始化：确保所有 JSONB 字段都有默认值
    if (!gameData) {
        console.error('enterGame: gameData 为空');
        showToast('游戏数据加载失败，请重新登录', 'error');
        logout();
        return;
    }
    
    // 关键补全：确保 warframe_levels 存在且包含当前战甲
    const currentType = gameData.warframe_type || 'excalibur';
    if (!gameData.warframe_levels) {
        gameData.warframe_levels = {
            excalibur: { level: 1, xp: 0, max_xp: 100 },
            volt: { level: 1, xp: 0, max_xp: 100 },
            mag: { level: 1, xp: 0, max_xp: 100},
            rhino: { level: 1, xp: 0, max_xp: 100 }
        };
    }
    if (!gameData.warframe_levels[currentType]) {
        gameData.warframe_levels[currentType] = {
            level: gameData.warframe_level || 1,
            xp: gameData.warframe_xp || 0,
            max_xp: gameData.warframe_max_xp || 1000
        };
    }
	
						gameData.warehouse = gameData.warehouse || [];
						gameData.player_cards = gameData.player_cards || {};
						gameData.card_shards = gameData.card_shards || {};
						gameData.codex = gameData.codex || {
							grineer: 0,
							corpus: 0,
							infested: 0,
							sentient: 0
						};
    gameData.codexRewardClaimed = gameData.codexRewardClaimed || false;
						gameData.missions = gameData.missions || {};
						gameData.foundry = gameData.foundry || {};
						// 初始化重构队列
						gameData.foundryQueue = gameData.foundryQueue || {};
						// 初始化已拥有战甲
						gameData.ownedWarframes = gameData.ownedWarframes || [gameData.warframe_type || 'excalibur'];
						gameData.activeWarframe = gameData.activeWarframe || gameData.warframe_type || 'excalibur';
						// 加载已拥有战甲列表
						gameData.ownedWarframes = gameData.ownedWarframes || ['excalibur'];
						gameData.activeWarframe = gameData.activeWarframe || gameData.warframe_type || 'excalibur';
						gameData.today_stats = gameData.today_stats || {
							battles: 0,
							kills: 0,
							mining: 0,
							gathering: 0
						};
    // 初始化每日现金获取记录
    gameData.today_cash_earned = gameData.today_cash_earned || 0;
						gameData.total_stats = gameData.total_stats || {
							kills: 0,
							mining: 0,
							gathering: 0,
							miningTime: 0,
							gatheringTime: 0
						};
						gameData.stamina = gameData.stamina || 100;
						gameData.stamina_max = gameData.stamina_max || 100;
						gameData.stamina_natural_max = gameData.stamina_natural_max || 100;

						// 同步到全局变量
						warehouse = gameData.warehouse;
						window.warehouse = warehouse;
						playerCards = gameData.player_cards;
						window.playerCards = playerCards;
						stamina = gameData.stamina;
						STAMINA_MAX = gameData.stamina_max;
						STAMINA_NATURAL_MAX = gameData.stamina_natural_max;
						
						// 在 enterGame() 函数中，找到所有初始化代码后添加：
						gameData.stamina = stamina;
						gameData.stamina_max = STAMINA_MAX;
						gameData.stamina_natural_max = STAMINA_NATURAL_MAX;

						// 安全执行 UI 更新
						try {
							updateUI();
							// 恢复无限负荷状态
							restoreUnlimitedStaminaState();
							// 防御性调用
							try {
							    if (typeof updateBattleUI === 'function') {
							        updateBattleUI();
							    }
							} catch (err) {
}
							// 防御性调用
							try {
							    if (typeof updateMiningUI === 'function') {
							        updateMiningUI();
							    }
							} catch (err) {
}
							updateGatheringUI();
							renderPlanetSelect();
							window.battlePageEntered = false;
							checkAdminAccess();
						} catch (err) {
							console.error('enterGame UI 更新失败:', err);
							showToast('界面渲染失败: ' + err.message, 'error');
						}
					}
					
					// 定期刷新重构厂，更新重构进度
					setInterval(() => {
					    if (document.getElementById('page-foundry') && 
					        !document.getElementById('page-foundry').classList.contains('hidden')) {
					        renderFoundry();
					    }
					}, 30000); // 每30秒刷新一次
					
						
						// ═══════════════════════════════════════════════════════════════
						//  通用确认弹窗系统
						// ═══════════════════════════════════════════════════════════════
						let confirmCallback = null;
						let confirmBtnClass = '';
						
						function showConfirmModal(options) {
						    const overlay = document.getElementById('confirmModalOverlay');
						    const icon = document.getElementById('confirmModalIcon');
						    const title = document.getElementById('confirmModalTitle');
						    const desc = document.getElementById('confirmModalDesc');
						    const costBox = document.getElementById('confirmCostBox');
						    const btn = document.getElementById('confirmModalBtn');
						
						    icon.textContent = options.icon || '❓';
						    title.textContent = options.title || '确认操作';
						    desc.textContent = options.desc || '';
						
						    // 渲染消耗/获得信息
						    let costHtml = '';
						    if (options.costs && options.costs.length > 0) {
						        costHtml = options.costs.map(cost => {
						            const valueClass = cost.type === 'cost' ? 'negative' : (cost.type === 'gain' ? 'positive' : 'neutral');
						            return `
						                <div class="confirm-cost-row">
						                    <span class="confirm-cost-label">${cost.label}</span>
						                    <span class="confirm-cost-value ${valueClass}">${cost.value}</span>
						                </div>
						            `;
						        }).join('');
						    }
						    costBox.innerHTML = costHtml || '';
						
						    // 按钮样式
						    btn.className = 'confirm-btn confirm-btn-confirm' + (options.danger ? ' danger' : '');
						    btn.textContent = options.btnText || '确认';
						
						    confirmCallback = options.onConfirm;
						    confirmBtnClass = options.danger ? 'danger' : '';
						
						    overlay.classList.add('active');
						}
						
						function closeConfirmModal() {
						    document.getElementById('confirmModalOverlay').classList.remove('active');
						    confirmCallback = null;
						}
						
						function executeConfirmAction() {
						    if (typeof confirmCallback === 'function') {
						        confirmCallback();
						    }
						    closeConfirmModal();
						}
						
						
						
						
					// ═══════════════════════════════════════════════════════════════
					//  Admin 权限检查
					// ═══════════════════════════════════════════════════════════════
					function checkAdminAccess() {
						const adminNav = document.getElementById('adminTestNav');
						if (!adminNav) return;

						if (currentUser && currentUser.clan_rank === 'admin') {
							adminNav.classList.remove('hidden');
						} else {
							adminNav.classList.add('hidden');
						}
					}

					function adminRestoreStamina() {
					    STAMINA_MAX = 32767;
					    modifyStamina(32767 - stamina, true);
					    if (gameData) {
					        gameData.stamina_max = STAMINA_MAX;
					        saveGameData();
					    }
					    showToast('无限负荷已开启！当前: ' + stamina, 'success');
					}

function adminOverchargeStamina() {
    var amount = 100;
    STAMINA_MAX = Math.min(1000, STAMINA_MAX + amount);
    modifyStamina(amount, true);
    
    if (currentUser && gameData) {
        gameData.stamina_max = STAMINA_MAX;
        saveGameData();
    }
    
    if (stamina < STAMINA_MAX) {
        showToast('负荷上限突破 +' + amount + '！当前: ' + stamina + '/' + STAMINA_MAX, 'success');
    } else {
        showToast('已达到绝对上限 1000', 'warning');
    }
}

					function adminGiveStaminaItems() {
						// 给矩阵添加负荷恢复道具
						addToWarehouse('负荷药水', '🧪', 5, 'consumable');
						showToast('获得负荷恢复道具 x5！', 'success');
						saveGameData();
					}

					function cheatAddVip() {
						showToast('Prime VIP仅通过特定途径获得', 'warning');
					}

					// ═══════════════════════════════════════════════════════════════
					//  测试面板扩展功能
					// ═══════════════════════════════════════════════════════════════

					function adminClearWarehouse() {
						warehouse = [];
						if (currentUser) {
							localStorage.removeItem('warehouse_' + currentUser.id);
						}
						renderWarehouse();
						showToast('矩阵已清空', 'warning');
					}

					function adminResetStats() {
						autoBattleState.todayKills = 0;
						autoBattleState.totalKills = 0;
						autoMiningState.todayMined = 0;
						autoMiningState.totalMined = 0;
						autoMiningState.totalTime = 0;
						autoGatheringState.todayGathered = 0;
						autoGatheringState.totalGathered = 0;
						autoGatheringState.totalTime = 0;
						updateBattleUI();
						updateMiningUI();
						updateGatheringUI();
						showToast('今日统计已重置', 'success');
					}

					function adminUnlockAllCards() {
						if (!window.playerCards) window.playerCards = {};
						for (var deckId in DECK_CARDS) {
							var deck = DECK_CARDS[deckId];
							for (var i = 0; i < deck.length; i++) {
								var card = deck[i];
								if (!window.playerCards[card.id]) {
									window.playerCards[card.id] = {
										count: 1,
										firstGetTime: new Date().toISOString(),
										data: card
									};
								}
							}
						}
						// 同步到局部变量并保存
						playerCards = window.playerCards;
						savePlayerCards();
						// 刷新回响显示
						if (codexViewState.level === 'cards') {
							renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
						}
						updateCodexOverview();
						showToast('已解锁全部回响回响！', 'success');
					}

					function adminMaxLevel() {
						if (!gameData) return;
						var type = gameData.warframe_type || 'excalibur';
						if (!gameData.warframe_levels) gameData.warframe_levels = {};
						if (!gameData.warframe_levels[type]) {
							gameData.warframe_levels[type] = {
								level: 1,
								xp: 0,
								max_xp: 100
							};
						}
						// 获取最大等级上限（从战甲数据或默认30）
						var maxLevel = 30;
						if (typeof WARFRAMES !== 'undefined' && WARFRAMES[type] && WARFRAMES[type].maxLevel) {
							maxLevel = WARFRAMES[type].maxLevel;
						}
						// 如果游戏数据中有全局最大等级配置，使用它
						if (gameData.max_warframe_level && gameData.max_warframe_level > maxLevel) {
							maxLevel = gameData.max_warframe_level;
						}
						gameData.warframe_levels[type].level = maxLevel;
						gameData.warframe_levels[type].xp = 0;
						gameData.warframe_levels[type].max_xp = 999999;
						gameData.warframe_level = maxLevel;
						gameData.warframe_xp = 0;
						gameData.warframe_max_xp = 999999;
						saveGameData();
						updateUI();
						showToast("战甲已升至 " + maxLevel + " 级（最大上限）！", "success");
					}





// ═══════════════════════════════════════════════════════════════
//  修复矩阵图片
// ═══════════════════════════════════════════════════════════════
function adminFixWarehouseImages() {
    if (!warehouse || warehouse.length === 0) {
        showToast('矩阵为空，无需修复', 'warning');
        return;
    }

    let fixedCount = 0;

    warehouse.forEach(item => {
        // 如果已有图片，跳过
        if (item.image) return;

        // 1. 尝试匹配战甲图片
        if (typeof WARFRAMES !== 'undefined') {
            const wfKey = Object.keys(WARFRAMES).find(key => {
                const wfName = WARFRAMES[key].name || '';
                return item.name && item.name.includes(wfName);
            });
            if (wfKey && WARFRAMES[wfKey].image) {
                item.image = WARFRAMES[wfKey].image;
                fixedCount++;
                return;
            }
        }

        // 2. 尝试匹配肃清掉落图片
        if (typeof BATTLE_DROPS !== 'undefined') {
            const drop = BATTLE_DROPS.find(d => item.name && (item.name === d.name || item.name.includes(d.name)));
            if (drop && drop.image) {
                item.image = drop.image;
                fixedCount++;
                return;
            }
        }

        // 3. 尝试匹配矿物图片
        if (typeof VEIN_TYPES !== 'undefined') {
            const vein = VEIN_TYPES.find(v => item.name && item.name.includes(v.name));
            if (vein && vein.image) {
                item.image = vein.image;
                fixedCount++;
                return;
            }
        }

        // 4. 尝试匹配回收物图片
        if (typeof GATHERING_DROP_CONFIG !== 'undefined') {
            for (const region in GATHERING_DROP_CONFIG) {
                const config = GATHERING_DROP_CONFIG[region];
                if (config && config.gatherables) {
                    const gatherable = config.gatherables.find(g => item.name && item.name.includes(g.name));
                    if (gatherable && gatherable.image) {
                        item.image = gatherable.image;
                        fixedCount++;
                        return;
                    }
                    // 也检查 drops 中的图片
                    if (config.drops) {
                        const dropItem = config.drops.find(d => item.name && item.name.includes(d.name));
                        if (dropItem && dropItem.image) {
                            item.image = dropItem.image;
                            fixedCount++;
                            return;
                        }
                    }
                }
            }
        }

        // 5. 尝试匹配重构厂配方图片
        if (typeof FOUNDRY_RECIPES !== 'undefined') {
            const recipe = FOUNDRY_RECIPES.find(r => item.name && (item.name === r.name || item.name.includes(r.name)));
            if (recipe && recipe.image) {
                item.image = recipe.image;
                fixedCount++;
                return;
            }
        }

        // 6. 尝试匹配全局回收掉落图片
        if (typeof GLOBAL_GATHERING_DROPS !== 'undefined') {
            const globalDrop = GLOBAL_GATHERING_DROPS.find(d => item.name && item.name.includes(d.name));
            if (globalDrop && globalDrop.image) {
                item.image = globalDrop.image;
                fixedCount++;
                return;
            }
        }
    });

    saveGameData();
    renderWarehouse();

    showToast(`已修复 ${fixedCount} 个物品的图片`, 'success');
}


					
					// 新增：等级清零
					function adminResetLevel() {
					    if (!gameData) return;
					    
					    var type = gameData.warframe_type || 'excalibur';
					    if (!gameData.warframe_levels) {
					        gameData.warframe_levels = {};
					    }
					    
					    // 重置当前战甲等级
					    gameData.warframe_levels[type] = {
					        level: 1,
					        xp: 0,
					        max_xp: 100
					    };
					    
					    // 同步到旧字段
					    gameData.warframe_level = 1;
					    gameData.warframe_xp = 0;
					    gameData.warframe_max_xp = 1000;
					    
					    saveGameData();
					    updateUI();
					    updateInfoUI();  // 刷新信息页的经验条
					    showToast('战甲等级已重置为 1 级！', 'success');
					}

					function adminInstantBattle() {
						if (!selectedPlanet) {
							showToast('请先选择星球', 'warning');
							switchPage('planetselect');
							return;
						}
						var count = 0;
						var maxBattles = 10;

						function doBattle() {
							if (count >= maxBattles) {
								showToast('虚空传送完成！肃清 ' + maxBattles + ' 次', 'success');
								updateBattleUI();
								saveGameData();
								return;
							}
							count++;

							// 模拟肃清结果
							var enemy = getRandomEnemy(selectedPlanet, selectedZone);
							var xpReward = getEnemyXP(enemy);



							// 模拟掉落
							if (Math.random() < enemy.dropRate) {
								var dropItem = BATTLE_DROPS[Math.floor(Math.random() * BATTLE_DROPS.length)];
								var amount = Math.floor((Math.random() * 2 + 1) * (selectedZone ? selectedZone.dropMult : (selectedPlanet ?
									selectedPlanet.dropMult : 1)));
								addToWarehouse(dropItem.name, dropItem.icon, amount, 'material', dropItem.image);
							}

							// 回响掉落
							var zoneId = selectedZone ? selectedZone.id : null;
							if (zoneId && typeof tryDropCardFromDeck === 'function') {
								var cardDrop = tryDropCardFromEnemy(enemy.codexId, dropChance);
								if (cardDrop) {
									addPlayerCard(cardDrop);
								}
							}

							addBattleLog('🌀 虚空传送 #' + count + ' | 击败 ' + enemy.name + ' | +' + pointsReward + ' Prime | +' + xpReward + ' XP',
								'win');

							setTimeout(doBattle, 100);
						}

						doBattle();
					}

	// ═══════════════════════════════════════════════════════════════
	//  测试面板：回响升星功能
	// ═══════════════════════════════════════════════════════════════
	function adminPromoteCardStar() {
	    var cards = window.playerCards || playerCards || {};
	    var collectedIds = [];
	    for (var id in cards) {
	        if (id !== '_shards' && cards[id] && cards[id].count > 0) {
	            collectedIds.push(id);
	        }
	    }
	    if (collectedIds.length === 0) {
	        if (typeof showToast === 'function') showToast('没有可升星的回响，先解锁一些回响吧', 'warning');
	        return;
	    }
	    
	    // 构建回响选择列表
	    var cardOptions = collectedIds.map(function(cid) {
	        var c = cards[cid];
	        var star = c.starLevel || 1;
	        var maxed = star >= 5 ? ' [满星]' : '';
	        return {
	            id: cid,
	            label: (c.data.icon || '🎴') + ' ' + c.data.name + ' — ' + '⭐'.repeat(star) + maxed,
	            star: star
	        };
	    });
	    
	    // 过滤掉已满星的
	    var upgradable = cardOptions.filter(function(o) { return o.star < 5; });
	    if (upgradable.length === 0) {
	        showToast('所有回响已满星(5星)', 'warning');
	        return;
	    }
	    
	    // 使用prompt让用户选择（简单实现，也可扩展为自定义弹窗）
	    var listText = upgradable.map(function(o, i) {
	        return (i + 1) + '. ' + o.label;
	    }).join('\n');
	    
	    var input = prompt('选择要升星的回响（输入序号 1-' + upgradable.length + '）：\n\n' + listText);
	    if (!input) return;
	    
	    var idx = parseInt(input) - 1;
	    if (isNaN(idx) || idx < 0 || idx >= upgradable.length) {
	        showToast('无效的选择', 'error');
	        return;
	    }
	    
	    var selected = upgradable[idx];
	    var cardEntry = cards[selected.id];
	    var oldStar = cardEntry.starLevel || 1;
	    var newStar = oldStar + 1;
	    cardEntry.starLevel = newStar;
	    cardEntry.count = Math.max(cardEntry.count, (newStar - 1) * 5 + 1);
	    savePlayerCards();
	    
	    showToast('⭐ ' + cardEntry.data.name + ' ' + oldStar + '星 → ' + newStar + '星！', 'success');
	    if (codexViewState.level === 'cards') {
	        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
	    }
	    updateCodexOverview();
	}
	
	// ═══════════════════════════════════════════════════════════════
	//  测试面板：星级清零功能
	// ═══════════════════════════════════════════════════════════════
	function adminResetCardStars() {
	    var cards = window.playerCards || playerCards || {};
	    var resetCount = 0;
	    
	    for (var id in cards) {
	        if (id === '_shards') continue; // 跳过碎片数据
	        var card = cards[id];
	        if (card && card.starLevel && card.starLevel > 1) {
	            card.starLevel = 1;
	            resetCount++;
	        }
	    }
	    
	    // 同步到全局
	    playerCards = cards;
	    window.playerCards = cards;
	    
	    // 保存到数据库
	    if (currentUser && gameData) {
	        gameData.player_cards = playerCards;
	        saveGameData();
	    }
	    
	    // 刷新回响显示
	    if (codexViewState.level === 'cards') {
	        renderCodexCards(codexViewState.faction, codexViewState.block, codexViewState.deck);
	    }
	    updateCodexOverview();
	    
	    showToast('已重置 ' + resetCount + ' 张回响的星级为 1 星！', 'success');
	}
	
	
		// ═══════════════════════════════════════════════════════════════
		//  重构厂免材料开关
		// ═══════════════════════════════════════════════════════════════
		window.adminFreeCraftEnabled = false;
		
window.toggleFreeCraft = function() {
		    window.adminFreeCraftEnabled = !window.adminFreeCraftEnabled;
		    var btn = document.getElementById('adminFreeCraftBtn');
		    if (btn) {
		        if (window.adminFreeCraftEnabled) {
		            btn.textContent = '🔓 当前：免材料模式';
		            btn.style.background = 'linear-gradient(135deg, var(--infested-green), #88ff88)';
		            btn.style.color = '#000';
		        } else {
		            btn.textContent = '🔒 当前：正常消耗';
		            btn.style.background = 'linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan))';
		            btn.style.color = '';
		        }
		    }
		    showToast('重构装置' + (window.adminFreeCraftEnabled ? '免材料模式已开启' : '恢复正常消耗'), 
		              window.adminFreeCraftEnabled ? 'success' : 'info');
		}
		
		// ═══════════════════════════════════════════════════════════════
		//  重构厂免时间开关
		// ═══════════════════════════════════════════════════════════════
		window.adminInstantCraftEnabled = false;
		
		window.toggleInstantCraft = function() {
		    window.adminInstantCraftEnabled = !window.adminInstantCraftEnabled;
		    var btn = document.getElementById('adminInstantCraftBtn');
		    if (btn) {
		        if (window.adminInstantCraftEnabled) {
		            btn.textContent = '🔓 当前：即时完成';
		            btn.style.background = 'linear-gradient(135deg, var(--infested-green), #88ff88)';
		            btn.style.color = '#000';
		        } else {
		            btn.textContent = '🔒 当前：正常时间';
		            btn.style.background = 'linear-gradient(135deg, #2a5a2a, var(--infested-green))';
		            btn.style.color = '';
		        }
		    }
		    showToast('重构装置' + (window.adminInstantCraftEnabled ? '即时完成模式已开启' : '恢复正常时间'), 
		              window.adminInstantCraftEnabled ? 'success' : 'info');
		}
		
		
		
		
		
		
		// ═══════════════════════════════════════════════════════════════
		//  测试掉率功能
		// ═══════════════════════════════════════════════════════════════
		window.testDropRate = function(type) {
    var resultDiv = document.getElementById('dropTestResult');
    if (typeof BATTLE_DROPS === 'undefined' || !BATTLE_DROPS) {
        if (resultDiv) {
            resultDiv.style.display = 'block';
            resultDiv.innerHTML = '<div style="color: var(--grineer-red);">❌ BATTLE_DROPS 未定义，请检查 items.js 是否正确加载</div>';
        }
        showToast('掉落数据未加载，请检查 items.js', 'error');
        return;
    }
    if (!resultDiv) return;
    resultDiv.style.display = 'block';

    var results = {};
    var totalRuns = 100;
    var totalDrops = 0;
    var i;

    if (type === 'battle') {
        if (!selectedPlanet) {
            showToast('请先选择星球再进行肃清掉率测试', 'warning');
            return;
        }
        if (typeof getRandomEnemy !== 'function') {
            showToast('肃清系统未加载，无法测试肃清掉率', 'error');
            return;
        }
        for (i = 0; i < totalRuns; i++) {
            var enemy = getRandomEnemy(selectedPlanet, selectedZone);
            if (enemy && typeof BATTLE_DROPS !== 'undefined' && BATTLE_DROPS) {
                BATTLE_DROPS.forEach(function(drop) {
                    if (Math.random() < drop.dropRate) {
                        var key = drop.icon + ' ' + drop.name;
                        results[key] = (results[key] || 0) + 1;
                        totalDrops++;
                        var amount = Math.floor(Math.random() * (drop.maxAmount - drop.minAmount + 1)) + drop.minAmount;
                        addToWarehouse(drop.name, drop.icon, amount, drop.type, drop.image);
                    }
                });
            }
        }
        showToast('肃清掉率测试完成，掉落物已添加到矩阵！', 'success');
    } else if (type === 'mining') {
        var currentRegion = typeof getCurrentMiningRegion === 'function' ? getCurrentMiningRegion() : 'beast_bone';
        var regionVeins = typeof VEIN_TYPES !== 'undefined' ? VEIN_TYPES.filter(function(v) { return v.region === currentRegion; }) : [];
        if (regionVeins.length === 0) regionVeins = typeof VEIN_TYPES !== 'undefined' ? VEIN_TYPES : [];

        for (i = 0; i < totalRuns; i++) {
            var totalWeight = regionVeins.reduce(function(sum, v) { return sum + v.dropWeight; }, 0);
            var random = Math.random() * totalWeight;
            var vein = regionVeins[0];
            for (var j = 0; j < regionVeins.length; j++) {
                random -= regionVeins[j].dropWeight;
                if (random <= 0) { vein = regionVeins[j]; break; }
            }
            var quality = Math.random() > 0.85 ? 'perfect' : (Math.random() > 0.5 ? 'good' : 'normal');
            var qualityMult = { perfect: 2.0, good: 1.5, normal: 1.0 }[quality];
            var baseAmount = Math.floor(Math.random() * 2 + 1);
            var finalAmount = Math.max(1, Math.floor(baseAmount * qualityMult));
            var key = vein.icon + ' ' + vein.name;
            results[key] = (results[key] || 0) + 1;
            totalDrops++;
            addToWarehouse(vein.name, vein.icon, finalAmount, 'mineral', vein.image);
        }
        showToast('勘探掉率测试完成，矿物已添加到矩阵！', 'success');
    } else if (type === 'gathering') {
        var currentRegion = typeof getCurrentGatheringRegion === 'function' ? getCurrentGatheringRegion() : 'earth_gather';
        var regionConfig = typeof GATHERING_DROP_CONFIG !== 'undefined' ? (GATHERING_DROP_CONFIG[currentRegion] || GATHERING_DROP_CONFIG['earth_gather']) : null;
        var gatherables = regionConfig ? (regionConfig.gatherables || []) : [];

        for (i = 0; i < totalRuns; i++) {
            if (gatherables.length > 0) {
                var gIdx = Math.floor(Math.random() * gatherables.length);
                var gatherable = gatherables[gIdx];
                if (Math.random() < (gatherable.dropRate || 0.5)) {
                    var qualityMult = Math.random() > 0.85 ? 2.0 : (Math.random() > 0.5 ? 1.5 : 1.0);
                    var amount = Math.floor((gatherable.minAmount + Math.random() * (gatherable.maxAmount - gatherable.minAmount + 1)) * qualityMult);
                    var finalAmount = Math.max(1, amount);

                    if (gatherable.drops && gatherable.drops.length > 0) {
                        gatherable.drops.forEach(function(drop) {
                            var dropAmount = Math.max(1, Math.floor(finalAmount * (drop.amount || 1)));
                            var key = drop.icon + ' ' + drop.name;
                            results[key] = (results[key] || 0) + 1;
                            totalDrops++;
                            addToWarehouse(drop.name, drop.icon, dropAmount, drop.type || 'material', drop.image || gatherable.image);
                        });
                    } else {
                        var key = gatherable.icon + ' ' + gatherable.name;
                        results[key] = (results[key] || 0) + 1;
                        totalDrops++;
                        addToWarehouse(gatherable.name, gatherable.icon, finalAmount, 'plant', gatherable.image);
                    }
                }
            }
        }
        showToast('回收掉率测试完成，物品已添加到矩阵！', 'success');
    }

    var html = '<div style="color: var(--tenno-gold); font-family: Orbitron; margin-bottom: 8px;">🎲 ' + totalRuns + '次' + 
               (type === 'battle' ? '肃清' : (type === 'mining' ? '勘探' : '回收')) + '模拟结果</div>';
    for (var key in results) {
        totalDrops += results[key];
        var percent = (results[key] / totalRuns * 100).toFixed(1);
        html += '<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #222;">' +
                '<span>' + key + '</span>' +
                '<span style="color: var(--orokin-cyan);">' + results[key] + '次 (' + percent + '%)</span>' +
                '</div>';
    }
    html += '<div style="margin-top: 8px; color: #666; font-size: 0.7rem;">总掉落次数: ' + totalDrops + ' | 平均掉率: ' + 
            (totalDrops / totalRuns * 100).toFixed(1) + '%</div>';

    resultDiv.innerHTML = html;
		}



	function formatPoints(points) {
	    if (points >= 1000) {
	        return (points / 1000).toFixed(1) + 'k';
	    }
	    return points.toString();
	}
	
	
	
	


// ═══════════════════════════════════════════════════════════════
//  音频控制台页面专用函数
// ═══════════════════════════════════════════════════════════════

// let musicConsoleAudioContext = null; // removed - using fake visualizer
// let musicConsoleAnalyser = null; // removed - using fake visualizer
let musicConsoleVisualizerId = null;
let musicTotalPlayedTime = 0;
let musicConsoleLastTime = 0;

function renderMusicConsole() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;

    const title = document.getElementById('musicConsoleTitle');
    const artist = document.getElementById('musicConsoleArtist');
    const icon = document.getElementById('musicConsoleIcon');

    if (currentTrack >= 0 && currentTrack < playlist.length) {
        const track = playlist[currentTrack];
        if (title) title.textContent = track.title || '未知曲目';
        if (artist) artist.textContent = track.artist || '未知艺术家';
        if (icon) icon.textContent = track.icon || '🎵';
    }

    updateMusicConsolePlayButton();
    musicConsoleUpdateProgress();

    const volumeSlider = document.getElementById('musicConsoleVolumeSlider');
    const volumeText = document.getElementById('musicConsoleVolumeText');
    if (volumeSlider) volumeSlider.value = currentVolume;
    if (volumeText) volumeText.textContent = currentVolume + '%';

    const volumeIcon = document.getElementById('musicConsoleVolumeIcon');
    if (volumeIcon) {
        volumeIcon.textContent = currentVolume === 0 ? '🔇' : (currentVolume < 30 ? '🔈' : (currentVolume < 70 ? '🔉' : '🔊'));
    }

    updateMusicModeButtons();
    renderMusicConsolePlaylist();
    updateAudioInfo();
    startFakeVisualizer();

    if (!musicConsoleProgressInterval) {
        musicConsoleProgressInterval = setInterval(() => {
            musicConsoleUpdateProgress();
            updateAudioInfo();
        }, 500);
    }
}

let musicConsoleProgressInterval = null;

function musicConsoleUpdateProgress() {
    const audio = document.getElementById('bgMusic');
    if (!audio) return;

    const currentTime = document.getElementById('musicConsoleCurrentTime');
    const duration = document.getElementById('musicConsoleDuration');
    const progressBar = document.getElementById('musicConsoleProgressBar');

    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    if (duration) duration.textContent = formatTime(audio.duration || 0);

    if (progressBar && audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
    }

    const statusDot = document.getElementById('musicStatusDot');
    const statusText = document.getElementById('musicStatusText');
    if (statusDot && statusText) {
        if (isPlaying) {
            statusDot.style.background = 'var(--infested-green)';
            statusDot.style.boxShadow = '0 0 8px var(--infested-green)';
            statusText.textContent = '播放中';
            statusText.style.color = 'var(--infested-green)';
        } else if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
            statusDot.style.background = 'var(--tenno-gold)';
            statusDot.style.boxShadow = '0 0 8px var(--tenno-gold)';
            statusText.textContent = '已暂停';
            statusText.style.color = 'var(--tenno-gold)';
        } else {
            statusDot.style.background = '#333';
            statusDot.style.boxShadow = 'none';
            statusText.textContent = '就绪';
            statusText.style.color = '#666';
        }
    }

    if (isPlaying && musicConsoleLastTime > 0) {
        musicTotalPlayedTime += (Date.now() - musicConsoleLastTime) / 1000;
    }
    musicConsoleLastTime = Date.now();
}

function updateMusicConsolePlayButton() {
    const btn = document.getElementById('musicConsolePlayBtn');
    if (btn) {
        btn.textContent = isPlaying ? '⏸' : '▶';
    }
}

function musicTogglePlay() {
    togglePlay();
    updateMusicConsolePlayButton();
    musicConsoleUpdateProgress();
}

function musicPrev() {
    prevTrack();
    setTimeout(() => {
        renderMusicConsole();
    }, 100);
}

function musicNext() {
    nextTrack();
    setTimeout(() => {
        renderMusicConsole();
    }, 100);
}

function musicSeek(event) {
    const audio = document.getElementById('bgMusic');
    if (!audio || !audio.duration) return;

    const container = document.getElementById('musicConsoleProgressContainer');
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, x / rect.width));

    audio.currentTime = percent * audio.duration;
    musicConsoleUpdateProgress();
}

function musicSetVolume(value) {
    setVolume(value);
    const volumeText = document.getElementById('musicConsoleVolumeText');
    if (volumeText) volumeText.textContent = value + '%';

    const volumeIcon = document.getElementById('musicConsoleVolumeIcon');
    if (volumeIcon) {
        volumeIcon.textContent = value == 0 ? '🔇' : (value < 30 ? '🔈' : (value < 70 ? '🔉' : '🔊'));
    }
}

function musicToggleMute() {
    toggleMute();
    const volumeSlider = document.getElementById('musicConsoleVolumeSlider');
    const volumeText = document.getElementById('musicConsoleVolumeText');
    const volumeIcon = document.getElementById('musicConsoleVolumeIcon');

    if (volumeSlider) volumeSlider.value = currentVolume;
    if (volumeText) volumeText.textContent = currentVolume + '%';
    if (volumeIcon) {
        volumeIcon.textContent = currentVolume === 0 ? '🔇' : (currentVolume < 30 ? '🔈' : (currentVolume < 70 ? '🔉' : '🔊'));
    }
}

function musicSetMode(mode) {
    playMode = mode;
    updateMusicModeButtons();
    showToast('播放模式: ' + (mode === 'loop' ? '列表循环' : mode === 'single' ? '单曲循环' : '随机播放'), 'info');
}

function updateMusicModeButtons() {
    const loopBtn = document.getElementById('musicModeLoop');
    const singleBtn = document.getElementById('musicModeSingle');
    const randomBtn = document.getElementById('musicModeRandom');

    const activeStyle = 'background: rgba(0,212,255,0.15); border-color: var(--orokin-cyan); color: var(--orokin-cyan);';
    const inactiveStyle = 'background: rgba(255,255,255,0.05); border-color: #333; color: #888;';

    if (loopBtn) loopBtn.style.cssText = playMode === 'loop' ? activeStyle : inactiveStyle;
    if (singleBtn) singleBtn.style.cssText = playMode === 'single' ? activeStyle : inactiveStyle;
    if (randomBtn) randomBtn.style.cssText = playMode === 'random' ? activeStyle : inactiveStyle;
}

function renderMusicConsolePlaylist() {
    const container = document.getElementById('musicConsolePlaylist');
    if (!container) return;

    container.innerHTML = '';

    const playlists = [
        {
            id: 'all',
            name: '全部曲目',
            desc: '所有音乐',
            icon: '🎵',
            tracks: playlist || []
        },
        {
            id: 'battle',
            name: '肃清精选',
            desc: '高强度肃清音乐',
            icon: '⚔️',
            tracks: (playlist || []).filter((t, i) => i % 2 === 0)
        },
        {
            id: 'ambient',
            name: '环境氛围',
            desc: '探索与放松',
            icon: '🌌',
            tracks: (playlist || []).filter((t, i) => i % 3 === 0)
        }
    ];

    if (!window.selectedPlaylistId) window.selectedPlaylistId = 'all';

    playlists.forEach((pl, plIndex) => {
        const isSelected = pl.id === window.selectedPlaylistId;
        const isExpanded = pl.id === window.expandedPlaylistId;

        const plItem = document.createElement('div');
        plItem.style.cssText = `
            background: ${isSelected ? 'rgba(0,212,255,0.1)' : 'rgba(0,0,0,0.2)'};
            border: 1px solid ${isSelected ? 'var(--orokin-cyan-dim)' : '#333'};
            border-radius: 12px; overflow: hidden; transition: all 0.3s;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex; align-items: center; gap: 12px; padding: 14px 18px;
            cursor: pointer; transition: all 0.3s;
        `;

        const expandIcon = document.createElement('span');
        expandIcon.style.cssText = 'font-size: 0.8rem; color: #666; transition: transform 0.3s; min-width: 16px;';
        expandIcon.textContent = isExpanded ? '▼' : '▶';
        if (isExpanded) expandIcon.style.transform = 'rotate(0deg)';

        const plIcon = document.createElement('span');
        plIcon.style.cssText = 'font-size: 1.5rem; min-width: 30px; text-align: center;';
        plIcon.textContent = pl.icon;

        const plInfo = document.createElement('div');
        plInfo.style.cssText = 'flex: 1; min-width: 0;';

        const plName = document.createElement('div');
        plName.style.cssText = `
            color: ${isSelected ? 'var(--orokin-cyan)' : '#fff'}; font-size: 0.95rem;
            font-weight: ${isSelected ? '700' : '400'}; white-space: nowrap;
            overflow: hidden; text-overflow: ellipsis;
        `;
        plName.textContent = pl.name;

        const plDesc = document.createElement('div');
        plDesc.style.cssText = 'color: #666; font-size: 0.75rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
        plDesc.textContent = pl.desc + ' · ' + pl.tracks.length + ' 首';

        plInfo.appendChild(plName);
        plInfo.appendChild(plDesc);

        const selectBtn = document.createElement('button');
        selectBtn.style.cssText = `
            padding: 6px 14px; border-radius: 6px; border: 1px solid;
            font-size: 0.75rem; font-family: 'Orbitron'; cursor: pointer;
            transition: all 0.3s; letter-spacing: 1px; min-width: 60px;
            background: ${isSelected ? 'var(--orokin-cyan)' : 'transparent'};
            color: ${isSelected ? 'var(--void-black)' : 'var(--orokin-cyan)'};
            border-color: ${isSelected ? 'var(--orokin-cyan)' : 'var(--orokin-cyan-dim)'};
        `;
        selectBtn.textContent = isSelected ? '✓ 已选' : '选用';
        selectBtn.onclick = (e) => {
            e.stopPropagation();
            selectPlaylist(pl.id, pl.tracks);
        };

        header.appendChild(expandIcon);
        header.appendChild(plIcon);
        header.appendChild(plInfo);
        header.appendChild(selectBtn);

        header.onclick = () => {
            window.expandedPlaylistId = isExpanded ? null : pl.id;
            renderMusicConsolePlaylist();
        };

        plItem.appendChild(header);

        if (isExpanded) {
            const trackList = document.createElement('div');
            trackList.style.cssText = 'padding: 0 18px 14px 56px; display: flex; flex-direction: column; gap: 4px;';

            pl.tracks.forEach((track, trackIndex) => {
                const globalIndex = playlist.indexOf(track);
                const isActive = globalIndex === currentTrack;
                const isPlayingTrack = isActive && isPlaying;

                const trackRow = document.createElement('div');
                trackRow.style.cssText = `
                    display: flex; align-items: center; gap: 10px; padding: 8px 12px;
                    border-radius: 6px; cursor: pointer; transition: all 0.3s;
                    background: ${isActive ? 'rgba(0,212,255,0.08)' : 'transparent'};
                    border-left: 2px solid ${isActive ? 'var(--orokin-cyan)' : 'transparent'};
                `;

                trackRow.onmouseover = () => {
                    if (!isActive) trackRow.style.background = 'rgba(0,212,255,0.04)';
                };
                trackRow.onmouseout = () => {
                    if (!isActive) trackRow.style.background = 'transparent';
                };
                trackRow.onclick = () => musicSelectTrack(globalIndex);

                const tIndex = document.createElement('span');
                tIndex.style.cssText = `
                    font-family: 'Orbitron'; font-size: 0.7rem; color: ${isActive ? 'var(--orokin-cyan)' : '#555'};
                    min-width: 20px; text-align: center;
                `;
                tIndex.textContent = String(trackIndex + 1).padStart(2, '0');

                const tIcon = document.createElement('span');
                tIcon.style.cssText = 'font-size: 1rem; min-width: 24px; text-align: center;';
                tIcon.textContent = isPlayingTrack ? '▶' : (track.icon || '🎵');
                if (isPlayingTrack) {
                    tIcon.style.color = 'var(--infested-green)';
                    tIcon.style.animation = 'pulse 1.5s infinite';
                }

                const tInfo = document.createElement('div');
                tInfo.style.cssText = 'flex: 1; min-width: 0;';

                const tTitle = document.createElement('div');
                tTitle.style.cssText = `
                    color: ${isActive ? '#fff' : '#ccc'}; font-size: 0.85rem;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                `;
                tTitle.textContent = track.title || '未知曲目';

                const tArtist = document.createElement('div');
                tArtist.style.cssText = 'color: #666; font-size: 0.7rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;';
                tArtist.textContent = track.artist || '未知艺术家';

                tInfo.appendChild(tTitle);
                tInfo.appendChild(tArtist);

                const tDuration = document.createElement('span');
                tDuration.style.cssText = 'font-family: "Orbitron"; font-size: 0.7rem; color: #666; min-width: 40px; text-align: right;';
                tDuration.textContent = track.duration || '--:--';

                trackRow.appendChild(tIndex);
                trackRow.appendChild(tIcon);
                trackRow.appendChild(tInfo);
                trackRow.appendChild(tDuration);

                trackList.appendChild(trackRow);
            });

            plItem.appendChild(trackList);
        }

        container.appendChild(plItem);
    });

    const totalEl = document.getElementById('playlistTotalTracks');
    if (totalEl) totalEl.textContent = playlists.length;
}

function selectPlaylist(playlistId, tracks) {
    window.selectedPlaylistId = playlistId;

    if (tracks && tracks.length > 0) {
        const firstTrackIndex = playlist.indexOf(tracks[0]);
        if (firstTrackIndex >= 0) {
            currentTrack = firstTrackIndex;
            loadTrack(currentTrack);
            playTrack();
        }
    }

    renderMusicConsole();
    showToast('已切换到歌单: ' + playlistId, 'success');
}

function musicSelectTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    currentTrack = index;
    loadTrack(currentTrack);
    playTrack();
    renderMusicConsole();

    updatePlayButton();
    updateProgress();
    renderPlaylist();
}

function updateAudioInfo() {
    // 音频信息面板已移除，此函数保留为空以防止错误
}

// ═══════════════════════════════════════════════════════════════
//  完全伪可视化器（无 Web Audio API，避免 CORS 报错）
// ═══════════════════════════════════════════════════════════════
function startFakeVisualizer() {
    const leftCanvas = document.getElementById('musicVisualizerLeft');
    const rightCanvas = document.getElementById('musicVisualizerRight');
    if (!leftCanvas || !rightCanvas) return;

    function drawFake() {
        musicConsoleVisualizerId = requestAnimationFrame(drawFake);

        const time = Date.now() / 1000;
        const audio = document.getElementById('bgMusic');
        const isPlayingAudio = audio && !audio.paused && audio.currentTime > 0;

        // 左声道 - 模拟低频到中频
        const leftCtx = leftCanvas.getContext('2d');
        leftCanvas.width = leftCanvas.offsetWidth || 70;
        leftCanvas.height = leftCanvas.offsetHeight || 300;
        leftCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        leftCtx.fillRect(0, 0, leftCanvas.width, leftCanvas.height);

        const halfBins = 32;
        const barWidth = leftCanvas.width / halfBins * 0.8;
        const gap = leftCanvas.width / halfBins * 0.2;

        for (let i = 0; i < halfBins; i++) {
            let fakeValue = 0.05;
            if (isPlayingAudio) {
                fakeValue += Math.abs(Math.sin(time * 2 + i * 0.3)) * 0.35;
                fakeValue += Math.abs(Math.sin(time * 3.7 + i * 0.5)) * 0.25;
                fakeValue += Math.random() * 0.15;
                const beat = Math.sin(time * 1.2) > 0.7 ? 0.2 : 0;
                fakeValue += beat;
            }
            fakeValue = Math.min(1, fakeValue);

            const barHeight = fakeValue * leftCanvas.height * 0.9;
            const x = i * (barWidth + gap) + gap / 2;
            const y = leftCanvas.height - barHeight;

            const gradient = leftCtx.createLinearGradient(0, leftCanvas.height, 0, 0);
            gradient.addColorStop(0, 'rgba(0, 212, 255, 0.3)');
            gradient.addColorStop(0.5, 'rgba(0, 212, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(200, 168, 75, 0.9)');
            leftCtx.fillStyle = gradient;
            leftCtx.fillRect(x, y, barWidth, barHeight);
            leftCtx.fillStyle = 'rgba(200, 168, 75, 0.6)';
            leftCtx.fillRect(x, y, barWidth, 2);
        }

        // 右声道 - 模拟高频
        const rightCtx = rightCanvas.getContext('2d');
        rightCanvas.width = rightCanvas.offsetWidth || 70;
        rightCanvas.height = rightCanvas.offsetHeight || 300;
        rightCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        rightCtx.fillRect(0, 0, rightCanvas.width, rightCanvas.height);

        for (let i = 0; i < halfBins; i++) {
            let fakeValue = 0.05;
            if (isPlayingAudio) {
                fakeValue += Math.abs(Math.sin(time * 4 + i * 0.4)) * 0.3;
                fakeValue += Math.abs(Math.sin(time * 6.1 + i * 0.6)) * 0.2;
                fakeValue += Math.random() * 0.2;
                const beat = Math.sin(time * 1.2 + 0.5) > 0.7 ? 0.15 : 0;
                fakeValue += beat;
            }
            fakeValue = Math.min(1, fakeValue);

            const barHeight = fakeValue * rightCanvas.height * 0.9;
            const x = i * (barWidth + gap) + gap / 2;
            const y = rightCanvas.height - barHeight;

            const gradient = rightCtx.createLinearGradient(0, rightCanvas.height, 0, 0);
            gradient.addColorStop(0, 'rgba(200, 168, 75, 0.3)');
            gradient.addColorStop(0.5, 'rgba(255, 102, 255, 0.7)');
            gradient.addColorStop(1, 'rgba(255, 102, 255, 0.9)');
            rightCtx.fillStyle = gradient;
            rightCtx.fillRect(x, y, barWidth, barHeight);
            rightCtx.fillStyle = 'rgba(255, 102, 255, 0.6)';
            rightCtx.fillRect(x, y, barWidth, 2);
        }
    }

    drawFake();
}

// 清理音频控制台资源
function cleanupMusicConsole() {
    if (window.musicConsoleProgressInterval) {
        clearInterval(window.musicConsoleProgressInterval);
        window.musicConsoleProgressInterval = null;
    }
    if (musicConsoleVisualizerId) {
        cancelAnimationFrame(musicConsoleVisualizerId);
        musicConsoleVisualizerId = null;
    }
}

function startAutoBattleWithPlanet(planet) {
	
    if (autoBattleState.active) return;
    
    // 断网锁定
    if (window._offlineLock) {
        showToast('【星渊】链接中断，请恢复网络', 'error');
        return;
    }

    if (stamina < STAMINA_BATTLE_COST) {
        
        showToast(`负荷不足！需要 ${STAMINA_BATTLE_COST} 点负荷`, 'error');
        return;
    }

        modifyStamina(-STAMINA_BATTLE_COST);

    // ═══════════════════════════════════════════════════════════════
    //  1. 获取玩家属性（使用新公式）
    // ═══════════════════════════════════════════════════════════════
    var playerLevel = getCurrentWarframeData().level;
    var playerStats = getPlayerBaseStats(playerLevel);  // ← 使用combat_system.js的公式
    
    // 确保玩家有name字段（用于肃清日志）
    var wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
    playerStats.name = wf.name || 'Tenno';

    // ═══════════════════════════════════════════════════════════════
    //  2. 获取敌人（模板+公式生成属性）
    // ═══════════════════════════════════════════════════════════════
    var enemyTemplate = selectedZone && selectedZone.bossEnemyId
        ? (ENEMIES || []).find(e => e.id === selectedZone.bossEnemyId)
        : getRandomEnemy(planet, selectedZone);
    if (!enemyTemplate) {
        showToast('生成敌人失败', 'error');
        return;
    }
    
    // 使用spawnEnemy生成完整属性
    var enemy = (typeof spawnEnemy === 'function')
        ? spawnEnemy(enemyTemplate.id, selectedZone && selectedZone.bossBattle ? (selectedZone.level || playerLevel) : playerLevel)
        : null;
    if (!enemy && selectedZone && selectedZone.bossBattle) {
        enemy = Object.assign({}, enemyTemplate);
        enemy.level = selectedZone.level || enemy.level || playerLevel;
        enemy.maxHp = enemy.maxHp || enemy.hp || 500;
        enemy.hp = enemy.maxHp;
        enemy.maxShield = enemy.maxShield || enemy.shield || 0;
        enemy.shield = enemy.maxShield;
    }
    if (!enemy) {
        showToast('初始化敌人属性失败', 'error');
        return;
    }

    // ═══════════════════════════════════════════════════════════════
    //  3. 初始化肃清状态
    // ═══════════════════════════════════════════════════════════════
    autoBattleState.active = true;
    autoBattleState.playerActionBar = 0;
    autoBattleState.enemyActionBar = 0;
    
    // 玩家属性
    autoBattleState.playerHp = playerStats.maxHp;
    autoBattleState.playerMaxHp = playerStats.maxHp;
    autoBattleState.playerStats = playerStats;  // 保存完整属性供肃清使用
    
    // 敌人属性
    autoBattleState.enemy = enemy;
    autoBattleState.enemyHp = enemy.maxHp;
    autoBattleState.enemyMaxHp = enemy.maxHp;

    // 保存当前区域信息
    autoBattleState.currentPlanet = planet;
    autoBattleState.currentZone = selectedZone;

    // ═══════════════════════════════════════════════════════════════
    //  4. 更新UI按钮状态
    // ═══════════════════════════════════════════════════════════════
    var startBtn = document.getElementById('startBattleBtn');
    var continueBtn = document.getElementById('continueBattleBtn');
    var stopBtn = document.getElementById('stopBattleBtn');

    if (startBtn) startBtn.style.display = 'none';
    if (continueBtn) continueBtn.style.display = 'none';
    if (stopBtn) {
        stopBtn.style.display = 'block';
        stopBtn.textContent = '🛑 停止肃清';
        stopBtn.style.background = '';
        stopBtn.disabled = false;
    }

    // ═══════════════════════════════════════════════════════════════
    //  5. 肃清日志
    // ═══════════════════════════════════════════════════════════════
    var log = document.getElementById('autoBattleLog');
    log.innerHTML = '';
    
    addBattleLog(`🌍 抵达 ${planet.icon || '🌍'} ${planet.name || '未知区域'}！`, 'info');
    addBattleLog(`⚔️ 肃清开始！${playerStats.name} Lv.${playerLevel} vs ${enemy.name} Lv.${enemy.level}`, 'info');
   
    

    
    // 显示当前轮换状态（每小时更新）
    var prefixStatus = getPrefixRotationStatus();
    addBattleLog(`🕐 当前轮换: [${prefixStatus.current.name}] ${prefixStatus.current.theme} | 剩余 ${prefixStatus.remainMinutes}分钟`, 'info');
    // ═══════════════════════════════════════════════════════════════
    //  6. 启动肃清循环（使用新的tick间隔）
    // ═══════════════════════════════════════════════════════════════
    updateBattleUI();

    // 如果技能战斗系统已加载，使用技能战斗
    if (typeof initSkillCombat === 'function') {
        initSkillCombat(
            {
                warframe_type: gameData.warframe_type || 'excalibur',
                level: playerLevel,
                hp: autoBattleState.playerHp,
                maxHp: autoBattleState.playerMaxHp,
                shield: playerStats.maxShield || 60,
                maxShield: playerStats.maxShield || 60,
                energy: 100,
                maxEnergy: 100,
                attack: playerStats.attack,
                defense: playerStats.defense,
                armor: playerStats.defense,
                speed: playerStats.speed
            },
            enemy,
            {
                onBattleEnd: function(result, defeatedEnemy) {
                    if (result === 'win') {
                        autoBattleState.enemyHp = 0;
                        if (autoBattleState.enemy) autoBattleState.enemy.hp = 0;
                        setTimeout(function() {
                            enemyDefeated();
                        }, 500);
                    } else {
                        autoBattleState.playerHp = 0;
                        setTimeout(function() {
                            playerDefeated();
                        }, 500);
                    }
                }
            }
        );
        return;
    }

    // 回退旧自动战斗
    var tickInterval = getBattleTickInterval(enemy.type);
    autoBattleState.timer = setInterval(function() {
        autoBattleTick();
    }, tickInterval);
    
    
}

function autoBattleTick() {
    if (!autoBattleState.active) return;

    var playerStats = getPlayerStats();
    var enemy = autoBattleState.enemy;
    var playerLevel = getCurrentWarframeData().level;

    // 肃清节奏加速：基础速度×3
    var playerSpeed = (playerStats.speed || 10) * 3;
    var enemySpeed = (enemy.speed || 10) * 3;

    // 积累行动条
    autoBattleState.playerActionBar = (autoBattleState.playerActionBar || 0) + playerSpeed;
    autoBattleState.enemyActionBar = (autoBattleState.enemyActionBar || 0) + enemySpeed;

    updateActionBarUI();

    // 关键修复：限制每轮最多出手1次，交替进行
    var turnTaken = false;

    while (autoBattleState.active && !turnTaken) {
        if (autoBattleState.playerActionBar >= 100 && autoBattleState.enemyActionBar >= 100) {
            if (playerSpeed >= enemySpeed) {
                autoBattleState.playerActionBar -= 100;  // 改为减100而不是清零
                playerAttack();
            } else {
                autoBattleState.enemyActionBar -= 100;
                enemyAttack();
            }
            turnTaken = true;
        } else if (autoBattleState.playerActionBar >= 100) {
            autoBattleState.playerActionBar -= 100;
            playerAttack();
            turnTaken = true;
        } else if (autoBattleState.enemyActionBar >= 100) {
            autoBattleState.enemyActionBar -= 100;
            enemyAttack();
            turnTaken = true;
        } else {
            break;
        }
    }
}

function playerAttack() {
    var playerStats = getPlayerStats();
    var enemy = autoBattleState.enemy;
    
    var result = calculateDamage(playerStats, enemy, true);
    var log = formatBattleLog(result, playerStats.name || '你', enemy.name, true);
    
    if (result.isDodge) {
        showFloatingText('闪避！', 70, 30, '#ffaa00');
    } else {
        showFloatingDamage(result.damage, 'enemy', result.isCrit);
        autoBattleState.enemyHp = Math.max(0, autoBattleState.enemyHp - result.damage);
    }
    
    addBattleLog(log.text, log.type);
    updateBattleUI();
    
    if (autoBattleState.enemyHp <= 0) {
        setTimeout(() => enemyDefeated(), 300);
    }
}

function enemyAttack() {
    var playerStats = getPlayerStats();
    var enemy = autoBattleState.enemy;

    var result = calculateDamage(enemy, playerStats, false);
    var log = formatBattleLog(result, enemy.name, playerStats.name || '你', false);

    if (result.isDodge) {
        showFloatingText('闪避！', 30, 30, '#00d4ff');
    } else {
        showFloatingDamage(result.damage, 'player', result.isCrit);
        autoBattleState.playerHp = Math.max(0, autoBattleState.playerHp - result.damage);
    }

    addBattleLog(log.text, log.type);
    updateBattleUI();

    if (autoBattleState.playerHp <= 0) {
        setTimeout(() => playerDefeated(), 300);
    }
}

function enemyDefeated() {
    const enemy = autoBattleState.enemy;

    var defeatedName = enemy.fullName || enemy.displayName || enemy.name;
    addBattleLog(`💀 ${defeatedName} 被击败！`, 'death');
	
    // 掉落处理
    const drops = [];
    const isBoss = enemy.type === 'boss' || enemy.cardType === 'boss';

    // 分离蓝图掉落和普通掉落
    const blueprintDrops = [];
    const normalDrops = [];

    BATTLE_DROPS.forEach(dropItem => {
        // Boss专属物品只有Boss掉落
        if (dropItem.bossOnly && !isBoss) return;

        // 分离蓝图和普通掉落
        if (dropItem.type === 'blueprint') {
            blueprintDrops.push(dropItem);
        } else {
            normalDrops.push(dropItem);
        }
    });

    // 普通掉落：独立Roll点判定
    normalDrops.forEach(dropItem => {
        if (Math.random() < dropItem.dropRate) {
            let amount = Math.floor(Math.random() * (dropItem.maxAmount - dropItem.minAmount + 1)) + dropItem.minAmount;
            
            // 检查每日现金上限（如果是现金类型）
            if (dropItem.type === 'cash' || dropItem.name.includes('Rout') || dropItem.name.includes('Credit')) {
                var canEarn = canEarnCash(amount);
                if (canEarn === false) return; // 已达上限，跳过
                if (typeof canEarn === 'number') amount = canEarn; // 部分可获取
                addCashEarned(amount);
            }
            
            drops.push({ ...dropItem, amount });
            addToWarehouse(dropItem.name, dropItem.icon, amount, dropItem.type);
        }
    });
    // 蓝图掉落：Boss只能获得一个蓝图（只Roll一次15%概率）
    if (blueprintDrops.length > 0) {
        // 只Roll一次，15%概率决定是否掉蓝图
        if (Math.random() < 0.10) {
            // 从所有蓝图中随机选一个掉落
            const selectedBlueprint = blueprintDrops[Math.floor(Math.random() * blueprintDrops.length)];
            const amount = Math.floor(Math.random() * (selectedBlueprint.maxAmount - selectedBlueprint.minAmount + 1)) + selectedBlueprint.minAmount;
            drops.push({ ...selectedBlueprint, amount });
            addToWarehouse(selectedBlueprint.name, selectedBlueprint.icon, amount, selectedBlueprint.type);

            // 蓝图掉落特殊提示
            addBattleLog(`🎉 蓝图: ${selectedBlueprint.icon} ${selectedBlueprint.name}！`, 'drop');
            showToast(`🎉 蓝图: ${selectedBlueprint.name}！已解锁`, 'success');

            // 刷新重构厂显示
            if (document.getElementById('page-foundry') &&
                !document.getElementById('page-foundry').classList.contains('hidden')) {
                renderFoundry();
            }
        }
    }
// 现金奖励（仅 boss 和 mechanic 类型敌人有几率获得）
let cashReward = 0;
var actualCashReward = 0;  // 实际获得的现金

if (enemy.type === 'boss' || enemy.cardType === 'boss') {
    if (Math.random() < 0.15) {
        cashReward = 2;
        var canEarn = canEarnCashToday(cashReward);
        if (canEarn === false) {
            addBattleLog(`击败 ${enemy.name} 💰 未获得(已达日上限)！`, 'warning');
        } else {
            actualCashReward = (typeof canEarn === 'number') ? canEarn : cashReward;
            currentUser.rout_points = (currentUser.rout_points || 0) + actualCashReward;
            gameData.rout_points = currentUser.rout_points;
            recordCashEarned(actualCashReward);
            addBattleLog(`💰 击败 ${enemy.name} 获得 ${actualCashReward} Rout！`, 'drop');
        }
    }
} else if (enemy.type === 'mechanic' || enemy.cardType === 'mechanic') {
    if (Math.random() < 0.10) {
        cashReward = 3;
        var canEarn = canEarnCashToday(cashReward);
        if (canEarn === false) {
            addBattleLog(`击败 ${enemy.name} 💰 未获得(已达日上限)！`, 'warning');
        } else {
            actualCashReward = (typeof canEarn === 'number') ? canEarn : cashReward;
            currentUser.rout_points = (currentUser.rout_points || 0) + actualCashReward;
            gameData.rout_points = currentUser.rout_points;
            recordCashEarned(actualCashReward);
            addBattleLog(`💰 击败 ${enemy.name} 获得 ${actualCashReward} Rout！`, 'drop');
        }
    }
}

    // 经验奖励
    const xpReward = getEnemyXP(enemy);
    addXP(xpReward);

    // 更新资料库
    if (enemy.faction) {
        gameData.codex[enemy.faction] = (gameData.codex[enemy.faction] || 0) + 1;
    }

    autoBattleState.totalKills++;
    autoBattleState.todayKills++;

// ===== 回响掉落（敌人专属回响，codexId=回响ID）=====
var cardDrop = null;

if (enemy.codexId && typeof tryDropCardFromEnemy === 'function') {
    var dropChance = (enemy.cardDrop && typeof enemy.cardDrop.chance === 'number') 
        ? enemy.cardDrop.chance 
        : undefined;
    cardDrop = tryDropCardFromEnemy(enemy.codexId, dropChance);
}

if (cardDrop) {
    var result = addPlayerCard(cardDrop);
    var sourceText = ` [${enemy.name}]`;
    
    if (result.isNew) {
        addBattleLog(`🎴 新回响: ${cardDrop.name}`, 'drop');
        setTimeout(function() {
            showCardAcquireModal(cardDrop, enemy.name);
        }, 800);
    } else {
        // 重复获得，显示获得提示
        addBattleLog(`🎴 获得 ${sourceText}`, 'drop');
    }
}

// 显示奖励（只显示击杀信息）
if (actualCashReward > 0) {
    addBattleLog(`⭐ 获得 ${actualCashReward} Rout | ${xpReward} 经验`, 'win');
} else {
    addBattleLog(`⭐ 获得 ${xpReward} 经验`, 'win');
}

    // 更新统计
    document.getElementById('totalKills').textContent = autoBattleState.totalKills;
    document.getElementById('todayBattles').textContent = autoBattleState.todayKills;

    saveGameData();
    updateUI();

    // 肃清结束
    if (battleStopRequested) {
        stopAutoBattle();
        toggleAutoBattleMode(false);
        addBattleLog('🛑 连续肃清已停止', 'info');
    } else if (battleBtnPressState.autoMode) {
        stopAutoBattle();
    } else {
        stopAutoBattle();
    }
	
}
						
function getEnemyXP(enemy) {
    const cardType = enemy.cardType || 'normal';
    const baseXP = {
        'normal': 100,
        'elite': 200,
        'boss': 300,
        'mechanic': 400,
        'super': 500
    };
    return baseXP[cardType] || 100;

						
						const xpReward = getEnemyXP(enemy);
						addXP(xpReward);
						

						// 更新资料库
						if (enemy.faction) {
							gameData.codex[enemy.faction] = (gameData.codex[enemy.faction] || 0) + 1;
						}

						autoBattleState.totalKills++;
						autoBattleState.todayKills++;
						autoBattleState.drops = drops;

						// 显示掉落
						const dropsContainer = document.getElementById('battleDrops');
						dropsContainer.innerHTML = '';
						if (drops.length > 0) {
							drops.forEach(drop => {
								addBattleLog(`✨ 获得 ${drop.icon} ${drop.name} x${drop.amount}！`, 'drop');
								const el = document.createElement('div');
								el.className = 'auto-drop-item';
								el.innerHTML = `${drop.icon} ${drop.name} x${drop.amount}`;
								dropsContainer.appendChild(el);
							});
						}



						addBattleLog(`⭐ 获得 ${pointsReward} Prime | ${xpReward} 经验`, 'win');

						// 更新统计
						document.getElementById('totalKills').textContent = autoBattleState.totalKills;
						document.getElementById('todayBattles').textContent = autoBattleState.todayKills;
						document.getElementById('totalBattleDrops').textContent =
							parseInt(document.getElementById('totalBattleDrops').textContent) + drops.length;

						saveGameData();
						updateUI();

						// 肃清结束
						if (battleStopRequested) {
							stopAutoBattle();
							toggleAutoBattleMode(false);
							addBattleLog('🛑 连续肃清已停止', 'info');
						} else if (battleBtnPressState.autoMode) {
							stopAutoBattle();
						} else {
							stopAutoBattle();
						}
					}

					function playerDefeated() {
						addBattleLog(`💀 你被击败了！肃清结束...`, 'death');
						
						// 肃清结束（失败）
						if (battleStopRequested) {
							stopAutoBattle();
							toggleAutoBattleMode(false);
							addBattleLog('🛑 连续肃清已停止', 'info');
						} else if (battleBtnPressState.autoMode) {
							stopAutoBattle();
						} else {
							stopAutoBattle();
						}
						
					}

					function stopAutoBattle() {
						autoBattleState.active = false;
						if (autoBattleState.timer) {
							clearInterval(autoBattleState.timer);
							autoBattleState.timer = null;
						}
						// 停止技能战斗系统
						if (typeof stopSkillCombat === 'function') {
							stopSkillCombat();
						}

						const startBtn = document.getElementById('startBattleBtn');
						const continueBtn = document.getElementById('continueBattleBtn');
						const stopBtn = document.getElementById('stopBattleBtn');

						// 如果处于自动模式，保持只显示停止按钮（等待下一场肃清或用户点击停止）
						if (battleBtnPressState.autoMode) {
							if (startBtn) startBtn.style.display = 'none';
							if (continueBtn) continueBtn.style.display = 'none';
							if (stopBtn) {
								stopBtn.style.display = 'block';
								// 如果已经请求停止，保持等待状态
								if (battleStopRequested) {
									stopBtn.textContent = '⏳ 等待结束中';
									stopBtn.style.background = 'linear-gradient(135deg, #5a4a2a, var(--tenno-gold))';
								} else {
									stopBtn.textContent = '🛑 停止肃清';
									stopBtn.style.background = '';
								}
								stopBtn.disabled = false;
							}
							return;
						}

						// 非自动模式：恢复正常按钮状态
						if (startBtn) {
							startBtn.style.display = 'block';
							startBtn.textContent = '🌍 肃清导航';
							startBtn.disabled = false;
							startBtn.style.opacity = '1';
						}
						if (continueBtn) {
							continueBtn.style.display = selectedPlanet ? 'block' : 'none';
							continueBtn.classList.remove('btn-auto-mode');
							continueBtn.disabled = false;
							continueBtn.style.opacity = '1';
							document.getElementById('continueBattleBtnText').textContent = '⚔️ 肃清(-3⚡) ️️';
						}
						if (stopBtn) {
							stopBtn.style.display = 'none';
							stopBtn.textContent = '🛑 停止肃清';
							stopBtn.style.background = '';
							stopBtn.disabled = false;
							stopBtn.style.opacity = '1';
						}

						// 重置行动条显示
						autoBattleState.playerActionBar = 0;
						autoBattleState.enemyActionBar = 0;
						updateActionBarUI();
					}

					/**
					 * 请求停止自动肃清
					 * 肃清进行中时：变成"等待结束中"，必须等当前肃清打完
					 * 肃清未进行时：立即停止
					 */
					function requestStopBattle() {
						// 如果已经在等待停止中，直接返回
						if (battleStopRequested) {
							showToast('正在等待当前肃清结束...', 'warning');
							return;
						}

						// 当前没有肃清在进行，立即停止
						if (!autoBattleState.active) {
							if (battleBtnPressState.autoMode) {
								stopAutoBattleLoop();
								toggleAutoBattleMode(false);
							}
							stopAutoBattle();
							addBattleLog('🛑 连续肃清已停止', 'info');
							return;
						}

						// 肃清正在进行中：标记停止请求，按钮变成"等待结束中"
						battleStopRequested = true;

						const stopBtn = document.getElementById('stopBattleBtn');
						if (stopBtn) {
							stopBtn.textContent = '⏳ 等待结束中';
							stopBtn.style.background = 'linear-gradient(135deg, #5a4a2a, var(--tenno-gold))';
							// 保持可点击，但 battleStopRequested 已标记，重复点击无效果
						}

						addBattleLog('⏳ 已请求停止，等待肃清结束中...', 'warning');
						showToast('已请求停止，等待肃清结束中...', 'warning');
					}

					function showFloatingDamage(dmg, target) {
						const el = document.createElement('div');
						el.className = 'auto-battle-damage';
						el.textContent = '-' + dmg;
						el.style.color = target === 'enemy' ? '#fff' : 'var(--grineer-red)';

						// 随机位置
						const x = target === 'enemy' ?
							60 + Math.random() * 20 :
							20 + Math.random() * 20;
						const y = 30 + Math.random() * 20;

						el.style.left = x + '%';
						el.style.top = y + '%';

						document.body.appendChild(el);
						setTimeout(() => el.remove(), 1200);
					}
					
					function showFloatingText(text, x, y, color) {
					    var el = document.createElement('div');
					    el.className = 'auto-battle-damage';
					    el.textContent = text;
					    el.style.color = color || '#fff';
					    el.style.left = (x || 50) + '%';
					    el.style.top = (y || 30) + '%';
					    el.style.fontSize = '1.2rem';
					    el.style.fontWeight = 'bold';
					    el.style.textShadow = '0 0 10px ' + (color || '#fff');
					    document.body.appendChild(el);
					    setTimeout(function() { el.remove(); }, 1200);
					}

					function addBattleLog(text, type) {
						const log = document.getElementById('autoBattleLog');
						const div = document.createElement('div');

						let colorClass = '';
						switch (type) {
							case 'player':
								colorClass = 'log-damage-player';
								break;
							case 'enemy':
								colorClass = 'log-damage-enemy';
								break;
							case 'drop':
								colorClass = 'log-drop';
								break;
							case 'death':
								colorClass = 'log-death';
								break;
							case 'win':
								colorClass = 'log-win';
								break;
							default:
								colorClass = '';
						}

						div.className = colorClass;
						div.textContent = text;
						div.style.marginBottom = '4px';

						log.appendChild(div);
						log.scrollTop = log.scrollHeight;
					}

					// 碎片转化醒目日志
					function addShardConvertLog(cardData, shardConfig, sourceName) {
						var log = document.getElementById('autoBattleLog');
						if (!log) return;

						var div = document.createElement('div');
						div.style.cssText =
							'margin: 8px 0; ' +
							'padding: 10px 15px; ' +
							'background: linear-gradient(90deg, rgba(100,100,100,0.15), rgba(100,100,100,0.05)); ' +
							'border-left: 4px solid #888; ' +
							'border-radius: 0 8px 8px 0; ' +
							'animation: shardLogSlide 0.5s ease;';

						div.innerHTML =
							'<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">' +
							'<span style="font-size: 1.4rem;">♻️</span>' +
							'<span style="color: #888; font-size: 0.85rem; text-decoration: line-through; opacity: 0.6;">' + cardData.name +
							'</span>' +
							'<span style="color: #666;">→</span>' +
							'<span style="font-size: 1.4rem;">' + shardConfig.icon + '</span>' +
							'<span style="color: var(--tenno-gold); font-family: Orbitron; font-size: 1rem; font-weight: 700;">' +
							shardConfig.name + '</span>' +
							'</div>' +
							'<div style="display: flex; align-items: center; gap: 15px; padding-left: 34px;">' +
							'<span style="color: var(--infested-green); font-family: Orbitron; font-size: 0.9rem;">+' + shardConfig.points +
							' Prime</span>' +
							'<span style="color: #555; font-size: 0.75rem;">来源: ' + sourceName + '</span>' +
							'</div>';

						log.appendChild(div);
						log.scrollTop = log.scrollHeight;

						// 同时显示一个临时浮动提示
						showFloatingShard(shardConfig);
					}

					// 浮动碎片提示
					function showFloatingShard(shardConfig) {
						var el = document.createElement('div');
						el.style.cssText =
							'position: fixed; ' +
							'top: 40%; ' +
							'left: 50%; ' +
							'transform: translate(-50%, -50%); ' +
							'z-index: 2000; ' +
							'pointer-events: none; ' +
							'animation: shardFloat 1.5s ease forwards;';

						el.innerHTML =
							'<div style="font-size: 4rem; text-align: center; filter: drop-shadow(0 0 20px rgba(200,168,75,0.5));">' +
							shardConfig.icon + '</div>' +
							'<div style="color: var(--tenno-gold); font-family: Orbitron; font-size: 1.2rem; text-align: center; margin-top: 10px; text-shadow: 0 0 10px rgba(200,168,75,0.3);">+' +
							shardConfig.name + '</div>';

						document.body.appendChild(el);
						setTimeout(function() {
							el.remove();
						}, 1500);
					}

					function setBattlePortraitBackground(elementId, entity) {
						const el = document.getElementById(elementId);
						if (!el || !entity) return;

						const icon = entity.icon || '❔';
						const image = entity.image || '';
						el.classList.add('skill-combat-avatar');
						el.classList.remove('death-anim', 'casting', 'hit-shake', 'hit-flash');
						el.style.removeProperty('animation');
						el.style.removeProperty('opacity');
						el.style.removeProperty('transform');
						el.style.removeProperty('filter');
						el.setAttribute('data-avatar-key', image || icon);
						el.setAttribute('data-avatar-icon', icon);
						el.setAttribute('aria-label', entity.name || 'avatar');
						el.textContent = '';

						if (image) {
							el.classList.add('has-avatar-image');
							el.classList.remove('no-avatar-image');
							el.style.backgroundImage = `url('${image}')`;
							el.style.backgroundSize = 'contain';
							el.style.backgroundPosition = 'center';
							el.style.backgroundRepeat = 'no-repeat';
						} else {
							el.classList.remove('has-avatar-image');
							el.classList.add('no-avatar-image');
							el.style.backgroundImage = '';
						}
					}

					function updateBattleUI() {
						if (!gameData) return;

						 						// 更新负荷显示（当前值/自然上限100，无限负荷模式显示 ∞/xxx）
						 						    const allStaminaValues = document.querySelectorAll('[id="battleStaminaValue"]');
						 						    allStaminaValues.forEach(function(el) {
						 						        if (isUnlimitedStaminaActive()) {
						 						            el.textContent = '∞/' + STAMINA_MAX;
						 						        } else {
						 						            const currentStamina = gameData?.stamina || stamina || 0;
						 						            el.textContent = currentStamina + '/100'; // 自然上限固定100
						 						        }
						 						    });
						
						 
						
						const wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
						const wfData = getCurrentWarframeData();

						document.getElementById('battlePlayerName').textContent = wf.name;
						document.getElementById('battlePlayerLevel').textContent = wfData.level;
						setBattlePortraitBackground('battlePlayerIcon', wf);

						if (autoBattleState.enemy) {
							document.getElementById('battleEnemyName').textContent = autoBattleState.enemy ? autoBattleState.enemy.name : '未知敌人';
							document.getElementById('battleEnemyLevel').textContent = autoBattleState.enemy ? autoBattleState.enemy.level : '';
							setBattlePortraitBackground('battleEnemyIcon', autoBattleState.enemy);

							document.getElementById('battlePlayerHpText').textContent =
								`${autoBattleState.playerHp}/${autoBattleState.playerMaxHp}`;
							document.getElementById('battlePlayerHpBar').style.width =
								(autoBattleState.playerHp / autoBattleState.playerMaxHp * 100) + '%';
								document.body.classList.add('battle-active');
							document.getElementById('battleEnemyHpText').textContent =
								`${autoBattleState.enemyHp}/${autoBattleState.enemyMaxHp}`;
							document.getElementById('battleEnemyHpBar').style.width =
								(autoBattleState.enemyHp / autoBattleState.enemyMaxHp * 100) + '%';
						} else {
							// 默认显示
							const defaultEnemy = ENEMIES[0];
							document.getElementById('battleEnemyName').textContent = defaultEnemy ? defaultEnemy.name : '未知敌人';
							document.getElementById('battleEnemyLevel').textContent = defaultEnemy.level;

							// 默认敌人图标：优先使用图片
							if (defaultEnemy) {
								setBattlePortraitBackground('battleEnemyIcon', defaultEnemy);
							}

							const playerStats = getPlayerStats();
							document.getElementById('battlePlayerHpText').textContent = `${playerStats.hp}/${playerStats.maxHp}`;
							document.getElementById('battlePlayerHpBar').style.width = '100%';
							document.getElementById('battleEnemyHpText').textContent = defaultEnemy ? `${defaultEnemy.hp}/${defaultEnemy.hp}` : '0/0';
							document.getElementById('battleEnemyHpBar').style.width = '100%';
						}

						document.getElementById('totalKills').textContent = autoBattleState.totalKills;
						document.getElementById('todayBattles').textContent = autoBattleState.todayKills;
						// 同步更新行动条
						updateActionBarUI();
						
						// 在 updateBattleUI 函数末尾添加：
						// 更新前缀轮换显示
						var prefixStatus = getPrefixRotationStatus();
						var currentPrefixEl = document.getElementById('currentPrefixName');
						var currentBuffEl = document.getElementById('currentPrefixBuff');
						
						if (currentPrefixEl && prefixStatus.current) {
						    currentPrefixEl.textContent = prefixStatus.current.theme;
						    currentPrefixEl.style.color = prefixStatus.current.color || 'var(--tenno-gold)';
						}
						
						if (currentBuffEl && prefixStatus.current) {
						    currentBuffEl.textContent = prefixStatus.current.buff || '';
						}
						
						// 在 updateBattleUI() 中调用
										setBattleNameFont('battlePlayerName');
										setBattleNameFont('battleEnemyName');	
					}

					function updateActionBarUI() {
						const playerBar = document.getElementById('battlePlayerActionBar');
						const enemyBar = document.getElementById('battleEnemyActionBar');
						const playerText = document.getElementById('battlePlayerActionText');
						const enemyText = document.getElementById('battleEnemyActionText');

						if (!playerBar || !enemyBar) return;

						const playerAction = Math.min(100, Math.max(0, Number(autoBattleState.playerActionBar) || 0));
						const enemyAction = Math.min(100, Math.max(0, Number(autoBattleState.enemyActionBar) || 0));

						playerBar.style.width = playerAction + '%';
						enemyBar.style.width = enemyAction + '%';

						if (playerText) playerText.textContent = Math.floor(playerAction) + '/100';
						if (enemyText) enemyText.textContent = Math.floor(enemyAction) + '/100';

						// 满值时高亮
						playerBar.style.boxShadow = playerAction >= 100 ? '0 0 10px var(--infested-green)' : 'none';
						enemyBar.style.boxShadow = enemyAction >= 100 ? '0 0 10px #ff8844' : 'none';
					}
					// ═══════════════════════════════════════════════════════════════

					function getAvailableMinerals() {
						const playerLevel = getCurrentWarframeData().level;
						return MINERALS.filter(m => m.level <= playerLevel + 2);
					}

// ═══════════════════════════════════════════════════════════════
//  Warframe 风格勘探系统（替换原来的 startAutoMining）
// ═══════════════════════════════════════════════════════════════

// 勘探状态
let warframeMiningState = {
    active: false,
    scanning: false,
    mining: false,
    cooling: false,
    heat: 0,           // 0-100
    energy: 100,       // 0-100
    nodePosition: 0,   // 0-100 (矿脉轨道上的位置)
    nodeDirection: 1,  // 1 或 -1
    nodeSpeed: 1,      // 移动速度
    nodeType: 'blue',  // blue/yellow/red
    targetZoneCenter: 50, // 目标区中心
    targetZoneWidth: 20,  // 目标区宽度(%)
    noiseLevel: 20,    // 干扰等级 0-100
    currentVein: null,
    veinDepleted: false,
    perfectMines: 0,
    totalMines: 0,
    nodeTimer: null,
    heatTimer: null,
    scanTimer: null
};

// 节点颜色类型
const NODE_TYPES = [
    { type: 'blue', name: '普通节点', color: '#00d4ff', qualityMult: 1.0, chance: 0.55, rarityMod: 1.0 },
    { type: 'yellow', name: '稀有节点', color: '#ffd700', qualityMult: 1.5, chance: 0.30, rarityMod: 1.5 },
    { type: 'red', name: '完美节点', color: '#ff4444', qualityMult: 2.0, chance: 0.15, rarityMod: 2.5 }
];

// 兼容旧入口：点击"开始勘探"按钮时调用
function startAutoMining() {
    startVeinScan();
}

// 兼容旧入口：点击"停止勘探"按钮时调用
function stopAutoMining() {
    stopWarframeMining();
}

function startVeinScan() {
    if (warframeMiningState.active) return;
    
    // 断网锁定
    if (window._offlineLock) {
        showToast('【星渊】链接中断，请恢复网络', 'error');
        return;
    }
    
    if (stamina < 10) {
        
        showToast(`负荷不足！每次扫描需要10点负荷`, 'error');
        return;
    }

        modifyStamina(-10);

    warframeMiningState.active = true;
    warframeMiningState.scanning = true;
    warframeMiningState.mining = false;
    warframeMiningState.cooling = false;
    warframeMiningState.heat = 0;
    warframeMiningState.energy = 100;
    warframeMiningState.perfectMines = 0;
    warframeMiningState.totalMines = 0;
    warframeMiningState.veinDepleted = false;

    // UI 更新
    const scanBtn = document.getElementById('scanVeinBtn');
    const mineBtn = document.getElementById('mineNodeBtn');
    const coolBtn = document.getElementById('cooldownBtn');
    const stopBtn = document.getElementById('stopMiningBtn');
    
    if (scanBtn) scanBtn.style.display = 'none';
    if (mineBtn) mineBtn.style.display = 'none';
    if (coolBtn) coolBtn.style.display = 'none';
    // ========== 关键：点击扫描就隐藏停止按钮 ==========
    if (stopBtn) stopBtn.style.display = 'none';

    const idleState = document.getElementById('veinIdleState');
    const veinNodes = document.getElementById('veinNodes');
    const veinInfo = document.getElementById('currentVeinInfo');
    const scannerBg = document.getElementById('miningScannerBg');
    const dropsContainer = document.getElementById('miningDrops');
    
    if (idleState) idleState.style.display = 'none';
    // veinNodes 等抽取结束后再显示
    if (veinInfo) veinInfo.style.display = 'none';
    if (scannerBg) scannerBg.style.opacity = '1';
    if (dropsContainer) dropsContainer.innerHTML = '';

    const log = document.getElementById('miningLog');
    if (log) {
        log.innerHTML = '';
        addMiningLog('🔍 启动诺萨姆切割器...', 'info');
        addMiningLog('📡 正在扫描附近矿脉信号...', 'info');
    }

    // 启动抽取动画
    setTimeout(() => {
        discoverVein();
    }, 300);
}

function discoverVein() {
    const currentRegion = getCurrentMiningRegion();
    const regionVeins = VEIN_TYPES.filter(v => {
        // 支持 region 为字符串或数组
        const regions = Array.isArray(v.region) ? v.region : [v.region];
        return regions.includes(currentRegion);
    });
    
    if (regionVeins.length === 0) {
        addMiningLog('❌ 当前区域无可用矿脉', 'death');
        return;
    }
    
    startVeinDrawAnimation(regionVeins);
}

function startVeinDrawAnimation(regionVeins) {
    const idleState = document.getElementById('veinIdleState');
    const drawLayer = document.getElementById('veinDrawLayer');
    const drawTrack = document.getElementById('veinDrawTrack');
    const drawText = document.getElementById('veinDrawText');
    const veinContainer = document.getElementById('veinContainer');
    
    if (!drawLayer || !drawTrack) {
        oldDiscoverVein(regionVeins);
        return;
    }
    
    // 1. 随机决定目标矿脉
    const totalWeight = regionVeins.reduce((sum, v) => sum + v.dropWeight, 0);
    let random = Math.random() * totalWeight;
    let targetVein = regionVeins[0];
    for (const v of regionVeins) {
        random -= v.dropWeight;
        if (random <= 0) { targetVein = v; break; }
    }
    
    // 2. 构建抽取序列
    const drawSequence = [];
    const itemCount = 20;
    for (let i = 0; i < itemCount - 1; i++) {
        drawSequence.push(regionVeins[Math.floor(Math.random() * regionVeins.length)]);
    }
    drawSequence.push(targetVein);
    
    // 3. 准备UI
    if (idleState) idleState.style.display = 'none';
    drawLayer.style.display = 'block';
    drawTrack.innerHTML = '';
    
drawSequence.forEach((vein) => {
    const item = document.createElement('div');
    item.className = 'vein-draw-item';
    item.style.color = vein.color;
    item.style.borderColor = vein.color;
    
    // 优先使用图片，后备emoji
    const iconHtml = vein.image 
        ? `<img src="${vein.image}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px ${vein.color});" onerror="this.parentNode.innerHTML='<div style=\\'font-size: 2.5rem;\\'>${vein.icon}</div>'">`
        : `<div style="font-size: 2.5rem;">${vein.icon}</div>`;
    
    item.innerHTML = `
        ${iconHtml}
        <div style="position: absolute; bottom: 4px; font-size: 0.6rem; font-family: 'Orbitron'; color: #666; opacity: 0.7;">${vein.name}</div>
    `;
    drawTrack.appendChild(item);
});
    
    // 4. 精确计算动画参数（关键修复）
    const itemWidth = 110; // 80px + 30px gap
    const containerWidth = veinContainer.offsetWidth || 400;
    const centerX = containerWidth / 2;
    
    // 中心框是100x100，图标是80x80
    // 目标：最后一个图标的中心精确对准容器中心
    // 图标中心到左边框的距离 = 40px (80/2)
    // 但图标有padding/border，实际内容中心需要微调
    
    // 初始位置：第一个图标中心在容器右侧外
    const startOffset = centerX + itemWidth * 2;
    
    // ========== 关键修复：最终位置精确计算 ==========
    // 最后一个图标索引 = itemCount - 1
    // 最后一个图标的左边框位置 = (itemCount - 1) * itemWidth
    // 要让图标中心对准容器中心：
    // 图标中心 = 左边框 + 40px (内容区域中心)
    // 目标：图标中心 = centerX
    // 所以：translateX = centerX - ((itemCount - 1) * itemWidth + 40)
    const lastItemLeftEdge = (itemCount - 1) * itemWidth;
    const iconContentCenter = 40; // 80px宽度的中心
    const endOffset = centerX - (lastItemLeftEdge + iconContentCenter);
    
    // 微调：减去2px确保完全在框内（边框厚度补偿）
    const finalOffset = endOffset - 2;
    
    // 5. 设置初始位置
    drawTrack.style.left = '0';
    drawTrack.style.transform = 'translateY(-50%) translateX(' + startOffset + 'px)';
    
    // 6. 强制重绘
    drawTrack.offsetHeight;
    
    // 7. 启动动画
    drawTrack.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
    
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            drawTrack.style.transform = 'translateY(-50%) translateX(' + finalOffset + 'px)';
        });
    });
    
    // 8. 提前显示"即将锁定"
    setTimeout(() => {
        if (drawText) {
            drawText.textContent = '✨ 即将锁定...';
            drawText.style.color = 'var(--tenno-gold)';
        }
    }, 2200);
    
    // 9. 高亮效果
    let highlightInterval = setInterval(() => {
        const items = drawTrack.querySelectorAll('.vein-draw-item');
        const computedStyle = window.getComputedStyle(drawTrack);
        const matrix = new WebKitCSSMatrix(computedStyle.transform);
        const currentX = matrix.m41;
        
        const passedItems = Math.round((startOffset - currentX) / itemWidth);
        const activeIndex = Math.max(0, Math.min(passedItems, items.length - 1));
        
        items.forEach((item, idx) => {
            if (idx === activeIndex) {
                item.classList.add('active');
                setTimeout(() => item.classList.remove('active'), 150);
            }
        });
    }, 80);
    
    // 10. 动画结束
    setTimeout(() => {
        clearInterval(highlightInterval);
        drawTrack.style.transition = 'none';
        
        const items = drawTrack.querySelectorAll('.vein-draw-item');
        const lastItem = items[items.length - 1];
        if (lastItem) {
            lastItem.classList.add('highlight');
            lastItem.style.borderColor = targetVein.color;
        }
        
        // 光效
        const burst = document.createElement('div');
        burst.className = 'draw-light-burst';
        burst.style.background = 'radial-gradient(circle, ' + targetVein.color + '66 0%, transparent 70%)';
        
        // 显示结果
        setTimeout(() => showVeinResult(targetVein), 600);
    }, 3000);
}

function showVeinResult(vein) {
    const drawLayer = document.getElementById('veinDrawLayer');
    const resultLayer = document.getElementById('veinResultLayer');
    const resultIcon = document.getElementById('veinResultIcon');
    const resultName = document.getElementById('veinResultName');
    const resultRarity = document.getElementById('veinResultRarity');
    
    if (!resultLayer) {
        enterMiningGame(vein);
        return;
    }
    
    if (drawLayer) drawLayer.style.display = 'none';
    resultLayer.style.display = 'flex';
    resultLayer.className = 'vein-result-show';
    
    // 结果图标：优先使用图片
    if (resultIcon) {
        if (vein.image) {
            resultIcon.innerHTML = `<img src="${vein.image}" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 0 20px ${vein.color});" onerror="this.textContent='${vein.icon}'">`;
        } else {
            resultIcon.textContent = vein.icon;
        }
        resultIcon.style.color = vein.color;
    }
    
    if (resultName) {
        resultName.textContent = vein.name;
        resultName.style.color = vein.color;
    }
    if (resultRarity) {
        const rarityText = { 'common': '⚪ 普通矿脉', 'uncommon': '🔵 稀有矿脉', 'rare': '🟡 罕见矿脉' };
        resultRarity.textContent = rarityText[vein.rarity] || '⚪ 普通矿脉';
        resultRarity.style.color = vein.color;
    }
    
    // 日志图标：优先使用图片
    const logIcon = vein.image 
        ? `<img src="${vein.image}" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 0 2px ${vein.color});" onerror="this.outerHTML='${vein.icon}'">`
        : vein.icon;
    
    addMiningLog(`扫描完成！发现 ${logIcon} ${vein.name}！`, 'drop');
    
    setTimeout(() => {
        resultLayer.style.display = 'none';
        enterMiningGame(vein);
    }, 1500);
}

function enterMiningGame(vein) {
    warframeMiningState.currentVein = vein;
    warframeMiningState.scanning = false;
    warframeMiningState.mining = true;
    warframeMiningState.veinDepleted = false;
    
    // 显示停止按钮
    const stopBtn = document.getElementById('stopMiningBtn');
    if (stopBtn) stopBtn.style.display = 'block';
    
    // ========== 计算丰富度（提前到函数顶部）==========
    const rarityRichness = {
        'common': { high: 0.4, mid: 0.35, low: 0.25 },
        'uncommon': { high: 0.25, mid: 0.40, low: 0.35 },
        'rare': { high: 0.15, mid: 0.35, low: 0.50 }
    };
    const weights = rarityRichness[vein.rarity] || rarityRichness['common'];
    const roll = Math.random();
    const richness = roll < weights.high ? '高' : (roll < weights.high + weights.mid ? '中' : '低');
    
    // 显示矿脉信息
    const veinInfo = document.getElementById('currentVeinInfo');
    if (veinInfo) {
        veinInfo.style.display = 'block';
        
        const veinIcon = document.getElementById('veinIcon');
        const veinName = document.getElementById('veinName');
        const veinRichness = document.getElementById('veinRichness');
        
        // 图标：优先使用图片
        if (veinIcon) {
            if (vein.image) {
                veinIcon.innerHTML = `<img src="${vein.image}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 0 3px ${vein.color});" onerror="this.textContent='${vein.icon}'">`;
            } else {
                veinIcon.textContent = vein.icon;
            }
        }
        
        // 名称
        if (veinName) {
            veinName.textContent = vein.name;
            veinName.style.color = vein.color;
        }
        
        // 丰富度
        if (veinRichness) veinRichness.textContent = '丰富度: ' + richness;
    }
    
    // 显示节点层（回收小游戏）
    const veinNodes = document.getElementById('veinNodes');
    if (veinNodes) veinNodes.style.display = 'block';
    
    // ========== 现在 richness 可以在这里使用了 ==========
    addMiningLog(`丰富度: ${richness} | 准备开始切割...`, 'info');
    addMiningLog(`🎯 在正确时机点击"切割矿脉"！`, 'info');
    
    startNodeMovement();
    startHeatAccumulation();
    
    // 延迟显示回收按钮
    const mineBtn = document.getElementById('mineNodeBtn');
    if (mineBtn) {
        setTimeout(() => {
            mineBtn.style.display = 'block';
            addMiningLog(`⛏️ 切割器已就绪！`, 'info');
        }, 500);
    }
}

// 保留旧版作为回退
function oldDiscoverVein(regionVeins) {
    const totalWeight = regionVeins.reduce((sum, v) => sum + v.dropWeight, 0);
    let random = Math.random() * totalWeight;
    let vein = regionVeins[0];
    for (const v of regionVeins) {
        random -= v.dropWeight;
        if (random <= 0) { vein = v; break; }
    }
    
    warframeMiningState.currentVein = vein;
    warframeMiningState.scanning = false;
    warframeMiningState.mining = true;
    warframeMiningState.veinDepleted = false;
    
    const veinInfo = document.getElementById('currentVeinInfo');
    if (veinInfo) veinInfo.style.display = 'block';
    
    const veinIcon = document.getElementById('veinIcon');
    const veinName = document.getElementById('veinName');
    const veinRichness = document.getElementById('veinRichness');
    
    if (veinIcon) veinIcon.textContent = vein.icon;
    if (veinName) {
        veinName.textContent = vein.name;
        veinName.style.color = vein.color;
    }
    
    const rarityRichness = {
        'common': { high: 0.4, mid: 0.35, low: 0.25 },
        'uncommon': { high: 0.25, mid: 0.40, low: 0.35 },
        'rare': { high: 0.15, mid: 0.35, low: 0.50 }
    };
    const weights = rarityRichness[vein.rarity] || rarityRichness['common'];
    const roll = Math.random();
    const richness = roll < weights.high ? '高' : (roll < weights.high + weights.mid ? '中' : '低');
    if (veinRichness) veinRichness.textContent = '丰富度: ' + richness;
    
    addMiningLog(`扫描发现 ${vein.icon} ${vein.name}！`, 'drop');
    addMiningLog(`📊 稀有度: ${vein.rarity} | 丰富度: ${richness}`, 'info');
    
    const mineBtn = document.getElementById('mineNodeBtn');
    if (mineBtn) mineBtn.style.display = 'block';
    
    startNodeMovement();
    startHeatAccumulation();
}

// 获取当前勘探区域ID
function getCurrentMiningRegion() {
    // 优先从选中的区域获取
    if (selectedMiningZone && selectedMiningZone.id) {
        // 根据 zone.id 直接映射到 region
        const zoneId = selectedMiningZone.id;
        if (zoneId === 'm_zone1' || zoneId.includes('beast')) {
            return 'beast_bone';
        } else if (zoneId === 'm_zone2' || zoneId.includes('blue')) {
            return 'blue_red_crystal';
        } else if (zoneId === 'm_zone3' || zoneId.includes('symbiotic')) {
            return 'symbiotic';
        }
    }
    // 回退
    if (selectedMiningZone && selectedMiningZone.regionId) {
        return selectedMiningZone.regionId;
    }
    return 'beast_bone';
}

// 节点移动系统
function startNodeMovement() {
    const node = document.getElementById('miningNode');
    if (!node) return;

    // 随机节点类型（蓝/黄/红）
    const roll = Math.random();
    let nodeType = 'blue';
    if (roll > 0.9) nodeType = 'red';
    else if (roll > 0.6) nodeType = 'yellow';
    
    warframeMiningState.nodeType = nodeType;
    warframeMiningState.nodePosition = 0;
    warframeMiningState.nodeDirection = 1;
    warframeMiningState.nodeSpeed = 0.5 + Math.random() * 1.5;

    // 设置节点样式颜色
    node.className = 'mining-node ' + nodeType;
    
    // 随机目标区位置 (30%-70%)
    warframeMiningState.targetZoneCenter = 30 + Math.random() * 40;
    const targetZone = document.getElementById('targetZone');
    if (targetZone) {
        targetZone.style.left = warframeMiningState.targetZoneCenter + '%';
    }
    
    // 根据节点类型调整目标区大小：红节点最难，目标区最小
    const zoneSizes = { blue: 60, yellow: 40, red: 25 };
    warframeMiningState.targetZoneWidth = zoneSizes[nodeType];
    if (targetZone) {
        targetZone.style.width = zoneSizes[nodeType] + 'px';
        targetZone.style.height = zoneSizes[nodeType] + 'px';
    }

    // 启动移动循环 (每50ms更新一次)
    if (warframeMiningState.nodeTimer) clearInterval(warframeMiningState.nodeTimer);
    warframeMiningState.nodeTimer = setInterval(() => {
        if (!warframeMiningState.mining || warframeMiningState.cooling) return;
        
        // 更新位置
        warframeMiningState.nodePosition += warframeMiningState.nodeSpeed * warframeMiningState.nodeDirection;
        
        // 边界反弹
        if (warframeMiningState.nodePosition >= 100) {
            warframeMiningState.nodePosition = 100;
            warframeMiningState.nodeDirection = -1;
        } else if (warframeMiningState.nodePosition <= 0) {
            warframeMiningState.nodePosition = 0;
            warframeMiningState.nodeDirection = 1;
        }
        
        // 随机速度变化（模拟干扰）
        if (Math.random() < 0.02) {
            warframeMiningState.nodeSpeed = 0.3 + Math.random() * 2;
            updateNoiseLevel();
        }
        
        // 更新节点位置
        node.style.left = warframeMiningState.nodePosition + '%';
    }, 50);
}

function startHeatAccumulation() {
    if (warframeMiningState.heatTimer) clearInterval(warframeMiningState.heatTimer);
    
    warframeMiningState.heatTimer = setInterval(() => {
        if (!warframeMiningState.active) return;
        
        if (warframeMiningState.heat > 0 && !warframeMiningState.cooling) {
            warframeMiningState.heat = Math.max(0, warframeMiningState.heat - 2);
        }
        
        if (warframeMiningState.mining && !warframeMiningState.cooling) {
            warframeMiningState.heat = Math.min(100, warframeMiningState.heat + 3);
        }
        
        updateHeatDisplay();
        
        // ========== 新增：负荷耗尽检查 ==========
        if (stamina < 10 && warframeMiningState.active) {
            addMiningLog('❌ 负荷耗尽！无法继续扫描矿脉', 'death');
            stopWarframeMining();
            return;
        }
        // ======================================
        
        if (warframeMiningState.heat >= 100 && !warframeMiningState.cooling) {
            overheatMiner();
        }
    }, 500);
}

// 更新热量显示
function updateHeatDisplay() {
    const heatBar = document.getElementById('minerHeatBar');
    const heatText = document.getElementById('minerHeatText');
    if (!heatBar || !heatText) return;
    
    const heatPercent = warframeMiningState.heat;
    heatBar.style.width = heatPercent + '%';
    heatText.textContent = Math.floor(heatPercent) + '%';
    
    // 颜色根据热量变化
    if (heatPercent < 50) {
        heatBar.style.background = 'linear-gradient(90deg, #ff6600, var(--grineer-red))';
        heatText.classList.remove('heat-warning');
    } else if (heatPercent < 80) {
        heatBar.style.background = 'linear-gradient(90deg, var(--tenno-gold), var(--grineer-red))';
        heatText.classList.remove('heat-warning');
    } else {
        heatBar.style.background = 'linear-gradient(90deg, var(--grineer-red), #ff0000)';
        heatText.classList.add('heat-warning');
    }
}

// 更新干扰等级显示
function updateNoiseLevel() {
    const noise = Math.min(100, 20 + Math.random() * 60);
    warframeMiningState.noiseLevel = noise;
    
    const noiseBar = document.getElementById('noiseBar');
    const noiseText = document.getElementById('noiseLevelText');
    if (!noiseBar || !noiseText) return;
    
    noiseBar.style.width = noise + '%';
    
    if (noise < 40) {
        noiseText.textContent = '低';
        noiseText.style.color = 'var(--infested-green)';
    } else if (noise < 70) {
        noiseText.textContent = '中';
        noiseText.style.color = 'var(--tenno-gold)';
    } else {
        noiseText.textContent = '高';
        noiseText.style.color = 'var(--grineer-red)';
    }
}

function mineCurrentNode() {
    if (!warframeMiningState.mining || warframeMiningState.cooling) return;
    
    const nodePos = warframeMiningState.nodePosition;
    const targetCenter = warframeMiningState.targetZoneCenter;
    const containerWidth = document.getElementById('veinContainer')?.offsetWidth || 400;
    const targetHalfPercent = (warframeMiningState.targetZoneWidth / containerWidth) * 100;
    
    const distance = Math.abs(nodePos - targetCenter);
    
    let quality, qualityClass, qualityText, qualityDesc;
    
    if (distance <= targetHalfPercent * 0.3) {
        quality = 'perfect';
        qualityClass = 'quality-perfect';
        qualityText = '⭐ 完美切割！';
        qualityDesc = '获得最高品质矿物';
        warframeMiningState.perfectMines++;
    } else if (distance <= targetHalfPercent * 0.7) {
        quality = 'good';
        qualityClass = 'quality-good';
        qualityText = '✨ 良好切割';
        qualityDesc = '获得标准品质矿物';
    } else if (distance <= targetHalfPercent) {
        quality = 'normal';
        qualityClass = 'quality-normal';
        qualityText = '✓ 普通切割';
        qualityDesc = '获得基础品质矿物';
    } else {
        quality = 'miss';
        qualityClass = '';
        qualityText = '✗ 切割失败';
        qualityDesc = '节点偏离目标区';

        addMiningLog(`❌ 切割失败！节点偏离目标区`, 'death');
        addMiningLog(`💡 提示: 等待节点进入虚线圈内再点击`, 'info');
        
        warframeMiningState.heat = Math.min(100, warframeMiningState.heat + 15);
        updateHeatDisplay();
        return;
    }
    
    warframeMiningState.totalMines++;
    
    // 在矿脉显示区显示品质提示
    const veinContainer = document.getElementById('veinContainer');
    if (veinContainer) {
        const floatEl = document.createElement('div');
        floatEl.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: "Orbitron"; font-size: 1.4rem; font-weight: 700; color: ' + (quality === 'perfect' ? 'var(--infested-green)' : quality === 'good' ? 'var(--tenno-gold)' : quality === 'normal' ? 'var(--orokin-cyan)' : 'var(--grineer-red)') + '; text-shadow: 0 0 15px currentColor; pointer-events: none; z-index: 100; animation: fadeIn 0.3s ease;';
        floatEl.textContent = qualityText;
        veinContainer.appendChild(floatEl);
        
        setTimeout(() => {
            if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
        }, 1500);
    }    
    
    // ========== 区域掉落：只掉落当前矿脉的矿物 ==========
    const vein = warframeMiningState.currentVein;
    const nodeConfig = NODE_TYPES.find(n => n.type === warframeMiningState.nodeType);
    
    // 基础数量
    const baseAmount = Math.floor(Math.random() * 2 + 1);
    
    // 根据回收品质和丰富度计算数量
    const richnessMult = {
        '高': 1.5,
        '中': 1.0,
        '低': 0.6
    };
    const currentRichness = document.getElementById('veinRichness')?.textContent?.replace('丰富度: ', '') || '中';
    const richMult = richnessMult[currentRichness] || 1.0;

    // 计算最终数量
    let finalAmount = Math.max(1, Math.floor(baseAmount * nodeConfig.qualityMult * richMult));

    // 只掉落当前扫描到的矿脉矿物（区域掉落）
    addToWarehouse(vein.name, vein.icon, finalAmount, 'mineral', vein.image);
    
    // 显示掉落
    const dropsContainer = document.getElementById('miningDrops');
    if (dropsContainer) {
        const dropEl = document.createElement('div');
        dropEl.className = 'mining-drop-item';
        
        // 优先使用图片
        const iconHtml = vein.image 
            ? `<img src="${vein.image}" style="width: 22px; height: 22px; object-fit: contain; vertical-align: middle; margin-right: 4px; filter: drop-shadow(0 0 3px ${vein.color});" onerror="this.outerHTML='<span style=\\'font-size: 1.1rem; margin-right: 4px;\\'>${vein.icon}</span>'">`
            : `<span style="font-size: 1.1rem; margin-right: 4px;">${vein.icon}</span>`;
        
        dropEl.innerHTML = `${iconHtml}<span style="vertical-align: middle;">${vein.name} x${finalAmount}</span> <span style="color: ${nodeConfig.color}; font-size: 0.75rem; vertical-align: middle;">(${nodeConfig.name})</span>`;
        dropEl.style.animation = 'dropPop 0.5s ease';
        dropsContainer.appendChild(dropEl);
        
        // 限制最多3个
        while (dropsContainer.children.length > 3) {
            dropsContainer.removeChild(dropsContainer.firstChild);
        }
    }
    
// 日志 - 使用图片替代emoji
const qualityLabel = quality === 'perfect' ? '完美' : (quality === 'good' ? '良好' : '普通');

// 优先使用图片，后备emoji
const logIcon = vein.image 
    ? `<img src="${vein.image}" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 0 2px ${vein.color});" onerror="this.outerHTML='${vein.icon}'">`
    : vein.icon;

addMiningLog(`⛏️ ${qualityLabel}切割！${logIcon} ${vein.name} x${finalAmount} (${nodeConfig.name})`, quality === 'perfect' ? 'drop' : 'info');
// ========== 勘探回响掉落 ==========
if (typeof tryDropMiningCard === 'function' && vein && vein.id) {
    var cardDrop = tryDropMiningCard(vein, 'normal', 'blue');
    if (cardDrop) {
        var result = addPlayerCard(cardDrop);  // 返回对象
        var sourceName = '从' + gatherable.name + '容器' + qualityLabel + '拆解';
        
        if (result.isNew) {
            addMiningLog(`🎴 新回响: ${cardDrop.name}！`, 'drop');
            setTimeout(function() {
                showCardAcquireModal(cardDrop, sourceName);
            }, 800);
        } else {
            addMiningLog(`🎴 获得: ${cardDrop.name} `, 'drop');
        }
    }
}
		// ================================================
    
    // 热量增加
    warframeMiningState.heat = Math.min(100, warframeMiningState.heat + 20);
    updateHeatDisplay();
    
    updateMiningStats();
    
    // 矿脉耗尽检查
    if (warframeMiningState.totalMines >= 5 + Math.floor(Math.random() * 5)) {
        depleteVein();
    } else {
        setTimeout(() => {
            if (warframeMiningState.mining && !warframeMiningState.veinDepleted) {
                startNodeMovement();
            }
        }, 800);
    }
}

// 矿脉耗尽
function depleteVein() {
    warframeMiningState.veinDepleted = true;
    
    const veinNodes = document.getElementById('veinNodes');
    if (veinNodes) veinNodes.classList.add('vein-depleted');
    
    addMiningLog(`💨 ${warframeMiningState.currentVein.name} 已耗尽！`, 'warning');
    
    // 2秒后寻找新矿脉
    setTimeout(() => {
        if (!warframeMiningState.active) return;
        addMiningLog('🔍 继续扫描附近矿脉...', 'info');
        if (veinNodes) veinNodes.classList.remove('vein-depleted');
        discoverVein();
    }, 2000);
}

function overheatMiner() {
    warframeMiningState.cooling = true;
    warframeMiningState.mining = false;
    
    if (warframeMiningState.nodeTimer) clearInterval(warframeMiningState.nodeTimer);
    
    const mineBtn = document.getElementById('mineNodeBtn');
    const coolBtn = document.getElementById('cooldownBtn');
    if (mineBtn) mineBtn.style.display = 'none';
    if (coolBtn) coolBtn.style.display = 'block';
    
    addMiningLog('🔥 切割器过热！需要冷却...', 'death');
    showToast('切割器过热！点击冷却', 'warning');
	
    // 矿脉枯竭奖励：根据当前矿脉稀有度给予额外掉落
    if (warframeMiningState.totalMines >= 3 && warframeMiningState.perfectMines >= 1) {
        const depletedVein = warframeMiningState.currentVein;
        const bonusAmount = Math.floor(Math.random() * 2 + 1) * (depletedVein.rarity === 'rare' ? 2 : 1);
        addToWarehouse(depletedVein.name, depletedVein.icon, bonusAmount, 'mineral');
        addMiningLog(`🎁 矿脉枯竭奖励！${depletedVein.icon} ${depletedVein.name} x${bonusAmount}`, 'drop');

        // 稀有矿脉枯竭时有概率发现隐藏矿脉
        if (depletedVein.rarity === 'rare' && Math.random() < 0.3) {
            addMiningLog(`✨ ${depletedVein.icon} ${depletedVein.name} 矿脉深处传来能量波动...`, 'info');
        }
    }
	
}

function cooldownMiner() {
    if (!warframeMiningState.cooling) return;
    
    addMiningLog('❄️ 启动冷却程序...', 'info');
    
    let coolProgress = 0;
    const coolInterval = setInterval(() => {
        coolProgress += 10;
        warframeMiningState.heat = Math.max(0, 100 - coolProgress * 1.2);
        updateHeatDisplay();
        
        if (coolProgress >= 100) {
            clearInterval(coolInterval);
            
            warframeMiningState.cooling = false;
            warframeMiningState.heat = 0;
            warframeMiningState.mining = false;
            warframeMiningState.active = false;
            
            // 保存本次统计
            autoMiningState.totalMined += warframeMiningState.totalMines;
            autoMiningState.todayMined += warframeMiningState.totalMines;
            saveGameData();
            
            // 重置单次状态
            warframeMiningState.totalMines = 0;
            warframeMiningState.perfectMines = 0;
            
            // 切换按钮：显示扫描按钮，隐藏冷却和停止按钮
            const scanBtn = document.getElementById('scanVeinBtn');
            const coolBtn = document.getElementById('cooldownBtn');
            const stopBtn = document.getElementById('stopMiningBtn');
            const mineBtn = document.getElementById('mineNodeBtn');
            
            if (scanBtn) scanBtn.style.display = 'block';
            if (coolBtn) coolBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'none';
            if (mineBtn) mineBtn.style.display = 'none';
            
            // 重置显示区域
            const idleState = document.getElementById('veinIdleState');
            const veinNodes = document.getElementById('veinNodes');
            const veinInfo = document.getElementById('currentVeinInfo');
            const scannerBg = document.getElementById('miningScannerBg');
            const dropsContainer = document.getElementById('miningDrops');
            
            if (idleState) idleState.style.display = 'block';
            if (veinNodes) {
                veinNodes.style.display = 'none';
                veinNodes.classList.remove('vein-depleted');
            }
            if (veinInfo) veinInfo.style.display = 'none';
            if (scannerBg) scannerBg.style.opacity = '0';
            if (dropsContainer) dropsContainer.innerHTML = '';
           
			
            addMiningLog('✅ 冷却完成！点击"扫描矿脉"重新开始', 'success');
            addMiningLog(`⚡ 当前负荷: ${stamina}点`, 'info');
            
        }
    }, 100);
}

function stopWarframeMining() {
    warframeMiningState.active = false;
    warframeMiningState.mining = false;
    warframeMiningState.scanning = false;
    warframeMiningState.cooling = false;
    
    if (warframeMiningState.nodeTimer) clearInterval(warframeMiningState.nodeTimer);
    if (warframeMiningState.heatTimer) clearInterval(warframeMiningState.heatTimer);
    
    // 保存统计
    autoMiningState.totalMined += warframeMiningState.totalMines;
    autoMiningState.todayMined += warframeMiningState.totalMines;
    saveGameData();
    
    // 重置单次状态
    warframeMiningState.totalMines = 0;
    warframeMiningState.perfectMines = 0;
    
    // 切换按钮：显示扫描按钮，隐藏其他按钮
    const scanBtn = document.getElementById('scanVeinBtn');
    const mineBtn = document.getElementById('mineNodeBtn');
    const coolBtn = document.getElementById('cooldownBtn');
    const stopBtn = document.getElementById('stopMiningBtn');
    
    if (scanBtn) scanBtn.style.display = 'block';
    if (mineBtn) mineBtn.style.display = 'none';
    if (coolBtn) coolBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    
    // 重置显示区域
    const idleState = document.getElementById('veinIdleState');
    const veinNodes = document.getElementById('veinNodes');
    const veinInfo = document.getElementById('currentVeinInfo');
    const scannerBg = document.getElementById('miningScannerBg');
    const dropsContainer = document.getElementById('miningDrops');
    
    if (idleState) idleState.style.display = 'block';
    if (veinNodes) {
        veinNodes.style.display = 'none';
        veinNodes.classList.remove('vein-depleted');
    }
    if (veinInfo) veinInfo.style.display = 'none';
    if (scannerBg) scannerBg.style.opacity = '0';
    if (dropsContainer) dropsContainer.innerHTML = '';
    
    addMiningLog('🛑 采矿作业已终止', 'info');
    addMiningLog(`⚡ 当前负荷: ${stamina}点`, 'info');
    

            // 释放全局操作锁

            
            // 负荷耗尽时自动返回导航
            if (stamina < 10) {
                setTimeout(() => {
                    addMiningLog('💤 负荷不足，返回矿区导航...', 'warning');
                    backToMiningStarMap();
                }, 1500);
            }
        }

// 更新勘探统计面板
function updateMiningStats() {
    const todayEl = document.getElementById('todayMining');
    const perfectEl = document.getElementById('perfectMines');
    const totalEl = document.getElementById('totalOres');
    const heatEl = document.getElementById('veinHeatLevel');
    
    if (todayEl) todayEl.textContent = autoMiningState.todayMined + warframeMiningState.totalMines;
    if (perfectEl) perfectEl.textContent = warframeMiningState.perfectMines;
    if (totalEl) totalEl.textContent = autoMiningState.totalMined + warframeMiningState.totalMines;
    
    // 热度状态文字
    if (heatEl) {
        const heat = warframeMiningState.heat;
        let heatText = '正常';
        let heatColor = 'var(--infested-green)';
        if (heat > 80) {
            heatText = '危险';
            heatColor = 'var(--grineer-red)';
        } else if (heat > 50) {
            heatText = '偏高';
            heatColor = 'var(--tenno-gold)';
        }
        heatEl.textContent = heatText;
        heatEl.style.color = heatColor;
    }
}

					// 旧版自动勘探已废弃，现由 Warframe 风格勘探系统替代
// 保留函数签名以兼容旧代码调用
function miningComplete(mineral) {
    // 新系统使用 mineCurrentNode() 和 discoverVein() 处理掉落
    // 此函数不再执行旧掉落逻辑
}

					function stopAutoMining() {
						autoMiningState.active = false;
						if (autoMiningState.timer) {
							clearInterval(autoMiningState.timer);
							autoMiningState.timer = null;
						}
						document.getElementById('startMiningBtn').style.display = 'block';
						document.getElementById('stopMiningBtn').style.display = 'none';
						addMiningLog(`🛑 勘探已停止`, 'info');
						// 停止后返回矿区导航
						setTimeout(() => {
							backToMiningStarMap();
						}, 1000);
					}
					
											

					function addMiningLog(text, type) {
						const log = document.getElementById('miningLog');
						const div = document.createElement('div');

						let colorClass = '';
						switch (type) {
							case 'drop':
								colorClass = 'log-drop';
								break;
							case 'info':
								colorClass = 'log-damage-player';
								break;
							default:
								colorClass = '';
						}

						div.className = colorClass;
						div.innerHTML = text;
						div.style.marginBottom = '4px';

						log.appendChild(div);
						log.scrollTop = log.scrollHeight;
					}

function updateMiningUI() {
    if (!gameData) return;

    // 更新玩家头像和名称（兼容新旧勘探页面）
    const miningPlayerName = document.getElementById('miningPlayerName');
    const miningPlayerIcon = document.getElementById('miningPlayerIcon');
    
    if (miningPlayerName || miningPlayerIcon) {
        const wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
        if (miningPlayerName) miningPlayerName.textContent = wf.name;
        if (miningPlayerIcon) {
            miningPlayerIcon.innerHTML = wf.image ?
                `<img src="${wf.image}" style="width: 80px; height: 80px; object-fit: contain;">` :
                wf.icon;
        }
    }

    // 更新旧版统计（如果元素存在）
    const totalOresEl = document.getElementById('totalOres');
    if (totalOresEl) totalOresEl.textContent = autoMiningState.totalMined;
    
    const todayMiningEl = document.getElementById('todayMining');
    if (todayMiningEl) todayMiningEl.textContent = autoMiningState.todayMined;
    
    const totalMiningTimeEl = document.getElementById('totalMiningTime');
    if (totalMiningTimeEl) totalMiningTimeEl.textContent = autoMiningState.totalTime + 's';

    // 更新新版 Warframe 风格统计（如果元素存在）
    const perfectMinesEl = document.getElementById('perfectMines');
    if (perfectMinesEl) perfectMinesEl.textContent = warframeMiningState.perfectMines || 0;
    
    const veinHeatEl = document.getElementById('veinHeatLevel');
    if (veinHeatEl) {
        const heat = warframeMiningState.heat || 0;
        let heatText = '正常';
        let heatColor = 'var(--infested-green)';
        if (heat > 80) {
            heatText = '危险';
            heatColor = 'var(--grineer-red)';
        } else if (heat > 50) {
            heatText = '偏高';
            heatColor = 'var(--tenno-gold)';
        }
        veinHeatEl.textContent = heatText;
        veinHeatEl.style.color = heatColor;
    }
}

function addGatheringLog(text, type) {
    const log = document.getElementById('gatheringLog');
    const div = document.createElement('div');
    
    let colorClass = '';
    switch (type) {
        case 'player':
            colorClass = 'log-damage-player';
            break;
        case 'enemy':
            colorClass = 'log-damage-enemy';
            break;
        case 'drop':
            colorClass = 'log-drop';
            break;
        case 'rare':  // ← 新增：稀有掉落
            colorClass = 'log-rare';
            break;
        case 'death':
            colorClass = 'log-death';
            break;
        case 'win':
            colorClass = 'log-win';
            break;
        default:
            colorClass = '';
    }
    
    div.className = colorClass;
    div.textContent = text;
    div.style.marginBottom = '4px';
    
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
}
window.addGatheringLog = addGatheringLog;

// ═══════════════════════════════════════════════════════════════
//  互动式植物回收系统（Warframe风格）
// ═══════════════════════════════════════════════════════════════


const WEATHER_TYPES = [
    { type: 'sunny', name: '稳定', icon: '🔋', color: '#ffaa00', interference: 0, growthBonus: 1.2 },
    { type: 'cloudy', name: '波动', icon: '📡', color: '#888', interference: 10, growthBonus: 1.0 },
    { type: 'rainy', name: '干扰', icon: '⚡', color: '#4488ff', interference: 25, growthBonus: 1.5 },
    { type: 'storm', name: '过载', icon: '💥', color: '#ff4444', interference: 45, growthBonus: 0.7 },
    { type: 'foggy', name: '屏蔽', icon: '🛡️', color: '#aaa', interference: 35, growthBonus: 0.8 },
    { type: 'toxic', name: '腐蚀', icon: '☣️', color: '#4eff4e', interference: 60, growthBonus: 0.5 }
];

const GROWTH_STAGES = [
    { name: '锁定中', min: 0, max: 30, color: '#2a5a2a', mature: false },
    { name: '解码中', min: 30, max: 60, color: '#4eff4e', mature: false },
    { name: '可拆解', min: 60, max: 85, color: '#ffd700', mature: true },
    { name: '高产出', min: 85, max: 100, color: '#ffaa00', mature: true }
];

let interactiveGatherState = {
    active: false, scanning: false, gathering: false, repairing: false,
    durability: 100, maxDurability: 100, currentPlant: null,
    lastGatherTime: 0,  // 上次回收时间戳，防止重复触发
    plantGrowth: 0, plantMature: false, pointerPosition: 0,
    pointerDirection: 1, pointerSpeed: 1, currentWeather: null,
    perfectGathers: 0, totalGathers: 0,
    growthTimer: null, pointerTimer: null, weatherTimer: null
};

function getCurrentGatheringRegion() {
    // 优先从选中的回收区域获取
    if (selectedGatheringZone && selectedGatheringZone.id) {
        // 从区域ID提取星球key (如 eg_z1 -> earth_gather)
        const zoneId = selectedGatheringZone.id;
        if (zoneId.startsWith('eg_')) return 'earth_gather';
        if (zoneId.startsWith('vg_')) return 'venus_gather';
        if (zoneId.startsWith('dg_')) return 'deimos_gather';
        if (zoneId.startsWith('dug_')) return 'duviri_gather';
    }
    // 回退：从选中的回收星球获取
    if (selectedGatheringPlanet && selectedGatheringPlanet.id) {
        return selectedGatheringPlanet.id;
    }
    // 默认区域
    return 'earth_gather';
}

function startPlantScan() {
    if (interactiveGatherState.active) return;
    
   // 断网锁定
   if (window._offlineLock) {
       showToast('【星渊】链接中断，请恢复网络', 'error');
       return;
   }
    
    if (stamina < 8) { 
       
        showToast(`负荷不足！每次扫描需要8点负荷`, 'error'); 
        return; 
    }

        modifyStamina(-8);

    interactiveGatherState.active = true;
    interactiveGatherState.scanning = true;
    interactiveGatherState.gathering = false;
    interactiveGatherState.repairing = false;
    interactiveGatherState.plantGrowth = 0;
    interactiveGatherState.plantMature = false;
    interactiveGatherState.perfectGathers = 0;
    interactiveGatherState.totalGathers = 0;
	interactiveGatherState.durability = 100;
	interactiveGatherState.maxDurability = 100;

    document.getElementById('scanPlantBtn').style.display = 'none';
    document.getElementById('gatherPlantBtn').style.display = 'none';
    document.getElementById('repairGathererBtn').style.display = 'none';
    document.getElementById('stopGatheringBtn').style.display = 'block';

    document.getElementById('plantIdleState').style.display = 'none';
    document.getElementById('plantScanArea').style.display = 'block';
    document.getElementById('currentPlantInfo').style.display = 'block';
    document.getElementById('gatheringScannerBg').style.opacity = '1';
    document.getElementById('gatheringDrops').innerHTML = '';

    const log = document.getElementById('gatheringLog');
    log.innerHTML = '';
       addGatheringLog('🔍 部署诺萨姆回收器...', 'info');
       addGatheringLog('📡 扫描附近容器信号...', 'info');

    changeWeather();
    setTimeout(() => discoverPlant(), 1500);
}

// 发现植物
function discoverPlant() {
    const currentRegion = getCurrentGatheringRegion();
	
	
    // 使用 items.js 中的 GATHERING_DROP_CONFIG 配置
    let regionConfig = (typeof GATHERING_DROP_CONFIG !== 'undefined') ? GATHERING_DROP_CONFIG[currentRegion] : null;
	
	

    // 如果找不到配置，尝试回退到默认配置
    if (!regionConfig) {
        addGatheringLog('⚠️ 区域 ' + currentRegion + ' 无配置，使用默认配置', 'warning');
        regionConfig = GATHERING_DROP_CONFIG['earth_gather'];
    }
    const gatherables = regionConfig ? regionConfig.gatherables : [];

    if (gatherables.length === 0) {
        addGatheringLog('❌ 当前区域无可用回收物', 'death');
        return;
    }

    // 按掉率权重随机选择回收物
    const totalWeight = gatherables.reduce((sum, g) => sum + g.dropRate, 0);
    let random = Math.random() * totalWeight;
    let selectedGatherable = gatherables[0];
    for (const g of gatherables) {
        random -= g.dropRate;
        if (random <= 0) { selectedGatherable = g; break; }
    }

    // 转换为兼容旧格式的植物数据
    const plant = {
        id: selectedGatherable.id,
        name: selectedGatherable.name,
        icon: selectedGatherable.icon,
		image: selectedGatherable.image,
        color: selectedGatherable.color,
        rarity: selectedGatherable.rarity,
        dropRate: selectedGatherable.dropRate,
        _gatherable: selectedGatherable,  // 保存原始回收物数据供掉落使用
        stages: ['🌱', selectedGatherable.icon, selectedGatherable.icon]  // 添加 stages 属性
    };

    interactiveGatherState.currentPlant = plant;
    interactiveGatherState.scanning = false;
    interactiveGatherState.gathering = true;

    const plantInfoIcon = document.getElementById('plantInfoIcon');
    if (plantInfoIcon) {
        if (plant.image) {
            // 使用图片
            plantInfoIcon.innerHTML = `<img src="${plant.image}" style="width: 24px; height: 24px; object-fit: contain; vertical-align: middle; filter: drop-shadow(0 0 5px ${plant.color});">`;
        } else {
            // 后备emoji
            plantInfoIcon.textContent = plant.icon;
        }
        plantInfoIcon.style.color = plant.color;
    }
    document.getElementById('plantInfoName').textContent = plant.name;
    document.getElementById('plantInfoName').style.color = plant.color;

    const rarityNames = { common: '普通', uncommon: '稀有', rare: '史诗', legendary: '传说' };
    const rarityColors = { common: '#888', uncommon: '#00d4ff', rare: '#ff66ff', legendary: '#ffd700' };
    const plantInfoRarity = document.getElementById('plantInfoRarity');
    plantInfoRarity.textContent = '稀有度: ' + rarityNames[plant.rarity];
    plantInfoRarity.style.color = rarityColors[plant.rarity];

    const valueText = { common: '低', uncommon: '中', rare: '高', legendary: '极高' };
    document.getElementById('plantInfoValue').textContent = '价值: ' + valueText[plant.rarity];

    const plantTarget = document.getElementById('plantTarget');
	// 设置 plantTarget 在 maturityWindow 中心
	plantTarget.style.position = 'absolute';
	plantTarget.style.bottom = '20px'; // 与 maturityWindow 对齐
	plantTarget.style.left = '50%';
	plantTarget.style.transform = 'translate(-50%)'; // 完全居中
	plantTarget.style.zIndex = '10';
	plantTarget.style.zIndex = '10'; // 确保在圆圈上方
    // 优先显示图片
    if (plant.image) {
        plantTarget.innerHTML = `<img src="${plant.image}" style="width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 0 10px ${plant.color}40); transition: all 0.3s ease;" onerror="this.parentNode.textContent='${plant.stages[0]}'">`;
    } else {
        plantTarget.textContent = plant.stages[0];
    }
    plantTarget.style.filter = `drop-shadow(0 0 10px ${plant.color}40)`;

        addGatheringLog(`📦 定位到容器 ${plant.icon} ${plant.name}！`, 'drop');
        addGatheringLog(`📊 稀有度: ${rarityNames[plant.rarity]} | 环境状态: ${interactiveGatherState.currentWeather.name}`, 'info');
        addGatheringLog(`🎯 等待容器解码完成... 在峰值时执行拆解！`, 'info');

    document.getElementById('gatherPlantBtn').style.display = 'block';
    startPlantGrowth();
    startTimingPointer();
    startWeatherCycle();
	
	
}

// 植物生长
function startPlantGrowth() {
    const plant = interactiveGatherState.currentPlant;
    if (!plant) return;
    if (interactiveGatherState.growthTimer) clearInterval(interactiveGatherState.growthTimer);

    interactiveGatherState.growthTimer = setInterval(() => {
        if (!interactiveGatherState.gathering || interactiveGatherState.repairing) return;

        const weather = interactiveGatherState.currentWeather;
        const growthSpeed = 2 * (weather ? weather.growthBonus : 1.0);
        interactiveGatherState.plantGrowth = Math.min(100, interactiveGatherState.plantGrowth + growthSpeed);

        updateGrowthStage();

        const progressBar = document.getElementById('growthProgressBar');
                const stageText = document.getElementById('growthStageText');
                if (progressBar) progressBar.style.width = interactiveGatherState.plantGrowth + '%';

const plantTarget = document.getElementById('plantTarget');
if (plantTarget && plant) {
    const stageIndex = interactiveGatherState.plantGrowth < 33 ? 0 : 
                      (interactiveGatherState.plantGrowth < 66 ? 1 : 2);
    
        // 容器图标：锁定→解码→可拆解
        const containerIcons = ['🔒', '🔓', '⚙️'];
        const stageIcon = containerIcons[stageIndex] || '⚙️';
        if (plant.image) {
            plantTarget.innerHTML = `<img src="${plant.image}" style="width: 64px; height: 64px; object-fit: contain; filter: drop-shadow(0 0 10px ${plant.color}40); transition: all 0.3s ease;" onerror="this.parentNode.textContent='${stageIcon}'">`;
        } else {
            plantTarget.textContent = stageIcon;
        }
}



        

                if (interactiveGatherState.plantGrowth >= 100) {
                    clearInterval(interactiveGatherState.growthTimer);
                    addGatheringLog(`💀 ${plant.name} 容器自锁，无法拆解...`, 'death');
                        setTimeout(() => {
                            if (interactiveGatherState.active) {
                                addGatheringLog('🔍 继续定位新容器...', 'info');
                                interactiveGatherState.plantGrowth = 0;
                                interactiveGatherState.plantMature = false;
                                const pt = document.getElementById('plantTarget');
                                if (pt) pt.classList.remove('mature');
                                discoverPlant();
                            }
                        }, 2000);
        }
    }, 200);
}

function updateGrowthStage() {
    const growth = interactiveGatherState.plantGrowth;
    const stageText = document.getElementById('growthStageText');
    for (const stage of GROWTH_STAGES) {
        if (growth >= stage.min && growth < stage.max) {
            if (stageText) { stageText.textContent = stage.name; stageText.style.color = stage.color; }
            break;
        }
    }
}

// 时机指针
function startTimingPointer() {
    if (interactiveGatherState.pointerTimer) clearInterval(interactiveGatherState.pointerTimer);
    interactiveGatherState.pointerPosition = 0;
    interactiveGatherState.pointerDirection = 1;
    interactiveGatherState.pointerSpeed = 0.8 + Math.random() * 1.5;

    const pointer = document.getElementById('timingPointer');
    if (!pointer) return;

    interactiveGatherState.pointerTimer = setInterval(() => {
        if (!interactiveGatherState.gathering || interactiveGatherState.repairing) return;

        const weather = interactiveGatherState.currentWeather;
        const interference = weather ? weather.interference : 0;
        const speedMod = 1 + (interference / 100);

        interactiveGatherState.pointerPosition += interactiveGatherState.pointerSpeed * interactiveGatherState.pointerDirection * speedMod;

        if (interactiveGatherState.pointerPosition >= 100) {
            interactiveGatherState.pointerPosition = 100;
            interactiveGatherState.pointerDirection = -1;
        } else if (interactiveGatherState.pointerPosition <= 0) {
            interactiveGatherState.pointerPosition = 0;
            interactiveGatherState.pointerDirection = 1;
        }

        if (Math.random() < 0.03) {
            interactiveGatherState.pointerSpeed = 0.5 + Math.random() * 2;
        }
        pointer.style.left = interactiveGatherState.pointerPosition + '%';
    }, 50);
}

// 天气系统
function changeWeather() {
    const weather = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
    interactiveGatherState.currentWeather = weather;

    document.getElementById('weatherIcon').textContent = weather.icon;
    const weatherName = document.getElementById('weatherName');
    weatherName.textContent = weather.name;
    weatherName.style.color = weather.color;

    const weatherOverlay = document.getElementById('weatherOverlay');
    weatherOverlay.className = '';
    weatherOverlay.style.opacity = weather.interference / 100;
    if (weather.type === 'rainy') weatherOverlay.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(68,136,255,0.1) 2px, rgba(68,136,255,0.1) 4px)';
    else if (weather.type === 'storm') weatherOverlay.style.background = 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,68,68,0.05) 10px, rgba(255,68,68,0.05) 20px)';
    else if (weather.type === 'foggy') weatherOverlay.style.background = 'radial-gradient(ellipse at center, rgba(170,170,170,0.3) 0%, transparent 70%)';
    else if (weather.type === 'toxic') weatherOverlay.style.background = 'radial-gradient(ellipse at center, rgba(78,255,78,0.15) 0%, transparent 70%)';
    else weatherOverlay.style.background = 'none';

    const envBar = document.getElementById('environmentBar');
    const envText = document.getElementById('environmentText');
    if (envBar) {
        const envPercent = Math.max(0, 100 - weather.interference);
        envBar.style.width = envPercent + '%';
        envBar.style.background = envPercent > 70 ? 'linear-gradient(90deg, var(--infested-green), #88ff88)' :
                                  envPercent > 40 ? 'linear-gradient(90deg, var(--tenno-gold), #ffaa00)' :
                                  'linear-gradient(90deg, var(--grineer-red), #ff4444)';
    }
    if (envText) {
        envText.textContent = weather.interference < 20 ? '适宜' : weather.interference < 40 ? '一般' : weather.interference < 60 ? '恶劣' : '危险';
        envText.style.color = weather.interference < 20 ? 'var(--infested-green)' : weather.interference < 40 ? 'var(--tenno-gold)' : 'var(--grineer-red)';
    }
}

function startWeatherCycle() {
    if (interactiveGatherState.weatherTimer) clearInterval(interactiveGatherState.weatherTimer);
    interactiveGatherState.weatherTimer = setInterval(() => {
        if (!interactiveGatherState.gathering) return;
        if (Math.random() < 0.15) {
            changeWeather();
            addGatheringLog(`🌡️ 环境状态: ${interactiveGatherState.currentWeather.icon} ${interactiveGatherState.currentWeather.name}`, 'info');
        }
    }, 3000);
}

// 回收植物
function gatherCurrentPlant() {
    if (!interactiveGatherState.gathering || interactiveGatherState.repairing) return;

    // 冷却检查：1秒内不能重复触发
    const now = Date.now();
    if (now - interactiveGatherState.lastGatherTime < 1000) {
        return; // 冷却中，忽略此次点击
    }
    interactiveGatherState.lastGatherTime = now;

    const plant = interactiveGatherState.currentPlant;
    const pointerPos = interactiveGatherState.pointerPosition;
    const growth = interactiveGatherState.plantGrowth;
    const weather = interactiveGatherState.currentWeather;

    // 检查指针是否在植物位置附近（植物在 left: 50%）
    const plantPosition = 50;
    const pointerDistance = Math.abs(pointerPos - plantPosition);

    // 如果指针不在植物附近，回收失败
        if (pointerDistance > 15) {
            addGatheringLog('❌ 拆解失败！回收器未对准容器', 'death');
            showToast('❌ 请在回收器对准容器时拆解', 'error');

                // 容器受损
                interactiveGatherState.plantHealth -= 25;
                if (interactiveGatherState.plantHealth <= 0) {
                    addGatheringLog('💀 容器因误拆解而自锁...', 'death');
                    showToast('容器已自锁', 'error');
                        setTimeout(() => {
                            if (interactiveGatherState.gathering && !interactiveGatherState.repairing) {
                                interactiveGatherState.plantGrowth = 0;
                                interactiveGatherState.plantMature = false;
                                const pt = document.getElementById('plantTarget');
                                if (pt) pt.classList.remove('mature');
                                addGatheringLog('🔍 继续定位新容器...', 'info');
                                discoverPlant();
                            }
                        }, 1200);
        }
        return;
    }

    // 指针在植物附近，根据距离计算品质
    const interference = weather ? weather.interference : 0;
    const effectiveDistance = pointerDistance * (1 + interference / 200);

    let quality, qualityClass, qualityText, qualityDesc, amountMult;

        if (growth < 50) {
            quality = 'immature'; qualityClass = ''; qualityText = '❌ 拆解过早';
            qualityDesc = '容器尚未解码，产出极低'; amountMult = 0.5;
            addGatheringLog(`⚠️ 拆解过早！${plant.name} 容器尚未解码 (${Math.floor(growth)}%)`, 'warning');
    } else     if (effectiveDistance <= 3) {
        quality = 'perfect'; qualityClass = 'gather-quality-perfect'; qualityText = '⭐ 完美拆解！';
        qualityDesc = '精准破解容器，获得最高产出'; amountMult = 2.0;
        interactiveGatherState.perfectGathers++;
    } else if (effectiveDistance <= 8) {
        quality = 'good'; qualityClass = 'gather-quality-good'; qualityText = '✨ 良好拆解';
        qualityDesc = '破解成功，获得标准产出'; amountMult = 1.3;
    } else if (effectiveDistance <= 15) {
        quality = 'normal'; qualityClass = 'gather-quality-normal'; qualityText = '✓ 普通拆解';
        qualityDesc = '破解一般，获得基础产出'; amountMult = 1.0;
    } else {
        quality = 'poor'; qualityClass = ''; qualityText = '✗ 拆解不佳';
        qualityDesc = '对准偏差，产出受损'; amountMult = 0.7;
    }

    interactiveGatherState.totalGathers++;

    // 在植物显示区显示品质提示（浮动文字）
    const plantContainer = document.getElementById('plantContainer');
    if (plantContainer) {
        const floatEl = document.createElement('div');
        floatEl.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-family: "Orbitron"; font-size: 1.4rem; font-weight: 700; color: ' + (quality === 'perfect' ? 'var(--infested-green)' : quality === 'good' ? 'var(--tenno-gold)' : quality === 'normal' ? 'var(--orokin-cyan)' : 'var(--grineer-red)') + '; text-shadow: 0 0 15px currentColor; pointer-events: none; z-index: 100; animation: fadeIn 0.3s ease;';
        floatEl.textContent = qualityText;
        plantContainer.appendChild(floatEl);

        setTimeout(() => {
            if (floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
        }, 1500);
    }

    // ═══════════════════════════════════════════════════════════════
    //  使用 items.js 配置的掉落逻辑（类似勘探系统）
    // ═══════════════════════════════════════════════════════════════
    const gatherable = plant._gatherable;
    let finalAmount = 0;
    let dropItems = [];

    if (gatherable && gatherable.drops) {
        // 根据回收品质计算数量
        const qualityMult = { perfect: 2.0, good: 1.5, normal: 1.0, poor: 0.7, immature: 0.5 }[quality] || 1.0;
        const amount = Math.floor(
            (gatherable.minAmount + Math.random() * (gatherable.maxAmount - gatherable.minAmount + 1)) 
            * qualityMult
        );
        finalAmount = Math.max(1, amount);

        // 生成掉落物品（从 items.js 配置读取）
        gatherable.drops.forEach(drop => {
            const dropAmount = Math.max(1, Math.floor(finalAmount * (drop.amount || 1)));
            dropItems.push({
                name: drop.name,
                icon: drop.icon,
                image: drop.image,
                amount: dropAmount,
                type: drop.type || 'material'
            });
            addToWarehouse(drop.name, drop.icon, dropAmount, drop.type || 'material', drop.image);
        });
    } else {
        // 回退到旧逻辑
        const baseAmount = Math.floor(Math.random() * 2 + 1);
        const rarityMult = { common: 1, uncommon: 1.2, rare: 1.5, legendary: 2 }[plant.rarity] || 1;
        finalAmount = Math.max(1, Math.floor(baseAmount * amountMult * rarityMult));
        addToWarehouse(plant.name, plant.icon, finalAmount, 'plant', plant.image);
    }

    // ═══════════════════════════════════════════════════════════════
    //  采集回响掉落逻辑
    //  使用 gatherable.cardId 查找并掉落对应回响
    // ═══════════════════════════════════════════════════════════════
    if (gatherable && gatherable.cardId) {
        const cardDrop = tryDropGatheringCard(gatherable, quality, weather ? weather.type : 'sunny');
        if (cardDrop) {
            const result = addPlayerCard(cardDrop);
            if (result.isNew) {
                addGatheringLog(`🎴 新回响: ${cardDrop.name}！`, 'drop');
                setTimeout(function() {
                    showCardAcquireModal(cardDrop, gatherable.name);
                }, 800);
            } else if (result.converted) {
                const shard = result.converted;
                addShardConvertLog(cardDrop, shard, gatherable.name);
				addGatheringLog(`🎴 获得: ${cardDrop.name}！`, 'drop');
            }
        }
    }
	

    // ═══════════════════════════════════════════════════════════════
    //  【新增】全局伴生稀有掉落检测
    //  不绑定区域，任何回收都可能触发
    // ═══════════════════════════════════════════════════════════════
    if (typeof checkGlobalGatheringDrops === 'function') {
        checkGlobalGatheringDrops(quality, weather ? weather.type : 'sunny');
    }

    // 显示掉落物品到 gatheringDrops 容器
    const dropsContainer = document.getElementById('gatheringDrops');
    if (dropsContainer) {
        const displayItems = dropItems.length > 0 ? dropItems.slice(0, 3) : [];

        if (displayItems.length > 0) {
            displayItems.forEach(drop => {
                const dropEl = document.createElement('div');
                dropEl.className = 'gathering-drop-item';
                const qLabel = quality === 'perfect' ? '完美' : quality === 'good' ? '良好' : quality === 'normal' ? '普通' : '受损';
                const qColor = quality === 'perfect' ? 'var(--infested-green)' : quality === 'good' ? 'var(--tenno-gold)' : '#888';
                
                const iconHtml = drop.image 
                    ? `<img src="${drop.image}" style="width: 22px; height: 22px; object-fit: contain; vertical-align: middle; margin-right: 4px; filter: drop-shadow(0 0 3px ${drop.imageGlow || 'transparent'});">`
                    : `<span style="font-size: 1.1rem; margin-right: 4px;">${drop.icon}</span>`;
                
                dropEl.innerHTML = `${iconHtml}<span style="vertical-align: middle;">${drop.name} x${drop.amount}</span> <span style="color: ${qColor}; font-size: 0.75rem; vertical-align: middle;">(${qLabel})</span>`;
                dropEl.style.animation = 'dropPop 0.5s ease';
                dropsContainer.appendChild(dropEl);
            });
        } else {
            const dropEl = document.createElement('div');
            dropEl.className = 'gathering-drop-item';
            const qLabel = quality === 'perfect' ? '完美' : quality === 'good' ? '良好' : quality === 'normal' ? '普通' : '受损';
            const qColor = quality === 'perfect' ? 'var(--infested-green)' : quality === 'good' ? 'var(--tenno-gold)' : '#888';
            
            const iconHtml = plant.image 
                ? `<img src="${plant.image}" style="width: 22px; height: 22px; object-fit: contain; vertical-align: middle; margin-right: 4px;">`
                : `<span style="font-size: 1.1rem; margin-right: 4px;">${plant.icon}</span>`;
            
            dropEl.innerHTML = `${iconHtml}<span style="vertical-align: middle;">${plant.name} x${finalAmount}</span> <span style="color: ${qColor}; font-size: 0.75rem; vertical-align: middle;">(${qLabel})</span>`;
            dropEl.style.animation = 'dropPop 0.5s ease';
            dropsContainer.appendChild(dropEl);
        }

        // 保持最多3个，如果超过则移除旧的
        while (dropsContainer.children.length > 3) {
            dropsContainer.removeChild(dropsContainer.firstChild);
        }
    }

    

        const qualityLabel = quality === 'perfect' ? '完美' : quality === 'good' ? '良好' : quality === 'normal' ? '普通' : '失败';
        
        if (dropItems.length > 0) {
            dropItems.forEach(drop => {
                addGatheringLog(`🔧 ${qualityLabel}拆解容器！获得 ${drop.icon || '📦'} ${drop.name} x${drop.amount}`, quality === 'perfect' ? 'drop' : 'info');
            });
        } else {
            addGatheringLog(`🔧 ${qualityLabel}拆解容器！获得 ${plant.icon || '📦'} ${plant.name} x${finalAmount}`, quality === 'perfect' ? 'drop' : 'info');
        }

    interactiveGatherState.durability = Math.max(0, interactiveGatherState.durability - (10 + Math.floor(Math.random() * 11))); // 随机扣除10-20点耐久
    updateDurabilityDisplay();

    autoGatheringState.totalGathered += finalAmount;
    autoGatheringState.todayGathered += finalAmount;
    updateGatherStats();

    if (interactiveGatherState.durability <= 0) {
        gathererBroken();
        return;
    }

    setTimeout(() => {
        if (interactiveGatherState.gathering && !interactiveGatherState.repairing) {
            interactiveGatherState.plantGrowth = 0;
            interactiveGatherState.plantMature = false;
            const pt = document.getElementById('plantTarget');
            if (pt) pt.classList.remove('mature');
            addGatheringLog('🔍 继续扫描新植物...', 'info');
            discoverPlant();
        }
    }, 1200);
}


// ═══════════════════════════════════════════════════════════════
//  全局伴生稀有掉落检测函数
//  不绑定区域，任何回收都可能触发
// ═══════════════════════════════════════════════════════════════
function checkGlobalGatheringDrops(quality, weatherType) {
    // 确保配置存在
    if (typeof GLOBAL_GATHERING_DROPS === 'undefined' || !GLOBAL_GATHERING_DROPS || GLOBAL_GATHERING_DROPS.length === 0) {
        return;
    }
    
    for (var i = 0; i < GLOBAL_GATHERING_DROPS.length; i++) {
        var drop = GLOBAL_GATHERING_DROPS[i];
        
        // 计算实际掉率
        var qMult = (drop.qualityMult && drop.qualityMult[quality]) || 1.0;
        var wMult = (drop.weatherMult && drop.weatherMult[weatherType]) || 1.0;
        var chance = drop.baseChance * qMult * wMult;
        
        // Roll点判定
        if (Math.random() < chance) {
            // 计算数量
            var amount = Math.floor(Math.random() * (drop.maxAmount - drop.minAmount + 1)) + drop.minAmount;
            
            // 添加到矩阵
            addToWarehouse(drop.name, drop.icon, amount, 'material', drop.image);
            
            // 显示稀有掉落提示
            showRareDropNotification(drop, amount);
            
            // 尝试掉落对应回响
            if (drop.cardId) {
                var card = findCardById(drop.cardId);
                if (card) {
                    var cardChance = 0.15 * qMult;  // 回响掉率15%，受品质影响
                    if (Math.random() < cardChance) {
                        var result = addPlayerCard(card);
                        if (result.isNew) {
                            addGatheringLog('🎴 稀有伴生回响: ' + card.name + '！', 'drop');
                            setTimeout(function() {
                                showCardAcquireModal(card, drop.name);
                            }, 800);
                        } else if (result.converted) {
                            var shard = result.converted;
                            addShardConvertLog(card, shard, drop.name);
                        }
                    }
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
//  稀有伴生掉落特殊提示
// ═══════════════════════════════════════════════════════════════
function showRareDropNotification(drop, amount) {
    // 在日志中显示特殊格式的稀有掉落
        addGatheringLog(
            '💎 【隐藏容器】从加密容器中获得 ' + drop.icon + ' ' + drop.name + ' x' + amount + '！', 
            'rare'
        );
    
    // 显示浮动提示
        if (typeof showToast === 'function') {
            showToast('💎 发现隐藏容器：' + drop.name + ' x' + amount, 'success');
        }
    
    // 如果有全局通知函数，也可以调用
    if (typeof showFloatingText === 'function') {
        showFloatingText('+' + amount + ' ' + drop.name, 50, 40, drop.color);
    }
}

// 回收器损坏
function gathererBroken() {
    interactiveGatherState.repairing = true;
    if (interactiveGatherState.growthTimer) clearInterval(interactiveGatherState.growthTimer);
    if (interactiveGatherState.pointerTimer) clearInterval(interactiveGatherState.pointerTimer);

    document.getElementById('gatherPlantBtn').style.display = 'none';
    document.getElementById('repairGathererBtn').style.display = 'block';

       addGatheringLog('💔 诺萨姆回收器过载！需要修复...', 'death');
       showToast('回收器过载！点击修复', 'warning');
}

// 修复回收器
function repairGatherer() {
    if (!interactiveGatherState.repairing) return;
        addGatheringLog('🔧 开始修复回收器...', 'info');

    let repairProgress = 0;
    const repairInterval = setInterval(() => {
        repairProgress += 8;
        interactiveGatherState.durability = Math.min(interactiveGatherState.maxDurability, repairProgress);
        updateDurabilityDisplay();

        if (repairProgress >= interactiveGatherState.maxDurability) {
            clearInterval(repairInterval);

            // 完全重置状态 - 和 stopInteractiveGathering 一样
            interactiveGatherState.active = false;
            interactiveGatherState.gathering = false;
            interactiveGatherState.scanning = false;
            interactiveGatherState.repairing = false;

            if (interactiveGatherState.growthTimer) clearInterval(interactiveGatherState.growthTimer);
            if (interactiveGatherState.pointerTimer) clearInterval(interactiveGatherState.pointerTimer);
            if (interactiveGatherState.weatherTimer) clearInterval(interactiveGatherState.weatherTimer);

            saveGameData();
            interactiveGatherState.totalGathers = 0;
            interactiveGatherState.perfectGathers = 0;
            interactiveGatherState.durability = 100;
            interactiveGatherState.maxDurability = 100;
            interactiveGatherState.lastGatherTime = 0; // 重置回收冷却

            // 显示扫描按钮，隐藏其他按钮
            var scanBtn = document.getElementById('scanPlantBtn');
            var gatherBtn = document.getElementById('gatherPlantBtn');
            var repairBtn = document.getElementById('repairGathererBtn');
            var stopBtn = document.getElementById('stopGatheringBtn');

            if (scanBtn) scanBtn.style.display = 'block';
            if (gatherBtn) gatherBtn.style.display = 'none';
            if (repairBtn) repairBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'none';

            var idleState = document.getElementById('plantIdleState');
            var scanArea = document.getElementById('plantScanArea');
            var plantInfo = document.getElementById('currentPlantInfo');
            var scannerBg = document.getElementById('gatheringScannerBg');
            var dropsContainer = document.getElementById('gatheringDrops');

            if (idleState) idleState.style.display = 'block';
            if (scanArea) scanArea.style.display = 'none';
            if (plantInfo) plantInfo.style.display = 'none';
            if (scannerBg) scannerBg.style.opacity = '0';
            if (dropsContainer) dropsContainer.innerHTML = '';

                        addGatheringLog('✅ 诺萨姆回收器冷却完成！请重新定位容器', 'success');
                        addGatheringLog(`⚡ 当前负荷: ${stamina}点`, 'info');
        }
    }, 100);
}
function updateDurabilityDisplay() {
    const durBar = document.getElementById('gathererDurabilityBar');
    const durText = document.getElementById('gathererDurabilityText');
    if (!durBar || !durText) return;

    const percent = (interactiveGatherState.durability / interactiveGatherState.maxDurability) * 100;
    durBar.style.width = percent + '%';
    durText.textContent = Math.floor(percent) + '%';

    if (percent > 60) {
        durBar.style.background = 'linear-gradient(90deg, var(--infested-green), #88ff88)';
        durText.style.color = 'var(--infested-green)';
    } else if (percent > 30) {
        durBar.style.background = 'linear-gradient(90deg, var(--tenno-gold), #ffaa00)';
        durText.style.color = 'var(--tenno-gold)';
    } else {
        durBar.style.background = 'linear-gradient(90deg, var(--grineer-red), #ff4444)';
        durText.style.color = 'var(--grineer-red)';
    }
}

function updateGatherStats() {
    const todayEl = document.getElementById('todayGathering');
    const perfectEl = document.getElementById('perfectGathers');
    const totalEl = document.getElementById('totalPlants');
    const envEl = document.getElementById('environmentStatus');

    if (todayEl) todayEl.textContent = autoGatheringState.todayGathered;
    if (perfectEl) perfectEl.textContent = interactiveGatherState.perfectGathers;
    if (totalEl) totalEl.textContent = autoGatheringState.totalGathered;
    if (envEl && interactiveGatherState.currentWeather) {
        envEl.textContent = interactiveGatherState.currentWeather.name;
        envEl.style.color = interactiveGatherState.currentWeather.color;
    }
}

function stopInteractiveGathering() {
    interactiveGatherState.active = false;
    interactiveGatherState.gathering = false;
    interactiveGatherState.scanning = false;
    interactiveGatherState.repairing = false;

    if (interactiveGatherState.growthTimer) clearInterval(interactiveGatherState.growthTimer);
    if (interactiveGatherState.pointerTimer) clearInterval(interactiveGatherState.pointerTimer);
    if (interactiveGatherState.weatherTimer) clearInterval(interactiveGatherState.weatherTimer);

    saveGameData();
    interactiveGatherState.totalGathers = 0;
    interactiveGatherState.perfectGathers = 0;
    interactiveGatherState.durability = 100;
    interactiveGatherState.maxDurability = 100;
    interactiveGatherState.lastGatherTime = 0; // 重置回收冷却

    // ========== 修复：添加 null 检查 ==========
    var scanBtn = document.getElementById('scanPlantBtn');
    var gatherBtn = document.getElementById('gatherPlantBtn');
    var repairBtn = document.getElementById('repairGathererBtn');
    var stopBtn = document.getElementById('stopGatheringBtn');
    var backBtn = document.getElementById('backToGatheringNavBtn');
    
    if (scanBtn) scanBtn.style.display = 'block';
    if (gatherBtn) gatherBtn.style.display = 'none';
    if (repairBtn) repairBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    if (backBtn) backBtn.style.display = 'block';

    var idleState = document.getElementById('plantIdleState');
    var scanArea = document.getElementById('plantScanArea');
    var plantInfo = document.getElementById('currentPlantInfo');
    var scannerBg = document.getElementById('gatheringScannerBg');
    var dropsContainer = document.getElementById('gatheringDrops');
    
    if (idleState) idleState.style.display = 'block';
    if (scanArea) scanArea.style.display = 'none';
    if (plantInfo) plantInfo.style.display = 'none';
    if (scannerBg) scannerBg.style.opacity = '0';
    if (dropsContainer) dropsContainer.innerHTML = '';
    // ==========================================

           addGatheringLog('🛑 拆解作业已终止', 'info');
           addGatheringLog(`⚡ 当前负荷: ${stamina}点`, 'info');
        
        
    }

// 更新回收UI
function updateGatheringUI() {
    if (!gameData) return;
    const wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;

    const gatheringPlayerName = document.getElementById('gatheringPlayerName');
    const gatheringPlayerIcon = document.getElementById('gatheringPlayerIcon');

    if (gatheringPlayerName) gatheringPlayerName.textContent = wf.name;
    if (gatheringPlayerIcon) {
        gatheringPlayerIcon.innerHTML = wf.image ?
            `<img src="${wf.image}" style="width: 80px; height: 80px; object-fit: contain; border-radius: 50%;">` :
            wf.icon;
    }
    updateGatherStats();
    updateDurabilityDisplay();
}

// 兼容旧版函数
function startAutoGathering() { startPlantScan(); }
function stopAutoGathering() { stopInteractiveGathering(); }

					// ═══════════════════════════════════════════════════════════════
					//  负荷恢复系统
					// ═══════════════════════════════════════════════════════════════
					function startStaminaRegen() {
					    if (staminaRegenTimer) clearInterval(staminaRegenTimer);
					    staminaRegenTimer = setInterval(() => {
					        if (stamina < STAMINA_NATURAL_MAX) {
					            modifyStamina(1, true); // skipSave=true，避免频繁保存
					        }
					    }, STAMINA_REGEN_INTERVAL);
					}

					// ═══════════════════════════════════════════════════════════════
					//  UI 更新
					// ═══════════════════════════════════════════════════════════════
					function updateUI() {
					    if (!gameData || !currentUser) return;
					    
					    // 顶部栏：用户名
					    document.getElementById('displayName').textContent = currentUser.username;
					    
					    // 顶部栏：头像
					    const wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
					    document.getElementById('playerAvatar').innerHTML = wf.image ?
					        `<img src="${wf.image}" style="width: 46px; height: 46px; object-fit: contain; border-radius: 50%;">` :
					        wf.icon;
					
					    // 💰💎🔮 积分格式化显示
					    document.getElementById('resRout').textContent = formatPoints(currentUser.rout_points || 0);
					    document.getElementById('resPrime').textContent = formatPoints(currentUser.prime_points || 0);
					    document.getElementById('resVip').textContent = formatPoints(currentUser.vip_points || 0);
					    
    // 同步更新肃清页面负荷显示
					    const allStaminaValues = document.querySelectorAll('[id="battleStaminaValue"]');
					    allStaminaValues.forEach(function(el) {
					        if (isUnlimitedStaminaActive()) {
					            el.textContent = '∞/' + STAMINA_MAX;
					        } else {
					            el.textContent = stamina + '/100';
					        }
					    });
						
						    // 更新无限负荷倒计时
						    if (unlimitedStaminaBuff.active) {
						        updateUnlimitedStaminaUI();
						    }
						
						
    updateUpgradeBadge();

    // 检查回响奖励
    setTimeout(function() {
        checkAndTriggerCodexReward();
    }, 1000);
}

// ═══════════════════════════════════════════════════════════════
//  可升星徽章更新：计算所有可升星的回响数量
// ═══════════════════════════════════════════════════════════════
function updateUpgradeBadge() {
    if (!gameData || !playerCards) return;

    var upgradeableCount = 0;

    // 遍历所有已收集的回响
    for (var cardId in playerCards) {
        if (cardId === '_shards') continue;

        var cardInfo = playerCards[cardId];
        if (!cardInfo || !cardInfo.data) continue;

        var cardData = cardInfo.data;
        var currentStar = cardInfo.starLevel || 1;

        // 跳过已满星的
        if (currentStar >= 5) continue;

        // 检查是否满足升星条件
        var cardType = cardData.cardType || CARD_TYPE_MAP[cardData.rarity] || 'normal';
        var req = getUpgradeRequirement(cardType, currentStar);

        if (req && cardInfo.count >= req) {
            upgradeableCount++;
        }
    }

    // 更新徽章显示
    var badge = document.getElementById('gatheringBadge');
    if (badge) {
        if (upgradeableCount > 0) {
            badge.textContent = upgradeableCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

						



// 音乐播放器数据 - 4个歌单
var MUSIC_PLAYLISTS = [
    {
        id: 'isleweaver',
        name: '织屿人 OST',
        desc: 'Isleweaver 官方原声带',
        icon: '🕸️',
        cover: 'GAME/music/1.jpg',
        tracks: [
            { title: "Dust’s Dominion", artist: '织屿人 OST', src: 'GAME/music/织屿人/Dust’s Dominion.mp3', duration: '3:42' },
            //{ title: 'Silk and Steel', artist: '织屿人 OST', src: 'GAME/music/isleweaver/02.mp3', duration: '4:15' },
            //{ title: 'Web of Lies', artist: '织屿人 OST', src: 'GAME/music/isleweaver/03.mp3', duration: '3:28' },
            //{ title: "Arachne's Dance", artist: '织屿人 OST', src: 'GAME/music/isleweaver/04.mp3', duration: '5:01' },
            //{ title: 'The Final Thread', artist: '织屿人 OST', src: 'GAME/music/isleweaver/05.mp3', duration: '4:33' }
        ]
    },
    {
        id: 'whispers',
        name: '墙中低语 OST',
        desc: 'Whispers in the Walls 官方原声带',
        icon: '🧱',
        cover: 'GAME/music/2.jpg',
        tracks: [
            { title: 'Murum Vull', artist: '墙中低语 OST', src: 'GAME/music/墙中低语/Murum Vull.mp3', duration: '3:55' },
            { title: 'Sanctum Anatomica', artist: '墙中低语 OST', src: 'GAME/music/墙中低语/Sanctum Anatomica.mp3', duration: '4:22' },
            { title: 'Fragmented', artist: '墙中低语 OST', src: 'GAME/music/墙中低语/The Fragmented.mp3', duration: '3:47' },
            { title: "The Master Returns", artist: '墙中低语 OST', src: 'GAME/music/墙中低语/The Master Returns.mp3', duration: '4:58' },
            { title: 'Yara Jeliira', artist: '墙中低语 OST', src: 'GAME/music墙中低语/Yara Jeliira.mp3', duration: '5:12' }
        ]
    },
    {
        id: 'nineteenninetynine',
        name: '1999 OST',
        desc: 'Warframe: 1999 官方原声带',
        icon: '💿',
        cover: 'GAME/music/3.jpg',
        tracks: [
            { title: 'Core Containment', artist: '1999 OST', src: 'GAME/music/1999/Core Containment.mp3', duration: '3:33' },
            { title: 'PARTY OF YOUR LIFETIME', artist: '1999 OST', src: 'GAME/music/1999/PARTY OF YOUR LIFETIME.mp3', duration: '4:05' },
            { title: 'PARTY OF YOUR LIFETIME-现场版', artist: '1999 OST', src: 'GAME/music/1999/PARTY OF YOUR LIFETIME-现场版.mp3', duration: '3:18' },
            { title: 'THE GREAT DESPAIR', artist: '1999 OST', src: 'GAME/music/1999/THE GREAT DESPAIR.mp3', duration: '4:44' },
            { title: 'THE GREAT DESPAIR-TennoConcert', artist: '1999 OST', src: 'GAME/music/1999/THE GREAT DESPAIR-TennoConcert.mp3', duration: '5:01' }
        ]
    },
    {
        id: 'oldpeace',
        name: '旧日和平 OST',
        desc: 'The Old Peace 官方原声带',
        icon: '☮️',
        cover: 'GAME/music/4.jpg',
        tracks: [
            { title: 'Ironclad', artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Ironclad.mp3', duration: '4:12' },
            { title: 'Lullaby of the Manifold (feat. Francesca Hauser)', artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Lullaby of the Manifold (feat. Francesca Hauser).mp3', duration: '3:55' },
            { title: "Lullaby of the Manifold (Piano Version)", artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Lullaby of the Manifold (Piano Version).mp3', duration: '4:28' },
            { title: 'Lullaby of the Manifold', artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Lullaby of the Manifold.mp3', duration: '5:33' },
            { title: 'Roses from the Abyss', artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Roses from the Abyss.mp3', duration: '4:47' },
			{ title: 'Tethra Jahrak', artist: '旧日和平 OST', src: 'GAME/music/旧日和平/Tethra Jahrak.mp3', duration: '4:47' }
        ]
    }
];

var activePlaylistId = 'isleweaver';
var playlist = MUSIC_PLAYLISTS[0].tracks;
var currentTrack = 0;
var currentTrackIndex = 0;
var isPlaying = false;
var playMode = 'loop';
var currentVolume = 50;

function initMusicPlayer() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    audio.volume = 0.5;
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleTrackEnd);
    audio.addEventListener('play', function() {
        isPlaying = true;
        updatePlayButton();
        updateMusicConsolePlayButton();
        var avatar = document.getElementById('playerAvatar');
        if (avatar) avatar.classList.add('music-playing');
        var turntable = document.getElementById('djTurntable');
        if (turntable) { turntable.classList.add('playing'); turntable.classList.remove('paused'); }
        var glow = document.getElementById('turntableGlow');
        if (glow) glow.classList.add('active');
        var status = document.getElementById('musicPlayerStatus');
        if (status) { status.classList.add('playing'); status.classList.remove('paused'); }
    });
    audio.addEventListener('pause', function() {
        isPlaying = false;
        updatePlayButton();
        updateMusicConsolePlayButton();
        var avatar = document.getElementById('playerAvatar');
        if (avatar) avatar.classList.remove('music-playing');
        var turntable = document.getElementById('djTurntable');
        if (turntable) { turntable.classList.remove('playing'); turntable.classList.add('paused'); }
        var glow = document.getElementById('turntableGlow');
        if (glow) glow.classList.remove('active');
        var status = document.getElementById('musicPlayerStatus');
        if (status) { status.classList.remove('playing'); status.classList.add('paused'); }
    });
    loadTrack(0);
}

function loadTrack(index) {
    var audio = document.getElementById('bgMusic');
    if (!audio || index < 0 || index >= playlist.length) return;
    currentTrackIndex = index;
    currentTrack = index;
    var track = playlist[index];
    audio.src = track.src;
    audio.load();
    var titleEl = document.getElementById('musicTitle');
    var artistEl = document.getElementById('musicArtist');
    var coverEl = document.getElementById('musicPlayerCover');
    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    var pl = MUSIC_PLAYLISTS.find(function(p) { return p.id === activePlaylistId; });
    if (coverEl && pl) { coverEl.src = pl.cover; coverEl.style.display = 'block'; }
    var consoleTitle = document.getElementById('musicConsoleTitle');
    var consoleArtist = document.getElementById('musicConsoleArtist');
    var consoleCover = document.getElementById('musicConsoleCover');
    if (consoleTitle) consoleTitle.textContent = track.title;
    if (consoleArtist) consoleArtist.textContent = track.artist;
    if (consoleCover && pl) { consoleCover.src = pl.cover; consoleCover.style.display = 'block'; }
    updatePlaylistHighlight();
    var progressBar = document.getElementById('progressBar');
    var consoleProgressBar = document.getElementById('musicConsoleProgressBar');
    if (progressBar) progressBar.style.width = '0%';
    if (consoleProgressBar) consoleProgressBar.style.width = '0%';
}

function togglePlay() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    if (audio.paused) {
        var playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(function() { isPlaying = true; }).catch(function(e) { isPlaying = false; });
        }
    } else {
        audio.pause();
        isPlaying = false;
    }
    updatePlayButton();
    updateMusicConsolePlayButton();
}

function prevTrack() {
    var newIndex = currentTrackIndex - 1;
    if (newIndex < 0) newIndex = playlist.length - 1;
    loadTrack(newIndex);
    var audio = document.getElementById('bgMusic');
    if (audio) {
        var pp = audio.play();
        if (pp !== undefined) pp.then(function() { isPlaying = true; updatePlayButton(); updateMusicConsolePlayButton(); }).catch(function(e) {});
    }
}

function nextTrack() {
    var newIndex = currentTrackIndex + 1;
    if (newIndex >= playlist.length) newIndex = 0;
    loadTrack(newIndex);
    var audio = document.getElementById('bgMusic');
    if (audio) {
        var pp = audio.play();
        if (pp !== undefined) pp.then(function() { isPlaying = true; updatePlayButton(); updateMusicConsolePlayButton(); }).catch(function(e) {});
    }
}

function updateProgress() {
    var audio = document.getElementById('bgMusic');
    if (!audio || !audio.duration) return;
    var percent = (audio.currentTime / audio.duration) * 100;
    var pb = document.getElementById('progressBar');
    var cpb = document.getElementById('musicConsoleProgressBar');
    var ct = document.getElementById('currentTime');
    var cct = document.getElementById('musicConsoleCurrentTime');
    var dur = document.getElementById('duration');
    var cdur = document.getElementById('musicConsoleDuration');
    if (pb) pb.style.width = percent + '%';
    if (cpb) cpb.style.width = percent + '%';
    if (ct) ct.textContent = formatTime(audio.currentTime);
    if (cct) cct.textContent = formatTime(audio.currentTime);
    if (dur) dur.textContent = formatTime(audio.duration);
    if (cdur) cdur.textContent = formatTime(audio.duration);
}

function updateDuration() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    var dur = document.getElementById('duration');
    var cdur = document.getElementById('musicConsoleDuration');
    if (dur) dur.textContent = formatTime(audio.duration || 0);
    if (cdur) cdur.textContent = formatTime(audio.duration || 0);
}

function handleTrackEnd() {
    if (playMode === 'single') {
        var audio = document.getElementById('bgMusic');
        if (audio) { audio.currentTime = 0; audio.play().catch(function(e) {}); }
    } else if (playMode === 'random') {
        var nextIndex = Math.floor(Math.random() * playlist.length);
        loadTrack(nextIndex);
        var audio = document.getElementById('bgMusic');
        if (audio) audio.play().catch(function(e) {});
    } else {
        nextTrack();
    }
}

function musicSetMode(mode) {
    playMode = mode;
    var modes = ['loop', 'single', 'random'];
    var btnIds = ['musicModeLoop', 'musicModeSingle', 'musicModeRandom'];
    for (var i = 0; i < modes.length; i++) {
        var btn = document.getElementById(btnIds[i]);
        if (btn) {
            if (modes[i] === mode) {
                btn.classList.add('active');
                btn.style.background = 'rgba(0,212,255,0.15)';
                btn.style.borderColor = 'var(--orokin-cyan)';
                btn.style.color = 'var(--orokin-cyan)';
                btn.style.boxShadow = '0 0 15px rgba(0,212,255,0.2)';
            } else {
                btn.classList.remove('active');
                btn.style.background = 'rgba(0,0,0,0.3)';
                btn.style.borderColor = '#333';
                btn.style.color = '#888';
                btn.style.boxShadow = 'none';
            }
        }
    }
    var modeNames = { loop: '列表循环', single: '单曲循环', random: '随机播放' };
    if (typeof showToast === 'function') showToast('播放模式: ' + modeNames[mode], 'info');
}

function setVolume(value) {
    var audio = document.getElementById('bgMusic');
    if (audio) audio.volume = value / 100;
    currentVolume = value;
    var volumeIcon = document.getElementById('volumeIcon');
    var consoleVolumeIcon = document.getElementById('musicConsoleVolumeIcon');
    var volumeText = document.getElementById('musicConsoleVolumeText');
    var icon = value == 0 ? '🔇' : (value < 30 ? '🔈' : (value < 70 ? '🔉' : '🔊'));
    if (volumeIcon) volumeIcon.textContent = icon;
    if (consoleVolumeIcon) consoleVolumeIcon.textContent = icon;
    if (volumeText) volumeText.textContent = value + '%';
}

function toggleMute() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    audio.muted = !audio.muted;
    var volumeIcon = document.getElementById('volumeIcon');
    var consoleVolumeIcon = document.getElementById('musicConsoleVolumeIcon');
    var icon = audio.muted ? '🔇' : (audio.volume < 0.3 ? '🔈' : (audio.volume < 0.7 ? '🔉' : '🔊'));
    if (volumeIcon) volumeIcon.textContent = icon;
    if (consoleVolumeIcon) consoleVolumeIcon.textContent = icon;
}

function musicSeek(event) {
    var audio = document.getElementById('bgMusic');
    if (!audio || !audio.duration) return;
    var container = document.getElementById('musicConsoleProgressContainer');
    if (!container) return;
    var rect = container.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var percent = Math.max(0, Math.min(1, x / rect.width));
    audio.currentTime = percent * audio.duration;
    updateProgress();
}

function musicTogglePlay() { togglePlay(); }
function musicPrev() { prevTrack(); }
function musicNext() { nextTrack(); }
function musicToggleMute() { toggleMute(); }

function updatePlayButton() {
    var btn = document.getElementById('playPauseBtn');
    if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
}

function updateMusicConsolePlayButton() {
    var btn = document.getElementById('musicConsolePlayBtn');
    if (btn) btn.textContent = isPlaying ? '⏸' : '▶';
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function toggleMusicPlayer() {
    // 手机端(<768px)禁止打开迷你播放器，只能通过导航进入音乐页面
    if (window.innerWidth <= 768) {
        showToast('请通过底部导航进入音乐页面', 'warning');
        return;
    }
    var widget = document.getElementById('musicPlayerWidget');
    if (!widget) return;
    var isVisible = widget.style.display !== 'none' && widget.style.display !== '';
    widget.style.display = isVisible ? 'none' : 'block';
    if (!isVisible) {
        widget.classList.add('active');
    } else {
        widget.classList.remove('active');
    }
}

function toggleMusic() { toggleMusicPlayer(); }

function selectTrack(element, index) {
    loadTrack(index);
    var audio = document.getElementById('bgMusic');
    if (audio) {
        var pp = audio.play();
        if (pp !== undefined) pp.catch(function(e) {});
    }
}

function seekTo(e) {
    var audio = document.getElementById('bgMusic');
    var container = document.getElementById('progressContainer');
    if (!audio || !container) return;
    var rect = container.getBoundingClientRect();
    var percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
}

function togglePlaylist() {
    var panel = document.getElementById('playlistPanel');
    if (panel) panel.classList.toggle('show');
}

function renderMusicConsolePlaylist() {
    var container = document.getElementById('musicConsolePlaylist');
    if (!container) return;
    container.innerHTML = '';

    MUSIC_PLAYLISTS.forEach(function(pl) {
        var isActive = pl.id === activePlaylistId;
        var trackCount = pl.tracks.length;

        var card = document.createElement('div');
        card.className = 'playlist-card' + (isActive ? ' active' : '');
        card.style.cssText = 'background: rgba(0,0,0,0.4); border: 1px solid ' + (isActive ? 'var(--tenno-gold)' : '#222') + '; border-radius: 12px; overflow: hidden; transition: all 0.4s ease; cursor: pointer; position: relative;';

        if (!isActive) {
            card.onmouseover = function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
                this.style.borderColor = 'var(--orokin-cyan-dim)';
                this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), 0 0 20px rgba(0,212,255,0.1)';
            };
            card.onmouseout = function() {
                this.style.transform = '';
                this.style.borderColor = '#222';
                this.style.boxShadow = 'none';
            };
        }

        card.onclick = function() { selectPlaylist(pl.id); };

        // === 用 DOM API 构建回响内容 ===

        // 1. 图片区域容器
        var imgWrap = document.createElement('div');
        imgWrap.style.cssText = 'position: relative; overflow: hidden;';

        // 1.1 封面图片
        var img = document.createElement('img');
        img.src = pl.cover;
        img.style.cssText = 'width: 100%; height: 160px; object-fit: cover; transition: all 0.5s ease; filter: brightness(0.8);';
        img.onerror = function() {
            this.style.display = 'none';
            var placeholder = document.createElement('div');
            placeholder.style.cssText = 'width:100%;height:160px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#16213e);font-size:4rem;';
            placeholder.textContent = pl.icon;
            imgWrap.appendChild(placeholder);
        };
        img.onmouseover = function() {
            this.style.filter = 'brightness(1)';
            this.style.transform = 'scale(1.05)';
        };
        img.onmouseout = function() {
            this.style.filter = 'brightness(0.8)';
            this.style.transform = 'scale(1)';
        };
        imgWrap.appendChild(img);

        // 1.2 曲目数量标签
        var countBadge = document.createElement('div');
        countBadge.style.cssText = 'position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.6); border: 1px solid #333; color: var(--orokin-cyan); padding: 3px 8px; border-radius: 4px; font-family: "Orbitron"; font-size: 0.65rem;';
        countBadge.textContent = trackCount + ' 首';
        imgWrap.appendChild(countBadge);

        // 1.3 播放中标签（仅当前激活）
        if (isActive) {
            var playingBadge = document.createElement('div');
            playingBadge.style.cssText = 'position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); border: 1px solid var(--tenno-gold); color: var(--tenno-gold); padding: 4px 10px; border-radius: 6px; font-family: "Orbitron"; font-size: 0.65rem; letter-spacing: 1px; z-index: 5;';
            playingBadge.textContent = '▶ 播放中';
            imgWrap.appendChild(playingBadge);
        }

        card.appendChild(imgWrap);

        // 2. 信息区域
        var infoWrap = document.createElement('div');
        infoWrap.style.cssText = 'padding: 15px; position: relative;';

        // 2.1 歌单名称
        var nameEl = document.createElement('div');
        nameEl.style.cssText = 'font-family: "Orbitron"; color: #fff; font-size: 0.95rem; margin-bottom: 6px; letter-spacing: 1px;';
        nameEl.textContent = pl.name;
        infoWrap.appendChild(nameEl);

        // 2.2 歌单描述
        var descEl = document.createElement('div');
        descEl.style.cssText = 'color: #666; font-size: 0.75rem; line-height: 1.5;';
        descEl.textContent = pl.desc;
        infoWrap.appendChild(descEl);

        card.appendChild(infoWrap);

        container.appendChild(card);
    });

    var totalEl = document.getElementById('playlistTotalTracks');
    if (totalEl) totalEl.textContent = MUSIC_PLAYLISTS.length;
}

function selectPlaylist(playlistId) {
    var pl = MUSIC_PLAYLISTS.find(function(p) { return p.id === playlistId; });
    if (!pl) return;

    activePlaylistId = playlistId;
    playlist = pl.tracks;
    currentTrack = 0;
    currentTrackIndex = 0;

    loadTrack(0);

    var audio = document.getElementById('bgMusic');
    if (audio) {
        var pp = audio.play();
        if (pp !== undefined) {
            pp.then(function() {
                isPlaying = true;
                updatePlayButton();
                updateMusicConsolePlayButton();
            }).catch(function(e) {});
        }
    }

    renderMusicConsolePlaylist();
    if (typeof showToast === 'function') showToast('已切换到歌单: ' + pl.name, 'success');
}

function updatePlaylistHighlight() {
    var cards = document.querySelectorAll('.playlist-card');
    cards.forEach(function(card, index) {
        var pl = MUSIC_PLAYLISTS[index];
        if (!pl) return;
        var isActive = pl.id === activePlaylistId;
        if (isActive) {
            card.classList.add('active');
            card.style.borderColor = 'var(--tenno-gold)';
            card.style.boxShadow = '0 0 25px rgba(200,168,75,0.2), inset 0 0 30px rgba(200,168,75,0.05)';
        } else {
            card.classList.remove('active');
            card.style.borderColor = '#222';
            card.style.boxShadow = 'none';
        }
    });
}

function renderMusicConsole() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;

    var titleEl = document.getElementById('musicConsoleTitle');
    var artistEl = document.getElementById('musicConsoleArtist');
    var currentTrackData = playlist[currentTrackIndex];
    if (titleEl && currentTrackData) titleEl.textContent = currentTrackData.title;
    if (artistEl && currentTrackData) artistEl.textContent = currentTrackData.artist;

    var consoleCover = document.getElementById('musicConsoleCover');
    var miniCover = document.getElementById('musicPlayerCover');
    var pl = MUSIC_PLAYLISTS.find(function(p) { return p.id === activePlaylistId; });
    if (consoleCover && pl) { consoleCover.src = pl.cover; consoleCover.style.display = 'block'; }
    if (miniCover && pl) { miniCover.src = pl.cover; miniCover.style.display = 'block'; }

    updateMusicConsolePlayButton();
    musicConsoleUpdateProgress();

    var volumeSlider = document.getElementById('musicConsoleVolumeSlider');
    var volumeText = document.getElementById('musicConsoleVolumeText');
    if (volumeSlider) volumeSlider.value = currentVolume;
    if (volumeText) volumeText.textContent = currentVolume + '%';

    var volumeIcon = document.getElementById('musicConsoleVolumeIcon');
    if (volumeIcon) {
        var icon = currentVolume === 0 ? '🔇' : (currentVolume < 30 ? '🔈' : (currentVolume < 70 ? '🔉' : '🔊'));
        volumeIcon.textContent = icon;
    }

    musicSetMode(playMode);
    renderMusicConsolePlaylist();
    initMusicVisualizer();

    if (!window.musicConsoleProgressInterval) {
        window.musicConsoleProgressInterval = setInterval(function() {
            musicConsoleUpdateProgress();
        }, 500);
    }
}

function musicConsoleUpdateProgress() {
    var audio = document.getElementById('bgMusic');
    if (!audio) return;
    var currentTime = document.getElementById('musicConsoleCurrentTime');
    var duration = document.getElementById('musicConsoleDuration');
    var progressBar = document.getElementById('musicConsoleProgressBar');
    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
    if (duration) duration.textContent = formatTime(audio.duration || 0);
    if (progressBar && audio.duration) {
        var percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percent + '%';
    }
    var statusDot = document.getElementById('musicStatusDot');
    var statusText = document.getElementById('musicStatusText');
    if (statusDot && statusText) {
        if (isPlaying) {
            statusDot.style.background = 'var(--infested-green)';
            statusDot.style.boxShadow = '0 0 8px var(--infested-green)';
            statusText.textContent = '播放中';
            statusText.style.color = 'var(--infested-green)';
        } else if (audio.currentTime > 0 && audio.currentTime < audio.duration) {
            statusDot.style.background = 'var(--tenno-gold)';
            statusDot.style.boxShadow = '0 0 8px var(--tenno-gold)';
            statusText.textContent = '已暂停';
            statusText.style.color = 'var(--tenno-gold)';
        } else {
            statusDot.style.background = '#333';
            statusDot.style.boxShadow = 'none';
            statusText.textContent = '就绪';
            statusText.style.color = '#666';
        }
    }
}


// 伪可视化器 - 不连接Web Audio API，避免CORS问题
function initMusicVisualizer() {
    startFakeVisualizer();
}

function cleanupMusicConsole() {
    if (window.musicConsoleProgressInterval) {
        clearInterval(window.musicConsoleProgressInterval);
        window.musicConsoleProgressInterval = null;
    }
    if (musicConsoleVisualizerId) {
        cancelAnimationFrame(musicConsoleVisualizerId);
        musicConsoleVisualizerId = null;
    }
}

window.musicTogglePlay = musicTogglePlay;
window.musicPrev = musicPrev;
window.musicNext = musicNext;
window.musicSetMode = musicSetMode;
window.musicToggleMute = musicToggleMute;
window.musicSeek = musicSeek;
window.musicSetVolume = setVolume;
window.musicSelectTrack = function(index) {
    loadTrack(index);
    var audio = document.getElementById('bgMusic');
    if (audio) {
        var pp = audio.play();
        if (pp !== undefined) pp.catch(function(e) {});
    }
    renderMusicConsole();
};

window.playlist = playlist;
window.currentTrack = currentTrack;
window.currentTrackIndex = currentTrackIndex;
window.isPlaying = isPlaying;
window.playMode = playMode;

window.renderMusicConsole = renderMusicConsole;
window.musicConsoleUpdateProgress = musicConsoleUpdateProgress;
window.updateMusicConsolePlayButton = updateMusicConsolePlayButton;
window.initMusicVisualizer = initMusicVisualizer;
window.cleanupMusicConsole = cleanupMusicConsole;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMusicPlayer);
} else {
    initMusicPlayer();
}








						
						
						
function updateInfoUI() {
    if (!gameData || !currentUser) return;

    const wf = WARFRAMES[gameData.warframe_type] || WARFRAMES.excalibur;
    const wfData = getCurrentWarframeData();

    document.getElementById('infoPlayerName').textContent = currentUser.username;
    document.getElementById('infoPlayerRank').textContent = `${wf.name}`;
    document.getElementById('infoPlayerUID').textContent = 'UID: ' + currentUser.id;
    const avatarEl = document.getElementById('infoPlayerAvatar');
    if (avatarEl) {
        avatarEl.innerHTML = wf.image ?
            `<img src="${wf.image}" style="width: 150px; height: 150px; object-fit: contain; border-radius: 50%;">` :
            wf.icon;
        // 添加提示文字
        avatarEl.title = `当前战甲: ${wf.name}\n点击切换战甲`;
    }
	// 恢复 infoPlayerRank 等级显示
	document.getElementById('infoPlayerRank').textContent = `等级 ${wfData.level} · ${wf.name}`;
    // 新增：经验条
    const isMaxLevel = wfData.level >= 50;
    const xpPercent = isMaxLevel ? 100 : (wfData.max_xp > 0 ? Math.min(100, Math.floor((wfData.xp / wfData.max_xp) * 100)) : 0);
    const xpText = isMaxLevel ? 'MAX' : `${wfData.xp} / ${wfData.max_xp}`;
    
    // 检查是否已存在经验条容器，不存在则创建
    let xpContainer = document.getElementById('infoXpContainer');
    const rankEl = document.getElementById('infoPlayerRank');
    if (!xpContainer && rankEl) {
        xpContainer = document.createElement('div');
        xpContainer.id = 'infoXpContainer';
        xpContainer.style.cssText = 'margin-top: 10px; width: 100%; max-width: 300px; margin-left: auto; margin-right: auto;';
        if (rankEl.nextSibling) {
            rankEl.parentNode.insertBefore(xpContainer, rankEl.nextSibling);
        } else {
            rankEl.parentNode.appendChild(xpContainer);
        }
    }
    
    xpContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="color: var(--orokin-cyan); font-size: 0.75rem;">经验值</span>
            <span style="color: var(--orokin-cyan); font-size: 0.75rem; font-family: 'Orbitron';">${xpText}</span>
        </div>
        <div style="width: 100%; height: 8px; background: #1a1a1a; border-radius: 4px; overflow: hidden; border: 1px solid #333;">
            <div style="width: ${xpPercent}%; height: 100%; background: linear-gradient(90deg, var(--orokin-cyan-dim), var(--orokin-cyan)); border-radius: 4px; transition: width 0.5s ease; position: relative; overflow: hidden;">
                <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 15px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3));"></div>
            </div>
        </div>
 <div style="text-align: center; margin-top: 3px; color: #666; font-size: 0.7rem;">${isMaxLevel ? '已达到最高等级' : (wfData.max_xp > 0 ? '还需 ' + (wfData.max_xp - wfData.xp) + ' 经验升级' : '')}</div>
    `;

    document.getElementById('infoRout').textContent = currentUser.rout_points || 0;
    document.getElementById('infoPrime').textContent = currentUser.prime_points || 0;
    document.getElementById('infoVip').textContent = currentUser.vip_points || 0;
        var infoStaminaEl = document.getElementById('infoStamina');
        if (infoStaminaEl) {
            if (isUnlimitedStaminaActive()) {
                infoStaminaEl.textContent = '∞/' + STAMINA_MAX;
            } else {
                infoStaminaEl.textContent = stamina + '/100'; // 自然上限固定100
            }
        }

    // 负荷低时变红提醒
    const staminaBadge = document.getElementById('battleStaminaBadge');
    if (staminaBadge) {
        if (stamina < 50) {
            staminaBadge.style.borderColor = 'var(--grineer-red)';
            staminaBadge.style.color = 'var(--grineer-red)';
        } else if (stamina < 200) {
            staminaBadge.style.borderColor = 'var(--tenno-gold)';
            staminaBadge.style.color = 'var(--tenno-gold)';
        } else {
            staminaBadge.style.borderColor = 'var(--orokin-cyan-dim)';
            staminaBadge.style.color = 'var(--orokin-cyan)';
        }
    }
}

					// ═══════════════════════════════════════════════════════════════
					//  玩家回响库存系统
					// ═══════════════════════════════════════════════════════════════
					// 玩家已获得的回响 { cardId: { count, firstGetTime, data } }
					let playerCards = {};
					window.playerCards = playerCards; // 暴露到全局，供 codex_system.js 读取

					function savePlayerCards() {
						if (!currentUser) return;
						const key = 'cards_' + currentUser.id;
						localStorage.setItem(key, JSON.stringify(playerCards));
						window.playerCards = playerCards; // 同步到全局
					}

					// 添加回响到库存，返回当前数量
					// 通用碎片配置
					var CARD_SHARD_CONFIG = {
						1: {
							name: '普通碎片',
							icon: '♻️',
							points: 10
						}, // 普通卡重复
						2: {
							name: '稀有碎片',
							icon: '♻️',
							points: 25
						}, // 稀有卡重复
						3: {
							name: '史诗碎片',
							icon: '♻️',
							points: 60
						}, // 史诗卡重复
						4: {
							name: '传说碎片',
							icon: '♻️',
							points: 150
						} // 传说卡重复
					};

					function addPlayerCard(cardData) {
						var isNew = !playerCards[cardData.id];

						if (isNew) {
							playerCards[cardData.id] = {
								count: 1,
								firstGetTime: new Date().toISOString(),
								data: cardData
							};
						} else {
							// 重复回响：仅增加计数
							playerCards[cardData.id].count++;
						}

						// 实时同步到 Supabase
						if (currentUser && gameData) {
							gameData.player_cards = playerCards;
							saveGameData();
						}

						// 检查是否触发回响奖励（获得新回响时）
						if (isNew) {
							setTimeout(function() {
								checkAndTriggerCodexReward();
							}, 500);
						}

						if (isNew) {
							return {
								count: 1,
								isNew: true,
								converted: null
							};
						} else {
							return {
								count: playerCards[cardData.id].count,
								isNew: false,
								converted: null
							};
						}
					}

// ═══════════════════════════════════════════════════════════════
//  回响奖励系统：集齐一套肃清卡奖励特殊物品
// ═══════════════════════════════════════════════════════════════

// 奖励物品定义
var CODEX_REWARD_ITEM = {
    id: 'excalibur_umbra_prime',
    name: '申秉之魂',
    icon: '⚔️',
    image: 'GAME/申秉之魂.png',
    
    type: 'special',
    rarity: 'legendary'
};

// 全服奖励计数（通过 Supabase 管理）
var CODEX_REWARD_GLOBAL_LIMIT = 3;

// 检查是否已集齐一套肃清卡（任意一套卡组）
function checkDeckComplete(deckId) {
    var cards = DECK_CARDS[deckId];
    if (!cards || cards.length === 0) return false;

    for (var i = 0; i < cards.length; i++) {
        if (!hasPlayerCard(cards[i].id)) {
            return false;
        }
    }
    return true;
}

// 获取所有已集齐的肃清卡套组
function getCompletedBattleDecks() {
    var completed = [];
    // 遍历所有肃清卡组（e_zone 开头的）
    for (var deckId in DECK_CARDS) {
        if (deckId.indexOf('e_zone') === 0) { // 肃清卡组
            if (checkDeckComplete(deckId)) {
                completed.push(deckId);
            }
        }
    }
    return completed;
}

// 检查玩家是否已获得奖励
function hasPlayerClaimedReward() {
    if (!gameData) {
        
        return false;
    }
    var claimed = gameData.codexRewardClaimed === true;
   
    return claimed;
}

// 标记玩家已领取奖励
function markRewardClaimed() {
    if (!gameData) {
        
        return;
    }
    gameData.codexRewardClaimed = true;
    

    // 立即保存到 localStorage 作为备份
    try {
        localStorage.setItem('codex_reward_claimed_' + currentUser.id, 'true');
    } catch(e) {}

    // 异步保存到数据库
    saveGameData().then(function() {
        console.log('✅ 奖励状态已保存到数据库');
    }).catch(function(err) {
        console.error('❌ 保存失败:', err);
        // 即使数据库保存失败，也保持内存中的状态
    });
}



// 显示奖励获得弹窗（使用5星super特效）
function showCodexRewardModal(deckId) {
    var deckName = '';
    // 查找卡组名称
    for (var faction in CODEX_STRUCTURE) {
        var f = CODEX_STRUCTURE[faction];
        if (f.blocks) {
            for (var block in f.blocks) {
                var b = f.blocks[block];
                if (b.decks && b.decks[deckId]) {
                    deckName = b.decks[deckId].name;
                    break;
                }
            }
        }
    }

    var overlay = document.createElement('div');
    overlay.id = 'codexRewardOverlay';
    overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 3000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.5s ease;';

    // 使用5星super回响的特效样式
    var starStyle = CARD_STAR_STYLES.super;
    var star5 = starStyle.stars[5];

    var modalBox = document.createElement('div');
    modalBox.style.cssText = 'text-align: center; max-width: 420px; width: 90%; animation: cardAcquirePop 0.6s ease forwards;';

    // 标题
    var titleEl = document.createElement('div');
    titleEl.style.cssText = 'font-family: Orbitron; font-size: 1.4rem; color: #ff0000; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255,0,0,0.5);';
    titleEl.innerHTML = '🎉集齐奖励🎉';
    modalBox.appendChild(titleEl);

    // 集齐提示
    var deckInfo = document.createElement('div');
    deckInfo.style.cssText = 'color: var(--tenno-gold); font-size: 1rem; margin-bottom: 15px;';
    deckInfo.innerHTML = '恭喜集齐 <span style="color: #ff4444;">' + deckName + '</span> 全套回响回响！';
    modalBox.appendChild(deckInfo);

    // 奖励回响展示（5星super特效）
    var cardBox = document.createElement('div');
    cardBox.style.cssText = 'width: 280px; margin: 0 auto 25px; position: relative; background: ' + star5.bg + '; border: ' + star5.borderWidth + 'px solid ' + star5.border + '; border-radius: 16px; overflow: hidden; box-shadow: ' + star5.shadow + '; animation: cardRainbowGlow 4s ease-in-out infinite;';

    // 粒子层
    var particleLayer = document.createElement('div');
    particleLayer.style.cssText = 'position: absolute; inset: 0; z-index: 10; pointer-events: none; overflow: hidden;';
    var particles = ['✦', '★', '✪', '◆', '●'];
    for (var pi = 0; pi < 15; pi++) {
        var p = document.createElement('span');
        p.textContent = particles[Math.floor(Math.random() * particles.length)];
        p.style.cssText = 'position: absolute; left: ' + (5 + Math.random() * 90) + '%; top: ' + (5 + Math.random() * 90) + '%; font-size: ' + (0.5 + Math.random() * 1) + 'rem; color: #ff0000; opacity: ' + (0.2 + Math.random() * 0.5) + '; animation: cardStarFloat ' + (2 + Math.random() * 3) + 's ease-in-out ' + (Math.random() * 2) + 's infinite; text-shadow: 0 0 8px #ff0000; z-index: 10;';
        particleLayer.appendChild(p);
    }
    cardBox.appendChild(particleLayer);

    // 流光线条
    var flowLine1 = document.createElement('div');
    flowLine1.style.cssText = 'position: absolute; top: 0; left: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite; z-index: 6;';
    cardBox.appendChild(flowLine1);

    var flowLine2 = document.createElement('div');
    flowLine2.style.cssText = 'position: absolute; bottom: 0; right: -100%; width: 50%; height: 2px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent); animation: cardBorderFlow 2s linear infinite reverse; z-index: 6;';
    cardBox.appendChild(flowLine2);

    // 图片区域
    var imgWrap = document.createElement('div');
    imgWrap.style.cssText = 'height: 220px; background: #0a0a0f; position: relative; overflow: hidden; border-radius: 12px 12px 0 0;';

    var img = document.createElement('img');
    img.src = CODEX_REWARD_ITEM.image;
    img.style.cssText = 'width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 20px #ff0000) drop-shadow(0 0 40px rgba(255,0,0,0.5)); animation: cardRainbowRotate 8s linear infinite;';
    img.onerror = function() {
        this.style.display = 'none';
        var placeholder = document.createElement('div');
        placeholder.style.cssText = 'font-size: 5rem; display: flex; align-items: center; justify-content: center; height: 100%; color: #ff0000; filter: drop-shadow(0 0 15px #ff0000);';
        placeholder.textContent = CODEX_REWARD_ITEM.icon;
        imgWrap.appendChild(placeholder);
    };
    imgWrap.appendChild(img);

    // 渐变遮罩
    var gradient = document.createElement('div');
    gradient.style.cssText = 'position: absolute; bottom: 0; left: 0; right: 0; height: 80px; background: linear-gradient(180deg, transparent 0%, ' + star5.bg + ' 100%); z-index: 2; pointer-events: none;';
    imgWrap.appendChild(gradient);

    // 5星角标
    var starBadge = document.createElement('div');
    starBadge.style.cssText = 'position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.8); border: 2px solid #ff0000; border-radius: 10px; padding: 6px 10px; font-size: 0.9rem; color: #ff0000; text-shadow: 0 0 8px rgba(255,0,0,0.6); font-family: Orbitron; z-index: 5;';
    starBadge.textContent = '★★★★★';
    imgWrap.appendChild(starBadge);

    // 稀有度标签
    var rarityLabel = document.createElement('div');
    rarityLabel.style.cssText = 'position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); border: 1px solid #ff000080; border-radius: 6px; padding: 4px 8px; font-size: 0.7rem; color: #ff0000; font-weight: bold; z-index: 5;';
    rarityLabel.textContent = '【终焉】';
    imgWrap.appendChild(rarityLabel);

    cardBox.appendChild(imgWrap);

    // 信息区域
    var infoWrap = document.createElement('div');
    infoWrap.style.cssText = 'padding: 18px; position: relative; z-index: 5;';

    var nameEl = document.createElement('div');
    nameEl.style.cssText = 'font-family: Orbitron; font-size: 1.2rem; color: #fff; margin-bottom: 6px; text-shadow: 0 0 10px rgba(255,0,0,0.5);';
    nameEl.textContent = CODEX_REWARD_ITEM.name;
    infoWrap.appendChild(nameEl);

    var typeEl = document.createElement('div');
    typeEl.style.cssText = 'font-size: 0.9rem; color: #ff0000; font-weight: 700; margin-bottom: 8px; letter-spacing: 1px;';
    typeEl.textContent = '⭐阿撒托斯之梦⭐';
    infoWrap.appendChild(typeEl);

    var descEl = document.createElement('div');
    descEl.style.cssText = 'font-size: 0.8rem; color: #888; line-height: 1.5; text-align: center; margin-bottom: 12px;';
    descEl.textContent = CODEX_REWARD_ITEM.desc;
    infoWrap.appendChild(descEl);

    // 全服限量提示
    var limitEl = document.createElement('div');
    limitEl.style.cssText = 'color: var(--tenno-gold); font-size: 0.8rem; margin-bottom: 15px; text-align: center; background: rgba(200,168,75,0.1); border: 1px solid var(--tenno-gold-dim); border-radius: 8px; padding: 8px;';
    limitEl.innerHTML = '⚠️ 限量 <span style="font-family: Orbitron; color: #ff4444;">1</span> 次，领取将加入矩阵';
    infoWrap.appendChild(limitEl);

    cardBox.appendChild(infoWrap);
    modalBox.appendChild(cardBox);

    // 按钮区域
    var btnWrap = document.createElement('div');
    btnWrap.style.cssText = 'display: flex; gap: 15px; justify-content: center;';

    var btnClaim = document.createElement('button');
    btnClaim.innerHTML = '✨ 限量检查 ✨';
    btnClaim.style.cssText = 'padding: 12px 30px; background: linear-gradient(135deg, #ff000040, #ff000090); border: 2px solid #ff0000; border-radius: 10px; color: #fff; font-family: Orbitron; font-size: 0.9rem; cursor: pointer; font-weight: 700; transition: all 0.3s; text-shadow: 0 0 8px rgba(255,0,0,0.8); box-shadow: 0 0 20px rgba(255,0,0,0.3);';
    btnClaim.onmouseover = function() {
        this.style.transform = 'scale(1.05)';
        this.style.boxShadow = '0 0 30px rgba(255,0,0,0.6)';
    };
    btnClaim.onmouseout = function() {
        this.style.transform = 'none';
        this.style.boxShadow = '0 0 20px rgba(255,0,0,0.3)';
    };
    btnClaim.onclick = function() {
        claimCodexReward(deckId, overlay);
    };
    btnWrap.appendChild(btnClaim);

    modalBox.appendChild(btnWrap);
    overlay.appendChild(modalBox);
    document.body.appendChild(overlay);

    // 点击背景关闭
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(function() { overlay.remove(); }, 300);
        }
    };
}



// ═══════════════════════════════════════════════════════════════
//  回响奖励系统 - 安全领取（Supabase RPC 验证）
//  修复：全服上限时标记本地状态，防止无限弹窗
// ═══════════════════════════════════════════════════════════════
async function claimCodexReward(deckId, overlay) {
    // ========== 前置检查 ==========
    if (!currentUser || !gameData) {
        showToast('请先登录', 'error');
        return;
    }

    // 查找卡组名称（用于日志和显示）
    var deckName = '';
    for (var faction in CODEX_STRUCTURE) {
        var f = CODEX_STRUCTURE[faction];
        if (f.blocks) {
            for (var block in f.blocks) {
                var b = f.blocks[block];
                if (b.decks && b.decks[deckId]) {
                    deckName = b.decks[deckId].name;
                    break;
                }
            }
        }
    }

    // ========== 调用后端领取 ==========
    try {
        const { data, error } = await sb.rpc('claim_codex_reward_safe', {
            p_user_id: currentUser.id,
            p_username: currentUser.username || '未知',
            p_deck_id: deckId,
            p_deck_name: deckName || deckId
        });

        if (error) {
            console.error('领取 RPC 错误:', error);
            showToast('领取失败: ' + error.message, 'error');
            return;
        }

        // 解析返回结果
        let result = data;
        if (typeof data === 'string') {
            try { result = JSON.parse(data); } catch (e) {}
        }
        if (Array.isArray(result)) {
            result = result[0] || {};
        }

        console.log('领取结果:', result);

        // ========== 处理领取失败 ==========
        if (!result || !result.success) {
            var errorMsg = result?.error || result?.msg || '领取失败';
            var errorCode = result?.code || '';

            // 【关键修复】全服奖励已达上限 → 标记本地状态，防止无限弹窗
            if (errorMsg.includes('限量奖励已达上限') || errorCode === 'GLOBAL_LIMIT' || errorMsg.includes('上限')) {
                console.log('【回响奖励】全服已达上限，标记本地状态防止重复弹窗');
                
                // 1. 内存标记：当前会话不再弹窗
                window._codexRewardShown = true;
                
                // 2. 持久化标记：localStorage 跨会话保存
                // 键名格式: codex_reward_seen_{用户ID}
                var seenKey = 'codex_reward_seen_' + currentUser.id;
                localStorage.setItem(seenKey, 'true');
                
                // 3. 同时记录到 gameData（如果后续需要同步到数据库）
                if (gameData) {
                    gameData._codexRewardLimitSeen = true;
                    gameData._codexRewardLimitDate = new Date().toISOString();
                }
                
                // 4. 关闭弹窗
                if (overlay) {
                    overlay.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(function() { 
                        if (overlay && overlay.parentNode) overlay.remove(); 
                    }, 300);
                }
                
                // 5. 用户提示：说明情况，安抚用户
                showToast(
                    '⚠️ 【申秉之魂】限量已发放完毕','warning', 
                    5000  // 显示5秒
                );
                
                // 6. 可选：保存到数据库（异步，不阻塞）
                try {
                    await saveGameData();
                } catch (e) {
                    console.warn('保存上限标记失败:', e);
                }
                
                return; // 提前返回，不再执行后续代码
            }
            // ============================================================

            // 其他错误（非上限错误）
            showToast('❌ ' + errorMsg, 'error');
            return;
        }

        // ========== 领取成功 ==========
        console.log('【回响奖励】领取成功:', result);

        // 发放到矩阵
        addToWarehouse(
            CODEX_REWARD_ITEM.name,
            CODEX_REWARD_ITEM.icon,
            1,
            CODEX_REWARD_ITEM.type,
            CODEX_REWARD_ITEM.image
        );

        // 标记已领取
        markRewardClaimed();

        // 重置弹窗标记（成功领取后可以再次检查其他卡组）
        window._codexRewardShown = false;

        // 关闭弹窗
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(function() { 
                if (overlay && overlay.parentNode) overlay.remove(); 
            }, 300);
        }

        // 成功提示
        showToast('🎉 恭喜获得 ' + CODEX_REWARD_ITEM.name + '！', 'success');
        
        // 显示全服剩余
        var remaining = result.remaining || 0;
        if (remaining > 0) {
            setTimeout(function() {
                showToast('剩余 ' + remaining + ' 个名额', 'info');
            }, 1500);
        }

    } catch (err) {
        console.error('【回响奖励】领取异常:', err);
        showToast('领取异常，请重试', 'error');
    }
}


// 检查并触发回响奖励（在获得新回响后调用）
function checkAndTriggerCodexReward() {
    
    if (!gameData) {
       
        return;
    }

    // 如果已领取过，不再检查
    if (hasPlayerClaimedReward()) {
        console.log('已领取过奖励，跳过');
        return;
    }
	
	// ========== 关键修复：检查本地是否已标记看过上限弹窗 ==========
	    var hasSeenLimit = localStorage.getItem('codex_reward_seen_' + currentUser.id);
	    if (hasSeenLimit === 'true') {
	        console.log('已看过上限提示，跳过');
	        return;
	    }
	    // ============================================================

    // 防止重复弹窗：如果已经显示过，不再显示
    if (window._codexRewardShown) {
        
        return;
    }

    // 检查所有肃清卡组
    var completedDecks = getCompletedBattleDecks();
    
    if (completedDecks.length > 0) {
        // 标记已显示
        window._codexRewardShown = true;
        
        // 找到第一个完成的卡组并显示奖励
        showCodexRewardModal(completedDecks[0]);
    } else {
        
    }
}


					// 检查是否已有某张回响
					function hasPlayerCard(cardId) {
						return !!playerCards[cardId];
					}

					// ═══════════════════════════════════════════════════════════════
					//  回响掉落逻辑
					// ═══════════════════════════════════════════════════════════════
					// 从回响池中随机抽取一张
					function rollCardDrop(cardPool) {
						if (!cardPool || cardPool.length === 0) return null;

						// 简单随机，每张回响等概率
						return cardPool[Math.floor(Math.random() * cardPool.length)];
					}

					// ═══════════════════════════════════════════════════════════════
					//  回响系统
					// ═══════════════════════════════════════════════════════════════
					let currentCodexTab = 'enemies';
					let playerCodex = {}; // 玩家回响进度 { entryId: count }

					// ═══════════════════════════════════════════════════════════════
					//  星球选择系统
					// ═══════════════════════════════════════════════════════════════
										// ═══════════════════════════════════════════════════════════════
										//  勘探/回收星图导航系统（两页）
										// ═══════════════════════════════════════════════════════════════
					
										function renderMiningPlanetSelect() {
											const grid = document.getElementById('miningPlanetGrid');
											if (!grid) return;
					
											const playerLevel = getCurrentWarframeData().level;
					
											grid.innerHTML = MINING_PLANETS.map(planet => {
												const isLocked = planet.locked === true;
												const lockedClass = isLocked ? 'locked' : '';
												const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
												const onclick = isLocked ? '' : `onclick="selectMiningPlanet('${planet.id}')"`;
												const planetColor = planet.color || '#c8a84b';
					
												return `
					            <div class="planet-card ${lockedClass}" ${onclick}
					                 style="position: relative; background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planetColor}; 
					                        border-radius: 12px; overflow: hidden; transition: all 0.3s; ${lockedStyle};
					                        aspect-ratio: 4/3;">
					                <div style="position: absolute; inset: 0; z-index: 1;">
					                    ${planet.image ? `
					                        <img src="${planet.image}" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" 
					                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);\\'><span style=\\'font-size: 4rem;\\'>${planet.icon}</span></div>';">
					                    ` : `
					                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
					                            <span style="font-size: 4rem;">${planet.icon}</span>
					                        </div>
					                    `}
					                </div>
					                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%); z-index: 2; pointer-events: none;"></div>
					                <div style="position: absolute; bottom: 0; right: 0; left: 0; padding: 15px; z-index: 3; text-align: right; pointer-events: none;">
					                    <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.1rem; margin-bottom: 3px; text-shadow: 0 0 8px rgba(0,0,0,0.8);">${planet.name}</div>
					                    
					                    
					                    <div style="color: #666; font-size: 0.7rem; text-shadow: 0 0 6px rgba(0,0,0,0.8);">${isLocked ? '🔒 暂未开放' : ''}</div>
					                </div>
					            </div>
					        `;
											}).join('');
										}
					
function selectMiningPlanet(planetId) {
    const planet = MINING_PLANETS.find(p => p.id === planetId);
    if (!planet) return;

    selectedMiningPlanet = planet;
    selectedMiningZone = null;

    // 检查是否有区域配置
    const zones = MINING_ZONES[planetId];
    if (zones && zones.length > 0) {
        // 有区域，进入区域选择页（第2页）
        enterMiningZones(planet, zones);
    } else {
        // 无区域，直接跳转到勘探页面
        document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
        document.getElementById('page-mining').classList.remove('hidden');
        const log = document.getElementById('miningLog');
        if (log) {
            log.innerHTML = '';
            addMiningLog('🌍 已抵达 ' + planet.icon + ' ' + planet.name, 'info');
            
            addMiningLog('点击开始勘探消耗负荷进行自动勘探...', 'info');
        }
        document.getElementById('startMiningBtn').style.display = 'block';
        document.getElementById('stopMiningBtn').style.display = 'none';
    }
}

function selectGatheringPlanet(planetId) {
    const planet = GATHERING_PLANETS.find(p => p.id === planetId);
    if (!planet) return;

    selectedGatheringPlanet = planet;
    selectedGatheringZone = null;

    // 检查是否有区域配置
    const zones = GATHERING_ZONES[planetId];
    if (zones && zones.length > 0) {
        // 有区域，进入区域选择页（第2页）
        enterGatheringZones(planet, zones);
    } else {
        // 无区域，直接跳转到回收页面
        document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
        document.getElementById('page-gathering').classList.remove('hidden');
        const log = document.getElementById('gatheringLog');
        if (log) {
            log.innerHTML = '';
            addGatheringLog('🌍 已抵达 ' + planet.icon + ' ' + planet.name, 'info');
            addGatheringLog('点击开始回收消耗负荷进行自动回收...', 'info');
        }
        											const scanBtn = document.getElementById('scanPlantBtn');
        											const stopBtn = document.getElementById('stopGatheringBtn');
        											if (scanBtn) scanBtn.style.display = 'block';
        											if (stopBtn) stopBtn.style.display = 'none';
    }
}
					
										// 从确认页返回：如果有区域则返回区域页，否则返回星球页
										function backToGatheringStarMap() {
										    if (selectedGatheringPlanet && GATHERING_ZONES[selectedGatheringPlanet.id] && GATHERING_ZONES[selectedGatheringPlanet.id].length > 0) {
										        const zones = GATHERING_ZONES[selectedGatheringPlanet.id];
										        enterGatheringZones(selectedGatheringPlanet, zones);
										    } else {
										        selectedGatheringPlanet = null;
										        selectedGatheringZone = null;
										        document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
										        document.getElementById('page-gathering-select').classList.remove('hidden');
										        renderGatheringPlanetSelect();
										    }
										}
										
// 进入勘探区域选择页（第2页）
function enterMiningZones(planet, zones) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-mining-zones').classList.remove('hidden');

    const grid = document.getElementById('miningZoneGrid');
    const playerLevel = getCurrentWarframeData().level;

    grid.innerHTML = zones.map(zone => {
        const isLocked = zone.locked === true;
        const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
        const onclick = isLocked ? '' : `onclick="selectMiningZone('${zone.id}')"`;

        return `
            <div style="background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
                        border-radius: 10px; padding: 15px; text-align: center; transition: all 0.3s; ${lockedStyle}"
                 ${onclick}>
                <div style="font-size: 2.5rem; margin-bottom: 8px;">${zone.icon}</div>
                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1rem; margin-bottom: 4px;">${zone.name}</div>
                <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">${zone.desc}</div>
                
                <div style="color: #666; font-size: 0.7rem; margin-top: 4px;">
                    ${isLocked ? '🔒 暂未开放' : ''}
                </div>
            </div>
        `;
    }).join('');

    // 隐藏确认面板，显示区域网格
    document.getElementById('selectedMiningZoneInfo').style.display = 'none';
    document.getElementById('miningZoneGrid').style.display = 'grid';
}
										

// 选择勘探区域 → 显示确认面板
function selectMiningZone(zoneId) {
    const zones = MINING_ZONES[selectedMiningPlanet.id];
    if (!zones) return;

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    selectedMiningZone = zone;
    
    // ========== 修复：根据星球 ID 映射 regionId ==========
    const planetToRegion = {
        'earth_mine': 'beast_bone',
        'mars_mine': 'blue_red_crystal',
        'void_mine': 'symbiotic',
        'lua_mine': 'symbiotic'
    };
    selectedMiningZone.regionId = planetToRegion[selectedMiningPlanet.id] || 'beast_bone';
    // ==========================================
    
    // 直接跳转到矿区任务确认页
    showMiningConfirm();
}
	
	// 确认勘探区域并开始
	function confirmMiningAndStart() {
	    if (!selectedMiningZone) {
	        showToast('请先选择一个区域', 'error');
	        return;
	    }
	    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
	    document.getElementById('page-mining').classList.remove('hidden');
	    const log = document.getElementById('miningLog');
	    if (log) {
	        log.innerHTML = '';
	        addMiningLog('🌍 已抵达 ' + selectedMiningPlanet.icon + ' ' + selectedMiningPlanet.name + ' - ' + selectedMiningZone.name, 'info');
	        addMiningLog('点击开始勘探消耗负荷进行自动勘探...', 'info');
	    }
	    document.getElementById('startMiningBtn').style.display = 'block';
	    document.getElementById('stopMiningBtn').style.display = 'none';
	}
	
	// 确认回收区域并开始
	function confirmGatheringAndStart() {
	    if (!selectedGatheringZone) {
	        showToast('请先选择一个区域', 'error');
	        return;
	    }
	    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
	    document.getElementById('page-gathering').classList.remove('hidden');
	    const log = document.getElementById('gatheringLog');
	    if (log) {
	        log.innerHTML = '';
	        addGatheringLog('🌍 已抵达 ' + selectedGatheringPlanet.icon + ' ' + selectedGatheringPlanet.name + ' - ' + selectedGatheringZone.name, 'info');
	        addGatheringLog('点击开始回收消耗负荷进行自动回收...', 'info');
	    }
	            const scanBtn = document.getElementById('scanPlantBtn');
	            const stopBtn = document.getElementById('stopGatheringBtn');
	            if (scanBtn) scanBtn.style.display = 'block';
	            if (stopBtn) stopBtn.style.display = 'none';
	}									

// 从区域页返回星球选择页（第1层）
function backToMiningPlanets() {
    selectedMiningZone = null;
    selectedMiningPlanet = null;
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-mining-select').classList.remove('hidden');
    renderMiningPlanetSelect();
}
										
										// 进入回收区域选择页（第2页）
										function enterGatheringZones(planet, zones) {
											    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
											    document.getElementById('page-gathering-zones').classList.remove('hidden');

											    const grid = document.getElementById('gatheringZoneGrid');

											    grid.innerHTML = zones.map(zone => {
											        const isLocked = zone.locked === true;
											        const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
											        const onclick = isLocked ? '' : `onclick="selectGatheringZone('${zone.id}')"`;

											        return `
											            <div style="background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
											                        border-radius: 10px; padding: 15px; text-align: center; transition: all 0.3s; ${lockedStyle}"
											                 ${onclick}>
											                <div style="font-size: 2.5rem; margin-bottom: 8px;">${zone.icon}</div>
											                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1rem; margin-bottom: 4px;">${zone.name}</div>
											                <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">${zone.desc}</div>
											                
											                <div style="color: #666; font-size: 0.7rem; margin-top: 4px;">
											                    ${isLocked ? '🔒 暂未开放' : ''}
											                </div>
											            </div>
											        `;
											    }).join('');

											    // 隐藏确认面板，显示区域网格
											    document.getElementById('selectedGatheringZoneInfo').style.display = 'none';
											    document.getElementById('gatheringZoneGrid').style.display = 'grid';
											}

// 选择回收区域 → 显示确认面板// 选择回收区域 → 显示确认面板
function selectGatheringZone(zoneId) {
    const zones = GATHERING_ZONES[selectedGatheringPlanet.id];
    if (!zones) return;

    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    selectedGatheringZone = zone;
    
    // 直接跳转到回收区任务确认页
    showGatheringConfirm();
}
										
// 显示勘探任务确认页（第3页）
function showMiningConfirm() {
    if (!selectedMiningZone) {
        showToast('请先选择一个区域', 'error');
        return;
    }
    
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-mining-confirm').classList.remove('hidden');
    
    // 填充确认信息
    document.getElementById('miningConfirmIcon').textContent = selectedMiningZone.icon;
    document.getElementById('miningConfirmName').textContent = selectedMiningZone.name;
    document.getElementById('miningConfirmDesc').textContent = selectedMiningZone.desc;
    
    
    document.getElementById('miningConfirmPanel').style.display = 'block';
}

// 显示回收任务确认页（第3页）
function showGatheringConfirm() {
    if (!selectedGatheringZone) {
        showToast('请先选择一个区域', 'error');
        return;
    }
    
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-gathering-confirm').classList.remove('hidden');
    
    // 填充确认信息
    document.getElementById('gatheringConfirmIcon').textContent = selectedGatheringZone.icon;
    document.getElementById('gatheringConfirmName').textContent = selectedGatheringZone.name;
    document.getElementById('gatheringConfirmDesc').textContent = selectedGatheringZone.desc;
    
    document.getElementById('gatheringConfirmPanel').style.display = 'block';
}

// 开始勘探任务（从确认页进入勘探界面）- 不消耗负荷
function startMiningMission() {
    // 切换页面，不扣负荷
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-mining').classList.remove('hidden');
    
    const log = document.getElementById('miningLog');
    if (log) {
        log.innerHTML = '';
        addMiningLog('🌍 已抵达 ' + selectedMiningPlanet.icon + ' ' + selectedMiningPlanet.name + ' - ' + selectedMiningZone.name, 'info');
       addMiningLog(`点击"扫描矿脉"消耗负荷进行扫描...`, 'info');
    }
    
    // 重置按钮状态
    const scanBtn = document.getElementById('scanVeinBtn');
    const mineBtn = document.getElementById('mineNodeBtn');
    const coolBtn = document.getElementById('cooldownBtn');
    const stopBtn = document.getElementById('stopMiningBtn');
    
    if (scanBtn) scanBtn.style.display = 'block';
    if (mineBtn) mineBtn.style.display = 'none';
    if (coolBtn) coolBtn.style.display = 'none';
    if (stopBtn) stopBtn.style.display = 'none';
    
    // 重置显示区域
    const idleState = document.getElementById('veinIdleState');
    const veinNodes = document.getElementById('veinNodes');
    const veinInfo = document.getElementById('currentVeinInfo');
    const scannerBg = document.getElementById('miningScannerBg');
    const dropsContainer = document.getElementById('miningDrops');
    
    if (idleState) idleState.style.display = 'block';
    if (veinNodes) veinNodes.style.display = 'none';
    if (veinInfo) veinInfo.style.display = 'none';
    if (scannerBg) scannerBg.style.opacity = '0';
    if (dropsContainer) dropsContainer.innerHTML = '';
    
    // 重置勘探状态
    warframeMiningState.active = false;
    warframeMiningState.mining = false;
    warframeMiningState.scanning = false;
    warframeMiningState.cooling = false;
    warframeMiningState.heat = 0;
    warframeMiningState.totalMines = 0;
    warframeMiningState.perfectMines = 0;
    updateHeatDisplay();
}

// 开始回收任务（从确认页进入回收界面）
function startGatheringMission() {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-gathering').classList.remove('hidden');
    
    const log = document.getElementById('gatheringLog');
    if (log) {
        log.innerHTML = '';
        addGatheringLog('🌍 已抵达 ' + selectedGatheringPlanet.icon + ' ' + selectedGatheringPlanet.name + ' - ' + selectedGatheringZone.name, 'info');
		addGatheringLog('点击"扫描容器"消耗负荷进行扫描...', 'info');
    }
    
        const scanBtn = document.getElementById('scanPlantBtn');
        const stopBtn = document.getElementById('stopGatheringBtn');
        if (scanBtn) scanBtn.style.display = 'block';
        if (stopBtn) stopBtn.style.display = 'none';
}

// 从确认页返回区域选择页
function backToMiningZones() {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-mining-zones').classList.remove('hidden');
}

function backToGatheringZones() {
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-gathering-zones').classList.remove('hidden');
}	
									
// 从区域页返回星球选择页（第1层）
function backToGatheringPlanets() {
    selectedGatheringZone = null;
    selectedGatheringPlanet = null;
    document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('page-gathering-select').classList.remove('hidden');
    renderGatheringPlanetSelect();
}
										
										// 修改返回函数
										function backToGatheringStarMap() {
										    if (selectedGatheringPlanet && GATHERING_ZONES[selectedGatheringPlanet.id]) {
										        const zones = GATHERING_ZONES[selectedGatheringPlanet.id];
										        enterGatheringZones(selectedGatheringPlanet, zones);
										    } else {
										        selectedGatheringPlanet = null;
										        selectedGatheringZone = null;
										        document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
										        document.getElementById('page-gathering-select').classList.remove('hidden');
										        renderGatheringPlanetSelect();
										    }
										}
										
					
										function confirmMiningMission() {
											if (!selectedMiningPlanet) {
												showToast('请先选择一个矿区', 'error');
												return;
											}
					
											// 切换到勘探任务页面
											document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
											document.getElementById('page-mining').classList.remove('hidden');
					
											// 更新勘探UI显示当前矿区
											const log = document.getElementById('miningLog');
											if (log) {
												log.innerHTML = '';
												addMiningLog(`🌍 已抵达 ${selectedMiningPlanet.icon} ${selectedMiningPlanet.name}`, 'info');
												addMiningLog(`点击"开始勘探"消耗负荷进行勘探...`, 'info');
											}
					
											// 重置按钮状态
											document.getElementById('startMiningBtn').style.display = 'block';
											document.getElementById('stopMiningBtn').style.display = 'none';
										}
					
										function renderGatheringPlanetSelect() {
											const grid = document.getElementById('gatheringPlanetGrid');
											if (!grid) return;
					
											const playerLevel = getCurrentWarframeData().level;
											
											grid.innerHTML = GATHERING_PLANETS.map(planet => {
												const isLocked = planet.locked === true;
												const lockedClass = isLocked ? 'locked' : '';
												const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
												const onclick = isLocked ? '' : `onclick="selectGatheringPlanet('${planet.id}')"`;
												const planetColor = planet.color || '#4eff4e';
					
												return `
					            <div class="planet-card ${lockedClass}" ${onclick}
					                 style="position: relative; background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planetColor}; 
					                        border-radius: 12px; overflow: hidden; transition: all 0.3s; ${lockedStyle};
					                        aspect-ratio: 4/3;">
					                <div style="position: absolute; inset: 0; z-index: 1;">
					                    ${planet.image ? `
					                        <img src="${planet.image}" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" 
					                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);\\'><span style=\\'font-size: 4rem;\\'>${planet.icon}</span></div>';">
					                    ` : `
					                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
					                            <span style="font-size: 4rem;">${planet.icon}</span>
					                        </div>
					                    `}
					                </div>
					                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%); z-index: 2; pointer-events: none;"></div>
					                <div style="position: absolute; bottom: 0; right: 0; left: 0; padding: 15px; z-index: 3; text-align: right; pointer-events: none;">
					                    <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.1rem; margin-bottom: 3px; text-shadow: 0 0 8px rgba(0,0,0,0.8);">${planet.name}</div>
					                    
					                    
					                    <div style="color: #666; font-size: 0.7rem; text-shadow: 0 0 6px rgba(0,0,0,0.8);">${isLocked ? '🔒 暂未开放' : ''}</div>
					                </div>
					            </div>
					        `;
											}).join('');
										}
					
										
					
										function backToGatheringStarMap() {
											selectedGatheringPlanet = null;
											document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
											document.getElementById('page-gathering-select').classList.remove('hidden');
											renderGatheringPlanetSelect();
										}
					
										function confirmGatheringMission() {
											if (!selectedGatheringPlanet) {
												showToast('请先选择一个回收区', 'error');
												return;
											}
					
											// 切换到回收任务页面
											document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
											document.getElementById('page-gathering').classList.remove('hidden');
					
											// 更新回收UI显示当前区域
											const log = document.getElementById('gatheringLog');
											if (log) {
												log.innerHTML = '';
												addGatheringLog(`🌍 已抵达 ${selectedGatheringPlanet.icon} ${selectedGatheringPlanet.name}`, 'info');
												
												            addGatheringLog('点击"扫描容器"消耗负荷进行扫描...', 'info');
											}
					
											// 重置按钮状态
																						const scanBtn = document.getElementById('scanPlantBtn');
																						const stopBtn = document.getElementById('stopGatheringBtn');
																						if (scanBtn) scanBtn.style.display = 'block';
																						if (stopBtn) stopBtn.style.display = 'none';
										}
										
					// 区域分类配置
					var PLANET_REGIONS = {
						all: {
							name: '全部',
							filter: null
						},
						grineer: {
							name: 'Grineer',
							filter: 'grineer'
						},
						corpus: {
							name: 'Corpus',
							filter: 'corpus'
						},
						infested: {
							name: 'Infested',
							filter: 'infested'
						},
						sentient: {
							name: 'Sentient',
							filter: 'sentient'
						}
					};

					let currentRegionFilter = 'all';

					// 选择派系内的星球
					function selectFactionPlanet(factionId, planetId) {
						const config = FACTION_CONFIG[factionId];
						const planets = window[config.planets];
						const planet = planets.find(p => p.id === planetId);
						if (!planet) return;

						selectedFactionPlanet = planet;
						selectedFactionZone = null;

						const zones = window[config.zones];

						// 如果有区域配置，直接进入第3页
						if (zones && zones[planetId] && zones[planetId].length > 0) {
							enterFactionZones(factionId, planet, zones[planetId]);
						} else {
							// 无区域，在第2页显示确认面板
							showFactionPlanetConfirm(factionId, planet);
						}
					}

					// 渲染派系内的区域选择
					function renderFactionZones(factionId, planet, zones) {
						const infoId = 'selectedPlanetInfo-' + factionId;
						const gridId = 'planetGrid-' + factionId;
						const infoEl = document.getElementById(infoId);

						const playerLevel = getCurrentWarframeData().level;

						const zonesHtml = zones.map(zone => {
							const isLocked = zone.locked === true;
							const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
							const onclick = isLocked ? '' : `onclick="selectFactionZone('${factionId}', '${planet.id}', '${zone.id}')"`;

							return `
            <div style="background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
                        border-radius: 10px; padding: 15px; text-align: center; transition: all 0.3s; ${lockedStyle}"
                 ${onclick}>
                <div style="font-size: 2.5rem; margin-bottom: 8px;">${zone.icon}</div>
                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1rem; margin-bottom: 4px;">${zone.name}</div>
                <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">${zone.desc}</div>
                
                <div style="color: #666; font-size: 0.7rem; margin-top: 4px;">
                    ${isLocked ? '🔒 暂未开放' : ''}
                </div>
            </div>
        `;
						}).join('');

						infoEl.innerHTML =
							`
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">${planet.icon}</div>
            <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.3rem; margin-bottom: 5px;">${planet.name}</div>
            <div style="color: #888; font-size: 0.85rem; margin-bottom: 8px;">${planet.desc}</div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: var(--tenno-gold); font-family: 'Orbitron'; font-size: 1rem; margin-bottom: 12px; 
                        text-align: center; letter-spacing: 2px;">
                📍 选择区域
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px;">
                ${zonesHtml}
            </div>
        </div>
        
        <div id="zoneConfirm-${factionId}" style="display: none; margin-top: 20px; padding: 15px; 
                                         background: rgba(0,0,0,0.3); border-radius: 10px; text-align: center;">
            <div style="color: #888; font-size: 0.85rem; margin-bottom: 10px;">
                已选择: <span id="selectedZoneName-${factionId}" style="color: var(--tenno-gold); font-family: 'Orbitron';">--</span>
            </div>
            <button class="btn" onclick="confirmFactionZoneBattle('${factionId}')" style="width: 200px; background: linear-gradient(135deg, ${planet.color}, #ff6666);">
                ⚔️ 前往肃清 (-3⚡)
            </button>
        </div>
        
        <button class="back-btn" onclick="backToFactionPlanets('${factionId}')" style="margin-top: 15px;">
            ← 返回${planet.factionName}星域
        </button>
    `;

						document.getElementById(gridId).style.display = 'none';
						infoEl.style.display = 'block';
						window['selectedZone_' + factionId] = null;
					}

					// 选择派系内的区域
					function selectFactionZone(factionId, planetId, zoneId) {
						const config = FACTION_CONFIG[factionId];
						const zones = window[config.zones];
						if (!zones || !zones[planetId]) return;

						const zone = zones[planetId].find(z => z.id === zoneId);
						if (!zone) return;

						window['selectedZone_' + factionId] = zone;
						window['selectedPlanet_' + factionId] = window[config.planets].find(p => p.id === planetId);

						const confirmArea = document.getElementById('zoneConfirm-' + factionId);
						const zoneNameEl = document.getElementById('selectedZoneName-' + factionId);

						if (zoneNameEl) zoneNameEl.textContent = zone.name;
						if (confirmArea) confirmArea.style.display = 'block';
					}

					// 确认派系星球肃清（无区域）
					function confirmFactionBattle(factionId) {
						const planet = window['selectedPlanet_' + factionId];
						if (!planet) {
							showToast('请先选择一个星球', 'error');
							return;
						}

						selectedPlanet = planet;
						selectedZone = null;
						battlePageEntered = true;

						enterBattlePage();
					}

					// 确认派系区域肃清
					function confirmFactionZoneBattle(factionId) {
						if (!selectedFactionPlanet || !selectedFactionZone) {
							showToast('请先选择星球和区域', 'error');
							return;
						}

						// 关键修复：同时设置全局的 selectedPlanet 和 selectedZone，供肃清系统使用
						selectedPlanet = selectedFactionPlanet;
						selectedZone = selectedFactionZone; // ← 这里之前用的是未定义的全局 selectedZone
						battlePageEntered = true;

						enterBattlePage();
					}

					// 进入肃清页面的统一函数
					function enterBattlePage() {
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-dashboard').classList.remove('hidden');

						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
						const battleNav = Array.from(document.querySelectorAll('.nav-item')).find(el =>
							el.textContent.includes('肃清')
						);
						if (battleNav) battleNav.classList.add('active');

						updateBattleUI();

						const startBtn = document.getElementById('startBattleBtn');
						const continueBtn = document.getElementById('continueBattleBtn');
						const stopBtn = document.getElementById('stopBattleBtn');

						if (startBtn) {
							startBtn.style.display = 'block';
							startBtn.textContent = '🌍 肃清导航';
						}
						if (continueBtn) {
							continueBtn.style.display = 'block';
							continueBtn.classList.remove('btn-auto-mode');
							continueBtn.disabled = false;
							const btnText = document.getElementById('continueBattleBtnText');
							if (btnText) btnText.textContent = '⚔️ 肃清(-10⚡) ⚔';
						}
						if (stopBtn) stopBtn.style.display = 'none';

						const log = document.getElementById('autoBattleLog');
						if (log) {
							log.innerHTML = '';
							if (selectedZone) {
							    addBattleLog(`🌍 已抵达 ${selectedPlanet.icon} ${selectedPlanet.name}`, 'info');
							    addBattleLog(`📍 ${selectedZone.icon} ${selectedZone.name} - ${selectedZone.desc}`, 'info');
							} else {
							    addBattleLog(`🌍 已抵达 ${selectedPlanet.icon} ${selectedPlanet.name}，点击"继续肃清"开始肃清（-${STAMINA_BATTLE_COST}⚡）`, 'info');
							}
						}
					}

					// 返回派系星球列表（从第3页返回第2页）
					function backToFactionPlanets(factionId) {
						const config = FACTION_CONFIG[factionId];
						if (!config) {
							console.error('backToFactionPlanets: 未知派系', factionId);
							return;
						}

						// 隐藏所有页面
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));

						// 显示第2页
						const page2El = document.getElementById(config.page2);
						if (!page2El) {
							console.error('backToFactionPlanets: 找不到第2页元素', config.page2);
							return;
						}
						page2El.classList.remove('hidden');

						// 重置区域选择状态
						selectedFactionZone = null;

						// 关键：重置第2页的确认面板，显示星球网格
						const gridId = 'planetGrid-' + factionId;
						const infoId = 'selectedPlanetInfo-' + factionId;

						const gridEl = document.getElementById(gridId);
						const infoEl = document.getElementById(infoId);

						if (gridEl) gridEl.style.display = 'grid';
						if (infoEl) infoEl.style.display = 'none';

						// 重新渲染第2页
						renderFactionPlanets(factionId);
					}

					// 返回星图导航（从派系页面）
					function backToStarMap() {
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-planetselect').classList.remove('hidden');

						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
						const navItems = document.querySelectorAll('.nav-item');
						for (let i = 0; i < navItems.length; i++) {
							const onclick = navItems[i].getAttribute('onclick');
							if (onclick && onclick.includes("'planetselect'")) {
								navItems[i].classList.add('active');
								break;
							}
						}

						currentFaction = null;
						renderPlanetSelect();
					}

					// 进入派系二级页面
					function enterFactionZone(factionId) {
						const config = FACTION_CONFIG[factionId];
						if (!config) {
							showToast('该派系暂未开放6', 'warning');
							return;
						}

						currentFaction = factionId;
						selectedFactionPlanet = null;
						selectedFactionZone = null;

						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById(config.page2).classList.remove('hidden');

						renderFactionPlanets(factionId);
					}

					// 渲染派系星球列表（第2页）
					function renderFactionPlanets(factionId) {
						const config = FACTION_CONFIG[factionId];
						const planets = window[config.planets];
						const gridId = 'planetGrid-' + factionId;
						const infoId = 'selectedPlanetInfo-' + factionId;

						const grid = document.getElementById(gridId);
						if (!grid) return;

						const playerLevel = getCurrentWarframeData().level;

						// 始终显示网格，隐藏确认面板（第2页只显示星球列表）
						if (grid) grid.style.display = 'grid';
						const infoEl = document.getElementById(infoId);
						if (infoEl) infoEl.style.display = 'none';

						grid.innerHTML = planets.map(planet => {
							const isLocked = planet.locked === true;
							const lockedClass = isLocked ? 'locked' : '';
							const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
							const onclick = isLocked ? '' : `onclick="selectFactionPlanet('${factionId}', '${planet.id}')"`;

							return `
            <div class="planet-card ${lockedClass}" ${onclick}
                 style="background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
                        border-radius: 12px; padding: 20px; text-align: center; transition: all 0.3s; ${lockedStyle}">
                <div style="font-size: 3rem; margin-bottom: 10px;">${planet.icon}</div>
                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.1rem; margin-bottom: 5px;">${planet.name}</div>
                
                
                <div style="color: #666; font-size: 0.7rem;">${isLocked ? '🔒 暂未开放' : ''}</div>
            </div>
        `;
						}).join('');
					}

					// 选择派系内的星球
					function selectFactionPlanet(factionId, planetId) {
						const config = FACTION_CONFIG[factionId];
						const planets = window[config.planets];
						const planet = planets.find(p => p.id === planetId);
						if (!planet) return;

						selectedFactionPlanet = planet;
						selectedFactionZone = null;

						const zones = window[config.zones];

						// 如果有区域配置，进入区域选择（第3页）
						if (zones && zones[planetId] && zones[planetId].length > 0) {
							enterFactionZones(factionId, planet, zones[planetId]);
						} else {
							// 无区域，直接显示确认
							showFactionPlanetConfirm(factionId, planet);
						}
					}

					// 显示星球确认信息（无区域时在第2页显示）
					function showFactionPlanetConfirm(factionId, planet) {
						const config = FACTION_CONFIG[factionId];
						const infoId = 'selectedPlanetInfo-' + factionId;
						const gridId = 'planetGrid-' + factionId;

						// 更新确认面板内容
						const iconEl = document.getElementById('selectedPlanetIcon-' + factionId);
						const nameEl = document.getElementById('selectedPlanetName-' + factionId);
						const descEl = document.getElementById('selectedPlanetDesc-' + factionId);
						const levelEl = document.getElementById('selectedPlanetLevel-' + factionId);
						const factionEl = document.getElementById('selectedPlanetFaction-' + factionId);
						const dropEl = document.getElementById('selectedPlanetDrop-' + factionId);

						if (iconEl) iconEl.textContent = planet.icon;
						if (nameEl) nameEl.textContent = planet.name;
						if (descEl) descEl.textContent = planet.desc;
						if (levelEl) levelEl.textContent = planet.level;
						if (factionEl) factionEl.textContent = planet.factionName;
						if (dropEl) dropEl.textContent = planet.dropMult;

						// 显示确认面板，隐藏网格
						document.getElementById(gridId).style.display = 'none';
						document.getElementById(infoId).style.display = 'block';
					}

					// 进入派系区域选择（第3页）
					function enterFactionZones(factionId, planet, zones) {
						const config = FACTION_CONFIG[factionId];

						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById(config.page3).classList.remove('hidden');

						// 重置区域选择状态
						selectedFactionZone = null;
						selectedFactionParentZone = null;

						renderFactionZones(factionId, planet, zones);
					}

					// 渲染区域列表
					function renderFactionZones(factionId, planet, zones) {
						const gridId = 'zoneGrid-' + factionId;
						const infoId = 'selectedZoneInfo-' + factionId;

						const grid = document.getElementById(gridId);
						if (!grid) return;

						const playerLevel = getCurrentWarframeData().level;

						grid.innerHTML = zones.map(zone => {
							const isLocked = zone.locked === true;
							const hasSubZones = Array.isArray(zone.subZones) && zone.subZones.length > 0;
							const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
							const onclick = isLocked ? '' : (hasSubZones ? `onclick="enterFactionSubZones('${factionId}', '${zone.id}')"` : `onclick="selectFactionZone('${factionId}', '${zone.id}')"`);

							return `
            <div style="background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
                        border-radius: 10px; padding: 15px; text-align: center; transition: all 0.3s; ${lockedStyle}"
                 ${onclick}>
                <div style="font-size: 2.5rem; margin-bottom: 8px;">${zone.icon}</div>
                <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1rem; margin-bottom: 4px;">${zone.name}</div>
                <div style="color: #888; font-size: 0.75rem; margin-bottom: 4px;">${zone.desc}</div>
                
                <div style="color: #666; font-size: 0.7rem; margin-top: 4px;">
                    ${isLocked ? '🔒 暂未开放' : (hasSubZones ? '↳ 首领战场 ' + zone.subZones.length + ' 个' : '')}
                </div>
            </div>
        `;
						}).join('');

						// 隐藏确认面板，显示网格
						document.getElementById(infoId).style.display = 'none';
						document.getElementById(gridId).style.display = 'grid';
					}

					function enterFactionSubZones(factionId, zoneId) {
						const config = FACTION_CONFIG[factionId];
						const zones = window[config.zones];
						let planetId = selectedFactionPlanet ? selectedFactionPlanet.id : null;

						// 兜底：如果 selectedFactionPlanet 丢失，从 zones 中反查
						if (!planetId && zones) {
							for (var pid in zones) {
								if (zones[pid] && zones[pid].find(z => z.id === zoneId)) {
									planetId = pid;
									break;
								}
							}
						}

						if (!planetId || !zones || !zones[planetId]) return;

						const parentZone = zones[planetId].find(z => z.id === zoneId);
						if (!parentZone || !Array.isArray(parentZone.subZones)) return;

						selectedFactionParentZone = parentZone;
						selectedFactionZone = null;
						renderFactionZones(factionId, parentZone, parentZone.subZones);
					}

					// 选择区域
					function selectFactionZone(factionId, zoneId) {
						const config = FACTION_CONFIG[factionId];
						const zones = window[config.zones];
						if (!zones) return;

						let planetId = selectedFactionPlanet ? selectedFactionPlanet.id : null;

						// 兜底：如果 selectedFactionPlanet 丢失，从 zones 中反查
						if (!planetId && zones) {
							for (var pid in zones) {
								if (zones[pid] && zones[pid].find(z => z.id === zoneId)) {
									planetId = pid;
									break;
								}
							}
						}

						if (!planetId || !zones[planetId]) return;

						let zone = zones[planetId].find(z => z.id === zoneId);
						if (!zone && selectedFactionParentZone && Array.isArray(selectedFactionParentZone.subZones)) {
							zone = selectedFactionParentZone.subZones.find(z => z.id === zoneId);
						}
						if (!zone) return;

						selectedFactionZone = zone;

						document.getElementById('selectedZoneIcon-' + factionId).textContent = zone.icon;
						document.getElementById('selectedZoneName-' + factionId).textContent = zone.name;
						document.getElementById('selectedZoneDesc-' + factionId).textContent = zone.desc;
						
						

						document.getElementById('zoneGrid-' + factionId).style.display = 'none';
						document.getElementById('selectedZoneInfo-' + factionId).style.display = 'block';
					}

					// 确认派系星球肃清（无区域）
					function confirmFactionBattle(factionId) {
						if (!selectedFactionPlanet) {
							showToast('请先选择一个星球', 'error');
							return;
						}

						selectedPlanet = selectedFactionPlanet;
						selectedZone = null;
						battlePageEntered = true;

						enterBattlePage();
					}

					// 确认派系区域肃清
					function confirmFactionZoneBattle(factionId) {
						if (!selectedFactionPlanet || !selectedFactionZone) {
							showToast('请先选择星球和区域', 'error');
							return;
						}

						selectedPlanet = selectedFactionPlanet;
						selectedZone = selectedFactionZone;
						battlePageEntered = true;

						enterBattlePage();
					}

					// 返回派系星球列表（从第3页）
					function backToFactionPlanets(factionId) {
						const config = FACTION_CONFIG[factionId];

						if (selectedFactionParentZone && selectedFactionPlanet) {
							const zones = window[config.zones];
							selectedFactionParentZone = null;
							selectedFactionZone = null;
							if (zones && zones[selectedFactionPlanet.id]) {
								enterFactionZones(factionId, selectedFactionPlanet, zones[selectedFactionPlanet.id]);
								return;
							}
						}

						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById(config.page2).classList.remove('hidden');

						// 关键修复：重置区域选择状态，但保留星球选择，这样用户可以重新选区域或换星球
						selectedFactionZone = null;
						selectedFactionParentZone = null;

						// 重新渲染第2页，确保状态正确
						renderFactionPlanets(factionId);
					}

					// 返回星图导航（从第2页）
					function backToStarMap() {
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-planetselect').classList.remove('hidden');

						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
						const navItems = document.querySelectorAll('.nav-item');
						for (let i = 0; i < navItems.length; i++) {
							const onclick = navItems[i].getAttribute('onclick');
							if (onclick && onclick.includes("'planetselect'")) {
								navItems[i].classList.add('active');
								break;
							}
						}

						// 关键修复：彻底重置所有派系选择状态
						currentFaction = null;
						selectedFactionPlanet = null;
						selectedFactionZone = null;
						selectedPlanet = null;
						selectedZone = null;

						renderPlanetSelect();
					}

					// 统一的进入肃清页面函数
					function enterBattlePage() {
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-dashboard').classList.remove('hidden');

						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
						const battleNav = Array.from(document.querySelectorAll('.nav-item')).find(el =>
							el.textContent.includes('肃清')
						);
						if (battleNav) battleNav.classList.add('active');

						updateBattleUI();

						const startBtn = document.getElementById('startBattleBtn');
						const continueBtn = document.getElementById('continueBattleBtn');
						const stopBtn = document.getElementById('stopBattleBtn');

						if (startBtn) {
							startBtn.style.display = 'block';
							startBtn.textContent = '🌍 肃清导航';
						}
						if (continueBtn) {
							continueBtn.style.display = 'block';
							continueBtn.classList.remove('btn-auto-mode');
							continueBtn.disabled = false;
							const btnText = document.getElementById('continueBattleBtnText');
							if (btnText) btnText.textContent = '⚔️ 肃清(-3⚡)';
						}
						if (stopBtn) stopBtn.style.display = 'none';

						const log = document.getElementById('autoBattleLog');
						if (log) {
							log.innerHTML = '';
							if (selectedZone) {
								addBattleLog(`🌍 已抵达 ${selectedPlanet.icon} ${selectedPlanet.name}`, 'info');
								addBattleLog(`📍 ${selectedZone.icon} ${selectedZone.name} - ${selectedZone.desc}`, 'info');
								
							} else {
								addBattleLog(`🌍 已抵达 ${selectedPlanet.icon} ${selectedPlanet.name}，点击"继续肃清"开始肃清（-${STAMINA_BATTLE_COST}⚡）`,
									'info');
							}
						}
					}

					function switchRegion(regionKey) {
						currentRegionFilter = regionKey;
						renderPlanetSelect();
					}

					function selectPlanet(planetId) {
						const planet = PLANETS.find(p => p.id === planetId);
						if (!planet) return;

						selectedPlanet = planet;

						// 检查是否有区域配置
						const zones = PLANET_ZONES[planetId];

						if (zones && zones.length > 0) {
							// 有区域配置，显示区域选择界面
							renderPlanetZones(planet, zones);
						} else {
							// 无区域配置，显示原来的确认界面
							const iconEl = document.getElementById('selectedPlanetIcon');
							if (planet.image) {
								iconEl.innerHTML =
									`<img src="${planet.image}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 50%; border: 2px solid ${planet.color}" onerror="this.style.display='none'; this.parentElement.textContent='${planet.icon}'">`;
							} else {
								iconEl.textContent = planet.icon;
							}
							document.getElementById('selectedPlanetName').textContent = planet.name;
							document.getElementById('selectedPlanetDesc').textContent = planet.desc;
							
							document.getElementById('selectedPlanetFaction').textContent = planet.factionName;
							

							document.getElementById('planetGrid').style.display = 'none';
							document.getElementById('selectedPlanetInfo').style.display = 'block';
						}
					}

					function getCurrentWarframeData() {
					    if (!gameData) return { level: 1, xp: 0, max_xp: 100 };
					
					    const type = gameData.warframe_type || 'excalibur';
					    
					    // 确保 warframe_levels 存在
					    if (!gameData.warframe_levels) {
					        gameData.warframe_levels = {};
					    }
					    
					    // 确保当前战甲的数据存在
					    if (!gameData.warframe_levels[type]) {
					        gameData.warframe_levels[type] = {
					            level: gameData.warframe_level || 1,
					            xp: gameData.warframe_xp || 0,
					            max_xp: gameData.warframe_max_xp || 1000
					        };
					    }
					    
					    return gameData.warframe_levels[type];
					}

// 根据敌人 cardType 获取固定经验值
function getEnemyXP(enemy) {
    const cardType = enemy.cardType || 'normal';
    const baseXP = {
        'normal': 100,
        'elite': 200,
        'boss': 300,
        'mechanic': 400,
        'super': 500
    };
    return baseXP[cardType] || 100;
}

function addXP(amount) {
    if (!gameData) return;

    const type = gameData.warframe_type || 'excalibur';
    if (!gameData.warframe_levels) {
        gameData.warframe_levels = {};
    }
    if (!gameData.warframe_levels[type]) {
        gameData.warframe_levels[type] = {
            level: gameData.warframe_level || 1,
            xp: gameData.warframe_xp || 0,
            max_xp: gameData.warframe_max_xp || 1000
        };
    }

    const wfData = gameData.warframe_levels[type];
    
    // 等级上限50级
    const MAX_LEVEL = 50;
    
    // 已达上限，不再获得经验
    if (wfData.level >= MAX_LEVEL) {
        wfData.xp = 0;
        wfData.max_xp = 0;  // 满级时显示 0 或 MAX
        gameData.warframe_level = wfData.level;
        gameData.warframe_xp = wfData.xp;
        gameData.warframe_max_xp = wfData.max_xp;
        return;
    }

    wfData.xp += amount;

    // 升级循环
    while (wfData.xp >= wfData.max_xp && wfData.level < MAX_LEVEL) {
        wfData.xp -= wfData.max_xp;
        wfData.level++;
        
        // 每级增加 50，封顶 1000
        var nextMax = 100 + (wfData.level - 1) * 50;
        wfData.max_xp = Math.min(1000, nextMax);
        
        showToast(`${WARFRAMES[type]?.name || '战甲'} 升到了等级 ${wfData.level}！`, 'success');
    }

    // 达到50级上限处理
    if (wfData.level >= MAX_LEVEL) {
        wfData.level = MAX_LEVEL;
        wfData.xp = 0;
        wfData.max_xp = 0;  // 满级时 max_xp 设为 0，经验条显示 MAX
        showToast(`${WARFRAMES[type]?.name || '战甲'} 已达到最高等级 ${MAX_LEVEL} 级！`, 'success');
    }

    gameData.warframe_level = wfData.level;
    gameData.warframe_xp = wfData.xp;
    gameData.warframe_max_xp = wfData.max_xp;
}

					// ═══════════════════════════════════════════════════════════════
					//  矩阵系统
					// ═══════════════════════════════════════════════════════════════
					let warehouse = [];

					// ═══════════════════════════════════════════════════════════════
					//  矩阵分类配置
					// ═══════════════════════════════════════════════════════════════
					const WAREHOUSE_CATEGORIES = [
						{ key: 'all', label: '全部' },
						{ key: 'product', label: '加工品' },
						{ key: 'mineral', label: '矿物' },
						{ key: 'material', label: '资源' }
					];

					let currentWarehouseCategory = 'all';
					let warehouseSearchQuery = '';

					// 物品分类映射
					function getItemCategory(item) {
						const name = item.name || '';
						const type = item.type || '';

						const productKeywords = ['蓝图', '设计图', 'Prime', '剑', '手枪', '步枪', '战甲', '头盔', '系统', '机体', '武器', '装备', '成品', '组件'];
						if (productKeywords.some(k => name.includes(k)) || type === 'equipment' || type === 'product' || type === 'blueprint') return 'product';

						if (name.includes('矿') || name.includes('石') || type === 'mineral') return 'mineral';

						return 'material';
					}
					
					const FOUNDRY_CATEGORIES = [
					    { key: 'all', label: '全部' },
					    { key: 'warframe', label: '战甲' },
					    { key: 'weapon', label: '武器' },
					    { key: 'product', label: '加工' }
					];
					
					let currentFoundryCategory = 'all';
					let foundrySearchQuery = '';
					
					function getFoundryCategory(recipe) {
					    const name = recipe.name || '';
					    if (name.includes('Prime') || name.includes('战甲')) return 'warframe';
					    if (name.includes('剑') || name.includes('手枪') || name.includes('步枪')) return 'weapon';
					    return 'product';
					}
					
					// ═══════════════════════════════════════════════════════════════
					//  自动匹配物品图片（新增）
					// ═══════════════════════════════════════════════════════════════
					function autoMatchItemImage(itemName) {
					    if (!itemName) return null;
					    
					    // 1. 匹配肃清掉落
					    if (typeof BATTLE_DROPS !== 'undefined') {
					        const drop = BATTLE_DROPS.find(d => itemName === d.name || itemName.includes(d.name));
					        if (drop && drop.image) return drop.image;
					    }
					    
					    // 2. 匹配矿物
					    if (typeof VEIN_TYPES !== 'undefined') {
					        const vein = VEIN_TYPES.find(v => itemName.includes(v.name));
					        if (vein && vein.image) return vein.image;
					    }
					    
					    // 3. 匹配回收物
					    if (typeof GATHERING_DROP_CONFIG !== 'undefined') {
					        for (const region in GATHERING_DROP_CONFIG) {
					            const config = GATHERING_DROP_CONFIG[region];
					            if (config && config.gatherables) {
					                const gatherable = config.gatherables.find(g => itemName.includes(g.name));
					                if (gatherable && gatherable.image) return gatherable.image;
					                // 检查 drops
					                if (config.drops) {
					                    const dropItem = config.drops.find(d => itemName.includes(d.name));
					                    if (dropItem && dropItem.image) return dropItem.image;
					                }
					            }
					        }
					    }
					    
					    // 4. 匹配重构配方
					    if (typeof FOUNDRY_RECIPES !== 'undefined') {
					        const recipe = FOUNDRY_RECIPES.find(r => itemName === r.name || itemName.includes(r.name));
					        if (recipe && recipe.image) return recipe.image;
					    }
					    
					    // 5. 匹配全局掉落
					    if (typeof GLOBAL_GATHERING_DROPS !== 'undefined') {
					        const globalDrop = GLOBAL_GATHERING_DROPS.find(d => itemName.includes(d.name));
					        if (globalDrop && globalDrop.image) return globalDrop.image;
					    }
					    
					    return null;
					}

					function addToWarehouse(name, icon, amount, type, image) {
						const existing = warehouse.find(item => item.name === name);
						if (existing) {
							existing.amount += amount;
							if (image && !existing.image) {
								existing.image = image;
							}
												} else {
													// 自动推断更精确的类型
													let inferredType = type || 'material';
													if (name.includes('蓝图') || name.includes('设计图') || name.includes('Prime') || name.includes('剑') || name.includes('枪') || name.includes('步枪') || name.includes('战甲')) inferredType = 'product';
													else if (name.includes('矿') || name.includes('石')) inferredType = 'mineral';
						
													// 如果没有图片，尝试自动匹配
													let finalImage = image || null;
													if (!finalImage) {
														finalImage = autoMatchItemImage(name);
													}
						
													warehouse.push({
														name,
														icon,
														image: finalImage,
														amount,
														type: inferredType
													});
												}
						
						// 添加物品到重构厂
						function addToFoundry(name, icon, amount, type) {
						    if (!gameData.foundry) gameData.foundry = {};
						    
						    const key = name;
						    if (!gameData.foundry[key]) {
						        gameData.foundry[key] = {
						            name: name,
						            icon: icon,
						            amount: 0,
						            type: type,
						            addedAt: new Date().toISOString()
						        };
						    }
						    gameData.foundry[key].amount += amount;
						    
						    // 显示提示
						    showToast(`重构装置: 获得 ${icon} ${name} x${amount}`, 'success');
						    
						    // 同步保存
						    if (currentUser) {
						        saveGameData();
						    }
						}

						// 实时同步到 Supabase（异步，不阻塞）
						if (currentUser && gameData) {
							gameData.warehouse = warehouse;
							saveGameData();
						}
					}

					
					// ═══════════════════════════════════════════════════════════════
					//  图片路径验证工具
					// ═══════════════════════════════════════════════════════════════
					
					// 图片缓存：已验证有效的图片URL
					var _validImageCache = new Set();
					var _invalidImageCache = new Set();
					
					/**
					 * 验证图片URL是否有效
					 * @param {string} url - 图片URL
					 * @param {function} callback - 回调函数(isValid, url)
					 */
					function validateImageUrl(url, callback) {
					    if (!url) {
					        callback(false, url);
					        return;
					    }
					    
					    // 已验证过的直接返回
					    if (_validImageCache.has(url)) {
					        callback(true, url);
					        return;
					    }
					    if (_invalidImageCache.has(url)) {
					        callback(false, url);
					        return;
					    }
					    
					    var img = new Image();
					    var timeout = setTimeout(function() {
					        img.onload = img.onerror = null;
					        _invalidImageCache.add(url);
					        callback(false, url);
					    }, 3000); // 3秒超时
					    
					    img.onload = function() {
					        clearTimeout(timeout);
					        _validImageCache.add(url);
					        callback(true, url);
					    };
					    
					    img.onerror = function() {
					        clearTimeout(timeout);
					        _invalidImageCache.add(url);
					        callback(false, url);
					    };
					    
					    img.src = url;
					}
					
					/**
					 * 批量验证矩阵图片，自动修复无效图片
					 */
					function validateWarehouseImages() {
					    if (!warehouse || warehouse.length === 0) return;
					    
					    var needReRender = false;
					    var checkCount = 0;
					    
					    warehouse.forEach(function(item) {
					        if (!item.image) return;
					        
					        validateImageUrl(item.image, function(isValid, url) {
					            checkCount++;
					            if (!isValid) {
					                console.warn('图片无效:', item.name, url);
					                item.image = null; // 清除无效图片路径
					                needReRender = true;
					            }
					            
					            // 全部检查完后重新渲染
					            if (checkCount >= warehouse.filter(function(i) { return i.image; }).length && needReRender) {
					                renderWarehouse();
					                showToast('已清理 ' + warehouse.filter(function(i) { return !i.image && i.icon; }).length + ' 个无效图片', 'warning');
					            }
					        });
					    });
					}
					
					/**
					 * 预加载图片并返回Promise
					 */
					function preloadImage(url) {
					    return new Promise(function(resolve, reject) {
					        validateImageUrl(url, function(isValid, src) {
					            if (isValid) resolve(src);
					            else reject(new Error('图片加载失败: ' + src));
					        });
					    });
					}
					
					function renderWarehouse() {
						const searchArea = document.getElementById('warehouseSearchArea');
						const tabsArea = document.getElementById('warehouseTabsArea');
						const statsArea = document.getElementById('warehouseStatsArea');
						const itemsGrid = document.getElementById('warehouseItemsGrid');

						if (!searchArea || !tabsArea || !statsArea || !itemsGrid) return;

						// 按名称排序
						const sortedWarehouse = [...warehouse].sort((a, b) => {
							const nameA = (a.name || '').toLowerCase();
							const nameB = (b.name || '').toLowerCase();
							return nameA.localeCompare(nameB, 'zh-CN');
						});

						// 过滤
						let filteredItems = sortedWarehouse;
						if (currentWarehouseCategory !== 'all') {
							filteredItems = filteredItems.filter(item => getItemCategory(item) === currentWarehouseCategory);
						}
						if (warehouseSearchQuery.trim()) {
							const query = warehouseSearchQuery.trim().toLowerCase();
							filteredItems = filteredItems.filter(item => (item.name || '').toLowerCase().includes(query));
						}

						// 1. 渲染搜索框（红色区域）
						searchArea.innerHTML = `
							<div style="max-width: 400px; margin: 0 auto; position: relative;">
								<input type="text" placeholder="🔍 搜索物品..." value="${warehouseSearchQuery}" oninput="handleWarehouseSearch(this.value)"
									style="width: 100%; padding: 12px 20px; background: rgba(0,0,0,0.5); border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 0.9rem; text-align: center; transition: all 0.3s; box-sizing: border-box;">
								${warehouseSearchQuery ? `<span onclick="clearWarehouseSearch()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #666; cursor: pointer; font-size: 1rem;">✕</span>` : ''}
							</div>
						`;
						
						
						
						// 2. 渲染分类标签（白色区域）
						const tabsHtml = WAREHOUSE_CATEGORIES.map(cat => {
							const isActive = currentWarehouseCategory === cat.key;
							const style = isActive ? 'background: rgba(0,212,255,0.15); border-color: var(--orokin-cyan); color: var(--orokin-cyan);' : 'background: rgba(0,0,0,0.3); border-color: #333; color: #888;';
							return `<button onclick="switchWarehouseCategory('${cat.key}')" style="padding: 8px 20px; border-radius: 20px; border: 1px solid; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; ${style}">${cat.label}</button>`;
						}).join('');

						tabsArea.innerHTML = `<div style="display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;">${tabsHtml}</div>`;

						// 3. 渲染统计
						statsArea.innerHTML = `
						    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
						        <span style="color: #888; font-size: 0.85rem;">
						            共 <span style="color: var(--orokin-cyan); font-family: Orbitron;">${filteredItems.length}</span> 项
						            ${currentWarehouseCategory !== 'all' ? ` <span style="color: #555;">/ 总计 ${warehouse.length} 项</span>` : ''}
						        </span>
						        <div style="display: flex; gap: 8px;">     
						            <button onclick="adminFixWarehouseImages()" 
						                style="padding: 6px 14px; background: rgba(200,168,75,0.1); border: 1px solid var(--tenno-gold-dim); border-radius: 6px; color: var(--tenno-gold); font-size: 0.75rem; cursor: pointer; font-family: 'Orbitron'; letter-spacing: 1px; transition: all 0.3s;"
						                onmouseover="this.style.background='rgba(200,168,75,0.2)';this.style.borderColor='var(--tenno-gold)';"
						                onmouseout="this.style.background='rgba(200,168,75,0.1)';this.style.borderColor='var(--tenno-gold-dim)';">
						                🖼️修复
						            </button>
						            
						        </div>
						    </div>
						`;

						// 4. 渲染物品网格（绿色区域）
						if (filteredItems.length === 0) {
							const msg = warehouseSearchQuery ? '🔍 未找到匹配的物品' : (currentWarehouseCategory !== 'all' ? '📂 该分类暂无物品' : '📦 矩阵是空的');
							itemsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px;">${msg}</div>`;
						} else {
							itemsGrid.innerHTML = filteredItems.map(item => {
								const cat = getItemCategory(item);
								const colors = { blueprint: '#4488ff', product: '#c8a84b', mineral: '#d4a574', material: '#4eff4e' };
								const color = colors[cat] || '#333';
								const label = WAREHOUSE_CATEGORIES.find(c => c.key === cat)?.label || '资源';
								return `
									<div class="foundry-item" style="cursor: default; border-color: ${color}33; position: relative; overflow: hidden;">
										<div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${color}; opacity: 0.6;"></div>
										<span class="foundry-icon" style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">
                                ${item.image ? `<img src="${item.image}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(0,212,255,0.3));" onerror="this.onerror=null;this.style.display='none';var fallback=document.createElement('span');fallback.style.cssText='font-size:2.5rem;';fallback.textContent='${item.icon}';this.parentElement.appendChild(fallback);">` : `<span style="font-size: 2.5rem;">${item.icon}</span>`}
                            </span>
										<div class="foundry-name" style="font-size: 0.9rem; margin-bottom: 6px;">${item.name}</div>
										<div style="display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0 10px;">
											<span style="color: ${color}; font-size: 0.7rem;">${label}</span>
											<span style="font-size: 0.85rem; color: var(--tenno-gold); font-family: Orbitron;">x${item.amount}</span>
										</div>
									</div>
								`;
							}).join('');
						}
					}					// 切换矩阵分类
					function switchWarehouseCategory(category) {
						currentWarehouseCategory = category;
						renderWarehouse();
					}

					// 处理矩阵搜索
					function handleWarehouseSearch(value) {
						warehouseSearchQuery = value;
						renderWarehouse();
					}

					// 清除搜索
					function clearWarehouseSearch() {
						warehouseSearchQuery = '';
						renderWarehouse();
					}
					
					function switchFoundryCategory(category) {
					    currentFoundryCategory = category;
					    renderFoundry();
					}
					
					
				// 动态设置肃清名字字体大小
				function setBattleNameFont(elementId) {
				    const el = document.getElementById(elementId);
				    if (!el) return;
				    
				    const text = el.textContent || '';
				    const length = text.length;
				    
				    // 设置 data-length 属性用于 CSS 选择
				    el.setAttribute('data-length', Math.min(length, 7));
				    
				    // 手机端隐藏玩家名字
				    if (window.innerWidth <= 768 && elementId === 'battlePlayerName') {
				        el.style.display = 'none';
				    }
				}
				
				

		// ═══════════════════════════════════════════════════════════════
		//  重构厂辅助函数
		// ═══════════════════════════════════════════════════════════════
		
		function checkCanCraft(recipe) {
		    
		    if (!recipe || !recipe.cost) {
return false;
		    }
		    
		    for (const [material, amount] of Object.entries(recipe.cost)) {
		        const item = warehouse.find(w => w.name === material);
		        const hasEnough = item && item.amount >= amount;
		        
		        if (!hasEnough) return false;
		    }
		    return true;
		}	

		
		
		
		
		function handleFoundrySearch(value) {
		    foundrySearchQuery = value;
		    renderFoundry();
		}
		
		function clearFoundrySearch() {
		    var input = document.getElementById('foundrySearchInput');
		    if (input) input.value = '';
		    foundrySearchQuery = '';
		    renderFoundry();
		}

		
		
		// 获取玩家拥有的蓝图列表
		function getOwnedBlueprints() {
		    const blueprints = [];
		    
		    // 1. 从矩阵中查找蓝图
		    if (warehouse && Array.isArray(warehouse)) {
		        warehouse.forEach(item => {
		            // 检查物品类型是否为蓝图，或名称包含"蓝图"
		            if (item.type === 'blueprint' || item.name.includes('蓝图')) {
		                blueprints.push(item.name);
		            }
		        });
		    }
		    
		    // 2. 从玩家回响中查找蓝图（如果蓝图以回响形式存在）
		    if (playerCards && typeof playerCards === 'object') {
		        for (const [id, card] of Object.entries(playerCards)) {
		            if (id.includes('blueprint') || (card.data && card.data.type === 'blueprint')) {
		                const name = card.data ? card.data.name : id;
		                blueprints.push(name);
		            }
		        }
		    }
		    
		    // 3. 去重
		    return [...new Set(blueprints)];
		}
		
		
		


function getFoundryCategory(recipe) {
    return recipe.category || 'product';
}

function checkCanCraft(recipe) {
    if (!recipe.cost) return true;
    for (const [material, amount] of Object.entries(recipe.cost)) {
        const item = warehouse.find(w => w.name === material);
        const have = item ? item.amount : 0;
        if (have < amount) return false;
    }
    return true;
}

function handleFoundrySearch(query) {
    foundrySearchQuery = query;
    renderFoundry();
}

function clearFoundrySearch() {
    foundrySearchQuery = '';
    renderFoundry();
}

function switchFoundryCategory(cat) {
    currentFoundryCategory = cat;
    renderFoundry();
}

// ═══════════════════════════════════════════════════════════════
//  格式化重构剩余时间（全局函数，供 renderFoundry 使用）
// ═══════════════════════════════════════════════════════════════
function formatRemainingTime(ms) {
    if (ms <= 0) return '已完成';
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return '剩余 ' + days + '天 ' + (hours % 24) + '小时';
    if (hours > 0) return '剩余 ' + hours + '小时 ' + (minutes % 60) + '分';
    if (minutes > 0) return '剩余 ' + minutes + '分 ' + (seconds % 60) + '秒';
    return '剩余 ' + seconds + '秒';
}

async function renderFoundry() {
    const searchArea = document.getElementById('foundrySearchArea');
    const tabsArea = document.getElementById('foundryTabsArea');
    const statsArea = document.getElementById('foundryStatsArea');
    const itemsGrid = document.getElementById('foundryItemsGrid');

    if (!searchArea || !tabsArea || !statsArea || !itemsGrid) return;

    // 过滤：先按分类，再按搜索
    let filteredRecipes = [...FOUNDRY_RECIPES];

    // 分类过滤
    if (currentFoundryCategory !== 'all') {
        filteredRecipes = filteredRecipes.filter(r => getFoundryCategory(r) === currentFoundryCategory);
    }

    // 搜索过滤
    if (foundrySearchQuery.trim()) {
        const query = foundrySearchQuery.trim().toLowerCase();
        filteredRecipes = filteredRecipes.filter(r =>
            (r.name || '').toLowerCase().includes(query)
        );
    }

    // 1. 搜索框
    searchArea.innerHTML = `
        <div style="max-width: 400px; margin: 0 auto; position: relative;">
            <input type="text" placeholder="🔍 搜索配方..." value="${foundrySearchQuery}" oninput="handleFoundrySearch(this.value)"
                style="width: 100%; padding: 12px 20px; background: rgba(0,0,0,0.5); border: 1px solid #333; border-radius: 8px; color: #fff; font-size: 0.9rem; text-align: center; transition: all 0.3s; box-sizing: border-box;">
            ${foundrySearchQuery ? `<span onclick="clearFoundrySearch()" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #666; cursor: pointer; font-size: 1rem;">✕</span>` : ''}
        </div>
    `;

    // 2. 分类标签
    const tabsHtml = FOUNDRY_CATEGORIES.map(cat => {
        const isActive = currentFoundryCategory === cat.key;
        const style = isActive ? 'background: rgba(0,212,255,0.15); border-color: var(--orokin-cyan); color: var(--orokin-cyan);' : 'background: rgba(0,0,0,0.3); border-color: #333; color: #888;';
        return `<button onclick="switchFoundryCategory('${cat.key}')" style="padding: 8px 20px; border-radius: 20px; border: 1px solid; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; ${style}">${cat.label}</button>`;
    }).join('');

    tabsArea.innerHTML = `<div style="display: inline-flex; gap: 10px; flex-wrap: wrap; justify-content: center;">${tabsHtml}</div>`;

    // 3. 统计
    statsArea.innerHTML = `<span style="color: #888; font-size: 0.85rem;">共 <span style="color: var(--orokin-cyan); font-family: Orbitron;">${filteredRecipes.length}</span> 项${currentFoundryCategory !== 'all' ? ` <span style="color: #555;">/ 总计 ${FOUNDRY_RECIPES.length} 项</span>` : ''}</span>`;

    // 4. 过滤：检查 requireBlueprint（矩阵必须有对应蓝图才显示）
        filteredRecipes = filteredRecipes.filter(function(recipe) {
            // 如果配方不需要蓝图，直接显示
            if (!recipe.requireBlueprint) return true;
            
            // 检查矩阵是否有该蓝图
            const hasBlueprint = warehouse.some(function(w) {
                return w.name === recipe.requireBlueprint && w.amount > 0;
            });
            
            return hasBlueprint; // 有蓝图才显示，没有则隐藏
        });

// ===== 重构队列渲染 =====
let queueHtml = '';
const displayedRecipeIds = new Set();

// ========== 关键修复：使用数据库服务器时间判断重构完成状态 ==========
// 防止用户修改系统时间提前显示重构完成
let serverNow = Date.now() + (window.serverTimeOffset || 0);
let serverTimeOffset = window.serverTimeOffset || 0;

    try {
        // 通过 RPC 获取数据库服务器时间（PostgreSQL now()）
        const { data: timeData, error: timeError } = await sb
            .rpc('get_server_time');

        if (!timeError && timeData) {
            // 解析服务器时间
            const serverDate = new Date(timeData);
            serverNow = serverDate.getTime();
            serverTimeOffset = serverNow - Date.now();
            console.log('服务器时间同步成功:', serverDate.toISOString(), '偏移:', serverTimeOffset, 'ms');
        } else {
            console.warn('获取服务器时间失败，使用本地时间:', timeError);
        }
    } catch (e) {
        console.warn('获取服务器时间异常，使用本地时间:', e);
    }

    const now = serverNow; // 使用服务器时间作为判断基准

    // 同步服务器重构状态
    try {
        const { data, error } = await sb
            .from('foundry_crafts')
            .select('*')
            .eq('user_id', currentUser.id)
            .eq('is_claimed', false);

        if (!error && data) {
            data.forEach(function(serverCraft) {
                const craftKey = serverCraft.craft_key;
                const localCraft = gameData.foundryQueue?.[craftKey];

                if (localCraft) {
                    // 更新本地状态（使用服务器时间）
                    localCraft.startTime = new Date(serverCraft.start_time).getTime();
                    localCraft.completeTime = new Date(serverCraft.complete_time).getTime();
                } else {
                    // 服务器有但本地没有，添加
                    if (!gameData.foundryQueue) gameData.foundryQueue = {};
                    gameData.foundryQueue[craftKey] = {
                        key: craftKey,
                        recipeId: serverCraft.recipe_id,
                        name: serverCraft.recipe_name,
                        startTime: new Date(serverCraft.start_time).getTime(),
                        completeTime: new Date(serverCraft.complete_time).getTime(),
                        totalTime: serverCraft.total_time_ms,
                        claimed: false
                    };
                }
            });
        }
    } catch (err) {
        console.error('同步重构状态失败:', err);
    }

const queueItems = Object.entries(gameData.foundryQueue || {}).filter(([k, v]) => !v.claimed);

if (queueItems.length > 0) {
        queueHtml = queueItems.map(([craftKey, craft]) => {
            // ========== 严格基于数据库 completeTime 判断完成状态 ==========
            // 使用服务器时间（或本地后备）与数据库 completeTime 比较
            const completeTime = craft.completeTime || 0;
            const startTime = craft.startTime || 0;
            const totalTime = craft.totalTime || 1;

            // 核心判断：服务器时间是否 >= 数据库中的完成时间
            // adminInstantCraftEnabled 为管理员即时完成模式
            const isComplete = window.adminInstantCraftEnabled 
                ? true 
                : (now >= completeTime);

            const isWarframe = craft.category === 'warframe';
            const warframeKey = isWarframe ? (craft.warframeKey || craft.key || '') : '';

            // 进度计算：基于实际时间进度，已完成固定100%
            const progress = isComplete 
                ? 100 
                : Math.min(100, Math.max(0, ((now - startTime) / totalTime) * 100));

            // 剩余时间：严格基于数据库 completeTime - 服务器时间
            const remaining = isComplete 
                ? 0 
                : Math.max(0, completeTime - now);

            // 状态文字：明确显示基于服务器时间
            const remainingText = isComplete 
                ? '✅ 重构完成' 
                : formatRemainingTime(remaining) + (serverTimeOffset !== 0 ? ' (服务器时间)' : '');

            // 视觉样式
            const statusColor = isComplete ? 'var(--infested-green)' : 'var(--orokin-cyan)';
            const borderColor = isComplete ? 'var(--infested-green)' : '#333';

            // 按钮状态：只有数据库时间判定完成才能领取
             // 判断是否是完整战甲重构（category === 'warframe' 且不是部件）
                        const isWarframeCraft = isComplete && 
                            craft.category === 'warframe' && 
                            !craft.name.includes('头部') && 
                            !craft.name.includes('机体') && 
                            !craft.name.includes('系统') && 
                            !craft.name.includes('神经光元');
                        
                        // 按钮状态：只有数据库时间判定完成才能领取
                        const btnText = isComplete 
                            ? (isWarframeCraft ? '⚔ 选择领取' : '📦 领取') 
                            : '⏳ 重构中';
                        const btnOnclick = isComplete 
                            ? `onclick="claimFoundryItem('${craftKey}')"` 
                            : '';
                        const btnDisabled = isComplete ? '' : 'disabled';
                        const btnStyle = isComplete 
                            ? (isWarframeCraft 
                    ? 'background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: #000; border: none; cursor: pointer;' 
                    : 'background: linear-gradient(135deg, var(--infested-green), #88ff88); color: #000; border: none; cursor: pointer;')
                : 'background: linear-gradient(135deg, #333, #555); color: #888; border: none; cursor: not-allowed; opacity: 0.6;';

            return `
                <div class="foundry-item" style="border-color: ${borderColor}; ${isComplete ? 'box-shadow: 0 0 15px rgba(78,255,78,0.2);' : ''} position: relative; overflow: hidden;">
                    ${isComplete ? '<div style="position: absolute; top: 8px; right: 8px; color: var(--infested-green); font-size: 1.2rem;">✓</div>' : ''}
                    <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${statusColor}; opacity: 0.6;"></div>
                    <span class="foundry-icon" style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">
                        ${craft.image ? `<img src="${craft.image}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(0,212,255,0.3));" onerror="this.onerror=null;this.src='';this.parentElement.textContent='${craft.icon}';">` : `<span style="font-size: 2.5rem;">${craft.icon}</span>`}
                    </span>
                    <div class="foundry-name" style="font-size: 0.9rem; margin-bottom: 6px;">${craft.name}</div>
                    <div class="foundry-status" style="font-size: 0.8rem; color: ${statusColor}; margin-bottom: 8px;">
                        ${isComplete ? '✅ 重构完成' : '⏳ 重构中...'}
                    </div>
                    <div style="width: 100%; height: 6px; background: #1a1a1a; border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
                        <div style="width: ${progress}%; height: 100%; background: ${isComplete ? 'linear-gradient(90deg, var(--infested-green), #88ff88)' : 'linear-gradient(90deg, var(--orokin-cyan-dim), var(--orokin-cyan))'}; transition: width 1s;"></div>
                    </div>
                    <div style="font-size: 0.75rem; color: #666; margin-bottom: 10px;">
                        ${remainingText}
                    </div>
                    <button class="foundry-btn" ${btnOnclick} ${btnDisabled} style="${btnStyle}">
                        ${btnText}
                    </button>
                </div>
            `;
        }).join('');
}

// ===== 配方列表渲染（原有逻辑）=====
let recipesHtml = '';
if (filteredRecipes.length === 0) {
    recipesHtml = `<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 60px;">${foundrySearchQuery ? '🔍 未找到匹配的配方' : (currentFoundryCategory !== 'all' ? '📂 该分类暂无配方' : '📦 暂无配方')}</div>`;
} else {
    // ========== 修改：获取正在重构中的配方ID列表 ==========
    const craftingRecipeIds = new Set();
    Object.values(gameData.foundryQueue || {}).forEach(c => {
        if (!c.claimed) {
            craftingRecipeIds.add(c.recipeId);
        }
    });

    // ========== 修改：过滤掉正在重构中的配方，只保留未重构的 ==========
    const displayRecipes = filteredRecipes.filter(recipe => !craftingRecipeIds.has(recipe.id));

    recipesHtml = displayRecipes.map(recipe => {
        const canCraft = checkCanCraft(recipe);
        const cat = getFoundryCategory(recipe);
        const catColors = { warframe: '#ff66ff', weapon: '#ff4444', product: '#c8a84b' };
        const borderColor = catColors[cat] || '#333';
        const catLabel = FOUNDRY_CATEGORIES.find(c => c.key === cat)?.label || '加工';
        
        return `
            <div class="foundry-item" style="border-color: ${borderColor}33; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; height: 3px; background: ${borderColor}; opacity: 0.6;"></div>
                <span class="foundry-icon" style="font-size: 2.5rem; display: flex; align-items: center; justify-content: center; width: 60px; height: 60px;">
                    ${recipe.image ? `<img src="${recipe.image}" style="width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 5px rgba(0,212,255,0.3));" onerror="this.onerror=null;this.src='';this.parentElement.textContent='${recipe.icon}';">` : `<span style="font-size: 2.5rem;">${recipe.icon}</span>`}
                </span>
                <div class="foundry-name" style="font-size: 0.9rem; margin-bottom: 6px;">${recipe.name}</div>
                <div class="foundry-status" style="font-size: 0.8rem; line-height: 1.6;">
                    ${recipe.cost ? Object.entries(recipe.cost).map(([material, amount]) => {
                        const item = warehouse.find(w => w.name === material);
                        const have = item ? item.amount : 0;
                        const hasEnough = have >= amount;
                        return `<div style="color: ${hasEnough ? 'var(--infested-green)' : 'var(--grineer-red)'};">
                            ${material}: ${have}/${amount}
                        </div>`;
                    }).join('') : '<div style="color: #666;">无需材料</div>'}
                </div>
                <div class="foundry-status" style="font-size: 0.75rem; color: #666;">
                    耗时: ${recipe.time}小时
                </div>
                <button class="foundry-btn" onclick="craftItem('${recipe.id}')"
                    style="margin-top: 10px;">
                    ⚒️ 重构
                </button>
            </div>
        `;
    }).join('');
}

// 合并显示：队列项目在前，配方列表在后
itemsGrid.innerHTML = queueHtml + recipesHtml;
}

function craftItem(recipeId) {
    const recipe = FOUNDRY_RECIPES.find(r => r.id === recipeId);
    
    // 防御性检查：确保矩阵系统可用
    if (typeof warehouse === 'undefined' || !Array.isArray(warehouse)) {
        console.error('矩阵系统未初始化');
        showToast('系统错误，请刷新页面', 'error');
        return;
    }
    
    if (!recipe) {
        showToast('配方不存在', 'error');
        return;
    }
    
    // 检查是否已在重构中
    const existingCraft = Object.values(gameData.foundryQueue || {}).find(
        c => c.recipeId === recipeId && !c.claimed
    );
    if (existingCraft) {
        showToast('该物品正在重构中', 'warning');
        return;
    }
    
    // 检查材料
    if (!window.adminFreeCraftEnabled && recipe.cost) {
        for (const [material, amount] of Object.entries(recipe.cost)) {
            const item = warehouse.find(w => w.name === material);
            if (!item || item.amount < amount) {
                showToast('材料不足: ' + material, 'error');
                return;
            }
        }
    }
    
    // 生成唯一 craftKey
    const craftKey = 'craft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const craftTimeMs = window.adminInstantCraftEnabled ? 0 : ((recipe.time || 0) * 3600 * 1000);
    
    // 扣除材料
    if (!window.adminFreeCraftEnabled && recipe.cost) {
        for (const [material, amount] of Object.entries(recipe.cost)) {
            const item = warehouse.find(w => w.name === material);
            if (item) item.amount -= amount;
        }
    }
    
    // 调用 RPC 创建重构记录（使用服务器时间）
    sb.rpc('create_foundry_craft', {
        p_user_id: currentUser.id,
        p_craft_key: craftKey,
        p_recipe_id: recipeId,
        p_recipe_name: recipe.name,
        p_total_time_ms: craftTimeMs
    }).then(function(result) {
        let data = result.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch(e) {}
        }
        if (Array.isArray(data)) {
            data = data[0] || {};
        }
        
        if (!data || !data.success) {
            throw new Error(data?.error || '创建重构记录失败');
        }
        
        // 使用服务器返回的时间
        const serverStartTime = data.start_time;
        const serverCompleteTime = data.complete_time;
        
        // 保存到本地队列
        if (!gameData.foundryQueue) gameData.foundryQueue = {};
        gameData.foundryQueue[craftKey] = {
            key: craftKey,
            recipeId: recipeId,
            name: recipe.name,
            icon: recipe.icon,
            image: recipe.image,
            category: recipe.category,
            warframeKey: recipe.warframeKey,
            startTime: serverStartTime,
            completeTime: serverCompleteTime,
            totalTime: craftTimeMs,
            claimed: false
        };
        
        saveGameData();
        renderFoundry();
        renderWarehouse();
        updateUI();
        
        showToast('⚒️ ' + recipe.name + ' 开始重构！预计 ' + recipe.time + '小时后完成', 'success');
    }).catch(function(err) {
        console.error('创建重构记录失败:', err);
        showToast('重构失败: ' + err.message, 'error');
        
        // 失败时返还材料
        if (!window.adminFreeCraftEnabled && recipe.cost) {
            for (const [material, amount] of Object.entries(recipe.cost)) {
                addToWarehouse(material, '', amount, 'material');
            }
        }
    });
}



// 领取重构完成的物品
function claimFoundryItem(craftKey) {
    const craft = gameData.foundryQueue?.[craftKey];
    if (!craft) {
        showToast('重构记录不存在', 'error');
        return;
    }
    
    if (craft.claimed) {
        showToast('该物品已领取', 'warning');
        return;
    }
    
    // 调用 RPC 验证重构是否完成（使用服务器时间）
    sb.rpc('check_foundry_complete', {
        p_user_id: currentUser.id,
        p_craft_key: craftKey
    }).then(function(result) {
        let data = result.data;
        if (typeof data === 'string') {
            try { data = JSON.parse(data); } catch(e) {}
        }
        if (Array.isArray(data)) {
            data = data[0] || {};
        }
        
        if (!data || !data.success) {
            showToast(data?.error || '验证失败', 'error');
            return;
        }
        
        // 检查是否完成
        if (!data.is_complete) {
            const remainingMs = data.remaining_ms || 0;
            const remainingSec = Math.ceil(remainingMs / 1000);
            const remainingMin = Math.floor(remainingSec / 60);
            const remainingHour = Math.floor(remainingMin / 60);
            
            let timeText = '';
            if (remainingHour > 0) timeText += remainingHour + '小时';
            if (remainingMin % 60 > 0) timeText += (remainingMin % 60) + '分钟';
            if (remainingSec < 60) timeText = remainingSec + '秒';
            
            showToast('重构尚未完成，剩余 ' + timeText, 'warning');
            return;
        }
        
                // 重构完成，发放奖励
                // 判断是否是完整战甲重构（category === 'warframe' 且不是部件）
                var isFullWarframe = craft.category === 'warframe' && 
                                      !craft.name.includes('头部') && 
                                      !craft.name.includes('机体') && 
                                      !craft.name.includes('系统') && 
                                      !craft.name.includes('神经光元');

                if (isFullWarframe) {
                    // 显示战甲选择弹窗
                    showWarframeClaimModal(craft, craftKey);
                } else {
                    // 普通物品直接发放
                    addToWarehouse(craft.name, craft.icon, 1, 'product', craft.image);
                    showToast('重构完成！获得 ' + craft.name, 'success');
                    
                    // 标记为已领取
                    craft.claimed = true;
                    gameData.foundryQueue[craftKey].claimed = true;
                    saveGameData();
                    renderFoundry();
                }
        
        // 标记为已领取
        craft.claimed = true;
        gameData.foundryQueue[craftKey].claimed = true;
        
        saveGameData();
        renderFoundry();
        
    }).catch(function(err) {
        console.error('领取重构失败:', err);
        showToast('领取失败: ' + err.message, 'error');
    });
}

// ═══════════════════════════════════════════════════════════════
//  取消重构 - 返还材料（使用项目统一弹窗）
// ═══════════════════════════════════════════════════════════════
function cancelFoundryCraft(craftKey) {
    const craft = gameData.foundryQueue ? gameData.foundryQueue[craftKey] : null;
    if (!craft) {
        showToast('重构项目不存在', 'error');
        return;
    }
    
    if (!confirm('确定要取消重构 ' + craft.name + ' 吗？材料将返还。')) {
        return;
    }
    
    // 从数据库删除重构记录
    sb.from('foundry_crafts')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('craft_key', craftKey)
        .then(function() {
            // 返还材料
            const recipe = FOUNDRY_RECIPES.find(r => r.id === craft.recipeId);
            if (recipe && recipe.cost) {
                for (const [material, amount] of Object.entries(recipe.cost)) {
                    addToWarehouse(material, '', amount, 'material');
                }
            }
            
            // 从本地队列移除
            delete gameData.foundryQueue[craftKey];
            
            saveGameData();
            renderFoundry();
            
            showToast('重构已取消，材料已返还', 'info');
        }).catch(function(err) {
            console.error('取消重构失败:', err);
            showToast('取消失败: ' + err.message, 'error');
        });
}

// 挂载到 window
window.cancelFoundryCraft = cancelFoundryCraft;

// 辅助函数：获取材料图标
function getMaterialIcon(name) {
    const iconMap = {
        '合金板': '🔩', '神经传感器': '🧠', '聚合物束': '🧵', '红化结晶': '💎',
        '铁氧体': '⛏️', '非晶态合金': '💠', '控制模块': '🎮', '回收金属': '♻️',
        '生物质': '⚙️', 'Orokin电池': '🔋', '氩结晶': '💎', '电路': '🔌',
        '纳米孢子': '🦠', '神经元': '🧠', '奥罗金电池': '🔋', '永冻晶矿': '❄️',
        '碲': '🧪', '镓': '⚪', '奥席金属': '✈️',
        '铁岩': '🪨', '炎晶': '🔥', '亚铜': '🔶', '金辉': '✨',
        '石青': '💎', '兄弟之石': '👬', '翠萤石': '🟢', '绯红石': '🔴',
        '心智晶核': '🧠', '灵息石': '💫', '酸化矿物': '⚗️', '铁镍矿': '⛏️',
        '启明矿石': '💡', '长庚矿石': '🌟', '翡斯敏石': '💚', '夜石': '🌙',
        '填充细石': '💎', '紫苋石': '💜', '黄道宝石': '♌', '赤色水晶': '🔴',
        '阿拉德玛金属': '⚫', '巴弗结晶': '🟤', '纳莫原石': '🟣', '萨莫感染石': '☣️',
        '达戈琥珀': '🦟', '提亚美凝石': '🌀', '聚合荧石': '✨', '栓子凝石': '🩸',
        '异源石': '👽', '殁世烯': '☠️'
    };
    return iconMap[name] || '📦';
}

// 挂载辅助函数
window.getMaterialIcon = getMaterialIcon;


// 战甲领取选择弹窗
function showWarframeClaimModal(craft, craftKey) {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    if (!modalOverlay || !modalTitle || !modalContent) return;
    
    modalTitle.textContent = '⚔️ 选择战甲领取方式';
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 10px;">
            <div style="font-size: 4rem; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; min-height: 80px;">
                ${craft.image ? `<img src="${craft.image}" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 0 10px rgba(0,212,255,0.3));" onerror="this.onerror=null;this.parentElement.innerHTML='<span style=\'font-size: 4rem;\'>${craft.icon}</span>'">` : `<span style="font-size: 4rem;">${craft.icon}</span>`}
            </div>
            <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.3rem; margin-bottom: 10px;">
                ${craft.name}
            </div>
            <div style="color: #888; font-size: 0.85rem; margin-bottom: 25px; line-height: 1.6;">
                该战甲已重构完成。请选择领取方式：<br>
                <span style="color: var(--infested-green);">使用型</span>：直接装备并激活此战甲<br>
                <span style="color: var(--orokin-cyan);">物品型</span>：放入矩阵保存，可随时切换
            </div>
            
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                            ${(() => {
                                const recipeToWarframe = {
                                    'f_excalibur': 'excalibur',
                                    'f_volt': 'volt',
                                    'f_mag': 'mag'
                                };
                                const actualWarframeKey = recipeToWarframe[craft.recipeId] || craft.warframeKey || 'excalibur';
                                const isOwned = gameData.ownedWarframes && gameData.ownedWarframes.includes(actualWarframeKey);
                                const ownedWf = WARFRAMES[actualWarframeKey];
                                return `
                                    <button class="btn" onclick="claimWarframeAsUse('${craftKey}')" 
                                            ${isOwned ? 'disabled' : ''}
                                            style="background: ${isOwned ? '#333' : 'linear-gradient(135deg, var(--infested-green), #88ff88)'}; 
                                                    color: ${isOwned ? '#666' : '#000'}; 
                                                    padding: 15px; 
                                                    cursor: ${isOwned ? 'not-allowed' : 'pointer'};
                                                    opacity: ${isOwned ? '0.6' : '1'};">
                                        <div style="font-size: 1.5rem; margin-bottom: 8px;">⚔️</div>
                                        <div style="font-family: 'Orbitron'; font-size: 1rem;">
                                            ${isOwned ? '已拥有' : '使用型'}
                                        </div>
                                        <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 5px;">
                                            ${isOwned ? `已拥有 ${ownedWf ? ownedWf.name : warframeKey}` : '立即装备此战甲'}
                                        </div>
                                    </button>
                                `;
                            })()}
                            <button class="btn" onclick="claimWarframeAsItem('${craftKey}')" 
                                    style="background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan)); color: #000; padding: 15px;">
                                <div style="font-size: 1.5rem; margin-bottom: 8px;">📦</div>
                                <div style="font-family: 'Orbitron'; font-size: 1rem;">物品型</div>
                                <div style="font-size: 0.75rem; opacity: 0.8; margin-top: 5px;">存入矩阵</div>
                            </button>
                        </div>
        </div>
    `;
    
    modalOverlay.style.zIndex = '9999';
    modalOverlay.classList.add('active');
}

// 领取为使用型（直接装备）
function claimWarframeAsUse(craftKey) {
    const craft = gameData.foundryQueue?.[craftKey];
    if (!craft) return;
    
    const recipeToWarframe = {
        'f_excalibur': 'excalibur',
        'f_volt': 'volt',
        'f_mag': 'mag'
    };
    const warframeKey = recipeToWarframe[craft.recipeId] || craft.warframeKey || 'excalibur';
    const wf = WARFRAMES[warframeKey] || WARFRAMES.excalibur;
    
    // 标记为已领取
    craft.claimed = true;
    
    // 添加到已拥有列表
    if (!gameData.ownedWarframes) gameData.ownedWarframes = [];
    if (!gameData.ownedWarframes.includes(warframeKey)) {
        gameData.ownedWarframes.push(warframeKey);
    }
    
    // 直接切换到此战甲
    gameData.activeWarframe = warframeKey;
    gameData.warframe_type = warframeKey;
    
    // 初始化该战甲的等级数据（如果不存在）
    if (!gameData.warframe_levels) gameData.warframe_levels = {};
    if (!gameData.warframe_levels[warframeKey]) {
        gameData.warframe_levels[warframeKey] = {
            level: 1,
            xp: 0,
            max_xp: 100
        };
    }
    
    // 同步到旧字段（兼容）
    const wfData = gameData.warframe_levels[warframeKey];
    gameData.warframe_level = wfData.level;
    gameData.warframe_xp = wfData.xp;
    gameData.warframe_max_xp = wfData.max_xp;
    
    // 更新属性
    if (wf && wf.stats) {
        gameData.stat_shield = wf.stats.shield || 100;
        gameData.stat_health = wf.stats.health || 100;
        gameData.stat_energy = wf.stats.energy || 100;
        gameData.stat_armor = wf.stats.armor || 100;
        gameData.stat_speed = wf.stats.speed || 10;
    }
    
    saveGameData();
    updateUI();
    updateInfoUI();
    updateBattleUI();
    updateMiningUI();
    updateGatheringUI();
    renderFoundry();
    closeModal();
    showToast(`已装备 ${wf.name}！`, 'success');
}

// 领取为物品型（放入矩阵）
function claimWarframeAsItem(craftKey) {
    const craft = gameData.foundryQueue?.[craftKey];
    if (!craft) return;
    
    const warframeKey = craft.warframeKey || 'excalibur';
    const wf = WARFRAMES[warframeKey] || WARFRAMES.excalibur;
    
    // 标记为已领取
    craft.claimed = true;
    
    // 添加到已拥有列表
    if (!gameData.ownedWarframes) gameData.ownedWarframes = [];
    if (!gameData.ownedWarframes.includes(warframeKey)) {
        gameData.ownedWarframes.push(warframeKey);
    }
    
    // 初始化该战甲的等级数据
    if (!gameData.warframe_levels) gameData.warframe_levels = {};
    if (!gameData.warframe_levels[warframeKey]) {
        gameData.warframe_levels[warframeKey] = {
            level: 1,
            xp: 0,
            max_xp: 100
        };
    }
    
    // 放入矩阵（标记为未装备的战甲）
    addToWarehouse(craft.name, craft.icon, 1, 'warframe', craft.image);
    
    saveGameData();
    renderFoundry();
    renderWarehouse();
    updateUI();
    closeModal();
    showToast(`${wf.name} 已存入矩阵`, 'success');
}

					// ═══════════════════════════════════════════════════════════════
					//  排行榜系统
					// ═══════════════════════════════════════════════════════════════
					async function loadLeaderboard() {
						const tbody = document.getElementById('leaderboardBody');
						if (!tbody) return;

						tbody.innerHTML =
							'<tr><td colspan="5" style="text-align: center; color: #666; padding: 40px;">加载中...</td></tr>';

						try {
							// 从 game_data 表读取 player_cards 和 streak 数据
							const {
								data,
								error
							} = await sb
								.from('game_data')
								.select('user_id, username, player_cards, streak, warframe_level')
								.limit(50);

							if (error) throw error;

							if (!data || data.length === 0) {
								tbody.innerHTML =
									'<tr><td colspan="5" style="text-align: center; color: #666; padding: 40px;">暂无数据</td></tr>';
								return;
							}

							// 计算每个用户的回响收集数量
							const usersWithCardCount = data.map(user => {
								let cardCount = 0;
								if (user.player_cards) {
									// player_cards 是对象，键是回响ID，值是回响信息
									for (var key in user.player_cards) {
										if (key !== '_shards' && user.player_cards[key] && user.player_cards[key].count > 0) {
											cardCount++;
										}
									}
								}
								return {
									...user,
									cardCount: cardCount
								};
							});

							// 按回响数量降序排序
							usersWithCardCount.sort((a, b) => b.cardCount - a.cardCount);

							tbody.innerHTML = usersWithCardCount.map((user, index) => {
								const rank = index + 1;
								let rankClass = 'rank-other';
								if (rank === 1) rankClass = 'rank-1';
								else if (rank === 2) rankClass = 'rank-2';
								else if (rank === 3) rankClass = 'rank-3';

								// 连续登录天数
								const streakDays = user.streak || 1;
								const streakText = streakDays >= 7 ? '🔥 ' + streakDays + '天' : 
													  streakDays >= 3 ? '✨ ' + streakDays + '天' : 
													  streakDays + '天';
								const streakColor = streakDays >= 7 ? 'var(--infested-green)' : 
														streakDays >= 3 ? 'var(--tenno-gold)' : '#888';

								// 段位显示
								const level = user.warframe_level || 1;
								let rankTitle = '觉醒者';
								if (level >= 30) rankTitle = '传奇';
								else if (level >= 20) rankTitle = '大师';
								else if (level >= 10) rankTitle = '精英';

								return `
                <tr>
                    <td><div class="leaderboard-rank ${rankClass}">${rank}</div></td>
                    <td>${user.username || '未知Tenno'}</td>
                    <td>${rankTitle} <span style="color: #555; font-size: 0.75rem;">(Lv.${level})</span></td>
                    <td style="color: var(--tenno-gold); font-family: 'Orbitron';">${user.cardCount}</td>
                    <td style="color: ${streakColor}; font-size: 0.85rem;">${streakText}</td>
                </tr>
            `;
							}).join('');
						} catch (err) {
							console.error('加载排行榜失败:', err);
							tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; padding: 40px;">加载失败</td></tr>';
						}
					}

					// ═══════════════════════════════════════════════════════════════
					//  积分商城系统
					// ═══════════════════════════════════════════════════════════════
					// ═══════════════════════════════════════════════════════════════
					//  Baro Ki'Teer 虚空商店商品（负荷恢复剂）
					// ═══════════════════════════════════════════════════════════════
					var SHOP_ITEMS = [
						{
							name: '小型负荷恢复剂',
							icon: '🧪',
							desc: '立即恢复 50 点负荷',
							price: 25,
							type: 'consumable',
							stamina: 50,
							color: '#4eff4e'
						},
						{
							name: '中型负荷恢复剂',
							icon: '⚗️',
							desc: '立即恢复 100 点负荷',
							price: 50,
							type: 'consumable',
							stamina: 100,
							color: '#00d4ff'
						},
						{
							name: '大型负荷恢复剂',
							icon: '🔋',
							desc: '立即恢复 200 点负荷',
							price: 90,
							type: 'consumable',
							stamina: 200,
							color: '#c8a84b'
						},
						 // ========== 新增：一小时无限负荷卡 ==========
						    {
						        name: '1小时无限负荷卡',
						        icon: '♾️',
						        desc: '持续时间不再消耗负荷',
						        price: { rout: 200, prime: 6, vip: 4 }, // 💰300 💎3 🔮3
								priceType: 'multi', // 支持多种货币
						        type: 'buff',  // 新类型：buff
						        buffType: 'unlimited_stamina',
						        duration: 3600000,  // 1小时 = 3600000毫秒
						        color: '#ff66ff'  ,// 紫色，稀有物品
								staminaAmount: null
						    }
					];
					
					
					
					// Baro Ki'Teer 限时开放逻辑
					let baroOpen = false;
					let baroNextOpen = null;
					let baroNextClose = null;
					
					function checkBaroStatus() {
					    const now = new Date();
					    const day = now.getDay(); // 0=周日, 1=周一...
					    const hour = now.getHours();
					    
					    // Baro 每两周的周五 12:00 开放，周日 12:00 关闭
					    // 简化逻辑：周五12:00 - 周日12:00 开放
					    const isWeekend = (day === 5 && hour >= 12) || day === 6 || (day === 0 && hour < 12);
					    
					    baroOpen = isWeekend;
					    
					    // 计算下次开放时间
					    const nextFriday = new Date(now);
					    nextFriday.setDate(now.getDate() + ((5 + 7 - day) % 7));
					    nextFriday.setHours(12, 0, 0, 0);
					    if (nextFriday <= now) nextFriday.setDate(nextFriday.getDate() + 7);
					    
					    baroNextOpen = nextFriday;
					    
					    // 计算关闭时间
					    const nextSunday = new Date(nextFriday);
					    nextSunday.setDate(nextFriday.getDate() + 2);
					    nextSunday.setHours(12, 0, 0, 0);
					    baroNextClose = nextSunday;
					    
					    updateBaroTimer();
					}
					
					function updateBaroTimer() {
					    const timerEl = document.getElementById('baroTimer');
					    const shopTimerEl = document.getElementById('baroShopTimer');
					    if (!timerEl) return;
					    
					    const now = new Date();
					    
					    if (baroOpen) {
					        // 开放中，显示剩余时间
					        const remain = baroNextClose - now;
					        const hours = Math.floor(remain / 3600000);
					        const mins = Math.floor((remain % 3600000) / 60000);
					        const text = `🔥 开放中！剩余 ${hours}小时${mins}分`;
					        timerEl.textContent = text;
					        timerEl.style.color = 'var(--infested-green)';
					        if (shopTimerEl) shopTimerEl.textContent = text;
					    } else {
					        // 未开放，显示下次开放时间
					        const remain = baroNextOpen - now;
					        const days = Math.floor(remain / 86400000);
					        const hours = Math.floor((remain % 86400000) / 3600000);
					        const text = `⏳ 下次开放: ${days}天${hours}小时后`;
					        timerEl.textContent = text;
					        timerEl.style.color = '#666';
					        if (shopTimerEl) shopTimerEl.textContent = text;
					    }
					}
					
					function enterBaroShop() {
					    if (!baroOpen) {
					        
					        showToast('Baro Ki\'Teer 尚未开放！请等待限时开放时间', 'warning');
					        return;
					    }
 // 隐藏入口和积分商城
    document.getElementById('baroEntrance').style.display = 'none';
    document.getElementById('marooMarketEntrance').style.display = 'none';
    document.getElementById('primeShopArea').style.display = 'none';
    
    // 显示Baro商店
    document.getElementById('baroShopPage').style.display = 'block';
    
    // 使用现金显示
    document.getElementById('baroPoints').textContent = gameData.rout_points || 0;
    renderBaroShop();
}
					    
					    function backToShopEntrance() {
					        // 显示入口和积分商城
					        document.getElementById('baroEntrance').style.display = 'block';
					        document.getElementById('baroShopPage').style.display = 'none';
					        document.getElementById('primeShopArea').style.display = 'block';
					        document.getElementById('marooMarketEntrance').style.display = 'block';
					        
					        // 恢复积分商城显示
					        document.getElementById('shopPoints').textContent = gameData.prime_points || 0;
					        renderShop();
					    }
					
					// 初始化时检查 Baro 状态
					setInterval(updateBaroTimer, 60000); // 每分钟更新
					
					
					
					function renderStaminaShop() {
					    const container = document.getElementById('staminaShopList');
					    if (!container) return;
					
					    container.innerHTML = SHOP_ITEMS.map((item, index) => {
					        // 1小时无限负荷卡特殊处理：显示三种货币价格
					        if (item.type === 'buff' && item.name === '1小时无限负荷卡') {
					            return `
					                <div class="shop-item" style="border-color: ${item.color || '#333'};">
					                    <div class="shop-image" style="background: linear-gradient(135deg, rgba(0,0,0,0.5), ${item.color ? item.color + '15' : 'rgba(0,0,0,0.5)'});">${item.icon}</div>
					                    <div class="shop-info">
					                        <div class="shop-name">${item.name}</div>
					                        <div class="shop-desc">${item.desc}</div>
					                        <div class="shop-price" style="flex-direction: column; align-items: flex-start; gap: 4px;">
					                            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
					                                <span style="color: var(--tenno-gold);">💰 200</span>
					                                <span style="color: var(--orokin-cyan);">💎 6</span>
					                                <span style="color: var(--infested-green);">🔮 4</span>
					                            </div>
					                            <button class="shop-btn" onclick="buyUnlimitedStaminaCard()" style="background: linear-gradient(135deg, ${item.color || 'var(--sentient-purple)'}, ${item.color ? item.color + 'aa' : '#cc44cc'}); width: 100%; margin-top: 5px;">
					                                购买
					                            </button>
					                        </div>
					                    </div>
					                </div>
					            `;
					        }
					        
					        // 普通恢复剂
					        return `
					            <div class="shop-item" style="border-color: ${item.color || '#333'};">
					                <div class="shop-image" style="background: linear-gradient(135deg, rgba(0,0,0,0.5), ${item.color ? item.color + '15' : 'rgba(0,0,0,0.5)'});">${item.icon}</div>
					                <div class="shop-info">
					                    <div class="shop-name">${item.name}</div>
					                    <div class="shop-desc">${item.desc}</div>
					                    <div class="shop-price">
					                        <div class="price-tag" style="color: ${item.color || 'var(--sentient-purple)'};">💰 ${item.price}</div>
					                        <button class="shop-btn" onclick="buyStaminaItem('${item.name}', ${item.price}, '${item.type}', '${item.stamina}')" style="background: linear-gradient(135deg, ${item.color || 'var(--sentient-purple)'}, ${item.color ? item.color + 'aa' : '#cc44cc'});">
					                            购买
					                        </button>
					                    </div>
					                </div>
					            </div>
					        `;
					    }).join('');
					}
					
					
					
function buyUnlimitedStaminaCard() {
    const currentRout = gameData?.rout_points || 0;
    const currentPrime = gameData?.prime_points || 0;
    const currentVip = gameData?.vip_points || 0;
    
    // 检查是否至少有一种货币足够
    const canBuyRout = currentRout >= 200;
    const canBuyPrime = currentPrime >= 6;
    const canBuyVip = currentVip >= 4;
    
    if (!canBuyRout && !canBuyPrime && !canBuyVip) {
        showToast('货币不足！需要 💰200 或 💎6 或 🔮4', 'error');
        return;
    }
    
    // ========== 修复：使用全局变量存储用户最终选择 ==========
    window.selectedPaymentType = canBuyRout ? 'rout' : (canBuyPrime ? 'prime' : 'vip');
    
    // 构建支付选择HTML
    const paymentOptions = [
        { type: 'rout', label: '💰 Rout', value: 200, canBuy: canBuyRout, color: 'var(--tenno-gold)' },
        { type: 'prime', label: '💎 Prime', value: 6, canBuy: canBuyPrime, color: 'var(--orokin-cyan)' },
        { type: 'vip', label: '🔮 VIP', value: 4, canBuy: canBuyVip, color: 'var(--infested-green)' }
    ];
    
    const paymentHtml = paymentOptions.map(opt => `
        <div class="payment-option" data-type="${opt.type}" onclick="selectPaymentType('${opt.type}')" 
             style="padding: 10px; margin: 5px 0; border: 2px solid ${opt.type === window.selectedPaymentType ? opt.color : '#333'}; 
                    border-radius: 8px; cursor: ${opt.canBuy ? 'pointer' : 'not-allowed'}; 
                    background: ${opt.type === window.selectedPaymentType ? opt.color + '20' : 'transparent'};
                    opacity: ${opt.canBuy ? '1' : '0.3'};">
            <span style="color: ${opt.color}; font-family: 'Orbitron';">${opt.label} ${opt.value}</span>
            ${!opt.canBuy ? '<span style="color: var(--grineer-red); font-size: 0.75rem;"> (不足)</span>' : ''}
        </div>
    `).join('');
    
    // ========== 修复：确认回调内读取全局变量，并增加二次校验 ==========
    showConfirmModal({
        icon: '⚡',
        title: '购买 1小时无限负荷卡',
        desc: '选择支付方式后确认购买',
        costs: [
            { label: '效果', value: '⚡ 1小时内不消耗负荷', type: 'gain' },
            { label: '当前负荷', value: `${stamina}/${STAMINA_MAX || 100}`, type: 'neutral' }
        ],
        onConfirm: function() {
            // 读取用户最终选择的支付方式（全局变量）
            var payType = window.selectedPaymentType || 'rout';
            var price = 0;
            var currencyField = '';
            var currencyName = '';
            var currencyIcon = '';
            
            // 根据选择确定扣款信息
            switch(payType) {
                case 'rout':
                    price = 300;
                    currencyField = 'rout_points';
                    currencyName = 'Rout';
                    currencyIcon = '💰';
                    break;
                case 'prime':
                    price = 3;
                    currencyField = 'prime_points';
                    currencyName = 'Prime';
                    currencyIcon = '💎';
                    break;
                case 'vip':
                    price = 3;
                    currencyField = 'vip_points';
                    currencyName = 'VIP';
                    currencyIcon = '🔮';
                    break;
                default:
                    showToast('支付方式错误', 'error');
                    return;
            }
            
            // ========== 二次校验余额（防止购买过程中余额变化）==========
            var currentBalance = gameData[currencyField] || 0;
            if (currentBalance < price) {
                showToast(currencyIcon + ' ' + currencyName + ' 不足！需要 ' + price + '，当前 ' + currentBalance, 'error');
                return;
            }
            
            // ========== 扣款 ==========
            gameData[currencyField] = currentBalance - price;
            currentUser[currencyField] = gameData[currencyField];
            
            // 同步到本地缓存
            var pointsKey = 'points_' + currentUser.id;
            localStorage.setItem(pointsKey, JSON.stringify({
                rout_points: gameData.rout_points || 0,
                prime_points: gameData.prime_points || 0,
                vip_points: gameData.vip_points || 0
            }));
            
            // 激活无限负荷
            var success = activateUnlimitedStamina(3600000);
            
            if (success) {
                saveGameData();
                updateUI();
                
            }
        }
    });
    
    // 在弹窗中添加支付选择
    setTimeout(function() {
        var costBox = document.getElementById('confirmCostBox');
        if (costBox) {
            // 清除之前的支付选项（防止重复添加）
            var oldPayment = document.getElementById('paymentOptions');
            if (oldPayment) oldPayment.remove();
            
            var paymentDiv = document.createElement('div');
            paymentDiv.id = 'paymentOptions';
            paymentDiv.innerHTML = '<div style="color: var(--tenno-gold); margin: 10px 0 5px; font-family: Orbitron;">选择支付方式：</div>' + paymentHtml;
            costBox.appendChild(paymentDiv);
        }
    }, 50);
}

function selectPaymentType(type) {
    // 更新全局变量
    window.selectedPaymentType = type;
    
    // 更新UI高亮
    document.querySelectorAll('.payment-option').forEach(function(el) {
        var elType = el.dataset.type;
        var isSelected = elType === type;
        var color = elType === 'rout' ? 'var(--tenno-gold)' : 
                   elType === 'prime' ? 'var(--orokin-cyan)' : 'var(--infested-green)';
        
        el.style.borderColor = isSelected ? color : '#333';
        el.style.background = isSelected ? color + '20' : 'transparent';
    });
}
					
					
					
function buyStaminaItem(name, price, type, staminaValue) {
    if (!gameData) return;

    const currentCredits = gameData.rout_points || 0;
    if (currentCredits < price) {
        showToast('💰 Rout不足！', 'error');
        return;
    }

    // ========== 无限负荷卡：直接激活，不走恢复剂逻辑 ==========
    if (type === 'buff') {
        gameData.rout_points -= price;
        currentUser.rout_points = gameData.rout_points;
        activateUnlimitedStamina(3600000);
        saveGameData();
        updateUI();
        return;
    }

    const currentStamina = gameData?.stamina || 0;
    const ABSOLUTE_MAX = 1000;

    let staminaGain = 0;
    let staminaText = '';

    if (staminaValue === 'full') {
        const targetMax = gameData?.stamina_max || STAMINA_MAX || 100;
        staminaGain = targetMax - currentStamina;
        
        if (staminaGain <= 0) {
            if (targetMax >= ABSOLUTE_MAX) {
                showToast(`负荷已达上限 (${currentStamina}/${ABSOLUTE_MAX})`, 'warning');
                return;
            }
            staminaGain = ABSOLUTE_MAX - currentStamina;
            if (staminaGain <= 0) {
                showToast(`负荷已达上限 (${currentStamina}/${ABSOLUTE_MAX})`, 'warning');
                return;
            }
        }
        staminaText = `负荷全满 (恢复 ${staminaGain} 点)`;
    } else {
        const amount = parseInt(staminaValue) || 0;
        const canGain = Math.max(0, ABSOLUTE_MAX - currentStamina);
        
        if (canGain <= 0) {
            showToast(`负荷已达上限`, 'warning');
            return;
        }
        
        if (amount > canGain) {
            showToast(`恢复剂效果超过上限，建议购买更小剂量`, 'warning');
            return;
        }
        
        staminaGain = amount;
        staminaText = ` ${staminaGain} 点负荷`;
    }

    showConfirmModal({
        icon: '🧪',
        title: '购买确认',
        desc: `确认购买 ${name}？`,
        costs: [
            { label: '消耗Rout', value: `💰 ${price}`, type: 'cost' },
            { label: '当前持有', value: `💰 ${currentCredits}`, type: 'neutral' },
            { label: '购买后剩余', value: `💰 ${currentCredits - price}`, type: 'neutral' },
            { label: '立即恢复', value: staminaText, type: 'gain' },
            { label: '当前负荷', value: `${currentStamina}/${ABSOLUTE_MAX}`, type: 'neutral' },
        ],
        onConfirm: function() {
            gameData.rout_points -= price;
            currentUser.rout_points = gameData.rout_points;

            const oldStamina = gameData?.stamina || 0;
            
            if (staminaValue === 'full') {
                const oldMax = gameData?.stamina_max || STAMINA_MAX || 100;
                gameData.stamina = Math.min(ABSOLUTE_MAX, oldMax + 50);
                gameData.stamina_max = Math.min(ABSOLUTE_MAX, oldMax + 50);
                stamina = gameData.stamina;
                STAMINA_MAX = gameData.stamina_max;
                showToast(`使用 ${name}！负荷全满，上限提升至 ${gameData.stamina_max}`, 'success');
            } else {
                gameData.stamina = Math.min(ABSOLUTE_MAX, oldStamina + staminaGain);
                stamina = gameData.stamina;
                showToast(`使用 ${name}！恢复 ${gameData.stamina - oldStamina} 点负荷`, 'success');
            }
            
            saveGameData();
            updateUI();
        }
    });
}
					
					function renderShop() {
					    const container = document.getElementById('shopList');
					    if (!container) return;
					
					    container.innerHTML = SHOP_ITEMS.map((item, index) => {
					        var typeLabel = '';
					        if (item.type === 'buff') {
					            typeLabel = '<span style="position:absolute;top:8px;right:8px;background:linear-gradient(135deg,#ff66ff,#cc33cc);color:#fff;padding:2px 8px;border-radius:4px;font-size:0.65rem;font-family:Orbitron;z-index:5;">BUFF</span>';
					        } else if (item.type === 'consumable') {
					            typeLabel = '<span style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.5);border:1px solid ' + (item.color || '#333') + ';color:' + (item.color || '#888') + ';padding:2px 8px;border-radius:4px;font-size:0.65rem;z-index:5;">消耗品</span>';
					        }
					        return `
					        <div class="shop-item" style="border-color: ${item.color || '#333'}; position: relative;">
					            ${typeLabel}
					            <div class="shop-image" style="background: linear-gradient(135deg, rgba(0,0,0,0.5), ${item.color ? item.color + '15' : 'rgba(0,0,0,0.5)'});">${item.icon}</div>
					            <div class="shop-info">
					                <div class="shop-name">${item.name}</div>
					                <div class="shop-desc">${item.desc}</div>
					                <div class="shop-price">
					                    <div class="price-tag" style="color: ${item.color || 'var(--sentient-purple)'};">💰 ${item.price}</div>
					                    <button class="shop-btn" onclick="buyShopItem('${item.name}', ${item.price}, '${item.type}', ${item.stamina || 0})" style="background: linear-gradient(135deg, ${item.color || 'var(--sentient-purple)'}, ${item.color ? item.color + 'aa' : '#cc44cc'});">
					                        购买
					                    </button>
					                </div>
					            </div>
					        </div>
					    `;
					    }).join('');
					}

					function buyShopItem(name, price, type, staminaAmount) {
					    if (!gameData || (gameData.prime_points || 0) < price) {
					        showToast('虚空币不足！', 'error');
					        return;
					    }
					
					    gameData.prime_points -= price;
					
					    // 负荷恢复剂效果处理...
					    if (type === 'consumable') {
					        if (staminaAmount === 'full') {
					            stamina = STAMINA_MAX;
					            STAMINA_MAX = Math.min(1000, STAMINA_MAX + 50);
					            showToast(`使用 ${name}！负荷全满，上限 +50`, 'success');
					        } else {
					            const oldStamina = stamina;
					            stamina = Math.min(STAMINA_MAX, stamina + staminaAmount);
					            showToast(`使用 ${name}！恢复 ${stamina - oldStamina} 点负荷`, 'success');
					        }
					        localStorage.setItem('stamina_' + currentUser.id, String(stamina));
					        updateUI();
					    } else if (type === 'buff') {
					        // ========== 一小时无限负荷卡 ==========
					        if (name === '一小时无限负荷卡') {
					            activateUnlimitedStamina(3600000);
					        }
					    } else {
					        showToast(`成功购买 ${name}！`, 'success');
					    }
					
					    saveGameData();
					    updateUI();
					    
					    // ========== 同步更新所有积分显示元素 ==========
					    var shopPointsEl = document.getElementById('shopPoints');
					    if (shopPointsEl) shopPointsEl.textContent = gameData.prime_points || 0;
					    var baroPointsEl = document.getElementById('baroPoints');
					    if (baroPointsEl) baroPointsEl.textContent = gameData.prime_points || 0;
					    updateMarooPoints();
					}
					
					function renderBaroShop() {
					    const container = document.getElementById('baroShopList');
					    const points = gameData.prime_points || 0;
					    document.getElementById('baroPoints').textContent = points;
					    
					    if (!container) return;
					    
					    
					    container.innerHTML = baroItems.map(item => `
					        <div class="shop-item" style="border-color: ${item.color}; box-shadow: 0 0 15px ${item.color}20;">
					            <div class="shop-image" style="background: linear-gradient(135deg, rgba(0,212,255,0.05), rgba(200,168,75,0.05));">
					                <span style="font-size: 3rem; filter: drop-shadow(0 0 10px ${item.color});">${item.icon}</span>
					            </div>
					            <div class="shop-info">
					                <div class="shop-name" style="color: ${item.color};">${item.name}</div>
					                <div class="shop-desc">${item.desc}</div>
					                <div class="shop-price">
					                    <span class="price-tag" style="color: var(--orokin-cyan);">
					                        <span>💎</span>
					                        <span>${item.price}</span>
					                    </span>
					                    <button class="shop-btn" onclick="buyBaroItem('${item.name}', ${item.price}, '${item.type}')"
					                        style="background: linear-gradient(135deg, var(--orokin-cyan-dim), var(--orokin-cyan));"
					                        ${points < item.price ? 'disabled' : ''}>
					                        ${points < item.price ? '💎 不足' : '购买'}
					                    </button>
					                </div>
					            </div>
					        </div>
					    `).join('');
					}
					
						function buyBaroItem(name, price, type) {
						    const points = gameData.prime_points || 0;
						    if (points < price) {
						        showToast('杜卡德金币不足！', 'error');
						        return;
						    }
						    
						    gameData.prime_points = points - price;
						    currentUser.rout_points = gameData.rout_points;
						    
						    // 添加物品到矩阵...
						    if (type === 'pack') addToWarehouse(name, '🎁', 1, 'pack');
						    else if (type === 'blueprint') addToWarehouse(name, '📜', 1, 'blueprint');
						    else addToWarehouse(name, '⚡', 1, type);
						    
						    saveGameData();
						    updateUI();
						    renderBaroShop();
						    
						    // ========== 同步更新所有积分显示 ==========
						    var shopPointsEl = document.getElementById('shopPoints');
						    if (shopPointsEl) shopPointsEl.textContent = gameData.prime_points || 0;
						    
						    // 同步更新 Maroo市集的 marooPoints（申秉之魂数量）
						    updateMarooPoints();
						    
						    showToast(`成功购买 ${name}！`, 'success');
						}
						
						
						// 同步更新所有积分显示元素
						function syncPrimePointsDisplay() {
						    var points = gameData.prime_points || 0;
						    
						    var shopPointsEl = document.getElementById('shopPoints');
						    if (shopPointsEl) shopPointsEl.textContent = points;
						    
						    var baroPointsEl = document.getElementById('baroPoints');
						    if (baroPointsEl) baroPointsEl.textContent = points;
						    
						    // 同步更新 Maroo市集的 marooPoints（申秉之魂数量）
						    updateMarooPoints();
						}
					// ═══════════════════════════════════════════════════════════════
					//  Maroo 的市集功能
					// ═══════════════════════════════════════════════════════════════
					function enterMarooMarket() {
						document.getElementById('marooMarketEntrance').style.display = 'none';
						document.getElementById('primeShopArea').style.display = 'none';
						document.getElementById('page-maroo').style.display = 'block';
						updateMarooPoints();
						renderMarooSellGrid();
						renderMarooBuyGrid();
					}

					function backToPrimeShop() {
						document.getElementById('page-maroo').style.display = 'none';
						document.getElementById('marooMarketEntrance').style.display = 'block';
						document.getElementById('primeShopArea').style.display = 'block';
					}
					

					function backToBaroShop() {
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-shop').classList.remove('hidden');
						document.getElementById('shopPoints').textContent = gameData.prime_points || 0;
					}

					function renderMarooSellGrid() {
						const grid = document.getElementById('marooSellGrid');
						if (!grid) return;

						// 只显示成品战甲（排除蓝图、部件）
						const sellableItems = warehouse.filter(item => {
							const name = item.name || '';
							// 必须是战甲类型，且不能包含蓝图/头部/系统/机体等关键字
							const isWarframe = item.type === 'warframe' || (typeof WARFRAME_NAMES !== 'undefined' && WARFRAME_NAMES.some(wf => name.includes(wf)));
							const isBlueprint = name.includes('蓝图') || name.includes('头部') || name.includes('神经') || name.includes('系统') || name.includes('机体');
							return isWarframe && !isBlueprint;
						});

						if (sellableItems.length === 0) {
							grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #666; padding: 40px;">📦 矩阵中暂无可出售物品<br><span style="font-size: 0.8rem; color: #555;">去看看重构装置吧！</span></div>`;
							return;
						}

						grid.innerHTML = sellableItems.map(item => {
							// 成品战甲售价
							let price = 100;
							if (item.name.includes('Prime')) price = 2000;
							else if (item.name.includes('Umbra')) price = 3000;

							// 优先使用战甲图片
							let wfImage = null;
							if (typeof WARFRAMES !== 'undefined') {
								const wfKey = Object.keys(WARFRAMES).find(key => {
									const wfName = WARFRAMES[key].name || '';
									return item.name.includes(wfName);
								});
								if (wfKey && WARFRAMES[wfKey].image) {
									wfImage = WARFRAMES[wfKey].image;
								}
							}

							const imgHtml = wfImage 
								? `<img src="${wfImage}" style="width: 100%; height: 100%; object-fit: contain;" onerror="this.parentNode.innerHTML='<div style=\'font-size: 4rem;\'>${item.icon}</div>'">`
								: `<div style="font-size: 4rem;">${item.icon}</div>`;

							return `
							<div style="background: var(--panel-bg); border: 1px solid #333; border-radius: 10px; padding: 15px; text-align: center; transition: all 0.3s;" 
								 onmouseover="this.style.borderColor='var(--tenno-gold)'; this.style.transform='translateY(-3px)';" 
								 onmouseout="this.style.borderColor='#333'; this.style.transform='none';">
								<div style="font-size: 2.5rem; margin-bottom: 8px; height: 80px; display: flex; align-items: center; justify-content: center;">${imgHtml}</div>
								<div style="font-weight: 700; color: #fff; margin-bottom: 5px; font-size: 0.9rem;">${item.name}</div>
								<div style="color: #888; font-size: 0.8rem; margin-bottom: 10px;">持有: x${item.amount} | 成品战甲</div>
								<div style="color: var(--tenno-gold); font-family: 'Orbitron'; font-size: 1rem; margin-bottom: 10px;">💰 ${price}</div>
								<button class="btn" onclick="sellToMaroo('${item.name}', ${price})" 
										style="width: 100%; padding: 8px; font-size: 0.8rem; background: linear-gradient(135deg, var(--tenno-gold-dim), var(--tenno-gold)); color: #000;">
									出售
								</button>
							</div>
							`;
						}).join('');
					}

					

const MAROO_BUY_ITEMS = [
    {
        name: 'EMBER·传家宝',
        icon: '',
        image: 'GAME/items/EMBER.jpg',
        desc: '恒星之火，焚尽万物。Ember 驾驭烈焰之力，以冷静的头脑直面炽热的战场。传家宝中封印着远古太阳风暴的余烬。',
        price: 1,
        color: '#ff66ff',
        type: 'heirloom'
    },
    {
        name: 'RHINO·传家宝',
        icon: '️',
        image: 'GAME/items/RHINO.jpg',
        desc: '钢铁巨兽，坚不可摧。Rhino 以铁甲之躯冲锋陷阵，其战吼可令盟友战力倍增。传家宝承载着旧战争中那道撕裂金属与血肉的狂暴身影。',
        price: 1,
        color: '#00d4ff',
        type: 'heirloom'
    },
    {
        name: 'Valkyr·传家宝',
        icon: '',
        image: 'GAME/items/Valkyr.jpg',
        desc: '狂怒之姿，撕裂虚空。Valkyr 曾是优雅的 Gersemi，却在 Alad V 的残酷实验中化为复仇的狂战士。传家宝铭刻着她被剥夺的痛楚与不屈的嘶吼。',
        price: 1,
        color: '#ffd700',
        type: 'heirloom'
    },
    {
        name: 'VAUBAN·传家宝',
        icon: '',
        image: 'GAME/items/VAUBAN.jpg',
        desc: '战术大师，巧夺天工。Vauban 以精妙的发明掌控战场，电光无人机与轨道炮击皆在其运筹之中。传家宝镌刻着 Tenno 文字"Evolution"——进化的终极形态。',
        price: 1,
        color: '#c8a84b',
        type: 'heirloom'
    }
];

// ═══════════════════════════════════════════════════════════════
//  Maroo 市集 - 购买处理
// ═══════════════════════════════════════════════════════════════
function buyFromMaroo(itemName, price, itemType) {
    if (!currentUser || !gameData) {
        showToast('请先登录', 'error');
        return;
    }

    // 从矩阵读取申秉之魂数量
    var sbItem = (window.warehouse || []).find(function(w) { return w && w.name === '申秉之魂'; });
    var currentSoul = sbItem ? (sbItem.amount || 0) : 0;

    if (currentSoul < price) {
        showToast('申秉之魂不足！', 'error');
        return;
    }

    // 扣除申秉之魂
    sbItem.amount -= price;
    if (sbItem.amount <= 0) {
        var idx = window.warehouse.findIndex(function(w) { return w && w.name === '申秉之魂'; });
        if (idx >= 0) window.warehouse.splice(idx, 1);
    }
    if (gameData) gameData.warehouse = window.warehouse;

    // 添加物品到矩阵
    var itemIcon = '📦';
    var itemColor = '#888';
    for (var i = 0; i < MAROO_BUY_ITEMS.length; i++) {
        if (MAROO_BUY_ITEMS[i].name === itemName) {
            itemIcon = MAROO_BUY_ITEMS[i].icon;
            itemColor = MAROO_BUY_ITEMS[i].color;
            break;
        }
    }

    addToWarehouse(itemName, itemIcon, 1, itemType || 'heirloom');
	recordMarooExchange('buy', itemName, price, itemType || 'heirloom');

    // 更新显示
    var marooPointsEl = document.getElementById('marooPoints');
    if (marooPointsEl) {
        var newSbItem = (window.warehouse || []).find(function(w) { return w && w.name === '申秉之魂'; });
        updateMarooPoints();
    }

    updateUI();
    saveGameData();

    showToast('购买成功: ' + itemName + ' (-' + price + ' 申秉之魂)', 'success');

    // 刷新出售列表（因为矩阵变了）
    renderMarooSellGrid();
}

// ═══════════════════════════════════════════════════════════════
//  记录 Maroo 市集兑换到 game_exchanges 表
// ═══════════════════════════════════════════════════════════════
async function recordMarooExchange(exchangeType, itemName, price, itemType) {
    if (!currentUser) return;
    
    try {
        // 获取北京时间（UTC+8）
        const now = new Date();
        const beijingTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
        const formattedTime = beijingTime.toISOString().replace('Z', '+08:00');
        
        const { error } = await sb
            .from('game_exchanges')
            .insert({
                user_id: currentUser.id,
                username: currentUser.username || '未知',
                exchange_type: exchangeType,  // 'buy' 或 'sell'
                item_name: itemName,
                price: price,
                item_type: itemType,
                exchange_time: formattedTime  // 北京时间
            });
        
        if (error) {
            console.error('记录兑换失败:', error);
        } else {
            console.log('兑换记录已保存:', {
                type: exchangeType,
                item: itemName,
                price: price,
                time: formattedTime
            });
        }
    } catch (err) {
        console.error('记录兑换异常:', err);
    }
}

// ═══════════════════════════════════════════════════════════════
//  Maroo 市集 - 传家宝购买网格渲染（新版 heirloom-card 系统）
// ═══════════════════════════════════════════════════════════════
function renderMarooBuyGrid() {
    const grid = document.getElementById('marooBuyGrid');
    if (!grid) return;

    // 检查已拥有的传家宝
    const ownedItems = {};
    (window.warehouse || []).forEach(function(w) {
        if (w && w.type === 'heirloom') {
            ownedItems[w.name] = true;
        }
    });

    // 战甲类名映射
    const classMap = {
        'EMBER·传家宝': 'heirloom-ember',
        'RHINO·传家宝': 'heirloom-rhino',
        'Valkyr·传家宝': 'heirloom-valkyr',
        'VAUBAN·传家宝': 'heirloom-vauban'
    };

    grid.innerHTML = MAROO_BUY_ITEMS.map(function(item) {
        const isOwned = ownedItems[item.name];
        const cardClass = classMap[item.name] || 'heirloom-ember';
        
        const imgHtml = item.image 
            ? '<img src="' + item.image + '" alt="' + item.name + '" loading="lazy" ' +
              'onerror="this.parentNode.innerHTML=\'<<div style=\\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;\\\'><span style=\\\'font-size:3rem;\\\'>' + item.icon + '</span></div>\'">'
            : '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;"><span style="font-size:3rem;">' + item.icon + '</span></div>';
        
        return '' +
            '<div class="' + cardClass + '">' +
                (isOwned ? '<div class="heirloom-owned">✓ 已拥有</div>' : '') +
                '<div class="heirloom-badge">传家宝</div>' +
                '<div class="heirloom-image-wrap">' + imgHtml + '</div>' +
                '<div class="heirloom-info">' +
                    '<div class="heirloom-header">' +
                        '<span class="heirloom-icon">' + item.icon + '</span>' +
                        '<div class="heirloom-name">' + item.name + '</div>' +
                    '</div>' +
                    '<div class="heirloom-desc">' + item.desc + '</div>' +
                    '<div class="heirloom-footer">' +
                        '<div class="heirloom-price">' +
                            '<img src="GAME/申秉之魂.png" alt="" onerror="this.style.display=\'none\'">' +
                        '</div>' +
                        '<button class="heirloom-buy-btn" onclick="buyFromMaroo(\'' + item.name + '\',' + item.price + ',\'' + item.type + '\')" ' +
                            (isOwned ? 'disabled' : '') + '>' +
                            (isOwned ? '已拥有' : '兑换') +
                        '</button>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }).join('');
}

function sellToMaroo(itemName, price) {
    if (!gameData) return;

    const item = warehouse.find(w => w.name === itemName);
    if (!item || item.amount <= 0) {
        showToast('物品不存在或数量不足！', 'error');
        return;
    }

    showConfirmModal({
        icon: '💰',
        title: '出售确认',
        desc: `确认出售 ${itemName}？`,
        costs: [
            { label: '出售物品', value: `${item.icon} ${itemName} x1`, type: 'cost' },
            { label: '获得Rout', value: (() => {
                var limit = window.DAILY_CASH_LIMIT || 100;
                var earned = gameData.today_cash_earned || 0;
                var remaining = Math.max(0, limit - earned);
                var actualGain = Math.min(price, remaining);
                if (actualGain <= 0) return `💰 +0 (已达上限)`;
                if (actualGain < price) return `💰 +${actualGain} (上限限制)`;
                return `💰 +${actualGain}`;
            })(), type: (() => {
                var limit = window.DAILY_CASH_LIMIT || 100;
                var earned = gameData.today_cash_earned || 0;
                return (earned >= limit) ? 'cost' : 'gain';
            })() },
            { label: '当前持有Rout', value: `💰 ${gameData.rout_points || 0}`, type: 'neutral' },
            { label: '每日上限', value: `💰 ${gameData.today_cash_earned || 0}/${window.DAILY_CASH_LIMIT || 100}`, type: (gameData.today_cash_earned || 0) >= (window.DAILY_CASH_LIMIT || 100) ? 'cost' : 'neutral' }
        ],
onConfirm: function() {
                                                    
                                                    
                                                    // 检查每日现金上限
                                                    
                                                    var canEarn = window.canEarnCashToday(price);
                                                    
                                                    
                                                    if (canEarn === false) {
                                                       
                                                        showToast('今日Rout获取已达上限，无法出售', 'warning');
                                                        return;
                                                    }
                                                    var actualPrice = (typeof canEarn === 'number') ? canEarn : price;
                                                   
                                                    
                                                    item.amount -= 1;
                                                    if (item.amount <= 0) {
                                                        const idx = warehouse.findIndex(w => w.name === itemName);
                                                        if (idx >= 0) warehouse.splice(idx, 1);
                                                    }
                                                    
                                                    gameData.rout_points = (gameData.rout_points || 0) + actualPrice;
                                                    currentUser.rout_points = gameData.rout_points;
                                                    
                                                    
                                                    window.recordCashEarned(actualPrice);
                                                    
                                                   
                                                    
                                                    showToast(`成功出售 ${itemName}！获得 ${actualPrice} Rout`, 'success');
                                                    saveGameData();
                                                    updateUI();
                                                    updateMarooPoints();
                                                    renderMarooSellGrid();
                                                    renderWarehouse();
                                                }
    });
}

					// ═══════════════════════════════════════════════════════════════
					//  辅助函数
					// ═══════════════════════════════════════════════════════════════
					function showToast(message, type = 'info') {
						const container = document.getElementById('toastContainer');
						if (!container) return;

						const toast = document.createElement('div');
						toast.className = `toast ${type}`;
						toast.textContent = message;
						container.appendChild(toast);

						setTimeout(() => {
							toast.remove();
						}, 3000);
					}

					function showLoading(show) {
						const overlay = document.getElementById('loadingOverlay');
						if (overlay) {
							if (show) overlay.classList.add('active');
							else overlay.classList.remove('active');
						}
					}

					function updateSyncStatus(online, status) {
						const el = document.getElementById('syncStatus');
						const text = document.getElementById('syncText');
						if (!el || !text) return;

						el.className = 'sync-status';
						if (status === 'syncing') {
							el.classList.add('sync-syncing');
							text.textContent = '同步中...';
						} else if (online) {
							el.classList.add('sync-online');
							text.textContent = '在线';
						} else {
							el.classList.add('sync-offline');
							text.textContent = status === 'offline' ? '离线' : '连接失败';
						}
					}

					function closeModal() {
					    const modalOverlay = document.getElementById('modalOverlay');
					    if (modalOverlay) {
					        modalOverlay.classList.remove('active');
					        modalOverlay.style.display = '';  // ← 重置，让 CSS 控制
					        modalOverlay.style.zIndex = '';     // ← 重置
					    }
					}
					
					function handleModalOverlayClick(event) {
					    const modalOverlay = document.getElementById('modalOverlay');
					    // 如果是战甲选择模式，不允许点击背景关闭
					    if (modalOverlay && modalOverlay._warframeSelectMode) {
					        return;
					    }
					    closeModal();
					}

					function handleModalOverlayClick(event) {
						const modalOverlay = document.getElementById('modalOverlay');
						if (event.target === modalOverlay) {
							// 战甲选择模式下禁止背景点击关闭
							if (modalOverlay._warframeSelectMode) {
								// 震动提示
								const modal = modalOverlay.querySelector('.modal');
								if (modal) {
									modal.style.animation = 'none';
									modal.offsetHeight;
									modal.style.animation = 'shake 0.5s ease';
									setTimeout(function() {
										modal.style.animation = 'fadeIn 0.3s ease';
									}, 500);
								}
								return;
							}
							closeModal();
						}
					}

					function createFissureEffect() {
						for (let i = 0; i < 30; i++) {
							setTimeout(() => {
								const particle = document.createElement('div');
								particle.className = 'fissure-particle';
								particle.style.left = Math.random() * 100 + 'vw';
								particle.style.top = Math.random() * 100 + 'vh';
								particle.style.animationDelay = Math.random() * 0.5 + 's';
								document.body.appendChild(particle);
								setTimeout(() => particle.remove(), 2000);
							}, i * 50);
						}
					}








					// ═══════════════════════════════════════════════════════════════
					//  测试面板
					// ═══════════════════════════════════════════════════════════════
					function openCheatPanel() {
						document.getElementById('modalTitle').textContent = '⚡ 测试面板';
						document.getElementById('modalContent').innerHTML =
							`
        <div style="display: grid; gap: 10px;">
            <button class="btn" onclick="cheatAddCredits()">+1000 Rout</button>
            <button class="btn" onclick="cheatAddPlatinum()">+100 Platinum</button>
            <button class="btn" onclick="cheatAddPoints()">+100 Prime</button>
            <button class="btn" onclick="cheatAddStamina()">+50 负荷</button>
            <button class="btn" onclick="cheatAddXP()">+1000 经验</button>
            <button class="btn" style="background: var(--grineer-red);" onclick="closeModal()">关闭</button>
        </div>
    `;
						document.getElementById('modalOverlay').classList.add('active');
					}

					function cheatAddCredits() {
						if (gameData) {
							gameData.credits = (gameData.credits || 0) + 1000;
							updateUI();
							saveGameData();
							showToast('+1000 Rout', 'success');
						}
					}

					function cheatAddPlatinum() {
						if (gameData) {
							gameData.platinum = (gameData.platinum || 0) + 100;
							updateUI();
							saveGameData();
							showToast('+100 Platinum', 'success');
						}
					}

					function cheatAddPoints() {
						showToast('积分仅通过肃清获得', 'warning');
					}

					function cheatAddStamina() {
						stamina = Math.min(STAMINA_MAX, stamina + 100);
						if (currentUser) {
							localStorage.setItem('stamina_' + currentUser.id, String(stamina));
						}
						updateUI();
						showToast('+100 负荷', 'success');
					}

					function cheatAddXP() {
						addXP(1000);
						updateUI();
						saveGameData();
						showToast('+1000 经验', 'success');
					}
					
					

					


					function continueLastBattle() {
						if (selectedPlanet) {
							startAutoBattleWithPlanet(selectedPlanet);
						} else {
							showToast('请先选择一个星球', 'warning');
							backToPlanetFromBattle();
						}
					}

					function handleBattleBtnPress(e) {
						if (battleBtnPressState.autoMode) return;
						if (e) {
							e.preventDefault();
							e.stopPropagation();
						}

						const btn = document.getElementById('continueBattleBtn');
						const progress = document.getElementById('longPressProgress');

						battleBtnPressState.pressing = true;
						battleBtnPressState.longPressTriggered = false;
						btn.classList.add('btn-long-pressing');

						if (progress) {
							progress.style.width = '0%';
							progress.style.transition = 'width ' + (battleBtnPressState.longPressThreshold / 1000) + 's linear';
							requestAnimationFrame(() => {
								if (progress && battleBtnPressState.pressing) {
									progress.style.width = '100%';
								}
							});
						}

						battleBtnPressState.timer = setTimeout(() => {
							if (battleBtnPressState.pressing) {
								battleBtnPressState.longPressTriggered = true;
								toggleAutoBattleMode(true);
							}
						}, battleBtnPressState.longPressThreshold);
					}

					function handleBattleBtnClick(e) {
						// 短点击：如果不在自动模式下，执行普通继续肃清
						if (!battleBtnPressState.autoMode && !battleBtnPressState.pressing) {
							continueLastBattle();
						}
					}

					function handleBattleBtnRelease(e) {
						if (battleBtnPressState.autoMode) return;
						if (e) {
							e.preventDefault();
							e.stopPropagation();
						}

						const btn = document.getElementById('continueBattleBtn');
						const progress = document.getElementById('longPressProgress');

						battleBtnPressState.pressing = false;
						btn.classList.remove('btn-long-pressing');

						if (battleBtnPressState.timer) {
							clearTimeout(battleBtnPressState.timer);
							battleBtnPressState.timer = null;
						}

						if (progress) {
							progress.style.width = '0%';
							progress.style.transition = 'width 0.2s ease';
						}

						// 短按执行普通继续肃清（仅在非自动模式下）
						if (!battleBtnPressState.longPressTriggered && !battleBtnPressState.autoMode) {
							continueLastBattle();
						}
					}

					function toggleAutoBattleMode(enable) {
						battleBtnPressState.autoMode = enable;
						const btn = document.getElementById('continueBattleBtn');
						const text = document.getElementById('continueBattleBtnText');
						const indicator = document.getElementById('autoBattleIndicator');
						const progress = document.getElementById('longPressProgress');
						const startBtn = document.getElementById('startBattleBtn');
						const stopBtn = document.getElementById('stopBattleBtn');

						if (enable) {
							btn.classList.add('btn-auto-mode');
							btn.classList.remove('btn-long-pressing');
							if (text) text.textContent = '♻️ 自动巡航中';
							if (indicator) indicator.style.display = 'inline-flex';
							if (progress) progress.style.width = '0%';

							// 自动模式：隐藏开始/继续按钮
							if (startBtn) startBtn.style.display = 'none';
							if (btn) btn.style.display = 'none';

							showToast('已开启自动巡航模式！将自动消耗负荷连续肃清', 'success');
							createFissureEffect();
							startAutoBattleLoop();
						} else {
							btn.classList.remove('btn-auto-mode');
							if (text) text.textContent = '⚔️ 肃清(-3⚡)';
							if (indicator) indicator.style.display = 'none';
							// 重置停止请求标记
							battleStopRequested = false;
							stopAutoBattleLoop();
							// 确保自动肃清状态完全重置
							autoBattleState.active = false;
							if (autoBattleState.timer) {
								clearInterval(autoBattleState.timer);
								autoBattleState.timer = null;
							}

							// 退出自动模式：恢复按钮显示
							if (startBtn) {
								startBtn.style.display = 'block';
								startBtn.textContent = '🌍 肃清导航';
							}
							if (btn) {
								btn.style.display = selectedPlanet ? 'block' : 'none';
								btn.disabled = false;
							}
							if (stopBtn) stopBtn.style.display = 'none';
						}
					}

					function startAutoBattleLoop() {
						if (battleStopRequested) {
							return;
						}

						if (selectedPlanet && stamina >= STAMINA_BATTLE_COST && !autoBattleState.active) {
							startAutoBattleWithPlanet(selectedPlanet);
						}

						autoBattleLoopTimer = setInterval(() => {
							if (battleStopRequested && !autoBattleState.active) {
								stopAutoBattleLoop();
								toggleAutoBattleMode(false);
								addBattleLog('🛑 自动巡航已停止', 'info');
								return;
							}

							if (!battleBtnPressState.autoMode) {
								stopAutoBattleLoop();
								return;
							}
							if (!autoBattleState.active && selectedPlanet && stamina >= STAMINA_BATTLE_COST) {
								if (battleStopRequested) {
									stopAutoBattleLoop();
									toggleAutoBattleMode(false);
									addBattleLog('🛑 自动巡航已停止', 'info');
									return;
								}
								startAutoBattleWithPlanet(selectedPlanet);
							} else if (stamina < STAMINA_BATTLE_COST && !autoBattleState.active) {
								addBattleLog('⚡ 负荷不足，自动巡航已暂停', 'warning');
								showToast('负荷不足，自动巡航已暂停', 'warning');
								toggleAutoBattleMode(false);
							}
						}, 2000);
					}

					function stopAutoBattleLoop() {
						if (autoBattleLoopTimer) {
							clearInterval(autoBattleLoopTimer);
							autoBattleLoopTimer = null;
						}
					}

					function backToHome() {
						document.getElementById('loginScreen').classList.remove('hidden');
						document.getElementById('gameContainer').style.display = 'none';
					}

					function backToPlanetFromBattle() {
						// 停止当前肃清
						if (autoBattleState.active) {
							autoBattleState.active = false;
							if (autoBattleState.timer) {
								clearInterval(autoBattleState.timer);
								autoBattleState.timer = null;
							}
						}
						// 停止自动肃清循环
						if (battleBtnPressState.autoMode) {
							stopAutoBattleLoop();
							toggleAutoBattleMode(false);
						}
						battleStopRequested = false;

						// 重置肃清页面标记
						battlePageEntered = false;

						// 切换到星球选择页
						document.querySelectorAll('.page-section').forEach(s => s.classList.add('hidden'));
						document.getElementById('page-planetselect').classList.remove('hidden');

						// 更新导航栏
						document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
						const navItems = document.querySelectorAll('.nav-item');
						for (let i = 0; i < navItems.length; i++) {
							const onclick = navItems[i].getAttribute('onclick');
							if (onclick && onclick.includes("'planetselect'")) {
								navItems[i].classList.add('active');
								break;
							}
						}

						// 重置按钮状态
						const startBtn = document.getElementById('startBattleBtn');
						const continueBtn = document.getElementById('continueBattleBtn');
						const stopBtn = document.getElementById('stopBattleBtn');

						if (startBtn) startBtn.style.display = 'block';
						if (continueBtn) {
							continueBtn.style.display = 'none';
							continueBtn.classList.remove('btn-auto-mode');
							continueBtn.disabled = false;
						}
						if (stopBtn) stopBtn.style.display = 'none';

						// 清空肃清日志
						const log = document.getElementById('autoBattleLog');
						if (log) log.innerHTML =
							'<div style="color: #666; text-align: center; padding-top: 80px;">长按⚔️ 肃清(-3⚡) ️️消耗负荷进行连续肃清...</div>';

						// 清空掉落
						const drops = document.getElementById('battleDrops');
						if (drops) drops.innerHTML = '';

						// 重置行动条
						autoBattleState.playerActionBar = 0;
						autoBattleState.enemyActionBar = 0;
						updateActionBarUI();

						// 重新渲染星球选择
						renderPlanetSelect();
					}
					
						// ═══════════════════════════════════════════════════════════════
						//  第1页：星图导航 - 渲染派系回响
						// ═══════════════════════════════════════════════════════════════
											function renderPlanetSelect() {
											    if (typeof PLANETS === 'undefined' || !PLANETS) {
return;
											    }
											    const grid = document.getElementById('planetGrid');
											    if (!grid) return;
						
											    const playerLevel = getCurrentWarframeData().level;
						
											    grid.innerHTML = PLANETS.map(planet => {
											        const isLocked = planet.locked === true;
											        const lockedClass = isLocked ? 'locked' : '';
											        const lockedStyle = isLocked ? 'opacity: 0.4; cursor: not-allowed; border-color: #333;' : 'cursor: pointer;';
											        const onclick = isLocked ? '' : `onclick="enterFactionZone('${planet.faction}')"`;
											        const lockIcon = isLocked ? '<div style="position:absolute;top:10px;right:10px;font-size:1.5rem;z-index:4;">🔒</div>' : '';
						
											        return `
						            <div class="planet-card ${lockedClass}" ${onclick}
						                 style="position: relative; background: var(--panel-bg); border: 1px solid ${isLocked ? '#333' : planet.color}; 
						                        border-radius: 12px; overflow: hidden; transition: all 0.3s; ${lockedStyle};
						                        aspect-ratio: 4/3; cursor: pointer;">
						                ${lockIcon}
						                <div style="position: absolute; inset: 0; z-index: 1;">
						                    ${planet.image ? `
						                        <img src="${planet.image}" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" 
						                             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5);\\'><span style=\\'font-size: 4rem;\\'>${planet.icon}</span></div>';">
						                    ` : `
						                        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5);">
						                            <span style="font-size: 4rem;">${planet.icon}</span>
						                        </div>
						                    `}
						                </div>
						                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.85) 100%); z-index: 2; pointer-events: none;"></div>
						                <div style="position: absolute; bottom: 0; right: 0; left: 0; padding: 15px; z-index: 3; text-align: right; pointer-events: none;">
						                    <div style="font-family: 'Orbitron'; color: var(--tenno-gold); font-size: 1.1rem; margin-bottom: 3px; text-shadow: 0 0 8px rgba(0,0,0,0.8);">${planet.name}</div>
						                    
						                    <div style="font-size: 0.7rem; color: ${planet.color}; margin-bottom: 3px; text-shadow: 0 0 6px rgba(0,0,0,0.8);">${planet.factionName}</div>
						                </div>
						            </div>
						        `;
											    }).join('');
											}
						

					
					// ═══════════════════════════════════════════════════════════════
					//  初始化(加载完成)
					// ═══════════════════════════════════════════════════════════════
					document.addEventListener('DOMContentLoaded', () => {
						init();
						startStaminaRegen();

						const battleBtn = document.getElementById('continueBattleBtn');
						if (battleBtn) {
							battleBtn.addEventListener('touchstart', handleBattleBtnPress, {
								passive: false
							});
						}
					});

					

					// ═══════════════════════════════════════════════════════════════
					//  暴露全局函数
					// ═══════════════════════════════════════════════════════════════
					window.switchPage = switchPage;
window.startAutoBattle = startAutoBattleWithPlanet;
					window.stopAutoBattle = stopAutoBattle;
					window.startAutoMining = startAutoMining;
					window.stopAutoMining = stopAutoMining;
					window.startAutoGathering = startAutoGathering;
					window.stopAutoGathering = stopAutoGathering;
					window.switchTab = switchTab;
					window.handleLogin = handleLogin;
					window.handleRegister = handleRegister;
					window.logout = logout;
					window.selectWarframe = selectWarframe;
					window.openCheatPanel = openCheatPanel;
					window.backToHome = backToHome;
					window.closeModal = closeModal;
					window.handleModalOverlayClick = handleModalOverlayClick;
					window.cheatAddCredits = cheatAddCredits;
					window.cheatAddPlatinum = cheatAddPlatinum;
					window.cheatAddPoints = cheatAddPoints;
					window.cheatAddStamina = cheatAddStamina;
					window.cheatAddXP = cheatAddXP;
					window.craftItem = craftItem;
					window.buyShopItem = buyShopItem;
					window.checkAdminAccess = checkAdminAccess;
					window.adminRestoreStamina = adminRestoreStamina;
					window.adminOverchargeStamina = adminOverchargeStamina;
					window.adminGiveStaminaItems = adminGiveStaminaItems;
					window.cheatAddVip = cheatAddVip;
					window.updateInfoUI = updateInfoUI;
					window.adminClearWarehouse = adminClearWarehouse;
					window.adminResetStats = adminResetStats;
					window.adminUnlockAllCards = adminUnlockAllCards;
					window.adminMaxLevel = adminMaxLevel;
					window.adminInstantBattle = adminInstantBattle;
					window.adminPromoteCardStar = adminPromoteCardStar;
					window.updateActionBarUI = updateActionBarUI;
					window.addShardConvertLog = addShardConvertLog;
					window.showFloatingShard = showFloatingShard;
					window.renderPlanetSelect = renderPlanetSelect;
					window.backToPlanetFromBattle = backToPlanetFromBattle;
					window.continueLastBattle = continueLastBattle;
					window.handleBattleBtnPress = handleBattleBtnPress;
					window.handleBattleBtnRelease = handleBattleBtnRelease;
					window.toggleAutoBattleMode = toggleAutoBattleMode;
					window.battlePageEntered = battlePageEntered;
					window.requestStopBattle = requestStopBattle;
					window.stopAutoBattleLoop = stopAutoBattleLoop;
					window.switchRegion = switchRegion;
					window.currentRegionFilter = currentRegionFilter;
window.adminPromoteCardStar = adminPromoteCardStar;
					// 派系系统
					window.enterFactionZone = enterFactionZone;
					window.renderFactionPlanets = renderFactionPlanets;
					window.selectFactionPlanet = selectFactionPlanet;
					window.showFactionPlanetConfirm = showFactionPlanetConfirm;
					window.enterFactionZones = enterFactionZones;
					window.renderFactionZones = renderFactionZones;
					window.selectFactionZone = selectFactionZone;
					window.confirmFactionBattle = confirmFactionBattle;
					window.confirmFactionZoneBattle = confirmFactionZoneBattle;
					window.backToFactionPlanets = backToFactionPlanets;
					window.backToStarMap = backToStarMap;
					window.enterBattlePage = enterBattlePage;
					window.handleBattleBtnClick = handleBattleBtnClick;
					window.showWarframeSelect = showWarframeSelect;
					window.adminResetCardStars = adminResetCardStars;
										window.renderMiningPlanetSelect = renderMiningPlanetSelect;
										window.selectMiningPlanet = selectMiningPlanet;
			
										window.confirmMiningMission = confirmMiningMission;
										window.renderGatheringPlanetSelect = renderGatheringPlanetSelect;
										window.selectGatheringPlanet = selectGatheringPlanet;
										window.backToGatheringStarMap = backToGatheringStarMap;
										window.confirmGatheringMission = confirmGatheringMission;
										// 勘探/回收三级页面新函数
										window.enterMiningZones = enterMiningZones;
										window.selectMiningZone = selectMiningZone;
										window.confirmMiningAndStart = confirmMiningAndStart;
										window.confirmGatheringAndStart = confirmGatheringAndStart;

										window.backToMiningPlanets = backToMiningPlanets;
										window.enterGatheringZones = enterGatheringZones;
										window.selectGatheringZone = selectGatheringZone;
										
										window.backToGatheringPlanets = backToGatheringPlanets;
										window.showMiningConfirm = showMiningConfirm;
										window.showGatheringConfirm = showGatheringConfirm;
										window.startMiningMission = startMiningMission;
										window.startGatheringMission = startGatheringMission;
										window.backToMiningZones = backToMiningZones;
										window.backToGatheringZones = backToGatheringZones;

					window.switchWarehouseCategory = switchWarehouseCategory;
					window.handleWarehouseSearch = handleWarehouseSearch;
					window.clearWarehouseSearch = clearWarehouseSearch;
					window.switchFoundryCategory = switchFoundryCategory;
					window.handleFoundrySearch = handleFoundrySearch;
					window.clearFoundrySearch = clearFoundrySearch;
					window.enterMarooMarket = enterMarooMarket;
					window.backToBaroShop = backToBaroShop;
					window.sellToMaroo = sellToMaroo;
					window.buyFromMaroo = buyFromMaroo;
					window.enterBaroShop = enterBaroShop;
					window.backToShopEntrance = backToShopEntrance;
					window.renderStaminaShop = renderStaminaShop;
					window.buyStaminaItem = buyStaminaItem;	
					window.showConfirmModal = showConfirmModal;
					window.closeConfirmModal = closeConfirmModal;
					window.executeConfirmAction = executeConfirmAction;	
					window.adminResetLevel = adminResetLevel;
					window.adminFixWarehouseImages = adminFixWarehouseImages;
					window.toggleMusic = toggleMusic;
					window.toggleMusicPlayer = toggleMusicPlayer;
					window.togglePlay = togglePlay;
					window.prevTrack = prevTrack;
					window.nextTrack = nextTrack;
					window.selectTrack = selectTrack;
					window.setVolume = setVolume;
					window.toggleMute = toggleMute;
					window.togglePlaylist = togglePlaylist;
					window.startVeinScan = startVeinScan;
					window.mineCurrentNode = mineCurrentNode;
					window.cooldownMiner = cooldownMiner;
					window.stopWarframeMining = stopWarframeMining;
					window.startVeinScan = startVeinScan;
					window.mineCurrentNode = mineCurrentNode;
					window.cooldownMiner = cooldownMiner;
					window.stopWarframeMining = stopWarframeMining;
					window.claimFoundryItem = claimFoundryItem;
					window.showOwnedWarframeSelect = showOwnedWarframeSelect;
					window.switchToWarframe = switchToWarframe;
					window.claimWarframeAsUse = claimWarframeAsUse;
					window.claimWarframeAsItem = claimWarframeAsItem;
					window.addGatheringLog = addGatheringLog;
					window.startPlantScan = startPlantScan;
					window.gatherCurrentPlant = gatherCurrentPlant;
					window.repairGatherer = repairGatherer;
					window.stopInteractiveGathering = stopInteractiveGathering;
					window.renderPlanetSelect = renderPlanetSelect;
					window.backToStarMap = backToStarMap;
					window.selectWarframe = selectWarframe;
					
					// 挂载所有函数到全局
					window.showRedeemAdmin = showRedeemAdmin;
					window.showAddCodeForm = showAddCodeForm;  // ← 添加这行
					window.submitNewCode = submitNewCode;
					window.loadRedeemStats = loadRedeemStats;
					window.deleteRedeemCode = deleteRedeemCode;
					window.redeemCode = redeemCode;
					window.showRedeemCodeModal = showRedeemCodeModal;
					window.submitNewCode = submitNewCode;
					window.cancelFoundryCraft = cancelFoundryCraft;
					
					// 回响奖励系统暴露
					window.CODEX_REWARD_ITEM = CODEX_REWARD_ITEM;
					window.checkDeckComplete = checkDeckComplete;
					window.getCompletedBattleDecks = getCompletedBattleDecks;
					window.hasPlayerClaimedReward = hasPlayerClaimedReward;
					window.markRewardClaimed = markRewardClaimed;
					
					window.showCodexRewardModal = showCodexRewardModal;
					window.claimCodexReward = claimCodexReward;
					window.checkAndTriggerCodexReward = checkAndTriggerCodexReward;
					window.updateUpgradeBadge = updateUpgradeBadge;
					
					window.showWarframeConfirm = showWarframeConfirm;
					window.confirmSelectWarframe = confirmSelectWarframe;
					window.stamina = stamina; 
					window.modifyStamina = modifyStamina;
					window.STAMINA_MAX = STAMINA_MAX;
					window.enterFactionSubZones = enterFactionSubZones;
					
					window.selectPaymentType = selectPaymentType;
					window.buyUnlimitedStaminaCard = buyUnlimitedStaminaCard;
				})();
	
			
