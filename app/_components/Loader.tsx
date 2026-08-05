function Loader({
    label = "Loading",
    className = "",
}: {
    label?: string;
    className?: string;
}) {
    return (
        <div
            role="status"
            aria-label={label}
            className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
        >
            <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-md animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-indigo-200/50" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-indigo-500 border-r-indigo-500" />
            </div>
            <p className="flex items-center text-sm font-medium text-neutral-500">
                {label}
                <span className="ml-0.5 flex">
                    <span className="animate-bounce [animation-delay:-0.3s]">
                        .
                    </span>
                    <span className="animate-bounce [animation-delay:-0.15s]">
                        .
                    </span>
                    <span className="animate-bounce">.</span>
                </span>
            </p>
        </div>
    );
}

export default Loader;
