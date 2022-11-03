import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
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
import SignOutButton from "./buttons/SignOutButton";

interface NavItem {
  title: string;
  path: string;
}

const navItems: NavItem[] = [
  { title: "My Purchases", path: "/my-purchases" },
  { title: "My Sales", path: "/my-sales" },
  { title: "Post", path: "/books/new" },
];

const extendedNaveItems: NavItem[] = [
  { title: "My Profile", path: "/my-profile" },
  { title: "Account Settings", path: "/account-settings" },
];

// TODO refactor: extract css && improve readability
const ShbAppBar: React.FC = React.memo(function ShbAppBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useContext(UserContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      <AppBar component="nav" variant="elevation" color="transparent">
        <Container>
          <Box display="flex" alignItems="center">
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
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "flex", alignItems: "center" },
              }}
            >
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
            {currentUser ? (
              <AppBarMenu currentUser={currentUser} />
            ) : (
              <AuthMenu />
            )}
          </Box>
        </Container>
      </AppBar>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            // Improve SEO and open performance on mobile.
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
        </Drawer>
      </Box>
    </>
  );
});

const AppBarMenu: React.FC<{ currentUser?: User }> = ({ currentUser }) => {
  const router = useRouter();
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Box sx={{ display: { xs: "none", sm: "block" } }}>
        {navItems.map((item, index) => (
          <Button
            key={index}
            sx={{
              py: 1.3,
              borderRadius: 0,
              textTransform: "none",
              fontWeight: "400",
              fontSize: 15,
              "&:hover": {
                backgroundColor: colors.blue[50],
              },
              color: "black",
              borderBottom: "2px solid",
              borderBottomColor:
                router.pathname == item.path ? "primary.main" : "transparent",
            }}
          >
            <Link href={item.path}>
              <a style={{ color: colors.grey[800] }}>{item.title}</a>
            </Link>
          </Button>
        ))}
      </Box>
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
        anchorEl={anchorElement}
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
        <SignOutButton/>
      </Menu>
    </>
  );
};

const AuthMenu = React.memo(function AuthMenu() {
  return (
    <Box sx={{ py: 1.2 }}>
      <Button sx={{ textTransform: "none" }}>
        <Link href="/auth/signin">
          <a style={{ color: colors.blue[700] }}>Sign In</a>
        </Link>
      </Button>
      /
      <Button sx={{ textTransform: "none" }}>
        <Link href="/auth/signup">
          <a style={{ color: colors.blue[700] }}>Sign Up</a>
        </Link>
      </Button>
    </Box>
  );
});

export default ShbAppBar;
