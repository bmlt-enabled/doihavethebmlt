<script>
  import BMLTDetector from '$lib/BMLTDetector.svelte';
</script>

<svelte:head>
  <title>Do I have the BMLT?</title>
  <script src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" data-auto-a11y="true"></script>
</svelte:head>

<section class="section p-5">
  <div class="container">
    <div class="card p-5">
      <h2 class="title is-2">Do I have the BMLT?</h2>
      <BMLTDetector />
    </div>
  </div>
</section>

<style>
  .container {
    max-width: 700px;
  }
</style>
