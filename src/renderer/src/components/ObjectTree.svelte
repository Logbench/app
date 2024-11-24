<script lang="ts">
  import cn from '../utils/classnames'
  import Self from './ObjectTree.svelte'

  let { json, depth = Infinity, _cur = 0, _last = true, search = '' } = $props()

  let items = $state([])
  let isArray = $state(false)
  let brackets = $state(['', ''])
  let collapsed = $state(false)

  /**
   * @param {*} i
   * @returns {string}
   */
  function getType(i: unknown): string {
    if (i === null) return 'null'
    return typeof i
  }

  /**
   * @param {*} i
   * @returns {string}
   */
  function stringify(i: unknown): string {
    return JSON.stringify(i)
  }

  /**
   * @param {*} i
   * @returns {string}
   */
  function format(i: unknown): string {
    switch (getType(i)) {
      case 'function':
        return 'f () {...}'
      case 'symbol':
        return i.toString()
      default:
        return stringify(i)
    }
  }

  function clicked(): void {
    collapsed = !collapsed
  }

  /**
   * @param {Event} e
   */
  function pressed(e: unknown): void {
    if (e instanceof KeyboardEvent && ['Enter', ' '].includes(e.key)) clicked()
  }

  $effect(() => {
    items = getType(json) === 'object' ? Object.keys(json) : []
    isArray = Array.isArray(json)
    brackets = isArray ? ['[', ']'] : ['{', '}']
  })

  //$: {
  //}

  $effect(() => {
    collapsed = depth < _cur
  })
</script>

{#if !items.length}
  <span class="_jsonBkt empty" class:isArray>{brackets[0]}{brackets[1]}</span>{#if !_last}<span
      class="_jsonSep">,</span
    >{/if}
{:else if collapsed}
  <span
    class="_jsonBkt"
    class:isArray
    role="button"
    tabindex="0"
    onclick={clicked}
    onkeydown={pressed}>{brackets[0]}...{brackets[1]}</span
  >{#if !_last && collapsed}<span class="_jsonSep">,</span>{/if}
{:else}
  <span
    class="_jsonBkt"
    class:isArray
    role="button"
    tabindex="0"
    onclick={clicked}
    onkeydown={pressed}>{brackets[0]}</span
  >
  <ul class="_jsonList">
    {#each items as i, idx}
      <li>
        {#if !isArray}
          <span class={cn('_jsonKey', i === search && 'bg-yellow-500')}>{stringify(i)}</span><span
            class="_jsonSep">:</span
          >
        {/if}
        {#if getType(json[i]) === 'object'}
          <Self json={json[i]} {depth} _cur={_cur + 1} _last={idx === items.length - 1} />
        {:else}
          <span class="_jsonVal {getType(json[i])}">{format(json[i])}</span
          >{#if idx < items.length - 1}<span class="_jsonSep">,</span>{/if}
        {/if}
      </li>
    {/each}
  </ul>
  <span
    class="_jsonBkt"
    class:isArray
    role="button"
    tabindex="0"
    onclick={clicked}
    onkeydown={pressed}>{brackets[1]}</span
  >{#if !_last}<span class="_jsonSep">,</span>{/if}
{/if}

<style>
  :where(._jsonList) {
    list-style: none;
    margin: 0;
    padding: 0;
    padding-left: var(--jsonPaddingLeft);
    border-left: var(--jsonBorderLeft);
    text-wrap: nowrap;
  }
  :where(._jsonBkt) {
    color: hsl(var(--jsonBracketColor));
    border-radius: 4px;
    padding-block: 5px;
    padding-inline: 2px;
    margin-inline: -2px;
    margin-block: -5px;
    text-wrap: nowrap;
  }
  :where(._jsonBkt):not(.empty):hover {
    background: hsl(var(--jsonBracketHoverBackground));
    text-wrap: nowrap;
  }
  :where(._jsonSep) {
    color: hsl(var(--jsonSeparatorColor));
    text-wrap: nowrap;
  }
  :where(._jsonKey) {
    color: hsl(var(--jsonKeyColor));
    text-wrap: nowrap;
  }
  :where(._jsonVal) {
    color: hsl(var(--jsonValColor));
    text-wrap: nowrap;
  }
  :where(._jsonVal).string {
    color: hsl(var(--jsonValStringColor));
    text-wrap: nowrap;
  }
  :where(._jsonVal).number {
    color: hsl(var(--jsonValNumberColor));
    text-wrap: nowrap;
  }
  :where(._jsonVal).boolean {
    color: hsl(var(--jsonValBooleanColor));
    text-wrap: nowrap;
  }
</style>
