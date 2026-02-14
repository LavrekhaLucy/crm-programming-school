import { useEffect, useState } from "react";
import type { IComment } from "../../models/interfaces/IComments/IComment";
import {
    createComments,
    getCommentsByOrder,
} from "../../services/api.service";
import type { ICommentResponse } from "../../models/interfaces/IComments/ICommentResponse";

interface CommentsProps {
    orderId: string;
}

export const Comments = ({ orderId }: CommentsProps) => {
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
            const response = await createComments(orderId, commentData);

            setComments((prev) => [response, ...prev]);

            setInputValue("");
        } catch (error) {
            console.error("Не вдалося зберегти коментар:", error);
            alert("Помилка при збереженні коментаря");
        }
    };

    return (
        // <div style={{ padding: "20px", maxWidth: "600px" }}>
        //
        //
        //     <div
        //         style={{
        //             border: "1px solid #eee",
        //             borderRadius: "8px",
        //             padding: "10px",
        //             marginBottom: "10px",
        //         }}
        //     >
        //         {comments.map((c) => (
        //
        //             <div
        //                 key={c.id}
        //                 style={{
        //                     display: "flex",
        //                     justifyContent: "space-between",
        //                     borderBottom: "1px solid #f0f0f0",
        //                     padding: "5px 0",
        //                 }}
        //             >
        //                 <span>{c.text}</span>
        //
        //                 <span
        //                     style={{
        //                         fontSize: "12px",
        //                         color: "#666",
        //                     }}
        //                 >
        //                     {c.user.name} {c.user.surname}{" "}
        //                     {new Date(c.created_at).toLocaleString()}
        //                 </span>
        //             </div>
        //         ))}
        //     </div>
        //
        //
        //     <div style={{ display: "flex", gap: "10px" }}>
        //         <input
        //             type="text"
        //             value={inputValue}
        //             onChange={(e) =>
        //                 setInputValue(e.target.value)
        //             }
        //             placeholder="Comment"
        //             style={{
        //                 flexGrow: 1,
        //                 padding: "8px",
        //                 borderRadius: "4px",
        //                 border: "1px solid #ccc",
        //             }}
        //         />
        //
        //         <button
        //             onClick={handleSubmit}
        //             style={{
        //                 backgroundColor: "#ccc",
        //                 border: "none",
        //                 padding: "8px 15px",
        //                 borderRadius: "4px",
        //                 cursor: "pointer",
        //             }}
        //         >
        //             SUBMIT
        //         </button>
        //     </div>
        // </div>
        <div className="p-5 max-w-150">

            {/* список коментарів */}
            <div className="border border-gray-200 rounded-lg p-2.5 mb-2.5">
                {comments.map((c) => (
                    <div
                        key={c.id}
                        className="flex justify-between border-b border-gray-100 py-1.5 last:border-b-0"
                    >
                        <span>{c.text}</span>

                        <span className="text-xs text-gray-500">
                    {c.user.name} {c.user.surname}{" "}
                            {new Date(c.created_at).toLocaleString()}
                </span>
                    </div>
                ))}
            </div>

            {/* input + button */}
            <div className="flex gap-2.5">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Comment"
                    className="grow px-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <button
                    onClick={handleSubmit}
                    className="bg-gray-300 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-400 transition-colors"
                >
                    SUBMIT
                </button>
            </div>

        </div>
    );
};
