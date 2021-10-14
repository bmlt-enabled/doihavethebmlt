<script>
  export let active;
  export let onSearch;
  export let onError;

  let modal;
  let value;

  $: {
    if (modal && active) {
      document.body.appendChild(modal);
    }
  }

  function handleSearch() {
    if (value) {
      let url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyBiYze0yzbraSghRqXvK1_oAtQlqe9n594&address=${value}&sensor=false`;
      fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.status !== 'OK') {
            console.log(response.status);
            onError('bad');
            return;
          }
          onSearch({
            coords: {
              latitude: response.results[0].geometry.location.lat,
              longitude: response.results[0].geometry.location.lng
            }
          });
          value = '';
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }
  }
</script>

<div class="modal" class:is-active={active} bind:this={modal}>
  <div class="modal-background" />
  <div class="modal-content">
    <div class="field has-addons">
      <div class="control is-expanded">
        <input class="input is-light" type="text" bind:value />
      </div>
      <div class="control">
        <button class="button is-light" on:click={handleSearch}>Search</button>
      </div>
    </div>
  </div>
</div>
