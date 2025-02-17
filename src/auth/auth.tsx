import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
}

const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost/5000/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('accessToken');
            navigate('/profile');
          }
        }

        const data: UserData = await response.json();
        setUserData(data);
        setIsLoggedIn(true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  return { userData, isLoggedIn, handleLogout };
};

export default useUserData;