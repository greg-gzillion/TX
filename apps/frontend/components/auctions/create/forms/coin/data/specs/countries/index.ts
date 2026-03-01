import { usaSpecs, getUsSpecsByMetal, getUsCategorizedByMetal } from './usa';
// import { canadaSpecs } from './canada';
// import { ukSpecs } from './uk';
// import { russiaSpecs } from './russia';

export const countrySpecs = {
  USA: usaSpecs,
  // Canada: canadaSpecs,
  // UK: ukSpecs,
  // Russia: russiaSpecs,
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
