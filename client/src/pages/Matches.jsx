import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, MapPin, Calendar, ArrowRight, Activity, Star } from 'lucide-react';
import axios from 'axios';

const MatchCard = ({ match, newItem }) => {
    const { item, score } = match;
    const isHighMatch = score >= 70;
    const [claimed, setClaimed] = useState(false);
    const [claiming, setClaiming] = useState(false);
    const [showVerify, setShowVerify] = useState(false);
    const [answers, setAnswers] = useState(item.verificationQuestions?.map(() => '') || []);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleClaim = async () => {
        if (item.type === 'found' && item.verificationQuestions?.length > 0) {
            setShowVerify(true);
            return;
        }

        setClaiming(true);
        try {
            await axios.post(`http://localhost:5000/api/items/${item._id}/claim`, {
                claimerItemId: newItem._id
            });
            setClaimed(true);
        } catch (err) {
            console.error(err);
        } finally {
            setClaiming(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError('');
        try {
            const res = await axios.post(`http://localhost:5000/api/items/${item._id}/verify`, { answers });
            if (res.data.success) {
                setClaimed(true);
                setShowVerify(false);
            } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass-card overflow-hidden h-full flex flex-col ${isHighMatch ? 'border-green-500/30 ring-1 ring-green-500/20' : ''}`}
            >
                {isHighMatch && (
                    <div className="bg-green-500 text-white text-[10px] font-black px-4 py-1.5 uppercase tracking-widest text-center flex items-center justify-center space-x-1">
                        <Star size={10} />
                        <span>High Confidence Match</span>
                    </div>
                )}

                {/* Image */}
                <div className="h-40 relative overflow-hidden bg-white/5">
                    {item.images?.[0] ? (
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                            {item.category === 'Electronics' ? '🎧' :
                             item.category === 'ID Cards' ? '🪪' :
                             item.category === 'Wallets & Purses' ? '👜' :
                             item.category === 'Water Bottles' ? '💧' :
                             item.category === 'Books & Stationery' ? '📚' :
                             item.category === 'Keys' ? '🔑' : '📦'}
                        </div>
                    )}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        item.type === 'found' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                        {item.type} Item
                    </div>
                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-black ${
                        isHighMatch ? 'bg-green-500 text-white' : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    }`}>
                        {Math.round(score)}% match
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-black mb-2 tracking-tight">{item.title}</h3>
                    <p className="text-lavender/50 text-xs mb-4 leading-relaxed line-clamp-2">{item.description}</p>

                    <div className="flex gap-4 text-[10px] text-lavender/40 font-bold uppercase tracking-widest mb-5">
                        <span className="flex items-center"><MapPin size={11} className="mr-1 text-electric-blue" />{item.location}</span>
                        <span className="flex items-center"><Calendar size={11} className="mr-1 text-electric-blue" />{new Date(item.date).toLocaleDateString()}</span>
                    </div>

                    <div className="mt-auto">
                        {/* AI Explanation */}
                        <div className="bg-white/[0.03] rounded-xl p-3 mb-5 text-[10px] text-lavender/40 space-y-1">
                            <div className="font-black text-lavender/60 uppercase tracking-widest mb-2">Why AI matched this:</div>
                            <div>📝 Text similarity: <span className="text-white">{match.aiExplanation?.descriptionSimilarity ?? Math.round(score * 0.4)}%</span></div>
                            <div>🔤 Title fuzzy match: <span className="text-white">{match.aiExplanation?.fuzzyMatch ?? Math.round(score * 0.2)}%</span></div>
                            <div>🗺️ Location match: <span className="text-white">{match.aiExplanation?.locationSimilarity ?? Math.round(score * 0.2)}%</span></div>
                        </div>

                        {claimed ? (
                            <div className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center space-x-2">
                                <CheckCircle size={14} />
                                <span>Verification Successful! Check Activity</span>
                            </div>
                        ) : newItem.type === 'lost' ? (
                            <button
                                onClick={handleClaim}
                                disabled={claiming}
                                className="w-full btn-primary py-3 text-xs font-black uppercase tracking-widest flex items-center justify-center space-x-2 group"
                            >
                                <CheckCircle size={14} />
                                <span>{claiming ? 'Submitting...' : item.type === 'found' ? 'Authenticate & Claim' : 'Yes, this is mine!'}</span>
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        ) : (
                            <div className="w-full py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center space-x-2">
                                <CheckCircle size={14} />
                                <span>Potential Owner Notified</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Verification Modal */}
            {showVerify && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-indigo-950/80 backdrop-blur-md">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card w-full max-w-md p-8 relative"
                    >
                        <h2 className="text-2xl font-black mb-2 tracking-tight italic">Ownership Challenge</h2>
                        <p className="text-lavender/40 text-xs mb-8 leading-relaxed">The finder set security questions to ensure only the true owner can claim this item.</p>
                        
                        <form onSubmit={handleVerify} className="space-y-6">
                            {item.verificationQuestions.map((q, i) => (
                                <div key={i} className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-lavender/60">{q.question}</label>
                                    <input 
                                        type="text" 
                                        className="input-field py-3 text-sm" 
                                        placeholder="Your answer..."
                                        value={answers[i]}
                                        onChange={(e) => {
                                            const newAns = [...answers];
                                            newAns[i] = e.target.value;
                                            setAnswers(newAns);
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                            
                            {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-center">{error}</p>}
                            
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowVerify(false)} className="btn-secondary flex-1 py-3 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                                <button type="submit" disabled={verifying} className="btn-primary flex-[2] py-3 text-[10px] font-black uppercase tracking-widest">
                                    {verifying ? 'Verifying...' : 'Verify Ownership'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </>
    );
};

const Matches = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [context, setContext] = useState({ newItem: null, matches: [] });

    useEffect(() => {
        if (location.state?.newItem) {
            const saved = {
                newItem: location.state.newItem,
                matches: location.state.matches || []
            };
            setContext(saved);
            try {
                sessionStorage.setItem('matches-context', JSON.stringify(saved));
            } catch (err) {
                console.warn('Unable to persist matches context', err);
            }
        } else {
            try {
                const stored = sessionStorage.getItem('matches-context');
                if (stored) {
                    setContext(JSON.parse(stored));
                }
            } catch (err) {
                console.warn('Unable to restore matches context', err);
            }
        }
    }, [location.state]);

    const { newItem, matches } = context;

    if (!newItem) {
        return (
            <div className="pt-32 px-6 max-w-lg mx-auto text-center">
                <div className="glass-card p-16">
                    <AlertCircle size={48} className="mx-auto mb-4 text-lavender/20" />
                    <h3 className="text-xl font-bold mb-2">No Report Context</h3>
                    <p className="text-lavender/50 mb-6 text-sm">Submit a report first to see AI matches here.</p>
                    <div className="flex gap-3 justify-center">
                        <Link to="/dashboard" className="btn-primary px-6 py-3 text-xs font-black uppercase tracking-widest">Go to Dashboard</Link>
                        <Link to="/activity" className="btn-secondary px-6 py-3 text-xs font-black uppercase tracking-widest">View Activity</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 px-6 max-w-6xl mx-auto pb-12">
            <header className="mb-12 text-center">
                <div className="inline-flex items-center space-x-2 bg-electric-blue/10 text-electric-blue px-4 py-2 rounded-full mb-6">
                    <CheckCircle size={18} />
                    <span className="text-sm font-bold">Report Submitted Successfully</span>
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tight">AI Match Results</h1>
                <p className="text-lavender/60">
                    Our algorithm found <span className="text-white font-bold">{matches.length}</span> potential{' '}
                    {newItem.type === 'lost' ? 'found' : 'lost'} item matches for "{newItem.title}".
                </p>
            </header>

            {matches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {matches.map((match, i) => (
                        <MatchCard key={i} match={match} newItem={newItem} />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-16 text-center max-w-lg mx-auto">
                    <AlertCircle size={48} className="mx-auto mb-4 text-lavender/20" />
                    <h3 className="text-xl font-bold mb-2">No Matches Found Yet</h3>
                    <p className="text-lavender/50 max-w-md mx-auto mb-8 text-sm">
                        Don't worry! Our AI keeps scanning. As soon as a matching item is reported, you'll see it here.
                        Check the Activity Feed for all currently reported items.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/activity" className="btn-primary px-8 py-3 flex items-center justify-center space-x-2 text-xs font-black uppercase tracking-widest">
                            <Activity size={14} />
                            <span>View Activity Feed</span>
                        </Link>
                        <Link to="/dashboard" className="btn-secondary px-8 py-3 text-xs font-black uppercase tracking-widest">
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Matches;
