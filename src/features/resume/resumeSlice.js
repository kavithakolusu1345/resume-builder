import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
  saveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'failed'
};

// Async Thunks
export const fetchResumes = createAsyncThunk(
  'resume/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await api.get('/resumes');
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchResumeById = createAsyncThunk(
  'resume/fetchById',
  async (id, thunkAPI) => {
    try {
      return await api.get(`/resumes/${id}`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const createResume = createAsyncThunk(
  'resume/create',
  async (resumeData, thunkAPI) => {
    try {
      return await api.post('/resumes', resumeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateResume = createAsyncThunk(
  'resume/update',
  async ({ id, resumeData }, thunkAPI) => {
    try {
      return await api.put(`/resumes/${id}`, resumeData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'resume/delete',
  async (id, thunkAPI) => {
    try {
      await api.delete(`/resumes/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const duplicateResume = createAsyncThunk(
  'resume/duplicate',
  async (id, thunkAPI) => {
    try {
      return await api.post(`/resumes/${id}/duplicate`);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Crucial for Live Preview: updates the local React state instantly as the user types
    updateLocalResume: (state, action) => {
      if (state.currentResume) {
        const { field, value, path } = action.payload;
        
        if (path) {
          // If editing a nested field e.g. path='personalInfo', field='fullName'
          state.currentResume[path] = {
            ...state.currentResume[path],
            [field]: value
          };
        } else {
          // Top-level field e.g. field='summary'
          state.currentResume[field] = value;
        }
        state.saveStatus = 'dirty'; // State has unsaved local changes
      }
    },
    
    // Crucial for Repeatable Lists: updates arrays like Experience, Education, Projects, Skills
    updateLocalList: (state, action) => {
      if (state.currentResume) {
        const { section, index, value, actionType } = action.payload;
        // actionType: 'add' | 'edit' | 'delete' | 'reorder'
        
        if (actionType === 'add') {
          state.currentResume[section].push(value);
        } else if (actionType === 'edit') {
          state.currentResume[section][index] = {
            ...state.currentResume[section][index],
            ...value
          };
        } else if (actionType === 'delete') {
          state.currentResume[section].splice(index, 1);
        } else if (actionType === 'reorder') {
          state.currentResume[section] = value; // Replace the whole array
        }
        state.saveStatus = 'dirty';
      }
    },

    // Crucial for drag-and-drop section reordering
    updateSectionOrder: (state, action) => {
      if (state.currentResume) {
        state.currentResume.sectionOrder = action.payload;
        state.saveStatus = 'dirty';
      }
    },

    // Crucial for layout customizations: Font size, Margins, Spacing
    updateCustomization: (state, action) => {
      if (state.currentResume) {
        state.currentResume.customization = {
          ...state.currentResume.customization,
          ...action.payload
        };
        state.saveStatus = 'dirty';
      }
    },

    clearCurrentResume: (state) => {
      state.currentResume = null;
      state.saveStatus = 'idle';
    },

    setSavingStatus: (state, action) => {
      state.saveStatus = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
        state.saveStatus = 'idle';
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload);
        state.currentResume = action.payload;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateResume.pending, (state) => {
        state.saveStatus = 'saving';
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.saveStatus = 'saved';
        state.currentResume = action.payload;
        // Sync the item inside the list too
        const idx = state.resumes.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) {
          state.resumes[idx] = action.payload;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((r) => r._id !== action.payload);
        if (state.currentResume?._id === action.payload) {
          state.currentResume = null;
        }
      })
      // Duplicate
      .addCase(duplicateResume.fulfilled, (state, action) => {
        state.resumes.unshift(action.payload);
      });
  },
});

export const {
  updateLocalResume,
  updateLocalList,
  updateSectionOrder,
  updateCustomization,
  clearCurrentResume,
  setSavingStatus,
} = resumeSlice.actions;

export default resumeSlice.reducer;
