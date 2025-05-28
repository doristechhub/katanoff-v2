import { createSlice } from '@reduxjs/toolkit';

export const initAdmin = {
  email: '',
  mobile: '',
  lastName: '',
  firstName: '',
  permissions: [],
  password: undefined,
  confirmPassword: undefined,
};

const initialState = {
  adminList: [],
  collapseList: [],
  permissionsPage: 0,
  selectedAdmin: initAdmin,
  permissionsLoading: false,
  permissionsOfAllAdmins: {},
  crudPermissionsLoading: false,
  assignPermissionsLoading: false,
};

const permissionsSlice = createSlice({
  initialState,
  name: 'permissions',
  reducers: {
    setPermissionsPage: (state, action) => {
      state.permissionsPage = action.payload;
    },
    setAdminsList: (state, action) => {
      state.adminList = action.payload;
    },
    setCollapseList: (state, action) => {
      state.collapseList = action.payload;
    },
    setSelectedAdmin: (state, action) => {
      state.selectedAdmin = action.payload;
    },
    setPermissionsLoading: (state, action) => {
      state.permissionsLoading = action.payload;
    },
    setCrudPermissionsLoading: (state, action) => {
      state.crudPermissionsLoading = action.payload;
    },
    setPermissionsOfAllAdmins: (state, action) => {
      state.permissionsOfAllAdmins = action.payload;
    },
    setAssignPermissionsLoading: (state, action) => {
      state.assignPermissionsLoading = action.payload;
    },
  },
});

export const {
  setAdminsList,
  setCollapseList,
  setSelectedAdmin,
  setPermissionsPage,
  setPermissionsLoading,
  setPermissionsOfAllAdmins,
  setCrudPermissionsLoading,
  setAssignPermissionsLoading,
} = permissionsSlice.actions;
export default permissionsSlice.reducer;
