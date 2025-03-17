
import { Input } from '@heroui/react'
import { Search } from 'lucide-react'

export function Icon8Content() {
  return (
    <div className="flex flex-col gap-8 h-full">
      <Input
        placeholder="Search Icon8"
        labelPlacement="outside"
        fullWidth
        radius="sm"
        className="shadow-none"
        variant="bordered"
        startContent={
          <Search className="text-2xl text-primary-200 pointer-events-none flex-shrink-0" />
        }
      />
      <div className="flex-auto flex flex-col justify-center items-center gap-2">
        <svg width="128" height="128" viewBox="0 0 24 24" className="text-primary-200" fill="currentColor">
          <path d="M8.4 17.77a1.13 1.13 0 0 1-.15-.56v-4.53a1.14 1.14 0 0 1 .15-.57.57.57 0 0 1 .43-.31h.29a.62.62 0 0 1 .43.31 1.14 1.14 0 0 1 .15.57v4.53a1.13 1.13 0 0 1-.15.56.6.6 0 0 1-.43.32h-.29a.55.55 0 0 1-.43-.32zm-4.1-2.19a1.13 1.13 0 0 1-.15-.56v-2.34a1.14 1.14 0 0 1 .15-.57A.58.58 0 0 1 4.73 12h.29a.62.62 0 0 1 .43.31 1.14 1.14 0 0 1 .14.57v2.34a1.13 1.13 0 0 1-.14.56.61.61 0 0 1-.43.32h-.29a.57.57 0 0 1-.43-.32zm8.2 4.38a1.13 1.13 0 0 1-.15-.56V7.56a1.14 1.14 0 0 1 .15-.57.58.58 0 0 1 .43-.28h.29a.6.6 0 0 1 .43.28 1.14 1.14 0 0 1 .14.57v11.84a1.13 1.13 0 0 1-.14.56.59.59 0 0 1-.43.32h-.29a.57.57 0 0 1-.43-.32zm4.1-2.19a1.13 1.13 0 0 1-.14-.56V6.77a1.14 1.14 0 0 1 .14-.57.6.6 0 0 1 .44-.3h.28a.62.62 0 0 1 .43.3 1.14 1.14 0 0 1 .15.57v10.44a1.13 1.13 0 0 1-.15.56.61.61 0 0 1-.43.32h-.28a.59.59 0 0 1-.44-.32zM12 0C5.37 0 0 5.37 0 12c0 6.62 5.37 12 12 12 6.62 0 12-5.38 12-12 0-6.63-5.38-12-12-12z"/>
        </svg>
        <p className="text-center w-2/3">
          <span className="text-sm text-gray-400 text-center">
            Search and use icons from Icon8 in your projects and designs
          </span>
        </p>
        <p>Coming soon</p>
        {/* <Button size="sm" variant="light" color="primary">
          Go to Library
        </Button> */}
      </div>
    </div>
  )
}
