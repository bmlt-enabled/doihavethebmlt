<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        latitude: number;
        longitude: number;
    }

    let { latitude, longitude }: Props = $props();
    let copied: boolean = $state(false);
    let url: string = $state('');

    function handleCopy() {
        copied = true;
        navigator.clipboard.writeText(url);
    }

    onMount(() => {
        url = `${window.location.protocol}//${window.location.hostname}/?latitude=${latitude}&longitude=${longitude}`;
    });
</script>

<div class="content">
    <h4>Share This Search</h4>
    <div class="field has-addons">
        <div class="control is-expanded">
            <input class="input" type="text" name="url" value={url} readonly />
        </div>
        <div class="control">
            <button class="button" onclick={handleCopy}>
                {#if copied === true}
                    <span class="icon is-small">
                        <i class="far fa-copy"></i>
                    </span>
                {:else}
                    <span class="icon is-small">
                        <i class="fas fa-copy"></i>
                    </span>
                {/if}
                <span>Copy</span>
            </button>
        </div>
    </div>
</div>
