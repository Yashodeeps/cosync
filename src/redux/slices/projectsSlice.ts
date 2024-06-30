import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: [] as any,
  reducers: {
    addProjects: (state, action: PayloadAction<any>) => {
      state.splice(0, state.length, ...action.payload);
    },
    addNewProject: (state, action: PayloadAction<any>) => {
      state.push(action.payload);
    },
  },
});

export default projectSlice.reducer;
export const { addProjects, addNewProject } = projectSlice.actions;
