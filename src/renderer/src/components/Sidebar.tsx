import { MutableRefObject, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import SidebarLeftIcon from '../icons/SidebarLeft'
import ShippingBoxFillIcon from '../icons/ShippingBoxFill'
import classNames from '../utils/classnames'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { Link, useParams } from 'react-router'

type SidebarProps = {
  sidebar: MutableRefObject<ImperativePanelHandle | null> // PaneAPI equivalent
}

const Sidebar = ({ sidebar }: SidebarProps) => {
  // URL state
  const { projectId } = useParams<{ projectId: string }>()

  // Local state
  const [search] = useState('')

  // Fetch projects
  const {
    data: projects = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: () => window.api.getProjects()
  })

  // Filtered projects based on search input
  const filteredProjects = projects.filter((project: { name: string }) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div id="sidebar" className="flex flex-col h-full">
      {/* Header Section */}
      <div className="pl-[82px] items-center h-[52px] flex item-center gap-3 drag">
        <button
          type="button"
          title="Toggle sidebar"
          className="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
          onClick={() => {
            sidebar.current?.collapse()
          }}
        >
          <SidebarLeftIcon className="fill-foreground/40 group-active:fill-foreground transition w-6" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {/* New Project Button */}
        <div className="px-3">
          <button
            type="button"
            id="new-project"
            className="transition duration-150 border border-border-lighter w-full rounded-md py-1 pl-8 pr-2 bg-background-lightest hover:bg-background-lightest-hover hover:border-border-lighter-hover focus:outline-none focus:ring-2 ring-primary/25 shadow shadow-background"
            onClick={() => {
              const projectName = window.prompt('Project name')

              if (projectName) {
                window.api.createProject(projectName)
              }
            }}
          >
            New project
          </button>
        </div>

        {/* Projects List */}
        <div className="px-3 space-y-1.5 w-full">
          <p className="text-foreground-muted text-sm font-medium mx-2">Projects</p>

          {isLoading && <p>Loading...</p>}
          {isError && <p>Error: {error?.message || 'Unknown error'}</p>}
          {projects.length > 0 && (
            <div className="-space-y-0.5">
              {filteredProjects.map((project: { id: string; name: string }) => (
                <Link
                  to={`/${project.id}`}
                  key={project.id}
                  //onClick={() => onChangeProjectId(project.id)}
                  className={classNames(
                    'flex items-center gap-2.5 text-left py-1.5 px-3 w-full rounded-md',
                    project.id === projectId
                      ? 'bg-background-lightest'
                      : 'hover:bg-background-lightest'
                  )}
                >
                  <ShippingBoxFillIcon className="w-4 fill-primary" />
                  <p className="truncate flex-1">{project.name}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={() => {
            window.api.reset()
          }}
          className="text-sm text-foreground-muted"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

export default Sidebar
