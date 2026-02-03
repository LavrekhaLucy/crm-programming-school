import { useState } from "react";
import { useAppDispatch } from "../store/store";
import { commentActions } from "../../slices/commentSlice";
import type { FC } from "react";

interface CommentProps {
    orderId: string;
}

export const Comment: FC<CommentProps> = ({ orderId }) => {
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");

    const handleAddComment = () => {
        if (!text.trim()) return;
        dispatch(
            commentActions.addComment({
                orderId,
                data: { text },
            })
        );
        setText("");
    };

    return (
        <div>
            <h4>Comments for order {orderId}</h4>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
            />
            <button onClick={handleAddComment}>Add Comment</button>
        </div>
    );
};


