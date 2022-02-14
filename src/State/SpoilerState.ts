import {
	ItemsInUse,
	ItemsOwnedBy,
} from "../components/Providers/FilterOptions";
import { createSpoilerState } from "./CommonState";
import { ClassesInUse, ItemManagementType, ItemViewDisplayType } from "./Types";

export const allState = createSpoilerState<boolean>("all", false);
export const classesInUseState = createSpoilerState<ClassesInUse[]>(
	"classesInUse",
	[]
);
export const discountState = createSpoilerState<number>("discount", 0);
export const displayItemAsState = createSpoilerState<ItemViewDisplayType>(
	"displayAs",
	ItemViewDisplayType.List
);
export const envelopeXState = createSpoilerState<boolean>("envelopeX", false);
export const itemState = createSpoilerState<number[]>("item", []);
export const itemManagementTypeState = createSpoilerState<ItemManagementType>(
	"itemManagementType",
	ItemManagementType.None
);
export const itemsInUseState = createSpoilerState<ItemsInUse>("itemsInUse", {});
export const itemsOwnedByState = createSpoilerState<ItemsOwnedBy>(
	"itemsOwnedBy",
	{}
);
export const prosperityState = createSpoilerState<number>("prosperity", 1);
export const scenarioCompletedState = createSpoilerState<number[]>(
	"scenarioCompleted",
	[]
);
export const soloClassState = createSpoilerState<ClassesInUse[]>(
	"soloClass",
	[]
);
