import React, { useState } from 'react';
import {db} from '../FirebaseInit';
import { getDoc, setDoc, doc, updateDoc, arrayUnion } from "firebase/firestore"; 
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import styled from '../App.module.css';
import Showdata from './Showdata';

export default function UploadImages(props){
    const [image, setImage] = useState('');
    const [name, setName] = useState('');
    const {uploadRate} = props;

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
        // Get the reference to the document in the "rates" collection
        const rateDocumentRef = doc(db, "rates", uploadRate.toString());
        
        // Check if the document exists
        const rateDocumentSnapshot = await getDoc(rateDocumentRef);
        const newData = {
            name, imageUrl
        };

        if (rateDocumentSnapshot.exists()) {
            // If the document exists, update the "products" array using arrayUnion
            await updateDoc(rateDocumentRef, {
                products: arrayUnion(newData)
            });
        } else {
            // If the document doesn't exist, create it with the "products" array
            await setDoc(rateDocumentRef, {
                products: [newData]
            });
        }

        // Update the array field "products" with the new data using arrayUnion
        await updateDoc(rateDocumentRef, {
            products: arrayUnion(newData)
        });

        alert(`Image Upload Is Successfull! ${uploadRate}`);
        setImage('');
        setName('');
    }

    return(
        <>
            <h1>
                Uploading Images
            </h1>
            <form className={styled.upload_form} onSubmit={(e)=>handleSubmit(e)}>
                <b>Cost: {uploadRate}</b>
                <input onChange={(e)=>{setImage(e.target.files[0])}} type="file" required/>
                <input value={name} onChange={(e)=>{setName(e.target.value)}} type="text" name="name" placeholder='Enter name of the product: '/>
                <button className='btn btn-primary'>Submit</button>
            </form>
            <Showdata name={name} setName={setName} uploadRate={uploadRate} setImage={setImage}/>
        </>
    );
}