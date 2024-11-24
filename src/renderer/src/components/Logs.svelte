<script lang="ts">
  import type { PaneAPI } from 'paneforge'
  import { FAKE_LOGS } from '../constants/logs'
  import MagnifyingGlass from '../icons/MagnifyingGlass.svelte'
  import SidebarLeft from '../icons/SidebarLeft.svelte'
  import cn from '../utils/classnames'
  import Log from './Log.svelte'
  import { createQuery } from '@tanstack/svelte-query'
  import { type Log as ILog } from '../types/log'
  import { queryClient } from '../lib/tanstack-query'

  let { sidebar, isSidebarOpen }: { sidebar: PaneAPI; isSidebarOpen: boolean } = $props()

  let list: HTMLElement = $state()

  const projectId = 'cm3sidba50000c56pqqhynapp'

  const query = createQuery({
    queryKey: ['projects', projectId, 'logs'],
    queryFn: () => window.api.getProjectLogs(projectId)
  })

  $effect(() => {
    window.api.onNewLog((value: ILog) => {
      const queryData = queryClient.getQueryData<ILog[]>(['projects', projectId, 'logs'])
      queryClient.setQueryData(['projects', projectId, 'logs'], [...queryData, value])
    })
  })

  let hasScrolledInitially = $state(false)
  let isAtBottom = $state(false)

  $effect.pre(() => {
    if (list && $query.data?.length && (!hasScrolledInitially || isAtBottom)) {
      setTimeout(() => {
        list.scroll({
          top: list.scrollHeight,
          behavior: hasScrolledInitially ? 'smooth' : 'instant'
        })
        if (!hasScrolledInitially) {
          hasScrolledInitially = true
        }
      }, 0)
    }
  })
</script>

<div
  class={cn(
    'drag flex items-center justify-between gap-3 py-3',
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
      <p class="text-[15px] font-medium leading-none">frontend-logbench</p>
      <p class="text-sm text-foreground-muted leading-none">{FAKE_LOGS.length} logs</p>
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
  onscroll={(e): void => {
    if (hasScrolledInitially) {
      const scrollTop = e.currentTarget.scrollTop
      const scrollHeight = e.currentTarget.scrollHeight
      const clientHeight = e.currentTarget.clientHeight

      const tolerance = 1

      if (scrollTop + clientHeight >= scrollHeight - tolerance) {
        if (!isAtBottom) {
          isAtBottom = true
        }
      } else {
        isAtBottom = false
      }
    }
  }}
  class="flex-1 overflow-y-auto rounded-lg p-4"
  bind:this={list}
>
  <div
    class="border border-border-light bg-background-lighter divide-y divide-border-light rounded-lg"
  >
    <div class="grid grid-cols-4">
      <div class="p-2">
        <p>Date</p>
      </div>
      <div class="p-2">
        <p>Client</p>
      </div>
      <div class="p-2">
        <p>File</p>
      </div>
      <div class="p-2">
        <p>Content</p>
      </div>
    </div>

    <button
      onclick={() => {
        window.api.openProjectLogStream(projectId)
      }}>Open stream</button
    >

    {#if $query.isLoading}
      <p>Loading...</p>
    {:else if $query.isError}
      <p>Error: {$query.error.message}</p>
    {:else if $query.isSuccess}
      {#each $query.data as log}
        <Log {log} />
      {/each}
    {/if}
  </div>
</div>
