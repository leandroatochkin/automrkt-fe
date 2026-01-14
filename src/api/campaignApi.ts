import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
//import { getToken } from "../auth/token"

interface CampaignData {
    captions: string[]
    product_name?: string
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


export interface GenerateCampaignDataObject {
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

export interface GenerateCampaignResponseObject {
    campaignId: string
    status: string
    content: GenerateCampaignDataObject
}

export interface UpdateCampaignRequestDTO {
  id: string;
  payload: {
    name: string;
    content: CampaignData;
    audience: {
      target: string;
    };
  };
}

export interface UpdateCampaignResponseObject {
    success: boolean
    campaignId: string
    version: number
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
      generateCampaign: builder.mutation<GenerateCampaignResponseObject, GenerateCampaignDTO>({
        query: (payload) => ({
          url: `/campaigns/generate`,
          method: "POST",
          body: payload,
        }),
      }),
      updateCampaign: builder.mutation<UpdateCampaignResponseObject, UpdateCampaignRequestDTO>({
        query: ({ id, payload }) => ({
                url: `/campaign/${id}`, // Match your router.patch("/:id") route
                method: "PATCH",
                body: payload,
            }),
        }),
    }),
  })
  
  export const {
        useGenerateCampaignMutation,
        useUpdateCampaignMutation
  } = campaignApiSlice