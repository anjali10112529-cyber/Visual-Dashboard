import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './App.css';

function Admin() {
  return (
    <div className="admin-layout">
   
      <aside className="sidebar">
        <div className="sidebar-header">
          <i className="fa fa-shield logo"></i>
          <h4 className='d-inline ps-2 title'>SMM ADMIN</h4>
          <p className='ps-5 head'>Pro Reseller Panel</p>
        </div>
        <ul className="sidebar-list">
          <li>
            <Link to="dashboard" className="sidebar-link">
              <i className="fa fa-home"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="orders" className="sidebar-link">
              <i className="fa fa-shopping-cart"></i> Orders
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main content area */}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Admin;
