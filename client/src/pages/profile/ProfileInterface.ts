export interface Profile {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_no: string;
  bio: string;
  address: AddressFields;
  social_links: SocialLinks;
  interested_to_earn: boolean;
}

export interface AddressFields {
  country: string;
  state: string;
  city: string;
  address_line: string;
  zip_code: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  snapchat: string;
  whatsapp: string;
}

export const emptyProfileData: Profile = {
  first_name: "",
  last_name: "",
  email: "",
  username: "",
  contact_no: "",
  bio: "",
  address: {
    country: "",
    state: "",
    city: "",
    address_line: "",
    zip_code: "",
  },
  social_links: {
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    snapchat: "",
    whatsapp: "",
  },
  interested_to_earn: false,
};
