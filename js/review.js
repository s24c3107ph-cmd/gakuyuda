/**
 * 学友打（がくゆうだ！）復習マネージャー
 * ミス打鍵があったメンバー、および解答に5秒以上かかったメンバーを抽出・復習リスト化
 */

class ReviewManager {
  constructor() {
    this.problemLogs = []; // 各出題の解答ログ
  }

  reset() {
    this.problemLogs = [];
  }

  /**
   * 出題ログを追加
   */
  logAnswer({ member, timeTaken, mistypeCount, totalKeyCount }) {
    const isMistyped = mistypeCount > 0;
    const isSlow = timeTaken >= 5000;
    const shouldReview = isMistyped || isSlow;

    this.problemLogs.push({
      member,
      timeTaken,
      mistypeCount,
      totalKeyCount,
      isMistyped,
      isSlow,
      shouldReview
    });
  }

  /**
   * 復習対象のメンバーリストを取得
   */
  getReviewList() {
    return this.problemLogs.filter(log => log.shouldReview);
  }

  /**
   * 復習UIコンポーネントをHTML生成
   */
  renderReviewList(containerEl) {
    if (!containerEl) return;
    const reviewItems = this.getReviewList();

    if (reviewItems.length === 0) {
      containerEl.innerHTML = `
        <div class="review-empty">
          <div class="review-empty-icon">✨</div>
          <div class="review-empty-title">パーフェクト！</div>
          <div class="review-empty-desc">ミス打鍵・解答遅延（5秒以上）のメンバーはいませんでした。素晴らしい記憶力です！</div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="review-header">
        <span class="review-badge">要復習 ${reviewItems.length}名</span>
        <span class="review-hint">ミス打鍵または回答時間5秒以上のメンバー</span>
      </div>
      <div class="review-carousel">
    `;

    reviewItems.forEach(item => {
      const m = item.member;
      const imgUrl = window.apiService ? window.apiService.resolveImageUrl(m) : 'images/default_avatar.svg';
      const timeSec = (item.timeTaken / 1000).toFixed(1);
      
      const reasons = [];
      if (item.isMistyped) reasons.push(`<span class="reason-tag mistype">ミス ${item.mistypeCount}回</span>`);
      if (item.isSlow) reasons.push(`<span class="reason-tag slow">${timeSec}秒</span>`);

      html += `
        <div class="review-card">
          <div class="review-card-img-wrap">
            <img src="${imgUrl}" alt="${m.kanji}" onerror="this.src='images/default_avatar.svg'" class="review-avatar" />
            <div class="review-dept-badge">${m.dept}・${m.grade}年</div>
          </div>
          <div class="review-card-info">
            <div class="review-kanji">${m.kanji}</div>
            <div class="review-kana">${m.kana}</div>
            <div class="review-romaji">${m.romaji}</div>
            <div class="review-subinfo">${m.faculty || ''} ${m.department_name || ''}</div>
            <div class="review-reasons">${reasons.join('')}</div>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    containerEl.innerHTML = html;
  }
}

window.reviewManager = new ReviewManager();
