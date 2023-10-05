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

interface CompanyDataProps {
  data: {
    overview: Overview;
    filing: Filing[];
  };
  nobList: object;
}



const Card = ({ data, nobList }: CompanyDataProps) => {
  

  return (
    <div>
      <div className="relative w-full mb-6 rounded-md text-left bg-white shadow-xl">
        <div
          className={`font-semibold mb-2 absolute text-white top-[-12px] right-[10px] text-sm py-1 px-2 rounded-sm  ${
            data.overview.company_status === "dissolved" ? "bg-red-700" : "bg-[#019267]"
          }`}
        >
          {data.overview.company_status.charAt(0).toUpperCase() +
            data.overview.company_status.slice(1).toLowerCase()}
        </div>
        <div className="px-4 py-5">
          <a
            href={`${import.meta.env.VITE_REQUEST_URL}/${data.overview.links.self}`}
            target="_blank"
            rel="noreferrer"
            className="text-base mb-2 text-[#019267] font-semibold underline"
          >
            {`${data.overview.company_name} (#${data.overview.company_number})`}
          </a>
          <div className="text-sm text-gray-500 mb-1">
            {`${data.overview.registered_office_address.address_line_1}, ${data.overview.registered_office_address.locality}, ${data.overview.registered_office_address.country}`}
          </div>
          <div className="flex flex-col justify-center items-start text-sm">
            <label className="mr-2">Nature of Bussiness: </label>
            {data.overview.sic_codes?.map((code,index) => (
              <div key={index} className=" text-gray-500">
                {nobList[code as keyof object]}
              </div>
            ))}
          </div>
          <div className="flex justify-start items-center text-sm">
            <label className="mr-2">Incorporation Date: </label>
            <div className=" text-gray-500">{data.overview.date_of_creation}</div>
          </div>
          <div className="flex flex-col justify-start items-start text-sm">
            <label className="mr-2 font-semibold text-xs mb-1">
              SIC Codes:{" "}
            </label>
            <div className="flex gap-3">
              {data.overview.sic_codes?.map((code,index) => (
                <div
                  key={index}
                  className="border border-gray-400 text-gray-500 py-[2px] px-2 rounded-3xl"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
          
          {data.filing.length > 0 && (
            <div className="grid grid-cols-3 text-sm text-[#019267] font-semibold mt-1">
              <div className="col-span-1">Type</div>
              <div className="col-span-1">Date</div>
              <div className="col-span-1">Download PDF</div>
            </div>
          )}
          {data.filing.length > 0 &&
            data.filing.map((filing, index) => (
              <div key={index} className="grid grid-cols-3 text-sm my-1">
                <div className="col-span-1">{filing.type}</div>
                <div className="col-span-1">{filing.date}</div>
                <a
                  href={`${import.meta.env.VITE_REQUEST_URL}${
                    filing.links.self
                  }/document?format=pdf&download=0`}
                  target="_blank"
                  rel="noreferrer"
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
