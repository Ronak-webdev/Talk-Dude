const SystemMessage = ({ type, username, timestamp }) => {
    const getMessageContent = () => {
        switch (type) {
            case 'screenshot':
                return `${username} took a screenshot`;
            case 'deleted':
                return 'This message was deleted';
            case 'expired':
                return 'Messages have expired due to retention settings';
            default:
                return '';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'screenshot':
                return '⚠️';
            case 'deleted':
                return '🗑️';
            case 'expired':
                return '⏰';
            default:
                return 'ℹ️';
        }
    };

    return (
        <div className="flex items-center justify-center my-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-transparent rounded-xl">
                <span className="text-lg">{getIcon()}</span>
                <span className="text-xs sm:text-sm text-base-content/30 font-medium italic text-center max-w-[80%]">
                    {getMessageContent()}
                </span>
                {timestamp && (
                    <span className="text-[10px] text-base-content/20 ml-2">
                        {timestamp}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SystemMessage;
