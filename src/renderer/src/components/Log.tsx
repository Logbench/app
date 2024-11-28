import React, { useMemo } from 'react'
import { format, isAfter, subSeconds } from 'date-fns'
import { isObjectLike } from '../utils/is-object-like'
import ObjectTree from './ObjectTree'
import { Log } from '@renderer/types/log'
import cn from '@renderer/utils/classnames'

type LogProps = {
  onOpenContextMenu: () => void
  isShowingContextMenu: boolean
  log: Log
}

const LogItem: React.FC<LogProps> = ({ log, onOpenContextMenu, isShowingContextMenu }) => {
  // Derived state for parsed log
  const parsedLog: Log = useMemo(() => {
    if (
      typeof log.content === 'string' &&
      (log.content.startsWith('{') || log.content.startsWith('['))
    ) {
      try {
        return {
          ...log,
          content: JSON.parse(log.content)
        }
      } catch {
        // Fallback in case parsing fails
        return log
      }
    }
    return log
  }, [log])

  // Context menu handler
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    onOpenContextMenu()
  }

  return (
    <div
      onContextMenu={handleContextMenu}
      className={cn(
        'grid grid-cols-10 even:bg-background-lighter odd:bg-background px-4 rounded-md',
        isAfter(new Date(parsedLog.createdAt), subSeconds(new Date(), 1)) && 'fade-in',
        isShowingContextMenu && 'ring-1 ring-primary'
      )}
    >
      {/* Date */}
      <div className="p-2 col-span-1">
        <p className="text-foreground-muted truncate">
          {parsedLog.createdAt ? format(new Date(parsedLog.createdAt), 'HH:mm:ss:SSS') : 'No date'}
        </p>
      </div>

      {/* Content */}
      <div className="p-2 overflow-x-auto col-span-6">
        {isObjectLike(parsedLog.content) || Array.isArray(parsedLog.content) ? (
          <div className="json-viewer font-mono">
            <ObjectTree depth={1} json={parsedLog.content} />
          </div>
        ) : (
          <p className="truncate">{String(parsedLog.content)}</p>
        )}
      </div>

      {/* Project Name */}
      <div className="p-2 flex">
        <p className="text-foreground-muted truncate">{parsedLog.project?.name}</p>
      </div>

      {/* Location */}
      <div className="p-2">
        <p className="text-foreground-muted truncate">tree.tsx:2031:12</p>
      </div>
    </div>
  )
}

export default LogItem
