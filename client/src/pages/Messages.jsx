import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Messages = () => {
    const [room, setRoom] = useState('general');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join_room', room);

        socketRef.current.on('receive_message', (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => socketRef.current.disconnect();
    }, [room]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (message.trim()) {
            const data = {
                roomId: room,
                message,
                sender: 'You',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            socketRef.current.emit('send_message', data);
            setMessage('');
        }
    };

    return (
        <div className="pt-24 px-6 max-w-5xl mx-auto pb-12 h-screen flex flex-col">
            <div className="glass-card flex-1 flex overflow-hidden">
                {/* Sidebar (Chats List) */}
                <div className="w-full md:w-80 border-r border-white/10 flex flex-col">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between">
                        <h2 className="font-bold">Messages</h2>
                        <MessageCircle size={20} className="text-lavender/40" />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-2">
                            <div className="bg-electric-blue/10 border border-electric-blue/20 p-4 rounded-2xl flex items-center space-x-3 cursor-pointer">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><User size={20} /></div>
                                <div>
                                    <div className="text-sm font-bold">Lost & Found Bot</div>
                                    <div className="text-[10px] text-lavender/60">System Notification</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-1 flex-col">
                    <div className="p-6 border-b border-white/10 flex items-center space-x-4">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><User size={20} /></div>
                        <div>
                            <div className="font-bold">Chat Support</div>
                            <div className="text-[10px] text-green-400">Online</div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: msg.sender === 'You' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm ${
                                        msg.sender === 'You' ? 'bg-electric-blue text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-lavender rounded-tl-none'
                                    }`}>
                                        <div className="font-bold text-[10px] mb-1 opacity-60">{msg.sender} • {msg.time}</div>
                                        {msg.message}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    <form onSubmit={sendMessage} className="p-6 border-t border-white/10 flex gap-4">
                        <input 
                            className="input-field" 
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button type="submit" className="btn-primary px-4">
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Messages;
