import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { transformImage } from "../../lib/features";

const StyledListItem = styled(motion(ListItem))(({ theme }) => ({
  padding: "12px 16px",
  margin: "4px 0",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  
  background: `linear-gradient(135deg, 
    rgba(255, 255, 255, 0.03) 0%, 
    rgba(255, 255, 255, 0.01) 50%,
    rgba(255, 255, 255, 0.02) 100%
  ), rgba(20, 20, 25, 0.4)`,
  
  border: "1px solid rgba(255, 255, 255, 0.06)",
  backdropFilter: "blur(10px)",
  
  "&:hover": {
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.08) 0%, 
      rgba(255, 255, 255, 0.04) 50%,
      rgba(255, 255, 255, 0.06) 100%
    ), rgba(25, 25, 30, 0.7)`,
    
    border: "1px solid rgba(255, 255, 255, 0.12)",
    transform: "translateX(4px) scale(1.01)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.2),
      0 4px 16px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.4) 100%)",
    borderRadius: "0 16px 16px 0",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "44px",
  height: "44px",
  border: "2px solid rgba(255, 255, 255, 0.1)",
  background: `linear-gradient(135deg, 
    rgba(102, 126, 234, 0.15) 0%, 
    rgba(118, 75, 162, 0.12) 100%
  ), rgba(30, 30, 35, 0.8)`,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-2px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },
  
  ".MuiListItem-root:hover &": {
    transform: "scale(1.05)",
    border: "2px solid rgba(102, 126, 234, 0.3)",
    boxShadow: `
      0 4px 20px rgba(102, 126, 234, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.3)
    `,
    
    "&::before": {
      opacity: 1,
    },
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "15px",
  letterSpacing: "0.1px",
  color: "rgba(255, 255, 255, 0.85)",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.7) 100%)",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  transition: "all 0.3s ease",
  
  ".MuiListItem-root:hover &": {
    color: "rgba(255, 255, 255, 0.95)",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme, isAdded }) => ({
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  
  // Base styling for Add button
  ...(!isAdded && {
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 0.8) 0%, 
      rgba(118, 75, 162, 0.8) 100%
    )`,
    border: "1px solid rgba(102, 126, 234, 0.3)",
    color: "rgba(255, 255, 255, 0.95)",
    boxShadow: `
      0 4px 16px rgba(102, 126, 234, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    
    "&:hover": {
      background: `linear-gradient(135deg, 
        rgba(102, 126, 234, 1) 0%, 
        rgba(118, 75, 162, 1) 100%
      )`,
      transform: "scale(1.05)",
      boxShadow: `
        0 6px 24px rgba(102, 126, 234, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
      border: "1px solid rgba(102, 126, 234, 0.5)",
    },
  }),
  
  // Base styling for Remove button
  ...(isAdded && {
    background: `linear-gradient(135deg, 
      rgba(239, 68, 68, 0.8) 0%, 
      rgba(220, 38, 38, 0.8) 100%
    )`,
    border: "1px solid rgba(239, 68, 68, 0.3)",
    color: "rgba(255, 255, 255, 0.95)",
    boxShadow: `
      0 4px 16px rgba(239, 68, 68, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    
    "&:hover": {
      background: `linear-gradient(135deg, 
        rgba(239, 68, 68, 1) 0%, 
        rgba(220, 38, 38, 1) 100%
      )`,
      transform: "scale(1.05)",
      boxShadow: `
        0 6px 24px rgba(239, 68, 68, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
      border: "1px solid rgba(239, 68, 68, 0.5)",
    },
  }),
  
  "&:active": {
    transform: "scale(0.95)",
  },
  
  "&:disabled": {
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.05) 0%, 
      rgba(255, 255, 255, 0.02) 100%
    ), rgba(40, 40, 45, 0.5)`,
    color: "rgba(255, 255, 255, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transform: "none",
    cursor: "not-allowed",
    boxShadow: "none",
  },
  
  // Ripple effect
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.3)",
    transform: "translate(-50%, -50%)",
    transition: "width 0.3s ease, height 0.3s ease",
  },
  
  "&:active::before": {
    width: "120%",
    height: "120%",
  },
  
  "& svg": {
    fontSize: "18px",
    transition: "all 0.2s ease",
    position: "relative",
    zIndex: 1,
  },
  
  "&:hover svg": {
    transform: "scale(1.1)",
  },
}));

const LoadingSpinner = styled("div")(({ theme }) => ({
  width: "16px",
  height: "16px",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  borderTop: "2px solid rgba(255, 255, 255, 0.8)",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}));

const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <StyledListItem
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.99,
        transition: { duration: 0.1 }
      }}
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        <StyledAvatar src={transformImage(avatar)} />

        <StyledTypography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </StyledTypography>

        <StyledIconButton
          size="small"
          isAdded={isAdded}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {handlerIsLoading ? (
            <LoadingSpinner />
          ) : isAdded ? (
            <RemoveIcon />
          ) : (
            <AddIcon />
          )}
        </StyledIconButton>
      </Stack>
    </StyledListItem>
  );
};

export default memo(UserItem);