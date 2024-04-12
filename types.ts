import React from 'react';
import { MultiValue } from 'chakra-react-select';

export type Record = {
    [key: string]: any;
};

export type FiltersInput = {
    orderBy: Record;
    searchString?: string;
    skip?: number;
    take?: number;
    where?: Record;
};

export interface ColumnConfig {
    key: string;
    label: string;
    options?: { label: string; value: string }[];
    filterable?: boolean;
    editable?: boolean;
    sortable: boolean;
    visible?: boolean;
    type?: 'text' | 'number' | 'date' | 'set';
    render: (data: any, onChange?: any) => React.ReactNode;
}

export interface ConditionalValue {
    value: string | number | MultiValue<any> | undefined;
    condition: string;
}

export enum SortOrder {
    asc = 'asc',
    desc = 'desc',
}

export enum StringCaseSensitivity {
    default = 'default',
    insensitive = 'insensitive',
}
