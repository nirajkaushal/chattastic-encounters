import { cn } from '@/utils/utils'

interface IconProps {
  filled?: boolean
  className?: string
}

export function UsersIcon({ filled = false, className = '' }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        {
          'text-primary': filled,
        },
        className
      )}>
      <path
        d="M15.7035 6.5625C15.5891 8.15117 14.4106 9.375 13.1254 9.375C11.8403 9.375 10.6598 8.15156 10.5473 6.5625C10.4301 4.90977 11.5774 3.75 13.1254 3.75C14.6735 3.75 15.8207 4.93984 15.7035 6.5625Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1248 11.875C10.5791 11.875 8.1311 13.1395 7.51781 15.602C7.43656 15.9277 7.64086 16.25 7.97563 16.25H18.2745C18.6092 16.25 18.8123 15.9277 18.7323 15.602C18.119 13.1 15.6709 11.875 13.1248 11.875Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeMiterlimit="10"
      />
      <path
        d="M7.81116 7.26328C7.71976 8.53203 6.76741 9.53125 5.74085 9.53125C4.71429 9.53125 3.76038 8.53242 3.67054 7.26328C3.57718 5.94336 4.50413 5 5.74085 5C6.97757 5 7.90452 5.96758 7.81116 7.26328Z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.04726 11.9531C7.34218 11.6301 6.56562 11.5059 5.74257 11.5059C3.71132 11.5059 1.75429 12.5156 1.26405 14.4824C1.1996 14.7426 1.36288 15 1.63007 15H6.01601"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeMiterlimit="10"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M6.64073 8.23818H13.3574M6.64073 11.7615H11.4307M9.99906 17.7082C11.6736 17.7078 13.3024 17.1622 14.6392 16.1539C15.9761 15.1455 16.9482 13.7293 17.4086 12.1193C17.869 10.5094 17.7927 8.79329 17.1911 7.23059C16.5896 5.66789 15.4955 4.34358 14.0744 3.45793C12.6533 2.57229 10.9824 2.17348 9.31452 2.32182C7.64662 2.47016 6.07238 3.15759 4.82988 4.28013C3.58738 5.40268 2.74421 6.89929 2.42787 8.54363C2.11154 10.188 2.33925 11.8906 3.07656 13.394C3.16656 13.5773 3.19656 13.784 3.15073 13.9823L2.47073 16.929C2.45156 17.0117 2.45376 17.0979 2.47712 17.1795C2.50048 17.2611 2.54423 17.3355 2.60426 17.3955C2.66428 17.4555 2.7386 17.4993 2.82021 17.5226C2.90182 17.546 2.98804 17.5482 3.07073 17.529L6.01656 16.8482C6.21546 16.8046 6.42329 16.8311 6.6049 16.9232C7.66106 17.4418 8.82243 17.7104 9.99906 17.7082Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function NotesIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M15.0659 9.93058V5.59828C15.066 5.54357 15.0553 5.48939 15.0344 5.43885C15.0135 5.3883 14.9828 5.34239 14.9442 5.30373L12.767 3.12198C12.6892 3.04397 12.5838 3.0001 12.4737 3H4.41497C4.30491 3 4.19937 3.04381 4.12154 3.1218C4.04372 3.19978 4 3.30555 4 3.41583V16.4453C4 16.5556 4.04372 16.6614 4.12154 16.7394C4.19937 16.8174 4.30491 16.8612 4.41497 16.8612H8.84135M6.76648 8.54447H12.2995M6.76648 5.77223H9.53297M6.76648 11.3167H8.84135M13.6509 13.3543L14.3425 12.6612C14.4145 12.5889 14.4999 12.5316 14.5941 12.4924C14.6882 12.4533 14.7891 12.4332 14.891 12.4332C14.9929 12.4332 15.0937 12.4533 15.1879 12.4924C15.282 12.5316 15.3675 12.5889 15.4394 12.6612C15.5115 12.7333 15.5686 12.8189 15.6076 12.9132C15.6466 13.0074 15.6667 13.1085 15.6667 13.2105C15.6667 13.3125 15.6466 13.4135 15.6076 13.5078C15.5686 13.602 15.5115 13.6876 15.4394 13.7597L14.7478 14.4528L13.6509 13.3536L11.5822 15.4265C11.4788 15.5305 11.411 15.6647 11.3886 15.8098L11.2198 16.8889L12.2967 16.7205C12.4415 16.698 12.5754 16.6301 12.6792 16.5264L14.7471 14.4528"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.2227 2.77783V5.13894C12.2227 5.24945 12.2666 5.35543 12.3447 5.43357C12.4228 5.51171 12.5288 5.55561 12.6393 5.55561H15.0004"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
