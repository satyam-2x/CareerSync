import API from "../api";

// Send chat message to AI backend
export const sendMessage = (data) =>
  API.post("/chat", data);