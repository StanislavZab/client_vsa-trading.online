import { useRef } from "react";



const usePriceFieldEvents = () => {
    const ref = useRef<HTMLDivElement>(null);

    return {
        ref
    }
}

export default usePriceFieldEvents;