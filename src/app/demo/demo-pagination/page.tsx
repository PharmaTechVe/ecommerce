'use client';
import React, { useState } from 'react';
import Pagination from '@/components/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGem, faArrowLeft, faArrowRight, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Home: React.FC = () => {
    return (
        <div className="bg-gray-900 border-radius-50 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg border-gray-950">
               

                {/* Variación 1 */}
                <Pagination
                  
                    totalPages={10}
                  
                    previousText=""
                    nextText=""
                    buttonStyle="rounded"
                    activeButtonColor="bg-blue-950 text-white"
                    inactiveButtonColor="border-gray-500 text-gray-500"
                    previousIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                    nextIcon={<FontAwesomeIcon icon={faChevronRight} />}
                  
                />

                {/* Variación 2 */}
                <Pagination
                   
                    totalPages={10}
                   
                    previousText=""
                    nextText=""
                    buttonStyle="full"
                    activeButtonColor="bg-blue-950 text-white"
                    inactiveButtonColor="border-gray-500 text-gray-500"
                    previousIcon={<FontAwesomeIcon icon={faChevronLeft} />}
                    nextIcon={<FontAwesomeIcon icon={faChevronRight} />}
                 
                />

              

                {/* Variación 4 */}
                <Pagination
                    
                    totalPages={10}
                   
                    previousText=""
                    nextText=""
                    buttonStyle="rounded"
                    activeButtonColor="bg-blue-100 text-blue-900"
                    inactiveButtonColor="border-gray-500 text-gray-500"
                    previousIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                    nextIcon={<FontAwesomeIcon icon={faArrowRight} />}
                    
                />

                {/* Variación 5 */}
                <Pagination
                   
                    totalPages={10}
        
                    previousText=""
                    nextText=""
                    buttonStyle="full"
                    activeButtonColor="bg-blue-100 text-blue-900"
                    inactiveButtonColor="border-gray-500 text-gray-500"
                    previousIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                    nextIcon={<FontAwesomeIcon icon={faArrowRight} />}
                   
                />

             
                
            </div>
        </div>
    );
};

export default Home;



