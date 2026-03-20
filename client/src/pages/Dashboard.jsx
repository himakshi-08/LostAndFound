import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, Search, HelpCircle, Trophy, Bell, MessageSquare, ArrowRight, MapPin, Calendar, Clock, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
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

const ItemMiniCard = ({ item }) => (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden group border-white/5"
    >
        <div className="relative h-40 overflow-hidden">
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
    const [recentItems, setRecentItems] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [itemsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/items/my-items')
                ]);
                setRecentItems(itemsRes.data.slice(0, 4));
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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
                                    <ItemMiniCard key={item._id} item={item} />
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
                            Our AI is scanning new reports against your lost items every 5 seconds. We'll ping you here as soon as a match is found!
                        </p>
                        <div className="flex items-center space-x-2">
                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-green-500/80">Scanning for matches...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
