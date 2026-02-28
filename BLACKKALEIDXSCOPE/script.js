// 钥匙曲目（11首，需全部完成才能获得钥匙）
const songs = [
    { id: '11023', name: 'Blows Up Everything', version: '舞萌 2020', difficulty: '13.8 / 14.3' },
    { id: '11106', name: 'Valsqotch', version: '舞萌 2021', difficulty: '14.7' },
    { id: '11221', name: '≠彡"/了→', version: '舞萌 2022', difficulty: '14.4' },
    { id: '11222', name: 'BREaK! BREaK! BREaK!', version: '舞萌 2022', difficulty: '14.6' },
    { id: '11300', name: 'U&iVERSE -銀河鸞翔-', version: '舞萌 2023', difficulty: '14.3' },
    { id: '11374', name: 'GIGANTØMAKHIA', version: '舞萌 2023', difficulty: '14.7' },
    { id: '11458', name: 'Rising on the horizon', version: '舞萌 2024', difficulty: '14.4' },
    { id: '11523', name: 'ViRTUS', version: '舞萌 2023', difficulty: '14.6' },
    { id: '11619', name: 'KHYMΞXΛ', version: '舞萌 2024', difficulty: '14.7' },
    { id: '11663', name: '系ぎて', version: '舞萌 2024', difficulty: '13.8 / 14.7 / 15.0' },
    { id: '11746', name: 'Divide et impera!', version: '舞萌 2025', difficulty: '14.8' }
];

// 门中随机选曲：1曲目池、2曲目池、3曲目固定
const BLACK_GATE_TRACK1_POOL = [
    { id: '11019', name: 'Scarlet Wings' },
    { id: '11020', name: 'Technicians High' },
    { id: '11021', name: '魔ジョ狩リ' },
    { id: '11022', name: 'TwisteD! XD' },
    { id: '11090', name: 'Flashkick' },
    { id: '11091', name: 'Stardust Memories' },
    { id: '11092', name: 'My My My' },
    { id: '11157', name: 'Aetheric Energy' },
    { id: '11158', name: 'Komplexe' },
    { id: '11159', name: 'Beautiful Future' },
    { id: '11232', name: 'Never Give Up!' },
    { id: '11233', name: 'Starry Colors' },
    { id: '11234', name: 'ほしぞらスペクタクル' },
    { id: '11304', name: 'Round Round Spinning Around' },
    { id: '11305', name: 'Alcyone' },
    { id: '11306', name: 'Raven Emperor' },
    { id: '11382', name: 'HECATONCHEIR' },
    { id: '11383', name: 'Irresistible' },
    { id: '11384', name: 'HAGAKIRI' },
    { id: '11459', name: 'You Mean the World to Me' },
    { id: '11460', name: 'Neon Kingdom' },
    { id: '11461', name: '#狂った民族２ PRAVARGYAZOOQA' },
    { id: '11615', name: 'ぽわわん劇場' },
    { id: '11616', name: 'my flow' },
    { id: '11617', name: 'POWER OF UNITY' },
    { id: '11674', name: 'Cider P@rty' },
    { id: '11675', name: '勦滅' },
    { id: '11676', name: 'Lunatic Vibes' },
    { id: '11750', name: 'Flashback' },
    { id: '11751', name: 'Colorfull:Encounter' }
];
const BLACK_GATE_TRACK2_POOL = [
    { id: '11023', name: 'Blows Up Everything' },
    { id: '11089', name: 'STEEL TRANSONIC' },
    { id: '11160', name: 'Mutation' },
    { id: '11235', name: 'VIIIbit Explorer' },
    { id: '11307', name: 'Yorugao' },
    { id: '11385', name: 'N3V3R G3T OV3R' },
    { id: '11462', name: 'VSpook!' },
    { id: '11618', name: 'Energizing Flame' },
    { id: '11677', name: 'Bloody Trail' },
    { id: '11752', name: '雨露霜雪' }
];
const BLACK_GATE_TRACK3_FIXED = { id: '11753', name: '宙天' };

const blackGateChallengeById = Object.fromEntries([
    ...BLACK_GATE_TRACK1_POOL.map(s => [s.id, s]),
    ...BLACK_GATE_TRACK2_POOL.map(s => [s.id, s]),
    [BLACK_GATE_TRACK3_FIXED.id, BLACK_GATE_TRACK3_FIXED]
]);

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

function renderSongs() {
    const songsList = document.getElementById('songs-list');
    songsList.innerHTML = '';

    const filteredSongs = showRemainingOnly
        ? songs.filter(song => !progress[song.id])
        : songs;

    if (filteredSongs.length === 0) {
        songsList.innerHTML = '<div class="empty-message">🎉 恭喜！所有钥匙曲目都已完成！</div>';
        return;
    }

    filteredSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = `song-card ${progress[song.id] ? 'completed' : ''}`;
        const coverUrl = `https://assets.awmc.cc/covers/${song.id}.png`;
        songCard.innerHTML = `
            <div class="song-cover">
                <img src="${coverUrl}" alt="暂无曲绘" onerror="this.onerror=null;this.src='${noCoverSvg}'">
            </div>
            <label class="song-checkbox">
                <input type="checkbox"
                       data-song-id="${song.id}"
                       data-umami-event="checkbox-song-toggle-black"
                       data-umami-event-song-id="${song.id}"
                       data-umami-event-song-name="${song.name.replace(/"/g, '&quot;')}"
                       ${progress[song.id] ? 'checked' : ''}
                       onchange="toggleSong('${song.id}')">
                <span class="checkmark"></span>
            </label>
            <div class="song-info">
                <div class="song-name">${song.name}</div>
                <div class="song-details">
                    <span class="song-id">ID: ${song.id}</span>
                    <span class="song-version">${song.version}</span>
                    <span class="song-difficulty">难度: ${song.difficulty}</span>
                </div>
            </div>
        `;
        songsList.appendChild(songCard);
    });
}

function toggleSong(songId) {
    progress[songId] = !progress[songId];
    saveProgress(progress);
    updateStats();
    renderSongs();
    updateRemainingList();
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
                <div class="gate-song-chip expandable ${isSelected ? 'selected' : ''}" data-id="${s.id}" data-umami-event="gate-chip-expand-black" data-umami-event-song-id="${s.id}" data-umami-event-song-name="${s.name.replace(/"/g, '&quot;')}">
                    <div class="gate-chip-cover">
                        <img src="${coverUrl}" alt="${s.name}" onerror="this.src='${noCoverSvg}'">
                    </div>
                    <span class="gate-chip-name">${s.name}</span>
                </div>
            `;
        }).join('');
    }

    track1El.innerHTML = renderTrack(BLACK_GATE_TRACK1_POOL, selected1);
    track2El.innerHTML = renderTrack(BLACK_GATE_TRACK2_POOL, selected2);
    track3El.innerHTML = `
        <div class="gate-song-chip expandable selected" data-id="${BLACK_GATE_TRACK3_FIXED.id}" data-umami-event="gate-chip-expand-black" data-umami-event-song-id="${BLACK_GATE_TRACK3_FIXED.id}" data-umami-event-song-name="${BLACK_GATE_TRACK3_FIXED.name.replace(/"/g, '&quot;')}">
            <div class="gate-chip-cover">
                <img src="https://assets.awmc.cc/covers/${BLACK_GATE_TRACK3_FIXED.id}.png" alt="${BLACK_GATE_TRACK3_FIXED.name}" onerror="this.src='${noCoverSvg}'">
            </div>
            <span class="gate-chip-name">${BLACK_GATE_TRACK3_FIXED.name}</span>
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
        } else if (active) {
            active.classList.remove('expanded');
        }
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
        const cur = localStorage.getItem('black-gate-challenge-expanded') === 'true';
        setExpanded(!cur);
    });
}

function updateRemainingList() {
    const remainingList = document.getElementById('remaining-list');
    const remainingSongs = songs.filter(song => !progress[song.id]);

    if (remainingSongs.length === 0) {
        remainingList.innerHTML = '<div class="empty-message">🎉 所有钥匙曲目都已完成！您应该会在结算时看到钥匙。</div>';
        return;
    }

    remainingList.innerHTML = remainingSongs.map(song => `
        <div class="remaining-item">
            <img src="https://assets.awmc.cc/covers/${song.id}.png"
                 alt="暂无曲绘"
                 class="remaining-cover"
                 onerror="this.onerror=null;this.src='${noCoverSvg}'">
            <div>
                <strong>${song.name}</strong> (ID: ${song.id}) - ${song.version} - 难度: ${song.difficulty}
            </div>
        </div>
    `).join('');
}

document.getElementById('show-remaining').addEventListener('click', () => {
    showRemainingOnly = true;
    document.getElementById('filter-checkbox').checked = true;
    renderSongs();
});

document.getElementById('show-all').addEventListener('click', () => {
    showRemainingOnly = false;
    document.getElementById('filter-checkbox').checked = false;
    renderSongs();
});

document.getElementById('filter-checkbox').addEventListener('change', (e) => {
    showRemainingOnly = e.target.checked;
    renderSongs();
});

document.getElementById('gate-random').addEventListener('click', () => {
    blackGateChallengeRun = randomPickBlackGateChallenge();
    renderBlackGateChallengeRun();
    if (typeof umami !== 'undefined') umami.track('gate-challenge-random-black', { track1: blackGateChallengeRun[0], track2: blackGateChallengeRun[1] });
    if (typeof posthog !== 'undefined' && posthog.capture) posthog.capture('gate-challenge-random-black', { track1: blackGateChallengeRun[0], track2: blackGateChallengeRun[1] });
});

document.getElementById('reset').addEventListener('click', () => {
    if (confirm('确定要重置所有进度吗？此操作不可恢复。')) {
        progress = {};
        saveProgress(progress);
        updateStats();
        renderSongs();
        updateRemainingList();
        if (typeof umami !== 'undefined') umami.track('black-gate-reset-confirmed');
        if (typeof posthog !== 'undefined' && posthog.capture) posthog.capture('black-gate-reset-confirmed');
    }
});

document.getElementById('export-base64').addEventListener('click', () => {
    const data = btoa(unescape(encodeURIComponent(JSON.stringify(progress))));
    navigator.clipboard.writeText(data).then(() => {
        alert('已复制到剪贴板');
    }).catch(() => {
        prompt('请手动复制以下 Base64 数据：', data);
    });
});

document.getElementById('import-btn').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'flex';
    document.getElementById('import-error').style.display = 'none';
});

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'none';
});

document.getElementById('import-cancel').addEventListener('click', () => {
    document.getElementById('import-modal').style.display = 'none';
});

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
        if (typeof posthog !== 'undefined' && posthog.capture) posthog.capture('black-gate-import-success');
    } catch (e) {
        errEl.textContent = '导入失败：' + (e.message || '数据格式错误');
        errEl.style.display = 'block';
    }
});

updateStats();
renderSongs();
updateRemainingList();
renderBlackGateChallengeRun();
initExpandClick();
initBlackGateChallengeSection();
