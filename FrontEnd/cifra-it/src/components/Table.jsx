import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react';

const Table = ({ columns, data, onRowClick, striped = true, hover = true }) => {
  // Debug logging
  console.log('Table component received:', {
    columns,
    data,
    firstRow: data?.[0]
  });

  // Ensure data is always an array
  const tableData = Array.isArray(data) ? data : [];

  return (
    <>
      <CTable striped={striped} hover={hover}>
        <CTableHead>
          <CTableRow>
            {columns.map((column, index) => (
              <CTableHeaderCell key={column.key} scope="col">
                {column.label}
              </CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tableData.length === 0 ? (
            <CTableRow>
              <CTableDataCell colSpan={columns.length} className="text-center text-muted">
                No hay datos disponibles
              </CTableDataCell>
            </CTableRow>
          ) : (
            tableData.map((row, rowIndex) => (
              <CTableRow 
                key={`row-${row.id || rowIndex}`}
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((column) => (
                  <CTableDataCell key={`cell-${row.id || rowIndex}-${column.key}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </CTableDataCell>
                ))}
              </CTableRow>
            ))
          )}
        </CTableBody>
      </CTable>
    </>
  );
};

export default Table;