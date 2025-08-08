import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
  Box,
  IconButton,
  Badge,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { 
  Close as CloseIcon,
  Person as PersonIcon,
  NotificationsActive as NotificationIcon 
} from "@mui/icons-material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";

// Enhanced styled dialog with glassmorphism effect
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: `
      linear-gradient(180deg, 
        rgba(20, 20, 20, 0.98) 0%, 
        rgba(15, 15, 15, 0.95) 25%,
        rgba(25, 25, 25, 0.98) 50%,
        rgba(18, 18, 18, 0.95) 75%,
        rgba(22, 22, 22, 0.98) 100%
      ),
      radial-gradient(circle at top left, rgba(102, 126, 234, 0.08) 0%, transparent 40%),
      radial-gradient(circle at bottom right, rgba(118, 75, 162, 0.06) 0%, transparent 40%)
    `,
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    boxShadow: `
      0 25px 50px -12px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(255, 255, 255, 0.05)
    `,
    position: "relative",
    overflow: "hidden",
    minHeight: "300px",
    
    // Subtle grid pattern overlay
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.005) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.005) 1px, transparent 1px)
      `,
      backgroundSize: "20px 20px",
      opacity: 0.5,
      pointerEvents: "none",
    },
  },
  
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    backdropFilter: "blur(4px)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontSize: "24px",
  fontWeight: 700,
  letterSpacing: "-0.3px",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  paddingBottom: "16px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
  
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.4) 50%, transparent 100%)",
  },
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "16px",
  right: "16px",
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.7)",
  width: "40px",
  height: "40px",
  zIndex: 2,
  transition: "all 0.3s ease",
  
  "&:hover": {
    background: "rgba(239, 68, 68, 0.1)",
    color: "rgba(239, 68, 68, 0.8)",
    transform: "scale(1.05)",
  },
}));

const NotificationsContainer = styled(Stack)(({ theme }) => ({
  maxHeight: "400px",
  overflow: "auto",
  position: "relative",
  
  // Custom scrollbar
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "3px",
    margin: "8px 0",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(180deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)",
    borderRadius: "3px",
    "&:hover": {
      background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)",
    },
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.06)",
  borderRadius: "12px",
  marginBottom: "12px",
  padding: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  
  "&:hover": {
    background: "rgba(255, 255, 255, 0.04)",
    transform: "translateY(-1px)",
    boxShadow: "0 8px 32px rgba(102, 126, 234, 0.15)",
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "3px",
    height: "100%",
    background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)",
    borderRadius: "0 2px 2px 0",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "48px",
  height: "48px",
  background: `
    linear-gradient(135deg, 
      rgba(102, 126, 234, 0.8) 0%, 
      rgba(118, 75, 162, 0.8) 100%
    )
  `,
  border: "2px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.2)",
  fontSize: "20px",
}));

const StyledButton = styled(Button)(({ theme, variant, color }) => ({
  borderRadius: "8px",
  padding: "8px 16px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "12px",
  minWidth: "70px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  
  ...(variant === "contained" && color !== "error" && {
    background: `
      linear-gradient(135deg, 
        rgba(34, 197, 94, 0.9) 0%, 
        rgba(22, 163, 74, 0.9) 100%
      )
    `,
    color: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 4px 16px rgba(34, 197, 94, 0.3)",
    
    "&:hover": {
      background: `
        linear-gradient(135deg, 
          rgba(34, 197, 94, 1) 0%, 
          rgba(22, 163, 74, 1) 100%
        )
      `,
      boxShadow: "0 6px 20px rgba(34, 197, 94, 0.4)",
      transform: "translateY(-1px)",
    },
  }),
  
  ...(color === "error" && {
    background: "rgba(239, 68, 68, 0.1)",
    color: "rgba(239, 68, 68, 0.9)",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    
    "&:hover": {
      background: "rgba(239, 68, 68, 0.2)",
      color: "rgba(239, 68, 68, 1)",
      transform: "translateY(-1px)",
    },
  }),
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 20px",
  textAlign: "center",
  minHeight: "200px",
}));

const FloatingAccent = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(40px)",
  opacity: 0.3,
  animation: "notificationFloat 16s ease-in-out infinite",
  pointerEvents: "none",
  "@keyframes notificationFloat": {
    "0%, 100%": {
      transform: "translate(0px, 0px) scale(1)",
      opacity: 0.2,
    },
    "33%": {
      transform: "translate(10px, -6px) scale(1.1)",
      opacity: 0.4,
    },
    "66%": {
      transform: "translate(-6px, 10px) scale(0.9)",
      opacity: 0.3,
    },
  },
}));

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(setIsNotification(false));
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);

  const notificationCount = data?.allRequests?.length || 0;

  return (
    <StyledDialog open={isNotification} onClose={closeHandler} maxWidth="sm" fullWidth>
      <Box sx={{ position: "relative" }}>
        {/* Floating accent elements */}
        <FloatingAccent 
          sx={{ 
            top: "15%", 
            left: "10%", 
            width: "50px", 
            height: "50px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
            animationDelay: "0s"
          }} 
        />
        <FloatingAccent 
          sx={{ 
            top: "70%", 
            right: "15%", 
            width: "35px", 
            height: "35px",
            background: "linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(102, 126, 234, 0.08) 100%)",
            animationDelay: "6s"
          }} 
        />

        <CloseButton onClick={closeHandler}>
          <CloseIcon fontSize="small" />
        </CloseButton>

        <Stack p={{ xs: "2rem", sm: "2.5rem" }} sx={{ position: "relative", zIndex: 1 }}>
          <StyledDialogTitle>
            <Badge badgeContent={notificationCount} color="error" max={99}>
              <NotificationIcon sx={{ fontSize: "28px", color: "rgba(102, 126, 234, 0.8)" }} />
            </Badge>
            Notifications
          </StyledDialogTitle>

          <NotificationsContainer spacing={0} sx={{ mt: 2 }}>
            {isLoading ? (
              <Stack spacing={2}>
                {[1, 2, 3].map((i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={80}
                    sx={{
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <>
                {data?.allRequests.length > 0 ? (
                  data?.allRequests?.map(({ sender, _id }) => (
                    <NotificationItem
                      sender={sender}
                      _id={_id}
                      handler={friendRequestHandler}
                      key={_id}
                    />
                  ))
                ) : (
                  <EmptyState>
                    <NotificationIcon 
                      sx={{ 
                        fontSize: "64px", 
                        color: "rgba(255, 255, 255, 0.2)",
                        mb: 2 
                      }} 
                    />
                    <Typography 
                      sx={{ 
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "18px",
                        fontWeight: 500
                      }}
                    >
                      No new notifications
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: "rgba(255, 255, 255, 0.4)",
                        fontSize: "14px",
                        mt: 1
                      }}
                    >
                      You're all caught up!
                    </Typography>
                  </EmptyState>
                )}
              </>
            )}
          </NotificationsContainer>
        </Stack>
      </Box>
    </StyledDialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  
  return (
    <StyledListItem>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width="100%"
      >
        <StyledAvatar src={avatar}>
          {!avatar && <PersonIcon />}
        </StyledAvatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="body1"
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontWeight: 500,
              fontSize: "14px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <Box component="span" sx={{ fontWeight: 600, color: "rgba(102, 126, 234, 0.9)" }}>
              {name}
            </Box>
            {" sent you a friend request"}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.5)",
              fontSize: "12px",
              mt: 0.5,
              display: "block"
            }}
          >
            Tap to respond
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ minWidth: "fit-content" }}
        >
          <StyledButton 
            variant="contained"
            size="small"
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </StyledButton>
          <StyledButton 
            color="error" 
            size="small"
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </StyledButton>
        </Stack>
      </Stack>
    </StyledListItem>
  );
});

export default Notifications;