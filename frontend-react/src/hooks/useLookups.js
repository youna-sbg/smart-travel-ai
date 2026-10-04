import { useState, useEffect } from "react";
import { fetchCities, fetchCategories } from "../api/client";

function useLookups() {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCities().then(setCities).catch(console.error);
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  return { cities, categories };
}

export default useLookups;
