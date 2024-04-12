import React from 'react';
import { Link, Text } from '@chakra-ui/react';
import { TruncatedCell } from './index';

interface UrlCellProps {
    value: string | number | null | undefined;
    url: string | undefined | null;
    isExternal?: boolean;
    maxW?: string | number;
}

const UrlCell: React.FC<UrlCellProps> = ({ value, url, isExternal = true, maxW = '30em' }) => {
    return (
        <>
            { url &&
                <Link isExternal={isExternal} href={url}>
                    <TruncatedCell content={ value ? String(value) : '-' } maxW={maxW} />
                </Link>
            }
            { !url &&
                <Text>
                   -
                </Text>
            }
        </>
    )
}

export default UrlCell;
