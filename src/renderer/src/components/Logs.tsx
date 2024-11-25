import React, { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import SidebarLeftIcon from '../icons/SidebarLeft'
import MagnifyingGlassIcon from '../icons/MagnifyingGlass'
import Log from './Log'
import classNames from '../utils/classnames'
import type { Log as ILog } from '../types/log'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { ipcRenderer } from 'electron'

type ProjectLogsProps = {
  sidebar: ImperativePanelHandle | null
  projectId: string
  isSidebarOpen: boolean
}

const ProjectLogs: React.FC<ProjectLogsProps> = ({ sidebar, projectId, isSidebarOpen }) => {
  const queryClient = useQueryClient()

  // Fetch project data
  const { data: project, isLoading: isProjectLoading } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => window.api.getProject(projectId)
  })

  // Fetch logs
  const {
    data: logs,
    isLoading: isLogsLoading,
    isError: isLogsError,
    error: logsError
  } = useQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: () => window.api.getProjectLogs(projectId)
  })

  // Handle new logs via side-effects
  useEffect(() => {
    window.api.onNewLog((newLog) => {
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
              onClick={() => sidebar?.expand()}
            >
              <SidebarLeftIcon className="fill-foreground/40 group-active:fill-foreground transition w-6" />
            </button>
          )}
          <div className="space-y-1.5">
            <p className="text-[15px] font-medium leading-none">
              {isProjectLoading ? 'Loading...' : project?.name || 'Unknown Project'}
            </p>
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
