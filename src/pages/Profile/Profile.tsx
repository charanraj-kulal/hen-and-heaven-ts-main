import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Adjust this import based on your Firebase config file location
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import { useUser } from "../../hooks/UserContext"; // Adjust the import path as needed
import { Link } from "react-router-dom";

const Profile = () => {
  const { userData } = useUser();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    createdAt: "",
    isVerified: false,
    profileUrl: "",
    status: "",
    userRole: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userData?.uid) {
        try {
          const userDocRef = doc(db, "users", userData.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setProfile({
              fullName: userData.fullName || "",
              email: userData.email || "",
              phoneNumber: userData.phoneNumber || "",
              createdAt: userData.createdAt || "",
              isVerified: userData.isVerified || false,
              profileUrl: userData.profileUrl || "",
              status: userData.status || "",
              userRole: userData.userRole || "",
            });
          } else {
            setError("User profile not found");
          }
        } catch (err) {
          setError("Error fetching user profile");
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Profile" />

        <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="relative z-20 h-35 md:h-65">
            <img
              src={"/images/cover/cover-01.png"}
              alt="profile cover"
              className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
            />
          </div>
          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 h-30 w-30 max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
              <img
                src={profile.profileUrl || "/images/user/user-default.png"}
                alt="profile"
                className="rounded-full"
              />
            </div>
            <div className="mt-4">
              <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
                {profile.fullName}
              </h3>
              <p className="font-medium">{profile.userRole}</p>
              <div className="mx-auto mt-4.5 mb-5.5 grid max-w-94 grid-cols-3 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {profile.isVerified ? "Verified" : "Unverified"}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {profile.status}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 px-4 xsm:flex-row">
                  <span className="font-semibold text-black dark:text-white">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mx-auto max-w-180">
                <h4 className="font-semibold text-black dark:text-white">
                  Contact Information
                </h4>
                <p className="mt-4.5">
                  Email: {profile.email}
                  <br />
                  Phone: {profile.phoneNumber}
                </p>
              </div>

              <div className="mt-6.5">
                <Link
                  to="/dashboard/settings"
                  className="inline-flex items-center justify-center rounded-full bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
