import React, { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface SpotlightCardProps extends React.PropsWithChildren {
    className?: string;
    spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard = React.memo(function SpotlightCard({
    children,
    className = "",
    spotlightColor = "rgba(255, 255, 255, 0.25)"
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const div = divRef.current;
        if (!div) return;

        const rect = div.getBoundingClientRect();
        div.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        div.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
        div.style.setProperty("--spotlight-color", spotlightColor);
    }, [spotlightColor]);

    return (
        <Card
            ref={divRef}
            onMouseMove={handleMouseMove}
            className={cn(
                "relative bg-transparent backdrop-blur-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full card-spotlight",
                className
            )}
        >
            {children}
        </Card>
    );
});

export default SpotlightCard;
