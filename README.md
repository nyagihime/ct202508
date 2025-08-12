# repo-search

Simple GitHub repository search tool.

## setup

`.env` を作成するか `.env.example` をコピーしてリネームして使います

```shell
touch .env
# or
cp .env.example .env
```

[GitHub の Personal access token を作成](https://github.com/settings/tokens/new?scopes=repo)して、取得できたトークンを `VITE_GITHUB_TOKEN` にセットします

> [!important]
> デフォルトでは repo スコープを選択してますが、必要に応じて調整してください

### optional

`VITE_SHOW_RESULTS_PER_PAGE` の値を変更することで、検索結果1ページあたりの表示数を変更することができます（デフォルトは`10`）


## build

```shell
pnpm run build
```

## development

```shell
pnpm run dev
```


## 検索クエリ

`user:`, `repo:`, `org:` といったキーワードも使用できます

[検索構文についてはこちらも参照してください](https://docs.github.com/ja/search-github/getting-started-with-searching-on-github/understanding-the-search-syntax)
