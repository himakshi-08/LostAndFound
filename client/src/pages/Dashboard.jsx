import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, HelpCircle, Trophy, Bell, MessageSquare, ArrowRight, MapPin, Calendar, Clock, Tag, X, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ActionCard = ({ title, desc, icon: Icon, color, to }) => (
    <Link to={to} className="glass-card p-6 flex items-start space-x-4 hover:scale-[1.02] active:scale-95 group">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:shadow-lg ${color}`}>
            <Icon size={24} />
        </div>
        <div>
            <h3 className="text-lg font-bold mb-1">{title}</h3>
            <p className="text-lavender/40 text-xs leading-relaxed">{desc}</p>
        </div>
    </Link>
);

const ItemDetailModal = ({ item, isOpen, onClose, onScanMatches, userItems = [] }) => {
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
                    {/* Close Button */}
                    <div className="sticky top-0 flex justify-end p-4 border-b border-white/5 bg-indigo-950/50 backdrop-blur-md z-10">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all text-lavender hover:text-white"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Main Image */}
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

                    {/* Content */}
                    <div className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <h1 className="text-4xl font-black mb-2">{item.title}</h1>
                            <p className="text-lavender/60 text-lg">
                                <span className="text-electric-blue font-bold">{item.type === 'lost' ? 'LOST' : 'FOUND'}</span> on campus
                            </p>
                        </div>

                        {/* Description */}
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                            <p className="text-lavender leading-relaxed text-base">{item.description}</p>
                        </div>

                        {/* Details Grid */}
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

                        {/* Additional Info */}
                        {item.additionalInfo && (
                            <div className="bg-electric-blue/10 rounded-xl p-6 border border-electric-blue/30">
                                <div className="text-[10px] text-electric-blue uppercase font-bold tracking-widest mb-3">Additional Info</div>
                                <p className="text-lavender/80 text-sm leading-relaxed">{item.additionalInfo}</p>
                            </div>
                        )}

                        {/* Status */}
                        <div className="flex items-center justify-between bg-white/5 rounded-lg p-4 border border-white/10">
                            <span className="text-sm font-semibold text-lavender/60">Status</span>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
                                item.status === 'active' 
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : item.status === 'matched'
                                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                            }`}>
                                {item.status || 'Active'}
                            </span>
                        </div>

                        {/* Action Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                onScanMatches(item);
                                onClose();
                            }}
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

const ItemMiniCard = ({ item, onViewDetails }) => (
    <motion.div 
        layout
        onClick={() => onViewDetails(item)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden group border-white/5 cursor-pointer hover:scale-105 transition-transform"
    >
        <div className="relative h-52 overflow-hidden">
            <img 
                src={item.images?.[0] || 'https://images.unsplash.com/photo-1590370221379-33b6838a6a6d?w=800&q=80'} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                item.type === 'lost' ? 'bg-red-500/20 text-red-200 border border-red-500/30' : 'bg-green-500/20 text-green-200 border border-green-500/30'
            }`}>
                {item.type}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all backdrop-blur-0 group-hover:backdrop-blur-sm">
                <Eye size={32} className="text-white opacity-0 group-hover:opacity-100 transition-all" />
            </div>
        </div>
        <div className="p-4">
            <h4 className="font-bold text-sm mb-2 line-clamp-1">{item.title}</h4>
            <div className="space-y-1.5">
                <div className="flex items-center text-[10px] text-lavender/50">
                    <MapPin size={12} className="mr-1.5 shrink-0" />
                    <span className="truncate">{item.location}</span>
                </div>
                <div className="flex items-center text-[10px] text-lavender/50">
                    <Calendar size={12} className="mr-1.5 shrink-0" />
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentItems, setRecentItems] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                
                const [itemsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/items/my-items', config)
                ]);
                setRecentItems(itemsRes.data.slice(0, 4));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await axios.get('http://localhost:5000/api/items/notifications', config);
                setNotifications(res.data.notifications || []);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        fetchData();
        fetchNotifications();
        const poll = setInterval(fetchNotifications, 10000);
        return () => clearInterval(poll);
    }, [user]);

    const handleViewDetails = (item) => {
        console.log('Opening detail for:', item.title); // Debug
        setSelectedItem(item);
        setIsDetailOpen(true);
    };

    const handleScanMatches = (item) => {
        navigate('/matches', { state: { newItem: item, matches: [] } });
    };

    return (
        <div className="pt-24 px-6 max-w-7xl mx-auto pb-20">
            {/* Hero Section */}
            <header className="mb-12 relative overflow-hidden p-10 rounded-[2rem] bg-gradient-to-br from-indigo-900/40 to-indigo-800/10 border border-white/5">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-4 tracking-tight"
                        >
                            Welcome back, <span className="text-electric-blue">{user?.name?.split(' ')[0] || 'Explorer'}</span>! 👋
                        </motion.h1>
                        <p className="text-lavender/60 text-lg max-w-md leading-relaxed">
                            Helping you find what's lost and return what's found. Together, let's keep SRM helpful!
                        </p>
                    </div>
                    <div className="hidden lg:flex gap-4">
                         <div className="glass-card p-6 text-center border-electric-blue/20">
                             <div className="text-3xl font-black text-electric-blue mb-1">{user?.reputationScore || 0}</div>
                             <div className="text-[10px] uppercase tracking-widest text-lavender/40 font-bold">Reputation</div>
                         </div>
                    </div>
                </div>
                {/* Abstract background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-electric-blue/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
            </header>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                <ActionCard 
                    title="Lost Something?" 
                    desc="Report your lost item and let our AI start matching."
                    icon={Search}
                    color="bg-red-500/20 text-red-300"
                    to="/report-lost"
                />
                <ActionCard 
                    title="Found Something?" 
                    desc="Found an item? Report it here to help the owner."
                    icon={PlusCircle}
                    color="bg-green-500/20 text-green-300"
                    to="/report-found"
                />
                <ActionCard 
                    title="My Reports" 
                    desc="View and manage all your reports in one place."
                    icon={HelpCircle}
                    color="bg-lavender/10 text-lavender"
                    to="/my-items"
                />
                <ActionCard 
                    title="Activity Feed" 
                    desc="See all campus lost & found reports and scan for matches."
                    icon={Bell}
                    color="bg-electric-blue/20 text-electric-blue"
                    to="/activity"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Middle Left: Recent Activity */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center">
                            <Clock size={20} className="mr-3 text-electric-blue" />
                            Recent Reports
                        </h2>
                        <Link to="/my-items" className="text-xs text-lavender/40 hover:text-electric-blue transition-colors flex items-center font-bold uppercase tracking-wider">
                            View All <ArrowRight size={14} className="ml-1" />
                        </Link>
                    </div>
                    
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-20">
                            {[1,2].map(i => <div key={i} className="glass-card h-48 animate-pulse"></div>)}
                        </div>
                    ) : recentItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {recentItems.map(item => (
                                    <ItemMiniCard key={item._id} item={item} onViewDetails={handleViewDetails} />
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="glass-card p-16 flex flex-col items-center justify-center text-center border-dashed border-white/5 opacity-40">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <Tag size={32} className="text-lavender/20" />
                            </div>
                            <p className="text-lavender/60 max-w-xs">You haven't reported any items yet. Your journey to help others starts here!</p>
                        </div>
                    )}
                </div>

                {/* Right Side: Matches & Notifications */}
                <div className="lg:col-span-4 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center">
                        <MessageSquare size={20} className="mr-3 text-electric-blue" />
                        AI Updates
                    </h2>
                    <div className="glass-card p-8 border-electric-blue/10 bg-electric-blue/[0.02]">
                        <div className="w-12 h-12 bg-electric-blue/20 rounded-2xl flex items-center justify-center mb-6">
                            <Bell size={24} className="text-electric-blue" />
                        </div>
                        <h3 className="font-bold mb-2">Smart Matching Active</h3>
                        <p className="text-xs text-lavender/40 leading-relaxed mb-6">
                            Our AI is scanning your reports and alerting you when a new potential match appears. The dashboard will update automatically every 10 seconds.
                        </p>
                        {notifications.length > 0 ? (
                            <div className="space-y-4">
                                <div className="rounded-3xl bg-green-500/10 border border-green-500/20 p-4">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-green-300 mb-2">New Match Alert</p>
                                    <p className="text-sm text-white font-bold">{notifications.length} item{notifications.length > 1 ? 's' : ''} have potential matches.</p>
                                </div>
                                {notifications.slice(0, 2).map((notification, index) => (
                                    <div key={index} className="rounded-3xl bg-white/5 border border-white/10 p-4">
                                        <p className="text-[11px] text-lavender/40 uppercase tracking-widest mb-2">{notification.item.type === 'lost' ? 'Lost Item' : 'Found Item'}</p>
                                        <p className="font-semibold text-white text-sm line-clamp-1">{notification.item.title}</p>
                                        <p className="text-[10px] text-lavender/40">{notification.totalMatches} possible match{notification.totalMatches > 1 ? 'es' : ''}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80">No matched alerts yet</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Item Detail Modal */}
            <ItemDetailModal
                item={selectedItem}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onScanMatches={handleScanMatches}
                userItems={recentItems}
            />
        </div>
    );
};

export default Dashboard;
