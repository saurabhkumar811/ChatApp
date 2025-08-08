import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useInfiniteScrollTop } from "6pp";
import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

// Styled Components
const ChatContainer = styled(Stack)(({ theme }) => ({
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%)
  `,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.01) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.01) 50%, transparent 51%)
    `,
    backgroundSize: "40px 40px",
    opacity: 0.3,
  },
}));

// Fixed InputBox - using a simple input instead of importing from StyledComponents
const StyledInputBox = styled("input")(({ theme }) => ({
  width: "100%",
  backgroundColor: "rgba(15, 15, 15, 0.8)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "#ffffff",
  padding: "12px 20px",
  fontSize: "16px",
  backdropFilter: "blur(10px)",
  outline: "none",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(25, 25, 25, 0.8)",
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  "&:focus": {
    backgroundColor: "rgba(30, 30, 30, 0.9)",
    borderColor: "#667eea",
    boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
  },
  "&::placeholder": {
    color: "rgba(255, 255, 255, 0.5)",
  },
}));

const MessageInputContainer = styled(Stack)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.95)",
  backdropFilter: "blur(20px)",
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.7)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    transform: "translateY(-1px)",
  },
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: "12px",
  borderRadius: "50%",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
    transform: "translateY(-2px) scale(1.05)",
  },
  "&:active": {
    transform: "translateY(0) scale(0.98)",
  },
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Chat = ({ chatId, user }) => {
  const socket = getSocket();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const members = chatDetails?.data?.chat?.members;

  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, 2000);
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Emitting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  useEffect(() => {
    if (socket && members) {
      socket.emit(CHAT_JOINED, { userId: user._id, members });
      dispatch(removeNewMessagesAlert(chatId));
    }

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      if (socket && members) {
        socket.emit(CHAT_LEAVED, { userId: user._id, members });
      }
    };
  }, [chatId, socket, members]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) {
      navigate("/");
    }
  }, [chatDetails.isError, navigate]);

  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "admin",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  useSocketEvents(socket, eventHandler);
  useErrors(errors);

  const allMessages = [...(oldMessages || []), ...messages];

  if (chatDetails.isLoading) {
    return (
      <LoadingContainer>
        <Skeleton 
          variant="rectangular" 
          width="100%" 
          height="100%" 
          sx={{ 
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "8px"
          }}
        />
      </LoadingContainer>
    );
  }

  return (
    <Fragment>
      <ChatContainer
        ref={containerRef}
        boxSizing="border-box"
        padding="1rem"
        spacing="1rem"
        height="90%"
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(102, 126, 234, 0.3)",
            borderRadius: "3px",
            "&:hover": {
              background: "rgba(102, 126, 234, 0.5)",
            },
          },
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id || Math.random()} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </ChatContainer>

      <form
        style={{ height: "10%" }}
        onSubmit={submitHandler}
      >
        <MessageInputContainer
          direction="row"
          height="100%"
          padding="1.5rem"
          alignItems="center"
          position="relative"
          spacing={1}
        >
          <StyledIconButton
            onClick={handleFileOpen}
            sx={{ rotate: "30deg" }}
          >
            <AttachFileIcon />
          </StyledIconButton>

          <StyledInputBox
            placeholder="Type your message..."
            value={message}
            onChange={messageOnChange}
          />

          <SendButton
            type="submit"
            sx={{ rotate: "-30deg" }}
          >
            <SendIcon />
          </SendButton>
        </MessageInputContainer>
      </form>

      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);