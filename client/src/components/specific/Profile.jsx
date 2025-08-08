import React from "react";
import { Avatar, Stack, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
import { transformImage } from "../../lib/features";

const StyledProfileContainer = styled(Stack)(({ theme }) => ({
  background: `
    linear-gradient(180deg, 
      rgba(20, 20, 20, 0.95) 0%, 
      rgba(15, 15, 15, 0.98) 25%,
      rgba(25, 25, 25, 0.95) 50%,
      rgba(18, 18, 18, 0.98) 75%,
      rgba(22, 22, 22, 0.95) 100%
    ),
    radial-gradient(circle at center top, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
    radial-gradient(circle at center bottom, rgba(118, 75, 162, 0.06) 0%, transparent 50%)
  `,
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  padding: "2.5rem 2rem",
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: `
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  
  // Subtle pattern overlay
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(45deg, rgba(255, 255, 255, 0.01) 25%, transparent 25%),
      linear-gradient(-45deg, rgba(255, 255, 255, 0.01) 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.01) 75%),
      linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.01) 75%)
    `,
    backgroundSize: "30px 30px",
    backgroundPosition: "0 0, 0 15px, 15px -15px, -15px 0px",
    opacity: 0.3,
    pointerEvents: "none",
  },
  
  // Top gradient accent
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "60%",
    height: "3px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.6) 50%, transparent 100%)",
    borderRadius: "0 0 6px 6px",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 220,
  height: 220,
  objectFit: "cover",
  marginBottom: "2rem",
  border: "4px solid rgba(255, 255, 255, 0.1)",
  boxShadow: `
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 8px 24px rgba(102, 126, 234, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.1)
  `,
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%)",
  position: "relative",
  transition: "all 0.3s ease",
  
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.4),
      0 12px 32px rgba(102, 126, 234, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.15)
    `,
    border: "4px solid rgba(102, 126, 234, 0.3)",
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-6px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 100%)",
    filter: "blur(10px)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
}));

const ProfileCardContainer = styled(Stack)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 100%)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "16px",
  padding: "20px 24px",
  width: "100%",
  maxWidth: "320px",
  position: "relative",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  
  "&:hover": {
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "3px",
    background: "linear-gradient(180deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.4) 100%)",
    borderRadius: "0 3px 3px 0",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: "48px",
  height: "48px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.1) 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(102, 126, 234, 0.2)",
  backdropFilter: "blur(5px)",
  transition: "all 0.3s ease",
  
  "& .MuiSvgIcon-root": {
    fontSize: "24px",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.7) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
}));

const MainText = styled(Typography)(({ theme }) => ({
  fontSize: "16px",
  fontWeight: 600,
  letterSpacing: "0.3px",
  marginBottom: "4px",
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  lineHeight: 1.4,
}));

const SubText = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  fontWeight: 500,
  letterSpacing: "0.5px",
  textTransform: "uppercase",
  color: "rgba(255, 255, 255, 0.5)",
  transition: "color 0.3s ease",
}));

const FloatingParticle = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.08) 100%)",
  filter: "blur(20px)",
  animation: "floatParticle 8s ease-in-out infinite",
  pointerEvents: "none",
  
  "@keyframes floatParticle": {
    "0%, 100%": {
      transform: "translate(0px, 0px) scale(1)",
      opacity: 0.3,
    },
    "33%": {
      transform: "translate(20px, -15px) scale(1.2)",
      opacity: 0.5,
    },
    "66%": {
      transform: "translate(-15px, 20px) scale(0.8)",
      opacity: 0.4,
    },
  },
}));

const Profile = ({ user }) => {
  return (
    <StyledProfileContainer spacing={3} direction={"column"} alignItems={"center"}>
      {/* Floating particles */}
      <FloatingParticle 
        sx={{ 
          top: "10%", 
          left: "15%", 
          width: "60px", 
          height: "60px",
          animationDelay: "0s"
        }} 
      />
      <FloatingParticle 
        sx={{ 
          top: "70%", 
          right: "10%", 
          width: "40px", 
          height: "40px",
          animationDelay: "3s"
        }} 
      />
      <FloatingParticle 
        sx={{ 
          bottom: "20%", 
          left: "20%", 
          width: "50px", 
          height: "50px",
          animationDelay: "6s"
        }} 
      />

      <StyledAvatar
        src={transformImage(user?.avatar?.url)}
      />
      
      <Stack spacing={2.5} width="100%" alignItems="center">
        <ProfileCard heading={"Bio"} text={user?.bio || "No bio available"} />
        <ProfileCard
          heading={"Username"}
          text={user?.username}
          Icon={<UserNameIcon />}
        />
        <ProfileCard 
          heading={"Name"} 
          text={user?.name} 
          Icon={<FaceIcon />} 
        />
        <ProfileCard
          heading={"Joined"}
          text={moment(user?.createdAt).fromNow()}
          Icon={<CalendarIcon />}
        />
      </Stack>
    </StyledProfileContainer>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <ProfileCardContainer
    direction={"row"}
    alignItems={"center"}
    spacing={3}
  >
    {Icon && (
      <IconContainer>
        {Icon}
      </IconContainer>
    )}

    <Stack flex={1} alignItems={Icon ? "flex-start" : "center"}>
      <MainText variant="body1">
        {text}
      </MainText>
      <SubText variant="caption">
        {heading}
      </SubText>
    </Stack>
  </ProfileCardContainer>
);

export default Profile;