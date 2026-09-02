/**
 * 学友打（がくゆうだ！）API連携レイヤー
 * GAS (Google Apps Script) および LocalStorage / Mock Data を透過的に処理
 */

class ApiService {
  constructor() {
    // ユーザー設定またはデフォルトGASエンドポイントURL
    const defaultUrl = 'https://script.google.com/macros/s/AKfycbxDXxxDa4myBLJetAoHZ0nGlpS52pUrzSxcD3pnkv_Ej8h2m6-lfvvOIsmIHqpA6_RT/exec';
    this.gasApiUrl = localStorage.getItem('gakuyu_gas_url') || defaultUrl;
  }

  setGasUrl(url) {
    this.gasApiUrl = (url || '').trim();
    if (this.gasApiUrl) {
      localStorage.setItem('gakuyu_gas_url', this.gasApiUrl);
    } else {
      localStorage.removeItem('gakuyu_gas_url');
    }
  }

  getGasUrl() {
    return this.gasApiUrl;
  }

  /**
   * メンバー一覧 & 初期マスターデータの取得
   */
  async fetchInitData() {
    if (this.gasApiUrl) {
      try {
        const url = new URL(this.gasApiUrl);
        url.searchParams.set('action', 'initData');
        const response = await fetch(url.toString(), {
          method: 'GET',
          mode: 'cors'
        });
        if (response.ok) {
          const data = await response.json();
          if (data && data.status === 'success' && data.members && data.members.length > 0) {
            console.log('[API] Fetched members from GAS:', data.members.length);
            return {
              members: data.members,
              rankings: data.rankings || window.INITIAL_RANKINGS || []
            };
          }
        }
      } catch (err) {
        console.warn('[API] Failed to fetch from GAS. Falling back to local dataset.', err);
      }
    }

    // GAS未接続またはオフライン時はローカルモックデータを使用
    console.log('[API] Using local member dataset.');
    return {
      members: window.INITIAL_MEMBERS || [],
      rankings: this.getLocalRankings()
    };
  }

  /**
   * スコアの保存（GAS & LocalStorage）
   */
  async saveScore(payload) {
    const record = {
      player_name: payload.player_name,
      player_dept: payload.player_dept,
      score: payload.score,
      accuracy: payload.accuracy,
      timestamp: new Date().toLocaleString('ja-JP')
    };

    // ローカルにも保存
    this.saveLocalRanking(record);

    if (this.gasApiUrl) {
      try {
        await fetch(this.gasApiUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'saveScore',
            ...record
          })
        });
        console.log('[API] Score saved to GAS');
      } catch (err) {
        console.error('[API] Error saving score to GAS:', err);
      }
    }

    return record;
  }

  getLocalRankings() {
    const saved = localStorage.getItem('gakuyu_rankings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return window.INITIAL_RANKINGS || [];
  }

  saveLocalRanking(record) {
    const current = this.getLocalRankings();
    current.push(record);
    current.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
    localStorage.setItem('gakuyu_rankings', JSON.stringify(current.slice(0, 50)));
  }

  /**
   * 画像URLをDirect View可能な形式に整形
   * 優先順位: ① images/faces_webp/氏名.webp（軽量WebP）
   *          ② images/faces/氏名.jpg/jpeg/png（元ファイル）
   *          ③ Google Drive Thumbnail API
   *          ④ デフォルトアバター
   */
  resolveImageUrl(member) {
    if (member.kanji) {
      const name = member.kanji.replace(/\s+/g, ''); // スペース除去
      return {
        localCandidates: [
          // ① WebP優先（超軽量）
          `images/faces_webp/${name}.webp`,
          // ② 元ファイルの拡張子候補
          `images/faces/${name}.jpg`,
          `images/faces/${name}.jpeg`,
          `images/faces/${name}.png`,
          `images/faces/${name}.JPG`,
          `images/faces/${name}.JPEG`,
          `images/faces/${name}.PNG`
        ],
        driveUrl: this._resolveDriveUrl(member),
        fallback: 'images/default_avatar.svg'
      };
    }
    return {
      localCandidates: [],
      driveUrl: this._resolveDriveUrl(member),
      fallback: 'images/default_avatar.svg'
    };
  }

  _resolveDriveUrl(member) {
    if (member.drive_urls && member.drive_urls.length > 0) {
      const randomDriveId = member.drive_urls[Math.floor(Math.random() * member.drive_urls.length)];
      return `https://drive.google.com/thumbnail?id=${randomDriveId}&sz=w600`;
    }
    if (member.drive_id) {
      return `https://drive.google.com/thumbnail?id=${member.drive_id}&sz=w600`;
    }
    if (member.photo_url && member.photo_url.includes('id=')) {
      const m = member.photo_url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (m) {
        return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w600`;
      }
    }
    return null;
  }
}

window.apiService = new ApiService();
