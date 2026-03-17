import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, MessageCircle, MapPin, Calendar, ArrowRight } from 'lucide-react';

const MatchCard = ({ match, newItem }) => {
    const { item, score } = match;
    const isHighMatch = score >= 70;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`glass-card p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden ${isHighMatch ? 'border-green-500/30 ring-1 ring-green-500/20' : ''}`}
        >
            {isHighMatch && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    High Confidence
                </div>
            )}
            
            <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${isHighMatch ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {Math.round(score)}% Match
                    </div>
                </div>

                <p className="text-lavender/60 text-sm mb-6 line-clamp-2">{item.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-lavender/40 mb-6">
                    <div className="flex items-center"><MapPin size={14} className="mr-2" /> {item.location}</div>
                    <div className="flex items-center"><Calendar size={14} className="mr-2" /> {new Date(item.date).toLocaleDateString()}</div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 btn-primary py-2 text-sm">Yes, this is mine</button>
                    <button className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center">
                        <MessageCircle size={16} className="mr-2" /> Chat
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const Matches = () => {
    const location = useLocation();
    const { newItem, matches } = location.state || { newItem: null, matches: [] };

    if (!newItem) return <div className="pt-32 text-center text-lavender/60">No new report found.</div>;

    return (
        <div className="pt-24 px-6 max-w-5xl mx-auto pb-12">
            <header className="mb-12 text-center">
                <div className="inline-flex items-center space-x-2 bg-electric-blue/10 text-electric-blue px-4 py-2 rounded-full mb-6">
                    <CheckCircle size={18} />
                    <span className="text-sm font-bold">Report Submitted Successfully</span>
                </div>
                <h1 className="text-4xl font-bold mb-4">AI Match Results</h1>
                <p className="text-lavender/60">Our algorithm found {matches.length} potential {newItem.type === 'lost' ? 'found' : 'lost'} item matches.</p>
            </header>

            {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {matches.map((match, i) => (
                        <MatchCard key={i} match={match} newItem={newItem} />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-16 text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-lavender/20" />
                    <h3 className="text-xl font-bold mb-2">No Matches Yet</h3>
                    <p className="text-lavender/50 max-w-md mx-auto">Don't worry! We'll notify you as soon as someone reports a matching item.</p>
                    <Link to="/" className="mt-8 inline-block btn-secondary">Back to Dashboard</Link>
                </div>
            )}
        </div>
    );
};

export default Matches;
