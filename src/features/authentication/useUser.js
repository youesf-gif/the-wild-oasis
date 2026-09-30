import { useQuery } from "@tanstack/react-query";
import { getCurrnetUser } from "../../services/apiAuth";

export function useUser() {
    const {
        isPending,
        data: user,
        error,
    } = useQuery({
        queryKey: ["user"],
        queryFn: getCurrnetUser,
    });

    return {
        isPending,
        user,
        isAuthenticated: user?.role === "authenticated",
    };
}
