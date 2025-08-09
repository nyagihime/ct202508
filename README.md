# repo-search

Simple GitHub repository search tool.

## setup

Create `.env` or copy `.env.example` and rename it.

```shell
touch .env
# or
cp .env.example .env
```

[Create personal access token](https://github.com/settings/tokens/new?scopes=repo) and set as value of `VITE_GITHUB_TOKEN`.

> [!important]
> Access token needs `repo` scope.

## build

```shell
pnpm run build
```

## development

```shell
pnpm run dev
```
