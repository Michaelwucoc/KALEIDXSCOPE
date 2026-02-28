/**
 * maimai 乐曲数据模块 - 从 diving-fish API 拉取并缓存
 * API: https://www.diving-fish.com/api/maimaidxprober/music_data
 * 使用 ETag 缓存，304 时复用本地数据
 */
(function (global) {
    const API_URL = 'https://www.diving-fish.com/api/maimaidxprober/music_data';
    const STORAGE_KEY = 'maimai-music-data';
    const ETAG_KEY = 'maimai-music-data-etag';

    const DIFF_NAMES = ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'Re:Master'];
    const DIFF_COLORS = {
        'BASIC': '#7cb342',
        'ADVANCED': 'rgb(255, 217, 0)',
        'EXPERT': '#e53935',
        'MASTER': '#8e24aa',
        'Re:Master': 'rgb(144, 89, 165)'
    };

    function getCached() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const etag = localStorage.getItem(ETAG_KEY);
            if (raw && etag) {
                return { data: JSON.parse(raw), etag };
            }
        } catch (e) { /* ignore */ }
        return null;
    }

    function setCache(data, etag) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            if (etag) localStorage.setItem(ETAG_KEY, etag);
        } catch (e) { /* ignore */ }
    }

    /**
     * 拉取乐曲数据，优先使用 ETag 缓存
     * @returns {Promise<Array>} 乐曲数组
     */
    async function fetchMusicData() {
        const cached = getCached();
        const headers = {};
        if (cached && cached.etag) {
            headers['If-None-Match'] = cached.etag;
        }

        const res = await fetch(API_URL, { method: 'GET', headers });
        const etag = res.headers.get('etag');

        if (res.status === 304 && cached) {
            return cached.data;
        }

        if (!res.ok) {
            if (cached) return cached.data;
            return loadLocalBackup();
        }

        const data = await res.json();
        if (Array.isArray(data)) {
            setCache(data, etag || '');
            return data;
        }
        if (cached) return cached.data;
        return loadLocalBackup();
    }

    /** 本地备份：API 失败时从网站根目录 music_data.json 加载 */
    async function loadLocalBackup() {
        try {
            const url = new URL('../music_data.json', window.location.href).href;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCache(data, '');
                    return data;
                }
            }
        } catch (e) { /* ignore */ }
        try {
            const res = await fetch('/music_data.json');
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) return data;
            }
        } catch (e) { /* ignore */ }
        const cached = getCached();
        if (cached) return cached.data;
        throw new Error('获取乐曲数据失败，请检查网络或稍后重试');
    }

    /**
     * 获取乐曲数据 Map<id, song>，内部会拉取并缓存
     */
    let _dataPromise = null;
    let _dataMap = null;

    async function getMusicDataMap() {
        if (_dataMap) return _dataMap;
        if (!_dataPromise) _dataPromise = fetchMusicData();
        const arr = await _dataPromise;
        _dataMap = new Map(arr.map(s => [String(s.id), s]));
        return _dataMap;
    }

    /**
     * 根据 id 获取单曲信息
     * @param {string} songId
     * @returns {Promise<object|null>}
     */
    async function getSongById(songId) {
        const map = await getMusicDataMap();
        return map.get(String(songId)) || null;
    }

    /**
     * 手动刷新数据（忽略缓存）
     */
    function invalidateCache() {
        _dataPromise = null;
        _dataMap = null;
        try {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(ETAG_KEY);
        } catch (e) { /* ignore */ }
    }

    global.MusicData = {
        fetchMusicData,
        getMusicDataMap,
        getSongById,
        invalidateCache,
        DIFF_NAMES,
        DIFF_COLORS
    };
})(typeof window !== 'undefined' ? window : globalThis);
