import {useAppDispatch} from "../store/store.ts";
import {commentActions} from "../../slices/commentSlice.ts";


const Comment = () => {
    const dispatch = useAppDispatch();



        dispatch(
            commentActions.addComment({
                orderId: 'order.id',
                data: { text: 'commentText' },
            }),

        );

    return (
        <div>

        </div>
    );
};

export default Comment;