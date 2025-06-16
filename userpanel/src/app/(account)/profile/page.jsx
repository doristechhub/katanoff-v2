"use client";
import { fetchUserProfile, updateUserProfile } from "@/_actions/user.action";
import { helperFunctions } from "@/_helper";
import { Pencil, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "@/assets/images/profile/profile.webp";
import { CustomImg } from "@/components/dynamiComponents";
export default function ProfilePage() {
  const dispatch = useDispatch();
  const { isLoading, userProfile } = useSelector(({ user }) => user);

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const userData = helperFunctions?.getCurrentUser();
    if (userData) {
      dispatch(fetchUserProfile(userData.id));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
      setEmail(userProfile.email || "");
    }
  }, [userProfile]);

  // const handleSave = async () => {
  //   const updatedData = {
  //     firstName: firstName.trim(),
  //     lastName: lastName.trim(),
  //   };
  //   console.log("updatedData", updatedData);
  //   const userData = helperFunctions?.getCurrentUser();
  //   const payload = {
  //     userId: userData.id,
  //     firstName: updatedData.firstName,
  //     lastName: updatedData.lastName,
  //   };
  //   if (userData) {
  //     await dispatch(updateUserProfile(payload));
  //     setEditMode(false);
  //   }
  // };

  const handleSave = async () => {
    const updatedData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };
    const userData = helperFunctions?.getCurrentUser();

    if (userData) {
      const payload = {
        userId: userData.id,
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
      };
      await dispatch(updateUserProfile(payload));
      await dispatch(fetchUserProfile(userData.id));

      setEditMode(false);
    }
  };

  const handleCancel = () => {
    setFirstName(userProfile?.firstName || "");
    setLastName(userProfile?.lastName || "");
    setEditMode(false);
  };

  return (
    <>
      {/* Hero Image */}
      <div className="relative w-full h-[50vh]">
        <CustomImg
          srcAttr={profile}
          altAttr="Profile Background"
          fill
          className="object-cover object-center"
        />

        {/* Profile Card */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[85%] w-full max-w-3xl">
          <div
            className={`bg-white md:rounded-lg shadow-md px-6 pt-12 pb-10 lg:pb-12 xl:pb-20`}
          >
            <h2 className="text-center text-2xl 3xl:text-3xl text-baseblack font-castoro">
              Profile
            </h2>
            <div className="px-6 lg:px-10 pt-6">
              {/* Name Section */}
              <div className="flex justify-between items-start">
                <div className="w-full">
                  <label className="font-medium text-base text-baseblack block mb-1">
                    Name
                  </label>
                  {editMode ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        className="border px-3 py-2 rounded w-full sm:w-1/2 text-base"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                      <input
                        type="text"
                        className="border px-3 py-2 rounded w-full sm:w-1/2 text-base"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="flex gap-3 justify-between  border border-grayborder rounded-md p-3">
                      <p className="text-base ">
                        {userProfile?.firstName} {userProfile?.lastName}
                      </p>
                      {!editMode && (
                        <button
                          className="text-primary hover:underline flex items-center gap-1"
                          onClick={() => setEditMode(true)}
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Email Section */}
              <div className="pt-6">
                <label className="font-medium text-base text-baseblack block mb-1">
                  Email
                </label>
                <div className="flex gap-3 justify-between  border border-grayborder rounded-md p-3">
                  <p className="text-base text-gray-700">
                    {userProfile?.email}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {editMode && (
                <div className="flex gap-4 pt-6 lg:pt-10 z-20">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2  bg-primary border text-white px-4 py-2 rounded hover:bg-primary/90"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 border border-gray-400 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extra space below the profile card to push rest of the content down */}
      <div
        className={`${
          editMode ? "h-[50vh] md:h-[45vh] xl:h-[50vh]" : "h-[40vh]"
        }`}
      />
    </>
  );
}
