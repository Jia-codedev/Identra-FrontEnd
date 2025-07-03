'use client';
import React from 'react';

function WorkTrendsCard() {
    return(
        <div className='shadow-card rounded-[10px] bg-foreground p-6'>
            <div className='flex flex-row justify-between'>
                <h5 className='text-lg text-text-primary font-bold'>Work hour trends</h5>
            </div>
            <p className='text-sm text-text-secondary font-semibold'>Work hour trends can be viewed here</p>
        </div>
    )
}

export default WorkTrendsCard;