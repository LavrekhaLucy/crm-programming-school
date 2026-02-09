import {type FC, useState} from 'react';
import Button from "../ui/button.tsx";
import Input from "../ui/input.tsx";

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
            <div className="flex  gap-5" ><Input
                value={text}
                onChange={(e) => setText(e.target.value)}

            />
                <Button
                    type="submit">Submit
                </Button></div>

        </form>
    );
};
