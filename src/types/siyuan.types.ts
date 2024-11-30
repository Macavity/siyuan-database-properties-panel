import * as enUs from "../../public/i18n/en_US.json";
import { type TAVCol } from "siyuan";

declare module "siyuan" {
  // eslint-disable-next-line
  export interface I18N extends Record<keyof typeof enUs, string> {}
}

  interface IAVCellSelectValue {
    content: string;
    color: string;
  }

  interface IAVCellAssetValue {
    content: string;
    name: string;
    type: "file" | "image";
  }

  export interface IAVCellValue {
    keyID?: string;
    id?: string;
    type: TAVCol;
    isDetached?: boolean;
    text?: {
      content: string;
    };
    number?: {
      content?: number;
      isNotEmpty: boolean;
      format?: string;
      formattedContent?: string;
    };
    mSelect?: IAVCellSelectValue[];
    mAsset?: IAVCellAssetValue[];
    block?: {
      content: string;
      id?: string;
    };
    url?: {
      content: string;
    };
    phone?: {
      content: string;
    };
    email?: {
      content: string;
    };
    template?: {
      content: string;
    };
    checkbox?: {
      checked: boolean;
    };
    relation?: IAVCellRelationValue;
    rollup?: {
      contents?: IAVCellValue[];
    };
    date?: IAVCellDateValue;
    created?: IAVCellDateValue;
    updated?: IAVCellDateValue;
  }

  interface IAVCellDateValue {
    content?: number;
    isNotEmpty?: boolean;
    content2?: number;
    isNotEmpty2?: boolean;
    hasEndDate?: boolean;
    formattedContent?: string;
    isNotTime?: boolean; // 默认 true
  }

interface IAVCellRelationValue {
  blockIDs: string[];
  contents?: IAVCellValue[];
}
