/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unescaped-entities */

import { useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { FaVideo } from 'react-icons/fa'

import { VideoProvider } from './utils/types'

import { ContentLoading } from '@/components/common/ContentLoading'
import { FilePickerDropzone } from '@/components/common/FilePickerDropzone'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { FrameFormContainer } from '@/components/event-content/FrameFormContainer'
import { useEventContext } from '@/contexts/EventContext'
import { uploadFile } from '@/services/storage.service'
import { IFrame } from '@/types/frame.type'

type LocalVideoEditProps = {
  frame: IFrame & {
    content: {
      videoUrl: string
      provider: VideoProvider | null
    }
  }
  onUpdate: () => void
  onProviderChange: () => void
}

export function LocalVideoEdit({
  frame,
  onUpdate,
  onProviderChange,
}: LocalVideoEditProps) {
  const [progress, setProgress] = useState<number>(0)
  const { updateFrame } = useEventContext()

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadFile({
        fileName: `${frame.id}/video-${Date.now()}-${file.name}`,
        file,
        bucketName: 'assets-uploads',
        onProgressChange: (p) => {
          if (typeof p === 'number') {
            setProgress(Math.ceil(p))
          }
        },
      }).promise

      return response
    },
    onSuccess: (data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const url = data?.url

      if (!url) return

      updateFrame({
        framePayload: {
          content: {
            ...frame.content,
            videoUrl: url,
            provider: VideoProvider.LOCAL,
          },
        },
        frameId: frame.id,
      })

      onUpdate()

      toast.success('Video uploaded successfully.')
    },
    onError: () => {
      toast.error('Failed to upload video, please try re-uploading again.')
    },
    onSettled: () => {
      toast.remove(frame.id)
    },
    onMutate: () => {
      toast.loading('Uploading video...', {
        id: frame.id,
      })
    },
  })

  return (
    <FrameFormContainer
      headerIcon={<FaVideo size={72} className="text-primary" />}
      headerTitle={
        uploadMutation.isPending ? 'Uploading video' : 'Upload video'
      }
      headerDescription={
        uploadMutation.isPending
          ? 'Your video is being uploaded. This will take some time, depending on the size of the file.'
          : 'Easily embed local video into Moraa Frame for smooth playing.'
      }
      footerNote={
        uploadMutation.isPending ? (
          <span className="text-red-500">
            Please wait while the video is being uploaded.
          </span>
        ) : (
          <div className="flex flex-col gap-2">
            <span className="text-gray-400">
              Note: Only MP4 video format is supported. Maximum file size is
              100MB.
            </span>
            <span
              className="cursor-pointer text-blue-400 underline text-sm"
              onClick={onProviderChange}>
              Embed from Youtube or from any other url?{' '}
            </span>
          </div>
        )
      }>
      <FilePickerDropzone
        fullWidth
        label="Drag & drop video file here or click here to upload file"
        uploadProgress={uploadMutation.isPending ? progress : 0}
        supportedFormats={{ 'video/mp4': [] }}
        onUpload={(files) => {
          const file = files?.[0]

          if (file) {
            uploadMutation.mutate(file)
          }
        }}
      />

      <RenderIf isTrue={uploadMutation.isPending}>
        <ContentLoading fullPage transparent />
      </RenderIf>
    </FrameFormContainer>
  )
}
