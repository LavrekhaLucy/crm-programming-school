import {useSearchParams} from "react-router-dom";
import {useDebounce} from "../hooks/useDebounce.ts";
import {useEffect, useState} from "react";

const initialFilters = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    age: "",
    course: "",
    format: "",
    type: "",
    status: "",
    group: "",
    startDate: "",
    endDate: "",
    onlyMine: "",
};


const OrdersFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [localFilters, setLocalFilters] = useState({
        name: searchParams.get("name") ?? "",
        surname: searchParams.get("surname") ?? "",
        email: searchParams.get("email") ?? "",
        phone: searchParams.get("phone") ?? "",
        age: searchParams.get("age") ?? "",
        course: searchParams.get("course") ?? "",
        format: searchParams.get("format") ?? "",
        type: searchParams.get("type") ?? "",
        status: searchParams.get("status") ?? "",
        group: searchParams.get("group") ?? "",
        startDate: searchParams.get("startDate") ?? "",
        endDate: searchParams.get("endDate") ?? "",

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
        const params = new URLSearchParams(searchParams);

        Object.entries(debouncedFilters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });

        setSearchParams(params);


    }, [debouncedFilters, searchParams, setSearchParams]);


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
                           setLocalFilters(prev => ({...prev, name: e.target.value}))
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
                           setLocalFilters(prev => ({...prev, surname: e.target.value}))
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
                           setLocalFilters(prev => ({...prev, email: e.target.value}))
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
                           setLocalFilters(prev => ({...prev, phone: e.target.value}))
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
                       placeholder="Age"
                       value={localFilters.age}
                       onChange={(e) =>
                           setLocalFilters(prev => ({...prev, age: e.target.value}))
                       }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <select className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                        value={localFilters.course}
                        onChange={(e) =>
                            setLocalFilters(prev => ({...prev, course: e.target.value}))
                        }
                >
                    <option value="">all courses</option>
                    <option value="fs">FS</option>
                    <option value="qacx">QACX</option>
                    <option value="jcx">JCX</option>
                    <option value="jscx">JSCX</option>
                    <option value="fe">FE</option>
                    <option value="pcx">PCX</option>

                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <select className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                        value={localFilters.format}
                        onChange={(e) =>
                            setLocalFilters(prev => ({...prev, format: e.target.value}))
                        }
                >
                    <option value="">all formats</option>
                    <option value="static">static</option>
                    <option value="online">online</option>


                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <select className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                        value={localFilters.type}
                        onChange={(e) =>
                            setLocalFilters(prev => ({...prev, type: e.target.value}))
                        }
                >
                    <option value="">all types</option>
                    <option value="pro">pro</option>
                    <option value="minimal">minimal</option>
                    <option value="premium">premium</option>
                    <option value="incubator">incubator</option>
                    <option value="vip">vip</option>

                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <select className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                        value={localFilters.status}
                        onChange={(e) =>
                            setLocalFilters(prev => ({...prev, status: e.target.value}))
                        }
                >
                    <option value="">all statuses</option>
                    <option value="in_work">In work</option>
                    <option value="new">New</option>
                    <option value="agree">Agree</option>
                    <option value="disagree">Disagree</option>
                    <option value="dubbing">Dubbing</option>

                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <select className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                        value={localFilters.group}
                        onChange={(e) =>
                            setLocalFilters(prev => ({...prev, group: e.target.value}))
                        }
                >
                    <option value="">all group</option>


                </select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <input className="w-full pl-10 pr-3 py-2
                 bg-gray-100
                  border border-gray-300
                   rounded-lg
                   text-sm
                   focus:ring-2 focus:ring-blue-200
                  focus:border-blue-500
                   outline-none"
                       placeholder="Start date"
                       value={localFilters.startDate}
                       onChange={(e) =>
                           setLocalFilters(prev => ({...prev, startDate: e.target.value}))
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
                       placeholder="End date"
                       value={localFilters.endDate}
                       onChange={(e) =>
                           setLocalFilters(prev => ({...prev, endDate: e.target.value}))
                       }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

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
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <button type="button" onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
    );
};
export default OrdersFilters;
