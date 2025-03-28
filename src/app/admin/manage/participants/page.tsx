"use client";
import ChevronDownIcon from "@/components/icons/chevron-down-icon";
import ChevronUpIcon from "@/components/icons/chevron-up-icon";
import CloseIcon from "@/components/icons/close-icon";
import DeleteIcon from "@/components/icons/delete-icon";
import AddParticipant from "@/components/manage/add-participant";
import EditParticipant from "@/components/manage/edit-participant";
import DeleteConfirmation from "@/components/shared/delete-confirmation";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type Participant } from "@/db/schema/participants";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import CloseSwipe from "@/components/icons/close-swipe";
import AddButton from "@/components/shared/add-button";
import EditIcon from "@/components/icons/edit-icon";
import { useTranslation } from "react-i18next";
import Link from "next/link";

interface ParticipantCourse {
    participant: Participant;
    course: string;
}

export default function ManageParticipant() {
    const [participants, setParticipants] = useState<ParticipantCourse[]>([]);
    const [error, setError] = useState(""); //eslint-disable-line
    const [isLoading, setIsLoading] = useState(false);
    const [participantToDelete, setParticipantToDelete] =
        useState<Participant | null>(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [participantToEdit, setParticipantToEdit] = useState<Participant>();
    const [refreshParticipants, setRefreshParticipants] = useState(false);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const { t } = useTranslation();
    const swipeHandlers = useSwipeable({
        onSwipedDown: () => {
            handleClosePopup();
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
    });

    useEffect(() => {
        setIsLoading(true);
        fetch("/api/participants")
            .then((res) => res.json())
            .then((data) => {
                const formattedParticipants = data.map(
                    (item: ParticipantCourse) => ({
                        ...item,
                        course: item.course
                            ? item.course.split(":")[1]
                            : "none",
                    })
                );
                setParticipants(formattedParticipants);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Unexpected error occured.");
                setIsLoading(false);
            });
    }, [refreshParticipants]);

    const handleDeleteButtonClick = (participant: Participant) => {
        setParticipantToDelete(participant);
        setShowDeletePopup(true);
    };

    const handleEditButtonClick = (participant: Participant) => {
        setParticipantToEdit(participant);
        setShowEditPopup(true);
    };

    const handleDelete = async () => {
        if (!participantToDelete) return;

        try {
            const response = await fetch("/api/participants/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ participantId: participantToDelete.id }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Failed to delete");

            setRefreshParticipants((prev) => !prev);
        } catch (error) {
            console.error("Failed to delete participant", error);
        } finally {
            setShowDeletePopup(false);
            setParticipantToDelete(null);
        }
    };

    const handleAddButtonClick = () => {
        setShowAddPopup(true);
    };

    const handleClosePopup = () => {
        setShowDeletePopup(false);
        setShowAddPopup(false);
        setParticipantToDelete(null);
        setShowEditPopup(false);
    };

    const handleSortChange = () => {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const filteredParticipants = participants
        .filter((arr) => {
            const fullName =
                `${arr.participant.firstName} ${arr.participant.lastName}`.toLowerCase();
            return fullName.includes(searchQuery.toLowerCase());
        })
        .sort((a, b) => {
            const nameA =
                `${a.participant.firstName} ${a.participant.lastName}`.toLowerCase();
            const nameB =
                `${b.participant.firstName} ${b.participant.lastName}`.toLowerCase();

            if (sortOrder === "asc") {
                return nameA.localeCompare(nameB); // A-Z
            } else {
                return nameB.localeCompare(nameA); // Z-A
            }
        });

    return (
        <div className="flex flex-col gap-6 w-full items-center h-full overflow-hidden">
            <h1 className="font-semibold text-4xl text-center">
                {t("manage")}
            </h1>
            {showEditPopup && participantToEdit && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
                            >
                                {/* Swipe indicator */}
                                <div className="absolute top-6 md:hidden">
                                    <CloseSwipe />
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-3 right-4"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <EditParticipant
                                participantData={participantToEdit}
                                closePopup={handleClosePopup}
                                onParticipantUpdated={() =>
                                    setRefreshParticipants((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}
            {showDeletePopup && participantToDelete && (
                <div className="fixed inset-0 flex items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <DeleteConfirmation
                            title={t("delete participant")}
                            body={t("delete participant confirmation", {
                                firstName: participantToDelete.firstName,
                                lastName: participantToDelete.lastName,
                            })}
                            actionLabel={t("delete")}
                            handleSubmit={handleDelete}
                            closePopup={handleClosePopup}
                        />
                    </div>
                </div>
            )}
            {showAddPopup && (
                <div className="fixed inset-0 flex items-end md:items-center justify-center z-20 overflow-y-auto">
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={handleClosePopup}
                    ></div>
                    <div className="z-30 bg-white rounded-t-lg md:rounded-lg w-full md:mx-8 max-h-[90vh] overflow-hidden">
                        <div className="relative w-full">
                            <div
                                className="flex justify-center items-center p-6 md:hidden "
                                {...swipeHandlers}
                            >
                                {/* Swipe indicator */}
                                <div className="absolute top-6 md:hidden">
                                    <CloseSwipe />
                                </div>
                            </div>
                            <button
                                onClick={handleClosePopup}
                                className="absolute top-3 right-4"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                        <div className="overflow-y-auto max-h-[calc(90vh-90px)]">
                            <AddParticipant
                                closePopup={handleClosePopup}
                                onParticipantAdded={() =>
                                    setRefreshParticipants((prev) => !prev)
                                }
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col w-full h-full gap-4 pb-32">
                <div className="w-full">
                    <h2 className="text-xl md:text-3xl font-semibold">
                        {t("participant", { count: 2 })}
                    </h2>
                    <Input
                        type="text"
                        placeholder={t("search")}
                        className="mt-2 md:mt-4 py-4 md:py-6 w-full"
                        onChange={handleSearchChange}
                    ></Input>
                </div>
                <Table className="relative table-fixed w-full border-collapse">
                    <TableHeader className="sticky top-0 w-full bg-white">
                        <TableRow className="flex gap-2 justify-between w-full text-base md:text-xl font-semibold">
                            <TableHead className="flex items-center w-[300px] min-w-[200px] text-left">
                                {t("participant")}
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
                            <TableHead className="flex items-center w-[250px] min-w-[120px] text-left">
                                {t("course assigned")}
                            </TableHead>
                            <TableHead className="flex justify-center items-center gap-4 w-[200px] min-w-[100px] text-center">
                                <span className="w-1/2">{t("delete")}</span>
                                <span className="w-1/2">{t("edit")}</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading
                            ? [...Array(3)].map((_, index) => (
                                  <TableRow
                                      className="flex justify-between w-full items-center"
                                      key={index}
                                  >
                                      <TableCell className="w-[300px] min-w-[250px] flex items-center gap-4 text-left text-base md:text-lg">
                                          <Skeleton className="hidden md:flex md:w-10 md:h-10 rounded-full" />
                                          <Skeleton className="h-4 w-24 rounded" />
                                      </TableCell>
                                      <TableCell className="w-[200px] min-w-[120px]">
                                          <Skeleton className="h-4 w-40 rounded" />
                                      </TableCell>
                                      <TableCell className="w-[200px] min-w-[100px] flex justify-center items-center">
                                          <Skeleton className="h-6 w-6 rounded" />
                                          <Skeleton className="h-6 w-6 rounded" />
                                      </TableCell>
                                  </TableRow>
                              ))
                            : filteredParticipants.map(
                                  (participantCourse: ParticipantCourse) => {
                                      return (
                                          <TableRow
                                              className="flex gap-2 justify-between w-full items-center"
                                              key={
                                                  participantCourse.participant
                                                      .id
                                              }
                                          >
                                              <TableCell className="w-[300px] min-w-[200px] flex items-center gap-4 text-left text-base md:text-lg">
                                                  <div className="hidden md:flex md:w-10 md:h-10 rounded-full bg-gray-200 items-center justify-center">
                                                      {`${participantCourse.participant.firstName[0]}${participantCourse.participant.lastName[0]}`}
                                                  </div>
                                                  <Link
                                                      href={`/admin/manage/participants/${participantCourse.participant.firstName}-${participantCourse.participant.lastName}`}
                                                      onClick={() =>
                                                          sessionStorage.setItem(
                                                              "participantId",
                                                              participantCourse.participant.id.toString()
                                                          )
                                                      }
                                                  >
                                                      {`${participantCourse.participant.firstName} ${participantCourse.participant.lastName}`}
                                                  </Link>
                                              </TableCell>
                                              <TableCell className="w-[250px] min-w-[120px] text-left text-base md:text-lg">
                                                  {participantCourse.course ??
                                                      "none"}
                                              </TableCell>
                                              <TableCell className="w-[200px] min-w-[100px] flex gap-4 justify-center items-center">
                                                  <button
                                                      onClick={() => {
                                                          handleDeleteButtonClick(
                                                              participantCourse.participant
                                                          );
                                                      }}
                                                      className="w-1/2 flex justify-center"
                                                  >
                                                      <DeleteIcon />
                                                  </button>
                                                  <button
                                                      onClick={() => {
                                                          handleEditButtonClick(
                                                              participantCourse.participant
                                                          );
                                                      }}
                                                      className="w-1/2 flex justify-center"
                                                  >
                                                      <EditIcon />
                                                  </button>
                                              </TableCell>
                                          </TableRow>
                                      );
                                  }
                              )}
                    </TableBody>
                </Table>
            </div>
            <AddButton handleAddButtonClick={handleAddButtonClick} />
        </div>
    );
}
