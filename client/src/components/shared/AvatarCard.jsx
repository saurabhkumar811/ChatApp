import { Avatar, AvatarGroup, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { transformImage } from "../../lib/features";

const StyledAvatarContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "44px",
  height: "44px",
  border: "2px solid rgba(255, 255, 255, 0.15)",
  background: `linear-gradient(135deg, 
    rgba(102, 126, 234, 0.1) 0%, 
    rgba(118, 75, 162, 0.08) 50%,
    rgba(102, 126, 234, 0.06) 100%
  ), rgba(30, 30, 35, 0.6)`,
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  
  // Subtle inner glow
  boxShadow: `
    0 2px 12px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(102, 126, 234, 0.1)
  `,
  
  // Gradient ring effect
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-3px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 50%, transparent 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: -1,
  },
  
  "&:hover": {
    transform: "scale(1.05)",
    border: "2px solid rgba(102, 126, 234, 0.3)",
    boxShadow: `
      0 4px 20px rgba(102, 126, 234, 0.2),
      0 2px 8px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      0 0 0 1px rgba(102, 126, 234, 0.2)
    `,
    
    "&::before": {
      opacity: 1,
    },
  },
  
  // Image styling
  "& img": {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
  
  // Fallback styling for text avatars
  fontSize: "16px",
  fontWeight: 600,
  color: "rgba(255, 255, 255, 0.9)",
  letterSpacing: "0.5px",
}));

const StyledAvatarGroup = styled(AvatarGroup)(({ theme }) => ({
  "& .MuiAvatar-root": {
    width: "36px",
    height: "36px",
    fontSize: "14px",
    border: "2px solid rgba(255, 255, 255, 0.1)",
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 0.08) 0%, 
      rgba(118, 75, 162, 0.06) 50%,
      rgba(102, 126, 234, 0.04) 100%
    ), rgba(30, 30, 35, 0.5)`,
    backdropFilter: "blur(8px)",
    transition: "all 0.3s ease",
    
    "&:hover": {
      transform: "scale(1.1)",
      border: "2px solid rgba(102, 126, 234, 0.25)",
      boxShadow: `
        0 3px 15px rgba(102, 126, 234, 0.15),
        0 2px 6px rgba(0, 0, 0, 0.2)
      `,
    },
    
    "&:not(:first-of-type)": {
      marginLeft: "-8px",
    },
  },
  
  // Extra count avatar styling
  "& .MuiAvatarGroup-avatar": {
    background: `linear-gradient(135deg, 
      rgba(118, 75, 162, 0.8) 0%, 
      rgba(102, 126, 234, 0.8) 100%
    )`,
    color: "rgba(255, 255, 255, 0.95)",
    fontSize: "12px",
    fontWeight: 700,
    border: "2px solid rgba(118, 75, 162, 0.3)",
    
    "&:hover": {
      background: `linear-gradient(135deg, 
        rgba(118, 75, 162, 1) 0%, 
        rgba(102, 126, 234, 1) 100%
      )`,
      border: "2px solid rgba(118, 75, 162, 0.5)",
    },
  },
}));

const AvatarCard = ({ avatar = [], max = 2 }) => {
  // Single avatar case
  if (!avatar || avatar.length === 0) {
    return (
      <StyledAvatarContainer>
        <StyledAvatar>
          ?
        </StyledAvatar>
      </StyledAvatarContainer>
    );
  }
  
  if (avatar.length === 1) {
    return (
      <StyledAvatarContainer>
        <StyledAvatar 
          src={transformImage(avatar[0])}
          alt="Avatar"
        >
          {/* Fallback initial */}
          {avatar[0] ? avatar[0].charAt(0).toUpperCase() : "?"}
        </StyledAvatar>
      </StyledAvatarContainer>
    );
  }
  
  // Multiple avatars case (group chat)
  return (
    <StyledAvatarContainer>
      <StyledAvatarGroup 
        max={max}
        sx={{
          "& .MuiAvatarGroup-avatar": {
            fontSize: "11px",
          }
        }}
      >
        {avatar.map((src, index) => (
          <StyledAvatar
            key={index}
            src={transformImage(src)}
            alt={`Avatar ${index + 1}`}
            sx={{
              zIndex: avatar.length - index,
            }}
          >
            {src ? src.charAt(0).toUpperCase() : "?"}
          </StyledAvatar>
        ))}
      </StyledAvatarGroup>
    </StyledAvatarContainer>
  );
};

export default AvatarCard;