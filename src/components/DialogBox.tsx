import { layoutAtom } from '@/atoms/layout'
import { useElementRects } from '@/hooks/layout'
import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import { TypedHookProps, useTyped } from '@/hooks/typed'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'

interface DialogBoxProps extends TraceTransformHookProps, TypedHookProps {}
export default function DialogBox(props: DialogBoxProps) {
  const { el } = useTyped(props)
  const setLayout = useSetAtom(layoutAtom)
  const { transformStyle } = useTraceTransform(props)

  const { rects, setEl } = useElementRects()
  useEffect(() => {
    if (rects) {
      setLayout((prev) => ({
        ...prev,
        dialogBoxRect: rects[0],
      }))
    }
  }, [rects, setLayout])

  return (
    <div
      className="dialog-box"
      style={{
        transform: transformStyle,
      }}
      ref={setEl}
    >
      <span ref={el} />
    </div>
  )
}
