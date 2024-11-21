import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { toast } from "react-toastify";

// Async thunk for signup
export const signupUser = createAsyncThunk('auth/signupUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5005/api/users/register', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Signup failed');
    }
});

// Async thunk for login
export const loginUser = createAsyncThunk('auth/loginUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:5005/api/users/login', userData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed');
    }
});

// Initial state
const initialState = {
    user: localStorage.getItem('user'),
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role'),
    email: localStorage.getItem('email'),
    isLoading: false,
    error: null,

};

// Decode token from localStorage (if it exists) to set initial role
if (initialState.token) {
    try {
        const decodedToken = jwtDecode(initialState.token);
        initialState.role = decodedToken.role;
    } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem('token');
        initialState.token = null;
        initialState.role = null;
    }
}

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            // Clearing local storage on logout
            ['token', 'role', 'aboutMe', 'address', 'email', 'user', 'city', 'country', 'postalCode'].forEach(item => localStorage.removeItem(item));
            state.user = null;
            state.token = null;
            state.role = null;
            state.email = null;
        },
    },
    extraReducers: (builder) => {
        // Signup reducers
        builder.addCase(signupUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(signupUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;

            try {
                const decoded = jwtDecode(action.payload.token);
                state.role = decoded.role;
            } catch (error) {
                console.error("Failed to decode token:", error);
                state.role = null;
            }

            // Set data in local storage
            localStorage.setItem('token', action.payload.token);
            localStorage.setItem('role', state.role);
        });
        builder.addCase(signupUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload || 'Signup failed';
        });

        // Login reducers
        builder.addCase(loginUser.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            toast.success("Login successful!", {
                autoClose: 2000,
                hideProgressBar: true,
            });
            state.isLoading = false;
            state.user = action.payload.user;
            state.email = action.payload.user.email;
            state.token = action.payload.token;

            try {
                const decoded = jwtDecode(action.payload.token);
                console.log(decoded);
                state.role = decoded.role;
            } catch (error) {
                console.error("Failed to decode token:", error);
                state.role = null;
            }

            // Set data in local storage
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("email", action.payload.user.email);
            localStorage.setItem("user", action.payload.user.name);
            localStorage.setItem("userId", action.payload.user._id);
            localStorage.setItem("aboutMe", action.payload.user.aboutMe || '');
            localStorage.setItem("address", action.payload.user.address || '');
            localStorage.setItem("city", action.payload.user.city || '');
            localStorage.setItem("country", action.payload.user.country || '');
            localStorage.setItem("postalCode", action.payload.user.postalCode || '');
            localStorage.setItem("role", state.role);
        });

        builder.addCase(loginUser.rejected, (state, action) => {
            toast.error("Login Failed!", {
                autoClose: 2000,
                hideProgressBar: true,
            });
            state.isLoading = false;
            state.error = action.payload || "Login failed";
        });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
