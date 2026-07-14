<script lang="ts">
  import luxHappy from "@phoxia/lux/assets/lux/lux-happy.svg?url";
  import Monitor from "lucide-svelte/icons/monitor";
  import Moon from "lucide-svelte/icons/moon";
  import Sun from "lucide-svelte/icons/sun";
  import { onMount } from "svelte";

  type Theme = "system" | "light" | "dark";
  let theme = $state<Theme>("system");
  let themeOpen = $state(false);

  function applyTheme(value: Theme) {
    theme = value;
    try { localStorage.setItem("phoxia-changelog-theme", value); } catch {}
    document.documentElement.dataset.theme = value === "system"
      ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : value;
    themeOpen = false;
  }

  onMount(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("phoxia-changelog-theme"); } catch {}
    applyTheme(stored === "light" || stored === "dark" ? stored : "system");
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => theme === "system" && applyTheme("system");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  });
</script>

<header>
  <div class="bar">
    <a class="brand" href="/" aria-label="Phoxia Changelog home">
      <img src={luxHappy} alt="" width="24" height="24" aria-hidden="true" />
      <strong>Phoxia Changelog</strong>
      <span class="host mono">changelog.phoxia.org</span>
    </a>
    <nav aria-label="Utility">
      <a href="https://docs.phoxia.org">Docs</a>
      <div class="menu"><button aria-label="Theme" aria-expanded={themeOpen} onclick={() => themeOpen = !themeOpen}>{#if theme === "light"}<Sun size={16} />{:else if theme === "dark"}<Moon size={16} />{:else}<Monitor size={16} />{/if}</button>{#if themeOpen}<div class="themes"><button aria-pressed={theme === "system"} onclick={() => applyTheme("system")}><Monitor size={15} />System</button><button aria-pressed={theme === "light"} onclick={() => applyTheme("light")}><Sun size={15} />Light</button><button aria-pressed={theme === "dark"} onclick={() => applyTheme("dark")}><Moon size={15} />Dark</button></div>{/if}</div>
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
  nav a, button { min-width: 44px; min-height: 44px; padding: 6px 11px; justify-content: center; border: 1px solid var(--border); border-radius: 9px; color: var(--text); background: transparent; font-size: 13px; text-decoration: none; cursor: pointer; }
  nav a:hover, button:hover { border-color: var(--border-strong); }
  .menu { position: relative; }
  .themes { position: absolute; top: calc(100% + 8px); right: 0; display: grid; min-width: 130px; padding: 6px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface); box-shadow: 0 12px 30px rgba(0,0,0,.3); }
  .themes button { gap: 8px; border: 0; }
  .themes button[aria-pressed="true"] { background: var(--surface2); }
  @media (max-width: 600px) { .host { display: none; } .brand strong { font-size: 14px; } }
</style>
