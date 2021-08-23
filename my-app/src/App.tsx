import React, {useState, useEffect} from 'react';
import './App.css';

interface IDelivery{
  end: Date;
  start: Date;
}

interface IDeliveryAddress{
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IPickup{
  end: Date;
  start: Date;
}

interface IPickupAddress{
  administrative_area: string;
  country_code: string;
  line_1: string;
  locality: string;
  postal_code: string;
}

interface IReward{
  amount: number;
  currency: string;
}

interface ITransport {
  id: number;
  delivery: IDelivery;
  delivery_address: IDeliveryAddress;
  max_volume_m3: number;
  pickup: IPickup;
  pickup_address: IPickupAddress;
  reward: IReward;
}



function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<ITransport[]>([]);

  useEffect(() => {
    fetch("https://brenger-interviews.s3.amazonaws.com/open_transport_jobs.json")
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
          console.log(result)
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])


  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <ul>
        {items.map(item => (
          <li key={item.id} style={{backgroundColor: 'orange'}}>
            <div>
              <p>job number{item.id}</p>
              <div style={{padding: 5}} >
                <p>delivery date</p>
                <p>start date: {item.delivery.start}</p>
                <p>end date: {item.delivery.end}</p>
              </div>
              <div style={{padding: 5}} >
                <p>delivery location</p>
                <p>{item.delivery_address.line_1}, {item.delivery_address.postal_code}, {item.delivery_address.locality}</p>
                <p>{item.delivery_address.administrative_area}, {item.delivery_address.country_code}</p>
              </div>
              <p>max_volume_m3: {item.max_volume_m3}</p>
              <div style={{padding: 5}} >
                <p>pickup date</p>
                <p>start date: {item.pickup.start}</p>
                <p>end date: {item.pickup.end}</p>
              </div>
              <div style={{padding: 5}} >
                <p>pickup location</p>
                <p>{item.pickup_address.line_1}, {item.pickup_address.postal_code}, {item.pickup_address.locality}</p>
                <p>{item.pickup_address.administrative_area}, {item.pickup_address.country_code}</p>
              </div>
              <p>Reward</p>
              <p>{item.reward.amount} {item.reward.currency}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  }

}

export default App;
