<script lang="ts">
  import { format } from 'date-fns'
  import { isObjectLike } from '../utils/is-object-like'
  import ObjectTree from './ObjectTree.svelte'
  import type { Log } from '../types/log'
  import DocumentOnDocument from '../icons/DocumentOnDocument.svelte'

  import Checkmark from '../icons/Checkmark.svelte'
  import { fade } from 'svelte/transition'

  // Context menu template
  // Handle the right-click event
  function handleContextMenu(event: MouseEvent): void {
    event.preventDefault() // Prevent the default browser context menu
    window.api.showContextMenu().catch((err: unknown) => {
      console.error('Failed to show context menu:', err)
    })
  }

  let { log }: { log: Log } = $props()

  let parsedLog = $derived.by(() => {
    let newLog = log

    if (newLog.content.startsWith('{') || newLog.content.startsWith('[')) {
      newLog = {
        ...newLog,
        content: JSON.parse(newLog.content)
      }
    }

    return newLog
  })

  let isCopied: boolean = $state(false)
</script>

<div
  transition:fade
  tabindex={-1}
  class="grid grid-cols-4 hover:bg-background-lightest"
  role="menu"
  oncontextmenu={handleContextMenu}
>
  <div class="p-2">
    <p class="text-foreground-muted truncate">
      {parsedLog.createdAt
        ? format(new Date(parsedLog.createdAt), 'MMM dd yyyy HH:mm:ss:SSS')
        : 'No date'}
    </p>
  </div>

  <div class="p-2 flex items-start gap-3 overflow-x-auto">
    <button
      type="button"
      title="Copy log"
      class="group rounded-md translate-y-[3px]"
      disabled={isCopied}
      onclick={async () => {
        isCopied = true

        try {
          await navigator.clipboard.writeText(JSON.stringify(parsedLog.content, null, 2))
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

    {#if isObjectLike(parsedLog.content) || Array.isArray(parsedLog.content)}
      <div class="json-viewer font-mono">
        <ObjectTree depth={1} json={parsedLog.content} />
      </div>
    {:else}
      <p class="truncate">{String(parsedLog.content)}</p>
    {/if}
  </div>

  <div class="p-2 flex">
    <p class="text-foreground-muted truncate">{parsedLog.project?.name}</p>
  </div>

  <div class="p-2">
    <p class="text-foreground-muted truncate">tree.tsx:2031:12</p>
  </div>
</div>
