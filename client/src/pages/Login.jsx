import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/StyledComponents";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

// Custom styled components
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

const SecondaryButton = styled(Button)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.7)",
  borderRadius: "12px",
  padding: "12px 24px",
  textTransform: "none",
  fontSize: "14px",
  fontWeight: 500,
  border: "1px solid rgba(255, 255, 255, 0.1)",
  background: "transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    color: "#ffffff",
  },
  "&:disabled": {
    color: "rgba(255, 255, 255, 0.3)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: "10rem",
  height: "10rem",
  border: "4px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.7)",
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  bottom: "-8px",
  right: "-8px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  width: "48px",
  height: "48px",
  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
  border: "2px solid rgba(15, 15, 15, 1)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    transform: "scale(1.1)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
}));

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Logging In...");

    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExists(data.user));
      toast.success(data.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer component={"main"} maxWidth={false}>
      <StyledPaper elevation={0}>
        {isLogin ? (
          <>
            <Box textAlign="center" mb={4}>
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
                Welcome Back
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "16px",
                }}
              >
                Sign in to continue your journey
              </Typography>
            </Box>
            
            <form onSubmit={handleLogin}>
              <StyledTextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
                sx={{ mb: 3 }}
              />

              <StyledButton
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? "Logging In..." : "Login"}
              </StyledButton>

              <Box textAlign="center" my={2}>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px" }}>
                  OR
                </Typography>
              </Box>

              <SecondaryButton
                disabled={isLoading}
                fullWidth
                onClick={toggleLogin}
              >
                Create new account
              </SecondaryButton>
            </form>
          </>
        ) : (
          <>
            <Box textAlign="center" mb={4}>
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
                Join Us
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "rgba(255, 255, 255, 0.6)",
                  fontSize: "16px",
                }}
              >
                Create your account and get started
              </Typography>
            </Box>

            <form onSubmit={handleSignUp}>
              <Stack position={"relative"} width={"10rem"} margin={"auto"} mb={3}>
                <StyledAvatar
                  src={avatar.preview}
                />
                <StyledIconButton component="label">
                  <CameraAltIcon />
                  <VisuallyHiddenInput
                    type="file"
                    onChange={avatar.changeHandler}
                  />
                </StyledIconButton>
              </Stack>

              {avatar.error && (
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#ff6b6b",
                    fontSize: "12px",
                    mb: 2,
                  }}
                >
                  {avatar.error}
                </Typography>
              )}

              <StyledTextField
                required
                fullWidth
                label="Full Name"
                margin="normal"
                variant="outlined"
                value={name.value}
                onChange={name.changeHandler}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                required
                fullWidth
                label="Bio"
                margin="normal"
                variant="outlined"
                value={bio.value}
                onChange={bio.changeHandler}
                sx={{ mb: 2 }}
              />

              <StyledTextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant="outlined"
                value={username.value}
                onChange={username.changeHandler}
                sx={{ mb: username.error ? 1 : 2 }}
              />

              {username.error && (
                <Typography 
                  sx={{ 
                    color: "#ff6b6b", 
                    fontSize: "12px",
                    mb: 2,
                    ml: 1,
                  }}
                >
                  {username.error}
                </Typography>
              )}

              <StyledTextField
                required
                fullWidth
                label="Password"
                type="password"
                margin="normal"
                variant="outlined"
                value={password.value}
                onChange={password.changeHandler}
                sx={{ mb: 3 }}
              />

              <StyledButton
                type="submit"
                fullWidth
                disabled={isLoading}
                sx={{ mb: 2 }}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </StyledButton>

              <Box textAlign="center" my={2}>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px" }}>
                  OR
                </Typography>
              </Box>

              <SecondaryButton
                disabled={isLoading}
                fullWidth
                onClick={toggleLogin}
              >
                Already have an account?
              </SecondaryButton>
            </form>
          </>
        )}
      </StyledPaper>
    </StyledContainer>
  );
};

export default Login;