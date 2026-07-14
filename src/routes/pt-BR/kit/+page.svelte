<script lang="ts">
  import luxNeutral from "@phoxia/lux/assets/lux/lux-neutral.svg?url";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases, releaseState } from "$lib/releases/catalog";
  const kitReleases = releases.filter(({ product }) => product === "kit");
  const state = releaseState(kitReleases);
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Histórico público de versões do Phoxia DevKit." /></svelte:head>
<main id="main">
  <section class="shell hero"><a class="back" href="/pt-BR">← Todos os produtos</a><div class="hero-row"><div><div class="eyebrow mono">CHANGELOG</div><h1>{state.products[0]?.name ?? "Releases"}</h1><p class="lead">Releases publicas, mais recentes primeiro.</p></div><img src={luxNeutral} alt="Lux" width="44" height="44" /></div></section>
  <section class="shell timeline"><div class="rail">{#each kitReleases as release (release.version)}<ReleaseCard {release} locale="/pt-BR" />{/each}</div></section>
</main>