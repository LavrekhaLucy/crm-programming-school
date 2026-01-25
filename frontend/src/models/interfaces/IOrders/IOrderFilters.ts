import type {CoursesEnum} from "../../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../../enums/formats.enum.ts";
import type {TypesEnum} from "../../../enums/types.enum.ts";
import type {StatusesEnum} from "../../../enums/statuses.enum.ts";
import type {OrderSortField} from "../../types/OrderSortField.ts";


export interface IOrderFilters {
    page?: string;
    limit?: string;

    sortBy?: OrderSortField;
    sortOrder?: 'ASC' | 'DESC';

    name?: string;
    surname?: string;
    email?: string;
    phone?: string;

    course?: CoursesEnum;
    course_format?: FormatsEnum;
    course_type?: TypesEnum;
    status?: StatusesEnum;

    onlyMine?: 'true';

    startDate?: string;
    endDate?: string;
}