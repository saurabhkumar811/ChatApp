import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledContainer = styled(Box)(({ theme }) => ({
  height: "100%",
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)
  `,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
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
    backgroundSize: "60px 60px",
    opacity: 0.3,
  },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  background: "rgba(15, 15, 15, 0.8)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "24px",
  padding: "3rem 2rem",
  textAlign: "center",
  boxShadow: `
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: "relative",
  maxWidth: "500px",
  width: "90%",
  margin: "0 auto",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, transparent 0%, rgba(102, 126, 234, 0.5) 50%, transparent 100%)",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  fontWeight: 600,
  letterSpacing: "0.5px",
  marginBottom: "1rem",
}));

const SubText = styled(Typography)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.5)",
  fontSize: "16px",
  lineHeight: 1.6,
  fontWeight: 400,
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: "absolute",
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
  filter: "blur(40px)",
  animation: "float 6s ease-in-out infinite",
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px) scale(1)",
      opacity: 0.5,
    },
    "50%": {
      transform: "translateY(-20px) scale(1.1)",
      opacity: 0.8,
    },
  },
}));

const Home = () => {
  return (
    <StyledContainer>
      {/* Floating background elements */}
      <FloatingElement sx={{ top: "20%", left: "10%", animationDelay: "0s" }} />
      <FloatingElement sx={{ top: "60%", right: "15%", animationDelay: "2s" }} />
      <FloatingElement sx={{ bottom: "30%", left: "20%", animationDelay: "4s" }} />
      
      <ContentBox>
        <Box sx={{ mb: 3 }}>
          {/* Icon or Logo placeholder */}
          <Box
            sx={{
              width: 80,
              height: 80,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem auto",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                border: "2px solid white",
                borderRadius: "8px",
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: "12px",
                  height: "12px",
                  background: "white",
                  borderRadius: "50%",
                  transform: "translate(-50%, -50%)",
                },
              }}
            />
          </Box>
        </Box>
        
        <StyledTypography variant="h4" component="h1">
          Welcome to Your Chat
        </StyledTypography>
        
        <SubText variant="body1">
          Select a friend from your contact list to start a conversation and enjoy seamless messaging experience
        </SubText>
        
      </ContentBox>
    </StyledContainer>
  );
};

export default AppLayout()(Home);