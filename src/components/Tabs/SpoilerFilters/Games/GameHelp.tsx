import React from "react";
import { useRecoilValue } from "recoil";
import { Form, List } from "semantic-ui-react";
import { GameType } from "../../../../games";
import { AllGames } from "../../../../games/GameType";
import { isFrosthavenGameAndEnabled } from "../../../../helpers";
import { gameTypeState } from "../../../../State";
import { allFiltersData, HelpData } from ".//GameFilters";

const constructHelpEntry = (
	title: string,
	gameType: GameType,
	{ addClasses, addItemsToGames, soloGameType }: HelpData
) => {
	return (
		<List.Item key={`${title}-${gameType}`}>
			<strong>{title}</strong>
			<List.List>
				{addClasses && (
					<List.Item>Add classes to party management</List.Item>
				)}
				{addItemsToGames && addItemsToGames.includes(gameType) && (
					<List.Item>Add Items for use</List.Item>
				)}
				{soloGameType && (
					<List.Item>{`Add solo scenario items for ${soloGameType}`}</List.Item>
				)}
			</List.List>
		</List.Item>
	);
};

export const GameHelp = () => {
	const gameType = useRecoilValue(gameTypeState);

	return (
		<Form.Group>
			<List bulleted>
				<List.Header>
					Which Games/Expansions are you playing with?
				</List.Header>
				{Object.entries(allFiltersData)
					.filter(([gameType]) =>
						isFrosthavenGameAndEnabled(gameType as AllGames)
					)
					.map(([, { title, gamesToFilterOn, ...rest }]) => {
						if (
							!gamesToFilterOn ||
							(gamesToFilterOn &&
								!gamesToFilterOn.includes(gameType))
						)
							return constructHelpEntry(title, gameType, rest);
					})}
			</List>
		</Form.Group>
	);
};
