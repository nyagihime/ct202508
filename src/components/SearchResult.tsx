import type { Endpoints, OctokitResponse } from '@octokit/types'

type SearchReposData = Endpoints['GET /search/repositories']['response']['data']
type Props = {
  result: OctokitResponse<SearchReposData>
}

export default function SearchResult({ result }: Props) {
  return (
    <div>
      {result.data.items.map((item) => (
        <div key={item.id}>
          <h3>{item.name}</h3>
          <p>{item.full_name}</p>
          <p>
            star: {item.stargazers_count} / watch: {item.watchers_count} /
            forks: {item.forks_count}
          </p>
        </div>
      ))}
      <p>Total Results: {result.data.total_count}</p>
    </div>
  )
}
