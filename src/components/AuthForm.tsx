import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 flex flex-col items-center justify-center min-w-[300px]">
      <Button
        className="w-full bg-yellow-400 text-black font-bold py-3 rounded hover:bg-yellow-500 transition-all text-lg"
        onClick={() => navigate('/admin')}
      >
        Admin
      </Button>
    </div>
  );
};

export default AuthForm; 