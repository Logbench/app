<script lang="ts">
  import type { PaneAPI } from 'paneforge'
  import MagnifyingGlass from '../icons/MagnifyingGlass.svelte'
  import SidebarLeft from '../icons/SidebarLeft.svelte'
  import cn from '../utils/classnames'
  import Log from './Log.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { type Log as ILog } from '../types/log'
  import { queryClient } from '../lib/tanstack-query'

  // Props
  let {
    sidebar,
    projectId,
    isSidebarOpen
  }: { projectId: string; sidebar: PaneAPI; isSidebarOpen: boolean } = $props()

  // Server state
  const project = $derived(
    createQuery({
      queryKey: ['projects', projectId],
      queryFn: () => window.api.getProject(projectId)
    })
  )

  const logs = $derived(
    createQuery({
      queryKey: ['projects', projectId, 'logs'],
      queryFn: () => window.api.getProjectLogs(projectId)
    })
  )

  // Side-effects
  $effect(() => {
    window.api.onNewLog((value: ILog) => {
      const queryData = queryClient.getQueryData<ILog[]>(['projects', projectId, 'logs'])
      queryClient.setQueryData(['projects', projectId, 'logs'], [value, ...queryData])
    })
  })
</script>

<div
  class={cn(
    'drag flex items-center justify-between gap-3 py-3 h-[53px]',
    isSidebarOpen ? 'pl-6 pr-3' : 'pr-3 pl-[81px]'
  )}
>
  <div class="flex items-center gap-3">
    {#if !isSidebarOpen}
      <button
        type="button"
        title="Toggle sidebar"
        class="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
        onclick={(): void => {
          sidebar.expand()
        }}
      >
        <SidebarLeft class="fill-foreground/40 group-active:fill-foreground transition w-6" />
      </button>
    {/if}

    <div class="space-y-1.5">
      <p class="text-[15px] font-medium leading-none">{$project.data?.name}</p>
      <p class="text-sm text-foreground-muted leading-none">{$logs.data?.length} logs</p>
    </div>
  </div>

  <div class="relative no-drag">
    <MagnifyingGlass class="w-3.5 fill-foreground absolute top-1/2 left-2.5 -translate-y-1/2" />

    <input
      type="text"
      id="search-projects"
      placeholder="Search"
      class="w-48 transition-all duration-150 focus:w-64 rounded-md py-1 pl-8 pr-2 bg-transparent border border-foreground/10 placeholder-foreground/20 focus:outline-none focus:ring-2 ring-primary/25"
      style="transition-property: width;"
    />
  </div>
</div>

<div
  class="bg-background-lighter flex flex-col relative overflow-y-auto"
  style="height: calc(100% - 53px)"
>
  <div
    class="grid bg-background-lighter grid-cols-4 border-y border-border-light px-4 sticky top-0 z-10"
  >
    <div class="p-2">
      <p class="text-foreground-muted truncate">Date</p>
    </div>

    <div class="p-2">
      <p class="text-foreground-muted truncate">Client</p>
    </div>

    <div class="p-2 flex">
      <p class="text-foreground-muted truncate">File</p>
    </div>

    <div class="p-2">
      <p class="text-foreground-muted truncate">Content</p>
    </div>
  </div>

  {#if $logs.isLoading}
    <p>Loading...</p>
  {:else if $logs.isError}
    <p>Error: {$logs.error.message}</p>
  {:else if $logs.isSuccess}
    {#each $logs.data as log}
      <Log {log} />
    {/each}
  {/if}
</div>
