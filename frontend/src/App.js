import './App.css';
import { useState, useEffect } from 'react';




function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/clothing")
      .then(response => response.json())
      .then(data => setItems(data))
}, []);

  return (
    <div>
      <h1>Amerie's Closet</h1>
      <input
        value = {items}
        onChange={(e) => setItems(e.target.value)}
      />
      <p>{items.length} items in closet</p>
      {items.map(item => (
      <p>{item[1]} - {item[2]} - {item[3]} - {item[4]}</p>
      ))}
    </div>
  );
}

export default App;
