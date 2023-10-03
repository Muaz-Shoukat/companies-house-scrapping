interface Company {
  company_name: string;
  company_number: string;
  company_status: string;
  company_type: string;
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

interface HeaderProps {
  filteredCompanyData: Company[]; // Assuming Company is the correct type
}

import { CSVLink } from "react-csv";

const Header = ({ filteredCompanyData }: HeaderProps) => {
  const generateCSVData = () => {
    const csvData = filteredCompanyData.map((company) => ({
      company_name: company.company_name,
      "Nature of Bussiness": company.company_type,
      "Incorporation Date": company.date_of_creation,
    }));
    return csvData;
  };

  return (
    <div className="bg-[#004225] py-4 text-white w-full">
      <div className="max-w-[1200px] flex justify-between items-center mx-auto px-2">
        <a
          href="/"
          className="text-base md:text-xl font-semibold cursor-pointer"
        >
          COMPANY LISTING
        </a>

        <CSVLink
          data={generateCSVData()}
          filename={"filtered_companies.csv"}
          className=" flex justify-center items-center py-2 px-4 bg-[#FFB000] text-sm md:text-lg font-semibold text-[#019267] rounded-md z-10 cursor-pointer hover:translate-y-[-3px] transition-all"
          target="_blank"
        >
          Download CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default Header;
