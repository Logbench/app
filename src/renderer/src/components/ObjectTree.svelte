<script lang="ts">
  let { value } = $props<{ value: object }>()

  console.log(value)
</script>

<pre>
  {JSON.stringify(value, null, 3)}
</pre>
