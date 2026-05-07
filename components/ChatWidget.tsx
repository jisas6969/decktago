'use client';
import { useRouter } from 'next/navigation';
import {
  Send,
  Check,
  ImagePlus
} from 'lucide-react';
import axios from 'axios';
import { getAutoReply, getWelcomeMessage } from '@/lib/chatbot';
import { getDoc } from "firebase/firestore"
import { useEffect, useState, useRef } from 'react';
import { MoreVertical, X } from 'lucide-react';
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
  increment,
} from 'firebase/firestore';
import { useAuth } from '@/app/context/AuthContext';
type ChatMessage = {
  id: string;
  text?: string;
  sender?: string;
  createdAt?: any;
  isRead?: boolean;

  orderItems?: any[];
  orderTotal?: number;
  orderId?: string;
  image?: string;
};


export default function ChatWidget() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const chatId = user?.uid;
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const replyTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
  if (!user?.uid || !userData) return;

  const createChatIfNotExists = async () => {
    const ref = doc(db, 'chats', chatId!);
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
}, [user?.uid, userData]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, async (snap) => {
  const newMessages: ChatMessage[] = snap.docs.map((d) => ({
  id: d.id,
  ...(d.data() as Omit<ChatMessage, 'id'>),
}));
  const hasSalesMessage = newMessages.some(m => m.sender === 'sales');

if (!hasSalesMessage && chatId && newMessages.length === 0) {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    text: getWelcomeMessage(),
    sender: 'sales',
    createdAt: new Date(),
    isRead: false,
  });
}
  

  const unread = newMessages.filter(
  (m) =>
    m.sender === 'sales' && // 🔴 ONLY SALES
    !m.isRead
).length;

  setUnreadCount(unread);
  setMessages(newMessages);
});

    return () => unsub();
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  useEffect(() => {
  const close = (e: any) => {
    // ❌ huwag mag-close kung click ay nasa menu
    if (e.target.closest('.chat-menu')) return;

    setMenuOpenId(null);
  };

  window.addEventListener('click', close);
  return () => window.removeEventListener('click', close);
}, []);
  const markAsRead = async () => {
  if (!chatId) return;

  const unreadMessages = messages.filter(
  (m) =>
    m.sender === 'sales' &&
    !m.isRead
);

  for (const m of unreadMessages) {
    await updateDoc(
      doc(db, 'chats', chatId, 'messages', m.id),
      { isRead: true }
    );
  }
};
const handleImageUpload = async (file: File) => {
  if (!chatId) return;

  try {
    setUploading(true);
    const data = new FormData();

    data.append('file', file);

    data.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
    );

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      data
    );

    const imageUrl = res.data.secure_url;

    await addDoc(
      collection(db, 'chats', chatId, 'messages'),
      {
        sender: 'customer',
        image: imageUrl,
        createdAt: new Date(),
        isRead: false,
      }
    );
    setUploading(false);
    bottomRef.current?.scrollIntoView({
  behavior: 'smooth',
});
  } catch (err) {
  setUploading(false);
  console.error(err);
}
};

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
  isRead: false, // 🔴 ADD THIS
});
  await updateDoc(doc(db, 'chats', chatId), {
    lastMessage: text,
    lastTime: new Date(),
    lastSender: 'customer',
    unreadCount_sales: increment(1),
});
const userMessage = text;

setText('');

// clear previous timer
if (replyTimeout.current) {
  clearTimeout(replyTimeout.current);
}

// set new timer
replyTimeout.current = setTimeout(async () => {
  const reply = getAutoReply(userMessage);

  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    text: reply,
    sender: 'sales',
    createdAt: new Date(),
    isRead: false,
  });
}, 3000); // 3 seconds delay
};

  return (
    <>
     <div
  onClick={() => {
    if (user) {
      setOpen(!open);
      if (!open) markAsRead();
    }
  }}
  className="fixed bottom-6 right-6 z-50"
>
  {/* 🔵 BUTTON (unchanged mo) */}
  <div className="cursor-pointer flex items-center justify-center">
  <img
    src="/chat.png" // 👉 palitan mo ng logo mo
    alt="chat"
    className="w-15 h-15 transition hover:scale-110 active:scale-95"
  />
</div>

  {/* 🔴 BADGE (separate, hindi nakaka-apekto sa size) */}
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {unreadCount}
    </span>
  )}
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
                  const handleLongPressStart = (id: string) => {
  longPressTimeout.current = setTimeout(() => {
    navigator.vibrate?.(50);
    setMenuOpenId(id);
  }, 500);
};

const handleLongPressEnd = () => {
  if (longPressTimeout.current) {
    clearTimeout(longPressTimeout.current);
  }
};

  const isCustomer = m.sender === 'customer';

  const currentTime = m.createdAt?.seconds
    ? m.createdAt.seconds * 1000
    : 0;
  const prev = messages[index - 1];

const prevTime = prev?.createdAt?.seconds
  ? prev.createdAt.seconds * 1000
  : 0;

const currTime = m.createdAt?.seconds
  ? m.createdAt.seconds * 1000
  : 0;

const showTime =
  index === 0 || (currTime - prevTime) > 5 * 60 * 1000;                
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
      {showTime && (
  <div className="flex justify-center my-2">
    <div className="text-[11px] text-gray-400">
      {time}
    </div>
  </div>
)}

      {/* 💬 ROW */}
      <div
  className={`group flex ${
    isCustomer ? 'justify-end' : 'justify-start'
  }`}
>
  <div className="flex items-end gap-1 max-w-[75%]">

    {/* ⋮ BUTTON (LEFT, DIKIT) */}
    {isCustomer && !m.orderItems && (
      <div className="relative">
        <button
  onClick={(e) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === m.id ? null : m.id);
  }}
  className="hidden sm:flex opacity-0 sm:group-hover:opacity-100 transition text-gray-400 hover:text-gray-700 w-6 h-6 items-center justify-center"
>
  <MoreVertical size={16} />
</button>

        {menuOpenId === m.id && (
          <div className="chat-menu absolute left-0 bottom-8 bg-white border rounded shadow text-sm z-10">
            {isEditable && (
              <button
                onClick={() => {
                  setEditingId(m.id);
                  setText(m.text || '');
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
  onClick={() => {
    if (m.orderId) {
  setOpen(false);

  setTimeout(() => {
    router.push(`/orders/${m.orderId}`);
  }, 150);
}
  }}
  onTouchStart={() =>
    isCustomer &&
    !m.orderItems &&
    handleLongPressStart(m.id)
  }
  onTouchEnd={handleLongPressEnd}
  onMouseDown={() =>
    isCustomer &&
    !m.orderItems &&
    handleLongPressStart(m.id)
  }
  onMouseUp={handleLongPressEnd}
  className={`text-sm transition ${
  m.image
    ? ''
    : 'px-3 py-1.5 rounded-2xl'
} ${
  m.orderId
    ? 'cursor-pointer hover:scale-[1.01]'
    : ''
} ${
  isCustomer
    ? m.image
      ? ''
      : 'bg-[#2787b4] text-white'
    : m.image
      ? ''
      : 'bg-gray-200 text-gray-800'
}`}
>
      {m.orderItems ? (

  <div className="space-y-3">

    <p className="font-semibold flex items-center justify-between">
  <span>New Order Placed</span>

  <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full">
    Tap to view
  </span>
</p>

    {m.orderItems.map((item: any) => (
      <div
        key={item.id}
        className="flex gap-3 border rounded-xl p-2 bg-white/10"
      >

        <img
          src={item.image || '/placeholder.png'}
          alt={item.name}
          className="w-14 h-14 rounded object-cover"
        />

        <div className="flex-1">

          <p className="font-medium">
            {item.name}
          </p>

          <p className="text-xs opacity-80">
            Qty: {item.quantity} kg
          </p>

          <p className="text-xs opacity-80">
            ₱ {item.price.toLocaleString()}
          </p>

          <p className="text-xs font-semibold">
            Subtotal:
            ₱ {(item.price * item.quantity).toLocaleString()}
          </p>

        </div>

      </div>
    ))}

    <div className="font-bold pt-2 border-t">
      Total: ₱ {m.orderTotal?.toLocaleString()}
    </div>

  </div>

) : m.image ? (

  <img
  src={m.image}
  alt="attachment"
  onClick={() => setPreviewImage(m.image!)}
  className="max-w-[220px] rounded-2xl object-cover shadow cursor-pointer hover:opacity-95 transition"
/>

) : (
  m.text
)}
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
                <label
  className={`cursor-pointer p-2 ${
    uploading
      ? 'opacity-50 pointer-events-none'
      : 'text-gray-400 hover:text-[#2787b4]'
  }`}
>

  <ImagePlus size={20} />

  <input
    type="file"
    accept="image/*"
    className="hidden"
    onChange={async (e) => {
      const file = e.target.files?.[0];

      if (file) {
        await handleImageUpload(file);
      }
    }}
  />
</label>
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
  disabled={!text.trim()}
  className="p-2 flex items-center justify-center transition duration-200"
>
  {editingId ? (
    <Check
      size={20}
      className="text-[#2787b4] hover:text-[#1f6f94] hover:scale-110 transition"
    />
  ) : (
    <Send
      size={20}
      className={`rotate-45 transition duration-200
        ${
          text.trim()
            ? 'text-[#2787b4] hover:text-[#1f6f94] hover:scale-110 hover:-translate-y-[1px]'
            : 'text-gray-300'
        }
      `}
    />
  )}
</button>
              </div>
            </div>

          </div>
        </div>
      )}
      {previewImage && (
  <div
    className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4"
    onClick={() => setPreviewImage(null)}
  >

    <button
      className="absolute top-4 right-4 text-white text-3xl"
      onClick={() => setPreviewImage(null)}
    >
      ✕
    </button>

    <img
      src={previewImage}
      alt="preview"
      className="max-w-full max-h-full rounded-xl"
      onClick={(e) => e.stopPropagation()}
    />

  </div>
)}
    </>
  );
}