import { Icon } from '@iconify-icon/react'

import styles from './SearchResult.module.scss'

import type { Endpoints, OctokitResponse } from '@octokit/types'

type SearchReposData = Endpoints['GET /search/repositories']['response']['data']
type Props = {
  result: OctokitResponse<SearchReposData>
}

export default function SearchResult({ result }: Props) {
  return (
    <div className={styles['search-result']}>
      <h2>
        Search Results <small>({result.data.total_count})</small>
      </h2>

      {result.data.items.map((item) => (
        <div className={styles['search-result-item']} key={item.id}>
          <h3 className={styles['search-result-item-name']}>
            {item.owner?.avatar_url && (
              <img
                alt={item.owner.login}
                className={styles['search-result-item-avatar']}
                height={32}
                src={item.owner?.avatar_url}
                width={32}
              />
            )}
            <a href={item.html_url} rel="noreferrer" target="_blank">
              {item.name}
            </a>
          </h3>
          <div className={styles['repository-meta']}>
            <span className={styles['search-result-item-full-name']}>
              {item.full_name}
            </span>
            <span>
              <Icon
                className={styles['repository-meta-star']}
                icon="octicon:star-fill-16"
              />
              {item.stargazers_count}
            </span>
            <span>
              <Icon
                className={styles['repository-meta-watch']}
                icon="octicon:eye-16"
              />
              {item.watchers_count}
            </span>
            <span>
              <Icon
                className={styles['repository-meta-fork']}
                icon="octicon:repo-forked-16"
              />
              {item.forks_count}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
