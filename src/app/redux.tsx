import React from 'react'
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import globalReducer from '../State/slices';

// redux-persist imports
import storage from 'redux-persist/lib/storage';
import {persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/integration/react';
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { api } from '@/State/api';


// persist configs
const persistConfig = {
  key: "root",
  storage
}

// convert the normal reducer into a persisted one
const persistGlobalReducer = persistReducer(persistConfig, globalReducer)

export const store = configureStore({
  reducer: {
    global: persistGlobalReducer,
    [api.reducerPath]:api.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();



const StoreProvider = ({children}: {children: React.ReactNode}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export default StoreProvider;
