// import {useEffect, useState} from "react";
// import api from "./services/api.tsx";



export interface Order {
    id:number;
    name: string;


}
const App = () => {
    console.log('FRONTEND VERSION 123');
    // const [orders, setOrders]= useState<Order[]>([]);
    // useEffect(() => {
    //     api.get('/api/orders', {
    //         headers: {
    //             Authorization: `Bearer ${token}`
    //         }
    //     })
    //    .then(({data}) => setOrders(data))
    //     .catch(console.error);
    // },[])

    return (
        <div>
            <h1>Checking</h1>
            {/*{*/}
            {/*    orders.map(order =><div key={order.id}>{JSON.stringify(order)}</div>)*/}
            {/*}*/}
        </div>
    );
};

export default App;
