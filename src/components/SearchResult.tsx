import { Icon } from '@iconify-icon/react'

import styles from './SearchResult.module.scss'

import type { Endpoints, OctokitResponse } from '@octokit/types'

type SearchReposData = Endpoints['GET /search/repositories']['response']['data']
type Props = {
  result: OctokitResponse<SearchReposData> | null
  isLoading?: boolean
}

export default function SearchResult({ result, isLoading = true }: Props) {
  return (
    <div className={styles['search-result']} style={{ flex: result ? 8 : 0 }}>
      {result && !isLoading && (
        <h2>
          Search Results <small>({result.data.total_count})</small>
        </h2>
      )}

      <div>
        {isLoading &&
          [...Array(10)].map((_, i) => (
            <div className={styles['ph-item']} key={`ph-item-${i}`}>
              <div className={styles['ph-item-name']}>
                <div className={styles['ph-item-name-avatar']} />
                <div className={styles['ph-item-name-name']} />
              </div>
              <div className={styles['ph-item-meta']}>
                <div className={styles['ph-item-full-name']} />
                {[...Array(3)].map((_, j) => (
                  <div
                    className={styles['ph-item-meta-data']}
                    key={`ph-item-meta-data-${j}`}
                    style={{ animationDelay: `${j * 0.25 + 0.75}s` }}
                  />
                ))}
              </div>
            </div>
          ))}
      </div>

      {!isLoading &&
        result &&
        result.data.items.map((item) => (
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
