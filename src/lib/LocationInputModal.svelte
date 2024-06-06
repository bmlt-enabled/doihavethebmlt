<script lang="ts">
    export let active: boolean;
    export let onSearch: (data: { coords: { latitude: number; longitude: number } }) => void;
    export let onError: (error: Error) => void;
    export let onCancel: () => void;

    let modal: HTMLDivElement;
    let value: string;

    $: {
        if (modal && active) {
            document.body.appendChild(modal);
        }
    }

    async function handleSearch() {
        if (value) {
            try {
                let url = `https://api.geocod.io/v1.6/geocode?api_key=8a8ceea13e3cad86e8c64616d41d3333d488c66&q=${value}`;
                let response = await fetch(url);
                let results = await response.json();
                let result = results.results[0];
                onSearch({
                    coords: {
                        latitude: result.location.lat,
                        longitude: result.location.lng
                    }
                });
            } catch (error) {
                onError(error as Error);
            }
        }
    }

    function handleCancel() {
        onCancel();
    }

    function keySubmit(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            handleSearch();
        }
    }

    function handleBackgroundKey(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            handleCancel();
        }
    }
</script>

<div class="modal" class:is-active={active} bind:this={modal}>
    <div class="modal-background" role="button" tabindex="0" on:click={handleCancel} on:keydown={handleBackgroundKey} />
    <div class="modal-content p-5">
        <div class="field has-addons">
            <div class="control is-expanded">
                <input class="input is-light" type="text" on:keydown={keySubmit} bind:value placeholder="Enter City/State or Zip Code" />
            </div>
            <div class="control">
                <button class="button is-light" on:click={handleSearch}>Search</button>
            </div>
        </div>
    </div>
</div>
