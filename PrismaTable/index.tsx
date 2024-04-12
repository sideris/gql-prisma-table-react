import React, { useEffect, useRef, useState } from 'react';
import {
    Button,
    Flex,
    HStack,
    Icon,
    Table,
    TableContainer,
    Tbody,
    Td,
    Thead,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import TH from './TH';
import ColSelectorModal from './ColSelectorModal';
import TableFilters from './TableFilters';
import { RiOrderPlayLine } from 'react-icons/ri';
import { ColumnConfig, Record, SortOrder } from '../types';
import Pagination from './Pagination';


interface PrismaTableProps {
    colConfig: ColumnConfig[];
    data: any[];
    loading: boolean;
    onFilter?: (filters: any) => void;
    onSort: (colKey: string, sortOrder: string | undefined) => void;
    onPageChange?: (page: number) => void;
    onSearch?: (searchString: string) => void;
    onSavePreference?: (key: string, value: any) => void;
    preferenceKey?: string;
    sort: Record | undefined;
    pageSize?: number;
    totalItems?: number;
}

function getSortedColKey(sort: any) {
    const keys = [];
    let tempSort = sort;
    while (typeof tempSort === 'object' && tempSort !== null) {
        const key = Object.keys(tempSort)[0];
        if (!key) break;
        keys.push(key);
        tempSort = tempSort[key];
        if (typeof tempSort === 'string') break;
    }
    return keys.join('.').length === 0 ? undefined : keys.join('.');
}


const PrismaTable: React.FC<PrismaTableProps> = ({
                                                 data,
                                                 colConfig,
                                                 loading,
                                                 onPageChange,
                                                 onFilter,
                                                 onSort,
                                                 onSavePreference,
                                                 preferenceKey,
                                                 sort,
                                                 pageSize = 10,
                                                 totalItems,
                                                 onSearch
                                             }) => {
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [displayData, setDisplayData] = useState<any[]>(data);
    const [sortOrder, setSortOrder] = useState<SortOrder | undefined>(undefined);
    const [scrollPosition, setScrollPosition] = useState<number>(0);
    const [cols, setCols] = useState<ColumnConfig[]>([]);
    const [page, setPage] = useState<number>(1);
    const sortedCol = sort ? getSortedColKey(sort) : undefined;

    const handleScroll = (e: any) => {
        setScrollPosition(e.target.scrollLeft);
    };

    const onSortHeader = (colKey: string) => {
        let newOrder: SortOrder;
        if (colKey === sortedCol) {
            newOrder = sortOrder === SortOrder.asc ? SortOrder.desc : SortOrder.asc;
        } else {
            newOrder = SortOrder.asc;
        }
        setSortOrder(newOrder);
        onSort(colKey, newOrder);
    }

    const handleColumnChange = async (newCols: ColumnConfig[]) => {
        if (onSavePreference && preferenceKey) {
            onSavePreference && onSavePreference(
                preferenceKey,
                newCols.map(({ render, ...others }) => others)
            );
        }
        onClose();
    }

    const onResetColumns = () => {
        onSavePreference && preferenceKey && onSavePreference(preferenceKey, null);
        onClose();
    }

    const onApplyFilters = (filters: any) => {
        if (onFilter) {
            onFilter(filters);
            setPage(1);
        }
    }

    const onChangePage = (page: number) => {
        if (onPageChange) {
            setPage(page);
            onPageChange(page);
        }
    }

    useEffect(() => {
        if (sort) {
            setSortOrder(Object.values(sort)[0]);
        }
    }, []);

    useEffect(() => {
        if (tableContainerRef.current) {
            tableContainerRef.current.scrollLeft = scrollPosition;
        }
    }, [displayData, loading, scrollPosition]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;
        if (!loading) {
            timer = setTimeout(() => {
                setDisplayData(data);
            }, 100);
        }
        return () => clearTimeout(timer);
    }, [data, loading]);

    useEffect(() => {
        setCols(colConfig);
    }, [colConfig]);

    return (
        <Flex className='prisma-table' direction='column' h='100%'>
            <HStack>
                <TableFilters colConfig={colConfig} onApply={onApplyFilters} onSearch={onSearch} />
                <Button onClick={onOpen} size='xxs' variant='black'>
                    <Icon as={RiOrderPlayLine} />
                </Button>
            </HStack>
            <Pagination
                currentPage={page}
                totalPages={Math.ceil((totalItems ?? 0) / pageSize ?? 1)}
                onPageChange={onChangePage} />
            <TableContainer ref={tableContainerRef} h='100%' maxH='75vh' overflowY='auto' onScroll={handleScroll}>
                <Table variant='striped' colorScheme='blackAlpha'>
                    <Thead position='sticky' top={0} bg='white' boxShadow='md' zIndex={1}>
                        <Tr>
                            {cols
                                .filter(col => col.visible !== false)
                                .map(col => (
                                    <TH
                                        {...col}
                                        key={col.key}
                                        colKey={col.key}
                                        sortKey={sortedCol}
                                        sortOrder={sortOrder}
                                        onSort={onSortHeader} />
                                ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        { displayData.length === 0 &&
                            <Tr>
                                <Td colSpan={cols.length} textAlign='center' color='gray.500'>
                                    No entries
                                </Td>
                            </Tr>
                        }
                        {displayData.map((row, index) => (
                            <Tr key={`row-${row.id}`}>
                                {cols
                                    .filter(col => col.visible !== false)
                                    .map((col, idx) => (
                                        <Td key={`${col.key}-${idx}`}>{col.render(row)}</Td>
                                    ))
                                }
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <ColSelectorModal
                columns={cols}
                isOpen={isOpen}
                onClose={onClose}
                onChangeCols={handleColumnChange}
                onReset={onResetColumns} />
        </Flex>
    );
}

export default PrismaTable;
