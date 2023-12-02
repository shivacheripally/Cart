import React, { useEffect, useState } from "react";
import { collection, updateDoc, doc, getDocs, deleteDoc, onSnapshot } from "firebase/firestore";
import { db } from '../FirebaseInit';
import styled from '../App.module.css';

async function DeleteMultipleItems(uploadRate, deleteItems, setSelectDelete) {
    try {
        const rateDocumentRef = doc(db, "rates", uploadRate.toString());

        const productCollectionRef = collection(rateDocumentRef, "products");


        const querySnapshot = await getDocs(productCollectionRef);
        querySnapshot.forEach((docs) => {
            deleteItems.forEach(async (item) => {
                if (docs.id === item) {
                    await deleteDoc(doc(db, "rates", uploadRate.toString(), "products", item));
                }
            })
        });
        if (deleteItems.length) alert(`Successfully Deleted ${deleteItems.length} Items!`);
        setSelectDelete([]);
    }
    catch {
        console.log('Error while Deleting the item');
        return;
    }
}

async function DeleteItem(id, uploadRate) {
    try {
        const rateDocumentRef = doc(db, "rates", uploadRate.toString());

        const productCollectionRef = collection(rateDocumentRef, "products");


        const querySnapshot = await getDocs(productCollectionRef);
        querySnapshot.forEach(async (docs) => {
            if (docs.id === id) {
                await deleteDoc(doc(db, "rates", uploadRate.toString(), "products", id));
            }
        });
        alert('Delete Is Successfull!');
    }
    catch {
        console.log('Error while Deleting the item');
        return;
    }
}

export async function UpdateItem(e, id, imageUrl, name, setIsEdit, uploadRate, price) {
    e.preventDefault();
    const ratesDocRef = doc(db, "rates", uploadRate.toString());
    const productsCollectionRef = collection(ratesDocRef, "products");
    const productDocRef = doc(productsCollectionRef, id);
    try {
        await updateDoc(productDocRef, {
            imageUrl,
            name,
            price
        });
        setIsEdit(false);
        alert('Update Successfull!');
    }
    catch {
        console.log('Error while updating the data');
        return;
    }
}

export default function Showdata(props) {
    const [toggleShowData, setToggleShowData] = useState(false);
    const { uploadRate, isEdit, setIsEdit, setName, setUpdateUrl, setUpdateId, setUpdatePrice } = { ...props };
    const [products, setProducts] = useState([]);
    const [selectDelete, setSelectDelete] = useState([]);

    const handleCheckboxChange = (id) => {
        // Check if the id is already in selectDelete
        const isSelected = selectDelete.includes(id);
        // If the id is already in selectDelete, remove it; otherwise, add it
        if (isSelected) {
            setSelectDelete((prevSelectDelete) =>
                prevSelectDelete.filter((selectedId) => selectedId !== id)
            );
        } else {
            setSelectDelete([id, ...selectDelete]);
        }
    }

    useEffect(() => {
        const fetchProducts = async () => {
            const ratesDocRef = doc(db, "rates", uploadRate.toString());
            const productsCollectionRef = collection(ratesDocRef, "products");

            const unsubRatesDoc = onSnapshot(ratesDocRef, (doc) => {
            });

            const unsubProductsCollection = onSnapshot(productsCollectionRef, (snapshot) => {
                const data = snapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                });
                setProducts(data);
            });

            return () => {
                unsubRatesDoc();
                unsubProductsCollection();
            };
        };

        fetchProducts();
    }, [uploadRate]);

    const handleEditClick = (id, imageUrl, name, price) => {
        setName(name);
        setUpdateUrl(imageUrl);
        setUpdateId(id);
        setUpdatePrice(price);
        setIsEdit(!isEdit);
    }

    return (
        <>
            <br />
            <div className={styled.buttons} style={{ maxWidth: '300px' }}>
                <button className="btn btn-primary" onClick={() => setToggleShowData(!toggleShowData)}>{toggleShowData ? "Hide Data" : "Show Data"}</button>
                {selectDelete.length !== 0 && <button className="btn btn-danger" onClick={() => DeleteMultipleItems(uploadRate, selectDelete, setSelectDelete)}>Delete Selected</button>}
            </div>
            {toggleShowData && <div>
                <div className={styled.main_container}>
                    {products.map((product) => {
                        return (
                            <div className={styled.widget} key={product.id}>
                                <img src={product.imageUrl} alt={"image" + product.price} />
                                <div className={styled.product_info}>
                                    <span>About: {product.name}</span>
                                    <span>Price: <b>{product.price}</b></span>
                                </div>
                                <div className={styled.buttons}>
                                    <button className="btn btn-primary" onClick={() => handleEditClick(product.id, product.imageUrl, product.name, product.price)}>Edit</button>
                                    {selectDelete.includes(product.id) ? <input type="checkbox" onChange={() => handleCheckboxChange(product.id)} checked /> : <input type="checkbox" onChange={() => handleCheckboxChange(product.id)} />}
                                    <button onClick={() => { DeleteItem(product.id, uploadRate) }} className="btn btn-danger">Delete</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </>
    );
}