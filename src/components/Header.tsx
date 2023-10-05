interface Company {
  overview: Overview;
  filing: Filing[];
}

interface Overview {
  links: Links;
  date_of_creation: string;
  sic_codes?: string[];
  company_name: string;
}

export interface Links {
  self: string;
}

export interface Filing {
  date: string;
  links: Links2;
}

export interface Links2 {
  self: string;
}

interface HeaderProps {
  filteredCompanyData: Company[];
  nobList: object;
}

import { CSVLink } from "react-csv";

const Header = ({ filteredCompanyData, nobList }: HeaderProps) => {
  const generateCSVData = () => {
    const csvData = filteredCompanyData.map((company) => ({
      company_name: company.overview.company_name,
      company_link: `${import.meta.env.VITE_REQUEST_URL}/${
        company.overview.links.self
      }`,
      "Nature of Bussiness": company.overview.sic_codes?.map(
        (code) => nobList[code as keyof object]
      ),
      "Incorporation Date": company.overview.date_of_creation,
      "SH02 Dates": company.filing.map((file) => file.date),
      "SH02 Links": company.filing.map(
        (file) =>
          `${import.meta.env.VITE_REQUEST_URL}${
            file.links.self
          }/document?format=pdf&download=0`
      ),
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
