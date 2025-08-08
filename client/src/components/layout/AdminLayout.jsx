import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
  keyframes,
} from "@mui/material";
import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 
      0 0 5px rgba(102, 126, 234, 0.3),
      0 0 10px rgba(102, 126, 234, 0.2),
      0 0 15px rgba(102, 126, 234, 0.1);
  }
  50% {
    box-shadow: 
      0 0 10px rgba(102, 126, 234, 0.5),
      0 0 20px rgba(102, 126, 234, 0.3),
      0 0 30px rgba(102, 126, 234, 0.2);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
`;

// Styled Components
const StyledSidebarContainer = styled(Stack)(({ theme }) => ({
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)
  `,
  borderRight: "1px solid rgba(255, 255, 255, 0.08)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.005) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.005) 50%, transparent 51%)
    `,
    backgroundSize: "30px 30px",
    opacity: 0.5,
    pointerEvents: "none",
  },
}));

const StyledBrandTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(102, 126, 234, 0.8) 50%, rgba(118, 75, 162, 0.8) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  letterSpacing: "2px",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  animation: `${float} 3s ease-in-out infinite`,
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-8px",
    left: "50%",
    width: "60px",
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.6) 50%, transparent 100%)",
    transform: "translateX(-50%)",
    borderRadius: "2px",
  },
}));

const StyledLink = styled(LinkComponent)(({ theme }) => ({
  textDecoration: "none",
  borderRadius: "16px",
  padding: "1rem 1.5rem",
  color: "rgba(255, 255, 255, 0.7)",
  background: "rgba(15, 15, 15, 0.4)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  animation: `${fadeIn} 0.6s ease-out`,
  boxShadow: `
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05)
  `,
  "&:hover": {
    color: "rgba(255, 255, 255, 0.9)",
    background: "rgba(25, 25, 25, 0.7)",
    border: "1px solid rgba(102, 126, 234, 0.2)",
    transform: "translateY(-2px)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 4px 16px rgba(102, 126, 234, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.1) 50%, transparent 100%)",
    transition: "left 0.5s ease",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const ActiveLink = styled(StyledLink)(({ theme }) => ({
  background: `
    linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%),
    rgba(20, 20, 20, 0.8)
  `,
  border: "1px solid rgba(102, 126, 234, 0.3)",
  color: "rgba(255, 255, 255, 0.95)",
  animation: `${glow} 2s ease-in-out infinite`,
  boxShadow: `
    0 8px 32px rgba(102, 126, 234, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.6) 50%, transparent 100%)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },
  "&:hover": {
    transform: "translateY(-1px)",
    background: `
      linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%),
      rgba(25, 25, 25, 0.9)
    `,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.8)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.8)",
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 1000,
  "&:hover": {
    background: "rgba(25, 25, 25, 0.9)",
    border: "1px solid rgba(102, 126, 234, 0.3)",
    color: "rgba(255, 255, 255, 1)",
    transform: "scale(1.05)",
    boxShadow: `
      0 12px 48px rgba(0, 0, 0, 0.5),
      0 4px 16px rgba(102, 126, 234, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15)
    `,
  },
}));

const StyledMainContent = styled(Box)(({ theme }) => ({
  background: `
    linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 25%, #121212 50%, #1e1e1e 75%, #111111 100%),
    radial-gradient(circle at 80% 20%, rgba(102, 126, 234, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(118, 75, 162, 0.02) 0%, transparent 50%)
  `,
  minHeight: "100vh",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.003) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.003) 50%, transparent 51%)
    `,
    backgroundSize: "50px 50px",
    opacity: 0.6,
    pointerEvents: "none",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: `
      linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
      radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)
    `,
    borderRight: "1px solid rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
  filter: "blur(40px)",
  animation: `${float} 6s ease-in-out infinite`,
  pointerEvents: "none",
  zIndex: 0,
}));

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <StyledSidebarContainer width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      {/* Floating background elements */}
      <FloatingElement 
        sx={{ 
          width: "80px", 
          height: "80px", 
          top: "10%", 
          right: "10%", 
          animationDelay: "0s" 
        }} 
      />
      <FloatingElement 
        sx={{ 
          width: "60px", 
          height: "60px", 
          bottom: "20%", 
          left: "15%", 
          animationDelay: "3s" 
        }} 
      />

      <StyledBrandTitle variant="h5" textTransform={"uppercase"}>
        ChatNext
      </StyledBrandTitle>

      <Stack spacing={"1rem"} sx={{ position: "relative", zIndex: 1 }}>
        {adminTabs.map((tab, index) => {
          const isActive = location.pathname === tab.path;
          const LinkComponent = isActive ? ActiveLink : StyledLink;
          
          return (
            <LinkComponent
              key={tab.path}
              to={tab.path}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center",
                  filter: isActive ? "drop-shadow(0 0 8px rgba(102, 126, 234, 0.4))" : "none"
                }}>
                  {tab.icon}
                </Box>
                <Typography 
                  sx={{ 
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: isActive ? "0.5px" : "0px"
                  }}
                >
                  {tab.name}
                </Typography>
              </Stack>
            </LinkComponent>
          );
        })}

        <StyledLink 
          onClick={logoutHandler}
          style={{ 
            animationDelay: `${adminTabs.length * 0.1}s`,
            marginTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "1.5rem"
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center",
              color: "rgba(255, 99, 99, 0.8)"
            }}>
              <ExitToAppIcon />
            </Box>
            <Typography sx={{ color: "rgba(255, 99, 99, 0.8)" }}>
              Logout
            </Typography>
          </Stack>
        </StyledLink>
      </Stack>
    </StyledSidebarContainer>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
          zIndex: 1200,
        }}
      >
        <StyledIconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </StyledIconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>

      <Grid item xs={12} md={8} lg={9}>
        <StyledMainContent>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {children}
          </Box>
        </StyledMainContent>
      </Grid>

      <StyledDrawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </StyledDrawer>
    </Grid>
  );
};

export default AdminLayout;