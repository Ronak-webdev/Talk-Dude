import { useState } from "react";
import { X, Clock, Eye, Database, Trash2, Info, Palette } from "lucide-react";
import toast from "react-hot-toast";
import ThemeSelector from "./ThemeSelector";

const ChatSettings = ({ isOpen, onClose, channel, targetUser }) => {
    const [retentionMode, setRetentionMode] = useState("permanent"); // '24h', 'viewOnce', 'permanent'
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    if (!isOpen) return null;

    const handleRetentionChange = async (mode) => {
        setRetentionMode(mode);

        // In real implementation, this would call an API
        const modeNames = {
            '24h': '24 Hours',
            'viewOnce': 'View Once',
            'permanent': 'Permanent'
        };

        toast.success(`Messages will be saved ${mode === 'permanent' ? 'permanently' : mode === '24h' ? 'for 24 hours' : 'once'}`);

        // Here you would save this preference to backend
        console.log('Setting retention mode:', mode);
    };

    const handleClearChat = async () => {
        try {
            // In real implementation, call API to clear chat
            console.log('Clearing chat for channel:', channel?.id);

            toast.success('Chat cleared successfully');
            setShowClearConfirm(false);

            // You might want to refresh the chat or navigate away
        } catch (error) {
            console.error('Error clearing chat:', error);
            toast.error('Failed to clear chat');
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
                onClick={onClose}
            />

            {/* Settings Panel */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[9999] animate-in fade-in zoom-in duration-300">
                <div className="bg-base-100 border border-base-content/10 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-base-content/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
                                <Info className="size-5 text-base-content" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-base-content">Chat Settings</h2>
                                <p className="text-xs text-base-content/40 font-bold uppercase tracking-widest mt-0.5">
                                    {targetUser?.name || 'Chat Configuration'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-base-content/5 text-base-content/60 hover:text-base-content transition-all"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Message Retention */}
                        <div>
                            <h3 className="text-sm font-black text-base-content uppercase tracking-widest mb-4">
                                Message Retention
                            </h3>

                            <div className="space-y-3">
                                {/* 24 Hours Option */}
                                <button
                                    onClick={() => handleRetentionChange('24h')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${retentionMode === '24h'
                                        ? 'bg-blue-600/10 border-blue-600/30'
                                        : 'bg-white/5 border-base-content/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${retentionMode === '24h'
                                        ? 'bg-blue-600 text-base-content'
                                        : 'bg-white/5 text-base-content/60'
                                        }`}>
                                        <Clock className="size-6" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-bold text-base-content text-sm">24 Hours</h4>
                                        <p className="text-xs text-base-content/40 mt-0.5">
                                            Messages disappear after 24 hours
                                        </p>
                                    </div>
                                    {retentionMode === '24h' && (
                                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-base-100" />
                                        </div>
                                    )}
                                </button>

                                {/* View Once Option */}
                                <button
                                    onClick={() => handleRetentionChange('viewOnce')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${retentionMode === 'viewOnce'
                                        ? 'bg-purple-600/10 border-purple-600/30'
                                        : 'bg-base-100/5 border-base-content/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${retentionMode === 'viewOnce'
                                        ? 'bg-purple-600 text-base-content'
                                        : 'bg-base-100/5 text-base-content/60'
                                        }`}>
                                        <Eye className="size-6" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-bold text-base-content text-sm">View Once</h4>
                                        <p className="text-xs text-base-content/40 mt-0.5">
                                            Messages delete after leaving chat
                                        </p>
                                    </div>
                                    {retentionMode === 'viewOnce' && (
                                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-base-100" />
                                        </div>
                                    )}
                                </button>

                                {/* Permanent Option */}
                                <button
                                    onClick={() => handleRetentionChange('permanent')}
                                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${retentionMode === 'permanent'
                                        ? 'bg-green-600/10 border-green-600/30'
                                        : 'bg-base-100/5 border-base-content/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${retentionMode === 'permanent'
                                        ? 'bg-green-600 text-base-content'
                                        : 'bg-base-100/5 text-base-content/60'
                                        }`}>
                                        <Database className="size-6" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className="font-bold text-base-content text-sm">Permanent</h4>
                                        <p className="text-xs text-base-content/40 mt-0.5">
                                            Messages saved forever
                                        </p>
                                    </div>
                                    {retentionMode === 'permanent' && (
                                        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                                            <div className="w-3 h-3 rounded-full bg-base-100" />
                                        </div>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Visual Theme Selection */}
                        <div className="pt-6 border-t border-base-content/5">
                            <ThemeSelector />
                        </div>

                        {/* Danger Zone */}
                        <div className="pt-6 border-t border-base-content/5">
                            <h3 className="text-sm font-black text-red-500 uppercase tracking-widest mb-4">
                                Danger Zone
                            </h3>

                            {!showClearConfirm ? (
                                <button
                                    onClick={() => setShowClearConfirm(true)}
                                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 hover:text-red-400 transition-all group"
                                >
                                    <Trash2 className="size-5 group-hover:scale-110 transition-transform" />
                                    <span className="font-bold text-sm">Clear Chat</span>
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
                                        <p className="text-sm font-medium text-red-400 text-center">
                                            Are you sure? This will delete all messages from your chat only.
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowClearConfirm(false)}
                                            className="flex-1 py-3 rounded-xl bg-base-100/5 hover:bg-base-100/10 text-base-content font-bold transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleClearChat}
                                            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-base-content font-bold transition-all"
                                        >
                                            Yes, Clear Chat
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatSettings;
