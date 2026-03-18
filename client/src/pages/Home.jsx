import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="glass-card p-8 flex flex-col items-center text-center group hover:border-electric-blue/30 transition-all">
        <div className="w-14 h-14 bg-electric-blue/10 rounded-2xl flex items-center justify-center mb-6 text-electric-blue group-hover:scale-110 transition-transform">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-lavender/40 text-sm leading-relaxed">{desc}</p>
    </div>
);

const Step = ({ number, title, desc }) => (
    <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-10 h-10 rounded-full bg-electric-blue flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
            {number}
        </div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-lavender/40 text-xs max-w-[200px]">{desc}</p>
    </div>
);

const Home = () => {
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="pt-20 pb-20">
            {/* Hero Section */}
            <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-electric-blue/10 border border-electric-blue/20 mb-8">
                            <Zap size={16} className="text-electric-blue" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-electric-blue">AI-Powered Item Recovery</span>
                        </div>
                        <h1 className="text-3xl lg:text-5xl font-black mb-6 tracking-tight leading-[1.15]">
                            Never lose a trace of your <span className="text-electric-blue">belongings.</span>
                        </h1>
                        <p className="text-lavender/60 text-lg mb-10 max-w-lg leading-relaxed">
                            LostLink is the first intelligent lost and found system for SRM University. Our AI matching engine works 24/7 to reconnect students with their items.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/signup" className="btn-primary px-10 py-4 flex items-center space-x-2 group">
                                <span className="font-black uppercase tracking-widest text-sm">Join Cluster</span>
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="btn-secondary px-10 py-4 font-black uppercase tracking-widest text-sm border border-white/5">
                                Account Access
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-500/10 max-w-md mx-auto">
                            <img 
                                src="/assets/hero-cartoon.jpg" 
                                alt="LostLink - Lost and Found Hub" 
                                className="w-full h-auto object-cover max-h-[448px]"
                            />
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-electric-blue/5 blur-[120px] rounded-full -z-10"></div>
                    </motion.div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-white/[0.02] border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">How it Works</h2>
                        <p className="text-lavender/40 max-w-xl mx-auto">Simplify your recovery process in three easy steps powered by intelligent automation.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-5 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-electric-blue/20 to-transparent"></div>
                        
                        <Step 
                            number="01" 
                            title="Report Item" 
                            desc="Upload details and images. Our AI categorizes your item instantly."
                        />
                        <Step 
                            number="02" 
                            title="AI Matching" 
                            desc="LostLink scans the database 24/7 to find probable matches based on visual and text data."
                        />
                        <Step 
                            number="03" 
                            title="Secure Claim" 
                            desc="Verify ownership through automated questions and chat with the founder to recover it."
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={Zap} 
                        title="Instant Results" 
                        desc="Match probability calculated in milliseconds upon submission."
                    />
                    <FeatureCard 
                        icon={Shield} 
                        title="Verified Claims" 
                        desc="Double-blind verification system ensures items go to their rightful owners."
                    />
                    <FeatureCard 
                        icon={Globe} 
                        title="Campus Wide" 
                        desc="Accessible across all blocks and departments at SRM University."
                    />
                </div>
            </section>

            {/* Footer CTA */}
            <section className="py-20 px-6 max-w-5xl mx-auto">
                <div className="glass-card p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight italic">Ready to find <br/><span className="text-electric-blue">what you lost?</span></h2>
                        <Link to="/signup" className="btn-primary px-12 py-5 inline-flex items-center space-x-3 text-lg font-black group">
                            <span>Register Hub</span>
                            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-electric-blue/10 blur-[100px] rounded-full"></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
