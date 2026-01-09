import { configureStore } from '@reduxjs/toolkit'
//import { userApiSlice } from '../api/userApi'
import rootReducer from './RootReducer'
import { campaignApiSlice } from '../api/campaignApi'

export const store = configureStore({
  reducer: rootReducer,
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
                              .concat(
                                campaignApiSlice.middleware
                              )                         
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch