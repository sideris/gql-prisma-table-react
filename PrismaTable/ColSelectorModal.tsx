import {
    Button,
    Checkbox,
    HStack,
    Icon,
    List,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spacer,
    Text
} from '@chakra-ui/react';
import { IoMdReorder } from 'react-icons/io';
import React, { useEffect, useState } from 'react';
import { ColumnConfig } from './types';

interface ColSelectorModalProps {
    columns: ColumnConfig[];
    isOpen: boolean;
    onClose: () => void;
    onChangeCols: (cols: ColumnConfig[]) => void;
    onReset: (cols: ColumnConfig[]) => void;
}

const ColSelectorModal: React.FC<ColSelectorModalProps> = ({ columns, isOpen, onClose, onChangeCols, onReset }) => {
    const [internalCols, setInternalCols] = useState<ColumnConfig[]>(columns);
    const [targetIndex, setTargetIndex] = useState<number | null>(null);

    const handleDragStart = (e: any, position: any) => {
        e.dataTransfer.setData('text/plain', position);
    };
    const handleDragOver = (e: any, index: number) => {
        e.preventDefault();
        if (index !== targetIndex) {
            setTargetIndex(index);
        }
    };

    const onResetColumns = () => {
        setInternalCols(columns);
        onReset(columns);
    }

    const handleDrop = (e: any) => {
        const originalPosition = e.dataTransfer.getData('text/plain');
        const items = [...internalCols];
        const [reorderedItem] = items.splice(originalPosition, 1);
        items.splice(targetIndex ?? 0, 0, reorderedItem);

        setInternalCols(items);
        setTargetIndex(null);
        e.preventDefault();
    };

    const handleColVisible = (key: string, isVisible: boolean) => {
        const updatedCols = internalCols.map((col: ColumnConfig) => {
            if (col.key === key) {
                return { ...col, visible: isVisible };
            }
            return col;
        });
        setInternalCols(updatedCols);
    };

    useEffect(() => {
        setInternalCols(columns);
    }, [columns]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <HStack>
                        <Text fontSize='lg'>Column Selector</Text>
                        <Spacer/>
                        <Button size='xs' colorScheme='red' variant='link' onClick={onResetColumns}>
                            reset
                        </Button>
                        <Button size='sm' variant='black' onClick={() => onChangeCols(internalCols)}>
                            Save
                        </Button>
                    </HStack>
                </ModalHeader>
                <ModalBody overflowY='scroll' maxH='80vh'>
                    <List spacing={2}>
                        {internalCols
                            .map((c: ColumnConfig) => ({
                                key: c.key,
                                label: c.label,
                                visible: c.visible !== undefined ? c.visible : true }))
                            .map((col, index: number) => (
                                <ListItem
                                    key={col.key}
                                    p={2}
                                    borderWidth={1}
                                    draggable='true'
                                    onDragStart={e => handleDragStart(e, index)}
                                    onDrop={handleDrop}
                                    onDragOver={e => handleDragOver(e, index)}
                                    bg={targetIndex === index ? 'blue.50' : 'transparent'} // Change background color as an indicator
                                    _hover={{ bg: targetIndex === index ? 'blue.100' : 'gray.50' }}
                                    rounded='lg'>
                                    <HStack justify='space-between'>
                                        <Icon as={IoMdReorder} cursor='grab' />
                                        <Text>{col.label}</Text>
                                        <Checkbox
                                            isChecked={col.visible}
                                            onChange={e => handleColVisible(col.key, e.target.checked)} />
                                    </HStack>
                                </ListItem>
                            ))}
                    </List>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default ColSelectorModal;
