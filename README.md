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

### optional

If you want to change the number of search results displayed,
please change the `VITE_SHOW_RESULTS_PER_PAGE` value.
(default: 15)

## build

```shell
pnpm run build
```

## development

```shell
pnpm run dev
```
