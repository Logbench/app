<script lang="ts">
  import Log from './components/Log.svelte'
  import MagnifyingGlass from './icons/MagnifyingGlass.svelte'
  import Plus from './icons/Plus.svelte'
  import ShippingBoxFill from './icons/ShippingBoxFill.svelte'
  import SidebarLeft from './icons/SidebarLeft.svelte'
  import cn from './utils/classnames'
  import { FAKE_LOGS } from './constants/logs'
  import { FAKE_PROJECTS } from './constants/projects'
  import { PaneGroup, Pane, PaneResizer, type PaneAPI } from 'paneforge'
  import { fade } from 'svelte/transition'
  import PlusCircle from './icons/PlusCircle.svelte'

  let search = $state('')
  let isSidebarOpen = $state(true)

  let sidebar: PaneAPI = $state()

  let filteredProjects = $derived(
    FAKE_PROJECTS.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
  )
</script>

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
      <div class="pl-[82px] items-center h-[52px] flex item-center gap-3 drag">
        <button
          type="button"
          title="Toggle sidebar"
          class="no-drag group rounded-md hover:bg-foreground/5 transition duration-700 px-[9px] py-2"
          onclick={(): void => {
            sidebar.collapse()
          }}
        >
          <SidebarLeft class="fill-foreground/40 group-active:fill-foreground transition w-6" />
        </button>
      </div>

      <div class="space-y-4">
        <div class="px-3">
          <button
            type="button"
            id="new-project"
            class="transition duration-150 border border-border-lighter w-full rounded-md py-1 pl-8 pr-2 bg-background-lightest hover:bg-background-lightest-hover hover:border-border-lighter-hover focus:outline-none focus:ring-2 ring-primary/25 shadow shadow-background"
            >New project</button
          >
        </div>

        <div class="px-3 space-y-1.5 w-full">
          <p class="text-foreground-muted text-sm font-medium mx-2">Projects</p>

          <div class="-space-y-0.5">
            {#each filteredProjects as project}
              <button
                transition:fade={{ duration: 50 }}
                class={cn(
                  'flex items-center gap-2.5 text-left py-1.5 px-3 w-full rounded-md',
                  'focus:bg-white/10'
                )}
              >
                <ShippingBoxFill class="w-4 fill-primary" />

                <p class="truncate flex-1">{project.name}</p>
              </button>
            {/each}
          </div>
        </div>
      </div>
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
          <MagnifyingGlass
            class="w-3.5 fill-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
          />

          <input
            type="text"
            id="search-projects"
            placeholder="Search"
            class="w-48 transition-all duration-150 focus:w-64 rounded-md py-1 pl-8 pr-2 bg-transparent border border-foreground/10 placeholder-foreground/20 focus:outline-none focus:ring-2 ring-primary/25"
            style="transition-property: width;"
          />
        </div>
      </div>

      <div class="flex-1 overflow-y-auto rounded-lg p-4 space-y-3">
        {#each FAKE_LOGS as log}
          <Log {log} />
        {/each}
      </div>
    </Pane>
  </PaneGroup>
</div>
