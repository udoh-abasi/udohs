import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import {
  CountryAndStateForEditProps,
  selectOptions,
  theServerResponse,
} from "./tsInterface";
import { backendURL } from "./axiosSetup";

const CountryAndStateForEdit: React.FC<CountryAndStateForEditProps> = ({
  setParentCountry,
  setParentState,
  productData,
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

  // These useRefs checks when we have gotten the country/state from the backend, and set it to their respective <select>
  const gottenCountry = useRef(false);
  const gottenState = useRef(false);

  // On page load, this will get the initial country that the user set, and then show it on the country field
  useEffect(() => {
    // This function returns the right option, which has the value and the label.
    // An example of it return value is { value: 'NG', label: 'Nigeria' }
    const getCountry = () => {
      return countryOptions.find(
        (theValue) => theValue.label === productData.country
      );
    };

    if (
      !gottenCountry.current && // Check if we have not already set the country's data
      productData && // Check if we have the data of the product the user wants to edit
      productData._id &&
      countryOptions.length // Check if we have the country's options
    ) {
      // Get country option. This will return undefined if no result was found
      const theCountryOption = getCountry();

      if (theCountryOption) {
        // Here, we set the country's code. This will make the request for the state options to be sent
        setCountryCode(theCountryOption.value as string);

        // Setting this will make the right country show on country's <select> field. For e.g, if we had {value: 'NG', label: 'Nigeria'}, then 'Nigeria' will show on the <select> field for 'country' (on the browser)
        setCountryValue(theCountryOption); // NOTE: For this to work, we set the 'countryValue' to 'option' and not 'option.label'

        // This sets the value in the parent
        setParentCountry(theCountryOption.label as string);
      }

      // Set this to true, so that this useEffect will not run again
      gottenCountry.current = true;
    }
  }, [countryOptions, productData, setParentCountry]);

  // On page load, this will get the initial state that the user set, and then show it on the state field
  useEffect(() => {
    // This function returns the right option, which has the value and the label.
    // An example of it return value is {value: 'LA', label: 'Lagos'}
    const getState = () => {
      return stateOptions.find(
        (theValue) => theValue.label === productData.state
      );
    };

    if (
      !gottenState.current && // Check if we have not already set the state's data
      productData && // Check if we have the data of the product the user wants to edit
      productData._id &&
      stateOptions.length // Check if we have the states's options
    ) {
      const theState = getState();
      if (theState) {
        // Setting this will make the right state name to show on state's <select> field. For e.g, if we had {value: 'LA', label: 'Lagos'}, then 'Lagos' will show on the <select> field for 'state' (on the browser)
        setStateValue(theState);

        // This sets the value in the parent
        setParentState(theState.label as string);
      }

      // Set this to true, so that this useEffect will not run again
      gottenState.current = true;
    }
  }, [stateOptions, productData, setParentState]);

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
export default CountryAndStateForEdit;
