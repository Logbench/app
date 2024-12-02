import React from 'react'

type ChevronUpChevronDownProps = {
  className?: string
}

const ChevronUpChevronDown: React.FC<ChevronUpChevronDownProps> = ({ className }) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 13.3594 18.8184"
      className={className}
    >
      <g>
        <rect height="18.8184" opacity="0" width="13.3594" x="0" y="0" />
        <path
          d="M6.50391 0C6.25 0 6.02539 0.0976562 5.83008 0.292969L0.253906 5.64453C0.107422 5.79102 0 5.99609 0 6.2793C0 6.78711 0.380859 7.17773 0.888672 7.17773C1.10352 7.17773 1.33789 7.11914 1.54297 6.91406L6.50391 2.06055L11.4551 6.91406C11.6699 7.10938 11.8945 7.17773 12.1094 7.17773C12.6172 7.17773 12.998 6.78711 12.998 6.2793C12.998 5.99609 12.9004 5.79102 12.7441 5.64453L7.16797 0.292969C6.97266 0.0976562 6.74805 0 6.50391 0ZM6.50391 18.8086C6.74805 18.8086 6.97266 18.7012 7.16797 18.5156L12.7441 13.1641C12.9004 13.0078 12.998 12.8125 12.998 12.5195C12.998 12.0117 12.6172 11.6309 12.1094 11.6309C11.8945 11.6309 11.6699 11.6992 11.4551 11.8945L6.50391 16.748L1.54297 11.8945C1.33789 11.6895 1.10352 11.6309 0.888672 11.6309C0.380859 11.6309 0 12.0117 0 12.5195C0 12.8125 0.107422 13.0078 0.253906 13.1641L5.83008 18.5156C6.02539 18.7012 6.25 18.8086 6.50391 18.8086Z"
          fillOpacity={0.85}
        />
      </g>
    </svg>
  )
}

export default ChevronUpChevronDown
