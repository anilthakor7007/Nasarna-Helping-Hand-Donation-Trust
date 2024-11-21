import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../store/auth-slice/authSlice";
import trusteeSlice from "../store/trustee-slice/trusteeSlice";
import donorsSlice from "../store/donor-slice/donorSlice";
import causesSlice from "../store/causes-slice/causesSlice";



const store = configureStore({
    reducer: {
      auth: authReducer,
      trustees: trusteeSlice,
      donors:donorsSlice,
      causes:causesSlice

    },
  });



export default store;