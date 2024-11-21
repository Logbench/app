<script lang="ts">
  import { format } from 'date-fns'
  import { isObjectLike } from '../utils/is-object-like'
  import ObjectTree from './ObjectTree.svelte'
  import type { Log } from '../types/log'

  let { log }: { log: Log } = $props()

  let isCopied: boolean = $state(false)
</script>

<div class="py-3 px-4 flex items-start justify-between">
  {#if isObjectLike(log.log) || Array.isArray(log.log)}
    <div class="json-viewer font-mono">
      <ObjectTree json={log.log} />
    </div>
  {:else}
    <p>{String(log.log)}</p>
  {/if}

  <div class="flex items-center gap-2">
    <p class="text-foreground-muted">{format(log.date, 'HH:mm:ss')}</p>

    <p class="text-foreground-muted">–</p>

    <button
      type="button"
      class="text-foreground-muted hover:text-inherit transition"
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
      }}>{isCopied ? 'Copied!' : 'Copy'}</button
    >
  </div>
</div>
