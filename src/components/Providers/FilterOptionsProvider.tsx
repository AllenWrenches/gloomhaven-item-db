import React, {
	useContext,
	createContext,
	useState,
	useEffect,
	useCallback,
	FC,
} from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GameType } from "../../games";
import {
	allState,
	classesInUseState,
	discountState,
	displayItemAsState,
	envelopeXState,
	gameDataState,
	itemManagementTypeState,
	itemsInUseState,
	itemsOwnedByState,
	itemState,
	prosperityState,
	scenarioCompletedState,
	soloClassState,
} from "../../State";
import { ItemManagementType, SoloClassShorthand } from "../../State/Types";
import { useFirebase } from "../Firebase";
import {
	initialFilterOptions,
	OldFilterOptions,
	FilterOptions,
} from "./FilterOptions";

const LOCAL_STORAGE_PREFIX: string = "ItemView:spoilerFilter_";

type GameFilterOptions = {
	[GameType.Gloomhaven]: FilterOptions;
	[GameType.JawsOfTheLion]: FilterOptions;
	lockSpoilerPanel: boolean;
};

const initialGameFilterOptions: GameFilterOptions = {
	[GameType.Gloomhaven]: initialFilterOptions,
	[GameType.JawsOfTheLion]: initialFilterOptions,
	lockSpoilerPanel: false,
};

type ContextData = {
	loadFromHash: (importHash: string | undefined) => void;
	getImportHash: () => string | undefined;
	filterOptions: FilterOptions;
	updateFilterOptions: (options: any) => void;
	lockSpoilerPanel: boolean;
	getShareHash: (lockSpoilerPanel: boolean) => string;
	dataChanged: boolean;
};

export const Context = createContext<ContextData | undefined>(undefined);

export function useFilterOptions() {
	const result = useContext(Context);
	if (!result) {
		throw Error("No Context Found");
	}
	return result;
}

const fixFilterOptions = (filterOptions: FilterOptions) => {
	if (filterOptions.hasOwnProperty("enableStoreStockManagement")) {
		//@ts-ignore
		filterOptions.itemManagementType =
			//@ts-ignore
			filterOptions.enableStoreStockManagement
				? ItemManagementType.Simple
				: ItemManagementType.None;
		// @ts-ignore
		delete filterOptions.enableStoreStockManagement;
	}

	if (filterOptions.hasOwnProperty("lockSpoilerPanel")) {
		// @ts-ignore
		delete filterOptions.lockSpoilerPanel;
	}
	return filterOptions;
};

const loadFromStorage = (filterLocalStorageKey: string) => {
	const storage = localStorage.getItem(filterLocalStorageKey);
	console.log(storage);

	let spoilerFilter = initialFilterOptions;

	if (typeof storage === "string") {
		const configFromStorage: OldFilterOptions = JSON.parse(storage);

		// convert from old object style to array
		if (
			configFromStorage.soloClass &&
			!configFromStorage.soloClass.hasOwnProperty("length")
		) {
			const soloClass: Array<SoloClassShorthand> = [];
			Object.keys(configFromStorage.soloClass).forEach((k) => {
				if (configFromStorage.soloClass[k] === true) {
					soloClass.push(k as SoloClassShorthand);
				}
			});
			configFromStorage.soloClass = soloClass;
		} else if (!configFromStorage.soloClass) {
			configFromStorage.soloClass = [];
		}
		// convert from old object style to array
		if (
			configFromStorage.item &&
			!configFromStorage.item.hasOwnProperty("length")
		) {
			const items: Array<number> = [];
			Object.keys(configFromStorage.item).forEach((k) => {
				if (configFromStorage.item[k] === true) {
					items.push(parseInt(k));
				}
			});
			configFromStorage.item = items;
		} else if (!configFromStorage.item) {
			configFromStorage.item = [];
		}

		spoilerFilter = Object.assign(
			{},
			initialFilterOptions,
			configFromStorage
		);
	}

	spoilerFilter = fixFilterOptions(spoilerFilter);

	localStorage.setItem(filterLocalStorageKey, JSON.stringify(spoilerFilter));
	return spoilerFilter;
};

const oldFilterLocalStorageKey = "ItemView:spoilerFilter";

const parseHash = (importHash: string): any | undefined => {
	try {
		return JSON.parse(atob(importHash));
	} catch (e) {
		return undefined;
	}
};

const FilterProvider: FC = (props) => {
	const { children } = props;
	const { gameType } = useRecoilValue(gameDataState);
	const [dataLoaded, setDataLoaded] = useState(false);
	const [gameFilterOptions, setGameFilterOptions] = useState(
		initialGameFilterOptions
	);
	const [lockSpoilerPanel, setLockSpoilerPanel] = useState(
		localStorage.getItem("lockSpoilerPanel") === "true" || false
	);
	const [dataChanged, setDataChanged] = useState(false);
	const [dataDirty, setDataDirty] = useState(false);
	const { Provider } = Context;
	const { remoteData } = useFirebase();
	const setGameAll = useSetRecoilState(allState.gameStateSelector);
	const setGameDiscount = useSetRecoilState(discountState.gameStateSelector);
	const setGameProsperity = useSetRecoilState(
		prosperityState.gameStateSelector
	);
	const setGameItem = useSetRecoilState(itemState.gameStateSelector);
	const setGameDisplayAs = useSetRecoilState(
		displayItemAsState.gameStateSelector
	);
	const setGameItemsInUse = useSetRecoilState(
		itemsInUseState.gameStateSelector
	);
	const setGameItemManagementType = useSetRecoilState(
		itemManagementTypeState.gameStateSelector
	);
	const setGameEnvelopeX = useSetRecoilState(
		envelopeXState.gameStateSelector
	);
	const setGameItemsOwnedBy = useSetRecoilState(
		itemsOwnedByState.gameStateSelector
	);
	const setGameClassesInUse = useSetRecoilState(
		classesInUseState.gameStateSelector
	);
	const setGameSoloClass = useSetRecoilState(
		soloClassState.gameStateSelector
	);
	const setGameScenarioCompleted = useSetRecoilState(
		scenarioCompletedState.gameStateSelector
	);

	useEffect(() => {
		const loadedSpoilerFilterString = localStorage.getItem(
			oldFilterLocalStorageKey
		);

		// if it exists then it's a gloomhaven storage. Set it tot he new one
		if (loadedSpoilerFilterString) {
			localStorage.removeItem(oldFilterLocalStorageKey);
			localStorage.setItem(
				LOCAL_STORAGE_PREFIX + GameType.Gloomhaven,
				loadedSpoilerFilterString
			);
		}
		const newGameFilterOptions: GameFilterOptions = Object.assign(
			{},
			gameFilterOptions
		);
		Object.values(GameType).forEach((gt) => {
			const value = loadFromStorage(LOCAL_STORAGE_PREFIX + gt);
			console.log(value);
			const {
				//@ts-ignore
				all,
				//@ts-ignore
				discount,
				//@ts-ignore
				prosperity,
				//@ts-ignore
				item,
				//@ts-ignore
				displayAs,
				//@ts-ignore
				itemsInUse,
				//@ts-ignore
				itemManagementType,
				//@ts-ignore
				envelopeX,
				//@ts-ignore
				itemsOwnedBy,
				//@ts-ignore
				classesInUse,
				//@ts-ignore
				soloClass,
				//@ts-ignore
				scenarioCompleted,
				...rest
			} = value;
			setGameAll({ gameType: gt, value: all });
			setGameDiscount({ gameType: gt, value: discount || 0 });
			setGameProsperity({ gameType: gt, value: prosperity });
			console.log(item);
			setGameItem({ gameType: gt, value: item });
			setGameDisplayAs({ gameType: gt, value: displayAs });
			setGameItemsInUse({ gameType: gt, value: itemsInUse });
			setGameItemManagementType({
				gameType: gt,
				value: itemManagementType,
			});
			setGameEnvelopeX({ gameType: gt, value: envelopeX });
			setGameItemsOwnedBy({ gameType: gt, value: itemsOwnedBy });
			setGameClassesInUse({ gameType: gt, value: classesInUse });
			setGameSoloClass({ gameType: gt, value: soloClass });
			setGameScenarioCompleted({
				gameType: gt,
				value: scenarioCompleted,
			});
			newGameFilterOptions[gt] = rest;
		});

		setDataDirty(true);
		setGameFilterOptions(newGameFilterOptions);
		setDataLoaded(true);
	}, []);

	const updateFilterOptions = (options: any) => {
		gameFilterOptions[gameType] = {
			...gameFilterOptions[gameType],
			...options,
		};
		setDataDirty(true);
		setGameFilterOptions(Object.assign({}, gameFilterOptions));
		localStorage.setItem(
			LOCAL_STORAGE_PREFIX + gameType,
			JSON.stringify(gameFilterOptions[gameType])
		);
	};

	const getShareHash = (lockSpoilerPanel: boolean) => {
		gameFilterOptions["lockSpoilerPanel"] = lockSpoilerPanel;
		return btoa(JSON.stringify(gameFilterOptions));
	};

	const getImportHash = useCallback(() => {
		if (!dataLoaded) {
			return undefined;
		}
		const importHash = location.hash && location.hash.substr(1);
		if (importHash.length > 0) {
			return importHash;
		}
		location.hash = "";
		return undefined;
	}, [dataLoaded]);

	const loadFromHash = (importHash: string | undefined) => {
		if (importHash) {
			const hashConfig = parseHash(importHash);
			const newGameFilterOptions: GameFilterOptions = Object.assign(
				{},
				gameFilterOptions
			);
			let oldLockSpoilerPanel = false;
			if (hashConfig !== undefined) {
				if (hashConfig.hasOwnProperty(GameType.Gloomhaven)) {
					Object.values(GameType).forEach((gt: GameType) => {
						const filterOptions =
							hashConfig[gt] || initialFilterOptions;
						if (filterOptions) {
							oldLockSpoilerPanel =
								filterOptions.lockSpoilerPanel;
							const newFilterOpions = fixFilterOptions(
								Object.assign(
									{},
									initialFilterOptions,
									filterOptions
								)
							);
							localStorage.setItem(
								LOCAL_STORAGE_PREFIX + gt,
								JSON.stringify(newFilterOpions)
							);
							newGameFilterOptions[gt] = newFilterOpions;
						}
					});
				} else if (hashConfig.hasOwnProperty("prosperity")) {
					// This is the old version of the data before other games were added.  Just add it to gloomhaven.
					const value = fixFilterOptions(hashConfig as FilterOptions);
					localStorage.setItem(
						LOCAL_STORAGE_PREFIX + GameType.Gloomhaven,
						JSON.stringify(value)
					);
					newGameFilterOptions[GameType.Gloomhaven] = value;
					localStorage.setItem(
						LOCAL_STORAGE_PREFIX + GameType.JawsOfTheLion,
						JSON.stringify(initialFilterOptions)
					);
					newGameFilterOptions[GameType.JawsOfTheLion] =
						initialFilterOptions;
				}
				setDataDirty(true);
				setGameFilterOptions(newGameFilterOptions);
				if (hashConfig.hasOwnProperty("lockSpoilerPanel")) {
					setLockSpoilerPanel(hashConfig.lockSpoilerPanel);
					localStorage.setItem(
						"lockSpoilerPanel",
						hashConfig.lockSpoilerPanel.toString()
					);
				} else {
					setLockSpoilerPanel(oldLockSpoilerPanel);
					localStorage.setItem(
						"lockSpoilerPanel",
						oldLockSpoilerPanel.toString()
					);
				}
			}
		}
		location.hash = "";
	};

	useEffect(() => {
		const configHash = getShareHash(lockSpoilerPanel);

		if (!configHash || !remoteData) {
			return;
		}
		setDataDirty(false);
		setDataChanged(remoteData !== configHash);
	}, [dataDirty, remoteData]);

	return (
		<Provider
			value={{
				filterOptions: gameFilterOptions[gameType],
				updateFilterOptions,
				loadFromHash,
				getImportHash,
				lockSpoilerPanel,
				getShareHash,
				dataChanged,
			}}
		>
			{children}
		</Provider>
	);
};

export default FilterProvider;
