import {useSearchParams} from "react-router-dom";
import {useDebounce} from "../hooks/useDebounce.ts";
import {useEffect, useState} from "react";
import Input from "../ui/input.tsx";
import Select from "../ui/select.tsx";
import Button from "../ui/button.tsx";


const initialFilters = {
    name: "",
    surname: "",
    email: "",
    phone: "",
    age: "",
    course: "",
    course_format: "",
    course_type: "",
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
        course_format: searchParams.get("format") ?? "",
        course_type: searchParams.get("type") ?? "",
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
        setSearchParams(prev => {
            const params = new URLSearchParams(prev);

            for (const key in debouncedFilters) {
                const value = debouncedFilters[key as keyof typeof debouncedFilters];

                if (value) params.set(key, value);
                else params.delete(key);
            }
            return params;
        });
    }, [debouncedFilters, setSearchParams]);


    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Input
                    placeholder="Name"
                    value={localFilters.name}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, name: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Input
                    placeholder="Surname"
                    value={localFilters.surname}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, surname: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Input
                    placeholder="Email"
                    value={localFilters.email}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, email: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Input
                    placeholder="Phone"
                    value={localFilters.phone}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, phone: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Input
                    placeholder="Age"
                    value={localFilters.age}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, age: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <Select
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
                </Select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Select
                    value={localFilters.course_format}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, course_format: e.target.value}))
                    }
                >
                    <option value="">all formats</option>
                    <option value="static">static</option>
                    <option value="online">online</option>
                </Select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Select
                    value={localFilters.course_type}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, course_type: e.target.value}))
                    }
                >
                    <option value="">all types</option>
                    <option value="pro">pro</option>
                    <option value="minimal">minimal</option>
                    <option value="premium">premium</option>
                    <option value="incubator">incubator</option>
                    <option value="vip">vip</option>
                </Select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <Select
                    value={localFilters.status}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, status: e.target.value}))
                    }
                >
                    <option value="">all statuses</option>
                    <option value="in_work">in_work</option>
                    <option value="new">new</option>
                    <option value="agree">agree</option>
                    <option value="disagree">disagree</option>
                    <option value="dubbing">dubbing</option>
                </Select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Select
                    value={localFilters.group}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, group: e.target.value}))
                    }
                >
                    <option value="">all group</option>
                </Select>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>


                <Input
                    type="date"
                    placeholder="Start date"
                    value={localFilters.startDate}
                    onChange={(e) =>
                        setLocalFilters(prev => ({...prev, startDate: e.target.value}))
                    }
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></span>

                <Input
                    type="date"
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

                <Button type="button" onClick={handleReset}>
                    Reset
                </Button>
            </div>
        </div>
    );
};
export default OrdersFilters;
