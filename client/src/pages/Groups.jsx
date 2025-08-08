import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { useDispatch, useSelector } from "react-redux";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

// Styled Components
const StyledContainer = styled(Grid)(({ theme }) => ({
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

const GroupsSidebar = styled(Stack)(({ theme }) => ({
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
}));

const MainContent = styled(Grid)(({ theme }) => ({
  background: `
    linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.8) 100%)
  `,
  backdropFilter: "blur(20px)",
  position: "relative",
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.8)",
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.1)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      borderColor: "rgba(255, 255, 255, 0.2)",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderColor: "#667eea",
      boxShadow: "0 0 0 2px rgba(102, 126, 234, 0.2)",
    },
    "& fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.5)",
    },
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  borderRadius: "12px",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const DangerButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #ff4757 0%, #c44569 100%)",
  color: "white",
  borderRadius: "12px",
  padding: "12px 24px",
  fontSize: "16px",
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 4px 16px rgba(255, 71, 87, 0.4)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #ff3742 0%, #b33a5a 100%)",
    boxShadow: "0 6px 20px rgba(255, 71, 87, 0.6)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "translateY(0)",
  },
}));

const GroupNameContainer = styled(Stack)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.8)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "20px",
  padding: "2rem",
  margin: "1rem 0",
  boxShadow: `
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
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
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 600,
  letterSpacing: "0.5px",
}));

const MembersContainer = styled(Stack)(({ theme }) => ({
  background: "rgba(10, 10, 10, 0.6)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  borderRadius: "16px",
  padding: "1rem",
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
}));

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

const Groups = () => {
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAddMember } = useSelector((state) => state.misc);

  const myGroups = useMyGroupsQuery("");

  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const [updateGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );

  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );

  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(
    useDeleteChatMutation
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");

  const [members, setMembers] = useState([]);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedValue(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setMembers([]);
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => setIsMobileMenuOpen(false);

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue,
    });
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true));
  };

  const deleteHandler = () => {
    deleteGroup("Deleting Group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing Member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
            zIndex: 1000,
          },
        }}
      >
        <StyledIconButton onClick={handleMobile}>
          <MenuIcon />
        </StyledIconButton>
      </Box>

      <Tooltip title="Back to Chat">
        <StyledIconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            zIndex: 100,
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </StyledIconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <GroupNameContainer
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
    >
      {isEdit ? (
        <>
          <StyledTextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            placeholder="Enter group name"
            variant="outlined"
            size="medium"
          />
          <StyledIconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </StyledIconButton>
        </>
      ) : (
        <>
          <StyledTypography variant="h4">{groupName}</StyledTypography>
          <StyledIconButton
            disabled={isLoadingGroupName}
            onClick={() => setIsEdit(true)}
          >
            <EditIcon />
          </StyledIconButton>
        </>
      )}
    </GroupNameContainer>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        xs: "column-reverse",
        sm: "row",
      }}
      spacing={"1rem"}
      p={{
        xs: "1rem",
        sm: "2rem",
        md: "2rem 4rem",
      }}
      sx={{ mt: 3 }}
    >
      <DangerButton
        size="large"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </DangerButton>
      <GradientButton
        size="large"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </GradientButton>
    </Stack>
  );

  return myGroups.isLoading ? (
    <Box sx={{ 
      background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <LayoutLoader />
    </Box>
  ) : (
    <StyledContainer container height={"100vh"}>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>

      <MainContent
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}

        {groupName && (
          <>
            {GroupName}

            <StyledTypography
              variant="h6"
              sx={{ 
                margin: "2rem 0 1rem 0",
                alignSelf: "flex-start",
                opacity: 0.8
              }}
            >
              Members ({members.length})
            </StyledTypography>

            <MembersContainer
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              spacing={"1rem"}
              height={"50vh"}
              overflow={"auto"}
            >
              {isLoadingRemoveMember ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                  <CircularProgress sx={{ color: "#667eea" }} />
                </Box>
              ) : (
                members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      background: "rgba(15, 15, 15, 0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
                      padding: "1rem 2rem",
                      borderRadius: "16px",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.4)",
                      }
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </MembersContainer>

            {ButtonGroup}
          </>
        )}
      </MainContent>

      {isAddMember && (
        <Suspense fallback={<Backdrop open sx={{ backdropFilter: "blur(10px)" }} />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open sx={{ backdropFilter: "blur(10px)" }} />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
          "& .MuiDrawer-paper": {
            background: "rgba(15, 15, 15, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList
          w={"50vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
        />
      </Drawer>
    </StyledContainer>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <GroupsSidebar
    width={w}
    sx={{
      height: "100vh",
      overflow: "auto",
      padding: "1rem",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => (
        <GroupListItem group={group} chatId={chatId} key={group._id} />
      ))
    ) : (
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        height: "200px",
        background: "rgba(15, 15, 15, 0.8)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        mt: 2
      }}>
        <StyledTypography variant="body1" sx={{ opacity: 0.6 }}>
          No groups found
        </StyledTypography>
      </Box>
    )}
  </GroupsSidebar>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  const StyledLink = styled(Link)(({ theme }) => ({
    display: "block",
    padding: "1rem",
    margin: "0.5rem 0",
    background: chatId === _id 
      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)"
      : "rgba(15, 15, 15, 0.6)",
    backdropFilter: "blur(10px)",
    border: `1px solid ${chatId === _id ? "rgba(102, 126, 234, 0.3)" : "rgba(255, 255, 255, 0.1)"}`,
    borderRadius: "16px",
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      background: chatId === _id 
        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)"
        : "rgba(255, 255, 255, 0.1)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
    },
  }));

  return (
    <StyledLink
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <StyledTypography variant="body1" sx={{ fontSize: "16px" }}>
          {name}
        </StyledTypography>
      </Stack>
    </StyledLink>
  );
});

export default Groups;