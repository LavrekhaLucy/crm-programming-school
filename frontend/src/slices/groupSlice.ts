import {createSlice, createAsyncThunk, type PayloadAction} from '@reduxjs/toolkit';
import type {IGroup} from "../models/interfaces/IGroup/IGroup.ts";
import {createGroup, getGroupById, getGroups} from "../services/api.service.tsx";
import type {IGroupResponse} from "../models/interfaces/IGroup/IGroupResponse.ts";


interface GroupState {
    groups: IGroup[];
    loading: boolean;
    error: string | null;
}

const initialGroupState: GroupState = {
    groups: [],
    loading: false,
    error: null,
};

export const AddCreateGroup = createAsyncThunk<IGroupResponse, string>(
    'groups/createGroup',
    async (name, { rejectWithValue }) => {
        try {
            return await createGroup({ name });
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

export const fetchGroups = createAsyncThunk(
    'groups/fetchGroups',
    async (_, { rejectWithValue }) => {
        try {
            return await getGroups();
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

export const fetchGroupById = createAsyncThunk(
    "groups/fetchById",
    async (id: number, { rejectWithValue }) => {
        try {
            return await getGroupById(id);
        } catch (error) {
            return rejectWithValue(error as string);
        }
    }
);

const groupSlice = createSlice({
    name: 'groups',
    initialState: initialGroupState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(AddCreateGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(AddCreateGroup.fulfilled, (state, action: PayloadAction<IGroup>) => {
                state.loading = false;
                state.groups.push(action.payload);
            })
            .addCase(AddCreateGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })


            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action: PayloadAction<IGroup[]>) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchGroupById.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(fetchGroupById.fulfilled, (state, action: PayloadAction<IGroup>) => {
                state.loading = false;
                state.groups.push(action.payload);
            })
            .addCase(fetchGroupById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
    },
});
export const groupActions = {...groupSlice.actions, AddCreateGroup, fetchGroups, fetchGroupById}

export default groupSlice;
