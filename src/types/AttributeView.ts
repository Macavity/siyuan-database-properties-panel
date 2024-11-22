import { TAVCol } from "siyuan";

export interface AVKey {
  type: TAVCol;
  name: string;
  icon: string;
  id: string;
  options?: {
    name: string;
    color: string;
  };
}

export interface AVValue {
  keyID: string;
  id: string;
  blockID: string;
  // eslint-disable-next-line
  type: any;
}

export interface AVKeyAndValues {
  key: AVKey;
  values: AVValue[];
}

export interface AttributeView {
  keyValues: AVKeyAndValues[];
  blockIDs: string[];
  avID: string;
  avName: string;
}
