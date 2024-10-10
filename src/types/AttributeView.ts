import { ExtendedTAVCol } from "@/types/siyuan.types";

export interface AttributeView {
    keyValues: {
        key: {
            type: ExtendedTAVCol,
            name: string,
            icon: string,
            id: string,
            options?: {
                name: string,
                color: string
            }[]
        },
        values: {
            keyID: string,
            id: string,
            blockID: string,
            // eslint-disable-next-line
            type: any
        }  []
    }[],
    blockIDs: string[],
    avID: string
    avName: string
}