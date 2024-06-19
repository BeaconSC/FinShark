import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom';
import { CompanyProfile } from '../../company';
import { getCompanyProfile } from '../../api';

interface Props {}

const CompanyPage = (props: Props) => {
    let { ticker } = useParams();
    const [company, setCompany] = useState<CompanyProfile>();

    useEffect(() => {
        const getProfileInit = async () => {
            const result = await getCompanyProfile(ticker!);
            setCompany(result?.data[0]);
        }
        getProfileInit();
    },[])
    return (
        <div>
            {company? (<div>{company.companyName}</div>)
            : (<div>Company not found!</div>)
            }
        </div>
    )
}

export default CompanyPage