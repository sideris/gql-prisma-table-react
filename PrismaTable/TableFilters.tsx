import React, { useCallback, useEffect, useState } from 'react';
import {
    Badge,
    Box,
    Button,
    FormLabel,
    HStack,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from '@chakra-ui/react';
import { MdCancel, MdSearch } from 'react-icons/md';
import { IoFilterOutline } from 'react-icons/io5';
import ConditionInput from './FilterInputs/ConditionInput';
import { Select as MultiSelect } from 'chakra-react-select';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { debounce } from 'lodash';
import { ColumnConfig, StringCaseSensitivity } from '../types';

const baseSchemas = {
    text: z.string(),
    number: z.number(),
    date: z.date(),
    set: z.array(z.string()),
};

const generateColumnSchema = (column: ColumnConfig) => {
    const { type, key } = column;
    const colType = type || 'text';
    const baseSchema = baseSchemas[colType as keyof typeof baseSchemas];
    if (!baseSchema) {
        throw new Error(`Unsupported type for column ${key}: ${type}`);
    }
    return { [key]: baseSchema };
};

const generateDynamicSchema = (columns: ColumnConfig[]) => {
    const schemaObject = columns.reduce((acc, column) => {
        if (column.filterable) {
            Object.assign(acc, generateColumnSchema(column));
        }
        return acc;
    }, {});

    return z.object(schemaObject);
};

interface TableFiltersProps {
    colConfig: ColumnConfig[];
    onApply?: (filters: any) => void
    onSearch?: (searchString: any) => void
}

const TableFilters = ({ colConfig, onApply, onSearch }: TableFiltersProps) => {
    const [filters, setFilters] = useState({} as any);
    const [searchStr, setSearchStr] = useState<string>('');
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [prevSearchStr, setPrevSearchStr] = useState<string | null>(null);
    const dynamicSchema = generateDynamicSchema(colConfig);

    const { reset, control,} = useForm({
        resolver: zodResolver(dynamicSchema),
    });

    const onSubmit = (filters: any) => {
        if (onApply) {
            onApply(formatFilters(filters));
            onClose();
        }
    };

    const onClear = () => {
        if (onApply) {
            reset();
            onApply({});
            setFilters({});
        }
    }

    const onSearchChange = (txt: string) => {
        setSearchStr(txt)
        setPrevSearchStr(txt)
    }

    const debouncedSearchString = useCallback(
        debounce(async (searchText: string) => {
            const trimmedString = searchText.trim();
            if (onSearch) {
                onSearch && onSearch(trimmedString && trimmedString !== '' ? searchText.trim(): undefined);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (prevSearchStr !== null) {
            debouncedSearchString(searchStr);
        }
        return () => {
            debouncedSearchString.cancel();
        };
    }, [searchStr, debouncedSearchString]);
    
    const formatFilters = (filters: any) => {
        return Object
            .entries(filters)
            .filter(([_, value]: [key: string, value: any]) => !!value.value)
            .reduce((acc, [key, value]: [key: string, value: any]) => {
                const keyParts = key.split('.');
                let nestedObject = acc;
                const type = colConfig.find(col => col.key === key)?.type ?? 'text';
                for (let i = 0; i < keyParts.length - 1; i++) {
                    const currentKey = keyParts[i];
                    if (!nestedObject[currentKey]) {
                        nestedObject[currentKey] = {};
                    }
                    nestedObject = nestedObject[currentKey];
                }
                const objKey = keyParts[keyParts.length - 1];
                if (value.condition === 'equals') {
                    nestedObject[objKey] = { equals: value.value };
                } else {
                    nestedObject[objKey] = {
                        [value.condition]: value.value
                    };
                }
                if (type === 'text') {
                    nestedObject[objKey].mode = StringCaseSensitivity.insensitive;
                }
                return acc;
            }, {} as any);
    }

    return (
        <>
            <HStack>
                <InputGroup size='xs' maxW={300}>
                    <InputRightElement pointerEvents='none'>
                        <Icon as={MdSearch} color='gray.300' />
                    </InputRightElement>
                    <Input
                        value={searchStr}
                        placeholder='Search'
                        onChange={e => onSearchChange(e.target.value)} />
                    <InputRightElement>
                        <Button
                            variant='link'
                            size='xs'
                            onClick={() => setSearchStr('')}>
                            <Icon as={MdCancel} color='gray.800' />
                        </Button>
                    </InputRightElement>
                </InputGroup>
                <Box position='relative' display='inline-block' borderRadius='sm'>
                    <Button variant='outline' size='xs' onClick={onOpen}>
                        <Icon as={IoFilterOutline} color='gray.800' />
                        <Text ml={1}>
                            Filter
                        </Text>
                    </Button>
                    { Object
                        .entries(filters)
                        .filter(([_, value]: [key: string, value: any]) => !!value.value)
                        .length > 0 && (
                        <Badge
                            color='black.900'
                            position='absolute'
                            userSelect='none'
                            size='xs'
                            right='-5px'
                            top='-2px'
                            variant='outline'>
                            {Object
                                .entries(filters)
                                .filter(([_, value]: [key: string, value: any]) => !!value.value)
                                .length}
                        </Badge>
                    )}
                </Box>
                <Button
                    variant='ghost'
                    size='sm'
                    isDisabled={Object.keys(filters).length === 0}
                    onClick={onClear}>
                    Clear
                </Button>
            </HStack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Filters</ModalHeader>
                    <ModalBody>
                        <form>
                            {colConfig
                                .filter(col => col.filterable ?? false)
                                .map(col => (
                                    <Controller
                                        key={col.key}
                                        control={control}
                                        name={col.key}
                                        render={({ field }) => (
                                            <Box my={2}>
                                                <FormLabel mb={1}>{col.label}</FormLabel>
                                                { col.type === 'set' &&
                                                    <MultiSelect
                                                        isMulti
                                                        value={field.value}
                                                        name={col.key}
                                                        options={col.options || []}
                                                        closeMenuOnSelect={false}
                                                        onChange={v => {
                                                            const newFilters = {
                                                                ...filters,
                                                                [col.key]: {
                                                                    condition: 'in',
                                                                    value: v.map(option => option.value)
                                                                }
                                                            };
                                                            setFilters(newFilters);
                                                            field.onChange(v);
                                                        }} />
                                                }
                                                { col.type !== 'set' &&
                                                    <ConditionInput
                                                        type={col.type}
                                                        onChange={v => {
                                                            const newFilters = {
                                                                ...filters,
                                                                [col.key]: v
                                                            };
                                                            setFilters(newFilters);
                                                            field.onChange(v.value);
                                                        }}
                                                        condition={filters[col.key]?.condition ?? 'equals'}
                                                        value={field.value} />
                                                }
                                            </Box>
                                        )} />
                                ))}
                        </form>
                        <ModalFooter>
                            <Button variant='black' onClick={() => onSubmit(filters)}>
                                Apply
                            </Button>
                        </ModalFooter>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default TableFilters;
