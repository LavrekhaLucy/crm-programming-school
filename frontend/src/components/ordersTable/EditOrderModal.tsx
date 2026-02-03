import type { FC } from "react";
import type { IOrder } from "../../models/interfaces/IOrders/IOrder";

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
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-opacity-50"></div>

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

                    <input
                        defaultValue={order.name}
                        className="w-full border px-3 py-2"
                        placeholder="Name"
                    />
                    <input
                        defaultValue={order.surname}
                        className="w-full border px-3 py-2"
                        placeholder="Surname"
                    />
                    <input
                        defaultValue={order.email}
                        className="w-full border px-3 py-2"
                        placeholder="Email"
                    />
                    <input
                        defaultValue={order.phone}
                        className="w-full border px-3 py-2"
                        placeholder="Phone"
                    />
                    <input
                        defaultValue={order.age}
                        className="w-full border px-3 py-2"
                        placeholder="Age"
                    />
                    <input
                        defaultValue={order.course}
                        className="w-full border px-3 py-2"
                        placeholder="Course"
                    />
                    <input
                        defaultValue={order.course_format}
                        className="w-full border px-3 py-2"
                        placeholder="Course Format"
                    />
                    <input
                        defaultValue={order.course_type}
                        className="w-full border px-3 py-2"
                        placeholder="Course Type"
                    />
                    <input
                        defaultValue={order.status}
                        className="w-full border px-3 py-2"
                        placeholder="Status"
                    />
                    <input
                        defaultValue={order.sum}
                        className="w-full border px-3 py-2"
                        placeholder="Sum"
                    />
                    <input
                        defaultValue={order.alreadyPaid}
                        className="w-full border px-3 py-2"
                        placeholder="Already Paid"
                    />
                    <input
                        defaultValue={order.group?.name}
                        className="w-full border px-3 py-2"
                        placeholder="Group"
                    />


                    <div className="flex justify-end gap-2 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
};
