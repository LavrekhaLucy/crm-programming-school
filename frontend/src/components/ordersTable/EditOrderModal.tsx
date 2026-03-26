import {type FC, useState} from "react";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder";
import {EnumSelect} from "../EnumSelect.tsx";
import {CoursesEnum} from "../../enums/courses.enum.ts";
import {FormatsEnum} from "../../enums/formats.enum.ts";
import {TypesEnum} from "../../enums/types.enum.ts";
import {StatusesEnum} from "../../enums/statuses.enum.ts";
import Input from "../ui/input.tsx";
import Button from "../ui/button.tsx";
import {baseFieldClass} from "../ui/styles.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {groupActions} from "../../slices/groupSlice.ts";
import type {IUpdateOrder} from "../../models/interfaces/IOrders/IUpdateOrder.ts";
import {mapOrderToUpdate} from "../../utils/orderUtils.ts";
import type {IGroup} from "../../models/interfaces/IGroup/IGroup.ts";
import {editOrderSchema} from "../../common/order.validator.ts";


type EditOrderModalProps = {
    order: IOrder;
    onClose: () => void;
    onSubmit: (order: IUpdateOrder) => void;
};

export const EditOrderModal: FC<EditOrderModalProps> = ({
                                                            order,
                                                            onClose,
                                                            onSubmit,
                                                        }) => {
    const dispatch = useAppDispatch();

    const { groups} = useAppSelector((state) => state.groupStoreSlice);


    const [editedOrder, setEditedOrder] = useState<IUpdateOrder>(
        mapOrderToUpdate(order)
    );
    const [errors, setErrors] = useState<Record<string, string>>({});


    const [groupMode, setGroupMode] = useState<"add" | "select">("add");
    const [value, setValue] = useState("");
    const getGroupId = (group: number | IGroup | undefined): string | number => {
        if (!group) return "";
        return typeof group === 'object' ? group.id : group;
    };

    const handleAdd = async () => {
        if (groupMode === "select") {
            setGroupMode("add");
            return;
        }

        if (!value.trim()) return;

        const newGroup = await dispatch(
            groupActions.AddCreateGroup(value)
        ).unwrap();

        await dispatch(groupActions.fetchGroups());

        setEditedOrder(prev => ({
            ...prev,
            group: newGroup
        }));

        setGroupMode("select");
        setValue("");
    };

    const handleSelect = () => {
        setGroupMode("select");
    }

    const toNumberOrUndefined = (value: string) =>
        value === "" ? undefined : Number(value);

    const validateOrder = (): boolean => {

        const { error } = editOrderSchema.validate(editedOrder, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const newErrors: Record<string, string> = {};
            for (const detail of error.details) {
                const fieldName = detail.path[0] as string;
                if (fieldName) {
                    newErrors[fieldName] = detail.message;
                }
            }
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };


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

                        if(validateOrder()) {
                            const payload: IUpdateOrder = { ...editedOrder };
                            onSubmit(payload);
                        }
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
                                    value={getGroupId(editedOrder.group)}
                                    onChange={(e) => {
                                        const groupId = Number(e.target.value) || undefined;
                                        setEditedOrder(prev => ({
                                            ...prev,
                                            group: groupId
                                        }));
                                    }}
                                    className={baseFieldClass}
                                >
                                <option value="">Select group</option>
                                {groups.map(group => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {errors.group && <span className="text-red-500 text-xs">{errors.group}</span>}

                        <div className="flex justify-center gap-2 mt-2">

                            <button
                                type="button"
                                onClick={handleAdd}
                                className={`px-21 py-0.5 text-sm rounded-[5px] text-white ${groupMode === 'add' ? 'bg-[#2e7d32] shadow-inner' : 'bg-[#43a047]'}`}
                            > Add
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
                        />
                        {errors.status && <span className="text-red-500 text-xs">{errors.status}</span>}
                    </div>

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
                        />
                        {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                    </div>

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
                        />
                        {errors.sum && <span className="text-red-500 text-xs">{errors.sum}</span>}
                    </div>

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
                        />
                        {errors.surname && <span className="text-red-500 text-xs">{errors.surname}</span>}
                    </div>

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
                        />
                        {errors.alreadyPaid && <span className="text-red-500 text-xs">{errors.alreadyPaid}</span>}
                    </div>

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
                        />
                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                    </div>

                    <div><label htmlFor="course">Course</label>
                        <EnumSelect
                            id="course"
                            value={editedOrder.course}
                            options={Object.values(CoursesEnum)}
                            placeholder="All course"
                            onChange={(course) =>
                                setEditedOrder(prev => ({...prev, course}))
                            }
                        />
                        {errors.course && <span className="text-red-500 text-xs">{errors.course}</span>}
                    </div>

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
                        />
                        {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                    </div>

                    <div><label htmlFor="course">Course format</label>
                        <EnumSelect
                            id="course_format"
                            value={editedOrder.course_format}
                            options={Object.values(FormatsEnum)}
                            placeholder="All format"
                            onChange={(course_format) =>
                                setEditedOrder(prev => ({...prev, course_format}))
                            }
                        />
                        {errors.course_format && <span className="text-red-500 text-xs">{errors.course_format}</span>}
                    </div>

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
                        />
                        {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
                    </div>

                    <div><label htmlFor="course_type">Course type</label>
                        <EnumSelect
                            id="course_type"
                            value={editedOrder.course_type}
                            options={Object.values(TypesEnum)}
                            placeholder="All type"
                            onChange={(course_type) =>
                                setEditedOrder(prev => ({...prev, course_type}))
                            }
                        />
                        {errors.course_type && <span className="text-red-500 text-xs">{errors.course_type}</span>}
                    </div>

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
