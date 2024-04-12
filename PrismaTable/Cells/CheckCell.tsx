import { Checkbox } from '@chakra-ui/react';
import React from 'react';

interface CheckCellProps {
    isChecked: boolean;
    isDisabled?: boolean;
    onChange?: () => void;
}

const CheckCell: React.FC<CheckCellProps> = ({ isChecked, onChange, isDisabled = false }) => {
    return (
        <Checkbox isChecked={isChecked} onChange={onChange} isDisabled={isDisabled} />
    );
}

export default CheckCell;
