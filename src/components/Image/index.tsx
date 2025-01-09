import { useEffect, useMemo, useState } from 'react'

export function Image({ src, alt, sx, type, loading, onError }: { src: any, alt?: string, sx?: any, type?: string, loading?: 'eager' | 'lazy' | undefined, onError?: Function }) {
  const [path, setPath] = useState<string>('')

  useEffect(() => {
    setPath(src)
  }, [src])

  const styleProps = useMemo(() => {
    const result: { [p: string]: string | number } = {}

    if (type === 'vector') {
      result.marginTop = '-2px'
      result.verticialAlign = 'middle'
    }

    return {
      ...result,
      ...(sx ?? {})
    }
  }, [sx, type])

  return path && (
    <img src={path} alt={alt ?? ''} style={styleProps} loading={loading} onError={onError} />
  )
}