import { Dispatch, SetStateAction, useEffect, useRef } from 'react'

interface UseWebWorkerTimerProps {
  remainingTimeInSeconds: number
  setRemainingTimeInSeconds: Dispatch<SetStateAction<number>>
  onTimerEnd?: () => void
  onTenSecondsLeft?: () => void
}

export function useWebWorkerTimer({
  remainingTimeInSeconds,
  setRemainingTimeInSeconds,
  onTimerEnd,
  onTenSecondsLeft,
}: UseWebWorkerTimerProps): void {
  const workerRef = useRef<Worker | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (
      (!remainingTimeInSeconds || remainingTimeInSeconds <= 0) &&
      (!!intervalRef.current || !!workerRef.current)
    ) {
      return () => null
    }

    if (window.Worker) {
      // Web Worker Code
      const workerCode = `
        self.onmessage = function(e) {
          let time = e.data.remainingTime;
          const interval = setInterval(() => {
            time -= 1;
            self.postMessage(time);
            if (time <= 0) clearInterval(interval);
          }, 1000);
        };
      `

      const blob = new Blob([workerCode], { type: 'application/javascript' })
      workerRef.current = new Worker(URL.createObjectURL(blob))

      workerRef.current.postMessage({ remainingTime: remainingTimeInSeconds })

      workerRef.current.onmessage = (e: MessageEvent<number>) => {
        const newTime = e.data
        setRemainingTimeInSeconds(newTime)

        if (newTime === 10 && onTenSecondsLeft) {
          onTenSecondsLeft()
        }

        if (newTime === 0 && onTimerEnd) {
          onTimerEnd()
        }
      }

      return () => {
        workerRef.current?.terminate()
        workerRef.current = null
      }
    }
    // Fallback to setInterval
    intervalRef.current = setInterval(() => {
      setRemainingTimeInSeconds((prevTime) => {
        const newTime = prevTime - 1

        if (newTime === 10 && onTenSecondsLeft) {
          onTenSecondsLeft()
        }

        if (newTime <= 0) {
          clearInterval(intervalRef.current!)
          intervalRef.current = null
          if (onTimerEnd) onTimerEnd()

          return 0
        }

        return newTime
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!remainingTimeInSeconds])
}
