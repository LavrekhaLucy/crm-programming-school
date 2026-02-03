import {initialOrderFilters, ORDER_FILTER_KEYS} from "../../components/res_constants/orderFilters.ts";


export const getOrderFiltersFromSearchParams = (
    searchParams: URLSearchParams
) => ({
    ...initialOrderFilters,
    name: searchParams.get(ORDER_FILTER_KEYS.name) ?? "",
    surname: searchParams.get(ORDER_FILTER_KEYS.surname) ?? "",
    email: searchParams.get(ORDER_FILTER_KEYS.email) ?? "",
    phone: searchParams.get(ORDER_FILTER_KEYS.phone) ?? "",
    age: searchParams.get(ORDER_FILTER_KEYS.age) ?? "",
    course: searchParams.get(ORDER_FILTER_KEYS.course) ?? "",
    course_format: searchParams.get(ORDER_FILTER_KEYS.course_format) ?? "",
    course_type: searchParams.get(ORDER_FILTER_KEYS.course_type) ?? "",
    status: searchParams.get(ORDER_FILTER_KEYS.status) ?? "",
    group: searchParams.get(ORDER_FILTER_KEYS.group) ?? "",
    startDate: searchParams.get(ORDER_FILTER_KEYS.startDate) ?? "",
    endDate: searchParams.get(ORDER_FILTER_KEYS.endDate) ?? "",
    onlyMine:
        searchParams.get(ORDER_FILTER_KEYS.onlyMine) === "true" ? "true" : "",
});
