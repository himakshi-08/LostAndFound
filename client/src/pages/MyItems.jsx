import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, ExternalLink, MapPin, Calendar, AlertCircle, ArrowRight, X, Tag, Shield, CheckCircle, Clock, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({ headers: { 'x-auth-token': getToken() } });

const categoryEmoji = {
    'Electronics': '🎧',
    'Wallets & Purses': '👜',
    'ID Cards': '🪪',
    'Keys': '🔑',
    'Books & Stationery': '📚',
    'Clothing': '👕',
    'Water Bottles': '💧',
    'Others': '📦',
};

// ─── Claims Section for a Found Item ────────────────────────────────────────
const ClaimsList = ({ item }) => {
    const [open, setOpen] = useState(false);
    const claims = item.claims || [];

    if (claims.length === 0) return (
        <div className="mt-3 text-[10px] text-lavender/30 uppercase tracking-widest font-bold text-center py-2 bg-white/5 rounded-lg border border-white/5">
            No claims yet
        </div>
    );

    return (
        <div className="mt-3">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(o => !o); }}
                className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest py-2 px-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all"
            >
                <span className="flex items-center gap-2">
                    <Shield size={12} />
                    {claims.length} Pending Claim{claims.length > 1 ? 's' : ''}
                </span>
                {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="mt-2 space-y-2">
                            {claims.map((claim, i) => (
                                <div
                                    key={i}
                                    onClick={(e) => e.stopPropagation()}
                                    className={`rounded-xl p-3 border text-xs ${claim.status === 'verified'
                                        ? 'bg-green-500/10 border-green-500/20'
                                        : claim.status === 'rejected'
                                            ? 'bg-red-500/10 border-red-500/20'
                                            : 'bg-white/5 border-white/10'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2 font-bold text-lavender">
                                            <User size={11} className="text-electric-blue" />
                                            {claim.user?.name || 'Unknown User'}
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${claim.status === 'verified' ? 'bg-green-500/20 text-green-400' :
                                            claim.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                            }`}>
                                            {claim.status}
                                        </span>
                                    </div>
                                    <p className="text-lavender/40 text-[9px]">
                                        Claimed on {new Date(claim.createdAt).toLocaleDateString()}
                                    </p>
                                    {claim.status === 'pending' && (
                                        <p className="text-lavender/50 text-[9px] mt-1 italic">
                                            Waiting for them to answer your verification questions.
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// ─── Item Card ────────────────────────────────────────────────────────────────
const ItemCard = ({ item, onDelete, onViewDetails }) => {
    const emoji = categoryEmoji[item.category] || '📦';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => onViewDetails(item)}
            className="glass-card overflow-hidden group flex flex-col h-full cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-48">
                {item.images?.[0] ? (
                    <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center text-6xl ${item.type === 'lost' ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
                        {emoji}
                    </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${item.type === 'lost' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'}`}>
                    {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                </div>
                {/* Status badge */}
                <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${item.status === 'matched' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'}`}>
                    {item.status === 'matched' ? <CheckCircle size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                    {item.status}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-electric-blue transition-colors leading-tight">{item.title}</h3>
                </div>

                <p className="text-lavender/50 text-xs mb-4 line-clamp-2 leading-relaxed italic">
                    "{item.description}"
                </p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-[10px] font-medium text-lavender/40 uppercase tracking-widest">
                        <MapPin size={13} className="mr-2 text-electric-blue" />
                        <span>{item.location}</span>
                    </div>
                    <div className="flex items-center text-[10px] font-medium text-lavender/40 uppercase tracking-widest">
                        <Calendar size={13} className="mr-2 text-electric-blue" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-[10px] font-medium text-lavender/40 uppercase tracking-widest">
                        <Tag size={13} className="mr-2 text-electric-blue" />
                        <span>{item.category}</span>
                    </div>
                </div>

                {/* For FOUND items: show who claimed */}
                {item.type === 'found' && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <ClaimsList item={item} />
                    </div>
                )}

                {/* For LOST items: link to matches */}
                {item.type === 'lost' && (
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <Link
                            to="/matches"
                            state={{ newItem: item, matches: [], mode: 'loser' }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-electric-blue hover:text-white transition-all group/link"
                        >
                            <span>View AI Matches</span>
                            <ExternalLink size={13} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                        </Link>
                    </div>
                )}

                {/* Delete button */}
                <div className="mt-3 flex justify-end">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item._id);
                        }}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Report"
                    >
                        <Trash2 size={15} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Item Detail Modal ────────────────────────────────────────────────────────
const ItemDetailModal = ({ item, isOpen, onClose }) => {
    if (!isOpen || !item) return null;
    const emoji = categoryEmoji[item.category] || '📦';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10"
                >
                    <div className="sticky top-0 flex justify-end p-4 border-b border-white/5 bg-indigo-950/50 backdrop-blur-md z-10">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                        {item.images?.[0] ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className={`w-full h-full flex items-center justify-center text-7xl ${item.type === 'lost' ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
                                {emoji}
                            </div>
                        )}
                        <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${item.type === 'lost' ? 'bg-red-500/30 text-red-200 border border-red-500/50' : 'bg-green-500/30 text-green-200 border border-green-500/50'}`}>
                            {item.type === 'lost' ? 'Lost Item' : 'Found Item'}
                        </div>
                    </div>

                    <div className="p-8 space-y-6">
                        <div>
                            <h1 className="text-4xl font-black mb-2">{item.title}</h1>
                            <p className="text-lavender/60 text-lg">
                                <span className="text-electric-blue font-bold">{item.type === 'lost' ? 'LOST' : 'FOUND'}</span> on campus
                            </p>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <p className="text-lavender leading-relaxed">{item.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Location</div>
                                <div className="flex items-start text-sm">
                                    <MapPin size={15} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{item.location}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Date</div>
                                <div className="flex items-start text-sm">
                                    <Calendar size={15} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Category</div>
                                <div className="flex items-start text-sm">
                                    <Tag size={15} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{item.category || 'General'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                            <span className="text-sm font-semibold text-lavender/60">Status</span>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${item.status === 'active'
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                : item.status === 'matched'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                                }`}>
                                {item.status || 'Active'}
                            </span>
                        </div>

                        {/* Verification questions shown to the found-item owner */}
                        {item.type === 'found' && item.verificationQuestions?.length > 0 && (
                            <div className="bg-electric-blue/5 border border-electric-blue/20 rounded-xl p-6">
                                <div className="flex items-center mb-4">
                                    <Shield size={16} className="mr-2 text-electric-blue" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-electric-blue">Your Verification Questions</span>
                                </div>
                                <div className="space-y-3">
                                    {item.verificationQuestions.map((q, i) => (
                                        <div key={i} className="bg-white/5 rounded-lg p-3 border border-white/5">
                                            <p className="text-xs font-bold text-lavender mb-1">{q.question}</p>
                                            <p className="text-[10px] text-lavender/40">Answer: <span className="text-green-400">{q.answer}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Claims list in modal for found items */}
                        {item.type === 'found' && (
                            <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-lavender/40 mb-3">Claims Received</div>
                                <ClaimsList item={item} />
                            </div>
                        )}

                        {/* View Matches for lost items */}
                        {item.type === 'lost' && (
                            <Link
                                to="/matches"
                                state={{ newItem: item, matches: [], mode: 'loser' }}
                                className="w-full block py-4 bg-gradient-to-r from-electric-blue to-blue-600 rounded-xl font-black uppercase tracking-widest text-white text-center hover:shadow-lg hover:shadow-electric-blue/50 transition-all"
                                onClick={onClose}
                            >
                                Scan for Found Matches →
                            </Link>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── My Items Page ────────────────────────────────────────────────────────────
const MyItems = () => {
    const [items, setItems] = useState([]);
    const [activeTab, setActiveTab] = useState('lost');
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                // Include auth token in request
                const res = await axios.get('http://localhost:5000/api/items/my-items', authHeaders());
                setItems(res.data);
            } catch (err) {
                console.error('Error fetching my items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('This action will permanently remove this report. Continue?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`, authHeaders());
            setItems(items.filter(i => i._id !== id));
        } catch (err) {
            console.error(err);
            alert('Error deleting item. Please try again.');
        }
    };

    const filteredItems = items.filter(i => i.type === activeTab);
    const lostCount = items.filter(i => i.type === 'lost').length;
    const foundCount = items.filter(i => i.type === 'found').length;

    return (
        <div className="pt-24 px-6 max-w-6xl mx-auto pb-20 min-h-screen">
            <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-electric-blue mb-1">
                        <Package size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">My Reports</h1>
                    <p className="text-lavender/40 max-w-sm text-sm">Track and manage your reported lost and found items on campus.</p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <button
                        onClick={() => setActiveTab('lost')}
                        className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'lost' ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/20' : 'text-lavender/40 hover:text-lavender'}`}
                    >
                        🔴 Lost ({lostCount})
                    </button>
                    <button
                        onClick={() => setActiveTab('found')}
                        className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'found' ? 'bg-green-600/80 text-white shadow-lg shadow-green-500/20' : 'text-lavender/40 hover:text-lavender'}`}
                    >
                        🟢 Found ({foundCount})
                    </button>
                </div>
            </header>

            {/* Info banner for found tab */}
            {activeTab === 'found' && foundCount > 0 && (
                <div className="mb-8 bg-electric-blue/5 border border-electric-blue/20 rounded-2xl p-5 flex items-start gap-4">
                    <Shield size={20} className="text-electric-blue shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-electric-blue mb-1">You are a Finder</p>
                        <p className="text-xs text-lavender/50 leading-relaxed">
                            People who lost items may claim your found reports. They must answer your verification questions correctly before the item is marked as matched. Check claims below each card.
                        </p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="glass-card h-[450px] animate-pulse"></div>
                    ))}
                </div>
            ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map(item => (
                            <ItemCard key={item._id} item={item} onDelete={handleDelete} onViewDetails={handleViewDetails} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card py-32 flex flex-col items-center justify-center text-center border-dashed border-white/10"
                >
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8">
                        <AlertCircle size={40} className="text-lavender/20" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">No {activeTab} items found</h2>
                    <p className="text-lavender/40 max-w-xs text-sm mb-8">
                        {activeTab === 'lost'
                            ? "You haven't reported any lost items yet."
                            : "You haven't reported any found items yet. If you found something on campus, report it to help reunite it with its owner!"}
                    </p>
                    <Link
                        to={activeTab === 'lost' ? '/report-lost' : '/report-found'}
                        className="mt-2 btn-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        {activeTab === 'lost' ? 'Report Lost Item' : 'Report Found Item'}
                        <ArrowRight size={14} />
                    </Link>
                </motion.div>
            )}

            <ItemDetailModal
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </div>
    );
};

export default MyItems;
