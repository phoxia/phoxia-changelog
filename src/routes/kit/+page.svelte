<script lang="ts">
  import Lux from "@phoxia/lux/svelte";
  import Search from "lucide-svelte/icons/search";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases } from "$lib/releases/catalog";
  const kitReleases = releases.filter((release) => release.product === "kit");
</script>

<svelte:head><title>Phoxia • Kit changelog</title><meta name="description" content="Every verified Phoxia Kit release, newest first." /></svelte:head>

<main id="main">
  <section class="shell hero">
    <a class="back" href="/">← All products</a>
    <div class="hero-row">
      <div><div class="eyebrow mono">KIT · CHANGELOG</div><h1>Phoxia Kit releases</h1><p class="lead">Every Phoxia Kit release, newest first, with verified release evidence.</p></div>
      <Lux expression="neutral" size={44} />
    </div>
    <label class="search"><Search size={16} aria-hidden="true" /><input type="search" placeholder="Search Kit releases" aria-label="Search Kit releases" /></label>
  </section>
  <section class="shell filters"><span class="filter">Kit</span></section>
  <section class="shell timeline"><div class="rail">{#each kitReleases as release (release.version)}<ReleaseCard {release} />{/each}<p class="archive mono">All verified Kit releases are shown.</p></div></section>
</main>
