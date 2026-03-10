
import React, {useState, useEffect, useRef} from 'react';


function Orders() {
  const [order, setOrder] = useState([]);
  const totalOrders = order.length;
  const completedOrders = order.filter(o => o.status.toLowerCase() === "completed").length;
  const processingOrders = order.filter(o => o.status.toLowerCase() === "processing" || o.status.toLowerCase() === "progressing").length;
  const pendingOrders = order.filter(o => o.status.toLowerCase() === "pending").length;
  const cancelledOrders = order.filter(o => o.status.toLowerCase() === "cancelled" || o.status.toLowerCase() === "canceled").length;

  const [formData, setFormData] = useState({
        id: '',
        user: '',
        service: '',
        link: '',
        qty: 0,
        charge: 0,
        status:'',
        date:''
    });

    // Fetch orders when component loads
  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then(res => res.json())
      .then(data => setOrder(data));
  }, []);

    const brandRef = useRef(null);
    

    const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData({
    ...formData,
    [name]:
      name === "qty" || name === "charge"
        ? Number(value)   // convert numeric fields
        : value           // keep others as strings
  });
};


const handleAdd = async (e) => {
  e.preventDefault();

  if (!formData.user || !formData.service) {
    alert("User and Service are required");
    return;
  }

  const newOrder = { ...formData, id: Date.now() };

  try {
    const response = await fetch("http://127.0.0.1:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    const data = await response.json();
    console.log("Response from backend:", data);

    setOrder([...order, data.order]);

    setFormData({
      id: "",
      user: "",
      service: "",
      link: "",
      qty: 0,
      charge: 0,
      status: "",
      date: "",
    });

    if (brandRef.current) brandRef.current.focus();
  } catch (err) {
    console.error("Error adding order:", err);
  }
};

  return (
    <div className='bg-light content'>
      <div className='p-5 d-flex justify-content-between align-items-center'>
        <div className=''>
          <h3 className='fw-bold lh-1'>Order Managenment</h3>
          <p className=''>view and manage all service order in real-time</p>
        </div>
        <div className=''>
          <button className='btn btn-outline-dark rounded' data-bs-toggle='modal' data-bs-target='#myModal'>
            <i className="fa-solid fa-download"></i> Import
          </button>
          <button className='btn btn-outline-dark rounded ms-2'>
            <i className="fa-solid fa-arrows-rotate"></i> Sync Order
          </button>
        </div>
      </div>
      <div className='row mx-2 mb-3'>
        <div className='card col bg-white border-1 rounded-lg p-2 ms-2'>
          <div className='d-flex justify-content-center gap-3 align-item-start'>
          <div>
          <p className=''>Total Orders</p>
          <h5 className='fw-bold'>{totalOrders}</h5>
          </div>
          <i className="fa-solid fa-ellipsis circle-icon text-dark bg-light"></i>
          </div>
        </div>
        <div className='card col bg-white border-1 rounded-lg p-2 ms-2'>
          <div className='d-flex justify-content-center gap-3 align-item-start'>
          <div>
          <p className=''>Completed</p>
          <h5 className='fw-bold'>{completedOrders}</h5>
          </div>
          <i className="fa-solid fa-check text-success circle-icon tick"></i>
          </div>
        </div>
        <div className='card col bg-white border-1 rounded-lg p-2 ms-2'>
          <div className='d-flex justify-content-center gap-3 align-item-start'>
          <div>
          <p className=''>Processing</p>
          <h5 className='fw-bold'>{processingOrders}</h5>
          </div>
          <i className="fa-solid fa-rotate circle-icon rotate"></i>
          </div>
        </div>
        <div className='card col bg-white border-1 rounded-lg p-2 ms-2'>
          <div className='d-flex justify-content-center gap-3 align-item-start'>
          <div>
          <p className=''>Pending</p>
          <h5 className='fw-bold'>{pendingOrders}</h5>
          </div>
          <i className="fa-solid fa-clock circle-icon clock"></i>
          </div>
        </div>
        <div className='card col bg-white border-1 rounded-lg p-2 ms-2'>
          <div className='d-flex justify-content-center gap-3 align-item-start'>
          <div>
          <p className=''>Canceled</p>
          <h5 className='fw-bold'>{cancelledOrders}</h5>
          </div>
          <i className="fa-solid fa-xmark circle-icon xmark"></i>
          </div>
        </div>
      </div>
     <div className="bg-white p-3 mb-3 d-flex align-items-center">
  <div className="row w-100">
    
    <div className="col-md-4">
      <div className="input-group">
        <span className="input-group-text">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
        <input
          type="text"
          name="search"
          placeholder="Search ID, User, Link..."
          className="form-control"
        />
      </div>
    </div>

    
    <div className="col-md-4">
      <div className="input-group">
        <span className="input-group-text">
          <i className="fa-solid fa-list"></i>
        </span>
        <select className="form-select">
          <option>All Status</option>
        </select>
      </div>
    </div>

    
    <div className="col-md-4">
      <div className="input-group">
        <span className="input-group-text">
          <i className="fa-solid fa-layer-group"></i>
        </span>
        <select className="form-select">
          <option>All Services</option>
        </select>
      </div>
    </div>
  </div>
</div>
    <div className="container-fluid mx-5 my-2 bg-light"></div>
      <table className='table table-hover'>
          <thead className='fw-bold'>
            <tr>
              <td>Id</td>
              <td>User</td>
              <td>Service</td>
              <td>Link</td>
              <td>Qty</td>
              <td>Charge</td>
              <td>Status</td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {order.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>{o.service}</td>
              <td>{o.link}</td>
              <td>{o.qty}</td>
              <td>{o.charge}</td>
              <td>{o.status}</td>
              <td>{o.date}</td>
            </tr>
          ))}
          </tbody>
      </table>
      
      <div className='modal fade' id='myModal' tabIndex="-1">
        <div className='modal-dialog'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h4 className='text-center'>Add Order</h4>
            </div>
              <div className='modal-body'>
                <form>
                  <div className='w-100 m-2 p-2'>
                    <label className='form-label'>Id</label>
                    <input ref={brandRef} value={formData.id} onChange={handleChange} type='text' name='id' className='form-control'></input>
                  </div>
                  <div className='w-100 m-2 p-2'>
                    <label className='form-label'>User</label>
                    <input type='text' name='user' value={formData.user} onChange={handleChange}  className='form-control'></input>
                  </div>
                  <div className='w-100 m-2 p-2'>
                    <label className='form-label'>Service</label>
                    <input type='text' name='service' value={formData.service} onChange={handleChange}  className='form-control'></input>
                  </div>
                  <div className='row mb-2'>
                    <div className='col-6 '>
                      <label className='form-label'>Link</label>
                      <input type='text' name='link' placeholder='Your link here...' value={formData.link} onChange={handleChange} className='form-control'></input>
                    </div>
                      <div className='col-6 '>
                        <label className='form-label'>Qty</label>
                        <input type='text' name='qty' value={formData.qty} onChange={handleChange} placeholder='1' className='form-control'></input>
                      </div>
                    </div>
                    <div className='w-100 m-2 p-2'>
                      <label className='form-label'>Charge</label>
                      <input type='text' name='charge'  value={formData.charge} onChange={handleChange} className='form-control'></input>
                    </div>
                    <div className='row mb-2'>
                    <div className='col-6 '>
                      <label className='form-label'>Status</label>
                      <input type='text' name='status'  value={formData.status} onChange={handleChange} className='form-control'></input>
                    </div>
                      <div className='col-6 '>
                        <label className='form-label'>Date</label>
                        <input type='text' name='date' value={formData.date} onChange={handleChange}  className='form-control'></input>
                      </div>
                    </div>
                </form>
              </div>
              <div className='modal-footer mx-auto'>
                <button type='button' className='btn btn-danger' data-bs-dismiss='modal'>Cancel</button>
                <button type='button' className='btn btn-success' onClick={handleAdd}>Add</button>                            
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Orders;
