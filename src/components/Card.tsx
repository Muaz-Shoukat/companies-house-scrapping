import { useState } from "react";

interface CompanyDataProps {
  data: {
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
  };
}

interface FilingItem {
  date: string;
  type: string;
  links: {
    self: string;
    document_metadata: string;
  };
}

const Card = ({ data }: CompanyDataProps) => {
  const [filingData, setFilingData] = useState<FilingItem[]>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const [isError,setIsError] = useState<string|null>(null)
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_FILING_URL}${data.company_number}`
      );

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setFilingData(responseData.data);
    } catch (error:any) {
      setIsError(`${error.message}`)
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="relative w-full mb-6 rounded-md text-left bg-white shadow-xl">
        <div
          className={`font-semibold mb-2 absolute text-white top-[-12px] right-[10px] text-sm py-1 px-2 rounded-sm  ${
            data.company_status === "dissolved" ? "bg-red-700" : "bg-[#019267]"
          }`}
        >
          {data.company_status.charAt(0).toUpperCase() +
            data.company_status.slice(1).toLowerCase()}
        </div>
        <div className="px-4 py-5">
          <a
            href={`${import.meta.env.VITE_REQUEST_URL}/${
              data.links.self
            }`}
            target="_blank"
            className="text-base mb-2 text-[#019267] font-semibold underline"
          >
            {`${data.company_name} (#${data.company_number})`}
          </a>
          <div className="text-sm text-gray-500 mb-1">
            {`${data.registered_office_address.address_line_1}, ${data.registered_office_address.locality}, ${data.registered_office_address.country}`}
          </div>
          <div className="flex justify-start items-center text-sm">
            <label className="mr-2">Nature of Bussiness: </label>
            <div className=" text-gray-500">{data.company_type}</div>
          </div>
          <div className="flex justify-start items-center text-sm">
            <label className="mr-2">Incorporation Date: </label>
            <div className=" text-gray-500">{data.date_of_creation}</div>
          </div>
          <div className="flex flex-col justify-start items-start text-sm">
            <label className="mr-2 font-semibold text-xs mb-1">
              SIC Codes:{" "}
            </label>
            <div className="flex gap-3">
              {data.sic_codes.map((code) => (
                <div
                  key={code}
                  className="border border-gray-400 text-gray-500 py-[2px] px-2 rounded-3xl"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
          {!filingData.length && !isLoading && !isError && (
            <button
              className="w-full border border-[#019267] hover:border-0 hover:text-white hover:bg-[#019267] rounded-lg text-[#019267] py-2 font-semibold my-2"
              onClick={fetchData}
            >
              Fetch Filing History
            </button>
          )}
          {isLoading && <div className="w-full text-center text-sm">Loading...</div>}
          {filingData.length > 0 && (
            <div className="grid grid-cols-3 text-sm text-[#019267] font-semibold mt-1">
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Download PDF</div>
            </div>
          )}
          {filingData.length > 0 &&
            filingData.map((filing, index) => (
              <div key={index} className="grid grid-cols-3 text-sm my-1">
                <div className="col-span-1">{filing.type}</div>
                <div className="col-span-1">{filing.date}</div>
                <a
                  href={`${import.meta.env.VITE_REQUEST_URL}${
                    filing.links.self
                  }/document?format=pdf&download=0`}
                  target="_blank"
                  className="col-span-1 text-[#019267] underline "
                >
                  View PDF
                </a>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Card;
