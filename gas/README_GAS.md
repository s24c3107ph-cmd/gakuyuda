# 学友打（がくゆうだ！）連携セットアップガイド

Googleスプレッドシート、Google Apps Script (GAS)、GitHub、Vercel を連携させて運用する手順書です。

---

## 1. Google スプレッドシート & GAS のセットアップ

### ステップ 1: スプレッドシートの作成
1. [Google スプレッドシート](https://sheets.new) を新規作成し、タイトルを「**学友打マスター**」などに変更します。
2. 今回添付いただいた名簿CSVの内容をシートにインポート、またはシート名を `Members` に変更して貼り付けます。
   - 必要なカラム（1行目）: `name_kanji`, `name_kana`, `romaji`, `grade`, `department`, `student_id`, `drive_urls`

### ステップ 2: GASスクリプトの配置
1. スプレッドシート上部メニューの **[拡張機能] > [Apps Script]** をクリックします。
2. 既存のコードを消去し、[`gas/Code.gs`](./Code.gs) の内容をすべて貼り付けます。
3. プロジェクト名を「**学友打API**」等にして保存（⌘+S）します。

### ステップ 3: Web アプリとしてデプロイ
1. 右上の青い **[デプロイ] > [新しいデプロイ]** をクリックします。
2. 種類の選択で **「ウェブアプリ」** を選択します。
3. 以下の設定を行います：
   - **説明**: `v1.0`
   - **次のユーザーとして実行**: `自分 (あなたのGoogleアカウント)`
   - **アクセスできるユーザー**: `全員 (Anyone)` ※ログイン不要で遊べるようにするため必須です
4. **[デプロイ]** をクリックし、表示された **「ウェブアプリのURL」**（`https://script.google.com/macros/s/.../exec`）をコピーします。

### ステップ 4: Google Drive写真の自動連携
1. スプレッドシートをリロードすると、メニューバーに **「⚡ 学友打 管理メニュー」** が表示されます。
2. **「🖼️ Google Drive画像URLを自動同期」** をクリックし、写真が格納されているGoogle DriveフォルダのIDを入力すると、メンバー名と画像が自動紐付けされます。

---

## 2. GitHub & Vercel のデプロイ

### ステップ 1: GitHub リポジトリへプッシュ
```bash
git init
git add .
git commit -m "Initial commit of Gakuyuda"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/gakuyuda.git
git push -u origin main
```

### ステップ 2: Vercel にインポート
1. [Vercel](https://vercel.com) にログインし、**[Add New...] > [Project]** を選択します。
2. GitHubの `gakuyuda` リポジトリを選択して **[Deploy]** をクリックします。
3. 数秒で本番URL（`https://gakuyuda.vercel.app`）が発行されます。

---

## 3. WebアプリとGASの接続

1. デプロイしたWebアプリ（またはローカルで開いた `index.html`）にアクセスします。
2. 画面右上の **「⚙️ 設定」** ボタンをクリックします。
3. 先ほどコピーした **GASのウェブアプリURL** を貼り付けて **「保存して同期」** をクリックします。
4. これで、スプレッドシート上のメンバーデータおよびハイスコアランキングがリアルタイムに連携されます！
