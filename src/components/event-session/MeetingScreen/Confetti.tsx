import { useEffect, useState } from 'react'

import Confetti from 'react-confetti'

export function ConfettiEffect() {
  const [crack, setCrack] = useState<number | null>(null)

  useEffect(() => {
    const handlePlayConfetti = () => {
      setCrack(Math.random())
    }

    window.addEventListener('confetti_added', handlePlayConfetti)

    return () => {
      window.removeEventListener('confetti_added', handlePlayConfetti)
    }
  }, [])

  return (
    crack !== null && (
      <>
        <Confetti
          key={crack}
          recycle={false}
          run
          numberOfPieces={200}
          gravity={0.03}
          tweenDuration={4000}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          confettiSource={{ x: 200, y: window.innerHeight } as any}
          initialVelocityY={30}
          onConfettiComplete={() => setCrack(null)}
        />
        <Confetti
          key={`right-${crack}`}
          recycle={false}
          run
          numberOfPieces={200}
          gravity={0.03}
          tweenDuration={4000}
          confettiSource={
            {
              x: window.innerWidth - 300,
              y: window.innerHeight,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
          }
          initialVelocityY={30}
          onConfettiComplete={() => setCrack(null)}
        />
      </>
    )
  )
}
