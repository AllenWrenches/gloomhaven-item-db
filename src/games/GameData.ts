import { FilterOptions } from "../components/Providers/FilterOptions";
import { Helpers } from "../helpers";
import { GloomhavenItem, GloomhavenItemSlot } from "../State/Types";
import { GameType } from "./GameType";

export type GameData = {
    gameType: GameType;
    gameName: string
    items: GloomhavenItem[];
    filterSlots: GloomhavenItemSlot[];
    isItemShown: (item:GloomhavenItem, filterOptions: FilterOptions) => boolean;
}

const deSpoilerItemSource = (source:string): string => {
    return source.replace(/{(.{2})}/, (m, m1) => '<img class="icon" src="'+require('../img/classes/'+m1+'.png')+'" alt="" />');
}

export const getInitialItems = (gameType: GameType) => {
    const items: GloomhavenItem[] = require(`./${gameType}/items.json`);
    const filterSlots: GloomhavenItemSlot[] = [];

    items.forEach(item => {

        item.descHTML = Helpers.parseEffectText(item.desc);
        const source = item.source.replace(/Reward from /ig, '')
                        .replace(/ ?\((Treasure #\d+)\)/ig, "\n$1")
                        .replace(/Solo Scenario #\d+ — /i, 'Solo ');
        item.source = deSpoilerItemSource(source);
        if (!filterSlots.includes(item.slot)) {
            filterSlots.push(item.slot);
        }
    });
    return {items, filterSlots};
}