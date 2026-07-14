<script lang="ts">
  import luxNeutral from "@phoxia/lux/assets/lux/lux-neutral.svg?url";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases, releaseState } from "$lib/releases/catalog";
  const kitReleases = releases.filter((release) => release.product === "kit");
  const state = releaseState(kitReleases);
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Public release history, newest first." /></svelte:head>

<main id="main">
  <section class="shell hero">
    <a class="back" href="/">← All products</a>
    <div class="hero-row">
      <div><div class="eyebrow mono">CHANGELOG</div><h1>{state.products[0]?.name ?? "Releases"}</h1><p class="lead">Public releases, newest first.</p></div>
      <img src={luxNeutral} alt="Lux" width="44" height="44" />
    </div>
  </section>
  {#if state.empty}<section class="shell empty"><h2>No public releases yet</h2><p>Published releases will appear here.</p></section>{:else}<section class="shell timeline"><div class="rail">{#each kitReleases as release (release.version)}<ReleaseCard {release} />{/each}<p class="archive mono">All public releases are shown.</p></div></section>{/if}
</main>
