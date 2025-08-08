import { Drawer, Grid, Skeleton } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import { useErrors, useSocketEvents } from "../../hooks/hook";
import { getOrSaveFromStorage } from "../../lib/features";
import { useMyChatsQuery } from "../../redux/api/api";
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { getSocket } from "../../socket";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";

// Styled Components
const AppContainer = styled("div")(({ theme }) => ({
  height: "100vh",
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%)
  `,
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
      radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(102, 126, 234, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  height: "calc(100vh - 4rem)",
  position: "relative",
}));

const ChatListSidebar = styled(Grid)(({ theme }) => ({
  background: `
    linear-gradient(180deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)
  `,
  backdropFilter: "blur(20px)",
  borderRight: "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    width: "1px",
    height: "100%",
    background: "linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
  },
}));

const MainChatArea = styled(Grid)(({ theme }) => ({
  background: `
    linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.8) 100%)
  `,
  backdropFilter: "blur(20px)",
  position: "relative",
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
    backgroundSize: "60px 60px",
    opacity: 0.3,
    pointerEvents: "none",
  },
}));

const ProfileSidebar = styled(Grid)(({ theme }) => ({
  background: `
    linear-gradient(180deg, rgba(20, 20, 20, 0.95) 0%, rgba(15, 15, 15, 0.95) 100%)
  `,
  backdropFilter: "blur(20px)",
  borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    width: "1px",
    height: "100%",
    background: "linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
  },
}));

const LoadingSkeleton = styled(Skeleton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "8px",
  "&::after": {
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
  },
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: `
      linear-gradient(180deg, rgba(15, 15, 15, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)
    `,
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `
      0 20px 60px rgba(0, 0, 0, 0.5),
      0 8px 32px rgba(0, 0, 0, 0.3)
    `,
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "2px",
      background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.5) 50%, transparent 100%)",
    },
  },
}));

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const socket = getSocket();

    const chatId = params.chatId;
    const deleteMenuAnchor = useRef(null);

    const [onlineUsers, setOnlineUsers] = useState([]);

    const { isMobile } = useSelector((state) => state.misc);
    const { user } = useSelector((state) => state.auth);
    const { newMessagesAlert } = useSelector((state) => state.chat);

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    const handleMobileClose = () => dispatch(setIsMobile(false));

    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers);

    return (
      <AppContainer>
        <Title />
        <Header />

        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* Mobile Drawer */}
        {isLoading ? (
          <LoadingSkeleton 
            variant="rectangular" 
            width="70vw" 
            height="100%" 
            sx={{ 
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 1300,
              display: isMobile ? "block" : "none"
            }}
          />
        ) : (
          <StyledDrawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </StyledDrawer>
        )}

        {/* Main Layout */}
        <StyledGrid container>
          {/* Chat List Sidebar - Desktop */}
          <ChatListSidebar
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <LoadingSkeleton 
                variant="rectangular" 
                width="100%" 
                height="100%" 
                sx={{ 
                  borderRadius: 0,
                  background: "rgba(255, 255, 255, 0.05)"
                }}
              />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </ChatListSidebar>

          {/* Main Chat Area */}
          <MainChatArea 
            item 
            xs={12} 
            sm={8} 
            md={5} 
            lg={6} 
            height={"100%"}
          >
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </MainChatArea>

          {/* Profile Sidebar - Desktop */}
          <ProfileSidebar
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
            }}
          >
            <Profile user={user} />
          </ProfileSidebar>
        </StyledGrid>
      </AppContainer>
    );
  };
};

export default AppLayout;