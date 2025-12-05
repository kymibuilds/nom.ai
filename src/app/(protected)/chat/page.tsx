/* "use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

type Message = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    // 1. Fetch old messages
    supabase
      .from("Message")
      .select("*")
      .order("createdAt", { ascending: true })
      .then(({ data }) => setMessages(data ?? []));

    // 2. Subscribe to new ones
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="p-6 text-white">
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  );
}
 */
