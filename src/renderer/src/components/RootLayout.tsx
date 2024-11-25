import { PanelGroup, Panel, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels'
import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import { useRef, useState } from 'react'

export default function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)

  const sidebar = useRef<ImperativePanelHandle | null>(null)

  return (
    <div className="h-screen">
      <PanelGroup direction="horizontal" className="h-full" autoSaveId="@layouts/main">
        {/* Sidebar Panel */}
        <Panel
          ref={sidebar}
          collapsible
          minSize={20}
          defaultSize={20}
          maxSize={40}
          onCollapse={() => setIsSidebarOpen(false)}
          onExpand={() => setIsSidebarOpen(true)}
          className="bg-background-lighter"
        >
          <Sidebar sidebar={sidebar} />
        </Panel>

        {/* Panel Resizer */}
        <PanelResizeHandle
          className="px-1 -mx-1 flex items-center justify-center z-10"
          onDoubleClick={() => {
            sidebar.current?.resize(20) // Resize to 20% width
          }}
        >
          <div className="w-px h-full bg-border-light"></div>
        </PanelResizeHandle>

        {/* Logs Panel */}
        <Panel className="flex flex-col">
          <Outlet />
        </Panel>
      </PanelGroup>
    </div>
  )
}