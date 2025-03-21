
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react'

import { Radio, RadioGroup } from '@heroui/react'
import { useThrottle } from '@uidotdev/usehooks'
import isEqual from 'lodash.isequal'
import { Trash2 } from 'lucide-react'
import ReactTextareaAutosize from 'react-textarea-autosize'
import { v4 as uuidv4 } from 'uuid'

import { SideImageLayout } from '@/components/common/SideImageLayout'
import { FrameText } from '@/components/event-content/FrameText'
import { FrameTextBlock } from '@/components/event-content/FrameTextBlock'
import { Button } from '@/components/ui/Button'
import { useEventContext } from '@/contexts/EventContext'
import { PollFrame, MCQOption, MCQFrame } from '@/types/frame.type'
import { cn } from '@/utils/utils'

type EditProps = {
  frame: MCQFrame
}

export function McqEditor({ frame: frameFromRemote }: EditProps) {
  const optionsRef = useRef<any>([])

  const { updateFrame } = useEventContext()
  const [options, setOptions] = useState<MCQOption[]>(
    frameFromRemote.content?.options || []
  )

  const withImage = frameFromRemote.config?.image?.position

  const throttledOptions = useThrottle(options, 500)

  const updateOption = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const newOptions = [...options]
    // TODO: any normal way to update this was not triggering update frame
    newOptions[index] = {
      name: `${e.target.value}`,
      color: newOptions[index].color,
      id: newOptions[index].id,
      selected: newOptions[index].selected,
    }
    setOptions(newOptions)
  }

  const deleteOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const addNewOption = () => {
    setOptions([...options, { name: '', color: '#E7E0FF', id: uuidv4() }])
  }

  const focusOnFirstEmptyOption = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      const indexOfFirstEmptyOption = options.findIndex(
        (option) => option?.name?.length === 0
      )
      if (indexOfFirstEmptyOption !== -1) {
        optionsRef.current[indexOfFirstEmptyOption].focus()
        e.preventDefault()

        return
      }
      addNewOption()
      e.preventDefault()
    }
  }

  const onAnswerChange = (optionId: string) => {
    const newOptions = options.map((option) => {
      if (option.id === optionId) {
        return { ...option, selected: true } // Mark the selected option
      }

      return { ...option, selected: false } // Reset others to false
    })
    setOptions(newOptions)
  }

  useEffect(() => {
    if (isEqual(throttledOptions, frameFromRemote.content.options)) {
      return
    }

    updateFrame({
      framePayload: {
        content: {
          ...frameFromRemote.content,
          // question: throttledQuestion,
          options: throttledOptions,
        },
      },
      frameId: frameFromRemote.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [throttledOptions])

  const getSelected = () => {
    const selectedAnswer = frameFromRemote.content.options.find(
      (option) => option.selected
    )

    return selectedAnswer?.id
  }

  const answer = getSelected()

  return (
    <div>
      <FrameText
        key={frameFromRemote.id}
        type="title"
        disableEnter
        onSuccessiveEnters={focusOnFirstEmptyOption}
      />
      <FrameTextBlock blockType="paragraph" />
      <div className={cn('w-full h-auto flex justify-start items-start mt-8')}>
        <div
          className={cn('w-full', {
            'max-w-[46rem]': !withImage,
          })}>
          <RadioGroup
            label={!answer ? 'Select an answer' : null}
            value={answer}
            onValueChange={(selected) => onAnswerChange(selected)}>
            <ul
              className={cn('mb-4 grid gap-4', {
                'pt-4': !answer,
              })}>
              {options.map(
                (
                  option: { name: string; color: string; id: string },
                  index: number
                ) => (
                  <li
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="relative flex items-center gap-4 text-foreground group/poll">
                    <Radio value={option.id} />
                    {/*  eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
                    <div
                      className="w-full py-[1.125rem] rounded-2xl bg-[#F5F5F5] cursor-text"
                      onClick={() => optionsRef.current[index].focus()}>
                      <ReactTextareaAutosize
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ref={(el: any) => {
                          optionsRef.current[index] = el
                        }}
                        className={cn(
                          'w-full text-md text-left pl-6 bg-transparent font-medium border-0 outline-none focus:border-0 focus:ring-0 hover:outline-none resize-none'
                        )}
                        value={option.name}
                        placeholder={`Option ${index + 1}`}
                        onChange={(e) => updateOption(e, index)}
                        onKeyDown={focusOnFirstEmptyOption}
                      />
                    </div>
                    <div className="flex items-center gap-4 opacity-100 group-hover/poll:opacity-100 duration-100">
                      <Trash2
                        onClick={() => deleteOption(index)}
                        className="text-black/25 hover:text-black/50 text-lg cursor-pointer"
                      />
                    </div>
                  </li>
                )
              )}
            </ul>
          </RadioGroup>

          <Button
            variant="solid"
            color="primary"
            radius="md"
            onClick={addNewOption}>
            + Add option
          </Button>
        </div>
      </div>
    </div>
  )
}

export function Edit({ frame }: { frame: PollFrame }) {
  return (
    <SideImageLayout imageConfig={frame.config.image}>
      <McqEditor frame={frame} />
    </SideImageLayout>
  )
}
