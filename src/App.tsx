import { useEffect, useRef, useState } from 'react'
import { Octokit } from 'octokit'

import styles from './App.module.scss'
import PaginateNav from './components/PatinateNav'
import SearchInput from './components/SearchInput.tsx'
import SearchResult from './components/SearchResult'

import type { Endpoints, OctokitResponse } from '@octokit/types'

type SearchReposData = Endpoints['GET /search/repositories']['response']['data']
type ResultState = OctokitResponse<SearchReposData>
type SortKey = 'stars' | 'forks' | 'updated'

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sortKey, setSortKey] = useState<SortKey>('stars')
  const [paged, setPaged] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [result, setResult] = useState<ResultState | null>(null)
  const octokitRef = useRef<Octokit | null>(null)

  const perPage = parseInt(import.meta.env.VITE_SHOW_RESULTS_PER_PAGE) || 10

  const sortKeyOptions: SortKey[] = ['stars', 'forks', 'updated']

  useEffect(() => {
    octokitRef.current = new Octokit({
      auth: import.meta.env.VITE_GITHUB_TOKEN,
    })
  }, [])

  async function handleSearch() {
    if (!octokitRef.current) {
      throw new Error('Octokit is not initialized')
    }
    if (!query) {
      setResult(null)
      return
    }
    setIsLoading(true)
    console.log('strat request')
    const response: OctokitResponse<SearchReposData> =
      await octokitRef.current.request('GET /search/repositories', {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        q: query,
        per_page: perPage,
        page: paged,
        sort: sortKey,
        order: 'desc',
      })
    setResult(response)
    setIsLoading(false)
  }

  // 検索ボタンが押されたときの処理
  //   paged が 1 のときは普通に検索を呼ぶ
  //   paged が 1 以外のときは paged を 1 に変更
  //   （paged の変化を検知して自動で検索が実行されるので自分では呼ばないでOK）
  function handleSearchSubmit() {
    if (paged !== 1) {
      setPaged(1)
    } else {
      handleSearch().then()
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: paged の値が変わったときだけ再実行させたいので paged のみを依存関係に指定したい
  useEffect(() => {
    if (query) {
      handleSearch().then()
    }
  }, [paged])

  return (
    <main className={styles['app-main']}>
      <div className={styles['search-form']}>
        <SearchInput
          onChange={(value: string) => setQuery(value)}
          style={{ flex: 2 }}
          value={query}
        />
        sort:
        <select
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          value={sortKey}
        >
          {sortKeyOptions.map((key) => (
            <option key={`optSortKey-${key}`} value={key}>
              {key}
            </option>
          ))}
        </select>
        <button
          disabled={(!query && result === null) || isLoading}
          onClick={() => handleSearchSubmit()}
          type="submit"
        >
          Search
        </button>
      </div>

      <SearchResult isLoading={isLoading} result={result} />

      {!isLoading && result && (
        <>
          <PaginateNav
            onPageChange={(newPaged) => setPaged(newPaged)}
            paged={paged}
            totalPages={
              result ? Math.floor(result.data.total_count / perPage) : 0
            }
          />
        </>
      )}
    </main>
  )
}

export default App
