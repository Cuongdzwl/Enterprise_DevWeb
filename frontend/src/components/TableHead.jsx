import React from 'react';

const TableHead = ({ headings }) => {
    return (
        <tr>
            {headings.map((heading, index) => (
                <th key={index}>{heading}</th>
            ))}
        </tr>
    );
};

export default TableHead;
