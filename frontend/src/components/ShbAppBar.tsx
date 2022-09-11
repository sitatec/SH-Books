import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  AppBar,
  Menu,
  MenuItem,
  Avatar,
  colors,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Logo from "../../images/logo.png";
import Image from "next/image";
import { Home, Menu as MenuIcon } from "@mui/icons-material";
import Link from "next/link";
import User from "../models/user";
import DefaultUserPicture from "../../images/default-user.png";
import { UserContext } from "../pages/_app";
import { useRouter } from "next/router";

const navItems = [
  { title: "My Purchases", path: "/my-purchases" },
  { title: "My Sales", path: "/my-sales" },
];

const extendedNaveItems = [
  { title: "My Profile", path: "/my-profile" },
  { title: "Account Settings", path: "/account-settings" },
];

const ShbAppBar: React.FC = React.memo(function ShbAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentUser = useContext(UserContext);
  const router = useRouter();

  console.log(router.pathname);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle}>
      <Typography variant="h6" sx={{ m: 2 }}>
        SHBOOKS
      </Typography>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <Link key={index} href={item.path}>
            <a style={{ color: colors.grey[800] }}>
              <ListItem>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar component="nav" variant="elevation" color="transparent">
        <Container>
          <Toolbar variant="dense" disableGutters>
            <Box sx={{ flexGrow: 1, display: { sm: "none" } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
              <Link href="/">
                <a style={{ display: "inherit" }}>
                  <Image
                    src={Logo}
                    alt="Logo"
                    width={28}
                    height={28}
                    objectFit="contain"
                  />
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "primary.main", ml: 1.5, mt: 0.5 }}
                  >
                    SHBOOKS
                  </Typography>
                </a>
              </Link>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item, index) => (
                <Button
                  key={index}
                  sx={{
                    textTransform: "none",
                    fontWeight: "400",
                    fontSize: 15,
                    "&:hover": { backgroundColor: colors.blue[50] },
                    color: "black",
                    borderBottom: "2px solid",
                    borderBottomColor: router.pathname == item.path ? "primary.main" : "transparent"
                  }}
                >
                  <Link href={item.path}>
                    <a style={{ color: colors.grey[800] }}>{item.title}</a>
                  </Link>
                </Button>
              ))}
            </Box>
            <Button
              sx={{
                textTransform: "none",
                fontWeight: "400",
                fontSize: 15,
                "&:hover": { backgroundColor: colors.blue[50] },
                color: "black",
                borderBottom: "2px solid",
                borderBottomColor: router.pathname === "/post" ? "primary.main" : "transparent"
              }}
            >
              <Link href="/post">
                <a style={{ color: colors.grey[800] }}>{"Post"}</a>
              </Link>
            </Button>
            <AuthMenu currentUser={currentUser} />
          </Toolbar>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            // Improve for SEO and open performance on mobile.
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 250,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
});

const AuthMenu: React.FC<{ currentUser: User | null }> = ({ currentUser }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Avatar
          src={currentUser?.profilePicture || DefaultUserPicture.src}
          sx={{ height: 28, width: 28 }}
        />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {extendedNaveItems.map((item, index) => (
          <MenuItem key={index} onClick={handleClose}>
            <Link href={item.path}>
              <a style={{ color: colors.grey[800] }}>{item.title}</a>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default ShbAppBar;
