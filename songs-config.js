/**
 * 各门曲目配置 - 仅保留 id/name 作为回退
 * 乐曲详情（版本、难度等）优先从 MusicData/song-detail 获取
 */
(function (global) {
    const BLUE_SONGS = [
        { id: '11009', name: 'STEREOSCAPE' }, { id: '11008', name: 'Crazy Circle' },
        { id: '11100', name: 'シエルブルーマルシェ' }, { id: '11097', name: 'ブレインジャックシンドローム' },
        { id: '11098', name: '共鳴' }, { id: '11099', name: 'Ututu' }, { id: '11163', name: 'REAL VOICE' },
        { id: '11162', name: 'ユメヒバナ' }, { id: '11161', name: 'オリフィス' },
        { id: '11228', name: '星めぐり、果ての君へ。' }, { id: '11229', name: 'スローアライズ' },
        { id: '11231', name: '生命不詳' }, { id: '11739', name: '184億回のマルチトニック' },
        { id: '11463', name: 'RIFFRAIN' }, { id: '11464', name: 'Falling' }, { id: '11465', name: 'ピリオドサイン' },
        { id: '11538', name: 'アンバークロニクル' }, { id: '11539', name: 'リフヴェイン' }, { id: '11541', name: '宵の鳥' },
        { id: '11620', name: 'フェイクフェイス・フェイルセイフ' }, { id: '11622', name: 'シックスプラン' },
        { id: '11623', name: 'フタタビ' }, { id: '11737', name: 'パラドクスイヴ' }, { id: '11738', name: 'YKWTD' },
        { id: '11164', name: 'パラボラ' }, { id: '11230', name: 'チエルカ／エソテリカ' },
        { id: '11466', name: '群青シグナル' }, { id: '11540', name: 'Kairos' }, { id: '11621', name: 'ふらふらふら、' }
    ];
    const BLUE_GATE = {
        track1: [
            { id: '11008', name: 'Crazy Circle' }, { id: '11009', name: 'STEREOSCAPE' },
            { id: '11100', name: 'シエルブルーマルシェ' }, { id: '11097', name: 'ブレインジャックシンドローム' },
            { id: '11098', name: '共鳴' }, { id: '11099', name: 'Ututu' }, { id: '11161', name: 'オリフィス' },
            { id: '11162', name: 'ユメヒバナ' }, { id: '11163', name: 'REAL VOICE' },
            { id: '11228', name: '星めぐり、果ての君へ。' }, { id: '11229', name: 'スローアライズ' },
            { id: '11231', name: '生命不詳' }, { id: '11463', name: 'RIFFRAIN' }, { id: '11464', name: 'Falling' },
            { id: '11465', name: 'ピリオドサイン' }, { id: '11538', name: 'アンバークロニクル' },
            { id: '11539', name: 'リフヴェイン' }, { id: '11541', name: '宵の鳥' },
            { id: '11620', name: 'フェイクフェイス・フェイルセイフ' }, { id: '11622', name: 'シックスプラン' },
            { id: '11623', name: 'フタタビ' }, { id: '11737', name: 'パラドクスイヴ' }, { id: '11738', name: 'YKWTD' }
        ],
        track2: [
            { id: '11164', name: 'パラボラ' }, { id: '11230', name: 'チエルカ／エソテリカ' },
            { id: '11466', name: '群青シグナル' }, { id: '11540', name: 'Kairos' },
            { id: '11621', name: 'ふらふらふら、' }, { id: '11739', name: '184億回のマルチトニック' }
        ],
        track3: { id: '11740', name: '果ての空、僕らが見た光。' }
    };

    const WHITE_SONGS = [
        { id: '11102', name: '封焔の135秒' }, { id: '11234', name: 'ほしぞらスペクタクル' },
        { id: '11300', name: 'U&iVERSE -銀河鸞翔-' }, { id: '11529', name: 'ツムギボシ' },
        { id: '11542', name: 'ここからはじまるプロローグ。 (Kanon Remix)' }, { id: '11612', name: 'Latent Kingdom' }
    ];
    const WHITE_GATE = {
        track1: [
            { id: '11027', name: 'アポカリプスに反逆の焔を焚べろ' }, { id: '11101', name: 'GRÄNDIR' },
            { id: '11103', name: '渦状銀河のシンフォニエッタ' }, { id: '11166', name: 'ワンダーシャッフェンの法則' },
            { id: '11167', name: 'BIRTH' }, { id: '11236', name: 'Last Samurai' }, { id: '11237', name: '蒼穹舞楽' },
            { id: '11301', name: '華の集落、秋のお届け' }, { id: '11303', name: '星詠みとデスペラード' },
            { id: '11387', name: '星空パーティーチューン' }, { id: '11388', name: 'チューリングの跡' },
            { id: '11386', name: 'Swift Swing' }, { id: '11467', name: 'Beat Opera op.1' },
            { id: '11468', name: '星見草' }, { id: '11469', name: '"411Ψ892"' },
            { id: '11682', name: 'Geranium' }, { id: '11683', name: 'The Cursed Doll' },
            { id: '11684', name: 'RondeauX of RagnaroQ' }, { id: '11742', name: 'Ourania' }, { id: '11743', name: '天蓋' }
        ],
        track2: [
            { id: '11026', name: 'TEmPTaTiON' }, { id: '11102', name: '封焔の135秒' },
            { id: '11165', name: 'Regulus' }, { id: '11238', name: 'AMABIE' }, { id: '11302', name: 'BLACK SWAN' },
            { id: '11389', name: 'Sage' }, { id: '11470', name: '康莊大道' }, { id: '11685', name: 'ℝ∈Χ LUNATiCA' },
            { id: '11744', name: 'Deicide' }
        ],
        track3: { id: '11745', name: '氷滅の135小節' }
    };

    const PURPLE_SONGS = [
        { id: '328', name: '言ノ葉カルマ' }, { id: '403', name: '悪戯' }, { id: '457', name: '言ノ葉遊戯' },
        { id: '458', name: 'りばーぶ' }, { id: '532', name: '洗脳' }, { id: '533', name: 'Barbed Eye' },
        { id: '559', name: '空威張りビヘイビア' }, { id: '568', name: '分からない' },
        { id: '613', name: '天国と地獄 -言ノ葉リンネ-' }, { id: '626', name: '相思創愛' },
        { id: '673', name: '咲キ誇レ常世ノ華' }, { id: '11001', name: 'BLACK ROSE' },
        { id: '11002', name: 'Secret Sleuth' }, { id: '11104', name: 'ヤミツキ' }, { id: '11105', name: 'ワードワードワード' },
        { id: '11168', name: 'シアトリカル・ケース' }, { id: '11169', name: 'ステップアンドライム' },
        { id: '11170', name: '届かない花束' }, { id: '11365', name: 'アンビバレンス' },
        { id: '11380', name: 'パーフェクション' }, { id: '11381', name: 'デーモンベット' },
        { id: '11456', name: '分解収束テイル' }, { id: '11532', name: 'ヱデン' }, { id: '11533', name: 'にゃーにゃー冒険譚' },
        { id: '11613', name: 'Mystic Parade' }, { id: '11614', name: 'Cry Cry Cry' },
        { id: '11747', name: '地獄' }, { id: '11748', name: 'シスターシスター' }
    ];
    const PURPLE_GATE = {
        track1: [
            { id: '328', name: '言ノ葉カルマ' }, { id: '403', name: '悪戯' }, { id: '457', name: '言ノ葉遊戯' },
            { id: '458', name: 'りばーぶ' }, { id: '532', name: '洗脳' }, { id: '533', name: 'Barbed Eye' },
            { id: '559', name: '空威張りビヘイビア' }, { id: '568', name: '分からない' },
            { id: '613', name: '天国と地獄 -言ノ葉リンネ-' }, { id: '626', name: '相思創愛' },
            { id: '673', name: '咲キ誇レ常世ノ華' }
        ],
        track2: [
            { id: '11001', name: 'BLACK ROSE' }, { id: '11002', name: 'Secret Sleuth' },
            { id: '11104', name: 'ヤミツキ' }, { id: '11105', name: 'ワードワードワード' },
            { id: '11168', name: 'シアトリカル・ケース' }, { id: '11169', name: 'ステップアンドライム' },
            { id: '11170', name: '届かない花束' }, { id: '11365', name: 'アンビバレンス' },
            { id: '11380', name: 'パーフェクション' }, { id: '11381', name: 'デーモンベット' },
            { id: '11456', name: '分解収束テイル' }, { id: '11532', name: 'ヱデン' },
            { id: '11533', name: 'にゃーにゃー冒険譚' }, { id: '11613', name: 'Mystic Parade' },
            { id: '11614', name: 'Cry Cry Cry' }, { id: '11747', name: '地獄' }, { id: '11748', name: 'シスターシスター' }
        ],
        track3: { id: '11749', name: '有明/Ariake' }
    };

    const BLACK_SONGS = [
        { id: '11023', name: 'Blows Up Everything' }, { id: '11106', name: 'Valsqotch' },
        { id: '11221', name: '≠彡"/了→' }, { id: '11222', name: 'BREaK! BREaK! BREaK!' },
        { id: '11300', name: 'U&iVERSE -銀河鸞翔-' }, { id: '11374', name: 'GIGANTØMAKHIA' },
        { id: '11458', name: 'Rising on the horizon' }, { id: '11523', name: 'ViRTUS' },
        { id: '11619', name: 'KHYMΞXΛ' }, { id: '11663', name: '系ぎて' },
        { id: '11746', name: 'Divide et impera!' }
    ];
    const BLACK_GATE = {
        track1: [
            { id: '11019', name: 'Scarlet Wings' }, { id: '11020', name: 'Technicians High' },
            { id: '11021', name: '魔ジョ狩リ' }, { id: '11022', name: 'TwisteD! XD' },
            { id: '11090', name: 'Flashkick' }, { id: '11091', name: 'Stardust Memories' },
            { id: '11092', name: 'My My My' }, { id: '11157', name: 'Aetheric Energy' },
            { id: '11158', name: 'Komplexe' }, { id: '11159', name: 'Beautiful Future' },
            { id: '11232', name: 'Never Give Up!' }, { id: '11233', name: 'Starry Colors' },
            { id: '11234', name: 'ほしぞらスペクタクル' }, { id: '11304', name: 'Round Round Spinning Around' },
            { id: '11305', name: 'Alcyone' }, { id: '11306', name: 'Raven Emperor' },
            { id: '11382', name: 'HECATONCHEIR' }, { id: '11383', name: 'Irresistible' },
            { id: '11384', name: 'HAGAKIRI' }, { id: '11459', name: 'You Mean the World to Me' },
            { id: '11460', name: 'Neon Kingdom' }, { id: '11461', name: '#狂った民族２ PRAVARGYAZOOQA' },
            { id: '11615', name: 'ぽわわん劇場' }, { id: '11616', name: 'my flow' },
            { id: '11617', name: 'POWER OF UNITY' }, { id: '11674', name: 'Cider P@rty' },
            { id: '11675', name: '勦滅' }, { id: '11676', name: 'Lunatic Vibes' },
            { id: '11750', name: 'Flashback' }, { id: '11751', name: 'Colorfull:Encounter' }
        ],
        track2: [
            { id: '11023', name: 'Blows Up Everything' }, { id: '11089', name: 'STEEL TRANSONIC' },
            { id: '11160', name: 'Mutation' }, { id: '11235', name: 'VIIIbit Explorer' },
            { id: '11307', name: 'Yorugao' }, { id: '11385', name: 'N3V3R G3T OV3R' },
            { id: '11462', name: 'VSpook!' }, { id: '11618', name: 'Energizing Flame' },
            { id: '11677', name: 'Bloody Trail' }, { id: '11752', name: '雨露霜雪' }
        ],
        track3: { id: '11753', name: '宙天' }
    };

    global.SongsConfig = {
        blue: { songs: BLUE_SONGS, gate: BLUE_GATE },
        white: { songs: WHITE_SONGS, gate: WHITE_GATE },
        purple: { songs: PURPLE_SONGS, gate: PURPLE_GATE },
        black: { songs: BLACK_SONGS, gate: BLACK_GATE }
    };
})(typeof window !== 'undefined' ? window : globalThis);
