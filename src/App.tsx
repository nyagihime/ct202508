import './App.css'

import { useEffect, useRef, useState } from 'react'
import { Octokit } from 'octokit'

import PaginateNav from './components/PatinateNav'
import SearchInput from './components/SearchInput.tsx'
import SearchResult from './components/SearchResult'

import type { Endpoints, OctokitResponse } from '@octokit/types'

/*
 * 作戦：
 *   searchform でキーワードを入力させる
 *   github の rest api で使えるキーワード毎にグループ化したい
 *   （本家 GitHub の検索とか、あとブログとかで見るタグ検索みたいなイメージ）
 *   フォームは値が変わるたびに親（ここ）に検索キーワードを通知する
 *      → Lexical というライブラリがある
 *   フォームは submit されたらそのことを親に通知する
 *
 *   親が GitHub の API を呼ぶ（実装は lib にいれる。中で更に octokit 呼ぶ）
 *   結果を検索結果コンポーネントに渡す
 *   検索結果コンポーネントは、結果を表示する
 *
 *   ページネーションコンポーネントでページ送りする
 *   1ページあたりの表示数を選択できるようにする（10 20 50 100 くらい？）
 * */

type SearchReposData = Endpoints['GET /search/repositories']['response']['data']
type ResultState = OctokitResponse<SearchReposData>
type SortKey = 'stars' | 'forks' | 'updated'

function App() {
  const [sortKey, setSortKey] = useState<SortKey>('stars')
  const [perPage, setPerPage] = useState<number>(10)
  const [paged, setPaged] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [result, setResult] = useState<ResultState | null>(null)
  const octokitRef = useRef<Octokit | null>(null)

  const perPageOptions = [10, 20, 50, 100]
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
  }

  function handlePagination(newPaged: number) {
    setPaged(newPaged)
    handleSearch().then()
  }

  return (
    <main>
      <div>
        <SearchInput
          onChange={(value: string) => setQuery(value)}
          value={query}
        />
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

        <p>query: {query}</p>
      </div>
      <div>
        <h2>Search Results</h2>
        {result && (
          <>
            <SearchResult result={result} />
            <PaginateNav
              onPageChange={handlePagination}
              paged={paged}
              totalPages={
                result ? Math.floor(result.data.total_count / perPage) : 0
              }
            />
          </>
        )}
      </div>
    </main>
  )
}

export default App
