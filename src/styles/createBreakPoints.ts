export const size = {
  xs: 0,
  sm: 576,
  md: 1024,
  lg: 1200,
}
export const device = {
  xs: `screen and (max-width: ${size.xs}px)`,
  sm: `screen and (max-width: ${size.sm}px)`,
  md: `screen and (max-width: ${size.md}px)`,
  lg: `screen and (max-width: ${size.lg}px)`
}

export default function createBreakpoints(
  breakpoints: { values?: { [key: string]: number }; unit?: string, step?: number } = {},
) {
  const {
    values = size as any,
    unit = 'px',
    step = 5
  } = breakpoints

  const keys = Object.keys(values);

  function up(key: string | number) {
    const value = typeof values[key] === 'number' ? values[key] : key
    return `@media (min-width:${value}${unit})`
  }

  function down(key: string | number) {
    const value = typeof values[key] === 'number' ? values[key] : key as number
    return `@media (max-width:${value - step / 100}${unit})`
  }

  function between(start: string | number, end: any) {
    const endIndex = keys.indexOf(end)

    return (
      `@media (min-width:${
        typeof values[start] === 'number' ? values[start] : start
      }${unit}) and ` +
      `(max-width:${
        (endIndex !== -1 && typeof values[keys[endIndex]] === 'number'
          ? values[keys[endIndex]]
          : end) -
        step / 100
      }${unit})`
    )
  }

  function only(key: any) {
    if (keys.indexOf(key) + 1 < keys.length) {
      return between(key, keys[keys.indexOf(key) + 1])
    }

    return up(key)
  }

  function not(key: any) {
    // handle first and last key separately, for better readability
    const keyIndex = keys.indexOf(key)
    if (keyIndex === 0) {
      return up(keys[1])
    }
    if (keyIndex === keys.length - 1) {
      return down(keys[keyIndex])
    }

    return between(key, keys[keys.indexOf(key) + 1]).replace(
      '@media',
      '@media not all and',
    )
  }
  return {
    keys,
    values,
    up,
    down,
    between,
    only,
    not,
    unit
  }
}