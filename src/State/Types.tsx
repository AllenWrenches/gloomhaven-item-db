import { GameType } from "../games";

export type ItemsOwnedBy = Record<number, ClassesInUse[]>;

export type ItemsInUse = Record<number, number>;

export enum SortDirection {
	ascending = "ascending",
	descending = "descending",
}

export enum ItemManagementType {
	None = "None",
	Simple = "Simple",
	Party = "Party",
}

export enum ItemViewDisplayType {
	List = "list",
	Images = "images",
}

export enum SortProperty {
	Id,
	Slot,
	Cost,
	Name,
	Use,
}

export enum GHClasses {
	BR = "BR",
	TI = "TI",
	SW = "SW",
	SC = "SC",
	CH = "CH",
	MT = "MT",
	SK = "SK",
	QM = "QM",
	SU = "SU",
	NS = "NS",
	PH = "PH",
	BE = "BE",
	SS = "SS",
	DS = "DS",
	SB = "SB",
	EL = "EL",
	BT = "BT",
	XX = "XX",
}

export enum FCClasses {
	DR = "DR",
}

export enum JOTLClasses {
	DM = "DM",
	HT = "HT",
	RG = "RG",
	VW = "VW",
}

export enum FHClasses {
	BB = "BB",
	BN = "BN",
	BO = "BO",
	DF = "DF",
	DW = "DW",
	GE = "GE",
	FH7 = "FH7",
	FH8 = "FH8",
	FH9 = "FH9",
	FH10 = "FH10",
	FH11 = "FH11",
	FH12 = "FH12",
	FH13 = "FH13",
	FH14 = "FH14",
	FH15 = "FH15",
	FH16 = "FH16",
	FH17 = "FH17",
}

export type SoloClasses = GHClasses | FCClasses | FHClasses;

export type ClassesInUse = GHClasses | FCClasses | JOTLClasses | FHClasses;

export enum GloomhavenItemSlot {
	Head = "Head",
	Body = "Body",
	Legs = "Legs",
	OneHand = "One Hand",
	TwoHands = "Two Hands",
	SmallItem = "Small Item",
}

export interface GloomhavenItem {
	id: number;
	displayId: number;
	gameType: GameType;
	name: string;
	count: number;
	cost: number;
	slot: GloomhavenItemSlot;
	source: string;
	spent?: boolean;
	consumed?: boolean;
	minusOneCardsAdded?: number;
	useSlots?: number;
	desc: string;
	descHTML: string;
	faq?: string;
	summon?: {
		hp: number;
		move: number;
		attack: number;
		range: number;
	};
	soloItem?: SoloClasses;
	folder: string;
}
export const getGHClassList = (envelopeX: boolean, fc: boolean = false) => {
	let ghList: ClassesInUse[] = Object.values(GHClasses);
	if (!envelopeX) {
		ghList = ghList.filter((c) => c !== GHClasses.XX);
	}
	if (fc) {
		ghList = ghList.concat(FCClasses.DR);
	}
	return ghList;
};
