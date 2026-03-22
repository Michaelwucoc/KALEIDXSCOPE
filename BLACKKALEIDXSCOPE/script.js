// 使用集中配置
const { songs, gate } = SongsConfig.black;
const BLACK_GATE_TRACK1_POOL = gate.track1;
const BLACK_GATE_TRACK2_POOL = gate.track2;
const BLACK_GATE_TRACK3_FIXED = gate.track3;

const noCoverSvg = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2280%22 height=%2280%22%3E%3Crect fill=%22%23ddd%22 width=%2280%22 height=%2280%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2210%22%3E%E6%9A%82%E6%97%A0%E6%9B%B2%E7%BB%98%3C/text%3E%3C/svg%3E";

function loadProgress() {
    try {
        const raw = localStorage.getItem('maimai-black-gate-progress');
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

function saveProgress(progress) {
    localStorage.setItem('maimai-black-gate-progress', JSON.stringify(progress));
}

let progress = loadProgress();
let showRemainingOnly = false;

function initBlackThemeToggle() {
    const saved = localStorage.getItem('black-gate-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved !== null ? saved === 'dark' : prefersDark;
    document.body.classList.toggle('theme-black', !isDark);
    document.getElementById('theme-toggle-black')?.addEventListener('click', () => {
        const cur = document.body.classList.contains('theme-black');
        document.body.classList.toggle('theme-black', !cur);
        localStorage.setItem('black-gate-theme', cur ? 'dark' : 'light');
    });
}

function updateSongDetailsInCard(container) {
    if (typeof SongDisplay === 'undefined') return;
    const songId = container?.dataset?.songId;
    if (!songId) return;
    const fallback = songs.find(s => s.id === songId) || gate.track1.find(s => s.id === songId) || gate.track2.find(s => s.id === songId) || { id: songId, name: '-' };
    SongDisplay.getMusicDataThen(songId, fallback, (info) => {
        const fields = SongDisplay.getDisplayFields();
        container.innerHTML = SongDisplay.renderSongDetailsHtml(fields, info);
    });
}

function renderSongs() {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = '';

    const filteredSongs = showRemainingOnly ? songs.filter(s => !progress[s.id]) : songs;

    if (filteredSongs.length === 0) {
        songsList.innerHTML = '<div class="empty-message">🎉 恭喜！所有钥匙曲目都已完成！</div>';
        return;
    }

    filteredSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = `song-card ${progress[song.id] ? 'completed' : ''}`;
        const coverUrl = `https://assets.awmc.cc/covers/${song.id}.png`;
        songCard.innerHTML = `
            <div class="song-cover" data-song-id="${song.id}" title="双击/长按查看乐曲详情">
                <img src="${coverUrl}" alt="暂无曲绘" onerror="this.onerror=null;this.src='${noCoverSvg}'">
            </div>
            <label class="song-checkbox">
                <input type="checkbox" data-song-id="${song.id}"
                    data-umami-event="checkbox-song-toggle-black"
                    data-umami-event-song-id="${song.id}"
                    data-umami-event-song-name="${(song.name || '').replace(/"/g, '&quot;')}"
                    ${progress[song.id] ? 'checked' : ''} onchange="toggleSong('${song.id}')">
                <span class="checkmark"></span>
            </label>
            <div class="song-info">
                <div class="song-name">${(song.name || '-').replace(/</g, '&lt;')}</div>
                <div class="song-details" data-song-id="${song.id}"></div>
            </div>
        `;
        songsList.appendChild(songCard);
        const detailsEl = songCard.querySelector('.song-details[data-song-id]');
        if (detailsEl) updateSongDetailsInCard(detailsEl);
    });
}

function toggleSong(songId) {
    progress[songId] = !progress[songId];
    saveProgress(progress);
    updateStats();
    renderSongs();
    updateRemainingList();
    if (typeof umami !== 'undefined') umami.track('checkbox-song-toggle-black', { song_id: songId });
}

function updateStats() {
    const completed = Object.values(progress).filter(Boolean).length;
    const remaining = songs.length - completed;
    const percent = Math.round((completed / songs.length) * 100);
    document.getElementById('completed-count').textContent = completed;
    document.getElementById('remaining-count').textContent = remaining;
    document.getElementById('progress-percent').textContent = percent + '%';
}

let blackGateChallengeRun = [];

function randomPickBlackGateChallenge() {
    const t1 = BLACK_GATE_TRACK1_POOL[Math.floor(Math.random() * BLACK_GATE_TRACK1_POOL.length)];
    const t2 = BLACK_GATE_TRACK2_POOL[Math.floor(Math.random() * BLACK_GATE_TRACK2_POOL.length)];
    return [t1.id, t2.id, BLACK_GATE_TRACK3_FIXED.id];
}

function renderBlackGateChallengeRun() {
    const track1El = document.getElementById('gate-track1-songs');
    const track2El = document.getElementById('gate-track2-songs');
    const track3El = document.getElementById('gate-track3-songs');
    if (!track1El || !track2El || !track3El) return;

    const selected1 = blackGateChallengeRun[0] || null;
    const selected2 = blackGateChallengeRun[1] || null;

    function renderTrack(pool, selectedId) {
        return pool.map(s => {
            const isSelected = s.id === selectedId;
            const coverUrl = `https://assets.awmc.cc/covers/${s.id}.png`;
            return `
                <div class="gate-song-chip expandable ${isSelected ? 'selected' : ''}" data-id="${s.id}" data-umami-event="gate-chip-expand-black" data-umami-event-song-id="${s.id}" data-umami-event-song-name="${(s.name || '').replace(/"/g, '&quot;')}">
                    <div class="gate-chip-cover" data-song-id="${s.id}" title="双击/长按查看乐曲详情">
                        <img src="${coverUrl}" alt="${(s.name || '').replace(/"/g, '&quot;')}" onerror="this.src='${noCoverSvg}'">
                    </div>
                    <span class="gate-chip-name">${(s.name || '').replace(/</g, '&lt;')}</span>
                </div>
            `;
        }).join('');
    }

    track1El.innerHTML = renderTrack(BLACK_GATE_TRACK1_POOL, selected1);
    track2El.innerHTML = renderTrack(BLACK_GATE_TRACK2_POOL, selected2);
    track3El.innerHTML = `
        <div class="gate-song-chip expandable selected" data-id="${BLACK_GATE_TRACK3_FIXED.id}" data-umami-event="gate-chip-expand-black" data-umami-event-song-id="${BLACK_GATE_TRACK3_FIXED.id}" data-umami-event-song-name="${(BLACK_GATE_TRACK3_FIXED.name || '').replace(/"/g, '&quot;')}">
            <div class="gate-chip-cover" data-song-id="${BLACK_GATE_TRACK3_FIXED.id}" title="双击/长按查看乐曲详情">
                <img src="https://assets.awmc.cc/covers/${BLACK_GATE_TRACK3_FIXED.id}.png" alt="${(BLACK_GATE_TRACK3_FIXED.name || '').replace(/"/g, '&quot;')}" onerror="this.src='${noCoverSvg}'">
            </div>
            <span class="gate-chip-name">${(BLACK_GATE_TRACK3_FIXED.name || '').replace(/</g, '&lt;')}</span>
        </div>
    `;
}

function initExpandClick() {
    document.addEventListener('click', (e) => {
        const target = e.target.closest('.expandable');
        const active = document.querySelector('.expandable.expanded');
        if (target) {
            if (active && active !== target) active.classList.remove('expanded');
            target.classList.toggle('expanded');
        } else if (active) active.classList.remove('expanded');
    });
}

function initBlackGateChallengeSection() {
    const expanded = localStorage.getItem('black-gate-challenge-expanded') === 'true';
    const body = document.getElementById('gate-challenge-body');
    const toggle = document.getElementById('gate-challenge-toggle');
    const icon = toggle?.querySelector('.toggle-icon');
    const text = toggle?.querySelector('.toggle-text');
    function setExpanded(exp) {
        if (body) body.style.display = exp ? 'block' : 'none';
        if (toggle) toggle.setAttribute('aria-expanded', String(exp));
        if (icon) icon.textContent = exp ? '▲' : '▼';
        if (text) text.textContent = exp ? '收起' : '展开';
        localStorage.setItem('black-gate-challenge-expanded', String(exp));
    }
    setExpanded(expanded);
    toggle?.addEventListener('click', () => {
        setExpanded(localStorage.getItem('black-gate-challenge-expanded') !== 'true');
    });
}

function updateRemainingList() {
    const remainingList = document.getElementById('remaining-list');
    const remainingSongs = songs.filter(s => !progress[s.id]);

    if (remainingSongs.length === 0) {
        remainingList.innerHTML = '<div class="empty-message">🎉 所有钥匙曲目都已完成！您应该会在结算时看到钥匙。</div>';
        return;
    }

    remainingList.innerHTML = remainingSongs.map(song => `
        <div class="remaining-item">
            <div class="remaining-cover-wrap" data-song-id="${song.id}" title="双击/长按查看乐曲详情">
                <img src="https://assets.awmc.cc/covers/${song.id}.png" alt="暂无曲绘" class="remaining-cover" onerror="this.onerror=null;this.src='${noCoverSvg}'">
            </div>
            <div class="remaining-info" data-song-id="${song.id}">
                <strong>${(song.name || '').replace(/</g, '&lt;')}</strong>
            </div>
        </div>
    `).join('');

    remainingList.querySelectorAll('.remaining-info[data-song-id]').forEach(el => {
        SongDisplay && SongDisplay.getMusicDataThen(el.dataset.songId, songs.find(s => s.id === el.dataset.songId), (info) => {
            const fields = SongDisplay.getDisplayFields();
            const tags = SongDisplay.renderSongDetailsHtml(fields, info);
            el.innerHTML = `<strong>${(info.name || '').replace(/</g, '&lt;')}</strong> ${tags ? ' · ' + tags : ''}`;
        });
    });
}

document.getElementById('show-remaining').addEventListener('click', () => {
    showRemainingOnly = true;
    document.getElementById('filter-checkbox').checked = true;
    renderSongs();
    if (typeof umami !== 'undefined') umami.track('button-show-remaining-black');
});

document.getElementById('show-all').addEventListener('click', () => {
    showRemainingOnly = false;
    document.getElementById('filter-checkbox').checked = false;
    renderSongs();
    if (typeof umami !== 'undefined') umami.track('button-show-all-black');
});

document.getElementById('filter-checkbox').addEventListener('change', (e) => {
    showRemainingOnly = e.target.checked;
    renderSongs();
    if (typeof umami !== 'undefined') umami.track('checkbox-filter-black', { checked: e.target.checked });
});

document.getElementById('gate-random').addEventListener('click', () => {
    blackGateChallengeRun = randomPickBlackGateChallenge();
    renderBlackGateChallengeRun();
    if (typeof umami !== 'undefined') umami.track('gate-challenge-random-black', { track1: blackGateChallengeRun[0], track2: blackGateChallengeRun[1] });
});

document.getElementById('reset').addEventListener('click', () => {
    if (confirm('确定要重置所有进度吗？此操作不可恢复。')) {
        progress = {};
        saveProgress(progress);
        updateStats();
        renderSongs();
        updateRemainingList();
        if (typeof umami !== 'undefined') umami.track('black-gate-reset-confirmed');
    }
});

document.getElementById('export-base64').addEventListener('click', () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(progress))));
    navigator.clipboard.writeText(data).then(() => alert('已复制到剪贴板')).catch(() => prompt('请手动复制以下 Base64 数据：', data));
    if (typeof umami !== 'undefined') umami.track('button-export-base64-black');
});

document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'flex';
    document.getElementById('import-error').style.display = 'none';
    if (typeof umami !== 'undefined') umami.track('button-import-black');
});

document.getElementById('modal-close').addEventListener('click', () => document.getElementById('import-modal').style.display = 'none');
document.getElementById('import-cancel').addEventListener('click', () => document.getElementById('import-modal').style.display = 'none');

document.getElementById('import-confirm').addEventListener('click', () => {
    const raw = document.getElementById('import-data').value.trim();
    const errEl = document.getElementById('import-error');
    if (!raw) {
        errEl.textContent = '请输入数据';
        errEl.style.display = 'block';
        return;
    }
    try {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(raw))));
        if (typeof decoded !== 'object') throw new Error('Invalid format');
        progress = decoded;
        saveProgress(progress);
        updateStats();
        renderSongs();
        updateRemainingList();
        document.getElementById('import-modal').style.display = 'none';
        if (typeof umami !== 'undefined') umami.track('black-gate-import-success');
    } catch (e) {
        errEl.textContent = '导入失败：' + (e.message || '数据格式错误');
        errEl.style.display = 'block';
    }
});

window.addEventListener('song-display-changed', () => {
    renderSongs();
    updateRemainingList();
});

function initDiagramZoom() {
    const diagram = document.getElementById('zoomable-diagram');
    const modal = document.getElementById('diagram-modal');
    const zoomedImg = document.getElementById('zoomed-diagram');
    const closeBtn = document.getElementById('diagram-modal-close');

    if (!diagram || !modal || !zoomedImg) return;

    diagram.addEventListener('click', () => {
        zoomedImg.src = diagram.src;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    });

    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === zoomedImg || e.target === closeBtn) {
            closeModal();
        }
    });
}

updateStats();
renderSongs();
updateRemainingList();
renderBlackGateChallengeRun();
initBlackThemeToggle();
initExpandClick();
initBlackGateChallengeSection();
initDiagramZoom();
if (typeof SongDetail !== 'undefined') SongDetail.init();
if (typeof SongDisplay !== 'undefined') SongDisplay.initDisplaySettings('black');
