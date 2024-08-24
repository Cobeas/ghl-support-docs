"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import { useCurrentUser } from "@/hooks/use-current-user";
import { settings } from "@/actions/settings";
import { useSession } from "next-auth/react";
import SnackbarMessage from "@/app/components/snackbar-message";
import { appSettings } from "@/app-settings";

interface UserDetails {
    name: string;
    email: string;
    id: string;
    role: string;
    isTwoFa: boolean;
    password?: string;
    newPassword?: string;
}

const SettingsPage = () => {
    const user = useCurrentUser();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const { update } = useSession();
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: "",
        email: "",
        id: "",
        role: "",
        isTwoFa: false,
    });
    const [state, setState] = useState<any>({open: false, vertical: 'top', horizontal: 'center', message: "", type: "success"});


    const handleSave = () => {
        startTransition(() => {
            settings({
                name: userDetails.name,
                email: userDetails.email,
                istwofa: userDetails.isTwoFa,
                password: userDetails.password,
                newPassword: userDetails.newPassword,
            }).then((data) => {
                if (data.error) {
                    setState({ ...state, open: true, message: data.error, type: "error" });
                    return;
                }

                if (data.success) {
                    setState({ ...state, open: true, message: data.success, type: "success" });
                }
                update();
            }).catch((error) => {
                setState({ ...state, open: true, message: error.message, type: "error" });
            })
        });
    }

    useEffect(() => {
        console.log(user);
        setUserDetails({
            name: user?.name || "",
            email: user?.email || "",
            id: user?.id || "",
            role: user?.role || "",
            isTwoFa: user?.isTwoFa || false,
        });
    }, [user]);

    useEffect(() => {
        router.replace(pathname);
    }, []);

    return (
        <>
        <Grid container spacing={2} sx={{maxWidth: "600px", ml: 2}}>
            <Grid item xs={7}>
                Name
            </Grid>
            <Grid item xs={5}>
                <TextField
                    id="name"
                    label="Name"
                    value={userDetails?.name}
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                />
            </Grid>
            <Grid item xs={7}>
                Email
            </Grid>
            <Grid item xs={5}>
                <TextField
                    id="email"
                    label="Email"
                    value={userDetails?.email}
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                />
            </Grid>
            <Grid item xs={7}>
                Password
            </Grid>
            <Grid item xs={5}>
                <TextField
                    id="password"
                    label="Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setUserDetails({...userDetails, password: e.target.value})}
                />
            </Grid>
            <Grid item xs={7}>
                New Password
            </Grid>
            <Grid item xs={5}>
                <TextField
                    id="newPassword"
                    label="New Password"
                    variant="outlined"
                    size="small"
                    fullWidth
                    onChange={(e) => setUserDetails({...userDetails, newPassword: e.target.value})}
                />
            </Grid>
            <Grid item xs={7}>
                ID
            </Grid>
            <Grid item xs={5}>
                {user?.id}
            </Grid>
            <Grid item xs={7}>
                Role
            </Grid>
            <Grid item xs={5}>
                {user?.role}
            </Grid>
            {appSettings.authentication.useTwoFa ?
            <>
            <Grid item xs={7}>
                Use Two Factor Authentication
            </Grid>
            <Grid item xs={5}>
                <Switch
                    checked={userDetails?.isTwoFa}
                    onChange={() => setUserDetails({...userDetails, isTwoFa: !userDetails.isTwoFa})}
                    inputProps={{ 'aria-label': 'controlled' }}
                />
            </Grid>
            </> : null}
        </Grid>
        <form>
            <Button variant="contained" color="primary" sx={{margin: 2}} onClick={handleSave} disabled={isPending}>
                Save
            </Button>
        </form>
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
};

export default SettingsPage;