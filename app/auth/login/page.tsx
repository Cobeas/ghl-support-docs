"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import styles from "./Page.module.css";
import { login } from "@/actions/login";
import SnackbarMessage from "@/app/components/snackbar-message";

interface Error {
    error: boolean;
    message: string;
}

interface TwoFaToken {
    [key: number]: string | undefined;
}

const LoginPage = () => {
    const router = useRouter();
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [isPending, startTransition] = useTransition();
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [twoFaToken, setTwoFaToken] = useState<TwoFaToken>({0: undefined, 1: undefined, 2: undefined, 3: undefined, 4: undefined, 5: undefined });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<Error>({ error: false, message: "" });
    const [passwordError, setPasswordError] = useState<Error>({ error: false, message: "" });
    const [twoFaError, setTwoFaError] = useState<Error>({ error: false, message: "" });
    const [showTwoFa, setShowTwoFa] = useState<boolean>(false);
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {

            const response = await login({ email: username, password });

            if (response && response.error) {
                setState({ ...state, open: true, message: response.error, type: "error" });
                setUsername("");
                setPassword("");
            }

            if (response && response.success) {
                setState({ ...state, open: true, message: response.success, type: "success" });
                setUsername("");
                setPassword("");
            }

            if (response && response.twoFactor) {
                setShowTwoFa(true);
            }

            if (response && response === undefined) {
                setState({ ...state, open: true, message: "An unknown error occurred", type: "error" });
                setUsername("");
                setPassword("");
            }
        });
    };

    const handleTwoFaLogin = async () => {
        const token = Object.values(twoFaToken).join("");

        if (token.length !== 6) {
            setTwoFaError({ error: true, message: "Token must be 6 digits" });
            return;
        }

        setTwoFaError({ error: false, message: "" });

        startTransition(async () => {
            const response = await login({ email: username, password, code: token });

            if (response && response.error) {
                setState({ ...state, open: true, message: response.error, type: "error" });
                setUsername("");
                setPassword("");
            }

            if (response && response.success) {
                setState({ ...state, open: true, message: response.success, type: "success" });
                setUsername("");
                setPassword("");
            }

            if (response && response.twoFactor) {
                setShowTwoFa(true);
            }

            if (response && response === undefined) {
                setState({ ...state, open: true, message: "An unknown error occurred", type: "error" });
                setUsername("");
                setPassword("");
            }
        });
    }

    const handleInputChange = (index: number, value: string) => {
        // Stel hier je state in met de juiste waarde
        setTwoFaToken((prev) => ({
            ...prev,
            [index]: value,
        }));

        // Verplaats de focus naar het volgende inputveld
        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && inputRefs.current[index]) {
            if (twoFaToken[index + 1] === '') {
                if (inputRefs.current[index - 1]) {
                    setTwoFaToken((prev) => ({
                        ...prev,
                        [index]: '',
                        [index - 1]: '',
                    }));
                    inputRefs.current[index - 1]?.focus();
                }
            } else {
                setTwoFaToken((prev) => ({
                    ...prev,
                    [index + 1]: '',
                }));
            }
        }
    };

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (Object.values(twoFaToken).every((value) => value !== undefined)) {
            handleTwoFaLogin();
        }
    }, [twoFaToken]);

    return (
        <div className={styles["login-container"]}>
            <div className={styles["login-header"]}>
                <h1>Login Header</h1>
            </div>
            <div className={styles["login-box"]}>
                <Typography variant="h4">Login</Typography>
                <form className={styles["login-form"]} noValidate autoComplete="off" onSubmit={handleLogin}>
                    {showTwoFa ?
                    <>
                    <Typography variant="body1" sx={{mt: 2}}>Enter your 2FA token</Typography>
                    <div className="twofa-container">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <input
                                key={index}
                                type="number"
                                min="0"
                                max="9"
                                ref={(el) => { inputRefs.current[index] = el;}}
                                value={twoFaToken[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                autoFocus={index === 0}
                            />
                        ))}
                    </div>
                    </>
                    : null}
                    {!showTwoFa ?
                    <>
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
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
                        variant="text"
                        size="small"
                        color="primary"
                        onClick={() => router.push("/auth/reset")}
                        sx={{ margin: '0 0 0 auto' }}
                        disabled={isPending}
                    >
                        Forgot Password?
                    </Button>
                    </>
                    : null}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 4 }}
                        disabled={isPending}
                    >
                        {showTwoFa ? "Confirm" : "Login"}
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                        disabled={isPending}
                        onClick={() => router.push("/auth/register")}
                    >
                        Don't have an account? Register
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

export default LoginPage;