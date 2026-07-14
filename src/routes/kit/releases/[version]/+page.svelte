<script lang="ts">
  import ReleaseDetail from "$lib/components/ReleaseDetail.svelte";
  let { data } = $props();
</script>

<ReleaseDetail release={data.release} />
