/* src/components/home.js */
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import BuildRoundedIcon from '@mui/icons-material/BuildRounded';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import ListAltIcon from '@mui/icons-material/ListAlt';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import SpeedIcon from '@mui/icons-material/Speed';
import StorageIcon from '@mui/icons-material/Storage';
import WorkIcon from '@mui/icons-material/Work';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Amplify, { Auth } from 'aws-amplify';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import awsExports from "../aws-exports";
import UserConsumer from "./appuser";
import Dashboard from './menu_dashboard';
import Portfolios from "./menu_portfolios";
import MenuProducts from './menu_products';
import Projects from './menu_projects';
import Settings from './menu_settings';
import Users from './menu_users';
Amplify.configure(awsExports)
const drawerWidth = 240
const drawerContentTopMargin = -10
const drawerTopMargin = 8
const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),

    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
)

const CCM = () => {
    const navigate = useNavigate();

    //Side menu options:
    const topSideMenu = [
        {
            name: 'Dashboard',
            component: <Dashboard />,
            icon: <SpeedIcon />
        },
        {
            name: 'Users',
            component: <Users />,
            icon: <GroupSharpIcon />
        },
        {
            name: 'Portfolios',
            component: <Portfolios />,
            icon: <ListAltIcon />
        },
        {
            name: 'Projects',
            component: <Projects />,
            icon: <WorkIcon />
        },
        {
            name: 'Resources',
            component: <MenuProducts />,
            icon: <StorageIcon />
        }
    ]
    const bottomSideMenu = [
        {
            name: 'Settings',
            component: <Settings />,
            icon: <BuildRoundedIcon />
        },
        {
            name: 'Sign Out',
            component: false,
            icon: <MeetingRoomRoundedIcon />
        },
    ]
    const [currentComponent, SetCurrentComponent] = useState(<Dashboard />)
    const [open, setOpen] = useState(false)
    const handleDrawerOpen = () => {
        setOpen(true)
    }
    const handleDrawerClose = () => {
        setOpen(false)
    }
    const handleChangeComponent = (component) => {
        if (typeof component === 'object') {
            SetCurrentComponent(component)
        }
        else {
            <UserConsumer>
                {Auth.signOut()}
                {navigate('/')}
            </UserConsumer>
        }
    }
    return (
        <Container>
            <Authenticator>
                {() => (
                    <>
                        <Box sx={{ display: 'flex', mt: drawerContentTopMargin }}>
                            <CssBaseline />
                            <Drawer variant="permanent" open={open} PaperProps={{
                                sx: {
                                    backgroundColor: '#1976d2', mt: drawerTopMargin, color: 'white'
                                }
                            }}>
                                <DrawerHeader>
                                    {open ?
                                        <IconButton onClick={handleDrawerClose}>
                                            <ChevronLeftIcon style={{ color: '#fff' }} />
                                        </IconButton> :
                                        <IconButton onClick={handleDrawerOpen}>
                                            <ChevronRightIcon style={{ color: '#fff' }} />
                                        </IconButton>}
                                </DrawerHeader>
                                <Divider />
                                <List style={{ color: '#fff' }}>
                                    {topSideMenu.map((option, index) => (
                                        <ListItem key={option.name} disablePadding sx={{ display: 'block' }}>
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5,
                                                }}
                                                onClick={() => handleChangeComponent(option.component)}
                                            >
                                                <ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {option.icon}
                                                </ListItemIcon>
                                                <ListItemText primary={option.name} sx={{ opacity: open ? 1 : 0 }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                                <Divider />
                                <List>
                                    {bottomSideMenu.map((option, index) => (
                                        <ListItem key={option.name} disablePadding sx={{ display: 'block' }}>
                                            <ListItemButton
                                                sx={{
                                                    minHeight: 48,
                                                    justifyContent: open ? 'initial' : 'center',
                                                    px: 2.5
                                                }}
                                                onClick={() => handleChangeComponent(option.component)}

                                            >
                                                {<ListItemIcon
                                                    sx={{
                                                        minWidth: 0,
                                                        mr: open ? 3 : 'auto',
                                                        justifyContent: 'center',
                                                        color: '#fff'
                                                    }}
                                                >
                                                    {option.icon}
                                                </ListItemIcon>}
                                                <ListItemText primary={option.name} sx={{ opacity: open ? 1 : 0 }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Drawer>
                            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                                <DrawerHeader />
                                {currentComponent}
                            </Box>
                        </Box>
                    </>)}
            </Authenticator>
        </Container >
    )
}

export default CCM