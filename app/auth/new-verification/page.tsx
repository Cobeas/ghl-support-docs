"use client";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import styles from "./Page.module.css";
import LoaderComponent from "@/app/components/loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import SnackbarMessage from "@/app/components/snackbar-message";

const NewVerificationPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        setLoading(true);
        
        if (!token) {
            setState({ ...state, open: true, message: "Token is missing", type: "error" });
            setLoading(false);
            return;
        };

        newVerification(token)
            .then((data) => {
                if (data.error) {
                    setState({ ...state, open: true, message: data.error, type: "error" });
                }

                if (data.success) {
                    setState({ ...state, open: true, message: data.success, type: "success" });
                }

                setState({ ...state, open: true, message: "Success", type: "error" });
            })
            .catch(() => {
                setState({ ...state, open: true, message: "An error occurred", type: "error" });
            })

        setLoading(false);
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <>
            <div className={styles["verification-box"]}>
                <Typography variant="h4" sx={{marginBottom: 2}}>Verifying your email</Typography>
                <form className={styles["verification-form"]} noValidate autoComplete="off">  
                    {loading ? (
                        <LoaderComponent />
                    ) : null}
                    <Button
                        variant="text"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 4 }}
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

export default NewVerificationPage;    