import { toggleValues } from 'platform/site-wide/feature-toggles/selectors';
import FEATURE_FLAG_NAMES from 'platform/utilities/feature-toggles/featureFlagNames';

export const selectShowQuestionnaire = state =>
  toggleValues(state)[FEATURE_FLAG_NAMES.showHealthcareExperienceQuestionnaire];

export const selectLoadingFeatureFlags = state =>
  state?.featureToggles?.loading;
