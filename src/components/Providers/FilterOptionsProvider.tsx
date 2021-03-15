import React, { useContext, createContext, ReactNode, useState, useEffect } from 'react'
import { GameType } from '../../games'
import { isFlagEnabled } from '../../helpers';
import { ItemManagementType, SoloClassShorthand } from '../../State/Types';
import { useGame } from '../Game/GameProvider';
import {initialFilterOptions, OldFilterOptions, FilterOptions} from "./FilterOptions"

const LOCAL_STORAGE_PREFIX:string = "ItemView:spoilerFilter_";

type GameFilterOptions = {
    [GameType.Gloomhaven]: FilterOptions;
    [GameType.JawsOfTheLion]: FilterOptions;
    lockSpoilerPanel: boolean;
}

const initialGameFilterOptions: GameFilterOptions = {
    [GameType.Gloomhaven] : initialFilterOptions,
    [GameType.JawsOfTheLion] : initialFilterOptions,
    lockSpoilerPanel: false
};

type ContextData = {
    loadFromHash: () => void,
    filterOptions: FilterOptions, 
    updateFilterOptions: (options: any) => void,
    lockSpoilerPanel: boolean,
    getShareHash: (lockSpoilerPanel:boolean) => string,

}

const initialContextData = {
    loadFromHash: () => {}, 
    filterOptions: initialFilterOptions, 
    updateFilterOptions: (options: any) => {},
    lockSpoilerPanel: false,
    getShareHash: (lockSpoilerPanel:boolean) => ""
}

export const Context = createContext<ContextData>(initialContextData);

export function useFilterOptions() {
    return useContext(Context);
}

type Props = {
    children: ReactNode;
}

const loadFromStorage = (filterLocalStorageKey:string) => {
    const storage = localStorage.getItem(filterLocalStorageKey);

    let spoilerFilter = initialFilterOptions;

    if (typeof storage === 'string') {
        const configFromStorage: OldFilterOptions = JSON.parse(storage);

        // convert from old object style to array
        if (!configFromStorage.soloClass.hasOwnProperty('length')) {
            const soloClass: Array<SoloClassShorthand> = [];
            Object.keys(configFromStorage.soloClass).forEach(k => {
                if (configFromStorage.soloClass[k] === true) {
                    soloClass.push(k as SoloClassShorthand);
                }
            });
            configFromStorage.soloClass = soloClass;
        }
        // convert from old object style to array
        if (!configFromStorage.item.hasOwnProperty('length')) {
            const items: Array<number> = [];
            Object.keys(configFromStorage.item).forEach(k => {
                if (configFromStorage.item[k] === true) {
                    items.push(parseInt(k));
                }
            });
            configFromStorage.item = items;
        }

        spoilerFilter = Object.assign({}, initialFilterOptions, configFromStorage);
    }

    if (spoilerFilter.hasOwnProperty("enableStoreStockManagement")) { 
        //@ts-ignore
         spoilerFilter.itemManagementType = spoilerFilter.enableStoreStockManagement ? ItemManagementType.Simple:  ItemManagementType.None;
         // @ts-ignore
         delete spoilerFilter.enableStoreStockManagement
    }

    if (!isFlagEnabled("partyMode") && spoilerFilter.itemManagementType === ItemManagementType.Party) {
        spoilerFilter.itemManagementType = ItemManagementType.None;    
    }

    if (spoilerFilter.hasOwnProperty("lockSpoilerPanel")) { 
         // @ts-ignore
         delete spoilerFilter.lockSpoilerPanel;
    }

    localStorage.setItem(filterLocalStorageKey, JSON.stringify(spoilerFilter));
    return spoilerFilter;
}

const oldFilterLocalStorageKey = 'ItemView:spoilerFilter';

const parseHash = (): any | undefined => {
    const importHash = location.hash.substr(1) || undefined;
    if (importHash !== undefined)
    {
        try {
            return JSON.parse(atob(importHash));
        } catch (e) {
            return undefined;
        }
    }
    return undefined;
}

const FilterProvider = (props:Props) => {
    const { children} = props;
    const {gameType} = useGame();
    const [ gameFilterOptions, setGameFilterOptions] = useState(initialGameFilterOptions);
    const [ lockSpoilerPanel, setLockSpoilerPanel] = useState(localStorage.getItem("lockSpoilerPanel") === "true" || false);
    const { Provider } = Context;

    useEffect( () => {
        const loadedSpoilerFilterString = localStorage.getItem(oldFilterLocalStorageKey)

        // if it exists then it's a gloomhaven storage. Set it tot he new one
        if (loadedSpoilerFilterString) {
            localStorage.removeItem(oldFilterLocalStorageKey);
            localStorage.setItem(LOCAL_STORAGE_PREFIX + GameType.Gloomhaven, loadedSpoilerFilterString);
        }
        const newGameFilterOptions:GameFilterOptions = Object.assign({}, gameFilterOptions);
        Object.values(GameType).forEach( gt => {
            const value = loadFromStorage(LOCAL_STORAGE_PREFIX + gt);
            newGameFilterOptions[gt] = value;
        })

        setGameFilterOptions(newGameFilterOptions);
    },[]);

    const updateFilterOptions = ( options : any ) => {
        gameFilterOptions[gameType] = {...gameFilterOptions[gameType], ...options};
        setGameFilterOptions(Object.assign({}, gameFilterOptions))
        localStorage.setItem(LOCAL_STORAGE_PREFIX + gameType, JSON.stringify(gameFilterOptions[gameType]) );
    }

    const loadFromHash = () => {
        const hashConfig = parseHash();
        const newGameFilterOptions:GameFilterOptions = Object.assign({}, gameFilterOptions);
        let oldLockSpoilerPanel = false;
        if (hashConfig !== undefined) {
            if (hashConfig.hasOwnProperty(GameType.Gloomhaven)) {
                   Object.values(GameType).forEach( (gt:GameType) => {
                       const filterOptions = hashConfig[gt] || initialFilterOptions;
                       if (filterOptions) {
                           const newFilterOpions = Object.assign({}, initialFilterOptions, filterOptions);
                            localStorage.setItem(LOCAL_STORAGE_PREFIX + gt, JSON.stringify(newFilterOpions));
                            newGameFilterOptions[gt] = newFilterOpions;
                            oldLockSpoilerPanel = newFilterOpions.lockSpoilerPanel;
                       }
                    })
            }
            else if (hashConfig.hasOwnProperty("prosperity")) {
                // This is the old version of the data before other games were added.  Just add it to gloomhaven.
                const value = hashConfig as FilterOptions;
                localStorage.setItem(LOCAL_STORAGE_PREFIX + GameType.Gloomhaven, JSON.stringify(value));
                newGameFilterOptions[GameType.Gloomhaven] = value;
                localStorage.setItem(LOCAL_STORAGE_PREFIX + GameType.JawsOfTheLion, JSON.stringify(initialFilterOptions));
                newGameFilterOptions[GameType.JawsOfTheLion] = initialFilterOptions;
            }
            setGameFilterOptions(newGameFilterOptions);
          }
          if (hashConfig.hasOwnProperty("lockSpoilerPanel")) {
              setLockSpoilerPanel(hashConfig.lockSpoilerPanel);
              localStorage.setItem("lockSpoilerPanel", hashConfig.lockSpoilerPanel.toString());
          }
          else {
            setLockSpoilerPanel(oldLockSpoilerPanel);
            localStorage.setItem("lockSpoilerPanel", oldLockSpoilerPanel.toString());
          }
          location.hash = "";
    }

    const getShareHash = (lockSpoilerPanel: boolean) => {
        gameFilterOptions["lockSpoilerPanel"] = lockSpoilerPanel;
        return JSON.stringify(gameFilterOptions);
    }

    return <Provider value={{ filterOptions:gameFilterOptions[gameType], 
                                updateFilterOptions, 
                                loadFromHash, 
                                lockSpoilerPanel, 
                                getShareHash
                            }}>{children}</Provider>
}
 
export default FilterProvider;
