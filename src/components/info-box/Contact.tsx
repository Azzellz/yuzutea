import { useTyped } from '@/hooks/typed'
import { Popover } from 'antd'

export default function ContactPanel() {
  const { el } = useTyped({
    messages: ['Email: flin00806@gmail.com'],
  })
  return (
    <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 10,
        }}
      >
        <Popover
          content={<img src="/images/qrcode/qq.png" alt="qq" width={100} />}
        >
          <img src="/images/icon/qq.png" alt="qq" width={20} />
        </Popover>
        <Popover
          content={
            <img src="/images/qrcode/wechat.jpg" alt="wechat" width={100} />
          }
        >
          <img src="/images/icon/wechat.png" alt="wechat" width={25} />
        </Popover>
      </div>
      <span ref={el}></span>
    </div>
  )
}
