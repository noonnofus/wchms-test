import { type Session } from "next-auth";

export const validateAdminOrStaff = (session: Session | null) => {
    if (!session) {
        return false;
    }

    if (session.user.role !== "Admin" && session.user.role !== "Staff") {
        return false;
    }

    return true;
};
