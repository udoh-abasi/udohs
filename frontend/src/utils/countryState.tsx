import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
  CountryAndStateProps,
  selectOptions,
  theServerResponse,
} from "./tsInterface";
import { backendURL } from "./axiosSetup";

const CountryAndState: React.FC<CountryAndStateProps> = ({
  setParentCountry,
  setParentState,
}) => {
  // Set the state and country values
  const [countryValue, setCountryValue] = useState<selectOptions | "">("");
  const [stateValue, setStateValue] = useState<selectOptions | "">("");

  // Use this to set up when the options are loading from the server
  const [countryIsLoading, setCountryIsLoading] = useState(false);
  const [stateIsLoading, setStateIsLoading] = useState(false);

  // These are the country codes we will send as query parameters to the backend
  const [countryCode, setCountryCode] = useState("");

  // These are the states where the results from the fetch() will be stored
  const [state, setState] = useState<theServerResponse[] | []>([]);
  const [country, setCountry] = useState<theServerResponse[] | []>([]);

  // Set up the options to be used in the 'Select'
  const [countryOptions, setCountryOptions] = useState<selectOptions[] | []>(
    []
  );

  const [stateOptions, setStateOptions] = useState<selectOptions[] | []>([]);

  // Set up the URL where requests will be sent to
  const getCountryURL = `${backendURL}/api/getCountryStateCities/country`;
  const getStateURL = `${backendURL}/api/getCountryStateCities/getStateByCountry/${countryCode}`;

  // This is the fetch() function, we will use to send all two requests (for country and state)
  const fetchData = async (
    theURL: string,
    onSetData: (data: theServerResponse[]) => void,
    onSetIsLoading: (loadingState: boolean) => void
  ) => {
    onSetIsLoading(true);
    onSetData([]);
    try {
      const response = await fetch(theURL);
      if (response.ok) {
        const data = await response.json();

        onSetData(data.data);
        onSetIsLoading(false);
      } else {
        onSetIsLoading(false);
        console.log("There was an error");
      }
    } catch (error) {
      onSetIsLoading(false);
      console.log(error);
    }
  };

  // On first load, this will run, and send a request to get all the countries in the world, and populate the select field
  useEffect(() => {
    fetchData(getCountryURL, setCountry, setCountryIsLoading);
  }, [getCountryURL]);

  // When we get the country data, these useEffect will run and populate the <options> of the country's <Select />
  useEffect(() => {
    const thecountryOption: selectOptions[] = country.map((eachCountry) => ({
      value: eachCountry.iso2,
      label: eachCountry.name,
    }));

    setCountryOptions(thecountryOption); // Set the country options to be used in the Country's select
  }, [country]);

  // Send the state Request
  useEffect(() => {
    // Since this useEffect will run on first load, we want to make sure that it is only when we have a country code that it will send the request
    if (countryCode) {
      fetchData(getStateURL, setState, setStateIsLoading);
    }
  }, [getStateURL, countryCode]);

  // When a country is selected in the dropdown, run this function to populate the state's <select> field
  useEffect(() => {
    const onChangeCountry = () => {
      setStateValue("");
      const theStateOption = state.map((eachState) => ({
        value: eachState.iso2,
        label: eachState.name,
      }));

      setStateOptions(theStateOption);
    };

    if (countryCode) {
      onChangeCountry();
    }
  }, [countryCode, state]);

  return (
    <>
      <div className="text-black mb-4">
        <Select
          id="selectboxForCountry" // This was added to get rid of the error that says 'Prop `id` did not match'
          instanceId="selectboxForCountry" // This also was added to get rid of the error that says 'Prop `id` did not match'
          options={countryOptions}
          required
          isSearchable
          value={countryValue}
          onChange={(option) => {
            // NOTE: I used this if-else block to avoid TS errors, which does not allow accessing 'option.label', as 'option' may be null
            if (option) {
              setCountryCode(option.value as string);
              setCountryValue(option); // NOTE: For this to work, we set the 'countryValue' to 'option' and not 'option.label'
              setParentCountry(option.label as string);
            } else {
              setCountryCode("");
              setCountryValue("");
              setParentCountry("");
            }
          }}
          placeholder="Select Country..."
          isLoading={countryIsLoading}
          loadingMessage={() => "Loading..."}
        />
      </div>

      <div className="text-black mb-4">
        <Select
          id="selectboxForState"
          instanceId="selectboxForState"
          options={stateOptions}
          required
          isSearchable
          value={stateValue}
          onChange={(option) => {
            if (option) {
              setStateValue(option);
              setParentState(option.label as string);
            } else {
              setStateValue("");
              setParentState("");
            }
          }}
          placeholder="Select State..."
          isDisabled={!countryCode}
          isLoading={stateIsLoading}
          loadingMessage={() => "Loading..."}
        />
      </div>
    </>
  );
};
export default CountryAndState;
