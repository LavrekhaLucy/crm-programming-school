import {type FC, useEffect, useState} from "react";
import type { IOrder} from "../../models/interfaces/IOrders/IOrder";
import {EnumSelect} from "../EnumSelect.tsx";
import {CoursesEnum} from "../../enums/courses.enum.ts";
import {FormatsEnum} from "../../enums/formats.enum.ts";
import {TypesEnum} from "../../enums/types.enum.ts";
import {StatusesEnum} from "../../enums/statuses.enum.ts";
import Input from "../ui/input.tsx";
import Button from "../ui/button.tsx";
import {baseFieldClass} from "../ui/styles.ts";
import type {AppDispatch, RootState} from "../store/store.ts";
import {useDispatch, useSelector} from "react-redux";
import {AddCreateGroup, fetchGroups} from "../../slices/groupSlice.ts";



type EditOrderModalProps = {
    order: IOrder;
    onClose: () => void;
    onSubmit: (order: IOrder) => void;
};

export const EditOrderModal: FC<EditOrderModalProps> = ({
                                                            order,
                                                            onClose,
                                                            onSubmit,
                                                        }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { groups} = useSelector(
        (state: RootState) => state.groupStoreSlice
    );


    const [editedOrder, setEditedOrder] = useState<IOrder>(order);

    const [groupMode, setGroupMode] = useState<"add" | "select">("add");
    const [value, setValue] = useState("");

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);



    const handleAdd = () => {
        if (!value.trim()) return;

        dispatch(AddCreateGroup(value));

        setValue("");
        setGroupMode("select");
    };

    const handleSelect = () => {
        setGroupMode("select");
    }

    const toNumberOrUndefined = (value: string) =>
        value === "" ? undefined : Number(value);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/5  backdrop-opacity-50"></div>

            <div
                className="relative bg-white rounded-lg p-6 w-full max-w-4xl z-10 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit(order);
                    }}
                    className="grid grid-cols-2 gap-4"
                >
                    <div>
                        <label htmlFor="group">Group</label>
                        {groupMode === "add" ? (
                            <Input
                                id="group"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full border px-3 py-2"
                                placeholder="All group"
                            />
                        ):(
                            <select
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className={baseFieldClass}
                            >
                                <option value="">Select group</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.name}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        <div className="flex justify-center gap-2 mt-2">
                            <button type="button" onClick={handleAdd} className="px-21 py-0.5 text-sm bg-[#43a047] text-white rounded-[5px]">
                                Add
                            </button>
                            <button type="button" onClick={handleSelect} className="px-21 py-0.5 text-sm bg-[#43a047] text-white rounded-[5px]">
                                Select
                            </button>


                        </div>
                    </div>

                    <div><label htmlFor="status">Status</label>
                        <EnumSelect
                            id="status"
                            value={editedOrder.status}
                            options={Object.values(StatusesEnum)}
                            placeholder="All statuses"
                            onChange={(status) =>
                                setEditedOrder(prev => ({...prev, status}))
                            }
                        /></div>

                    <div><label htmlFor="name">Name</label>
                        <Input
                            id="name"
                            value={editedOrder.name ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Name"
                        /></div>

                    <div><label htmlFor="sum">Sum</label>
                        <Input
                            id="sum"
                            value={editedOrder.sum ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    sum: toNumberOrUndefined(e.target.value),
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Sum"
                        /></div>

                    <div><label htmlFor="surname">Surname</label>
                        <Input
                            id="surname"
                            value={editedOrder.surname ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    surname: e.target.value,
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Surname"
                        /></div>

                    <div><label htmlFor="alreadyPaid">Already paid</label>
                        <Input
                            id="alreadyPaid"
                            value={editedOrder.alreadyPaid ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    alreadyPaid: Number(e.target.value) || 0,
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Already Paid"
                        /></div>

                    <div><label htmlFor="email">Email</label>
                        <Input
                            id="email"
                            value={editedOrder.email ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Email"
                        /></div>

                    <div><label htmlFor="course">Course</label>
                        <EnumSelect
                            id="course"
                            value={editedOrder.course}
                            options={Object.values(CoursesEnum)}
                            placeholder="All course"
                            onChange={(course) =>
                                setEditedOrder(prev => ({...prev, course}))
                            }
                        /></div>

                    <div><label htmlFor="phone">Phone</label>
                        <Input
                            id="phone"
                            value={editedOrder.phone ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Phone"
                        /></div>

                    <div><label htmlFor="course">Course format</label>
                        <EnumSelect
                            id="course_format"
                            value={editedOrder.course_format}
                            options={Object.values(FormatsEnum)}
                            placeholder="All format"
                            onChange={(course_format) =>
                                setEditedOrder(prev => ({...prev, course_format}))
                            }
                        /></div>

                    <div><label htmlFor="age">Age</label>
                        <Input
                            id="age"
                            value={editedOrder.age ?? ""}
                            onChange={(e) =>
                                setEditedOrder(prev => ({
                                    ...prev,
                                    age: toNumberOrUndefined(e.target.value),
                                }))
                            }
                            className="w-full border px-3 py-2"
                            placeholder="Age"
                        /></div>

                    <div><label htmlFor="course_type">Course type</label>
                        <EnumSelect
                            id="course_type"
                            value={editedOrder.course_type}
                            options={Object.values(TypesEnum)}
                            placeholder="All type"
                            onChange={(course_type) =>
                                setEditedOrder(prev => ({...prev, course_type}))
                            }
                        /></div>

                    <div> </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border"
                        >
                            Close
                        </Button>

                        <Button
                            type="submit"
                            className="px-4 py-2 border"
                        >
                            Submit
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    );
};
