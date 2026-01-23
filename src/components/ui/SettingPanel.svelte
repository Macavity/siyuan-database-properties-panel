<script lang="ts">
    import FormWrap from './FormWrap.svelte';
    import FormInput from './FormInput.svelte';

    interface SettingItem {
        type: "checkbox" | "select" | "textinput" | "textarea" | "number" | "slider" | "button";
        key: string;
        value: boolean | string | number;
        title: string;
        description: string;
        direction?: "row" | "column";
        placeholder?: string;
        options?: Record<string, string>;
        slider?: { min: number; max: number; step: number };
        button?: { label: string; callback: () => void };
    }

    interface Props {
        group: string;
        settingItems: SettingItem[];
        display?: boolean;
        onSettingChange?: (group: string, key: string, value: unknown) => void;
    }

    let { group, settingItems, display = true, onSettingChange = () => {} }: Props = $props();

    const fn__none = $derived(display ? "" : "fn__none");

    const handleValueChange = (key: string, value: unknown) => {
        onSettingChange(group, key, value);
    };
</script>

<div class="config__tab-container {fn__none}" data-name={group}>
    <slot />
    {#each settingItems as item (item.key)}
        <FormWrap
            title={item.title}
            description={item.description}
            direction={item?.direction}
        >
            <FormInput
                type={item.type}
                key={item.key}
                bind:value={item.value}
                placeholder={item?.placeholder}
                options={item?.options}
                slider={item?.slider}
                button={item?.button}
                onValueChange={handleValueChange}
            />
        </FormWrap>
    {/each}
</div>
