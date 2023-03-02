import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


const NavBar = (props) => {
  const providers = ['twitter', 'github', 'aad', 'aadb2c'];
  const redirect = window.location.pathname;
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    (async () => {
      setUserInfo(await getUserInfo());
    })();
  }, []);

  async function getUserInfo() {
    try {
      const response = await fetch('/.auth/me');
      const payload = await response.json();
      const { clientPrincipal } = payload;
      return clientPrincipal;
    } catch (error) {
      console.error('No profile could be found');
      return undefined;
    }
  }

  return (
    <div className="column is-2">
      <nav className="menu">
        {/* Authentication Login */}
        <nav className="menu auth">
          <p className="menu-label">Auth</p>
          <div className="menu-list auth">
            {!userInfo &&
              providers.map((provider) => (
                <a
                  key={provider}
                  href={`/.auth/login/${provider}?post_login_redirect_uri=${redirect}`}
                >
                  {provider}
                </a>
              ))}
            {userInfo && (
              <a href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}>
                Logout
              </a>
            )}
          </div>
        </nav>
        {/* Authentication Login End */}
        <p className="menu-label">Menu</p>
        <ul className="menu-list">
          <NavLink to="/products" activeClassName="active-link">
            Products
          </NavLink>
          <NavLink to="/about" activeClassName="active-link">
            About
          </NavLink>
        </ul>
        {props.children}
      </nav>
      {/* Show Login Status */}
      {userInfo && (
        <div>
          <div className="user">
            <p>Welcome</p>
            <p>{userInfo && userInfo.userDetails}</p>
            <p>{userInfo && userInfo.identityProvider}</p>
          </div>
        </div>
      )}
      {/* End of Show Login Status */}
    </div>
  );
};

export default NavBar;
