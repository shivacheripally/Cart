import React, { useState } from 'react';
import { db } from '../FirebaseInit';
import { doc, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import styled from '../App.module.css';
import Showdata, { UpdateItem } from './Showdata';

export default function UploadImages(props) {
    const [toggleForm, setToggleForm] = useState(true);
    const [images, setImages] = useState([]);
    const [name, setName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [updateUrl, setUpdateUrl] = useState('');
    const [updateId, setUpdateId] = useState('');
    const [updatePrice, setUpdatePrice] = useState('');
    const { uploadRate, toggleFolders, setToggleFolders } = props;

    const handleSubmit = async (e) => {
        e.preventDefault();
        let imageUrl;
        const storage = getStorage();
        const storageRef = ref(storage);

        for (const image of images) {
            const imagePath = "images/" + image.name;
            const imageRef = ref(storageRef, imagePath);
            try {
                await uploadBytes(imageRef, image);

                imageUrl = await getDownloadURL(imageRef);

                // Get the reference to the document in the "rates" collection
                const rateDocumentRef = doc(db, "rates", uploadRate.toString());

                const productCollectionRef = collection(rateDocumentRef, "products");

                const newData = {
                    name, imageUrl, price: uploadRate
                };

                await addDoc(productCollectionRef, newData);

            } catch (error) {
                console.error('Upload error:', error);
                return;
            }
        }
        if (images.length) {
            alert(`${images.length} Uploaded Successfully!`);
        }
        setImages([]);
        setName('');
    }

    return (
        <>
            {!toggleFolders && <div>
                <br />
                <h1>
                    {!toggleFolders && <button onClick={() => setToggleFolders(!toggleFolders)} className='btn btn-secondary'>Go Back</button>}
                    &nbsp; Uploading Images
                </h1>
                {toggleForm && !isEdit && <div className={styled.upload_form}>
                    <b>Start Images Uploading Here...</b>
                    <button onClick={() => { setToggleForm(!toggleForm) }} className='btn btn-success'>Upload Image</button>
                </div>}
                {!toggleForm && !isEdit && <form className={styled.upload_form} onSubmit={(e) => handleSubmit(e)}>
                    <b>Cost: {uploadRate}</b>
                    <input onChange={(e) => { setImages(e.target.files) }} multiple type="file" required accept=".png, .jpg, .jpeg"/>
                    <input value={name} onChange={(e) => { setName(e.target.value) }} type="text" name="name" placeholder='Enter name of the product: ' />
                    <span>
                        <button className='btn btn-primary'>Submit</button>
                        &nbsp;&nbsp;&nbsp;
                        <button onClick={() => { setToggleForm(!toggleForm) }} className='btn btn-danger'>Cancel</button>
                    </span>
                </form>}
                {isEdit && <form className={styled.upload_form} onSubmit={(e) => UpdateItem(e, updateId, updateUrl, name, setIsEdit, uploadRate, updatePrice)}>
                    <input type="text" value={updateUrl} onChange={(e)=>{setUpdateUrl(e.target.value)}} />
                    <input type="number" value={updatePrice} onChange={(e)=>{setUpdatePrice(e.target.value)}}/>
                    <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}/>
                    <span>
                        <button type='submit' className='btn btn-primary'>Update</button>
                        &nbsp;&nbsp;&nbsp;
                        <button className='btn btn-danger' onClick={() => setIsEdit(!isEdit)}>Cancel</button>
                    </span>
                </form>}
                <Showdata setUpdatePrice={setUpdatePrice} setUpdateId={setUpdateId} name={name} setName={setName} uploadRate={uploadRate} setUpdateUrl={setUpdateUrl} isEdit={isEdit} setIsEdit={setIsEdit} />
            </div>}
        </>
    );
}