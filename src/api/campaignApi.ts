import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//import { getToken } from "../auth/token"

interface CampaignData {
    captions: string[]
    product_name: string
    image_prompts: string[]
    video_prompts: string[]
}

export interface Campaign {
    id: string
    userId: string
    data: CampaignData
    status: string
    createdAt: string
    isNew: boolean
}

export interface GenerateCampaignDTO {
    userId: string
    product_name: string
    target_audience: string
}


interface GenerateCampaignResponse {
    id: string
    name: string
    content: string
    audience: {
        target: string
    }
    status: string
    version: number
    scheduledAt: null | string
    lockedAt: null | string
    ownerId: string
    createdAtstring: string
    updatedAt: string
}

export const campaignApiSlice = createApi({
    reducerPath: "campaignApiSlice",
    baseQuery: fetchBaseQuery({
      baseUrl: import.meta.env.VITE_SERVER_HOST,
    //   prepareHeaders: async (headers) => {
    //     try {
    //       // Dynamically import Auth0, outside hooks
    //       const token = getToken()
    //       if (token) {
    //         headers.set("authorization", `Bearer ${token}`)
    //       }
    //     } catch (error) {
    //       console.error("Error fetching access token", error)
    //     }
  
    //     return headers
    //   },
    }),
    endpoints: (builder) => ({
      generateCampaign: builder.mutation<GenerateCampaignResponse, GenerateCampaignDTO>({
        query: (payload) => ({
          url: `/campaigns/generate`,
          method: "POST",
          body: payload,
        }),
      }),
    }),
  })
  
  export const {
        useGenerateCampaignMutation
  } = campaignApiSlice