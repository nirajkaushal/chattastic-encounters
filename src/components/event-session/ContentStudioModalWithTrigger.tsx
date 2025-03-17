import { useEffect, useState } from 'react'

import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react'
import { useParams } from '@tanstack/react-router'

import { ContentLoading } from '../common/ContentLoading'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Button } from '../ui/Button'

import { useEventPermissions } from '@/hooks/useEventPermissions'
import { cn } from '@/utils/utils'

export function ContentStudioModalWithTrigger() {
  const { permissions } = useEventPermissions()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  if (!permissions.canUpdateFrame) {
    return null
  }

  return (
    <>
      <Button
        size="sm"
        color="primary"
        fullWidth
        onPress={() => {
          setIsModalOpen(true)
        }}>
        Add Frame
      </Button>
      <Modal
        size="full"
        classNames={{
          wrapper: 'fixed left-0 top-0 z-[99999]',
          closeButton: 'hidden',
        }}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}>
        <ModalContent className="w-full h-full bg-background p-2">
          <RenderIf isTrue={!loading}>
            <ModalHeader className="p-2 flex justify-between items-center">
              <p className="text-sm text-red-500">
                Live session is in progress
              </p>
              <Button color="primary" onPress={() => setIsModalOpen(false)}>
                Done editing
              </Button>
            </ModalHeader>
          </RenderIf>
          <ModalBody className="w-full h-full p-0 rounded-lg overflow-hidden relative">
            <ContentStudioIframe onLoading={setLoading} />
            <RenderIf isTrue={loading}>
              <div className="absolute left-0 top-0 w-full h-full">
                <ContentLoading
                  message="Loading content studio..."
                  classNames={{
                    container: 'bg-background',
                  }}
                />
              </div>
            </RenderIf>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function ContentStudioIframe({
  onLoading,
}: {
  onLoading: (loading: boolean) => void
}) {
  const { eventId } = useParams({ strict: false })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    onLoading(loading)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return (
    <iframe
      title="Content Studio"
      src={`/events/${eventId}?action=edit&tab=content-studio&modal=true`}
      className={cn('w-full h-full', {
        'opacity-0': loading,
        'opacity-100': !loading,
      })}
      onLoad={() => {
        setLoading(false)
      }}
    />
  )
}
