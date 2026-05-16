import React, { useState, useEffect, useRef } from 'react';

// Helper function to generate a random number within a range
const getRandomAmount = () => Math.floor(Math.random() * (9000 - 1000 + 1)) + 1000;

// Helper function to generate a random time that is in the past (e.g., within the last 2 hours)
const getRandomTime = () => {
  const now = new Date();
  // Subtract a random number of minutes (0 to 120 minutes)
  const pastMinutes = Math.floor(Math.random() * 120); 
  now.setMinutes(now.getMinutes() - pastMinutes);
  
  // Format the time as HH:MM AM/PM (e.g., 10:35 AM)
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour clock

  return `${displayHours}:${minutes} ${ampm}`;
};

// Expanded list of 50 unique names
const UserNames = [
  'Ravi', 'Simran', 'Pooja', 'Deepak', 'Anjali', 'Kunal', 'Neha', 'Vikram', 'Aisha', 'Gaurav',
  'Amit', 'Sunita', 'Rajesh', 'Priya', 'Sanjay', 'Geeta', 'Mohan', 'Kavita', 'Arjun', 'Smita',
  'Rahul', 'Jyoti', 'Manish', 'Meena', 'Vikas', 'Lata', 'Ajay', 'Tina', 'Alok', 'Sonia',
  'Vinay', 'Divya', 'Nikhil', 'Shilpa', 'Rohit', 'Sapna', 'Bharat', 'Kiran', 'Harish', 'Ritu',
  'Zaid', 'Mona', 'Chetan', 'Preeti', 'Yogesh', 'Shreya', 'Tushar', 'Roshni', 'Ishan', 'Hema'
];

// Component to display the list of live proofs with auto-scrolling
const LiveProofList = () => {
  const [proofs, setProofs] = useState([]);
  // Ref to the scrollable container
  const listRef = useRef(null); 

  // Effect to generate 50 unique proofs
  useEffect(() => {
    const generateInitialProofs = () => {
      const newProofs = [];
      const count = 50; 
      
      // Shuffle the names array to pick 50 unique names randomly
      const shuffledNames = [...UserNames].sort(() => 0.5 - Math.random());
      
      for (let i = 0; i < count; i++) {
        // Use a unique name from the shuffled list
        const randomName = shuffledNames[i % shuffledNames.length];
        
        const randomAmount = getRandomAmount();
        const randomTime = getRandomTime();

        newProofs.push({
          id: i,
          name: randomName,
          amount: randomAmount,
          time: randomTime,
        });
      }
      setProofs(newProofs);
    };

    generateInitialProofs();
  }, []); // Run only on mount

  // Effect to handle the auto-scrolling animation
  useEffect(() => {
    let scrollInterval;
    const listContainer = listRef.current;
    
    if (listContainer) {
      const scrollSpeed = 50; // Milliseconds delay between scrolls
      const scrollStep = 1;  // Pixels to scroll each step
      let scrollPosition = 0;
      
      const startScrolling = () => {
        scrollInterval = setInterval(() => {
          // Check if content is tall enough to scroll
          if (listContainer.scrollHeight <= listContainer.clientHeight) {
            clearInterval(scrollInterval);
            return;
          }

          scrollPosition += scrollStep;
          
          // Check if we hit the bottom (with a small tolerance)
          if (scrollPosition >= listContainer.scrollHeight - listContainer.clientHeight - 1) {
            // Scroll smoothly back to the top over 1 second, then restart scroll
            listContainer.scrollTo({ top: 0, behavior: 'smooth' });
            scrollPosition = 0; 
            
          } else {
            listContainer.scrollTop = scrollPosition;
          }
        }, scrollSpeed);
      };

      const stopScrolling = () => {
        clearInterval(scrollInterval);
      };

      startScrolling();

      // Pause scrolling when the user hovers over the list (good UX)
      listContainer.addEventListener('mouseenter', stopScrolling);
      listContainer.addEventListener('mouseleave', startScrolling);

      return () => {
        stopScrolling();
        listContainer.removeEventListener('mouseenter', stopScrolling);
        listContainer.removeEventListener('mouseleave', startScrolling);
      };
    }
  }, [proofs.length]); // Rerun if the number of proofs changes

  return (
    <div className="live-list-wrapper">
      <h2 className="live-header">
        <span role="img" aria-label="money-with-wings">💸</span>
        Live Withdrawal Proofs
      </h2>

      {/* The scrollable container: using ref and overflow:hidden for ticker effect */}
      <div 
        ref={listRef} 
        className="live-scroll-container"
        style={{ scrollBehavior: 'smooth' }} // Used for the reset to top
      >
        {proofs.map((proof) => (
          <div 
            key={proof.id} 
            className="live-item"
          >
            <div className="live-item-details">
              <span role="img" aria-label="user-icon">👤</span>
              <div>
                <div className="live-name">{proof.name}</div>
                <div className="live-time">{proof.time}</div>
              </div>
            </div>
            <div className="live-amount">
              ₹{proof.amount} Withdrawal Success
            </div>
          </div>
        ))}
      </div>
      <p className="live-pause-text">Hover over the list to pause scrolling.</p>
    </div>
  );
};


// Main App component containing only the LiveProofList
const LiveProof = () => {
  
  // --- COMBINED CSS AREA: GLOBAL STYLES and LIVE PROOF LIST STYLES (.live-*) ---
  const styles = `
    /* --- GLOBAL APP STYLES --- */
    .app-container {
        min-height: 100vh;
        background-color: #f9fafb;
        padding: 1rem;
        font-family: 'Inter', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 2.5rem;
    }

    /* --- LIVE PROOF LIST STYLES (.live-*) --- */
    .live-list-wrapper {
        background-color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        padding: 1rem;
        width: 100%;
      
        margin: 1.5rem auto 0 auto;
    }
    
    .live-header {
        font-size: 1.125rem;
        font-weight: 800;
        color: #1f2937;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 0.5rem;
    }
    .live-header span {
        margin-right: 0.5rem;
    }
    
    .live-scroll-container {
        max-height: 15rem; /* 240px */
        overflow: hidden;
        padding-right: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem; /* space-y-3 */
    }
    
    .live-item {
        background-color: #f9fafb;
        padding: 0.75rem;
        border-radius: 0.5rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        border: 1px solid #f3f4f6;
        transition: background-color 0.15s ease;
    }
    .live-item:hover {
        background-color: #f3f4f6;
    }
    
    .live-item-details {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.25rem;
    }
    .live-item-details span:first-child {
        font-size: 1.25rem;
        color: #3b82f6;
        margin-right: 0.75rem;
        margin-top: 0.25rem;
    }
    
    .live-name {
        font-size: 1rem;
        font-weight: 700;
        color: #1f2937;
    }
    
    .live-time {
        font-size: 0.75rem;
        color: #6b7280;
    }
    
    .live-amount {
        font-size: 0.875rem;
        font-weight: 600;
        color: #10b981; /* Green */
        margin-left: 2rem; /* Aligned with text after icon */
        margin-top: 0.25rem;
    }
    
    .live-pause-text {
        font-size: 0.75rem;
        text-align: center;
        color: #9ca3af;
        margin-top: 0.5rem;
    }
  `;

  return (
    <div className="">
      {/* Include the necessary styles */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <LiveProofList />

    </div>
  );
};

export default LiveProof;