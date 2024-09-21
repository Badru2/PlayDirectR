import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
registerPlugin(FilePondPluginImagePreview);

import Toast from "../../components/themes/alert";

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Error state
  const [files, setFiles] = useState([]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("/api/auth/profile/" + user.id);
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", profile.username);
    formData.append("email", profile.email);
    formData.append("address", profile.address);

    if (profile.avatar) {
      formData.append("avatar", profile.avatar);
    }

    try {
      const response = await axios.put("/api/auth/update/" + user.id, formData);
      setProfile(response.data);

      Toast.fire({
        icon: "success",
        title: "Profile updated successfully",
      });

      console.log("Profile updated successfully:", response.data);
      fetchProfile();
      setError(null); // Clear error on success
    } catch (error) {
      console.error("Error updating profile:", error);

      Toast.fire({
        icon: "error",
        title: "Failed to update profile",
      });
      setError("Failed to update profile.");
    }
  };

  const handleFileChange = (fileItems) => {
    setFiles(fileItems.map((fileItem) => fileItem.file)); // store files in state
    if (fileItems[0]?.file) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        avatar: fileItems[0].file,
      }));
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="">
      {loading ? (
        <div className="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className=" bg-gray-400 animate-pulse flex flex-col items-center justify-center py-4 px-3 space-y-3">
              <div className="w-60 h-60 bg-gray-500 rounded-full " />

              <div className="self-start w-1/3 h-4 bg-gray-500 rounded" />
              <div className="self-start w-1/2 h-4 bg-gray-500 rounded" />
              <div className="self-start w-1/5 h-4 bg-gray-500 rounded" />
              <div className="self-start w-4/5 h-4 bg-gray-500 rounded" />
              <div className="self-start w-4/5 h-4 bg-gray-500 rounded" />
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="bg-gray-400 animate-pulse flex flex-col p-4 space-y-4">
              <div className="w-1/4 h-4 bg-gray-500 rounded" />

              <div className="space-y-3">
                <div className="w-1/6 h-4 bg-gray-500 rounded" />
                <div className="w-full h-8 bg-gray-500 rounded" />
              </div>

              <div className="space-y-3">
                <div className="w-1/6 h-4 bg-gray-500 rounded" />
                <div className="w-full h-8 bg-gray-500 rounded" />
              </div>

              <div className="space-y-3">
                <div className="w-1/6 h-4 bg-gray-500 rounded" />
                <div className="w-full h-12 bg-gray-500 rounded" />
              </div>

              <div className="space-y-3">
                <div className="w-1/6 h-4 bg-gray-500 rounded" />
                <div className="w-full h-16 bg-gray-500 rounded" />
              </div>

              <div className="space-y-3">
                <div className="w-1/6 h-12 bg-gray-500 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row lg:space-x-3 space-y-3 lg:space-y-0">
          <div className="w-full lg:w-1/3">
            <div className="flex flex-col space-y-4 bg-white p-4 shadow-md mx-3 lg:mx-0">
              <img
                src={
                  profile?.avatar instanceof File
                    ? URL.createObjectURL(profile.avatar) // for the new file preview
                    : profile?.avatar
                    ? `/public/images/avatars/${profile?.avatar}` // for existing avatar from server
                    : `https://ui-avatars.com/api/?name=${profile?.username}` ||
                      `https://ui-avatars.com/api/?name=Anonymous`
                }
                alt={profile?.username}
                className="w-60 h-60 rounded-full object-cover self-center"
              />

              <div className="space-y-2">
                <div>
                  Name: <b>{profile?.username}</b>
                </div>
                <div>
                  Email: <b>{profile?.email}</b>
                </div>
                <div>
                  Address: <div>{profile?.address}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/3">
            <div className="bg-white shadow-md py-3 mx-3 lg:mx-0">
              <div className="p-4">
                <h1 className="text-3xl font-bold">Edit User Profile :</h1>
                <hr className="my-2" />

                <form onSubmit={updateProfile}>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="username"
                      type="text"
                      placeholder="Username"
                      value={profile?.username || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, username: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={profile?.email || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="address"
                    >
                      Address
                    </label>

                    <textarea
                      name="address"
                      id=""
                      value={profile?.address || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    ></textarea>
                  </div>
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="avatar"
                    >
                      Avatar
                    </label>
                    <FilePond
                      files={files}
                      allowMultiple={false}
                      onupdatefiles={handleFileChange}
                      acceptedFileTypes={["image/*"]}
                      credits={false}
                      labelIdle='Drag & Drop your avatar or <span class="filepond--label-action">Browse</span>'
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs">{error}</p>}{" "}
                  {/* Error display */}
                  <div className="flex items-center justify-between">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
