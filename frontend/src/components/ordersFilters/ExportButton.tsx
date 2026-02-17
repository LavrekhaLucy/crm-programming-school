import type {IOrderFilters} from "../../models/interfaces/IOrders/IOrderFilters.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {exportOrders} from "../../slices/ordersSlice.ts";
import {unwrapResult} from "@reduxjs/toolkit";
import type {FC} from "react";



interface ExportButtonProps {
    filters: IOrderFilters;
}

export const ExportButton: FC<ExportButtonProps> = ({ filters }) => {
    const dispatch = useAppDispatch();
    const { isExporting } = useAppSelector((state) => state.orderStoreSlice);

    const handleDownload = async () => {
        try {
            const resultAction = await dispatch(exportOrders(filters));
            const blobData = unwrapResult(resultAction);

            if (blobData) {
                const url = window.URL.createObjectURL(new Blob([blobData as BlobPart]));
                const link = document.createElement('a');
                link.href = url;

                const date = new Date().toISOString().split('T')[0];
                link.setAttribute('download', `orders_report_${date}.xlsx`);

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Excel file upload failed. Please try again later');
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isExporting}
            style={{ backgroundImage: `url('http://bigbird.space:81/static/media/xls.476bc5b02e8b94a61782636d19526309.svg')` }}
            className="bg-[#2e7d32] bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]"
        >
        </button>
    );
};

