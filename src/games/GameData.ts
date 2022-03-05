import { Helpers } from "../helpers";
import { GloomhavenItem, GloomhavenItemSlot } from "../State/Types";
import { GameType } from "./GameType";

export type GameData = {
	gameType: GameType;
	gameName: string;
	items: GloomhavenItem[];
	filterSlots: GloomhavenItemSlot[];
	isItemShown: (item: GloomhavenItem) => boolean;
};

const deSpoilerItemSource = (source: string): string => {
	return source.replace(
		/{(.{2})}/,
		(m, m1) =>
			'<img class="icon" src="' +
			require("../img/classes/" + m1 + ".png") +
			'" alt="" />'
	);
};

export const getInitialItems = (gameType: GameType) => {
	const items: GloomhavenItem[] = require(`./${gameType}/items.json`);
	const filterSlots: GloomhavenItemSlot[] = [];

	items.forEach((item) => {
		item.descHTML = Helpers.parseEffectText(item.desc);
		const source = item.source
			.replace(/Reward from /gi, "")
			.replace(/ ?\((Treasure #\d+)\)/gi, "\n$1")
			.replace(/Solo Scenario #\d+ — /i, "Solo ");
		item.source = deSpoilerItemSource(source);
		if (!filterSlots.includes(item.slot)) {
			filterSlots.push(item.slot);
		}
	});
	return { items, filterSlots };
};
export const getItemPath = (item: GloomhavenItem, gameType: GameType) => {
	const { folder, name } = item;
	const filename = name.toLowerCase().replace(/\s/g, "-").replace(/'/, "");
	return require(`../../vendor/${gameType}/images/items/${folder}/${filename}.png`);
};
