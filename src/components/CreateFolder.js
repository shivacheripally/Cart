import { collection, getDocs, setDoc, doc,deleteDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import styled from '../App.module.css';
import { db } from '../FirebaseInit';
import UploadImages from './UploadImages';

function Form(props){
    const {setPrice, handleSubmit} = props;

    return (
        <form onSubmit={(e)=>{handleSubmit(e)}} className={styled.folder_form}>
            <input onChange={(e)=>{setPrice(e.target.value)}} type="number" placeholder='Enter Cost:'/>
            <button className='btn btn-primary'>Done</button>
            <button className='btn btn-danger'>Cancel</button>
        </form>
    );
}

function Folder(props){
    const {rate, setUploadRate} = props;

    function picUpload(rate){
        setUploadRate(rate);
    }

    async function deleteFolder(rate){
        try{
            await deleteDoc(doc(db, "rates", rate));
        }
        catch{
            console.log('Error while deleting the data: ');
            return ;
        }
        alert(`Folder ${rate} Deleted`);
    }
    
    return (
        <div className={styled.folder}>
            <span><b>{rate}</b></span>
            <div className={styled.manage_data}>
                <span><i onClick={()=>{picUpload(rate)}} className="bi bi-cloud-arrow-up-fill"></i></span>
                <span><i onClick={()=>{deleteFolder(rate)}} className="bi bi-trash"></i></span>
            </div>
        </div>
    );
}

export default function CreateFolder(){
    const [visible, setVisible] = useState(false);
    const [price, setPrice] = useState('');
    const [rates, setRates] = useState([]);
    const [uploadRate, setUploadRate] = useState('');

    useEffect(()=>{
        const fetchData = async ()=>{
            const querySnapshot = await getDocs(collection(db, "rates"));
            const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setRates(data);
        }
        fetchData();
    }, []);

    useEffect(()=>{
        const fetchData = async ()=>{
            const querySnapshot = await getDocs(collection(db, "rates"));
            const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
            setRates(data);
        }
        fetchData();
    }, [price]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Add a new document with a generated id.
        try{
            // Add a new document in collection "cities"
            await setDoc(doc(db, "rates", price.toString()), {
                price: price,
                products: []
            });
        }
        catch{
            console.log('Error While Adding Document: ');
            return;
        }
        alert("New Folder Created Successfully!");
        setVisible(!visible);
    }
    const sortedRates = rates.slice().sort((a, b) => a.price - b.price);
    return (
        <>
        <h1>Available Folders</h1>
            <div className={styled.folder_container}>
            <div className={styled.folder}>
                {!visible && <span onClick={()=>setVisible(!visible)}><i className="bi bi-folder-plus"></i></span>}
                {visible && <Form visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} setPrice={setPrice}/>}
            </div>
            {sortedRates.map((rate, index)=>{
                return (
                    <Folder key={index} rate={rate.price} setUploadRate={setUploadRate}/>
                );
            })}
        </div>
        {uploadRate && <UploadImages uploadRate={uploadRate}/>}
        </>
    );
}