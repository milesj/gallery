import { env } from '~/env/runtime';
// eslint-disable-next-line no-restricted-imports
import {
  fetchSanityContent as _fetchSanityContent,
  useSanityMaintenanceCheck as _useSanityMaintenanceCheck,
} from '~/shared/utils/sanity';

export const fetchSanityContent = _fetchSanityContent(env.SANITY_PROJECT_ID);

// NOTE: this is deprecated and should use shared/MaintenanceStatusContext instead
export const useSanityMaintenanceCheck = () => {
  return _useSanityMaintenanceCheck(env.SANITY_PROJECT_ID);
};
