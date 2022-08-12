import React, { useCallback, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { API } from 'aws-amplify';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';


const orgColumns = [
  {
    field: 'Id',
    headerName: 'ID',
    width: 200
  },
  {
    field: 'Name',
    headerName: 'Name',
    width: 200,
    editable: true,
  },
  {
    field: 'Email',
    headerName: 'Email',
    width: 300,
    editable: true,
  },
  {
    field: 'Status',
    headerName: 'Status',
    sortable: false,
    width: 100
  },
];

const iamColumns = [{
    field: 'UserId',
    headerName: 'ID',
    width: 250
  },{
    field: 'UserName',
    headerName: 'Name',
    width: 200,
    editable: true,
  },{
    field: 'Arn',
    headerName: 'Arn',
    width: 400,
    editable: true,
  }
];

export default function Users() {
  const [value, setValue] = useState('1');
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const accountId = JSON.parse(window.localStorage.getItem('ccm-user-state')).accountId
  const externalId = JSON.parse(window.localStorage.getItem('ccm-user-state')).externalId
  const [orgUsers, SetOrgUsers] = useState([])
  const [iamUsers, SetIamUsers] = useState([])
  const [completed, setCompleted] = useState(false)

  const SyncData = useCallback(async () => {
    if (orgUsers.length === 0 && iamUsers.length === 0) {
    await fetchUsers('org', accountId, externalId)
    await fetchUsers('iam', accountId, externalId)
      .then(setCompleted(true))}
    else {
      setCompleted(true)
    }
  }, [accountId, externalId, orgUsers.length, iamUsers.length])

  useEffect(() => {
    SyncData();
  }, [SyncData])


  async function fetchUsers(type, accountId, externalId) {
    let path = '/listusers/org'
    if (type === 'org') {
      path = '/listusers/org'
    }
    else if (type === 'iam') {
      path = '/listusers/iam'
    }
    try {
      await API
        .post('ccmGTestApiLambda', path,
          {
            body: { "accountId": accountId, "externalId": externalId },
            header: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            }
          })

        .then(response => {
          if (type === 'org') {
            SetOrgUsers(response)
          }
          else if (type === 'iam') {
            SetIamUsers(response)
          }
          console.log('fetched');
        })
    }
    catch (err) {
      console.log('error users details:', err)
      setCompleted(false)
    }
  }

  return (
    <>
      {completed && Array.isArray(iamUsers.Users)?
        <Container>
          <h2>Mock Data Grid (not connected to backend yet)</h2>
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Organization Users" value="1" />
                  <Tab label="IAM Users" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <div style={{ height: 600, width: '100%' }}>
                  <DataGrid
                    getRowId={(row) => row.Id}
                    rows={orgUsers.Accounts} 
                    columns={orgColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                </div>
              </TabPanel>
              <TabPanel value="2">
                <div style={{ height: 600, width: '100%' }}>
                  <DataGrid
                    getRowId={(row) => row.UserId}
                    rows={iamUsers.Users} 
                    columns={iamColumns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    checkboxSelection
                    disableSelectionOnClick
                  />
                </div>
              </TabPanel>
            </TabContext>
          </Box>
        </Container>
        :
        <CircularProgress />
      }
    </>
  )
}