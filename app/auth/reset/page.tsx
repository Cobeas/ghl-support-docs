"use client";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import styles from "./Page.module.css";
import LoaderComponent from "@/app/components/loader";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { validate } from "@/actions/login";
import { reset } from "@/actions/reset";
import SnackbarMessage from "@/app/components/snackbar-message";

const ResetPasswordPage = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState({ error: false, message: "" });
    const [isPending, startTransition] = useTransition();
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(async () => {
            const isUsernameValid = await validate(email, "email");

            setEmailError({ error: !isUsernameValid, message: isUsernameValid ? "" : "Invalid email" });

            if (isUsernameValid) {
                const response = await reset({ email });

                if (response && response.error) {
                    setState({ ...state, open: true, message: response.error, type: "error" });
                }

                if (response && response.success) {
                    setState({ ...state, open: true, message: response.success, type: "success" });
                }
            }
        });
    };

    return (
        <>
            <div className={styles["reset-box"]}>
                <Typography variant="h4" sx={{marginBottom: 2}}>Request a new password</Typography>
                <form className={styles["reset-form"]} noValidate autoComplete="off" onSubmit={handlePasswordReset}>
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
                    {isPending ? <LoaderComponent /> : null}
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

export default ResetPasswordPage;    