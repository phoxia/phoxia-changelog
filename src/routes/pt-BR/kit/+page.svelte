<script lang="ts">
  import luxNeutral from "@phoxia/lux/assets/lux/lux-neutral.svg?url";
  import ReleaseCard from "$lib/components/ReleaseCard.svelte";
  import { releases, releaseState } from "$lib/releases/catalog";
  const kitReleases = releases.filter(({ product }) => product === "kit");
  const state = releaseState(kitReleases);
</script>

<svelte:head><title>Phoxia • Changelog</title><meta name="description" content="Histórico público de versões do Phoxia DevKit." /></svelte:head>
<main id="main">
  <section class="shell hero"><p class="notice" role="status">Esta página ainda não está disponível em português. Exibindo a versão em inglês.</p><a class="back" href="/pt-BR">← All products</a><div class="hero-row"><div><div class="eyebrow mono">CHANGELOG</div><h1>{state.products[0]?.name ?? "Releases"}</h1><p class="lead">Public releases, newest first.</p></div><img src={luxNeutral} alt="Lux" width="44" height="44" /></div></section>
  <section class="shell timeline"><div class="rail">{#each kitReleases as release (release.version)}<ReleaseCard {release} locale="/pt-BR" />{/each}</div></section>
</main>

<style>.notice { margin: 0 0 22px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--amber) 28%, var(--border)); border-radius: 11px; background: color-mix(in srgb, var(--amber) 8%, var(--surface)); color: var(--muted); font-size: 13px; }</style>
