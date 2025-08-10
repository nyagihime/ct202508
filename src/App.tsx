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
          value={query}
        />
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
        <button onClick={() => handleSearch()} type="submit">
          Search
        </button>
      </div>
      {isLoading && (
        <div className={styles['result-loading']}>
          <span>Loading...</span>
        </div>
      )}
      {!isLoading && result && (
        <>
          <SearchResult result={result} />
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
