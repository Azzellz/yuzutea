import { TransformHookProps, useTransform } from '@/hooks/transform'
import { TypedHookProps, useTyped } from '@/hooks/typed'

interface DialogBoxProps extends TransformHookProps, TypedHookProps {}
export default function DialogBox(props: DialogBoxProps) {
  const { el } = useTyped(props)
  const { transformStyle } = useTransform(props)

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
