import React, { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatEVMDate } from "@/utils/dateUtils";

const Events = ({ events }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className='mt-1'> 
            {events.map((event, index) => {
                return (
                    <div key={index} className="p-4 mb-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between mb-2">
                            <Badge className={`px-2 py-1 ${
                                event.type === 'jewelerCreated' 
                                    ? 'bg-blue-500 hover:bg-blue-600' 
                                    : event.type === 'jewelerActivated' 
                                        ? 'bg-green-500 hover:bg-green-600' 
                                        : event.type === 'jewelerDesactivated' 
                                            ? 'bg-red-500 hover:bg-red-600' 
                                            : ''
                            }`}>
                                {event.type}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {console.log("event.blockTimestamp", event.timestamp)}
                                {console.log("formatEVMDate(event.blockTimestamp)", formatEVMDate(event.timestamp))}
                                {formatEVMDate(event.timestamp)}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">
                            <span className="font-medium">Adresse:</span> {event.address}
                        </p>                    
                    </div>
                )
            })}
        </div>    
    )
}

export default Events;
