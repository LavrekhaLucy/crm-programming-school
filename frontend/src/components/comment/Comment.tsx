import type { FC } from "react";


interface CommentProps {
    orderId: string;
}

export const Comment: FC<CommentProps> = ({orderId}) => {


    return (
        <div>

            <div>

                value="comment.text"
                {orderId}

            </div>

        </div>
    );
};

