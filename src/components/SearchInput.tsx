import { useEffect, useRef } from 'react'

import styles from './SearchInput.module.scss'

import type { CSSProperties } from 'react'

type Props = {
  onChange: (value: string) => void
  value: string
  style?: CSSProperties
}

const KEYWORDS = ['repo:', 'user:', 'org:']
const HIGHLIGHT_COLOR = '#6893ff'

function highlightKeywords(text: string) {
  const regex = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'gi')

  const highLightStyle = [
    `color: ${HIGHLIGHT_COLOR};`,
    ' font-weight: bold;',
    'margin-right:3px;',
  ]

  return text.replace(
    regex,
    (match) => `<span style="${highLightStyle.join(' ')}">${match}</span>`
  )
}

function restoreSelection(el: HTMLElement, pos: number) {
  const range = document.createRange()
  const sel = window.getSelection()
  let charIndex = 0
  let found = false

  function traverse(node: Node) {
    if (found) return
    if (node.nodeType === 3) {
      const nextIndex = charIndex + (node.textContent?.length || 0)
      if (pos <= nextIndex) {
        range.setStart(node, pos - charIndex)
        range.collapse(true)
        found = true
      }
      charIndex = nextIndex
    } else {
      for (const [_, child] of Array.from(node.childNodes).entries()) {
        traverse(child)
        if (found) break
      }
    }
  }

  traverse(el)
  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

export default function SearchInput({ onChange, value, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // 入力イベントのハンドリング
  function handleInput() {
    const el = ref.current
    if (!el) return
    // 現在のカーソル位置を取得
    const sel = window.getSelection()
    let pos = 0
    if (sel?.anchorNode && el.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0)
      const preRange = range.cloneRange()
      preRange.selectNodeContents(el)
      preRange.setEnd(range.endContainer, range.endOffset)
      pos = preRange.toString().length
    }
    const text = el.textContent || ''
    onChange(text)
    // value更新後にカーソル位置を復元
    setTimeout(() => restoreSelection(el, pos), 0)
  }

  // ハイライトの更新
  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = highlightKeywords(value)
    }
  }, [value])

  return (
    <div className={styles['search-input-container']}>
      <div
        className={styles['search-input']}
        contentEditable
        onInput={handleInput}
        ref={ref}
        style={{ ...style }}
        suppressContentEditableWarning
      />

      {!value && (
        <span className={styles['search-input-placeholder']}>Search...</span>
      )}
    </div>
  )
}
