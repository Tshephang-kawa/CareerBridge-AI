import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileText,
} from "lucide-react";
import { CVData, ChatMessage } from "../types";
import { sendChatMessage } from "../services/api";

interface CareerAiChatViewProps {
  cvData: CVData;
}

const SUGGESTED_PROMPTS = [
  "How can I prepare for a cybersecurity analyst interview?",
  "What projects can I build to demonstrate cloud skills?",
  "How do I explain an employment gap professionally?",
  "What certifications are most valuable for entry-level IT in South Africa?",
  "How do I negotiate salary for my first professional role?",
];

export const CareerAiChatView: React.FC<CareerAiChatViewProps> = ({ cvData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "ai",
      text: `Hello ${
        cvData.personal.fullName || "there"
      }! I am your CareerBridge AI Advisor. I can assist you with interview practice, upskilling strategies, portfolio guidance, and tailoring your professional story. How can I help you take your next career step today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeCvContext, setIncludeCvContext] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Build conversation history format
      const history = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        content: m.text,
      }));

      const response = await sendChatMessage({
        message: textToSend.trim(),
        history,
        cvContext: includeCvContext ? cvData : null,
      });

      const aiMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      let displayMessage = err.message || "Failed to connect to the career advisor.";
      try {
        if (typeof displayMessage === "string" && displayMessage.trim().startsWith("{") && displayMessage.trim().endsWith("}")) {
          const parsed = JSON.parse(displayMessage);
          if (parsed?.error?.message) {
            displayMessage = parsed.error.message;
          }
        }
      } catch {
        // keep displayMessage
      }

      const isDemand =
        displayMessage.toLowerCase().includes("high demand") ||
        displayMessage.toLowerCase().includes("503") ||
        displayMessage.toLowerCase().includes("unavailable") ||
        displayMessage.toLowerCase().includes("spikes in demand");

      const errorMsg: ChatMessage = {
        id: "err-" + Date.now(),
        sender: "ai",
        text: isDemand
          ? "Gemini is currently experiencing temporary high demand across Google servers. We attempted multiple retries and model fallbacks, but capacity was briefly limited. Click 'Retry Question' below to try again."
          : `We encountered an issue: ${displayMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
        canRetry: true,
        retryText: textToSend.trim(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear conversation history?")) {
      setMessages([
        {
          id: "msg-reset",
          sender: "ai",
          text: "Conversation cleared. What career question would you like to explore next?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const handleExportChat = () => {
    const exportText = messages
      .map((m) => `[${m.timestamp}] ${m.sender === "user" ? "You" : "CareerBridge AI"}:\n${m.text}\n`)
      .join("\n---\n\n");

    const blob = new Blob([exportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CareerBridge_AI_Chat_History_${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4 shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <Bot className="w-6 h-6 text-blue-600" />
              Career AI Counselor &amp; Interview Coach
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Gemini Conversational
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time personalized guidance on interview prep, career transitions, and skill development.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* CV Context Toggle */}
          <label className="flex items-center gap-2 text-xs text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-slate-50 shadow-xs transition">
            <input
              type="checkbox"
              checked={includeCvContext}
              onChange={(e) => setIncludeCvContext(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 bg-white"
            />
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">Attach My CV Context</span>
          </label>

          <button
            type="button"
            onClick={handleExportChat}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
            title="Download Transcript"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Ribbon */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">Try asking:</span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(prompt)}
            className="whitespace-nowrap px-3 py-1 text-xs rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-blue-600 shadow-xs transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === "ai";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  msg.isError
                    ? "bg-amber-100 text-amber-700 border border-amber-200"
                    : isAi
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-slate-200 text-slate-700 border border-slate-300"
                }`}
              >
                {msg.isError ? (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                ) : isAi ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              <div
                className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                  msg.isError
                    ? "bg-amber-50 border border-amber-200 text-amber-950"
                    : isAi
                    ? "bg-white border border-slate-200 text-slate-800"
                    : "bg-blue-600 text-white"
                }`}
              >
                <div
                  className={`flex items-center justify-between gap-4 pb-1 border-b text-[10px] ${
                    msg.isError
                      ? "border-amber-200 text-amber-700 font-medium"
                      : isAi
                      ? "border-slate-100 text-slate-400"
                      : "border-white/20 text-blue-100"
                  }`}
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    {msg.isError ? "Notice" : isAi ? "CareerBridge AI" : "You"}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="whitespace-pre-wrap pt-0.5 font-sans">{msg.text}</div>

                {msg.canRetry && msg.retryText && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => handleSend(msg.retryText)}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100/70 shadow-xs transition disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3 h-3 text-amber-700 ${loading ? "animate-spin" : ""}`} />
                      <span>Retry Question</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl mr-auto">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs text-blue-700 flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>CareerBridge AI is reviewing your request...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box & Disclaimer */}
      <div className="shrink-0 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about interview questions, career transitions, skills, or portfolio ideas..."
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-xs transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span>
            <strong>Scope Disclaimer:</strong> CareerBridge AI provides educational career coaching and does not offer legal, immigration, or financial advice.
          </span>
          <span className="hidden sm:inline">Powered by Gemini 3.8</span>
        </div>
      </div>
    </div>
  );
};
