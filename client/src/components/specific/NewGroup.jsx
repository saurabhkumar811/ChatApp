import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Close as CloseIcon } from "@mui/icons-material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

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
  
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    
    "&.Mui-focused": {
      color: "rgba(102, 126, 234, 0.9)",
    },
  },
}));

const StyledButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: "12px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  
  ...(variant === "contained" && {
    background: `
      linear-gradient(135deg, 
        rgba(102, 126, 234, 0.9) 0%, 
        rgba(118, 75, 162, 0.9) 100%
      )
    `,
    color: "rgba(255, 255, 255, 0.95)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: `
      0 8px 32px rgba(102, 126, 234, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    
    "&:hover": {
      background: `
        linear-gradient(135deg, 
          rgba(102, 126, 234, 1) 0%, 
          rgba(118, 75, 162, 1) 100%
        )
      `,
      boxShadow: `
        0 12px 40px rgba(102, 126, 234, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      transform: "translateY(-1px)",
    },
    
    "&:disabled": {
      background: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.4)",
      boxShadow: "none",
    },
  }),
  
  ...(variant === "text" && {
    color: "rgba(239, 68, 68, 0.8)",
    background: "rgba(239, 68, 68, 0.08)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    
    "&:hover": {
      background: "rgba(239, 68, 68, 0.15)",
      color: "rgba(239, 68, 68, 1)",
      transform: "translateY(-1px)",
    },
  }),
}));

const FloatingAccent = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  filter: "blur(40px)",
  opacity: 0.3,
  animation: "dialogFloat 14s ease-in-out infinite",
  pointerEvents: "none",
  "@keyframes dialogFloat": {
    "0%, 100%": {
      transform: "translate(0px, 0px) scale(1)",
      opacity: 0.2,
    },
    "33%": {
      transform: "translate(12px, -8px) scale(1.1)",
      opacity: 0.4,
    },
    "66%": {
      transform: "translate(-8px, 12px) scale(0.9)",
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
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.8)",
  fontWeight: 600,
  fontSize: "14px",
  letterSpacing: "0.3px",
  textTransform: "uppercase",
}));

const MembersContainer = styled(Stack)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.02)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "12px",
  padding: "16px",
  maxHeight: "280px",
  overflow: "auto",
  position: "relative",
  
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

const NewGroup = () => {
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  const groupName = useInputValidation("");

  const [selectedMembers, setSelectedMembers] = useState([]);

  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <StyledDialog onClose={closeHandler} open={isNewGroup} maxWidth="sm" fullWidth>
      <Box sx={{ position: "relative" }}>
        {/* Floating accent elements */}
        <FloatingAccent 
          sx={{ 
            top: "20%", 
            left: "15%", 
            width: "60px", 
            height: "60px",
            background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
            animationDelay: "0s"
          }} 
        />
        <FloatingAccent 
          sx={{ 
            top: "60%", 
            right: "20%", 
            width: "45px", 
            height: "45px",
            background: "linear-gradient(135deg, rgba(118, 75, 162, 0.12) 0%, rgba(102, 126, 234, 0.08) 100%)",
            animationDelay: "4s"
          }} 
        />

        <CloseButton onClick={closeHandler}>
          <CloseIcon fontSize="small" />
        </CloseButton>

        <Stack p={{ xs: "2rem", sm: "3rem" }} spacing="2rem" sx={{ position: "relative", zIndex: 1 }}>
          <StyledDialogTitle variant="h4">
            Create New Group
          </StyledDialogTitle>

          <StyledTextField
            label="Group Name"
            value={groupName.value}
            onChange={groupName.changeHandler}
            fullWidth
            placeholder="Enter group name..."
          />

          <Box>
            <StyledTypography variant="body1" sx={{ mb: 2 }}>
              Select Members ({selectedMembers.length} selected)
            </StyledTypography>

            <MembersContainer spacing={1}>
              {isLoading ? (
                <Stack spacing={1}>
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
              ) : (
                data?.friends?.map((i) => (
                  <Box
                    key={i._id}
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
                      user={i}
                      handler={selectMemberHandler}
                      isAdded={selectedMembers.includes(i._id)}
                    />
                  </Box>
                ))
              )}
            </MembersContainer>
          </Box>

          <Stack direction="row" justifyContent="space-between" spacing={2}>
            <StyledButton
              variant="text"
              size="large"
              onClick={closeHandler}
              sx={{ flex: 1 }}
            >
              Cancel
            </StyledButton>
            <StyledButton
              variant="contained"
              size="large"
              onClick={submitHandler}
              disabled={isLoadingNewGroup}
              sx={{ flex: 1 }}
            >
              {isLoadingNewGroup ? "Creating..." : "Create Group"}
            </StyledButton>
          </Stack>
        </Stack>
      </Box>
    </StyledDialog>
  );
};

export default NewGroup;