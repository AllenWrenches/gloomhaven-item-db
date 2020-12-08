import React from 'react'
import { GloomhavenItem, SortProperty, SortDirection } from '../../../State/Types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../State/Reducer';
import SearchOptions from './SearchOptions';
import { Message, Icon } from 'semantic-ui-react';
import ItemTable from './ItemTable';
import ItemGrid from './ItemGrid';
import { storeSortingProperty, storeSortingDirection } from '../../../State/ItemViewState';
import { getSpoilerFilter } from '../../../State/SpoilerFilter';

type Props = {
    items : GloomhavenItem[];
}

const ItemList = (props:Props) => {
    const {items} = props;
    const { displayAs, all } = getSpoilerFilter();
    const { property, direction } = useSelector<RootState>( state => state.itemViewState) as RootState['itemViewState'];
    const dispatch = useDispatch();

        const setSorting = (newProperty: SortProperty) => {
            let newDirection:SortDirection;
            if (property === newProperty) {
                newDirection = direction === SortDirection.ascending ? SortDirection.descending : SortDirection.ascending;
            } else {
                newDirection = SortDirection.ascending;
            }

            dispatch(storeSortingProperty(newProperty));
            dispatch(storeSortingDirection(newDirection));
        }
        
    return (
        <>
            <SearchOptions setSorting={setSorting}/>
            {all &&  (
                <Message negative>
                    <Message.Header><Icon name="exclamation triangle"/>Spoiler alert</Message.Header>
                    You are currently viewing all possible items.
                </Message>
            )}

            {displayAs === 'list' ? <ItemTable items={items} setSorting={setSorting}/> : <ItemGrid items={items}/>}

        </>
    );

}

export default ItemList;
