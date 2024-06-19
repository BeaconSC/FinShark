import React, {useState, ChangeEvent, SyntheticEvent} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Search from '../../Components/Search/Search'
import { CompanySearch } from '../../company';
import ListPortfolio from '../../Components/Portfolio/ListPortfolio/ListPortfolio';
import CardList from '../../Components/CardList/CardList';
import { searchCompanies } from '../../api';

interface Props {}

const SearchPage = (props: Props) => {
      // set state for props
  const [search, setSearch] = useState<string>("");
  const [searchResult, setSearchResult] = useState<CompanySearch[]>([]);
  const [serverError, setServerError] = useState<string>("");

  // set the state for saved company info in portfolio
  const [portfolioValues, setPortfolioValues] = useState<string[]>([]);

  const handleSearchChange = (e : ChangeEvent<HTMLInputElement>) =>{
      setSearch(e.target.value);
      console.log(e);
  }

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
    const exists = portfolioValues.find((value) => value === e.target[0].value);
    if (exists) return;
    // change the value of portfolioValue
    const updatedPortfolio = [...portfolioValues,e.target[0].value];
    setPortfolioValues(updatedPortfolio);
  }

  const onPortfolioDelete = (e: any) => {
    e.preventDefault();
    const removed = portfolioValues.filter((value)=>{
      return value != e.target[0].value;
    });
    setPortfolioValues(removed);
  }
  return (
    <div>
        <Search onSearchSubmit={onSearchSubmit} search={search} handleSearchChange={handleSearchChange}/>
        {serverError && <h1>{serverError}</h1>}
        <ListPortfolio portfolioValues = {portfolioValues} onPortfolioDelete ={onPortfolioDelete}/>
        <CardList searchResults={searchResult} onPortfolioCreate={onPortfolioCreate}/>
    </div>
  )
}

export default SearchPage