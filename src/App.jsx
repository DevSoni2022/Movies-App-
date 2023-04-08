import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration,getGenres } from "./store/homeSlice";
import { fetchDataFromApi } from "./utils/api";
import { BrowserRouter,Routes,Route } from "react-router-dom";
// import header from './components/header';
import Header from "./components/header/Header";
// import Footer from "components\footer\Footer.jsx";

// import Home from './pages/Home';
import Home from './pages/Home/Home.jsx';
import SearchResult from './pages/searchResult/SearchResult';
import Details from './pages/details/Details';
import Explore from './pages/explore/Explore';
import PageNotFound from './pages/404/PageNotFound';
import Footer from './components/footer/Footer';

function App() {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.home);

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, []);

  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      console.log(res,"***");
      const url ={
        backdrop:res.images.secure_base_url + 
        "w1280",
        poster:res.images.secure_base_url + 
        "orignal",
        profile:res.images.secure_base_url + 
        "orignal",
        alt:res.images.secure_base_url + 
        "orignal",
      }
      dispatch(getApiConfiguration(url));
    });
  };
  const genresCall = async() =>{

    let promises = [];
    let endPoints = ["tv","movie"];

    let allGenres = {};

    endPoints.forEach((url)=>{
      return promises.push(fetchDataFromApi(`/genre/${url}/list`))
    })

    const data = await Promise.all(promises)

    data.map((ele)=>{
      
      return  ele && ele.genres && ele.genres.map((item)=>(allGenres[item.id]=item))
    })

    dispatch(getGenres(allGenres))

  }
  return (
   <BrowserRouter>
   <Header/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/:mediaType/:id"     element={<Details/>} />
      <Route path="/search/:query"      element={<SearchResult/>} />
      <Route path="/explore/:mediaType" element={<Explore/>} />
      <Route path="*"                   element={<PageNotFound/>}/>
    </Routes>
    <Footer/>
   </BrowserRouter>
  );
}

export default App;
