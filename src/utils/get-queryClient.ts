import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// This ensures we have a single QueryClient instance across requests
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
