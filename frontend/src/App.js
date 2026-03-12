import './App.css';
import { useState, useEffect } from 'react';




function App() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/clothing/")
      .then(response => response.json())
      .then(data => setItems(data))
}, []);

  return (
    <div>
      <h1>Amerie's Closet</h1>
      <p>{items.length} items in closet</p>
    </div>
  );
}

export default App;
