import React, { Component } from "react";
import { connect } from "react-redux";
import formatCurrency from "../util";
import { fetchOrders } from "../actions/orderActions";

class Orders extends Component {
  componentDidMount() {
    this.props.fetchOrders();
  }
  render() {
    const { orders } = this.props;
    return !orders ? (
      <div>Orders</div>
    ) : (
      <div className="orders">
        <h2>Orders</h2>
        <div className="flex-grid1">
          <div className="col1">ID</div>
          <div className="col1">DATE</div>
          <div className="col1">TOTAL</div>
          <div className="col1">NAME</div>
          <div className="col1">EMAIL</div>
          <div className="col1">ADDRESS</div>
          <div className="col1">ITEMS</div>
        </div>

        {orders.map((order) => (
          <div className="flex-grid2">
            <div className="col2">{order._id}</div>
            <div className="col2">{order.createdAt}</div>
            <div className="col2">{formatCurrency(order.total)}</div>
            <div className="col2">{order.name}</div>
            <div className="col2">{order.email}</div>
            <div className="col2">{order.address}</div>
            <div className="col2">
              {order.cartItems.map((item) => (
                <div>
                  {item.count} {" x "} {item.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
}
export default connect(
  (state) => ({
    orders: state.order.orders,
  }),
  {
    fetchOrders,
  }
)(Orders);
