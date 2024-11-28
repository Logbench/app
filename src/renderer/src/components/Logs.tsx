import { Fragment, useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SidebarLeftIcon from '../icons/SidebarLeft'
import MagnifyingGlassIcon from '../icons/MagnifyingGlass'
import Log from './Log'
import classNames from '../utils/classnames'
import type { Log as ILog } from '../types/log'
import { useOutletContext, useParams } from 'react-router'
import { ImperativePanelHandle } from 'react-resizable-panels'
import usePersistRoute from '@renderer/hooks/use-persist-route'
import Trash from '@renderer/icons/Trash'
import { format } from 'date-fns'

const ProjectLogs = () => {
  usePersistRoute()

  const queryClient = useQueryClient()

  // URL state
  const { projectId } = useParams<{ projectId: string }>()

  // Outlet context
  const { sidebar, isSidebarOpen, isFullScreen } = useOutletContext<{
    sidebar: React.MutableRefObject<ImperativePanelHandle | null>
    isSidebarOpen: boolean
    isFullScreen: boolean
  }>()

  // Local state
  const [logIdShowingContextMenu, setLogIdShowingContextMenu] = useState<string>()

  // Server state
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => window.api.getProject(projectId!),
    enabled: Boolean(projectId)
  })

  const {
    data: logs,
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError,
    refetch: refetchProjectLogs
  } = useQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: () => window.api.getProjectLogs(projectId!),
    enabled: Boolean(projectId)
  })

  const { mutate: mutateDeleteProjectLogs, isPending: isDeleteProjectLogsLoading } = useMutation({
    mutationFn: () => window.api.deleteProjectLogs(projectId!),
    onSettled: () => refetchProjectLogs()
  })

  // Side-effects
  useEffect(() => {
    window.api.onNewLog((newLog) => {
      if (newLog.project?.id !== projectId) {
        return
      }

      const existingLogs = queryClient.getQueryData<ILog[]>(['projects', projectId, 'logs']) || []

      queryClient.setQueryData(['projects', projectId, 'logs'], [newLog, ...existingLogs])
    })

    return () => {
      window.api.removeNewLogListeners()
    }
  }, [queryClient, projectId])

  useEffect(() => {
    const handleMenuItemClick = async (event: string, log: ILog) => {
      if (event === 'copy-log') {
        try {
          await navigator.clipboard.writeText(JSON.stringify(log, null, 2))
        } catch {
          window.alert('Failed to copy to clipboard')
        }
      } else if (event === 'copy-log-timestamp') {
        try {
          await navigator.clipboard.writeText(
            format(new Date(log.createdAt), 'MMM d yyyy, HH:mm:ss:SSS')
          )
        } catch {
          window.alert('Failed to copy to clipboard')
        }
      } else if (event === 'copy-log-content') {
        try {
          await navigator.clipboard.writeText(log.content)
        } catch {
          window.alert('Failed to copy to clipboard')
        }
      } else if (event === 'copy-log-client') {
        try {
          await navigator.clipboard.writeText('Coming soon') // TODO: Update
        } catch {
          window.alert('Failed to copy to clipboard')
        }
      } else if (event === 'copy-log-location') {
        try {
          await navigator.clipboard.writeText('Coming soon') // TODO: Update
        } catch {
          window.alert('Failed to copy to clipboard')
        }
      }
    }

    window.api.onMenuItemClicked(handleMenuItemClick)

    const handleCloseContextMenu = () => {
      setLogIdShowingContextMenu(undefined)
    }

    window.api.onCloseLogContextMenu(handleCloseContextMenu)
  }, [])

  return (
    <>
      <div
        className={classNames(
          'drag flex items-center justify-between gap-3 py-3 h-[53px] bg-background-lighter',
          isSidebarOpen ? 'pl-6 pr-3' : isFullScreen ? 'px-3' : 'pr-3 pl-[81px]'
        )}
      >
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              type="button"
              title="Toggle sidebar"
              className="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
              onClick={() => sidebar.current?.expand()}
            >
              <SidebarLeftIcon className="fill-foreground/40 group-active:fill-foreground transition w-6" />
            </button>
          )}
          <div className="space-y-1.5">
            <button
              type="button"
              className="text-[15px] font-medium leading-none text-left no-drag"
              onClick={() => {
                navigator.clipboard.writeText(projectId!)
              }}
            >
              {isProjectLoading ? 'Loading...' : project?.name || 'Unknown Project'}
            </button>
            <p className="text-sm text-foreground-muted leading-none">
              {isLogsLoading
                ? 'Loading logs...'
                : `${logs ? Object.values(logs).reduce((a, b) => a + b.length, 0) : 0} logs`}
            </p>
          </div>
        </div>
        <div className="no-drag flex items-center gap-2.5">
          <div className="relative">
            <MagnifyingGlassIcon className="w-3.5 fill-foreground absolute top-1/2 left-2.5 -translate-y-1/2" />
            <input
              type="text"
              id="search-projects"
              placeholder="Search"
              className="w-48 transition-all duration-150 focus:w-64 rounded-md py-1 pl-8 pr-2 bg-transparent border border-foreground/10 placeholder-foreground/20 focus:outline-none focus:ring-2 ring-primary/25"
              style={{ transitionProperty: 'width' }}
            />
          </div>

          <button
            type="button"
            title="Clear logs"
            className="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
            disabled={isDeleteProjectLogsLoading}
            onClick={() => {
              if (!projectId) {
                return
              }

              mutateDeleteProjectLogs()
            }}
          >
            <Trash className="fill-foreground/40 group-active:fill-foreground transition h-5" />
          </button>
        </div>
      </div>

      <div
        className="flex flex-col relative overflow-y-auto"
        style={{ height: 'calc(100% - 53px)' }}
      >
        <div className="grid grid-cols-10 bg-background-lighter px-4 sticky top-0 z-10 border-t border-border-light">
          <button
            type="button"
            title="Order by date"
            className="p-2 text-foreground-muted truncate text-left active:bg-background-lightest transition col-span-1"
          >
            Timestamp
          </button>
          <div className="p-2 col-span-6">
            <p className="text-foreground-muted truncate">Content</p>
          </div>
          <div className="p-2 flex">
            <p className="text-foreground-muted truncate">Client</p>
          </div>
          <div className="p-2">
            <p className="text-foreground-muted truncate">Location</p>
          </div>
        </div>

        {isLogsLoading && <p>Loading...</p>}
        {isLogsError && <p>Error: {logsError?.message || 'Unknown error'}</p>}
        {logs
          ? Object.entries(logs).map(([date, logs]) => (
              <Fragment key={date}>
                <div className="flex justify-center px-4 sticky top-[36px] z-10 border-y border-border-light bg-background">
                  <p className="p-1.5 text-foreground-muted text-sm text-center">{date}</p>
                </div>

                <div className="p-3 space-y-0.5">
                  {logs.map((log) => (
                    <Log
                      key={log.id}
                      log={log}
                      isShowingContextMenu={logIdShowingContextMenu === log.id}
                      onOpenContextMenu={() => {
                        setLogIdShowingContextMenu(log.id)
                        window.api
                          .showContextMenu(log)
                          .catch((err: unknown) =>
                            console.error('Failed to show context menu:', err)
                          )
                      }}
                    />
                  ))}
                </div>
              </Fragment>
            ))
          : null}
      </div>
    </>
  )
}

export default ProjectLogs
