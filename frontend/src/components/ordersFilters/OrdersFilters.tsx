import {useSearchParams} from "react-router-dom";
import {useDebounce} from "../hooks/useDebounce.ts";
import {useEffect, useState} from "react";

const initialFilters = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    status: "",
    onlyMine: "",
};


const OrdersFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [localFilters, setLocalFilters] = useState({
        name: searchParams.get("name") ?? "",
        surname: searchParams.get("surname") ?? "",
        email: searchParams.get("email") ?? "",
        phone: searchParams.get("phone") ?? "",
        status: searchParams.get("status") ?? "",
        onlyMine: searchParams.get("onlyMine") === "true" ? "true" : "",
    });

    const debouncedFilters = useDebounce(localFilters, 600);


    const handleReset = () => {
        setLocalFilters(initialFilters);

        setSearchParams({
            page: "1",
            limit: "25",
        });

    };


    useEffect(() => {
        const params = new URLSearchParams();

        Object.entries(debouncedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });

        params.set("page", "1");
        params.set("limit", "25");

        setSearchParams(params);


    }, [debouncedFilters, setSearchParams]);





    return (
        <div>
            <div className="flex gap-2 mb-4">
                <input className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                       placeholder="Name"
                       value={localFilters.name}
                       onChange={(e) =>
                           setLocalFilters(prev => ({ ...prev, name: e.target.value }))
                       }
                />
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>



                <input className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                       placeholder="Surname"
                       value={localFilters.surname}
                       onChange={(e) =>
                           setLocalFilters(prev => ({ ...prev, surname: e.target.value }))
                       }
                />

             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <input className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                       placeholder="Email"
                       value={localFilters.email}
                       onChange={(e) =>
                           setLocalFilters(prev => ({ ...prev, email: e.target.value }))
                       }
                />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <input className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                       placeholder="Phone"
                       value={localFilters.phone}
                       onChange={(e) =>
                           setLocalFilters(prev => ({ ...prev, phone: e.target.value }))
                       }
                />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <select
                    value={localFilters.status}
                    onChange={(e) =>
                        setLocalFilters(prev => ({ ...prev, status: e.target.value }))
                    }
                >
                    <option value="">all statuses</option>
                    <option value="in_work">In work</option>
                    <option value="new">New</option>
                    <option value="agree">Agree</option>
                    <option value="disagree">Disagree</option>
                    <option value="dubbing">Dubbing</option>

                </select>

                <input
                    type="checkbox"
                    checked={localFilters.onlyMine === "true"}
                    onChange={(e) =>
                        setLocalFilters(prev => ({
                            ...prev,
                            onlyMine: e.target.checked ? "true" : "",
                        }))
                    }
                />

                <button type="button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};
export default OrdersFilters;
