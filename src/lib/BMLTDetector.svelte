<script>
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  import MoreInfo from '$lib/MoreInfo.svelte';
  import SearchShare from '$lib/SearchShare.svelte';
  import LocationInputModal from '$lib/LocationInputModal.svelte';

  let rootServerUrl;
  let meetingDistanceInMiles;
  let meetingDistanceInKilometers;
  let latitude;
  let longitude;

  const progressTotalSteps = 4;
  let progressText = '';
  let progressStep = tweened(0, {
    duration: 400,
    easing: cubicOut
  });

  let locationModalActive = false;

  function getPosition() {
    return new Promise((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 15000,
        maximumAge: 60000
      })
    );
  }

  async function doSearch(position) {
    progressStep.set(1);
    progressText = 'Determining location...';

    if (!position) {
      let urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('latitude') && urlParams.has('longitude')) {
        position = {
          coords: {
            latitude: latitude,
            longitude: longitude
          }
        };
      } else {
        position = await getPosition();
      }
    }

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    try {
      progressStep.set(2);
      progressText = 'Finding nearest meeting...';
      let httpOptions = { headers: { 'user-agent': navigator.userAgent + ' +dihtbmlt' } };
      let meetingsResponse = await fetch(
        `https://tomato.bmltenabled.org/main_server/client_interface/json/?switcher=GetSearchResults&lat_val=${latitude}&long_val=${longitude}&geo_width=-1`,
        httpOptions
      );
      let meetings = await meetingsResponse.json();
      let meeting = meetings[0];
      meetingDistanceInMiles = Math.round(meeting.distance_in_miles);
      meetingDistanceInKilometers = Math.round(meeting.distance_in_km);

      progressStep.set(3);
      progressText = 'Retrieving root server url...';
      let rootServersResponse = await fetch(`https://tomato.bmltenabled.org/rest/v1/rootservers/${meeting.root_server_id}/`, httpOptions);
      let root_server = await rootServersResponse.json();
      rootServerUrl = root_server.root_server_url;

      progressStep.set(4);
      progressText = '';
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        locationModalActive = true;
        return;
      }
      progressText = `Error: ${error.message}`;
      console.log('Error:', error);
    }
  }

  function handleSearchAgainClick() {
    locationModalActive = true;
  }

  function handleLocationInput(position) {
    locationModalActive = false;
    doSearch(position);
  }

  function handleLocationInputCancel() {
    console.log('cancelled');
    locationModalActive = false;
    if ($progressStep != progressTotalSteps) {
      progressStep.set(-1);
    }
  }

  function handleLocationInputError(error) {
    locationModalActive = false;
    progressText = `Error: ${error.message}`;
  }

  onMount(() => {
    doSearch();
  });
</script>

{#if $progressStep < 0}
  <MoreInfo title="How do I learn more about the BMLT?" />
  <button class="button is-fullwidth" on:click={handleSearchAgainClick}>Search for a Location</button>
{:else if $progressStep < progressTotalSteps}
  <progress class="progress is-medium" value={$progressStep} max={progressTotalSteps} />
  <div class="has-text-centered">{progressText}</div>
{:else if meetingDistanceInMiles < 100}
  <div class="content">
    <h4>Yes!</h4>
    <p>
      The nearest meeting in our database is {meetingDistanceInMiles}mi ({meetingDistanceInKilometers}km) from you, so we think your local service body probably is using the BMLT. If you don't think
      this is the case, follow the links below to learn more about how to get started!
    </p>
    <MoreInfo title="How do I learn more about the BMLT?" />
    <SearchShare {latitude} {longitude} />
    <button class="button is-fullwidth" on:click={handleSearchAgainClick}>Search for Another Location</button>
  </div>
  <div class="box is-shadowless p-3 m-0">
    <p class="is-size-7">Root server: {rootServerUrl}</p>
  </div>
{:else}
  <div class="content">
    <h4>No ☹</h4>
    <p>
      The nearest meeting in our database is {meetingDistanceInMiles}mi ({meetingDistanceInKilometers}km) from you, so your local service body probably is not using the BMLT.
    </p>
    <MoreInfo title="I want to use the BMLT. How do I get started?" />
    <SearchShare {latitude} {longitude} />
  </div>
{/if}

<LocationInputModal bind:active={locationModalActive} onSearch={handleLocationInput} onCancel={handleLocationInputCancel} onError={handleLocationInputError} />
