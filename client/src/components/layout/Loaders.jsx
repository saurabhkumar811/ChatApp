import { Grid, Skeleton, Stack, Box } from "@mui/material";
import { styled, keyframes } from "@mui/material/styles";
import React from "react";

// Enhanced bouncing animation
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.4;
  }
  40% {
    transform: scale(1.2) translateY(-8px);
    opacity: 1;
  }
`;

// Shimmer effect for skeletons
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// Floating animation for background elements
const float = keyframes`
  0%, 100% {
    transform: translateY(0px) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-15px) scale(1.05);
    opacity: 0.6;
  }
`;

// Custom styled container with dark theme
const StyledContainer = styled(Box)(({ theme }) => ({
  height: "calc(100vh - 4rem)",
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.03) 0%, transparent 50%)
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
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.005) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.005) 50%, transparent 51%)
    `,
    backgroundSize: "40px 40px",
    opacity: 0.4,
    pointerEvents: "none",
  },
}));

// Enhanced skeleton with glassmorphism
const GlassSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: "rgba(15, 15, 15, 0.6) !important",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px !important",
  position: "relative",
  overflow: "hidden",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05)
  `,
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    background: `
      linear-gradient(
        90deg,
        transparent,
        rgba(102, 126, 234, 0.1) 50%,
        transparent
      )
    `,
    transform: "translateX(-100%)",
    animation: `${shimmer} 2s infinite`,
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.3) 50%, transparent 100%)",
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  },
}));

// Floating background elements
const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)",
  filter: "blur(30px)",
  animation: `${float} 8s ease-in-out infinite`,
  pointerEvents: "none",
  zIndex: 0,
}));

// Enhanced bouncing skeleton for typing indicator
const BouncingSkeleton = styled(Skeleton)(({ theme }) => ({
  backgroundColor: "rgba(102, 126, 234, 0.4) !important",
  animation: `${bounce} 1.4s ease-in-out infinite both`,
  boxShadow: `
    0 4px 12px rgba(102, 126, 234, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2)
  `,
  border: "1px solid rgba(102, 126, 234, 0.2)",
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "4px",
    height: "4px",
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
  },
}));

// Typing loader container with glassmorphism
const TypingContainer = styled(Stack)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.7)",
  backdropFilter: "blur(15px)",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  borderRadius: "20px",
  padding: "1rem",
  boxShadow: `
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05)
  `,
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "50%",
    width: "50%",
    height: "1px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.4) 50%, transparent 100%)",
    transform: "translateX(-50%)",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
}));

const LayoutLoader = () => {
  return (
    <StyledContainer>
      {/* Floating background elements */}
      <FloatingElement 
        sx={{ 
          width: "120px", 
          height: "120px", 
          top: "15%", 
          left: "8%", 
          animationDelay: "0s" 
        }} 
      />
      <FloatingElement 
        sx={{ 
          width: "80px", 
          height: "80px", 
          top: "70%", 
          right: "12%", 
          animationDelay: "3s" 
        }} 
      />
      <FloatingElement 
        sx={{ 
          width: "100px", 
          height: "100px", 
          bottom: "25%", 
          left: "15%", 
          animationDelay: "6s" 
        }} 
      />
      
      <Grid container height={"100%"} spacing={"1rem"} sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          height={"100%"}
        >
          <GlassSkeleton variant="rectangular" height={"100%"} />
        </Grid>
        
        <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
          <Stack spacing={"1rem"}>
            {Array.from({ length: 10 }).map((_, index) => (
              <GlassSkeleton 
                key={index} 
                variant="rounded" 
                height={"5rem"}
                sx={{
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
          </Stack>
        </Grid>

        <Grid
          item
          md={4}
          lg={3}
          height={"100%"}
          sx={{
            display: { xs: "none", md: "block" },
          }}
        >
          <GlassSkeleton variant="rectangular" height={"100%"} />
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

const TypingLoader = () => {
  return (
    <TypingContainer
      spacing={"0.8rem"}
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={16}
        height={16}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={16}
        height={16}
        style={{
          animationDelay: "0.3s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={16}
        height={16}
        style={{
          animationDelay: "0.5s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={16}
        height={16}
        style={{
          animationDelay: "0.7s",
        }}
      />
    </TypingContainer>
  );
};

export { TypingLoader, LayoutLoader };