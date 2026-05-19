import { UserDocument } from "./firestore";

export const isAdmin = (userProfile: UserDocument | null): boolean => {
  if (!userProfile) return false;
  return userProfile.role === "admin" && userProfile.email === "simplydivyanshk@gmail.com";
};
