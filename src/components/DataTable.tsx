import React from 'react';

interface DataTableProps {
  data: any[];
  columns: {
    header: string;
    accessor: string;
    cell?: (value: any, row: any) => React.ReactNode;
  }[];
  onRowClick?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, onRowClick }) => {
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.cell 
                    ? column.cell(row[column.accessor], row) 
                    : row[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
