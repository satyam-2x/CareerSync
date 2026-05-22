import API from "../api";

// Send chat message to AI backend
export const sendMessage = (data, token) =>
  API.post("/api/chat", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });