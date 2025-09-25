import { TraceTransformHookProps, useTraceTransform } from '@/hooks/transform'
import { TypedHookProps, useTyped } from '@/hooks/typed'

interface DialogBoxProps extends TraceTransformHookProps, TypedHookProps {}
export default function DialogBox(props: DialogBoxProps) {
  const { el } = useTyped(props)
  const { transformStyle } = useTraceTransform(props)

  return (
    <div
      className="dialog-box"
      style={{
        transform: transformStyle,
      }}
    >
      <span ref={el} />
    </div>
  )
}
