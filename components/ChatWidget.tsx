'use client';

import { useEffect, useState, useRef } from 'react';
import { MessageCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
} from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';

export default function ChatWidget() {
  const { user, userData } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chatId = user?.uid;

  // ✅ Create chat document with user info
  useEffect(() => {
    if (!chatId || !userData) return;

    setDoc(
      doc(db, 'chats', chatId),
      {
        userId: chatId,
        fullName: userData.fullName,
        companyName: userData.companyName,
        role: userData.role,
        createdAt: new Date(),
      },
      { merge: true }
    );
  }, [chatId, userData]);

  // ✅ Listen to messages
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => d.data()));
    });

    return () => unsub();
  }, [chatId]);

  // ✅ Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    if (!text.trim() || !chatId) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      sender: userData?.role?.toLowerCase() || 'customer',
      fullName: userData?.fullName || 'Unknown',
      companyName: userData?.companyName || '',
      createdAt: new Date(),
    });

    setText('');
  };

  return (
    <>
      {/* 🔵 FLOATING BUTTON */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#2787b4] text-white p-5 rounded-full shadow-xl cursor-pointer hover:bg-[#1f6f94] z-50 transition"
      >
        <MessageCircle className="w-7 h-7" />
      </div>

      {/* 💬 CHAT BOX */}
      {open && (
        <div className="
  fixed 
  bottom-0 sm:bottom-24 
  right-0 sm:right-6 
  w-full sm:w-[420px] 
  h-[85vh] sm:h-[520px] 
  bg-white 
  shadow-2xl 
  rounded-t-2xl sm:rounded-2xl 
  flex flex-col 
  z-50 
  border 
  overflow-hidden
">

          {/* HEADER */}
          <div className="bg-[#2787b4] text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold text-lg">Customer Support</span>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] ${
                  m.sender === 'customer' ? 'ml-auto text-right' : ''
                }`}
              >
                {/* 👤 NAME (OUTSIDE BUBBLE) */}
                <div className="text-[11px] text-gray-500 mb-1 truncate">
                  {m.fullName} {m.companyName && `• ${m.companyName}`}
                </div>

                {/* 💬 MESSAGE BUBBLE */}
                <div
                  className={`px-4 py-2 rounded-2xl text-sm w-fit break-words ${
                    m.sender === 'customer'
                      ? 'bg-[#2787b4] text-white ml-auto'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2787b4]"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-[#2787b4] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1f6f94]"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}