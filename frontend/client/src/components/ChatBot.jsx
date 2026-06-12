import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chatService";

function chat() {

  // State management
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("")
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send user message to AI
  const handleSend = async () => {

    setMessage("");
    setType("");

    if (!input.trim()) {
      setMessage("Please enter a message");
      setType("error");
      return;
    }

    const userMessage = {
      text: input,
      sender: "user"
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {

      setLoading(true);

      const response = await sendMessage(
        { message: input },
        token
      );

      const botMessage = {
        text: response.data.reply,
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);

    } catch (error) {
      setInput(userMessage.text);
      setMessage(error.response?.data?.message || "AI is not responding right now");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-10 flex flex-col items-end">

      {/* Floating AI button */}
      {!open && (
        <>
          <p className="text-xs text-gray-600 mb-3 font-medium">
            AI Help
          </p>

          <button
            onClick={() => setOpen(true)}
            className="w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg animate-bounce"
          >
            🤖
          </button>
        </>
      )}

      {/* Chat window */}
      {open && (

        <div className="w-80 h-80 bg-slate-50 shadow-2xl rounded-2xl p-4 relative border border-gray-200">

          <h2 className="absolute mt-1 left-1/2 -translate-x-1/2 font-semibold text-indigo-600 tracking-wide text-lg">
            CareerSync AI
          </h2>

          <button
            className="absolute right-3 top-3 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 transition flex items-center justify-center text-sm"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>

          {message && (

            <p className="absolute top-12 left-1/2 -translate-x-1/2 text-red-500 text-sm">
              {message}
            </p>

          )}

          <div className="mt-12 mb-16 overflow-y-auto h-44 bg-gradient-to-b from-slate-50 to-slate-100 rounded-2xl p-3 border border-slate-200">

            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-12">
                Ask career related questions...
              </p>
            )}

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`mb-3 p-3 rounded-2xl text-sm w-fit max-w-[80%] break-words ${msg.sender === "user"
                  ? "bg-indigo-500 text-white ml-auto"
                  : "bg-white border border-gray-200 text-gray-800"
                  }`}
              >
                {msg.text}
              </div>

            ))}

            <div ref={messagesEndRef}></div>

          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">

            <input
              type="text"
              placeholder="Ask something..."
              disabled={loading}
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 transition text-white px-4 py-2 rounded-xl disabled:opacity-50"
            >
              {loading ? "..." : "Send"}
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default chat;