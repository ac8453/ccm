import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Container from '@mui/material/Container';


const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'Project Name',
    headerName: 'Project name',
    width: 150,
    editable: true,
  },
  {
    field: 'Tag',
    headerName: 'Tag',
    width: 150,
    editable: true,
  },
  {
    field: 'Users Assigned',
    headerName: 'Users Assigned',
    type: 'number',
    width: 110,
    editable: true,
  },
  {
    field: 'something',
    headerName: 'something',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.row.projectName || ''} ${params.row.tag || ''}`,
  },
];

const rows = [
  { id: 1, tag: 'Website', projectName: 'Jon', age: 35 },
  { id: 2, tag: 'Lannister', projectName: 'Cersei', age: 42 },
  { id: 3, tag: 'Lannister', projectName: 'Jaime', age: 45 },
  { id: 4, tag: 'Stark', projectName: 'Arya', age: 16 },
  { id: 5, tag: 'Targaryen', projectName: 'Daenerys', age: null },
  { id: 6, tag: 'Melisandre', projectName: null, age: 150 },
  { id: 7, tag: 'Clifford', projectName: 'Ferrara', age: 44 },
  { id: 8, tag: 'Frances', projectName: 'Rossini', age: 36 },
  { id: 9, tag: 'Roxie', projectName: 'Harvey', age: 65 },
];

export default function Projects() {
  return (
    <Container>
    <h2>Mock Data Grid (not connected to backend yet)</h2>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div></Container>
  );
}