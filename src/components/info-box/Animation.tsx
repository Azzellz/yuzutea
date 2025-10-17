import { animationAtom } from '@/atoms/animation'
import { Avatar } from 'antd'
import { useAtomValue } from 'jotai'

export default function AnimationPanel() {
  const animations = useAtomValue(animationAtom)

  return (
    <div className="panel">
      <h2>ANIMATION</h2>
      <div className="content flex-v">
        {animations.map((item) => (
          <div
            key={item.id}
            className="flex-h-center pointer"
            onClick={() => {
              window.open(`https://bangumi.tv/subject/${item.id}`)
            }}
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
    </div>
  )
}
