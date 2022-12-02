import React from "react";
import { Form, Segment } from "semantic-ui-react";
import SpoilerFilterItemList from "./SpoilerFilterItemList";
import { useRecoilValue } from "recoil";
import {
	includeGameState,
	prosperityState,
	SpecialUnlockTypes,
} from "../../../../State";
import { SoloClassFilter } from "./SoloClassFilter";
import { Expansions, GameType } from "../../../../games/GameType";
import { useRemovePlayerUtils } from "../../../../hooks/useRemovePlayer";
import { ReputationPulldown } from "./ReputationPulldown";
import { ProsperityFilter } from "./ProsperityFilter";
import { SpecialUnlocksButton } from "../Common/SpecialUnlockButton";

export const GHSpoilerFilter = () => {
	const { getClassesForGame } = useRemovePlayerUtils();
	const includeGames = useRecoilValue(includeGameState);
	const prosperity = useRecoilValue(prosperityState);
	const includeFC = includeGames.includes(Expansions.ForgottenCircles);
	const includeCS = includeGames.includes(Expansions.CrimsonScales);
	const includeCSA = includeGames.includes(Expansions.CrimsonScalesAddon);
	const includeGHSS = includeGames.includes(Expansions.GHSoloScenarios);
	const ghClasses = getClassesForGame(GameType.Gloomhaven);
	const fcClasses = getClassesForGame(Expansions.ForgottenCircles);
	const csClasses = getClassesForGame(Expansions.CrimsonScales);
	const csaClasses = getClassesForGame(Expansions.CrimsonScalesAddon);

	return (
		<Segment>
			<ReputationPulldown />
			<ProsperityFilter />
			<SpecialUnlocksButton
				gameType={Expansions.ForgottenCircles}
				specialUnlockType={SpecialUnlockTypes.EnvelopeE}
				text="Envelope E"
			/>
			<Segment>
				<SpoilerFilterItemList
					ranges={[
						{
							range: [
								{ start: (prosperity + 1) * 7 + 1, end: 70 },
							],
						},
					]}
					title="Prosperity Items"
				/>
				<SpoilerFilterItemList
					ranges={[{ range: [{ start: 71, end: 95 }] }]}
					title="Random Item Design"
				/>
				<SpoilerFilterItemList
					ranges={[{ range: [{ start: 96, end: 133 }] }]}
					title="Other Items"
				/>
				<SpoilerFilterItemList
					ranges={[{ range: [{ start: 152, end: 163 }] }]}
					title="Forgotten Circles Items"
					filterOn={Expansions.ForgottenCircles}
				/>
				<SpoilerFilterItemList
					ranges={[
						{
							offset: 164,
							range: [
								{ start: 1, end: 33 },
								{ start: 35, end: 39 },
								{ start: 43, end: 44 },
								{ start: 46 },
								{ start: 49 },
								{ start: 52 },
								{ start: 54, end: 55 },
								{ start: 58, end: 100 },
							],
						},
					]}
					title="Crimson Scales Items"
					filterOn={Expansions.CrimsonScales}
				/>
				<SpoilerFilterItemList
					ranges={[
						{
							range: [{ start: 1, end: 2 }],
							offset: 264,
							prefix: "aa",
						},
						{
							range: [{ start: 1, end: 5 }],
							offset: 267,
							prefix: "qa",
						},
						{
							range: [{ start: 1, end: 4 }, { start: 6 }],
							offset: 273,
							prefix: "rm",
						},
					]}
					title="Crimson Scales Add on Items"
					filterOn={Expansions.CrimsonScalesAddon}
				/>
			</Segment>

			{(includeGHSS || includeFC || includeCS || includeCSA) && (
				<Segment>
					<Form.Group inline>
						<label>Solo Class Items:</label>
					</Form.Group>
					{includeGHSS && (
						<SoloClassFilter
							name="Gloomhaven"
							classes={ghClasses}
						/>
					)}
					{includeFC && (
						<SoloClassFilter
							name="Forgotten Circles"
							classes={fcClasses}
						/>
					)}
					{includeCS && (
						<SoloClassFilter
							name="Crimson Scales"
							classes={csClasses}
						/>
					)}
					{includeCSA && (
						<SoloClassFilter
							name="Crimson Scales Addon"
							classes={csaClasses}
						/>
					)}
				</Segment>
			)}
		</Segment>
	);
};
