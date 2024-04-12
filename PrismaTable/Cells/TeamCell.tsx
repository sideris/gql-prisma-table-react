import { Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { Contact, Maybe } from '../../../graphql/generated';
import CrmContact from '../../CrmContact';

interface TeamCellProps {
    contacts: (Maybe<Contact> | undefined)[];
}

const TeamCell: React.FC<TeamCellProps> = ({ contacts }) => {
    return (
        <Stack gap={0} p={0} m={0}>
            { (!contacts || contacts.length === 0) &&
                <Text>
                   -
                </Text>
            }
            {contacts && contacts.map((member: any) => (
                <CrmContact contact={member} key={`member-${member.id}`} />
            ))}
        </Stack>
    )
};

export default TeamCell;