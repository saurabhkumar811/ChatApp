import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { memo } from "react";
import moment from "moment";
import { fileFormat } from "../../lib/features";
import RenderAttachment from "./RenderAttachment";
import { motion } from "framer-motion";

const StyledMessageContainer = styled(motion.div)(({ theme, sameSender }) => ({
  alignSelf: sameSender ? "flex-end" : "flex-start",
  maxWidth: "70%",
  minWidth: "120px",
  position: "relative",
  margin: "8px 0",
  
  // Base styling for own messages (right side)
  ...(sameSender && {
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 0.9) 0%, 
      rgba(118, 75, 162, 0.85) 50%,
      rgba(102, 126, 234, 0.8) 100%
    )`,
    border: "1px solid rgba(102, 126, 234, 0.3)",
    borderRadius: "18px 18px 6px 18px",
    boxShadow: `
      0 4px 20px rgba(102, 126, 234, 0.25),
      0 2px 8px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
  }),
  
  // Base styling for other messages (left side)
  ...(!sameSender && {
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.08) 0%, 
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.06) 100%
    ), rgba(25, 25, 30, 0.8)`,
    border: "1px solid rgba(255, 255, 255, 0.12)",
    borderRadius: "18px 18px 18px 6px",
    boxShadow: `
      0 4px 20px rgba(0, 0, 0, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.08)
    `,
  }),
  
  backdropFilter: "blur(15px)",
  padding: "12px 16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  
  "&:hover": {
    transform: "translateY(-1px) scale(1.01)",
    boxShadow: sameSender
      ? `
          0 6px 30px rgba(102, 126, 234, 0.35),
          0 4px 12px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.25)
        `
      : `
          0 6px 30px rgba(0, 0, 0, 0.25),
          0 4px 12px rgba(0, 0, 0, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.12)
        `,
  },
  
  // Message tail/pointer
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: "6px",
    width: "12px",
    height: "12px",
    transform: "rotate(45deg)",
    zIndex: -1,
    
    ...(sameSender ? {
      right: "-6px",
      background: `linear-gradient(135deg, 
        rgba(102, 126, 234, 0.9) 0%, 
        rgba(118, 75, 162, 0.85) 100%
      )`,
      border: "1px solid rgba(102, 126, 234, 0.3)",
      borderTop: "none",
      borderLeft: "none",
    } : {
      left: "-6px",
      background: `linear-gradient(135deg, 
        rgba(255, 255, 255, 0.08) 0%, 
        rgba(255, 255, 255, 0.05) 100%
      ), rgba(25, 25, 30, 0.8)`,
      border: "1px solid rgba(255, 255, 255, 0.12)",
      borderBottom: "none",
      borderRight: "none",
    }),
  },
}));

const StyledSenderName = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.3px",
  marginBottom: "6px",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textShadow: "0 1px 2px rgba(102, 126, 234, 0.3)",
  display: "block",
}));

const StyledMessageContent = styled(Typography)(({ theme, sameSender }) => ({
  fontSize: "14px",
  lineHeight: 1.5,
  fontWeight: 400,
  letterSpacing: "0.1px",
  color: sameSender 
    ? "rgba(255, 255, 255, 0.95)" 
    : "rgba(255, 255, 255, 0.85)",
  
  wordWrap: "break-word",
  whiteSpace: "pre-wrap",
  
  // Text selection styling
  "::selection": {
    background: sameSender
      ? "rgba(255, 255, 255, 0.3)"
      : "rgba(102, 126, 234, 0.3)",
    color: sameSender 
      ? "rgba(255, 255, 255, 1)" 
      : "rgba(255, 255, 255, 1)",
  },
}));

const StyledTimestamp = styled(Typography)(({ theme, sameSender }) => ({
  fontSize: "11px",
  fontWeight: 500,
  marginTop: "8px",
  opacity: 0.7,
  letterSpacing: "0.2px",
  color: sameSender 
    ? "rgba(255, 255, 255, 0.8)" 
    : "rgba(255, 255, 255, 0.6)",
  
  display: "flex",
  alignItems: "center",
  justifyContent: sameSender ? "flex-end" : "flex-start",
  
  "&::before": {
    content: '""',
    width: "3px",
    height: "3px",
    borderRadius: "50%",
    background: "currentColor",
    marginRight: sameSender ? "0" : "6px",
    marginLeft: sameSender ? "6px" : "0",
    opacity: 0.5,
  },
  
  transition: "opacity 0.2s ease",
  
  ".MuiBox-root:hover &": {
    opacity: 1,
  },
}));

const StyledAttachmentContainer = styled(Box)(({ theme }) => ({
  marginTop: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  
  "& a": {
    textDecoration: "none",
    display: "block",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    
    "&:hover": {
      transform: "scale(1.02)",
    },
    
    "&:focus": {
      outline: "2px solid rgba(102, 126, 234, 0.5)",
      outlineOffset: "2px",
    },
  },
}));

const MessageStatus = styled(Box)(({ theme, sameSender }) => ({
  position: "absolute",
  bottom: "4px",
  right: sameSender ? "8px" : "auto",
  left: sameSender ? "auto" : "8px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  opacity: 0,
  transition: "opacity 0.2s ease",
  
  ".MuiBox-root:hover &": {
    opacity: 0.6,
  },
  
  "& svg": {
    fontSize: "12px",
    color: sameSender 
      ? "rgba(255, 255, 255, 0.6)" 
      : "rgba(255, 255, 255, 0.4)",
  },
}));

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user?._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <StyledMessageContainer
      sameSender={sameSender}
      initial={{ 
        opacity: 0, 
        x: sameSender ? 50 : -50,
        scale: 0.95 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0,
        scale: 1 
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
    >
      {!sameSender && sender?.name && (
        <StyledSenderName variant="caption">
          {sender.name}
        </StyledSenderName>
      )}

      {content && (
        <StyledMessageContent 
          sameSender={sameSender}
          component="div"
        >
          {content}
        </StyledMessageContent>
      )}

      {attachments.length > 0 && (
        <StyledAttachmentContainer>
          {attachments.map((attachment, index) => {
            const url = attachment.url;
            const file = fileFormat(url);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.1 * index,
                  duration: 0.3,
                  ease: "easeOut"
                }}
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  style={{ color: "inherit" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </motion.div>
            );
          })}
        </StyledAttachmentContainer>
      )}

      <StyledTimestamp 
        variant="caption" 
        sameSender={sameSender}
      >
        {timeAgo}
      </StyledTimestamp>

      {/* Optional: Message status indicators */}
      <MessageStatus sameSender={sameSender}>
        {sameSender && (
          // You can add read receipts, delivery status, etc. here
          <Box component="span" sx={{ fontSize: "10px" }}>
            ✓
          </Box>
        )}
      </MessageStatus>
    </StyledMessageContainer>
  );
};

export default memo(MessageComponent);