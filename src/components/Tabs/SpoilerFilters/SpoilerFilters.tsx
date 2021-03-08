import React from 'react'
import { Form, Button, Icon} from 'semantic-ui-react';
import PartySpoilerFilter from './PartySpoilerFilter';
import { useFilterOptions } from '../../Providers/FilterOptionsProvider';
import GHSpoilerFilter from './GHSpoilerFilter';
import JOTLSpoilerFilter from './JOTLSpoilerFilter';
import PartyManagementFilter from './PartyManagementFilter';

const SpoilerFilters = () => {
    const { filterOptions: {all}, updateFilterOptions } = useFilterOptions();

    return (
        <Form>
            <Form.Group inline>
                <label>Respecting Spoiler Settings:</label>
                <Button
                    color={all ? 'red' : 'blue'}
                    onClick={() => updateFilterOptions({all:!all})}
                >
                    {all
                        ? <React.Fragment><Icon name={'eye'}/> disabled</React.Fragment>
                        : <React.Fragment><Icon name={'eye slash'}/> enabled</React.Fragment>
                    }
                </Button>
            </Form.Group>

            <PartyManagementFilter/>
            <PartySpoilerFilter/>
            <GHSpoilerFilter/>
            <JOTLSpoilerFilter/>
     
        </Form>
    );
}

export default SpoilerFilters;
