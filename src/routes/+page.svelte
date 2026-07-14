<script lang="ts">
  import luxNeutral from "@phoxia/lux/assets/lux/lux-neutral.svg?url";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases, releaseState } from "$lib/releases/catalog";
  const state = releaseState(releases);
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Public release history across the Phoxia ecosystem." /></svelte:head>

<main id="main">
  <section class="shell hero">
    <div class="hero-row">
      <div><div class="eyebrow mono">ECOSYSTEM CHANGELOG</div><h1>Changelog</h1><p class="lead">Releases across the Phoxia ecosystem, newest first. A calm chronological list; only products with public releases appear.</p></div>
      <img src={luxNeutral} alt="Lux" width="44" height="44" />
    </div>
  </section>
  {#if state.empty}
    <section class="shell empty"><h2>No public releases yet</h2><p>Published releases will appear here.</p></section>
  {:else}
  <section class="shell products">
    <div class="section-label mono">Products with public releases</div>
    {#each state.products as product (product.product)}<div class="product"><div class="product-head"><span class="product-name">{product.name}</span></div><div class="product-meta"><span class="version mono">v{product.version}</span><time class="date" datetime={product.date}>{product.date}</time><a class="product-link" href={`/${product.product}`}>All releases →</a></div></div>{/each}
  </section>
  <section class="shell timeline"><div class="rail">{#each releases as release (release.version)}<ReleaseCard {release} />{/each}<p class="archive mono">Only products with public releases are shown.</p></div></section>
  {/if}
</main>
