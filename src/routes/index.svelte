<script>
  import BMLTDetector from '$lib/BMLTDetector.svelte';
</script>

<svelte:head>
  <title>Do I have the BMLT?</title>
  <script src="https://use.fontawesome.com/releases/v5.15.4/js/all.js" data-auto-a11y="true"></script>
  <style>
    body {
        padding-top: constant(safe-area-inset-top);
        padding-top: env(safe-area-inset-top);
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: constant(safe-area-inset-left);
        padding-left: env(safe-area-inset-left);
        padding-right: constant(safe-area-inset-right);
        padding-right: env(safe-area-inset-right);
    }
  </style>
</svelte:head>

<section class="section p-5">
  <div class="container">
    <div class="card p-5">
      <h4 class="title is-4">Do I have the BMLT?</h4>
      <BMLTDetector />
    </div>
  </div>
</section>
