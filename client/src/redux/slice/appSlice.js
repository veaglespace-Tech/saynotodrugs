import { createSlice } from '@reduxjs/toolkit';

// Retrieve from localStorage if exists
let storedToken = null;
let storedUser = null;

if (typeof window !== 'undefined') {
  try {
    storedToken = localStorage.getItem('token');
    storedUser = localStorage.getItem('adminUser') ? JSON.parse(localStorage.getItem('adminUser')) : null;
  } catch (e) {
    console.error('Error reading localStorage', e);
  }
}

const initialState = {
  activeCampaignId: null,
  token: storedToken,
  adminUser: storedUser,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setActiveCampaignId: (state, action) => {
      state.activeCampaignId = action.payload;
    },
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.adminUser = user;
      state.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.adminUser = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('adminUser');
      }
    },
  },
});

export const { setActiveCampaignId, setCredentials, logout } = appSlice.actions;
export default appSlice.reducer;
