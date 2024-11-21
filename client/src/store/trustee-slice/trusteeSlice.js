// src/redux/trusteesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

// Fetch Trustees
export const fetchTrustees = createAsyncThunk('trustees/fetchTrustees', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('https://nasarna-backend.onrender.com/api/trustees');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Create Trustee
export const createTrustee = createAsyncThunk('trustees/createTrustee', async (newTrustee, { rejectWithValue, dispatch }) => {

  try {
    const response = await axios.post('https://nasarna-backend.onrender.com/api/trustees', newTrustee);
    dispatch(fetchTrustees());  // Fetch updated list
  
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Update Trustee
export const updateTrustee = createAsyncThunk('trustees/updateTrustee', async (updatedTrustee, { rejectWithValue, dispatch }) => {
  try {
    const { id, ...data } = updatedTrustee;
    console.log("edit data", data);
    const response = await axios.put(`https://nasarna-backend.onrender.com/api/trustees/${id}`, data);
    dispatch(fetchTrustees());  // Fetch updated list
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Delete Trustee
export const deleteTrustee = createAsyncThunk('trustees/deleteTrustee', async (id, { rejectWithValue, dispatch }) => {
  try {
    await axios.delete(`https://nasarna-backend.onrender.com/api/trustees/${id}`);
    dispatch(fetchTrustees());  // Fetch updated list
    return id;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Toggle Status
export const toggleTrusteeStatus = createAsyncThunk('trustees/toggleTrusteeStatus', async (id, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.put(`https://nasarna-backend.onrender.com/api/trustees/${id}/toggle-status`);
    dispatch(fetchTrustees());  // Fetch updated list
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const hideConfirmation = () => (state) => {
  state.showConfirmation = false;
  state.lastCreatedTrustee = null;
};

// Slice
const trusteesSlice = createSlice({
  name: 'trustees',
  initialState: {
    trustees: [],
    status: 'idle',
    error: null,
    lastCreatedEntity: null,
    showConfirmation: false,
  },
  reducers: {
    hideConfirmation: (state) => {
        state.showConfirmation = false;
        state.lastCreatedEntity = null;
    }},
  extraReducers: (builder) => {
    builder
      // Fetch Trustees
      .addCase(fetchTrustees.fulfilled, (state, action) => {
        state.trustees = action.payload;
        // toast.success('Trustees loaded successfully');
      })
      .addCase(fetchTrustees.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to load trustees:`);
      })

      // Create Trustee
      .addCase(createTrustee.fulfilled, (state, action) => {
        const { email, initialPassword, trustee } = action.payload;
                state.trustees.push(trustee);
                state.lastCreatedEntity = { email, initialPassword, type: 'trustee' };
                state.showConfirmation = true;
                toast.success('Trustee created successfully');

                setTimeout(() => {
                  toast.success('Credentials sent to registered email');
                }, 500);
                
    
      


      })
      .addCase(createTrustee.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to create trustee: ${action.payload}`);
      })

      // Update Trustee
      .addCase(updateTrustee.fulfilled, (state, action) => {
        const index = state.trustees.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trustees[index] = action.payload;
        }
        toast.success('Trustee updated successfully');
      })
      .addCase(updateTrustee.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to update trustee: ${action.payload}`);
      })

      // Delete Trustee
      .addCase(deleteTrustee.fulfilled, (state, action) => {
        state.trustees = state.trustees.filter((t) => t.id !== action.payload);
        toast.success('Trustee deleted successfully');
      })
      .addCase(deleteTrustee.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to delete trustee: ${action.payload}`);
      })

      // Toggle Status
      .addCase(toggleTrusteeStatus.fulfilled, (state, action) => {
        const index = state.trustees.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.trustees[index].status = action.payload.status;
        }
        toast.success('Trustee status updated');
      })
      .addCase(toggleTrusteeStatus.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(`Failed to update trustee status: ${action.payload}`);
      });
  },
});

export default trusteesSlice.reducer;
