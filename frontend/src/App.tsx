import {useEffect, useState} from "react";
import axios from "axios";


export interface Order {
    id:number;
    name: string;


}
const App = () => {
    console.log('FRONTEND VERSION 123');
    const [orders, setOrders]= useState<Order[]>([]);
    useEffect(() => {
        axios.get('/api/orders', {
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJqdGkiOiJhYWpobzk1MTlrYSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc2ODcwMDM0NCwiZXhwIjoxNzY4NzAzOTQ0fQ.5I6o9Dxn5RD3nT_Yl24d4D1EvogmJeODfTvEa4JLkKU`
            }
        })
       .then(({data}) => setOrders(data))
        .catch(console.error);
    },[])

    return (
        <div>
            <h1>Checking</h1>
            {
                orders.map(order =><div key={order.id}>{JSON.stringify(order)}</div>)
            }
        </div>
    );
};

export default App;
