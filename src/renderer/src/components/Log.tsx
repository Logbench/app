import React, { useState, useMemo } from 'react'
import { format, isAfter, subSeconds } from 'date-fns'
import { isObjectLike } from '../utils/is-object-like'
import ObjectTree from './ObjectTree'
import DocumentOnDocument from '../icons/DocumentOnDocument'
import Checkmark from '../icons/Checkmark'
import { Log } from '@renderer/types/log'
import cn from '@renderer/utils/classnames'

type LogProps = {
  log: Log
}

const LogItem: React.FC<LogProps> = ({ log }) => {
  const [isCopied, setIsCopied] = useState(false)

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
  //const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
  //  event.preventDefault()
  //  window.api
  //    .showContextMenu(log.id)
  //    .catch((err: unknown) => console.error('Failed to show context menu:', err))
  //}

  //useEffect(() => {
  //  const handleMenuItemClick = async (event: string, logId: string) => {
  //    if (event === 'copy-log' && logId === log.id) {
  //      try {
  //        await navigator.clipboard.writeText(JSON.stringify(log, null, 2))
  //      } catch {
  //        window.alert('Failed to copy to clipboard')
  //      }
  //    }
  //  }
  //
  //  window.api.onMenuItemClicked(handleMenuItemClick)
  //}, [log])

  const handleCopyLog = async () => {
    setIsCopied(true)
    try {
      await navigator.clipboard.writeText(JSON.stringify(parsedLog.content, null, 2))
    } catch {
      window.alert('Failed to copy to clipboard')
    }
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div
      className={cn(
        'grid grid-cols-10 border-b border-black bg-background px-4',
        isAfter(new Date(parsedLog.createdAt), subSeconds(new Date(), 1)) && 'fade-in'
      )}
    >
      {/* Date */}
      <div className="p-2 col-span-1">
        <p className="text-foreground-muted truncate">
          {parsedLog.createdAt ? format(new Date(parsedLog.createdAt), 'HH:mm:ss:SSS') : 'No date'}
        </p>
      </div>

      {/* Content */}
      <div className="p-2 flex items-start gap-3 overflow-x-auto col-span-6">
        <button
          type="button"
          title="Copy log"
          className="group rounded-md translate-y-[3px]"
          disabled={isCopied}
          onClick={handleCopyLog}
        >
          {isCopied ? (
            <Checkmark className="fill-foreground/40 w-4 h-4" />
          ) : (
            <DocumentOnDocument className="fill-foreground-muted group-hover:fill-foreground transition w-4 h-4" />
          )}
        </button>

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
