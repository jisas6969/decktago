'use client';
import { getDoc } from "firebase/firestore"
import { useEffect, useState, useRef } from 'react';
import { MessageCircle, MoreVertical, X } from 'lucide-react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';

export default function ChatWidget() {
  const { user, userData } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const chatId = user?.uid;

  useEffect(() => {
  if (!user?.uid || !userData) return;

  const createChatIfNotExists = async () => {
    const ref = doc(db, 'chats', chatId);
    const snap = await getDoc(ref);

    // 🔴 CREATE ONLY IF NOT EXIST
    if (!snap.exists()) {
      await setDoc(ref, {
        userId: chatId,
        fullName: userData.fullName,
        companyName: userData.companyName,
        role: userData.role,
        createdAt: new Date(),
      });
    }
  };

  createChatIfNotExists();
}, [chatId, userData]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
  if (!text.trim() || !chatId) return;

  if (editingId) {
    await updateDoc(
      doc(db, 'chats', chatId, 'messages', editingId),
      { text }
    );
    setEditingId(null);
    setText('');
    return;
  }

  // 🔴 SHOW CHAT AGAIN SA SALES
  await setDoc(
    doc(db, 'chats', chatId),
    {
      hiddenForSales: false,
      updatedAt: new Date()
    },
    { merge: true }
  );

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
      <div
        onClick={() => user && setOpen(!open)}
        className="fixed bottom-6 right-6 bg-[#2787b4] text-white p-5 rounded-full shadow-xl cursor-pointer hover:bg-[#1f6f94] z-50 transition"
      >
        <MessageCircle className="w-7 h-7" />
      </div>

      {user && open && (
        <div className="fixed bottom-0 sm:bottom-24 right-0 sm:right-6 w-full sm:w-[420px] h-[85vh] sm:h-[520px] z-50">
          <div className="bg-white shadow-2xl rounded-2xl flex flex-col border overflow-hidden h-full">

            {/* HEADER */}
            <div className="bg-[#2787b4] text-white px-4 py-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Customer Support</span>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* MESSAGES */}
            <div className="relative flex-1 min-h-0">

              {editingId && (
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] z-10" />
              )}

              <div
  className={`p-4 overflow-y-auto space-y-4 bg-gray-50 h-full min-h-0 ${
    editingId ? 'pointer-events-none select-none' : ''
  }`}
>
                {messages.map((m, index) => {
  const isCustomer = m.sender === 'customer';
  const isTopMessage = index < 2;

  const currentTime = m.createdAt?.seconds
    ? m.createdAt.seconds * 1000
    : 0;

  const isEditable =
    Date.now() - currentTime <= 15 * 60 * 1000;

  const time = m.createdAt?.toDate
    ? m.createdAt.toDate().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '';

  return (
    <div key={m.id}>
      
      {/* 🕒 TIMESTAMP */}
      <div className="flex justify-center my-2">
        <div className="text-[11px] text-gray-400">
          {time}
        </div>
      </div>

      {/* 💬 ROW */}
      <div
  className={`group flex ${
    isCustomer ? 'justify-end' : 'justify-start'
  }`}
>
  <div className="flex items-end gap-1 max-w-[75%]">

    {/* ⋮ BUTTON (LEFT, DIKIT) */}
    {isCustomer && (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpenId(menuOpenId === m.id ? null : m.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-gray-700 w-6 h-6 flex items-center justify-center"
        >
          <MoreVertical size={16} />
        </button>

        {menuOpenId === m.id && (
          <div className="absolute left-0 bottom-8 bg-white border rounded shadow text-sm z-10">
            {isEditable && (
              <button
                onClick={() => {
                  setEditingId(m.id);
                  setText(m.text);
                  setMenuOpenId(null);
                }}
                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                Edit
              </button>
            )}

            <button
              onClick={async () => {
                await deleteDoc(
                  doc(db, 'chats', chatId!, 'messages', m.id)
                );
                setMenuOpenId(null);
              }}
              className="block px-4 py-2 hover:bg-red-100 text-red-600 w-full text-left"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    )}

    {/* 💬 BUBBLE */}
    <div
      className={`px-3 py-1.5 rounded-2xl text-sm ${
        isCustomer
          ? 'bg-[#2787b4] text-white'
          : 'bg-gray-200 text-gray-800'
      }`}
    >
      {m.text}
    </div>

  </div>
</div>
    </div>
  );
})}
                <div ref={bottomRef} />
              </div>
            </div>

            {/* INPUT */}
            <div className="p-2 border-t bg-white">
              {editingId && (
                <div className="text-xs text-gray-500 px-2 mb-1">
                  Editing message...
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2787b4]"
                  placeholder="Type your message..."
                />

                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setText('');
                    }}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <X size={18} />
                  </button>
                )}

                <button
                  onClick={sendMessage}
                  className="bg-[#2787b4] text-white px-4 py-2 rounded-full text-sm hover:bg-[#1f6f94]"
                >
                  {editingId ? 'Update' : 'Send'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}