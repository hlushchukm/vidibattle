import { useEffect, useState } from "react";
import { AddressFields } from "../../ProfileInterface";
import { env } from "../../../../env";
import axios from "axios";

export default function AddressForm({
  addressData,
  onAddressChange,
  updateAddressAsGroup,
}: {
  addressData: AddressFields;
  onAddressChange: (key: string, value: string) => void;
  updateAddressAsGroup: ({
    country,
    state,
    city,
  }: {
    country: string;
    state: string;
    city: string;
  }) => void;
}) {
  const [oldZipCodeValue, setOldZipCodeValue] = useState("");
  const [zipCodeMathces, setZipCodeMathces] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showMatches, setShowMatches] = useState(false);

  useEffect(() => {
    setOldZipCodeValue(addressData.zip_code);
  }, []);

  useEffect(() => {
    if (addressData.zip_code) {
      const delayTimer = setTimeout(() => {
        fetchAddressData(addressData.zip_code);
      }, 500);

      return () => {
        clearTimeout(delayTimer);
      };
    }
  }, [addressData.zip_code]);

  const onBlur = (e: any) => {
    const val = e.target.value;
    if (addressData.zip_code && val !== oldZipCodeValue) {
      fetchAddressData(val);
    }
  };

  const fetchAddressData = (zip_code: string) => {
    setOldZipCodeValue(zip_code);
    setZipCodeMathces([]);
    setLoadingAddress(true);
    setShowMatches(true);

    const url = `https://thezipcodes.com/api/v1/search?zipCode=${zip_code}&apiKey=${env.VITE_ZIP_CODE_API_KEY}`;
    axios
      .get(url)
      .then((res) => {
        if (res.data?.location?.length > 0) {
          setZipCodeMathces(res.data?.location ?? []);
        } else {
          setZipCodeMathces([]);
        }
        setLoadingAddress(false);
      })
      .catch((e) => {
        console.log(e);
        setLoadingAddress(false);
      });
  };

  const formatAddressToStr = ({
    country,
    state,
    city,
  }: {
    country: string;
    state: string;
    city: string;
  }) => {
    let res = "";

    if (country) {
      res += country;
    }

    if (state) {
      res += ", " + state;
    }

    if (city) {
      res += ", " + city;
    }
    return res.trim();
  };

  return (
    <>
      <div className="mb-3 input-group input-mini">
        {addressData.zip_code && (
          <div className="w-100 small">Zipcode / Pincode:</div>
        )}
        <input
          type="number"
          className="form-control numberInput"
          placeholder="Zipcode / Pincode"
          value={addressData.zip_code}
          onChange={(e) => onAddressChange("zip_code", e.target.value)}
          onBlur={onBlur}
        />
      </div>

      <div className="position-relative">
        {addressData.zip_code && showMatches && (
          <div className="mb-3 input-group input-mini">
            <div className="dropdown w-100 text-left">
              <button
                className="form-select dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ textAlign: "left" }}
                disabled={loadingAddress}
              >
                {loadingAddress ? (
                  <span>Loading ... </span>
                ) : (
                  <span>
                    {zipCodeMathces.length +
                      " " +
                      (zipCodeMathces.length > 1 ? "matches" : "match")}{" "}
                    found for the given zipcode / pincode
                  </span>
                )}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                {zipCodeMathces.map((address: any, i: number) => (
                  <li
                    key={i}
                    onClick={() =>
                      updateAddressAsGroup({
                        country: address.country ?? "",
                        state: address.state ?? "",
                        city: address.city ?? "",
                      })
                    }
                  >
                    <span className="dropdown-item">
                      {formatAddressToStr(address)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="mb-3 input-group input-mini">
          {addressData.country && <div className="w-100 small">Country:</div>}
          <input
            type="text"
            className="form-control numberInput"
            placeholder="Country"
            value={addressData.country}
            onChange={(e) => onAddressChange("country", e.target.value)}
          />
        </div>
        <div className="mb-3 input-group input-mini">
          {addressData.state && <div className="w-100 small">State:</div>}
          <input
            type="text"
            className="form-control numberInput"
            placeholder="State"
            value={addressData.state}
            onChange={(e) => onAddressChange("state", e.target.value)}
          />
        </div>
        <div className="mb-3 input-group input-mini">
          {addressData.city && <div className="w-100 small">City:</div>}
          <input
            type="text"
            className="form-control numberInput"
            placeholder="City"
            value={addressData.city}
            onChange={(e) => onAddressChange("city", e.target.value)}
          />
        </div>
        <div className="mb-3 input-group input-mini">
          {addressData.address_line && (
            <div className="w-100 small">Address Line:</div>
          )}
          <input
            type="text"
            className="form-control numberInput"
            placeholder="Address Line"
            value={addressData.address_line}
            onChange={(e) => onAddressChange("address_line", e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
