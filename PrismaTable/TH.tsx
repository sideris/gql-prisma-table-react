import React, { useMemo } from 'react';
import { HStack, Icon, Text, Th } from '@chakra-ui/react';
import { MdEditNote } from 'react-icons/md';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa6';
import { SortOrder } from '../types';

interface THeadProps {
    label: string;
    sortable?: boolean;
    editable?: boolean;
    colKey: string;
    onSort: (colKey: string) => void;
    sortKey: string | undefined;
    sortOrder: string | undefined;
}

const TH: React.FC<THeadProps> = ({ label, colKey, onSort, sortKey, sortOrder, sortable = false, editable = false}) => {
    if (!sortable && !onSort) {
        throw new Error('TH must be sortable if onSort is provided');
    }

    const sortIcon = useMemo(() => {
        if (sortKey !== undefined && sortKey !== colKey) {
            return <Icon as={FaSort} color='gray.300' />;
        }
        if (sortable && sortKey === undefined) {
            return <Icon as={FaSort} />;
        }
        if (sortOrder === SortOrder.desc) {
            return <Icon as={FaSortDown} />;
        } else if (sortOrder === SortOrder.asc) {
            return <Icon as={FaSortUp} />;
        }
    }, [sortable, sortKey, sortOrder]);

    return (
        <Th
            cursor={sortable ? 'pointer' : 'normal'}
            textAlign='center'
            _hover={{ color: 'gray.900' }}
            userSelect={sortable ? 'none' : 'auto'}
            onClick={() => {
                if (sortable) {
                    onSort(colKey);
                }
            }}>
            <HStack spacing={2}>
                {editable && <Icon as={MdEditNote} />}
                <Text>{label}</Text>
                {sortable && sortIcon}
            </HStack>
        </Th>
    )
}

export default TH;