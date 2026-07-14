<script lang="ts">
  import "../app.css";
  import { phoxiaManifest } from "@phoxia/lux";
  import Header from "$lib/components/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="manifest" href={phoxiaManifest.manifest.href} />
  <link rel="icon" href={phoxiaManifest.favicon.href} />
  <link rel="apple-touch-icon" href={phoxiaManifest.appleTouchIcon.href} />
  <meta name="theme-color" content={phoxiaManifest.themeColor} />
</svelte:head>

<a class="skip-link" href="#main">Skip to releases</a>
<Header />
{@render children()}
