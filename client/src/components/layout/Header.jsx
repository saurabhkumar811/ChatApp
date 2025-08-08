import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";
import { resetNotificationCount } from "../../redux/reducers/chat";

const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `
    linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(30, 30, 30, 0.95) 50%, rgba(13, 13, 13, 0.95) 100%),
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.1) 0%, transparent 50%)
  `,
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.5) 50%, transparent 100%)",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 700,
  letterSpacing: "1px",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.8)",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "12px",
  margin: "0 4px",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 1)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(102, 126, 234, 0.3)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

// Enhanced Badge with better visibility and positioning
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    background: "linear-gradient(135deg, #ff4444 0%, #ff6666 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: "11px",
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    padding: "0 4px",
    // Enhanced shadow and border for better visibility
    boxShadow: `
      0 0 0 2px rgba(15, 15, 15, 0.9),
      0 0 0 3px rgba(255, 68, 68, 0.5),
      0 4px 12px rgba(255, 68, 68, 0.8),
      0 2px 6px rgba(0, 0, 0, 0.6)
    `,
    border: "1px solid rgba(255, 255, 255, 0.3)",
    // Positioning adjustments for better visibility
    right: "-6px",
    top: "-6px",
    // Ensure it's always on top
    zIndex: 10,
    
    // Pulsing animation for new notifications
    animation: "notificationPulse 2s infinite ease-in-out",
    
    "@keyframes notificationPulse": {
      "0%": {
        transform: "scale(1)",
        boxShadow: `
          0 0 0 2px rgba(15, 15, 15, 0.9),
          0 0 0 3px rgba(255, 68, 68, 0.5),
          0 4px 12px rgba(255, 68, 68, 0.8),
          0 2px 6px rgba(0, 0, 0, 0.6)
        `,
      },
      "50%": {
        transform: "scale(1.1)",
        boxShadow: `
          0 0 0 2px rgba(15, 15, 15, 0.9),
          0 0 0 4px rgba(255, 68, 68, 0.7),
          0 6px 20px rgba(255, 68, 68, 1),
          0 4px 12px rgba(0, 0, 0, 0.8)
        `,
      },
      "100%": {
        transform: "scale(1)",
        boxShadow: `
          0 0 0 2px rgba(15, 15, 15, 0.9),
          0 0 0 3px rgba(255, 68, 68, 0.5),
          0 4px 12px rgba(255, 68, 68, 0.8),
          0 2px 6px rgba(0, 0, 0, 0.6)
        `,
      },
    },
  },
  
  // Ensure the badge doesn't get clipped
  "& .MuiBadge-root": {
    overflow: "visible",
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
  filter: "blur(30px)",
  animation: "float 8s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateX(0px) scale(1)",
      opacity: 0.3,
    },
    "50%": {
      transform: "translateX(20px) scale(1.2)",
      opacity: 0.6,
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  
  // Get the entire chat state for debugging
  const chatState = useSelector((state) => state.chat);
  const { notificationCount } = useSelector((state) => state.chat);
  
  // Debug logging
  React.useEffect(() => {
    console.log("=== NOTIFICATION DEBUG ===");
    console.log("Full chat state:", chatState);
    console.log("notificationCount:", notificationCount);
    console.log("Type of notificationCount:", typeof notificationCount);
  }, [chatState, notificationCount]);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  const navigateToGroup = () => navigate("/groups");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <StyledAppBar position="static">
          {/* Floating background elements */}
          <FloatingElement sx={{ top: "10%", left: "20%", animationDelay: "0s" }} />
          <FloatingElement sx={{ top: "60%", right: "30%", animationDelay: "3s" }} />
          
          <Toolbar sx={{ position: "relative", zIndex: 1 }}>
            <StyledTypography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              ChatNext
            </StyledTypography>

            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <StyledIconButton onClick={handleMobile}>
                <MenuIcon />
              </StyledIconButton>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
                debug={true} // Add debug prop
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </StyledAppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip 
      title={title}
      componentsProps={{
        tooltip: {
          sx: {
            background: "rgba(15, 15, 15, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: "12px",
          }
        }
      }}
    >
      <StyledIconButton onClick={onClick}>
        {value && value > 0 ? (
          <StyledBadge 
            badgeContent={value} 
            max={99}
            // Ensure badge is always visible
            sx={{
              "& .MuiBadge-badge": {
                // Force visibility
                visibility: "visible !important",
                opacity: "1 !important",
                display: "flex !important",
              }
            }}
          >
            {icon}
          </StyledBadge>
        ) : (
          icon
        )}
      </StyledIconButton>
    </Tooltip>
  );
};

export default Header;