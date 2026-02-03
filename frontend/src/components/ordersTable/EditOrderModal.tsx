import {type FC, useState} from "react";
import type { IOrder } from "../../models/interfaces/IOrders/IOrder";
import {EnumSelect} from "../EnumSelect.tsx";
import {CoursesEnum} from "../../enums/courses.enum.ts";
import {FormatsEnum} from "../../enums/formats.enum.ts";
import {TypesEnum} from "../../enums/types.enum.ts";
import {StatusesEnum} from "../../enums/statuses.enum.ts";
import Input from "../ui/input.tsx";

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
    const [editedOrder, setEditedOrder] = useState<IOrder>(order);

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
                    className="space-y-3"
                >

                    <Input
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


                    <Input
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

                    <Input
                        value={editedOrder.email?? ""}
                        onChange={(e) =>
                            setEditedOrder(prev => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Email"
                    />

                    <Input
                        value={editedOrder.phone?? ""}
                        onChange={(e) =>
                            setEditedOrder(prev => ({
                                ...prev,
                                phone: e.target.value,
                            }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Phone"
                    />

                    <Input
                        value={editedOrder.age?? ""}
                        onChange={(e) =>
                            setEditedOrder(prev => ({
                                ...prev,
                                age:toNumberOrUndefined (e.target.value),
                            }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Age"
                    />

                    <EnumSelect
                        value={editedOrder.course}
                        options={Object.values(CoursesEnum)}
                        placeholder="Select course"
                        onChange={(course) =>
                            setEditedOrder(prev => ({ ...prev, course }))
                        }
                    />


                    <EnumSelect
                        value={editedOrder.course_format}
                        options={Object.values(FormatsEnum)}
                        placeholder="Select format"
                        onChange={(course_format) =>
                            setEditedOrder(prev => ({ ...prev, course_format }))
                        }
                    />

                    <EnumSelect
                        value={editedOrder.course_type}
                        options={Object.values(TypesEnum)}
                        placeholder="Select type"
                        onChange={(course_type) =>
                            setEditedOrder(prev => ({ ...prev, course_type }))
                        }
                    />

                    <EnumSelect
                        value={editedOrder.status}
                        options={Object.values(StatusesEnum)}
                        placeholder="Select type"
                        onChange={(status) =>
                            setEditedOrder(prev => ({ ...prev, status }))
                        }
                    />

                    <Input
                        value={editedOrder.sum?? ""}
                        onChange={(e) =>
                            setEditedOrder(prev => ({
                                ...prev,
                                sum:toNumberOrUndefined (e.target.value),
                            }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Sum"
                    />

                    <Input
                        value={editedOrder.alreadyPaid?? ""}
                        onChange={(e) =>
                            setEditedOrder(prev => ({
                                ...prev,
                                alreadyPaid:Number (e.target.value) || 0,
                            }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Already Paid"
                    />

                    <input
                        defaultValue={order.group?.name}
                        className="w-full border px-3 py-2"
                        placeholder="All group"
                    />


                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border"
                        >
                            Close
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};
