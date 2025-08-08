import React from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link } from "react-router-dom";

const StyledContainer = styled(Container)(({ theme }) => ({
  height: "100vh",
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
    radial-gradient(circle at 20% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 118, 117, 0.1) 0%, transparent 50%)
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
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.01) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.01) 50%, transparent 51%)
    `,
    backgroundSize: "80px 80px",
    opacity: 0.2,
  },
}));

const ContentStack = styled(Stack)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.8)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "32px",
  padding: "4rem 3rem",
  boxShadow: `
    0 25px 70px rgba(0, 0, 0, 0.6),
    0 10px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: "relative",
  maxWidth: "600px",
  width: "100%",
  textAlign: "center",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "linear-gradient(90deg, transparent 0%, rgba(255, 118, 117, 0.6) 25%, rgba(102, 126, 234, 0.6) 75%, transparent 100%)",
    borderTopLeftRadius: "32px",
    borderTopRightRadius: "32px",
  },
}));

const StyledErrorIcon = styled(ErrorIcon)(({ theme }) => ({
  fontSize: "8rem",
  background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  filter: "drop-shadow(0 4px 20px rgba(255, 107, 107, 0.3))",
  marginBottom: "1rem",
  animation: "pulse 2s ease-in-out infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      transform: "scale(1)",
      opacity: 0.8,
    },
    "50%": {
      transform: "scale(1.05)",
      opacity: 1,
    },
  },
}));

const GradientTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 800,
  letterSpacing: "2px",
  marginBottom: "1rem",
}));

const SubtitleTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.5) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 400,
  marginBottom: "2rem",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "16px",
  padding: "16px 32px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  textDecoration: "none",
  border: "none",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
    transform: "translateY(-3px)",
    textDecoration: "none",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
    transition: "left 0.5s",
  },
  "&:hover::before": {
    left: "100%",
  },
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(255, 118, 117, 0.1) 100%)",
  filter: "blur(60px)",
  animation: "float 8s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px) rotate(0deg)",
      opacity: 0.3,
    },
    "50%": {
      transform: "translateY(-30px) rotate(180deg)",
      opacity: 0.7,
    },
  },
}));

const NotFound = () => {
  return (
    <StyledContainer maxWidth={false}>
      {/* Floating background elements */}
      <FloatingElement 
        sx={{ 
          width: "200px", 
          height: "200px", 
          top: "10%", 
          left: "5%", 
          animationDelay: "0s" 
        }} 
      />
      <FloatingElement 
        sx={{ 
          width: "150px", 
          height: "150px", 
          top: "20%", 
          right: "10%", 
          animationDelay: "3s" 
        }} 
      />
      <FloatingElement 
        sx={{ 
          width: "180px", 
          height: "180px", 
          bottom: "15%", 
          left: "15%", 
          animationDelay: "6s" 
        }} 
      />

      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        height="100%"
        spacing={0}
      >
        <ContentStack alignItems={"center"} spacing={"2rem"}>
          <StyledErrorIcon />
          
          <Box>
            <GradientTypography variant="h1" sx={{ fontSize: { xs: "4rem", md: "6rem" } }}>
              404
            </GradientTypography>
            
            <SubtitleTypography variant="h4" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
              Oops! Page Not Found
            </SubtitleTypography>
          </Box>

          <Typography 
            sx={{ 
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "18px",
              textAlign: "center",
              lineHeight: 1.6,
              maxWidth: "400px",
              mb: 2
            }}
          >
            The page you're looking for seems to have wandered off into the digital void. Let's get you back on track.
          </Typography>

          <StyledButton
            component={Link}
            to="/"
            size="large"
          >
            Return to Home
          </StyledButton>

          <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
            <Typography sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px" }}>
              Error Code: 404 - Page Not Found
            </Typography>
          </Box>
        </ContentStack>
      </Stack>
    </StyledContainer>
  );
};

export default NotFound;