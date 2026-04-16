import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon, Search, Package, CheckCircle, Clock, AlertCircle, MapPin, Tag, Calendar, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const statusConfig = {
    active: { color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock, label: 'Active' },
    matched: { color: 'text-green-400 bg-green-400/10 border-green-400/20', icon: CheckCircle, label: 'Matched' },
    claimed: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle, label: 'Claimed' },
};

const typeConfig = {
    lost: { color: 'text-red-400', label: 'Lost' },
    found: { color: 'text-green-400', label: 'Found' },
};

// Category emoji fallbacks for items without uploaded images
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

const ItemCard = ({ item }) => {
    const status = statusConfig[item.status] || statusConfig.active;
    const StatusIcon = status.icon;
    const typeInfo = typeConfig[item.type] || typeConfig.lost;
    const emoji = categoryEmoji[item.category] || '📦';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden hover:bg-white/[0.04] transition-all"
        >
            {/* Image / Emoji Banner */}
            <div className={`relative h-36 flex items-center justify-center ${item.type === 'lost' ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-6xl">{emoji}</span>
                )}
                <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${item.type === 'lost' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${status.color} flex items-center`}>
                        <StatusIcon size={10} className="mr-1" />
                        {status.label}
                    </span>
                </div>
            </div>

            <div className="p-5">
                <h3 className="text-base font-black tracking-tight mb-2">{item.title}</h3>
                <p className="text-lavender/50 text-xs mb-4 leading-relaxed line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-2 text-[10px] text-lavender/40 font-bold uppercase tracking-widest mb-4">
                    <span className="flex items-center"><Tag size={11} className="mr-1 text-electric-blue" />{item.category}</span>
                    <span className="flex items-center"><MapPin size={11} className="mr-1 text-electric-blue" />{item.location}</span>
                    <span className="flex items-center"><Calendar size={11} className="mr-1 text-electric-blue" />{new Date(item.date).toLocaleDateString()}</span>
                </div>

                <Link
                    to="/matches"
                    state={{ newItem: item, matches: [] }}
                    className="btn-primary py-2 w-full text-center text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 group"
                >
                    <Search size={12} />
                    <span>Scan for Matches</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
};

const Activity = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const { user } = useAuth();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch all active items for activity feed
                const res = await axios.get('http://localhost:5000/api/items/all');
                setItems(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    const filtered = items.filter(item => {
        const matchesType = filter === 'all' ? true : item.type === filter;
        const matchesCategory = selectedCategory === 'All Categories' ? true : item.category === selectedCategory;
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesCategory && matchesSearch;
    });

    const lostCount = items.filter(i => i.type === 'lost').length;
    const foundCount = items.filter(i => i.type === 'found').length;
    const categoriesList = ['All Categories', ...Object.keys(categoryEmoji)];

    return (
        <div className="pt-24 px-6 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center space-x-3 mb-3">
                    <ActivityIcon size={24} className="text-electric-blue" />
                    <h1 className="text-4xl font-black tracking-tight">Activity Feed</h1>
                </div>
                <p className="text-lavender/40 text-sm">All active lost and found reports across campus. Be a hero — help someone find their item!</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="glass-card p-5 text-center">
                    <div className="text-3xl font-black text-electric-blue mb-1">{items.length}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-lavender/40">Total Reports</div>
                </div>
                <div className="glass-card p-5 text-center">
                    <div className="text-3xl font-black text-red-400 mb-1">{lostCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-lavender/40">Lost Items</div>
                </div>
                <div className="glass-card p-5 text-center">
                    <div className="text-3xl font-black text-green-400 mb-1">{foundCount}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-lavender/40">Found Items</div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
                <div className="md:col-span-6 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-lavender/30 group-focus-within:text-electric-blue transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search items, locations, or descriptions..." 
                        className="input-field pl-12 py-3.5 text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="md:col-span-3">
                    <select 
                        className="input-field py-3.5 text-sm appearance-none"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categoriesList.map(c => <option key={c} value={c} className="bg-indigo-900">{c}</option>)}
                    </select>
                </div>
                <div className="md:col-span-3 flex space-x-2">
                    {['all', 'lost', 'found'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === f ? 'bg-electric-blue text-white shadow-lg' : 'glass-card text-lavender/50 hover:text-white border-white/5'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Items Grid */}
            {loading ? (
                <div className="text-center py-20 text-lavender/40">Loading activity feed...</div>
            ) : filtered.length === 0 ? (
                <div className="glass-card p-16 text-center">
                    <Package size={48} className="mx-auto mb-4 text-lavender/20" />
                    <h3 className="text-xl font-bold mb-2">No Reports Yet</h3>
                    <p className="text-lavender/40 mb-6 text-sm">Be the first to report a lost or found item on campus!</p>
                    <Link to="/report-lost" className="btn-primary px-8">Report Now</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((item) => (
                        <ItemCard key={item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Activity;
