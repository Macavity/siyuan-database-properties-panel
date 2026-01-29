import { TAVCol } from "siyuan";

export interface AVKeyOption {
  name: string;
  color: string;
  desc?: string;
}

export interface AVKeyRelation {
  avID: string;
  isTwoWay: boolean;
  backKeyID: string;
}

export interface AVKeyRollup {
  relationKeyID: string;
  keyID: string;
  calc: {
    operator: string;
    result: any;
  };
}

export interface AVKey {
  id: string;
  name: string;
  type: TAVCol;
  icon: string;
  desc?: string;
  numberFormat?: string;
  template?: string;
  options?: AVKeyOption[];
  relation?: AVKeyRelation;
  rollup?: AVKeyRollup;
  updated?: {
    includeTime: boolean;
  };
  created?: {
    includeTime: boolean;
  };
}

export interface AVValueBlock {
  id: string;
  content: string;
  created: number;
  updated: number;
}

export interface AVValueNumber {
  content: number;
  isNotEmpty: boolean;
  format: string;
  formattedContent: string;
}

export interface AVValueSelectOption {
  content: string;
  color: string;
}

export interface AVValueTemplate {
  content: string;
}

export interface AVValueDate {
  content: number;
  isNotEmpty: boolean;
  hasEndDate: boolean;
  isNotTime: boolean;
  content2: number;
  isNotEmpty2: boolean;
  formattedContent: string;
}

export interface AVValueText {
  content: string;
}

export interface AVValueUrl {
  content: string;
  isNotEmpty?: boolean; // Sometimes specific fields might appear, keep simple for now
}

export interface AVValuePhone {
  content: string;
}

export interface AVValueCheckbox {
  checked: boolean;
}

export interface AVValueMAsset {
  type: "file" | "image";
  name: string;
  content: string;
}

export interface AVValueRelation {
  blockIDs: string[] | null;
  contents: AVValue[] | null;
}

export interface AVValueRollup {
  contents: any;
}

export interface AVValueTimestamp {
  content: number;
  isNotEmpty: boolean;
  content2: number;
  isNotEmpty2: boolean;
  formattedContent: string;
}

interface AVValueBase {
  id: string;
  keyID: string;
  blockID: string;
  createdAt: number;
  updatedAt: number;
}

export interface AVValueBlockType extends AVValueBase {
  type: "block";
  block: AVValueBlock;
}

export interface AVValueNumberType extends AVValueBase {
  type: "number";
  number: AVValueNumber;
}

export interface AVValueSelectType extends AVValueBase {
  type: "select";
  mSelect: AVValueSelectOption[];
}

export interface AVValueTemplateType extends AVValueBase {
  type: "template";
  template: AVValueTemplate;
}

export interface AVValueRelationType extends AVValueBase {
  type: "relation";
  relation: AVValueRelation;
}

export interface AVValueDateType extends AVValueBase {
  type: "date";
  date: AVValueDate;
}

export interface AVValueTextType extends AVValueBase {
  type: "text";
  text: AVValueText;
}

export interface AVValueUrlType extends AVValueBase {
  type: "url";
  url: AVValueUrl;
}

export interface AVValuePhoneType extends AVValueBase {
  type: "phone";
  phone: AVValuePhone;
}

export interface AVValueRollupType extends AVValueBase {
  type: "rollup";
  rollup: AVValueRollup;
}

export interface AVValueUpdatedType extends AVValueBase {
  type: "updated";
  updated: AVValueTimestamp;
}

export interface AVValueCreatedType extends AVValueBase {
  type: "created";
  created: AVValueTimestamp;
}

export interface AVValueMAssetType extends AVValueBase {
  type: "mAsset";
  mAsset: AVValueMAsset[];
}

export interface AVValueCheckboxType extends AVValueBase {
  type: "checkbox";
  checkbox: AVValueCheckbox;
}

export interface AVValueEmailType extends AVValueBase {
  type: "email";
  email: AVValueText;
}

export type AVValue =
  | AVValueBlockType
  | AVValueNumberType
  | AVValueSelectType
  | AVValueTemplateType
  | AVValueRelationType
  | AVValueDateType
  | AVValueTextType
  | AVValueUrlType
  | AVValuePhoneType
  | AVValueRollupType
  | AVValueUpdatedType
  | AVValueCreatedType
  | AVValueMAssetType
  | AVValueCheckboxType
  | AVValueEmailType;

export interface AVKeyAndValues {
  key: AVKey;
  values: AVValue[];
}

export interface AttributeView {
  avID: string;
  avName: string;
  blockIDs: string[];
  keyValues: AVKeyAndValues[];
}
