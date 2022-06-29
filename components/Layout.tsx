import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tooltip, Stack, Button } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import MediumIcon from "../public/mediumIcon.png";
import Title from "./Title";
import Link from "next/link";
import { ConnectButton } from "web3uikit";
import { useMoralis } from "react-moralis";
import PublishForm from "./PublishForm";
import { useState } from "react";

const drawerWidth = 90;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

export default function Layout(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const {
    logout,
    isAuthenticated,
    authenticate,
    isAuthenticating,
    isLoggingOut,
  } = useMoralis();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const router = useRouter();

  const drawer = (
    <div>
      <Toolbar />

      <Link href="/">
        <Stack justifyContent="center" alignContent="center" direction="row">
          <Image src={MediumIcon} width={40} height={40} />
        </Stack>
      </Link>
      <Toolbar />
      <Toolbar />
      <List>
        <ListItem>
          <Tooltip title="Home">
            <ListItemButton
              onClick={() => {
                router.push("/");
              }}
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Tooltip title="My Blog">
            <ListItemButton
              onClick={() => {
                router.push("/myblog");
              }}
            >
              <ListItemIcon>
                <BookIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Tooltip title="Publish">
            <ListItemButton
              onClick={() => {
                router.push("/publish");
              }}
            >
              <ListItemIcon>
                <PublishedWithChangesIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
      <List>
        <ListItem>
          <Tooltip title="Logout">
            <ListItemButton
              disabled={isUploading}
              onClick={async () => {
                if (isAuthenticated) await logout();
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  // console.log(router.pathname);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        color="transparent"
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Title pathname={router.pathname} />
          {/* <Typography variant="h6" component="div" noWrap>
            Responsive drawer
          </Typography> */}
          {/* <ConnectButton /> */}

          {!isAuthenticated ? (
            <Button
              variant="contained"
              color="primary"
              disabled={isAuthenticating}
              onClick={async () =>
                await authenticate({ signingMessage: "Welcome to the blog" })
              }
            >
              Connect Wallet
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              disabled={isLoggingOut || isUploading}
              onClick={async () => await logout()}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {router.pathname === "/" && <Typography paragraph>Home</Typography>}
        {router.pathname === "/myblog" && (
          <Typography paragraph> my blog</Typography>
        )}
        {router.pathname === "/publish" && (
          <PublishForm
            isUploading={isUploading}
            setIsUploading={setIsUploading}
          />
        )}
      </Box>
    </Box>
  );
}
