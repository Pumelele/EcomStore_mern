import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import { AiFillWarning } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";
import e from "cors";
// import Form from "antd/es/form/Form";
// import FormItemInput from "antd/es/form/FormItemInput";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const[qty, setQty] = useState(1);
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-ZA", {
        style: "currency",
        currency: "ZAR",
      });
    } catch (error) {
      console.log(error);
    }
  };
  //detele item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //CART ITEM QUANTITY CONTROL
    const stock = cart?.map((p) => p.quantity)
    
    //function for qty increase (+)
    const addQty = ()=> {
      if(qty === stock){
      toast.error(`Your selected quantity is above ${stock}`)
      }
      setQty( qty +1)
    }
    //function for qty increase (+)
    const decreaseQty = ()=> {
      if(qty <1){
      toast.error("Your selected quantity is above ${stock}")
      }
      setQty(qty-1)
    }
    
  

  //handle submit button 
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      if(!name || !email || !phone){
        toast.error("Please fill in all fields");
      }
      const msg = cart?.map((p) => p.name);
      const res = await axios.post("/api/v1/email/sendEmail", {name,email, phone, msg});

      //validation success
      if(res.data.success){
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPhone("")
      } else {
        toast.error(res.data.message);
      }
    }
    catch(error){
      console.log(error)
    }
  };
  return (
    <Layout>
      <div className=" cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container ">
          <div className="row ">
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : R{p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                    <div className="container">
                    <button
                      className="btn btn-warning"
                      onClick={() => decreaseQty(qty)}
                    >
                      -
                    </button>
                    <input type="text" value={qty} maxlength="2" max="" size="1" id="qty" />
                    <button
                      className="btn btn-success"
                      onClick={() => addQty(qty)}
                    >
                      +
                    </button>
                  </div>
                  </div>
                
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary ">
              <h2>Cart Summary</h2>
              {/* <p>Total | Checkout | Payment</p> */}
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {/* {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )} */}
              {/* QUOTATION FORM*/}
              <div className="mb-3">
               <form >
                   <label>
                      <h5>Name:</h5>
                      <input type="text" name="name" value={name} onChange={(e)=> setName(e.target.value)} />
                    </label> <br/><br/>
                    <label>
                      <h5>E-mail:</h5>
                      <input type="email" name="email" value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    </label> <br/><br/>
                    <label>
                      <h5>Contact Number:</h5>
                      <input type="text" name="phone" value={phone} onChange={(e)=> setPhone(e.target.value)} />
                    </label> <br/><br/>
                      <input type="submit" value="Submit" className="btn btn-outline-warning" onClick={handleSubmit} />
                </form>                               
              </div>
              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;