import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface Company {
  company_name: string;
  company_number: string;
  company_status: string;
  type: string;
  kind: string;
  links: { self: string };
  date_of_cessation: string;
  date_of_creation: string;
  registered_office_address: {
    address_line_1: string;
    locality: string;
    postal_code: string;
    country: string;
  };
  sic_codes: string[];
}

function App() {
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [filteredCompanyData, setFilteredCompanyData] = useState<Company[]>([]);
  const [nobList,setNOBList] = useState<object>({})
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const companiesPerPage = 10;

  const fetchDataHandler = async () => {
    const response = await fetch("./res.json");

    const data: Company[] = await response.json();
    setCompanyData(data);
    setFilteredCompanyData(data); // Initialize filtered data with all companies
  };
  const nobListHandler = async () => {
    const response = await fetch("./nob.json");
    const data:object = await response.json();
    setNOBList(data);
    
  };


  useEffect(() => {
    fetchDataHandler();
    nobListHandler();
  }, []);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredCompanies = companyData.filter((company) =>
      company.sic_codes.some((sic) => sic.includes(term))
    );
    setFilteredCompanyData(filteredCompanies);
    setPage(1); // Reset pagination when applying a search
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredCompanyData(companyData);
    setPage(1); // Reset pagination when clearing the search
  };

  const startIndex = (page - 1) * companiesPerPage;
  const endIndex = startIndex + companiesPerPage;
  const companiesToShow = filteredCompanyData.slice(startIndex, endIndex);

  return (
    <div className="w-full">
      <Header filteredCompanyData={filteredCompanyData} nobList={nobList} />
      <div className="max-w-[1200px] px-4 py-4 mx-auto mb-24 w-full">
        <div className="mb-6">
          <input
            type="number"
            className="py-3 mr-4 px-6 rounded-3xl w-full sm:w-1/3 shadow-md block md:inline"
            placeholder="Search by SIC codes"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="text-[#019267] shadow-md bg-white border-2 mt-2 hidden md:inline md:float-none md:m-0 px-4 py-2 border-[#019267] hover:text-white hover:bg-[#004225] font-semibold hover:border-0"
            onClick={clearSearch}
          >
            Clear Search
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesToShow.map((company) => (
            <Card key={company.company_number} data={company} nobList={nobList} />
          ))}
        </div>
        <Stack spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Pagination
            count={Math.ceil(filteredCompanyData.length / companiesPerPage)}
            page={page}
            onChange={handleChangePage}
          />
        </Stack>
      </div>
    </div>
  );
}

export default App;
