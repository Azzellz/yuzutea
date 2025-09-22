import { useRef, useEffect } from 'react'
import Typed from 'typed.js'

export interface TypedHookProps {
  messages: string[]
  typeSpeed?: number
  backSpeed?: number
  backDelay?: number
  startDelay?: number
  loop?: boolean
  showCursor?: boolean
  cursorChar?: string
}

export function useTyped<T extends HTMLElement = HTMLDivElement>({
  messages,
  typeSpeed = 50,
  backSpeed = 30,
  backDelay = 1500,
  startDelay = 500,
  loop = false,
  showCursor = true,
  cursorChar = '▋',
}: TypedHookProps) {
  const el = useRef<T>(null)
  const typed = useRef<Typed | null>(null)

  useEffect(() => {
    if (el.current) {
      typed.current = new Typed(el.current, {
        strings: messages,
        typeSpeed,
        backSpeed,
        backDelay,
        startDelay,
        loop,
        showCursor,
        cursorChar,
        smartBackspace: true,
        fadeOut: true,
        fadeOutClass: 'typed-fade-out',
        fadeOutDelay: 500,
      })
    }

    return () => {
      if (typed.current) {
        typed.current.destroy()
      }
    }
  }, [
    messages,
    typeSpeed,
    backSpeed,
    backDelay,
    startDelay,
    loop,
    showCursor,
    cursorChar,
  ])

  return { el }
}
