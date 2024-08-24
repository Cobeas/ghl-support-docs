"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@mui/material/Button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";

const Navbar = () => {
    const pathName = usePathname();
    const user = useCurrentUser();

    const handleLogout = async () => {
        await logout();
    }

    return (
        <nav style={{display: "flex", justifyContent: "space-between"}}>
            <div>
            <Button variant="contained" color={pathName === "/" ? "primary" : "secondary"} sx={{margin: 2}}>
                <Link style={{color: "white", textDecoration: "none", fontWeight: "bold" }} href="/">Home</Link>
            </Button>
            <Button variant="contained" color={pathName === "/settings" ? "primary" : "secondary"} sx={{margin: 2}}>
                <Link style={{color: "white", textDecoration: "none", fontWeight: "bold" }} href={user ? "/settings" : "/auth/login"}>{user ? "Settings" : "Login"}</Link>
            </Button>
            {user?.role === "ADMIN" ? 
                <Button variant="contained" color={pathName === "/admin" ? "primary" : "secondary"} sx={{margin: 2}}>
                    <Link style={{color: "white", textDecoration: "none", fontWeight: "bold" }} href="/admin">Admin</Link>
                </Button>
            : null}
            </div>
            <div>
            {user ? 
                <Button variant="contained" color="secondary" sx={{margin: 2, marginLeft: "auto"}} onClick={handleLogout}>
                    Logout
                </Button> 
            : null}
            </div>
        </nav>
    );
};

export default Navbar;