import { animationAtom } from '@/atoms/animation'
import { Avatar } from 'antd'
import { useAtomValue } from 'jotai'

export default function AnimationPanel() {
  const animations = useAtomValue(animationAtom)

  return (
    <div className="panel">
      <h2>ANIMATION</h2>
      {animations.map((item) => (
        <div
          key={item.id}
          style={{ display: 'flex', gap: '12px', alignItems: 'center' }}
        >
          <Avatar
            src={item.images.common}
            alt={item.name}
            shape="square"
            size={36}
          />
          <span style={{ color: 'orange' }}>{item.name}</span>
          <span> - </span>
          <span style={{ color: '#d294f7', fontSize: '18px' }}>
            {item.score}
          </span>
        </div>
      ))}
    </div>
  )
}
