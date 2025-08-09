type Props = {
  paged: number
  onPageChange: (newPaged: number) => void
  totalPages: number
}

export default function PatinateNav({
  paged,
  onPageChange,
  totalPages,
}: Props) {
  function paginate(direction: 'next' | 'prev') {
    return () => {
      if (direction === 'next') {
        if (paged < totalPages) {
          onPageChange(paged + 1)
        }
      } else if (direction === 'prev') {
        if (paged > 1) {
          onPageChange(paged - 1)
        }
      }
    }
  }
  return (
    <div>
      <button disabled={paged <= 1} onClick={paginate('prev')}>
        prev
      </button>
      <span>
        Page {paged} / {totalPages}
      </span>
      <button disabled={paged === totalPages} onClick={paginate('next')}>
        next
      </button>
    </div>
  )
}
