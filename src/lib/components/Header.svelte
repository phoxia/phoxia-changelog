<script lang="ts">
  import Lux from "@phoxia/lux/svelte";
  import Moon from "lucide-svelte/icons/moon";
  import Sun from "lucide-svelte/icons/sun";

  let light = $state(false);

  function toggleTheme() {
    light = !light;
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }
</script>

<header>
  <div class="bar">
    <a class="brand" href="/" aria-label="Phoxia Changelog home">
      <Lux expression="happy" size={24} />
      <strong>Phoxia Changelog</strong>
      <span class="host mono">changelog.phoxia.org</span>
    </a>
    <nav aria-label="Utility">
      <a href="https://docs.phoxia.org">Docs</a>
      <button aria-label={`Use ${light ? "dark" : "light"} theme`} onclick={toggleTheme}>
        {#if light}<Moon size={16} />{:else}<Sun size={16} />{/if}
      </button>
    </nav>
  </div>
</header>

<style>
  header { position: sticky; top: 0; z-index: 40; border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--bg) 82%, transparent); backdrop-filter: blur(14px); }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px clamp(18px, 4vw, 44px); }
  .brand, nav, nav a, button { display: flex; align-items: center; }
  .brand { min-width: 0; gap: 10px; color: var(--text); font-size: 15px; text-decoration: none; }
  .host { padding: 1px 6px; overflow: hidden; border: 1px solid var(--border); border-radius: 5px; color: var(--muted); font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
  nav { gap: 8px; }
  nav a, button { min-height: 34px; padding: 6px 11px; border: 1px solid var(--border); border-radius: 9px; color: var(--text); background: transparent; font-size: 13px; text-decoration: none; cursor: pointer; }
  nav a:hover, button:hover { border-color: var(--border-strong); }
  @media (max-width: 600px) { .host { display: none; } .brand strong { font-size: 14px; } }
</style>
