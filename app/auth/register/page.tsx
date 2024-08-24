"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import styles from "./Page.module.css";
import { register, validate } from "@/actions/login";
import SnackbarMessage from "@/app/components/snackbar-message";

interface Error {
    error: boolean;
    message: string;
}

const RegisterPage = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState<Error>({ error: false, message: "" });
    const [passwordError, setPasswordError] = useState<Error>({ error: false, message: "" });
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {

            const isUsernameValid = await validate(email, "email");
            const isPasswordValid = await validate(password, "password");

            setEmailError({ error: !isUsernameValid, message: isUsernameValid ? "" : "Invalid email" });
            setPasswordError({ error: !isPasswordValid, message: isPasswordValid ? "" : "Invalid password" });

            if (isUsernameValid && isPasswordValid) {
                const response = await register({ email, password });

                if (response.error) {
                    setState({ ...state, open: true, message: response.error, type: "error" });
                }
    
                if (response.success) {
                    setState({ ...state, open: true, message: response.success, type: "success" });
                }
            }
        });
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={styles["register-container"]}>
            <div className={styles["register-header"]}>
                <h1>Register Header</h1>
            </div>
            <div className={styles["register-box"]}>
                <Typography variant="h4">Register</Typography>
                <form className={styles["register-form"]} noValidate autoComplete="off" onSubmit={handleRegister}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isPending}
                        error={emailError.error}
                        helperText={emailError.error ? emailError.message : ""}
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isPending}
                        error={passwordError.error}
                        helperText={passwordError.error ? passwordError.message : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 4 }}
                        disabled={isPending}
                    >
                        Create account
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        disabled={isPending}
                        onClick={() => router.push("/auth/login")}
                    >
                        Already have an account? Login
                    </Button>
                </form>
            </div>
            <SnackbarMessage 
                open={state.open} 
                message={state.message || ""} 
                vertical={state.vertical} 
                horizontal={state.horizontal} 
                type={state.type || "success"} 
                onClose={() => setState({ ...state, open: false })} 
            />
        </div>
    );
};

export default RegisterPage;