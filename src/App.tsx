import React, { useEffect, useState } from "react";
import Card from "./components/Card";
import Header from "./components/Header";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface Company {
  overview: Overview;
  filing: Filing[];
}

interface Overview {
  links: Links;
  company_number: string;
  date_of_creation: string;
  company_status: string;
  registered_office_address: RegisteredOfficeAddress;
  sic_codes?: string[];
  type: string;
  company_name: string;
  status?: string;
  date_of_cessation?: string;
}

export interface Links {
  self: string;
}

export interface RegisteredOfficeAddress {
  locality?: string;
  address_line_1?: string;
  country?: string;
  postal_code?: string;
  address_line_2?: string;
  region?: string;
  po_box?: string;
  care_of?: string;
}

export interface Filing {
  date: string;
  links: Links2;
  type: string;
}

export interface Links2 {
  self: string;
}

function App() {
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [filteredCompanyData, setFilteredCompanyData] = useState<Company[]>([]);
  const [nobList, setNOBList] = useState<object>({});
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");

  const companiesPerPage = 10;

  const fetchDataHandler = async () => {
    const response = await fetch("./res.json");

    const data: Company[] = await response.json();
    setCompanyData(data);
    setFilteredCompanyData(data); // Initialize filtered data with all companies
  };
  const nobListHandler = async () => {
    const response = await fetch("./nob.json");
    const data: object = await response.json();
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

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    inputType: string
  ) => {
    let sicCode = searchTerm;
    let month = selectedMonth;
    let year = selectedYear;
    if (inputType === "sicCode") {
      sicCode = event.target.value;
    }
    if (inputType === "month") {
      month = event.target.value;
    }
    if (inputType === "year") {
      year = event.target.value;
    }
    const filteredCompanies = companyData.filter(
      (company) =>
        (sicCode
          ? company.overview.sic_codes?.some((sic) => sic.includes(sicCode))
          : true) &&
        (month
          ? company.filing.some((file) => file.date.slice(5, 7) === month)
          : true) &&
        (year
          ? company.filing.some((file) => file.date.slice(0, 4).includes(year))
          : true)
    );

    setFilteredCompanyData(filteredCompanies);
    setPage(1); // Reset pagination when applying a search
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedMonth("");
    setSelectedYear("");
    setFilteredCompanyData(companyData);
    setPage(1);
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // handleSearch(e, "sicCode");
              handleSearch(e, "sicCode");
            }}
          />
          <div className="py-3 mr-4 px-6 rounded-3xl w-full sm:w-1/6 shadow-md block md:inline bg-white my-[6px] md:my-0">
            <select
              value={selectedMonth}
              className="outline-none w-full sm:w-1/6"
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                // handleSearch(e, "month");
                handleSearch(e, "month");
              }}
            >
              <option value="">Select Month</option>
              <option value="01">January</option>
              <option value="02">February</option>
              <option value="03">March</option>
              <option value="04">April</option>
              <option value="05">May</option>
              <option value="06">June</option>
              <option value="07">July</option>
              <option value="08">August</option>
              <option value="09">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
              {/* Add options for all months */}
            </select>
          </div>
          <input
            type="number"
            className="py-3 mr-4 px-6 rounded-3xl w-full sm:w-1/6 shadow-md block md:inline"
            placeholder="Enter Year"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              // handleSearch(e, "year");
              handleSearch(e, "year");
            }}
          />

          <button
            className="text-[#019267] shadow-md bg-white border-2 mt-2 hidden md:inline md:float-none md:m-0 px-4 py-2 border-[#019267] hover:text-white hover:bg-[#004225] font-semibold hover:border-0"
            onClick={clearSearch}
          >
            Clear Search
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesToShow.map((company, index) => (
            <Card key={index} data={company} nobList={nobList} />
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
