import React, { useState } from 'react';
import { Box, Button, Icon, Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import NullableCell from './NullableCell';
import { FaCheck } from 'react-icons/fa';
import { VOrNone } from './types';
import TruncatedCell from './TruncatedCell';
import { FaXmark } from 'react-icons/fa6';

interface UrlCellProps {
    value: VOrNone;
    onChange: (v: any) => void;
    pad?: number | string;
}

const EditableTextCell: React.FC<UrlCellProps> = ({ value, onChange, pad }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [v, setV] = useState<VOrNone>(value);
    return (
        <>
            { !isEditing &&
                <Box onClick={() => setIsEditing(true)}>
                    { pad && <TruncatedCell content={v ? String(v) : '-'}  maxW={pad} /> }
                    { !pad && <NullableCell value={v} /> }
                </Box>
            }
            { isEditing &&
                <InputGroup minW={250}>
                    <Input
                        autoFocus
                        value={v ?? ''}
                        onChange={e => setV(e.target.value)} />
                    <InputRightElement>
                        <Button
                            size='xxs'
                            onClick={() => {
                                setIsEditing(false);
                            }}>
                            <Icon as={FaXmark} color='red.400' />
                        </Button>
                        <Button
                            size='xxs'
                            onClick={() => {
                                onChange(v);
                                setIsEditing(false);
                            }}>
                            <Icon as={FaCheck} color='green.400' />
                        </Button>
                    </InputRightElement>
                </InputGroup>
            }
        </>
    )
}

export default EditableTextCell;
