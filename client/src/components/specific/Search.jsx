import { useInputValidation } from "6pp";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
  Box,
  IconButton,
  Typography,
  Skeleton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

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

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    borderRadius: "12px",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "16px",
    
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s ease",
    },
    
    "&:hover fieldset": {
      borderColor: "rgba(102, 126, 234, 0.4)",
    },
    
    "&.Mui-focused fieldset": {
      borderColor: "rgba(102, 126, 234, 0.6)",
      borderWidth: "2px",
      boxShadow: "0 0 0 4px rgba(102, 126, 234, 0.1)",
    },
  },
  
  "& .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(255, 255, 255, 0.6)",
    transition: "all 0.3s ease",
  },
  
  "&:focus-within .MuiInputAdornment-root .MuiSvgIcon-root": {
    color: "rgba(102, 126, 234, 0.8)",
  },
}));

const FloatingAccent = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(40px)",
  opacity: 0.3,
  animation: "searchFloat 12s ease-in-out infinite",
  pointerEvents: "none",
  "@keyframes searchFloat": {
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

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.8) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontSize: "28px",
  fontWeight: 700,
  letterSpacing: "-0.5px",
  textAlign: "center",
  position: "relative",
  zIndex: 1,
  paddingBottom: "1rem",
}));

const StyledList = styled(List)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  padding: "16px",
  maxHeight: "350px",
  overflow: "auto",
  position: "relative",
  marginTop: "1.5rem",
  
  // Custom scrollbar
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "rgba(255, 255, 255, 0.02)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "linear-gradient(180deg, rgba(102, 126, 234, 0.4) 0%, rgba(118, 75, 162, 0.4) 100%)",
    borderRadius: "3px",
    "&:hover": {
      background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)",
    },
  },
  
  // Empty state styling
  "&:empty::after": {
    content: "'Start typing to search for people...'",
    display: "block",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.5)",
    fontStyle: "italic",
    padding: "2rem 0",
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

const SearchResultsContainer = styled(Box)(({ theme }) => ({
  "& .MuiListItem-root": {
    borderRadius: "8px",
    marginBottom: "4px",
    transition: "all 0.2s ease",
    
    "&:hover": {
      background: "rgba(255, 255, 255, 0.03)",
      transform: "translateX(2px)",
    },
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "3rem 2rem",
  textAlign: "center",
  color: "rgba(255, 255, 255, 0.5)",
}));

const LoadingSkeleton = () => (
  <Stack spacing={1} sx={{ mt: 2 }}>
    {[1, 2, 3].map((i) => (
      <Skeleton
        key={i}
        variant="rectangular"
        height={60}
        sx={{
          borderRadius: "8px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
        }}
      />
    ))}
  </Stack>
);

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser, { isLoading }] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();
  const search = useInputValidation("");
  const [users, setUsers] = useState([]);

  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  const searchCloseHandler = () => {
    dispatch(setIsSearch(false));
    setUsers([]);
    search.clear && search.clear();
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (search.value.trim()) {
        searchUser(search.value)
          .then(({ data }) => setUsers(data?.users || []))
          .catch((e) => {
            console.log(e);
            setUsers([]);
          });
      } else {
        setUsers([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value, searchUser]);

  return (
    <StyledDialog open={isSearch} onClose={searchCloseHandler} maxWidth="sm" fullWidth>
      <Box sx={{ position: "relative" }}>
        {/* Floating accent elements */}
        <FloatingAccent 
          sx={{ 
            top: "25%", 
            left: "20%", 
            width: "50px", 
            height: "50px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
            animationDelay: "0s"
          }} 
        />
        <FloatingAccent 
          sx={{ 
            top: "55%", 
            right: "25%", 
            width: "40px", 
            height: "40px",
            background: "linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(102, 126, 234, 0.08) 100%)",
            animationDelay: "3s"
          }} 
        />

        <CloseButton onClick={searchCloseHandler}>
          <CloseIcon fontSize="small" />
        </CloseButton>

        <Stack p={{ xs: "2rem", sm: "3rem" }} sx={{ position: "relative", zIndex: 1, width: "100%" }}>
          <StyledDialogTitle variant="h4">
            Find People
          </StyledDialogTitle>

          <StyledTextField
            placeholder="Search for users..."
            value={search.value}
            onChange={search.changeHandler}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <SearchResultsContainer>
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <StyledList>
                {users.length > 0 ? (
                  users.map((user) => (
                    <Box
                      key={user._id}
                      sx={{
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          background: "rgba(255, 255, 255, 0.03)",
                          transform: "translateX(2px)",
                        },
                      }}
                    >
                      <UserItem
                        user={user}
                        handler={addFriendHandler}
                        handlerIsLoading={isLoadingSendFriendRequest}
                      />
                    </Box>
                  ))
                ) : search.value.trim() ? (
                  <EmptyState>
                    <SearchIcon sx={{ fontSize: "3rem", mb: 2, opacity: 0.3 }} />
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      No users found for "{search.value}"
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.3)", mt: 1 }}>
                      Try searching with a different name
                    </Typography>
                  </EmptyState>
                ) : (
                  <EmptyState>
                    <SearchIcon sx={{ fontSize: "3rem", mb: 2, opacity: 0.3 }} />
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
                      Start typing to search for people
                    </Typography>
                  </EmptyState>
                )}
              </StyledList>
            )}
          </SearchResultsContainer>
        </Stack>
      </Box>
    </StyledDialog>
  );
};

export default Search;