import { useEffect, useState } from "react";
import type { IComment } from "../../models/interfaces/IComments/IComment";
import {
    createComment,
    getCommentsByOrder,
} from "../../services/api.service";
import type { ICommentResponse } from "../../models/interfaces/IComments/ICommentResponse";

interface CommentProps {
    orderId: string;
}

export const Comment = ({ orderId }: CommentProps) => {
    const [comments, setComments] = useState<ICommentResponse[]>([]);
    const [inputValue, setInputValue] = useState("");


    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await getCommentsByOrder(orderId);
                setComments(data);
            } catch (e) {
                console.error("Помилка завантаження:", e);
            }
        };

        if (orderId) {
           void fetchComments();
        }
    }, [orderId]);


    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        const commentData: IComment = {
            text: inputValue,
        };

        try {
            const response = await createComment(orderId, commentData);

            setComments((prev) => [response, ...prev]);

            setInputValue("");
        } catch (error) {
            console.error("Не вдалося зберегти коментар:", error);
            alert("Помилка при збереженні коментаря");
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "600px" }}>


            <div
                style={{
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    padding: "10px",
                    marginBottom: "10px",
                }}
            >
                {comments.map((c) => (

                    <div
                        key={c.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #f0f0f0",
                            padding: "5px 0",
                        }}
                    >
                        <span>{c.text}</span>

                        <span
                            style={{
                                fontSize: "12px",
                                color: "#666",
                            }}
                        >
                            {c.user.name} {c.user.surname}{" "}
                            {new Date(c.created_at).toLocaleString()}
                        </span>
                    </div>
                ))}
            </div>


            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) =>
                        setInputValue(e.target.value)
                    }
                    placeholder="Comment"
                    style={{
                        flexGrow: 1,
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />

                <button
                    onClick={handleSubmit}
                    style={{
                        backgroundColor: "#ccc",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    SUBMIT
                </button>
            </div>
        </div>
    );
};
