import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity as ActivityIcon, Search, Package, CheckCircle, Clock, AlertCircle, MapPin, Tag, Calendar, ArrowRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
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

const levenshteinDistance = (a, b) => {
    const matrix = Array.from({ length: b.length + 1 }, () => []);
    for (let i = 0; i <= b.length; i += 1) matrix[i][0] = i;
    for (let j = 0; j <= a.length; j += 1) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i += 1) {
        for (let j = 1; j <= a.length; j += 1) {
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + (a[j - 1] === b[i - 1] ? 0 : 1)
            );
        }
    }

    return matrix[b.length][a.length];
};

const fuzzyIncludes = (text, query) => {
    if (!query) return true;
    const normalizedText = (text || '').toLowerCase();
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) return true;
    if (normalizedText.includes(normalizedQuery)) return true;

    const tokens = normalizedText.split(/\W+/).filter(Boolean);
    const maxDistance = Math.max(1, Math.round(normalizedQuery.length * 0.34));

    return tokens.some(token => {
        const distance = levenshteinDistance(token, normalizedQuery);
        return distance <= maxDistance;
    });
};

const ItemCard = ({ item, onViewDetails }) => {
    const status = statusConfig[item.status] || statusConfig.active;
    const StatusIcon = status.icon;
    const emoji = categoryEmoji[item.category] || '📦';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onViewDetails(item)}
            className="glass-card overflow-hidden hover:bg-white/[0.04] transition-all cursor-pointer"
        >
            {/* Image / Emoji Banner */}
            <div className={`relative h-56 flex items-center justify-center ${item.type === 'lost' ? 'bg-red-500/5' : 'bg-green-500/5'}`}>
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
                    onClick={(e) => e.stopPropagation()}
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

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onScanMatches(item)}
                            className="w-full py-4 bg-gradient-to-r from-electric-blue to-blue-600 rounded-xl font-black uppercase tracking-widest text-white hover:shadow-lg hover:shadow-electric-blue/50 transition-all"
                        >
                            Scan for Matches →
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const Activity = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Categories');
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleViewDetails = (item) => {
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleScanMatches = (item) => {
        navigate('/matches', { state: { newItem: item, matches: [] } });
    };

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
        const matchesSearch = fuzzyIncludes(item.title, searchQuery) ||
                             fuzzyIncludes(item.description, searchQuery) ||
                             fuzzyIncludes(item.location, searchQuery);
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
                        <ItemCard key={item._id} item={item} onViewDetails={handleViewDetails} />
                    ))}
                </div>
            )}
            <ItemDetailModal
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onScanMatches={handleScanMatches}
            />
        </div>
    );
};

export default Activity;
