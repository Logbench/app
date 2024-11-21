<script lang="ts">
  import { format } from 'date-fns'
  import { isObjectLike } from '../utils/is-object-like'
  import ObjectTree from './ObjectTree.svelte'
  import type { Log } from '../types/log'
  import DocumentOnDocument from '../icons/DocumentOnDocument.svelte'

  import Checkmark from '../icons/Checkmark.svelte'

  // Context menu template
  // Handle the right-click event
  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault() // Prevent the default browser context menu
    window.api.showContextMenu().catch((err: unknown) => {
      console.error('Failed to show context menu:', err)
    })
  }

  let { log }: { log: Log } = $props()

  let isCopied: boolean = $state(false)
</script>

<div
  tabindex={-1}
  class="rounded-md border border-border-light bg-background-lighter shadow shadow-background"
  role="menu"
  oncontextmenu={handleContextMenu}
>
  <div class="px-3 pt-1 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <button
        type="button"
        title="Copy log"
        class="group rounded-md py-2"
        disabled={isCopied}
        onclick={async () => {
          isCopied = true

          try {
            await navigator.clipboard.writeText(JSON.stringify(log.log, null, 2))
          } catch {
            window.alert('Failed to copy to clipboard')
          }

          setTimeout(() => {
            isCopied = false
          }, 2000)
        }}
      >
        {#if isCopied}
          <Checkmark class="fill-foreground/40 w-4 h-4" />
        {:else}
          <DocumentOnDocument
            class="fill-foreground-muted group-hover:fill-foreground transition w-4 h-4"
          />
        {/if}</button
      >

      <p class="leading-none text-sm text-foreground-muted">
        {format(log.date, 'HH:mm:ss')}
      </p>
    </div>

    <p class=" leading-none text-sm text-foreground-muted/50">
      {format(log.date, 'MMM dd yyyy')}
    </p>
  </div>

  <div class="pb-3 pt-2 px-4">
    {#if isObjectLike(log.log) || Array.isArray(log.log)}
      <div class="json-viewer font-mono">
        <ObjectTree json={log.log} />
      </div>
    {:else}
      <p>{String(log.log)}</p>
    {/if}
  </div>
</div>
