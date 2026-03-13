import React, { useState, useEffect } from "react";
import { Scatter } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dashboard-gq96.onrender.com/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, []);

  // Scatter chart data
  const scatterData = {
    datasets: [
      {
        label: "Revenue Distribution",
        data: orders.map(o => ({
          x: o.qty || 0,       // lowercase
          y: o.charges || 0    // lowercase
        })),
        backgroundColor: "rgba(75,192,192,1)"
      }
    ]
  };

  // Count orders by status
  const statusCounts = {
    Completed: orders.filter(o => o.status?.toLowerCase() === "completed").length,
    Processing: orders.filter(
      o =>
        o.status?.toLowerCase() === "processing" ||
        o.status?.toLowerCase() === "progressing"
    ).length,
    Pending: orders.filter(o => o.status?.toLowerCase() === "pending").length,
    Cancelled: orders.filter(
      o =>
        o.status?.toLowerCase() === "cancelled" ||
        o.status?.toLowerCase() === "canceled"
    ).length
  };

  const totalOrders =
    Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.charges || 0), 0);
  const netProfit = totalRevenue * 0.35;
  const activeUsers = new Set(orders.map(o => o.user)).size;

  if (loading) {
    return <div className="p-4">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="p-4">
        <h3>Admin Dashboard</h3>
      </div>

      {/* Metrics Cards */}
      <div className="row m-3">

        <div className="card col bg-white border-1 rounded-lg p-2 m-2">
          <div className="d-flex align-items-start justify-content-around gap-3">
            <div>
              <p className="text-muted pt-2">Total Revenue</p>
              <h5>{totalRevenue}</h5>
            </div>
            <i className="fa-solid fa-dollar-sign dollar rect-icon"></i>
          </div>
        </div>

        <div className="card col bg-white border-1 rounded-lg p-2 m-2">
          <div className="d-flex align-items-start justify-content-around gap-3">
            <div>
              <p className="text-muted pt-2">Net Profit</p>
              <h5>{netProfit.toFixed(2)}</h5>
            </div>
            <i className="fa-solid fa-chart-line rect-icon line"></i>
          </div>
        </div>

        <div className="card col bg-white border-1 rounded-lg p-2 m-2">
          <div className="d-flex align-items-start justify-content-center gap-3">
            <div>
              <p className="text-muted pt-2">Total Orders</p>
              <h5>{Object.values(statusCounts).reduce((a,b)=>a+b,0)}</h5>
            </div>
            <i className="fa-solid fa-cart-shopping rect-icon cart"></i>
          </div>
        </div>

        <div className="card col bg-white border-1 rounded-lg p-2 m-2">
          <div className="d-flex align-items-start justify-content-center gap-3">
            <div>
              <p className="text-muted pt-2">Active Users</p>
              <h5>{activeUsers}</h5>
            </div>
            <i className="fa-solid fa-users rect-icon users"></i>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="row m-3 gap-3">

        {/* Scatter Chart */}
        <div className="col-7 bg-white card rounded-lg">
          <h3 className="p-2">Revenue Distribution</h3>
          <Scatter data={scatterData} />
        </div>

        {/* Status Progress */}
        <div className="mt-4 col-4 card rounded-lg bg-white p-3 shadow">
          <h3 className="mb-3">Orders by Status</h3>

          {/* Completed */}
          <div className="progress mb-1">
            <div
              className="progress-bar bg-success progress-bar-striped progress-bar-animated"
              style={{
                width: `${(statusCounts.Completed / totalOrders) * 100}%`
              }}
            ></div>
          </div>
          <small className="text-success">
            Completed: {statusCounts.Completed}
          </small>

          {/* Processing */}
          <div className="progress mb-1">
            <div
              className="progress-bar bg-info progress-bar-striped progress-bar-animated"
              style={{
                width: `${(statusCounts.Processing / totalOrders) * 100}%`
              }}
            ></div>
          </div>
          <small className="text-info">
            Processing: {statusCounts.Processing}
          </small>

          {/* Pending */}
          <div className="progress mb-1">
            <div
              className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
              style={{
                width: `${(statusCounts.Pending / totalOrders) * 100}%`
              }}
            ></div>
          </div>
          <small className="text-warning">
            Pending: {statusCounts.Pending}
          </small>

          {/* Cancelled */}
          <div className="progress mb-1">
            <div
              className="progress-bar bg-danger progress-bar-striped progress-bar-animated"
              style={{
                width: `${(statusCounts.Cancelled / totalOrders) * 100}%`
              }}
            ></div>
          </div>
          <small className="text-danger">
            Cancelled: {statusCounts.Cancelled}
          </small>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
