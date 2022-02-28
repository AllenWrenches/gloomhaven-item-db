import { atom, selector } from "recoil";
import { gameDataTypes, GameType } from "../games";
import { GameData } from "../games/GameData";
import { isFlagEnabled } from "../helpers";

const getStartingGameType = () => {
	const frosthavenEnabled = isFlagEnabled("frosthaven");

	const lastGame = localStorage.getItem("lastGame") as GameType;
	if (!lastGame) {
		return GameType.Gloomhaven;
	}

	if (lastGame === GameType.Frosthaven && !frosthavenEnabled) {
		return GameType.Gloomhaven;
	}
	return lastGame;
};

export const gameTypeState = atom<GameType>({
	key: "gameTypeState",
	default: getStartingGameType(),
	effects: [
		({ onSet }) => {
			onSet((gameType) => {
				localStorage.setItem("lastGame", gameType);
			});
		},
	],
});

export const gameDataState = selector<GameData>({
	key: "gameDataState",
	get: ({ get }) => {
		const gameType: GameType = get(gameTypeState);
		return gameDataTypes[gameType];
	},
});
