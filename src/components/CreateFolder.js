import { collection, getDocs, setDoc, doc, deleteDoc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import styled from '../App.module.css';
import { db } from '../FirebaseInit';
import UploadImages from './UploadImages';

function Form(props) {
    const { visible, setVisible, setPrice, handleSubmit } = props;

    return (
        <form onSubmit={(e) => { handleSubmit(e) }} className={styled.folder_form}>
            <input onChange={(e) => { setPrice(e.target.value) }} type="number" placeholder='Enter Cost:' required />
            <button className='btn btn-primary'>Done</button>
            <button onClick={() => { setVisible(!visible) }} className='btn btn-danger'>Cancel</button>
        </form>
    );
}

function Folder(props) {
    const { rate, setUploadRate, toggleFolders, setToggleFolders } = props;

    function picUpload(rate) {
        setUploadRate(rate);
    }

    async function deleteFolder(rate) {
        try {
            await deleteDoc(doc(db, "rates", rate));
        }
        catch {
            console.log('Error while deleting the data: ');
            return;
        }
        alert(`Folder ${rate} Deleted`);
    }

    const handleCloudClick = () => {
        setToggleFolders(!toggleFolders);
        picUpload(rate);
    }

    return (
        <div className={styled.folder}>
            <span><b>{rate}</b></span>
            <div className={styled.manage_data}>
                <span><i onClick={handleCloudClick} className="bi bi-cloud-arrow-up-fill"></i></span>
                <span><i onClick={() => { deleteFolder(rate) }} className="bi bi-trash"></i></span>
            </div>
        </div>
    );
}

export default function CreateFolder() {
    const [toggleFolders, setToggleFolders] = useState(true);
    const [visible, setVisible] = useState(false);
    const [price, setPrice] = useState('');
    const [rates, setRates] = useState([]);
    const [uploadRate, setUploadRate] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "rates"));
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setRates(data);
        }
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const unsubscribe = onSnapshot(collection(db, "rates"), (querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setRates(data);
            });

            // Return a cleanup function to unsubscribe when component unmounts
            return () => {
                unsubscribe();
            };
        };

        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const documentRef = doc(db, 'rates', price.toString());
            await setDoc(documentRef, {
                price: price
            });
        }
        catch {
            console.log('Error While Adding Document: ');
            return;
        }
        alert("New Folder Created Successfully!");
        setVisible(!visible);
    }
    const sortedRates = rates.slice().sort((a, b) => a.price - b.price);
    return (
        <>
            {toggleFolders && <h1>Available Folders</h1>}
            {toggleFolders && <div className={styled.folder_container}>
                <div className={styled.folder}>
                    {!visible && <span onClick={() => setVisible(!visible)}><i className="bi bi-folder-plus"></i></span>}
                    {visible && <Form visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} setPrice={setPrice} />}
                </div>
                {sortedRates.map((rate, index) => {
                    return (
                        <Folder key={index} setToggleFolders={setToggleFolders} toggleFolders={toggleFolders} rate={rate.price} setUploadRate={setUploadRate} />
                    );
                })}
            </div>}
            {uploadRate && <UploadImages uploadRate={uploadRate} setToggleFolders={setToggleFolders} toggleFolders={toggleFolders} />}
        </>
    );
}