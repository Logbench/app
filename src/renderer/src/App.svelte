<script lang="ts">
  import { FAKE_LOGS } from './constants/logs'
  import ObjectTree from './components/ObjectTree.svelte'
  import { isObjectLike } from './utils/is-object-like'
</script>

<div class="h-10 sticky top-0 drag"></div>

{#each FAKE_LOGS as log}
  {#if isObjectLike(log)}
    <ObjectTree i={0} value={log} />
  {:else}
    <p>Coming soon</p>
  {/if}
{/each}
