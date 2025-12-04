import React from "react";

const LoadingOverlay = ({ visible = true, text = "Loading..." }) => {
    if (!visible) return null;

    const accent = "#ffbd20"

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            aria-live="polite"
            role="status"
            style={{
                // blur the background (works in modern browsers)
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
            }}
        >
            {/* dim overlay behind the loader */}
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.28)" }} />

            {/* loader box */}
            <div className="relative z-10 flex flex-col items-center gap-3 p-4 rounded-lg shadow-2xl">
                {/* spinner */}
                <div
                    className="w-12 h-12 rounded-full border-4 animate-spin"
                    style={{
                        // spinner with accent as top border so it looks like a colored arc
                        borderTopColor: accent,
                        borderRightColor: "rgba(255,255,255,0.25)",
                        borderBottomColor: "rgba(255,255,255,0.25)",
                        borderLeftColor: "rgba(255,255,255,0.25)",
                    }}
                />

                {/* text */}
                <div className="text-sm font-medium text-white select-none">
                    {text}
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;