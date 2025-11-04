import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotionClient } from "./api";

const client = createNotionClient();

const usePlaces = () => {
    return useQuery({
        queryKey: ["places"],
        queryFn: async () => {
            
            return res.results;
        },
        staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
}