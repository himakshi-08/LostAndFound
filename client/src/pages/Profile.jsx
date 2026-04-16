import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, CreditCard, GraduationCap, Phone, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const { user, updateProfile, token } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        studentId: '',
        department: '',
        year: '',
        phone: '',
        reputationScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { 'x-auth-token': token }
                });
                setProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    studentId: res.data.studentId || '',
                    department: res.data.department || '',
                    year: res.data.year || '',
                    phone: res.data.phone || '',
                    reputationScore: res.data.reputationScore || 0
                });
            } catch (err) {
                console.error('Error loading profile:', err);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [token]);

    const handleChange = (field) => (event) => {
        setProfile({ ...profile, [field]: event.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const updated = await updateProfile({
                name: profile.name,
                studentId: profile.studentId,
                department: profile.department,
                year: profile.year,
                phone: profile.phone
            });
            setProfile({ ...profile, ...updated });
            setMessage('Profile updated successfully.');
        } catch (err) {
            console.error('Profile update failed:', err);
            setMessage('Unable to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="pt-24 px-6 max-w-4xl mx-auto pb-20 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-3xl bg-electric-blue/10 text-electric-blue flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
                                <p className="text-lavender/50 text-sm">Review and update your campus profile details.</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                        <div className="p-4 rounded-3xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-lavender/40 mb-2">Reputation Score</p>
                                <div className="inline-flex items-center gap-2 rounded-full bg-electric-blue/10 text-electric-blue px-4 py-2 font-bold text-sm">
                                    <CheckCircle2 size={16} /> {profile.reputationScore}
                                </div>
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.3em] text-lavender/40">Logged in as</div>
                            <div className="text-sm font-semibold text-white">{profile.email}</div>
                        </div>
                    </div>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-secondary px-6 py-3 text-xs font-black uppercase tracking-widest flex items-center gap-2"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                        <div className="h-12 bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Full Name</label>
                                <div className="input-field flex items-center gap-3">
                                    <User size={16} className="text-electric-blue" />
                                    <input
                                        type="text"
                                        value={profile.name}
                                        onChange={handleChange('name')}
                                        className="w-full bg-transparent outline-none"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Campus Email</label>
                                <div className="input-field flex items-center gap-3">
                                    <Mail size={16} className="text-electric-blue" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        className="w-full bg-transparent outline-none"
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Student ID</label>
                                <div className="input-field flex items-center gap-3">
                                    <CreditCard size={16} className="text-electric-blue" />
                                    <input
                                        type="text"
                                        value={profile.studentId}
                                        onChange={handleChange('studentId')}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Department</label>
                                <div className="input-field flex items-center gap-3">
                                    <GraduationCap size={16} className="text-electric-blue" />
                                    <input
                                        type="text"
                                        value={profile.department}
                                        onChange={handleChange('department')}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Year</label>
                                <div className="input-field flex items-center gap-3">
                                    <Shield size={16} className="text-electric-blue" />
                                    <input
                                        type="text"
                                        value={profile.year}
                                        onChange={handleChange('year')}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.3em] text-lavender/40">Phone</label>
                                <div className="input-field flex items-center gap-3">
                                    <Phone size={16} className="text-electric-blue" />
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={handleChange('phone')}
                                        className="w-full bg-transparent outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {message && (
                            <div className="rounded-3xl bg-electric-blue/10 border border-electric-blue/20 p-4 text-sm text-electric-blue font-semibold">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest"
                        >
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Profile;
