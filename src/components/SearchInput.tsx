import type { CSSProperties } from 'react'

type Props = {
  onChange: (value: string) => void
  value: string
  style?: CSSProperties
}

export default function SearchInput({ onChange, value, style }: Props) {
  // todo lexical などを使ってキーワードごとに色を付ける
  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      style={{ ...style }}
      type="search"
      value={value}
    />
  )
}
