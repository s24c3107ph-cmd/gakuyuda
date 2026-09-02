/**
 * 学友打（がくゆうだ！）メインアプリケーションコントローラー
 */

document.addEventListener('DOMContentLoaded', async () => {
  // DOM初期化
  window.gameManager.initDOM();

  // ランキングデータのリセット（仮データを一掃。バージョンが変わった時のみ実行）
  const RANKING_RESET_VERSION = 'v2-real';
  if (localStorage.getItem('gakuyu_ranking_ver') !== RANKING_RESET_VERSION) {
    localStorage.removeItem('gakuyu_rankings');
    localStorage.setItem('gakuyu_ranking_ver', RANKING_RESET_VERSION);
  }

  const dom = {
    // 画面
    screenTitle: document.getElementById('screen-title'),
    screenPlay: document.getElementById('screen-play'),
    screenResult: document.getElementById('screen-result'),
    
    // タイトル画面要素
    modeTabs: document.querySelectorAll('.mode-tab'),
    courseCards: document.querySelectorAll('.course-card'),
    btnStart: document.getElementById('btn-start-game'),
    loadingIndicator: document.getElementById('title-loading'),
    
    // 設定モーダル
    btnSettings: document.getElementById('btn-open-settings'),
    settingsModal: document.getElementById('settings-modal'),
    btnCloseSettings: document.getElementById('btn-close-settings'),
    inputGasUrl: document.getElementById('input-gas-url'),
    btnSaveGasUrl: document.getElementById('btn-save-gas-url'),
    gasStatusText: document.getElementById('gas-status-text'),
    
    // ミュートボタン
    btnMute: document.getElementById('btn-toggle-sound'),
    
    // リザルト画面
    btnRetry: document.getElementById('btn-retry-game'),
    btnBackTitle: document.getElementById('btn-back-title'),
    
    // ランキングタブ
    rankingTabs: document.querySelectorAll('.ranking-tab'),
    rankingSoloView: document.getElementById('ranking-solo-view'),
    rankingDeptView: document.getElementById('ranking-dept-view'),
    rankingSoloList: document.getElementById('ranking-solo-list'),
    rankingDeptList: document.getElementById('ranking-dept-list')
  };

  let allMembers = [];
  let currentRankings = [];
  let currentMode = 'standard';
  let currentDept = 'ALL';

  // 1. 初期データロード (GAS / モック)
  async function loadData() {
    dom.loadingIndicator.classList.remove('hidden');
    dom.btnStart.disabled = true;

    try {
      const data = await window.apiService.fetchInitData();
      allMembers = data.members || window.INITIAL_MEMBERS || [];
      currentRankings = data.rankings || [];
      console.log(`[App] Loaded ${allMembers.length} members successfully.`);
    } catch (err) {
      console.error('[App] Failed to load data:', err);
      allMembers = window.INITIAL_MEMBERS || [];
      currentRankings = window.INITIAL_RANKINGS || [];
    } finally {
      dom.loadingIndicator.classList.add('hidden');
      dom.btnStart.disabled = false;
      renderRankings();
    }
  }

  // 2. 難易度タブの切り替え
  dom.modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.modeTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      currentMode = tab.dataset.mode;
      window.gameManager.setMode(currentMode);

      // モード説明の更新（発表原稿に準拠）
      const descEl = document.getElementById('mode-description');
      if (currentMode === 'practice') {
        descEl.textContent = '🌱 制限時間90秒 / 顔写真＋名前＋所属をすべて表示。まずはここから覚えよう！';
      } else if (currentMode === 'hard') {
        descEl.textContent = '🔥 制限時間45秒 / 顔写真のみ表示。ノーヒントで名前を答える究極モード！';
      } else {
        descEl.textContent = '⚡ 制限時間60秒 / 部署・学年ヒントあり。写真を見て名前を思い出してタイピング！';
      }
    });
  });

  // 3. 部署コースカードの選択
  dom.courseCards.forEach(card => {
    card.addEventListener('click', () => {
      dom.courseCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      currentDept = card.dataset.dept;
      window.gameManager.setDepartment(currentDept);
    });
  });

  // 4. ゲームスタートボタン
  dom.btnStart.addEventListener('click', () => {
    window.gameManager.setMode(currentMode);
    window.gameManager.setDepartment(currentDept);
    window.gameManager.startCountdown(() => {
      window.gameManager.startGame(allMembers);
    });
  });

  // 5. リトライ / タイトルへ戻るボタン
  dom.btnRetry.addEventListener('click', () => {
    window.gameManager.startCountdown(() => {
      window.gameManager.startGame(allMembers);
    });
  });

  dom.btnBackTitle.addEventListener('click', () => {
    dom.screenResult.classList.add('hidden');
    dom.screenPlay.classList.add('hidden');
    dom.screenTitle.classList.remove('hidden');
    renderRankings(); // 最新ランキング再描画
  });

  // 6. キーボード入力の監視
  window.addEventListener('keydown', (e) => {
    // フォーム入力中（input, select）はゲーム操作を行わない
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    if (window.gameManager.isPlaying) {
      // プレイ中
      if (e.key === 'Escape') {
        if (confirm('ゲームを中断してタイトルに戻りますか？')) {
          window.gameManager.endGame();
          dom.screenResult.classList.add('hidden');
          dom.screenTitle.classList.remove('hidden');
        }
        return;
      }

      // ファンクションキーや修飾キーを除外
      if (e.key.length === 1 || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        window.gameManager.handleKeyPress(e.key);
      }
    } else if (!dom.screenTitle.classList.contains('hidden')) {
      // タイトル画面でSpaceまたはEnterでゲーム開始
      if ((e.key === ' ' || e.key === 'Enter') && !dom.btnStart.disabled && dom.settingsModal.classList.contains('hidden')) {
        e.preventDefault();
        dom.btnStart.click();
      }
    }
  });

  // 7. ランキング描画
  function renderRankings() {
    const rankings = window.apiService.getLocalRankings();
    
    // 個人ランキング
    if (rankings.length === 0) {
      dom.rankingSoloList.innerHTML = `<div class="ranking-empty">まだスコア記録がありません</div>`;
    } else {
      let soloHtml = `<table class="ranking-table"><thead><tr><th>順位</th><th>プレイヤー</th><th>部署</th><th>スコア</th><th>正答率</th></tr></thead><tbody>`;
      rankings.slice(0, 10).forEach((r, idx) => {
        const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
        soloHtml += `
          <tr class="${rankClass}">
            <td class="rank-col">${medal}</td>
            <td class="player-col">${r.player_name}</td>
            <td><span class="dept-pill">${r.player_dept}</span></td>
            <td class="score-col">${Number(r.score).toLocaleString()}</td>
            <td>${Number(r.accuracy).toFixed(1)}%</td>
          </tr>
        `;
      });
      soloHtml += `</tbody></table>`;
      dom.rankingSoloList.innerHTML = soloHtml;
    }

    // 部署対抗ランキング（平均スコア算出）
    const deptScores = {};
    rankings.forEach(r => {
      const d = r.player_dept || '未設定';
      if (!deptScores[d]) deptScores[d] = { total: 0, count: 0, highest: 0 };
      deptScores[d].total += Number(r.score);
      deptScores[d].count += 1;
      if (Number(r.score) > deptScores[d].highest) deptScores[d].highest = Number(r.score);
    });

    const deptList = Object.keys(deptScores).map(d => ({
      dept: d,
      avg: Math.round(deptScores[d].total / deptScores[d].count),
      highest: deptScores[d].highest,
      count: deptScores[d].count
    })).sort((a, b) => b.avg - a.avg);

    if (deptList.length === 0) {
      dom.rankingDeptList.innerHTML = `<div class="ranking-empty">まだ部署記録がありません</div>`;
    } else {
      let deptHtml = `<table class="ranking-table"><thead><tr><th>順位</th><th>部署</th><th>平均スコア</th><th>最高スコア</th><th>参加人数</th></tr></thead><tbody>`;
      deptList.forEach((item, idx) => {
        const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : '';
        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`;
        deptHtml += `
          <tr class="${rankClass}">
            <td class="rank-col">${medal}</td>
            <td class="player-col"><span class="dept-pill">${item.dept}</span></td>
            <td class="score-col">${item.avg.toLocaleString()}</td>
            <td>${item.highest.toLocaleString()}</td>
            <td>${item.count} 名</td>
          </tr>
        `;
      });
      deptHtml += `</tbody></table>`;
      dom.rankingDeptList.innerHTML = deptHtml;
    }
  }

  // ランキングタブ切り替え
  dom.rankingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dom.rankingTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      if (tab.dataset.type === 'dept') {
        dom.rankingSoloView.classList.add('hidden');
        dom.rankingDeptView.classList.remove('hidden');
      } else {
        dom.rankingSoloView.classList.remove('hidden');
        dom.rankingDeptView.classList.add('hidden');
      }
    });
  });

  // 8. 設定モーダル（GAS API URL管理）
  dom.btnSettings.addEventListener('click', () => {
    dom.inputGasUrl.value = window.apiService.getGasUrl();
    dom.gasStatusText.textContent = dom.inputGasUrl.value ? '✅ GAS URLが設定されています' : '⚠️ 現在はローカル内蔵データで動作中';
    dom.settingsModal.classList.remove('hidden');
  });

  dom.btnCloseSettings.addEventListener('click', () => {
    dom.settingsModal.classList.add('hidden');
  });

  dom.btnSaveGasUrl.addEventListener('click', async () => {
    const url = dom.inputGasUrl.value.trim();
    window.apiService.setGasUrl(url);
    dom.gasStatusText.textContent = '🔄 データを再同期中...';
    await loadData();
    dom.gasStatusText.textContent = url ? '✅ 接続設定を保存し同期しました' : '✅ ローカルモードにリセットしました';
    setTimeout(() => {
      dom.settingsModal.classList.add('hidden');
    }, 1200);
  });

  // 9. サウンドミュートボタン
  dom.btnMute.addEventListener('click', () => {
    const isMuted = window.soundManager.toggleMute();
    dom.btnMute.textContent = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
    dom.btnMute.classList.toggle('muted', isMuted);
  });

  // アプリ起動
  loadData();
});
