import { useMutation, useQuery } from '@tanstack/react-query'
import { MutableRefObject, useState } from 'react'
import { ImperativePanelHandle } from 'react-resizable-panels'
import { Link, useParams } from 'react-router'
import ShippingBoxFillIcon from '../icons/ShippingBoxFill'
import SidebarLeftIcon from '../icons/SidebarLeft'
import cn from '../utils/classnames'

type SidebarProps = {
  sidebar: MutableRefObject<ImperativePanelHandle | null> // PaneAPI equivalent
  isFullScreen: boolean
}

const Sidebar = ({ sidebar, isFullScreen }: SidebarProps) => {
  // URL state
  const { projectId } = useParams<{ projectId: string }>()

  // Local state
  const [search] = useState('')

  // Fetch projects
  const { refetch: refetchProjects, data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => window.api.getProjects()
  })

  const { mutate: createProject, isPending: isCreateProjectPending } = useMutation({
    mutationFn: () => window.api.createProject('New project'),
    onSettled: () => refetchProjects()
  })

  // Filtered projects based on search input
  const filteredProjects = projects.filter((project: { name: string }) =>
    project.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div id="sidebar" className="flex flex-col h-full">
      {/* Header Section */}
      <div
        className={cn('h-[52px] flex items-center gap-3 drag', isFullScreen ? 'px-3' : 'pl-[82px]')}
      >
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
            className="transition duration-150 border border-border-lighter w-full rounded-md py-1 px-4 bg-background-lightest active:bg-background-lightest-hover active:border-border-lighter-hover shadow shadow-background truncate"
            disabled={isCreateProjectPending}
            onClick={() => {
              createProject()
            }}
          >
            New project
          </button>
        </div>

        {/* Projects List */}
        <div className="px-3 space-y-1.5 w-full">
          <p className="text-foreground-muted text-sm font-medium mx-2">Projects</p>

          {projects?.length > 0 ? (
            <div className="-space-y-0.5">
              {filteredProjects.map((project: { id: string; name: string }) => (
                <Link
                  to={`/${project.id}`}
                  key={project.id}
                  className={cn(
                    'flex items-center gap-2.5 text-left py-1.5 px-3 w-full rounded-md focus:bg-background-lightest transition',
                    project.id === projectId
                      ? 'bg-background-lightest'
                      : 'active:bg-background-lightest'
                  )}
                >
                  <ShippingBoxFillIcon className="w-4 fill-primary" />
                  <p className="truncate flex-1">{project.name}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="p-5"></div>
    </div>
  )
}

export default Sidebar
