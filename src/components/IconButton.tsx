import { forwardRef } from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: string;
    activeIcon?: string;
    isActive?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ icon, activeIcon, isActive, className = '', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`relative bg-transparent border-none outline-none rounded-full w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-inherit cursor-pointer p-0 [-webkit-tap-highlight-color:transparent] group ${className}`}
                {...props}
            >
                <div className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-[4px] -z-10 transition-all duration-[600ms] ease-qq-bounce group-hover:bg-white/20 group-active:scale-[0.8] group-active:duration-150 group-active:ease-smooth-press" />
                <span className="material-symbols-rounded text-[24px] md:text-[22px] select-none transition-transform duration-[600ms] ease-qq-bounce group-active:scale-[0.8] group-active:duration-150 group-active:ease-smooth-press relative z-10" style={{ fontVariationSettings: "'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24" }}>
                    {isActive && activeIcon ? activeIcon : icon}
                </span>
            </button>
        );
    }
);
