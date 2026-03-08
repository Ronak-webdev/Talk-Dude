export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const formatRelativeTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const msgDate = new Date(date);
    const diffInSeconds = Math.floor((now - msgDate) / 1000);

    if (diffInSeconds < 60) return "Now";

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} Min Ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} Hrs Ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";

    return `${diffInDays}d`;
};
