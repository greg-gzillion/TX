import { usaSpecs, getUsSpecsByMetal, getUsCategorizedByMetal } from './usa';

export const countrySpecs = {
  USA: usaSpecs,
};

export const getSpecsByCountryAndMetal = (country: string, metal: string) => {
  switch(country) {
    case 'USA':
      return getUsSpecsByMetal(metal);
    default:
      return [];
  }
};

export const getCategorizedByCountryAndMetal = (country: string, metal: string) => {
  switch(country) {
    case 'USA':
      return getUsCategorizedByMetal(metal);
    default:
      return {};
  }
};
