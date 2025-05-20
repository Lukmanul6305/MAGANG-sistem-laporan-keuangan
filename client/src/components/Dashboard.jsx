import React,{useState,useEffect} from "react";
import axios from "axios";

const Dashboard = () => {
  const [name,setName] = useState('')
  const [token,setToken] = useState('')

  useEffect(()=>{
    refreshToken();
  },[])

  const refreshToken = async ()=>{
    try{
      const response = await axios.get('http://localhost:5000/api/token',{
      withCredentials: true
    })
      setToken(response.data.accessToken);
      const decoded = jwt_decode(response.data.accessToken)
      console.log(decoded)
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      <div className="title">Welcome back: </div>
    </div>
  );
};

export default Dashboard;
