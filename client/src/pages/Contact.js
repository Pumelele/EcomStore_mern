import React from 'react';
import Layout from '../components/Layout/Layout';
import {BiMailSend, BiPhoneCall, BiSupport} from 'react-icons/bi';
const Contact = () => {
  return (
    <Layout>
        <div className='row contactus'>
          <div className='col-md-6'>
            <img
            src='/images/contact-us.jpg'
            alt='ContactUs'
            style={{width: "50%", height: "50%"}}/>
          </div>
          <div className='col-md-4'>
            <h1 className='bg-dark p-2 text-white text-center'>Contact us</h1>
            <p className='text-justify mt-2'>Feel free to contact us should you have any querries</p>
            <p className='mt-3'>
              <BiMailSend/> : help@threaded.co.za
            </p>
            <p className='mt-3'>
              <BiPhoneCall/> : 011-123456
            </p>
            <p className='mt-3'>
              <BiSupport/>: 0866-0123-879
            </p>
          </div>
        </div>
    </Layout>
  )
}

export default Contact