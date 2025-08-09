type Props = {
  onChange: (value: string) => void
  value: string
}

export default function SearchInput({ onChange, value }: Props) {
  return (
    <input
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search..."
      type="search"
      value={value}
    />
  )
}
