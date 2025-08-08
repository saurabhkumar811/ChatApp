import React from "react";
import { transformImage } from "../../lib/features";
import { FileOpen as FileOpenIcon } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledMediaContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: "16px",
  overflow: "hidden",
  background: `linear-gradient(135deg, 
    rgba(255, 255, 255, 0.03) 0%, 
    rgba(255, 255, 255, 0.01) 50%,
    rgba(255, 255, 255, 0.02) 100%
  ), rgba(20, 20, 25, 0.6)`,
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  
  "&:hover": {
    transform: "scale(1.02)",
    background: `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.08) 0%, 
      rgba(255, 255, 255, 0.04) 50%,
      rgba(255, 255, 255, 0.06) 100%
    ), rgba(25, 25, 30, 0.8)`,
    border: "1px solid rgba(255, 255, 255, 0.15)",
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 4px 16px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, transparent 50%, rgba(118, 75, 162, 0.03) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
    zIndex: 1,
    pointerEvents: "none",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
}));

const StyledVideo = styled("video")(({ theme }) => ({
  width: "200px",
  borderRadius: "16px",
  display: "block",
  background: "rgba(0, 0, 0, 0.5)",
  
  "&::-webkit-media-controls-panel": {
    background: "linear-gradient(135deg, rgba(20, 20, 25, 0.9) 0%, rgba(25, 25, 30, 0.9) 100%)",
    backdropFilter: "blur(10px)",
  },
  
  "&::-webkit-media-controls-play-button": {
    backgroundColor: "rgba(102, 126, 234, 0.8)",
    borderRadius: "50%",
  },
  
  "&::-webkit-media-controls-timeline": {
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "4px",
  },
  
  "&::-webkit-media-controls-current-time-display": {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "12px",
  },
  
  "&::-webkit-media-controls-time-remaining-display": {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "12px",
  },
}));

const StyledImage = styled("img")(({ theme }) => ({
  width: "200px",
  height: "150px",
  objectFit: "contain",
  borderRadius: "16px",
  transition: "all 0.3s ease",
  position: "relative",
  zIndex: 2,
}));

const StyledAudio = styled("audio")(({ theme }) => ({
  width: "200px",
  borderRadius: "12px",
  outline: "none",
  background: "transparent",
  
  "&::-webkit-media-controls-panel": {
    background: "linear-gradient(135deg, rgba(20, 20, 25, 0.9) 0%, rgba(25, 25, 30, 0.9) 100%)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
  },
  
  "&::-webkit-media-controls-play-button": {
    backgroundColor: "rgba(102, 126, 234, 0.8)",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },
  
  "&::-webkit-media-controls-play-button:hover": {
    backgroundColor: "rgba(102, 126, 234, 1)",
    transform: "scale(1.1)",
  },
  
  "&::-webkit-media-controls-timeline": {
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "4px",
    height: "6px",
  },
  
  "&::-webkit-media-controls-timeline::-webkit-slider-thumb": {
    background: "linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)",
    borderRadius: "50%",
    boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
  },
  
  "&::-webkit-media-controls-current-time-display, &::-webkit-media-controls-time-remaining-display": {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: "11px",
    fontWeight: "500",
  },
}));

const StyledFileContainer = styled(Box)(({ theme }) => ({
  width: "200px",
  height: "150px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, 
    rgba(255, 255, 255, 0.05) 0%, 
    rgba(255, 255, 255, 0.02) 50%,
    rgba(255, 255, 255, 0.03) 100%
  ), rgba(25, 25, 30, 0.8)`,
  border: "2px dashed rgba(255, 255, 255, 0.15)",
  borderRadius: "16px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  backdropFilter: "blur(15px)",
  
  "&:hover": {
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 0.08) 0%, 
      rgba(118, 75, 162, 0.05) 50%,
      rgba(102, 126, 234, 0.06) 100%
    ), rgba(30, 30, 35, 0.9)`,
    border: "2px dashed rgba(102, 126, 234, 0.4)",
    transform: "translateY(-2px)",
    boxShadow: `
      0 8px 32px rgba(102, 126, 234, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.3)
    `,
  },
}));

const StyledFileIcon = styled(FileOpenIcon)(({ theme }) => ({
  fontSize: "48px",
  color: "rgba(255, 255, 255, 0.6)",
  transition: "all 0.3s ease",
  filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
  
  ".MuiBox-root:hover &": {
    color: "rgba(102, 126, 234, 0.8)",
    transform: "scale(1.1) rotate(5deg)",
    filter: "drop-shadow(0 4px 16px rgba(102, 126, 234, 0.3))",
  },
}));

const PlayOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, 
    rgba(102, 126, 234, 0.9) 0%, 
    rgba(118, 75, 162, 0.9) 100%
  )`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  zIndex: 3,
  boxShadow: `
    0 4px 20px rgba(102, 126, 234, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  
  "&:hover": {
    transform: "translate(-50%, -50%) scale(1.1)",
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 1) 0%, 
      rgba(118, 75, 162, 1) 100%
    )`,
    boxShadow: `
      0 6px 32px rgba(102, 126, 234, 0.6),
      0 4px 16px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3)
    `,
  },
  
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-4px",
    left: "-4px",
    right: "-4px",
    bottom: "-4px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.2) 100%)",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  
  "&:hover::before": {
    opacity: 1,
  },
  
  "& svg": {
    fontSize: "20px",
    color: "white",
    marginLeft: "2px", // Slight offset for play icon
  },
}));

const RenderAttachment = (file, url) => {
  switch (file) {
    case "video":
      return (
        <StyledMediaContainer>
          <StyledVideo src={url} preload="none" controls />
          <PlayOverlay>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </PlayOverlay>
        </StyledMediaContainer>
      );

    case "image":
      return (
        <StyledMediaContainer>
          <StyledImage
            src={transformImage(url, 200)}
            alt="Attachment"
          />
        </StyledMediaContainer>
      );

    case "audio":
      return (
        <StyledMediaContainer>
          <StyledAudio src={url} preload="none" controls />
        </StyledMediaContainer>
      );

    default:
      return (
        <StyledFileContainer>
          <StyledFileIcon />
        </StyledFileContainer>
      );
  }
};

export default RenderAttachment;