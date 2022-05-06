import React from "react";
import { Form, Button, Icon } from "semantic-ui-react";
import GHSpoilerFilter from "./GHSpoilerFilter";
import JOTLSpoilerFilter from "./JOTLSpoilerFilter";
import PartyManagementFilter from "./PartyManagementFilter";
import ConfirmClassDelete from "./ConfirmClassDelete";
import { PartySpoiler } from "./PartySpoiler";
import ConfirmEnvelopeX from "./ConfirmEnvelopeX";
import { GameType } from "../../../games";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
	allState,
	confirmEnvelopeXState,
	envelopeXState,
	gameDataState,
	includeGameState,
} from "../../../State";
import FHSpoilerFilter from "./FHSpoilerFilter";
import { GameFilters } from "./GameFilters";
import { AllGames } from "../../../games/GameType";

const filters = {
	[GameType.Gloomhaven]: <GHSpoilerFilter />,
	[GameType.JawsOfTheLion]: <JOTLSpoilerFilter />,
	[GameType.Frosthaven]: <FHSpoilerFilter />,
};

const SpoilerFilters = () => {
	const [all, setAll] = useRecoilState(allState);
	const includeGames = useRecoilValue(includeGameState);
	const envelopeX = useRecoilValue(envelopeXState);
	const { gameType } = useRecoilValue(gameDataState);
	const setConfirmEnvelopeX = useSetRecoilState(confirmEnvelopeXState);

	return (
		<Form>
			<Form.Group inline>
				<label>Respecting Spoiler Settings:</label>
				<Button
					color={all ? "red" : "blue"}
					onClick={() => {
						setAll(!all);
					}}
				>
					{all ? (
						<>
							<Icon name={"eye"} /> disabled
						</>
					) : (
						<>
							<Icon name={"eye slash"} /> enabled
						</>
					)}
				</Button>
			</Form.Group>

			<PartyManagementFilter />
			<GameFilters />
			{!envelopeX && includeGames.includes(GameType.Gloomhaven) && (
				<Button onClick={() => setConfirmEnvelopeX(true)}>
					Envelope X
				</Button>
			)}
			{filters[gameType]}
			<PartySpoiler />
			<ConfirmClassDelete />
			<ConfirmEnvelopeX />
		</Form>
	);
};

export default SpoilerFilters;
