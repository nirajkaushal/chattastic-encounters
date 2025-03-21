import { ReactNode, useEffect, useRef } from 'react'

import { motion } from 'framer-motion'
import Confetti from 'react-confetti'

import { theme } from './ThemeModal'
import { RenderIf } from '../common/RenderIf/RenderIf'

import { useDimensions } from '@/hooks/useDimensions'
import { PatternKeys, PatternStyles } from '@/utils/event.util'
import { cn, isColorDark } from '@/utils/utils'

interface IEffects {
  width: number
  height: number
  selectedTheme: theme
}

function Effects({ selectedTheme, width, height }: IEffects) {
  if (selectedTheme.theme === 'Emoji') {
    const emojiId = selectedTheme.colors as string

    return (
      <>
        <motion.div
          animate={{
            x: [0, width, 0],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 10,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={400} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 0, width],
            y: [60],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 10,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 60, width],
            y: [120],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-60, width, -60],
            y: [180],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 120, 0],
            y: [240],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 25,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-120, width, -120],
            y: [300],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 30,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 180, width],
            y: [360],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 35,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-180, width, -180],
            y: [420],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 40,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 240, width],
            y: [480],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 45,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-240, width, -240],
            y: [340],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 50,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 300, width],
            y: [400],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 55,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-300, width, -300],
            y: [460],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 60,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 360, width],
            y: [520],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 65,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-360, width, -360],
            y: [580],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 70,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 420, width],
            y: [640],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 75,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [-420, width, -420],
            y: [700],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 80,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [width, 0, width],
            y: [760],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 26,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
        <motion.div
          animate={{
            x: [0, width, 0],
            y: [800],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 30,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          className="absolute top-0 left-0 ">
          <em-emoji set="apple" id={emojiId} size={1000} />
        </motion.div>
      </>
    )
  }

  if (selectedTheme.theme === 'Quantum') {
    const colors = selectedTheme.colors! as { label: string; colors: string[] }

    return (
      <>
        <motion.div
          animate={{
            x: [-width / 2, width / 2, width / 2, -width / 2, -width / 2],
            y: [0, 0, height / 2, height / 2, 0],
          }}
          transition={{
            duration: 15,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            filter: 'blur(100px)',
            background: colors.colors[0],
            border: '1px solid red',
          }}
          className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full "
        />
        <motion.div
          animate={{
            x: [width / 2, width / 2, -width / 2, -width / 2, width / 2],
            y: [0, height / 2, height / 2, 0, 0],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            filter: 'blur(100px)',
            background: colors.colors[1],
          }}
          className="absolute top-0 left-0 w-[2px] h-[2px] rounded-full"
        />
        <motion.div
          animate={{
            x: [width / 2, -width / 2, -width / 2, width / 2, width / 2],
            y: [height / 2, height / 2, 0, 0, height / 2],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            filter: 'blur(100px)',
            background: colors.colors[2],
          }}
          className="absolute top-0 left-0 w-[2px] h-[2px]  rounded-full"
        />
        <motion.div
          animate={{
            x: [-width / 2, -width / 2, width / 2, width / 2, -width / 2],
            y: [height / 2, 0, 0, height / 2, height / 2],
          }}
          transition={{
            duration: 20,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'loop',
          }}
          style={{
            width: `${width}px`,
            height: `${width}px`,
            filter: 'blur(100px)',
            background: colors.colors[3],
          }}
          className="absolute top-0 left-0 w-[2px] h-[2px]  rounded-full"
        />
      </>
    )
  }

  if (selectedTheme.theme === 'Confetti') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const confettiSource: any =
      selectedTheme.colors === 'up' ? { y: height, w: width } : undefined

    return (
      <Confetti
        numberOfPieces={200}
        width={width}
        height={height}
        gravity={0.03}
        tweenDuration={10000}
        {...(confettiSource ? { confettiSource } : {})}
      />
    )
  }

  return null
}

export function ThemeEffects({
  children,
  className,
  selectedTheme,
}: {
  children: ReactNode
  className?: string
  selectedTheme: theme
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const { width, height } = useDimensions(ref)

  useEffect(() => {
    if (!selectedTheme) {
      document.documentElement.style.setProperty(
        '--event-patterns-theme-background',
        '#fafafa' as string
      )
      document.documentElement.style.setProperty(
        '--event-patterns-theme-color',
        '0,0,0'
      )

      return
    }

    const isDark = isColorDark(selectedTheme.color as string)

    document.documentElement.style.setProperty(
      '--event-patterns-theme-background',
      selectedTheme.color as string
    )

    if (isDark) {
      document.documentElement.style.setProperty(
        '--event-patterns-theme-color',
        '255, 255, 255'
      )

      return
    }

    document.documentElement.style.setProperty(
      '--event-patterns-theme-color',
      '0,0,0'
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTheme?.color])

  return (
    <div
      ref={ref}
      style={{ backgroundColor: selectedTheme?.color }}
      className={cn(
        'relative overflow-hidden h-screen',
        className,
        PatternStyles[selectedTheme?.colors as PatternKeys]
      )}>
      {children}

      <RenderIf isTrue={!!selectedTheme?.theme}>
        <Effects selectedTheme={selectedTheme} width={width} height={height} />
      </RenderIf>
    </div>
  )
}
