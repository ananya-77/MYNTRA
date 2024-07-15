// RewardsComponent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RewardsComponent = () => {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      const response = await axios.get('/rewards');
      setRewards(response.data);
    };

    fetchRewards();
  }, []);

  return (
    <div>
      <h2>Your Rewards</h2>
      {rewards.map((reward, index) => (
        <div key={index}>
          <p>Discount: {reward.discount}</p>
        </div>
      ))}
    </div>
  );
};

export default RewardsComponent;
