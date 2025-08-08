import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import AvatarCard from "./AvatarCard";
import { motion } from "framer-motion";

const StyledChatItemContainer = styled(motion.div)(({ theme, sameSender }) => ({
  display: "flex",
  gap: "16px",
  alignItems: "center",
  position: "relative",
  padding: "16px 18px",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  overflow: "hidden",
  margin: "2px 0",
  
  // Base styling
  background: sameSender 
    ? `linear-gradient(135deg, 
        rgba(102, 126, 234, 0.15) 0%, 
        rgba(118, 75, 162, 0.12) 50%,
        rgba(102, 126, 234, 0.08) 100%
      ), rgba(25, 25, 30, 0.8)` 
    : `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.03) 0%, 
        rgba(255, 255, 255, 0.01) 50%,
        rgba(255, 255, 255, 0.02) 100%
      ), rgba(20, 20, 25, 0.4)`,
  
  border: sameSender 
    ? "1px solid rgba(102, 126, 234, 0.2)" 
    : "1px solid rgba(255, 255, 255, 0.06)",
  
  backdropFilter: "blur(10px)",
  
  // Hover effects
  "&:hover": {
    background: sameSender
      ? `linear-gradient(135deg, 
          rgba(102, 126, 234, 0.25) 0%, 
          rgba(118, 75, 162, 0.2) 50%,
          rgba(102, 126, 234, 0.15) 100%
        ), rgba(30, 30, 35, 0.9)`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.08) 0%, 
          rgba(255, 255, 255, 0.04) 50%,
          rgba(255, 255, 255, 0.06) 100%
        ), rgba(25, 25, 30, 0.7)`,
    
    border: sameSender 
      ? "1px solid rgba(102, 126, 234, 0.4)" 
      : "1px solid rgba(255, 255, 255, 0.12)",
    
    transform: "translateX(4px) scale(1.02)",
    boxShadow: sameSender
      ? "0 8px 32px rgba(102, 126, 234, 0.2), 0 4px 16px rgba(0, 0, 0, 0.3)"
      : "0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(255, 255, 255, 0.05)",
  },
  
  "&:active": {
    transform: "translateX(2px) scale(1.01)",
  },
  
  // Subtle inner glow for selected state
  ...(sameSender && {
    boxShadow: `
      0 4px 20px rgba(102, 126, 234, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  }),
  
  // Gradient accent line
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    background: sameSender
      ? "linear-gradient(180deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.6) 100%)"
      : "linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)",
    borderRadius: "0 16px 16px 0",
    opacity: sameSender ? 1 : 0,
    transition: "opacity 0.3s ease",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  padding: 0,
  textDecoration: "none",
  display: "block",
  borderRadius: "16px",
  transition: "all 0.2s ease",
}));

const NameTypography = styled(Typography)(({ theme, sameSender }) => ({
  fontWeight: 600,
  fontSize: "15px",
  letterSpacing: "0.2px",
  marginBottom: "4px",
  color: sameSender 
    ? "rgba(255, 255, 255, 0.95)" 
    : "rgba(255, 255, 255, 0.85)",
  
  background: sameSender
    ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)"
    : "linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.65) 100%)",
  
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: sameSender ? "transparent" : "rgba(255, 255, 255, 0.85)",
  backgroundClip: "text",
  
  transition: "all 0.3s ease",
}));

const MessageAlertTypography = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  color: "rgba(102, 126, 234, 0.8)",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
  padding: "4px 8px",
  borderRadius: "8px",
  border: "1px solid rgba(102, 126, 234, 0.2)",
  backdropFilter: "blur(5px)",
  width: "fit-content",
  letterSpacing: "0.3px",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
}));

const OnlineIndicator = styled(Box)(({ theme }) => ({
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  position: "absolute",
  top: "50%",
  right: "18px",
  transform: "translateY(-50%)",
  background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
  border: "2px solid rgba(0, 255, 136, 0.3)",
  boxShadow: `
    0 0 12px rgba(0, 255, 136, 0.6),
    0 0 24px rgba(0, 255, 136, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3)
  `,
  animation: "pulse 2s infinite",
  
  "@keyframes pulse": {
    "0%": {
      boxShadow: `
        0 0 12px rgba(0, 255, 136, 0.6),
        0 0 24px rgba(0, 255, 136, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
    },
    "50%": {
      boxShadow: `
        0 0 16px rgba(0, 255, 136, 0.8),
        0 0 32px rgba(0, 255, 136, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.5)
      `,
    },
    "100%": {
      boxShadow: `
        0 0 12px rgba(0, 255, 136, 0.6),
        0 0 24px rgba(0, 255, 136, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.3)
      `,
    },
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-3px",
    left: "-3px",
    right: "-3px",
    bottom: "-3px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(0, 255, 136, 0.2) 0%, transparent 100%)",
    animation: "ripple 2s infinite",
  },
  
  "@keyframes ripple": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(1.8)",
      opacity: 0,
    },
  },
}));

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <StyledLink
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <StyledChatItemContainer
        sameSender={sameSender}
        initial={{ opacity: 0, x: -50, scale: 0.9 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ 
          delay: 0.05 * index,
          duration: 0.4,
          ease: "easeOut"
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
      >
        {/* Enhanced Avatar with border glow */}
        <Box sx={{ position: "relative" }}>
          <AvatarCard avatar={avatar} />
          {isOnline && (
            <Box
              sx={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #00ff88 0%, #00cc66 100%)",
                border: "2px solid rgba(20, 20, 25, 0.8)",
                boxShadow: "0 0 8px rgba(0, 255, 136, 0.6)",
              }}
            />
          )}
        </Box>

        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <NameTypography sameSender={sameSender}>
            {name}
          </NameTypography>
          
          {newMessageAlert && newMessageAlert.count > 0 && (
            <MessageAlertTypography>
              {newMessageAlert.count} New Message{newMessageAlert.count > 1 ? 's' : ''}
            </MessageAlertTypography>
          )}
        </Stack>

        {isOnline && <OnlineIndicator />}
        
        {/* Subtle floating particle effect for selected item */}
        {sameSender && (
          <Box
            sx={{
              position: "absolute",
              top: "20%",
              right: "10%",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "rgba(102, 126, 234, 0.4)",
              animation: "floatParticle 3s ease-in-out infinite",
              "@keyframes floatParticle": {
                "0%, 100%": {
                  transform: "translateY(0px) scale(1)",
                  opacity: 0.4,
                },
                "50%": {
                  transform: "translateY(-6px) scale(1.2)",
                  opacity: 0.8,
                },
              },
            }}
          />
        )}
      </StyledChatItemContainer>
    </StyledLink>
  );
};

export default memo(ChatItem);