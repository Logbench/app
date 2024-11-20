<script lang="ts">
  import Self from './ObjectTree.svelte'

  let {
    value: topValue,
    i,
    isInArray
  } = $props<{ isInArray?: boolean; value: unknown | object | object[]; i: number }>()

  let isOpen = $state(true)
</script>

<div class="pl-4 font-mono">
  {#if Array.isArray(topValue)}
    <div>
      {#each topValue as nextValue, indexA}
        <Self value={nextValue} isInArray i={indexA} />
      {/each}
    </div>
  {:else if typeof topValue === 'object'}
    <div>
      <button
        on:click={() => {
          isOpen = !isOpen
        }}>{isOpen ? `${i}: {` : `${i}: `}</button
      >

      {#if isOpen}
        <div>
          {#each Object.entries(topValue) as [key, value], indexB}
            {#if typeof value === 'object'}
              <div class="pl-4">
                <button
                  type="button"
                  on:click={() => {
                    isOpen = !isOpen
                  }}
                >
                  {key}: {isOpen ? (Array.isArray(value) ? '[' : '{') : ''}
                </button>

                {#if Array.isArray(value)}
                  {#if isOpen}
                    <div>
                      {#each value as nextValue, indexC}
                        <Self isInArray value={nextValue} i={indexC} />
                      {/each}

                      <p>{']'}</p>
                    </div>
                  {/if}
                {:else if isOpen}
                  <div>
                    <Self {value} i={indexB} />

                    <p>{'}'}</p>
                  </div>
                {/if}
              </div>
            {:else}
              <div class="flex items-center pl-4">
                <p>{key}:&nbsp;</p>
                <p>{value}</p>
              </div>
            {/if}
          {/each}

          <p>{'}'}</p>
        </div>
      {:else}
        <button
          on:click={() => {
            isOpen = !isOpen
          }}>{'{...}'}</button
        >
      {/if}
    </div>
  {:else}
    <p>{i}: {topValue}</p>
  {/if}
</div>
