"use client";
import { fetchUserProfile, updateUserProfile } from "@/_actions/user.action";
import { helperFunctions } from "@/_helper";
import { Pencil, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import profile from "@/assets/images/profile/profile.webp";
import { CustomImg } from "@/components/dynamiComponents";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "@/components/ui/ErrorMessage";
import SkeletonLoader from "./skeletonLoader";
export default function ProfileDetailPage() {
  const dispatch = useDispatch();
  const { userProfile, userProfileMessage, userLoading } = useSelector(
    ({ user }) => user
  );
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    const userData = helperFunctions?.getCurrentUser();
    if (userData) {
      dispatch(fetchUserProfile(userData.id));
    }
  }, [dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userProfile?.firstName || "",
      lastName: userProfile?.lastName || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().trim().required("First name is required"),
      lastName: Yup.string().trim().required("Last name is required"),
    }),
    onSubmit: async (values) => {
      const userData = helperFunctions?.getCurrentUser();
      if (userData) {
        const payload = {
          userId: userData.id,
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
        };
        await dispatch(updateUserProfile(payload));
        await dispatch(fetchUserProfile(userData.id));
        setEditMode(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    setEditMode(false);
  };

  return (
    <>
      <div className="relative w-full h-[50vh]">
        <CustomImg
          srcAttr={profile}
          altAttr="Profile Background"
          fill
          className="object-cover object-center"
        />
        {userLoading ? (
          <UserPofileSkeleton />
        ) : (
          <>
            <div className="absolute left-1/2 -translate-x-1/2 top-[85%] w-full max-w-3xl">
              <div
                className={`bg-white md:rounded-lg shadow-md px-6 pt-12 pb-10 lg:pb-12 xl:pb-20`}
              >
                <h2 className="text-center text-2xl 3xl:text-3xl text-baseblack font-castoro">
                  Profile
                </h2>
                <div className="px-6 lg:px-10 pt-6">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="flex justify-between items-start">
                      <div className="w-full">
                        <label className="font-medium text-base text-baseblack block mb-1">
                          Name
                        </label>
                        {editMode ? (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <div className="w-full sm:w-1/2">
                              <input
                                type="text"
                                name="firstName"
                                className="border px-3 py-2 rounded w-full text-base"
                                placeholder="First Name"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.firstName &&
                                formik.errors.firstName && (
                                  <ErrorMessage
                                    message={formik.errors.firstName}
                                  />
                                )}
                            </div>
                            <div className="w-full sm:w-1/2">
                              <input
                                type="text"
                                name="lastName"
                                className="border px-3 py-2 rounded w-full text-base"
                                placeholder="Last Name"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                              {formik.touched.lastName &&
                                formik.errors.lastName && (
                                  <ErrorMessage
                                    message={formik.errors.lastName}
                                  />
                                )}
                            </div>
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
                          type="submit"
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
                  </form>
                  {userProfileMessage?.message && (
                    <div className="mt-4">
                      <ErrorMessage message={userProfileMessage?.message} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div
        className={`${
          editMode ? "h-[50vh] md:h-[45vh] xl:h-[50vh]" : "h-[40vh]"
        }`}
      />
    </>
  );
}

const UserPofileSkeleton = () => {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-[85%] w-full max-w-3xl">
      <div
        className={`bg-white md:rounded-lg shadow-md px-6 pt-12 pb-10 lg:pb-12 xl:pb-20`}
      >
        <h2 className="text-center text-2xl 3xl:text-3xl text-baseblack font-castoro">
          Profile
        </h2>
        <div className="flex flex-col gap-6 pt-6">
          <SkeletonLoader height="h-[50px]" />
          <SkeletonLoader height="h-[50px]" />

          <SkeletonLoader height="h-[50px]" />
        </div>
      </div>
    </div>
  );
};
