import './App.css'

import { useEffect, useRef, useState } from 'react'
import { Octokit } from 'octokit'

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
  const [perPage, setPerPage] = useState<number>(10)
  const [paged, setPaged] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [result, setResult] = useState<ResultState | null>(null)
  const octokitRef = useRef<Octokit | null>(null)

  const perPageOptions = [5, 10, 20, 50, 100]
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
    <main>
      <div>
        <SearchInput
          onChange={(value: string) => setQuery(value)}
          value={query}
        />
        {/* todo: いまのままだと、クエリ実行前に perPage の値だけ変わってしまうので paginate 制御が変になる */}
        <select
          onChange={(e) => setPerPage(parseInt(e.target.value))}
          value={perPage}
        >
          {perPageOptions.map((num) => (
            <option key={`optPerPage-${num}`} value={num}>
              {num}
            </option>
          ))}
        </select>
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
      paged: {paged}
      {isLoading && (
        <div className="loading">
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
