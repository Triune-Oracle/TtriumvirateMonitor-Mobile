import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import SQLiteStorage from 'redux-persist-sqlite-storage';
import { combineReducers } from 'redux';

// Reducer placeholder (replace or extend)
const initialReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_METRIC':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  metrics: initialReducer,
});

const persistConfig = {
  key: 'root',
  storage: SQLiteStorage('triumvirate.db'),
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
