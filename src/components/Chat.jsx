import { useEffect, useState } from "react";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [message,setMessage] = useState([]);
  const [inputMessage,setInputMessage]=useState({
    name:"",
    msg:""
  });
  useEffect(() => {
    const fetchData = async () => {
      const socketdata = new WebSocket("ws://16.171.40.137/");
      console.log(socketdata);
      socketdata.onerror = () => {
        console.error;
      };
      socketdata.onopen = () => {
        console.log("Connected");
        setSocket(socketdata);
      };
      socketdata.onmessage = (message) => {
        const parsedMessage = JSON.parse(message.data); 
        console.log("onMessage handler:", parsedMessage);
        setMessage((prevMessages) => [...prevMessages, parsedMessage]);
      };
    };
    fetchData();

    return ()=>{
        if(socket)
            socket.close();
    }
  },[]);
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setInputMessage((prevMessage)=>({
        ...prevMessage,
        [name]:value
    }))
  }
  const sendMessage = ()=>{
    if(inputMessage.msg && inputMessage.name){
        socket.send(JSON.stringify(inputMessage));
    setInputMessage({...inputMessage,msg:""});
    }
  }



  if (!socket) return <div>Connecting to socker</div>;
  return (
    <>
      <div>
        {message.map((message, index) => (
          <div key={index}>
            <strong>{message.name}</strong>
            <p>{message.msg}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        name="name"
        value={inputMessage.name}
        placeholder="enter name"
        onChange={handleChange}
      />
      <input
        type="text"
        name="msg"
        value={inputMessage.msg}
        placeholder="enter message"
        onChange={handleChange}
      />



      <button onClick={sendMessage}>SEND</button>
    </>
  );
}
