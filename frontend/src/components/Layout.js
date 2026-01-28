import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Tooltip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as TradeIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Security as SecurityIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { Link, useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const Layout = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de logout
    console.log("Usuário deslogado");
    handleMenuClose();
    // Redirecionar para login se necessário
    // navigate("/login");
    alert("Logout realizado com sucesso!");
  };

  const menuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      description: "Visão geral do sistema"
    },
    { 
      text: "Mercado", 
      icon: <TrendingUpIcon />, 
      path: "/market",
      description: "Cotações e análises"
    },
    { 
      text: "Portfólio", 
      icon: <WalletIcon />, 
      path: "/portfolio",
      description: "Seus investimentos"
    },
    { 
      text: "Trading", 
      icon: <TradeIcon />, 
      path: "/trading",
      description: "Execute ordens"
    },
  ];

  const notifications = [
    { id: 1, text: "Ordem BTCUSD executada", time: "2 min atrás", read: false },
    { id: 2, text: "ETH atingiu $2,500", time: "1 hora atrás", read: false },
    { id: 3, text: "Relatório mensal disponível", time: "1 dia atrás", read: true },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      
      {/* AppBar Superior */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${open ? drawerWidth : 0}px)` },
          ml: { sm: `${open ? drawerWidth : 0}px` },
          backgroundColor: alpha(theme.palette.background.paper, 0.98),
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* Lado Esquerdo - Menu e Título */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, color: theme.palette.primary.main }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
              <SecurityIcon sx={{ mr: 1, color: theme.palette.success.main }} />
              <Typography variant="h6" noWrap component="div" sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                BTG Crypto Trading
              </Typography>
              
              {/* Status do Sistema */}
              <Chip
                icon={<CheckCircleIcon />}
                label="Sistema Ativo"
                size="small"
                sx={{ 
                  ml: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  color: theme.palette.success.main,
                  fontWeight: 600,
                  fontSize: "0.75rem",
                  height: 24,
                  "& .MuiChip-icon": {
                    fontSize: 16,
                    color: theme.palette.success.main
                  }
                }}
              />
            </Box>
          </Box>

          {/* Lado Direito - Usuário e Notificações */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Notificações */}
            <Tooltip title="Notificações">
              <IconButton 
                onClick={handleNotificationsOpen}
                sx={{ 
                  color: theme.palette.text.secondary,
                  position: "relative"
                }}
              >
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Menu de Notificações */}
            <Menu
              anchorEl={notificationsAnchor}
              open={Boolean(notificationsAnchor)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  width: 320,
                  maxHeight: 400,
                  mt: 1.5,
                }
              }}
            >
              <Typography variant="subtitle2" sx={{ p: 2, fontWeight: 600 }}>
                Notificações ({unreadNotifications} novas)
              </Typography>
              <Divider />
              {notifications.map((notification) => (
                <MenuItem 
                  key={notification.id}
                  sx={{ 
                    py: 1.5,
                    borderLeft: notification.read ? "none" : `3px solid ${theme.palette.primary.main}`
                  }}
                >
                  <Box sx={{ ml: notification.read ? 0 : 1 }}>
                    <Typography variant="body2">{notification.text}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={handleMenuClose}>
                <Typography variant="body2" color="primary" sx={{ textAlign: "center", width: "100%" }}>
                  Ver todas as notificações
                </Typography>
              </MenuItem>
            </Menu>

            {/* Separador */}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />

            {/* Perfil do Usuário */}
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={handleProfileMenuOpen}>
              <Tooltip title="Meu perfil">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: theme.palette.primary.main,
                    border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)"
                    }
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </Tooltip>
              
              <Box sx={{ ml: 1.5, display: { xs: "none", md: "block" } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  João Silva
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ lineHeight: 1 }}>
                  Trader Sênior
                </Typography>
              </Box>
            </Box>

            {/* Menu do Perfil */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  width: 220,
                  mt: 1.5,
                }
              }}
            >
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: theme.palette.primary.main,
                    mx: "auto",
                    mb: 1,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  <AccountCircleIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="subtitle1" fontWeight={600}>
                  João Silva
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  joao.silva@btgpactual.com
                </Typography>
              </Box>
              
              <Divider />
              
              <MenuItem onClick={() => { handleMenuClose(); navigate("/profile"); }}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Meu Perfil</ListItemText>
              </MenuItem>
              
              <MenuItem onClick={() => { handleMenuClose(); navigate("/settings"); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Configurações</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
                <ListItemIcon sx={{ color: theme.palette.error.main }}>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar/Navigation Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundImage: "linear-gradient(180deg, rgba(10, 25, 41, 0.95) 0%, rgba(19, 47, 76, 0.95) 100%)",
            backdropFilter: "blur(10px)",
          },
          display: { xs: "none", sm: "block" },
        }}
        open={open}
      >
        <Toolbar />
        
        {/* Logo e Status */}
        <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <SecurityIcon sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            CryptoBTG Pro
          </Typography>
          <Chip
            icon={<CheckCircleIcon />}
            label="Conectado"
            size="small"
            sx={{ 
              backgroundColor: alpha(theme.palette.success.main, 0.1),
              color: theme.palette.success.main,
              fontWeight: 500,
              fontSize: "0.7rem",
            }}
          />
        </Box>

        {/* Menu de Navegação */}
        <Box sx={{ overflow: "auto", p: 2 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem 
                button 
                key={item.text} 
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  transition: "all 0.2s",
                  "&.Mui-selected": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    color: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.3),
                    },
                    "& .MuiListItemIcon-root": {
                      color: theme.palette.primary.main,
                    }
                  },
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    transform: "translateX(5px)",
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: 40,
                  color: location.pathname === item.path ? theme.palette.primary.main : "inherit" 
                }}>
                  {item.icon}
                </ListItemIcon>
                <Box sx={{ flex: 1 }}>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <Typography variant="caption" color="textSecondary" sx={{ 
                    display: "block",
                    fontSize: "0.7rem",
                    opacity: 0.8
                  }}>
                    {item.description}
                  </Typography>
                </Box>
                {location.pathname === item.path && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: theme.palette.primary.main,
                      ml: 1,
                    }}
                  />
                )}
              </ListItem>
            ))}
          </List>

          {/* Seção de Configurações */}
          <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <Typography variant="caption" color="textSecondary" sx={{ pl: 2, mb: 1, display: "block" }}>
              CONFIGURAÇÕES
            </Typography>
            <List>
              <ListItem 
                button 
                component={Link}
                to="/settings"
                sx={{ 
                  borderRadius: 2, 
                  mb: 1,
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  }
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Configurações" 
                  primaryTypographyProps={{ fontSize: "0.9rem" }}
                />
              </ListItem>
            </List>
          </Box>
        </Box>

        {/* Rodapé do Sidebar */}
        <Box sx={{ 
          p: 2, 
          mt: "auto", 
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          textAlign: "center"
        }}>
          <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
            v2.1.0 • BTG Pactual
          </Typography>
          <Typography variant="caption" color="textSecondary" sx={{ fontSize: "0.7rem", opacity: 0.6 }}>
            Sistema de Trading Cripto
          </Typography>
        </Box>
      </Drawer>

      {/* Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
