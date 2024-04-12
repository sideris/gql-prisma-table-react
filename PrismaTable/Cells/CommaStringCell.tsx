import React from 'react';
import { Wrap, WrapItem, Text, Badge } from '@chakra-ui/react';

const CommaStringCell = ({ value }: { value: string | undefined | null }) => {
    return (
        <Wrap spacing='2px'>
            { !value && <Text color='gray.500'>-</Text> }
            { value && value
                .split(',')
                .map((s, idx) => (
                    <WrapItem key={`${s}-${idx}`}>
                        <Badge>{s.trim()}</Badge>
                    </WrapItem>
                )) }
        </Wrap>
    )
}

export default CommaStringCell;
