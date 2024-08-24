"use client";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import styles from "./Page.module.css";
import LoaderComponent from "@/app/components/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { checkPassword } from "@/actions/reset";
import { newPassword } from "@/actions/new-password";
import { logout } from "@/actions/logout";
import SnackbarMessage from "@/app/components/snackbar-message";

const NewPasswordPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState({ error: false, message: "" });
    const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({ password: false, confirmPassword: false });
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const handleLogout = async () => {
        await logout();
    }

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
            const isValid = await checkPassword(password, confirmPassword);

            startTransition(() => {
                if (!isValid) {
                    setPasswordError({ error: true, message: "Invalid password" });
                    return;
                }

                newPassword({ password, confirmPassword }, token)
                    .then((data) => {
                        if (data.error) {
                            setState({ ...state, open: true, message: data.error, type: "error" });
                        }

                        if (data.success) {
                            setState({ ...state, open: true, message: data.success, type: "success" });
                        }
                    })
                    .catch(() => {
                        setState({ ...state, open: true, message: "An error occurred", type: "error" });
                    })
            });

        setTimeout(() => {
            handleLogout();
        }, 2000);
    };

    const handleShowPassword = (field: string) => {
        setShowPassword({ ...showPassword, [field]: !showPassword[field] });
    };

    return (
        <>
            <div className={styles["reset-box"]}>
                <Typography variant="h4" sx={{marginBottom: 2}}>Create a new password</Typography>
                <form className={styles["reset-form"]} noValidate autoComplete="off" onSubmit={handlePasswordReset}>
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword.password ? "text" : "password"}
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
                                        onClick={() => handleShowPassword("password")}
                                        edge="end"
                                    >
                                        {showPassword.password ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        label="Confirm password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type={showPassword.confirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isPending}
                        error={passwordError.error}
                        helperText={passwordError.error ? passwordError.message : ""}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => handleShowPassword("confirmPassword")}
                                        edge="end"
                                    >
                                        {showPassword.confirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {!isPending ? (
                        <>
                        <div className={styles["desktop-info"]}>
                        <Typography variant="body1" sx={{ marginTop: 2 }}>
                            Password must consist of at least:
                        </Typography>
                        <ul>
                            <li>8 characters</li>
                            <li>1 uppercase letter</li>
                            <li>1 lowercase letter</li>
                            <li>1 number</li>
                            <li>1 special character</li>
                        </ul>
                        </div>
                        <div className={styles["mobile-info"]}>
                        <Typography variant="caption" sx={{ marginTop: 2 }}>
                            Password must consist of 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
                        </Typography>
                        </div>
                        </>
                    ) : (<LoaderComponent />)}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 4 }}
                        disabled={isPending}
                    >
                        Reset password
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        onClick={() => router.push("/auth/login")}
                    >
                        Back to login
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
        </>
    );
}

export default NewPasswordPage;