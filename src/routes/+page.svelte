<script lang="ts">
  import Lux from "@phoxia/lux/svelte";
  import Search from "lucide-svelte/icons/search";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases } from "$lib/releases/catalog";
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Public release history across the Phoxia ecosystem." /></svelte:head>

<main id="main">
  <section class="shell hero">
    <div class="hero-row">
      <div><div class="eyebrow mono">ECOSYSTEM CHANGELOG</div><h1>Changelog</h1><p class="lead">Releases across the Phoxia ecosystem, newest first. A calm chronological list; only products with public releases appear.</p></div>
      <Lux expression="neutral" size={44} />
    </div>
    <label class="search"><Search size={16} aria-hidden="true" /><input type="search" placeholder="Search all releases" aria-label="Search all releases" /></label>
  </section>
  <section class="shell products">
    <div class="section-label mono">Products with public releases</div>
    <div class="product">
      <div class="product-head"><span class="product-name">Phoxia Kit</span><span class="channel mono">stable</span></div>
      <div class="product-meta"><span class="version mono">v{releases[0].version}</span><time class="date" datetime={releases[0].date}>{releases[0].date}</time><a class="product-link" href="/kit">All Kit releases →</a></div>
    </div>
  </section>
  <section class="shell timeline"><div class="rail">{#each releases as release (release.version)}<ReleaseCard {release} />{/each}<p class="archive mono">Only products with public releases are shown.</p></div></section>
</main>

<style>.channel { padding: 2px 8px; border: 1px solid color-mix(in srgb, #28c840 40%, var(--border)); border-radius: 999px; color: #28c840; font-size: 10px; }</style>
