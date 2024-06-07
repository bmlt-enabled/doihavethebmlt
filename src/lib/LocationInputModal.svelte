<script lang="ts">
    export let active: boolean;
    export let onSearch: (data: { coords: { latitude: number; longitude: number } }) => void;
    export let onError: (error: Error) => void;
    export let onCancel: () => void;

    const yolo: string = 'QUl6YVN5QnoxdmRudWQwTGNrTjJlLUdiVW1HVGJyb3hJTDhNRkFF';
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
                let url = `https://maps.googleapis.com/maps/api/geocode/json?key=${atob(yolo)}&address=${value}&sensor=false`;
                const response = await fetch(url);
                const results = await response.json();
                if (results.status !== 'OK') {
                    throw new Error(results.status);
                }
                const result = results.results[0];
                onSearch({
                    coords: {
                        latitude: result.geometry.location.lat,
                        longitude: result.geometry.location.lng
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
