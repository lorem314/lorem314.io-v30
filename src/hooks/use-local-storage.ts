import * as React from "react"

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  validator?: (raw: string) => boolean,
): [T, (arg0: T) => void] => {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === "undefined") return defaultValue

    try {
      const item = window.localStorage.getItem(key)

      if (item === null || (validator && !validator(item))) {
        window.localStorage.setItem(key, JSON.stringify(defaultValue))
        return defaultValue
      }

      return JSON.parse(item) as T
    } catch (error) {
      console.error(`[useLocalStorage] key=${key} :`, error)
      window.localStorage.setItem(key, JSON.stringify(defaultValue))
      return defaultValue
    }
  })

  const setValue = React.useCallback(
    (value: T | ((arg0: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error("[useLocalStorage] setValue :", error)
      }
    },
    [key],
  )

  React.useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) {
        return
      }

      try {
        if (
          event.newValue === null ||
          (validator && !validator(event.newValue))
        ) {
          window.localStorage.setItem(key, JSON.stringify(defaultValue))
          setStoredValue(defaultValue)
        } else {
          const parsed: unknown = event.newValue
            ? JSON.parse(event.newValue)
            : null
          setStoredValue(parsed as T)
        }
      } catch (error) {
        console.error(`[useLocalStorage] handleStorageChange :`, error)
        window.localStorage.setItem(key, JSON.stringify(defaultValue))
        setStoredValue(defaultValue)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => window.removeEventListener("storage", handleStorageChange)
  }, [key, defaultValue, validator])

  return [storedValue, setValue]
}
