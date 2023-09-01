import React, { useEffect, useState } from "react";
import { collection, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../FirebaseInit';
import styled from '../App.module.css';

async function DeleteItem(product, index){
    console.log("id: ", product.products, index);
    try{
        const rateDocumentRef = doc(db, "rates", product.id.toString());

// Check if the document exists
const rateDocumentSnapshot = await getDoc(rateDocumentRef);
const newArr = product.products.filter((_, i) => i !== index);
console.log('newArr', newArr);
    if (rateDocumentSnapshot.exists()) {
    // If the document exists, update the "products" array with the new array
    await updateDoc(rateDocumentRef, {
        products: newArr
    });
    } else {
        // If the document doesn't exist, create it with the "products" array
        await setDoc(rateDocumentRef, {
            products: newArr
        });
    }

    }
    catch{
        console.log('Error while Deleting the item');
        return ;
    }
    alert('Delete Is Successfull!');
}

export default function Showdata(props) {
  const { setName, setImage, uploadRate} = {...props};  
  const [products, setProducts] = useState([]);

  async function updateItem(id, name, imageUrl){
    setName(name);
    setImage(imageUrl);
    console.log("clicked", id);
    const washingtonRef = doc(db, "products", id);
        try{
            await updateDoc(washingtonRef, {
                capital: true
            });
        }
        catch{
            console.log('Error while updating the data');
            return ;
        }
        alert('Update Successfull!');
    }

    useEffect(() => {
        async function fetchData() {
          try {
            // Remove the 'const unsubscribe =' line, as it's not used.
            onSnapshot(collection(db, "rates"), (querySnapshot) => {
              const data = querySnapshot.docs
                .filter((doc) => {
                  // Replace 'desiredId' with the ID you want to filter for
                  return doc.id === `${uploadRate.toString()}`;
                })
                .map((doc) => ({ id: doc.id, ...doc.data() }));
              setProducts(data);
            });
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
      
        fetchData();
      }, [uploadRate]);      

  return (
    <>
    <h1 className={styled.head}>Available Data</h1>
    <div>
        {products && products.map((product, index) => (
            <div className={styled.main_container} key={index}>
                {product.products.map((item, itemIndex) => (
                    <div className={styled.widget} key={itemIndex}>
                        <img src={item.imageUrl} alt={"image" + itemIndex} />
                        <div className={styled.product_info}>
                            {/* <span>About: {product.name}</span> */}
                            <span>Price: <b>{product.price}</b></span>
                        </div>
                        <div className={styled.buttons}>
                            <button onClick={() => { updateItem(product.id, product.price, product.name, product.imageUrl) }} className="btn btn-primary">Edit</button>
                            <button onClick={() => { DeleteItem(product, itemIndex) }} className="btn btn-danger">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </div>
</>

  );
}
