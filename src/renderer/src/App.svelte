<script lang="ts">
  import { PaneGroup, Pane, PaneResizer, type PaneAPI } from 'paneforge'
  import { QueryClientProvider } from '@tanstack/svelte-query'
  import Sidebar from './components/Sidebar.svelte'
  import Logs from './components/Logs.svelte'
  import { queryClient } from './lib/tanstack-query'

  // Local state
  let projectId: string = $state()
  let sidebar: PaneAPI = $state()
  let isSidebarOpen = $state(true)
</script>

<QueryClientProvider client={queryClient}>
  <div class="h-screen">
    <PaneGroup direction="horizontal" class="h-full" autoSaveId="@layouts/main">
      <Pane
        bind:pane={sidebar}
        collapsible
        minSize={20}
        defaultSize={20}
        maxSize={40}
        onCollapse={() => {
          isSidebarOpen = false
        }}
        onExpand={() => {
          isSidebarOpen = true
        }}
        class="bg-background-lighter"
      >
        <Sidebar
          {sidebar}
          {projectId}
          onChangeProjectId={(newProjectId) => {
            projectId = newProjectId
          }}
        />
      </Pane>

      <PaneResizer
        class="px-1 -mx-1 flex items-center justify-center z-10"
        ondblclick={() => {
          sidebar.resize(20)
        }}
      >
        <div class="w-px h-full bg-border-light"></div>
      </PaneResizer>

      <Pane class="flex flex-col">
        {#if projectId}
          <Logs {projectId} {sidebar} {isSidebarOpen} />
        {/if}
      </Pane>
    </PaneGroup>
  </div>
</QueryClientProvider>
