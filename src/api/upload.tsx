import { KYC_UPLOAD_IMAGE } from "@/utils/constants";


export const uploadDocument = async (file: File, type: string) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("type", type);

  const token = localStorage.getItem("token");

  const res = await fetch(
    KYC_UPLOAD_IMAGE,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Upload failed");
  }

  return res.json(); 
};
