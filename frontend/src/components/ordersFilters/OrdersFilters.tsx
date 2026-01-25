import {useAppDispatch, useAppSelector} from "../store/store";
import {loadOrders, resetFilters, setFilters} from "../../slices/ordersSlice.ts";
import type {StatusesEnum} from "../../enums/statuses.enum.ts";
import {useEffect, useState} from "react";
import {useDebounce} from "../hooks/useDebounce.ts";



const OrdersFilters = () => {
     const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.orderStoreSlice.filters);
    const [name, setName] = useState(filters.name ?? "");
    const [email, setEmail] = useState(filters.email ?? "");

    const debouncedName = useDebounce(name, 400);
    const debouncedEmail = useDebounce(email, 400);

    useEffect(() => {
        dispatch(setFilters({ name: debouncedName || undefined }));
        dispatch(loadOrders());
    }, [debouncedName, dispatch]);

    useEffect(() => {
        dispatch(setFilters({ email: debouncedEmail || undefined }));
        dispatch(loadOrders());
    }, [debouncedEmail, dispatch]);

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <input
                    placeholder="Name"
                    value={filters.name ?? ""}
                    onChange={(e) => setName(e.target.value)}
                  />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <select
                    value={filters.status ?? ""}
                    onChange={(e) => {
                        dispatch(
                            setFilters({
                                status: e.target.value
                                    ? (e.target.value as StatusesEnum)
                                    : undefined,
                            })
                        );
                        dispatch(loadOrders());
                    }}
                >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                </select>

                <input
                    type="checkbox"
                    checked={filters.onlyMine === "true"}
                    onChange={(e) => {
                        dispatch(
                            setFilters({
                                onlyMine: e.target.checked ? "true" : undefined,
                            })
                        );
                        dispatch(loadOrders());
                    }}
                />

                <button
                    onClick={() => {
                        dispatch(resetFilters());
                        dispatch(loadOrders());
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};
export default OrdersFilters;