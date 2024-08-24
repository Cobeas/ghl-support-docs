"use client";

import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

interface SnackbarProps extends SnackbarOrigin {
    open: boolean;
    message: string;
    vertical: "top" | "bottom";
    horizontal: "left" | "center" | "right";
    type: "success" | "error" | "warning" | "info";
    onClose?: () => void;
}

const SnackbarMessage = ({open, message, vertical, horizontal, type, onClose}: SnackbarProps) => {

    const messageStyle = () => {
        switch (type) {
            case "success":
                return { bgcolor: "#43a047" };
            case "error":
                return { bgcolor: "#d32f2f" };
            case "warning":
                return { bgcolor: "#ffa000" };
            case "info":
                return { bgcolor: "#1976d2" };
            default:
                return { bgcolor: "#1976d2" };
        }
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            message={message}
            key={vertical + horizontal}
            action={
                <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                    X
                </IconButton>
            }
            ContentProps={{
                sx: messageStyle()
            }}
        />
    );
}

export default SnackbarMessage;