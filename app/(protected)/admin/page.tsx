"use client";

import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { RoleGate } from "@/app/components/auth/role-gate";
import Button from "@mui/material/Button";
import { admin } from "@/actions/adminactions";
import SnackbarMessage from "@/app/components/snackbar-message";

const AdminPage = () => {
    const user = useCurrentUser();
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});

    const onApiRouteClick = () => {
        fetch("/api/admin/settings", {
            method: "GET",
        })
        .then(response => {
            if (response.ok) {
                console.log("Success");
                setState({ ...state, open: true, message: "Success", type: "success" });
            } else {
                console.log("Forbidden");
                setState({ ...state, open: true, message: "Forbidden", type: "error" });
            }
        })
    }

    const onServerActionClick = () => {
        admin()
            .then((data) => {
                if(data.success) {
                    console.log("Success");
                    setState({ ...state, open: true, message: "Success server action", type: "success" });
                } else {
                    console.log("Error");
                    setState({ ...state, open: true, message: "Forbidden server action", type: "error" });
                }
            })
    }

    return (
        <>
        <RoleGate allowedRole="ADMIN">
            <Button variant="contained" color="primary" onClick={onApiRouteClick}>
                Call API Route
            </Button>
            <Button variant="contained" color="primary" onClick={onServerActionClick}>
                Call Server Action
            </Button>
            <SnackbarMessage 
                open={state.open} 
                message={state.message || ""} 
                vertical={state.vertical} 
                horizontal={state.horizontal} 
                type={state.type || "success"} 
                onClose={() => setState({ ...state, open: false })} 
            />
        </RoleGate>
        </>
    );
};

export default AdminPage;