<script lang="ts">
  import type { Release } from "$lib/releases/types";
  let { release, locale = "" }: { release: Release; locale?: string } = $props();
  const detailUrl = $derived(`${locale}/${release.product}/releases/${release.version}`);
</script>

<article>
  <span class="dot"></span>
  <div class="card">
    <div class="heading">
      <a class="title" href={detailUrl}>{release.title}</a>
      <time class="mono" datetime={release.date}>{release.date}</time>
    </div>
    <p>{release.summary}</p>
    <dl>
      <div><dt class="mono">BREAKING</dt><dd class:no={release.breaking === false}>{release.breaking ? "Yes" : "None"}</dd></div>
      {#if release.migration}<div><dt class="mono">MIGRATION</dt><dd>{release.migration}</dd></div>{/if}
      {#if release.compatibility}<div><dt class="mono">COMPATIBILITY</dt><dd>{release.compatibility}</dd></div>{/if}
    </dl>
    <div class="links">
      <a class="detail" href={detailUrl}>Release detail →</a>
      <a href={release.docsUrl}>Docs</a>
      <a href={release.sourceUrl}>Source</a>
    </div>
  </div>
</article>

<style>
  article { position: relative; margin-bottom: 16px; }
  .dot { position: absolute; top: 24px; left: -42px; z-index: 1; width: 11px; height: 11px; border-radius: 50%; background: var(--amber); box-shadow: 0 0 0 4px var(--bg); }
  .card { padding: 20px; border: 1px solid var(--border-strong); border-radius: 14px; background: var(--surface); }
  .heading { display: flex; flex-wrap: wrap; align-items: baseline; gap: 10px; margin-bottom: 8px; }
  .title { color: var(--text); font-size: 19px; font-weight: 700; letter-spacing: -0.01em; text-decoration: none; }
  time { margin-left: auto; color: var(--muted); font-size: 12px; }
  p { max-width: 70ch; margin: 0 0 14px; color: var(--muted); font-size: 14px; }
  dl { display: flex; gap: 20px; margin: 0 0 14px; font-size: 12.5px; }
  dt { margin-bottom: 2px; color: var(--muted); font-size: 10px; }
  dd { margin: 0; }
  dd.no { color: #28c840; }
  .links { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; padding-top: 12px; border-top: 1px solid var(--border); }
  .links a { color: var(--muted); font-size: 12.5px; text-decoration: none; }
  .links .detail { color: var(--amber); font-size: 13px; font-weight: 600; }
  @media (max-width: 600px) { .dot { left: -27px; } .card { padding: 16px; } .title { font-size: 17px; } time { width: 100%; margin-left: 0; } }
</style>
