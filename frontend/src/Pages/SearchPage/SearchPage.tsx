import React, {useState, ChangeEvent, SyntheticEvent, useEffect} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Search from '../../Components/Search/Search'
import { CompanySearch } from '../../company';
import ListPortfolio from '../../Components/Portfolio/ListPortfolio/ListPortfolio';
import CardList from '../../Components/CardList/CardList';
import { searchCompanies } from '../../api';
import { PortfolioGet } from '../../Models/Portfolio';
import { portfolioAddAPI, portfolioDeleteAPI, portfolioGetAPI } from '../../Services/PortfolioService';
import { toast } from 'react-toastify';

interface Props {}

const SearchPage = (props: Props) => {
      // set state for props
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string>("");

  // set the state for saved company info in portfolio
  const [portfolioValues, setPortfolioValues] = useState<PortfolioGet[] | null>([]);

  const handleSearchChange = (e : ChangeEvent<HTMLInputElement>) =>{
      setSearch(e.target.value);
      console.log(e);
  };

  useEffect(() => {
    getPortfolio();
  }, [])

  const getPortfolio = () => {
    portfolioGetAPI()
    .then((res) => {
      if(res?.data) {
        setPortfolioValues(res?.data);
      }
    }).catch((e) => {
      toast.warning("Could not get portfolio values!");
    })
  };

  // SyntheticEvent could be used in almost all the evnets
  const onSearchSubmit = async (e : SyntheticEvent) =>{
      e.preventDefault();
      const result = await searchCompanies(search);
      if (typeof result === "string"){
        setServerError(result);
      }
      else if(Array.isArray(result.data)){
        setSearchResult(result.data);
      }
      console.log(searchResult);
  }

  // Create Card on Portfolio
  const onPortfolioCreate = (e: any) => {
    e.preventDefault();
    portfolioAddAPI(e.target[0].value)
    .then((res) => {
      if(res?.status === 204) {
        toast.success("Stock added to portfolio!");
        getPortfolio();
      }
    }).catch((e) => {
      toast.warning("Could not create portfolio Item!");
    })
  }

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    portfolioDeleteAPI(e.target[0].value)
    .then((res) => {
      if(res?.status === 200){
        toast.success("Stock deleted from portfolio!");
        getPortfolio();
      }
    })
  }
  return (
    <div>
        <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange}/>
        {serverError && <h1>{serverError}</h1>}
        <ListPortfolio portfolioValues = {portfolioValues!} onPortfolioDelete ={onPortfolioDelete}/>
        <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate}/>
    </div>
  )
}

export default SearchPage