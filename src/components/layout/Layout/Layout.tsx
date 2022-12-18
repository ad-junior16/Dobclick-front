import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBoxArchive, faChartLine, faChevronLeft, faChevronRight, faDashboard, faDoorOpen, faTruck, faUserCircle, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Button, Container, Menu, MenuItem } from '@mui/material';
import "../../../App.css";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
const drawerWidth = 240;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

//

const StyledLink = styled(Link)`
  && {
    text-decoration: none;
  }
`;

//

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,

    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',

  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Layout: React.FC = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const openLogMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const context = React.useContext(AuthContext);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Sair = () =>{
    setAnchorEl(null);
    context.Logout();
    // navigate('/');
  }


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Dobclick
          </Typography>
          <Button
            color="inherit"
            id="basic-button"
            aria-controls={openLogMenu ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openLogMenu ? 'true' : undefined}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faUserCircle} size={'2x'} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={openLogMenu}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Minha Conta</MenuItem>
            <Divider />
              <Link className='text-decoration-none text-dark' to={"/"}>
            <MenuItem onClick={Sair}>
             Sair
              <Typography variant="body2" color="text.secondary" className='ps-5'>
                <FontAwesomeIcon icon={faDoorOpen} />
              </Typography>
            </MenuItem>
              </Link>
              
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#053259',
            color: "white"
          },

        }}
        variant="persistent"
        anchor="left"

        open={open}
      >
        <DrawerHeader className='.bg-custom-secondary'>
          <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
            {theme.direction === 'ltr' ? <FontAwesomeIcon icon={faChevronLeft} /> : <FontAwesomeIcon icon={faChevronRight} />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <Link className='text-decoration-none text-white' onClick={handleDrawerClose} to={"/Home"}>
            <ListItem button>

              <ListItemText >
                Home
              </ListItemText>
              <ListItemIcon>
                <FontAwesomeIcon icon={faDashboard} color='white' ></FontAwesomeIcon>
              </ListItemIcon>
            </ListItem>
          </Link>

          <Link className='text-decoration-none text-white' onClick={handleDrawerClose} to={"/clientes"}>
            <ListItem button>

              <ListItemText>
                Clientes
              </ListItemText>
              <ListItemIcon>
                <FontAwesomeIcon icon={faUsers} color='white' ></FontAwesomeIcon>
              </ListItemIcon>
            </ListItem>
          </Link>

          
          <Link className='text-decoration-none text-white' onClick={handleDrawerClose} to={"/fornecedores"}>
            <ListItem button>

              <ListItemText>
                Fornecedores
              </ListItemText>
              <ListItemIcon>
                <FontAwesomeIcon icon={faTruck} color='white' ></FontAwesomeIcon>
              </ListItemIcon>
            </ListItem>
          </Link>

          <Link className='text-decoration-none text-white' onClick={handleDrawerClose} to={"/estoque"}>
            <ListItem button>
              <ListItemText >
                Estoque
              </ListItemText>
              <ListItemIcon>
                <FontAwesomeIcon icon={faBoxArchive} color='white' ></FontAwesomeIcon>
              </ListItemIcon>
            </ListItem>
          </Link>

          <Link className='text-decoration-none text-white' onClick={handleDrawerClose} to={"/vendas"}>
            <ListItem button>
              <ListItemText >
                Vendas
              </ListItemText>
              <ListItemIcon>
                <FontAwesomeIcon icon={faChartLine} color='white' ></FontAwesomeIcon>
              </ListItemIcon>
            </ListItem>
          </Link>

        </List>
      </Drawer>
      <Main className="p-3" open={open}>
        <DrawerHeader />
       <div className="container-fluid">
          {children}
       </div>
      </Main>
    </Box>
  );
}

export default Layout;


  // return (
  //   <>
  //     <nav className="navbar navbar-dark bg-custom-primary">
  //       <div className="container-fluid ">
  //         <button className="navbar-toggler text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar">
  //           <FontAwesomeIcon icon={faBars} size={"lg"} />
  //         </button>
  //         <div className="dropdown">
  //           <a className="navbar-brand mouseclick" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
  //             <FontAwesomeIcon icon={faUserCircle} size={"lg"} />
  //           </a>
  //           <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark " aria-labelledby="dropdownMenuButton1">
  //             <li><a className="dropdown-item" href="#">Action</a></li>
  //             <li><a className="dropdown-item" href="#">Another action</a></li>
  //             <li><a className="dropdown-item" href="#">Something else here</a></li>
  //           </ul>
  //         </div>
  //         { }
  //         <div className="offcanvas offcanvas-start bg-custom-secondary text-white" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
  //           <div className="offcanvas-header">
  //             <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Dobclick</h5>
  //             <a type="button" className=" text-reset text-white" data-bs-dismiss="offcanvas" aria-label="Close"> <FontAwesomeIcon icon={faAnglesRight} size={"lg"} /></a>
  //           </div>
  //           <div className="offcanvas-body ">
  //             <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
  //               <li className="nav-item">
  //                 <Link className="nav-link   text-white active"  aria-current="page" to={'/'}>DashBoard</Link>
  //               </li>
  //               <li className="nav-item">
  //                 <Link className="nav-link  text-white active" aria-current="page" to={'/produtos'}>Produtos</Link>
  //               </li>
  //               <li className="nav-item dropdown">
  //                 <a className="nav-link dropdown-toggle" id="offcanvasNavbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
  //                   Dropdown
  //                 </a>
  //                 <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
  //                   <li><a className="dropdown-item" >Action</a></li>
  //                   <li><a className="dropdown-item" >Another action</a></li>
  //                   <li>
  //                     <hr className="dropdown-divider" />
  //                   </li>
  //                   <li><a className="dropdown-item">Something else here</a></li>
  //                 </ul>
  //               </li>
  //             </ul>
  //           </div>
  //         </div>
  //       </div>
  //     </nav>

  //     <div className="container">
  //       <div className="container-fluid">
  //         {children}
  //       </div>
  //     </div>
  //   </>



  // )