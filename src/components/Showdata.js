import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from '../FirebaseInit';
import styled from '../App.module.css';

async function DeleteItem(id){
    console.log("id: ", id);
    try{
        await deleteDoc(doc(db, "products", id));
    }
    catch{
        console.log('Error while Deleting the item');
        return ;
    }
    alert('Delete Is Successfull!');
}

export default function Showdata(props) {
  const { setCost, setName, setImage} = {...props};  
  const [products, setProducts] = useState([]);

  async function updateItem(id, cost, name, imageUrl){
    setCost(cost);
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
        const querySnapshot = await getDocs(collection(db, "products"));
        const data = querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        setProducts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <h1 className={styled.head}>Available Data</h1>
      <div className={styled.main_container}>
        {products && products.map((product, index) => {
            return (
            <div className={styled.widget} key={index}>
                <img src={product.imageUrl} alt={"image"+index} />
                <div className={styled.product_info}>
                    {/* <span>About: {product.name}</span> */}
                    <span>Price: <b>{product.cost}</b></span>
                </div>
                <div className={styled.buttons}>
                    <button onClick={()=>{updateItem(product.id, product.cost, product.name, product.imageUrl)}} className="btn btn-primary">Edit</button>
                    <button onClick={()=>{DeleteItem(product.id)}} className="btn btn-danger">Delete</button>
                </div>
            </div>
            )})}
      </div>
    </>
  );
}
