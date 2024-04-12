import React from 'react';
import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Stack } from '@chakra-ui/react';

interface OptionCellProps {
    options: string[];
    value: string | undefined | null;
    onChange?: (e: string) => void;
    isDisabled?: boolean;
}

const OptionCell: React.FC<OptionCellProps> = ({ options, value, onChange, isDisabled = false }) => {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant='ghost' isDisabled={isDisabled}>{value || 'N/A'}</Button>
            </PopoverTrigger>
            <PopoverContent w='fit-content' color='white' bg='gray.700' borderColor='gray.700'>
                <PopoverArrow bg='gray.700' />
                <PopoverBody p={0}>
                    <Stack p={0}>
                        {options.map(option => (
                            <Button
                                variant='black'
                                key={option}
                                w='full'
                                onClick={() => onChange && onChange(option)}>
                                {option}
                            </Button>
                        ))}
                    </Stack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default OptionCell;
