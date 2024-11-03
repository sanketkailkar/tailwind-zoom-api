import { Button, Input } from 'antd';
import { useState } from 'react';

const JoiningPage = ({ handleUserNameChange, join }) => {
  const [username, setUsername] = useState('');

  const handleInputChange = (e) => {
    setUsername(e.target.value); // Update local username state
  };

  const handleJoinClick = () => {
    if (!username) {
      alert("Please enter a name");
      return;
    }
    handleUserNameChange(username);
    join();
     // Pass username to parent component
  };

  return (
    <div>
      <Input 
        placeholder="Enter Username" 
        value={username}
        onChange={handleInputChange}  // Update local state on change
      />
      <Button type='primary' onClick={handleJoinClick}>
        Join
      </Button>
    </div>
  );
};

export default JoiningPage;
