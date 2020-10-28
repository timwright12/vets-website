export const vetFields = {
  address: 'veteranAddress',
  alternativePhoneNumber: 'veteranAlternativePhoneNumber',
  dateOfBirth: 'veteranDateOfBirth',
  email: 'veteranEmail',
  facilityType: 'veteranFacilityType',
  fullName: 'veteranFullName',
  gender: 'veteranGender',
  plannedClinic: 'plannedClinic',
  preferredFacilityInfoView: 'view:preferredFacilityInfo',
  preferredFacilityStateView: 'veteranFacilityState',
  preferredFacilityView: 'veteranPreferredFacility',
  previousTreatmentFacility: 'veteranLastTreatmentFacility',
  primaryPhoneNumber: 'veteranPrimaryPhoneNumber',
  ssn: 'veteranSsnOrTin',
  verifyEmail: 'view:veteranEmail',
};

export const primaryCaregiverFields = {
  address: 'primaryAddress',
  alternativePhoneNumber: 'primaryAlternativePhoneNumber',
  dateOfBirth: 'primaryDateOfBirth',
  email: 'primaryEmail',
  fullName: 'primaryFullName',
  gender: 'primaryGender',
  hasSecondaryCaregiverOneView: 'view:hasSecondaryCaregiverOne',
  primaryPhoneNumber: 'primaryPrimaryPhoneNumber',
  ssn: 'primarySsnOrTin',
  verifyEmail: 'view:primaryEmail',
  vetRelationship: 'primaryVetRelationship',
  hasHealthInsurance: 'primaryHasHealthInsurance',
};

export const secondaryCaregiverFields = {
  secondaryOne: {
    address: 'secondaryOneAddress',
    alternativePhoneNumber: 'secondaryOneAlternativePhoneNumber',
    dateOfBirth: 'secondaryOneDateOfBirth',
    email: 'secondaryOneEmail',
    fullName: 'secondaryOneFullName',
    gender: 'secondaryOneGender',
    hasSecondaryCaregiverTwoView: 'view:hasSecondaryCaregiverTwo',
    primaryPhoneNumber: 'secondaryOnePrimaryPhoneNumber',
    ssn: 'secondaryOneSsnOrTin',
    verifyEmail: 'view:secondaryOneEmail',
    vetRelationship: 'secondaryOneVetRelationship',
  },
  secondaryTwo: {
    address: 'secondaryTwoAddress',
    alternativePhoneNumber: 'secondaryTwoAlternativePhoneNumber',
    dateOfBirth: 'secondaryTwoDateOfBirth',
    email: 'secondaryTwoEmail',
    fullName: 'secondaryTwoFullName',
    gender: 'secondaryTwoGender',
    primaryPhoneNumber: 'secondaryTwoPrimaryPhoneNumber',
    ssn: 'secondaryTwoSsnOrTin',
    verifyEmail: 'view:secondaryTwoEmail',
    vetRelationship: 'secondaryTwoVetRelationship',
  },
};

export const reviewPageLabels = {
  veteranLabel: `Veteran\u2019s`,
  primaryLabel: `Primary Family Caregiver applicant\u2019s`,
  secondaryOneLabel: `Secondary Family Caregiver applicant\u2019s`,
  secondaryTwoLabel: `Secondary Family Caregiver (2) applicant\u2019s`,
};
