"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import { Pen, PlusIcon } from "lucide-react";
import DeleteIcon from "@/components/icons/delete-icon";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import AddAdmin from "@/components/manage/add-admin";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { type User } from "@/db/schema/users";
import EditAdmin from "@/components/manage/edit-admin";
import CloseIcon from "@/components/icons/close-icon";
import { useSwipeable } from "react-swipeable";
import CloseSwipe from "@/components/icons/close-swipe";

export default function ManageStaff() {
    const [admins, setAdmins] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState<User | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [adminToEdit, setAdminToEdit] = useState<User | null>(null);
    const [refreshAdmins, setRefreshAdmins] = useState(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [roleSort, setRoleSort] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");

    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/admin")
            .then((res) => res.json())
            .then((data) => {
                setAdmins(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Unexpected error occured.");
                setIsLoading(false);
            });
    }, [refreshAdmins]);

    const handleDeleteButtonClick = (participant: User) => {
        setAdminToDelete(participant);
        setShowDeletePopup(true);
    };

    const handleEditButtonClick = (admin: User) => {
        setAdminToEdit(admin);
        setShowEditPopup(true);
    };

    const handleDelete = async () => {
        if (!adminToDelete) return;

        try {
            const res = await fetch("/api/admin/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: adminToDelete.id }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

            setRefreshAdmins((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
            setAdminToDelete(null);
        }
    };

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowAddPopup(false);
        setShowEditPopup(false);
        setAdminToDelete(null);
        setAdminToEdit(null);
    };

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleRoleSort = () => {
        setRoleSort((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredAdmins = admins
        .filter((admin) => {
            const fullName =
                `${admin.firstName} ${admin.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB); // A-Z
            } else {
                return nameB.localeCompare(nameA); // Z-A
            }
        })
        .sort((a, b) => {
            if (roleSort) {
                const roleA = a.role === "Admin" ? 0 : 1; // Admin - Staff
                const roleB = b.role === "Admin" ? 0 : 1; // Staff - Admin
                return roleSort === "asc" ? roleA - roleB : roleB - roleA;
            }
            return 0;
        });

    return (
        <div>
            <div className="flex flex-col gap-10 w-full items-center h-full">
                <h1 className="font-semibold text-4xl text-center">Manage</h1>
                {showEditPopup && adminToEdit && (
                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <div className="relative w-full">
                                <div className="flex justify-center items-center relative p-6">
                                    {/* Swipe indicator */}
                                    <div
                                        className="absolute top-6 md:hidden"
                                        {...swipeHandlers}
                                    >
                                        <CloseSwipe />
                                    </div>
                                    <button
                                        onClick={handleClosePopup}
                                        className="absolute top-3 right-4"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                <EditAdmin
                                    closePopup={handleClosePopup}
                                    adminData={adminToEdit}
                                    onAdminUpdated={() =>
                                        setRefreshAdmins((prev) => !prev)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                {/* Delete Confirmation Popup */}
                {showDeletePopup && adminToDelete && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <DeleteConfirmation
                                title="Before you delete!"
                                body={`Are you sure you want to delete ${adminToDelete.firstName}? You cannot undo this action.`}
                                actionLabel="DELETE"
                                handleSubmit={handleDelete}
                                closePopup={handleClosePopup}
                            />
                        </div>
                    </div>
                )}
                {showAddPopup && (
                    <div className="fixed inset-0 flex items-end md:items-center justify-center z-10 overflow-y-auto">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={handleClosePopup}
                        ></div>
                        <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                            <div className="relative w-full">
                                <div className="flex justify-center items-center relative p-6">
                                    {/* Swipe indicator */}
                                    <div
                                        className="absolute top-6 md:hidden"
                                        {...swipeHandlers}
                                    >
                                        <CloseSwipe />
                                    </div>
                                    <button
                                        onClick={handleClosePopup}
                                        className="absolute top-3 right-4"
                                    >
                                        <CloseIcon />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                                <AddAdmin
                                    closePopup={handleClosePopup}
                                    onAdminAdded={() =>
                                        setRefreshAdmins((prev) => !prev)
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
                <Card className="flex flex-col h-full">
                    <CardHeader className="w-full">
                        <h2 className="text-xl md:text-3xl font-semibold">
                            Staff
                        </h2>
                        <div className="flex gap-2 md:gap-4 items-center">
                            <Input
                                type="text"
                                placeholder="Search"
                                className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                                onChange={handleSearchChange}
                            ></Input>
                            <button
                                className="mt-2 md:mt-4 flex flex-col min-w-8 min-h-8 md:min-h-12 md:min-w-12 border-2 md:border-[3px] border-primary-green text-primary-green rounded-full justify-center items-center"
                                onClick={handleAddButtonClick}
                            >
                                <PlusIcon className="w-3/5 h-3/5" />
                            </button>
                        </div>
                    </CardHeader>
                    <CardContent className="w-full flex-grow overflow-auto">
                        <Table className="table-fixed w-full border-collapse">
                            <TableHeader>
                                <TableRow className="flex w-full text-base md:text-xl font-semibold">
                                    <TableHead className="w-[250px] min-w-[200px] text-left">
                                        Staff
                                        <button
                                            onClick={handleSortChange}
                                            className="ml-2"
                                        >
                                            {sortOrder === "asc" ? (
                                                <ChevronDownIcon className="text-primary-green" />
                                            ) : (
                                                <ChevronUpIcon className="text-primary-green" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="w-[150px] min-w-[120px] text-left">
                                        Role
                                        <button
                                            onClick={handleRoleSort}
                                            className="ml-2"
                                        >
                                            {roleSort === "asc" ? (
                                                <ChevronDownIcon className="text-primary-green" />
                                            ) : (
                                                <ChevronUpIcon className="text-primary-green" />
                                            )}
                                        </button>
                                    </TableHead>
                                    <TableHead className="flex-1"></TableHead>
                                    <TableHead className="w-[100px] min-w-[80px] text-center">
                                        Delete
                                    </TableHead>
                                    <TableHead className="w-[100px] min-w-[80px] text-center">
                                        Edit
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading
                                    ? [...Array(3)].map((_, index) => (
                                          <TableRow
                                              className="flex w-full items-center"
                                              key={index}
                                          >
                                              <TableCell className="w-[250px] min-w-[200px] flex items-center gap-4 text-left text-base md:text-lg">
                                                  <Skeleton className="hidden md:flex md:w-10 md:h-10 rounded-full" />
                                                  <Skeleton className="h-4 w-24 rounded" />
                                              </TableCell>
                                              <TableCell className="w-[150px] min-w-[120px]">
                                                  <Skeleton className="h-4 w-40 rounded" />
                                              </TableCell>
                                              <TableCell className="flex-1"></TableCell>
                                              <TableCell className="w-[100px] min-w-[80px] flex justify-center items-center">
                                                  <Skeleton className="h-6 w-6 rounded" />
                                              </TableCell>
                                              <TableCell className="w-[100px] min-w-[80px] flex justify-center items-center">
                                                  <Skeleton className="h-6 w-6 rounded" />
                                              </TableCell>
                                          </TableRow>
                                      ))
                                    : filteredAdmins.map((admin: User) => (
                                          <TableRow
                                              className="flex w-full items-center"
                                              key={admin.id}
                                          >
                                              <TableCell className="w-[250px] min-w-[200px] flex items-center gap-4 text-left text-base md:text-lg">
                                                  <div className="hidden md:flex md:w-10 md:h-10 rounded-full bg-gray-200 items-center justify-center">
                                                      {`${admin.firstName[0]}${admin.lastName[0]}`}
                                                  </div>
                                                  {`${admin.firstName} ${admin.lastName}`}
                                              </TableCell>
                                              <TableCell className="w-[150px] min-w-[120px] text-left text-base md:text-lg">
                                                  {admin.role}
                                              </TableCell>
                                              <TableCell className="flex-1"></TableCell>
                                              <TableCell className="w-[100px] min-w-[80px] flex justify-center items-center">
                                                  <button
                                                      onClick={() =>
                                                          handleDeleteButtonClick(
                                                              admin
                                                          )
                                                      }
                                                  >
                                                      <DeleteIcon className="inline-flex text-center" />
                                                  </button>
                                              </TableCell>
                                              <TableCell className="w-[100px] min-w-[80px] flex justify-center items-center">
                                                  <button
                                                      onClick={() =>
                                                          handleEditButtonClick(
                                                              admin
                                                          )
                                                      }
                                                  >
                                                      <Pen className="inline-flex text-center" />
                                                  </button>
                                              </TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
