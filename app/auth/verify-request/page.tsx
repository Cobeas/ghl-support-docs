"use client";

import Typography from "@mui/material/Typography";
import styles from "./Page.module.css";

const VerifyRequestPage = () => {

    return (
        <>
            <div className={styles["verification-box"]}>
                <Typography variant="h4" sx={{marginBottom: 2}}>
                    Check your email
                </Typography>
                <Typography variant="body1" sx={{marginBottom: 2}}>
                    A sign in link has been sent to your email address.
                </Typography>
            </div>
        </>
    );
}

export default VerifyRequestPage;    