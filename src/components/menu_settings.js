import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useCallback, useEffect, useState } from 'react'
import React from 'react';
import { API } from 'aws-amplify'
import UserProvider from './appuser'

const initialState = {
  accountId: 'Input your AWS account ID'
}

const Settings = () => {
  const cfnUrl = 'https://eu-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/create/review'
  const templateUrl = '?templateURL=https://amplify-cloudcapacitymanager-dev-141456-deployment.s3.amazonaws.com/RoleToAssume.yaml'
  const stackName = '&stackName=RoleForCCM'
  const accessCodeParamString = '&param_CCMAccessCode='
  const [isLinkVisible, SetIsLinkVisible] = useState(false)
  const [LinkValue, SetLinkValue] = useState('')
  const [localUser, setLocalUser] = useState(initialState)
  const [showInfo, SetShowInfo] = useState(false)

  const SyncUser = useCallback(async () => {
    let newState = await JSON.parse(window.localStorage.getItem('ccm-user-state'))
    setLocalUser(newState)
  }, [])

  useEffect(() => {
    SyncUser();
  }, [SyncUser])

  const GenerateLink = (code) => {
    SetLinkValue(cfnUrl + templateUrl + stackName + accessCodeParamString + code)
    SetIsLinkVisible(true)
  }
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const OpenLink = () => {
    window.open(LinkValue)
    setOpen(false);
  }
  function handleChangeAcc(event) {
    setLocalUser({ ...localUser, accountId: event.target.value });
    SetShowInfo(false)
  }


  const handleAccountIdUpdate = async () => {
    try {
      await API
        .post('ccmGTestApiLambda', '/appuser/accId',
          {
            body: {
              "id": localUser.username,
              "accountId": localUser.accountId
            },
            headers: {
              "Content-Type": "application/json"
            }
          })
      window.localStorage.setItem('ccm-user-state', JSON.stringify(localUser))
      SetShowInfo(true)
    }
    catch (err) {
      console.log('error uploading AWS Account ID:', err)
    }
  }


  return (
    <Container>
      <Box
        component="section"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "background.default" : "grey.50",
        }}
      >
        <UserProvider>
          {user => (<>
            <Container sx={{ py: 5 }} maxWidth="sm">
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography align='center' variant='h6'>Getting Started</Typography>
                    <Typography align='left' color='text.secondary' variant='subtitle1'>In order to start using CCM, you must create an IAM role from the link provided.
                      This link is unique for your user, do not share for your security.</Typography>
                    {!isLinkVisible ? <Box textAlign='center'>
                      <Button fullWidth size="large" sx={{ mt: 2 }} variant="outlined" onClick={() => GenerateLink(user.externalId)}>Generate Link</Button></Box>
                      :
                      <div><Box textAlign='center'>
                        <Button fullWidth size="large" sx={{ mt: 2 }} variant="contained" onClick={handleClickOpen} align='center'>
                          Open Link
                        </Button>
                      </Box>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Create IAM Role for CCM?"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              You are about to create a role that this
                              application will assume and use to make changes on your AWS account on your behalf. <br /><br /> Make sure you are logged in on the correct AWS account (Organisations Master Account).
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={OpenLink}>Create Stack</Button>
                            <Button onClick={handleClose} autoFocus>
                              Cancel
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </div>}
                  </Box>
                </CardContent>
              </Card>
            </Container>
            <Container sx={{ py: 5 }} maxWidth="sm">
              <Card>
                <CardContent>
                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography component="h6" variant="h6">
                      Add AWS account number
                    </Typography>
                    <Typography
                      color="text.secondary"
                      component="div"
                      sx={{ mt: 2 }}
                      variant="subtitle1"
                    >
                      CCM App requires the AWS account number with IAM role created from the above link.
                    </Typography>
                  </Box>
                  <Box component="form" noValidate>
                    <TextField
                      id="accountId"
                      placeholder="i.e. 57888745421"
                      label="Please enter valid AWS account ID"
                      onChange={event => handleChangeAcc(event)}
                      value={localUser ? localUser.accountId : () => this.onAuthEvent}
                      required
                      fullWidth
                      focused
                    />
                  </Box>
                  {localUser.accountId !== null ?
                    <Button fullWidth size="large" sx={{ mt: 2 }} variant="contained" onClick={() => handleAccountIdUpdate()}>
                      Update
                    </Button>
                    :
                    <Button fullWidth size="large" sx={{ mt: 2 }} variant="contained" onClick={handleAccountIdUpdate}>
                      Add
                    </Button>
                  }
                  {showInfo &&
                    <Box sx={{ textAlign: "center", mb: 2, pt: 2 }}>
                      <Chip label="Successfully updated!" sx={{ color: 'green' }} />
                    </Box>
                  }
                </CardContent>
              </Card>

            </Container>



          </>)}
        </UserProvider>
      </Box>
    </Container >
  )
}

export default Settings