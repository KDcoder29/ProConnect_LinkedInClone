// UserLayout.jsx
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getAboutUser } from '@/config/redux/action/authAction';
import NavBarComponent from '@/Components/Navbar';

export default function UserLayout({ children }) {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !authState.user) {
      dispatch(getAboutUser({ token }));
    }
  }, [authState.user]);

  return (
    <div>
      <NavBarComponent />
      {children}
    </div>
  );
}
