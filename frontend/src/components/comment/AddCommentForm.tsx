import {type FC, useState} from 'react';
import Button from "../ui/button.tsx";

interface AddCommentFormProps {
    orderId: string;
    onSubmit: (orderId: string, text: string) => void;

}

export const AddCommentForm: FC<AddCommentFormProps> = ({ onSubmit, orderId }) => {
    const [text, setText] = useState('');

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(orderId, text);
                setText('');
            }}
        >
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write a comment..."
            />
            <Button
                 type="button">Submit
            </Button>
        </form>
    );
};
