import React, { useRef, useState } from 'react'
import { GloomhavenItem } from "../../../State/Types"
import { Label} from "semantic-ui-react";
import ItemManagement from "./ItemManagement";
import { useGame } from '../../Game/GameProvider';
import { getItemPath } from '../../../games/GameData';

type Props = {
    item : GloomhavenItem
}

const ItemId = ({id}:{id: number}) => {
    return (<Label className="itemId"> #{id} </Label>); 
}

const ItemCard = (props:Props) => {
    const { item } = props;
    const {gameData: {gameType}} = useGame();

    const [draw, setDraw] = useState(false);

    return (
        <div className={'item-card-wrapper'}>
            <img
                src={getItemPath(item, gameType)}
                alt={item.name}
                onLoad={() => setDraw(true)}
                className={'item-card'}/>
            {draw && <ItemId id={item.id}/>}
            {draw && <ItemManagement item={item}/>}
        </div>
    )
}

export default ItemCard;
