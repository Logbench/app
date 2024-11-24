<script lang="ts">
  import type { PaneAPI } from 'paneforge'
  import SidebarLeft from '../icons/SidebarLeft.svelte'
  import { fade } from 'svelte/transition'
  import cn from '../utils/classnames'
  import ShippingBoxFill from '../icons/ShippingBoxFill.svelte'
  import { createQuery } from '@tanstack/svelte-query'

  // Props
  let {
    sidebar,
    projectId,
    onChangeProjectId
  }: { sidebar: PaneAPI; projectId?: string; onChangeProjectId: (newProjectId: string) => void } =
    $props()

  // Server state
  const query = createQuery({
    queryKey: ['projects'],
    queryFn: () => window.api.getProjects()
  })

  let search = $state('')

  //let filteredProjects = $derived(
  //  FAKE_PROJECTS.filter((project) => project.name.toLowerCase().includes(search.toLowerCase()))
  //)
</script>

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
      onclick={() => {
        const projectName = window.prompt('Project name')

        if (projectName) {
          window.api.createProject('New project')
        }
      }}>New project</button
    >
  </div>

  <div class="px-3 space-y-1.5 w-full">
    <p class="text-foreground-muted text-sm font-medium mx-2">Projects</p>

    {#if $query.isLoading}
      <p>Loading...</p>
    {:else if $query.isError}
      <p>Error: {$query.error.message}</p>
    {:else if $query.isSuccess}
      <div class="-space-y-0.5">
        {#each $query.data as project}
          <button
            transition:fade={{ duration: 50 }}
            onclick={() => {
              onChangeProjectId(project.id)
            }}
            class={cn(
              'flex items-center gap-2.5 text-left py-1.5 px-3 w-full rounded-md',
              project.id === projectId ? 'bg-background-lightest' : 'hover:bg-background-lightest'
            )}
          >
            <ShippingBoxFill class="w-4 fill-primary" />

            <p class="truncate flex-1">{project.name}</p>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
