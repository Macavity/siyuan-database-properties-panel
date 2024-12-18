import { Logger } from "@/libs/logger";
import { isEmpty } from "@/libs/is-empty";
import type { AttributeView, AVKeyAndValues } from "@/types/AttributeView";

export function filterAVKeyAndValues(
  keyValues: AttributeView["keyValues"],
  showPrimaryKey: boolean,
  showEmptyAttributes: boolean
): AVKeyAndValues[] {
  let entries = [...keyValues];
  const hidePrimaryKey = !showPrimaryKey;
  const hideEmptyAttributes = !showEmptyAttributes;

  if (hidePrimaryKey) {
    Logger.debug("hide primary key");
    entries = entries.filter((item) => item.key.type !== "block");
  }

  if (hideEmptyAttributes) {
    Logger.debug("hide empty attributes");
    entries = entries.filter((item) => !isEmpty(item.values[0]));
  }

  Logger.debug("filtered attributes", entries);

  return entries;
}

export function getEmptyAVKeyAndValues(
  keyValues: AttributeView["keyValues"]
): AVKeyAndValues[] {
  return keyValues.filter((item) => isEmpty(item.values[0]));
}
