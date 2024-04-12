import React from 'react';
import { Text, Tooltip } from '@chakra-ui/react';

const TruncatedCell: React.FC<{ content: string, maxW?: string | number }> = ({ content, maxW = '30em' }) => (
    <Tooltip label={content} hasArrow={false} m={0} p={0} placement='top-start'>
        <Text
            borderBottomWidth={0}
            overflow='hidden'
            m={0}
            p={0}
            maxW={maxW}
            textOverflow='ellipsis'
            whiteSpace='nowrap'
            textTransform='none'>
            {content}
        </Text>
    </Tooltip>
);

export default TruncatedCell;