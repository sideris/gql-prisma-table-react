import React from 'react';
import { Button, ButtonGroup, Flex, Text } from '@chakra-ui/react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const MAX_DISPLAY_MID = 2;

    const getPages = () => {
        const pages = [];
        if (totalPages <= MAX_DISPLAY_MID + 1) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let startPage = Math.max(currentPage - Math.floor(MAX_DISPLAY_MID / 2), 1);
            const endPage = Math.min(startPage + MAX_DISPLAY_MID - 1, totalPages);
            if (endPage - startPage + 1 > MAX_DISPLAY_MID) {
                startPage = endPage - MAX_DISPLAY_MID + 1;
            }
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <Flex width='100%' justifyContent='center'>
            <ButtonGroup spacing={2}>
                <Button
                    variant='outline'
                    isDisabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    size='xs'>
                    Previous
                </Button>
                {currentPage > 1 + MAX_DISPLAY_MID && (
                    <>
                        <Button onClick={() => onPageChange(1)} size='xs'>1</Button>
                        {totalPages > MAX_DISPLAY_MID + 2 && <Text mx={2}>...</Text>}
                    </>
                )}

                {getPages().map(page => (
                    <Button
                        key={page}
                        variant={currentPage === page ? 'black' : 'outline'}
                        colorScheme={currentPage === page ? 'blue' : 'gray'}
                        size='xs'
                        onClick={() => onPageChange(page)}>
                        {page}
                    </Button>
                ))}

                {currentPage < totalPages - MAX_DISPLAY_MID && (
                    <>
                        {totalPages > MAX_DISPLAY_MID + 2 && <Text mx={2}>...</Text>}
                        <Button size='xs' onClick={() => onPageChange(totalPages)}>{totalPages}</Button>
                    </>
                )}

                <Button
                    isDisabled={currentPage === totalPages}
                    size='xs'
                    variant='outline'
                    onClick={() => onPageChange(currentPage + 1)}>
                    Next
                </Button>
            </ButtonGroup>
        </Flex>
    );
};

export default Pagination;
