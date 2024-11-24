<script lang="ts">
  import Log from './Log.svelte'
  import { type Log as ILog } from '../types/log'

  let { logs }: { logs: ILog[] } = $props()

  let list: HTMLElement = $state()

  $effect(() => {
    if (logs && list) {
      list.scroll({ top: list.scrollHeight, behavior: 'smooth' })
    }
  })
</script>

<div bind:this={list} class="h-96">
  {#each logs as log}
    <Log {log} />
  {/each}
</div>
