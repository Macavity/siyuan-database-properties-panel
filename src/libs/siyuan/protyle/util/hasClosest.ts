/**
 * These functions are direct copies of not exposed functions from siyuan. 
 * @source app/src/protyle/util/hasClosest.ts
 */

export const hasClosestByAttribute = (element: Node, attr: string, value: string | null, top = false) => {
    if (!element) {
        return false;
    }
    if (element.nodeType === 3) {
        element = element.parentElement;
    }
    let e = element as HTMLElement;
    let isClosest = false;
    while (e && !isClosest && (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))) {
        if (typeof value === "string" && e.getAttribute(attr)?.split(" ").includes(value)) {
            isClosest = true;
        } else if (typeof value !== "string" && e.hasAttribute(attr)) {
            isClosest = true;
        } else {
            e = e.parentElement;
        }
    }
    return isClosest && e;
};


export const hasClosestBlock = (element: Node) => {
    const nodeElement = hasClosestByAttribute(element, "data-node-id", null);
    if (nodeElement && nodeElement.tagName !== "BUTTON" && nodeElement.getAttribute("data-type")?.startsWith("Node")) {
        return nodeElement;
    }
    return false;
};
