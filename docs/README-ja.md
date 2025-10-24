# WebHaru Utils v1 取扱説明書

WebHaru Utils (WU) は、Webflow の Custom Attributes だけで以下 12 機能を提供する軽量 JavaScript ライブラリです：

- ページネーション、ページネーション操作（`paginate` / `pg-controls`）
- フィルター（AND 条件）
- ソート（日付 / タイトル）
- もっと読む（Load More）
- 目次（TOC）
- 外部リンク警告（`target=_blank` と `rel="noopener"` の自動付与）
- フォーム多重送信ガード
- UTM パラメータの取り込み
- ビデオ自動再生（Intersection Observer 使用）
- スクロールスパイ
- テキストトリム（続きを読む）

## 1. どこに貼ればいい？
Webflow で利用する場合は、以下いずれかの場所に Snippet Builder が出力したコードを貼り付けてください。

| 適用範囲 | 貼り付け先 | 備考 |
| --- | --- | --- |
| サイト全体 | Project Settings > Custom Code > **Footer Code** | Inline タブの「ここから / ここまで」のブロックをそのまま貼る |
| ページ個別 | 各ページ設定の Footer Code | Inline 版 または External 版（`<script src="/assets/webharu-utils.v1.js" defer>`）を選択 |

### ASCII 図（ページネーション例）
```
Collection List Wrapper
└─ .w-dyn-items id="news-list" data-wu="paginate" data-wu-per="9"
    └─ .w-dyn-item ...

Pagination Controls Wrapper
└─ <div data-wu="pg-controls" data-wu-for="news-list"></div>
```

上記のように `data-wu="paginate"` を付与したリストと、`data-wu-for="<リストID>"` が一致するコントロールを用意するとページネーションが動作します。

## 2. Snippet Builder の流れ（選択は 1 機能ずつ）
1. 左カラムのカードから **1 つだけ** 機能を選択します。別の機能を選ぶと自動的に切り替わります。
2. 中央カラムで必要な値を入力します。必須項目や形式が違う場合は赤いエラーメッセージで案内され、`コピー / ZIP` ボタンも無効になります。
3. 右カラムのタブ（Inline / External / Attrs / LLMs）を切り替え、`コピー` または `ZIP` を押して出力を取得します。

- Inline: `<style> + <script>` をそのまま貼り付けできるブロック。
- External: ブランドカラーのみ `<style>` に出力し、JS 本体は `/assets/webharu-utils.v1.js` を参照。
- Attrs: 使うべき `data-wu-*` 属性一覧とコピー用ボタン（Name / Value 別）。
- LLMs: 生成 AI 用の断片テキスト。
- ZIP: 下記構成のアーカイブをダウンロード（標準の Blob API を使用、追加ライブラリ不要）。

```
/your-snippet/
  webharu-utils.v1.js    # 最新の本体ファイル
  README-ja.md           # このドキュメントを抜粋
  attributes.html        # Attrs タブの表 + コード
  snippet-footer.html    # Inline タブの出力
  llms.txt               # 選択機能ぶんの断片
```

## 3. よくあるハマりどころ
| 症状 | 確認ポイント |
| --- | --- |
| 何も動かない | コードを Footer に貼り忘れている、Publish していない、ブラウザキャッシュが残っている |
| ページネーションが動かない | Collection List の `id` と `data-wu-for` の値が一致しているか |
| Ajax / タブ切り替え後に再適用されない | DOM 更新後に `WU.init()` をもう一度呼ぶ |
| 外部リンクが新規タブで開かない | 対象要素に `data-wu="ext-links"` が付いているか |
| Load More が一度で終わる | `data-wu-initial` / `data-wu-step` とアイテム数の関係を確認 |

## 4. 動的コンテンツへの対応
- Webflow の Ajax（例えば Collection のページネーションやタブ）で DOM が再描画された場合は、完了後に `WU.init()` を一度呼び出してください。既に `data-wu-bound=
