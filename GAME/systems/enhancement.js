
// ═══════════════════════════════════════════════════════════════
//  技能战斗系统增强补丁 - 修复死循环版
// ═══════════════════════════════════════════════════════════════

// ═══════ 1. 粒子爆发生成器 ═══════
window.spawnParticleBurst = function(x, y, color, count, spread) {
    count = count || 8;
    spread = spread || 60;
    for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        var dist = spread * (0.5 + Math.random() * 0.8);
        var px = Math.cos(angle) * dist;
        var py = Math.sin(angle) * dist;
        var size = 3 + Math.random() * 5;
        var particle = document.createElement('div');
        particle.style.cssText = 
            'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
            'width:' + size + 'px;height:' + size + 'px;' +
            'margin-left:' + (-size/2) + 'px;margin-top:' + (-size/2) + 'px;' +
            'border-radius:50%;background:' + color + ';' +
            'box-shadow:0 0 ' + (size * 2) + 'px ' + color + ',0 0 ' + (size * 4) + 'px ' + color + ';' +
            'pointer-events:none;z-index:2601;' +
            'animation:particleBurst ' + (400 + Math.random() * 400) + 'ms ease-out forwards;' +
            '--px:' + px + 'px;--py:' + py + 'px;';
        document.body.appendChild(particle);
        setTimeout(function(el) { 
            return function() { if(el.parentNode) el.parentNode.removeChild(el); }; 
        }(particle), 900);
    }
};

// ═══════ 2. 多层冲击波 ═══════
window.spawnShockwaveLayers = function(x, y, color, duration) {
    var sizes = [60, 100, 140];
    var delays = [0, 100, 200];
    var durations = [duration, duration + 100, duration + 200];
    var opacities = [0.9, 0.6, 0.3];

    for (var i = 0; i < 3; i++) {
        var wave = document.createElement('div');
        wave.style.cssText = 
            'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
            'width:' + sizes[i] + 'px;height:' + sizes[i] + 'px;' +
            'margin-left:' + (-sizes[i]/2) + 'px;margin-top:' + (-sizes[i]/2) + 'px;' +
            'border-radius:50%;border:3px solid ' + color + ';' +
            'background:transparent;pointer-events:none;z-index:2600;' +
            'animation:shockwaveRing ' + durations[i] + 'ms ease-out forwards;' +
            'animation-delay:' + delays[i] + 'ms;opacity:' + opacities[i] + ';';
        document.body.appendChild(wave);
        setTimeout(function(el) { 
            return function() { if(el.parentNode) el.parentNode.removeChild(el); }; 
        }(wave), durations[i] + delays[i] + 200);
    }
};

// ═══════ 3. 能量残影 ═══════
window.spawnEnergyGhost = function(x, y, color, direction) {
    var ghost = document.createElement('div');
    ghost.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:50px;height:50px;margin-left:-25px;margin-top:-25px;' +
        'border-radius:50%;background:radial-gradient(circle,' + color + ',transparent 70%);' +
        'opacity:0.4;pointer-events:none;z-index:2600;' +
        'animation:energyTrail 500ms ease-out forwards;' +
        '--tx:' + (direction * 60) + 'px;';
    document.body.appendChild(ghost);
    setTimeout(function() { if(ghost.parentNode) ghost.parentNode.removeChild(ghost); }, 600);
};

// ═══════ 4. 维度裂缝 ═══════
window.spawnDimensionRift = function(x, y, color) {
    var rift = document.createElement('div');
    rift.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:80px;height:80px;margin-left:-40px;margin-top:-40px;' +
        'border-radius:50%;border:2px solid ' + color + ';' +
        'background:radial-gradient(circle,rgba(255,255,255,0.2),transparent 60%);' +
        'pointer-events:none;z-index:2600;' +
        'animation:dimensionalRift 700ms ease-in-out forwards;';
    document.body.appendChild(rift);
    setTimeout(function() { if(rift.parentNode) rift.parentNode.removeChild(rift); }, 800);
};

// ═══════ 5. 漩涡 ═══════
window.spawnVortex = function(x, y, color, duration) {
    var vortex = document.createElement('div');
    vortex.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:100px;height:100px;margin-left:-50px;margin-top:-50px;' +
        'border-radius:50%;border:3px dashed ' + color + ';' +
        'background:conic-gradient(from 0deg,transparent,' + color + ',transparent,' + color + ',transparent);' +
        'pointer-events:none;z-index:2600;' +
        'animation:vortexSpin ' + duration + 'ms ease-in-out forwards;';
    document.body.appendChild(vortex);
    setTimeout(function() { if(vortex.parentNode) vortex.parentNode.removeChild(vortex); }, duration + 200);
};

// ═══════ 6. 重力扭曲 ═══════
window.spawnGravityWarp = function(x, y, color) {
    var warp = document.createElement('div');
    warp.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:120px;height:120px;margin-left:-60px;margin-top:-60px;' +
        'border-radius:50%;background:radial-gradient(circle,transparent 30%,' + color + ' 50%,transparent 70%);' +
        'filter:blur(8px);pointer-events:none;z-index:2600;' +
        'animation:gravityWarp 600ms ease-in-out forwards;';
    document.body.appendChild(warp);
    setTimeout(function() { if(warp.parentNode) warp.parentNode.removeChild(warp); }, 700);
};

// ═══════ 7. 闪电链 ═══════
window.spawnLightningChain = function(startX, startY, endX, endY, color) {
    var dx = endX - startX;
    var dy = endY - startY;
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    var dist = Math.sqrt(dx * dx + dy * dy);

    var chain = document.createElement('div');
    chain.style.cssText = 
        'position:fixed;left:' + startX + 'px;top:' + startY + 'px;' +
        'width:' + dist + 'px;height:4px;' +
        'transform-origin:left center;transform:rotate(' + angle + 'deg);' +
        'background:linear-gradient(90deg,transparent,#fff,' + color + ',#fff,transparent);' +
        'filter:drop-shadow(0 0 10px ' + color + ');pointer-events:none;z-index:2600;' +
        'animation:lightningChain 300ms ease-in-out;';
    document.body.appendChild(chain);
    setTimeout(function() { if(chain.parentNode) chain.parentNode.removeChild(chain); }, 400);

    for (var i = 0; i < 2; i++) {
        var branch = document.createElement('div');
        var branchAngle = angle + (i === 0 ? 25 : -25) + (Math.random() - 0.5) * 20;
        var branchLen = dist * (0.3 + Math.random() * 0.3);
        branch.style.cssText = 
            'position:fixed;left:' + (startX + dx * 0.4) + 'px;top:' + (startY + dy * 0.4) + 'px;' +
            'width:' + branchLen + 'px;height:3px;' +
            'transform-origin:left center;transform:rotate(' + branchAngle + 'deg);' +
            'opacity:0.6;background:linear-gradient(90deg,transparent,' + color + ',transparent);' +
            'pointer-events:none;z-index:2600;' +
            'animation:lightningChain 300ms ease-in-out;';
        document.body.appendChild(branch);
        setTimeout(function(el) { 
            return function() { if(el.parentNode) el.parentNode.removeChild(el); }; 
        }(branch), 350);
    }
};

// ═══════ 8. 空间撕裂 ═══════
window.spawnSpaceTear = function(x, y, color, angle) {
    var tear = document.createElement('div');
    tear.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:60px;height:100px;margin-left:-30px;margin-top:-50px;' +
        'background:linear-gradient(180deg,transparent,' + color + ',transparent);' +
        'filter:blur(2px);pointer-events:none;z-index:2600;' +
        'transform:rotate(' + angle + 'deg);' +
        'animation:spaceTear 600ms ease-in-out forwards;';
    document.body.appendChild(tear);
    setTimeout(function() { if(tear.parentNode) tear.parentNode.removeChild(tear); }, 700);
};

// ═══════ 9. 磁场线 ═══════
window.spawnFieldLines = function(x, y, color, duration) {
    var field = document.createElement('div');
    field.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:100px;height:100px;margin-left:-50px;margin-top:-50px;' +
        'border-radius:50%;border:2px solid ' + color + ';' +
        'pointer-events:none;z-index:2600;' +
        'animation:fieldLines ' + duration + 'ms ease-in-out forwards;';
    document.body.appendChild(field);
    setTimeout(function() { if(field.parentNode) field.parentNode.removeChild(field); }, duration + 200);
};

// ═══════ 10. 电磁脉冲 ═══════
window.spawnEMPBurst = function(x, y, color) {
    var emp = document.createElement('div');
    emp.style.cssText = 
        'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
        'width:0;height:0;pointer-events:none;z-index:2600;';

    var ring = document.createElement('div');
    ring.style.cssText = 
        'position:absolute;width:200px;height:200px;margin-left:-100px;margin-top:-100px;' +
        'border-radius:50%;border:2px solid rgba(255,255,255,0.8);' +
        'background:radial-gradient(circle,rgba(255,255,255,0.3),transparent 50%);' +
        'animation:shockwaveRing 500ms ease-out forwards;';
    emp.appendChild(ring);
    document.body.appendChild(emp);
    setTimeout(function() { if(emp.parentNode) emp.parentNode.removeChild(emp); }, 600);
};

// ═══════ 11. 光子散射 ═══════
window.spawnPhotonScatter = function(x, y, color, count) {
    count = count || 12;
    for (var i = 0; i < count; i++) {
        var angle = (Math.PI * 2 * i) / count;
        var dist = 40 + Math.random() * 60;
        var sx = Math.cos(angle) * dist;
        var sy = Math.sin(angle) * dist;
        var photon = document.createElement('div');
        photon.style.cssText = 
            'position:fixed;left:' + x + 'px;top:' + y + 'px;' +
            'width:3px;height:3px;border-radius:50%;background:#fff;' +
            'box-shadow:0 0 8px ' + color + ',0 0 16px ' + color + ';' +
            'pointer-events:none;z-index:2601;' +
            'animation:particleSpark 500ms ease-out forwards;' +
            '--sx:' + sx + 'px;--sy:' + sy + 'px;' +
            'animation-delay:' + (Math.random() * 200) + 'ms;';
        document.body.appendChild(photon);
        setTimeout(function(el) { 
            return function() { if(el.parentNode) el.parentNode.removeChild(el); }; 
        }(photon), 700);
    }
};

// ═══════ 12. 故障特效 ═══════
window.spawnGlitchEffect = function(x, y, width, height) {
    var glitch = document.createElement('div');
    glitch.style.cssText = 
        'position:fixed;left:' + (x - width/2) + 'px;top:' + (y - height/2) + 'px;' +
        'width:' + width + 'px;height:' + height + 'px;' +
        'background:rgba(255,255,255,0.1);pointer-events:none;z-index:2602;' +
        'animation:glitchEffect 400ms steps(10) forwards;mix-blend-mode:screen;';
    document.body.appendChild(glitch);
    setTimeout(function() { if(glitch.parentNode) glitch.parentNode.removeChild(glitch); }, 450);
};

// ═══════ 增强动画类映射 ═══════
window.ENHANCED_ANIM_CLASSES = {
    'slash_dash': 'anim-slash-dash-enhanced',
    'radial_blind': 'anim-radial-blind-enhanced',
    'radial_javelin': 'anim-radial-javelin-enhanced',
    'exalted_blade': 'anim-exalted-blade-enhanced',
    'shock': 'anim-shock-enhanced',
    'speed': 'anim-speed-enhanced',
    'electric_shield': 'anim-electric-shield-enhanced',
    'discharge': 'anim-discharge-enhanced',
    'pull': 'anim-pull-enhanced',
    'magnetize': 'anim-magnetize-enhanced',
    'polarize': 'anim-polarize-enhanced',
    'crush': 'anim-crush-enhanced',
    'basic_attack': 'anim-basic-attack-enhanced'
};

// ═══════ 增强版 spawnSkillVfx - 直接调用原版，不再递归 ═══════
window.spawnSkillVfxEnhanced = function(side, skill) {
    // 直接调用保存的原版函数，不经过 window.spawnSkillVfx
    if (typeof window._originalSpawnVfx === 'function') {
        window._originalSpawnVfx(side, skill);
    }

    var sourceEl = side === 'player'
        ? document.getElementById('battlePlayerIcon')
        : document.getElementById('battleEnemyIcon');
    var targetEl = side === 'player'
        ? document.getElementById('battleEnemyIcon')
        : document.getElementById('battlePlayerIcon');

    if (!sourceEl || !targetEl) return;

    var sourceRect = sourceEl.getBoundingClientRect();
    var targetRect = targetEl.getBoundingClientRect();
    var startX = sourceRect.left + sourceRect.width / 2;
    var startY = sourceRect.top + sourceRect.height / 2;
    var endX = targetRect.left + targetRect.width / 2;
    var endY = targetRect.top + targetRect.height / 2;
    var midX = (startX + endX) / 2;
    var midY = (startY + endY) / 2;
    var duration = Math.max(420, skill.castTime || 650);
    var color = skill.color || '#00d4ff';

    switch (skill.id) {
        case 'slash_dash':
            setTimeout(function() { window.spawnParticleBurst(endX, endY, color, 12, 50); }, duration * 0.4);
            setTimeout(function() { window.spawnShockwaveLayers(endX, endY, color, 600); }, duration * 0.45);
            window.spawnEnergyGhost(startX, startY, color, side === 'player' ? 1 : -1);
            setTimeout(function() { window.spawnSpaceTear(midX, midY, color, 0); }, duration * 0.3);
            break;
        case 'radial_blind':
            window.spawnEMPBurst(startX, startY, '#ffd700');
            window.spawnParticleBurst(startX, startY, '#ffe680', 16, 80);
            window.spawnPhotonScatter(startX, startY, '#ffd700', 20);
            for (var i = 0; i < 4; i++) {
                setTimeout(function(idx) {
                    return function() {
                        var dirX = Math.cos(idx * Math.PI / 2) * 40;
                        var dirY = Math.sin(idx * Math.PI / 2) * 40;
                        window.spawnShockwaveLayers(startX + dirX, startY + dirY, '#ffd700', 400);
                    };
                }(i), i * 80);
            }
            break;
        case 'radial_javelin':
            setTimeout(function() {
                window.spawnParticleBurst(endX, endY, '#ff4444', 10, 60);
                window.spawnShockwaveLayers(endX, endY, '#ff4444', 500);
            }, duration * 0.5);
            break;
        case 'exalted_blade':
            window.spawnDimensionRift(startX, startY, color);
            window.spawnEnergyGhost(startX, startY, color, side === 'player' ? 1 : -1);
            setTimeout(function() {
                window.spawnParticleBurst(endX, endY, '#ff66ff', 15, 70);
                window.spawnGravityWarp(endX, endY, '#ff66ff');
            }, duration * 0.45);
            break;
        case 'shock':
            window.spawnLightningChain(startX, startY, endX, endY, color);
            window.spawnEMPBurst(endX, endY, color);
            setTimeout(function() { window.spawnParticleBurst(endX, endY, '#88ccff', 10, 40); }, duration * 0.4);
            break;
        case 'speed':
            for (var s = 0; s < 3; s++) {
                setTimeout(function(idx) {
                    return function() {
                        window.spawnEnergyGhost(startX + (side === 'player' ? -20 + idx * 15 : 20 - idx * 15), startY, '#00d4ff', side === 'player' ? 1 : -1);
                    };
                }(s), s * 100);
            }
            window.spawnShockwaveLayers(startX, startY, '#00d4ff', 400);
            break;
        case 'electric_shield':
            window.spawnFieldLines(startX, startY, color, duration);
            window.spawnEMPBurst(startX, startY, color);
            window.spawnParticleBurst(startX, startY, '#88ccff', 12, 50);
            break;
        case 'discharge':
            window.spawnEMPBurst(startX, startY, '#ffaa00');
            window.spawnPhotonScatter(startX, startY, '#ffaa00', 24);
            for (var d = 0; d < 6; d++) {
                setTimeout(function(idx) {
                    return function() {
                        var targetDist = 100 + Math.random() * 80;
                        var targetAngle = (idx * Math.PI / 3) + (Math.random() - 0.5) * 0.5;
                        var tx = startX + Math.cos(targetAngle) * targetDist;
                        var ty = startY + Math.sin(targetAngle) * targetDist;
                        window.spawnLightningChain(startX, startY, tx, ty, '#ffaa00');
                    };
                }(d), d * 60);
            }
            break;
        case 'pull':
            window.spawnVortex(startX + (side === 'player' ? 46 : -46), startY, color, duration);
            window.spawnGravityWarp(endX, endY, color);
            window.spawnParticleBurst(endX, endY, color, 8, 30);
            break;
        case 'magnetize':
            window.spawnVortex(endX, endY, color, duration);
            window.spawnFieldLines(endX, endY, color, duration);
            setTimeout(function() { window.spawnGravityWarp(endX, endY, color); }, duration * 0.3);
            break;
        case 'polarize':
            setTimeout(function() {
                window.spawnGlitchEffect(midX, midY, 120, 120);
                window.spawnShockwaveLayers(midX, midY, color, 500);
                window.spawnParticleBurst(midX, midY, color, 14, 70);
            }, duration * 0.4);
            break;
        case 'crush':
            window.spawnGravityWarp(endX, endY, color);
            window.spawnSpaceTear(endX, endY, color, 0);
            window.spawnSpaceTear(endX, endY, color, 90);
            setTimeout(function() {
                window.spawnParticleBurst(endX, endY, color, 16, 60);
                window.spawnShockwaveLayers(endX, endY, color, 600);
            }, duration * 0.5);
            break;
        case 'basic_attack':
            window.spawnParticleBurst(endX, endY, '#ffffff', 6, 30);
            break;
    }
};

// ═══════ 核心注入函数 ═══════
window.injectSkillEnhancement = function() {
    if (typeof SkillCombat === 'undefined') {
        console.error('SkillCombat 未加载');
        return false;
    }
    
    if (window._skillEnhancementInjected) {
        console.log('增强补丁已注入，跳过');
        return true;
    }
    
    window._skillEnhancementInjected = true;
    
    // 保存原版引用（只保存一次）
    if (!window._originalSpawnVfx) {
        window._originalSpawnVfx = window.spawnSkillVfx;
    }
    if (!window._originalPlayAnim) {
        window._originalPlayAnim = window.playSkillAnimation;
    }
    
    console.log('🎨 注入技能动画增强补丁...');
    window.enableSkillEnhancement();
    return true;
};

// ═══════ 创建切换按钮 ═══════
window.createVfxToggleButton = function() {
    var modalTitle = document.getElementById('modalTitle');
    if (!modalTitle) return;
    
    // 避免重复创建
    if (document.getElementById('vfx-toggle-btn')) return;
    
    var btn = document.createElement('button');
    btn.id = 'vfx-toggle-btn';
    btn.innerHTML = '⚡ 增强特效（实验性）: 关';
    btn.style.cssText = 'margin-left:12px;padding:4px 12px;font-size:0.75rem;' +
        'background:rgba(0,212,255,0.15);border:1px solid var(--orokin-cyan);' +
        'border-radius:6px;color:var(--orokin-cyan);cursor:pointer;' +
        'font-family:Orbitron,Noto Sans SC,sans-serif;';
    
    btn.onclick = function() {
        if (window._skillEnhancementActive) {
            window.disableSkillEnhancement();
            btn.innerHTML = '⚡ 增强特效（实验性）: 关';
            btn.style.background = 'rgba(0,212,255,0.15)';
        } else {
            window.enableSkillEnhancement();
            btn.innerHTML = '⚡ 增强特效（实验性）: 开';
            btn.style.background = 'rgba(0,212,255,0.45)';
        }
    };
    
    modalTitle.parentNode.insertBefore(btn, modalTitle.nextSibling);
};

// 页面加载后创建按钮
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.createVfxToggleButton);
} else {
    window.createVfxToggleButton();
}

// ═══════ 启用增强 ═══════
window.enableSkillEnhancement = function() {
    if (typeof SkillCombat === 'undefined') {
        console.error('SkillCombat 未加载');
        return false;
    }
    
    // 保存原版（如果还没保存）
    if (!window._originalSpawnVfx) {
        window._originalSpawnVfx = window.spawnSkillVfx;
    }
    if (!window._originalPlayAnim) {
        window._originalPlayAnim = window.playSkillAnimation;
    }
    
    // 替换为增强版
    window.spawnSkillVfx = function(side, skill) {
        window.spawnSkillVfxEnhanced(side, skill);
    };
    
    window.playSkillAnimation = function(side, skill, onHit, onEnd) {
        var targetEl = side === 'player'
            ? document.getElementById('battlePlayerIcon')
            : document.getElementById('battleEnemyIcon');
        
        if (!targetEl) {
            setTimeout(function() { if (onHit) onHit(); }, skill.hitTime || 300);
            setTimeout(function() { if (onEnd) onEnd(); }, skill.castTime || 600);
            return;
        }
        
        var enhancedAnimClass = window.ENHANCED_ANIM_CLASSES[skill.id] || skill.animClass;
        
        targetEl.classList.add('casting');
        targetEl.style.setProperty('animation', enhancedAnimClass + ' ' + (skill.castTime / 1000) + 's ease-out forwards', 'important');
        
        if (typeof applySkillPictureMotion === 'function') {
            applySkillPictureMotion(side, skill);
        }
        
        window.spawnSkillVfx(side, skill);
        
        setTimeout(function() {
            if (onHit) onHit();
            var hitTarget = side === 'player'
                ? document.getElementById('battleEnemyIcon')
                : document.getElementById('battlePlayerIcon');
            if (hitTarget) {
                hitTarget.classList.add('hit-flash');
                setTimeout(function() { hitTarget.classList.remove('hit-flash'); }, 300);
            }
        }, skill.hitTime);
        
        setTimeout(function() {
            targetEl.classList.remove('casting');
            targetEl.style.removeProperty('animation');
            if (onEnd) onEnd();
        }, skill.castTime);
    };
    
    window._skillEnhancementActive = true;
    console.log('✅ 增强版已启用');
    return true;
};

// ═══════ 禁用增强（恢复原版） ═══════
window.disableSkillEnhancement = function() {
    if (!window._originalSpawnVfx || !window._originalPlayAnim) {
        console.error('原版函数未保存');
        return false;
    }
    
    // 恢复为原版/代理
    window.spawnSkillVfx = window._originalSpawnVfx;
    window.playSkillAnimation = window._originalPlayAnim;
    
    window._skillEnhancementActive = false;
    console.log('✅ 原版已恢复');
    return true;
};

// ═══════ 自动注入 ═══════
function tryInject() {
    if (typeof SkillCombat !== 'undefined' && typeof window.spawnSkillVfx === 'function') {
        console.log('SkillCombat 和 spawnSkillVfx 已检测到，准备注入...');
        // 只保存原版引用，不自动启用
        if (!window._originalSpawnVfx) {
            window._originalSpawnVfx = window.spawnSkillVfx;
        }
        if (!window._originalPlayAnim) {
            window._originalPlayAnim = window.playSkillAnimation;
        }
        window._skillEnhancementInjected = true;
        window.createVfxToggleButton();
        console.log('✅ 增强补丁已加载（默认关闭，点击按钮切换）');
        return true;
    }
    return false;
}

if (!tryInject()) {
    console.log('等待 SkillCombat 加载...');
    var checkInterval = setInterval(function() {
        if (tryInject()) {
            clearInterval(checkInterval);
        }
    }, 200);
    
    setTimeout(function() {
        clearInterval(checkInterval);
        if (!window._skillEnhancementInjected) {
            console.log('增强补丁注入超时，请手动执行 injectSkillEnhancement()');
        }
    }, 10000);
}