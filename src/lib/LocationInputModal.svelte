<script lang="ts">
    import { run } from 'svelte/legacy';

    interface Props {
        active: boolean;
        onSearch: (data: { coords: { latitude: number; longitude: number } }) => void;
        onError: (error: Error) => void;
        onCancel: () => void;
    }

    let { active = $bindable(), onSearch, onError, onCancel }: Props = $props();
    let modal: HTMLDivElement;
    let value: string = $state('');

    run(() => {
        if (modal && active) {
            document.body.appendChild(modal);
        }
    });

    async function handleSearch() {
        if (value) {
            try {
                let url = `https://geo-tz.api.bmltenabled.org/bmlt/geocode?address=${value}`;
                const response = await fetch(url);
                const results = await response.json();
                const geometry = results.geometry;
                onSearch({
                    coords: {
                        latitude: geometry.location.lat,
                        longitude: geometry.location.lng
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
    <div class="modal-background" role="button" tabindex="0" onclick={handleCancel} onkeydown={handleBackgroundKey}></div>
    <div class="modal-content p-5">
        <div class="field has-addons">
            <div class="control is-expanded">
                <input class="input is-light" type="text" onkeydown={keySubmit} bind:value placeholder="Enter City/State or Zip Code" />
            </div>
            <div class="control">
                <button class="button is-light" onclick={handleSearch}>Search</button>
            </div>
        </div>
    </div>
</div>
