import './App.css';
import { useEffect, useState } from "react";
import copy from "./copy.png"
import axios from "axios";

function App() {
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [links,setLinks]=useState([]);

  const generateLink = async () => {
    const response = await axios.post("./link", {
      url,
      slug
    })
    setShortUrl(response?.data?.data?.shortUrl)
  }


  const copyUrl = () => {
    navigator.clipboard.writeText(shortUrl)
    alert('copy to clipboard')
  }

  const loadLinks= async ()=>{
    const response= await axios.get('/api/links');
    setLinks(response?.data?.data)
  }

  useEffect(()=>{
    loadLinks();
  },[])
  

  return (
    <div className="text-center">
      <h1>Quick Links🖇️</h1>

      <div className='container'>
        <div className='link-card'>
          <h2>Link Generation</h2>

          <input type='text'
            placeholder='URL'
            value={url}
            className='box'
            onChange={(e) => {
              setUrl(e.target.value)
            }}
          /><br />

          <input type='text'
            placeholder='Slug (optional'
            value={slug}
            className='box'
            onChange={(e) => {
              setSlug(e.target.value)
            }}
          /><br />

          <div className='conteiner-flex'>
            <b><input type='text'
              placeholder='Short Url'
              value={shortUrl}
              className='inputbox'
              disabled /></b>
            <br />

            <img src={copy} alt="copy"
              className='copy-icon'
              onClick={copyUrl} />

          </div>

          <button type='button'
            className='btn'
            onClick={generateLink}>
            Do Magic🪄
          </button>
        </div>

        <div className='links-text-container'>

      

          {
            links?.map((linkObj,index)=>{
               const {url,slug,clicks}=linkObj;
              return(
                <>
                <div key={index} className='link-content'>
                  <p className='link-text'>URL :        {url}</p>
                  <p>Short Url : {process.env.REACT_APP_BASE_URL}/{slug}</p>
                  <p>Clicks : {clicks}</p>
                </div>
                </>

              )
            })
          }
        </div>
      </div>
    </div>
  );
}

export default App;
