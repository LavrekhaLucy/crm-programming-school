import { useEffect, useState } from "react";
import type { IComment } from "../../models/interfaces/IComments/IComment";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {commentActions} from "../../slices/commentSlice.ts";

interface CommentsProps {
    orderId: string;
}

export const Comments = ({ orderId }: CommentsProps) => {
    const dispatch = useAppDispatch();
    const { items: comments, loading, error } = useAppSelector((state) => state.commentStoreSlice);

    const [inputValue, setInputValue] = useState("");


    useEffect(() => {
        if (orderId) {
            dispatch(commentActions.fetchComments(orderId));
        }

        return () => { dispatch(commentActions.clearComment()); };
    }, [dispatch, orderId]);

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        const commentData: IComment = {
            text: inputValue,
        };

        dispatch(commentActions.addComment({ orderId, data: commentData }));
        setInputValue("");
    };

    return (

        <div className="p-5 max-w-150">

            {error &&
                <div className="text-red-500 mb-2 font-medium">Error: {error}</div>}

            <div className="border border-gray-200 rounded-lg p-2.5 mb-2.5 min-h-12.5">
                {loading && comments.length === 0 && (
                    <div className="text-center text-gray-400">Loading...</div>
                )}

                {!loading && comments.length === 0 && (
                    <div className="text-center text-gray-400">No comments yet</div>
                )}

                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="flex justify-between border-b border-gray-100 py-1.5 last:border-b-0 animate-fadeIn"
                    >
                        <span className="text-gray-800">{c.text}</span>

                        <span className="text-[10px] text-gray-400 text-right ml-4">
                            {c.user?.name} {c.user?.surname} <br />
                            {new Date(c.created_at).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2.5">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Comment"
                    disabled={loading}
                    className="grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#43a047] disabled:bg-gray-50"
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading || !inputValue.trim()}
                    className="bg-[#43a047] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#2e7d32] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                    SUBMIT
                </button>
            </div>
        </div>
    );
};
