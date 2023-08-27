import React, { useState } from 'react';
import {db} from '../FirebaseInit';
import { collection, addDoc } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import styled from '../App.module.css';
import Showdata from './Showdata';

export default function UploadImages(){
    const [image, setImage] = useState('');
    const [cost, setCost] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e)=>{
        e.preventDefault();
        // Add a new document with a generated id.
        let imageUrl ;
        const storage = getStorage();
        const storageRef = ref(storage);

        if (image instanceof File) {
            const imagePath = "images/" + image.name;
            const imageRef = ref(storageRef, imagePath);
            try {
                const uploadTask = await uploadBytes(imageRef, image);
                console.log('Upload complete:', uploadTask);

                imageUrl = await getDownloadURL(imageRef);
            } catch (error) {
                console.error('Upload error:', error);
                return ;
            }
        }
        const docRef = await addDoc(collection(db, "products"), {
            name, cost, imageUrl
        });
        console.log("Document written with ID: ", docRef.id, image);
        alert('Image Upload Is Successfull!');
        setImage('');
        setCost('');
        setName('');
    }

    return(
        <>
            <h1>
                Uploading Images
            </h1>
            <form className={styled.upload_form} onSubmit={(e)=>handleSubmit(e)}>
                <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" required/>
                <input value={cost} onChange={(e)=>{setCost(e.target.value)}} type="number" name="cost" required placeholder='Enter Cost: '/>
                <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" name="name" placeholder='Enter name of the product: '/>
                <button className='btn btn-primary'>Submit</button>
            </form>
            <Showdata cost={cost} name={name} setCost={setCost} setName={setName} setImage={setImage}/>
        </>
    );
}