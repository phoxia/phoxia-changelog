<script lang="ts">
  import type { Release } from "$lib/releases/types";

  let { release, fallback = false, locale = "" }: { release: Release; fallback?: boolean; locale?: string } = $props();
</script>

<svelte:head>
  <title>Phoxia • {release.title}</title>
  <meta name="description" content={release.summary} />
</svelte:head>

<main id="main" class="shell detail">
  {#if fallback}<p class="notice" role="status">This release is not available in Brazilian Portuguese yet. Showing the English version.</p>{/if}
  <nav class="crumbs mono" aria-label="Breadcrumb">
    <a href={locale || "/"}>All products</a><span>/</span><a href={`${locale}/${release.product}`}>Kit</a><span>/</span><span>v{release.version}</span>
  </nav>
  <header class="release-head">
    <div><h1>{release.title}</h1><p>{release.summary}</p></div>
    <time class="mono" datetime={release.date}>Released {release.date}</time>
  </header>

  <div class="content">
    <section>
      <h2 class="mono">Changes</h2>
      <ul>{#each release.changes as change}<li><span aria-hidden="true">+</span>{change}</li>{/each}</ul>

      {#if release.migration}
        <div class="panel"><h2 class="mono">Migration</h2><p>{release.migration}</p></div>
      {/if}
    </section>

    <aside>
      {#if release.compatibility}
        <section class="panel"><h2 class="mono">Compatibility</h2><p>{release.compatibility}</p></section>
      {/if}
      <section class="panel related">
        <h2 class="mono">Related</h2>
        {#if release.rfcUrl}<a href={release.rfcUrl}>RFC</a>{/if}
        <a href={release.docsUrl}>Documentation</a>
        <a href={release.sourceUrl}>Source release</a>
      </section>
    </aside>
  </div>
</main>

<style>
  .detail { padding-top: clamp(32px, 6vw, 60px); padding-bottom: clamp(48px, 7vw, 80px); }
  .notice { margin: 0 0 22px; padding: 12px 14px; border: 1px solid color-mix(in srgb, var(--amber) 28%, var(--border)); border-radius: 11px; background: color-mix(in srgb, var(--amber) 8%, var(--surface)); color: var(--muted); font-size: 13px; }
  .crumbs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; color: var(--muted); font-size: 12px; }
  .crumbs a { color: var(--muted); text-decoration: none; }
  .crumbs span:last-child { color: var(--text); }
  .release-head { display: flex; flex-wrap: wrap; align-items: baseline; gap: 12px; margin-bottom: 30px; }
  .release-head div { flex: 1 1 560px; }
  .release-head h1 { margin-bottom: 8px; }
  .release-head p { max-width: 70ch; margin: 0; color: var(--muted); font-size: 17px; }
  time { margin-left: auto; color: var(--muted); font-size: 12.5px; }
  .content { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 32px; }
  .content > section { flex: 1 1 500px; min-width: 0; }
  h2 { margin: 0 0 12px; color: var(--amber); font-size: 14px; letter-spacing: .04em; text-transform: uppercase; }
  ul { display: grid; gap: 9px; margin: 0 0 26px; padding: 0; list-style: none; }
  li { display: flex; gap: 10px; font-size: 14px; }
  li span { color: #28c840; }
  aside { display: grid; flex: 0 0 280px; gap: 12px; min-width: 260px; }
  .panel { padding: 16px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
  .panel h2 { color: var(--muted); font-size: 11px; }
  .panel p { margin: 0; font-size: 13.5px; }
  .related { display: grid; gap: 7px; }
  .related h2 { margin-bottom: 3px; }
  .related a { color: var(--muted); font-size: 13px; text-decoration: none; }
  .related a:first-of-type { color: var(--amber); }
  @media (max-width: 760px) { aside { flex-basis: 100%; } .release-head p { font-size: 15px; } }
</style>
