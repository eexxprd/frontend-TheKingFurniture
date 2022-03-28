import { Row, Col, Card, Form } from "react-bootstrap"
import styles from "../styles/profile.module.scss"
import Image from "next/image"
import people from "../public/images/people.png"
import { HiOutlinePencil } from "react-icons/hi"
import {MdLogout} from "react-icons/md"
import NavbarProfile from "../components/NavbarProfile"
import Layout from "../components/Layout"
import Head from "next/head"
import Input from "../components/Input"
import { useDispatch, useSelector } from "react-redux"
import React, { useState, useRef, useEffect } from "react"
import { getProfile, updateProfile } from "../redux/actions/auth"
import Button from "../components/Button"
import carts from "../styles/cart.module.scss"
import Link from "next/link"
import { logout } from "../redux/actions/auth"
import Modals from "../components/ModalUpdate"
import NavbarUser from "../components/NavbarUser"

const ProfileSeller = () => {
    const dispatch = useDispatch()
    const {auth} = useSelector(state => state)
    const role = auth.userData.role
    const genders = (String(auth.userData.gender))
    const hiddenFileInput = useRef(null)
    const [userToken, setUserToken] = useState()
    const [modalShow, setModalShow] = React.useState(false);
    const [datas, setDatas] = useState({})

    useEffect(()=>{
        const token = window.localStorage.getItem('token')
        setUserToken(token)
      },[auth.token])

    useEffect(
        () => {
        dispatch(getProfile)
        }, []
    )
    const uploadFile = (e) => {
        e.preventDefault()
        hiddenFileInput.current.click()
    }
    const fileInputHandler = (e) => {
        const reader = new FileReader();
        const picture = e.target.files[0];
        const profileImage = document.querySelector('#profile-image');
        reader.readAsDataURL(picture);
        reader.onload = (e) => {
          profileImage.src = e.target.result;
          profileImage.className += ' rounded-circle'
        };
        setDatas({
          picture: e.target.files[0]
        });
      };

    const profileHandler = (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        let store_description = null
        if (document.getElementById('store_description')){
            store_description = document.getElementById('store_description').value;
        }
        let store_name = null
        if (document.getElementById('store_name')){
           store_name = document.getElementById('store_name').value;
        }
        const picture = datas.picture
        const gender = document.querySelector('#gender option:checked').value;
        const data = {name, email, store_description, store_name, picture, gender}
        dispatch(updateProfile(data))        
        dispatch(getProfile)
        window.scrollTo(0, 0)
    }

    const logoutHandler = () => {
        dispatch(logout)
        setUserToken(null)
      }
    
    return (
        <>  
            <Layout>
            <Head>
            <title>The King | Profile</title>
            <meta name="description" content="Generated by create next app" />
            <link rel="icon" href="/favicon.ico" />
            </Head>
            {role?.name === "Customer" ? 
                <div className={`${styles.containers} `}>
                <div className={`${styles.profiles} `}>
                    <div className="d-flex flex-column justify-content-center vh-50">
                        <div className={`${styles.content} text-center mt-4`}>Profile</div>
                        <div className={`${styles.contents} text-center mb-5`}>See your notifications for the latest updates</div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center">                    
                    <NavbarUser /> 
                </div>
                <Form onSubmit={profileHandler}>
                <div className="mt-5 mx-5 px-5">
                    <div className="d-flex flex-row align-items-center position-relative">
                        <div className="align-items-center d-flex flex-column mt-5">
                        <Image src={auth.userData?.picture || people} width={70} height={70} alt="profile" id="profile-image" name='product-image' className=" rounded-circle" />
                        <Button block variant='pallet-2 radius  ' onClick={(e) => uploadFile(e)}> Edit <HiOutlinePencil size={20} /> </Button>
                        <input type="file"
                            ref={hiddenFileInput}
                            className='d-none'
                            name='picture'
                            accept='image'
                            onChange={(e) => fileInputHandler(e)}
                        />
                        </div>
                        <div className="mx-3">
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                aria-describedby="name"
                                className='ms-2 px-2 pb-2 border-0'
                                defaultValue={auth.userData.name}
                                placeholder='Input Your Name *'
                            />
                            <div className="px-3">as {role?.name}</div>
                        </div>                        
                    </div>
                </div>
                <div>
                    <Row className={`${styles.row} mt-4`}>
                        <Col xl={12}>
                            <div className="mx-5 px-5 mt-4">
                                <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                    <div className="px-5 py-4">
                                        <Form.Label className='align-items-center'><p>Gender :</p></Form.Label>
                                        <Form.Select className='border-0' size="md" id="gender" name="gender" defaultValue={auth.userData.gender}>
                                            <option disabled value={''}></option>
                                            <option value={'male'}>male</option>
                                            <option value={'female'}>female</option>
                                        </Form.Select>
                                    </div>                                            
                                </Card>                               
                            </div>
                        </Col>
                        <Col xl={12}>
                            <div className="mx-5 px-5">
                                <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                    <div className="px-5 py-4">
                                        <Form.Label className=''><p>Your Email :</p></Form.Label>                                     
                                        <Input
                                            type="email"
                                            id="email"
                                            name="email"
                                            aria-describedby="email"
                                            className='me-5 pb-3 border-0'
                                            defaultValue={auth.userData.email }
                                            placeholder='Input Your Email *'
                                        />
                                    </div>
                                </Card>                               
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="mt-4 mx-5 px-5 mb-5 d-flex">
                    <Button onClick={()=>setModalShow(true)} type="submit" className={`${styles.button}`}>
                        <div  className=" px-5">Save</div>
                    </Button>
                    <Modals show={modalShow} onHide={() => setModalShow(false)} />
                    <Button className={`${styles.button} text-black text-decoration-none d-flex py-2 ms-3 px-4`}>
                        <Link href="/">
                            <a onClick={logoutHandler} className='d-flex text-decoration-none text-black'>
                                <div className="px-2"><MdLogout /></div>
                                <span className="px-3">Logout</span>
                            </a>
                        </Link>                        
                    </Button>
                </div>
                </Form>
            </div> 
            :
            <div className={`${styles.containers} `}>
            <div className={`${styles.profiles} `}>
                <div className="d-flex flex-column justify-content-center vh-50">
                    <div className={`${styles.content} text-center mt-4`}>Profile</div>
                    <div className={`${styles.contents} text-center mb-5`}>See your notifications for the latest updates</div>
                </div>
            </div>
            <div className="d-flex justify-content-center align-items-center">                    
                <NavbarProfile />    
            </div>
            <Form onSubmit={profileHandler}>
            <div className="mt-5 mx-5 px-5">
                <div className="d-flex flex-row align-items-center position-relative">
                    <div className="align-items-center d-flex flex-column mt-5">
                    <Image src={auth.userData?.picture || people} width={70} height={70} alt="profile" id="profile-image" className=" rounded-circle" />
                    <Button block variant='pallet-2 radius  ' onClick={(e) => uploadFile(e)}> Edit <HiOutlinePencil size={20} /> </Button>
                    <input type="file"
                        ref={hiddenFileInput}
                        className='d-none'
                        name='picture'
                        accept='image'
                        onChange={(e) => fileInputHandler(e)}
                    />
                    </div>
                    <div className="mx-3">
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            aria-describedby="name"
                            className='ms-2 px-2 pb-2 border-0'
                            defaultValue={auth.userData.name}
                            placeholder='Input Your Name *'
                        />
                        <div className="px-3">as {role?.name}</div>
                    </div>                        
                </div>
            </div>
            <div>
                <Row className={`${styles.row} mt-4`}>
                    <Col xl={12}>
                        <div className="mx-5 px-5 mt-4">
                            <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                <div className="px-5 py-4">
                                <Form.Label className='align-items-center'><p>Gender :</p></Form.Label>
                                    <Form.Select className='border-0' size="md" id="gender" name="gender" defaultValue={auth.userData.gender}>
                                        <option disabled value={''}></option>
                                        <option value={'male'}>male</option>
                                        <option value={'female'}>female</option>
                                    </Form.Select>
                                </div>                                            
                            </Card>                               
                        </div>
                    </Col>
                    <Col xl={12}>
                        <div className="mx-5 px-5">
                            <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                <div className="px-5 py-4">
                                    <Form.Label className=''><p>Your Email :</p></Form.Label>                                     
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        aria-describedby="email"
                                        className='me-5 pb-3 border-0'
                                        defaultValue={auth.userData.email }
                                        placeholder='Input Your Email *'
                                    />
                                </div>
                            </Card>                               
                        </div>
                    </Col>
                    <Col xl={12}>
                        <div className="mx-5 px-5">
                            <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                <div className="px-5 py-4">
                                    <Form.Label className=''><p>Store Name :</p></Form.Label>                                     
                                    <Input
                                        type="store_name"
                                        id="store_name"
                                        name="store_name"
                                        aria-describedby="store_name"
                                        className='me-5 pb-3 border-0'
                                        defaultValue={auth.userData.store_name }
                                        placeholder='Your Store Name *'
                                    />
                                </div>                                            
                            </Card>                               
                        </div>
                    </Col>
                    <Col xl={12}>
                        <div className="mx-5 px-5">
                            <Card className={`${styles.cards} d-flex flex-row justify-content-between align-items-center `}>
                                <div className="px-5 py-4">
                                    <Form.Label className=''><p>Store Description :</p></Form.Label>                                     
                                    <Input
                                        type="store_description"
                                        id="store_description"
                                        name="store_description"
                                        aria-describedby="store_description"
                                        className='me-5 pb-3 border-0'
                                        defaultValue={auth.userData.store_description }
                                        placeholder='Your Store Description *'
                                    />
                                </div>                                            
                            </Card>                               
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="mt-4 mx-5 px-5 mb-5 d-flex">
                <Button onClick={()=>setModalShow(true)} type="submit" className={`${styles.button}`}>
                    <div  className=" px-5">Save</div>
                </Button>
                <Modals show={modalShow} onHide={() => setModalShow(false)} />
                <Button className={`${styles.button} text-black text-decoration-none d-flex py-2 ms-3 px-4`}>
                    <Link href="/">
                        <a onClick={logoutHandler} className='d-flex text-decoration-none text-black'>
                            <div className="px-2"><MdLogout /></div>
                            <span className="px-3">Logout</span>
                        </a>
                    </Link>                        
                </Button>
            </div>
            </Form>
        </div> 
            }
            
            </Layout>
        </>
    )
}

export default ProfileSeller