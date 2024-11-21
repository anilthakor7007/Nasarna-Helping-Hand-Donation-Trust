// src/redux/donorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Fetch Donors
export const fetchDonors = createAsyncThunk('donors/fetchDonors', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5005/api/donors');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create Donor
export const createDonor = createAsyncThunk('donors/createDonor', async (newDonor, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post('http://localhost:5005/api/donors', newDonor);
    dispatch(fetchDonors());  // Fetch updated list
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update Donor
export const updateDonor = createAsyncThunk('donors/updateDonor', async (updatedDonor, { rejectWithValue, dispatch }) => {
  try {
    const { id, ...data } = updatedDonor;
    console.log("edit donr id and data", id, data);
    const response = await axios.put(`http://localhost:5005/api/donors/${id}`, data);
    dispatch(fetchDonors());  
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete Donor
// export const donerCount = createAsyncThunk('donors/donorCount', async (id, { rejectWithValue, dispatch }) => {
//   try {
//     const response = await axios.get(`http://localhost:5005/api/donors/donor-counts/`);
//     trusteeIds
//     dispatch(fetchDonors()); 
//     return response;
//   } catch (error) {
//     return rejectWithValue(error.response.dataare);
//   }
// });

export const fetchDonorCountsForTrustees = createAsyncThunk(
  'donors/donorCount',
  async (trusteeIds, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:5005/api/donors/donor-counts/', {
        trusteeIds
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// donor count by trustee
export const deleteDonor = createAsyncThunk('donors/deleteDonor', async (id, { rejectWithValue, dispatch }) => {
  try {
    await axios.delete(`http://localhost:5005/api/donors/${id}`);
    dispatch(fetchDonors()); 
    return id;
  } catch (error) {
    return rejectWithValue(error.response.dataare);
  }
});

// Toggle Donor Status
export const toggleDonorStatus = createAsyncThunk('donors/toggleDonorStatus', async (id, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.put(`http://localhost:5005/api/donors/${id}/toggle-status`);
    dispatch(fetchDonors());  
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Slice
const donorsSlice = createSlice({
  name: 'donors',
  initialState: {
    donors: [],
    donorCounts: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     //countDonrs
     .addCase(fetchDonorCountsForTrustees.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    // Fulfilled state
    .addCase(fetchDonorCountsForTrustees.fulfilled, (state, action) => {
 
      state.loading = false;
      state.donorCounts = action.payload;
    })
    // Rejected state
    .addCase(fetchDonorCountsForTrustees.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload; // Capture the error
    })
      // Fetch Donors
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.donors = action.payload;
      })
      .addCase(fetchDonors.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to load donors: ${action.payload}`);
      })

      // Create Donor
      .addCase(createDonor.fulfilled, (state, action) => {
        state.donors.push(action.payload);
        toast.success('Donor created successfully');

        setTimeout(() => {
          toast.success('Credentials sent to registered email');
        }, 500);
        
      })
      .addCase(createDonor.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to create donor`);
      })

      // Update Donor
      .addCase(updateDonor.fulfilled, (state, action) => {
        const index = state.donors.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.donors[index] = action.payload;
        }
        toast.success('Donor updated successfully');
      })
      .addCase(updateDonor.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to update donor: ${action.payload}`);
      })

      // Delete Donor
      .addCase(deleteDonor.fulfilled, (state, action) => {
        state.donors = state.donors.filter((d) => d.id !== action.payload);
        toast.success('Donor deleted successfully');
      })
      .addCase(deleteDonor.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to delete donor: ${action.payload}`);
      })

      // Toggle Donor Status
      .addCase(toggleDonorStatus.fulfilled, (state, action) => {
        const index = state.donors.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.donors[index].status = action.payload.status;
        }
        toast.success('Donor status updated');
      })
      .addCase(toggleDonorStatus.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to update donor status: ${action.payload}`);
      });
  },
});

export default donorsSlice.reducer;
