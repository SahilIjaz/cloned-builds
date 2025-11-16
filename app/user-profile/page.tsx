"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Edit2, Save, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface UserProfile {
  username: string;
  email: string;
  image?: string;
  provider?: string;
  createdAt: string;
}

export default function UserProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch profile");
      }

      setProfile(data.user);
      setFormData({
        username: data.user.username,
        email: data.user.email,
        image: data.user.image || "",
      });
      setImagePreview(data.user.image || "");
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // If there's an image file, upload it first
      let imageUrl = formData.image;

      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("image", imageFile);

        const uploadResponse = await fetch("/api/user/upload-image", {
          method: "POST",
          body: formDataImage,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Failed to upload image");
        }

        imageUrl = uploadData.imageUrl;
      }

      // Update profile
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          image: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setProfile(data.user);
      setFormData({
        username: data.user.username,
        email: data.user.email,
        image: data.user.image || "",
      });
      setImagePreview(data.user.image || "");
      setImageFile(null);
      setIsEditing(false);

      // Update the session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.user.username,
          image: data.user.image,
        },
      });

      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || "",
      email: profile?.email || "",
      image: profile?.image || "",
    });
    setImagePreview(profile?.image || "");
    setImageFile(null);
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading || status === "loading") {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#7ED348] mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full flex justify-center items-center min-h-screen bg-slate-950">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center items-center pb-20 pt-20 mt-8 mb-16 bg-slate-950">
      <div className="max-w-[1440px] w-[90%]">
        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between mb-12 md:mb-16 gap-6 md:gap-0">
          <h1 className="bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 inline-block text-transparent bg-clip-text font-bold text-5xl md:text-7xl">
            Profile
          </h1>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#7ED348] hover:bg-[#6BC23A] transition-all text-black font-medium px-6 py-3 rounded-lg flex items-center gap-2 text-base"
            >
              Edit Profile
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="bg-[#1a1f2e] rounded-lg border border-slate-700 p-8 md:p-12">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={150}
                      height={150}
                      className="rounded-full object-cover border-4 border-[#7ED348]"
                    />
                  ) : (
                    <div className="w-[150px] h-[150px] rounded-full bg-[#7ED348] flex items-center justify-center text-black text-5xl font-bold border-4 border-[#7ED348]">
                      {formData.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-0 right-0 bg-[#7ED348] hover:bg-[#6BC23A] text-black p-3 rounded-full cursor-pointer transition-all"
                  >
                    <Camera className="w-5 h-5" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-400 text-sm">
                  Click the camera icon to upload a new profile picture
                </p>
              </div>

              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-white font-medium mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  minLength={3}
                  className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#7ED348]"
                />
              </div>

              {/* Email (Read-only) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-white font-medium mb-2"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-gray-500 cursor-not-allowed"
                />
                <p className="text-gray-500 text-sm mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Provider Info */}
              {profile.provider && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Login Method
                  </label>
                  <div className="px-4 py-3 bg-[#0a0e1a] border border-slate-600 rounded-lg text-gray-400">
                    {profile.provider === "google" ? "Google" : "Email/Password"}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                {profile.image ? (
                  <Image
                    src={profile.image}
                    alt="Profile"
                    width={150}
                    height={150}
                    className="rounded-full object-cover border-4 border-[#7ED348]"
                  />
                ) : (
                  <div className="w-[150px] h-[150px] rounded-full bg-[#7ED348] flex items-center justify-center text-black text-5xl font-bold border-4 border-[#7ED348]">
                    {profile.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Username
                  </label>
                  <p className="text-white text-xl font-semibold">
                    {profile.username}
                  </p>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Email
                  </label>
                  <p className="text-white text-xl">{profile.email}</p>
                </div>

                {profile.provider && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">
                      Login Method
                    </label>
                    <p className="text-white text-xl">
                      {profile.provider === "google"
                        ? "Google"
                        : "Email/Password"}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-gray-400 text-sm mb-1">
                    Member Since
                  </label>
                  <p className="text-white text-xl">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
