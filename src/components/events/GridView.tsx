/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { Avatar, Card, CardBody, Chip, Image } from '@heroui/react'
import { useRouter } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import { EventActions } from './EventActions'
import { Loading } from '../common/Loading'
import { RenderIf } from '../common/RenderIf/RenderIf'
import { Tooltip } from '../common/ShortuctTooltip'
import { getProfileName, UserAvatar } from '../common/UserAvatar'

import { IMAGE_PLACEHOLDER } from '@/constants/common'
import { EventStatus } from '@/types/enums'
import { getCurrentTimeInLocalZoneFromTimeZone } from '@/utils/date'
import { getStatusColor } from '@/utils/event.util'

export function GridView({
  eventRows,
  isLoading,
  currentUserId,
  refetch,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventRows: any[]
  isLoading: boolean
  currentUserId: string
  refetch: () => void
}) {
  const router = useRouter()
  if (isLoading) {
    return <Loading />
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCardClick = (event: any) => {
    if (
      event.owner_id !== currentUserId &&
      event.status !== EventStatus.ACTIVE
    ) {
      router.navigate({ to: `/enroll/${event.id}` })

      return
    }
    router.navigate({
      to: `/events/${event.id}`,
      search: (prev) => ({
        ...prev,
        action: 'view',
      }),
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-[1920px]:grid-cols-6 gap-4">
      {eventRows.map((event) => (
        <Card
          key={event.id}
          className="cursor-pointer hover:shadow-xl border border-gray-100 shadow-sm group/card"
          shadow="none"
          isPressable
          onPress={() => handleCardClick(event)}>
          <CardBody>
            <Avatar
              name={event.name}
              src={event.image_url}
              fallback={
                event.image_url && (
                  <Image src={IMAGE_PLACEHOLDER} className="w-full h-full" />
                )
              }
              classNames={{
                base: 'w-full h-40 rounded-lg aspect-square',
                img: 'h-full object-cover',
                fallback: 'w-full h-full',
              }}
              showFallback={event.image_url}
            />

            <div className="flex items-center justify-between w-full mt-2">
              <Chip
                variant="flat"
                size="sm"
                radius="full"
                color={getStatusColor(event.status)}
                classNames={{ base: 'text-center !text-[0.625rem]' }}>
                {event.status}
              </Chip>
              <RenderIf isTrue={event.owner_id === currentUserId}>
                <div className="opacity-0 group-hover/card:opacity-100">
                  <EventActions
                    as="dropdown"
                    event={event}
                    isOwner={event.owner_id === currentUserId}
                    onDone={refetch}
                  />
                </div>
              </RenderIf>
            </div>

            <p className="text-xl font-semibold text-black/80 mt-1 line-clamp-2">
              {event.name}
            </p>

            <RenderIf isTrue={event.start_date && event.end_date}>
              <Tooltip
                placement="bottom"
                label={
                  <div className="flex items-center gap-4">
                    <p>
                      {getCurrentTimeInLocalZoneFromTimeZone({
                        dateTimeString: event.start_date,
                        utcTimeZone: event.timezone,
                        format: 'dd MMM yyyy',
                      }) || 'NA'}{' '}
                    </p>
                    -
                    <p>
                      {getCurrentTimeInLocalZoneFromTimeZone({
                        dateTimeString: event.end_date,
                        utcTimeZone: event.timezone,
                        format: 'dd MMM yyyy',
                      }) || 'NA'}{' '}
                    </p>
                  </div>
                }>
                <div className="flex gap-4 items-center mt-2">
                  <p className="text-gray-600 text-xs font-medium">
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.start_date,
                      utcTimeZone: event.timezone,
                      format: 'ccc',
                    })}
                    {' , '}
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.start_date,
                      utcTimeZone: event.timezone,
                      format: 'hh:mm a',
                    }) || 'NA'}
                  </p>
                  -
                  <p className="text-gray-600 text-xs font-medium">
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.end_date,
                      utcTimeZone: event.timezone,
                      format: 'ccc',
                    })}
                    {' , '}
                    {getCurrentTimeInLocalZoneFromTimeZone({
                      dateTimeString: event.end_date,
                      utcTimeZone: event.timezone,
                      format: 'hh:mm a',
                    }) || 'NA'}
                  </p>
                </div>
              </Tooltip>
            </RenderIf>

            <p className="mt-1 text-xs line-clamp-2 mb-10">
              {event.description}
            </p>

            <div className="w-full gap-4 absolute bottom-0 left-0 flex items-center justify-between p-4">
              <Tooltip label="Last updated" showArrow delay={700}>
                <p className="text-xs text-black/60 min-w-fit">
                  <RenderIf isTrue={event.owner_id === currentUserId}>
                    Updated by you on{' '}
                  </RenderIf>
                  {DateTime.fromISO(event.updated_at).toLocaleString({
                    year: 'numeric',
                    month: 'short',
                    day: '2-digit',
                  })}
                </p>
              </Tooltip>

              <RenderIf isTrue={event.owner_id !== currentUserId}>
                <UserAvatar
                  tooltipProps={{
                    label: `Educator - ${getProfileName(event.profile)}`,
                    showArrow: true,
                    delay: 700,
                  }}
                  profile={event.profile}
                  withName
                  avatarProps={{
                    size: 'lg',
                    classNames: { base: 'w-6 h-6 min-w-6' },
                  }}
                  nameClass="font-medium text-xs text-black/60 line-clamp-1 break-all"
                />
              </RenderIf>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  )
}
