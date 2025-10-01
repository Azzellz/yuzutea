import { useTyped } from '@/hooks/typed'

export default function Animation() {
  const { el } = useTyped({
    messages: [
      '1.FULLMETAL ALCHEMIST: ^500 ♥♥♥♥♥\n2.Made in abyss: ^500 ♥♥♥♥♥\n3.Overload: ^500 ♥♥♥♥♥\n4.Ajin: ^500 ♥♥♥♥♥',
    ],
  })
  return (
    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
      <span ref={el}></span>
    </div>
  )
}
