import { useInputValidation } from "6pp";
import {
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Visibility, VisibilityOff, AdminPanelSettings } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { bgGradient } from "../../constants/color";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

// Custom styled components matching your theme
const StyledContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh",
  background: `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0f0f0f 50%, #1e1e1e 75%, #0d0d0d 100%),
    radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 118, 117, 0.1) 0%, transparent 50%)
  `,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
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
      linear-gradient(45deg, transparent 49%, rgba(255, 255, 255, 0.02) 50%, transparent 51%),
      linear-gradient(-45deg, transparent 49%, rgba(255, 255, 255, 0.02) 50%, transparent 51%)
    `,
    backgroundSize: "60px 60px",
    opacity: 0.3,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: "3rem 2.5rem",
  background: "rgba(15, 15, 15, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "24px",
  boxShadow: `
    0 20px 60px rgba(0, 0, 0, 0.8),
    0 8px 32px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `,
  position: "relative",
  overflow: "hidden",
  maxWidth: "420px",
  width: "100%",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "2px",
    background: "linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 3s ease-in-out infinite",
  },
  "@keyframes shimmer": {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#ffffff",
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
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
    "&.Mui-focused": {
      color: "#667eea",
    },
  },
  "& .MuiOutlinedInput-input": {
    color: "#ffffff",
    padding: "14px 16px",
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "12px",
  padding: "14px 28px",
  textTransform: "none",
  fontSize: "16px",
  fontWeight: 600,
  color: "#ffffff",
  border: "none",
  position: "relative",
  overflow: "hidden",
  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 12px 40px rgba(102, 126, 234, 0.6)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: "rgba(255, 255, 255, 0.1)",
    color: "rgba(255, 255, 255, 0.5)",
    boxShadow: "none",
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

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  width: "24px",
  height: "24px",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    transform: "scale(1.1)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
}));

const AdminLogin = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const secretKey = useInputValidation("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

  return (
    <StyledContainer component="main" maxWidth={false}>
      <StyledPaper elevation={0}>
        <Box textAlign="center" mb={4}>
          {/* Admin Icon with gradient background */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 2rem",
              boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": {
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                },
                "50%": {
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.6)",
                },
                "100%": {
                  boxShadow: "0 8px 32px rgba(102, 126, 234, 0.4)",
                },
              },
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 40, color: "white" }} />
          </Box>

          <Typography 
            variant="h4" 
            sx={{ 
              color: "#ffffff",
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Admin Portal
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "16px",
            }}
          >
            Enter your secret key to access the dashboard
          </Typography>
        </Box>

        <form onSubmit={submitHandler}>
          <StyledTextField
            required
            fullWidth
            label="Secret Key"
            type={showPassword ? "text" : "password"}
            margin="normal"
            variant="outlined"
            value={secretKey.value}
            onChange={secretKey.changeHandler}
            InputProps={{
              endAdornment: (
                <StyledIconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  size="small"
                >
                  {showPassword ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                </StyledIconButton>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <StyledButton
            type="submit"
            fullWidth
            sx={{ mb: 2 }}
          >
            Access Dashboard
          </StyledButton>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AdminLogin;