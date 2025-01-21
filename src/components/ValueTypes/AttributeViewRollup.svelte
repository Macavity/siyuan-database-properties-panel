<script lang="ts">
    import { type IAVCellValue } from "@/types/siyuan.types";
    import dayjs from "dayjs";

    export let value: IAVCellValue;
</script>

{#if value.type === 'block'}
    {#if value.isDetached}
        <span data-id="{value.block?.id}">
            {value.block?.content || window.siyuan.languages.untitled}
        </span>
    {:else}
        <span data-type="block-ref"
              data-id="{value.block?.id}"
              data-subtype="s"
              class="av__celltext--ref">
            {value.block?.content || window.siyuan.languages.untitled}
        </span>
    {/if}
{:else if value.type === 'text'}
    {value.text.content}
{:else if value.type === 'number'}
    {value.number.formattedContent || value.number.content.toString()}
{:else if value.type === 'date'}
    {#if value.date && value.date.isNotEmpty}
        <span class="av__celltext">
            {dayjs(value.date.content).format(value.date.isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}
            {#if value.date.hasEndDate && value.date.isNotEmpty && value.date.isNotEmpty2}
                <svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>
                {dayjs(value.date.content2).format(value.date.isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}
            {/if}
        </span>
    {/if}
{:else if value.type === 'url'}
    {#if value.url.content}
        <a class="fn__a" href="{value.url.content}" target="_blank">{value.url.content}</a>
    {/if}
{:else if value.type === 'phone'}
    {#if value.phone.content}
        <a class="fn__a" href="tel:{value.phone.content}" target="_blank">{value.phone.content}</a>
    {/if}
{:else if value.type === 'email'}
    {#if value.email.content}
        <a class="fn__a" href="mailto:{value.email.content}" target="_blank">{value.email.content}</a>
    {/if}
{/if}