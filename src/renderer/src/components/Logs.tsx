import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import SidebarLeftIcon from '../icons/SidebarLeft'
import MagnifyingGlassIcon from '../icons/MagnifyingGlass'
import Log from './Log'
import classNames from '../utils/classnames'
import type { Log as ILog } from '../types/log'
import { useParams } from 'react-router'

const ProjectLogs = ({ sidebar = undefined, isSidebarOpen = true }) => {
  const queryClient = useQueryClient()

  const { projectId } = useParams<{ projectId: string }>()

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
    error: logsError
  } = useQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: () => window.api.getProjectLogs(projectId!),
    enabled: Boolean(projectId)
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

  return (
    <>
      {/* Header Section */}
      <div
        className={classNames(
          'drag flex items-center justify-between gap-3 py-3 h-[53px]',
          isSidebarOpen ? 'pl-6 pr-3' : 'pr-3 pl-[81px]'
        )}
      >
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <button
              type="button"
              title="Toggle sidebar"
              className="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
              //onClick={() => sidebar.current?.expand()}
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
              {isLogsLoading ? 'Loading logs...' : `${logs?.length || 0} logs`}
            </p>
          </div>
        </div>
        <div className="relative no-drag">
          <MagnifyingGlassIcon className="w-3.5 fill-foreground absolute top-1/2 left-2.5 -translate-y-1/2" />
          <input
            type="text"
            id="search-projects"
            placeholder="Search"
            className="w-48 transition-all duration-150 focus:w-64 rounded-md py-1 pl-8 pr-2 bg-transparent border border-foreground/10 placeholder-foreground/20 focus:outline-none focus:ring-2 ring-primary/25"
            style={{ transitionProperty: 'width' }}
          />
        </div>
      </div>

      {/* Logs Section */}
      <div
        className="bg-background-lighter flex flex-col relative overflow-y-auto"
        style={{ height: 'calc(100% - 53px)' }}
      >
        <div className="grid bg-background-lighter grid-cols-4 border-y border-border-light px-4 sticky top-0 z-10">
          <div className="p-2">
            <p className="text-foreground-muted truncate">Date</p>
          </div>
          <div className="p-2">
            <p className="text-foreground-muted truncate">Client</p>
          </div>
          <div className="p-2 flex">
            <p className="text-foreground-muted truncate">File</p>
          </div>
          <div className="p-2">
            <p className="text-foreground-muted truncate">Content</p>
          </div>
        </div>

        {isLogsLoading && <p>Loading...</p>}
        {isLogsError && <p>Error: {logsError?.message || 'Unknown error'}</p>}
        {logs?.map((log) => <Log key={log.id} log={log} />)}
      </div>
    </>
  )
}

export default ProjectLogs
