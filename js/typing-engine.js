/**
 * 学友打（がくゆうだ！）タイピングエンジン
 * 日本語のかな表現から複数のローマ字入力パターンを動的に受け付ける状態遷移パーサー
 */

class TypingEngine {
  constructor() {
    // 1文字または2文字のかなに対する標準ローマ字マッピングテーブル
    this.kanaTable = {
      // 50音
      'あ': ['a'], 'い': ['i', 'yi'], 'う': ['u', 'wu', 'whu'], 'え': ['e'], 'お': ['o'],
      'か': ['ka', 'ca'], 'き': ['ki'], 'く': ['ku', 'cu', 'qu'], 'け': ['ke'], 'こ': ['ko', 'co'],
      'さ': ['sa'], 'し': ['si', 'shi', 'ci'], 'す': ['su'], 'せ': ['se', 'ce'], 'そ': ['so'],
      'た': ['ta'], 'ち': ['ti', 'chi'], 'つ': ['tu', 'tsu'], 'て': ['te'], 'と': ['to'],
      'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
      'は': ['ha'], 'ひ': ['hi'], 'ふ': ['hu', 'fu'], 'へ': ['he'], 'ほ': ['ho'],
      'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
      'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
      'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
      'わ': ['wa'], 'を': ['wo'], 'ん': ['nn', 'xn'],
      
      // 濁音・半濁音
      'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
      'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
      'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
      'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
      'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],

      // 拗音
      'きゃ': ['kya', 'kilya', 'kixya'], 'きゅ': ['kyu', 'kilyu', 'kixyu'], 'きょ': ['kyo', 'kilyo', 'kixyo'],
      'しゃ': ['sya', 'sha', 'silya', 'sixya'], 'しゅ': ['syu', 'shu', 'silyu', 'sixyu'], 'しょ': ['syo', 'sho', 'silyo', 'sixyo'], 'しぇ': ['sye', 'she', 'sile', 'sixe'],
      'ちゃ': ['tya', 'cha', 'cya', 'tilya', 'tixya'], 'ちゅ': ['tyu', 'chu', 'cyu', 'tilyu', 'tixyu'], 'ちょ': ['tyo', 'cho', 'cyo', 'tilyo', 'tixyo'], 'ちぇ': ['tye', 'che', 'cye', 'tile', 'tixe'],
      'にゃ': ['nya', 'nilya', 'nixya'], 'にゅ': ['nyu', 'nilyu', 'nixyu'], 'にょ': ['nyo', 'nilyo', 'nixyo'],
      'ひゃ': ['hya', 'hilya', 'hixya'], 'ひゅ': ['hyu', 'hilyu', 'hixyu'], 'ひょ': ['hyo', 'hilyo', 'hixyo'],
      'みゃ': ['mya', 'milya', 'mixya'], 'みゅ': ['myu', 'milyu', 'mixyu'], 'みょ': ['myo', 'milyo', 'mixyo'],
      'りゃ': ['rya', 'rilya', 'rixya'], 'りゅ': ['ryu', 'rilyu', 'rixyu'], 'りょ': ['ryo', 'rilyo', 'rixyo'],
      'ぎゃ': ['gya', 'gilya', 'gixya'], 'ぎゅ': ['gyu', 'gilyu', 'gixyu'], 'ぎょ': ['gyo', 'gilyo', 'gixyo'],
      'じゃ': ['zya', 'ja', 'jya', 'zilya', 'zixya'], 'じゅ': ['zyu', 'ju', 'jyu', 'zilyu', 'zixyu'], 'じょ': ['zyo', 'jo', 'jyo', 'zilyo', 'zixyo'], 'じぇ': ['zye', 'je', 'jye', 'zile', 'zixe'],
      'びゃ': ['bya', 'bilya', 'bixya'], 'びゅ': ['byu', 'bilyu', 'bixyu'], 'びょ': ['byo', 'bilyo', 'bixyo'],
      'ぴゃ': ['pya', 'pilya', 'pixya'], 'ぴゅ': ['pyu', 'pilyu', 'pixyu'], 'ぴょ': ['pyo', 'pilyo', 'pixyo'],

      // その他特殊音
      'ふぁ': ['fa', 'huxa', 'hula'], 'ふぃ': ['fi', 'huxi', 'huli'], 'ふぇ': ['fe', 'huxe', 'hule'], 'ふぉ': ['fo', 'huxo', 'hulo'],
      'うぃ': ['wi', 'uxi', 'uli'], 'うぇ': ['we', 'uxe', 'ule'], 'うぉ': ['who', 'uxo', 'ulo'],
      'てぃ': ['thi', 'texi', 'teli'], 'でぃ': ['dhi', 'dexi', 'deli'],
      'とぅ': ['twu', 'toxu', 'tolu'], 'どぅ': ['dwu', 'doxu', 'dolu'],
      'ヴぁ': ['va'], 'ヴぃ': ['vi'], 'ヴ': ['vu'], 'ヴぇ': ['ve'], 'ヴぉ': ['vo'],
      
      // 小文字単体
      'ぁ': ['la', 'xa'], 'ぃ': ['li', 'xi'], 'ぅ': ['lu', 'xu'], 'ぇ': ['le', 'xe'], 'ぉ': ['lo', 'xo'],
      'ゃ': ['lya', 'xya'], 'ゅ': ['lyu', 'xyu'], 'ょ': ['lyo', 'xyo'],
      'ゎ': ['lwa', 'xwa'], 'ヵ': ['lka', 'xka'], 'ヶ': ['lke', 'xke'],
      
      // 促音単体
      'っ': ['ltu', 'xtu', 'ltsu', 'xtsu'],
      
      // 記号・スペース
      'ー': ['-'], ' ': [' '], '　': [' ']
    };

    this.currentKana = '';
    this.candidateTrackers = [];
    this.activeTracker = null;
    this.typedString = '';
    this.isComplete = false;
  }

  /**
   * かな文字列またはメンバーオブジェクトからターゲット候補群を構築
   */
  setTargetKana(kana, member = null) {
    this.currentKana = (kana || '').trim();
    this.typedString = '';
    this.isComplete = false;

    // 候補リストを作成
    const candidates = new Set();
    const cleanFull = this.currentKana.replace(/[\s　]+/g, '');
    if (cleanFull) candidates.add(cleanFull);
    if (this.currentKana) candidates.add(this.currentKana);

    // スペース区切りがある場合、名字と名前を個別候補に追加
    const parts = this.currentKana.split(/[\s　]+/).filter(Boolean);
    if (parts.length >= 2) {
      candidates.add(parts[0]); // 苗字 (例: さかい)
      candidates.add(parts[1]); // 名前 (例: りょうた)
      candidates.add(parts[1] + parts[0]); // 名姓 (例: りょうたさかい)
    }

    if (member) {
      if (member.last_name_kana) candidates.add(member.last_name_kana.trim());
      if (member.first_name_kana) candidates.add(member.first_name_kana.trim());
    }

    // 各候補に対するノードリストを作成
    this.candidateTrackers = Array.from(candidates).map(cand => ({
      kana: cand,
      nodes: this._buildNodes(cand),
      nodeIndex: 0,
      isComplete: false
    })).filter(t => t.nodes.length > 0);

    // デフォルトのアクティブトラッカー
    this.activeTracker = this.candidateTrackers[0] || null;
  }

  /**
   * かな文字列からタイピング判定ノード列を生成
   */
  _buildNodes(kana) {
    const nodes = [];
    let i = 0;

    while (i < kana.length) {
      // 2文字拗音チェック (例: しゃ, きゅ, ふぁ)
      if (i + 1 < kana.length) {
        const two = kana.substr(i, 2);
        if (this.kanaTable[two]) {
          nodes.push({
            kana: two,
            patterns: [...this.kanaTable[two]],
            matchedInput: ''
          });
          i += 2;
          continue;
        }
      }

      const one = kana[i];

      // スペース
      if (one === ' ' || one === '　') {
        nodes.push({
          kana: ' ',
          patterns: [' '],
          matchedInput: '',
          isSpace: true
        });
        i++;
        continue;
      }

      // 促音「っ」の処理
      if (one === 'っ') {
        const nextKana1 = kana.substr(i + 1, 1);
        const nextKana2 = kana.substr(i + 1, 2);
        const nextPatterns = this.kanaTable[nextKana2] || this.kanaTable[nextKana1] || [];
        
        const doubleConsonants = [];
        nextPatterns.forEach(pat => {
          const firstChar = pat[0].toLowerCase();
          if (!['a', 'i', 'u', 'e', 'o', 'n', ' '].includes(firstChar)) {
            if (!doubleConsonants.includes(firstChar)) {
              doubleConsonants.push(firstChar);
            }
          }
        });

        const sokuonPatterns = [...(this.kanaTable['っ'] || ['xtsu', 'ltsu']), ...doubleConsonants];
        nodes.push({
          kana: 'っ',
          patterns: sokuonPatterns,
          matchedInput: '',
          isSokuon: true
        });
        i++;
        continue;
      }

      // 撥音「ん」の処理
      if (one === 'ん') {
        const nextKana = kana.substr(i + 1, 1);
        let allowSingleN = false;
        if (i + 1 === kana.length) {
          allowSingleN = false;
        } else {
          const nextPats = this.kanaTable[kana.substr(i + 1, 2)] || this.kanaTable[nextKana] || [];
          const hasVowelOrYorN = nextPats.some(p => {
            const fc = p[0].toLowerCase();
            return ['a', 'i', 'u', 'e', 'o', 'y', 'n'].includes(fc);
          });
          if (!hasVowelOrYorN) {
            allowSingleN = true;
          }
        }

        const nPatterns = [...(this.kanaTable['ん'] || ['nn', 'xn'])];
        if (allowSingleN) {
          nPatterns.push('n');
        }

        nodes.push({
          kana: 'ん',
          patterns: nPatterns,
          matchedInput: '',
          isHatsuon: true
        });
        i++;
        continue;
      }

      // 通常1文字
      const pats = this.kanaTable[one] || [one.toLowerCase()];
      nodes.push({
        kana: one,
        patterns: [...pats],
        matchedInput: ''
      });
      i++;
    }

    return nodes;
  }

  /**
   * キー入力の判定（複数候補の中からマッチするものを探索して進める）
   */
  inputKey(key) {
    if (this.isComplete || this.candidateTrackers.length === 0) {
      return false;
    }

    const lowerKey = key.toLowerCase();
    const survivingTrackers = [];

    for (const tracker of this.candidateTrackers) {
      if (tracker.isComplete) continue;

      // 現在位置がスペースノードで、入力がスペースでない場合は自動スキップして次ノードへ進める
      if (tracker.nodeIndex < tracker.nodes.length && tracker.nodes[tracker.nodeIndex].isSpace && lowerKey !== ' ') {
        tracker.nodes[tracker.nodeIndex].matchedInput = ' ';
        tracker.nodeIndex++;
      }

      if (tracker.nodeIndex >= tracker.nodes.length) {
        tracker.isComplete = true;
        continue;
      }

      const node = tracker.nodes[tracker.nodeIndex];

      // スペースキー打鍵の場合
      if (lowerKey === ' ' && node.isSpace) {
        node.matchedInput = ' ';
        tracker.nodeIndex++;
        if (tracker.nodeIndex >= tracker.nodes.length) {
          tracker.isComplete = true;
        }
        survivingTrackers.push(tracker);
        continue;
      }

      const candidateInput = node.matchedInput + lowerKey;
      const matchedPatterns = node.patterns.filter(pat => pat.toLowerCase().startsWith(candidateInput));

      if (matchedPatterns.length > 0) {
        node.matchedInput = candidateInput;
        node.patterns = matchedPatterns;

        const exactMatch = matchedPatterns.find(pat => pat.toLowerCase() === candidateInput);
        if (exactMatch) {
          tracker.nodeIndex++;
          // 次のノードがスペースなら、スペースを打たなくても良いように準備
          if (tracker.nodeIndex >= tracker.nodes.length) {
            tracker.isComplete = true;
          }
        }
        survivingTrackers.push(tracker);
      }
    }

    if (survivingTrackers.length > 0) {
      this.candidateTrackers = survivingTrackers;
      this.activeTracker = survivingTrackers[0];
      this.typedString += lowerKey;

      // いずれかの候補が完了したかチェック
      if (survivingTrackers.some(t => t.isComplete)) {
        this.isComplete = true;
      }
      return true;
    }

    return false;
  }

  /**
   * 現在の表示用ローマ字ガイド文字列と状態を取得
   */
  getDisplayState() {
    if (!this.activeTracker) {
      return { typedPart: '', remainingPart: '', fullRomaji: '', isComplete: this.isComplete, progress: 0 };
    }

    const tracker = this.activeTracker;
    let typedPart = '';
    let remainingPart = '';

    for (let i = 0; i < tracker.nodes.length; i++) {
      const node = tracker.nodes[i];
      const preferredPattern = node.patterns[0] || '';

      if (i < tracker.nodeIndex) {
        typedPart += node.matchedInput || preferredPattern;
      } else if (i === tracker.nodeIndex) {
        typedPart += node.matchedInput;
        remainingPart += preferredPattern.substring(node.matchedInput.length);
      } else {
        remainingPart += preferredPattern;
      }
    }

    return {
      typedPart: typedPart,
      remainingPart: remainingPart,
      fullRomaji: typedPart + remainingPart,
      isComplete: this.isComplete,
      progress: (tracker.nodeIndex / (tracker.nodes.length || 1))
    };
  }
}

window.TypingEngine = TypingEngine;
