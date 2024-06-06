<script lang="ts">
    import { onMount } from 'svelte';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    import MoreInfo from '$lib/MoreInfo.svelte';
    import SearchShare from '$lib/SearchShare.svelte';
    import LocationInputModal from '$lib/LocationInputModal.svelte';

    let rootServerUrl: string | undefined;
    let meetingDistanceInMiles: number | undefined;
    let meetingDistanceInKilometers: number | undefined;
    let latitude: number | undefined;
    let longitude: number | undefined;

    const progressTotalSteps: number = 4;
    let progressText: string = '';
    let progressStep = tweened(0, {
        duration: 400,
        easing: cubicOut
    });

    let locationModalActive: boolean = false;

    interface GeolocationCoordinates {
        latitude: number;
        longitude: number;
    }

    interface GeolocationPosition {
        coords: GeolocationCoordinates;
        timestamp: number;
    }

    interface GeolocationPositionError {
        code: number;
        message: string;
    }

    async function getPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 15000,
                maximumAge: 60000
            })
        );
    }

    async function doSearch(position?: GeolocationPosition) {
        await progressStep.set(1);
        progressText = 'Determining location...';

        if (!position) {
            let urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has('latitude') && urlParams.has('longitude')) {
                position = {
                    coords: {
                        latitude: parseFloat(urlParams.get('latitude')!),
                        longitude: parseFloat(urlParams.get('longitude')!)
                    },
                    timestamp: Date.now()
                };
            } else {
                try {
                    position = await getPosition();
                } catch (error) {
                    if ((error as GeolocationPositionError).code !== undefined) {
                        locationModalActive = true;
                        return;
                    }
                }
            }
        }

        if (position) {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;

            try {
                await progressStep.set(2);
                progressText = 'Finding nearest meeting...';
                let httpOptions = { headers: { 'user-agent': navigator.userAgent + ' +dihtbmlt' } };
                let meetingsResponse = await fetch(
                    `https://aggregator.bmltenabled.org/main_server/client_interface/json/?switcher=GetSearchResults&lat_val=${latitude}&long_val=${longitude}&geo_width=-1`,
                    httpOptions
                );
                let meetings = await meetingsResponse.json();
                let meeting = meetings[0];
                meetingDistanceInMiles = Math.round(meeting.distance_in_miles);
                meetingDistanceInKilometers = Math.round(meeting.distance_in_km);

                await progressStep.set(3);
                progressText = 'Retrieving root server url...';
                let rootServersResponse = await fetch(`https://aggregator.bmltenabled.org/main_server/api/v1/rootservers/${meeting.root_server_id}/`, httpOptions);
                let root_server = await rootServersResponse.json();
                rootServerUrl = root_server.url;

                await progressStep.set(4);
                progressText = '';
            } catch (error) {
                if ((error as GeolocationPositionError).code !== undefined) {
                    locationModalActive = true;
                    return;
                }
                progressText = `Error: ${(error as Error).message}`;
                console.log('Error:', error);
            }
        }
    }

    function handleSearchAgainClick() {
        locationModalActive = true;
    }

    function handleLocationInput(data: { coords: { latitude: number; longitude: number } }) {
        locationModalActive = false;
        doSearch({
            coords: {
                latitude: data.coords.latitude,
                longitude: data.coords.longitude
            },
            timestamp: Date.now()
        });
    }

    function handleLocationInputCancel() {
        console.log('cancelled');
        locationModalActive = false;
        if ($progressStep != progressTotalSteps) {
            progressStep.set(-1);
        }
    }

    function handleLocationInputError(error: Error) {
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
{:else if meetingDistanceInMiles !== undefined && meetingDistanceInMiles < 100}
    <div class="content">
        <h4>Yes!</h4>
        <p>
            The nearest meeting in our database is {meetingDistanceInMiles}mi ({meetingDistanceInKilometers}km) from you, so we think your local service body probably is using the BMLT. If you don't
            think this is the case, follow the links below to learn more about how to get started!
        </p>
        <MoreInfo title="How do I learn more about the BMLT?" />
        {#if latitude !== undefined && longitude !== undefined}
            <SearchShare {latitude} {longitude} />
        {/if}
        <button class="button is-fullwidth" on:click={handleSearchAgainClick}>Search for Another Location</button>
    </div>
    <div class="box is-shadowless p-3 m-0">
        <p class="is-size-7">Root server: {rootServerUrl}</p>
    </div>
{:else}
    <div class="content">
        <h4>No ☹</h4>
        <p>
            The nearest meeting in our database is {meetingDistanceInMiles ?? 'unknown'}mi ({meetingDistanceInKilometers ?? 'unknown'}km) from you, so your local service body probably is not using the
            BMLT.
        </p>
        <MoreInfo title="I want to use the BMLT. How do I get started?" />
        {#if latitude !== undefined && longitude !== undefined}
            <SearchShare {latitude} {longitude} />
        {/if}
    </div>
{/if}

<LocationInputModal bind:active={locationModalActive} onSearch={handleLocationInput} onCancel={handleLocationInputCancel} onError={handleLocationInputError} />
