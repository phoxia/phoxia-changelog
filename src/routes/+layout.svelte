<script lang="ts">
  import "../app.css";
  import favicon from "@phoxia/lux/assets/favicon/favicon.svg?url";
  import appleTouchIcon from "@phoxia/lux/assets/favicon/apple-touch-icon.png?url";
  import Header from "$lib/components/Header.svelte";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <link rel="apple-touch-icon" href={appleTouchIcon} />
  <link rel="manifest" href="/manifest.webmanifest" />
  <meta name="theme-color" content="#080914" />
</svelte:head>

<a class="skip-link" href="#main">Skip to releases</a>
<Header />
{@render children()}
