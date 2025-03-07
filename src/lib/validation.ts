import { type Session } from "next-auth";

//Returns true when user is admin or staff
export const validateAdminOrStaff = (session: Session | null) => {
    if (!session) {
        return false;
    }

    if (!validateAdmin(session) && session.user.role !== "Staff") {
        return false;
    }

    return true;
};

//Returns true when user is admin
export const validateAdmin = (session: Session | null) => {
    if (!session) {
        return false;
    }

    if (session.user.role !== "Admin") {
        return false;
    }

    return true;
};

//Returns true when user is participant
export const validateParticipant = (session: Session | null) => {
    if (!session) {
        return false;
    }

    if (session.user.role !== "Participant") {
        return false;
    }

    return true;
};
