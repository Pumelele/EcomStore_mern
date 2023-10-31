import React, {useState} from 'react';
import Layout from '../../components/Layout/Layout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';



const Register = () => {

    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");
    const navigate = useNavigate();

    // FORM FUNCTION
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const res = await axios.post('/api/v1/auth/register', {name,email,password,phone,address});
            if(res && res.data.success){
                toast.success(res.data.message)
                navigate('/login');
            } else{
                toast.error(res.data.message)
            }
            
        } catch (error) {
            console.log(error)
            toast.error('Something went wrong')

            
        }
    };
  
  return (
    <Layout titl="Registration">
        <div className='register'>

            <h1>Registration Page</h1>
            

          <form onSubmit={handleSubmit}>                
                <div className="mb-3"> {/*NAME INPUT BOX*/}
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="exampleInputName1" placeholder='Enter Your Name' required />                   
                </div>                 
                <div className="mb-3">  {/* EMAIL INPUT BOX */}
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="exampleInputEmail1" placeholder='Email Address' required />                   
                </div>
                <div className="mb-3"> {/*PASSWORD INPUT */}
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="exampleInputPassword1" placeholder='Enter password' required/>
                </div>    
                <div className="mb-3">{/*PHONE NUMBER INPUT*/}
                    <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="form-control" id="exampleInputNumber1" placeholder='Phone Number' required />                   
                </div>
                <div className="mb-3">{/*ADDRESS INPUT */}
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" id="exampleInputAddress1" placeholder='Enter address' required/>
                </div>
                
               
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>

        </div>
    </Layout>
  )
}

export default Register