import React from "react";
import { Form, Button, Input, Icon } from "semantic-ui-react";
import {
	ClassesInUse,
	GloomhavenItemSlot,
	ItemManagementType,
	ItemViewDisplayType,
	ResourceTypes,
	SortDirection,
	SortProperty,
} from "../../../State/Types";
import { ClassList } from "../SpoilerFilters/ClassList";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	gameDataState,
	searchState,
	slotsState,
	resourcesState,
	sortPropertyState,
	sortDirectionState,
	availableOnlyState,
	selectedClassState,
	discountState,
	displayItemAsState,
	itemManagementTypeState,
	classesInUseState,
	gameTypeState,
} from "../../../State";
import { GameType } from "../../../games";
import { GHIcon } from "./GHIcon";

type Props = {
	setSorting: (newProperty: SortProperty) => void;
};

const SearchOptions = (props: Props) => {
	const { setSorting } = props;

	const { filterSlots } = useRecoilValue(gameDataState);
	const [slots, setSlotsState] = useRecoilState(slotsState);
	const [resources, setResourcesState] = useRecoilState(resourcesState);
	const sortProperty = useRecoilValue(sortPropertyState);
	const [sortDirection, setSortDirection] =
		useRecoilState(sortDirectionState);
	const [searchString, setSearchString] = useRecoilState(searchState);
	const [availableOnly, setAvailableOnly] =
		useRecoilState(availableOnlyState);
	const [selectedClass, setSelectedClass] =
		useRecoilState(selectedClassState);
	const discount = useRecoilValue(discountState);
	const [displayAs, setDisplayAs] = useRecoilState(displayItemAsState);
	const itemManagementType = useRecoilValue(itemManagementTypeState);
	const classesInUse = useRecoilValue(classesInUseState);
	const gameType = useRecoilValue(gameTypeState);

	const setFilterSlot = (slot?: GloomhavenItemSlot) => {
		if (!slot) {
			setSlotsState([]);
			return;
		}
		let value = Object.assign([], slots);
		const index = value.indexOf(slot);
		if (index !== -1) {
			value.splice(index, 1);
		} else {
			value.push(slot);
		}
		setSlotsState(value);
	};

	const setFilterResource = (resource?: ResourceTypes) => {
		if (!resource) {
			setResourcesState([]);
			return;
		}
		let value = Object.assign([], resources);
		const index = value.indexOf(resource);
		if (index !== -1) {
			value.splice(index, 1);
		} else {
			value.push(resource);
		}
		setResourcesState(value);
	};

	const toggleSortDirection = () => {
		setSortDirection(
			sortDirection === SortDirection.ascending
				? SortDirection.descending
				: SortDirection.ascending
		);
	};

	return (
		<Form>
			<Form.Group inline>
				<label>Render as:</label>
				<Button.Group>
					<Button
						color={
							displayAs === ItemViewDisplayType.List
								? "blue"
								: undefined
						}
						onClick={() => {
							setDisplayAs(ItemViewDisplayType.List);
						}}
					>
						List
					</Button>
					<Button.Or />
					<Button
						color={
							displayAs === ItemViewDisplayType.Images
								? "blue"
								: undefined
						}
						onClick={() => {
							setDisplayAs(ItemViewDisplayType.Images);
						}}
					>
						Images
					</Button>
				</Button.Group>
			</Form.Group>
			<Form.Group inline>
				<label>Filter Slot:</label>
				<Form.Radio
					label={"all"}
					checked={slots.length === 0}
					onChange={() => setFilterSlot(undefined)}
				/>
				{Object.values(GloomhavenItemSlot)
					.filter((slot) => filterSlots.includes(slot))
					.map((itemSlot) => (
						<Form.Checkbox
							key={itemSlot}
							label={
								<GHIcon
									name={`${itemSlot}.png`}
									folder={"equipment_slot"}
								/>
							}
							checked={slots.includes(itemSlot)}
							onChange={() => setFilterSlot(itemSlot)}
							alt={itemSlot}
						/>
					))}
			</Form.Group>
			{gameType === GameType.Frosthaven && (
				<Form.Group inline>
					<label>Resource:</label>
					<Form.Radio
						label={"all"}
						checked={resources.length === 0}
						onChange={() => setFilterResource(undefined)}
					/>
					{Object.values(ResourceTypes).map((resource) => (
						<Form.Checkbox
							key={resource}
							label={<GHIcon name={`${resource}.png`} />}
							checked={resources.includes(resource)}
							onChange={() => setFilterResource(resource)}
							alt={resource}
						/>
					))}
				</Form.Group>
			)}
			<Form.Group inline>
				<label>Find Item:</label>
				<Input
					value={searchString}
					onChange={(e) => {
						setSearchString(e.target.value);
					}}
					icon={{
						name: "close",
						link: true,
						onClick: () => setSearchString(""),
					}}
					placeholder={"Search..."}
				/>
			</Form.Group>
			{itemManagementType === ItemManagementType.Party && (
				<Form.Group inline>
					<ClassList
						label={"Filter Owner:"}
						classes={classesInUse}
						onClick={(option: ClassesInUse) => {
							if (selectedClass === option) {
								setSelectedClass(undefined);
							} else {
								setSelectedClass(option);
							}
						}}
						isUsed={(options: ClassesInUse) =>
							selectedClass === options
						}
					/>
				</Form.Group>
			)}
			<Form.Group inline>
				<label>Availability</label>
				<Button.Group>
					<Button
						color={availableOnly ? "blue" : undefined}
						onClick={() => {
							setAvailableOnly(true);
						}}
					>
						Available
					</Button>
					<Button.Or />
					<Button
						color={!availableOnly ? "blue" : undefined}
						onClick={() => {
							setAvailableOnly(false);
						}}
					>
						All
					</Button>
				</Button.Group>
			</Form.Group>
			{displayAs === ItemViewDisplayType.Images && (
				<>
					<Form.Group inline>
						<label>Sort By:</label>
						<Form.Select
							value={sortProperty}
							options={[
								{ value: "id", text: "Item Number" },
								{ value: "slot", text: "Equipment Slot" },
								{ value: "cost", text: "Cost" },
								{ value: "name", text: "Name" },
								{ value: "source", text: "Source" },
								{ value: "use", text: "Use" },
							]}
							onChange={(obj, e) =>
								setSorting(e.value as SortProperty)
							}
						/>
						<Button
							icon={
								<Icon
									name={
										sortDirection ===
										SortDirection.ascending
											? `angle up`
											: `angle down`
									}
								/>
							}
							checked={sortDirection === SortDirection.ascending}
							onClick={() => toggleSortDirection()}
						/>
					</Form.Group>
					<Form.Group inline>
						<label>Store Discount:</label>
						{`${discount}g`}
					</Form.Group>
				</>
			)}
		</Form>
	);
};

export default SearchOptions;
