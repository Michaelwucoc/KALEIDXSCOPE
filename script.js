// 主页交互脚本

// 紫色之门开放时间 2026/03/25 10:00:00 (UTC+8)
const PURPLE_OPEN_TIME = new Date('2026-03-25T10:00:00+08:00');
const PURPLE_REVEAL_CLICKS = 7;

// 黑色之门：区域开放时间待定，需连续点击 14 次解锁
const BLACK_REVEAL_CLICKS = 14;

document.addEventListener('DOMContentLoaded', function() {
    const purpleCard = document.getElementById('purple-door-card');
    const blackCard = document.getElementById('black-door-card');
    const now = new Date();

    if (purpleCard) {
        if (now >= PURPLE_OPEN_TIME) {
            // 倒计时结束：正常显示，无模糊
            purpleCard.classList.add('purple-revealed');
        } else if (sessionStorage.getItem('purple-door-revealed') === '1') {
            // 本会话已通过点击解锁过：显示但加模糊（时间未到）
            purpleCard.classList.add('purple-revealed', 'purple-early-unlock');
        } else {
            // 倒计时未结束：保持隐藏，需连续点击 7 次解锁
            let clickCount = 0;
            let clickTimer = null;

            function purpleRevealHandler() {
                if (purpleCard.classList.contains('purple-revealed')) return;
                clickCount++;
                if (clickTimer) clearTimeout(clickTimer);
                clickTimer = setTimeout(function() { clickCount = 0; }, 1500);
                if (clickCount >= PURPLE_REVEAL_CLICKS) {
                    document.body.removeEventListener('click', purpleRevealHandler);
                    purpleCard.classList.add('purple-revealed', 'purple-early-unlock');
                    sessionStorage.setItem('purple-door-revealed', '1');
                }
            }
            document.body.addEventListener('click', purpleRevealHandler);
        }
    }

    if (blackCard) {
        if (sessionStorage.getItem('black-door-revealed') === '1') {
            blackCard.classList.add('black-revealed', 'black-early-unlock');
        } else {
            let blackClickCount = 0;
            let blackClickTimer = null;

            function blackRevealHandler() {
                if (blackCard.classList.contains('black-revealed')) return;
                blackClickCount++;
                if (blackClickTimer) clearTimeout(blackClickTimer);
                blackClickTimer = setTimeout(function() { blackClickCount = 0; }, 1500);
                if (blackClickCount >= BLACK_REVEAL_CLICKS) {
                    document.body.removeEventListener('click', blackRevealHandler);
                    blackCard.classList.add('black-revealed', 'black-early-unlock');
                    sessionStorage.setItem('black-door-revealed', '1');
                    if (typeof umami !== 'undefined') umami.track('black-door-revealed');
                    if (typeof posthog !== 'undefined' && posthog.capture) posthog.capture('black-door-revealed');
                }
            }
            document.body.addEventListener('click', blackRevealHandler);
        }
    }

    // 为门卡片添加点击动画效果
    const doorCards = document.querySelectorAll('.door-card:not(.coming-soon)');
    
    doorCards.forEach(card => {
        card.addEventListener('click', function() {
            // 添加点击反馈
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });

        // 添加键盘支持（可访问性）
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const label = card.querySelector('img')?.alt || '点击进入解锁攻略';
        card.setAttribute('aria-label', label);
        
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // 添加页面加载动画（紫/黑门未解锁时不参与）
    const doors = document.querySelectorAll('.door-card');
    doors.forEach((door, index) => {
        if (door.classList.contains('purple-door-card') && !door.classList.contains('purple-revealed')) return;
        if (door.classList.contains('black-door-card') && !door.classList.contains('black-revealed')) return;
        door.style.opacity = '0';
        door.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            door.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            door.style.opacity = '1';
            door.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
