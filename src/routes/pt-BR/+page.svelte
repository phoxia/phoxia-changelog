<script lang="ts">
  import luxNeutral from "@phoxia/lux/assets/lux/lux-neutral.svg?url";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releaseKey, releases, releaseState } from "$lib/releases/catalog";
  const state = releaseState(releases);
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Histórico público de versões do ecossistema Phoxia." /></svelte:head>

<main id="main">
  <section class="shell hero">
    <p class="notice" role="status">Esta página ainda não está disponível em português. Exibindo a versão em inglês.</p>
    <div class="hero-row"><div><div class="eyebrow mono">ECOSYSTEM CHANGELOG</div><h1>Changelog</h1><p class="lead">Releases across the Phoxia ecosystem, newest first. A calm chronological list; only products with public releases appear.</p></div><img src={luxNeutral} alt="Lux" width="44" height="44" /></div>
  </section>
  <section class="shell products"><div class="section-label mono">Products with public releases</div>{#each state.products as product (product.product)}<div class="product"><div class="product-head"><span class="product-name">{product.name}</span></div><div class="product-meta"><span class="version mono">v{product.version}</span><time class="date" datetime={product.date}>{product.date}</time><a class="product-link" href={`/pt-BR/${product.product}`}>All releases →</a></div></div>{/each}</section>
  <section class="shell timeline"><div class="rail">{#each releases as release (releaseKey(release))}<ReleaseCard {release} locale="/pt-BR" />{/each}</div></section>
</main>

<style>.notice { margin: 0 0 22px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--amber) 28%, var(--border)); border-radius: 11px; background: color-mix(in srgb, var(--amber) 8%, var(--surface)); color: var(--muted); font-size: 13px; }</style>
