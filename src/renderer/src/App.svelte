<script lang="ts">
  import { FAKE_LOGS } from './constants/logs'
  import Log from './components/Log.svelte'
  import ShippingBoxFill from './icons/ShippingBoxFill.svelte'
  import { FAKE_PROJECTS } from './constants/projects'
  import cn from './utils/classnames'
  import SidebarLeft from './icons/SidebarLeft.svelte'
  import Plus from './icons/Plus.svelte'
  import MagnifyingGlass from './icons/MagnifyingGlass.svelte'
  import { fade } from 'svelte/transition'

  let search = $state('')

  let filteredProjects = $derived(
    FAKE_PROJECTS.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
  )
</script>

<div class="h-screen flex divide-x divide-border items-start">
  <aside class="flex-1 max-w-56">
    <div class="pl-24 items-center h-[52px] flex item-center gap-3 drag">
      <button
        type="button"
        title="Toggle sidebar"
        class="no-drag group rounded-md hover:bg-foreground/10 transition duration-700 px-[9px] py-2"
      >
        <SidebarLeft
          class="fill-foreground/30 group-hover:fill-foreground transition duration-700 w-6"
        />
      </button>
    </div>

    <div class="space-y-3">
      <div class="px-3">
        <div class="relative">
          <MagnifyingGlass
            class="w-3.5 fill-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
          />

          <input
            type="text"
            bind:value={search}
            id="search-projects"
            placeholder="Search"
            class="w-full rounded-md py-1 pl-8 pr-2 bg-foreground/5 placeholder-foreground/30 focus:outline-none focus:ring-2 ring-primary/25"
          />
        </div>
      </div>

      <div class="px-3 space-y-1.5 w-full">
        <div class="flex items-center justify-between">
          <p class="text-foreground/30 text-sm font-medium mx-2">Projects</p>

          <button type="button" title="New project" class="group px-1 py-1 -my-1">
            <Plus
              class="fill-foreground/30 group-hover:fill-foreground transition duration-700 w-3.5"
            />
          </button>
        </div>

        <div class="-space-y-0.5">
          {#each filteredProjects as project, i}
            <button
              transition:fade={{ duration: 50 }}
              class={cn(
                'flex items-center gap-2.5 text-left py-1.5 px-3 w-full rounded-md',
                !i && 'bg-white/10'
              )}
            >
              <ShippingBoxFill class="w-4 fill-primary" />

              <p class="line-clamp-1">{project.name}</p>
            </button>
          {/each}
        </div>
      </div>
    </div>
  </aside>

  <div class="h-screen flex flex-col flex-1 bg-background divide-y-[0.5px] divide-border">
    <div class="px-6 py-3 drag bg-background-lighter flex flex-col justify-center gap-1.5">
      <p class="text-[15px] font-medium leading-none">frontend-logbench</p>
      <p class="text-sm text-foreground-muted leading-none">{FAKE_LOGS.length} logs</p>
    </div>

    <div class="flex-1 overflow-y-auto divide-y divide-border-light">
      {#each FAKE_LOGS as log}
        <Log {log} />
      {/each}
    </div>
  </div>
</div>
