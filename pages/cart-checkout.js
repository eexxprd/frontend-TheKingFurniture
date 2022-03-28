import { useRouter } from 'next/router'
import { Row, Col, Button, Form, DropdownButton, Dropdown } from "react-bootstrap"
import Input from "../components/Input"
import carts from "../styles/cart.module.scss"
import Image from "next/image"
import Head from "next/head"
import visa from "../public/images/logos_visa.png"
import { useEffect, useState } from "react"
import { getPaymentMethod } from "../redux/actions/paymentMethod"
import { useDispatch, useSelector } from "react-redux"
import { RiArrowDropDownLine } from "react-icons/ri"
import { getCart, checkoutCart } from "../redux/actions/cart"
import cart from "../redux/reducers/cart"
import Layout from '../components/Layout'

const SellingProduct = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const { cart } = useSelector(state=>state)
    const { paymentMethod } = useSelector(state=>state)
    const [showPayment, setShowPayment] = useState(false)
    const [activePayment, setActivePayment] = useState(1)
    const [wrongForm, setWrongForm] = useState(false)
    useEffect(()=>{
        getPaymentMethod(dispatch)
        getCart(dispatch)
    }, [])
    const goCheckout = async() => {
        const recipient_name = document.getElementById('name').value
        const address = document.getElementById('address').value
        const phoneCode = document.getElementById('code').value
        const phone = document.getElementById('phone').value
        const id_payment_method = activePayment
        const phone_number = `${phoneCode}-${phone}`
        const data = { recipient_name, address, phone_number, id_payment_method, id_transaction_status: 2}
        console.log(data)
        if (Object.keys(data).length) {
            cart.data.map(async(element) => {
                checkoutCart(dispatch, element.id, data)
                console.log(checkoutCart(dispatch, element.id, data))
                await router.push('/cart')
            });
        }
        else{
            setWrongForm(true)
        }
    }
    return (
        <>  
            <Layout>
            <Head>
            <title>The King | Cart Checkout</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={`${carts.containers} `}>
                <div className={`${carts.profiles} `}>
                    <div className="d-flex flex-column justify-content-center">
                        <div style={{fontSize:"16px", fontFamily:"Rubik"}} className="text-justify p-auto px-5 mx-5 mt-5 nav-text">
                            <span >Cart {""}</span><span className="text-yellow-800"> {">"} </span>
                        </div>
                        <div className={`${carts.content} text-center mb-2 mt-3`}>Check Out</div>
                        <div className={`${carts.contents} text-center mb-5`}>Pay and get your ordered items</div>
                    </div>
                </div>
                <div className="px-5 mx-5 mt-5 pt-3">
                    {wrongForm && <div className='text-danger'>
                        Please fill in all the field
                    </div>}
                    <Row>
                        <Col xs={12} md={3}></Col>
                        <Col xs={12} md={6}>
                            <h4 className='mt-5'>Self Information</h4>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                aria-describedby="name"
                                className='me-5 py-3 mt-5'
                                placeholder='Your Name *'
                                required
                            />
                            <Input
                                type="text"
                                id="address"
                                name="address"
                                aria-describedby="address"
                                className='me-5 py-3 mt-2'
                                placeholder='Address *'
                                required
                            />
                            <div className="d-flex align-items-center">
                                <Form.Select id='code' aria-label="Default select example" className={`${carts.dropdown} mt-2`}>
                                    <option value='+62'>+62</option>
                                    <option value='+165'>+165</option>
                                    <option value='+52'>+52</option>
                                    <option value='+32'>+32</option>
                                </Form.Select>
                                <Input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    aria-describedby="phone"
                                    className=' py-3 mt-2'
                                    placeholder='Phone Number *'
                                />
                            </div>
                            <div className="border d-flex m-0 align-items-center px-3 mt-2" style={{height: '58px', cursor: "pointer"}} onClick={()=>setShowPayment(!showPayment)}>
                                <div className="col-2 p-3"><Image src={paymentMethod.data[activePayment-1]?.image? paymentMethod.data[activePayment-1]?.image: '/images/chair.png'} alt={paymentMethod.data[activePayment-1]?.name} width={80} height={40} layout="responsive"/></div>
                                <p className="m-0">Pay with {paymentMethod.data[activePayment-1]?.name}</p>
                                <p className="ms-auto fs-2 m-0">< RiArrowDropDownLine /></p>
                            </div>
                            {showPayment && <div className="border">
                                {paymentMethod.data?.map((method)=> {
                                    return(
                                        <div key={method.id} className="d-flex m-0 align-items-center px-3 mt-2" style={{height: '58px', cursor: "pointer"}} onClick={()=>{setActivePayment(method.id); setShowPayment(false)}}>
                                            <div className="col-2 p-3">
                                                <Image src={method.image} alt={method.name} width={80} height={40} layout="responsive"/>
                                            </div>
                                            <p className="m-0">Pay with {method.name}</p>
                                        </div>
                                    )
                                })}
                            </div>}
                                
                            {/* <Form.Select aria-label="Default select example" className={`${carts.pay} mt-2`}>
                                <option >Pay with Visa</option>
                                <option >Pay with Mastercard</option>
                                <option >Pay with Cirrus</option>
                                <option >Pay with Paypal</option>
                            </Form.Select> */}
                        </Col>
                        <Col xs={12} className='text-center mt-3 mb-5'>
                            <Button onClick={goCheckout}>Check Out</Button>
                        </Col>
                    </Row>                    
                </div>
            </div>
            </Layout>
        </>
    )
}

export default SellingProduct