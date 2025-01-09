import './style.scss'

interface IProps {
  type?: string,
  size: number
}

export function CircleProgress({ type, size }: IProps) {
  const _size = size ?? 32

  return (
    <div className={'common-circle-progress' + (type ? ` ${type}` : '')} style={{
      width: `${_size}px`,
      height: `${_size}px`
    }}>
      <div className="loader"></div>
    </div>
  )
}