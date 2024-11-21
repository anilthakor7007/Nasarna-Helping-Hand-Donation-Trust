import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5005/api/causes';

// Thunks
export const fetchCauses = createAsyncThunk('causes/fetchCauses', async () => {
    const response = await axios.get(API_URL);
    console.log(response.data);
    return response.data;
});

export const createCause = createAsyncThunk('causes/createCause', async (causeData) => {
    const response = await axios.post(API_URL, causeData);
    return response.data;
});

export const updateCause = createAsyncThunk('causes/updateCause', async ({ editCauseId, editCause }) => {
    console.log("cause data and id", editCause);
    const response = await axios.put(`${API_URL}/${editCauseId}`, editCause);
    return response.data;
});

export const deleteCause = createAsyncThunk('causes/deleteCause', async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
});


export const donateToCause = createAsyncThunk('causes/donateToCause', async ({ causeId, donorId, amount }, { rejectWithValue }) => {
    try {
        // Log the inputs to check if the parameters are correct
        console.log('Donate request parameters:', { causeId, donorId, amount });

        const response = await axios.post(`${API_URL}/donate`, { causeId, donorId, amount });


        console.log('Donation response:', response.data);


        return response.data;
    } catch (error) {

        console.error('Error during donation request:', error);

        if (error.response) {

            console.error('Server error response:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {

            console.error('No response received from server:', error.request);
        } else {
            // For any other errors
            console.error('Error in setting up the donation request:', error.message);
        }


        return rejectWithValue(error.response ? error.response.data : error.message);
    }
});
export const updateCauseStatus = createAsyncThunk(
    'causes/updateCauseStatus',
    async ({ id, status }) => {
        const response = await axios.put(`${API_URL}/${id}/status`, { status });
        return response.data;
    }
);


export const fetchIndividualDonorData = createAsyncThunk(
    'causes/donors/fetchIndividualDonorData',
    async (donorIds, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/donors/data`, { donorIds });
            return response.data; // The data from the backend
        } catch (error) {
            // Handle error
            return rejectWithValue(
                error.response?.data?.message || 'An error occurred while fetching donor data.'
            );
        }
    }
);


// Slice
const causeSlice = createSlice({
    name: 'causes',
    initialState: {
        causes: [],
        donorData: [],
        status: 'idle',
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCauses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCauses.fulfilled, (state, action) => {
                state.loading = false;
                state.causes = action.payload;
            })
            .addCase(fetchCauses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Failed to fetch causes: ${action.error.message}`);
            })

            // Create Cause
            .addCase(createCause.fulfilled, (state, action) => {
                state.causes.push(action.payload);
                toast.success('Cause created successfully');
            })
            .addCase(createCause.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Cause creation failed: ${action.error.message}`);
            })

            // Update Cause
            .addCase(updateCause.fulfilled, (state, action) => {
                const index = state.causes.findIndex(cause => cause._id === action.payload._id);
                if (index !== -1) {
                    state.causes[index] = action.payload;
                }
                toast.success('Cause updated successfully');
            })
            .addCase(updateCause.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Cause update failed: ${action.error.message}`);
            })

            // Delete Cause
            .addCase(deleteCause.fulfilled, (state, action) => {
                state.causes = state.causes.filter(cause => cause._id !== action.payload);
                toast.success('Cause deleted successfully');
            })
            .addCase(deleteCause.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Cause deletion failed: ${action.error.message}`);
            })

            // Donate to Cause
            .addCase(donateToCause.fulfilled, (state, action) => {
                const updatedCause = action.payload;
                const index = state.causes.findIndex(cause => cause._id === updatedCause._id);
                if (index !== -1) {
                    state.causes[index] = updatedCause;
                }
                toast.success('Donation successful');
            })
            .addCase(donateToCause.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Donation failed: ${action.error.message}`);
            })

            .addCase(updateCauseStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateCauseStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedCause = action.payload;
                const index = state.causes.findIndex(cause => cause._id === updatedCause._id);
                if (index !== -1) {
                    state.causes[index] = updatedCause;
                }
                toast.success(`Status updated to ${updatedCause.status}`);
            })
            .addCase(updateCauseStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(`Failed to update status: ${action.error.message}`);
            })

            .addCase(fetchIndividualDonorData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIndividualDonorData.fulfilled, (state, action) => {
                state.loading = false;
                state.donorData = action.payload;
            })
            .addCase(fetchIndividualDonorData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions and reducer
export const { } = causeSlice.actions;
export default causeSlice.reducer;
