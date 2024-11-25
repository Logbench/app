import React from 'react'

type ShippingBoxFillProps = {
  className?: string // Optional, to allow for no className
}

const ShippingBoxFill: React.FC<ShippingBoxFillProps> = ({ className }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 20.1758 21.4746"
      className={className}
    >
      <g>
        <rect height="21.4746" opacity="0" width="20.1758" x="0" y="0" />
        <path
          d="M10.5762 21.4746C10.6445 21.4551 10.7031 21.4258 10.7715 21.3867L18.418 17.0312C19.3262 16.5137 19.8145 15.9863 19.8145 14.5703L19.8145 6.96289C19.8145 6.66992 19.7949 6.43555 19.7363 6.2207L10.5762 11.4551ZM9.23828 21.4746L9.23828 11.4551L0.078125 6.2207C0.0195312 6.43555 0 6.66992 0 6.96289L0 14.5703C0 15.9863 0.498047 16.5137 1.39648 17.0312L9.05273 21.3867C9.11133 21.4258 9.16992 21.4551 9.23828 21.4746ZM9.91211 10.2832L14.082 7.91992L4.83398 2.63672L1.25 4.67773C1.03516 4.79492 0.859375 4.91211 0.703125 5.05859ZM15.4395 7.14844L19.1113 5.05859C18.9648 4.91211 18.7891 4.79492 18.5742 4.67773L11.6797 0.751953C11.084 0.410156 10.4883 0.224609 9.91211 0.224609C9.32617 0.224609 8.73047 0.410156 8.13477 0.751953L6.15234 1.875Z"
          fillOpacity={0.85}
        />
      </g>
    </svg>
  )
}

export default ShippingBoxFill
