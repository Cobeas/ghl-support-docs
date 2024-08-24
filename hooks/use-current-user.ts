// Use for client-side code
import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const session = useSession();

    return session?.data?.user;
}