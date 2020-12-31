import * as React from "react"

interface ScreenSzie {
  width: number,
  height: number
}
/**
 * Listener the screen size change
 * use
 * const screenSize:ScreenSzie = useWindowChange()
 */
export const useWindowChange = (): ScreenSzie => {
  const [size, setSize] = React.useState<ScreenSzie>({ width: window.innerWidth, height: window.innerHeight })
  const timeFlag = React.useRef<NodeJS.Timeout | null>(null)
  const handleWindowResize = () => {
    if (timeFlag.current) return
    timeFlag.current = setTimeout(() => {
      setSize((oldSize) => {
        if (oldSize.width !== window.innerWidth || oldSize.height !== window.innerHeight) {
          return { width: window.innerWidth, height: window.innerHeight }
        }
        return oldSize
      })
      timeFlag.current = null
    }, 500);

  }
  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize)
    return () => { window.removeEventListener("resize", handleWindowResize) }
  }, []);
  return size
}
/**
 * compoment is unmount
 * use:
 * const isUnmount = useUnmount()
 */
export const useUnmount = (): React.MutableRefObject<boolean> => {
  const unmount = React.useRef(false)
  React.useEffect(() => () => { unmount.current = true }, [])
  return unmount
}
/**
 * the simple hook for HTMLInputElement / HTMLTextAreaElement
 * @param isOnlyNumber is only input number
 * @param def default value
 * 
 * use:
 * const [value,changeValue,clearValue] = useInputText('')
 * 
 * <input value={value} onChange={changeValue} />
 */
export const useInputText = (def = '', isOnlyNumber: boolean = false): [string, ((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void), () => void] => {
  const [value, setValue] = React.useState<string>(def)
  const changeValue = React.useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (isOnlyNumber && e.target.value !== '' && isNaN(Number(e.target.value))) return
    setValue(e.target.value)
  }, [])
  const clearValue = () => {
    setValue('')
  }
  return [value, changeValue, clearValue]
}