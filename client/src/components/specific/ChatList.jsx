import { Stack, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import ChatItem from "../shared/ChatItem";

const StyledChatContainer = styled(Stack)(({ theme }) => ({
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
  borderRadius: "16px 0 0 16px",
  position: "relative",
  overflow: "hidden",
  
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
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)",
    },
  },
  
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
  
  // Top gradient fade
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "20px",
    background: "linear-gradient(180deg, rgba(20, 20, 20, 0.8) 0%, transparent 100%)",
    pointerEvents: "none",
    zIndex: 1,
  },
}));

const FloatingAccent = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(40px)",
  opacity: 0.3,
  animation: "floatSlow 12s ease-in-out infinite",
  pointerEvents: "none",
  "@keyframes floatSlow": {
    "0%, 100%": {
      transform: "translate(0px, 0px) scale(1)",
      opacity: 0.2,
    },
    "33%": {
      transform: "translate(15px, -10px) scale(1.1)",
      opacity: 0.4,
    },
    "66%": {
      transform: "translate(-10px, 15px) scale(0.9)",
      opacity: 0.3,
    },
  },
}));

const ChatListHeader = styled(Box)(({ theme }) => ({
  position: "sticky",
  top: 0,
  background: `
    linear-gradient(180deg, 
      rgba(30, 30, 30, 0.95) 0%, 
      rgba(25, 25, 25, 0.85) 100%
    )
  `,
  backdropFilter: "blur(15px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  padding: "16px 20px 12px 20px",
  zIndex: 2,
  
  "&::before": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: "20px",
    right: "20px",
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
  },
}));

const ChatItemsContainer = styled(Box)(({ theme }) => ({
  padding: "8px 12px 16px 12px",
  position: "relative",
  zIndex: 1,
}));

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <StyledChatContainer 
      width={w} 
      direction={"column"} 
      overflow={"auto"} 
      height={"100%"}
    >
      {/* Floating accent elements */}
      <FloatingAccent 
        sx={{ 
          top: "15%", 
          left: "10%", 
          width: "80px", 
          height: "80px",
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
          animationDelay: "0s"
        }} 
      />
      <FloatingAccent 
        sx={{ 
          top: "60%", 
          right: "15%", 
          width: "60px", 
          height: "60px",
          background: "linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(102, 126, 234, 0.08) 100%)",
          animationDelay: "4s"
        }} 
      />
      <FloatingAccent 
        sx={{ 
          bottom: "20%", 
          left: "20%", 
          width: "70px", 
          height: "70px",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(102, 126, 234, 0.06) 100%)",
          animationDelay: "8s"
        }} 
      />

      {/* Optional header section */}
      <ChatListHeader>
        <Box
          sx={{
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          Messages
        </Box>
      </ChatListHeader>

      <ChatItemsContainer>
        {chats?.map((data, index) => {
          const { avatar, _id, name, groupChat, members } = data;

          const newMessageAlert = newMessagesAlert.find(
            ({ chatId }) => chatId === _id
          );

          const isOnline = members?.some((member) =>
            onlineUsers.includes(member)
          );

          return (
            <Box
              key={_id}
              sx={{
                marginBottom: "4px",
                "&:last-child": {
                  marginBottom: 0,
                },
                // Add subtle hover effect to container
                borderRadius: "12px",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: "rgba(255, 255, 255, 0.02)",
                  transform: "translateX(2px)",
                },
              }}
            >
              <ChatItem
                index={index}
                newMessageAlert={newMessageAlert}
                isOnline={isOnline}
                avatar={avatar}
                name={name}
                _id={_id}
                groupChat={groupChat}
                sameSender={chatId === _id}
                handleDeleteChat={handleDeleteChat}
              />
            </Box>
          );
        })}
      </ChatItemsContainer>
    </StyledChatContainer>
  );
};

export default ChatList;