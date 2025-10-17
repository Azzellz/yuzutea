import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export default function AtomsphereContainer({
  children,
}: {
  children: ReactNode
}) {
  const pcStyle: React.CSSProperties = {
    margin: '50px',
    width: '750px',
    height: '500px',
  }
  return createPortal(
    <div
      style={{
        position: 'absolute',
        zIndex: 1000,
        pointerEvents: 'none',
        overflow: 'visible',
        ...pcStyle,
      }}
    >
      {children}
    </div>,
    document.getElementById('root')!
  )
}
