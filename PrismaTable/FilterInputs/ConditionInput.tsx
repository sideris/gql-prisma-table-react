import React, { useCallback } from 'react';
import { Input, InputGroup, InputLeftAddon, Select } from '@chakra-ui/react';
import { ConditionalValue } from '../../types';

interface ConditionInputProps {
    condition: string;
    value: string | number | undefined;
    onChange: ({ value, condition }: ConditionalValue) => void;
    type?: 'text' | 'number' | 'date';
}

const ConditionInput: React.FC<ConditionInputProps> = ({ condition, value, onChange, type = 'text' }) => {
    const onConditionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ value: value, condition: e.target.value });
    }, [value]);

    const onChangeValue = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const parsedValue = type === 'number' ? parseFloat(newValue) : newValue;
        onChange({ value: parsedValue, condition })
    }, [condition, onChange, value, type]);

    return (
        <InputGroup size='sm'>
            <InputLeftAddon cursor='pointer' pl={0} pr={0} w='6em'>
                <Select
                    sx={{ padding: 0, '> option': { padding: 0 } }}
                    className='condition-select'
                    p={0}
                    value={condition}
                    textAlign='center'
                    icon={<></>}
                    border='none'
                    _focus={{ boxShadow: 'none' }}
                    onChange={onConditionChange}>
                    { type === 'number' &&
                        <>
                            <option value='equals'>=</option>
                            <option value='gte'>{`≥`}</option>
                            <option value='gt'>{`>`}</option>
                            <option value='lt'>{`<`}</option>
                            <option value='lte'>{`≤`}</option>
                        </>
                    }
                    { type === 'text' &&
                        <>
                            <option value='equals'>exact</option>
                            <option value='contains'>contain</option>
                            <option value='startsWith'>start</option>
                        </>
                    }
                    { type === 'date' &&
                        <>
                            <option value='equals'>on</option>
                            <option value='gt'>after</option>
                            <option value='lt'>before</option>
                        </>
                    }
                </Select>
            </InputLeftAddon>
            { type === 'number' &&
                <input
                    style={{
                        height: 'var(--input-height)',
                        fontSize: 'var(--input-font-size)',
                        paddingInlineStart: 'var(--input-padding)',
                        paddingInlineEnd: 'var(--input-padding)',
                        borderRadius: 'var(--input-border-radius)',
                        border: '1px solid',
                        borderColor: 'inherit',
                        width: '100%',
                    }}
                    step={0}
                    type={type}
                    value={value}
                    onChange={onChangeValue}/>
            }
            { type !== 'number' &&
                <Input
                    type={type}
                    value={value}
                    onChange={onChangeValue}
                    placeholder='value' />
            }
        </InputGroup>
    );
};

export default ConditionInput;
