import {createAsyncThunk, createSlice, type PayloadAction} from '@reduxjs/toolkit';
import type {ICommentResponse} from "../models/interfaces/IComments/ICommentResponse.ts";
import type {IComment} from "../models/interfaces/IComments/IComment.ts";
import {createComments, getCommentsByOrder} from "../services/api.service.tsx";


interface CommentState {
    items: ICommentResponse[];
    loading: boolean;
    error: string | null;
}

const initialCommentState: CommentState = {
    items: [],
    loading: false,
    error: null,
};

export const addComment = createAsyncThunk<
    ICommentResponse,
    { orderId: string; data: IComment }
>(
    'comment/addComment',
    async ({ orderId, data }, { rejectWithValue }) => {
        try {
            return await createComments(orderId, data);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    },
);
export const fetchComments = createAsyncThunk<
    ICommentResponse[],
    string,
    { rejectValue: string }
>(
    'comments/fetchByOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            return await getCommentsByOrder(orderId);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState: initialCommentState,
    reducers: {
        clearComment(state) {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action: PayloadAction<ICommentResponse[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearComment } = commentSlice.actions;
export const commentActions = {...commentSlice.actions, addComment, fetchComments};
export default commentSlice;
