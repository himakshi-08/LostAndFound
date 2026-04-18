import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Trash2, ExternalLink, MapPin, Calendar, Clock, AlertCircle, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemCard = ({ item, onDelete, onViewDetails }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => onViewDetails(item)}
        className="glass-card overflow-hidden group flex flex-col h-full cursor-pointer"
    >
        <div className="relative h-56">
            <img 
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1590370221379-33b6838a6a6d?w=800&q=80'} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                item.type === 'lost' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'
            }`}>
                {item.type}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent opacity-60"></div>
        </div>

        <div className="p-6 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold group-hover:text-electric-blue transition-colors leading-tight">{item.title}</h3>
            </div>
            
            <p className="text-lavender/50 text-xs mb-6 line-clamp-2 leading-relaxed italic">
                "{item.description}"
            </p>

            <div className="space-y-3 mb-8">
                <div className="flex items-center text-[10px] font-medium text-lavender/40 uppercase tracking-widest">
                    <MapPin size={14} className="mr-2 text-electric-blue" />
                    <span>{item.location}</span>
                </div>
                <div className="flex items-center text-[10px] font-medium text-lavender/40 uppercase tracking-widest">
                    <Calendar size={14} className="mr-2 text-electric-blue" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
            </div>

            <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between">
                <Link 
                    to={`/matches`} 
                    state={{ newItem: item, matches: [] }} 
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-electric-blue hover:text-white transition-all group/link"
                >
                    <span>View Matches</span>
                    <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </Link>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item._id);
                    }} 
                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                    title="Delete Report"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </motion.div>
);

const ItemDetailModal = ({ item, isOpen, onClose, onScanMatches }) => {
    if (!isOpen || !item) return null;

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
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-lavender hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="relative h-64 overflow-hidden">
                        <img
                            src={item.images?.[0] || 'https://images.unsplash.com/photo-1590370221379-33b6838a6a6d?w=800&q=80'}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        <div className={`absolute top-4 left-4 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                            item.type === 'lost' ? 'bg-red-500/30 text-red-200 border border-red-500/50' : 'bg-green-500/30 text-green-200 border border-green-500/50'
                        }`}>
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
                            <p className="text-lavender leading-relaxed text-base">{item.description}</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Location</div>
                                <div className="flex items-start text-sm">
                                    <MapPin size={16} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{item.location}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Date</div>
                                <div className="flex items-start text-sm">
                                    <Calendar size={16} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{new Date(item.date).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="text-[10px] text-lavender/40 uppercase font-bold tracking-widest mb-2">Category</div>
                                <div className="flex items-start text-sm">
                                    <Tag size={16} className="mr-2 text-electric-blue shrink-0 mt-0.5" />
                                    <span className="text-lavender font-semibold">{item.category || 'General'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                            <span className="text-sm font-semibold text-lavender/60">Status</span>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                                item.status === 'active'
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : item.status === 'matched'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                                {item.status || 'Active'}
                            </span>
                        </div>

                        <Link
                            to="/matches"
                            state={{ newItem: item, matches: [] }}
                            className="w-full block py-4 bg-gradient-to-r from-electric-blue to-blue-600 rounded-xl font-black uppercase tracking-widest text-white text-center hover:shadow-lg hover:shadow-electric-blue/50 transition-all"
                        >
                            Scan for Matches →
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

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
                const res = await axios.get('http://localhost:5000/api/items/my-items');
                setItems(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('This action will permanently remove this report. Continue?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/items/${id}`);
            setItems(items.filter(i => i._id !== id));
        } catch (err) {
            console.error(err);
            alert('Error deleting item');
        }
    };

    const filteredItems = items.filter(i => i.type === activeTab);

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
                        className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'lost' ? 'bg-electric-blue text-white shadow-lg shadow-blue-500/20' : 'text-lavender/40 hover:text-lavender'
                        }`}
                    >
                        Lost ({items.filter(i => i.type === 'lost').length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('found')}
                        className={`px-10 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'found' ? 'bg-electric-blue text-white shadow-lg shadow-blue-500/20' : 'text-lavender/40 hover:text-lavender'
                        }`}
                    >
                        Found ({items.filter(i => i.type === 'found').length})
                    </button>
                </div>
            </header>

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
                    <p className="text-lavender/40 max-w-xs text-sm">
                        You haven't reported any {activeTab} items yet. Once you do, they'll appear here for easy tracking.
                    </p>
                    <Link to={activeTab === 'lost' ? '/report-lost' : '/report-found'} className="mt-8 text-electric-blue font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors">
                        Report an item now <ArrowRight size={14} className="inline ml-1" />
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
