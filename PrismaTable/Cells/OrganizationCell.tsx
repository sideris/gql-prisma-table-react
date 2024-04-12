import { ContactsQuery } from '../../../graphql/generated';
import React from 'react';
import { Icon, Text } from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Contact = ContactsQuery['contacts']['contacts'][0];
type Organization = NonNullable<Contact['organizations']>[number];

const OrganizationCell = ({ organization }: { organization: Organization | null | undefined }) => {
    return (
        <>
            { !organization && <Text>-</Text> }
            { organization && organization.organization.website &&
                <Text as='a' href={organization.organization.website} target='_blank' rel='noreferrer'>
                    <Icon as={FaExternalLinkAlt} mr={2} />
                    { organization.organization.name }
                </Text>
            }
            { organization && !organization.organization.website &&
                <Text>
                    { organization?.organization.name }
                </Text>
            }
        </>

    )
}

export default OrganizationCell;