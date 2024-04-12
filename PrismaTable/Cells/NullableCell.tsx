import React from 'react';
import { Text } from '@chakra-ui/react';

const NullableCell = ({ value }: { value: string | number | null | undefined }) => (
    <Text>
        { value ?? '-' }
    </Text>
);

export default NullableCell;
