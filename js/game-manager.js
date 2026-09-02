/**
 * 学友打（がくゆうだ！）ゲームマネージャー
 * ゲーム進行、タイマー、出題管理、スコア・コンボ計算、UI更新を担当
 */

class GameManager {
  constructor() {
    this.mode = 'standard'; // 'practice' (練習), 'standard' (本番), 'hard' (本気)
    this.selectedDept = 'ALL'; // 'ALL', '福祉', '総務', '渉外', '財務', '広報', '厚生', '企画'
    
    this.membersPool = [];
    this.currentQueue = [];
    this.currentMemberIndex = 0;
    this.currentMember = null;
    
    this.typingEngine = new TypingEngine();
    
    // ゲームステータス
    this.isPlaying = false;
    this.timeLimit = 60; // 秒
    this.timeRemaining = 60;
    this.timerInterval = null;
    this.problemStartTime = 0;
    this.problemMistypes = 0;
    this.problemTotalKeys = 0;

    // スコアリング
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalCorrectKeys = 0;
    this.totalMistypes = 0;
    this.clearedMembersCount = 0;

    // DOM要素キャッシュ用
    this.dom = {};
  }

  initDOM() {
    this.dom = {
      // 画面
      screenTitle: document.getElementById('screen-title'),
      screenPlay: document.getElementById('screen-play'),
      screenResult: document.getElementById('screen-result'),
      screenCountdown: document.getElementById('screen-countdown'),
      countdownNumber: document.getElementById('countdown-number'),

      // プレイ画面要素
      timerText: document.getElementById('play-timer-text'),
      timerBar: document.getElementById('play-timer-bar'),
      scoreText: document.getElementById('play-score-text'),
      comboText: document.getElementById('play-combo-text'),
      comboWrap: document.getElementById('play-combo-wrap'),
      timeBonusNotice: document.getElementById('play-time-bonus'),
      
      memberAvatar: document.getElementById('play-avatar'),
      memberKanji: document.getElementById('play-kanji'),
      memberDeptBadge: document.getElementById('play-dept-badge'),
      memberGradeBadge: document.getElementById('play-grade-badge'),
      memberDetailInfo: document.getElementById('play-detail-info'),
      
      typingContainer: document.getElementById('play-typing-container'),
      kanaDisplay: document.getElementById('play-kana'),
      romajiTyped: document.getElementById('play-romaji-typed'),
      romajiRemaining: document.getElementById('play-romaji-remaining'),
      
      mainCard: document.querySelector('.play-main-card'),
      hintGuide: document.getElementById('play-hint-guide'),
      
      // リザルト画面
      resultScore: document.getElementById('result-score'),
      resultAccuracy: document.getElementById('result-accuracy'),
      resultClearedCount: document.getElementById('result-cleared-count'),
      resultKpm: document.getElementById('result-kpm'),
      resultMaxCombo: document.getElementById('result-max-combo'),
      resultRankTitle: document.getElementById('result-rank-title'),
      resultRankDesc: document.getElementById('result-rank-desc'),
      reviewContainer: document.getElementById('review-list-container'),
      
      // スコア登録フォーム
      selectDept: document.getElementById('reg-dept'),
      selectName: document.getElementById('reg-name'),
      btnSaveScore: document.getElementById('btn-save-score'),
      regStatusMsg: document.getElementById('reg-status-msg'),

      // ランキングリスト
      rankingTableBody: document.getElementById('ranking-table-body'),
      deptRankingBody: document.getElementById('dept-ranking-body')
    };
  }

  setMode(mode) {
    this.mode = mode;
    if (mode === 'practice') {
      this.timeLimit = 90;
    } else if (mode === 'hard') {
      this.timeLimit = 45;
    } else {
      this.timeLimit = 60;
    }
  }

  setDepartment(dept) {
    this.selectedDept = dept;
  }

  /**
   * ゲーム開始カウントダウン
   */
  startCountdown(onComplete) {
    this.dom.screenTitle.classList.add('hidden');
    this.dom.screenResult.classList.add('hidden');
    this.dom.screenPlay.classList.add('hidden');
    this.dom.screenCountdown.classList.remove('hidden');

    let count = 3;
    this.dom.countdownNumber.textContent = count;
    this.dom.countdownNumber.className = 'countdown-num pop';
    window.soundManager.playCountdown(false);

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        this.dom.countdownNumber.textContent = count;
        this.dom.countdownNumber.className = 'countdown-num pop';
        window.soundManager.playCountdown(false);
      } else if (count === 0) {
        this.dom.countdownNumber.textContent = 'START!';
        this.dom.countdownNumber.className = 'countdown-num pop start-text';
        window.soundManager.playCountdown(true);
      } else {
        clearInterval(interval);
        this.dom.screenCountdown.classList.add('hidden');
        if (onComplete) onComplete();
      }
    }, 900);
  }

  /**
   * ゲーム本編の開始
   */
  startGame(allMembers) {
    this.isPlaying = true;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.totalCorrectKeys = 0;
    this.totalMistypes = 0;
    this.clearedMembersCount = 0;
    this.timeRemaining = this.timeLimit;

    window.reviewManager.reset();

    // 出題プールのフィルタリングとシャッフル
    let pool = [...allMembers];
    if (this.selectedDept && this.selectedDept !== 'ALL') {
      pool = pool.filter(m => m.dept === this.selectedDept);
    }
    // シャッフル
    this.membersPool = pool.sort(() => Math.random() - 0.5);
    this.currentQueue = [...this.membersPool];
    this.currentMemberIndex = 0;

    // UI初期化
    this.dom.screenPlay.classList.remove('hidden');
    this.updateScoreUI();
    this.updateTimerUI();

    // 最初の出題
    this.nextProblem();

    // タイマー開始
    const tickIntervalMs = 100;
    this.timerInterval = setInterval(() => {
      this.timeRemaining -= tickIntervalMs / 1000;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.updateTimerUI();
        this.endGame();
      } else {
        this.updateTimerUI();
      }
    }, tickIntervalMs);
  }

  /**
   * 次の出題を設定
   */
  nextProblem() {
    if (this.currentQueue.length === 0) {
      // プールを再シャッフルして補充
      this.currentQueue = [...this.membersPool].sort(() => Math.random() - 0.5);
    }

    this.currentMember = this.currentQueue.shift();
    this.problemStartTime = Date.now();
    this.problemMistypes = 0;
    this.problemTotalKeys = 0;
    this.isNameRevealed = false;

    // タイピングエンジンに出題のかなを設定
    this.typingEngine.setTargetKana(this.currentMember.kana);

    // 画面表示更新
    this.renderProblemUI();
  }

  /**
   * 出題のUI描画
   */
  renderProblemUI() {
    const m = this.currentMember;
    const isPractice = this.mode === 'practice';
    const isHard = this.mode === 'hard';

    // 顔写真
    const imgUrl = window.apiService.resolveImageUrl(m);
    this.dom.memberAvatar.src = imgUrl;

    // 漢字
    this.dom.memberKanji.textContent = m.kanji;

    // 所属・学年バッジ
    if (isHard) {
      // 本気モード: 所属ヒント非表示
      this.dom.memberDeptBadge.style.display = 'none';
      this.dom.memberGradeBadge.style.display = 'none';
      this.dom.memberDetailInfo.style.display = 'none';
    } else {
      this.dom.memberDeptBadge.style.display = 'inline-block';
      this.dom.memberDeptBadge.textContent = m.dept;
      this.dom.memberGradeBadge.style.display = 'inline-block';
      this.dom.memberGradeBadge.textContent = `${m.grade}回生`;
      
      if (isPractice && (m.faculty || m.department_name)) {
        this.dom.memberDetailInfo.style.display = 'block';
        this.dom.memberDetailInfo.textContent = `${m.faculty || ''} ${m.department_name || ''}`;
      } else {
        this.dom.memberDetailInfo.style.display = 'none';
      }
    }

    // 名前の表示/非表示（ヒント）制御
    if (isPractice || this.isNameRevealed) {
      this.dom.mainCard.classList.remove('name-hidden');
      this.dom.hintGuide.classList.add('hidden');
    } else {
      this.dom.mainCard.classList.add('name-hidden');
      this.dom.hintGuide.classList.remove('hidden');
    }

    // タイピングガイドの表示制御
    if (isHard && !this.isNameRevealed) {
      // 本気モードかつ未リビール時は入力ガイドを完全に非表示にできるが、
      // CSSのname-hiddenで隠れるのでそのままでOK
      this.dom.typingContainer.classList.remove('hard-mode-hidden');
      this.dom.kanaDisplay.textContent = m.kana;
      this.updateTypingGuideUI();
    } else {
      this.dom.typingContainer.classList.remove('hard-mode-hidden');
      this.dom.kanaDisplay.textContent = m.kana;
      this.updateTypingGuideUI();
    }
  }

  /**
   * ローマ字入力ガイドのリアルタイム更新
   */
  updateTypingGuideUI() {
    const state = this.typingEngine.getDisplayState();
    this.dom.romajiTyped.textContent = state.typedPart;
    this.dom.romajiRemaining.textContent = state.remainingPart;
  }

  /**
   * キー入力ハンドリング
   */
  handleKeyPress(key) {
    if (!this.isPlaying || !this.currentMember) return;

    // Enterでパス（スキップ）
    if (key === 'Enter') {
      window.soundManager.playMissSound();
      this.problemMistypes++;
      this.totalMistypes++;
      this.combo = 0;
      this.triggerMistypeEffect();
      this.updateScoreUI();
      this.nextProblem();
      return;
    }

    // Spaceでヒント表示
    if (key === ' ' && !this.isNameRevealed && this.mode !== 'practice') {
      this.isNameRevealed = true;
      this.renderProblemUI();
      return;
    }

    this.problemTotalKeys++;

    // タイピング判定
    const isCorrect = this.typingEngine.inputKey(key);

    if (isCorrect) {
      // 最初の正解打鍵で自動的に名前をリビールする
      if (!this.isNameRevealed && this.mode !== 'practice') {
        this.isNameRevealed = true;
        this.renderProblemUI();
      }

      // 正解打鍵
      this.totalCorrectKeys++;
      this.combo++;
      if (this.combo > this.maxCombo) {
        this.maxCombo = this.combo;
      }

      // コンボ倍率計算
      let multiplier = 1.0;
      if (this.combo >= 30) multiplier = 2.0;
      else if (this.combo >= 20) multiplier = 1.5;
      else if (this.combo >= 10) multiplier = 1.2;

      this.score += Math.round(10 * multiplier);

      window.soundManager.playTypeSound();
      this.updateScoreUI();
      this.updateTypingGuideUI();

      // 単語クリア判定
      if (this.typingEngine.isComplete) {
        this.onWordCompleted();
      }
    } else {
      // ミス打鍵
      this.problemMistypes++;
      this.totalMistypes++;
      this.combo = 0; // コンボリセット

      window.soundManager.playMissSound();
      this.triggerMistypeEffect();
      this.updateScoreUI();
    }
  }

  /**
   * ミス時の画面フラッシュ演出
   */
  triggerMistypeEffect() {
    document.body.classList.add('screen-miss-flash');
    setTimeout(() => {
      document.body.classList.remove('screen-miss-flash');
    }, 120);
  }

  /**
   * 単語（フルネーム）クリア時の処理
   */
  onWordCompleted() {
    this.clearedMembersCount++;
    const timeTaken = Date.now() - this.problemStartTime;

    // 復習マネージャーに記録
    window.reviewManager.logAnswer({
      member: this.currentMember,
      timeTaken: timeTaken,
      mistypeCount: this.problemMistypes,
      totalKeyCount: this.problemTotalKeys
    });

    // ノーミスクリア時の時間ボーナス (+2秒回復)
    if (this.problemMistypes === 0) {
      this.timeRemaining = Math.min(this.timeLimit + 10, this.timeRemaining + 2);
      this.showTimeBonusNotice('+2s Bonus!');
      window.soundManager.playBonusSound();
    } else {
      window.soundManager.playWordCompleteSound();
    }

    // 次の出題へ
    this.nextProblem();
  }

  showTimeBonusNotice(text) {
    if (!this.dom.timeBonusNotice) return;
    this.dom.timeBonusNotice.textContent = text;
    this.dom.timeBonusNotice.classList.remove('hidden', 'bonus-pop');
    void this.dom.timeBonusNotice.offsetWidth; // リフロー
    this.dom.timeBonusNotice.classList.add('bonus-pop');
    setTimeout(() => {
      this.dom.timeBonusNotice.classList.add('hidden');
    }, 1000);
  }

  /**
   * スコア・コンボUIの更新
   */
  updateScoreUI() {
    this.dom.scoreText.textContent = this.score.toLocaleString();
    this.dom.comboText.textContent = this.combo;

    if (this.combo >= 5) {
      this.dom.comboWrap.classList.remove('hidden');
      if (this.combo >= 20) {
        this.dom.comboWrap.classList.add('fever');
      } else {
        this.dom.comboWrap.classList.remove('fever');
      }
    } else {
      this.dom.comboWrap.classList.add('hidden');
    }
  }

  /**
   * タイマー・プログレスバーUIの更新
   */
  updateTimerUI() {
    const ceilSec = Math.ceil(this.timeRemaining);
    this.dom.timerText.textContent = ceilSec;

    // プログレスバーの割合
    const percentage = Math.max(0, Math.min(100, (this.timeRemaining / this.timeLimit) * 100));
    this.dom.timerBar.style.width = `${percentage}%`;

    // 残り10秒以下で鼓動＆警告カラー
    if (ceilSec <= 10) {
      this.dom.timerText.classList.add('timer-warning');
      this.dom.timerBar.classList.add('bar-warning');
    } else {
      this.dom.timerText.classList.remove('timer-warning');
      this.dom.timerBar.classList.remove('bar-warning');
    }
  }

  /**
   * ゲーム終了・リザルト表示
   */
  endGame() {
    this.isPlaying = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    window.soundManager.playFinishFanfare();

    // 画面切り替え
    this.dom.screenPlay.classList.add('hidden');
    this.dom.screenResult.classList.remove('hidden');

    // 計算
    const totalKeys = this.totalCorrectKeys + this.totalMistypes;
    const accuracy = totalKeys > 0 ? ((this.totalCorrectKeys / totalKeys) * 100) : 0;
    const durationMin = this.timeLimit / 60;
    const kpm = Math.round(this.totalCorrectKeys / durationMin);

    // リザルト統計UI
    this.dom.resultScore.textContent = this.score.toLocaleString();
    this.dom.resultAccuracy.textContent = `${accuracy.toFixed(1)}%`;
    this.dom.resultClearedCount.textContent = `${this.clearedMembersCount} 名`;
    this.dom.resultKpm.textContent = kpm;
    this.dom.resultMaxCombo.textContent = this.maxCombo;

    // ランク称号の判定
    const { title, desc } = this.calculateRank(this.score, accuracy);
    this.dom.resultRankTitle.textContent = title;
    this.dom.resultRankDesc.textContent = desc;

    // 復習リストのレンダリング
    window.reviewManager.renderReviewList(this.dom.reviewContainer);

    // スコア登録フォームの初期化
    this.initScoreRegistrationForm(this.score, accuracy);
  }

  calculateRank(score, accuracy) {
    if (score >= 2000 && accuracy >= 95) {
      return { title: '【S+】学友会の生き字引', desc: '全役員の顔と名前を完璧に掌握しています！神業タイピング！' };
    } else if (score >= 1500) {
      return { title: '【S】学友会マスター', desc: '役員の顔と名前が完全に頭に入っています！素晴らしい速さです。' };
    } else if (score >= 1000) {
      return { title: '【A】学友会エキスパート', desc: '多くのメンバーを正確に認知できています。次期執行部候補！' };
    } else if (score >= 600) {
      return { title: '【B】学友会ルーキー', desc: '順調に名前を覚えられています！復習リストで苦手な人をチェックしましょう。' };
    } else {
      return { title: '【C】新米メンバー', desc: 'まずは自分の部署やよく関わる先輩から覚えていきましょう！' };
    }
  }

  /**
   * スコア登録フォームの初期化とプルダウン連動
   */
  initScoreRegistrationForm(finalScore, accuracy) {
    const members = window.INITIAL_MEMBERS || [];
    const depts = ['福祉', '総務', '渉外', '財務', '広報', '厚生', '企画'];

    // 部署プルダウン
    this.dom.selectDept.innerHTML = `<option value="">部署を選択</option>` +
      depts.map(d => `<option value="${d}">${d}</option>`).join('');

    // 部署選択時の連動イベント
    this.dom.selectDept.onchange = () => {
      const selected = this.dom.selectDept.value;
      if (!selected) {
        this.dom.selectName.innerHTML = `<option value="">氏名を選択</option>`;
        this.dom.selectName.disabled = true;
        return;
      }

      const filtered = members.filter(m => m.dept === selected);
      this.dom.selectName.innerHTML = `<option value="">氏名を選択</option>` +
        filtered.map(m => `<option value="${m.kanji}">${m.kanji} (${m.grade}年)</option>`).join('');
      this.dom.selectName.disabled = false;
    };

    // LocalStorageから前回入力情報を復元
    const savedUser = localStorage.getItem('gakuyu_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.dept) {
          this.dom.selectDept.value = u.dept;
          this.dom.selectDept.onchange();
          if (u.name) {
            this.dom.selectName.value = u.name;
          }
        }
      } catch (e) {}
    }

    // 保存ボタンイベント
    this.dom.btnSaveScore.onclick = async () => {
      const dept = this.dom.selectDept.value;
      const name = this.dom.selectName.value;

      if (!dept || !name) {
        alert('部署と氏名を選択してください。');
        return;
      }

      this.dom.btnSaveScore.disabled = true;
      this.dom.btnSaveScore.textContent = '登録中...';
      this.dom.regStatusMsg.textContent = '';

      // LocalStorageにユーザー記憶
      localStorage.setItem('gakuyu_user', JSON.stringify({ dept, name }));

      // スコア送信
      await window.apiService.saveScore({
        player_name: name,
        player_dept: dept,
        score: finalScore,
        accuracy: parseFloat(accuracy.toFixed(2))
      });

      this.dom.btnSaveScore.textContent = '登録完了！';
      this.dom.regStatusMsg.textContent = 'ランキングにスコアが登録されました！';
      this.dom.regStatusMsg.className = 'reg-msg success';
    };
  }
}

window.gameManager = new GameManager();
