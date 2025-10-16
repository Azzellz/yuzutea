import { useTyped } from '@/hooks/typed'

export default function AboutPanel() {
  const { el } = useTyped({
    messages: [
      'Yuzutea^1000\nA FE-Programmer, love ACGN culture.^1000\nずっとプログラミングでいいのに。',
    ],
  })
  return (
    <div className="panel">
      <h2>ABOUT ME.</h2>
      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
        <span ref={el}></span>
      </div>
    </div>
  )
}
