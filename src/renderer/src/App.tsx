import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Sidebar from './components/Sidebar'
import Logs from './components/Logs'
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

// Initialize Query Client
const queryClient = new QueryClient()

const MainLayout: React.FC = () => {
  // Local state
  const [projectId, setProjectId] = useState<string | undefined>()
  const [sidebar, setSidebar] = useState<ImperativePanelHandle | null>(null) // PaneAPI equivalent
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen">
        <PanelGroup direction="horizontal" className="h-full" autoSaveId="@layouts/main">
          {/* Sidebar Panel */}
          <Panel
            ref={setSidebar}
            collapsible
            minSize={20}
            defaultSize={20}
            maxSize={40}
            onCollapse={() => setIsSidebarOpen(false)}
            onExpand={() => setIsSidebarOpen(true)}
            className="bg-background-lighter"
          >
            <Sidebar
              sidebar={sidebar}
              projectId={projectId}
              onChangeProjectId={(newProjectId: string) => setProjectId(newProjectId)}
            />
          </Panel>

          {/* Panel Resizer */}
          <PanelResizeHandle
            className="px-1 -mx-1 flex items-center justify-center z-10"
            onDoubleClick={() => {
              if (sidebar?.resize) sidebar.resize(20) // Resize to 20% width
            }}
          >
            <div className="w-px h-full bg-border-light"></div>
          </PanelResizeHandle>

          {/* Logs Panel */}
          <Panel className="flex flex-col">
            {projectId && (
              <Logs projectId={projectId} sidebar={sidebar} isSidebarOpen={isSidebarOpen} />
            )}
          </Panel>
        </PanelGroup>
      </div>
    </QueryClientProvider>
  )
}

export default MainLayout
